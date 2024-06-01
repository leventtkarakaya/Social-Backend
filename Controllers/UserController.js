const User = require("../Modules/User.js");
const Dtos = require("../Utils/UserDto.js");
const bcrypt = require("bcrypt");

const getUsers = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = 10;
    const starIndex = (page - 1) * limit;
    const currentUserId = req?.user?._id;
    const getUsers = await User.find({}).skip(starIndex).limit(limit).sort({
      createdAt: -1,
    });
    if (!getUsers) {
      return res
        .status(404)
        .json({ message: "Kullanıcı bulunamadı", success: false });
    }
    const count = await User.countDocuments({});
    const users = getUsers.map((user) => {
      user.following = user?.followers.includes(currentUserId);
      const userDto = Dtos(user);
      return userDto;
    });
    return res.status(200).json({
      message: "Kullanıcılar getirildi",
      success: true,
      count,
      data: users,
    });
  } catch (error) {
    console.log("🚀 ~ getUsers ~ error:", error);
    res
      .status(404)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const currentUserId = req?.user?._id;
    const getUsers = await User.find({}).sort({
      createdAt: -1,
    });
    const count = await User.countDocuments({});
    const users = getUsers.map((user) => {
      user.following = user?.followers.includes(currentUserId);
      user.password = undefined;
      return user;
    });
    return res.status(200).json({
      message: "Kullanıcılar getirildi",
      success: true,
      count,
      data: users,
    });
  } catch (error) {
    console.log("🚀 ~ getAllUsers ~ error:", error);
    res
      .status(404)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};

const followUser = async (req, res) => {
  const { userId } = req.params;
  const currentUserId = req?.user?._id;
  if (!userId || !currentUserId) {
    return res.status(404).json({ message: "Eksik parametre", success: false });
  }

  try {
    if (currentUserId === userId) {
      return res
        .status(404)
        .json({ message: "Kendinizi takip edemezsiniz", success: false });
    }
    const reciepentUser = await User.findById(userId);
    const currentUser = await User.findById(currentUserId);
    if (!reciepentUser || !currentUser) {
      return res
        .status(404)
        .json({ message: "Kullanıcı bulunamadı", success: false });
    }
    const following = reciepentUser?.followers?.includes(currentUserId);
    if (following) {
      reciepentUser.followers = reciepentUser?.followers?.filter(
        (user) => user !== currentUserId
      );
      currentUser.following = currentUser?.following?.filter(
        (user) => user !== userId
      );
      await reciepentUser.save();
      await currentUser.save();
      return res.status(200).send(reciepentUser);
    } else {
      reciepentUser.followers.push(currentUserId);
      currentUser.following.push(userId);
      await reciepentUser.save();
      await currentUser.save();
      return res.status(200).send(reciepentUser);
    }
  } catch (error) {
    console.log("🚀 ~ followUser ~ error:", error);
    res
      .status(404)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};

const updatedUser = async (req, res) => {
  const currentUserId = req?.user?._id;
  if (!currentUserId) {
    res.status(404).json({ message: "Eksik parametre", success: false });
  }
  try {
    const user = await User.findByIdAndUpdate(currentUserId);
  } catch (error) {
    console.log("🚀 ~ updatedUser ~ error:", error);
    res
      .status(404)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req?.user?._id;
    if (!userId) {
      return res
        .status(404)
        .json({ message: "Eksik parametre", success: false });
    }
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).json({ message: "Kullanıcı bulunamadı", success: false });
    }
    await User.findByIdAndDelete(userId);
    return res
      .status(200)
      .json({ message: "Kullanıcı silindi", success: true });
  } catch (error) {
    console.log("🚀 ~ deleteUser ~ error:", error);
    return res
      .status(404)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};

module.exports = { getUsers, getAllUsers, followUser, deleteUser, updatedUser };
