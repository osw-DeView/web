// src/App.jsx

import React from 'react';
// 1. 라우팅에 필요한 컴포넌트들을 import 합니다.
import { Routes, Route, Navigate } from 'react-router-dom';

// 2. 우리가 만들 페이지 컴포넌트들을 import 합니다.
// (pages 폴더를 만들고 그 안에 파일을 생성해야 합니다.)
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';

// 3. App.css 스타일을 적용합니다.
import './App.css';

function App() {
  return (
    <div className="App">
      {/* 4. Routes 컴포넌트는 여러 Route를 감쌉니다. */}
      <Routes>
        {/* 5. Route 컴포넌트: 특정 경로(path)와 보여줄 컴포넌트(element)를 1:1로 매칭합니다.
             path="/" : 웹사이트의 기본 경로 (예: http://localhost:5173/)
             element={<LoginPage />} : 이 경로에서 LoginPage 컴포넌트를 렌더링합니다.
        */}
        <Route path="/" element={<LoginPage />} />
        
        {/* path="/main" : http://localhost:5173/main 경로
          element={<MainPage />} : 이 경로에서 MainPage 컴포넌트를 렌더링합니다.
        */}
        <Route path="/main" element={<MainPage />} />
        
        {/* path="*" : 위에서 정의되지 않은 모든 경로 (와일드카드)
          element={<Navigate replace to="/" />} : 
          잘못된 경로로 접근 시, Navigate 컴포넌트를 사용해 
          기본 경로('/')인 로그인 페이지로 강제 이동(리다이렉트)시킵니다.
        */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </div>
  );
}

export default App;