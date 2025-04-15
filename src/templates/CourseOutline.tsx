import React, { useState } from 'react';
// Assuming lucide-react is installed: npm install lucide-react
// If not, you can replace icons with SVGs or text
import { ChevronRight, ChevronDown, CheckCircle2, Circle, PlayCircle, Clock, BarChart, Tag, Users, Share2, Bookmark, Search } from 'lucide-react';

// --- TypeScript Interfaces ---

interface Guide {
  id: string;
  title: string;
  completed: boolean;
  // Optional: Add estimated time per guide? e.g., durationMinutes: number;
}

interface Section {
  id: string;
  title: string;
  guides: Guide[];
  // Calculate section completion based on guides
  isCompleted: boolean; // Pre-calculate or calculate on the fly
}

interface Course {
  id: string;
  title: string;
  description: string;
  author: string;
  createdDate: string; // Using string for simplicity, could be Date object
  videoUrl: string; // Placeholder, e.g., YouTube embed URL or video file path
  videoDescription: string;
  sections: Section[];
  userProgress: number; // Percentage 0-100
  estimatedTime: string; // e.g., "5 hours"
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string; // e.g., "Web Development"
  studentCount: number; // e.g., 12345
  // Optional: prerequisites?: string[];
}

// --- Dummy Data ---

const courseData: Course = {
  id: 'react-ts-tailwind-101',
  title: 'Mastering React with TypeScript & Tailwind CSS',
  description: 'A comprehensive guide to building modern web applications using the powerful combination of React, TypeScript, and Tailwind CSS. Learn best practices, advanced patterns, and build real-world projects.',
  author: 'Sophical',
  createdDate: '2024-10-26',
  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Example placeholder URL
  videoDescription: 'Get a quick overview of what this course covers, the prerequisites, and what you\'ll be able to build by the end.',
  userProgress: 35, // Example progress
  estimatedTime: '18 hours',
  difficulty: 'Intermediate',
  category: 'Frontend Development',
  studentCount: 18452,
  sections: [
    {
      id: 'sec-1',
      title: 'Introduction & Setup',
      isCompleted: true, // All guides completed
      guides: [
        { id: 'g-1-1', title: 'Course Overview', completed: true },
        { id: 'g-1-2', title: 'Why React, TypeScript & Tailwind?', completed: true },
        { id: 'g-1-3', title: 'Environment Setup (Node, npm, VS Code)', completed: true },
        { id: 'g-1-4', title: 'Creating Your First React App with Vite', completed: true },
        { id: 'g-1-5', title: 'Integrating Tailwind CSS', completed: true },
      ],
    },
    {
      id: 'sec-2',
      title: 'React Fundamentals Revisited',
      isCompleted: false, // Some guides incomplete
      guides: [
        { id: 'g-2-1', title: 'JSX Deep Dive', completed: true },
        { id: 'g-2-2', title: 'Components & Props', completed: true },
        { id: 'g-2-3', title: 'State & Lifecycle', completed: true },
        { id: 'g-2-4', title: 'Handling Events', completed: false },
        { id: 'g-2-5', title: 'Conditional Rendering', completed: false },
        { id: 'g-2-6', title: 'Lists & Keys', completed: false },
      ],
    },
    {
      id: 'sec-3',
      title: 'TypeScript Essentials for React',
      isCompleted: false,
      guides: [
        { id: 'g-3-1', title: 'Basic Types & Syntax', completed: false },
        { id: 'g-3-2', title: 'Interfaces & Types', completed: false },
        { id: 'g-3-3', title: 'Typing Components & Props', completed: false },
        { id: 'g-3-4', title: 'Typing Hooks (useState, useEffect)', completed: false },
        { id: 'g-3-5', title: 'Generics in React', completed: false },
      ],
    },
    {
      id: 'sec-4',
      title: 'Styling with Tailwind CSS',
      isCompleted: false,
      guides: [
        { id: 'g-4-1', title: 'Utility-First Fundamentals', completed: false },
        { id: 'g-4-2', title: 'Responsive Design', completed: false },
        { id: 'g-4-3', title: 'Customizing Tailwind', completed: false },
        { id: 'g-4-4', title: 'Dark Mode', completed: false },
        { id: 'g-4-5', title: 'Using @apply and Components', completed: false },
      ],
    },
    // Add more sections as needed
  ],
};

