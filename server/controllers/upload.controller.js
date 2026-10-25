import { v2 as cloudinary } from "cloudinary";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const uploadFolder = "recipes/covers";

export const getUploadSignature = asyncHandler(async (request, response) => {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_UPLOAD_PRESET } = process.env;
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET || !CLOUDINARY_UPLOAD_PRESET) {
    throw new ApiError(503, "Image uploads are not configured.", "UPLOADS_UNAVAILABLE");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    folder: uploadFolder,
    timestamp,
    upload_preset: CLOUDINARY_UPLOAD_PRESET,
  };

  response.json({
    cloudName: CLOUDINARY_CLOUD_NAME,
    apiKey: CLOUDINARY_API_KEY,
    timestamp,
    folder: uploadFolder,
    uploadPreset: CLOUDINARY_UPLOAD_PRESET,
    signature: cloudinary.utils.api_sign_request(paramsToSign, CLOUDINARY_API_SECRET),
  });
});