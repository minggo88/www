// 4구역 위치 제어 함수 및 전체화면 고정 위치 계산 포함
const CONFIG = {
  setZonePositionPx: (zoneNumber, top, left, right, bottom) => {
    const zone = document.querySelector(`.zone-${zoneNumber}`);
    if (!zone) return;
    zone.style.top = top !== undefined ? top + 'px' : '';
    zone.style.left = left !== undefined ? left + 'px' : '';
    zone.style.right = right !== undefined ? right + 'px' : '';
    zone.style.bottom = bottom !== undefined ? bottom + 'px' : '';
  },
  setZonePositionPercent: (zoneNumber, top, left, right, bottom) => {
    const zone = document.querySelector(`.zone-${zoneNumber}`);
    if (!zone) return;
    const oldTop = zone.style.top;
    const oldLeft = zone.style.left;
    const oldRight = zone.style.right;
    const oldBottom = zone.style.bottom;
    
    zone.style.top = top !== undefined ? top + '%' : '';
    zone.style.left = left !== undefined ? left + '%' : '';
    zone.style.right = right !== undefined ? right + '%' : '';
    zone.style.bottom = bottom !== undefined ? bottom + '%' : '';
    
    const newTop = zone.style.top;
    const newLeft = zone.style.left;
    const newRight = zone.style.right;
    const newBottom = zone.style.bottom;
    
    if (oldTop !== newTop || oldLeft !== newLeft || oldRight !== newRight || oldBottom !== newBottom) {
      console.log(`Zone ${zoneNumber} position changed:`, {
        top: `${oldTop} → ${newTop}`,
        left: `${oldLeft} → ${newLeft}`,
        right: `${oldRight} → ${newRight}`,
        bottom: `${oldBottom} → ${newBottom}`
      });
      
      // Zone 위치 변경 시 adjustForOrientation 실행
      setTimeout(() => {
        safeAdjustForOrientation();
      }, 10);
    }
  },
  setZoneFontSize: (zoneNumber, fontSize, unit = 'px') => {
    const zone = document.querySelector(`.zone-${zoneNumber}`);
    if (zone) {
      const oldFontSize = zone.style.fontSize;
      zone.style.fontSize = fontSize + unit;
      const newFontSize = zone.style.fontSize;
      
      if (oldFontSize !== newFontSize) {
        console.log(`Zone ${zoneNumber} font size changed:`, {
          fontSize: `${oldFontSize} → ${newFontSize}`
        });
        
        // Zone 폰트 크기 변경 시 adjustForOrientation 실행
        setTimeout(() => {
          safeAdjustForOrientation();
        }, 10);
      }
    }
  },
  adjustForOrientation: () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // 모바일 감지 (화면 너비가 600px 이하)
    const isMobile = window.innerWidth <= 600;
    
    console.log('Adjusting for orientation:', {
      isLandscape: isLandscape,
      isMobile: isMobile,
      width: window.innerWidth,
      height: window.innerHeight
    });
    
    if (isMobile) {
      // 1: 모바일(세로/가로)
      if (isLandscape) {
        console.log('1-2'); // 모바일 가로
        CONFIG.setZonePositionPercent(1, 8, 10, undefined, undefined);
        CONFIG.setZoneFontSize(1, 24);
        CONFIG.setZonePositionPercent(2, 8, 95, undefined, undefined);
        CONFIG.setZoneFontSize(2, 24);
        CONFIG.setZonePositionPercent(3, undefined, 10, undefined, 12);
        CONFIG.setZoneFontSize(3, 24);
        CONFIG.setZonePositionPercent(4, undefined, 95, undefined, 12);
        CONFIG.setZoneFontSize(4, 24);
      } else {
        console.log('1-4'); // 모바일 세로
        CONFIG.setZonePositionPercent(1, 25, 15, undefined, undefined);
        CONFIG.setZoneFontSize(1, 24);
        CONFIG.setZonePositionPercent(2, 25, 95, undefined, undefined);
        CONFIG.setZoneFontSize(2, 24);
        CONFIG.setZonePositionPercent(3, undefined, 5, undefined, 25);
        CONFIG.setZoneFontSize(3, 24);
        CONFIG.setZonePositionPercent(4, undefined, 95, undefined, 25);
        CONFIG.setZoneFontSize(4, 24);
      }
    } else if (window.innerWidth <= 900 && window.innerWidth > window.innerHeight) {
      console.log('2'); // 모바일 가로(900px 이하)
      CONFIG.setZonePositionPercent(1, 5, 12, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(2, 5, 55, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(3, undefined, 12, undefined, 15, '%');
      CONFIG.setZonePositionPercent(4, undefined, 55, undefined, 15, '%');
      CONFIG.setZoneFontSize(1, 22);
    } else if (window.innerWidth >= 900 && window.innerWidth <= 1400 && window.innerWidth > window.innerHeight) {
      console.log('3-1'); // 모바일 가로(900px 이하)
      CONFIG.setZonePositionPercent(1, 12, 6, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(2, 12, 106, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(3, undefined, 6, undefined, 15, '%');
      CONFIG.setZonePositionPercent(4, undefined, 106, undefined, 15, '%');
      CONFIG.setZoneFontSize(1, 22);
    } else if (isLandscape) {
      alert('3-2'); // 태블릿/PC 가로
      CONFIG.setZonePositionPercent(1, 10, 13, undefined, undefined, '%');
      CONFIG.setZoneFontSize(1, 35);
      CONFIG.setZonePositionPercent(2, 10, 106, undefined, undefined);
      CONFIG.setZoneFontSize(2, 35);
      CONFIG.setZonePositionPercent(3, undefined, 13, undefined, 16);
      CONFIG.setZoneFontSize(3, 35);
      CONFIG.setZonePositionPercent(4, undefined, 106, undefined, 16);
      CONFIG.setZoneFontSize(4, 35);
    } else {
      console.log('4-2'); // 태블릿/PC 세로
      CONFIG.setZonePositionPercent(1, 35, 35, undefined, undefined, '%');
      CONFIG.setZoneFontSize(1, 35);
      CONFIG.setZonePositionPercent(2, 35, 106, undefined, undefined, '%');
      CONFIG.setZoneFontSize(2, 35);
      CONFIG.setZonePositionPercent(3, undefined, 6, undefined, 36, '%');
      CONFIG.setZoneFontSize(3, 35);
      CONFIG.setZonePositionPercent(4, undefined, 106, undefined, 36, '%');
      CONFIG.setZoneFontSize(4, 35);
    }
  }
};

// adjustForOrientation 래퍼 함수 - 텍스트 숨김/표시 처리
function safeAdjustForOrientation() {
  // 모든 텍스트 영역을 임시로 숨기기
  const textZones = document.querySelectorAll('.text-zone');
  textZones.forEach(zone => {
    zone.style.opacity = '0';
    zone.style.transition = 'opacity 0.1s ease';
  });
  
  // 위치 조정 실행
  CONFIG.adjustForOrientation();
  
  // 위치 조정 완료 후 텍스트를 부드럽게 다시 나타나게 하기
  setTimeout(() => {
    textZones.forEach(zone => {
      zone.style.opacity = '1';
      zone.style.transition = 'opacity 0.3s ease';
    });
  }, 100);
}

let current = 0;
let textAnimated = Array(slideTemplates.length).fill(false);

// 모달 팝업 함수
function laypop(message) {
  const tabbar = document.getElementById('tabbar-container');
  const overlay = document.getElementById('tabbar-modal-overlay');
  if (tabbar) tabbar.classList.add('show-tabbar');
  if (overlay) overlay.style.display = 'block';
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = message;
  
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));
  if (tabs[0]) tabs[0].classList.add('active');
}

// 키워드 클릭 이벤트
function handleKeywordClick(keyword) {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = keyword;
  laypop(keyword);
}

// 텍스트 렌더링 with 키워드 하이라이팅
function renderTextWithKeywords(text, keywords) {
  // 긴 키워드부터 먼저 치환, 이미 감싼 부분은 다시 치환하지 않음
  if (!Array.isArray(keywords) || keywords.length === 0) return text;
  // 키워드 길이 내림차순 정렬
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  let processedText = text;
  sortedKeywords.forEach(keyword => {
    // 이미 감싼 부분은 제외하고, 나머지만 치환
    // (1) 태그로 감싸진 부분 split
    const parts = processedText.split(/(<span[^>]*>.*?<\/span>)/g);
    for (let i = 0; i < parts.length; i++) {
      // span 태그가 아닌 부분만 치환
      if (!parts[i].startsWith('<span')) {
        // 단어 경계 무시, 단순히 해당 문자열만 치환
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        parts[i] = parts[i].replace(regex, `<span style="cursor:pointer;" onclick=\"handleKeywordClick('${keyword}')\">${keyword}</span>`);
      }
    }
    processedText = parts.join('');
  });
  return processedText;
}

// 명사 클릭 span 래핑 함수 (줄바꿈 포함 명사 지원)
function renderZoneTextWithNounSpans(text, keywords) {
  if (!text) return '';
  let html = text;
  // 긴 명사 우선 매칭
  keywords.sort((a, b) => b.length - a.length).forEach(noun => {
    // 줄바꿈 포함 매칭: 공백을 [ \n\r\t\f\v]*로 치환
    const pattern = noun.replace(/ /g, '[ \n\r\t\f\v]*');
    html = html.replace(
      new RegExp(pattern, 'gi'),
      match => `<span class="noun-span">${match}</span>`
    );
  });
  // <br>로 분할하여 <p>로 감싸기
  return html.split(/<br\s*\/?>/i).map(line => `<p>${line}</p>`).join('');
}

// 이미지 크기에 따라 .text-zone의 p 폰트 크기를 동적으로 조정
function setTextFontSizeByImage(imgElem) {
  // 이미지 크기에 따라 폰트 크기 조정하지 않음 (고정)
  return;
}

// 슬라이드 렌더링
function renderSlide(idx) {
  // 기준 위치(px) - CONFIG.setZonePosition 값과 일치
  const BASE_WIDTH = 1440;
  const BASE_HEIGHT = 900;
  const zoneBase = {
    1: { top: 100, left: 71 },
    2: { top: 100, left: 640 },
    3: { bottom: 100, left: 71 },
    4: { bottom: 100, left: 640 }
  };
  const baseFontSize = 35;

  const slide = slideTemplates[idx];
  const app = document.getElementById('app');
  app.innerHTML = '';

  const container = document.createElement('div');
  container.className = 'slide-container';

  const leftArrow = document.createElement('button');
  leftArrow.className = 'arrow left';
  leftArrow.innerHTML = '&#60;';
  leftArrow.tabIndex = -1;
  leftArrow.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    prevSlide();
  });
  leftArrow.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    prevSlide();
  });
  container.appendChild(leftArrow);

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'slide-img-wrapper';

  const img = document.createElement('img');
  img.className = 'slide-bg';
  img.src = slide.bg;
  img.alt = 'slide';
  imgWrapper.appendChild(img);

  // 4구역 텍스트 생성
  const zoneDivs = {};
  Object.entries(slide.zones).forEach(([zoneNum, zoneData]) => {
    if (zoneData.text) {
      const textZone = document.createElement('div');
      textZone.className = `text-zone zone-${zoneNum}`;
      // 줄바꿈(<br> 또는 \n)마다 p 태그 생성
      const lines = zoneData.text.split(/<br\s*\/?>|\n/);
      lines.forEach(line => {
        if (line.trim() === '') return;
        const paragraph = document.createElement('p');
        paragraph.innerHTML = renderZoneTextWithNounSpans(line, zoneData.keywords);
        textZone.appendChild(paragraph);
      });
      // 명사 클릭 이벤트 바인딩
      textZone.querySelectorAll('.noun-span').forEach(el => {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (typeof laypop === 'function') {
            laypop(this.textContent);
          } else {
            alert(this.textContent);
          }
        });
        // 모바일 터치 이벤트 추가
        el.addEventListener('touchstart', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          if (typeof laypop === 'function') {
            laypop(this.textContent);
          } else {
            alert(this.textContent);
          }
        });
      });
      imgWrapper.appendChild(textZone);
      zoneDivs[zoneNum] = textZone;
    }
  });

  container.appendChild(imgWrapper);

  const rightArrow = document.createElement('button');
  rightArrow.className = 'arrow right';
  rightArrow.innerHTML = '&#62;';
  rightArrow.tabIndex = -1;
  rightArrow.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    nextSlide();
  });
  rightArrow.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    nextSlide();
  });
  container.appendChild(rightArrow);

  app.appendChild(container);

  // 위치/폰트크기 scaling 적용 함수
  window.applyZoneResponsive = function() {
    const scaleW = window.innerWidth / BASE_WIDTH;
    const scaleH = window.innerHeight / BASE_HEIGHT;
    const scale = Math.min(scaleW, scaleH);
    
    [1,2,3,4].forEach(zoneNum => {
      const div = zoneDivs[zoneNum];
      if (!div) return;
      const base = zoneBase[zoneNum];
      
      // 위치 계산
      const adjustedScale = scale;
      
      if (base.top !== undefined) div.style.top = (base.top * adjustedScale) + 'px';
      else div.style.top = '';
      if (base.left !== undefined) div.style.left = (base.left * adjustedScale) + 'px';
      else div.style.left = '';
      if (base.bottom !== undefined) div.style.bottom = (base.bottom * adjustedScale) + 'px';
      else div.style.bottom = '';
      if (base.right !== undefined) div.style.right = (base.right * adjustedScale) + 'px';
      else div.style.right = '';
      
      // 폰트 크기
      div.querySelectorAll('p').forEach(p => {
        p.style.fontSize = (baseFontSize * adjustedScale) + 'px';
        p.style.margin = '0';
        p.style.padding = '0';
        p.style.boxSizing = 'border-box';
        p.style.maxWidth = 'none';
        p.style.width = 'auto';
      });
      
      // 오프셋 방지: margin/padding 제거
      div.style.margin = '0';
      div.style.padding = '0';
      div.style.boxSizing = 'border-box';
      div.style.maxWidth = 'none';
      div.style.width = 'auto';
    });
  }

  // 최초 적용 및 리사이즈 반영
  window.addEventListener('resize', window.applyZoneResponsive);
  setTimeout(window.applyZoneResponsive, 0);

  // 나머지 기존 기능(애니메이션, 화살표, drag 등) 유지
  // zone 위치는 adjustForOrientation()에서 자동으로 설정됨
  
  // 슬라이드 렌더링 후 위치 조정
  setTimeout(() => {
    safeAdjustForOrientation();
  }, 100);

  // 갤럭시 탭 최적화 텍스트 애니메이션
  // 항상 모든 p에 visible 클래스 추가
    setTimeout(() => {
    const allP = Array.from(container.querySelectorAll('p'));
    if (allP.length > 0) {
      // 첫 줄은 0.4초 후 슬라이드 업
        setTimeout(() => {
        allP[0].classList.add('visible');
      }, 400);
      // 두 번째 줄부터는 0.1초 간격으로 다다다닥
      for (let i = 1; i < allP.length; i++) {
        setTimeout(() => {
          allP[i].classList.add('visible');
        }, 400 + i * 100);
      }
    }
  }, 0);

  positionArrows(img, leftArrow, rightArrow);
  addDragEvents(container, leftArrow, rightArrow);

  // 페이지 인디케이터 다시 생성 (이벤트 리스너 재바인딩)
  createPageIndicator();

}

