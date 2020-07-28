const userModel = require("../models/users");

module.exports = {
  async create(chatId, username, phone, location) {
    try {
      const user = await userModel.create({
        username,
        chatId,
        phone,
        location,
      });
      return user;
    } catch (err) {
      return {
        error: err,
      };
    }
  },
  async getAll() {
    const result = await userModel.find();
    return result;
  },

  async check(chat) {
    const result = await userModel
      .findOne({
        chatId: chat,
      })
      .exec();
    if (result) {
      return false;
    } else {
      return true;
    }
  },
};
