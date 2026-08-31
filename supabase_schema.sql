-- ====================================================================
-- Zhambyl Hub Telegram Mini App — Complete Production Database Schema
-- Events, PDF Pitch Decks, Team Defense Registrations & Attendees
-- Safe to run multiple times without any errors (Idempotent)
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,                             -- Telegram User ID (e.g. '682910412')
  first_name TEXT,                                -- Имя
  last_name TEXT,                                 -- Фамилия
  username TEXT,                                  -- @username в Telegram
  phone TEXT,                                     -- Номер телефона
  role TEXT NOT NULL DEFAULT 'community',         -- 'developer' | 'founder' | 'investor' | 'community' | 'moderator'
  role_title TEXT DEFAULT 'Резидент Hub',         -- Заголовок роли
  skills_or_interest TEXT,                        -- Специализация / Навыки / Интересы
  avatar_url TEXT,                                -- Аватарка
  is_telegram BOOLEAN DEFAULT true,               -- Запуск из Telegram
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. EVENTS TABLE (WITH COVER IMAGES & DETAILS)
CREATE TABLE IF NOT EXISTS public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  title_kz TEXT,
  short_desc TEXT NOT NULL,
  description TEXT,
  image_url TEXT,                                 -- URL загруженной обложки мероприятия (Storage)
  date TEXT NOT NULL,                             -- Дата проведения (e.g. '12-14 Апреля 2026')
  time TEXT DEFAULT '10:00 - 18:00',
  location TEXT DEFAULT 'г. Тараз, коворкинг Zhambyl Hub',
  location_short TEXT DEFAULT 'Zhambyl Hub, Тараз',
  category_name TEXT DEFAULT 'Хакатон',           -- 'Хакатон' | 'Pizza Pitch' | 'Demo Day' | 'Воркшоп' | 'Митап'
  has_projects BOOLEAN DEFAULT true,              -- Ивент с защитой проектов или обычный воркшоп
  max_attendees INTEGER DEFAULT 120,
  current_attendees INTEGER DEFAULT 0,
  participating_project_ids TEXT[] DEFAULT '{}',  -- ID проектов на защите
  agenda JSONB DEFAULT '[]',                      -- Программа мероприятия
  speakers JSONB DEFAULT '[]',                    -- Спикеры / Жюри
  status TEXT NOT NULL DEFAULT 'approved',        -- 'pending' | 'approved' | 'rejected'
  created_by TEXT REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT false,              -- Главное событие (Hot)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. PROJECTS / STARTUPS & PDF PITCH DECKS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category TEXT DEFAULT 'AI & IT Solutions',      -- 'AI & Data' | 'AgroTech' | 'GovTech' | 'FinTech' | 'MedTech' | 'EdTech'
  tag TEXT DEFAULT 'Startup',
  stage TEXT DEFAULT 'MVP / Prototype',           -- 'Idea' | 'MVP' | 'Early Traction' | 'Scale'
  short_desc TEXT NOT NULL,
  short_desc_kz TEXT,
  founder_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  founder_name TEXT NOT NULL,
  founder_phone TEXT,
  founder_role TEXT DEFAULT 'Founder & Team Lead',
  team_members TEXT,                              -- Состав команды (имена и роли)
  demo_url TEXT,                                  -- Ссылка на демо / сайт / GitHub
  logo_icon TEXT DEFAULT '🚀',
  pdf_deck_url TEXT NOT NULL,                     -- URL загруженного PDF файла презентации (до 10 MB)
  pdf_deck_name TEXT DEFAULT 'pitch_deck.pdf',    -- Имя файла
  pdf_deck_size TEXT DEFAULT '2.4 MB',            -- Размер файла
  status TEXT NOT NULL DEFAULT 'approved',        -- 'pending' | 'approved' | 'rejected'
  rating NUMERIC(3, 1) DEFAULT 5.0,
  reviews_count INTEGER DEFAULT 1,
  metrics JSONB DEFAULT '[
    {"label": "Статус", "value": "На модерации"},
    {"label": "Питч-дек", "value": "PDF загружен"},
    {"label": "Питч", "value": "Готов к защите"}
  ]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. EVENT REGISTRATIONS & PROJECT DEFENSE APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.event_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  event_title TEXT NOT NULL,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  attendee_name TEXT NOT NULL,                    -- Имя и Фамилия
  attendee_phone TEXT NOT NULL,                   -- Телефон для связи / WhatsApp
  telegram_username TEXT,                         -- @username для отправки уведомлений в Telegram
  registration_type TEXT NOT NULL DEFAULT 'listener', -- 'listener' (Слушатель) | 'pitch_project' (Защита проекта)
  project_name TEXT,                              -- Название проекта (если pitch_project)
  project_desc TEXT,                              -- Краткое описание проекта
  team_members TEXT,                              -- Участники команды (имена и роли)
  pdf_deck_url TEXT,                              -- Ссылка на загруженный PDF питч-дек
  project_stage TEXT,                             -- Стадия стартапа
  project_category TEXT,                          -- Сфера проекта
  demo_or_github_url TEXT,                        -- Ссылка на прототип / GitHub
  status TEXT NOT NULL DEFAULT 'confirmed',       -- 'confirmed' | 'attended' | 'cancelled'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. PROJECT REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS public.project_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_score INTEGER CHECK (problem_score BETWEEN 1 AND 5),
  solution_score INTEGER CHECK (solution_score BETWEEN 1 AND 5),
  market_score INTEGER CHECK (market_score BETWEEN 1 AND 5),
  pitch_score INTEGER CHECK (pitch_score BETWEEN 1 AND 5),
  avg_score NUMERIC(3, 1) NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES (IDEMPOTENT)
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles access" ON public.profiles;
DROP POLICY IF EXISTS "Public events access" ON public.events;
DROP POLICY IF EXISTS "Public projects access" ON public.projects;
DROP POLICY IF EXISTS "Public registrations access" ON public.event_registrations;
DROP POLICY IF EXISTS "Public reviews access" ON public.project_reviews;

