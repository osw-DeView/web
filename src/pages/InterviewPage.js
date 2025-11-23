import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import NavBar from "../components/NavBar";
import { Send, Sparkles } from "lucide-react";

const InterviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null); 

  const { sessionId, interviewType, initialMessage } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [answerCount, setAnswerCount] = useState(0); // 답변 카운트

  const MAX_QUESTIONS = 3; // 최대 질문 개수

  useEffect(() => { // 첫 질문 바로 요청
    if(!sessionId){
      navigate("/interview/start");
      return;
    }

    // 페이지 로드되자마자 첫 질문 바로 요청
    if(initialMessage){
      requestFirstQuestion();
    }
  }, [sessionId, initialMessage, navigate]);

  // 첫 질문 자동 요청 (초기 인사 메시지 포함)
  const requestFirstQuestion = async () => {
    setLoading(true);
    try {
      console.log("📤 첫 질문 요청:", { sessionId, interviewType });

      const response = await api.post("/api/interview/chat/next", {
        sessionId: sessionId,
        interviewType: interviewType,
        messages: [
          {
            role: "assistant",
            content: initialMessage,
          },
        ],
      });

      console.log("📥 첫 질문 받음:", response.data);

      // 초기 메시지 없이 첫 질문만 표시
      setMessages([
        {
          role: "assistant",
          content: response.data.response,
        },
      ]);
    } catch (err) {
      console.error("❌ 첫 질문 요청 실패:", err);
      setMessages([
        {
          role: "error",
          content: "질문을 불러오는데 실패했습니다. 페이지를 새로고침해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() =>{ // 메시지 전송 시 스크롤
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
  };

  const sendMessage = async () => {
    if(!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");

    const newUserMessage = {
      role: "user",
      content: userMessage,
    };

    setMessages((prev) => [...prev, newUserMessage]);
    
    // 답변 카운트 증가 (사용자가 답변을 보낼 때마다)
    const newAnswerCount = answerCount + 1;
    setAnswerCount(newAnswerCount);

    // 4번째 답변 완료 시 API 호출 없이 바로 종료
    if (newAnswerCount > MAX_QUESTIONS) {
      console.log("✅ 면접 완료! 평가 페이지로 이동");
      
      // 짧은 지연 후 완료 메시지 표시 (사용자 메시지가 먼저 렌더링되도록)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "면접이 종료되었습니다. 수고하셨습니다!",
          },
        ]);
      }, 100);
      
      // 2초 후 자동으로 평가 페이지로 이동
      setTimeout(() => {
        navigate("/interview/result", {
          state: { sessionId, interviewType },
        });
      }, 2500);
      return;
    }

    setLoading(true);

    try {
      // API 호출용 messages 배열 생성 (현재 대화 이력 포함)
      const messagesForAPI = [
        ...messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        newUserMessage,
      ];

      console.log("📤 메시지 전송:", {
        sessionId,
        interviewType,
        messagesCount: messagesForAPI.length,
        currentAnswerCount: newAnswerCount,
      });

      // API 호출
      const response = await api.post("/api/interview/chat/next", {
        sessionId: sessionId,
        interviewType: interviewType,
        messages: messagesForAPI,
      });

      console.log("📥 응답 받음:", response.data);

      // AI 응답 추가
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.data.response,
        },
      ]);
    }catch(err){
      console.error("❌ 메시지 전송 실패:", err);

      // 에러 메시지
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "메시지 전송에 실패했습니다. 다시 시도해주세요.",
        },
      ]);
    }finally{
      setLoading(false);
    }
  };

  // Enter 키 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 면접 종료
  const endInterview = () => {
    if (window.confirm("면접을 종료하시겠습니까?")) {
      navigate("/interview/result", {
        state: { sessionId, interviewType },
      });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <NavBar />

      {/* 헤더 */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border-b border-indigo-500/30 px-6 py-4 flex-shrink-0 mt-16">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                {interviewType === "cs" ? "CS 지식 면접" : "프로젝트 경험 면접"}
              </h1>
              <p className="text-sm text-indigo-200">
                AI 면접관과 대화 중... ({Math.min(answerCount, MAX_QUESTIONS)}/{MAX_QUESTIONS} 답변)
              </p>
            </div>
          </div>
          <button
            onClick={endInterview}
            className="px-4 py-2 bg-red-600/80 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            면접 종료
          </button>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="max-w-4xl mx-auto space-y-6 pb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-2xl px-6 py-4 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                    : msg.role === "error"
                    ? "bg-red-900/50 border border-red-500/50 text-red-200"
                    : "bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 text-white"
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {msg.content}
                </p>
              </div>

              {msg.role === "user" && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center ml-3">
                  <span className="text-white font-bold text-sm">나</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mr-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 rounded-2xl px-6 py-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}

          {/* 면접 완료 메시지 */}
          {answerCount > MAX_QUESTIONS && !loading && (
            <div className="flex justify-center">
              <div className="bg-green-900/50 border border-green-500/50 rounded-2xl px-6 py-4 text-center">
                <p className="text-green-200 text-base font-semibold mb-2">
                  🎉 면접이 완료되었습니다!
                </p>
                <p className="text-green-300 text-sm">
                  잠시 후 평가 페이지로 이동합니다...
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 px-4 py-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={answerCount > MAX_QUESTIONS ? "면접이 종료되었습니다..." : "답변을 입력하세요..."}
              disabled={loading || answerCount > MAX_QUESTIONS}
              rows="1"
              className="flex-1 bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: "48px", maxHeight: "120px" }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !inputMessage.trim() || answerCount > MAX_QUESTIONS}
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* 안내 메시지 */}
          <p className="text-xs text-slate-400 mt-2 text-center">
            {answerCount > MAX_QUESTIONS 
              ? "💡 면접이 완료되었습니다"
              : "💡 Enter로 전송 • Shift + Enter로 줄바꿈"
            }
          </p>
        </div>
      </div>
    </div>
  );
}

export default InterviewPage;