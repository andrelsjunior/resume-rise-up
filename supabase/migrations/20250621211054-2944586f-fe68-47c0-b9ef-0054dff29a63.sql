
-- Create credits table to track user credits
CREATE TABLE public.credits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  credits_remaining integer NOT NULL DEFAULT 50,
  last_updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Create cover_letters table
CREATE TABLE public.cover_letters (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create mock_interviews table
CREATE TABLE public.mock_interviews (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  interview_type text NOT NULL,
  questions_and_answers jsonb NOT NULL,
  overall_feedback text,
  overall_score integer,
  status text DEFAULT 'completed',
  job_description text,
  user_resume_text text,
  created_at timestamp with time zone DEFAULT now()
);

-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create function to spend user credits
CREATE OR REPLACE FUNCTION public.spend_user_credits(
  p_user_id uuid,
  p_credits_to_spend integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_credits integer;
BEGIN
  -- Get current credits
  SELECT credits_remaining INTO current_credits
  FROM public.credits
  WHERE user_id = p_user_id;
  
  -- Check if user has enough credits
  IF current_credits IS NULL OR current_credits < p_credits_to_spend THEN
    RETURN FALSE;
  END IF;
  
  -- Deduct credits
  UPDATE public.credits
  SET credits_remaining = credits_remaining - p_credits_to_spend,
      last_updated_at = now()
  WHERE user_id = p_user_id;
  
  RETURN TRUE;
END;
$$;

-- Create trigger to initialize user credits when profile is created
CREATE OR REPLACE FUNCTION public.initialize_user_credits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.credits (user_id, credits_remaining)
  VALUES (NEW.id, 50)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.initialize_user_credits();

-- Enable RLS on all tables
ALTER TABLE public.credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mock_interviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for credits
CREATE POLICY "Users can view their own credits" 
  ON public.credits FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own credits" 
  ON public.credits FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create RLS policies for cover_letters
CREATE POLICY "Users can view their own cover letters" 
  ON public.cover_letters FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own cover letters" 
  ON public.cover_letters FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for mock_interviews
CREATE POLICY "Users can view their own mock interviews" 
  ON public.mock_interviews FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own mock interviews" 
  ON public.mock_interviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Update activities table to store details in a more structured way
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '{}';

-- Enable RLS on activities table
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for activities
CREATE POLICY "Users can view their own activities" 
  ON public.activities FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own activities" 
  ON public.activities FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);