CREATE POLICY "Public profiles access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public events access" ON public.events FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public projects access" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public registrations access" ON public.event_registrations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public reviews access" ON public.project_reviews FOR ALL USING (true) WITH CHECK (true);

-- ====================================================================
-- STORAGE BUCKETS CONFIGURATION (PDF PITCH DECKS & EVENT COVER IMAGES)
-- ====================================================================

-- 1. Pitch Decks Bucket (PDF limit 10 MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('pitch_decks', 'pitch_decks', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE 
SET public = true, 
    file_size_limit = 10485760, 
    allowed_mime_types = ARRAY['application/pdf'];

-- 2. Event Covers Bucket (Image limit 5 MB)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('event_covers', 'event_covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE 
SET public = true, 
    file_size_limit = 5242880, 
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Storage Object Policies
DROP POLICY IF EXISTS "Public storage uploads" ON storage.objects;
DROP POLICY IF EXISTS "Public storage read" ON storage.objects;
DROP POLICY IF EXISTS "Public storage modify" ON storage.objects;

CREATE POLICY "Public storage uploads" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id IN ('pitch_decks', 'event_covers'));

CREATE POLICY "Public storage read" 
  ON storage.objects FOR SELECT 
  USING (bucket_id IN ('pitch_decks', 'event_covers'));

CREATE POLICY "Public storage modify" 
  ON storage.objects FOR ALL 
  USING (bucket_id IN ('pitch_decks', 'event_covers'));

-- ====================================================================
-- AUTOMATIC TIMESTAMPS TRIGGER (IDEMPOTENT)
-- ====================================================================

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_modtime ON public.profiles;
CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

DROP TRIGGER IF EXISTS update_projects_modtime ON public.projects;
CREATE TRIGGER update_projects_modtime
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
