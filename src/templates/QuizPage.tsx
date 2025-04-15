import React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
// Assuming lucide-react is installed: npm install lucide-react
import { ArrowLeft, ArrowRight, Check, ChevronsUpDown, Circle, Clock, FileText, GripVertical, Hash, HelpCircle, ListChecks, MessageSquare, Send, Square, CheckSquare, Type, Code, Award, Edit3, Eye, Flag, X } from 'lucide-react';

// --- TypeScript Interfaces ---

type QuestionType = 'multiple-choice-single' | 'multiple-choice-multi' | 'short-answer' | 'matching' | 'code-answer';

interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  points: number;
  isAutoGraded: boolean;
}

interface Choice {
  id: string;
  text: string;
}

interface MultipleChoiceSingleQuestion extends BaseQuestion {
  type: 'multiple-choice-single';
  choices: Choice[];
  correctAnswerId: string; // ID of the correct choice
}

interface MultipleChoiceMultiQuestion extends BaseQuestion {
  type: 'multiple-choice-multi';
  choices: Choice[];
  correctAnswerIds: string[]; // IDs of correct choices
}

interface ShortAnswerQuestion extends BaseQuestion {
  type: 'short-answer';
  // Optional: Provide keywords or a model answer for potential auto-grading assistance (not implemented here)
  // keywords?: string[];
}

interface MatchingItem {
  id: string;
  text: string;
}

interface MatchingPair {
  leftId: string;
  rightId: string;
}

interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  leftItems: MatchingItem[];
  rightItems: MatchingItem[];
  correctPairs: MatchingPair[]; // Array of correct { leftId, rightId } pairs
}

interface CodeAnswerQuestion extends BaseQuestion {
  type: 'code-answer';
  // Optional: language hint for potential future syntax highlighting
  // language?: string;
}

// Union type for all question variations
type Question =
  | MultipleChoiceSingleQuestion
  | MultipleChoiceMultiQuestion
  | ShortAnswerQuestion
  | MatchingQuestion
  | CodeAnswerQuestion;

interface Quiz {
  id: string;
  title: string;
  description: string;
  estimatedTimeMinutes: number; // Estimated time in minutes
  questions: Question[];
}

// Type for storing user answers
type UserAnswer = string | string[] | MatchingPair[] | undefined; // string for single-choice/short/code, string[] for multi-choice, MatchingPair[] for matching
type UserAnswers = Record<string, UserAnswer>; // Keyed by question ID

// Type for scoring results
interface ScoreResult {
  achieved: number;
  possibleAutoGraded: number;
  pendingManualGradePoints: number;
  totalPossible: number;
}

// --- Dummy Data ---

