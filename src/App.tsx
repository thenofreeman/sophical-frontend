import './App.css'
import MainLayout from './layouts/MainLayout';
import CV from './templates/CV';
import ScheduleBuilder from "./pages/ScheduleBuilder";
import GuidePage from './templates/GuidePage';
import CourseOutlinePage from './templates/CourseOutline';
import QuizPage from './templates/QuizPage';

function App() {
  return (
    <MainLayout style='normal'>
      <QuizPage />
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
