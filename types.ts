
export enum ResumeStyle {
  Minimal = 'Minimal',
  Professional = 'Professional',
  Modern = 'Modern',
  Academic = 'Academic'
}

export interface Contact {
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
}

export interface Socials {
  linkedin: string | null;
  portfolio: string | null;
  other: string[];
}

export interface Education {
  degree: string | null;
  institution: string | null;
  location: string | null;
  start_year: string | null;
  end_year: string | null;
  details: string | null;
}

export interface Skills {
  technical: string[];
  laboratory: string[];
  software: string[];
  soft: string[];
}

export interface Experience {
  role: string | null;
  organization: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  responsibilities: string[];
}

export interface Project {
  title: string | null;
  description: string[];
}

export interface ResumeData {
  page_limit: number;
  sections: {
    introduction: string | null;
    contact: Contact;
    socials: Socials;
    education: Education[];
    skills: Skills;
    experience: Experience[];
    projects: Project[];
    languages: string[];
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
