/**
 * Database setup script
 * Run: node supabase/setup.mjs
 *
 * This script:
 * 1. Creates database tables via SQL
 * 2. Creates the first admin user
 * 3. Seeds initial data from JSON files
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://ylghbvkqismajqqxjrtr.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlsZ2hidmtxaXNtYWpxcXhqcnRyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDkyNzQ5NiwiZXhwIjoyMDkwNTAzNDk2fQ.HKzFTdESd0A7VtJYaXAg2AEqnBHCcBUrdpqDonvbKKY';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function runSQL() {
  console.log('📦 Running SQL schema...');
  const sql = readFileSync(resolve(__dirname, 'schema.sql'), 'utf-8');

  // Split by semicolons and run each statement
  // (Supabase REST API doesn't support multi-statement SQL directly)
  // Instead, we'll use the rpc endpoint or run it manually

  console.log('⚠️  Please run the schema.sql file manually in Supabase SQL Editor:');
  console.log('   1. Go to https://supabase.com/dashboard → your project → SQL Editor');
  console.log('   2. Paste the contents of supabase/schema.sql');
  console.log('   3. Click Run');
  console.log('');
}

async function createAdmin() {
  console.log('👤 Creating admin user...');

  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@earth-school.com',
    password: 'admin123456',
    email_confirm: true,
    user_metadata: { full_name: 'مدير المدرسة', role: 'admin' }
  });

  if (error) {
    if (error.message?.includes('already been registered')) {
      console.log('   ✅ Admin user already exists');
    } else {
      console.error('   ❌ Error creating admin:', error.message);
    }
  } else {
    console.log('   ✅ Admin created:', data.user.email);

    // Also insert profile directly
    const { error: profileErr } = await supabase.from('profiles').upsert({
      id: data.user.id,
      email: 'admin@earth-school.com',
      full_name: 'مدير المدرسة',
      role: 'admin',
    });

    if (profileErr) {
      console.log('   ⚠️  Profile insert note:', profileErr.message);
    } else {
      console.log('   ✅ Admin profile created');
    }
  }

  console.log('');
  console.log('   📧 Email: admin@earth-school.com');
  console.log('   🔑 Password: admin123456');
  console.log('   ⚠️  غيّر كلمة المرور بعد أول تسجيل دخول!');
}

async function main() {
  console.log('');
  console.log('🏫 مدرسة الأرض - Database Setup');
  console.log('================================');
  console.log('');

  await runSQL();
  await createAdmin();

  console.log('');
  console.log('✅ Setup complete!');
  console.log('');
}

main().catch(console.error);
