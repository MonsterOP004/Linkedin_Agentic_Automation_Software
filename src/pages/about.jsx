import React from 'react';
import { LuBrainCircuit } from "react-icons/lu";
import { FaLinkedin, FaRobot } from "react-icons/fa";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 bg-gradient-to-br from-gray-50 to-white rounded-2xl shadow-lg border border-gray-100">
      {/* Header Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">About LinkedIn Content Generator</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Empowering professionals with AI-driven content creation for impactful LinkedIn presence
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 py-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <LuBrainCircuit className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">AI-Powered Generation</h3>
          <p className="text-gray-600">Advanced AI algorithms create engaging, professional content tailored to your needs</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
            <FaLinkedin className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">LinkedIn Integration</h3>
          <p className="text-gray-600">Seamless posting to LinkedIn with customizable visibility options</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
            <FaRobot className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Automation</h3>
          <p className="text-gray-600">Automate your content workflow with intelligent tools and features</p>
        </div>
      </div>

      {/* Description Section */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Mission</h2>
        <p className="text-gray-600 leading-relaxed mb-6">
          We're dedicated to helping professionals and businesses enhance their LinkedIn presence through innovative AI technology. Our platform combines advanced content generation with seamless automation to create engaging, professional posts that resonate with your audience.
        </p>
        <div className="grid md:grid-cols-2 gap-6 text-gray-600">
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">What We Offer:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Text, Image, Video, and URL content generation</li>
              <li>Customizable content parameters</li>
              <li>Professional tone and style options</li>
              <li>Direct LinkedIn integration</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-800">Why Choose Us:</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>State-of-the-art AI technology</li>
              <li>User-friendly interface</li>
              <li>Efficient workflow automation</li>
              <li>Professional results</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;