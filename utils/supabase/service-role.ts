import { createClient } from "@supabase/supabase-js";

export const createServiceRoleClient = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not configured");
  }
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }

  // 提示：确保使用的是 service_role key，不是 anon key
  // service_role key 通常以 'eyJ' 开头（JWT token 格式）
  if (serviceRoleKey.length < 100) {
    console.warn(
      "警告: SUPABASE_SERVICE_ROLE_KEY 看起来可能不是 service_role key。" +
      "service_role key 通常很长（>100 字符）。" +
      "请确保在 Supabase Dashboard > Settings > API 中使用 'service_role' key，而不是 'anon' key。"
    );
  }

  return createClient(
    url,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};
