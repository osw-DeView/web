// src/pages/MainPage.jsx

import React from 'react';
// 1. 페이지 이동을 위해 useNavigate를 import 합니다.
import { useNavigate } from 'react-router-dom';
// 2. 스타일을 위해 App.css를 재사용합니다.
import '../App.css'; 

function MainPage() {
  const navigate = useNavigate();

  // 3. 로그아웃 버튼 클릭 시 실행될 핸들러
  const handleLogout = () => {
    console.log('로그아웃을 시도합니다.');
    
    // (선택 사항) 실제 앱에서는 여기서 localStorage의 토큰을 삭제합니다.
    // localStorage.removeItem('authToken');
    
    // 4. App.jsx에서 정의한 로그인 페이지 경로('/')로 이동합니다.
    navigate('/'); 
  };

  return (
    <header className="App-header">
      <h2>메인 페이지</h2>
      <p>환영합니다! 성공적으로 로그인되었습니다.</p>
      
      {/* 5. 로그아웃 버튼 */}
      <button 
        onClick={handleLogout} 
        style={{ 
          backgroundColor: '#ff6b6b', // 빨간색 계열
          color: 'white', 
          marginTop: '30px', 
          padding: '10px 20px',
          fontSize: '1rem',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        로그아웃
      </button>
    </header>
  );
}

export default MainPage;