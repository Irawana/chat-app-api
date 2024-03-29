const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create mongoose schema for user
const schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, unique: true, required: true, index: true },
  password: { type: String, required: true },
  isLoggedIn: { type: Boolean, default: false }
});

schema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    //Don't return password in response
    delete ret.password;
  },
});

//Create mongoose schem
module.exports = mongoose.model("User", schema);
