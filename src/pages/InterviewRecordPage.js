import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import api from '../api';
import NavBar from '../components/NavBar';

function InterviewRecordPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    api.post(
      "/api/interview/chat/record",
      {},
      {
        headers: {
          Authorization: token.startsWith("Bearer ") ? token : `Bearer ${token}`
        }
      }
    )
    .then(res => {
      console.log("Record Result:", res.data);
      setRecords(res.data.data);
    })
    .catch(err => {
      console.error("Error:", err);
    });
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleString("ko-KR");
  };

  const parseMessages = (messages) => {
    try {
      return JSON.parse(messages);
    } catch (e) {
      return [];
    }
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 p-6 pt-28 max-w-3xl mx-auto">

        {/* 🔙 뒤로가기 버튼 */}
        <button
          className="mb-4 text-blue-600 font-semibold hover:underline"
          onClick={() => navigate(-1)}
        >
          ← 프로필로 가기
        </button>

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
           나의 면접 기록
        </h1>

        <div className="space-y-6">

          {records?.length === 0 && (
            <div className="text-center text-gray-500">면접 기록이 없습니다.</div>
          )}

          {records?.map(record => {
            const messages = parseMessages(record.messages);
            const firstQuestion = messages[0]?.content?.slice(0, 50) + "...";

            return (
              <div 
                key={record.id}
                className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer"
                onClick={() => navigate(`/study/interview/record/${record.id}`, { state: record })}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-700">
                    {record.interviewType} 모의면접
                  </h2>
                  <span className="text-sm text-gray-500">
                    {formatDate(record.createdAt)}
                  </span>
                </div>

                <div className="mt-3 text-gray-600 text-sm">
                  <strong>첫 질문:</strong> {firstQuestion}
                </div>

                <div className="mt-2 text-sm">
                  <strong>총점:</strong> 
                  <span className="ml-1 font-bold text-blue-600">{record.overallScore}</span> / 100
                </div>

                <div className="mt-2 bg-gray-50 p-3 rounded-lg text-gray-700 text-sm line-clamp-3">
                  <strong>총평:</strong> {record.overallFeedback}
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
}

export default InterviewRecordPage;
