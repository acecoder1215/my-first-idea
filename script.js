document.addEventListener('DOMContentLoaded', () => {
  // 1. 필요한 DOM 요소 선택
  const card = document.getElementById('main-card'); // 3D 회전 효과가 적용될 유리 카드
  const h1 = document.getElementById('main-sentence'); // 격려 문구가 표시되는 텍스트 요소
  const btnNext = document.getElementById('btn-next'); // 문장을 넘기고 색상을 바꾸는 작동 단추

  // 2. 카드에 순환하며 표출될 격려/힐링 문구 배열 정의
  const sentences = [
    "오늘도 힘내세요!",
    "당신의 하루를 응원합니다.",
    "반짝이는 생각을 믿으세요.",
    "작은 걸음이 큰 변화를 만듭니다.",
    "당신은 생각보다 강합니다.",
    "오늘 하루도 수고 많았어요."
  ];

  // 3. 버튼 클릭 시 순환하며 적용될 4색(오렌지, 노랑, 초록, 파랑) 테마 데이터 구성
  // 각 테마는 버튼 배경색, 그림자(발광), 그리고 해당 버튼 색상에 동기화되는 파티클 입자들의 색상을 포함합니다.
  const buttonThemes = [
    {
      name: 'orange',
      bg: 'linear-gradient(135deg, #ffedd5 0%, #f97316 100%)',
      shadow: '0 8px 24px rgba(249, 115, 22, 0.35)',
      particles: ['#ea580c', '#f97316', '#fdba74', '#ffedd5'] // 오렌지 계열 입자 색상
    },
    {
      name: 'yellow',
      bg: 'linear-gradient(135deg, #fef9c3 0%, #ca8a04 100%)',
      shadow: '0 8px 24px rgba(202, 138, 4, 0.35)',
      particles: ['#ca8a04', '#eab308', '#fde047', '#fef9c3'] // 노란색 계열 입자 색상
    },
    {
      name: 'green',
      bg: 'linear-gradient(135deg, #dcfce7 0%, #16a34a 100%)',
      shadow: '0 8px 24px rgba(22, 163, 74, 0.35)',
      particles: ['#16a34a', '#22c55e', '#86efac', '#dcfce7'] // 초록색 계열 입자 색상
    },
    {
      name: 'blue',
      bg: 'linear-gradient(135deg, #dbeafe 0%, #2563eb 100%)',
      shadow: '0 8px 24px rgba(37, 99, 235, 0.35)',
      particles: ['#2563eb', '#3b82f6', '#93c5fd', '#dbeafe'] // 파란색 계열 입자 색상
    }
  ];

  // 현재 인덱스 상태 변수 선언
  let currentIdx = 0; // 문장 순환 인덱스
  let themeIdx = 0;   // 버튼 테마 순환 인덱스 (기본 오렌지로 시작)

  // 4. [다음 문장보기] 버튼 클릭 이벤트 리스너 등록
  btnNext.addEventListener('click', (e) => {
    // 4-1. 버튼 색상 테마 인덱스 증가 및 타겟 테마 추출
    themeIdx = (themeIdx + 1) % buttonThemes.length;
    const currentTheme = buttonThemes[themeIdx];
    
    // 4-2. 마우스 클릭 좌표(e.clientX, e.clientY)를 기반으로 해당 버튼 테마색 전용 파티클 생성
    createParticles(e.clientX, e.clientY, currentTheme.particles);

    // 4-3. 버튼의 스타일 속성을 획득한 테마 정보로 실시간 교체 (배경색 및 그림자 아우라)
    btnNext.style.background = currentTheme.bg;
    btnNext.style.boxShadow = currentTheme.shadow;
    
    // 4-4. 텍스트 페이드아웃 효과 적용: 투명도를 0으로, 크기를 95%로 줄여 축소 및 투명화 전환
    h1.style.opacity = '0';
    h1.style.transform = 'scale(0.95)';
    h1.style.transition = 'opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)';
    
    // 4-5. 페이드아웃 애니메이션 완료(250ms 대기) 후 문장을 변경하고 다시 페이드인 처리
    setTimeout(() => {
      currentIdx = (currentIdx + 1) % sentences.length;
      h1.textContent = sentences[currentIdx]; // 글자 정보 변경
      
      // 투명도를 1로 복원하고 100% 본래 크기로 부드럽게 확대
      h1.style.opacity = '1';
      h1.style.transform = 'scale(1)';
    }, 250);
  });

  // 5. 마우스의 3D 입체 기울기(3D Tilt) 트래킹 연산 로직 구현
  card.addEventListener('mousemove', (e) => {
    // 터치 기기 및 가로폭이 좁은 모바일 화면에서는 입체 효과를 배제하여 리소스 낭비 방지
    if (window.innerWidth < 768) {
      card.style.transform = '';
      return;
    }
    
    // 마우스가 카드 위를 움직일 때, 카드의 바운딩 사각형(rect)을 구함
    const rect = card.getBoundingClientRect();
    
    // 카드 안에서의 마우스 로컬 X, Y 상대 좌표 연산
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // 카드의 정중앙 좌표 계산
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // 중앙으로부터 마우스가 얼마나 떨어져 있는지에 비례하여 회전각 연산 (최대 8도 기울기 제한)
    const rotateX = ((y - centerY) / centerY) * 8; // X축 기준 기울기
    const rotateY = -((x - centerX) / centerX) * 8; // Y축 기준 기울기
    
    // 카드 스타일에 3D 원근법 perspective(1000px)과 함께 실시간 rotateX, rotateY 변환 적용
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  // 마우스가 카드를 벗어날 때, 기울기 변환을 부드럽게 원복 처리
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  });

  // 6. 다이내믹 파티클 스파크 생성 함수 정의
  function createParticles(x, y, activeColors) {
    const particleCount = 14; // 생성할 스파크 입자 수
    
    for (let i = 0; i < particleCount; i++) {
      // 6-1. 가상의 div 파티클 태그 생성 및 바디에 부착
      const particle = document.createElement('div');
      particle.className = 'particle';
      document.body.appendChild(particle);
      
      // 6-2. 스파크 입자의 가로세로 크기 난수 설정 (4px ~ 9px)
      const size = Math.random() * 5 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // 6-3. 전달받은 해당 버튼 테마색 배열 중 한 가지를 랜덤하게 골라 입자 배경색 지정
      particle.style.background = activeColors[Math.floor(Math.random() * activeColors.length)];
      
      // 6-4. 최초 생성 위치는 클릭한 마우스 커서의 좌표 지정
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      
      // 6-5. 원형 방향으로 사방으로 고르게 퍼져나갈 퍼짐 각도 및 거리 속도 계산
      const angle = Math.random() * Math.PI * 2; // 0 ~ 360도 무작위 각도
      const velocity = Math.random() * 70 + 40;  // 40px ~ 110px 무작위 퍼짐 거리
      const destinationX = Math.cos(angle) * velocity;
      const destinationY = Math.sin(angle) * velocity;
      
      // 6-6. 웹 브라우저 네이티브 Animation API(animate)를 사용해 가볍고 부드럽게 흩뿌려짐 연출
      particle.animate([
        // 최초 상태: 정중앙 정렬 상태, 투명도 100%
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        // 최종 상태: 지정된 방향으로 흩어지며 크기는 0으로 소멸, 투명도 0%
        { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
      ], {
        duration: Math.random() * 400 + 400, // 400ms ~ 800ms 무작위 수명 시간
        easing: 'cubic-bezier(0.1, 0.8, 0.3, 1)', // 미끄러지듯 서서히 감속하는 가속도 커브
        fill: 'forwards' // 애니메이션 종료 상태 유지
      }).onfinish = () => {
        // 6-7. 애니메이션이 끝나는 즉시 메모리 절약을 위해 DOM 트리에서 파티클 태그 삭제
        particle.remove();
      };
    }
  }
});
