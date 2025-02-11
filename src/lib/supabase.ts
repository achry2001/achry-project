
import { createClient } from '@supabase/supabase-js';

// These values will be replaced by your Supabase project settings
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);
