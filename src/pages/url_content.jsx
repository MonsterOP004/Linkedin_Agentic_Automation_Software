import React from 'react';
import GenerateContent from '../reusable_comps/generate_content'
import Visibility from '../reusable_comps/visibility'

const URLContent = ({ handleChange, formData = {} }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">URL Content</h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter URL
          </label>
          <input
            type="url"
            name="post_url"
            value={formData.post_url || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Title [What You Want To Potray on your linkedin post]
          </label>
          <input
            type="text"
            name="post_title"
            value={formData.post_title || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter post title..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Post Content
          </label>
          <textarea
            name="post_content"
            value={formData.post_content || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your post content..."
          />
        </div>

        {/* GenerateContent component (assuming it's already updated with the JSON parsing logic) */}
        <GenerateContent handleChange={handleChange} formData={formData} />

        {/* Visibility component now correctly receives props */}
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

export default URLContent;