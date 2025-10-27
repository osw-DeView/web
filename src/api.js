import axios from 'axios';
import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, options) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name) => {
  return cookies.get(name);
};

const api = axios.create({
  baseURL: 'http://localhost:8080', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: AccessToken 자동 첨부
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 또는 403 모두 재발급 트리거로 인식
    if ((error.response && (error.response.status === 401 || error.response.status === 403)) && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getCookie('refreshToken');
        if (!refreshToken) throw new Error('리프레시 토큰이 없습니다.');

        const res = await axios.post('http://localhost:8080/auth/jwt/refresh', {
          refreshToken: refreshToken,
        });

        const { accessToken, refreshToken: newRefresh } = res.data.data;

        // 새 토큰 저장
        localStorage.setItem('accessToken', accessToken);
        setCookie('refreshToken', newRefresh, { path: '/', secure: true, sameSite: 'lax' });
   
        // // 헤더 갱신 후 재시도
         originalRequest.headers.Authorization = `Bearer ${accessToken}`;
 
        return api(originalRequest);
      } catch (refreshError) {
        console.error('토큰 재발급 실패:', refreshError);
        localStorage.removeItem('accessToken');
        cookies.remove('refreshToken');
        //localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);


export default api;
