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

  // HTML 엔티티 디코더
  const decodeHTMLEntities = (text) => {
    if (!text) return "";
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
  };

  const [messages, setMessages] = useState(() => {
    if (!initialMessage) return [];
    return [{ role: "assistant", content: decodeHTMLEntities(initialMessage) }];
  });

  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [answerCount, setAnswerCount] = useState(0);
  const textareaRef = useRef(null);

  const MAX_QUESTIONS = 4;

  useEffect(() => {
    if (!sessionId) {
      navigate("/interview/start");
    }
  }, [sessionId, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "48px";
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 200;
      textarea.style.height = Math.min(scrollHeight, maxHeight) + "px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    // 줄바꿈 제거한 메시지
    const userMessage = inputMessage
      .trim()
      .replace(/\\n/g, " ")
      .replace(/\n/g, " ");

    setInputMessage("");

    const newUserMessage = {
      role: "user",
      content: userMessage,
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);

    const newAnswerCount = answerCount + 1;
    setAnswerCount(newAnswerCount);
    setLoading(true);

    try {
      const messagesForAPI = updatedMessages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const response = await api.post("/api/interview/chat/next", {
        sessionId: sessionId,
        interviewType: interviewType,
        messages: messagesForAPI,
      });

      // 최대 답변 수 도달 시
      if (newAnswerCount >= MAX_QUESTIONS) {
        navigate("/interview/result", {
          state: { sessionId, interviewType, messages: updatedMessages },
        });
        return;
      }

      // AI 응답 줄바꿈/엔티티 처리
      const cleanAIResponse = decodeHTMLEntities(
        response.data.response
          ?.replace(/\\n/g, " ")
          ?.replace(/\n/g, " ")
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: cleanAIResponse,
        },
      ]);
    } catch (err) {
      console.error("메시지 전송 실패:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "메시지 전송에 실패했습니다. 다시 시도해주세요.",
        },
      ]);
    } finally {
      if (newAnswerCount < MAX_QUESTIONS) {
        setLoading(false);
      }
    }
  };

  // Enter 전송
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endInterview = () => {
    if (window.confirm("면접을 종료하시겠습니까?")) {
      navigate("/interview/result", {
        state: { sessionId, interviewType, messages },
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
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
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
                  {decodeHTMLEntities(msg.content)}
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

          {answerCount >= MAX_QUESTIONS && !loading && (
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
              ref={textareaRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                answerCount >= MAX_QUESTIONS
                  ? "면접이 종료되었습니다..."
                  : "답변을 입력하세요..."
              }
              disabled={loading || answerCount >= MAX_QUESTIONS}
              className="flex-1 bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              style={{
                minHeight: "48px",
                maxHeight: "200px",
                height: "48px",
                overflow: "hidden",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={
                loading || !inputMessage.trim() || answerCount >= MAX_QUESTIONS
              }
              className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-700 disabled:to-slate-700 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-xs text-slate-400 mt-2 text-center">
            {answerCount >= MAX_QUESTIONS
              ? "💡 면접이 완료되었습니다"
              : "💡 Enter로 전송 • Shift + Enter로 줄바꿈"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
