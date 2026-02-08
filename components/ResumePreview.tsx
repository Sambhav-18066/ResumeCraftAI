import React from 'react';
import { ResumeData, ResumeStyle } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  style: ResumeStyle;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, style }) => {
  const { sections } = data;

  const getStyleClasses = () => {
    switch (style) {
      // Fixed: Replaced ResumeStyle.Elegant (which doesn't exist) with ResumeStyle.Professional
      case ResumeStyle.Professional: return 'resume-professional max-w-[850px] p-12 text-gray-800 bg-white';
      case ResumeStyle.Modern: return 'resume-modern max-w-[850px] p-10 text-gray-800 bg-white';
      case ResumeStyle.Academic: return 'resume-academic max-w-[850px] p-12 text-zinc-900 bg-white';
      case ResumeStyle.Minimal: 
      default: return 'resume-minimal max-w-[850px] p-12 text-gray-900 bg-white';
    }
  };

  const renderSectionTitle = (title: string) => {
    if (style === ResumeStyle.Modern) {
      return (
        <h2 className="text-sm font-black text-blue-600 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
          {title}
          <div className="flex-grow h-[1px] bg-blue-100"></div>
        </h2>
      );
    }
    return <h2 className="text-lg font-bold text-gray-900 uppercase border-b-2 border-gray-900 mb-4 tracking-tight">{title}</h2>;
  };

  return (
    <div className={getStyleClasses()}>
      {/* Contact Section */}
      <div className="text-center mb-10 pb-8 border-b">
        <h1 className="text-4xl font-bold mb-3 text-gray-900">{sections.contact?.name || 'Your Name'}</h1>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          {sections.contact?.location && <span>{sections.contact.location}</span>}
          {sections.contact?.email && <span>{sections.contact.email}</span>}
          {sections.contact?.phone && <span>{sections.contact.phone}</span>}
        </div>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-1 text-xs text-blue-600 mt-2">
          {sections.socials?.linkedin && (
            <a href={sections.socials.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-1">
              <i className="fab fa-linkedin"></i> LinkedIn
            </a>
          )}
          {sections.socials?.portfolio && (
            <a href={sections.socials.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-1">
              <i className="fas fa-globe"></i> Portfolio
            </a>
          )}
          {sections.socials?.other?.map((link, i) => (
            <span key={i} className="flex items-center gap-1">{link}</span>
          ))}
        </div>
      </div>

      {/* Introduction */}
      {sections.introduction && (
        <section className="mb-8">
          {renderSectionTitle("Professional Summary")}
          <p className="text-sm leading-relaxed text-gray-700">{sections.introduction}</p>
        </section>
      )}

      {/* Experience */}
      {sections.experience && sections.experience.length > 0 && (
        <section className="mb-8">
          {renderSectionTitle("Experience")}
          <div className="space-y-6">
            {sections.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900">{exp.role}</h3>
                  <span className="text-xs font-semibold text-gray-500">{exp.start_date} – {exp.end_date}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span className="font-medium">{exp.organization}</span>
                  <span>{exp.location}</span>
                </div>
                {exp.responsibilities && exp.responsibilities.length > 0 && (
                  <ul className="list-disc ml-4 space-y-1.5">
                    {exp.responsibilities.map((resp, j) => (
                      <li key={j} className="text-sm leading-relaxed text-gray-700">{resp}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sections.skills && (
        <section className="mb-8">
          {renderSectionTitle("Skills")}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {sections.skills.technical?.length > 0 && (
                <div>
                   <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Technical</h4>
                   <p className="text-sm text-gray-700">{sections.skills.technical.join(', ')}</p>
                </div>
             )}
             {sections.skills.software?.length > 0 && (
                <div>
                   <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Software</h4>
                   <p className="text-sm text-gray-700">{sections.skills.software.join(', ')}</p>
                </div>
             )}
             {sections.skills.laboratory?.length > 0 && (
                <div>
                   <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Laboratory</h4>
                   <p className="text-sm text-gray-700">{sections.skills.laboratory.join(', ')}</p>
                </div>
             )}
             {sections.skills.soft?.length > 0 && (
                <div>
                   <h4 className="text-xs font-bold uppercase text-gray-500 mb-1 tracking-wider">Soft Skills</h4>
                   <p className="text-sm text-gray-700">{sections.skills.soft.join(', ')}</p>
                </div>
             )}
          </div>
        </section>
      )}

      {/* Education */}
      {sections.education && sections.education.length > 0 && (
        <section className="mb-8">
          {renderSectionTitle("Education")}
          <div className="space-y-4">
            {sections.education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.institution}, {edu.location}</p>
                  {edu.details && <p className="text-xs text-gray-500 mt-1 italic">{edu.details}</p>}
                </div>
                <span className="text-xs font-semibold text-gray-500">{edu.start_year} – {edu.end_year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sections.projects && sections.projects.length > 0 && (
        <section className="mb-8">
          {renderSectionTitle("Projects")}
          <div className="space-y-4">
            {sections.projects.map((proj, i) => (
              <div key={i}>
                <h3 className="font-bold text-gray-900 text-sm mb-1">{proj.title}</h3>
                {proj.description && proj.description.length > 0 && (
                  <ul className="list-disc ml-4 space-y-1">
                    {proj.description.map((desc, j) => (
                      <li key={j} className="text-sm text-gray-700">{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {sections.languages && sections.languages.length > 0 && (
        <section className="mb-8">
          {renderSectionTitle("Languages")}
          <p className="text-sm text-gray-700">{sections.languages.join(', ')}</p>
        </section>
      )}
    </div>
  );
};

export default ResumePreview;