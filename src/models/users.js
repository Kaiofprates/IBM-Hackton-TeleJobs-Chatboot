const mongoose = require("./index");

const Schema = mongoose.Schema;

const users = new Schema({
  username: { type: String, required: false, unique: true },
  chatId: { type: String, required: true, unique: true },
  phone: { type: String, required: false, unique: true },
  location: { type: [Number], required: false },
});

const userModel = mongoose.model("User", users);
module.exports = userModel;
