# PrepUnite: Production Access Control, Supabase DB & Transaction Architecture

This document details the end-to-end technical architecture for PrepUnite, covering client-side entitlement state, Supabase database integration, payment transaction logging, server-side payload security, and the TipTap rich-text content engine.

## 1. Supabase Database & Transaction System Overview
PrepUnite connects directly to Supabase PostgreSQL for entitlement checks, payment transaction verification, and purchase logging:

```
[ User Checkout ]
       ¦
       ?
[ PaywallModal.tsx ]
       ¦
       ?
[ supabasePaymentService.ts ]
       +-- 1. Check Idempotency (payment_id)
       +-- 2. Insert Audit Log -> `transactions`
       +-- 3. Grant Entitlement -> `user_paper_purchases` OR `user_subscriptions`
       +-- 4. Sync Local State -> `dataStore`
```

## 2. Supabase Client & Service Setup

### A. Supabase Client (`frontend/src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### B. Payment Verification Service (`frontend/src/services/supabasePaymentService.ts`)
Handles transaction idempotency, purchase logging, entitlement verification, and state sync:

```typescript
export class SupabasePaymentService {
  async verifyAndLogTransaction(params: ProcessPaymentParams): Promise<VerificationResult> {
    const { paymentId, amount, itemType, examId, userEmail } = params;

    // 1. Idempotency Safeguard: Check for duplicate payment_id
    const { data: existingTx } = await supabase
      .from('transactions')
      .select('id, status')
      .eq('payment_id', paymentId)
      .maybeSingle();

    if (existingTx) {
      this.syncToLocalStore(itemType, examId);
      return { success: true, isUnlocked: true, message: 'Payment already verified.' };
    }

    // 2. Log Payment Transaction
    await supabase.from('transactions').insert([{
      user_email: userEmail,
      payment_id: paymentId,
      amount,
      status: 'SUCCESS',
      item_type: itemType,
      exam_id: examId,
    }]);

    // 3. Grant Entitlement in Supabase DB
    if (itemType === 'SINGLE_PAPER' && examId) {
      await supabase.from('user_paper_purchases').insert([{
        user_email: userEmail,
        exam_id: examId,
        payment_id: paymentId,
        amount_paid: amount,
      }]);
    } else if (itemType === 'MONTHLY_PASS') {
      const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from('user_subscriptions').insert([{
        user_email: userEmail,
        plan_name: 'Jobsfolder Pro Monthly Pass',
        payment_id: paymentId,
        status: 'ACTIVE',
        expires_at: expiresAt,
      }]);
    }

    // 4. Sync client state
    this.syncToLocalStore(itemType, examId);
    return { success: true, isUnlocked: true, message: 'Access verified on Supabase!' };
  }
}
```

## 3. SQL Database Migration (`supabase_schema.sql`)
Run the contents of `supabase_schema.sql` inside your Supabase Dashboard -> **SQL Editor**.

## 4. TipTap Rich-Text Engine & Storage
- **Base64 Images**: Pasted/uploaded images are stored directly inside the content `TEXT` column as `data:image/png;base64,...`. Zero external AWS S3 bucket dependencies required.
- **Dark Mode Sanitization**: `transformPastedHTML` strips Google Docs black inline colors (`color: #000`, `background-color: #fff`).
- **Content Rendering**: `ContentRenderer.tsx` detects HTML vs. Markdown and renders Base64 images and custom tables cleanly without stripping HTML tags.
