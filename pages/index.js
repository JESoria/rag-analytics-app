import { useState } from 'react';

/**
 * Minimal home page demonstrating dataset ingestion via file upload. This page
 * allows users to select an Excel workbook, upload it to the `/api/ingest`
 * endpoint, and displays a message about the ingestion result.
 */
export default function Home() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };
  const handleSubmit = async () => {
    if (!file) {
      setMessage('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/ingest', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`Ingested dataset ${data.sheetName} with ${data.rowCount} rows.`);
      } else {
        setMessage(data.error || 'Failed to ingest');
      }
    } catch (err) {
      console.error(err);
      setMessage('Error uploading file');
    }
  };
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Dataset Ingestion</h1>
      <p>Select an Excel (.xls or .xlsx) file to upload. Only the first sheet will be used.</p>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileChange} />
      <button onClick={handleSubmit} style={{ marginLeft: '1rem' }}>Upload</button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </main>
  );
}
