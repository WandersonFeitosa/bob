import { CommandInteraction, Interaction } from 'discord.js';
import { DiscordRoleGuard } from 'src/guard/discord-role.guard';
import { CommandAnaService } from './service/ana.service';
import { CommandPingService } from './service/ping.service';
import { CommandSendMessageInServerWithCommand } from './service/send-server-message.service';
import { CommandServerStatusService } from './service/server-status.service';
import { CommandStartBackupService } from './service/start-backup.service';
import { CommandStartServer } from './service/start-server.service';
import { SubmitArtService } from './service/submit-art.service';

export class Commands {
  constructor() {}
  ping(interaction: CommandInteraction) {
    return new CommandPingService().handle(interaction);
  }
  ana(interaction: CommandInteraction) {
    return new CommandAnaService().handle(interaction);
  }

  async startServer(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new CommandStartServer().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async sendServerMessage(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new CommandSendMessageInServerWithCommand().handle(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async startBackup(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new CommandStartBackupService().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async serverStatus(interaction: CommandInteraction) {
    try {
      return await new CommandServerStatusService().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async submitArt(interaction: CommandInteraction) {
    try {
      return await new SubmitArtService().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }
}
