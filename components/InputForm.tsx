
import React from 'react';
import { ResumeStyle } from '../types';

interface InputFormProps {
  inputText: string;
  setInputText: (val: string) => void;
  resumeStyle: ResumeStyle;
  setResumeStyle: (val: ResumeStyle) => void;
  pageLimit: number;
  setPageLimit: (val: number) => void;
  selectedSections: string[];
  setSelectedSections: (val: string[]) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  onReset: () => void;
}

const InputForm: React.FC<InputFormProps> = ({
  inputText, setInputText,
  resumeStyle, setResumeStyle,
  pageLimit, setPageLimit,
  selectedSections, setSelectedSections,
  onGenerate, isGenerating, onReset
}) => {
  const sections = ['Introduction', 'Education', 'Skills', 'Experience', 'Projects', 'Contact', 'Socials', 'Languages'];

  const toggleSection = (section: string) => {
    if (selectedSections.includes(section)) {
      setSelectedSections(selectedSections.filter(s => s !== section));
    } else {
      setSelectedSections([...selectedSections, section]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Paste Candidate Details</label>
        <textarea
          className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-sm resize-none"
          placeholder="Paste raw resume text, LinkedIn content, or career highlights..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Visual Layout</label>
          <select 
            value={resumeStyle}
            onChange={(e) => setResumeStyle(e.target.value as ResumeStyle)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(ResumeStyle).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Page Limit</label>
          <div className="flex gap-2">
            {[1, 2].map(limit => (
              <button
                key={limit}
                onClick={() => setPageLimit(limit)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                  pageLimit === limit 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {limit} {limit === 1 ? 'Page' : 'Pages'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Sections</label>
          <div className="grid grid-cols-2 gap-2">
            {sections.map(section => (
              <label key={section} className="flex items-center gap-2 p-2 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition">
                <input 
                  type="checkbox" 
                  checked={selectedSections.includes(section)} 
                  onChange={() => toggleSection(section)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                />
                <span className="text-xs text-gray-600">{section}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <button
          onClick={onGenerate}
          disabled={isGenerating}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition flex items-center justify-center gap-3 ${
            isGenerating 
              ? 'bg-gray-400 cursor-not-allowed text-white' 
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
          }`}
        >
          {isGenerating ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              Writing...
            </>
          ) : (
            <>
              <i className="fas fa-magic"></i>
              Generate Resume
            </>
          )}
        </button>
        <button
          onClick={onReset}
          className="w-full py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
        >
          Reset Content
        </button>
      </div>
    </div>
  );
};

export default InputForm;