// --- Components ---

// Breadcrumb Component
const Breadcrumb: React.FC = () => (
  <nav aria-label="breadcrumb" className="mb-6 text-sm text-gray-500">
    <ol className="list-none p-0 inline-flex">
      <li className="flex items-center">
        <a href="#" className="hover:text-black">Courses</a>
        <ChevronRight size={14} className="mx-2" />
      </li>
      <li className="flex items-center">
        <a href="#" className="hover:text-black">{courseData.category}</a>
        <ChevronRight size={14} className="mx-2" />
      </li>
      <li className="flex items-center text-black" aria-current="page">
        {courseData.title}
      </li>
    </ol>
  </nav>
);

// Video Introduction Component
const VideoIntroduction: React.FC<{ videoUrl: string; description: string }> = ({ videoUrl, description }) => (
  <div className="mb-8 p-6 border border-gray-200 rounded-lg bg-white">
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      <PlayCircle size={20} className="mr-2 text-gray-700" />
      Course Introduction
    </h2>
    <div className="aspect-video mb-4 bg-gray-100 rounded overflow-hidden">
      {/* Basic placeholder, replace with actual video player if needed */}
      <iframe
        width="100%"
        height="100%"
        src={videoUrl}
        title="Course Introduction Video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="border-0"
      ></iframe>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

// Section Component (Accordion Item)
const SectionItem: React.FC<{ section: Section; onGuideClick: (guideId: string) => void }> = ({ section, onGuideClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalGuides = section.guides.length;
  const completedGuides = section.guides.filter(g => g.completed).length;
  const sectionProgress = totalGuides > 0 ? Math.round((completedGuides / totalGuides) * 100) : 0;

  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden bg-white">
      {/* Section Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-50 focus:outline-none"
        aria-expanded={isOpen}
        aria-controls={`section-content-${section.id}`}
      >
        <div className="flex items-center">
          {section.isCompleted ? (
            <CheckCircle2 size={20} className="mr-3 text-green-600 flex-shrink-0" />
          ) : (
            <Circle size={20} className={`mr-3 ${completedGuides > 0 ? 'text-yellow-500' : 'text-gray-400'} flex-shrink-0`} />
          )}
          <span className="font-medium text-lg">{section.title}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <span className="mr-4">{completedGuides}/{totalGuides} guides</span>
          {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </div>
      </button>

      {/* Section Content (Guides) */}
      {isOpen && (
        <div id={`section-content-${section.id}`} className="border-t border-gray-200">
          <ul>
            {section.guides.map((guide, index) => (
              <li key={guide.id} className={`border-b border-gray-100 last:border-b-0 ${index === 0 ? '' : ''}`}>
                <a
                  href="#" // Replace with actual navigation logic or router link
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default link behavior
                    onGuideClick(guide.id);
                  }}
                  className="flex items-center p-4 pl-10 hover:bg-gray-100 transition-colors duration-150"
                >
                  {guide.completed ? (
                    <CheckCircle2 size={16} className="mr-3 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle size={16} className="mr-3 text-gray-400 flex-shrink-0" />
                  )}
                  <span className="text-gray-800">{guide.title}</span>
                  {/* Optional: Add guide duration here */}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// Main Course Outline Page Component
const CourseOutlinePage: React.FC = () => {
  const [activeGuide, setActiveGuide] = useState<string | null>(null); // State to simulate navigation

  // Handler for clicking a guide
  const handleGuideClick = (guideId: string) => {
    console.log(`Navigating to guide: ${guideId}`);
    setActiveGuide(guideId);
    // In a real app, you would use React Router or similar to navigate
    // e.g., navigate(`/courses/${courseData.id}/guides/${guideId}`);
  };

  // Calculate overall section completion status (can be done here or pre-calculated in data)
  const sectionsWithCompletion = courseData.sections.map(section => {
      const completedGuides = section.guides.filter(g => g.completed).length;
      const totalGuides = section.guides.length;
      return {
          ...section,
          isCompleted: totalGuides > 0 && completedGuides === totalGuides,
      };
  });


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content Area (Left/Top) */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-black">{courseData.title}</h1>
              <p className="text-lg text-gray-600 mb-6">{courseData.description}</p>
            </div>

            {/* Video Introduction */}
            <VideoIntroduction videoUrl={courseData.videoUrl} description={courseData.videoDescription} />

            {/* Active Guide Display (Simulation) */}
            {activeGuide && (
                <div className="mb-8 p-6 border border-blue-300 rounded-lg bg-blue-50">
                    <h3 className="text-lg font-semibold text-blue-800">Currently Viewing Guide (Simulation)</h3>
                    <p className="text-blue-700">You clicked on guide with ID: <strong>{activeGuide}</strong>. In a real app, this content area would show the guide's details.</p>
                    <button onClick={() => setActiveGuide(null)} className="mt-2 text-sm text-blue-600 hover:underline">Close Guide View</button>
                </div>
            )}


            {/* Course Content Sections */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Course Content</h2>
                {/* Optional: Add expand/collapse all button */}
              </div>
              <div>
                {sectionsWithCompletion.map(section => (
                  <SectionItem key={section.id} section={section} onGuideClick={handleGuideClick} />
                ))}
              </div>
            </div>

          </div>

          {/* Sidebar (Right/Bottom) */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Your Progress</span>
                  <span className="text-sm font-bold text-black">{courseData.userProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-black h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${courseData.userProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Course Meta Info */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex items-center text-gray-600">
                  <Clock size={16} className="mr-2 flex-shrink-0" />
                  <span>Estimated time: <span className="font-medium text-black">{courseData.estimatedTime}</span></span>
                </div>
                <div className="flex items-center text-gray-600">
                  <BarChart size={16} className="mr-2 flex-shrink-0" />
                  <span>Difficulty: <span className="font-medium text-black">{courseData.difficulty}</span></span>
                </div>
                 <div className="flex items-center text-gray-600">
                  <Tag size={16} className="mr-2 flex-shrink-0" />
                  <span>Category: <span className="font-medium text-black">{courseData.category}</span></span>
                </div>
                 <div className="flex items-center text-gray-600">
                  <Users size={16} className="mr-2 flex-shrink-0" />
                  <span><span className="font-medium text-black">{courseData.studentCount.toLocaleString()}</span> students enrolled</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2 font-medium">Author:</span>
                  <span className="font-medium text-black">{courseData.author}</span>
                </div>
                 <div className="flex items-center text-gray-600">
                  <span className="mr-2 font-medium">Created:</span>
                  <span className="font-medium text-black">{new Date(courseData.createdDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                 <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                     <Share2 size={16} className="mr-2"/> Share Course
                 </button>
                  <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                     <Bookmark size={16} className="mr-2"/> Bookmark
                 </button>
              </div>

              {/* Optional: Search within course */}
              <div className="mt-6">
                  <label htmlFor="course-search" className="sr-only">Search within course</label>
                  <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search size={16} className="text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                          type="search"
                          name="course-search"
                          id="course-search"
                          className="focus:ring-black focus:border-black block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2"
                          placeholder="Search guides..."
                      />
                  </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the main component for use in a React application
export default CourseOutlinePage; // Use `App` if that's the standard export name expected

// If you need a root component named App for preview/export:
// const App = () => {
//   return <CourseOutlinePage />;
// }
// export default App;
