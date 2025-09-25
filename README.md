# RAG Analytics App

This is a Next.js application that provides a chat-based analytics experience similar to ThoughtSpot. Users can upload Excel files, run natural-language queries to generate SQL, visualize results, and export data.

## Features

- Upload Excel files to Supabase Storage and register datasets.
- Dynamic ingestion of datasets and versioning.
- API endpoints for natural-language to SQL translation (`/api/nl2sql`), SQL execution (`/api/execute`), and file ingestion (`/api/ingest`).
- Simple UI for uploading data and viewing responses.

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/JESoria/rag-analytics-app.git
   cd rag-analytics-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   SUPABASE_URL=YOUR_SUPABASE_URL
   SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
   ```
   Replace these with your Supabase project's URL and API keys.

4. Run the development server:
   ```bash
   npm run dev
   ```
   The app will be available at http://localhost:3000.

## Usage

1. Open the app in your browser and upload an Excel file on the home page. The server will process the file and create dataset entries in Supabase.
2. TODO: Add chat interface for natural-language queries.

## Deployment

This project is designed to be deployed to Vercel. After setting up a project, configure the environment variables in Vercel using the same names as `.env.local`.

## License

MIT
