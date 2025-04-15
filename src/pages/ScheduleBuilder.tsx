import React, { useState } from 'react';
import { X, Plus, Filter, Calendar, ChevronRight, ChevronDown } from 'lucide-react';

// Types
type Term = {
  id: string;
  name: string;
};

type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  professor: string;
  isExpanded: boolean;
};

type Schedule = {
  id: string;
  name: string;
  courses: Course[];
};

// Mock data
const terms: Term[] = [
  { id: '1', name: 'Fall 2025' },
  { id: '2', name: 'Spring 2026' },
  { id: '3', name: 'Summer 2026' },
];

const initialCourses: Course[] = [
  { id: '1', code: 'COMP 1010', name: 'Introduction to Computer Science', credits: 3, professor: 'Dr. Smith', isExpanded: false },
  { id: '2', code: 'MATH 2418', name: 'Linear Algebra', credits: 4, professor: 'Dr. Johnson', isExpanded: false },
];

const mockSchedules: Schedule[] = [
  { id: '1', name: 'Schedule Option 1', courses: initialCourses },
  { id: '2', name: 'Schedule Option 2', courses: initialCourses.slice(0, 1) },
];

export default function ScheduleBuilder() {
  const [selectedTerm, setSelectedTerm] = useState<string>(terms[0].id);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [schedules, setSchedules] = useState<Schedule[]>(mockSchedules);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);

  // Course management functions
  const addCourse = () => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      code: 'NEW COURSE',
      name: 'New Course Name',
      credits: 3,
      professor: 'TBD',
      isExpanded: false,
    };
    setCourses([...courses, newCourse]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  const toggleCourseDetails = (id: string) => {
    setCourses(
      courses.map(course =>
        course.id === id
          ? { ...course, isExpanded: !course.isExpanded }
          : course
      )
    );
  };

  const selectSchedule = (id: string) => {
    setSelectedSchedule(id === selectedSchedule ? null : id);
  };

  return (
  <div className="min-h-screen bg-white text-black flex justify-center py-16 px-4">
    <div className="flex flex-col min-h-screen">
      {/* Header - Term Selection */}
      <div className="w-full p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold mb-4">Schedule Builder</h1>
        <div className="flex items-center">
          <label className="mr-4 font-medium">Term:</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="p-2 border border-gray-300 rounded bg-white"
          >
            {terms.map(term => (
              <option key={term.id} value={term.id}>{term.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col md:flex-row w-full">
        {/* Left column - Course List */}
        <div className="w-full md:w-1/2 p-6 border-r border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Planned Courses</h2>
            <button
              onClick={addCourse}
              className="flex items-center px-3 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-3">
            {courses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded">
                <div className="flex justify-between items-center p-3">
                  <div>
                    <p className="font-medium">{course.code}: {course.name}</p>
                    <p className="text-sm text-gray-600">{course.credits} credits</p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => toggleCourseDetails(course.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Toggle details"
                    >
                      {course.isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Remove course"
                    >
                      <X size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Filter course details"
                    >
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                {course.isExpanded && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm"><strong>Professor:</strong> {course.professor}</p>
                    <p className="text-sm mt-1"><strong>Prerequisites:</strong> None</p>
                    <p className="text-sm mt-1"><strong>Available Sections:</strong> 3</p>
                  </div>
                )}
              </div>
            ))}

            {courses.length === 0 && (
              <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded">
                No courses selected. Click "+" to get started.
              </div>
            )}
          </div>
        </div>

        {/* Right column - Empty for now */}
        <div className="w-full md:w-1/2 p-6 border-r border-transparent">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Registered Courses</h2>
          </div>

          <div className="space-y-3">
            {courses.map(course => (
              <div key={course.id} className="border border-gray-200 rounded">
                <div className="flex justify-between items-center p-3">
                  <div>
                    <p className="font-medium">{course.code}: {course.name}</p>
                    <p className="text-sm text-gray-600">{course.credits} credits</p>
                  </div>
                  <div className="flex space-x-2 ml-2">
                    <button
                      onClick={() => toggleCourseDetails(course.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Toggle details"
                    >
                      {course.isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    </button>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Remove course"
                    >
                      <X size={18} />
                    </button>
                    <button
                      className="p-1 hover:bg-gray-100 rounded"
                      aria-label="Filter course details"
                    >
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                {course.isExpanded && (
                  <div className="p-3 bg-gray-50 border-t border-gray-200">
                    <p className="text-sm"><strong>Professor:</strong> {course.professor}</p>
                    <p className="text-sm mt-1"><strong>Prerequisites:</strong> None</p>
                    <p className="text-sm mt-1"><strong>Available Sections:</strong> 3</p>
                  </div>
                )}
              </div>
            ))}

            {courses.length === 0 && (
              <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded">
                No courses selected. Click "+" to get started.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom section - Possible Schedules */}
      <div className="w-full p-6 bg-white border-t border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Schedules</h2>

        {selectedSchedule ? (
          <div className="border border-gray-200 rounded p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                {schedules.find(s => s.id === selectedSchedule)?.name}
              </h3>
              <button
                onClick={() => setSelectedSchedule(null)}
                className="flex items-center text-sm text-gray-600 hover:text-black"
              >
                Back to list
              </button>
            </div>

            <div className="border border-gray-200 p-4 rounded bg-gray-50">
              <div className="flex items-center justify-center h-64">
                <div className="flex items-center text-gray-500">
                  <Calendar size={24} className="mr-2" />
                  <span>Calendar view for selected schedule would display here</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {schedules.map(schedule => (
              <div
                key={schedule.id}
                className="border border-gray-200 rounded p-4 cursor-pointer hover:bg-gray-50"
                onClick={() => selectSchedule(schedule.id)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{schedule.name}</h3>
                    <p className="text-sm text-gray-600">
                      {schedule.courses.length} courses • {schedule.courses.reduce((sum, c) => sum + c.credits, 0)} total credits
                    </p>
                  </div>
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}

            {schedules.length === 0 && (
              <div className="p-4 text-center text-gray-500 border border-dashed border-gray-300 rounded">
                No schedules generated yet. Add courses to see potential schedules.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  );
}
