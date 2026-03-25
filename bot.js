const { Client, GatewayIntentBits } = require("discord.js");

const CHANNEL_ID = "1482112714376482816";
const MESSAGE = "https://www.youtube.com/watch?v=krQHQvtIr6w";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) throw new Error("DISCORD_BOT_TOKEN is not set.");

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function postLink() {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (!channel || !channel.isTextBased()) return;
    await channel.send(MESSAGE);
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
