import { CommandInteraction } from 'discord.js';
import { DiscordRoleGuard } from 'src/guard/discord-role.guard';
import { DiscordAnaService } from './service/ana.service';
import { DiscordPingService } from './service/ping.service';
import { DiscordSendMessageInServerWithCommand } from './service/send-server-message.service';
import { DiscordServerStatusService } from './service/server-status.service';
import { DiscordStartBackupService } from './service/start-backup.service';
import { DiscordStartServer } from './service/start-server.service';
import { DiscordSubmitArtService } from './service/submit-art.service';
import { DiscordGenerateMinecraftNicksService } from './service/generate-minecraft-nicks.service';

export class DiscordCommandsController {
  constructor() {}
  ping(interaction: CommandInteraction) {
    return new DiscordPingService().handle(interaction);
  }
  ana(interaction: CommandInteraction) {
    return new DiscordAnaService().handle(interaction);
  }

  async startServer(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new DiscordStartServer().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async sendServerMessage(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new DiscordSendMessageInServerWithCommand().handle(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async startBackup(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new DiscordStartBackupService().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async serverStatus(interaction: CommandInteraction) {
    try {
      return await new DiscordServerStatusService().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async submitArt(interaction: CommandInteraction) {
    try {
      return await new DiscordSubmitArtService().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async generateMinecraftNicks(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new DiscordGenerateMinecraftNicksService().handle(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
