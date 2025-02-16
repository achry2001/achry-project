
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { load } from "https://deno.fresh.run/puppeteer@21.7.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    console.log("Function called successfully");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // These are the Arabic months and their corresponding values
    const arabicDates = [
      { name: "ديسمبر - 2024", value: "12-2024" },
      { name: "نوفمبر 2024", value: "11-2024" },
      { name: "اكتوبر 2024", value: "10-2024" },
      { name: "سبتمبر- 2024", value: "09-2024" },
      { name: "أغسطس- 2024", value: "08-2024" },
      { name: "يوليو- 2024", value: "07-2024" },
      { name: "يونيو 2024", value: "06-2024" }
    ];

    console.log("Inserting Arabic dates...");

    // Store values in Supabase
    for (const date of arabicDates) {
      const { error } = await supabaseClient
        .from('journal_sources')
        .upsert({ 
          name: date.name,
          value: date.value
        }, {
          onConflict: 'value'
        });

      if (error) {
        console.error("Error inserting date:", date, error);
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Dates updated successfully" }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
