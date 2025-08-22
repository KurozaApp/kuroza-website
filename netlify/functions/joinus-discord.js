// netlify/functions/join-webhook.js
import fetch from "node-fetch";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Netlify passes form submissions as JSON when using form notification → function
    const submission = JSON.parse(event.body);

    // Extract fields
    const { name, email, message } = submission.payload.data;

    // Build Discord message
    const discordMessage = {
      content: `🚀 **New Join Request**\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message: ${message || "_(none)_"}`,
    };

    // Send to Discord webhook
    await fetch(process.env.JOINUS_DISCORD_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(discordMessage),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sent to Discord" }),
    };
  } catch (err) {
    console.error("Discord webhook error:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
}
