import './App.css';
import './components/main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Test from './pages/Test'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <div> {/*className="min-h-screen bg-gray-100 flex flex-col*/}
        <main> {/* className="flex-grow container mx-auto p-4"*/}
          <Routes>
            <Route path="/test" element={<Test />} />
            <Route path='/home' element={<Home />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
