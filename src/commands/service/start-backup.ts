import axios from 'axios';
import { CommandInteraction } from 'discord.js';
import { prisma } from '../commands.module';

const serverIp = process.env.MINECRAFT_SERVER_IP || '35.222.128.103';
const serverPort = parseInt(process.env.MINECRAFT_SERVER_PORT) || 25565;
const managerPort = parseInt(process.env.MINECRAFT_MANAGER_PORT) || 3003;

export async function startBackup(interaction: CommandInteraction) {
  try {
    const server = await prisma.minecraftServerStatus.findFirst({
      where: {
        ip: serverIp,
        port: serverPort,
      },
    });

    await prisma.minecraftServerStatus.update({
      where: {
        id: server.id,
      },
      data: {
        status: 'backup',
      },
    });

    const response = await axios.get(
      `http://${serverIp}:${managerPort}/startBackup`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MINECRAFT_MANAGER_TOKEN}`,
        },
      },
    );

    return interaction.reply(response.data.message);
  } catch (error) {
    console.log(error);
  }
}