const quizData: Quiz = {
  id: 'quiz-react-ts-1',
  title: 'React & TypeScript Fundamentals Quiz',
  description: 'Test your knowledge of core React and TypeScript concepts covered in the initial modules.',
  estimatedTimeMinutes: 15,
  questions: [
    {
      id: 'q1',
      type: 'multiple-choice-single',
      text: 'What is JSX?',
      points: 5,
      isAutoGraded: true,
      choices: [
        { id: 'q1c1', text: 'A JavaScript library for building UIs' },
        { id: 'q1c2', text: 'A syntax extension for JavaScript, recommended for use with React' },
        { id: 'q1c3', text: 'A state management pattern' },
        { id: 'q1c4', text: 'A CSS preprocessor' },
      ],
      correctAnswerId: 'q1c2',
    },
    {
      id: 'q2',
      type: 'multiple-choice-multi',
      text: 'Which of the following are valid React Hooks? (Select all that apply)',
      points: 10,
      isAutoGraded: true,
      choices: [
        { id: 'q2c1', text: 'useState' },
        { id: 'q2c2', text: 'useEffect' },
        { id: 'q2c3', text: 'useComponent' },
        { id: 'q2c4', text: 'useContext' },
        { id: 'q2c5', text: 'useReducer' },
      ],
      correctAnswerIds: ['q2c1', 'q2c2', 'q2c4', 'q2c5'],
    },
    {
      id: 'q3',
      type: 'short-answer',
      text: 'Explain the concept of "props" in React in one sentence.',
      points: 10,
      isAutoGraded: false, // Requires manual grading
    },
    {
        id: 'q4',
        type: 'matching',
        text: 'Match the TypeScript type to its description.',
        points: 15,
        isAutoGraded: true,
        leftItems: [
            { id: 'q4l1', text: 'string' },
            { id: 'q4l2', text: 'boolean' },
            { id: 'q4l3', text: 'number' },
            { id: 'q4l4', text: 'any' },
        ],
        rightItems: [
            { id: 'q4r1', text: 'Represents true or false values' },
            { id: 'q4r2', text: 'Represents numerical values' },
            { id: 'q4r3', text: 'Represents textual data' },
            { id: 'q4r4', text: 'Disables type checking' },
            { id: 'q4r5', text: 'Represents an array of items' }, // Extra item
        ],
        correctPairs: [
            { leftId: 'q4l1', rightId: 'q4r3' },
            { leftId: 'q4l2', rightId: 'q4r1' },
            { leftId: 'q4l3', rightId: 'q4r2' },
            { leftId: 'q4l4', rightId: 'q4r4' },
        ],
    },
    {
      id: 'q5',
      type: 'code-answer',
      text: 'Write a simple React functional component named `Greeting` that accepts a `name` prop (string) and renders `<h1>Hello, {name}!</h1>`. Use TypeScript for prop typing.',
      points: 10,
      isAutoGraded: false, // Requires manual grading
      // language: 'typescript',
    },
  ],
};

// --- Helper Functions ---

// Fisher-Yates Shuffle for randomizing choices/items if needed
function shuffleArray<T>(array: T[]): T[] {
    let currentIndex = array.length, randomIndex;
    const newArray = [...array]; // Create a copy
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [newArray[currentIndex], newArray[randomIndex]] = [newArray[randomIndex], newArray[currentIndex]];
    }
    return newArray;
}

// --- Question Type Components ---

// Multiple Choice Single Answer
const MultipleChoiceSingle: React.FC<{
    question: MultipleChoiceSingleQuestion;
    userAnswer: UserAnswer;
    onChange: (answer: string) => void;
}> = ({ question, userAnswer, onChange }) => {
    const choices = question.choices;
    return (
        <fieldset className="mt-4">
            <legend className="sr-only">Choose one option</legend>
            <div className="space-y-3">
                {choices.map((choice) => (
                    <div key={choice.id} className="flex items-center">
                        <input
                            id={`${question.id}-${choice.id}`}
                            name={question.id}
                            type="radio"
                            value={choice.id}
                            checked={userAnswer === choice.id}
                            onChange={(e) => onChange(e.target.value)}
                            className="h-4 w-4 text-black border-gray-300 focus:ring-black"
                        />
                        <label htmlFor={`${question.id}-${choice.id}`} className="ml-3 block text-sm text-gray-800">
                            {choice.text}
                        </label>
                    </div>
                ))}
            </div>
        </fieldset>
    );
};

// Multiple Choice Multiple Answers
const MultipleChoiceMulti: React.FC<{
    question: MultipleChoiceMultiQuestion;
    userAnswer: UserAnswer;
    onChange: (answer: string[]) => void;
}> = ({ question, userAnswer, onChange }) => {
    const currentAnswers = Array.isArray(userAnswer) ? userAnswer : [];
    const handleChange = (choiceId: string, isChecked: boolean) => {
        let updatedAnswers: string[];
        if (isChecked) {
            updatedAnswers = [...currentAnswers, choiceId];
        } else {
            updatedAnswers = currentAnswers.filter((id) => id !== choiceId);
        }
        onChange(updatedAnswers);
    };
    const choices = question.choices;
    return (
        <fieldset className="mt-4">
            <legend className="sr-only">Select all that apply</legend>
            <div className="space-y-3">
                {choices.map((choice) => (
                    <div key={choice.id} className="relative flex items-start">
                        <div className="flex items-center h-5">
                            <input
                                id={`${question.id}-${choice.id}`}
                                name={`${question.id}[]`}
                                type="checkbox"
                                value={choice.id}
                                checked={currentAnswers.includes(choice.id)}
                                onChange={(e) => handleChange(choice.id, e.target.checked)}
                                className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black"
                            />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor={`${question.id}-${choice.id}`} className="text-gray-800">
                                {choice.text}
                            </label>
                        </div>
                    </div>
                ))}
            </div>
        </fieldset>
    );
};

