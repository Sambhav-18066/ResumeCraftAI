
import React, { useState } from 'react';
import { generateResume } from './geminiService';
import { ResumeStyle, ResumeData } from './types';
import InputForm from './components/InputForm';
import ResumePreview from './components/ResumePreview';
import ChatBot from './components/ChatBot';
import Loader from './components/Loader';
import { Navbar } from './components/Navbar';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [resumeStyle, setResumeStyle] = useState<ResumeStyle>(ResumeStyle.Professional);
  const [pageLimit, setPageLimit] = useState<number>(1);
  const [selectedSections, setSelectedSections] = useState<string[]>([
    'Introduction', 'Education', 'Skills', 'Experience', 'Projects', 'Contact', 'Socials', 'Languages'
  ]);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please paste your resume content first.');
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateResume(inputText, pageLimit, resumeStyle, selectedSections);
      setResumeData(data);
      setTimeout(() => {
        document.getElementById('resume-preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate resume. Please check your connection or input and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setResumeData(null);
    setInputText('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-pen-nib text-blue-600"></i>
                Build Your Resume
              </h2>
              <InputForm 
                inputText={inputText}
                setInputText={setInputText}
                resumeStyle={resumeStyle}
                setResumeStyle={setResumeStyle}
                pageLimit={pageLimit}
                setPageLimit={setPageLimit}
                selectedSections={selectedSections}
                setSelectedSections={setSelectedSections}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                onReset={handleReset}
              />
              {error && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  <i className="fas fa-exclamation-circle mr-2"></i>
                  {error}
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-8">
            <div id="resume-preview-section" className="h-full min-h-[600px] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col overflow-hidden">
              {isGenerating ? (
                <div className="flex-grow flex items-center justify-center bg-white">
                  <Loader />
                </div>
              ) : resumeData ? (
                <div className="flex-grow bg-white overflow-auto">
                  <div className="p-4 md:p-8">
                    <div className="flex justify-between items-center mb-6 no-print">
                      <h3 className="text-lg font-semibold text-gray-500">Preview</h3>
                      <button 
                        onClick={() => window.print()}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition flex items-center gap-2"
                      >
                        <i className="fas fa-print"></i>
                        Print / Save PDF
                      </button>
                    </div>
                    <div className="shadow-2xl mx-auto bg-white ring-1 ring-gray-200">
                      <ResumePreview data={resumeData} style={resumeStyle} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-file-alt text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Ready to Start</h3>
                  <p className="max-w-xs">Paste your career details and select your preferences to generate a professional resume.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <ChatBot />

      <footer className="bg-white border-t border-gray-100 py-6 text-center text-gray-400 text-sm no-print">
        <p>&copy; 2024 ResumeCraft AI. Professional Resume Generation.</p>
      </footer>
    </div>
  );
};

export default App;
