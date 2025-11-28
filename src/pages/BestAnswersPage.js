import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import api from '../api';
import { Star, BookCopy, Tag, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

const CATEGORIES = ["전체", "운영체제", "컴퓨터 구조", "자료구조", "데이터베이스", "네트워크", "소프트웨어 공학"];

const BestAnswersPage = () => {
  const [qnaData, setQnaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [viewMode, setViewMode] = useState("spoiler"); 
  const [expandedItems, setExpandedItems] = useState({});

  const ITEMS_PER_PAGE = 4;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBestAnswers = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/interview/community/best-qna');
        if (response.data && response.data.success) {
          setQnaData(response.data.data.bestQnas);
        } else {
          setError('데이터를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        console.error("Failed to fetch best answers:", err);
        setError('서버와 통신 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchBestAnswers();
  }, []);

  const filteredData =
    selectedCategory === "전체"
      ? qnaData
      : qnaData.filter(item => item.category === selectedCategory);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const toggleExpand = (index) => {
    setExpandedItems(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <NavBar />
        <div className="flex items-center justify-center flex-1 p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 font-medium">우수 답변을 불러오는 중...</p>
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
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* 헤더 */}
          <div className="text-center">
            <div className="inline-block p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <Star className="w-10 h-10 text-white fill-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              우수 면접 답변
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              다른 사용자들의 우수한 답변을 통해 학습하고 면접에 대비하세요.
            </p>
            
            {/* 뷰 모드 토글 */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-white rounded-xl shadow-md border border-gray-200">
              <button
                onClick={() => setViewMode("spoiler")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  viewMode === "spoiler"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <EyeOff className="w-4 h-4" />
                스포 방지
              </button>
              <button
                onClick={() => setViewMode("full")}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  viewMode === "full"
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Eye className="w-4 h-4" />
                전체 보기
              </button>
            </div>
          </div>

          {/* 카테고리 탭 */}
          <div className="p-2 bg-white/70 backdrop-blur-sm rounded-xl shadow-md border border-gray-200 flex flex-wrap justify-center gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-gray-200/70 hover:scale-105'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Q&A 목록 */}
          <div className="space-y-5">
            {paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6 md:p-8">
                    {/* 질문 헤더 */}
                    <div className="flex items-start justify-between gap-4 mb-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-xs font-bold rounded-full border border-blue-200 whitespace-nowrap">
                            <Tag className="w-3.5 h-3.5" />
                            {item.category}
                          </div>
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight">
                          Q. {item.question}
                        </h2>
                      </div>
                    </div>

                    {/* 답변 영역 */}
                    {viewMode === "spoiler" ? (
                      <div>
                        {!expandedItems[index] ? (
                          <button
                            onClick={() => toggleExpand(index)}
                            className="w-full p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-dashed border-blue-300 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-200 group"
                          >
                            <div className="flex items-center justify-center gap-3 text-blue-600">
                              <Eye className="w-5 h-5 group-hover:scale-110 transition-transform" />
                              <span className="font-bold text-base">답변 확인하기</span>
                              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">먼저 스스로 답변을 생각해보세요</p>
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
                              <div className="flex items-center gap-2 mb-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm font-bold text-blue-700">우수 답변</span>
                              </div>
                              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                            </div>
                            <button
                              onClick={() => toggleExpand(index)}
                              className="w-full p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 text-gray-600 font-semibold text-sm"
                            >
                              <ChevronUp className="w-4 h-4" />
                              답변 숨기기
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-5 bg-gradient-to-br from-gray-50 to-blue-50 border-l-4 border-blue-500 rounded-lg shadow-sm">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-sm font-bold text-blue-700">우수 답변</span>
                        </div>
                        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{item.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl shadow-md border border-gray-200">
                <BookCopy className="w-20 h-20 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg font-medium">해당 카테고리에는 아직 우수 답변이 없습니다.</p>
              </div>
            )}
          </div>

          {/* paging */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2 flex-wrap">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`
                    px-4 py-2 rounded-lg font-semibold text-sm border 
                    transition-all duration-200
                    ${
                      currentPage === page
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }
                  `}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BestAnswersPage;
