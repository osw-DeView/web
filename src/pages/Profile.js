import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Profile() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

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

                <div>
                  <p className="text-gray-500 text-sm">역할</p>
                  <p className="font-medium text-gray-800">{userInfo.role}</p>
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

            <button className="w-full bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
              개인정보 수정
            </button>

            <button className="w-full bg-white border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition font-medium">
              비밀번호 변경
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
