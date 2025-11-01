import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  // 로딩 및 에러 상태
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // 비밀번호 보기/숨기기 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 필드별 에러 상태 (툴팁용)
  const [fieldErrors, setFieldErrors] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: ''
  });

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 입력 시 에러 메시지 초기화
    setError('');
    // 해당 필드의 에러 초기화
    setFieldErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // 폼 유효성 검사 - 첫 번째 에러만 표시
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

  // 회원가입 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 유효성 검사
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    // 요청 데이터 준비
    const { username, password, nickname } = formData;
    const requestData = { username, password, nickname };

    console.log('=================================');
    console.log('회원가입 요청 데이터:');
    console.log('=================================');
    console.log('API 엔드포인트: POST /auth/signUp');
    console.log('전송 데이터:', JSON.stringify(requestData, null, 2));
    console.log('=================================');

    try {
      // 실제 API 호출
      const response = '';

      console.log('회원가입 성공:', response);
      console.log('응답 데이터:', JSON.stringify(response, null, 2));

      setSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 2000);

    } catch (err) {
      console.error('회원가입 실패:', err);

      // 서버 응답이 있는 경우
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        console.log('에러 응답:', JSON.stringify(errorData, null, 2));

        // 서버에서 반환한 에러 메시지 사용
        if (errorData.message) {
          setError(errorData.message);
        } else {
          setError('회원가입에 실패했습니다.');
        }

        // 유효성 검사 에러 (400 - 필드별 에러)
        if (errorData.data && Array.isArray(errorData.data)) {
          const fieldErrors = errorData.data
            .map(item => `${item.field}: ${item.message}`)
            .join(', ');
          setError(`${errorData.message} (${fieldErrors})`);
        }

      } else if (err.request) {
        // 요청은 보냈지만 응답이 없는 경우
        setError('서버와 통신할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        console.error('서버 응답 없음. 서버 URL:', process.env.REACT_APP_API_URL);
      } else {
        // 요청 설정 중 에러
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        {/* 프로필 아이콘 */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-[#2a9d8f] to-[#2e4057] rounded-full flex items-center justify-center shadow-lg">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>

        {success && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
            회원가입이 완료되었습니다! 홈페이지로 이동합니다...
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 아이디 입력 */}
          <div className="mb-6 relative">
            <label htmlFor="username" className="block text-sm font-medium text-[#2e4057] mb-2">
              아이디
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition duration-150 ease-in-out ${
                fieldErrors.username
                  ? 'border-[#2a9d8f] focus:border-[#2a9d8f]'
                  : 'border-[#2a9d8f] focus:border-[#2a9d8f]'
              }`}
              placeholder=""
              disabled={loading}
            />
            {fieldErrors.username && (
              <div className="absolute left-8 top-full mt-3 z-10">
                <div className="relative bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl whitespace-nowrap border border-gray-500 z-10">
                  {/* 말풍선 화살표 */}
                  <div className="absolute -top-[11px] left-6 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-gray-500"></div>
                  <div className="absolute -top-[10px] left-[26px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-white"></div>
                  <div className="flex items-center gap-3 relative z-20">
                    <div className="bg-orange-500 rounded-sm px-2.5 py-1">
                      <span className="font-black text-base text-white">!</span>
                    </div>
                    <span className="text-sm font-normal">{fieldErrors.username}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 비밀번호 입력 */}
          <div className="mb-6 relative">
            <label htmlFor="password" className="block text-sm font-medium text-[#2e4057] mb-2">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border-2 border-[#2a9d8f] rounded-xl focus:outline-none focus:border-[#2a9d8f] transition duration-150 ease-in-out"
                placeholder="비밀번호를 입력하세요"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <div className="absolute left-8 top-full mt-3 z-10">
                <div className="relative bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl whitespace-nowrap border border-gray-500">
                  {/* 말풍선 화살표 */}
                  <div className="absolute -top-[11px] left-6 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-gray-500 -z-10"></div>
                  <div className="absolute -top-[10px] left-[26px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-white -z-10"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-orange-500 rounded-sm px-2.5 py-1">
                      <span className="font-black text-base text-white">!</span>
                    </div>
                    <span className="text-sm font-normal">{fieldErrors.password}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 비밀번호 확인 */}
          <div className="mb-6 relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#2e4057] mb-2">
              비밀번호 확인
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 border-2 border-[#2a9d8f] rounded-xl focus:outline-none focus:border-[#2a9d8f] transition duration-150 ease-in-out"
                placeholder="비밀번호를 다시 입력하세요"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <div className="absolute left-8 top-full mt-3 z-10">
                <div className="relative bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl whitespace-nowrap border border-gray-500">
                  {/* 말풍선 화살표 */}
                  <div className="absolute -top-[11px] left-6 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-gray-500 -z-10"></div>
                  <div className="absolute -top-[10px] left-[26px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-white -z-10"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-orange-500 rounded-sm px-2.5 py-1">
                      <span className="font-black text-base text-white">!</span>
                    </div>
                    <span className="text-sm font-normal">{fieldErrors.confirmPassword}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 닉네임 입력 */}
          <div className="mb-6 relative">
            <label htmlFor="nickname" className="block text-sm font-medium text-[#2e4057] mb-2">
              닉네임
            </label>
            <input
              type="text"
              id="nickname"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-[#2a9d8f] rounded-xl focus:outline-none focus:border-[#2a9d8f] transition duration-150 ease-in-out"
              placeholder="닉네임을 입력하세요"
              disabled={loading}
            />
            {fieldErrors.nickname && (
              <div className="absolute left-8 top-full mt-3 z-10">
                <div className="relative bg-white text-gray-800 px-4 py-3 rounded-lg shadow-xl whitespace-nowrap border border-gray-500">
                  {/* 말풍선 화살표 */}
                  <div className="absolute -top-[11px] left-6 w-0 h-0 border-l-[12px] border-r-[12px] border-b-[12px] border-transparent border-b-gray-500 -z-10"></div>
                  <div className="absolute -top-[10px] left-[26px] w-0 h-0 border-l-[10px] border-r-[10px] border-b-[10px] border-transparent border-b-white -z-10"></div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="bg-orange-500 rounded-sm px-2.5 py-1">
                      <span className="font-black text-base text-white">!</span>
                    </div>
                    <span className="text-sm font-normal">{fieldErrors.nickname}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-bold py-4 px-4 rounded-full shadow-xl transition duration-300 ease-in-out transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#2a9d8f] to-[#2e4057] hover:opacity-90 hover:scale-105'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <span>{loading ? '처리 중...' : '회원가입'}</span>
              {!loading && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </div>
          </button>
        </form>

        {/* 로그인 페이지 링크 */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            이미 계정이 있으신가요?{' '}
            <a href="/" className="text-[#2a9d8f] hover:text-[#238276] font-semibold underline">
              로그인
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;