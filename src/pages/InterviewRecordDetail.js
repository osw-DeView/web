import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function InterviewRecordDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>잘못된 접근입니다. 기록을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const {
    id,
    interviewType,
    messages,
    overallScore,
    overallFeedback,
    createdAt,
    improvementKeywords,
    turnEvaluations
  } = state;

  const parsedMessages = (() => {
    try {
      const arr = JSON.parse(messages);
      if (arr.length > 0 && arr[arr.length - 1].role === "assistant") {
        arr.pop();
      }
      return arr;
    } catch {
      return [];
    }
  })();

  const keywords = improvementKeywords ? JSON.parse(improvementKeywords) : [];
  const formatDate = (d) => new Date(d).toLocaleString("ko-KR");

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 p-5 pt-28">
        
        <div className="max-w-4xl mx-auto">
          {/* 🔙 뒤로가기 */}
          <button
            className="mb-4 text-blue-600 font-semibold hover:underline"
            onClick={() => navigate(-1)}
          >
            ← 뒤로가기
          </button>

          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {interviewType} 모의 면접 기록
            </h1>

            <div className="text-gray-500 text-sm mb-6">
              기록 ID: {id} · {formatDate(createdAt)}
            </div>

            <div className="mb-6">
              <p className="text-lg font-semibold">총점</p>
              <p className="text-3xl font-bold text-blue-600">{overallScore} / 100</p>
            </div>

            <div>
              <p className="text-lg font-semibold">총평</p>
              <div className="bg-gray-50 p-4 rounded-lg mt-2 text-gray-700">
                {overallFeedback}
              </div>
            </div>
          </div>

          {keywords.length > 0 && (
            <div className="bg-white shadow-md rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-3">개선이 필요한 키워드</h2>
              <div className="flex flex-wrap gap-2">
                {keywords.filter(k => k.trim() !== "").map((k, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    #{k}
                  </span>
                ))}
              </div>
            </div>
          )}

          {turnEvaluations && turnEvaluations.length > 0 && (
            <div className="bg-white shadow-md rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">답변 별 상세 분석</h2>

              <div className="space-y-8">
                {turnEvaluations.map((turn, idx) => {
                  const questionMsg = parsedMessages[idx * 2];
                  const answerMsg = parsedMessages[idx * 2 + 1];

                  return (
                    <div key={idx} className="border-b pb-6">

                      <p className="text-lg font-semibold mb-2">
                        TURN {turn.turn}
                      </p>

                      {/* 질문 */}
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-blue-700 mb-1">🧑‍🏫 면접관 질문</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{questionMsg?.content}</p>
                      </div>

                      {/* 답변 */}
                      <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mb-3">
                        <p className="text-sm font-semibold text-gray-700 mb-1">🙋‍♂️ 나의 답변</p>
                        <p className="text-gray-800 whitespace-pre-wrap">{answerMsg?.content}</p>
                      </div>

                      {/* 점수 */}
                      <p className="text-md font-semibold">
                        점수:
                        <span className="ml-2 text-blue-600 font-bold">{turn.score} / 100</span>
                      </p>

                      {/* 평가 피드백 */}
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-2">
                        <p className="font-semibold text-yellow-700 mb-1">📝 평가</p>
                        <p className="text-gray-700">{turn.feedback}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="bg-white shadow-md rounded-xl p-6 mb-8">
            <p className="text-lg font-semibold mb-3">전체 대화 내역</p>

            <div className="space-y-4">
              {parsedMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl max-w-xl ${
                    msg.role === "assistant"
                      ? "bg-blue-50 border border-blue-200"
                      : "bg-gray-100 border border-gray-300 ml-auto"
                  }`}
                >
                  <div className="text-sm font-semibold mb-1">
                    {msg.role === "assistant" ? "👨‍🏫 면접관" : "🙋‍♂️ 나"}
                  </div>
                  <div className="whitespace-pre-wrap text-gray-800">{msg.content}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default InterviewRecordDetail;
