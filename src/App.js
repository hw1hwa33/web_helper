import React, { useState, useEffect } from 'react'; // useState와 useEffect도 여기서 한번에 가져옵니다.
import { BrowserRouter as Router, Route, Routes, Link, useParams } from 'react-router-dom';
import './App.css';

// 헤더 컴포넌트 - 모든 페이지에서 공통으로 사용되는 헤더와 네비게이션 바 정의
function Header({ title }) {
  return (
    <header className="app-header">
       <div className="top-logo">
        {title ? <h1>{title}</h1> : <Link to="/">
          <img src="/src/ic_helperlogo.svg" className="logo-image" />
        </Link>}
      </div>
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
      <div className="symptom-list" style={{ padding: '0 40px' }}>
        {['두통', '소화불량', '근육통', '감기', '테스트1', '테스트2'].map((symptom, index) => (
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
  const [medicines, setMedicines] = useState([]);
  const title = symptom ? `${symptom}에 대한 약품 리스트` : '약품 리스트';

  useEffect(() => {
    fetch(`http://localhost:8080/api/medicines/${symptom}`)
      .then(response => response.json())
      .then(data => setMedicines(data))
      .catch(error => console.error('Error fetching medicines:', error));
  }, [symptom]);

  return (
    <div>
      <section className="main-visual">
        <h2>{title}</h2>
      </section>
      <div className="medicine-list">
        {medicines.map((medicine, index) => (
          <Link key={index} to={`/medicine-detail/${medicine}`} className="medicine-card">
            <p>{medicine}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

// 약품 상세 정보 컴포넌트 - 선택한 약품의 상세 정보를 보여줌
function MedicineDetail() {
  const { medicine } = useParams();
  const [detail, setDetail] = useState('');
  const title = medicine ? `${medicine} 상세 정보` : '약품 상세 정보';

  useEffect(() => {
    fetch(`http://localhost:8080/api/medicine-detail/${medicine}`)
      .then(response => response.json())
      .then(data => setDetail(data.detail))
      .catch(error => console.error('Error fetching medicine detail:', error));
  }, [medicine]);

  return (
    <div>
      <section className="main-visual">
        <h2>{title}</h2>
      </section>
  
      <div className="medicine-detail" style={{ position: 'relative' }}>
        <p className="medicine-info">{detail || '정보 없음'}</p>
        <Link to="/map" className="medicine-button" style={{ position: 'absolute', right: '20px', bottom: '20px' }}>인근 약국 보기</Link>
      </div>
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
      <h2>인근 약국 위치</h2>
      {/* 지도를 표시할 div 요소 */}
      <div id="map"></div>
    </div>
  );
}

// 전체 앱 라우터 설정
function App() {
  return (
    <Router>
      <div>
        <Header /> {/* 모든 페이지에서 공통으로 사용하는 헤더 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicines/:symptom" element={<MedicineList />} />
          <Route path="/medicine-detail/:medicine" element={<MedicineDetail />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
