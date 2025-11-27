import React, { useState } from "react";
import { Sparkles, BookOpen } from "lucide-react";
import api from "../api";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const InterviewStartPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startInterview = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("api/interview/chat/start", {
        interviewType: "cs"
      });

      console.log(res.data);

      if (res.data && res.data.sessionId) {
        navigate("/interview", {
          state: {
            sessionId: res.data.sessionId,
            interviewType: "cs",
            initialMessage: res.data.response,
          },
        });
      } else {
        setError("서버 응답이 올바르지 않습니다.");
      }

    } catch (err) {
      console.error("API 호출 실패:", err);

      if (err.response) {
        setError(
          err.response.data?.message || 
          `서버 오류가 발생했습니다. (${err.response.status})`
        );
      } else if (err.request) {
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        setError("요청 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavBar />
      <div className="flex items-center justify-center flex-1 p-4 md:p-8 pt-24 md:pt-28">
        <div className="max-w-2xl w-full space-y-6">

          {/* 헤더 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              안녕하세요!
            </h1>
            <p className="text-xl md:text-2xl mb-4 text-gray-800 font-semibold">
              기술 면접을 담당하는 AI 면접관입니다.
            </p>
            <p className="text-gray-600 text-base md:text-lg">
              준비가 되셨다면 아래 버튼을 눌러 면접을 시작하세요.
            </p>
          </div>

          {/* 면접 안내 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">CS 기술 면접</h2>
            </div>

            <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  자료구조 & 알고리즘
                </p>
                <p className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  운영체제 & 네트워크
                </p>
                <p className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  데이터베이스
                </p>
                <p className="flex items-center">
                  <span className="text-blue-600 mr-2">✓</span>
                  기타 CS 기초 지식
                </p>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
              </div>
            )}

            {/* 면접 시작 버튼 */}
            <button
              onClick={startInterview}
              disabled={loading}
              className={`
                w-full py-4 rounded-xl text-lg font-bold transition-all duration-200
                ${loading 
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-600 mr-2"></div>
                  면접 시작 준비 중...
                </span>
              ) : (
                'CS 면접 시작하기'
              )}
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InterviewStartPage;