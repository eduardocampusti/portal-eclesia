
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return url !== 'YOUR_SUPABASE_URL';
    } catch {
        return false;
    }
};

if (!supabaseUrl || !supabaseAnonKey || !isValidUrl(supabaseUrl)) {
    console.warn('Supabase credentials missing or invalid. Check your Vercel Environment Variables.');
    console.log('URL provided:', supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : 'NONE');
    console.log('Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);
} else {
    console.log('Supabase client initialized with URL:', `${supabaseUrl.substring(0, 15)}...`);
}

// Fallback to empty strings if invalid to prevent createClient from throwing if possible, 
// though createClient usually validates. We use null/dummy if needed.
export const supabase = createClient(
    isValidUrl(supabaseUrl) ? supabaseUrl : 'https://placeholder-project.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
