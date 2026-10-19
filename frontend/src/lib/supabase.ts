import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const envObj = typeof globalThis !== 'undefined' ? (globalThis as any).process?.env : undefined;
const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || envObj?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || envObj?.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  // In development/test scripts, fallback if not set
}

export const supabase = createClient<Database>(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder', {
  auth: {
    persistSession: typeof window !== 'undefined',
    autoRefreshToken: typeof window !== 'undefined',
    detectSessionInUrl: typeof window !== 'undefined',
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
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
