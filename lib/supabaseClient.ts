
// import { createClient } from '@supabase/supabase-js';

// --- CONFIGURAÇÃO DO SUPABASE DESATIVADA TEMPORARIAMENTE ---
// Para usar o modo offline/localstorage, deixamos o cliente como null.

export const supabase = null; 

// Caso queira reativar no futuro, descomente e preencha:
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'SUA_URL_SUPABASE_AQUI';
// const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'SUA_ANON_KEY_AQUI';
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);
