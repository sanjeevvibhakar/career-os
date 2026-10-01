import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL_KEY = 'career_os_supabase_url';
const SUPABASE_KEY_KEY = 'career_os_supabase_anon_key';

export const getSupabaseConfig = () => {
  return {
    url: localStorage.getItem(SUPABASE_URL_KEY) || import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: localStorage.getItem(SUPABASE_KEY_KEY) || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
  };
};

export const setSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem(SUPABASE_URL_KEY, url.trim().replace(/\/$/, ''));
  localStorage.setItem(SUPABASE_KEY_KEY, anonKey.trim());
};

let cachedClient: SupabaseClient | null = null;
let lastUsedUrl = '';
let lastUsedKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return null;

  if (cachedClient && lastUsedUrl === url && lastUsedKey === anonKey) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, anonKey);
    lastUsedUrl = url;
    lastUsedKey = anonKey;
    return cachedClient;
  } catch (err) {
    console.error('Failed to create Supabase client:', err);
    return null;
  }
};

// Test if Supabase project & table are accessible
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Please enter your Supabase Project URL and Anon Public Key.' };
  }

  try {
    const { data, error } = await client
      .from('career_os_sync')
      .select('updated_at')
      .limit(1);

    if (error) {
      if (error.code === '42P01') {
        return { 
          success: false, 
          message: 'Connected to Supabase! But table "career_os_sync" does not exist yet. Please run the SQL snippet in Supabase SQL Editor.' 
        };
      }
      return { success: false, message: `Supabase Error: ${error.message}` };
    }

    return { success: true, message: '✓ Supabase is ONLINE & Connected with 0ms latency!' };
  } catch (err: any) {
    return { success: false, message: `Connection error: ${err.message}` };
  }
};

// Push local state snapshot to Supabase PostgreSQL
export const pushToSupabase = async (snapshot: any): Promise<{ success: boolean; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase credentials missing.' };
  }

  try {
    const { error } = await client
      .from('career_os_sync')
      .upsert({
        id: 'primary',
        payload: snapshot,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { success: false, message: `Upload error: ${error.message}` };
    }

    return { success: true, message: '✓ Data successfully backed up to your Supabase PostgreSQL cloud!' };
  } catch (err: any) {
    return { success: false, message: `Push failed: ${err.message}` };
  }
};

// Pull cloud state snapshot from Supabase PostgreSQL
export const pullFromSupabase = async (): Promise<{ success: boolean; data?: any; message: string }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase credentials missing.' };
  }

  try {
    const { data, error } = await client
      .from('career_os_sync')
      .select('payload, updated_at')
      .eq('id', 'primary')
      .single();

    if (error) {
      return { success: false, message: `Download error: ${error.message}` };
    }

    if (data?.payload) {
      return { success: true, data: data.payload, message: `✓ Downloaded cloud data (last updated ${new Date(data.updated_at).toLocaleTimeString()})!` };
    }

    return { success: false, message: 'No cloud snapshot found in Supabase yet.' };
  } catch (err: any) {
    return { success: false, message: `Pull failed: ${err.message}` };
  }
};
