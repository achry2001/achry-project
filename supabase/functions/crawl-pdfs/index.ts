import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS' // Added for clarity
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body to get the selected date
    const body = await req.json();
    const selectedDate = body.selectedDate;

    if (!selectedDate) {
      throw new Error("selectedDate is required in the request body");
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Construct the URL with the selected date
    const url = `http://www.itda.gov.eg/jurnal-sgl.aspx?date=${selectedDate}`;
    console.log(`Fetching webpage for date: ${selectedDate}`);

    // Fetch the webpage
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch webpage: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract PDF links using regex
    const pdfLinkRegex = /<a[^>]*href="([^"]*\.pdf)"[^>]*>([^<]+)<\/a>/g;
    const matches = [...html.matchAll(pdfLinkRegex)];

    const processedPdfs = [];

    // Process each PDF link
    for (const [, pdfUrl, pdfName] of matches) {
      try {
        const baseUrl = "http://www.itda.gov.eg";
        const fullUrl = pdfUrl.startsWith('http') ? pdfUrl : `${baseUrl}/${pdfUrl.startsWith('/') ? pdfUrl.slice(1) : pdfUrl}`;

        console.log(`Downloading PDF from: ${fullUrl}`);

        // Download the PDF
        const pdfResponse = await fetch(fullUrl);
        if (!pdfResponse.ok) {
          console.error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
          continue;
        }

        const pdfBlob = await pdfResponse.blob();
        const buffer = await pdfBlob.arrayBuffer();

        // Upload to Supabase Storage
        const fileName = `${pdfName.replace(/[^\x00-\x7F]/g, '')}_${Date.now()}.pdf`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('pdf-storage')
          .upload(`pdfs/${fileName}`, buffer, {
            contentType: 'application/pdf',
            upsert: false
          });

        if (uploadError) {
          console.error(`Upload error for ${pdfName}:`, uploadError);
          continue;
        }

        // Insert record into the pdfs table
        const { error: dbError } = await supabase
          .from('pdfs')
          .insert({
            name: pdfName,
            status: 'pending',
            url: uploadData?.path,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (dbError) {
          console.error(`Database error for ${pdfName}:`, dbError);
          continue;
        }

        processedPdfs.push({ name: pdfName, url: uploadData?.path });
        console.log(`Successfully processed: ${pdfName}`);
      } catch (error) {
        console.error(`Error processing PDF: ${error.message}`);
      }
    }

    if (processedPdfs.length === 0) {
      throw new Error(`No PDFs found for date: ${selectedDate}`);
    }

    // Return success response
    return new Response(
      JSON.stringify({
        message: `PDF crawling completed successfully for date: ${selectedDate}`,
        processed: processedPdfs.length,
        pdfs: processedPdfs
      }),
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
