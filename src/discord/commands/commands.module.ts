import {
  ApplicationCommandOptionType,
  CommandInteractionOption,
} from 'discord.js';
import { DiscordCommandsController } from './commands.controller';

interface Command extends Partial<CommandInteractionOption> {
  type?: ApplicationCommandOptionType;
  description: string;
  function: Function;
  options?: CommandOptions[];
}

type CommandOptions = Omit<Command, 'function'> & {
  type: ApplicationCommandOptionType;
  name: string;
  required?: boolean;
};

const commands: Command[] = [
  {
    name: 'ping',
    description: 'Pong',
    function: new DiscordCommandsController().ping,
  },
  {
    name: 'ana',
    description: 'Ana',
    function: new DiscordCommandsController().ana,
  },
  {
    name: 'ligar-servidor',
    description: 'Inicia o servidor caso ele esteja offline',
    function: new DiscordCommandsController().startServer,
  },
  {
    name: 'enviar-mensagem',
    description: 'Envia uma mensagem para um canal',
    function: new DiscordCommandsController().sendServerMessage,
    options: [
      {
        name: 'mensagem',
        description: 'Mensagem a ser enviada',
        type: 3,
        required: true,
      },
      {
        name: 'canal',
        description: 'Canal para enviar a mensagem',
        type: 7,
        required: true,
      },
    ],
  },
  {
    name: 'backup',
    description: 'Inicia um backup do servidor',
    function: new DiscordCommandsController().startBackup,
  },
  {
    name: 'status',
    description: 'Mostra o status do servidor',
    function: new DiscordCommandsController().serverStatus,
  },
  {
    name: 'enviar-arte',
    description: 'Envie sua arte para o servidor',
    function: new DiscordCommandsController().submitArt,
    options: [
      {
        name: 'titulo',
        description: 'Título da arte',
        type: 3,
        required: true,
      },
      {
        name: 'imagem',
        description: 'Arquivo da arte',
        type: 11,
        required: true,
      },
      {
        name: 'autor',
        description: 'Autor da arte ',
        type: 6,
        required: true,
      },
    ],
  },
  {
    name: 'gerar-nicks',
    description: 'Gera nicks para o servidor',
    function: new DiscordCommandsController().generateMinecraftNicks,
  },
  {
    name: 'arquivar-ticket',
    description: 'Arquiva um ticket',
    function: new DiscordCommandsController().archiveTicket,
  },
  {
    name: 'hibridos',
    description: 'Verifica os híbridos do servidor',
    function: new DiscordCommandsController().getHybrids,
    options: [
      {
        name: 'nome-do-hibrido',
        description:
          'Caso queira visualizar um híbrido específico digite o nome dele',
        type: 3,
        required: false,
      },
      {
        name: 'cor-de-fundo',
        description: 'Coloca uma cor de fundo',
        type: 3,
        required: false,
      },
    ],
  },
  {
    name: 'criar-hibrido',
    description: 'Cria um híbrido',
    function: new DiscordCommandsController().registerHybrid,
    options: [
      {
        name: 'nome',
        description: 'Nome do híbrido',
        type: 3,
        required: true,
      },
      {
        name: 'animal',
        description: 'Animal do híbrido',
        type: 3,
        required: true,
      },
      {
        name: 'usuario',
        description: 'Usuário do híbrido',
        type: 6,
        required: true,
      },
      {
        name: 'imagem',
        description: 'Imagem do híbrido',
        type: 3,
        required: false,
      },
      {
        name: 'vidas',
        description: 'Vida do híbrido',
        type: 4,
        required: false,
      },
    ],
  },
  {
    name: 'listar-hibridos',
    description: 'Lista os híbridos do servidor',
    function: new DiscordCommandsController().listHybrids,
  },
  {
    name: 'registrar-jogador',
    description: 'Registra um jogador no servidor',
    function: new DiscordCommandsController().registerPlayer,
    options: [
      {
        name: 'nome',
        description: 'Nome do jogador',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'vincular-jogador-familia',
    description: 'Vincula um jogador a uma família',
    function: new DiscordCommandsController().bindPlayerToFamily,
    options: [
      {
        name: 'hibrido',
        description: 'ID do híbrido',
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: 'notificar-online',
    description: 'Notifica um jogador online',
    function: new DiscordCommandsController().handleNotification,
  },
  {
    name: 'notificar-offline',
    description: 'Notifica todos os jogadores online',
    function: new DiscordCommandsController().handleNotification,
  },
  {
    name: 'resetar-senha',
    description: 'Reseta a senha de um jogador',
    function: new DiscordCommandsController().resetPassword,
  },
];

function buildCommandsObject(commands: Command[]): Record<string, Command> {
  const commandsObject = {};
  commands.forEach((command) => {
    commandsObject[command.name] = command;
  });
  return commandsObject;
}

const commandsObject = buildCommandsObject(commands);

export { commandsObject, commands };
