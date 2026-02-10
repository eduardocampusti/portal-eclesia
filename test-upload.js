
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

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
    console.log('--- Testing Storage Upload ---');
    const testFile = Buffer.from('test');
    const fileName = `test-${Date.now()}.txt`;

    const { data, error } = await supabase.storage.from('images').upload(fileName, testFile, {
        contentType: 'text/plain',
        upsert: true
    });

    if (error) {
        console.error('❌ Upload Failed:', error.message);
        if (error.message.includes('permission')) {
            console.log('💡 TIP: You need to add an RLS policy to the "images" bucket to allow uploads.');
        }
    } else {
        console.log('✅ Upload Success:', data.path);
        // Cleanup
        await supabase.storage.from('images').remove([fileName]);
        console.log('✅ Cleanup Success');
    }
}

testUpload();