function positionArrows(imgElem, leftArrow, rightArrow) {
  if (!imgElem || !leftArrow || !rightArrow) return;
  const imgRect = imgElem.getBoundingClientRect();
  const slideRect = imgElem.parentElement.getBoundingClientRect();
  leftArrow.style.top = (imgRect.top - slideRect.top + imgRect.height/2) + 'px';
  rightArrow.style.top = (imgRect.top - slideRect.top + imgRect.height/2) + 'px';
  leftArrow.style.transform = 'translateY(-50%)';
  rightArrow.style.transform = 'translateY(-50%)';
}

function nextSlide() {
  let next = (current + 1) % slideTemplates.length;
  current = next;
  renderSlide(current);
  updatePageIndicator();
}

function prevSlide() {
  let prev = (current - 1 + slideTemplates.length) % slideTemplates.length;
  current = prev;
  renderSlide(current);
  updatePageIndicator();
}

function addDragEvents(container, leftArrow, rightArrow) {
  let startX = null;
  let dragging = false;
  // 마우스 이벤트
  container.addEventListener('mousedown', e => { 
    e.preventDefault(); 
    startX = e.clientX; 
    dragging = true; 
  });
  container.addEventListener('mousemove', e => { 
    if (!dragging) return; 
    e.preventDefault(); 
  });
  container.addEventListener('mouseup', e => {
    if (!dragging) return;
    e.preventDefault();
    const diff = e.clientX - startX;
    if (diff > 60) { 
      prevSlide();
    }
    else if (diff < -60) { 
      nextSlide();
    }
    dragging = false;
    startX = null;
  });
  // 모바일 터치 이벤트 (슬라이드 이동에만 passive: false)
  container.addEventListener('touchstart', e => {
    e.preventDefault();
    startX = e.touches[0].clientX;
    dragging = true;
  }, { passive: false });
  container.addEventListener('touchmove', e => {
    if (!dragging) return;
    e.preventDefault();
  }, { passive: false });
  container.addEventListener('touchend', e => {
    if (!dragging) return;
    e.preventDefault();
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    if (diff > 60) { 
      prevSlide();
    }
    else if (diff < -60) { 
      nextSlide();
    }
    dragging = false;
    startX = null;
  }, { passive: false });
}

