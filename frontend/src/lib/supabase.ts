import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] Missing required environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

export interface SupabaseTransaction {
  id?: string;
  user_email: string;
  payment_id: string;
  order_id?: string;
  amount: number;
  currency: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  item_type: 'SINGLE_PAPER' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY' | 'MONTHLY_PASS';
  exam_id?: string;
  created_at?: string;
}

export interface SupabaseUserSubscription {
  id?: string;
  user_email: string;
  plan_name: string;
  payment_id: string;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
  expires_at: string;
  created_at?: string;
}

export interface SupabasePaperPurchase {
  id?: string;
  user_email: string;
  exam_id: string;
  payment_id: string;
  amount_paid: number;
  expires_at: string;
  purchased_at?: string;
}
