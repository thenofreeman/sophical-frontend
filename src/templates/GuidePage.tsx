import React, { useState } from 'react';
import clsx from 'clsx'; // For conditional classes
import Latex from 'react-latex';

// --- Interfaces/Types (Same as before) ---

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface VideoData {
  url: string;
  shortDescription: string;
  transcript: string;
}

interface CodeSnippet {
  language: string;
  code: string;
}

interface QuoteData {
  text: string;
  author: string;
}

type NoteType = 'Note' | 'Technical Details' | 'Questions';

interface EmphasizedNoteData {
  type: NoteType;
  content: string | React.ReactNode;
}

interface MultipleChoiceQuestionData {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface ContentBlock {
    type: 'paragraph' | 'code' | 'quote' | 'note' | 'math' | 'mcq';
    data: any;
}

// --- Dummy Data (Same as before) ---

const breadcrumbItemsData: BreadcrumbItem[] = [
  { label: 'Learning Paths', href: '/paths' },
  { label: 'React Fundamentals', href: '/paths/react' },
  { label: 'Component Lifecycle' },
];

const videoData: VideoData = {
  url: 'https://www.example.com/dummy-video.mp4',
  shortDescription: 'This video explains the core concepts of the React component lifecycle, including mounting, updating, and unmounting phases.',
  transcript: `
(0:01) Hello and welcome! Today we're diving into the React component lifecycle.
(0:05) There are three main phases: Mounting, Updating, and Unmounting.
(0:10) Mounting involves constructor, static getDerivedStateFromProps, render, and componentDidMount.
(0:25) Updating occurs when props or state change, involving methods like shouldComponentUpdate and componentDidUpdate.
(0:40) Unmounting uses componentWillUnmount for cleanup.
(0:50) Functional components use Hooks like useEffect to achieve similar lifecycle behaviors.
(1:05) Thanks for watching!
  `,
};

const mainContentData: ContentBlock[] = [
    { type: 'paragraph', data: 'Welcome to this guide on React components. We will cover the essential aspects needed to get started. Understanding the component lifecycle is crucial for building efficient React applications.' },
    { type: 'note', data: { type: 'Note', content: 'Make sure you have Node.js and npm/yarn installed before starting the exercises.' } as EmphasizedNoteData },
    { type: 'paragraph', data: 'Components let you split the UI into independent, reusable pieces. Conceptually, components are like JavaScript functions. They accept arbitrary inputs (called “props”) and return React elements describing what should appear on the screen.' },
    { type: 'code', data: [
        { language: 'JavaScript', code: `function Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\nconst element = <Welcome name="Sara" />;\nReactDOM.render(\n  element,\n  document.getElementById('root')\n);` },
        { language: 'TypeScript', code: `import React from 'react';\nimport ReactDOM from 'react-dom';\n\ninterface WelcomeProps {\n  name: string;\n}\n\nconst Welcome: React.FC<WelcomeProps> = (props) => {\n  return <h1>Hello, {props.name}</h1>;\n}\n\nconst element = <Welcome name="Sara" />;\nReactDOM.render(\n  element,\n  document.getElementById('root')\n);` },
        { language: 'Python', code: `# This is just an example\nclass Greeter:\n    def __init__(self, name):\n        self.name = name\n\n    def greet(self):\n        print(f"Hello, {self.name}")\n\ng = Greeter("World")\ng.greet()` },
    ] as CodeSnippet[]},
    { type: 'paragraph', data: 'State is similar to props, but it is private and fully controlled by the component. Remember that `setState()` is asynchronous.' },
    { type: 'quote', data: { text: 'The beautiful thing about learning is that nobody can take it away from you.', author: 'B.B. King' } as QuoteData },
    { type: 'note', data: { type: 'Technical Details', content: (<>React uses a Virtual DOM to optimize updates. When `setState` is called, React creates a new virtual DOM tree, compares it with the previous one (diffing), and then updates the real DOM only where necessary.</>) } as EmphasizedNoteData },
    { type: 'math', data: 'Inline math like the Pythagorean theorem $a^2 + b^2 = c^2$ can be included directly in the text. We can also have display math: $$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$ Remember that rendering requires a library like KaTeX or MathJax.' },
    { type: 'note', data: { type: 'Questions', content: 'How does the `useEffect` hook map to class component lifecycle methods? Consider cleanup functions.' } as EmphasizedNoteData },
    { type: 'mcq', data: { id: 'mcq-1', question: 'Which lifecycle method is invoked immediately after a component is mounted (inserted into the tree)?', options: ['componentWillMount', 'componentDidMount', 'render', 'constructor'], correctAnswerIndex: 1 } as MultipleChoiceQuestionData }
];

// --- Sub Components (Using Tailwind CSS) ---

// Breadcrumb Component
interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => (
  <nav aria-label="breadcrumb">
    <ol className="list-none p-0 m-0 flex gap-2 text-sm text-gray-600">
      {items.map((item, index) => (
        <li key={index} className="flex items-center">
          {item.href ? (
            <a href={item.href} className="text-black hover:text-gray-700 no-underline hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-800 font-semibold">{item.label}</span>
          )}
          {index < items.length - 1 && <span className="mx-2 text-gray-400">/</span>}
        </li>
      ))}
    </ol>
  </nav>
);

// Video Player Placeholder Component
interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => (
  <div className="w-full aspect-video bg-gray-100 border border-gray-300 rounded flex flex-col justify-center items-center text-gray-600 text-lg mb-4">
    <p>Video Player Placeholder</p>
    <p className="text-sm">(URL: {url})</p>
    {/* In a real app, use <video> or a library like ReactPlayer */}
    {/* <ReactPlayer url={url} width="100%" height="100%" controls /> */}
  </div>
);

// Description/Transcript Toggle Component
interface DescriptionTranscriptToggleProps {
  shortDescription: string;
  transcript: string;
}

const DescriptionTranscriptToggle: React.FC<DescriptionTranscriptToggleProps> = ({
  shortDescription,
  transcript,
}) => {
  const [showTranscript, setShowTranscript] = useState(false);

  return (
    <div className="mt-4 border border-gray-200 rounded overflow-hidden">
      <div className="flex border-b border-gray-200 bg-gray-100">
        <button
          onClick={() => setShowTranscript(false)}
          className={clsx(
            'flex-1 py-2 px-4 border-0 cursor-pointer text-center text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400',
            !showTranscript
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          aria-pressed={!showTranscript}
        >
          Description
        </button>
        <button
          onClick={() => setShowTranscript(true)}
          className={clsx(
            'flex-1 py-2 px-4 border-0 cursor-pointer text-center text-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-400',
            showTranscript
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          )}
          aria-pressed={showTranscript}
        >
          Transcript
        </button>
      </div>
      <div className="p-4 text-sm bg-white">
        {showTranscript ? (
          <pre className="whitespace-pre-wrap break-words max-h-72 overflow-y-auto bg-gray-50 p-3 rounded font-mono text-xs leading-relaxed">
            {transcript.trim()}
          </pre>
        ) : (
          <p>{shortDescription}</p>
        )}
      </div>
    </div>
  );
};

// 1. Import SyntaxHighlighter
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// 2. Import a style (choose one)
import { coldarkDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Or try other styles: import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// Or light: import { materialLight } from 'react-syntax-highlighter/dist/esm/styles/prism';


// --- Sub Components ---
// ... (Breadcrumb, VideoPlayer, etc.)


// Code Snippet Tabs Component (Updated for Syntax Highlighting)
interface CodeSnippetTabsProps {
  snippets: CodeSnippet[];
}

// Helper to map display names to highlighter language keys if needed
const mapLanguageToHighlighterKey = (lang: string): string => {
    const lowerLang = lang.toLowerCase();
    // Add more mappings if your display names differ significantly
    // from standard keys (e.g., 'jsx', 'tsx', 'bash', 'css', 'html')
    if (lowerLang === 'javascript') return 'javascript';
    if (lowerLang === 'typescript') return 'typescript';
    if (lowerLang === 'python') return 'python';
    // Add other common cases
    if (lowerLang === 'html') return 'markup'; // Prism often uses 'markup' for HTML
    if (lowerLang === 'css') return 'css';
    // Fallback if no specific mapping found
    return lowerLang;
}

const CodeSnippetTabs: React.FC<CodeSnippetTabsProps> = ({ snippets }) => {
  const [activeLanguageDisplay, setActiveLanguageDisplay] = useState(snippets[0]?.language || '');

  if (!snippets || snippets.length === 0) {
    return null;
  }

  const activeSnippet = snippets.find(s => s.language === activeLanguageDisplay);
  const highlighterLanguage = activeSnippet ? mapLanguageToHighlighterKey(activeSnippet.language) : 'text'; // Fallback to plain text

  return (
    // Container styling (borders, margins, etc.) remains Tailwind
    <div className="border border-gray-300 rounded my-5 bg-gray-50 overflow-hidden shadow">
      {/* Header with tabs (Tailwind styling) */}
      <div className="flex border-b border-gray-300 bg-gray-200 flex-wrap">
        {snippets.map((snippet) => (
          <button
            key={snippet.language}
            onClick={() => setActiveLanguageDisplay(snippet.language)}
            className={clsx(
              'py-2 px-4 border-0 bg-transparent cursor-pointer text-sm focus:outline-none focus:ring-1 focus:ring-inset focus:ring-gray-500',
              activeLanguageDisplay === snippet.language
                ? 'bg-gray-100 text-black font-semibold border-b-2 border-gray-800 -mb-px'
                : 'text-gray-600 hover:bg-gray-300'
            )}
            aria-pressed={activeLanguageDisplay === snippet.language}
          >
            {snippet.language} {/* Display name */}
          </button>
        ))}
      </div>

      {/* Code Content Area */}
      <div className="overflow-x-auto"> {/* Let highlighter handle internal background/padding */}
        {activeSnippet && (
          // 3. Use SyntaxHighlighter component
          <SyntaxHighlighter
            language={highlighterLanguage} // Use the mapped key
            style={coldarkDark} // Apply the imported style
            showLineNumbers={true} // Optional: display line numbers
            wrapLines={true} // Optional: wrap long lines
            customStyle={{ // Optional: Override specific styles if needed
                margin: 0, // Remove default margins if any
                borderRadius: '0 0 4px 4px', // Match container rounding at bottom
                padding: '1rem' // Add padding
            }}
            codeTagProps={{ // Optional: Add classes to the inner <code> tag
                style: { // Or inline styles
                    fontFamily: '"Fira Code", monospace', // Example: Use a specific code font
                    fontSize: '0.9em'
                }
            }}
          >
            {activeSnippet.code.trim()}
          </SyntaxHighlighter>
        )}
      </div>
    </div>
  );
};

// Code Snippet Tabs Component
interface CodeSnippetTabsProps {
  snippets: CodeSnippet[];
}

// Quote Block Component
interface QuoteBlockProps {
  text: string;
  author: string;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({ text, author }) => (
  <blockquote className="border-l-4 border-gray-400 px-5 py-3 my-5 italic bg-gray-100 text-gray-700">
    <p className="m-0 mb-2">{text}</p>
    <cite className="block text-right not-italic text-gray-600 text-sm">- {author}</cite>
  </blockquote>
);

// Emphasized Note Component
interface EmphasizedNoteProps {
  type: NoteType;
  children: React.ReactNode;
}

const EmphasizedNote: React.FC<EmphasizedNoteProps> = ({ type, children }) => {
  const typeClasses = {
    Note: 'bg-gray-100 border-gray-300 text-gray-800',
    'Technical Details': 'bg-blue-50 border-blue-300 text-blue-800',
    Questions: 'bg-yellow-50 border-yellow-300 text-yellow-800',
  };

  return (
    <div className={clsx(
        'p-4 my-5 rounded border',
        typeClasses[type]
      )}
    >
      <strong className="font-semibold mr-2">{type}:</strong> {children}
    </div>
  );
};


// Math Renderer Placeholder Component
interface MathRendererProps {
    content: string;
}
const MathRenderer: React.FC<MathRendererProps> = ({ content }) => {
    return <p className="my-4 text-gray-800"><Latex>{content}</Latex></p>;
}


// Multiple Choice Question Component
interface MultipleChoiceQuestionProps {
  questionData: MultipleChoiceQuestionData;
  onAnswered?: (isCorrect: boolean) => void;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ questionData, onAnswered }) => {
    const { id, question, options, correctAnswerIndex } = questionData;
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const handleOptionChange = (index: number) => {
        if (!isSubmitted) {
            setSelectedOption(index);
        }
    };

    const handleSubmit = () => {
        if (selectedOption !== null) {
            const correct = selectedOption === correctAnswerIndex;
            setIsCorrect(correct);
            setIsSubmitted(true);
            onAnswered?.(correct);
        }
    };

    const getOptionLabelClasses = (index: number): string => {
        const base = 'block cursor-pointer p-2 rounded border flex-grow transition-colors duration-150';
        if (!isSubmitted) {
            return clsx(base, 'border-gray-300 hover:bg-gray-100', {
                'bg-gray-100 ring-2 ring-gray-400': selectedOption === index
            });
        }
        if (index === correctAnswerIndex) {
            return clsx(base, 'bg-green-50 border-green-400 text-green-800 font-medium');
        }
        if (index === selectedOption && index !== correctAnswerIndex) {
            return clsx(base, 'bg-red-50 border-red-400 text-red-800 font-medium');
        }
         return clsx(base, 'border-gray-300 text-gray-500'); // Non-selected, incorrect options after submit
    };

    return (
        <div className="border border-gray-300 rounded p-5 my-5 bg-white shadow-sm">
            <p className="font-semibold text-gray-900 mb-4">{question}</p>
            <div className="flex flex-col gap-3 mb-4">
                {options.map((option, index) => (
                    <div key={`${id}-${index}`} className="flex items-center gap-3">
                        <input
                            type="radio"
                            id={`${id}-option-${index}`}
                            name={`mcq-${id}`}
                            value={index}
                            checked={selectedOption === index}
                            onChange={() => handleOptionChange(index)}
                            disabled={isSubmitted}
                            className="focus:ring-gray-500 h-4 w-4 text-gray-600 border-gray-300 disabled:opacity-50"
                        />
                        <label
                            htmlFor={`${id}-option-${index}`}
                            className={getOptionLabelClasses(index)}
                        >
                            {option}
                        </label>
                         {isSubmitted && index === correctAnswerIndex && <span className="text-green-600 text-sm font-bold">✓ Correct</span>}
                         {isSubmitted && index === selectedOption && index !== correctAnswerIndex && <span className="text-red-600 text-sm font-bold">✗ Incorrect</span>}
                    </div>
                ))}
            </div>
            {!isSubmitted && (
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    className={clsx(
                        'py-2 px-4 border-0 rounded text-base focus:outline-none focus:ring-2 focus:ring-offset-2',
                         selectedOption === null
                           ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                           : 'bg-gray-800 text-white hover:bg-gray-700 focus:ring-gray-500'
                        )}
                >
                    Submit Answer
                </button>
            )}
             {isSubmitted && isCorrect !== null && (
                 <p className={clsx(
                     'mt-4 font-semibold',
                     isCorrect ? 'text-green-600' : 'text-red-600'
                    )}
                 >
                    {isCorrect ? 'Correct!' : `Incorrect. The correct answer was: "${options[correctAnswerIndex]}"`}
                 </p>
            )}
        </div>
    );
};


// --- Main Guide Page Component ---

const GuidePageTailwind: React.FC = () => {
  return (
    <div className="font-sans text-gray-800 bg-white max-w-4xl mx-auto p-5 leading-relaxed">
      <header className="mb-6">
        <Breadcrumb items={breadcrumbItemsData} />
      </header>

      <main className="flex flex-col gap-6"> {/* Use gap for consistent spacing */}
        {/* Video Section */}
        <section>
          <VideoPlayer url={videoData.url} />
          <DescriptionTranscriptToggle
            shortDescription={videoData.shortDescription}
            transcript={videoData.transcript}
          />
        </section>

        {/* Dynamic Content Blocks */}
        {mainContentData.map((block, index) => {
           // Use a wrapper div for consistent margins if needed, or apply margin utils directly
           // const Wrapper = ({ children }: {children: React.ReactNode}) => <div className="my-5">{children}</div>;

          switch (block.type) {
            case 'paragraph':
              // Add margin bottom for spacing after paragraphs
              return <p key={index} className="mb-4">{block.data}</p>;
            case 'code':
              // Margins are handled by the component's container
              return <CodeSnippetTabs key={index} snippets={block.data as CodeSnippet[]} />;
            case 'quote':
               // Margins are handled by the component's container
              const quote = block.data as QuoteData;
              return <QuoteBlock key={index} text={quote.text} author={quote.author} />;
            case 'note':
               // Margins are handled by the component's container
              const note = block.data as EmphasizedNoteData;
              return <EmphasizedNote key={index} type={note.type}>{note.content}</EmphasizedNote>;
             case 'math':
                // Margins are handled by the component's container
                return <MathRenderer key={index} content={block.data as string} />;
            case 'mcq':
                // Margins are handled by the component's container
                 const mcqData = block.data as MultipleChoiceQuestionData;
                 return <MultipleChoiceQuestion key={index} questionData={mcqData} />;
            default:
              console.warn("Unsupported content block type:", block.type);
              return null;
          }
        })}

      </main>
    </div>
  );
};

export default GuidePageTailwind;
