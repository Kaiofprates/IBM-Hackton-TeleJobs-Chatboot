const { bot } = require("./servers/telegram");
const { sendMessage, getSessionId } = require("./servers/watson");
const { getCache, setCache } = require("./servers/redis");
const db = require("./controllers/userController");
require("dotenv/config");

async function getAllusers(id) {
  const result = await db.getAll();
  bot.sendMessage(id, result.toString());
  return result;
}

async function createUser(c, u, phone, location) {
  const check = await db.check(c);
  if (check) {
    const result = await db.create(c, u, phone, location);
    bot.sendMessage(c, result.toString());
    bot.sendLocation(c, result.location[0], result.location[1]);
  } else {
    bot.sendMessage(c, "Erro ao cadastrar");
  }
}
//------------------
// bot.onText(/login/, async (msg) => {
//   if (msg.chat.id && msg.chat.username) {
//     createUser(msg.chat.id, msg.chat.username);
//   }
// });

bot.onText(/Ananda/, async (msg) => {
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
            if (msg.chat.id && msg.chat.username) {
              createUser(msg.chat.id, user, msg.contact.phone_number, [
                latitude,
                longitude,
              ]);
            }
          });
        }
      } else {
        let id = await getSessionId();
        console.log(id);
        setCache(chatId, id.result.session_id);
        bot.sendMessage(
          chatId,
          "Oiii, não consegui te entender! Diga novamente!"
        );
      }
    } catch (err) {}
  }
});
