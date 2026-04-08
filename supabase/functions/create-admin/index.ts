import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Create admin user
  const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
    email: "admin@intergrai.co.za",
    password: "Admin,123",
    email_confirm: true,
  });

  if (userError && !userError.message.includes("already been registered")) {
    return new Response(JSON.stringify({ error: userError.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let userId = userData?.user?.id;

  // If user already exists, look them up
  if (!userId) {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const existing = users?.users?.find((u) => u.email === "admin@intergrai.co.za");
    userId = existing?.id;
  }

  if (!userId) {
    return new Response(JSON.stringify({ error: "Could not find or create user" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Assign admin role
  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });

  if (roleError) {
    return new Response(JSON.stringify({ error: roleError.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true, userId }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
