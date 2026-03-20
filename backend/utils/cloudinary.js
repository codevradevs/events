const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

exports.uploadImage = async (file) => {
  const result = await cloudinary.uploader.upload(file.path);
  return result.secure_url;
};

exports.deleteImage = async (publicId) => {
  await cloudinary.uploader.destroy(publicId);
};
