import axios from "axios";

export async function getUploadSignature() {
  const { data } = await axios.get("/api/uploads/signature", { withCredentials: true });
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
