import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import TextContent from './pages/text_content';
import URLContent from './pages/url_content';
import ImageContent from './pages/image_content';
import VideoContent from './pages/video_content';
import About from './pages/about';

// Navigation component
const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'About Us', component: 'about us' },
    { path: '/text', label: 'Text', component: 'text' },
    { path: '/url', label: 'URL', component: 'url' },
    { path: '/image', label: 'Image', component: 'image' },
    { path: '/video', label: 'Video', component: 'video' },
  ];

  return (
    <nav className="mb-8">
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {navItems.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${location.pathname === path
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

// Main App component with shared state
const AppContent = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Linkedin Agentic AI Automation</h1>

        <Navigation />

        <div className="bg-white rounded-lg shadow-sm border-b-blue-500 p-6">
          <Routes>
            <Route path="/" element={<About />}/>
            <Route path="/text" element={<TextContent handleChange={handleChange} formData={formData} />} />
            <Route path="/url" element={<URLContent handleChange={handleChange} formData={formData} />} />
            <Route path="/image" element={<ImageContent handleChange={handleChange} formData={formData} />} />
            <Route path="/video" element={<VideoContent handleChange={handleChange} formData={formData} />} />
          </Routes>
        </div>
        <div className="mt-10 mb-6">
          <div className="inline-block bg-white px-6 py-3 rounded-xl shadow-md border border-gray-200">
            <p className="text-sm text-gray-500">
              Made with ❤️ by{' '}
              <a
                href="https://www.linkedin.com/in/rushi-arpan-shah-8b36b124b/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-blue-600 hover:underline"
              >
                Rushi Shah
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;