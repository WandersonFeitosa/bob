import { UnauthorizedException } from '@nestjs/common';
import { CommandInteraction } from 'discord.js';
import { client } from 'src/main';

export class DiscordRoleGuard {
  async isAdmin(interaction: CommandInteraction): Promise<boolean> {
    try {
      const userId = interaction.user.id;
      const server_id = process.env.SERVER_ID as string;
      const adminRoles = process.env.ADMIN_ROLES?.split(',') as string[];
      const guild = client.guilds.cache.get(server_id);

      const user = guild?.members.cache.get(userId);

      if (!user) return false;

      const userRoles = user.roles.cache.map((role) => role.id);

      const hasAdminRole = userRoles.some((role) => adminRoles.includes(role));

      if (!hasAdminRole) {
        await interaction.reply({
          content: 'Você não tem permissão para executar este comando',
          ephemeral: true,
        });
        throw new UnauthorizedException(
          `${interaction.user.username} does not have permission to execute ${interaction.commandName} command`,
        );
      }
    } catch (error: any) {
      if (error instanceof UnauthorizedException) {
        throw error.message;
      } else {
        throw new Error('Error checking user roles');
      }
    }
  }
}
