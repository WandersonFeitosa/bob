import { CategoryChannelResolvable, CommandInteraction } from 'discord.js';
import { client } from 'src/main';

export class DiscordArchiveTicketService {
  async handle(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const ticketCategoryId = process.env.TICKET_CATEGORY_ID;
    const archiveTicketCategoryId = process.env.ARCHIVE_TICKET_CATEGORY_ID;

    const channel = interaction.channel;
    const category = channel.parent;

    if (category.id !== ticketCategoryId) {
      interaction.reply({
        content: 'Esse comando só pode ser executado em um ticket ativo',
        ephemeral: true,
      });
      return;
    }

    const archiveCategory = client.channels.cache.get(
      archiveTicketCategoryId,
    ) as CategoryChannelResolvable;

    await interaction.guild.channels.edit(channel, {
      parent: archiveCategory,
      permissionOverwrites: [],
    });

    interaction.reply('Ticket arquivado com sucesso');
  }
}