// 화면 높이 설정 (모바일 브라우저 대응)
function setScreenHeight() {
  // 실제 뷰포트 높이 계산
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// iOS Safari 주소창 숨기기
function hideAddressBar() {
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 0);
}

// 페이지 인디케이터 생성 함수
function createPageIndicator() {
  const indicator = document.getElementById('page-indicator');
  indicator.innerHTML = '';
  
  // 호버 이벤트 추가
  indicator.addEventListener('mouseenter', () => {
    indicator.style.opacity = '1';
  });
  
  indicator.addEventListener('mouseleave', () => {
    indicator.style.opacity = '0.3';
  });
  
  slideTemplates.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'page-dot';
    dot.style.cssText = `
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid rgba(255,255,255,0.1);
    `;
    
    // 현재 페이지면 active 클래스 추가
    if (index === current) {
      dot.classList.add('active');
    }
    
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Page indicator clicked:', index, 'current:', current);
      
      // laypop 모달이 열려있으면 클릭 무시
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar && tabbar.classList.contains('show-tabbar')) {
        return;
      }
      
      if (index === current) return; // 현재 페이지면 클릭 무시
      
      // 바로 이동
      current = index;
      renderSlide(current);
      updatePageIndicator();
    });
    
    // 터치 이벤트 추가 (모바일 대응)
    dot.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('Page indicator touched:', index, 'current:', current);
      
      // laypop 모달이 열려있으면 터치 무시
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar && tabbar.classList.contains('show-tabbar')) {
        return;
      }
      
      if (index === current) return; // 현재 페이지면 터치 무시
      
      // 바로 이동
      current = index;
      renderSlide(current);
      updatePageIndicator();
    });
    
    // 호버 효과
    dot.addEventListener('mouseenter', () => {
      if (index !== current) {
        dot.style.background = 'rgba(255,255,255,0.6)';
        dot.style.transform = 'scale(1.2)';
      }
    });
    
    dot.addEventListener('mouseleave', () => {
      if (index !== current) {
        dot.style.background = 'rgba(255,255,255,0.3)';
        dot.style.transform = 'scale(1)';
      }
    });
    
    indicator.appendChild(dot);
  });
  
  // 갤럭시 탭 S9에서 페이지 인디케이터 색상 설정
  if ((window.innerWidth >= 800 && window.innerWidth <= 1400 && 
       window.innerHeight >= 600 && window.innerHeight <= 1100) || 
      (window.innerWidth >= 600 && window.innerWidth <= 1200 && window.innerHeight > window.innerWidth)) {
    const dots = indicator.querySelectorAll('.page-dot');
    dots.forEach(dot => {
      if (dot.classList.contains('active')) {
        dot.style.background = 'rgba(128,128,128,0.8)';
        dot.style.border = '2px solid rgba(128,128,128,0.6)';
      } else {
        dot.style.background = 'rgba(128,128,128,0.4)';
        dot.style.border = '2px solid rgba(128,128,128,0.2)';
      }
    });
  }
}

