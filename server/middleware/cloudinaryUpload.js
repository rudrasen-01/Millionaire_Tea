const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

const storage = multer.diskStorage({});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
});

const uploadToCloudinary = async (filePath) => {
  return await cloudinary.uploader.upload(filePath, {
    folder: "tea_rewards/users",
  });
};

module.exports = { upload, uploadToCloudinary };
