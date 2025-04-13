import './App.css'
import MainLayout from './layouts/MainLayout';
import CV from './templates/CV';
import ScheduleBuilder from "./pages/ScheduleBuilder";

function App() {
  return (
    <MainLayout style='minimal'>
      {/* <CV /> */}
      <ScheduleBuilder />
    </MainLayout>
  );
}

export default App
