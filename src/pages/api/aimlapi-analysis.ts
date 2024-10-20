import type { APIRoute } from "astro";
export const prerender = false;

const systemPrompt = `
Based on the provided CSV data, here's a summary of the energy consumption patterns:

1. Peak Usage: The highest energy consumption typically occurs between 6 PM and 9 PM.
2. Low Usage: The lowest energy consumption is generally observed between 2 AM and 5 AM.
3. Daily Patterns: There's a consistent increase in energy usage starting around 6 AM, coinciding with the start of the day.
4. Weekend vs Weekday: Weekend consumption patterns differ slightly, with later morning peaks and higher midday usage.
5. Seasonal Trends: Energy consumption is higher during summer months, likely due to increased air conditioning use.
6. Anomalies: There were a few instances of unusually high consumption, which may warrant further investigation.
7. Energy Efficiency: Overall, the community's energy usage seems to follow expected patterns, but there's room for optimization during peak hours.

Recommendations:
1. Implement smart scheduling of high-energy appliances to avoid peak hours.
2. Encourage the use of energy-efficient appliances and practices.
3. Consider installing solar panels to offset daytime energy consumption.
4. Investigate the cause of anomalous high-consumption events.
5. Develop a community awareness program about energy-saving practices.
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
