const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const CHANNEL_ID = "1482112714376482816";
const VIDEO_URL = "https://www.youtube.com/watch?v=krQHQvtIr6w";
const VIDEO_ID = "krQHQvtIr6w";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error("DISCORD_BOT_TOKEN is not set.");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function postLink() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) return;

    const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${VIDEO_URL}&format=json`);
    const oembed = await oembedRes.json();

    const embed = new EmbedBuilder()
      .setTitle(oembed.title)
      .setURL(VIDEO_URL)
      .setImage(`https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg`)
      .setAuthor({ name: oembed.author_name })
      .setColor(0xFF0000);

    await channel.send({ embeds: [embed] });
    console.log("Posted at", new Date().toISOString());
  } catch (err) {
    console.error("Failed to post:", err);
  }
}

function msUntilNextHour() {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(now.getHours() + 1);
  return next.getTime() - now.getTime();
}

client.once("ready", () => {
  console.log("Logged in as", client.user.tag);
  setTimeout(() => {
    postLink();
    setInterval(postLink, 60 * 60 * 1000);
  }, msUntilNextHour());
});

client.login(token);
