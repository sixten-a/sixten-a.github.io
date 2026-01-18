-- Add is_read column to feedback table
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT false;

-- Add updated_at column to feedback table for sorting/tracking
ALTER TABLE public.feedback ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update RLS policies to allow authenticated users (admin) to update and delete feedback
CREATE POLICY "Allow admin to update feedback" ON public.feedback
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow admin to delete feedback" ON public.feedback
    FOR DELETE TO authenticated USING (true);
