import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import api from '../api';
import NavBar from '../components/NavBar';
import Footer from "../components/Footer";

function InterviewRecordPage() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // 한 페이지에 들어갈 항목 수

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
      
      const sortedRecords = res.data.data.sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setRecords(sortedRecords);
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

  // 페이징 계산
  const totalPages = Math.ceil(records.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRecords = records.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-gray-100 p-6 pt-28 max-w-3xl mx-auto">

        <button
          className="mb-4 text-blue-600 font-semibold hover:underline"
          onClick={() => navigate("/profile")}
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

          {currentRecords?.map(record => {
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

                <div className="mt-2 bg-gray-50 p-3 rounded-lg text-gray-700 text-sm">
                  <strong>총평:</strong> {record.overallFeedback}
                </div>
              </div>
            );
          })}

        </div>

        {/* 페이징 버튼 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8 mb-6">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              이전
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded-lg transition ${
                  currentPage === page
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              다음
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default InterviewRecordPage;