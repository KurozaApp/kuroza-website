export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const payload = JSON.parse(event.body);
    const webhookUrl = process.env.DEPLOY_DISCORD_WEBHOOK;

    // Extract key info from Netlify deploy webhook
    const {
      state,
      branch,
      commit_ref,
      commit_url,
      deploy_time,
      context,
      deploy_url,
      error_message,
      created_at,
    } = payload;

    // Pick colors and emojis depending on build state
    const status =
      state === "ready"
        ? { emoji: "✅", color: 0x57f287, text: "Deploy Succeeded" }
        : state === "error"
        ? { emoji: "❌", color: 0xed4245, text: "Deploy Failed" }
        : { emoji: "ℹ️", color: 0x5865f2, text: `State: ${state}` };

    // Format timestamp
    const timestamp = created_at || new Date().toISOString();

    const embed = {
      title: `${status.emoji} ${status.text}`,
      color: status.color,
      fields: [
        { name: "🌿 Branch", value: branch || "_(unknown)_", inline: true },
        {
          name: "⏱ Build Time",
          value: deploy_time ? `${deploy_time}s` : "_(n/a)_",
          inline: true,
        },
        {
          name: "🔗 Commit",
          value: commit_ref
            ? `[${commit_ref.substring(0, 7)}](${commit_url})`
            : "_(none)_",
          inline: true,
        },
        {
          name: "🌍 Context",
          value: context || "_(none)_",
          inline: true,
        },
        {
          name: "📡 Deploy URL",
          value: deploy_url ? `[View Site](${deploy_url})` : "_(none)_",
          inline: true,
        },
      ],
      timestamp,
      footer: {
        text: "Netlify Deploy Bot",
      },
    };

    if (error_message) {
      embed.fields.push({
        name: "⚠️ Error",
        value: `\`\`\`${error_message}\`\`\``,
        inline: false,
      });
    }

    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error("Discord webhook error:", err);
    return { statusCode: 500, body: "Internal Server Error" };
  }
}
