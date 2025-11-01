import React from 'react';
import NavBar from '../components/NavBar.js';
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return(
    <div className='home-page'>
      
      <div className='home-header-section'>
        <NavBar />
      </div>
      
      <div className='home-body-section'>
        <div className="home-container">
          
          {/* 배경 장식 - 상단 */}
          <div aria-hidden="true" className="home-bg-decoration home-bg-top">
            <div className="home-bg-shape home-bg-shape-top" />
          </div>

          {/* 메인 콘텐츠 */}
          <div className="home-content-wrapper">
            <div className="home-title-small">
              <p>DeView</p>
            </div>
            
            <div className="home-text-section">
              <h1 className="home-title-main">
                개발자의 꿈을 현실로!
              </h1>
              <p className="home-description">
                개발자 취업을 준비하는 취준생,
                학습이 필요한 전공자에게 CS 학습과 기술 면접을 
                대비할 수 있는 플랫폼
              </p>

              <div className="home-cta-buttons">
                <a href="#" className="home-btn-primary">
                  Get started
                </a>
                <a href="#" className="home-btn-secondary">
                  Learn more <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>

          {/* 배경 장식 - 하단 */}
          <div aria-hidden="true" className="home-bg-decoration home-bg-bottom">
            <div className="home-bg-shape home-bg-shape-bottom" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;