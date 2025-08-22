import fetch from "node-fetch";

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const payload = JSON.parse(event.body);

    // Netlify form submissions come with a "payload" structure
    const { name, email, message } = payload.data;

    // Send to Discord webhook
    const webhookUrl = process.env.CONTACT_DISCORD_WEBHOOK;

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `📩 **New Contact Form Submission**\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message:\n${message}`
      }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Sent to Discord" }),
    };
  } catch (error) {
    console.error("Error sending to Discord:", error);
    return { statusCode: 500, body: "Internal Server Error" };
  }
}
