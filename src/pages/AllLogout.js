import React from "react";
import api from "../api";
import { deleteCookie } from "../utils/cookieUtils";
import { useNavigate } from "react-router-dom";

function AllLogoutPage() {
  const navigate = useNavigate();

  // 내 브라우저 토큰만 삭제
  const handleLocalTokenDelete = () => {
    if (!window.confirm("내 브라우저의 로그인 토큰을 삭제합니다. 계속할까요?")) return;

    localStorage.removeItem("accessToken");
    deleteCookie("refreshToken");

    alert("클라이언트의 토큰이 모두 삭제되었습니다.");
  };

  // Redis 토큰 전체 삭제
  const handleRedisTokenDelete = async () => {
    if (!window.confirm("Redis에 저장된 모든 RefreshToken을 삭제합니다. 계속할까요?")) return;

    try {
      await api.get("/test/allLogout"); 
      alert("Redis에 저장된 모든 토큰이 삭제되었습니다.");
    } catch (error) {
      console.error(error);
      alert("Redis 토큰 삭제에 실패했습니다.");
    }
  };

  const handleAllLogout = async () => {
    if (!window.confirm("모든 사용자를 강제 로그아웃합니다. 계속할까요?")) return;

    try {
      await api.get("/test/allLogout"); 
      alert("전체 로그아웃이 완료되었습니다.");

      // 클라이언트 토큰 삭제
      localStorage.removeItem('accessToken');
      deleteCookie('refreshToken');

      navigate("/");
    } catch (error) {
      console.error(error);
      alert("전체 로그아웃 처리 실패");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">

      <h1 className="text-2xl font-bold mb-4">로그아웃 / 토큰 관리</h1>

      {/* 1️ 내 토큰 삭제 */}
      <button
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
        onClick={handleLocalTokenDelete}
      >
        클라이언트 토큰 삭제
      </button>

      {/* 2️ Redis 전체 삭제 */}
      <button
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        onClick={handleRedisTokenDelete}
      >
        Redis RefreshToken 전체 삭제
      </button>

      {/* 3 전체 로그아웃 */}
      <button
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        onClick={handleAllLogout}
      >
        전체 로그아웃 실행
      </button>

    </div>
  );
}

export default AllLogoutPage;
