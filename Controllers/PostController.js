const User = require("../Modules/User");
const ProfilePosts = require("../Modules/ProfilePosts");

const publishPost = async (req, res) => {
  const currentUserId = req?.user?._id;

  if (!currentUserId) {
    res.status(404).json({ message: "Kullanıcı bulunamadı", success: false });
  }
  try {
    const user = await User.findById(currentUserId);
    if (!user) {
      res.status(404).json({ message: "Kullanıcı bulunamadı", success: false });
    }
    const { content, embedVideo } = req.body;
    if (!content || !embedVideo) {
      return res
        .status(404)
        .json({ message: "Eksik parametre", success: false });
    }
    const post = await ProfilePosts.create({
      content,
      embedVideo,
      userId: currentUserId,
    });
    res
      .status(200)
      .json({ message: "Gönderi paylaşıldı", success: true, data: post });
  } catch (error) {
    console.log("🚀 ~ publishPost ~ error:", error);
    res
      .status(500)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};

const getAllPosts = async (req, res) => {
  const { page, limit, category, type, search } = req.query;

  const pageNumber = parseInt(page) || 1;
  const limitNumber = parseInt(limit) || 10;
  const skip = (pageNumber - 1) * limitNumber;
  const getAll = {};

  if (type) {
    query.type = type;
  }
  if (category) {
    query.category = category;
  }

  try {
    const post = await ProfilePosts.find(getAll)
      .limit(limitNumber)
      .skip(skip)
      .sort({ createdAt: -1 })
      .populate("User", "firstName lastName userName");

    const totalPost = await ProfilePosts.countDocuments(getAll);

    if (!post || post.length === 0) {
      return res.status(404).json({
        message: "Gönderi bulunamadı",
        success: false,
        publications: [],
        totalPost: 0,
        totalPage: 0,
        currentPage: 0,
      });
    }
    if (search) {
      const filteredPost = post.filter((post) => {
        return post.content.toLowerCase().includes(search.toLowerCase());
      });
      return res.status(200).json({
        message: "Arama sonucu",
        success: true,
        publications: filteredPost,
        totalPost: filteredPost.length,
        totalPage: Math.ceil(totalPost / limitNumber),
        currentPage: pageNumber,
      });
    }
    return res.status(200).json({
      message: "Arama sonucu",
      success: true,
      publications: post,
      totalPost: totalPost,
      totalPage: Math.ceil(totalPost / limitNumber),
      currentPage: pageNumber,
    });
  } catch (error) {
    console.log("🚀 ~ getAllPosts ~ error:", error);
    res
      .status(500)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};
const contentActionHandler = async (req, res) => {
  const { contentId } = req.params;
  const { action } = req.body;
  const { _id } = req.user;
  try {
    const post = await ProfilePosts.findById(contentId).populate(
      "userID",
      "firstName lastName userName"
    );
    if (!post) {
      res.status(404).json({ message: "Gönderi bulunamadı", success: false });
    }
    switch (action) {
      case "like":
        if (post.likes.includes(_id)) {
          post.likes = post.likes.filter((id) => id.toString() !== _id);
        } else {
          post.likes.push(_id);
        }
        break;
      default:
        break;
    }

    await post.save();
    res
      .status(200)
      .json({ message: "İşlem tamamlandı", success: true, data: post });
  } catch (error) {
    console.log("🚀 ~ contentActionHandler ~ error:", error);
    res
      .status(500)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};
const getPopularPost = async (req, res) => {
  try {
    const post = await ProfilePosts.find()
      .limit(5)
      .populate("User", "firstName lastName userName");

    if (!post || post.length === 0) {
      return res.status(404).json({
        message: "Gönderi bulunamadı",
        success: false,
        publications: [],
      });
    }
    return res.status(200).json({
      message: "Popüler gönderiler",
      success: true,
      publications: post,
    });
  } catch (error) {
    console.log("🚀 ~ getPopularPost ~ error:", error);
    res
      .status(500)
      .json({ message: "Serverda bir hata oluştu", success: false });
  }
};
module.exports = {
  publishPost,
  getAllPosts,
  contentActionHandler,
  getPopularPost,
};
