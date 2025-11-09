import './App.css';
import './components/main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test'
import Home from './pages/Home'
import SignUp from './pages/SignupPage'
import Login from './pages/LoginPage'
import MajorStudyPage from './pages/MajorStudyPage'

function App() {
  return (
    <Router>
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/major" element={<MajorStudyPage />} />
        </Routes>
    </Router>
  );
}

export default App;
