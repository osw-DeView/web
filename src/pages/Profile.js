import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getCookie, deleteCookie } from "../utils/cookieUtils";

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    api
      .get("/member/profile", {
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`,
        },
      })
      .then((res) => {
        setUserInfo(res.data.data);
      })
      .catch(() => {
        console.log("유저 정보 불러오기 실패");
      });
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    const refreshToken = getCookie("refreshToken");

    try {
      if (refreshToken) {
        await api.post("/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("로그아웃 API 오류:", error);
    } finally {
      localStorage.removeItem("accessToken");
      deleteCookie("refreshToken");
      window.location.href = '/';
    }
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 px-4 pt-28 pb-10">
        <div className="max-w-3xl mx-auto">

          <div className="bg-white rounded-xl shadow-md p-6 mb-10">
            <h1 className="text-2xl font-bold text-gray-800 mb-1">내 프로필</h1>
            <p className="text-sm text-gray-500 mb-6">개인 정보 및 활동 관리</p>

            {userInfo ? (
              <div className="space-y-4">
                <div>
                  <p className="text-gray-500 text-sm">아이디</p>
                  <p className="font-medium text-gray-800">{userInfo.username}</p>
                </div>

                <div>
                  <p className="text-gray-500 text-sm">닉네임</p>
                  <p className="font-medium text-gray-800">{userInfo.nickname}</p>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
            )}
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/study/interview/record")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition font-medium"
            >
              나의 면접 기록 보기
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg shadow hover:from-blue-700 hover:to-purple-700 transition font-medium"
            >
              홈으로 돌아가기
            </button>

            <button 
              onClick={() => setShowLogoutModal(true)}
              className="w-full bg-gradient-to-r from-red-600 to-yellow-600 text-white py-3 rounded-lg shadow hover:from-red-700 hover:to-yellow-700 transition font-medium"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 로그아웃 확인 모듈 */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <p className="text-gray-600 mb-8 text-center">정말 로그아웃 하시겠습니까?</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-yellow-600 text-white rounded-lg hover:from-red-700 hover:to-yellow-700 transition font-medium"
              >
                로그아웃
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                취소
              </button>
              
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Profile;