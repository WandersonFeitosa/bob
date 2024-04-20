import { CommandInteraction } from 'discord.js';
import { minecraftService } from '../commands.module';


export async function serverStatus(interaction: CommandInteraction) {
  const ping = await minecraftService.health();
  console.log(ping);
  return interaction.reply(ping.message);
}
