import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client for public operations and OAuth initiation
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side trusted operations (bypassing RLS)
export const getServiceSupabase = () => {
    return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || '', {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
};
