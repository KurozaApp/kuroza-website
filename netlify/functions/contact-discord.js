export async function handler(event) {
    try {
        if (event.httpMethod !== "POST") {
            return { statusCode: 405, body: "Method Not Allowed" };
        }

        const submission = JSON.parse(event.body);

        // Netlify sends form submissions inside `payload.data`
        const { name, email, message } = submission.payload.data;

        const webhookUrl = process.env.CONTACT_DISCORD_WEBHOOK;

        await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                content: `📩 **New Contact Form Submission**\n\n👤 Name: ${name}\n📧 Email: ${email}\n💬 Message:\n${message || "_(none)_"}`
            }),
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
