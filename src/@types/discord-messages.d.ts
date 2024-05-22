import { User } from 'discord.js';

export interface DiscordChannelMessage {
  channelId: string;
  guildId: string;
  id: string;
  createdTimestamp: number;
  type: number;
  system: boolean;
  content: string;
  author: User;
  pinned: boolean;
  tts: boolean;
  nonce: any;
  embeds: any[];
  components: any[];
  attachments: any;
  stickers: any;
  position: any;
  roleSubscriptionData: any;
  editedTimestamp: any;
  reactions: any;
  mentions: any;
  webhookId: any;
  groupActivityApplication: any;
  applicationId: any;
  activity: any;
  flags: any;
  reference: any;
  interaction: any;
}
