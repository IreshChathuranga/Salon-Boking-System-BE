import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (fileBuffer: Buffer): Promise<any> => {
  return new Promise((resolve, reject) => {
    const upload = cloudinary.uploader.upload_stream(
      { folder: "profile_images" },
      (error, result) => {
        if (error) reject(error);
        resolve(result);
      }
    );

    upload.end(fileBuffer);
  });
};
