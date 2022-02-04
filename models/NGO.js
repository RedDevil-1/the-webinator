const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const bcrypt = require("bcryptjs");
const NGOSchema = new mongoose.Schema(
  {
    NGOname: {
      type: String,
      required: true,
    },
    Uname: {
      type: String,
      maxlength: 32,

      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    BankName: {
      type: String,
    },
    BankAccountNumber: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    Btype: {
      type: String,
    },
  },
  { timestamps: true }
);
NGOSchema.pre("save", function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    bcrypt.genSalt(10, function (saltError, salt) {
      if (saltError) {
        return next(saltError);
      } else {
        bcrypt.hash(user.password, salt, function (hashError, hash) {
          if (hashError) {
            return next(hashError);
          }

          user.password = hash;
          next();
        });
      }
    });
  } else {
    return next();
  }
});

NGOSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("NGO", NGOSchema);
