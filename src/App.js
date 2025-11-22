import './App.css';
import './components/main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test'
import Home from './pages/Home'
import SignUp from './pages/SignupPage'
import Login from './pages/LoginPage'
import MajorStudyPage from './pages/MajorStudyPage'
import StudyInterviewPage from './pages/StudyInterviewPage'
import InterviewReview from './pages/InterviewReview'
import InterviewRecordPage from './pages/InterviewRecordPage'
import InterviewRecordDetail from "./pages/InterviewRecordDetail";
import Profile from "./pages/Profile";
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path='/' element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/study/major" element={<MajorStudyPage />} />
          <Route path="/study/interview" element={< StudyInterviewPage/>} />
          <Route path="/study/interview/review" element={< InterviewReview/>} />
          <Route path="/study/interview/record" element={< InterviewRecordPage/>} />
          <Route path="/study/interview/record/:id" element={<InterviewRecordDetail />} />
        </Routes>
    </Router>
  );
}

export default App;
