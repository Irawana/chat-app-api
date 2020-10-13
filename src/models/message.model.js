const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create mongoose schema for message
const schema = new Schema(
  {
    message: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
  },
  { timestamps: true }
);

schema.set("toJSON", {
  versionKey: false,
});

//Create message model for message
module.exports = mongoose.model("Message", schema);
