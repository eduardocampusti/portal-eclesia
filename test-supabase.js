
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual ENV loading
const envPath = path.resolve('.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) env[key.trim()] = value.trim();
});

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log('--- Testing Supabase Connection ---');
    console.log('URL:', supabaseUrl);

    // Test Database
    const { data: dbData, error: dbError } = await supabase.from('site_settings').select('id').limit(1);
    if (dbError) {
        console.error('❌ Database Error (site_settings):', dbError.message);
    } else {
        console.log('✅ Database connection OK (site_settings accessible)');
    }

    // Test Storage
    try {
        const { data: buckets, error: storageError } = await supabase.storage.listBuckets();
        if (storageError) {
            console.log('⚠️ Storage listBuckets error:', storageError.message);
        } else {
            const imagesBucket = buckets.find(b => b.name === 'images');
            if (imagesBucket) {
                console.log('✅ "images" bucket exists');
            } else {
                console.error('❌ "images" bucket NOT found');
            }
        }

        // Try direct listing as final proof
        const { data: files, error: listError } = await supabase.storage.from('images').list('', { limit: 1 });
        if (listError) {
            console.error('❌ Storage Bucket Access Error:', listError.message);
        } else {
            console.log('✅ Success: Can access "images" bucket content');
        }
    } catch (err) {
        console.error('❌ Unexpected error during storage test:', err.message);
    }
}

testConnection();