// 페이지 인디케이터 업데이트 함수
function updatePageIndicator() {
  const dots = document.querySelectorAll('.page-dot');
  dots.forEach((dot, index) => {
    if (index === current) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

// 첫 슬라이드 표시
window.onload = () => {
  renderSlide(current);
  createPageIndicator();
  hideAddressBar();
  
        // 갤럭시 탭 S9에서 페이지 인디케이터 색상 초기 설정
      setTimeout(() => {
        const pageIndicator = document.getElementById('page-indicator');
        if (pageIndicator && ((window.innerWidth >= 800 && window.innerWidth <= 1400 && 
            window.innerHeight >= 600 && window.innerHeight <= 1100) || 
            (window.innerWidth >= 600 && window.innerWidth <= 1200 && window.innerHeight > window.innerWidth))) {
          const dots = pageIndicator.querySelectorAll('.page-dot');
          dots.forEach(dot => {
            if (dot.classList.contains('active')) {
              dot.style.background = 'rgba(128,128,128,0.8)';
              dot.style.border = '2px solid rgba(128,128,128,0.6)';
            } else {
              dot.style.background = 'rgba(128,128,128,0.4)';
              dot.style.border = '2px solid rgba(128,128,128,0.2)';
            }
          });
        }
      }, 100);
}

// 모바일 기기 감지
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// 화면 크기 감지 및 조정
setScreenHeight();
window.addEventListener('resize', () => {
  console.log('Screen size changed:', {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  });
  setScreenHeight();
  // Screen size changed 로그 후 adjustForOrientation 실행
  setTimeout(() => {
    safeAdjustForOrientation();
  }, 10);
});
window.addEventListener('orientationchange', () => {
  console.log('Orientation changed:', {
    width: window.innerWidth,
    height: window.innerHeight,
    orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait'
  });
  setTimeout(() => {
    setScreenHeight();
    safeAdjustForOrientation();
  }, 100); // 방향 변경 후 짧은 지연
});

// iOS Safari 주소창 숨기기
hideAddressBar();

// 탭바 이벤트 처리
window.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab');
  const searchInput = document.getElementById('searchInput');
  
  tabs.forEach(tab => tab.classList.remove('active'));
  if (tabs[0]) tabs[0].classList.add('active');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Search 버튼 이벤트 리스너 추가
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', async function() {
      const activeTab = document.querySelector('.tab.active');
      const tabLabel = activeTab ? activeTab.dataset.label : 'National Geographic';
      const query = searchInput.value;
      let results = [];
      if (tabLabel === 'National Geographic') {
          results = await searchInChannel('National Geographic', query);
      } else if (tabLabel === 'Discovery') {
          results = await searchInChannel('Discovery', query);
      } else if (tabLabel === 'TED') {
          results = await searchInChannel('TED', query);
      } else if (tabLabel === 'BBC Earth') {
          results = await searchInChannel('BBC Earth', query);
      } else {
          results = await globalSearch(query);
      }
      renderYoutubeResults(results);
    });
  }
  
  // X 버튼 이벤트 리스너 추가
  const xBtn = document.getElementById('tabbar-x-btn');
  if (xBtn) {
    xBtn.addEventListener('click', () => {
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar) tabbar.classList.remove('show-tabbar');
      const overlay = document.getElementById('tabbar-modal-overlay');
      if (overlay) overlay.style.display = 'none';
    });
  }
  
  // 오버레이 클릭 시 닫기 (탭바 자체 클릭은 제외)
  const overlay = document.getElementById('tabbar-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      // 탭바 자체를 클릭한 경우는 닫지 않음
      if (e.target.closest('#tabbar-container')) {
        return;
      }
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar) tabbar.classList.remove('show-tabbar');
      overlay.style.display = 'none';
    });
  }
});

