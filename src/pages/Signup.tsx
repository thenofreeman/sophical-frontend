import React, { useState, useEffect, useCallback, useMemo } from 'react';
// Assuming lucide-react is installed: npm install lucide-react
import { Mail, Lock, Eye, EyeOff, User, CheckCircle, XCircle, ArrowRight, Loader2, KeyRound, Send, ChevronLeft } from 'lucide-react';

// --- Constants & Configuration ---

const MIN_PASSWORD_LENGTH = 8;
const MOCK_VERIFICATION_CODE = '123456'; // For simulation
const MOCK_EXISTING_EMAILS = ['existing@example.com', 'test@example.com'];
const MOCK_EXISTING_USERNAMES = ['admin', 'sophical', 'testuser'];

// --- TypeScript Interfaces ---

interface UserData {
  email: string;
  password?: string; // Password might be cleared after step 1 for security
  verificationCode?: string;
  username: string;
  firstName: string;
  lastName: string;
}

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  verificationCode?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  general?: string; // For general API-like errors
}

type PasswordStrength = 'Weak' | 'Medium' | 'Strong' | 'Very Strong';

// --- Helper Functions ---

// Basic email format validation
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Simulate async check
const simulateApiCall = (delay = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Password strength calculation
const calculatePasswordStrength = (password: string): { strength: PasswordStrength; score: number } => {
  let score = 0;
  if (!password) return { strength: 'Weak', score: 0 };

  // Length check
  if (password.length >= MIN_PASSWORD_LENGTH) score++;
  if (password.length >= 10) score++;
  if (password.length >= 12) score++;

  // Character type checks
  if (/[a-z]/.test(password)) score++; // Lowercase
  if (/[A-Z]/.test(password)) score++; // Uppercase
  if (/\d/.test(password)) score++;    // Numbers
  if (/[^A-Za-z0-9]/.test(password)) score++; // Symbols

  // Determine strength label based on score
  if (score < 3) return { strength: 'Weak', score };
  if (score < 5) return { strength: 'Medium', score };
  if (score < 7) return { strength: 'Strong', score };
  return { strength: 'Very Strong', score };
};

// --- Sub-Components ---

// Password Strength Meter Component
const PasswordStrengthMeter: React.FC<{ password?: string }> = ({ password = '' }) => {
  const { strength, score } = useMemo(() => calculatePasswordStrength(password), [password]);
  const maxScore = 7; // Based on current calculation logic

  const getMeterColor = (currentScore: number): string => {
      if (currentScore < 3) return 'bg-red-500'; // Weak (Using color for clarity, can adapt to b/w)
      if (currentScore < 5) return 'bg-yellow-500'; // Medium
      if (currentScore < 7) return 'bg-green-500'; // Strong
      return 'bg-green-700'; // Very Strong
  };

    // Black and White version: Use fill levels of gray/black
    const getMeterFillClass = (level: number, currentScore: number): string => {
        if (currentScore >= level) {
            if (currentScore < 3) return 'bg-gray-400'; // Weak fill
            if (currentScore < 5) return 'bg-gray-600'; // Medium fill
            if (currentScore < 7) return 'bg-gray-800'; // Strong fill
            return 'bg-black'; // Very Strong fill
        }
        return 'bg-gray-200'; // Empty segment
    };

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-medium text-gray-600">Password Strength:</span>
        <span className={`text-xs font-semibold ${score < 3 ? 'text-red-600' : score < 5 ? 'text-yellow-600' : 'text-green-700'}`}>
            {password ? strength : ''}
        </span>
      </div>
      <div className="flex h-1.5 rounded-full overflow-hidden">
        {/* Black and White Meter Segments */}
        <div className={`w-1/4 transition-colors duration-300 ${getMeterFillClass(1, score)}`}></div>
        <div className={`w-1/4 transition-colors duration-300 ml-0.5 ${getMeterFillClass(3, score)}`}></div>
        <div className={`w-1/4 transition-colors duration-300 ml-0.5 ${getMeterFillClass(5, score)}`}></div>
        <div className={`w-1/4 transition-colors duration-300 ml-0.5 ${getMeterFillClass(7, score)}`}></div>
      </div>
    </div>
  );
};

