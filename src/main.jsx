// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
// 1. react-router-dom에서 BrowserRouter를 import 합니다.
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2. App 컴포넌트를 BrowserRouter로 감싸줍니다. */}
    {/* 이렇게 하면 App 및 그 모든 자손 컴포넌트에서 라우팅 기능을 사용할 수 있습니다. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);