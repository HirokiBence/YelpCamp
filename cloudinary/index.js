const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({ 
  cloud_name: process.env.CLOUDINAY_CLOUD_NAME, 
  api_key: process.env.CLOUDINAY_KEY, 
  api_secret: process.env.CLOUDINAY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'YelpCamp',
    allowed_formats: ['jpeg', 'jpg', 'png'],
  },
});

module.exports = {
  cloudinary, 
  storage
}