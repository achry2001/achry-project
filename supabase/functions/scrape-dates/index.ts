import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import * as cheerio from 'https://esm.sh/cheerio@1.0.0'; // HTML parser

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

    // Fetch webpage
    const response = await fetch('http://www.itda.gov.eg/jurnal-sgl.aspx');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();

    // Load HTML into Cheerio
    const $ = cheerio.load(html);
    
    // Find the dropdown and its options
    const dropdown = $('#DropDownList1');
    if (!dropdown.length) throw new Error('Dropdown not found');

    // Extract options with original order
    const options = [];
    dropdown.find('option').each((index, element) => {
      options.push({
        value: $(element).attr('value'),
        name: $(element).text().trim(),
        original_order: index // Preserve original position
      });
    });

    if (!options.length) throw new Error('No options found');

    // Clear existing data
    await supabaseClient.from('journal_sources').delete().neq('id', 0);

    // Insert new data
    const { error } = await supabaseClient
      .from('journal_sources')
      .insert(options);

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, count: options.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message, success: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
