import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import NavBar from '../components/NavBar';
import { Menu, X, BookOpen } from 'lucide-react';
import api from "../api"; 

const MajorStudyPage = () => {
  const [categories, setCategories] = useState([]); // 전체 카테고리
  const [selectedFirst, setSelectedFirst] = useState(""); // 선택된 1차 카테고리
  const [selectedSecond, setSelectedSecond] = useState(""); // 선택된 2차 카테고리
  const [contents, setContents] = useState([]); // 본문 데이터
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false); // 모바일 사이드바 토글

  /** 카테고리 목록 불러오기 */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await api.get("/api/study/categories");
        if (res.data.success) {
          const cats = res.data.data.categories;
          setCategories(cats);
        } else {
          setError("카테고리 데이터를 불러올 수 없습니다.");
        }
      } catch (err) {
        console.error(err);
        setError("카테고리 요청 실패");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  /** 특정 챕터 내용 불러오기 */
  const fetchContent = async (first, second) => {
    try {
      setLoading(true);
      setSelectedFirst(first);
      setSelectedSecond(second);
      setError("");
      setSidebarOpen(false); // 모바일에서 선택 후 사이드바 닫기

      const res = await api.post("/api/study/contents", {
        firstCategory: first,
        secondCategory: second,
      });

      if (res.data.success) {
        setContents(res.data.data.contents || []);
      } else {
        setError("컨텐츠를 불러올 수 없습니다.");
        setContents([]);
      }
    } catch (err) {
      console.error(err);
      setError("컨텐츠 요청 실패");
      setContents([]);
    } finally {
      setLoading(false);
    }
  };

  /** 로딩 중 */
  if (loading && categories.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex justify-center items-center flex-1 pt-16 text-gray-600">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mr-3"></div>
          <p className="text-lg">불러오는 중...</p>
        </div>
      </div>
    );
  }

  /** 에러 화면 */
  if (error && categories.length === 0) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <div className="flex flex-col justify-center items-center flex-1 pt-16 text-red-600">
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

  /** 메인 화면 */
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <NavBar />  
      
      {/* 모바일 사이드바 토글 버튼 */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-40 p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* 모바일 오버레이 */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 pt-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 pt-16">
        {/* 사이드바 */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 pt-16 lg:pt-0
          w-80 bg-white border-r border-gray-200 shadow-xl lg:shadow-none
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full flex flex-col">
            {/* 사이드바 헤더 */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg text-gray-800">학습 카테고리</h2>
                  <p className="text-sm text-gray-600">CS 전공지식</p>
                </div>
              </div>
            </div>

            {/* 카테고리 목록 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {categories.map((cat) => (
                <div key={cat.firstCategory} className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></div>
                    <span className="font-bold text-gray-800 text-sm">
                      {cat.firstCategory}
                    </span>
                  </div>
                  <ul className="ml-4 space-y-1">
                    {cat.secondCategory.map((sec) => (
                      <li
                        key={sec}
                        onClick={() => fetchContent(cat.firstCategory, sec)}
                        className={`
                          cursor-pointer px-4 py-2.5 rounded-lg text-sm font-medium
                          transition-all duration-200 transform hover:scale-105
                          ${
                            selectedFirst === cat.firstCategory &&
                            selectedSecond === sec
                              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                              : "hover:bg-blue-50 text-gray-700 hover:text-blue-600"
                          }
                        `}
                      >
                        {sec}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* 본문 영역 */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {loading && contents.length === 0 ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600 mr-3"></div>
                <p className="text-gray-600">내용을 불러오는 중...</p>
              </div>
            ) : !selectedSecond ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">학습 시작하기</h3>
                  <p className="text-gray-600">
                    왼쪽 사이드바에서 학습하고 싶은<br />카테고리를 선택해주세요
                  </p>
                  <button
                    onClick={() => setSidebarOpen(true)}
                    className="lg:hidden mt-4 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  >
                    카테고리 보기
                  </button>
                </div>
              </div>
            ) : contents.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-md">
                  <p className="text-gray-600">표시할 내용이 없습니다.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 헤더 */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                      {selectedFirst}
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {selectedSecond}
                  </h1>
                </div>

                {/* 컨텐츠 카드들 */}
                {contents.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group"
                  >
                    <div className="p-6 md:p-8">
                      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b border-gray-200 pb-4 group-hover:text-blue-600 transition-colors duration-200">
                        {item.title}
                      </h2>
                      <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
                        <ReactMarkdown
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-gray-900" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-5 mb-3 text-gray-900" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-900" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 text-gray-700 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="mb-4 ml-6 list-disc space-y-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="mb-4 ml-6 list-decimal space-y-2" {...props} />,
                            li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                            code: ({node, inline, ...props}) => 
                              inline 
                                ? <code className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm font-mono" {...props} />
                                : <code className="block p-4 bg-gray-50 rounded-lg text-sm font-mono overflow-x-auto" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic bg-blue-50 rounded-r" {...props} />,
                          }}
                        >
                          {item.body}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MajorStudyPage;