import React from 'react';
import '../styles/Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  // 사이트 맵 링크 데이터
  const navLinks = [
    { title: "학습", links: [
      { name: "CS 기초 강화", href: "/studyContent" },
      { name: "맞춤형 학습 경로", href: "/studyContent" },
      { name: "스터디 메모", href: "/studyContent/memoList/1" }
    ]},
    { title: "면접", links: [
      { name: "실전형 면접 대비", href: "/interview/all" },
      { name: "랜덤 면접 시작", href: "/interview/random" },
      { name: "키워드 면접", href: "/interview/keyword" }
    ]},
    { title: "커뮤니티", links: [
      { name: "자유게시판", href: "/community" },
      { name: "뉴스 및 채용", href: "/news" }
    ]},
    { title: "지원", links: [
      { name: "마이페이지", href: "/mypage" },
      { name: "이용 약관", href: "#" },
      { name: "개인정보 처리방침", href: "#" }
    ]}
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        <div className="footer-grid">
          
          <div className="footer-brand">
            <h2 className="footer-brand-title">
              DevPrep
            </h2>
            <p className="footer-brand-description">
              개발자의 커리어를 위한 모든 준비를 돕습니다.
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
            &copy; {currentYear} DevPrep. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#" aria-label="Twitter" className="footer-social-link">
              <svg className="footer-social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M13.623 3.664c.264-.265.59-.398.975-.398h2.09c.386 0 .712.133.975.398l1.378 1.377a1.373 1.373 0 010 1.95l-7.07 7.07-7.07-7.07a1.373 1.373 0 010-1.95l1.377-1.377c.264-.265.59-.398.975-.398h2.09c.386 0 .712.133.975.398l.001.001zM4.77 14.708l-.348 2.083c-.092.553.078 1.11.458 1.55l3.242 3.243c.439.38 1.006.55 1.56.458l2.082-.348.012-3.149H8.76l-.014 1.393L4.77 14.708zM18.8 17.526l-3.243-3.243c-.38-.44-.55-1.006-.458-1.56l.348-2.082L19.46 16.48c.09.553-.08 1.11-.46 1.55z" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-label="GitHub" className="footer-social-link">
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