import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface StoreSettingsUpdate {
  about_us: string;
  phone: string;
  email: string;
  address: string;
  working_hours_weekdays: string;
  working_hours_friday: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const body: StoreSettingsUpdate = await req.json();

    // Check if settings exist
    const { data: existingSettings, error: fetchError } = await supabaseAdmin
      .from("store_settings")
      .select("id")
      .maybeSingle();

    if (fetchError) {
      console.error("Error fetching settings:", fetchError);
      return new Response(
        JSON.stringify({ error: "فشل في جلب الإعدادات" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    
    if (existingSettings) {
      // Update existing settings
      result = await supabaseAdmin
        .from("store_settings")
        .update({
          about_us: body.about_us,
          phone: body.phone,
          email: body.email,
          address: body.address,
          working_hours_weekdays: body.working_hours_weekdays,
          working_hours_friday: body.working_hours_friday,
        })
        .eq("id", existingSettings.id)
        .select()
        .single();
    } else {
      // Insert new settings
      result = await supabaseAdmin
        .from("store_settings")
        .insert({
          about_us: body.about_us,
          phone: body.phone,
          email: body.email,
          address: body.address,
          working_hours_weekdays: body.working_hours_weekdays,
          working_hours_friday: body.working_hours_friday,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error saving settings:", result.error);
      return new Response(
        JSON.stringify({ error: "فشل في حفظ الإعدادات" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data: result.data }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
