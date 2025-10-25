import './App.css';
import './components/main.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';  // ← BrowserRouter as Router 제거
import Test from './pages/Test'
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/test" element={
          <div className="min-h-screen bg-gray-100 flex flex-col">
            <main className="flex-grow container mx-auto p-4">
              <Test />
            </main>
          </div>
          }
        />
        {/* 404 - 정의되지 않은 모든 경로를 메인으로 리다이렉트 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
