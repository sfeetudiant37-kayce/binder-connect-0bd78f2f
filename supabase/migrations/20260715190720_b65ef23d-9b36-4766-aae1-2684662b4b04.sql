
-- Enums
CREATE TYPE public.app_role AS ENUM ('client', 'provider');
CREATE TYPE public.app_lang AS ENUM ('en', 'fr');
CREATE TYPE public.availability AS ENUM ('immediate', 'this_week', 'flexible', 'busy');
CREATE TYPE public.urgency AS ENUM ('urgent', 'this_week', 'flexible');
CREATE TYPE public.objective AS ENUM ('find_service','offer_service','find_job','recruit_talent','grow_brand','network');
CREATE TYPE public.request_status AS ENUM ('open','in_progress','completed');
CREATE TYPE public.match_status AS ENUM ('provider_interested','client_interested','mutual','contacted','completed');
CREATE TYPE public.swipe_dir AS ENUM ('left','right');
CREATE TYPE public.swipe_target AS ENUM ('user','request');

-- Utility: updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  active_role public.app_role NOT NULL DEFAULT 'client',
  objective public.objective NOT NULL DEFAULT 'find_service',
  preferences TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL DEFAULT 'Douala',
  language public.app_lang NOT NULL DEFAULT 'en',
  photo_url TEXT,
  bio TEXT,
  title TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  price NUMERIC,
  availability public.availability NOT NULL DEFAULT 'flexible',
  experience INT,
  phone TEXT,
  whatsapp TEXT,
  facebook TEXT,
  rating NUMERIC NOT NULL DEFAULT 0,
  review_count INT NOT NULL DEFAULT 0,
  profile_completion INT NOT NULL DEFAULT 20,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email,'@',1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- SERVICE REQUESTS
CREATE TABLE public.service_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  budget NUMERIC NOT NULL DEFAULT 0,
  urgency public.urgency NOT NULL DEFAULT 'flexible',
  status public.request_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.service_requests TO authenticated;
GRANT ALL ON public.service_requests TO service_role;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sr_read_all_auth" ON public.service_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "sr_insert_own" ON public.service_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id);
CREATE POLICY "sr_update_own" ON public.service_requests FOR UPDATE TO authenticated USING (auth.uid() = client_id) WITH CHECK (auth.uid() = client_id);
CREATE POLICY "sr_delete_own" ON public.service_requests FOR DELETE TO authenticated USING (auth.uid() = client_id);
CREATE TRIGGER trg_sr_updated BEFORE UPDATE ON public.service_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_sr_client ON public.service_requests(client_id);
CREATE INDEX idx_sr_status ON public.service_requests(status);

-- SWIPES
CREATE TABLE public.swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  target_id UUID NOT NULL,
  target_type public.swipe_target NOT NULL,
  swiper_role public.app_role NOT NULL,
  direction public.swipe_dir NOT NULL,
  fit_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, target_id, target_type)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.swipes TO authenticated;
GRANT ALL ON public.swipes TO service_role;
ALTER TABLE public.swipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "swipes_own_all" ON public.swipes FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_swipes_user ON public.swipes(user_id);
CREATE INDEX idx_swipes_target ON public.swipes(target_id);

-- MATCHES
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_id UUID REFERENCES public.service_requests(id) ON DELETE SET NULL,
  initiated_by public.app_role NOT NULL,
  client_fit_score NUMERIC NOT NULL DEFAULT 0,
  provider_fit_score NUMERIC NOT NULL DEFAULT 0,
  status public.match_status NOT NULL DEFAULT 'provider_interested',
  contact_revealed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (client_id, provider_id, request_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "matches_read_involved" ON public.matches FOR SELECT TO authenticated USING (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE POLICY "matches_insert_involved" ON public.matches FOR INSERT TO authenticated WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE POLICY "matches_update_involved" ON public.matches FOR UPDATE TO authenticated USING (auth.uid() = client_id OR auth.uid() = provider_id) WITH CHECK (auth.uid() = client_id OR auth.uid() = provider_id);
CREATE TRIGGER trg_matches_updated BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE INDEX idx_matches_client ON public.matches(client_id);
CREATE INDEX idx_matches_provider ON public.matches(provider_id);

-- MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_read_involved" ON public.messages FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.matches m WHERE m.id = match_id AND (m.client_id = auth.uid() OR m.provider_id = auth.uid())));
CREATE POLICY "messages_insert_involved" ON public.messages FOR INSERT TO authenticated
  WITH CHECK (
    sender_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.matches m WHERE m.id = match_id AND (m.client_id = auth.uid() OR m.provider_id = auth.uid()))
  );
CREATE POLICY "messages_update_own" ON public.messages FOR UPDATE TO authenticated USING (sender_id = auth.uid()) WITH CHECK (sender_id = auth.uid());
CREATE INDEX idx_messages_match ON public.messages(match_id, sent_at);
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- REVIEWS
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (from_user_id, match_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT SELECT ON public.reviews TO anon;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews_read_all" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "reviews_update_own" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = from_user_id) WITH CHECK (auth.uid() = from_user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = from_user_id);

-- WEIGHTS (learning)
CREATE TABLE public.weights (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  preferences NUMERIC NOT NULL DEFAULT 0.25,
  location NUMERIC NOT NULL DEFAULT 0.2,
  price NUMERIC NOT NULL DEFAULT 0.15,
  rating NUMERIC NOT NULL DEFAULT 0.15,
  availability NUMERIC NOT NULL DEFAULT 0.1,
  profile_completeness NUMERIC NOT NULL DEFAULT 0.1,
  experience NUMERIC NOT NULL DEFAULT 0.05,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.weights TO authenticated;
GRANT ALL ON public.weights TO service_role;
ALTER TABLE public.weights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "weights_own_all" ON public.weights FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_weights_updated BEFORE UPDATE ON public.weights FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