// Short Answer
const ShortAnswer: React.FC<{
    question: ShortAnswerQuestion;
    userAnswer: UserAnswer;
    onChange: (answer: string) => void;
}> = ({ question, userAnswer, onChange }) => {
    return (
        <div className="mt-4">
            <label htmlFor={question.id} className="sr-only">Your answer</label>
            <input
                type="text"
                id={question.id}
                name={question.id}
                value={typeof userAnswer === 'string' ? userAnswer : ''}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-2"
                placeholder="Type your answer here..."
            />
        </div>
    );
};

// Matching Question Component
const Matching: React.FC<{
    question: MatchingQuestion;
    userAnswer: UserAnswer;
    onChange: (answer: MatchingPair[]) => void;
}> = ({ question, userAnswer, onChange }) => {
    const currentPairs = Array.isArray(userAnswer) ? userAnswer : [];
    const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
    const shuffledRightItems = useMemo(() => shuffleArray(question.rightItems), [question.rightItems]);
    const handleLeftClick = (leftId: string) => {
        setSelectedLeftId(leftId === selectedLeftId ? null : leftId);
    };
    const handleRightClick = (rightId: string) => {
        if (selectedLeftId) {
            const filteredPairs = currentPairs.filter(p => p.leftId !== selectedLeftId && p.rightId !== rightId);
            const newPairs = [...filteredPairs, { leftId: selectedLeftId, rightId }];
            onChange(newPairs);
            setSelectedLeftId(null);
        }
    };
    const getMatchedRightItemText = (leftId: string): string | null => {
        const pair = currentPairs.find(p => p.leftId === leftId);
        if (!pair) return null;
        const rightItem = question.rightItems.find(item => item.id === pair.rightId);
        return rightItem ? rightItem.text : null;
    };
    const isRightItemSelected = (rightId: string): boolean => {
        return currentPairs.some(p => p.rightId === rightId);
    };
     return (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column */}
            <div className="space-y-2">
                <p className="font-medium text-gray-600 text-sm mb-2">Items</p>
                {question.leftItems.map((item) => {
                    const matchedText = getMatchedRightItemText(item.id);
                    const isSelected = selectedLeftId === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleLeftClick(item.id)}
                            className={`w-full text-left p-3 border rounded-md transition-all duration-150 flex justify-between items-center ${
                                isSelected
                                    ? 'border-black ring-2 ring-black ring-offset-1 bg-gray-100'
                                    : matchedText
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                            }`}
                        >
                            <span className="text-sm text-gray-900">{item.text}</span>
                            {matchedText && (
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                    Matched: {matchedText.length > 15 ? matchedText.substring(0, 15) + '...' : matchedText}
                                </span>
                            )}
                             {!matchedText && isSelected && (
                                <span className="text-xs text-blue-600">Selecting...</span>
                             )}
                        </button>
                    );
                 })}
            </div>
            {/* Right Column */}
            <div className="space-y-2">
                 <p className="font-medium text-gray-600 text-sm mb-2">Potential Matches</p>
                {shuffledRightItems.map((item) => {
                    const isMatched = isRightItemSelected(item.id);
                    const canSelect = selectedLeftId !== null && !isMatched;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleRightClick(item.id)}
                            disabled={!canSelect && !isMatched}
                            className={`w-full text-left p-3 border rounded-md transition-all duration-150 ${
                                isMatched
                                    ? 'border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed opacity-70'
                                    : canSelect
                                    ? 'border-blue-300 hover:border-blue-500 hover:bg-blue-50 cursor-pointer'
                                    : 'border-gray-300 bg-white text-gray-500 cursor-not-allowed opacity-60'
                            }`}
                        >
                            <span className={`text-sm ${isMatched ? '' : 'text-gray-900'}`}>{item.text}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// Code Answer
const CodeAnswer: React.FC<{
    question: CodeAnswerQuestion;
    userAnswer: UserAnswer;
    onChange: (answer: string) => void;
}> = ({ question, userAnswer, onChange }) => {
    return (
        <div className="mt-4">
            <label htmlFor={question.id} className="sr-only">Your code</label>
            <textarea
                id={question.id}
                name={question.id}
                rows={8}
                value={typeof userAnswer === 'string' ? userAnswer : ''}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm p-3 font-mono bg-gray-50"
                placeholder="Write your code here..."
                spellCheck="false"
            />
            <p className="mt-1 text-xs text-gray-500">Enter your code solution above. Formatting will be preserved.</p>
        </div>
    );
};

// --- Main Quiz Component ---

const QuizPage: React.FC = () => {
  const [quizState, setQuizState] = useState<'start' | 'inProgress' | 'submitted'>('start');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(quizData.estimatedTimeMinutes * 60);
  const [score, setScore] = useState<ScoreResult | null>(null);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [showReview, setShowReview] = useState(false);

  // Submission and Scoring Logic - wrapped in useCallback
  const handleSubmit = useCallback(() => {
    let achievedScore = 0;
    let possibleAutoGradedScore = 0;
    let pendingManualGradePoints = 0;
    let totalPossibleScore = 0;

    quizData.questions.forEach((q) => {
      totalPossibleScore += q.points;
      const userAnswer = userAnswers[q.id];

      if (q.isAutoGraded) {
        possibleAutoGradedScore += q.points;
        let isCorrect = false;
        switch (q.type) {
          case 'multiple-choice-single':
            isCorrect = userAnswer === q.correctAnswerId;
            break;
          case 'multiple-choice-multi':
            if (Array.isArray(userAnswer) && Array.isArray(q.correctAnswerIds)) {
              isCorrect = userAnswer.length === q.correctAnswerIds.length &&
                          userAnswer.every(ans => q.correctAnswerIds.includes(ans)) &&
                          q.correctAnswerIds.every(correct => userAnswer.includes(correct));
            }
            break;
          case 'matching':
             if (Array.isArray(userAnswer) && Array.isArray(q.correctPairs)) {
                const userAnswerPairs = userAnswer as MatchingPair[];
                if (userAnswerPairs.length === q.correctPairs.length) {
                    isCorrect = userAnswerPairs.every(userPair =>
                        q.correctPairs.some(correctPair =>
                            correctPair.leftId === userPair.leftId && correctPair.rightId === userPair.rightId
                        )
                    );
                }
             }
             break;
        }
        if (isCorrect) {
          achievedScore += q.points;
        }
      } else {
        pendingManualGradePoints += q.points;
      }
    });

    setScore({
      achieved: achievedScore,
      possibleAutoGraded: possibleAutoGradedScore,
      pendingManualGradePoints: pendingManualGradePoints,
      totalPossible: totalPossibleScore,
    });
    setQuizState('submitted');
    setTimeLeft(null); // Stop timer
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userAnswers]); // Depends on userAnswers

  // Timer Logic
  useEffect(() => {
    if (quizState !== 'inProgress' || timeLeft === null) return;

    if (timeLeft <= 0) {
      console.log("Time's up! Submitting..."); // Added console log for debugging
      handleSubmit(); // Auto-submit when time runs out
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime !== null ? prevTime - 1 : null));
    }, 1000);

    return () => clearInterval(timerId);
  }, [quizState, timeLeft, handleSubmit]); // Added handleSubmit to dependency array

  // Memoize current question object
  const currentQuestion = useMemo(() => quizData.questions[currentQuestionIndex], [currentQuestionIndex]);

  // Handle answer changes
  const handleAnswerChange = useCallback((questionId: string, answer: UserAnswer) => {
    setUserAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  }, []);

  // Navigation - Go to next question
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    // Removed submission logic from here
  }, [currentQuestionIndex]);

  // Navigation - Go to previous question
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  // Toggle flag for review
  const toggleFlag = useCallback((questionId: string) => {
      setFlaggedQuestions(prev => {
          const newSet = new Set(prev);
          if (newSet.has(questionId)) {
              newSet.delete(questionId);
          } else {
              newSet.add(questionId);
          }
          return newSet;
      });
  }, []);

  // --- Render Logic ---

  // Start Page
  if (quizState === 'start') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-2xl w-full border border-gray-200 text-center">
          <FileText size={48} className="mx-auto text-black mb-4" />
          <h1 className="text-3xl font-bold mb-3 text-black">{quizData.title}</h1>
          <p className="text-gray-600 mb-6">{quizData.description}</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 mb-8">
            <span className="flex items-center"><Hash size={14} className="mr-1.5" /> {quizData.questions.length} Questions</span>
            <span className="flex items-center"><Clock size={14} className="mr-1.5" /> Estimated {quizData.estimatedTimeMinutes} Minutes</span>
            <span className="flex items-center"><Award size={14} className="mr-1.5" /> {quizData.questions.reduce((sum, q) => sum + q.points, 0)} Total Points</span>
          </div>
          <div className="bg-gray-100 p-4 rounded-md text-left text-sm text-gray-700 mb-8">
            <h3 className="font-semibold mb-2 flex items-center"><HelpCircle size={16} className="mr-2"/>Instructions:</h3>
            <ul className="list-disc list-inside space-y-1">
                <li>Read each question carefully before answering.</li>
                <li>You can navigate between questions using the Previous/Next buttons.</li>
                <li>Use the flag button (<Flag size={12} className="inline -mt-1 mx-0.5"/>) to mark questions for review before submitting.</li>
                <li>Your progress is timed. The quiz will auto-submit if the time runs out.</li>
                <li>Some questions require manual grading by an instructor.</li>
            </ul>
          </div>
          <button
            onClick={() => setQuizState('inProgress')}
            className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  // Quiz In Progress Page
  if (quizState === 'inProgress' && currentQuestion) {
    const isFirstQuestion = currentQuestionIndex === 0;
    const isLastQuestion = currentQuestionIndex === quizData.questions.length - 1;
    const isFlagged = flaggedQuestions.has(currentQuestion.id);

    // Format time remaining
    const formatTime = (seconds: number | null): string => {
        if (seconds === null) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Define the action for the main navigation button (Next or Submit)
    const handleNavButtonClick = () => {
        if (isLastQuestion) {
            // Confirm before submitting
            if (window.confirm('Are you sure you want to submit your answers?')) {
                handleSubmit();
            }
        } else {
            handleNext();
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-8 font-sans">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div className="text-sm font-medium text-gray-700">
                        Question {currentQuestionIndex + 1} of {quizData.questions.length}
                        <span className="mx-2 text-gray-300">|</span>
                        {currentQuestion.points} Points
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => toggleFlag(currentQuestion.id)} title={isFlagged ? "Remove flag" : "Flag for review"} className={`p-1 rounded ${isFlagged ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                            <Flag size={18} />
                        </button>
                        <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-200 px-2 py-1 rounded">
                            <Clock size={14} className="mr-1.5" />
                            <span>{formatTime(timeLeft)}</span>
                        </div>
                    </div>
                </div>

                {/* Question Body */}
                <div className="p-6 md:p-8">
                    <div className="flex items-start mb-5">
                         <div className="flex-shrink-0 mr-3">
                            {currentQuestion.type === 'multiple-choice-single' && <Circle size={20} className="text-blue-500 mt-1"/>}
                            {currentQuestion.type === 'multiple-choice-multi' && <ListChecks size={20} className="text-indigo-500 mt-1"/>}
                            {currentQuestion.type === 'short-answer' && <Type size={20} className="text-green-500 mt-1"/>}
                            {currentQuestion.type === 'matching' && <GripVertical size={20} className="text-purple-500 mt-1"/>}
                            {currentQuestion.type === 'code-answer' && <Code size={20} className="text-red-500 mt-1"/>}
                        </div>
                        <p className="text-lg font-medium text-gray-900">{currentQuestion.text}</p>
                    </div>

                    {/* Render specific question type component */}
                    {currentQuestion.type === 'multiple-choice-single' && (
                        <MultipleChoiceSingle
                            question={currentQuestion}
                            userAnswer={userAnswers[currentQuestion.id]}
                            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                        />
                    )}
                    {currentQuestion.type === 'multiple-choice-multi' && (
                        <MultipleChoiceMulti
                            question={currentQuestion}
                            userAnswer={userAnswers[currentQuestion.id]}
                            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                        />
                    )}
                    {currentQuestion.type === 'short-answer' && (
                        <ShortAnswer
                            question={currentQuestion}
                            userAnswer={userAnswers[currentQuestion.id]}
                            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                        />
                    )}
                    {currentQuestion.type === 'matching' && (
                        <Matching
                            question={currentQuestion}
                            userAnswer={userAnswers[currentQuestion.id]}
                            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                        />
                    )}
                    {currentQuestion.type === 'code-answer' && (
                        <CodeAnswer
                            question={currentQuestion}
                            userAnswer={userAnswers[currentQuestion.id]}
                            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
                        />
                    )}
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
                    <button
                        onClick={handlePrevious}
                        disabled={isFirstQuestion}
                        className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black transition-opacity ${isFirstQuestion ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Previous
                    </button>
                    {/* Corrected onClick handler */}
                    <button
                        onClick={handleNavButtonClick}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isLastQuestion ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' : 'bg-black hover:bg-gray-800 focus:ring-black'} focus:outline-none focus:ring-2 focus:ring-offset-1 transition-colors`}
                    >
                        {isLastQuestion ? 'Submit Answers' : 'Next'}
                        {isLastQuestion ? <Send size={16} className="ml-2" /> : <ArrowRight size={16} className="ml-2" />}
                    </button>
                </div>

                {/* Flagged Questions Overview (Optional but helpful) */}
                {flaggedQuestions.size > 0 && (
                    <div className="p-3 border-t border-gray-200 bg-yellow-50 text-xs text-yellow-800">
                        <span className="font-medium">Flagged for review:</span> Question{flaggedQuestions.size > 1 ? 's' : ''} {Array.from(flaggedQuestions).map(qid => (quizData.questions.findIndex(q => q.id === qid) + 1)).join(', ')}
                    </div>
                )}
            </div>
        </div>
    );
}


  // Results Page
  if (quizState === 'submitted' && score) {
    const overallPercentage = score.totalPossible > 0 ? Math.round((score.achieved / score.totalPossible) * 100) : 0;
    const autoGradePercentage = score.possibleAutoGraded > 0 ? Math.round((score.achieved / score.possibleAutoGraded) * 100) : 0;

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg max-w-2xl w-full border border-gray-200 text-center">
          <Award size={48} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-3xl font-bold mb-3 text-black">Quiz Submitted!</h1>
          <p className="text-gray-600 mb-6">Your results based on auto-graded questions:</p>

          <div className="bg-gray-100 p-6 rounded-lg mb-8 text-left divide-y divide-gray-200">
            <div className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-700">Auto-Graded Score:</span>
              <span className="font-bold text-lg text-black">{score.achieved} / {score.possibleAutoGraded} points ({autoGradePercentage}%)</span>
            </div>
            {score.pendingManualGradePoints > 0 && (
              <div className="py-3 flex justify-between items-center">
                <span className="font-medium text-gray-700">Points Awaiting Grading:</span>
                <span className="font-bold text-lg text-gray-600 flex items-center"><Edit3 size={16} className="mr-2 text-blue-500"/>{score.pendingManualGradePoints} points</span>
              </div>
            )}
             <div className="py-3 flex justify-between items-center">
              <span className="font-medium text-gray-700">Total Possible Points:</span>
              <span className="font-bold text-lg text-gray-600">{score.totalPossible} points</span>
            </div>
          </div>

          {score.pendingManualGradePoints > 0 && (
            <p className="text-sm text-blue-600 mb-8 bg-blue-50 p-3 rounded-md">
              <Edit3 size={14} className="inline mr-1 -mt-1"/> Your final score will be available after the instructor grades {score.pendingManualGradePoints} points worth of questions.
            </p>
          )}

          <div className="flex flex-col sm:flex-row justify-center gap-4">
             <button
                onClick={() => setShowReview(!showReview)} // Toggle review visibility
                className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black"
             >
                <Eye size={16} className="mr-2" /> {showReview ? 'Hide Review' : 'Review Answers'}
             </button>
             {/* Add a button to go back to course or dashboard */}
             <button
                onClick={() => window.location.reload()} // Simple reload for demo; replace with router navigation
                className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black"
             >
                Finish
             </button>
          </div>

          {/* Answer Review Section */}
          {showReview && (
              <div className="mt-10 pt-6 border-t border-gray-200 text-left space-y-6">
                  <h2 className="text-xl font-semibold text-black mb-4">Answer Review</h2>
                  {quizData.questions.map((q, index) => {
                      const userAnswer = userAnswers[q.id];
                      let isCorrect: boolean | null = null; // null for manually graded or unanswered
                      let correctAnswerDisplay: string | JSX.Element = 'N/A';

                      // Determine correctness and format correct answer for display
                      if (q.isAutoGraded) {
                          switch (q.type) {
                              case 'multiple-choice-single':
                                  isCorrect = userAnswer === q.correctAnswerId;
                                  const correctChoice = q.choices.find(c => c.id === q.correctAnswerId);
                                  correctAnswerDisplay = correctChoice ? correctChoice.text : 'Error: Correct answer not found';
                                  break;
                              case 'multiple-choice-multi':
                                  if (Array.isArray(userAnswer) && Array.isArray(q.correctAnswerIds)) {
                                      isCorrect = userAnswer.length === q.correctAnswerIds.length &&
                                                  userAnswer.every(ans => q.correctAnswerIds.includes(ans)) &&
                                                  q.correctAnswerIds.every(correct => userAnswer.includes(correct));
                                      const correctChoices = q.choices.filter(c => q.correctAnswerIds.includes(c.id));
                                      correctAnswerDisplay = <ul className="list-disc list-inside text-xs">{correctChoices.map(c => <li key={c.id}>{c.text}</li>)}</ul>;
                                  } else {
                                      isCorrect = false; // Treat missing answer as incorrect
                                      const correctChoices = q.choices.filter(c => q.correctAnswerIds.includes(c.id));
                                      correctAnswerDisplay = <ul className="list-disc list-inside text-xs">{correctChoices.map(c => <li key={c.id}>{c.text}</li>)}</ul>;
                                  }
                                  break;
                              case 'matching':
                                  if (Array.isArray(userAnswer) && Array.isArray(q.correctPairs)) {
                                      const userAnswerPairs = userAnswer as MatchingPair[];
                                      if (userAnswerPairs.length === q.correctPairs.length) {
                                          isCorrect = userAnswerPairs.every(userPair =>
                                              q.correctPairs.some(correctPair =>
                                                  correctPair.leftId === userPair.leftId && correctPair.rightId === userPair.rightId
                                              )
                                          );
                                      } else {
                                          isCorrect = false;
                                      }
                                      correctAnswerDisplay = (
                                          <ul className="list-disc list-inside text-xs">
                                              {q.correctPairs.map(pair => {
                                                  const left = q.leftItems.find(i => i.id === pair.leftId)?.text;
                                                  const right = q.rightItems.find(i => i.id === pair.rightId)?.text;
                                                  return <li key={`${pair.leftId}-${pair.rightId}`}>{left} &rarr; {right}</li>;
                                              })}
                                          </ul>
                                      );
                                  } else {
                                       isCorrect = false;
                                       correctAnswerDisplay = (
                                          <ul className="list-disc list-inside text-xs">
                                              {q.correctPairs.map(pair => {
                                                  const left = q.leftItems.find(i => i.id === pair.leftId)?.text;
                                                  const right = q.rightItems.find(i => i.id === pair.rightId)?.text;
                                                  return <li key={`${pair.leftId}-${pair.rightId}`}>{left} &rarr; {right}</li>;
                                              })}
                                          </ul>
                                      );
                                  }
                                  break;
                          }
                      }

                      // Format user's answer for display
                      let userAnswerDisplay: string | JSX.Element | null = null;
                      if (userAnswer === undefined || userAnswer === null) {
                          userAnswerDisplay = <span className="italic text-gray-500">Not Answered</span>;
                      } else if (q.type === 'multiple-choice-single') {
                          const choice = q.choices.find(c => c.id === userAnswer);
                          userAnswerDisplay = choice ? choice.text : 'Invalid Answer';
                      } else if (q.type === 'multiple-choice-multi' && Array.isArray(userAnswer)) {
                          const choices = q.choices.filter(c => userAnswer.includes(c.id));
                          userAnswerDisplay = choices.length > 0 ? <ul className="list-disc list-inside text-xs">{choices.map(c => <li key={c.id}>{c.text}</li>)}</ul> : <span className="italic text-gray-500">No selection</span>;
                      } else if (q.type === 'matching' && Array.isArray(userAnswer)) {
                           const userAnswerPairs = userAnswer as MatchingPair[];
                           userAnswerDisplay = userAnswerPairs.length > 0 ? (
                                <ul className="list-disc list-inside text-xs">
                                    {userAnswerPairs.map(pair => {
                                        const left = q.leftItems.find(i => i.id === pair.leftId)?.text;
                                        const right = q.rightItems.find(i => i.id === pair.rightId)?.text;
                                        return <li key={`${pair.leftId}-${pair.rightId}`}>{left} &rarr; {right}</li>;
                                    })}
                                </ul>
                           ) : <span className="italic text-gray-500">No matches made</span>;
                      } else if (q.type === 'code-answer' && typeof userAnswer === 'string') {
                          userAnswerDisplay = <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto"><code>{userAnswer || <span className="italic text-gray-500">No code entered</span>}</code></pre>;
                      }
                      else if (typeof userAnswer === 'string') {
                          userAnswerDisplay = userAnswer || <span className="italic text-gray-500">No answer</span>;
                      }


                      return (
                          <div key={q.id} className={`p-4 rounded-md border ${isCorrect === true ? 'border-green-200 bg-green-50' : isCorrect === false ? 'border-red-200 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                              <p className="font-semibold text-sm mb-2">Question {index + 1}: <span className="font-normal">{q.text}</span></p>
                              <div className="text-xs space-y-1 mb-2">
                                  <p><span className="font-medium">Your Answer:</span> {userAnswerDisplay}</p>
                                  {q.isAutoGraded && isCorrect !== null && (
                                      <p><span className="font-medium">Correct Answer:</span> {correctAnswerDisplay}</p>
                                  )}
                                  {!q.isAutoGraded && (
                                      <p className="text-blue-700"><span className="font-medium">Status:</span> Awaiting manual grading</p>
                                  )}
                              </div>
                              <div className="text-right text-xs font-medium">
                                  {isCorrect === true && <span className="text-green-700">Correct (+{q.points} pts)</span>}
                                  {isCorrect === false && <span className="text-red-700">Incorrect (0/{q.points} pts)</span>}
                                  {isCorrect === null && !q.isAutoGraded && <span className="text-blue-700">Pending ({q.points} pts possible)</span>}
                                  {isCorrect === null && q.isAutoGraded && <span className="text-gray-500">Not Answered (0/{q.points} pts)</span>}
                              </div>
                          </div>
                      );
                  })}
              </div>
          )}

        </div>
      </div>
    );
  }

  // Fallback or Loading state (optional)
  return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading Quiz...</p></div>;
};


// Export the main component
export default QuizPage; // Use `App` if that's the standard export name expected

// If you need a root component named App for preview/export:
// const App = () => {
//   return <QuizPage />;
// }
// export default App;