// Input Field Component (Example for consistency)
const InputField: React.FC<{
    id: string;
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    icon?: React.ReactNode;
    placeholder?: string;
    required?: boolean;
    children?: React.ReactNode; // For things like the password visibility toggle
}> = ({ id, label, type, value, onChange, error, icon, placeholder, required, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative rounded-md shadow-sm">
            {icon && (
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                    {React.cloneElement(icon as React.ReactElement, { className: "h-5 w-5 text-gray-400" })}
                </div>
            )}
            <input
                type={type}
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`block w-full rounded-md border ${error ? 'border-red-500' : 'border-gray-300'} ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 focus:outline-none focus:ring-1 ${error ? 'focus:ring-red-500 focus:border-red-500' : 'focus:ring-black focus:border-black'} sm:text-sm`}
                aria-invalid={!!error}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {children && ( // Render children (e.g., password toggle) inside the relative div
                 <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {children}
                 </div>
            )}
        </div>
        {error && <p className="mt-1 text-xs text-red-600" id={`${id}-error`}>{error}</p>}
    </div>
);


// --- Step Components ---

// Step 1: Email and Password
const Step1Signup: React.FC<{
    onComplete: (data: Pick<UserData, 'email' | 'password'>) => void;
}> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateAndProceed = async () => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password validation
    const passwordStrength = calculatePasswordStrength(password);
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
      isValid = false;
    } else if (passwordStrength.score < 3) { // Example: Require at least 'Medium' strength
        newErrors.password = 'Password is too weak. Include uppercase, lowercase, numbers, or symbols.';
        isValid = false;
    }


    // Confirm password validation
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
      isValid = false;
    } else if (password && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors before API call

    try {
      // Simulate checking if email exists
      await simulateApiCall(800);
      if (MOCK_EXISTING_EMAILS.includes(email.toLowerCase())) {
        setErrors({ email: 'This email address is already registered.' });
        setIsLoading(false);
        return;
      }

      // If all checks pass
      onComplete({ email, password });

    } catch (error) {
      console.error("Signup Step 1 Error:", error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
      setIsLoading(false);
    }
    // No need to setIsLoading(false) on success, as the component will unmount
  };

  return (
    <div className="space-y-5">
      <InputField
        id="email"
        label="Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
        icon={<Mail />}
        placeholder="you@example.com"
        required
      />
      <InputField
        id="password"
        label="Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
        icon={<Lock />}
        placeholder="********"
        required
      >
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
      </InputField>

      <PasswordStrengthMeter password={password} />

      <InputField
        id="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        error={errors.confirmPassword}
        icon={<Lock />}
        placeholder="********"
        required
       >
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-gray-400 hover:text-gray-600 p-1 -mr-1"
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
       </InputField>


      {errors.general && <p className="text-sm text-red-600 text-center">{errors.general}</p>}

      <button
        type="button"
        onClick={validateAndProceed}
        disabled={isLoading}
        className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
        {isLoading ? 'Checking...' : 'Continue'}
        {!isLoading && <ArrowRight size={16} className="ml-2" />}
      </button>
    </div>
  );
};

