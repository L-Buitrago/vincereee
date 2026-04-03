const { createClient } = require('@supabase/supabase-js');

// Using the provided Anon Key and Project URL from the environment
const VITE_SUPABASE_URL = "https://lbnomhmtkqnktnyxlcpk.supabase.co";
const VITE_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxibm9taG10a3Fua3RueXhsY3BrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMxODAxMjIsImV4cCI6MjA1ODc1NjEyMn0.-XzI_8Zp6-zG_Z7_Z7_Z7_Z7_Z7_Z7_Z7_Z7_Z7_Z7"; 

const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function checkProfiles() {
  console.log("Checking profiles for Nathan and Rhyan...");
  const { data, error } = await supabase.from('profiles').select('full_name');
  
  if (error) {
    console.error("Error fetching profiles:", error.message);
    return;
  }
  
  console.log("Found profiles:", data.map(p => p.full_name).join(", "));
  
  const hasNathan = data.some(p => p.full_name?.toLowerCase().includes('nathan'));
  const hasRhyan = data.some(p => p.full_name?.toLowerCase().includes('rhyan'));
  
  if (hasNathan && hasRhyan) {
    console.log("Nathan and Rhyan are correctly synced!");
  } else {
    console.log("Nathan or Rhyan are still missing from profiles. Please execute 'supabase/migrations/sync_profiles.sql' in the Supabase SQL Editor.");
  }
}

checkProfiles();
