import React, { useState } from "react";
import { Sparkles, BookOpen } from "lucide-react";
import api from "../api";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const InterviewStartPage = () => {
  const navigate = useNavigate();
  const [interviewType, setInterviewType] = useState(""); // 인터뷰 타입
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const startInterview = async () => {
    if(!interviewType){
      setError("면접 유형을 선택해주세요!");
      return;
    }

    setLoading(true);
    setError(null);

    try{
      const res = await api.post("api/interview/chat/start", {
        interviewType: interviewType
      });

      console.log(res.data);

      if(res.data && res.data.sessionId){
        navigate("/interview", {
          state: {
            sessionId: res.data.sessionId,
            interviewType: interviewType,
            initialMessage: res.data.response,
          },
        });
      }else{
        setError("서버 응답이 올바르지 않습니다.");
      }

    }catch(err){
      console.error("API 호출 실패:", err);

      if(err.response){ // 서버가 응답을 반환한 경우
        setError(
          err.response.data?.message || 
          `서버 오류가 발생했습니다. (${err.response.status})`
        );
      }else if(err.request){ // 요청이 전송되었지만 응답이 없는 경우
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      }else{ // 요청 설정 중 오류가 발생한 경우
        setError("요청 중 오류가 발생했습니다.");
      }
    }

  }
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
              아래에서 AI 인터뷰 주제를 선택해주세요.
            </p>
          </div>

          {/* 면접 유형 선택 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">면접 유형 선택</h2>
            </div>

            {/* 🔍 개발 모드 디버깅 정보
            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs">
              <p className="text-gray-600 mb-1">🔍 현재 상태</p>
              <div className="space-y-1 text-gray-700">
                <p>• 선택된 타입: <span className="font-semibold text-blue-600">{interviewType}</span></p>
                <p>• 로딩: <span className="font-semibold">{loading ? '진행 중' : '대기'}</span></p>
                <p className="text-xs text-gray-500 mt-2">
                  💡 콘솔(F12)에서 API 요청/응답을 확인하세요
                </p>
              </div>
            </div> */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setInterviewType('cs')}
                disabled={loading}
                className={`
                  p-6 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02]
                  ${interviewType === 'cs'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-blue-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-2xl mb-2">💻</div>
                <h3 className="text-lg font-bold mb-1">CS 지식 면접</h3>
                <p className={`text-sm ${interviewType === 'cs' ? 'text-blue-100' : 'text-gray-500'}`}>
                  자료구조, 알고리즘, 네트워크 등
                </p>
              </button>

              <button
                onClick={() => setInterviewType('project')}
                disabled={loading}
                className={`
                  p-6 rounded-xl text-left transition-all duration-200 transform hover:scale-[1.02]
                  ${interviewType === 'project'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                    : 'bg-gray-50 hover:bg-blue-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300'
                  }
                  ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="text-2xl mb-2">🚀</div>
                <h3 className="text-lg font-bold mb-1">프로젝트 경험 면접</h3>
                <p className={`text-sm ${interviewType === 'project' ? 'text-blue-100' : 'text-gray-500'}`}>
                  개발 경험 및 프로젝트 설명
                </p>
              </button>
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
                `🚀 ${interviewType === 'cs' ? 'CS 면접' : '프로젝트 면접'} 시작하기`
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