// Step 2: Verify Email
const Step2VerifyEmail: React.FC<{
    email: string;
    onComplete: (data: Pick<UserData, 'verificationCode'>) => void;
    onBack: () => void;
}> = ({ email, onComplete, onBack }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [resentMessage, setResentMessage] = useState('');

    const handleVerify = async () => {
        setError(undefined);
        if (code.length !== 6 || !/^\d+$/.test(code)) {
            setError('Please enter a valid 6-digit code.');
            return;
        }

        setIsLoading(true);
        try {
            await simulateApiCall(800); // Simulate API call to verify code
            if (code === MOCK_VERIFICATION_CODE) {
                onComplete({ verificationCode: code });
            } else {
                setError('Incorrect verification code. Please try again.');
                setIsLoading(false);
            }
        } catch (err) {
            setError('Failed to verify code. Please try again.');
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setResentMessage('');
        setError(undefined);
        try {
            await simulateApiCall(1200); // Simulate sending code
            setResentMessage('A new verification code has been sent.');
             // Clear message after a few seconds
            setTimeout(() => setResentMessage(''), 5000);
        } catch (err) {
             setError('Failed to resend code. Please try again later.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="space-y-6 text-center">
             <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeft size={20} />
                <span className="sr-only">Go Back</span>
            </button>
            <KeyRound size={40} className="mx-auto text-black" />
            <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
            <p className="text-sm text-gray-600">
                We've sent a 6-digit verification code to <strong className="text-black">{email}</strong>.
                Please enter it below to continue.
            </p>

            <InputField
                id="verificationCode"
                label="Verification Code"
                type="text" // Use text to allow easier input on mobile (can add pattern="\d*" later)
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))} // Allow only digits, max 6
                error={error}
                placeholder="123456"
                required
            />

            <button
                type="button"
                onClick={handleVerify}
                disabled={isLoading || code.length !== 6}
                className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                Verify Email
            </button>

            <div className="text-sm text-gray-500">
                Didn't receive the code?{' '}
                <button
                    type="button"
                    onClick={handleResend}
                    disabled={isResending}
                    className="font-medium text-black hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isResending ? 'Sending...' : 'Resend Code'}
                </button>
            </div>
             {resentMessage && <p className="text-sm text-green-600 mt-2">{resentMessage}</p>}
        </div>
    );
};

// Step 3: Profile Information
const Step3ProfileInfo: React.FC<{
    onComplete: (data: Pick<UserData, 'username' | 'firstName' | 'lastName'>) => void;
    onBack: () => void; // Allow going back to resend code if needed
}> = ({ onComplete, onBack }) => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [isLoading, setIsLoading] = useState(false);

     const validateAndProceed = async () => {
        const newErrors: ValidationErrors = {};
        let isValid = true;

        // Username validation
        if (!username) {
            newErrors.username = 'Username is required.';
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
             newErrors.username = 'Username can only contain letters, numbers, and underscores.';
             isValid = false;
        } else if (username.length < 3) {
             newErrors.username = 'Username must be at least 3 characters long.';
             isValid = false;
        }

        // Name validation
        if (!firstName) {
            newErrors.firstName = 'First name is required.';
            isValid = false;
        }
        if (!lastName) {
            newErrors.lastName = 'Last name is required.';
            isValid = false;
        }

        setErrors(newErrors);

        if (!isValid) return;

        setIsLoading(true);
        setErrors({});

        try {
            // Simulate checking username availability
            await simulateApiCall(800);
            if (MOCK_EXISTING_USERNAMES.includes(username.toLowerCase())) {
                setErrors({ username: 'This username is already taken.' });
                setIsLoading(false);
                return;
            }

            // If all checks pass
            onComplete({ username, firstName, lastName });

        } catch (error) {
             console.error("Signup Step 3 Error:", error);
             setErrors({ general: 'An unexpected error occurred. Please try again.' });
             setIsLoading(false);
        }
     };


    return (
        <div className="space-y-5">
             <button onClick={onBack} className="absolute top-4 left-4 text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-100 transition-colors">
                <ChevronLeft size={20} />
                <span className="sr-only">Go Back</span>
            </button>
            <h2 className="text-xl font-semibold text-center text-gray-900 pt-4">Tell us about yourself</h2>

             <InputField
                id="username"
                label="Username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={errors.username}
                icon={<User />}
                placeholder="your_username"
                required
            />
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <InputField
                    id="firstName"
                    label="First Name"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={errors.firstName}
                    placeholder="Ada"
                    required
                />
                 <InputField
                    id="lastName"
                    label="Last Name"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={errors.lastName}
                    placeholder="Lovelace"
                    required
                />
            </div>

             {errors.general && <p className="text-sm text-red-600 text-center">{errors.general}</p>}

             <button
                type="button"
                onClick={validateAndProceed}
                disabled={isLoading}
                className="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <Loader2 size={20} className="animate-spin mr-2" /> : null}
                Complete Signup
            </button>
        </div>
    );
};

