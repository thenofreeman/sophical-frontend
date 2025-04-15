import './App.css'
import MainLayout from './layouts/MainLayout';
import CV from './templates/CV';
import ScheduleBuilder from "./pages/ScheduleBuilder";
import GuidePage from './templates/GuidePage';
import CourseOutlinePage from './templates/CourseOutline';
import QuizPage from './templates/QuizPage';
import SignupOnboarding from './pages/Signup';

function App() {
  return (
    <MainLayout style='normal'>
      <SignupOnboarding />
    </MainLayout>
    // <MainLayout style='normal'>
    //   <ScheduleBuilder />
    // </MainLayout>
    // <MainLayout style='minimal'>
    //   <CV />
    // </MainLayout>
  );
}

export default App
