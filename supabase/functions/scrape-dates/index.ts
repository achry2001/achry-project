
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

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

    console.log('Fetching webpage...');
    
    // First, delete all existing entries
    const { error: deleteError } = await supabaseClient
      .from('journal_sources')
      .delete()
      .neq('id', 0); // This will delete all entries
    
    if (deleteError) {
      console.error("Error deleting existing entries:", deleteError);
    }

    // Fetch the webpage content
    const response = await fetch('http://www.itda.gov.eg/jurnal-sgl.aspx');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();

    // Extract dropdown values using regex
    const regex = /<option[^>]*value="([^"]*)"[^>]*>(.*?)<\/option>/g;
    const dropdownValues = [];
    let order = 0;
    
    // Declare match variable before using it in the loop
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[1] && match[2]) {
        dropdownValues.push({
          name: match[2].trim(),
          value: match[1].trim(),
          original_order: order++
        });
      }
    }

    console.log('Scraped values:', dropdownValues);

    // Validate scraped data
    if (!dropdownValues.length) {
      throw new Error('No dropdown values found');
    }

    console.log("Inserting scraped dates...");

    // Store values in Supabase with original order
    for (const date of dropdownValues) {
      const { error } = await supabaseClient
        .from('journal_sources')
        .upsert({ 
          name: date.name,
          value: date.value,
          original_order: date.original_order
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
