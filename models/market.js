const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const marketSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: false,
    },
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    gType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

marketSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Market", marketSchema);
