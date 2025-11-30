import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import api from "../api";

function KeywordDetail() {
  const { name } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const decoded = decodeURIComponent(name);
  const keyword = state?.keyword || decoded;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeKeyword = encodeURIComponent(keyword);

    api
      .get(`/api/search?keyword=${safeKeyword}`)
      .then((res) => {
        setResults(res.data.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [keyword]);

  return (
    <div className="min-h-screen bg-gray-50 relative">

      <NavBar />

      <div className="home-bg-orbs">
        <div className="home-bg-orb home-bg-orb-1" />
        <div className="home-bg-orb home-bg-orb-2" />
        {/* <div className="home-bg-orb home-bg-orb-3" /> */}
      </div>

      <div className="pt-32 pb-20 px-6 max-w-5xl mx-auto relative z-10">
        
        <button
            className="mb-4 text-blue-600 font-semibold hover:underline"
            onClick={() => navigate("/study/interview/record")}
          >
            ← 뒤로가기
          </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
           “{keyword}” 관련 자료
        </h1>

        <p className="text-gray-600 mb-10 text-lg">
          인터넷 상의 신뢰도 높은 문서들을 기반으로 추천된 학습 자료입니다.
          <br />
          CS 개념 이해와 면접 대비에 도움이 되는 정보를 확인해보세요.
        </p>

        {loading && (
          <div className="text-center text-lg text-gray-700">불러오는 중...</div>
        )}

        <div className="space-y-6">
          {results.map((item, idx) => (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 rounded-2xl shadow-lg bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
            >
              {/* 제목 */}
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {item.title}
              </p>

              {/* 설명 */}
              <p className="text-gray-700 mt-2 leading-relaxed">
                {item.snippet}
              </p>

              {/* 이미지 썸네일 */}
              {item.pagemap?.cse_image?.[0]?.src && (
                <img
                  src={item.pagemap.cse_image[0].src}
                  alt="thumb"
                  className="mt-4 w-full max-w-sm rounded-xl shadow-sm border"
                />
              )}
            </a>
          ))}

          {!loading && results.length === 0 && (
            <div className="py-10 text-center text-gray-600">
              관련 자료를 찾을 수 없습니다.
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}

export default KeywordDetail;
