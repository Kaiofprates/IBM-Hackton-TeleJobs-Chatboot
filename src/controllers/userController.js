const userModel = require("../models/users");

module.exports = {
  async create(chatId, username, phone, location) {
    try {
      const check = await userModel.find({ phone });
      console.log(check);
      if (!check) {
        const user = await userModel.create({
          username,
          chatId,
          phone,
          location,
          job: undefined,
        });
        return user;
      } else {
        const user = await userModel.updateOne({
          username,
          chatId,
          phone,
          location,
          job: undefined,
        });
        return error;
      }
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
  async updateJob(chatId, job) {
    const result = await userModel.find({ chatId });
    if (result) {
      const user = await userModel.update({
        chatId,
        job,
      });
    } else {
    }
  },
};
