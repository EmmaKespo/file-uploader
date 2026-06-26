// Build Cloud Storage Integration
//  to transfer local files to the cloud.
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Link Cloudinary client directly to the environment parameters
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Stream local staging file straight up to cloud object storage container
async function uploadToCloud(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, { resource_type: 'auto' });
    // Cleanup: erase file copy from your server storage instantly after upload succeeds
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath); 
    return { url: result.secure_url, publicId: result.public_id };
  } catch (error) {
    // Cleanup on failure to ensure server directory doesn't fill up with abandoned temp files
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    throw error;
  }
}

module.exports = { uploadToCloud };
