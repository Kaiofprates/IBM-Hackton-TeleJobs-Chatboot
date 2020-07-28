const mongoose = require("mongoose");
require("dotenv/config");

const mongo = process.env.DB_ATLAS;
mongoose.connect(mongo, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
