import { CommandInteraction, Interaction } from 'discord.js';
import { ping } from './service/ping';
import { ana } from './service/ana';
import { startServer } from './service/start-server';
import { sendMessageInServerWithCommand } from './service/send-server-message';
import { DiscordRoleGuard } from 'src/guard/discord-role.guard';
import { dummy } from './service/dummy';
import { startBackup } from './service/start-backup';
import { serverStatus } from './service/server-status';

export class Commands {
  constructor() {}
  ping(interaction: CommandInteraction) {
    ping(interaction);
  }
  ana(interaction: CommandInteraction) {
    ana(interaction);
  }
  
  async startServer(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      startServer(interaction);
    } catch (error) {
      console.log(error);
    }    
  }

  async sendServerMessage(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      await sendMessageInServerWithCommand(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async startBackup(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      await startBackup(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async serverStatus(interaction: CommandInteraction) {
    try {
      await serverStatus(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async dummy(interaction: CommandInteraction) {
    dummy(interaction);
  }
}