// Step 4: Completion
const Step4Complete: React.FC<{ userData: Partial<UserData> }> = ({ userData }) => {
    useEffect(() => {
        console.log("User signup complete, redirecting...", userData);
        // In a real app, redirect here:
        // navigate('/dashboard'); // or similar
    }, [userData]);

    return (
        <div className="text-center space-y-4 py-8">
            <CheckCircle size={56} className="mx-auto text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Welcome, {userData.firstName || userData.username}!</h2>
            <p className="text-gray-600">Your account has been created successfully.</p>
            <p className="text-sm text-gray-500">Redirecting you to the dashboard...</p>
             <Loader2 size={24} className="mx-auto animate-spin text-gray-400 mt-4" />
        </div>
    );
};


// --- Main Onboarding Component ---

const SignupOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState<Partial<UserData>>({});

  const handleStep1Complete = (data: Pick<UserData, 'email' | 'password'>) => {
    setUserData(prev => ({ ...prev, email: data.email, password: data.password })); // Store password temporarily if needed, or hash immediately
    setCurrentStep(2);
    console.log("Step 1 Complete, sending verification email to:", data.email); // Simulate email sending
  };

  const handleStep2Complete = (data: Pick<UserData, 'verificationCode'>) => {
    setUserData(prev => ({ ...prev, verificationCode: data.verificationCode }));
    setCurrentStep(3);
  };

   const handleStep3Complete = (data: Pick<UserData, 'username' | 'firstName' | 'lastName'>) => {
    setUserData(prev => ({
        ...prev,
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        password: undefined, // Clear password from state after successful signup
        verificationCode: undefined, // Clear verification code
    }));
    setCurrentStep(4);
    console.log("Step 3 Complete, creating user:", data); // Simulate user creation
  };

  const handleGoBack = (targetStep: number) => {
      setCurrentStep(targetStep);
      // Optionally clear state for the step being left
      if (targetStep === 1) {
          setUserData(prev => ({ ...prev, verificationCode: undefined }));
      }
       if (targetStep === 2) {
          setUserData(prev => ({ ...prev, username: undefined, firstName: undefined, lastName: undefined }));
      }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Signup onComplete={handleStep1Complete} />;
      case 2:
        // Ensure email exists before rendering step 2
        if (!userData.email) {
            setCurrentStep(1); // Fallback if email is missing
            return null;
        }
        return <Step2VerifyEmail email={userData.email} onComplete={handleStep2Complete} onBack={() => handleGoBack(1)} />;
      case 3:
         if (!userData.email || !userData.verificationCode) {
             setCurrentStep(userData.email ? 2 : 1); // Fallback
             return null;
         }
        return <Step3ProfileInfo onComplete={handleStep3Complete} onBack={() => handleGoBack(2)}/>;
      case 4:
         if (!userData.username) { // Check if final step data is present
             setCurrentStep(3); // Fallback
             return null;
         }
        return <Step4Complete userData={userData} />;
      default:
        setCurrentStep(1); // Reset if step is invalid
        return null;
    }
  };

  // Progress Indicator (Optional)
  const progressPercentage = useMemo(() => {
      return ((currentStep -1) / 3) * 100; // 4 steps total, progress is based on completing steps 1, 2, 3
  }, [currentStep]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-md w-full border border-gray-200 relative">
        {/* Optional Progress Bar */}
        {currentStep < 4 && (
             <div className="mb-6">
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-black h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
             </div>
        )}

        {renderStep()}
      </div>
    </div>
  );
};

// Export the main component
export default SignupOnboarding; // Use `App` if that's the standard export name expected

// If you need a root component named App for preview/export:
// const App = () => {
//   return <SignupOnboarding />;
// }
// export default App;
