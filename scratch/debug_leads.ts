import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase env vars");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEverything() {
  console.log("Checking notifications...");
  const { data: notifs, error: notifError } = await supabase.from('notifications').select('*').limit(5);
  if (notifError) console.error("notifications error:", notifError);
  else console.log(`notifications count: ${notifs.length}`, notifs);

  console.log("\nChecking vi_leads...");
  const { data: viLeads, error: viError } = await supabase.from('vi_leads').select('*');
  if (viError) console.error("vi_leads error:", viError);
  else console.log(`vi_leads count: ${viLeads.length}`);

  console.log("\nChecking organizations...");
  const { data: orgs, error: orgError } = await supabase.from('organizations').select('*');
  if (orgError) console.error("organizations error:", orgError);
  else console.log(`organizations count: ${orgs.length}`);
}

checkEverything();
