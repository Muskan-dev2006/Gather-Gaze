import { useEffect, useState } from "react";
import imageCompression from "browser-image-compression";
import { useDropzone } from "react-dropzone";
import { getUploadSignature, uploadImageToCloudinary } from "../../api/uploads.api.js";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_IMAGES = { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"] };

export default function CoverImageUploader({ imageUrl = "", onChange, disabled = false, onUploadingChange }) {
  const [previewUrl, setPreviewUrl] = useState(imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    setPreviewUrl(imageUrl);
  }, [imageUrl]);

  useEffect(() => () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;
    setError("");
    setIsUploading(true);
    onUploadingChange?.(true);
    setProgress(0);
    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 2000,
        useWebWorker: true,
        fileType: file.type,
      });
      const signature = await getUploadSignature();
      const uploadedUrl = await uploadImageToCloudinary(compressedFile, signature, setProgress);
      const nextPreview = URL.createObjectURL(compressedFile);
      setPreviewUrl(nextPreview);
      onChange(uploadedUrl);
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || uploadError.response?.data?.error?.message || uploadError.message || "Image upload failed. Please try another image.");
    } finally {
      setIsUploading(false);
      onUploadingChange?.(false);
    }
  };

  const onDropRejected = (rejections) => {
    const issue = rejections[0]?.errors[0];
    if (issue?.code === "file-too-large") setError("Choose an image smaller than 10 MB.");
    else if (issue?.code === "file-invalid-type") setError("Use a JPG, PNG, or WebP image.");
    else setError(issue?.message || "That image could not be selected.");
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept: ACCEPTED_IMAGES,
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1,
    multiple: false,
    noClick: true,
    disabled: disabled || isUploading,
    onDrop,
    onDropRejected,
  });

  return (
    <section aria-labelledby="cover-upload-heading">
      <h2 id="cover-upload-heading" className="font-serif text-xl font-bold">Cover photo <span className="text-[#b9382a]">*</span></h2>
      <p className="mt-1 text-sm leading-5 text-[#786f64]">JPG, PNG, or WebP. Maximum 10 MB before compression.</p>
      <div {...getRootProps({ className: `mt-4 flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed text-center transition ${isDragActive ? "border-[#d94a38] bg-[#fff4f0]" : "border-[#e9dfd2] bg-[#fffaf2]"} ${disabled ? "opacity-60" : ""}` })}>
        <input {...getInputProps()} aria-label="Choose recipe cover photo" />
        {previewUrl ? <img src={previewUrl} alt="Recipe cover preview" className="h-52 w-full object-cover" /> : <div className="px-5 py-8"><span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-white text-2xl text-[#b9382a] shadow-sm">?</span><p className="mt-3 text-sm font-bold">{isDragActive ? "Drop your photo here" : "Drag a photo here"}</p><p className="mt-1 text-xs text-[#968a7d]">or choose a file from your device</p></div>}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={open} disabled={disabled || isUploading} className="rounded-full border border-[#eee6da] px-4 py-2 text-sm font-bold text-[#a53a2d] hover:bg-[#fff4f0] disabled:opacity-50">{previewUrl ? "Change photo" : "Choose photo"}</button>
        {isUploading && <span className="text-sm text-[#786f64]" role="status">Uploading… {progress}%</span>}
      </div>
      {isUploading && <progress className="mt-3 h-2 w-full accent-[#d94a38]" max="100" value={progress} aria-label="Image upload progress" />}
      {error && <p role="alert" className="mt-3 text-sm text-[#a53a2d]">{error}</p>}
    </section>
  );
}


