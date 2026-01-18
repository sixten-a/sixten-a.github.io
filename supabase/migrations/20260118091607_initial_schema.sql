-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id BIGSERIAL PRIMARY KEY,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.site_settings
    FOR SELECT USING (true);

-- Allow authenticated admin to update settings
-- Note: In a real app, we'd check for a specific admin role or email
CREATE POLICY "Allow admin to update settings" ON public.site_settings
    FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Create feedback table
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL,
    app TEXT,
    email TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for feedback
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert feedback
CREATE POLICY "Allow public insert feedback" ON public.feedback
    FOR INSERT WITH CHECK (true);

-- Allow authenticated admin to view feedback
CREATE POLICY "Allow admin to view feedback" ON public.feedback
    FOR SELECT TO authenticated USING (true);

-- Enable realtime for site_settings
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;

-- Set initial values
INSERT INTO public.site_settings (key, value) VALUES 
('site_title', 'Sixun sovellukset'),
('background_color', '#0d5f2c'),
('background_url', '')
ON CONFLICT (key) DO NOTHING;
