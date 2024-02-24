import { CommandInteraction, Interaction } from 'discord.js';
import { ping } from './service/ping';
import { ana } from './service/ana';
import { startServer } from './service/start-server';
import { sendMessageInServerWithCommand } from './service/send-server-message';
import { DiscordRoleGuard } from 'src/guard/discord-role.guard';

export class Commands {
  constructor() {}
  ping(interaction: CommandInteraction) {
    ping(interaction);
  }
  ana(interaction: CommandInteraction) {
    ana(interaction);
  }
  startServer(interaction: CommandInteraction) {
    startServer(interaction);
  }

  async sendServerMessage(interaction: CommandInteraction) {
    await new DiscordRoleGuard().isAdmin(interaction);
    await sendMessageInServerWithCommand(interaction);
  }
}
