export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // Parse URL-encoded form data
    const formData = new URLSearchParams(event.body);

    // Honeypot check
    if (formData.get("bot-field")) {
      // Bot detected, ignore silently
      return { statusCode: 200, body: "Bot detected" };
    }

    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const webhookUrl = process.env.JOINUS_DISCORD_WEBHOOK;

    // Discord embed
    const embed = {
      title: "🚀 New Join Us Form Submission",
      color: 0xff0000, // Red
      fields: [
        { name: "👤 Name", value: name || "_(none)_", inline: true },
        { name: "📧 Email", value: email || "_(none)_", inline: true },
        { name: "💬 Message", value: message || "_(none)_", inline: false },
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: "Join Us Form",
      },
    };

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Discord webhook error:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
}
