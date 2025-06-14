// visibility.jsx
import React from 'react'

const Visibility = ({ handleChange, formData = {} }) => { // Destructure handleChange and formData from props
  return (
    <div>
          <label htmlFor="post_visibility" className="block text-sm font-medium text-gray-700 mb-2">
            Post Visibility
          </label>
          <select
            id="post_visibility" // Added for accessibility
            name="post_visibility"
            value={formData.post_visibility || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select visibility...</option>
            <option value="PUBLIC">Public</option>
            <option value="CONNECTIONS">Connections</option>
          </select>
    </div>
  )
}

export default Visibility