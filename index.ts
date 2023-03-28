import { Client, Message, TextChannel } from 'discord.js';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client();
const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
});

client.on('message', (message: Message) => {
  if (message.channel.id === CHANNEL_ID && message.member?.roles.cache.size === 1) {
    // check if message was sent in specific channel and user has only default role (new user)
    const userId = message.author.id;
    const welcomeData = readWelcomeData();
    if (!welcomeData[userId]) {
      message.author.send('Welcome to the server! Thanks for joining us!');
      welcomeData[userId] = true;
      writeWelcomeData(welcomeData);
    }
  }
});

function readWelcomeData(): Record<string, boolean> {
  try {
    const data = fs.readFileSync('welcome-data.json');
    return JSON.parse(data.toString());
  } catch (error) {
    console.error(error);
    return {};
  }
}

function writeWelcomeData(data: Record<string, boolean>) {
  try {
    fs.writeFileSync('welcome-data.json', JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

client.login(TOKEN);