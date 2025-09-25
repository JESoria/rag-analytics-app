import { createClient } from '@supabase/supabase-js';

// This module initializes a client-side Supabase instance. When loaded in
// the browser, it uses the `NEXT_PUBLIC_SUPABASE_URL` and
// `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variables to construct a
// Supabase client with the public anon key. On the server side you should
// create a new client with the service role key as needed.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
