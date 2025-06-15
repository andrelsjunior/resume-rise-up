
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yoghxpsfcswlvzvfkhbk.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if we have real Supabase credentials
const hasValidCredentials = 
  supabaseUrl && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('placeholder');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a flag to check if Supabase is properly configured
export const isSupabaseConfigured = hasValidCredentials;

// Console warning if not configured
if (!hasValidCredentials) {
  console.warn('⚠️ Supabase not configured. Please set VITE_SUPABASE_ANON_KEY environment variable.');
}
