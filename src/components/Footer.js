import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // 사이트 맵 링크 데이터
  const navLinks = [
    { title: "학습", links: [
      { name: "CS 기초 강화", href: "/study/major" },
      { name: "예상 면접 질문 학습", href: "/study/interview" },
    ]},
    { title: "면접", links: [
      { name: "실전 CS 기술 면접", href: "/interview/start" },
      { name: "나의 면접 기록", href: "/study/interview/record" },
      { name: "우수 면접 답변", href: "/interview/best-qna" }
    ]},
    { title: "커뮤니티", links: [
      { name: "면접 경험 후기", href: "/study/interview/review" },
    ]},
    { title: "지원", links: [
      { name: "프로필", href: "/profile" },
    ]}
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h2 className="footer-brand-title">
              DeView
            </h2>
            <p className="footer-brand-description">
              개발자의 커리어를 <br/>위한 준비를 돕습니다.
            </p>
          </div>
          
          {navLinks.map((section) => (
            <div key={section.title} className="footer-section">
              <h3 className="footer-section-title">
                {section.title}
              </h3>
              <ul className="footer-section-list">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="footer-link"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} DeView. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="https://github.com/osw-DeView" aria-label="GitHub" className="footer-social-link">
              <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.419 2.867 8.138 6.839 9.489.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.341-3.369-1.341-.454-1.152-1.107-1.459-1.107-1.459-.906-.618.069-.607.069-.607 1.003.07 1.531 1.033 1.531 1.033.89 1.529 2.342 1.087 2.91.832.09-.645.351-1.087.636-1.334-2.22-.251-4.555-1.11-4.555-4.951 0-1.093.39-1.988 1.029-2.681-.103-.252-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.022A9.954 9.954 0 0112 5.617c.85.004 1.701.121 2.492.365 1.91-1.291 2.75-1.022 2.75-1.022.546 1.378.202 2.398.099 2.651.64.693 1.029 1.587 1.029 2.681 0 3.84-2.335 4.69-4.566 4.943.359.309.678.92.678 1.855 0 1.334-.012 2.41-.012 2.737 0 .268.18.577.688.484C19.135 20.138 22 16.419 22 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}