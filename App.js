import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import { generateResume, createCareerChat } from './geminiService.js';
import { ResumeStyle } from './types.js';

const html = htm.bind(React.createElement);

// --- Sub-components (Internalized for fix) ---

const Navbar = () => html`
  <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 no-print">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <i className="fas fa-file-signature text-lg"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">ResumeCraft<span className="text-blue-600">AI</span></h1>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">App Loaded • Ready</span>
        </div>
      </div>
      <div className="hidden md:flex items-center gap-6">
        <span className="text-xs text-green-600 font-bold uppercase tracking-widest"><i className="fas fa-circle text-[8px] mr-1"></i> System Online</span>
      </div>
    </div>
  </nav>
`;

const Loader = () => html`
  <div className="text-center p-12">
    <div className="relative inline-block mb-8">
      <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <i className="fas fa-feather-alt text-blue-600 text-3xl animate-pulse"></i>
      </div>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">Gemini AI is generating...</h3>
    <p className="text-blue-600 font-medium animate-pulse">Improving clarity and flow...</p>
  </div>
`;

const ResumePreview = ({ data, style }) => {
  const { sections } = data;
  const styleClass = style === ResumeStyle.Modern ? 'resume-modern' : 
                     style === ResumeStyle.Academic ? 'resume-academic' : 'resume-professional';

  return html`
    <div className="p-8 md:p-12 bg-white shadow-2xl mx-auto ring-1 ring-gray-200 ${styleClass} max-w-[850px]">
      <div className="text-center mb-10 pb-8 border-b">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">${sections.contact?.name || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          ${sections.contact?.location && html`<span>${sections.contact.location}</span>`}
          ${sections.contact?.email && html`<span>${sections.contact.email}</span>`}
          ${sections.contact?.phone && html`<span>${sections.contact.phone}</span>`}
        </div>
      </div>

      ${sections.introduction && html`
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-900 mb-4 tracking-tight">Professional Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">${sections.introduction}</p>
        </section>
      `}

      ${sections.experience?.length > 0 && html`
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-900 mb-4 tracking-tight">Experience</h2>
          <div className="space-y-6">
            ${sections.experience.map((exp, i) => html`
              <div key=${i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">${exp.role}</h3>
                  <span className="text-xs font-semibold text-gray-500">${exp.start_date} – ${exp.end_date}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">${exp.organization}</span>
                  <span>${exp.location}</span>
                </div>
                ${exp.responsibilities?.length > 0 && html`
                  <ul className="list-disc ml-4 space-y-1.5">
                    ${exp.responsibilities.map((resp, j) => html`<li key=${j} className="text-sm leading-relaxed text-gray-700">${resp}</li>`)}
                  </ul>
                `}
              </div>
            `)}
          </div>
        </section>
      `}

      ${sections.skills && html`
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-900 mb-4 tracking-tight">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${sections.skills.technical?.length > 0 && html`
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Technical</h4>
                <p className="text-sm text-gray-700">${sections.skills.technical.join(', ')}</p>
              </div>
            `}
            ${sections.skills.soft?.length > 0 && html`
              <div>
                <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Soft Skills</h4>
                <p className="text-sm text-gray-700">${sections.skills.soft.join(', ')}</p>
              </div>
            `}
          </div>
        </section>
      `}
    </div>
  `;
};

// --- Main App ---

export default function App() {
  const [inputText, setInputText] = useState('');
  const [resumeStyle, setResumeStyle] = useState(ResumeStyle.Professional);
  const [pageLimit, setPageLimit] = useState(1);
  const [selectedSections, setSelectedSections] = useState(['Introduction', 'Education', 'Skills', 'Experience', 'Projects', 'Contact', 'Socials', 'Languages']);
  const [resumeData, setResumeData] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) {
      setError('Please paste your career details first.');
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const data = await generateResume(inputText, pageLimit, resumeStyle, selectedSections);
      setResumeData(data);
    } catch (err) {
      console.error(err);
      setError('Generation failed. Ensure your API key is configured correctly.');
    } finally {
      setIsGenerating(false);
    }
  };

  return html`
    <div className="min-h-screen flex flex-col">
      <${Navbar} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <!-- Input Controls -->
          <div className="lg:col-span-4 space-y-6 no-print">
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <i className="fas fa-magic text-blue-600"></i> Build Your Resume
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Paste Candidate Details</label>
                  <textarea
                    className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition text-sm resize-none"
                    placeholder="Paste raw history here..."
                    value=${inputText}
                    onChange=${(e) => setInputText(e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Visual Layout</label>
                    <select 
                      value=${resumeStyle}
                      onChange=${(e) => setResumeStyle(e.target.value)}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                    >
                      ${Object.values(ResumeStyle).map(s => html`<option key=${s} value=${s}>${s}</option>`)}
                    </select>
                  </div>
                </div>

                <button
                  onClick=${handleGenerate}
                  disabled=${isGenerating}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 transition flex items-center justify-center gap-3 disabled:bg-gray-400"
                >
                  ${isGenerating ? html`<span><i className="fas fa-spinner fa-spin mr-2"></i> Generating...</span>` : html`<span><i className="fas fa-bolt mr-2"></i> Generate Professional Resume</span>`}
                </button>

                ${error && html`<div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100">${error}</div>`}
              </div>
            </section>
          </div>

          <!-- Preview Area -->
          <div className="lg:col-span-8">
            <div id="resume-preview-section" className="h-full min-h-[600px] bg-gray-100 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col overflow-hidden">
              ${isGenerating ? html`<${Loader} />` : resumeData ? html`
                <div className="flex-grow bg-white overflow-auto">
                  <div className="p-4 no-print flex justify-end gap-2">
                     <button onClick=${() => window.print()} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm flex items-center gap-2">
                       <i className="fas fa-print"></i> Print PDF
                     </button>
                  </div>
                  <${ResumePreview} data=${resumeData} style=${resumeStyle} />
                </div>
              ` : html`
                <div className="flex-grow flex flex-col items-center justify-center p-12 text-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                    <i className="fas fa-file-alt text-3xl"></i>
                  </div>
                  <h3 className="text-xl font-medium text-gray-600 mb-2">Ready to Start</h3>
                  <p className="max-w-xs">Paste your details and click generate to see your resume here.</p>
                </div>
              `}
            </div>
          </div>
        </div>
      </main>
    </div>
  `;
}