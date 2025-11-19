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

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/study/major" element={<MajorStudyPage />} />
          <Route path="/study/interview" element={< StudyInterviewPage/>} />
          <Route path="/study/interview/review" element={< InterviewReview/>} />

        </Routes>
    </Router>
  );
}

export default App;
