/**
 * Placeholder endpoint for natural‑language to SQL conversion.
 *
 * In a full implementation this endpoint would send the user's prompt and
 * dataset context to a language model with structured output capabilities.
 * For now it simply responds with a 501 Not Implemented status.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(501).json({ error: 'Not implemented' });
}
