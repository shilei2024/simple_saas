-- Add free_credits and paid_credits columns to customers table
-- free_credits: registration bonus credits (default 3)
-- paid_credits: purchased credits
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS free_credits integer DEFAULT 0 NOT NULL;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS paid_credits integer DEFAULT 0 NOT NULL;

-- Migrate existing credits: treat existing credits as free_credits
UPDATE public.customers SET free_credits = credits WHERE credits > 0;

-- Add constraint for non-negative
ALTER TABLE public.customers ADD CONSTRAINT free_credits_non_negative CHECK (free_credits >= 0);
ALTER TABLE public.customers ADD CONSTRAINT paid_credits_non_negative CHECK (paid_credits >= 0);

-- Create email_correspondence table to store incoming and outgoing emails
CREATE TABLE public.email_correspondence (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id uuid REFERENCES public.customers(id) ON DELETE CASCADE,
    sender_email text NOT NULL,
    recipient_email text NOT NULL,
    subject text,
    incoming_body text NOT NULL,
    outgoing_body text,
    gmail_message_id text UNIQUE,
    gmail_thread_id text,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'processing', 'replied', 'failed', 'skipped')),
    credit_type text CHECK (credit_type IN ('free', 'paid')),
    reply_tier text CHECK (reply_tier IN ('free', 'paid_credits', 'monthly_subscription', 'unlimited_subscription')),
    scheduled_reply_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    replied_at timestamp with time zone,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- Create indexes for email_correspondence
CREATE INDEX email_correspondence_customer_id_idx ON public.email_correspondence(customer_id);
CREATE INDEX email_correspondence_sender_email_idx ON public.email_correspondence(sender_email);
CREATE INDEX email_correspondence_gmail_message_id_idx ON public.email_correspondence(gmail_message_id);
CREATE INDEX email_correspondence_status_idx ON public.email_correspondence(status);
CREATE INDEX email_correspondence_created_at_idx ON public.email_correspondence(created_at);
CREATE INDEX email_correspondence_scheduled_reply_at_idx ON public.email_correspondence(scheduled_reply_at)
    WHERE status = 'scheduled';

-- Create email_processing_log for tracking the polling job
CREATE TABLE public.email_processing_log (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    last_history_id text,
    last_processed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    emails_processed integer DEFAULT 0,
    status text DEFAULT 'success' CHECK (status IN ('success', 'error')),
    error_message text,
    metadata jsonb DEFAULT '{}'::jsonb
);

-- RLS for email_correspondence
ALTER TABLE public.email_correspondence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_processing_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own email correspondence"
    ON public.email_correspondence FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.customers
            WHERE customers.id = email_correspondence.customer_id
            AND customers.user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage email correspondence"
    ON public.email_correspondence FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Service role can manage email processing log"
    ON public.email_processing_log FOR ALL
    USING (auth.role() = 'service_role');

-- Grants
GRANT ALL ON public.email_correspondence TO service_role;
GRANT ALL ON public.email_processing_log TO service_role;

-- Update the handle_new_user function to set free_credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.customers (
    user_id,
    email,
    credits,
    free_credits,
    paid_credits,
    creem_customer_id,
    created_at,
    updated_at,
    metadata
  ) VALUES (
    NEW.id,
    NEW.email,
    3,
    3,
    0,
    'auto_' || NEW.id::text,
    NOW(),
    NOW(),
    jsonb_build_object(
      'source', 'auto_registration',
      'initial_credits', 3,
      'registration_date', NOW()
    )
  );

  INSERT INTO public.credits_history (
    customer_id,
    amount,
    type,
    description,
    created_at,
    metadata
  ) VALUES (
    (SELECT id FROM public.customers WHERE user_id = NEW.id),
    3,
    'add',
    'Welcome bonus for new user registration',
    NOW(),
    jsonb_build_object(
      'source', 'welcome_bonus',
      'credit_type', 'free',
      'user_registration', true
    )
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
