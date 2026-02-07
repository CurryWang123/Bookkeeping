// Supabase 客户端配置
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm'

const SUPABASE_URL = 'https://ccivqpgntdotgpswmdnp.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_jp0yMSee57xUEMPIFKmPVA_BG1qs3s3'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
