import React, { useState } from 'react';
import axios from 'axios';
import GenerateContent from '../reusable_comps/generate_content';
import Visibility from '../reusable_comps/visibility';
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

const ImageContent = ({ handleChange, formData = {} }) => {
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 6) {
      alert("You can upload a maximum of 6 images.");
      e.target.value = null;
      handleChange({ target: { name: e.target.name, value: [] } });
      setUploadedImageUrls([]);
      return;
    }
    handleChange({ target: { name: e.target.name, value: files } });
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
      form.append('file', file);

      try {
        const response = await fetch('https://image-video-url-generator.onrender.com/upload-image/', {
          method: 'POST',
          body: form,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || errorData.message || 'Image upload failed.');
        }

        const data = await response.json();
        return data.url;
      } catch (error) {
        console.error("Error uploading image:", file.name, error);
        throw new Error(`Failed to upload ${file.name}: ${error.message}`);
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      setUploadedImageUrls(urls);
      handleChange({ target: { name: 'image_urls', value: urls } });
      if (urls.length > 0) {
        handleChange({ target: { name: 'url', value: urls[0] } });
      }
    } catch (error) {
      setUploadError(error.message);
      setUploadedImageUrls([]);
      handleChange({ target: { name: 'image_urls', value: [] } });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSubmitting(true);

    const payload = {
      post_content: formData.post_content,
      post_image: uploadedImageUrls,
      post_visibility: formData.post_visibility,
    };

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

    try {
      const response = await axios.post(
        'https://linkedin-post-automation-server.onrender.com/post_linkedin_image_content',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.status === 200) {
        setStatusMessage('✅ Image content uploaded successfully to LinkedIn!');
      } else {
        setStatusMessage(`❗ Unexpected status: ${response.status}. Please try again.`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          setStatusMessage(`❌ Server error (${error.response.status}): ${error.response.data?.detail || error.response.statusText}`);
        } else if (error.request) {
          setStatusMessage('❌ No response from server. Please check your connection.');
        } else {
          setStatusMessage(`❌ Request error: ${error.message}`);
        }
      } else {
        setStatusMessage(`❌ Unexpected error: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-8 space-y-10 bg-white rounded-3xl shadow-xl border border-gray-100">
      <div className="flex items-center space-x-4">
        <h2 className="text-3xl font-bold text-gray-900">📸 Image Post Generator</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
      </div>

      <div className="grid gap-10 md:grid-cols-2">

        <div className="md:col-span-2 space-y-4">
          <label className="block text-base font-semibold text-gray-700">
            Upload Images (Max 6)
          </label>
          <input
            type="file"
            name="post_image"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />

          {formData.post_image?.length > 0 && (
            <div className="text-sm text-gray-700">
              <p className="font-medium mt-2">Selected Images:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mt-2">
                {formData.post_image.map((file, index) => (
                  <div key={index} className="bg-gray-100 p-1 rounded-md shadow-sm text-center text-xs truncate">
                    {file.name}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleConfirmAndUpload}
                disabled={isUploading}
                className={`mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white font-semibold ${
                  isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isUploading ? <Loader2 className="animate-spin h-4 w-4" /> : '✔️'}
                {isUploading ? 'Uploading...' : 'Confirm and Upload Images'}
              </button>
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">Error: {uploadError}</p>
              )}
            </div>
          )}

          {uploadedImageUrls.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Uploaded Image URLs
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {uploadedImageUrls.map((url, idx) => (
                  <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`Uploaded ${idx}`} className="rounded-lg border hover:shadow-lg transition-all" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <GenerateContent handleChange={handleChange} formData={formData} contentType="image" />
        <Visibility handleChange={handleChange} formData={formData} />

      </div>

      {statusMessage && (
        <div className={`flex items-center gap-3 p-4 rounded-lg text-sm font-medium ${
          statusMessage.includes('✅')
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {statusMessage.includes('✅') ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          {statusMessage}
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 ${
            isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="animate-spin h-5 w-5" />
              Posting...
            </span>
          ) : '🚀 Post to LinkedIn'}
        </button>
      </div>
    </form>
  );
};

export default ImageContent;
