import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import './App.css';

// 헤더 컴포넌트 - 모든 페이지에서 공통으로 사용되는 헤더와 네비게이션 바 정의
function Header({ title }) {
  return (
    <header className="app-header">
      <div className="top-logo">{title ? <h1>{title}</h1> : <Link to="/"><h1>HELPER</h1></Link>}</div>
      <nav className="top-nav">
        <Link to="/" className="nav-link">홈</Link>
        <Link to="/map" className="nav-link">약국 찾기</Link>
      </nav>
    </header>
  );
}

// 홈 컴포넌트 - 증상별 카드를 선택할 수 있는 메인 페이지
function Home() {
  return (
    <div>
      <Header />
      {/* 메인 비주얼 섹션 - 서비스에 대한 간단한 소개 */}
      <section className="main-visual">
        <div className="txt-area">
          <p className="stxt">약품 복용을 도와주는</p>
          <p className="btxt"><span><b>HELP</b>ER</span>와 함께하세요</p>
          <div className="txt">
            몸에 이상신호나 증상이 나타나는 환자분들을 위해 준비했습니다. 약국 찾기와 상비약 정보로 약 복용을 도와드리겠습니다.
          </div>
        </div>
      </section>
      {/* 증상 리스트 섹션 - 각 증상을 선택할 수 있는 카드 형태의 링크들 */}
      <div className="symptom-list">
        {['두통', '소화불량', '근육통', '감기', '테스트1', '테스트2', '테스트3', '테스트4'].map((symptom, index) => (
          <Link key={index} to={`/medicines/${symptom}`} className="symptom-card">
            <p>{symptom}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 약품 리스트 컴포넌트 - 선택한 증상에 대한 약품 리스트를 보여줌
function MedicineList() {
  const { symptom } = useParams();
  const title = symptom ? `${symptom}에 대한 약품 리스트` : '약품 리스트';
  const medicines = {
    두통: ['타이레놀', '게보린', '이지엔6'],
    소화불량: ['베아제', '훼스탈', '겔포스'],
    근육통: ['마이프로펜', '파스', '근육이완제'],
    감기: ['판콜에이', '콜대원', '화이투벤']
  };

  return (
    <div>
      <Header title={title} />
      <h2>{symptom}에 대한 약품 리스트</h2>
      <ul>
        {/* 선택한 증상에 해당하는 약품들을 리스트로 표시 */}
        {(medicines[symptom] || []).map((medicine, index) => (
          <li key={index}>
            <Link to={`/medicine-detail/${medicine}`}>{medicine}</Link>
          </li>
        ))}
      </ul>
      <Link to="/">홈으로</Link>
    </div>
  );
}

// 약품 상세 정보 컴포넌트 - 선택한 약품의 상세 정보를 보여줌
function MedicineDetail() {
  const { medicine } = useParams();
  const title = medicine ? `${medicine} 상세 정보` : '약품 상세 정보';
  const medicineDetails = {
    타이레놀: '타이레놀은 두통에 효과가 있는 일반 의약품입니다.',
    게보린: '게보린은 빠른 두통 완화에 효과적입니다.',
    이지엔6: '이지엔6는 두통과 생리통 완화에 도움을 줍니다.',
    베아제: '베아제는 소화불량에 효과가 있는 소화제입니다.',
    훼스탈: '훼스탈은 소화를 도와주는 약품입니다.',
    겔포스: '겔포스는 속쓰림과 소화불량 완화에 도움을 줍니다.',
    마이프로펜: '마이프로펜은 근육통 완화에 효과적인 진통제입니다.',
    파스: '파스는 근육통 완화에 사용되는 외용 약품입니다.',
    근육이완제: '근육이완제는 근육통 및 긴장 완화에 도움을 줍니다.',
    판콜에이: '판콜에이는 감기 증상 완화에 도움을 주는 약품입니다.',
    콜대원: '콜대원은 감기와 기침 증상 완화에 효과적입니다.',
    화이투벤: '화이투벤은 감기 증상 완화에 도움이 되는 약품입니다.'
  };

  return (
    <div>
      <Header title={title} />
      <h2>{medicine} 상세 정보</h2>
      {/* 선택한 약품에 대한 상세 정보를 표시 */}
      <p>{medicineDetails[medicine] || '정보 없음'}</p>
      <Link to="/map">인근 약국 보기</Link>
      <Link to="/">홈으로</Link>
    </div>
  );
}

// 약국 위치 정보 지도 컴포넌트 - 인근 약국 위치를 보여줌
function Map() {
  useEffect(() => {
    const loadKakaoMap = () => {
      // 카카오 맵 API 스크립트를 동적으로 추가
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&libraries=services,clusterer,drawing`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        // 스크립트 로드 후, 카카오 맵을 초기화하고 마커를 설정
        const kakao = window.kakao;
        const container = document.getElementById('map');
        const options = {
          center: new kakao.maps.LatLng(33.450701, 126.570667),
          level: 3
        };
        const map = new kakao.maps.Map(container, options);

        // 마커 예시 - 특정 위치에 마커를 표시
        const markerPosition = new kakao.maps.LatLng(33.450701, 126.570667);
        const marker = new kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
      };
    };
    loadKakaoMap();
  }, []);

  return (
    <div>
      <Header title="인근 약국 위치" />
      <h2>인근 약국 위치</h2>
      {/* 지도를 표시할 div 요소 */}
      <div id="map"></div>
      <Link to="/">홈으로</Link>
    </div>
  );
}

// 전체 앱 라우터 설정
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/medicines/:symptom" element={<MedicineList />} />
        <Route path="/medicine-detail/:medicine" element={<MedicineDetail />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  );
}

export default App;
