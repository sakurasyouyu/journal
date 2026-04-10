import { createClient } from '@supabase/supabase-js';

// ご自身で取得したSupabaseのURLとキーをここに入力するか、.envファイルを作成して読み込ませます
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxx.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'xxx_key';

export const supabase = createClient(supabaseUrl, supabaseKey);
