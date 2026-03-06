require('dotenv').config();

module.exports = {
  PTERO_API_URL: process.env.PTERO_API_URL,
  PTERO_API_KEY: `Bearer ${process.env.PTERO_API_KEY}`,
  SERVER_ID: process.env.SERVER_ID,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  DISCORD_CHANNEL_ID: process.env.DISCORD_CHANNEL_ID,
  forceNotify: true
};