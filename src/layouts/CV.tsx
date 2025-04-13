import React from 'react';
import TextSection from '../components/cv/TextSection';
import HeaderSection from '../components/cv/CVHeader';
import TimelineSection from '../components/cv/TimelineSection';
import { CVData } from '../types/cv';

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

interface CVProps {
  data?: CVData;
}

export default function CV({ data = cvData }: CVProps): React.ReactElement {
  return (
    <div className="min-h-screen bg-white text-black flex justify-center py-16 px-4">
      <div className="w-full max-w-3xl">
        <HeaderSection name={data.header.name} bio={data.header.bio} socialLinks={data.header.socialLinks} />
        <TextSection content={data.overview} />
        <TimelineSection title={"Experience"} items={data.experience} />
        <TimelineSection title={"Education"} items={data.education} />
        <TimelineSection title={"Projects"} items={data.projects} />
        {/* <CVSection title="Skills" items={data.skills} /> */}
      </div>
    </div>
  );
}