// YouTube API 키 및 채널 정보
const API_KEY = 'AIzaSyDiJA7GkeA_5O5fj05HxAVha1A2B_qQiF4';

// 채널 정보
const channels = {
    'National Geographic': {
        id: 'UCpVm7bg6pXKo1Pr6k5kxG9A',
        handle: '@NationalGeographic'
    },
    'Discovery': {
        id: 'UCqnbDFdCpuN8CMEg0VuEBqA',
        handle: '@Discovery'
    },
    'TED': {
        id: 'UCAuUUnT6oDeKwE6v1NGQxug',
        handle: '@TED'
    },
    'BBC Earth': {
        id: 'UC0p5jTq6Xx_DosDFxVXnWaQ',
        handle: '@bbcearth'
    }
};

// 채널 ID로 검색
async function searchInChannel(channelKey, searchTerm) {
    const channel = channels[channelKey];
    const url = `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&type=video&maxResults=8&` +
        `channelId=${channel.id}&q=${encodeURIComponent(searchTerm)}&` +
        `key=${API_KEY}`;
    console.log(`[채널검색] ${channel.handle}:`, url);
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            console.error('API 에러:', data.error);
            return [];
        }
        // 임베드 허용 영상만 필터링
        const videoIds = (data.items || []).map(item => item.id && item.id.videoId).filter(Boolean);
        if (videoIds.length === 0) return [];
        const statusUrl = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoIds.join(',')}&key=${API_KEY}`;
        const statusRes = await fetch(statusUrl);
        const statusData = await statusRes.json();
        const embeddableIds = (statusData.items || []).filter(v => v.status && v.status.embeddable).map(v => v.id);
        return (data.items || []).filter(item => embeddableIds.includes(item.id.videoId));
    } catch (error) {
        console.error('검색 실패:', error);
        return [];
    }
}

// 전체 검색
async function globalSearch(searchTerm) {
    const url = `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&type=video&maxResults=8&` +
        `q=${encodeURIComponent(searchTerm)}&` +
        `key=${API_KEY}`;
    console.log(`[전체검색]:`, url);
    try {
        const response = await fetch(url);
        const data = await response.json();
        // 임베드 허용 영상만 필터링
        const videoIds = (data.items || []).map(item => item.id && item.id.videoId).filter(Boolean);
        if (videoIds.length === 0) return [];
        const statusUrl = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoIds.join(',')}&key=${API_KEY}`;
        const statusRes = await fetch(statusUrl);
        const statusData = await statusRes.json();
        const embeddableIds = (statusData.items || []).filter(v => v.status && v.status.embeddable).map(v => v.id);
        return (data.items || []).filter(item => embeddableIds.includes(item.id.videoId));
    } catch (error) {
        console.error('전체 검색 실패:', error);
        return [];
    }
}

