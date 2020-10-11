const mongoose = require("mongoose");
const config = require("../../config");

//Connect to mongodb
mongoose.connect(config.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = {
  User: require("../models/user.model"),
};
