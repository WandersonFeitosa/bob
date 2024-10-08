import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app/app.module';
import {
  ActivitiesOptions,
  Client,
  Events,
  GatewayIntentBits,
  Interaction,
  Partials,
  REST,
  Routes,
} from 'discord.js';
import { commands, commandsObject } from './discord/commands/commands.module';
import { ValidationPipe } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DiscordEventsModule } from './discord/events/events.module';

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
const token = process.env.DISCORD_TOKEN;
const client_id = process.env.CLIENT_ID;
const prod: string = process.env.NODE_ENV || 'production';

const rest = new REST({ version: '10' }).setToken(token);

async function startDiscordConnection() {
  console.log('Updating Discord commands...');

  await rest.put(Routes.applicationCommands(client_id), {
    body: commands.map((command) => {
      return {
        name: command.name,
        description: command.description,
        options: command.options,
      };
    }),
  });

  console.log('Discord commands updated');

  console.log('Starting Discord connection...');
  await client.login(token);
  console.log('Discord connection started');

  client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    let activities: ActivitiesOptions[] = [
      {
        name: 'ele falar bosta ⬇⬇⬇',
        type: 2,
      },
    ];

    if (prod === 'develop') {
      activities = [
        {
          name: 'clonando o buba',
          type: 0,
        },
      ];
    }

    client.user?.setPresence({
      activities,
      status: 'online',
    });
  });

  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    try {
      if (!interaction.isChatInputCommand()) return;
      console.log(
        `[Discord.Commands]: ${interaction.user.tag} in #${interaction.channel.name} used command: ${interaction.commandName}`,
      );
      return commandsObject[interaction.commandName].function(interaction);
    } catch (error) {
      console.log(error);
    }
  });

  client.on(Events.MessageReactionAdd, async (reaction, user) => {
    await new DiscordEventsModule().reactionAdd(reaction, user);
  });

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;
    await new DiscordEventsModule().messageCreate(message);
  });
}

async function bootstrap() {
  await startDiscordConnection();
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(process.env.PORT || 3000);
  console.log(`Server started on port ${process.env.PORT || 3000}`);
}

bootstrap();
