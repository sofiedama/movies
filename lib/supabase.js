import { createClient } from '@supabase/supabase-js'

// Tady říkáme aplikaci, aby si vzala ty tajné klíče ze souboru .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Pokud jsi v .env.local nechala název ANON_KEY, přepiš ten řádek výše na:
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Vytvoření samotného "klienta" (propojení), kterého budeme používat všude jinde
export const supabase = createClient(supabaseUrl, supabaseKey)