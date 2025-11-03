import './App.css';
import './components/main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test'
import Home from './pages/Home'
import Login from './pages/LoginPage'
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/test" element={<Test />} />
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
        </Routes>
    </Router>
  );
}

export default App;
