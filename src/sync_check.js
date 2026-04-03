const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  "https://lbnomhmtkqnktnyxlcpk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxibm9taG10a3Fua3RueXhsY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxODAxMjIsImV4cCI6MjA1ODc1NjEyMn0.-XzI_8Zp6-zG_Z7_Z7_Z7_Z7_Z7_Z7_Z7_Z7_Z7_Z7" // Use full anon key here
);

async function sync() {
  console.log("Syncing Nathan and Rhyan profiles...");
  
  // Logic from sync_profiles.sql
  // 1. Fetch missing profiles from auth.users (requires service role, but we'll try profiles check)
  const { data: profiles, error: pError } = await supabase.from('profiles').select('full_name');
  if (pError) {
    console.error("Error fetching profiles:", pError);
    return;
  }
  
  console.log("Current profiles:", profiles.map(p => p.full_name).join(", "));
  
  // The user mentioned Nathan and Rhyan are not appearing.
  // This script usually runs in SQL Editor, but I'll confirm their presence here.
  // If they are missing, I'll advise the user to run the sync_profiles.sql in the dashboard.
}

sync();
