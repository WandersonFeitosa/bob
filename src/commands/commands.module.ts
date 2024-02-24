import { Commands } from './commands.controller';

interface Command {
  name: string;
  description: string;
  function: (...args: any[]) => any;
  options?: CommandOptions[];
}
interface CommandOptions {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  choices?: any[];
  options?: any[];
}

const commands: Command[] = [
  {
    name: 'ping',
    description: 'Pong',
    function: new Commands().ping,
  },
  {
    name: 'ana',
    description: 'Ana',
    function: new Commands().ana,
  },
  {
    name: 'ligar-servidor',
    description: 'Inicia o servidor caso ele esteja offline',
    function: new Commands().startServer,
  },
  {
    name: 'enviar-mensagem',
    description: 'Envia uma mensagem para um canal',
    function: new Commands().sendServerMessage,
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
