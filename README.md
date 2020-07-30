# TeleJobs Works Chatbot

---

> > O Tele Jobs utiliza a plataforma do Telegram para linkar clientes e vendedores, trazendo uma lista de negócios cadastrados em paralelo à localização do cliente. Assim, um comprador consegue conhecer e agregar valor aos prestadores de serviço de sua região, valorizando o comércio local e regional.

## Toda essa interação é orquestrada pela inteligência artificial Watson da IBM, treinada para trazer mais fluidez à pesquisa e cadastro dentro do chat, dando um maior conforto tanto para o servidor que se cadastra, como para o cliente que busca um profissional específico.

#### Ferramentas utilizadas:

- Nodejs
- Telegram-bot-Api
- IBM Watson
- Atlas MongoDB
- Redis Server

---

### Para reproduzir o sistema são necessárias:

- [Nodejs e npm](https://nodejs.org/en/) instalados
- Configuração do [Redis](https://redis.io/download) localmente
- Um banco de dados [AtlasMongo](https://www.mongodb.com/cloud/atlas) configurado para permitir acesso de qualquer ip.
- Uma Skill do [Watson](https://us-south.assistant.watson.cloud.ibm.com/) configurada para atender aos pedidos dos usuários, um exemplo dessa skill está presente nesse repositório e pode importado para o Watson.
- Um bot do [Telegram](https://medium.com/tht-things-hackers-team/10-passos-para-se-criar-um-bot-no-telegram-3c1848e404c4) com suas devidas credenciais.

> > Instalação

- Clone o repositório
- Crie um arquivo .env baseado no envExample e insira suas variváveis de configuração.
- Rode o comando de instalação dentro do repositório: npm install
- Deixe o Redis-Server rodando em segundo plano.
- Rode o sistema: npm start
  > Note que esse bot funciona como um meio termo entre a api do Telegram e a inteligência artificial do Watson, permitindo que usuários possam fazer perguntas mais elaboradas do que variam a um bot comum. Cada resposta vinda do Watson passa primeiramente por nosso orquestrador, que decide qual ação escolhe fazer. Nesse caso, colhemos informações do usuário para um cadastro de sua atividade profissional, e mostramos uma lista de profissionais cadastrados para clientes que estejam à procura de profissionais. Para fins de MVP, esse bot repassa para o Watson somente as mensagens que começarem com a regex de seu nome.
