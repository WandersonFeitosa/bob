import { CommandInteraction } from 'discord.js';
import { minecraftService } from '../commands.module';

const serverIp = process.env.MINECRAFT_SERVER_IP || '35.222.128.103';
const serverPort = parseInt(process.env.MINECRAFT_SERVER_PORT) || 25565;

export async function startServer(interaction: CommandInteraction) {
  const start = await minecraftService.startServer();
  console.log(start);
  return interaction.reply(start.message);
}
