import React, { useState } from 'react';
import axios from 'axios';
import GenerateContent from '../reusable_comps/generate_content';
import Visibility from '../reusable_comps/visibility';

const URLContent = ({ handleChange, formData = {} }) => {
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    setStatusMessage('');
    setIsSubmitting(true);

    const payload = {
      post_content: formData.post_content, // Comes from GenerateContent
      post_url: formData.url,             // Comes from GenerateContent's URL input
      post_title: formData.topic,         // Comes from GenerateContent's Topic input
      post_visibility: formData.post_visibility, // Comes from Visibility
    };

    // --- Validation ---
    if (!payload.post_content) {
      setStatusMessage('❗ Please generate content before posting.');
      setIsSubmitting(false);
      return;
    }
    if (!payload.post_url) {
      setStatusMessage('❗ Please provide a URL in the content generation section.');
      setIsSubmitting(false);
      return;
    }
    if (!payload.post_title) {
      setStatusMessage('❗ Please provide a Topic in the content generation section.');
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
        'https://linkedin-post-automation-server.onrender.com/post_linkedin_url_content',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setStatusMessage('✅ URL content uploaded successfully to LinkedIn!');
        // Optionally reset form fields here if desired after successful post
        // handleChange({ target: { name: 'post_content', value: '' } });
        // handleChange({ target: { name: 'url', value: '' } });
        // handleChange({ target: { name: 'topic', value: '' } });
        // handleChange({ target: { name: 'post_visibility', value: '' } });
        // Also clear other generation fields if needed
        // handleChange({ target: { name: 'description', value: '' } });
        // handleChange({ target: { name: 'tone', value: '' } });
        // handleChange({ target: { name: 'audience', value: '' } });
        // handleChange({ target: { name: 'intent', value: '' } });
        // handleChange({ target: { name: 'word_limit', value: '' } });

      } else {
        setStatusMessage(`❗ Unexpected status: ${response.status}. Please try again.`);
      }
    } catch (error) {
      console.error('Error uploading URL content:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          setStatusMessage(
            `❌ Server error (${error.response.status}): ${error.response.data?.detail || error.response.statusText}`
          );
        } else if (error.request) {
          setStatusMessage('❌ No response from server. Please check your connection.');
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">URL Content</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* GenerateContent component now handles Topic and URL input */}
        <GenerateContent
          handleChange={handleChange}
          formData={formData}
          contentType="url"
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

export default URLContent;