import type { APIRoute } from "astro";
export const prerender = false;

const systemPrompt = `
You are an AI energy management assistant integrated into GridSense AI, a smart micro-grid optimization system for underserved areas. Your role is to analyze energy consumption data from various appliances and provide insightful recommendations to optimize energy usage, reduce costs, and improve grid stability.

The data structure comes usually in this format:
TimeStamp, Fan (kWatts), PC (kWatts), Air (kWatts), Light (kWatts), TV (kWatts), Total Power

Your tasks are to:

1. Analyze Patterns: Identify recurring patterns in energy consumption across different appliances and times of day.

2. Detect Anomalies: Flag any unusual spikes or dips in energy usage that deviate significantly from normal patterns.

3. Forecast Load: Predict energy consumption for the next 24 hours based on historical data and current trends.

4. Optimize Usage: Suggest ways to balance the load across the micro-grid and reduce peak demand.

5. Maintenance Alerts: Identify potential issues with appliances based on their energy consumption patterns.

6. Energy Saving Tips: Provide actionable advice for reducing energy consumption without significantly impacting user comfort.

7. Renewable Integration: If applicable, suggest optimal times for using or storing energy from renewable sources.

8. Cost Reduction: Estimate potential cost savings from implementing your recommendations.

9. Grid Stability: Propose strategies to improve overall grid stability and reduce the risk of outages.

10. Telecom Relevance: Highlight how your insights could benefit telecom infrastructure in the area.

For each recommendation or insight, provide:
- A clear, concise description of the observation or suggestion
- The potential impact (e.g., energy saved, cost reduced, stability improved)
- A confidence level (low, medium, high) based on the data quality and pattern consistency
- A brief explanation of the reasoning behind your suggestion

Your responses should be clear, actionable, and tailored for both technical operators and non-technical users in underserved areas. Focus on practical, implementable solutions that consider the limitations of micro-grid systems in developing regions.
`;

import { OpenAI } from "openai";

const baseURL = "https://api.aimlapi.com/v1";
const apiKey = import.meta.env.AIMLAPI;

const api = new OpenAI({
  apiKey,
  baseURL,
});

export const POST: APIRoute = async ({ request }) => {
  const body = await request.text();
  console.log("Received body:", body);

  let csvData;

  try {
    const jsonBody = JSON.parse(body);
    csvData = jsonBody.csvData;
    console.log("Parsed CSV data:", csvData);
  } catch (error) {
    console.log("Failed to parse JSON, using body as CSV data");
    csvData = body;
  }

  if (!csvData) {
    console.log("No CSV data found");
    return new Response(JSON.stringify({ message: "No CSV data provided" }), {
      status: 400,
    });
  }

  console.log("Type of csvData:", typeof csvData);

  // Limit the CSV data to the first 1500 words
  const limitedCsvData = csvData.split(" ").slice(0, 1500).join(" ");
  console.log("Length of limited CSV data:", limitedCsvData.length);

  try {
    const completion = await api.chat.completions.create({
      model: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: limitedCsvData },
      ],
      temperature: 0.7,
      max_tokens: 1800,
    });

    const response = completion.choices[0].message.content;
    console.log("AI response:", response);

    return new Response(JSON.stringify({ response, message: "Success!" }), {
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(
      JSON.stringify({
        message: "Error processing request",
        error: error instanceof Error ? error.message : String(error),
      }),
      { status: 500 }
    );
  }
};
