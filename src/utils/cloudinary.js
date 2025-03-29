import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload the file to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove the local file
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkError) {
      console.error(`Failed to delete local file: ${unlinkError.message}`);
    }

    return response;
  } catch (error) {
    console.error(`Cloudinary upload failed: ${error.message}`);

    // Attempt to remove the local file even if upload fails
    try {
      fs.unlinkSync(localFilePath);
    } catch (unlinkError) {
      console.error(`Failed to delete local file: ${unlinkError.message}`);
    }

    return null;
  }
};

export {uploadOnCloudinary}