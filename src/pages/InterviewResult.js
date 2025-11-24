import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, TrendingUp, MessageSquare, Award, Home } from "lucide-react";
import api from "../api";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const InterviewResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId, interviewType } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [evaluationData, setEvaluationData] = useState(null);
  
  const hasCalledAPI = useRef(false); // 중복 호출 방지

  useEffect(() => {
    if (!sessionId) {
      navigate("/interview/start");
      return;
    }

    if (hasCalledAPI.current) { // 이미 API를 호출했다면 다시 호출하지 않음
      return;
    }
    
    hasCalledAPI.current = true;
    fetchEvaluation();
  }, [sessionId]);

  const fetchEvaluation = async () => {
    setLoading(true);
    setError(null);

    try {

      const response = await api.post("/api/interview/chat/evaluation", {
        sessionId: sessionId,
      });
      
      // API 응답 구조: { evaluation_report: { ... } }
      if (response.data && response.data.evaluation_report) {
        setEvaluationData(response.data.evaluation_report);
      } else {
        setError("평가 데이터 형식이 올바르지 않습니다.");
      }
    } catch (err) {
      console.error("평가 요청 실패:", err);
      setError("평가 결과를 불러오는데 실패했습니다.");
      // 에러 발생 시 플래그 리셋 (재시도 가능하도록)
      hasCalledAPI.current = false;
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-blue-50 border-blue-200";
    if (score >= 40) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <NavBar />
        <div className="flex items-center justify-center flex-1 p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">면접 평가 중...</p>
            <p className="text-sm text-gray-500 mt-2">AI가 답변을 분석하고 있습니다</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <NavBar />
        <div className="flex items-center justify-center flex-1 p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-red-200 p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">오류 발생</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/interview/start")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
            >
              처음으로 돌아가기
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavBar />
      <div className="flex-1 p-4 md:p-8 pt-24 md:pt-28">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* 헤더 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                <Award className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              면접 평가 완료!
            </h1>
            <p className="text-gray-600 text-base md:text-lg">
              {interviewType === "cs" ? "CS 지식 면접" : "프로젝트 경험 면접"} 결과입니다
            </p>
          </div>

          {/* 전체 점수 카드 */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">종합 평가</h2>
            </div>

            <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(evaluationData?.overall_score || 0)} mb-6`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-medium">전체 점수</span>
                <span className={`text-4xl font-bold ${getScoreColor(evaluationData?.overall_score || 0)}`}>
                  {evaluationData?.overall_score || 0}점
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    evaluationData?.overall_score >= 80
                      ? "bg-gradient-to-r from-green-500 to-green-600"
                      : evaluationData?.overall_score >= 60
                      ? "bg-gradient-to-r from-blue-500 to-blue-600"
                      : evaluationData?.overall_score >= 40
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600"
                      : "bg-gradient-to-r from-red-500 to-red-600"
                  }`}
                  style={{ width: `${evaluationData?.overall_score || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                {evaluationData?.overall_feedback || "종합 피드백이 없습니다."}
              </p>
            </div>
          </div>

          {/* 개선점 카드 */}
          {evaluationData?.improvement_keywords && evaluationData.improvement_keywords.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">개선이 필요한 부분</h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {evaluationData.improvement_keywords
                  .filter((keyword) => keyword.trim() !== "")
                  .map((keyword, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        navigate(
                          `/study/interview/record/keyword/${encodeURIComponent(keyword)}`,
                          { state: { keyword: keyword } }
                        )
                      }
                      className="
                        group relative
                        px-5 py-3 bg-white
                        border-2 border-purple-300
                        rounded-xl font-semibold cursor-pointer
                        hover:bg-purple-600 hover:border-purple-600
                        hover:shadow-xl hover:-translate-y-1
                        active:scale-95
                        transition-all duration-200
                        flex items-center gap-2
                      "
                    >
                      <span className="text-purple-700 group-hover:text-white transition-colors">
                        {keyword}
                      </span>
                      <Sparkles className="w-4 h-4 text-purple-500 group-hover:text-white transition-colors" />
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* 질문별 평가 카드 */}
          {evaluationData?.turn_evaluations && evaluationData.turn_evaluations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold text-gray-800">질문별 상세 평가</h2>
              </div>

              <div className="space-y-4">
                {evaluationData.turn_evaluations.map((turn, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">
                            질문 {turn.turn}
                          </span>
                          <span className={`text-2xl font-bold ${getScoreColor(turn.score)}`}>
                            {turn.score}점
                          </span>
                        </div>
                        <p className="text-gray-700 font-medium mb-2">{turn.question}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-sm text-gray-600 leading-relaxed">{turn.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate("/interview/start")}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-lg font-bold transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
            >
              🔄 다시 면접 보기
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-4 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 rounded-xl text-lg font-bold transition-all flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>홈으로</span>
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InterviewResultPage;