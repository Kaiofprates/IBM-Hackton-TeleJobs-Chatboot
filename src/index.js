const { bot } = require("./servers/telegram");
const { sendMessage, getSessionId } = require("./servers/watson");
const { getCache, setCache } = require("./servers/redis");
const db = require("./controllers/userController");
require("dotenv/config");

async function getAllusers(id) {
  const result = await db.getAll();
  bot.sendMessage(
    id,
    " LOGO A BAIXO UMA LISTA DOS PROFISSIONAIS  PERTO DE VOCÊ "
  );
  result.map((e) => {
    bot.sendMessage(
      id,
      `
     Nome: ${e.username ? e.username : "não informado"} 
     Telefone:  ${e.phone ? e.phone : "não informado"}
     ${e.job ? e.job : "Atividade: não informado"}
  
    `
    );
  });
  //bot.sendMessage(id, result.toString());
  return result;
}

async function createUser(c, u, phone, location) {
  try {
    const result = await db.create(c, u, phone, location);
    if (result) {
      // bot.sendMessage(c, u + " " + "Cadastrado com sucesso!");
    } else {
      bot.sendMessage(c, "Algo deu errado, tente novamente.");
    }
  } catch (err) {
    bot.sendMessage(c, "Erro ao cadastrar");
  }
}

async function updateJog(chatId, job) {
  const result = await db.updateJob(chatId, job);
  if (!result) {
    bot.sendMessage(
      chatId,
      `
    Muito bem, seu cadastro foi feito com sucesso!
    Se quiser uma lista de profissionais cadastrados é só pedir!
    `
    );
  } else {
    bot.sendMessage(
      chatId,
      "Algo aconteceu errado, tente efetuar o cadastro novamente"
    );
  }
}

bot.onText(/Atividade/, async (msg, match) => {
  updateJog(msg.chat.id, msg.text);
});

bot.onText(/Bruno/, async (msg) => {
  const chatId = msg.chat.id;
  console.log(chatId);

  if (msg.text.toLowerCase() == "ola") {
    try {
      let id = await getSessionId();
      console.log(id);
      setCache(chatId, id.result.session_id);
      session_id = true;
    } catch (err) {
      console.log(err);
    }
  } else if (msg.text) {
    try {
      let id = await getCache(chatId);
      if (id) {
        let response = await sendMessage(msg.text, id);
        if (response) {
          bot.sendMessage(chatId, response);
        }
        if (response == "users") {
          getAllusers(chatId);
        } else if (response == "login") {
          console.log("login");
          const opts = {
            reply_markup: JSON.stringify({
              keyboard: [
                [{ text: "Location", request_location: true }],
                [{ text: "Contact", request_contact: true }],
              ],
              resize_keyboard: true,
              one_time_keyboard: true,
            }),
          };
          let latitude;
          let longitude;
          let user;
          bot.sendMessage(
            msg.chat.id,
            "Tudo bem, preciso de sua localização e de seu telefone.",
            opts
          );
          bot.on("location", async (msg) => {
            user = msg.chat.username;
            latitude = msg.location.latitude;
            longitude = msg.location.longitude;
          });
          bot.on("contact", async (msg) => {
            console.log(msg.contact.phone_number);
            console.log(`
            ${user}
            ${latitude}
            ${longitude}
            `);
            if (msg.chat.id) {
              await createUser(msg.chat.id, user, msg.contact.phone_number, [
                latitude,
                longitude,
              ]);
              bot.sendMessage(
                msg.chat.id,
                `
Falta pouco!

Agora precisamos saber um pouco mais sobre suas atividades.
Descreva sua profissão seguindo o modelo: 

Atividade: Carpinteiro, Autonomo, Pedreiro, etc...

`
              );
            }
          });
        }
      } else {
        let id = await getSessionId();
        console.log(id);
        setCache(chatId, id.result.session_id);
        bot.sendPhoto(
          chatId,
          "https://image.freepik.com/vetores-gratis/robo-engracado-sorridente-fofo-acenando_92289-204.jpg"
        );
        bot.sendMessage(
          chatId,

          `
      Olá, Eu sou o Bruno do TeleJobs!
           
      Para se cadastrar, atualizar seus dados, ou pedir uma lista de profissionais 
      é só falar comigo que eu ficarei feliz em lhe atender. 
      Ah, eu gosto de ser chamado por meu nome :)
          `
        );
      }
    } catch (err) {}
  }
});
