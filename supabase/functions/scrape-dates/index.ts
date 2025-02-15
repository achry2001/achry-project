
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { load } from "https://deno.fresh.run/puppeteer@21.7.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Initialize browser
    const browser = await load();
    const page = await browser.newPage();
    
    console.log("Navigating to website...");
    await page.goto("http://www.itda.gov.eg/jurnal-sgl.aspx");
    
    // Wait for dropdown and extract values
    const dropdownValues = await page.evaluate(() => {
      const dropdown = document.getElementById('DropDownList1') as HTMLSelectElement;
      return Array.from(dropdown.options).map(option => option.text);
    });

    console.log("Extracted values:", dropdownValues);

    // Store values in Supabase
    for (const value of dropdownValues) {
      const { error } = await supabaseClient
        .from('journal_sources')
        .upsert({ 
          name: value,
          value: value
        }, {
          onConflict: 'value'
        });

      if (error) {
        console.error("Error inserting value:", value, error);
      }
    }

    await browser.close();

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
