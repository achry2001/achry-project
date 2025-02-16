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

    // Fetch webpage
    const response = await fetch('http://www.itda.gov.eg/jurnal-sgl.aspx');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const html = await response.text();

    // Fixed regex pattern to find dropdown
    const selectMatch = html.match(/<select[^>]*id="DropDownList1"[^>]*>([\s\S]*?)<\/select>/i);
    if (!selectMatch) throw new Error('Dropdown container not found');

    // Extract options with value/text
    const options = [];
    const optionRegex = /<option\s+value="(\d+)"[^>]*>([^<]+)<\/option>/gi;
    let match;
    
    while ((match = optionRegex.exec(selectMatch[0])) !== null) {
      options.push({
        value: match[1],  // The numeric value (e.g., "881")
        name: match[2].trim()  // The Arabic text (e.g., "ديسمبر - 2024")
      });
    }

    if (!options.length) throw new Error('No options found in dropdown');

    // Clear existing data
    const { error: deleteError } = await supabaseClient
      .from('journal_sources')
      .delete()
      .neq('id', 0);

    if (deleteError) throw deleteError;

    // Insert new data
    const { error: insertError } = await supabaseClient
      .from('journal_sources')
      .insert(options);

    if (insertError) throw insertError;

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
