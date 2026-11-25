import axios from "axios";
import imageCompression from "browser-image-compression";

export async function getUploadSignature(folder = "recipes/covers") {
  const { data } = await axios.get("/api/uploads/signature", { params: { folder }, withCredentials: true });
  return data;
}

export async function uploadImageToCloudinary(file, signature, onProgress) {
  const body = new FormData();
  body.append("file", file);
  body.append("api_key", signature.apiKey);
  body.append("timestamp", String(signature.timestamp));
  body.append("folder", signature.folder);
  body.append("upload_preset", signature.uploadPreset);
  body.append("signature", signature.signature);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(signature.cloudName)}/image/upload`,
    body,
    { onUploadProgress: (event) => onProgress?.(event.total ? Math.round((event.loaded * 100) / event.total) : 0) },
  );
  return data.secure_url;
}

export async function compressAndUploadImage(file, folder, onProgress) {
  const compressedFile = await imageCompression(file, {
    maxSizeMB: 1,
    maxWidthOrHeight: 2000,
    useWebWorker: true,
    fileType: file.type,
  });
  const signature = await getUploadSignature(folder);
  return uploadImageToCloudinary(compressedFile, signature, onProgress);
}
