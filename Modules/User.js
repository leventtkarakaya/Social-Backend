const mongoose = require("mongoose");
const validator = require("validator");
const AutoID = mongoose.Types.ObjectId;
const UserSchema = new mongoose.Schema(
  {
    id: AutoID,

    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
      validator: [validator.isEmail, "Lütfen geçerli bir email adresi giriniz"],
    },
    password: {
      type: String,
      required: true,
      min: 8,
      select: false,
    },
    passwordConfrim: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
      validate: {
        validator: function (e) {
          return e === this.password;
        },
        message: "Parolalar eşleşmiyor",
      },
    },
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    publications: [
      {
        type: mongoose.Types.ObjectId,
        ref: "ProfilePosts",
      },
    ],
    otp: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://cdn-icons-png.freepik.com/512/3828/3828065.png?ga=GA1.1.1316012144.1716721314",
    },
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    occupation: {
      type: String,
    },
    viewedProfile: {
      type: Number,
      default: 0,
    },
    impressions: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("User", UserSchema, "user");
