import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function SignUp() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {
      username: '',
      password: '',
      confirmPassword: '',
      nickname: ''
    };

    // 아이디 검사
    if (!formData.username.trim()) {
      newErrors.username = '이 입력란을 작성하세요.';
      setFieldErrors(newErrors);
      return false;
    }

    // 비밀번호 검사
    if (!formData.password) {
      newErrors.password = '이 입력란을 작성하세요.';
      setFieldErrors(newErrors);
      return false;
    }

    // 비밀번호 확인 검사
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '이 입력란을 작성하세요.';
      setFieldErrors(newErrors);
      return false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
      setFieldErrors(newErrors);
      return false;
    }

    // 닉네임 검사
    if (!formData.nickname.trim()) {
      newErrors.nickname = '이 입력란을 작성하세요.';
      setFieldErrors(newErrors);
      return false;
    }

    setFieldErrors(newErrors);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    const { username, password, nickname } = formData;
    const requestData = { username, password, nickname };

    console.log('=================================');
    console.log('회원가입 요청 데이터:');
    console.log('=================================');
    console.log('API 엔드포인트: POST /auth/signUp');
    console.log('전송 데이터:', JSON.stringify(requestData, null, 2));
    console.log('=================================');

    try {
      const response = await api.post('/auth/signUp', requestData);
      

      console.log('회원가입 성공:', response);
      console.log('응답 데이터:', JSON.stringify(response, null, 2));

      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (err) {
      console.error('회원가입 실패:', err);

      if (err.response && err.response.data) {
        const errorData = err.response.data;
        console.log('에러 응답:', JSON.stringify(errorData, null, 2));

        if (errorData.message) {
          setError(errorData.message);
        } else {
          setError('회원가입에 실패했습니다.');
        }

        if (errorData.data && Array.isArray(errorData.data)) {
          const fieldErrors = errorData.data
            .map(item => `${item.field}: ${item.message}`)
            .join(', ');
          setError(`${errorData.message} (${fieldErrors})`);
        }

      } else if (err.request) {
        setError('서버와 통신할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        console.error('서버 응답 없음. 서버 URL:', process.env.REACT_APP_API_URL);
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 border border-gray-200">
          
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>

          {success && (
            <div className="p-3 mb-4 rounded-lg text-sm bg-green-100 text-green-700 border border-green-400">
              회원가입이 완료되었습니다! 홈페이지로 이동합니다...
            </div>
          )}

          {error && (
            <div className="p-3 mb-4 rounded-lg text-sm bg-red-100 text-red-700 border border-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4"> 
            
            <div className="flex flex-col space-y-1 relative"> 
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                아이디
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${
                  fieldErrors.username ? 'border-red-500' : ''
                }`}
                placeholder="아이디를 입력하세요"
                disabled={loading}
              />
              {fieldErrors.username && (
                <div className="absolute left-0 top-full mt-1 z-10 w-full"> 
                   <div className="bg-red-500 text-white text-xs font-semibold rounded py-1 px-2 mt-1">
                      {fieldErrors.username}
                   </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-1 relative"> 
              <label htmlFor="password" className="text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${
                    fieldErrors.password ? 'border-red-500' : ''
                  }`}
                  placeholder="비밀번호를 입력하세요"
                  disabled={loading}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition duration-150"
                  aria-label="비밀번호 표시"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.password && (
                <div className="absolute left-0 top-full mt-1 z-10 w-full">
                   <div className="bg-red-500 text-white text-xs font-semibold rounded py-1 px-2 mt-1">
                      {fieldErrors.password}
                   </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-1 relative"> 
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                비밀번호 확인
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  
                  className={`w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${
                    fieldErrors.confirmPassword ? 'border-red-500' : ''
                  }`}
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition duration-150"
                  aria-label="비밀번호 표시"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="1" y1="1" x2="23" y2="23" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="3" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <div className="absolute left-0 top-full mt-1 z-10 w-full">
                   <div className="bg-red-500 text-white text-xs font-semibold rounded py-1 px-2 mt-1">
                      {fieldErrors.confirmPassword}
                   </div>
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-1 relative"> 
              <label htmlFor="nickname" className="text-sm font-medium text-gray-700">
                닉네임
              </label>
              <input
                type="text"
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}

                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ${
                  fieldErrors.nickname ? 'border-red-500' : ''
                }`}
                placeholder="닉네임을 입력하세요"
                disabled={loading}
              />
              {fieldErrors.nickname && (
                <div className="absolute left-0 top-full mt-1 z-10 w-full">
                   <div className="bg-red-500 text-white text-xs font-semibold rounded py-1 px-2 mt-1">
                      {fieldErrors.nickname}
                   </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center gap-2">
                <span>{loading ? '처리 중...' : '회원가입'}</span>
                {loading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-gray-600">
              이미 계정이 있으신가요?
              <a href="/" className="text-indigo-600 hover:text-indigo-500 font-semibold ml-1 transition duration-150">
                로그인
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;