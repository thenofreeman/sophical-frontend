import React from 'react';
import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

// TypeScript Interfaces
interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

interface HeaderData {
  name: string;
  bio: string;
  socialLinks: SocialLink[];
}

interface ItemWithTags {
  period?: string;
  category?: string;
  title?: string;
  description?: string;
  tags: string[];
  link?: {
    url: string;
    text: string;
  };
}

interface CVData {
  header: HeaderData;
  overview: string;
  experience: ItemWithTags[];
  education: ItemWithTags[];
  projects: ItemWithTags[];
  skills: ItemWithTags[];
}

// CV Data structure
const cvData: CVData = {
  header: {
    name: "John Doe",
    bio: "Full Stack Developer • Building digital experiences that matter",
    socialLinks: [
      { icon: "github", url: "https://github.com/johndoe", label: "GitHub" },
      { icon: "twitter", url: "https://twitter.com/johndoe", label: "Twitter" },
      { icon: "linkedin", url: "https://linkedin.com/in/johndoe", label: "LinkedIn" },
      { icon: "mail", url: "mailto:john@example.com", label: "Email" }
    ]
  },
  overview: "I'm a full stack developer with 7+ years of experience building web applications with React, Node.js, and modern cloud infrastructure. I focus on creating clean, maintainable code and intuitive user experiences that help businesses achieve their goals. Currently interested in AI-enhanced applications and design systems that scale.",
  experience: [
    {
      period: "2021 - Present",
      title: "Senior Frontend Engineer at TechCorp",
      description: "Led the development of the company's new design system and component library, reducing development time by 40% and improving UI consistency across products.",
      tags: ["React", "TypeScript", "Design Systems"]
    },
    {
      period: "2018 - 2021",
      title: "Web Developer at StartupX",
      description: "Developed and maintained multiple client websites and web applications, focusing on responsive design and performance optimization.",
      tags: ["JavaScript", "Node.js", "MongoDB"]
    }
  ],
  education: [
    {
      period: "2014 - 2018",
      title: "Bachelor of Science in Computer Science",
      description: "University of Technology, magna cum laude. Focus on software engineering and database systems.",
      tags: ["Algorithms", "Database Design", "Systems Architecture"]
    }
  ],
  projects: [
    {
      period: "2023",
      title: "DataViz Dashboard",
      description: "Open-source data visualization dashboard with customizable widgets and real-time updates. Over 500 stars on GitHub.",
      link: { url: "https://github.com/johndoe/dataviz", text: "View project" },
      tags: ["React", "D3.js", "Firebase"]
    },
    {
      period: "2022",
      title: "MinimalNote",
      description: "A clean, minimal note-taking PWA with markdown support and offline functionality.",
      link: { url: "https://minimalnote.app", text: "View project" },
      tags: ["PWA", "IndexedDB", "Service Workers"]
    }
  ],
  skills: [
    {
      category: "Frontend",
      tags: ["React", "TypeScript", "HTML/CSS", "Tailwind", "Next.js"]
    },
    {
      category: "Backend",
      tags: ["Node.js", "Express", "MongoDB", "PostgreSQL", "GraphQL"]
    }
  ]
};

// Icon component to map string names to Lucide icons
interface SocialIconProps {
  name: string;
  size?: number;
}

const SocialIcon: React.FC<SocialIconProps> = ({ name, size = 20 }) => {
  switch (name) {
    case 'github':
      return <Github size={size} />;
    case 'twitter':
      return <Twitter size={size} />;
    case 'linkedin':
      return <Linkedin size={size} />;
    case 'mail':
      return <Mail size={size} />;
    default:
      return <ExternalLink size={size} />;
  }
};

// CV Section component for rendering items with period, title, description, and tags
interface CVSectionProps {
  title: string;
  items: ItemWithTags[];
}

const CVSection: React.FC<CVSectionProps> = ({ title, items }) => {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-left border-b border-gray-200 pb-1">{title}</h2>

      {items.map((item, index) => (
        <div className="mb-8 flex" key={index}>
          <div className="w-1/5 pr-6 text-left text-gray-500 pt-1">
            {item.period || item.category}
          </div>
          <div className="w-4/5">
            {item.title && <h3 className="font-medium text-lg">{item.title}</h3>}
            {item.description && <p className="text-gray-700 my-2">{item.description}</p>}
            {item.link && (
              <div className="flex items-center gap-2 mt-1 text-gray-800">
                <ExternalLink size={16} />
                <a href={item.link.url} className="underline hover:no-underline">{item.link.text}</a>
              </div>
            )}
            {item.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 text-sm">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

// Main CV Component
interface CVProps {
  data?: CVData;
}

export default function CV({ data = cvData }: CVProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-white text-black flex justify-center py-16 px-4">
      <div className="w-full max-w-3xl">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-2">{data.header.name}</h1>
          <p className="text-lg mb-6 text-gray-700">{data.header.bio}</p>
          <div className="flex justify-center space-x-4">
            {data.header.socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                className="hover:opacity-70 transition-opacity"
                aria-label={link.label}
              >
                <SocialIcon name={link.icon} />
              </a>
            ))}
          </div>
        </header>

        {/* Overview Section */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4 text-left border-b border-gray-200 pb-1">Overview</h2>
          <p className="text-gray-800">{data.overview}</p>
        </section>

        {/* Experience Section */}
        <CVSection title="Experience" items={data.experience} />

        {/* Education Section */}
        <CVSection title="Education" items={data.education} />

        {/* Projects Section */}
        <CVSection title="Projects" items={data.projects} />

        {/* Skills Section */}
        <CVSection title="Skills" items={data.skills} />
      </div>
    </div>
  );
}
