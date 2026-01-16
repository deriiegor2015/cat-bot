import { Client, GatewayIntentBits, Collection } from "discord.js";
import dotenv from "dotenv";
import messageCreate from "./events/messageCreate.js";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.events = new Collection();
client.events.set("messageCreate", messageCreate);

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  messageCreate.execute(message, client);
});

client.login(process.env.TOKEN);
