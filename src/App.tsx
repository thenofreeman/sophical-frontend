import './App.css'
import MainLayout from './layouts/MainLayout';
import CV from './templates/CV';
import ScheduleBuilder from "./pages/ScheduleBuilder";
import GuidePage from './templates/GuidePage';
import CourseOutlinePage from './templates/CourseOutline';

function App() {
  return (
    <MainLayout style='normal'>
      <CourseOutlinePage />
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
