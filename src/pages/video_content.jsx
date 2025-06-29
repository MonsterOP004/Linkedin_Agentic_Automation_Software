import React, { useState } from 'react';
import GenerateContent from '../reusable_comps/generate_content';
import Visibility from '../reusable_comps/visibility';

const VideoContent = ({ handleChange, formData = {} }) => {
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    // Update formData with the selected file
    handleChange(e);
    // Reset uploaded URL and error when new file is selected
    setUploadedVideoUrl('');
    setUploadError(null);
  };

  const handleConfirmAndUpload = async () => {
    if (!formData.post_video) {
      alert("Please select a video to upload first.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const form = new FormData();
    form.append('video', formData.post_video); // 'video' should match the field name expected by your API

    try {
      const response = await fetch('https://image-video-url-generator.onrender.com/upload-video', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Video upload failed.');
      }

      const data = await response.json();
      const videoUrl = data.url; // Assuming your API returns { url: "..." }

      setUploadedVideoUrl(videoUrl);
      // Pass the uploaded URL to the parent component's formData
      handleChange({ target: { name: 'video_url', value: videoUrl } });
      // Also set it as the main URL for content generation
      handleChange({ target: { name: 'url', value: videoUrl } });

      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      setUploadError(error.message);
      setUploadedVideoUrl(''); // Clear URL if upload fails
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <h2 className="text-3xl font-bold text-gray-900">📽️ Video Post Generator</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">

        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Video
          </label>
          <div className="relative">
            <input
              type="file"
              name="post_video"
              onChange={handleFileChange}
              accept="video/*"
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all duration-200"
            />
          </div>
          {formData.post_video && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Selected: {formData.post_video.name}</p>
              <button
                onClick={handleConfirmAndUpload}
                disabled={isUploading}
                className={`mt-4 py-2 px-4 rounded-md text-white font-medium transition-colors ${isUploading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2'
                  }`}
              >
                {isUploading ? 'Uploading...' : 'Confirm and Upload Video'}
              </button>
              {uploadError && (
                <p className="mt-2 text-sm text-red-600">Error: {uploadError}</p>
              )}
            </div>
          )}

          {uploadedVideoUrl && (
            <div className="mt-4 text-sm text-green-700">
              <p>Uploaded Video URL:</p>
              <a href={uploadedVideoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {uploadedVideoUrl}
              </a>
            </div>
          )}
        </div>

        {/* GenerateContent component with contentType="video" */}
        <GenerateContent
          handleChange={handleChange}
          formData={formData}
          contentType="video"
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

export default VideoContent;