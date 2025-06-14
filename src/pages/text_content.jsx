// text_content.jsx
import React from 'react';
import GenerateContent from '../reusable_comps/generate_content';
import Visibility from '../reusable_comps/visibility'; // Ensure this path is correct

const TextContent = ({ handleChange, formData = {} }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Text Content</h2>

      <div className="grid gap-6 md:grid-cols-2">
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

export default TextContent;