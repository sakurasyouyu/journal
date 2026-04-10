import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nrscddlunaxkqinmrrjs.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yc2NkZGx1bmF4a3Fpbm1ycmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4MjIwMzIsImV4cCI6MjA5MTM5ODAzMn0.5HbdYLacaXnjPg8vPpTY-kcjU_GZ-17J9RCKkQCRaP8';

export const supabase = createClient(supabaseUrl, supabaseKey);
