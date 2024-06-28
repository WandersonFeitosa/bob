import { Injectable } from '@nestjs/common';

@Injectable()
export class NiucoMockService {
  getUsers(): any[] {
    return [
      {
        id: '0373e634-2d03-457e-a24d-2b0c8c3b7c37',
        name: 'John Connor',
        email: 'john.connor@niuco.com.br',
        status: 'enabled',
        role: 'admin',
        last_activity: 1649179152,
      },
      {
        id: '5fb75748-efa6-4d48-9930-14289d87466f',
        name: 'Kyle Reese',
        email: 'kyle.reese@gmail.com',
        status: 'enabled',
        role: 'editor',
        last_activity: 1649073600,
      },
      {
        id: '4c3dfa4c-3cee-4acb-b032-c09afad54ab4',
        name: 'Bob Esponja',
        email: 'bob.esponja@niuco.com.br',
        status: 'enabled',
        role: 'viewer',
        last_activity: 1649098800,
      },
      {
        id: '1e53b0f6-81a8-491e-9ae1-e24a2a2054bf',
        name: 'John Doe',
        email: 'john.doe@niuco.com.br',
        status: 'disabled',
        role: '',
        last_activity: 1617643152,
      },
      {
        id: '37d4da9f-a2ad-48b7-80d4-b4e8d0afed13',
        name: 'Mr. Robot',
        email: 'robot@niuco.com.br',
        status: 'enabled',
        role: 'system',
        last_activity: 1649179729,
      },
      {
        id: 'cc6df476-f552-4122-9c71-26d390c90326',
        name: 'Patrick Estrela',
        email: 'patrick.estrela@hotmail.com',
        status: 'enabled',
        role: 'viewer',
        last_activity: 1648487089,
      },
      {
        id: 'c8d9f436-0565-4776-b08a-1f5f05580c47',
        name: 'Robot Chicken',
        email: 'robot.chicken@niuco.com.br',
        status: 'enabled',
        role: 'system',
        last_activity: 1648834324,
      },
      {
        id: 'a2faabd2-26f8-4885-b006-e2ee9f71a76a',
        name: 'Rick Grimes',
        email: 'rick.grimes@niuco.com.br',
        status: 'disabled',
        role: '',
        last_activity: 1586108161,
      },
      {
        id: 'da5b56ee-87a4-4ce0-b504-0afcea8ef0ca',
        name: 'Tio Patinhas',
        email: 'tio.patinhas@gmail.com',
        status: 'enabled',
        role: 'viewer',
        last_activity: 1649345218,
      },
      {
        id: '52d609a3-0690-4043-8415-e78a2bd968f4',
        name: 'Homer Simpson',
        email: 'homer.simpson@hotmail.com',
        status: 'enabled',
        role: 'editor',
        last_activity: 1649241478,
      },
      {
        id: '7288a49f-d9da-48bf-a258-baaf9984c8c1',
        name: 'Bruce Wayne',
        email: 'bruce.wayne@niuco.com.br',
        status: 'disabled',
        role: 'editor',
        last_activity: 1586169478,
      },
    ];
  }
}
