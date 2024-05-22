import { CommandInteraction } from 'discord.js';
import { DiscordChannelMessage } from 'src/@types/discord-messages';

export class DiscordGenerateMinecraftNicksService {
  async handle(interaction: CommandInteraction) {
    const nicksChannelId = process.env.NICKS_CHANNEL_ID;
    const nicksChannel: any =
      interaction.guild.channels.cache.get(nicksChannelId);
    interaction.reply({
      content: 'Gerando lista de nicks...',
      ephemeral: true,
    });
    const messages: DiscordChannelMessage[] =
      await nicksChannel.messages.fetch();
    const nicks = messages.filter((message) => {
      return message.content.split(' ').length === 1;
    });
    const nicksArray = nicks.map((nick) => nick.content);
    const nicksString = nicksArray
      .map((nick) => `whitelist add ${nick}\n`)
      .join('');

    const nicksMessage = '```' + nicksString + '```';

    return interaction.followUp({
      content: nicksMessage,
      ephemeral: true,
    });
  }
}
