import {
  ChannelType,
  GuildChannelCreateOptions,
  OverwriteResolvable,
} from 'discord.js';
import { client } from 'src/main';

export function createChannel({
  name,
  categoryId,
  serverId,
  permissions,
}: {
  name: string;
  serverId: string;
  categoryId: string;
  permissions: OverwriteResolvable[];
}) {
  const guild = client.guilds.cache.get(serverId);

  const channelOptions: GuildChannelCreateOptions = {
    name: name,
    type: ChannelType.GuildText,
    parent: categoryId,
    permissionOverwrites: permissions,
  };

  console.log(channelOptions);
  const channel = guild.channels.create(channelOptions);
  return channel;
}
