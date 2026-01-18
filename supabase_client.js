// Supabase client initialization
// Read config from meta tags or environment (for local dev we'll use meta tags for simplicity in static HTML)
const supabaseUrl = document.querySelector('meta[name="supabase-url"]').content;
const supabaseKey = document.querySelector('meta[name="supabase-key"]').content;

const client = supabase.createClient(supabaseUrl, supabaseKey);
window.supabaseClient = client;
