import formidable from 'formidable';
import fs from 'fs/promises';
import { read, utils } from 'xlsx';
import { createClient } from '@supabase/supabase-js';

// Disable Next.js body parsing so we can process multipart form data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Initialize a Supabase client using the service role key. The service role
// should only be used on the server – never expose it to the browser.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Handles uploading an Excel file, parsing its first sheet and inserting
 * metadata into Supabase. The uploaded file is stored in the `uploads`
 * bucket, a new record is created in the `dataset` table, and a
 * corresponding record is created in `dataset_version`. This endpoint does
 * not yet create a dynamic table or insert row-level data.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const form = formidable({ multiples: false });
  let fields, files;
  try {
    [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });
  } catch (e) {
    console.error('Failed to parse form', e);
    return res.status(400).json({ error: 'Failed to parse form data' });
  }
  const file = files?.file;
  if (!file) {
    return res.status(400).json({ error: 'Missing file' });
  }
  try {
    // Read file into buffer
    const buffer = await fs.readFile(file.filepath);
    // Upload to Supabase Storage
    const uploadPath = `${Date.now()}-${file.originalFilename}`;
    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(uploadPath, buffer);
    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw uploadError;
    }
    // Parse Excel workbook
    const workbook = read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = utils.sheet_to_json(worksheet, { defval: null });
    // Insert dataset record
    const { data: datasetRows, error: datasetErr } = await supabase
      .from('dataset')
      .insert({ name: sheetName })
      .select()
      .limit(1);
    if (datasetErr) {
      console.error('Dataset insert error:', datasetErr);
      throw datasetErr;
    }
    const datasetId = datasetRows?.[0]?.id;
    // Insert dataset version record
    const { error: versionErr } = await supabase.from('dataset_version').insert({
      dataset_id: datasetId,
      storage_path: uploadPath,
      sheet_name: sheetName,
      schema_json: JSON.stringify(Object.keys(jsonData[0] || {})),
      row_count: jsonData.length,
      is_active: true,
    });
    if (versionErr) {
      console.error('Version insert error:', versionErr);
      throw versionErr;
    }
    // Return summary
    return res.status(200).json({ datasetId, sheetName, rowCount: jsonData.length });
  } catch (e) {
    console.error('Ingest error:', e);
    return res.status(500).json({ error: 'Failed to ingest dataset' });
  }
}
