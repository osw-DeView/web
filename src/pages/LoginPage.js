// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../components/LoginPage.css';

function LoginPage() {
    // State 관리 (rememberMe 제거)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    // 비밀번호 표시/숨김 토글
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage('');

        // 클라이언트 측 유효성 검사
        if (!username || !password) {
            setErrorMessage('아이디와 비밀번호를 모두 입력해주세요.');
            return;
        }

        setLoading(true);

        // 서버로 보낼 JSON 데이터 (요구사항에 맞춤)
        const loginData = {
            username: username,
            password: password
        };

        try {
            // Axios POST 요청
            const response = await axios.post(
                'http://localhost:8080/auth/login',
                loginData,
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // 로그인 성공 처리
            console.log('로그인 성공:', response.data);

            // JWT 토큰이 있다면 저장 (선택 사항)
            if (response.data.token) {
                localStorage.setItem('authToken', response.data.token);
            }

            // 메인 페이지로 이동
            navigate('/main');

        } catch (error) {
            // 에러 처리
            console.error('로그인 실패:', error);
            
            if (error.response) {
                // 서버가 응답을 반환한 경우 (4xx, 5xx 에러)
                const status = error.response.status;
                const serverMessage = error.response.data.message;
                
                if (status === 401) {
                    setErrorMessage('아이디 또는 비밀번호가 올바르지 않습니다.');
                } else if (status === 400) {
                    setErrorMessage(serverMessage || '잘못된 요청입니다.');
                } else if (status === 500) {
                    setErrorMessage('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
                } else {
                    setErrorMessage(serverMessage || '로그인에 실패했습니다.');
                }
            } else if (error.request) {
                // 요청은 보냈지만 응답을 받지 못한 경우
                setErrorMessage('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
            } else {
                // 요청 설정 중 에러가 발생한 경우
                setErrorMessage(`로그인 실패: ${error.message}`);
            }
        } finally {
            setLoading(false);
        }
    };

    // 입력 필드 포커스 시 에러 메시지 제거
    const handleInputFocus = () => {
        if (errorMessage) {
            setErrorMessage('');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    {/* 로고 섹션 */}
                    <div className="logo-section">
                        <div className="logo">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.99296258,10.5729355 C12.478244,10.5729355 14.4929626,8.55821687 14.4929626,6.0729355 C14.4929626,3.58765413 12.478244,1.5729355 9.99296258,1.5729355 C7.5076812,1.5729355 5.49296258,3.58765413 5.49296258,6.0729355 C5.49296258,8.55821687 7.5076812,10.5729355 9.99296258,10.5729355 Z M10,0 C13.3137085,0 16,2.6862915 16,6 C16,8.20431134 14.8113051,10.1309881 13.0399615,11.173984 C16.7275333,12.2833441 19.4976819,15.3924771 19.9947005,19.2523727 C20.0418583,19.6186047 19.7690435,19.9519836 19.3853517,19.9969955 C19.0016598,20.0420074 18.6523872,19.7816071 18.6052294,19.4153751 C18.0656064,15.2246108 14.4363723,12.0699838 10.034634,12.0699838 C5.6099956,12.0699838 1.93381693,15.231487 1.39476476,19.4154211 C1.34758036,19.7816499 0.998288773,20.0420271 0.614600177,19.9969899 C0.230911582,19.9519526 -0.0418789616,19.6185555 0.00530544566,19.2523267 C0.500630192,15.4077896 3.28612316,12.3043229 6.97954305,11.1838052 C5.19718955,10.1447285 4,8.21217353 4,6 C4,2.6862915 6.6862915,0 10,0 Z" fill="#f0eff4ff"></path>
                            </svg>
                        </div>
                    </div>

                    {/* 에러 메시지 */}
                    {errorMessage && (
                        <div className="error-message show">
                            {errorMessage}
                        </div>
                    )}

                    {/* 로그인 폼 */}
                    <form onSubmit={handleSubmit}>
                        {/* 아이디 입력 */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="username">아이디</label>
                            <input
                                type="text"
                                id="username"
                                className="form-control"
                                placeholder="아이디를 입력하세요"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                onFocus={handleInputFocus}
                                required
                                autoComplete="username"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">비밀번호</label>
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="form-control"
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={handleInputFocus}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={togglePasswordVisibility}
                                    aria-label="비밀번호 표시"
                                >
                                    {showPassword ? (
                                        <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                        </svg>
                                    ) : (
                                        <svg className="eye-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* 비밀번호 찾기 링크 (오른쪽 정렬) */}
                        <div style={{ textAlign: 'right', marginBottom: 'var(--space-12)' }}>
                            <a href="#" className="forgot-link">비밀번호 찾기</a>
                        </div>

                        {/* 로그인 버튼 */}
                        <button type="submit" className="btn-primary" disabled={loading}>
                            <span className="icon-container">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                >
                                    <path fill="none" d="M0 0h24v24H0z"></path>
                                    <path
                                        fill="currentColor"
                                        d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                                    ></path>
                                </svg>
                            </span>
                            <span className="btn-text">{loading ? '로그인 중...' : '로그인'}</span>
                        </button>
                    </form>

                    {/* 회원가입 링크 */}
                    <div className="signup-link">
                        아직 계정이 없으신가요? <a href="#">회원가입</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
