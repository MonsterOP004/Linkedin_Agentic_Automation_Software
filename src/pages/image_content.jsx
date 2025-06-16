import React, { useState } from 'react';
import GenerateContent from '../reusable_comps/generate_content';
import Visibility from '../reusable_comps/visibility';

const ImageContent = ({ handleChange, formData = {} }) => {
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // New handler specifically for file input to manage multiple files and limit
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array

    if (files.length > 6) {
      alert("You can upload a maximum of 6 images.");
      e.target.value = null; // Clears the selected files from the input element
      handleChange({ target: { name: e.target.name, value: [] } }); // Updates formData to an empty array
      setUploadedImageUrls([]); // Clear previously uploaded URLs if new files exceed limit
      return;
    }
    // Update the formData state with the array of selected files
    handleChange({ target: { name: e.target.name, value: files } });
    // Reset uploaded URLs and error when new files are selected
    setUploadedImageUrls([]);
    setUploadError(null);
  };

  const handleConfirmAndUpload = async () => {
    if (!formData.post_image || formData.post_image.length === 0) {
      alert("Please select images to upload first.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const uploadPromises = formData.post_image.map(async (file) => {
      const form = new FormData();
      form.append('image', file); // 'image' should match the field name expected by your API

      try {
        const response = await fetch('https://image-video-url-generator.onrender.com/upload-image', {
          method: 'POST',
          body: form,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Image upload failed.');
        }

        const data = await response.json();
        return data.url; // Assuming your API returns { url: "..." }
      } catch (error) {
        console.error("Error uploading image:", file.name, error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setUploadedImageUrls(urls);
      // Pass the uploaded URLs to the parent component's formData
      handleChange({ target: { name: 'image_urls', value: urls } });
      // Also set the first URL as the main URL for content generation
      if (urls.length > 0) {
        handleChange({ target: { name: 'url', value: urls[0] } });
      }
      alert("Images uploaded successfully!");
    } catch (error) {
      setUploadError(error.message);
      setUploadedImageUrls([]); // Clear URLs if any upload fails
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Image Content</h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Images (Max 6)
          </label>
          <div className="relative">
            <input
              type="file"
              name="post_image"
              onChange={handleFileChange} // Use the new specific handler
              accept="image/*"
              multiple // <--- ADDED: This enables multiple file selection
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {/* Display names of selected files */}
          {formData.post_image && Array.isArray(formData.post_image) && formData.post_image.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Selected Images:
              <ul className="list-disc list-inside ml-4">
                {formData.post_image.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
              <button
                onClick={handleConfirmAndUpload}
                disabled={isUploading}
                className={`mt-4 py-2 px-4 rounded-md text-white font-medium transition-colors ${
                  isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Confirm and Upload Images'}
              </button>
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">Error: {uploadError}</p>
              )}
            </div>
          )}
          {/* This handles the case where formData.post_image might still be a single File object
              before multiple files are selected, or if initial state isn't an array. */}
          {formData.post_image && !Array.isArray(formData.post_image) && (
              <p className="mt-2 text-sm text-gray-600">
                Selected Image: {formData.post_image.name}
              </p>
          )}

          {uploadedImageUrls.length > 0 && (
            <div className="mt-4 text-sm text-green-700">
              <p>Uploaded Image URLs:</p>
              <ul className="list-disc list-inside ml-4">
                {uploadedImageUrls.map((url, index) => (
                  <li key={index}><a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{url}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* GenerateContent component with contentType="image" */}
        <GenerateContent 
          handleChange={handleChange} 
          formData={formData} 
          contentType="image" 
        />

        {/* Visibility component */}
        <Visibility handleChange={handleChange} formData={formData} />

      </div>

      <div className="pt-6">
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Post Content
        </button>
      </div>
    </div>
  );
};

export default ImageContent;