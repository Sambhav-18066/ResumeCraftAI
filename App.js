import React, { useState, useEffect, useRef } from 'react';
import htm from 'htm';
import { generateResume, createCareerChat } from './geminiService.js';
import { ResumeStyle } from './types.js';

const html = htm.bind(React.createElement);

// --- Sub Components ---

const Navbar = () => html`
  <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 no-print">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
          <i className="fas fa-file-signature"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">ResumeCraft<span className="text-blue-600">AI</span></h1>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-gray-400">App Loaded • Ready</span>
        </div>
      </div>
    </div>
  </nav>
`;

const ResumePreview = ({ data, style }) => {
  const { sections } = data;
  const styleClass = style === ResumeStyle.Modern ? 'resume-modern' : 
                     style === ResumeStyle.Academic ? 'resume-academic' : 'resume-professional';

  return html`
    <div className="p-12 bg-white shadow-2xl mx-auto ring-1 ring-gray-200 print-area ${styleClass} max-w-[850px]">
      <div className="text-center mb-10 pb-8 border-b">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">${sections.contact?.name || 'Candidate Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          ${sections.contact?.email && html`<span>${sections.contact.email}</span>`}
          ${sections.contact?.phone && html`<span>${sections.contact.phone}</span>`}
          ${sections.contact?.location && html`<span>${sections.contact.location}</span>`}
        </div>
      </div>

      ${sections.introduction && html`
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-900 mb-4 tracking-tight">Summary</h2>
          <p className="text-sm leading-relaxed text-gray-700">${sections.introduction}</p>
        </section>
      `}

      ${sections.experience?.length > 0 && html`
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-900 mb-4 tracking-tight">Experience</h2>
          <div className="space-y-6">
            ${sections.experience.map((exp, i) => html`
              <div key=${i}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-gray-900">${exp.role}</h3>
                  <span className="text-xs font-semibold text-gray-500">${exp.start_date} - ${exp.end_date}</span>
                </div>
                <p className="text-sm italic text-gray-600 mb-2">${exp.organization} • ${exp.location}</p>
                <ul className="list-disc ml-4 space-y-1">
                  ${exp.responsibilities?.map((r, j) => html`<li key=${j} className="text-sm text-gray-700">${r}</li>`)}
                </ul>
              </div>
            `)}
          </div>
        </section>
      `}

      ${sections.education?.length > 0 && html`
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-900 mb-4 tracking-tight">Education</h2>
          <div className="space-y-4">
            ${sections.education.map((edu, i) => html`
              <div key=${i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">${edu.degree}</h3>
                  <p className="text-sm text-gray-600">${edu.institution}</p>
                </div>
                <span className="text-xs text-gray-500">${edu.start_year} - ${edu.end_year}</span>
              </div>
            `)}
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
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    if (!inputText.trim()) return setError("Input required");
    setLoading(true);
    setError(null);
    try {
      const data = await generateResume(inputText, 1, resumeStyle, ['Experience', 'Education', 'Introduction', 'Contact']);
      setResumeData(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return html`
    <div className="min-h-screen flex flex-col">
      <${Navbar} />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 no-print">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <i className="fas fa-magic text-blue-600"></i> Generator
              </h2>
              <textarea 
                className="w-full h-64 p-4 bg-gray-50 border rounded-xl text-sm"
                placeholder="Paste experience details..."
                value=${inputText}
                onChange=${e => setInputText(e.target.value)}
              />
              <select 
                className="w-full p-3 bg-gray-50 border rounded-xl text-sm"
                value=${resumeStyle}
                onChange=${e => setResumeStyle(e.target.value)}
              >
                ${Object.values(ResumeStyle).map(s => html`<option key=${s} value=${s}>${s}</option>`)}
              </select>
              <button 
                onClick=${handleGenerate}
                disabled=${loading}
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-400"
              >
                ${loading ? 'Generating...' : 'Generate Resume'}
              </button>
              ${error && html`<p className="text-red-500 text-xs">${error}</p>`}
            </div>
          </div>
          <div className="lg:col-span-8">
            ${resumeData ? html`
              <div>
                <div className="mb-4 flex justify-end no-print">
                  <button onClick=${() => window.print()} className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm">Print PDF</button>
                </div>
                <${ResumePreview} data=${resumeData} style=${resumeStyle} />
              </div>
            ` : html`
              <div className="h-full flex flex-col items-center justify-center p-12 text-gray-400 bg-gray-100 rounded-2xl border-2 border-dashed">
                <i className="fas fa-file-alt text-4xl mb-4"></i>
                <p>Generated resume will appear here.</p>
              </div>
            `}
          </div>
        </div>
      </main>
    </div>
  `;
}