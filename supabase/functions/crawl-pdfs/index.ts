import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body to get the selected value
    const body = await req.json();
    const selectedValue = body.selectedValue;

    // Validate the input
    if (!selectedValue || typeof selectedValue !== "string") {
      throw new Error("selectedValue is required and must be a string");
    }

    console.log(`Received selectedValue: ${selectedValue}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Launch Puppeteer browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the webpage
    await page.goto("http://www.itda.gov.eg/jurnal-sgl.aspx", { waitUntil: "networkidle0" });

    // Wait for the dropdown to load
    await page.waitForSelector("#DropDownList1", { timeout: 10000 });

    // Select the user-provided value
    const selected = await page.select("#DropDownList1", selectedValue);

    // Verify the selection was successful
    if (!selected.includes(selectedValue)) {
      throw new Error(`Failed to select value: ${selectedValue}`);
    }

    // Log the selected value for verification
    const currentValue = await page.evaluate(() => {
      const select = document.querySelector("#DropDownList1");
      return select ? select.value : null;
    });
    console.log(`Currently selected value: ${currentValue}`);

    // Wait for PDF links to appear after selection
    await page.waitForSelector('a[href$=".pdf"]', { timeout: 10000 });

    // Extract PDF links
    const pdfLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href$=".pdf"]'));
      return links.map((link) => ({
        url: link.getAttribute("href"),
        name: link.textContent?.trim() || "Untitled",
      }));
    });

    console.log(`Found ${pdfLinks.length} PDF links`);

    // Check if any PDFs were found
    if (pdfLinks.length === 0) {
      throw new Error("No PDF links found for the selected date");
    }

    // Process each PDF
    for (const pdf of pdfLinks) {
      const baseUrl = "http://www.itda.gov.eg";
      const fullUrl = pdf.url?.startsWith("http")
        ? pdf.url
        : `${baseUrl}/${pdf.url?.startsWith("/") ? pdf.url.slice(1) : pdf.url}`;

      try {
        // Download the PDF
        const response = await fetch(fullUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }
        const pdfBlob = await response.blob();
        const buffer = await pdfBlob.arrayBuffer();

        // Upload to Supabase storage
        const fileName = `${pdf.name.replace(/[^\x00-\x7F]/g, "")}_${Date.now()}.pdf`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("pdf-storage")
          .upload(`pdfs/${fileName}`, buffer, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // Create a database entry
        const { error: dbError } = await supabase.from("pdfs").insert({
          name: pdf.name,
          status: "pending",
          url: uploadData?.path,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });

        if (dbError) throw dbError;

        console.log(`Successfully processed: ${pdf.name}`);
      } catch (error) {
        console.error(`Error processing ${pdf.name}:`, error);
      }
    }

    // Close the browser
    await browser.close();

    // Return success response
    return new Response(
      JSON.stringify({
        message: "PDF crawling completed successfully",
        pdfCount: pdfLinks.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Crawling error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to crawl PDFs",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
