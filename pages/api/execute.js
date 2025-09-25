import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service role key for server‑side operations.
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Executes a SQL SELECT statement against the database.
 *
 * Expects a JSON body with a `sql` property. Rejects non‑SELECT statements
 * and applies a default LIMIT if none is provided. To actually run the
 * query you must implement a Postgres function (see README) and call
 * it via supabase.rpc().
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { sql } = req.body || {};
  if (!sql || typeof sql !== 'string') {
    return res.status(400).json({ error: 'SQL is required' });
  }
  const normalized = sql.trim().toLowerCase();
  if (!normalized.startsWith('select')) {
    return res.status(400).json({ error: 'Only SELECT statements are allowed' });
  }
  // Add LIMIT if missing to avoid huge results
  let safeSql = sql;
  if (!/\blimit\b/i.test(sql)) {
    safeSql = `${sql} limit 100`;
  }
  try {
    // The Supabase client does not allow running arbitrary SQL directly. To
    // enable this endpoint you need to create a Postgres function
    // (e.g. execute_sql) that executes dynamic SQL and returns the result as JSON.
    // Then call it via supabase.rpc() like so:
    // const { data, error } = await supabase.rpc('execute_sql', { query: safeSql });
    return res.status(501).json({ error: 'Not implemented' });
  } catch (e) {
    console.error('Execute error:', e);
    return res.status(500).json({ error: 'Failed to execute SQL' });
  }
}
