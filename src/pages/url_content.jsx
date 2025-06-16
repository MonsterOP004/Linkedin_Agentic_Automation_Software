import React from 'react';
import GenerateContent from '../reusable_comps/generate_content'
import Visibility from '../reusable_comps/visibility'

const URLContent = ({ handleChange, formData = {} }) => {
  // Custom handler to sync post_url with url field for GenerateContent
  const handleURLChange = (e) => {
    const { name, value } = e.target;
    // Update both post_url and url fields
    handleChange(e);
    if (name === 'post_url') {
      handleChange({ target: { name: 'url', value: value } });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">URL Content</h2>

      <div className="grid gap-6 md:grid-cols-2">

        {/* GenerateContent component with contentType="url" */}
        <GenerateContent 
          handleChange={handleChange} 
          formData={formData} 
          contentType="url" 
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

export default URLContent;