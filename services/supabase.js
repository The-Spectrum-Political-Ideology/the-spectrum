// services/supabase.js

// -----------------------------------------------------------------
// TODO: Add your Supabase URL and Anon Key here
// -----------------------------------------------------------------
const SUPABASE_URL = 'YOUR_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';
// -----------------------------------------------------------------

let client;
try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error("Supabase URL and Anon Key are required. Please update services/supabase.js");
    }
    client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
    console.error("Supabase client failed to initialize.", e.message);
    alert(`Error: Could not connect to the backend. ${e.message}`);
}

export const supabase = client;