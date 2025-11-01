import React, { useState } from "react";
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import '../styles/NavBar.css';

const navigation = [
  { name: 'CS 전공지식 학습하기', href: '#' },
  { name: '기술 면접 대비하기', href: '#' },
  { name: '면접 경험 공유하기', href: '#' },
  { name: '????', href: '#' },
]

function NavBar() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false) 모바일
  
  return(
    <header className="navbar-header">
      <nav aria-label="Global" className="navbar-container">
        {/* 로고 */}
        <div className="navbar-logo-wrapper">
          <a href="/home" className="navbar-logo-link">
            <h1>De-View</h1>
          </a>
        </div>

        {/* 모바일 메뉴 버튼
        <div className="navbar-mobile-button">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="navbar-menu-button"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="navbar-icon" />
          </button>
        </div> */}

        {/* 데스크톱 네비게이션 */}
        <div className="navbar-desktop-nav">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="navbar-nav-link">
              {item.name}
            </a>
          ))}
        </div>

        {/* 로그인 버튼 */}
        <div className="navbar-login-wrapper">
          <a href="/login" className="navbar-login-link">
            Log in <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </nav>

      {/* 모바일 메뉴 다이얼로그
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="navbar-mobile-dialog">
        <div className="navbar-mobile-overlay" />
        <DialogPanel className="navbar-mobile-panel">
          <div className="navbar-mobile-header">
            <a href="/home" className="navbar-mobile-logo-link">
              <span className="sr-only">De-View</span>
              <h1>De-View</h1>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="navbar-mobile-close"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="navbar-icon" />
            </button>
          </div>

          <div className="navbar-mobile-content">
            <div className="navbar-mobile-divider">
              <div className="navbar-mobile-nav-section">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="navbar-mobile-nav-link"
                  >
                    {item.name}
                  </a>
                ))}
              </div>

              <div className="navbar-mobile-login-section">
                <a href="#" className="navbar-mobile-login-link">
                  Log in
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog> */}
    </header>
  )
}

export default NavBar;