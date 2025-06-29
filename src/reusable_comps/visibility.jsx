// visibility.jsx
import React from 'react'

const Visibility = ({ handleChange, formData = {} }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <label htmlFor="post_visibility" className="block text-sm font-medium text-gray-700 mb-3">
        Post Visibility
      </label>
      <select
        id="post_visibility"
        name="post_visibility"
        value={formData.post_visibility || ''}
        onChange={handleChange}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors duration-200"
      >
        <option value="">Select visibility...</option>
        <option value="PUBLIC">Public</option>
        <option value="CONNECTIONS">Connections</option>
      </select>
    </div>
  )
}

export default Visibility