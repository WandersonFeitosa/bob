
<h1>Bob</h1>

  

<p  align="center">

  

  
<img  src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
<img  src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white"/>
<img  src="https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white"/>
<img  src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
<img  src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&logo=discord&logoColor=white"/>

  

</p>

  

### Tópicos

  

:small_blue_diamond: [Descrição do projeto](#descrição-do-projeto)

  

:small_blue_diamond: [Funcionamento da aplicação](#funcionamento-da-aplicação)

 
  

## Descrição do projeto

  

<p  align="justify">

  
O Bob foi criado com o intuítito de permitir que os administradores da comunidade do TCSMP pudessem através da interface do discord pudessem gerenciar ações dentro do jogo sem a necessadidade de um conhecimento técnico.

Outro motivo por trás da concepção do bot foi realizar ações também dentro do próprio servidor para aproxima a comunidade ou facilitar a comunicação com a administração

  

</p>

  

## Funcionamento da aplicação

 A aplicação possui duas formas de interação, através de chamadas HTTP, em rotas que são gerenciadas pelo [NestJS](https://nestjs.com/), e através do chat do discord, por meio de comandos, que é gerenciado através da biblioteca [DiscordJS](https://discord.js.org/).
 
 A aplicação possui uma forte integração com a [Google Cloud Plataform](https://cloud.google.com/), sendo hospedada dentro um cluster do [Google Kubernetes Engine](https://cloud.google.com/kubernetes-engine?hl=pt_br), tendo o banco de dados dentro do [Cloud SQL](https://cloud.google.com/sql/), e utilizando buckets de armazenamento do [Google Cloud Storage](https://cloud.google.com/storage/).

Dentre suas principais funções a aplicação tem como:

- **Gerenciamento de acesso ao servidor do jogo**
-- Através de um canal do discord é possível adquirir permissão para acessar o servidor do jogo, apenas enviando o nome de usuário

- **Gerenciamento de estado do servidor**
-- É possível desligar ou ligar os servidor através de comandos do discord
-- Aplicação é responsável pelo health check do servidor do jogo, onde caso ele venha a ficar offline é feito o início automático do servidor

- **Controle de backups**
-- É possível realizar um backup do servidor através de um comando do discord, onde será feito todo o processo de compressão e envio para um bucket do Google Cloud Storage
-- Diariamente a aplicação realiza uma solicitação de backup do servidor do jogo que é enviado para o Google Cloud Storage

- **Gerenciamento de comunidade**
-- A aplicação é responsável por gerenciar artes feitas pelos jogadores, gerenciando o processo de aprovação pelos administradores e salvando as imagens no mural da comunidade e armazenando também em um bucket do Google Cloud Storage para exibição na página do servidor
  

##

  
