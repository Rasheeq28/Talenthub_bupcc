-- 1. Create HrProfiles table
CREATE TABLE public."HrProfiles" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "companyName" TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Insert initial companies
INSERT INTO public."HrProfiles" ("companyName", password) VALUES 
('City Bank', 'CityBank_BUPCC'),
('Aarong', 'Aarong_BUPCC'),
('Pathao', 'Pathao_BUPCC'),
('Renata PLC', 'RenataPLC_BUPCC'),
('Foodi', 'Foodi_BUPCC');

-- 2. Setup RLS for existing CvBank table
ALTER TABLE public."CvBank" ENABLE ROW LEVEL SECURITY;

-- If you are not using auth.users, RLS based on auth.uid() will not work.
-- For a simple public access (since the app level checks localStorage):
CREATE POLICY "Allow public read access" ON public."CvBank" FOR SELECT USING (true);
