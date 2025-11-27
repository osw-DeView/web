import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, options) => {
  return cookies.set(name, value, { ...options });
};

export const getCookie = (name) => {
  return cookies.get(name);
};

export const deleteCookie = (name) => {
    // 값을 비우고, 만료일을 과거로 설정하여 쿠키를 삭제.
    setCookie(name, "", -1); 
};