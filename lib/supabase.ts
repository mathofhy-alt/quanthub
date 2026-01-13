
import { createClient } from '@supabase/supabase-js';

// Fallback to empty string to prevent build crashes if env vars are missing
// (Though they MUST be present for actual functionality)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client for public read operations
export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Client for server-side admin operations (Cron jobs, Seed)
// ONLY use this in server contexts (API Routes, Scripts)
export const getServiceSupabase = () => {
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!SERVICE_KEY || !SUPABASE_URL) {
        // Return a dummy client or throw warning instead of crashing build
        console.warn('Missing Supabase keys - Service operations will fail');
        // If we strictly throw here, build fails. 
        // For now, let's try to grab what we can or throw only at runtime invocation.
        if (!SERVICE_KEY) throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
    }
    return createClient(SUPABASE_URL, SERVICE_KEY!);
};
