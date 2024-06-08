const User = require("../Modules/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      passwordConfrim,
      image,
      occupation,
      location,
      bio,
    } = req.body;

    const userExitEmail = await User.findOne({ email });
    const userUserName = await User.findOne({ userName });
    // ? EMAIL VALIDATION
    if (userExitEmail) {
      return res
        .status(400)
        .json({ message: "Bu email adresi kullanılmaktadır", success: false });
    }
    // ? USERNAME VALIDATION
    if (userUserName) {
      return res.status(400).json({
        message: "Bu kullanıcı adı kullanılmaktadır",
        success: false,
      });
    }
    // ? PASSWORD VALIDATION
    if (password === passwordConfrim) {
      return res
        .status(400)
        .json({ message: "Parolalar eşleşmiyor", success: false });
    }

    // ? HASHING
    const salt = await bcrypt.genSalt(10);

    if (!salt) {
      return res
        .status(500)
        .json({ message: "Salt oluşturulurken hata oluştu", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, salt);

    if (!hashedPassword) {
      return res
        .status(500)
        .json({ message: "Şifre hashlenirken hata oluştu", success: false });
    }
    // OTP GENERATION
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCase: false,
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
    });

    req.body.otp = otp;

    const newUser = await User({
      userName,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      passwordConfrim: hashedPassword,
      image,
      occupation,
      location,
      bio,
      viewedProfile: Math.floor(Math.random() * 100),
      impressions: Math.floor(Math.random() * 100),
      otp: otp,
    });

    const saveUser = await newUser.save();

    if (!saveUser) {
      return res
        .status(500)
        .json({ message: "Kullanıcı kaydedilemedi", success: false });
    }
    // JWT
    const token = jwt.sign({ id: saveUser._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });
    // EMAIL
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAİL_NAME,
        pass: process.env.EMAİL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAİL_NAME,
      to: process.env.EMAİL_TO,
      subject: "Email Dogrulama Kodunuz aşagıdaki kodu ile dogrulayınız",
      text: `Email Dogrulama Kodunuz ${otp}`,
    };

    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Transport error: " + error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.status(201).json({ saveUser, token, success: true });
  } catch (error) {
    console.log("🚀 ~ register ~ error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "Kullanıcı e-mail bulunamadı", success: false });
    }
    const isMach = await bcrypt.compare(password, user.password);
    if (!isMach) {
      return res
        .status(400)
        .json({ message: "Parolanızı yanlıs girdiniz", success: false });
    }

    const isUser = await User.findOne({ email });

    const token = jwt.sign({ id: isUser._id }, process.env.JWT_SECRET, {
      expiresIn: 86400,
    });

    res.status(200).json({
      message: "Giriş yapıldı",
      success: true,
      token,
      data: isUser,
    });
  } catch (error) {
    console.log("🚀 ~ login ~ error:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  register,
  login,
};
