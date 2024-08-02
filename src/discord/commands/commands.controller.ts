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
import { DiscordArchiveTicketService } from './service/archive-ticket.service';
import { DiscordHybridsService } from './service/hybrids.service';
import { DiscordPlayersService } from './service/players.service';
import { DiscordNotificationService } from './service/notification.service';
import { DiscordServerCommandsService } from './service/server-commands.service';

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
      return await new DiscordGenerateMinecraftNicksService().handle(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async archiveTicket(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new DiscordArchiveTicketService().handle(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async getHybrids(interaction: CommandInteraction) {
    try {
      return await new DiscordHybridsService().generateHybridArt(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async registerHybrid(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new DiscordHybridsService().handleRegisterHybrid(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }
  async listHybrids(interaction: CommandInteraction) {
    try {
      return await new DiscordHybridsService().handleListHybrids(interaction);
    } catch (error) {
      console.log(error);
    }
  }

  async registerPlayer(interaction: CommandInteraction) {
    try {
      return await new DiscordPlayersService().handleRegisterPlayer(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async bindPlayerToFamily(interaction: CommandInteraction) {
    try {
      return await new DiscordPlayersService().handleBindPlayerToFamily(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async handleNotification(interaction: CommandInteraction) {
    try {
      return await new DiscordNotificationService().handleNotification(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(interaction: CommandInteraction) {
    try {
      await new DiscordRoleGuard().isAdmin(interaction);
      return await new DiscordServerCommandsService().resetPassword(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }

  async checkNonRegisteredPlayers(interaction: CommandInteraction) {
    try {
      return await new DiscordPlayersService().checkNonRegisteredPlayers(
        interaction,
      );
    } catch (error) {
      console.log(error);
    }
  }
}
