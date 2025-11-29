import { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import api from '../api';
import { getCookie, deleteCookie } from '../utils/cookieUtils';

const navigation = [
  {
    name: '학습하기',
    items: [
      { name: 'CS 전공지식', href: '/study/major' },
      { name: '예상 면접 질문', href: '/study/interview' },
    ]
  },
  {
    name: '면접 연습',
    items: [
      { name: '면접 시작하기', href: '/interview/start' },
      { name: '면접 기록 보기', href: '/study/interview/record' },
      { name: '베스트 답변', href: '/interview/best-qna' },
    ]
  },
  {
    name: '면접 경험 후기',
    href: '/study/interview/review'
  }
];

function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event) {
      if (openDropdown !== null) {
        const ref = dropdownRefs.current[openDropdown];
        if (ref && !ref.contains(event.target)) {
          setOpenDropdown(null);
        }
      }
      const userMenuRef = document.getElementById('user-menu-container');
      if (showUserMenu && userMenuRef && !userMenuRef.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown, showUserMenu]);

  const handleLogout = async() => {
    const refreshToken = getCookie('refreshToken');
    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken }); 
      }
      localStorage.removeItem('accessToken'); 
      deleteCookie('refreshToken'); 
      window.location.href = '/'; 
    } catch {
      localStorage.removeItem('accessToken'); 
      deleteCookie('refreshToken');
    }
  };

  return (
    <>
      <header className="
        fixed top-0 left-0 right-0 z-50
        bg-white/30 backdrop-blur-xl 
        border-b border-white/40
        shadow-[0_4px_30px_rgba(0,0,0,0.05)]
        animate-fadeInSlow
      ">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">

            {/* 로고 */}
            <div className="flex items-center">
              <a href="/" className="flex items-center space-x-2 group">
                <div className="
                  w-9 h-9 
                  bg-gradient-to-br from-blue-600 to-purple-600 
                  rounded-xl flex items-center justify-center
                  shadow-lg shadow-purple-300/40
                  group-hover:scale-110 transition-transform duration-200
                ">
                  <span className="text-white font-bold text-sm">DV</span>
                </div>
                <h1 className="
                  text-2xl font-extrabold 
                  bg-gradient-to-r from-blue-600 to-purple-600 
                  bg-clip-text text-transparent
                  drop-shadow-sm
                ">
                  De-View
                </h1>
              </a>
            </div>

            {/* 데스크톱 메뉴 */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4">
              {navigation.map((item, index) => (
                
                item.items ? (
                  <div 
                    key={item.name} 
                    className="relative"
                    ref={el => dropdownRefs.current[index] = el}
                  >
                    <button
                      onClick={() => setOpenDropdown(openDropdown === index ? null : index)}
                      className="
                        flex items-center px-4 py-2
                        text-sm font-semibold text-gray-700
                        rounded-lg
                        hover:bg-white/60
                        hover:shadow-md
                        transition-all duration-200
                      "
                    >
                      {item.name}
                      <ChevronDown
                        className={`ml-1 w-4 h-4 transition-transform ${
                          openDropdown === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {openDropdown === index && (
                      <div className="
                        absolute top-full left-0 mt-2
                        w-56 bg-white rounded-xl shadow-xl 
                        border border-gray-100
                        py-2 z-50
                        animate-dropdown
                      ">
                        {item.items.map((subItem, subIndex) => (
                          <a
                            key={subItem.name}
                            href={subItem.href}
                            onClick={() => setOpenDropdown(null)}
                            className="
                              block px-4 py-2.5 text-sm text-gray-700
                              hover:bg-gradient-to-r 
                              hover:from-blue-50 hover:to-purple-50
                              hover:text-gray-900
                              hover:translate-x-1
                              transition-all duration-200
                            "
                            style={{
                              animationDelay: `${subIndex * 40}ms`
                            }}
                          >
                            {subItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  
                  <a
                    key={item.name}
                    href={item.href}
                    className="
                      px-4 py-2 text-sm font-semibold text-gray-700
                      hover:bg-white/60 hover:shadow-md
                      rounded-lg transition-all duration-200
                    "
                  >
                    {item.name}
                  </a>
                )

              ))}
            </div>

            {/* 로그인 메뉴 */}
            <div className="hidden lg:flex lg:items-center lg:space-x-3">
              {!isLoggedIn ? (
                <>
                  <a
                    href="/signup"
                    className="
                      px-4 py-2 text-sm font-semibold text-gray-700 
                      hover:text-gray-900 hover:bg-white/60
                      rounded-lg transition duration-200
                    "
                  >
                    회원가입
                  </a>
                  <a
                    href="/login"
                    className="
                      px-5 py-2 text-sm font-semibold text-white 
                      bg-gradient-to-r from-blue-600 to-purple-600
                      rounded-lg shadow-lg shadow-purple-300/30
                      hover:shadow-purple-400/50
                      hover:from-blue-700 hover:to-purple-700
                      transition-all duration-200
                    "
                  >
                    로그인
                  </a>
                </>
              ) : (
                <div className="relative" id="user-menu-container">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="
                      flex items-center space-x-2 px-3 py-2
                      rounded-lg hover:bg-white/60 transition-all duration-200
                    "
                  >
                    <div className="
                      w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 
                      rounded-full flex items-center justify-center
                      shadow-md shadow-purple-300/40
                    ">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">내 계정</span>
                  </button>

                  {showUserMenu && (
                    <div className="
                      absolute right-0 mt-2 
                      w-48 bg-white rounded-xl shadow-lg 
                      border border-gray-100 py-2 animate-dropdown
                    ">
                      <a
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User className="w-4 h-4 mr-2" />
                        프로필
                      </a>
                      <button
                        onClick={handleLogout}
                        className="
                          flex items-center w-full px-4 py-2 text-sm 
                          text-red-600 hover:bg-red-50
                        "
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        로그아웃
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 모바일 메뉴 버튼 */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="
                lg:hidden p-2 text-gray-700 
                hover:bg-white/60 rounded-lg 
                transition-colors duration-200
              "
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </nav>
      </header>

      {/* 애니메이션 */}
      <style jsx>{`
        @keyframes dropdown {
          0% { opacity: 0; transform: translateY(-8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-dropdown {
          animation: dropdown 0.25s ease-out;
        }

        @keyframes fadeInSlow {
          0% { opacity: 0; transform: translateY(-6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInSlow {
          animation: fadeInSlow 0.4s ease-out;
        }
      `}</style>
    </>
  );
}

export default NavBar;