// 검색 결과 렌더링 함수
function renderYoutubeResults(items) {
    let html = '';
    if (!items || items.length === 0) {
        html = '<div style="padding:2em; text-align:center;">No results found.</div>';
    } else {
        html = items.map((item, idx) => `
            <div class="yt-result-item" style="display:flex;align-items:center;margin-bottom:1em;position:relative;">
                <div class="yt-thumb-title" data-videoid="${item.id.videoId}" style="cursor:pointer;display:flex;align-items:center;">
                    <img src="${item.snippet.thumbnails.default.url}" style="width:120px;height:90px;margin-right:1em;">
                </div>
                <div>
                    <div class="yt-thumb-title" data-videoid="${item.id.videoId}" style="font-weight:bold;color:#222;text-decoration:none;cursor:pointer;">
                        ${item.snippet.title}
                    </div>
                    <div style="font-size:0.9em;color:#666;">${item.snippet.channelTitle}</div>
                </div>
            </div>
        `).join('');
    }
    
    let modal = document.getElementById('search-result-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'search-result-modal';
        modal.style.position = 'fixed';
        modal.style.left = '0';
        modal.style.top = '0';
        modal.style.width = '100vw';
        modal.style.height = '100vh';
        modal.style.background = 'rgba(0,0,0,0.55)';
        modal.style.zIndex = '10001';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.innerHTML = `
            <div style="position:relative; width:90vw; max-width:1200px; height:90vh; background:#fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,0,0,0.18); display:flex; flex-direction:column;">
                <button id="search-modal-close" style="position:absolute; right:18px; top:12px; font-weight:bold; font-size:2rem; background:none; border:none; cursor:pointer; color:#222; z-index:10002;">×</button>
                <div id="search-iframe-wrap" style="flex:1; min-height:0; display:flex; flex-direction:column; align-items:stretch; justify-content:stretch; overflow-y:auto; padding:1em;"></div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('search-modal-close').onclick = () => { modal.remove(); };
    } else {
        modal.style.display = 'flex';
    }
    
    // 검색 결과를 표시
    document.getElementById('search-iframe-wrap').innerHTML = html;
    
    let currentPlayer = null;
    let currentPlayerContainer = null;
    
    setTimeout(() => {
        document.querySelectorAll('.yt-thumb-title').forEach(el => {
            el.onclick = function() {
                const vid = this.dataset.videoid;
                const itemDiv = this.closest('.yt-result-item');
                
                // 기존 플레이어가 있으면 제거
                if (currentPlayer && typeof currentPlayer.destroy === 'function') {
                    currentPlayer.destroy();
                }
                if (currentPlayerContainer && currentPlayerContainer.parentNode) {
                    currentPlayerContainer.remove();
                }
                
                // 같은 아이템을 다시 클릭한 경우 플레이어만 제거하고 종료
                if (itemDiv.querySelector('.yt-inline-player')) {
                    return;
                }
                
                // 더 큰 높이로 설정 (최소 600px, 화면 높이의 70%)
                const minHeight = Math.max(600, window.innerHeight * 0.7);
                
                // 플레이어 컨테이너 생성
                const playerContainer = document.createElement('div');
                playerContainer.className = 'yt-inline-player';
                playerContainer.style.cssText = `
                    width: 100% !important;
                    height: ${minHeight}px !important;
                    min-height: 600px !important;
                    max-height: 800px !important;
                    background: #000;
                    border-radius: 12px;
                    margin: 20px 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    animation: slideDown 0.3s ease-out;
                    box-sizing: border-box;
                `;
                
                const playerDiv = document.createElement('div');
                playerDiv.style.cssText = `
                    width: 100% !important;
                    height: 100% !important;
                    min-height: 600px !important;
                    border-radius: 12px;
                    overflow: hidden;
                    box-sizing: border-box;
                `;
                
                playerContainer.appendChild(playerDiv);
                
                // 닫기 버튼 추가
                const closeBtn = document.createElement('button');
                closeBtn.innerHTML = '×';
                closeBtn.style.cssText = `
                    position: absolute;
                    right: 12px;
                    top: 12px;
                    font-size: 2rem;
                    font-weight: bold;
                    background: rgba(0,0,0,0.7);
                    border: none;
                    color: #fff;
                    z-index: 10011;
                    cursor: pointer;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;
                
                closeBtn.onclick = () => {
                    if (currentPlayer && typeof currentPlayer.destroy === 'function') {
                        currentPlayer.destroy();
                    }
                    playerContainer.remove();
                    currentPlayer = null;
                    currentPlayerContainer = null;
                };
                
                playerContainer.appendChild(closeBtn);
                
                // 아이템 바로 다음에 플레이어 삽입
                itemDiv.parentNode.insertBefore(playerContainer, itemDiv.nextSibling);
                currentPlayerContainer = playerContainer;
                
                // 클릭한 리스트가 가장 위로 스크롤
                setTimeout(() => {
                    itemDiv.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                }, 100);
                
                // YouTube 플레이어 생성
                if (window.YT && window.YT.Player) {
                    currentPlayer = new YT.Player(playerDiv, {
                        width: '100%',
                        height: minHeight,
                        videoId: vid,
                        playerVars: { 'autoplay': 1, 'controls': 1 },
                        events: {
                            'onReady': function (event) { 
                                event.target.playVideo(); 
                                // 플레이어 크기 강제 설정
                                const iframe = playerDiv.querySelector('iframe');
                                if (iframe) {
                                    iframe.style.width = '100% !important';
                                    iframe.style.height = '100% !important';
                                    iframe.style.minHeight = '600px !important';
                                }
                            }
                        }
                    });
                }
            };
        });
    }, 100);
}

// 키보드 이벤트 처리
document.addEventListener('keydown', function(event) {
  // 화살표 키로 슬라이드 이동
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    prevSlide();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    nextSlide();
  }
}); 