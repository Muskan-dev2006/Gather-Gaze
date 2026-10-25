const DEFAULT_IMAGE_WIDTH = 960;
const CLOUDINARY_UPLOAD_PATH = "/upload/";

export default function buildImageUrl(imageUrl, width = DEFAULT_IMAGE_WIDTH) {
  if (!imageUrl) return "";

  let parsedUrl;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return imageUrl;
  }

  if (parsedUrl.hostname !== "res.cloudinary.com" || !parsedUrl.pathname.includes(CLOUDINARY_UPLOAD_PATH)) {
    return imageUrl;
  }

  const imageWidth = Number.isInteger(Number(width)) && Number(width) > 0 ? Number(width) : DEFAULT_IMAGE_WIDTH;
  const transformation = `f_auto,q_auto,w_${imageWidth},ar_4:3,c_fill`;
  parsedUrl.pathname = parsedUrl.pathname.replace(CLOUDINARY_UPLOAD_PATH, `${CLOUDINARY_UPLOAD_PATH}${transformation}/`);
  return parsedUrl.toString();
}
