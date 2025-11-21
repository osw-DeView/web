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

  const { id, interviewType, messages, overallScore, overallFeedback, createdAt } = state;

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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString("ko-KR");
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 p-5 pt-28">
        
        <div className="max-w-3xl mx-auto">
          <button
            className="mb-4 text-blue-600 font-semibold hover:underline"
            onClick={() => navigate(-1)}
          >
            ← 뒤로가기
          </button>

          <div className="bg-white shadow-md rounded-xl p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {interviewType} 모의 면접 기록
            </h1>

            <div className="text-gray-500 text-sm mb-6">
              기록 ID: {id} · {formatDate(createdAt)}
            </div>

            <div className="mb-6">
              <div className="text-lg font-semibold">총점</div>
              <div className="text-3xl font-bold text-blue-600">{overallScore} / 100</div>
            </div>

            <div className="mb-8">
              <div className="text-lg font-semibold">총평</div>
              <div className="bg-gray-50 p-4 rounded-lg mt-2 text-gray-700">
                {overallFeedback}
              </div>
            </div>

            <div>
              <div className="text-lg font-semibold mb-3">전체 대화 내역</div>

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
                    <div className="whitespace-pre-wrap text-gray-800">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default InterviewRecordDetail;
