import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from "../api";
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const companyMap = {
  "네이버": "naver",
  "카카오": "kakao",
  "라인": "line",
  "쿠팡": "coupang",
  "배민": "baemin"
};

const companies = ['네이버', '카카오', '라인', '쿠팡', '배민'];

const fetchInterviewReviews = async (companyName) => {
  const companyKey = companyMap[companyName] || companyName;

  const res = await api.get("/api/interview/reviews", {
    params: { company_name: companyKey }
  });

  return {
    ...res.data,
    company_name: companyName
  };
};

function InterviewReview() {
  const [selectedCompany, setSelectedCompany] = useState("네이버");
  const [reviewsData, setReviewsData] = useState(null);
  const [openReview, setOpenReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleReview = (index) => {
    setOpenReview(openReview === index ? null : index);
  };

  useEffect(() => {
    const loadReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchInterviewReviews(selectedCompany);
        setReviewsData(data);
      } catch (err) {
        setError(err.message || "데이터 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [selectedCompany]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <NavBar />
        <div className="flex justify-center items-center flex-1 text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-lg">불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !reviewsData) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <NavBar />
        <div className="flex flex-col justify-center items-center flex-1 text-red-600">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <p className="text-lg font-semibold mb-4">{error || "데이터를 불러올 수 없습니다."}</p>
            <button
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
              onClick={() => window.location.reload()}
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavBar />

      <div className="flex-1 p-4 md:p-8 pt-24 md:pt-28">
        <div className="max-w-5xl mx-auto space-y-10">

          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <BookOpen className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              {selectedCompany} 면접 리뷰
            </h1>

            <p className="text-lg text-gray-600">
              실제 지원자들이 작성한 면접 후기를 통해 준비해보세요.
            </p>
          </div>

          <div className="p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 flex flex-wrap justify-center gap-2">
            {companies.map((company) => (
              <button
                key={company}
                onClick={() => setSelectedCompany(company)}
                className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                  selectedCompany === company
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105"
                    : "text-gray-700 hover:bg-gray-200/70 hover:scale-105"
                }`}
              >
                {company}
              </button>
            ))}
          </div>

          {reviewsData.reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <button
                onClick={() => toggleReview(idx)}
                className="w-full text-left p-6 md:p-8 flex justify-between items-center hover:bg-gray-50"
              >
                <h2 className="text-2xl font-bold text-gray-800">
                  {idx + 1}번째 면접 후기
                </h2>

                {openReview === idx ? (
                  <ChevronUp className="w-6 h-6 text-gray-500" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-500" />
                )}
              </button>

              {openReview === idx && (
                <div className="px-6 md:px-8 pb-8 space-y-6">
                  {review.questions.map((q, qIdx) => (
                    <div key={qIdx} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Q. {q.question.replace(/^\d+\.\s*/, '')}
                      </h3>

                      {q.answer && (
                        <p className="text-gray-700 leading-relaxed ml-4">
                          <span className="font-semibold">A:</span> {q.answer}
                        </p>
                      )}

                      {/* 상세 Q&A 리스트 */}
                      {q.qna_pairs && (
                        <div className="ml-4 mt-3 space-y-3">
                          {q.qna_pairs.map((pair, pIdx) => (
                            <div
                              key={pIdx}
                              className="border-l-4 border-purple-500 pl-4 p-3 bg-purple-50 rounded-lg"
                            >
                              <p className="font-semibold text-gray-800 mb-1">
                                질문: {pair.question}
                              </p>
                              <p className="text-gray-700">답변: {pair.answer}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default InterviewReview;
