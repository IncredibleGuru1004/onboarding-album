"use client";

import { useRef, useState, useCallback } from "react";
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";

interface ImageUploadProps {
  value?: string; // Image URL or data URL
  onChange: (imageUrl: string) => void;
  onFileChange?: (file: File | null) => void; // For future backend upload
  label?: string;
  required?: boolean;
  error?: string;
  maxSizeMB?: number;
  acceptedFormats?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onFileChange,
  label = "Image",
  required = false,
  error,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/jpg", "image/png", "image/webp"],
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewError, setPreviewError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      return `Invalid file type. Please upload ${acceptedFormats.map((f) => f.split("/")[1]).join(", ")} files.`;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `File size exceeds ${maxSizeMB}MB. Please choose a smaller file.`;
    }

    return null;
  };

  const handleFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setPreviewError(validationError);
        return;
      }

      setPreviewError("");
      setIsLoading(true);
      setSelectedFile(file);

      try {
        // Convert file to data URL for preview and temporary storage
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl = reader.result as string;
          onChange(dataUrl);
          onFileChange?.(file);
          setIsLoading(false);
        };
        reader.onerror = () => {
          setPreviewError("Failed to read file. Please try again.");
          setIsLoading(false);
        };
        reader.readAsDataURL(file);
      } catch {
        setPreviewError("An error occurred while processing the image.");
        setIsLoading(false);
      }
    },
    [onChange, onFileChange, maxSizeMB, acceptedFormats],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onChange("");
    onFileChange?.(null);
    setPreviewError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(",")}
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image"
      />

      {value ? (
        // Image Preview Mode
        <div className="relative group">
          <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50">
            <img
              src={value}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={() => {
                setPreviewError("Failed to load image. Please try again.");
              }}
            />
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>

          {/* Remove/Replace Button */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              className="bg-white/90 hover:bg-white text-gray-700 p-2 rounded-lg shadow-lg transition-all hover:scale-110"
              title="Replace image"
              aria-label="Replace image"
            >
              <ArrowUpTrayIcon className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg shadow-lg transition-all hover:scale-110"
              title="Remove image"
              aria-label="Remove image"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {/* File Info */}
          {selectedFile && (
            <div className="mt-2 text-xs text-gray-500">
              {selectedFile.name} (
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
            </div>
          )}
        </div>
      ) : (
        // Upload Area
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative w-full h-48 rounded-lg border-2 border-dashed transition-all cursor-pointer
            ${
              isDragging
                ? "border-blue-500 bg-blue-50"
                : error || previewError
                  ? "border-red-300 bg-red-50"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
            }
          `}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600">Processing image...</p>
              </div>
            ) : (
              <>
                <PhotoIcon
                  className={`w-12 h-12 mb-3 ${
                    isDragging ? "text-blue-500" : "text-gray-400"
                  }`}
                />
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {isDragging
                    ? "Drop image here"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500 text-center">
                  {acceptedFormats
                    .map((f) => f.split("/")[1].toUpperCase())
                    .join(", ")}{" "}
                  up to {maxSizeMB}MB
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Error Messages */}
      {(error || previewError) && (
        <div className="flex items-start gap-2 text-sm text-red-600">
          <svg
            className="h-5 w-5 shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error || previewError}</span>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
