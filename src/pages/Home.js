import React from 'react';
import NavBar from '../components/NavBar';
import Footer from "../components/Footer";
import '../styles/Home.css';
import { useNavigate } from 'react-router-dom';

const codeParticles = [
  "function()",
  "const data = []",
  "for(let i=0;)",
  "if(isValid)",
  "return result",
  "{ }",
  "=> {}",
  "import",
  "export",
  "class",
];

function Home() {
  const navigate = useNavigate();

  return(
    <div className='home-page'>
      
      <div className='home-header-section'>
        <NavBar />
        
        <div className="home-bg-orbs"> {/*배경 원형들의 컨테이너*/}
          <div className="home-bg-orb home-bg-orb-1"></div>
          <div className="home-bg-orb home-bg-orb-2"></div>
          <div className="home-bg-orb home-bg-orb-3"></div>
        </div>

        <div className="home-code-particles"> {/*떠다니는 코드 조각들의 컨테이너*/}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="home-code-particle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 90 - 45}deg)`,
              }}
            >
              {codeParticles[Math.floor(Math.random() * codeParticles.length)]}
            </div>
          ))}
        </div>

        <div className="home-content-container">
          <div className="home-content-grid">
            <div className="home-text-content">
              <h1 className="home-main-title">
                DeView
                <span className="home-subtitle-block">개발자의 꿈을 현실로</span>
              </h1>

              <p className="home-main-description">
                CS 기초 지식부터 실전 기술 면접까지, <br/> 당신의 개발자 커리어를 
                위한 모든 준비를 도와드립니다.  <br/>
                체계적인 학습과 실전형 면접 시뮬레이션으로 자신감을 키우세요.
              </p>

              <div className="home-button-group">
                <a className="home-primary-btn" href="/study/major">
                  <svg xmlns="http://www.w3.org/2000/svg" className="home-btn-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                  </svg>
                  학습 자료 보기
                </a>
                <a className="home-secondary-btn" href="/interview/start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="home-btn-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  면접 시작하기
                </a>
              </div>

              
            </div>

            <div className="home-visual-content">
              <div className="home-floating-card home-floating-card-1">
                <div className="home-card-icon home-card-icon-success">
                  <svg xmlns="http://www.w3.org/2000/svg" className="home-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <div className="home-floating-card home-floating-card-2">
                <div className="home-card-icon home-card-icon-idea">
                  <svg xmlns="http://www.w3.org/2000/svg" className="home-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='home-body-section'>
        <div className="home-features-grid">
          <div className="home-feature-card">
            <div className="home-feature-icon home-feature-icon-indigo">
              <svg xmlns="http://www.w3.org/2000/svg" className="home-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="home-feature-title">CS 기초 강화</h3>
            <p className="home-feature-description">
              알고리즘, 자료구조, 네트워크 등<br/> 필수 CS 지식을 체계적으로 학습하세요.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon home-feature-icon-purple">
              <svg xmlns="http://www.w3.org/2000/svg" className="home-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="home-feature-title">실전형 면접 대비</h3>
            <p className="home-feature-description">
              실제 기업 면접과 유사한 환경에서<br/>  모의 면접을 통해 자신감을 키우세요.
            </p>
          </div>

          <div className="home-feature-card">
            <div className="home-feature-icon home-feature-icon-blue">
              <svg xmlns="http://www.w3.org/2000/svg" className="home-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="home-feature-title">맞춤형 학습 경로</h3>
            <p className="home-feature-description">
              개인의 수준과 목표에 맞는 커스텀 학습<br/>  경로로 효율적인 공부가 가능합니다.
            </p>
          </div>
        </div>
      </div>

      <div className='home-footer-section'><Footer/></div>
      
    </div>
  );
}

export default Home;