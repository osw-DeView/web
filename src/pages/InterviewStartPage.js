import React, { useState } from "react";
import { Sparkles, BookOpen, Cpu, Database, Network, Code, FolderGit2, BrainCircuit } from "lucide-react";
import api from "../api";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const categories = [
  { name: "운영체제", value: "Operating System", icon: <Cpu className="w-8 h-8" /> },
  { name: "컴퓨터 구조", value: "Computer Architecture", icon: <BrainCircuit className="w-8 h-8" /> },
  { name: "자료구조", value: "Data Structure", icon: <FolderGit2 className="w-8 h-8" /> },
  { name: "데이터베이스", value: "Database", icon: <Database className="w-8 h-8" /> },
  { name: "네트워크", value: "NetWork", icon: <Network className="w-8 h-8" /> },
  { name: "소프트웨어 공학", value: "SoftWare Engineering", icon: <Code className="w-8 h-8" /> },
];

const InterviewStartPage = () => {
  const navigate = useNavigate();
  const [loadingCategory, setLoadingCategory] = useState(null);
  const [error, setError] = useState(null);

  const startInterview = async (category) => {
    setLoadingCategory(category);
    setError(null);

    try {
      const res = await api.post("api/interview/chat/start", {
        interviewType: category,
      });

      if (res.data && res.data.sessionId) {
        navigate("/interview", {
          state: {
            sessionId: res.data.sessionId,
            interviewType: category,
            initialMessage: res.data.response,
          },
        });
      } else {
        setError("서버 응답이 올바르지 않습니다.");
        setLoadingCategory(null);
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
      setLoadingCategory(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavBar />
      <div className="flex items-center justify-center flex-1 p-4 md:p-8 pt-24 md:pt-28">
        <div className="max-w-2xl w-full space-y-6">
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
              아래 주제 중 하나를 선택하여 면접을 시작하세요.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">CS 기술 면접 주제 선택</h2>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">⚠️ {error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => startInterview(cat.value)}
                  disabled={loadingCategory !== null}
                  className={`
                    group p-4 md:p-6 flex flex-col items-center justify-center text-center 
                    bg-gradient-to-br from-gray-50 to-blue-50 
                    border-2 border-gray-200 rounded-xl 
                    hover:border-blue-400 hover:shadow-lg hover:-translate-y-1 
                    transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  <div className="mb-3 text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                    {cat.icon}
                  </div>
                  <span className="font-semibold text-gray-700 group-hover:text-black transition-colors duration-300">
                    {cat.name}
                  </span>
                  {loadingCategory === cat.value && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InterviewStartPage;
