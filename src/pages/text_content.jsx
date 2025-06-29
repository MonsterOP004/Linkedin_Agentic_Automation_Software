import React, { useState } from 'react';
import axios from 'axios';
import GenerateContent from '../reusable_comps/generate_content';
import Visibility from '../reusable_comps/visibility';

const TextContent = ({ handleChange, formData = {} }) => {
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    setIsSubmitting(true);

    const payload = {
      post_content: formData.post_content,
      post_visibility: formData.post_visibility,
    };

    if (!payload.post_content || !payload.post_visibility) {
      setStatusMessage('❗ Please generate content and select visibility before posting.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://linkedin-post-automation-server.onrender.com/post_linkedin_text_content',
        payload,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (response.status === 200) {
        setStatusMessage('✅ Content uploaded successfully to LinkedIn!');
      } else {
        setStatusMessage(`❗ Unexpected status: ${response.status}. Please try again.`);
      }
    } catch (error) {
      console.error('Error uploading content:', error);

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-2xl shadow-lg border border-gray-200"
    >
      <div className="flex items-center space-x-4">
        <h2 className="text-3xl font-bold text-gray-900">📜 Text Post Generator</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-500 to-purple-500 opacity-20" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <GenerateContent
          handleChange={handleChange}
          formData={formData}
          contentType="text"
        />
        <Visibility handleChange={handleChange} formData={formData} />
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-3 text-sm font-semibold mt-4 p-4 rounded-lg border 
            ${statusMessage.includes('✅')
              ? 'bg-green-50 border-green-300 text-green-800'
              : statusMessage.includes('❗')
                ? 'bg-yellow-50 border-yellow-300 text-yellow-800'
                : statusMessage.includes('❌')
                  ? 'bg-red-50 border-red-300 text-red-800'
                  : 'bg-gray-50 border-gray-200 text-gray-800'
            }
          `}
          role="alert"
        >
          <span aria-hidden="true" className="text-lg">
            {statusMessage.includes('✅') ? '✔️' : statusMessage.includes('❌') ? '❌' : '⚠️'}
          </span>
          <p>{statusMessage}</p>
        </div>
      )}

      <div className="pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-5 rounded-xl font-semibold shadow-md transition duration-300 ease-in-out
            focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-60
            ${isSubmitting
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transform hover:-translate-y-0.5'
            }
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              <span>Posting...</span>
            </span>
          ) : (
            'Post Content'
          )}
        </button>
      </div>
    </form>
  );
};

export default TextContent;
