import { v2 as cloudinary } from "cloudinary";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteOldAsset = async (assetUrl) => {
  try {
    if (!assetUrl) return null;

    // Extract public ID safely
    const publicId = cloudinary.utils.extractPublicId(assetUrl);
    if (!publicId) {
      console.log(`Failed to extract public ID from URL: ${assetUrl}`);
      return null;
    }

    const response = await cloudinary.uploader.destroy(publicId);
    return response;
  } catch (error) {
    console.log(`Failed to delete asset: ${error.message}`);
    return null;
  }
};

export { deleteOldAsset };