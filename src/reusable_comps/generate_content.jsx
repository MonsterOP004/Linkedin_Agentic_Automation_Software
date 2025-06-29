// generate_content.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { LuBrainCircuit } from "react-icons/lu";


const GenerateContent = ({ handleChange, formData = {}, contentType = 'text' }) => {
  // New state to control visibility of post content and store generated text
  const [showPostContent, setShowPostContent] = useState(false);
  const [generatedText, setGeneratedText] = useState('');

    // Local handleChange for this component's inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        // Specific validation for 'word_limit'
        if (name === 'word_limit') {
            const numValue = parseInt(value, 10);
            if (!isNaN(numValue)) { // Check if it's a valid number
                newValue = Math.min(numValue, 400); // Ensure it doesn't exceed 400
                if (newValue < 1) { // Also ensure it's not less than 1 (as per your min="1")
                    newValue = 1;
                }
            } else if (value === '') { // Allow clearing the input
                newValue = '';
            } else { // If it's not a number and not empty, set to a default or previous valid state
                newValue = formData.word_limit || ''; // Revert to current or empty
            }
        }
        
        // Call the parent's handleChange with the potentially modified value
        handleChange({ target: { name, value: newValue } });
    };


  const handleGenerateClick = async () => {
    const { topic, description, tone, audience, intent, word_limit, url } = formData;

    // Validate word_limit here again to be safe, especially if the user tries to bypass client-side limits
    const parsedWordLimit = parseInt(word_limit, 10);
    if (isNaN(parsedWordLimit) || parsedWordLimit < 1 || parsedWordLimit > 400) {
        alert('Please enter a valid word limit between 1 and 400.');
        return;
    }

    if (!topic || !description || !tone || !audience || !intent || !word_limit) {
      alert('Please fill in all content generation fields.');
      return;
    }

    // For URL, Image, and Video content types, check if URL is provided
    if ((contentType === 'url' || contentType === 'image' || contentType === 'video') && !url) {
      alert('Please provide a URL for this content type.');
      return;
    }

    const payload = {
      topic,
      description,
      tone,
      audience,
      intent,
      word_limit: parsedWordLimit,
      type: contentType, // Add the content type
    };

    // Add URL parameter only for non-text content types
    if (contentType === 'url' || contentType === 'image' || contentType === 'video') {
      payload.url = url;
    }

    try {
      // Temporarily clear previous generated content and hide the section
      setGeneratedText('');
      setShowPostContent(false);
      // You might want to also clear formData.post_content in the parent here
      // if you want the main form's post_content to reset on new generation attempt
      handleChange({ target: { name: 'post_content', value: '' } });


      const response = await axios.post(
        'https://linkedin-post-automation-server.onrender.com/generate_linkedin_content',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Content generated successfully:', response.data);

      let receivedContent = 'No content received from API.';

      if (response.data && response.data.post) {
        let jsonString = response.data.post;
        const jsonMatch = jsonString.match(/```json\n([\s\S]*)\n```/);
        
        if (jsonMatch && jsonMatch[1]) {
            try {
                const parsedPost = JSON.parse(jsonMatch[1]);
              receivedContent = parsedPost.content || "Content field not found in parsed JSON.";
            } catch (parseError) {
              console.error("Error parsing 'post' JSON string:", parseError);
              receivedContent = "Failed to parse generated JSON content.";
            }
          } else {
            console.warn("API 'post' field did not contain expected markdown JSON block. Using raw 'post' content if string.");
            if (typeof jsonString === 'string') {
                receivedContent = jsonString; 
            }
        }
      }

      setGeneratedText(receivedContent); // Store in local state
      setShowPostContent(true); // Show the textarea

      // Update the parent's formData with the generated content
      handleChange({ target: { name: 'post_content', value: receivedContent } });

      alert('Content generation successful!');

    } catch (error) {
      console.error('Error generating content:', error);
      setGeneratedText(''); // Clear on error
      setShowPostContent(false); // Hide on error (or show with error message)
      handleChange({ target: { name: 'post_content', value: '' } }); // Clear parent state

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Server responded with an error:', error.response.data);
          alert(`Failed to generate content: ${error.response.data.detail || error.response.statusText}`);
        } else if (error.request) {
          console.error('No response received from server:', error.request);
          alert('Failed to generate content: No response from server. Check network connection.');
        } else {
          console.error('Error setting up request:', error.message);
          alert(`Failed to generate content: ${error.message}`);
        }
      } else {
        alert(`Failed to generate content: An unexpected error occurred: ${error.message}`);
      }
    }
  };

  return (
    <div className="md:col-span-2 space-y-6"> 
      <div className="grid gap-6 md:grid-cols-2">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic [What is the main topic of the post?]
          </label>
          <input
            type="text"
            name="topic"
            value={formData.topic || ''}
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., The Future of AI"
          />
        </div>

        {/* Conditionally render URL field for non-text content types */}
        {(contentType === 'url' || contentType === 'image' || contentType === 'video') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {contentType === 'url' ? 'URL' : contentType === 'image' ? 'Image URL' : 'Video URL'}
            </label>
            <input
              type="url"
              name="url"
              value={formData.url || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={`Enter ${contentType} URL`}
              required
            />
          </div>
        )}

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description [Provide a brief description of the content you want to generate from Agentic AI.]
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Provide a brief description of the content you want to generate. e.g., Discuss the potential impact of AI on various industries and daily life."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone [Select the tone for the generated content.]
          </label>
          <select
            name="tone"
            value={formData.tone || ''}
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select tone...</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="humorous">Humorous</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Audience [Specify the target audience]
          </label>
          <input
            type="text"
            name="audience"
            value={formData.audience || ''}
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Tech enthusiasts, general public"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Intent [Select the intent for the generated content.]
          </label>
          <select
            name="intent"
            value={formData.intent || ''}
            onChange={handleInputChange} 
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select intent...</option>
            <option value="inform">Inform</option>
            <option value="entertain">Entertain</option>
            <option value="persuade">Persuade</option>
            <option value="educate">Educate</option>
            <option value="inspire">Inspire</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Word Limit
          </label>
          <input
            type="number"
            name="word_limit"
            value={formData.word_limit || ''}
            onChange={handleInputChange} 
            min="1"
            max="400"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 500"
          />
        </div>
      </div>

      {/* Generate Content Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={handleGenerateClick}
          className="flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:-translate-y-0.5"
          >
          <LuBrainCircuit className="w-5 h-5 mr-2" />
          Generate Content
          </button>
      </div>

      {/* Conditionally rendered Post Content block */}
      {showPostContent && (
        <div className="md:col-span-2 mt-6"> {/* Added mt-6 for spacing from the button */}
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Generated Post Content (editable)
          </label>
          <textarea
            name="post_content"
            value={formData.post_content || ''} // Still link to parent's formData
            onChange={handleInputChange} // Allow parent to handle changes, but pass through local handler first
            rows={8} // Increased rows for better viewing of generated content
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your generated content will appear here..."
          />
        </div>
      )}
    </div>
  );
};

export default GenerateContent;