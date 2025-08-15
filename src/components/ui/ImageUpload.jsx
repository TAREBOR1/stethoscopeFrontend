import React from 'react';
import { UploadCloudIcon } from 'lucide-react';

const ImageUpload = ({ imageFile, setImageFile, uploadedImageUrl, isLoading }) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
      <div className="flex items-center space-x-4">
        <label className="cursor-pointer inline-flex items-center px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
          <UploadCloudIcon className="mr-2 h-4 w-4" />
          {imageFile ? 'Change' : 'Upload'} Image
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>

        {isLoading ? (
          <span className="text-sm text-gray-500">Uploading...</span>
        ) : uploadedImageUrl ? (
          <div className="w-16 h-16 rounded overflow-hidden border border-gray-300">
            <img
              src={uploadedImageUrl}
              alt="Preview"
              className="object-cover w-full h-full"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ImageUpload;
