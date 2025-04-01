
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Navigate to the page
    await page.goto("http://www.itda.gov.eg/jurnal-sgl.aspx");

    // Wait for dropdown and select desired month/year
    await page.waitForSelector('#DropDownList1');
    await page.select('#DropDownList1', 'ديسمبر - 2024');
    
    // Wait for page to load after selection
    await page.waitForTimeout(5000);

    // Extract PDF links
    const pdfLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href$=".pdf"]'));
      return links.map(link => ({
        url: link.getAttribute('href'),
        name: link.textContent?.trim() || 'Untitled'
      }));
    });

    // Process each PDF
    for (const pdf of pdfLinks) {
      const baseUrl = "http://www.itda.gov.eg";
      const fullUrl = pdf.url?.startsWith('http') ? pdf.url : `${baseUrl}/${pdf.url?.startsWith('/') ? pdf.url.slice(1) : pdf.url}`;
      
      try {
        // Download PDF
        const response = await fetch(fullUrl);
        if (!response.ok) throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        
        const pdfBlob = await response.blob();
        const buffer = await pdfBlob.arrayBuffer();
        
        // Upload to Supabase Storage
        const fileName = `${pdf.name.replace(/[^\x00-\x7F]/g, '')}_${Date.now()}.pdf`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pdf-storage')
          .upload(`pdfs/${fileName}`, buffer, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (uploadError) throw uploadError;

        // Create database entry
        const { error: dbError } = await supabase
          .from('pdfs')
          .insert({
            name: pdf.name,
            status: 'pending',
            url: uploadData?.path,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (dbError) throw dbError;

        console.log(`Successfully processed: ${pdf.name}`);
      } catch (error) {
        console.error(`Error processing ${pdf.name}:`, error);
      }
    }

    await browser.close();

    return new Response(
      JSON.stringify({ message: 'PDF crawling completed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Crawling error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to crawl PDFs', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
