import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, ChevronDown } from 'lucide-react';
import NavBar from '../components/NavBar';
import api from "../api"; 

const companyMap = {
  "네이버": "naver",
  "카카오": "kakao",
  "라인": "line",
  "쿠팡": "coupang",
  "배민": "baemin"
};

const fetchInterviewReviews = async (companyName) => {
  const companyKey = companyMap[companyName] || companyName;

  const res = await api.get("/api/interview/reviews", {
    params: {
      company_name: companyKey
    }
  });

  return {
    ...res.data,
    company_name: companyName
  };
};

function InterviewReview({ companyName = '네이버' }) {
  const [reviewsData, setReviewsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(companyName);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [openReview, setOpenReview] = useState(null);

  const toggleReview = (index) => {
    setOpenReview(openReview === index ? null : index);
  };

  const companies = ['네이버', '카카오', '라인', '쿠팡', '배민'];

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchInterviewReviews(selectedCompany);
        setReviewsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [selectedCompany]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex justify-center items-center flex-1 text-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-lg">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col justify-center items-center flex-1 text-red-600">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <p className="text-lg font-semibold mb-4">{error}</p>
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex items-center justify-center flex-1">
          <div className="text-lg text-gray-600">현재 면접 리뷰가 없습니다.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* 모바일 토글 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* 오버레이 */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
        <NavBar />


      <div className="flex flex-1">

        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40
            padding-top: 64px = pt-16     
            w-72 bg-white border-r border-gray-200 shadow-xl lg:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <div className="h-full flex flex-col">

            {/* 사이드바 헤더 */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">면접 리뷰</h2>
                  <p className="text-sm text-gray-600">회사 선택</p>
                </div>
              </div>
            </div>

            {/* 회사 카테고리 목록 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {companies.map((company) => (
                <button
                  key={company}
                  onClick={() => setSelectedCompany(company)}
                  className={`
                    w-full text-left px-4 py-3 rounded-lg text-sm font-medium
                    transition-all duration-200 transform hover:scale-[1.02]
                    ${
                      selectedCompany === company
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                        : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                    }
                  `}
                >
                  {company}
                </button>
              ))}
            </div>

          </div>
        </aside>

        {/* 본문 */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto pt-28 mt-10">
          <div className="max-w-5xl mx-auto space-y-6">

    

            {/* 카운트 */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-800">
                {reviewsData.company_name} 면접 리뷰 ({reviewsData.total_reviews}건)
              </h2>
            </div>

            {/* 리뷰 카드 */}
            {reviewsData.reviews.map((review, reviewIndex) => (
              <div
                key={reviewIndex}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <button
                  onClick={() => toggleReview(reviewIndex)}
                  className="w-full text-left p-6 md:p-8 flex justify-between items-center hover:bg-gray-50"
                >
                  <h2 className="text-2xl font-bold text-gray-800">
                    {reviewIndex + 1}번째 면접 후기
                  </h2>

                  <span
                    className="text-gray-500 text-xl transition-transform duration-200"
                    style={{
                      transform: openReview === reviewIndex ? "rotate(90deg)" : "rotate(0deg)"
                    }}
                  >
                    ▶
                  </span>
                </button>

                {/* 내용 */}
                {openReview === reviewIndex && (
                  <div className="px-6 md:px-8 pb-8">
                    <div className="space-y-6">
                      {review.questions.map((q, questionIndex) => (
                        <div key={questionIndex} className="border-l-4 border-blue-500 pl-4">
                          
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Q. {q.question.replace(/^\d+\.\s*/, '')}
                          </h3>

                          {q.answer && (
                            <p className="mb-4 text-gray-700 leading-relaxed ml-4">
                              <span className="font-semibold text-gray-900">A:</span> {q.answer}
                            </p>
                          )}

                          {q.qna_pairs?.length > 0 && (
                            <div className="ml-4 space-y-3">
                              {q.qna_pairs.map((pair, pairIndex) => (
                                <div
                                  key={pairIndex}
                                  className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 rounded-r"
                                >
                                  <p className="text-gray-800 mb-2">
                                    <span className="font-semibold">질문:</span> {pair.question}
                                  </p>
                                  <p className="text-gray-700">
                                    <span className="font-semibold">답변:</span> {pair.answer}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

          </div>
        </main>
      </div>
    </div>
  );
}

export default InterviewReview;
