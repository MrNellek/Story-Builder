# Plot Twist - Story Bible Tool

A comprehensive story bible tool for fiction writers built with React, Supabase, and Tailwind CSS.

## Features

- **Story Management**: Create and organize multiple stories
- **Character Database**: Detailed character profiles with traits, backgrounds, and abilities
- **World Building**: Create locations, cultures, magic systems, and historical elements
- **Lore & Mythology**: Add myths, legends, prophecies, and artifacts
- **AI Integration**: Generate race traits using Anthropic Claude

## Setup Instructions

### 1. Supabase Setup

First, create a new project at [supabase.com](https://supabase.com).

### 2. Database Schema

Run this SQL in your Supabase SQL Editor (skip the first line that's causing the permission error):

```sql
-- NOTE: Skip this line - it's already configured by Supabase:
-- ALTER TABLE IF EXISTS auth.users ENABLE ROW LEVEL SECURITY;

-- Stories table
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  race TEXT,
  class TEXT,
  background TEXT,
  personality TEXT,
  appearance TEXT,
  abilities TEXT,
  backstory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- World elements table
CREATE TABLE IF NOT EXISTS world_elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'location', 'organization', 'culture', 'magic_system', 'technology', 'history', 'other'
  description TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lore entries table
CREATE TABLE IF NOT EXISTS lore_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'myth', 'legend', 'history', 'prophecy', 'ritual', 'artifact', 'other'
  content TEXT NOT NULL,
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Stories policies
CREATE POLICY "Users can view their own stories" ON stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stories" ON stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" ON stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON stories
  FOR DELETE USING (auth.uid() = user_id);

-- Characters policies
CREATE POLICY "Users can view characters from their stories" ON characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create characters for their stories" ON characters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update characters from their stories" ON characters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete characters from their stories" ON characters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- World elements policies
CREATE POLICY "Users can view world elements from their stories" ON world_elements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create world elements for their stories" ON world_elements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update world elements from their stories" ON world_elements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete world elements from their stories" ON world_elements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- Lore entries policies
CREATE POLICY "Users can view lore entries from their stories" ON lore_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create lore entries for their stories" ON lore_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update lore entries from their stories" ON lore_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete lore entries from their stories" ON lore_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );
```
CREATE TABLE IF NOT EXISTS stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE IF NOT EXISTS characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  race TEXT,
  class TEXT,
  background TEXT,
  personality TEXT,
  appearance TEXT,
  abilities TEXT,
  backstory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- World elements table
CREATE TABLE IF NOT EXISTS world_elements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'location', 'organization', 'culture', 'magic_system', 'technology', 'history', 'other'
  description TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lore entries table
CREATE TABLE IF NOT EXISTS lore_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL, -- 'myth', 'legend', 'history', 'prophecy', 'ritual', 'artifact', 'other'
  content TEXT NOT NULL,
  tags TEXT[], -- Array of tags
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies

-- Stories policies
CREATE POLICY "Users can view their own stories" ON stories
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stories" ON stories
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stories" ON stories
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories" ON stories
  FOR DELETE USING (auth.uid() = user_id);

-- Characters policies
CREATE POLICY "Users can view characters from their stories" ON characters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create characters for their stories" ON characters
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update characters from their stories" ON characters
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete characters from their stories" ON characters
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = characters.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- World elements policies
CREATE POLICY "Users can view world elements from their stories" ON world_elements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create world elements for their stories" ON world_elements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update world elements from their stories" ON world_elements
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete world elements from their stories" ON world_elements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = world_elements.story_id
      AND stories.user_id = auth.uid()
    )
  );

-- Lore entries policies
CREATE POLICY "Users can view lore entries from their stories" ON lore_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create lore entries for their stories" ON lore_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update lore entries from their stories" ON lore_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete lore entries from their stories" ON lore_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM stories
      WHERE stories.id = lore_entries.story_id
      AND stories.user_id = auth.uid()
    )
  );
```

### 3. Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### 4. Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. Add environment variables in Netlify dashboard
4. Deploy!

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **Deployment**: Netlify
- **AI**: Anthropic Claude API

## Development

```bash
npm install
npm run dev
```
