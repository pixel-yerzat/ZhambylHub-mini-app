-- =========================================================
-- Zhambyl Hub Telegram Mini App — Supabase Database Schema
-- Выполните этот SQL-скрипт в Supabase Dashboard -> SQL Editor
-- =========================================================

-- 1. Создание таблицы профилей пользователей
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,                       -- Telegram User ID
  first_name TEXT,                          -- Имя пользователя
  last_name TEXT,                           -- Фамилия пользователя
  username TEXT,                            -- @username в Telegram
  role TEXT NOT NULL DEFAULT 'community',   -- 'developer' | 'founder' | 'investor' | 'community'
  role_title TEXT,                          -- Название роли на русском/казахском
  skills_or_interest TEXT,                  -- Специализация, навыки или идея стартапа
  points INTEGER DEFAULT 350,               -- Баланс Hub Points
  is_telegram BOOLEAN DEFAULT true,          -- Запущено ли из Telegram WebApp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Включение Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Политики безопасности: разрешить чтение и создание/обновление профилей
CREATE POLICY "Allow public read access to profiles" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Allow public insert and update to profiles" 
  ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 4. Автоматическое обновление updated_at
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
