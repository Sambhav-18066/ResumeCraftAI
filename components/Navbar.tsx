
import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <i className="fas fa-file-signature text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">ResumeCraft<span className="text-blue-600">AI</span></h1>
            <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">Professional Resume Generator</span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">How it works</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">Templates</a>
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600">Resume Guide</a>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition shadow-md shadow-blue-100">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};
