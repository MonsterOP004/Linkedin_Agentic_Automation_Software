import React, { useState } from 'react';
import axios from 'axios'; // Import axios for the LinkedIn post
import GenerateContent from '../reusable_comps/generate_content';
import Visibility from '../reusable_comps/visibility';

const ImageContent = ({ handleChange, formData = {} }) => {
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // States for LinkedIn post status
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      form.append('file', file); // 'file' should match the field name expected by your FastAPI backend

      try {
        const response = await fetch('https://image-video-url-generator.onrender.com/upload-image/', { // Added trailing slash
          method: 'POST',
          body: form,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || errorData.message || 'Image upload failed.');
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
      // This is crucial: the actual image URLs are now in formData.image_urls
      handleChange({ target: { name: 'image_urls', value: urls } });
      // Also set the first URL as the main URL for content generation (if 'generate_content' needs it)
      if (urls.length > 0) {
        handleChange({ target: { name: 'url', value: urls[0] } });
      }
      alert("Images uploaded successfully!");
    } catch (error) {
      setUploadError(error.message);
      setUploadedImageUrls([]); // Clear URLs if any upload fails
      handleChange({ target: { name: 'image_urls', value: [] } }); // Clear parent's image_urls on error
    } finally {
      setIsUploading(false);
    }
  };

  // Handler for posting to LinkedIn
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setStatusMessage('');
    setIsSubmitting(true);

    const payload = {
      post_content: formData.post_content,
      post_image: uploadedImageUrls, // Use the URLs obtained from Cloudinary upload
      post_visibility: formData.post_visibility,
    };

    // --- Debugging Line ---
    console.log('Payload being sent to FastAPI:', payload); //
    // --- End Debugging Line ---

    // --- Validation for LinkedIn Post ---
    if (!payload.post_content) {
      setStatusMessage('❗ Please generate content before posting.');
      setIsSubmitting(false);
      return;
    }
    if (!payload.post_image || payload.post_image.length === 0) {
      setStatusMessage('❗ Please upload images first using "Confirm and Upload Images".');
      setIsSubmitting(false);
      return;
    }
    if (!payload.post_visibility) {
      setStatusMessage('❗ Please select post visibility.');
      setIsSubmitting(false);
      return;
    }
    // --- End Validation ---

    try {
      const response = await axios.post(
        'https://linkedin-post-automation-server.onrender.com/post_linkedin_image_content',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setStatusMessage('✅ Image content uploaded successfully to LinkedIn!');
        // Optionally reset form fields here if desired after successful post
        // handleChange({ target: { name: 'post_content', value: '' } });
        // handleChange({ target: { name: 'image_urls', value: [] } });
        // setUploadedImageUrls([]);
        // handleChange({ target: { name: 'post_visibility', value: '' } });
        // Also clear generation fields if needed
        // handleChange({ target: { name: 'topic', value: '' } });
        // handleChange({ target: { name: 'description', value: '' } });
        // handleChange({ target: { name: 'tone', value: '' } });
        // handleChange({ target: { name: 'audience', value: '' } });
        // handleChange({ target: { name: 'intent', value: '' } });
        // handleChange({ target: { name: 'word_limit', value: '' } });

      } else {
        setStatusMessage(`❗ Unexpected status: ${response.status}. Please try again.`);
      }
    } catch (error) {
      console.error('Error uploading image content to LinkedIn:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setStatusMessage(
            `❌ Server error (${error.response.status}): ${error.response.data?.detail || error.response.statusText}`
          );
        } else if (error.request) {
          setStatusMessage('❌ No response from LinkedIn server. Please check your connection.');
        } else {
          setStatusMessage(`❌ Request setup error: ${error.message}`);
        }
      } else {
        setStatusMessage(`❌ Unexpected error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6"> {/* Changed div to form */}
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
              onChange={handleFileChange}
              accept="image/*"
              multiple
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
                type="button" // Important: change to type="button" to prevent form submission
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

      {statusMessage && (
        <div className="text-sm font-medium mt-4 p-3 rounded-md bg-gray-100 border border-gray-300 text-gray-700">
          {statusMessage}
        </div>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? 'Posting...' : 'Post Content'}
        </button>
      </div>
    </form>
  );
};

export default ImageContent;