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

  let browser;
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Configure Puppeteer with browser-like headers
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage'
      ]
    });
    
    const page = await browser.newPage();
    
    // Set user agent to mimic Chrome browser
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Navigate with longer timeout
    await page.goto('http://www.itda.gov.eg/jurnal-sgl.aspx', {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    // Wait for dropdown to exist in DOM
    await page.waitForSelector('#DropDownList1', { timeout: 15000 });

    // Extract options with proper ordering
    const dropdownValues = await page.evaluate(() => {
      const select = document.getElementById('DropDownList1');
      return Array.from(select.options).map(option => ({
        name: option.textContent.trim(),
        value: option.value.trim()
      }));
    });

    console.log('Scraped values:', dropdownValues);

    if (!dropdownValues.length) {
      throw new Error('No dropdown values found after rendering');
    }

    // Delete existing entries
    const { error: deleteError } = await supabaseClient
      .from('journal_sources')
      .delete()
      .neq('id', 0);

    if (deleteError) throw deleteError;

    // Batch insert for better performance
    const { error: insertError } = await supabaseClient
      .from('journal_sources')
      .insert(dropdownValues);

    if (insertError) throw insertError;

    return new Response(
      JSON.stringify({ 
        success: true, 
        count: dropdownValues.length 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Full error:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        debug: "Ensure Puppeteer dependencies are installed in your environment"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  } finally {
    if (browser) await browser.close();
  }
});
