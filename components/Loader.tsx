
import React, { useState, useEffect } from 'react';

const Loader: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Analyzing resume details...",
    "Organizing core sections...",
    "Improving clarity and flow...",
    "Ensuring professional tone...",
    "Polishing summary statement...",
    "Generating final layout..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center p-12">
      <div className="relative inline-block mb-8">
        <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-feather-alt text-blue-600 text-3xl animate-pulse"></i>
        </div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">Gemini AI is generating...</h3>
      <p className="text-blue-600 font-medium animate-pulse">{steps[step]}</p>
      <div className="mt-8 flex justify-center gap-1.5">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-blue-600' : 'w-2 bg-gray-200'}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loader;
