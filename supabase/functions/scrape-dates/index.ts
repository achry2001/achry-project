
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts';

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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Launch Puppeteer browser
    const browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Navigate to the target page
    await page.goto('http://www.itda.gov.eg/jurnal-sgl.aspx', { waitUntil: 'networkidle2' });

    // Wait for dropdown and extract options
    const dropdownValues = await page.evaluate(() => {
      const dropdown = document.querySelector('#DropDownList1');
      if (!dropdown) return [];
      
      return Array.from(dropdown.options).map(option => ({
        name: option.textContent.trim(),
        value: option.value
      }));
    });

    console.log('Scraped values:', dropdownValues);

    await browser.close();

    // Validate scraped data
    if (!dropdownValues.length) {
      throw new Error('No dropdown values found');
    }

    console.log("Inserting scraped dates...");

    // Store values in Supabase
    for (const date of dropdownValues) {
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
      JSON.stringify({ 
        success: true, 
        message: "Dates updated successfully",
        count: dropdownValues.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
