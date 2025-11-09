import React, { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import '../styles/MajorStudyPage.css';
import api from "../api";

// function Test() {

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         try {
//           const response = await api.get('/api/study/categories');
//           const data = response.data.data;
//           console.log(data);
//         } catch (err) {
//         } 
//       };
    
//       return (
//         <div className="flex items-center justify-center min-h-screen-minus-navbar bg-gray-100">
        
            
//             <button 
//               onClick={handleSubmit}
//             >
//               제출하기
//             </button>
            
//         </div>
//       );
//     }
//     export default Test; 

const MajorStudyPage = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [studyData, setStudyData] = useState({});
    const [categories, setCategories] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedChapter, setSelectedChapter] = useState("");
    const [expandedCategories, setExpandedCategories] = useState([]);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {

        const fetchStudyData = async () => {
            setLoading(true);
            setError(null);

            try{
                const response = await api.get('/api/study/categories'); // 카테고리 목록 조회
                
                console.log('=== response.data.data ===', response.data.data); // 받아온 데이터 확인

                if(response.data.success){

                    const categories = response.data.data.categories;

                    setCategories(categories);

                    console.log('=== categories 데이터 ===');
                    console.log(categories);

                    if (!categories || categories.length === 0) {
                        console.warn('⚠️ categories가 비어있습니다!');
                        setError('카테고리 데이터가 없습니다.');
                        return;
                    }

                    const transformedData = {};

                    categories.forEach(category => {
                        
                        const firstCategory = category.firstCategory;

                        console.log('🔄 처리 중인 category:', category);
                        console.log('  - firstCategory:', firstCategory);

                        transformedData[firstCategory] = {};

                        category.secondCategory.forEach(secondCat => {
                            console.log('    - secondCategory:', secondCat);
                            transformedData[firstCategory][secondCat] = [];
                        });
                    });

                    console.log('=== 변환된 studyData ===');
                    console.log(transformedData);

                    setStudyData(transformedData);

                    if(categories.length > 0){
                        const firstCategory = categories[0].firstCategory;
                        const firstChapter = categories[0].secondCategory[0];

                        console.log('🎯 초기 선택:', { firstCategory, firstChapter });

                        setSelectedCategory(firstCategory);
                        setSelectedChapter(firstChapter);
                        setExpandedCategories([firstCategory]);

                        console.log('📖 첫 챕터 내용 로드 시작...');

                        await fetchChapterContent(firstCategory, firstChapter);
                    }

                } else {
                    console.error('❌ API success가 false입니다');
                    setError('데이터를 불러오는데 실패했습니다.');
                }

            }catch(err){
                console.error('❌ 데이터 로딩 실패:', err);
                console.error('에러 상세:', err.message);
                console.error('에러 응답:', err.response);
                setError('학습 데이터를 불러오는데 실패했습니다.');
            }finally {
                setLoading(false);
                console.log('✅ 로딩 완료');
            }
        }

        fetchStudyData();

    }, []);

    const fetchChapterContent = async (category, chapter) => {
        try{
            console.log('📖 getBody API 호출:', { category, chapter });
            
            const requestBody = {
                firstCategory : category,
                secondCategory : chapter,
            };
            
            console.log('📤 요청 데이터:', requestBody);
            
            const response = await api.post('/api/study/getBody', requestBody); // ✅ 앞에 / 추가

            console.log('=== getBody 응답 ===');
            console.log(response.data);

            if (response.data.success){
                const contentData = response.data.data;

                console.log('=== contentData ===');
                console.log(contentData);

                const content = {
                    id: Date.now(),
                    title: contentData.title,
                    body: contentData.body
                };

                console.log('✅ 생성된 content:', content);

                setStudyData(prev => {
                    const updated = {
                        ...prev,
                        [category]: {
                            ...prev[category],
                            [chapter]: [content]
                        }
                    };
                    console.log('📝 업데이트된 studyData:', updated);
                    return updated;
                });
                
                console.log('✅ 챕터 내용 로드 완료');
            } else {
                console.error('❌ getBody API success가 false');
            }
        }catch (err){
            console.error('❌ 챕터 내용 로딩 실패:', err);
            console.error('에러 상세:', err.message);
            console.error('에러 응답:', err.response);
        }
    }

    // 카테고리 토글
    const toggleCategory = (category) => {
        setExpandedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    // 챕터 선택
    const handleChapterSelect = async (category, chapter) => {
        console.log('🖱️ 챕터 선택됨:', { category, chapter });
        
        setSelectedCategory(category);
        setSelectedChapter(chapter);
        
        // ✅ 챕터 선택 시 내용 로드
        console.log('📖 챕터 내용 로딩 시작...');
        await fetchChapterContent(category, chapter);
        
        if (window.innerWidth <= 768) {
            setSidebarOpen(false);
        }
    };

    // 사이드바 토글
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    // 사이드바 닫기
    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // 현재 선택된 컨텐츠
    const currentContents = studyData[selectedCategory]?.[selectedChapter] || [];

    // 사이드바 열릴 때 body 스크롤 방지
    useEffect(() => {
        if (sidebarOpen && window.innerWidth <= 768) {
            document.body.classList.add('no-scroll');
        } else {
            document.body.classList.remove('no-scroll');
        }

        return () => {
            document.body.classList.remove('no-scroll');
        };
    }, [sidebarOpen]);

    if (loading){
        return(
            <div className="major-study-page">
                <div>
                {/*<NavBar />*/}    
                </div>
                <div className="major-loading">
                    <div className="loading-spinner"></div>
                    <p>학습 데이터를 불러오는 중입니다...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="major-study-page">
                {/*<NavBar />*/}  
                <div className="major-error">
                    <div className="error-icon">⚠️</div>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="major-study-page">
            <div>
                <NavBar />  
            </div>
            
            {/* 모바일 오버레이 */}
            <div
                className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`}
                onClick={closeSidebar}
            ></div>

            {/* 모바일 햄버거 메뉴 버튼 */}
            <button
                className="mobile-menu-toggle"
                onClick={toggleSidebar}
            >
                <svg width="24" height="24" viewBox="0 0 24 24">
                    <path
                        d={sidebarOpen
                            ? "M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
                            : "M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"
                        }
                        fill="currentColor"
                    />
                </svg>
            </button>

            <div className="major-study-container">
                <div className="major-study-content">
                    {/* 데스크톱 사이드바 */}
                    <aside className="major-sidebar-wrapper desktop-only">
                        <Sidebar
                            studyData={studyData}
                            selectedCategory={selectedCategory}
                            selectedChapter={selectedChapter}
                            expandedCategories={expandedCategories}
                            onCategoryToggle={toggleCategory}
                            onChapterSelect={handleChapterSelect}
                        />
                    </aside>

                    {/* 모바일 사이드바 */}
                    <aside className={`major-sidebar-wrapper mobile-only ${sidebarOpen ? 'show' : ''}`}>
                        <Sidebar
                            studyData={studyData}
                            selectedCategory={selectedCategory}
                            selectedChapter={selectedChapter}
                            expandedCategories={expandedCategories}
                            onCategoryToggle={toggleCategory}
                            onChapterSelect={handleChapterSelect}
                        />
                    </aside>

                    {/* 컨텐츠 영역 */}
                    <ContentArea
                        contents={currentContents}
                        chapterTitle={selectedChapter}
                    />
                </div>
            </div>
        </div>
    );
};

// 사이드바
const Sidebar = ({
    studyData,
    selectedCategory,
    selectedChapter,
    expandedCategories,
    onCategoryToggle,
    onChapterSelect
}) => {
    return (
        <div className="major-sidebar">
            {Object.keys(studyData).map(category => {
                const isExpanded = expandedCategories.includes(category);
                const chapters = Object.keys(studyData[category]);

                return (
                    <div key={category} className="major-category">
                        <div
                            className={`major-category-title ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => onCategoryToggle(category)}
                        >
                            {category}
                            <span className={`major-category-icon ${isExpanded ? 'rotated' : ''}`}>
                                ▼
                            </span>
                        </div>
                        <ul className={`major-chapter-list ${isExpanded ? 'show' : ''}`}>
                            {chapters.map(chapter => (
                                <li
                                    key={chapter}
                                    className={`major-chapter-item ${
                                        selectedCategory === category && selectedChapter === chapter
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() => onChapterSelect(category, chapter)}
                                >
                                    {chapter}
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
};

// 컨텐츠 영역 컴포넌트
const ContentArea = ({ contents, chapterTitle }) => {
    if (contents.length === 0) {
        return (
            <div className="major-content-area">
                <div className="major-placeholder-message">
                    <div className="major-placeholder-icon">📚</div>
                    <p>왼쪽 사이드바에서 학습하고 싶은 챕터를 선택해주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="major-content-area">
            {contents.map(content => (
                <div key={content.id} className="major-content-section">
                    <h2 className="major-content-title">{content.title}</h2>
                    <div
                        className="major-content-body"
                        dangerouslySetInnerHTML={{ __html: content.body }}
                    />
                </div>
            ))}
        </div>
    );
};

export default MajorStudyPage;