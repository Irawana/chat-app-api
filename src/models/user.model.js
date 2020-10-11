const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false }, //TODO: remove later if not needed
});

schema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    //Don't return password in response
    delete ret.password;
  },
});

module.exports = mongoose.model("User", schema);
