import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY")!;

    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await anonClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch user data
    const [profileRes, goalsRes, investmentsRes] = await Promise.all([
      supabaseClient.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
      supabaseClient.from("goals").select("*").eq("user_id", user.id),
      supabaseClient.from("investments").select("*").eq("user_id", user.id),
    ]);

    const profile = profileRes.data;
    const goals = goalsRes.data || [];
    const investments = investmentsRes.data || [];

    const riskProfile = profile?.risk_profile || "moderate";
    const totalInvested = investments.reduce((sum: number, inv: any) => sum + Number(inv.cost_basis), 0);
    const totalCurrentValue = investments.reduce((sum: number, inv: any) => sum + Number(inv.current_value), 0);

    // Build allocation breakdown
    const allocationByType: Record<string, number> = {};
    investments.forEach((inv: any) => {
      const type = inv.asset_type;
      allocationByType[type] = (allocationByType[type] || 0) + Number(inv.current_value);
    });

    const prompt = `You are a financial advisor AI. Based on the following user profile, generate personalized investment recommendations.

User Profile:
- Risk Profile: ${riskProfile}
- Total Invested: $${totalInvested.toFixed(2)}
- Current Portfolio Value: $${totalCurrentValue.toFixed(2)}
- Number of Goals: ${goals.length}
- Current Allocation: ${JSON.stringify(allocationByType)}
- Active Goals: ${goals.filter((g: any) => g.status === 'active').map((g: any) => `${g.title} ($${g.target_amount} by ${g.target_date})`).join(', ') || 'None'}

Provide a JSON response with exactly this structure:
{
  "title": "Brief recommendation title",
  "recommendation_text": "2-3 paragraph detailed recommendation",
  "suggested_allocation": {
    "stocks": <percentage>,
    "etfs": <percentage>,
    "mutual_funds": <percentage>,
    "bonds": <percentage>,
    "cash": <percentage>
  }
}

Base the allocation on their risk profile:
- Conservative: More bonds/cash, fewer stocks
- Moderate: Balanced mix
- Aggressive: More stocks/ETFs, fewer bonds

Only respond with valid JSON, no markdown.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${lovableApiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      throw new Error("AI service unavailable");
    }

    const aiData = await aiResponse.json();
    const content = aiData.choices[0].message.content;
    
    // Parse AI response
    let recommendation;
    try {
      recommendation = JSON.parse(content);
    } catch {
      // Try extracting JSON from markdown code blocks
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse AI response");
      }
    }

    // Save to database
    const { data, error } = await supabaseClient
      .from("recommendations")
      .insert({
        user_id: user.id,
        title: recommendation.title,
        recommendation_text: recommendation.recommendation_text,
        suggested_allocation: recommendation.suggested_allocation,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
