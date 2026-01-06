// Supabase 설정
const SUPABASE_URL = 'https://zizbhefplazgenjzowpo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dxllpWx_x7sBYgZe1RuHaQ_jUjf67em';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 디버깅용 전역 노출
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
window.supabaseClient = supabase;

console.log('✅ Supabase 초기화 완료');

// 웹페이지에 추가할 코드
window.currentSlideNumber = 1; // 현재 슬라이드 번호
window.totalSlides = 17; // 총 슬라이드 개수 (이미지 파일 개수에 맞춤)

// 동적 스크립트 로드 함수
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

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
        setTimeout(() => {
          safeAdjustForOrientation();
        }, 10);
      }
    }
  },
  adjustForOrientation: () => {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isMobile = window.innerWidth <= 600;
    
    if (isMobile) {
      if (isLandscape) {
        CONFIG.setZonePositionPercent(1, 8, 10, undefined, undefined);
        CONFIG.setZoneFontSize(1, 24);
        CONFIG.setZonePositionPercent(2, 8, 95, undefined, undefined);
        CONFIG.setZoneFontSize(2, 24);
        CONFIG.setZonePositionPercent(3, undefined, 10, undefined, 12);
        CONFIG.setZoneFontSize(3, 24);
        CONFIG.setZonePositionPercent(4, undefined, 95, undefined, 12);
        CONFIG.setZoneFontSize(4, 24);
      } else {
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
      CONFIG.setZonePositionPercent(1, 5, 12, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(2, 5, 55, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(3, undefined, 12, undefined, 15, '%');
      CONFIG.setZonePositionPercent(4, undefined, 55, undefined, 15, '%');
      CONFIG.setZoneFontSize(1, 22);
    } else if (window.innerWidth >= 900 && window.innerWidth <= 1400 && window.innerWidth > window.innerHeight) {
      CONFIG.setZonePositionPercent(1, 12, 6, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(2, 12, 106, undefined, undefined, '%');
      CONFIG.setZonePositionPercent(3, undefined, 6, undefined, 15, '%');
      CONFIG.setZonePositionPercent(4, undefined, 106, undefined, 15, '%');
      CONFIG.setZoneFontSize(1, 22);
    } else if (isLandscape) {
      CONFIG.setZonePositionPercent(1, 10, 13, undefined, undefined, '%');
      CONFIG.setZoneFontSize(1, 35);
      CONFIG.setZonePositionPercent(2, 10, 106, undefined, undefined);
      CONFIG.setZoneFontSize(2, 35);
      CONFIG.setZonePositionPercent(3, undefined, 13, undefined, 16);
      CONFIG.setZoneFontSize(3, 35);
      CONFIG.setZonePositionPercent(4, undefined, 106, undefined, 16);
      CONFIG.setZoneFontSize(4, 35);
    } else {
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

function safeAdjustForOrientation() {
  const textZones = document.querySelectorAll('.text-zone');
  textZones.forEach(zone => {
    zone.style.opacity = '0';
    zone.style.transition = 'opacity 0.1s ease';
  });
  
  CONFIG.adjustForOrientation();
  
  setTimeout(() => {
    textZones.forEach(zone => {
      zone.style.opacity = '1';
      zone.style.transition = 'opacity 0.3s ease';
    });
  }, 100);
}

let current = 0;
let textAnimated = Array(slideTemplates.length).fill(false);

function buildAllKey() {
  const allKeywords = new Set();
  if (typeof slideTemplates !== 'undefined' && Array.isArray(slideTemplates)) {
    slideTemplates.forEach(slide => {
      if (slide.zones) {
        Object.values(slide.zones).forEach(zone => {
          if (zone.keywords && Array.isArray(zone.keywords)) {
            zone.keywords.forEach(keyword => {
              if (keyword && keyword.trim()) {
                allKeywords.add(keyword.trim());
              }
            });
          }
        });
      }
    });
  }
  return Array.from(allKeywords);
}

window.AllKey = buildAllKey();

async function laypop(message) {
  const tabbar = document.getElementById('tabbar-container');
  if (tabbar) {
    tabbar.classList.remove('show-tabbar');
  }
  const overlay = document.getElementById('tabbar-modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
  
  const query = message.trim();
  if (query) {
    const results = await searchInChannel('National Geographic', query);
    await renderYoutubeResults(results);
  }
}

function handleKeywordClick(keyword) {
  laypop(keyword);
}

function renderTextWithKeywords(text, keywords) {
  if (!Array.isArray(keywords) || keywords.length === 0) return text;
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  let processedText = text;
  sortedKeywords.forEach(keyword => {
    const parts = processedText.split(/(<span[^>]*>.*?<\/span>)/g);
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].startsWith('<span')) {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        parts[i] = parts[i].replace(regex, `<span style="cursor:pointer;" onclick=\"handleKeywordClick('${keyword}')\">${keyword}</span>`);
      }
    }
    processedText = parts.join('');
  });
  return processedText;
}

function renderZoneTextWithNounSpans(text, keywords) {
  if (!text) return '';
  let html = text;
  
  let allKeywordsToCheck = [];
  if (keywords && Array.isArray(keywords)) {
    allKeywordsToCheck = [...keywords];
  }
  if (window.AllKey && Array.isArray(window.AllKey)) {
    window.AllKey.forEach(key => {
      if (!allKeywordsToCheck.includes(key)) {
        allKeywordsToCheck.push(key);
      }
    });
  }
  
  allKeywordsToCheck.sort((a, b) => b.length - a.length).forEach(noun => {
    const words = noun.split(/ /);
    const escapedWords = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const pattern = escapedWords.join('[ \n\r\t\f\v]*');
    
    const parts = html.split(/(<span[^>]*>.*?<\/span>)/gi);
    for (let i = 0; i < parts.length; i++) {
      if (!parts[i].startsWith('<span')) {
        const regex = new RegExp(pattern, 'gi');
        parts[i] = parts[i].replace(regex, (match) => {
          return `<span class="noun-span">${match}</span>`;
        });
      }
    }
    html = parts.join('');
  });
  
  return html.split(/<br\s*\/?>/i).map(line => `<p>${line}</p>`).join('');
}

function setTextFontSizeByImage(imgElem) {
  return;
}

function renderSlide(idx) {
  if (!window.AllKey || !Array.isArray(window.AllKey) || window.AllKey.length === 0) {
    window.AllKey = buildAllKey();
  }
  
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

  const zoneDivs = {};
  Object.entries(slide.zones).forEach(([zoneNum, zoneData]) => {
    if (zoneData.text) {
      const textZone = document.createElement('div');
      textZone.className = `text-zone zone-${zoneNum}`;
      const lines = zoneData.text.split(/<br\s*\/?>|\n/);
      lines.forEach(line => {
        if (line.trim() === '') return;
        const paragraph = document.createElement('p');
        paragraph.innerHTML = renderZoneTextWithNounSpans(line, zoneData.keywords);
        textZone.appendChild(paragraph);
      });
      textZone.querySelectorAll('.noun-span').forEach(el => {
        el.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const clickedText = this.textContent.trim();
          if (typeof laypop === 'function') {
            laypop(clickedText);
          } else {
            alert(clickedText);
          }
        });
        el.addEventListener('touchstart', function(e) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          const clickedText = this.textContent.trim();
          if (typeof laypop === 'function') {
            laypop(clickedText);
          } else {
            alert(clickedText);
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

  window.applyZoneResponsive = function() {
    const scaleW = window.innerWidth / BASE_WIDTH;
    const scaleH = window.innerHeight / BASE_HEIGHT;
    const scale = Math.min(scaleW, scaleH);
    
    [1,2,3,4].forEach(zoneNum => {
      const div = zoneDivs[zoneNum];
      if (!div) return;
      const base = zoneBase[zoneNum];
      
      const adjustedScale = scale;
      
      if (base.top !== undefined) div.style.top = (base.top * adjustedScale) + 'px';
      else div.style.top = '';
      if (base.left !== undefined) div.style.left = (base.left * adjustedScale) + 'px';
      else div.style.left = '';
      if (base.bottom !== undefined) div.style.bottom = (base.bottom * adjustedScale) + 'px';
      else div.style.bottom = '';
      if (base.right !== undefined) div.style.right = (base.right * adjustedScale) + 'px';
      else div.style.right = '';
      
      div.querySelectorAll('p').forEach(p => {
        p.style.fontSize = (baseFontSize * adjustedScale) + 'px';
        p.style.margin = '0';
        p.style.padding = '0';
        p.style.boxSizing = 'border-box';
        p.style.maxWidth = 'none';
        p.style.width = 'auto';
      });
      
      div.style.margin = '0';
      div.style.padding = '0';
      div.style.boxSizing = 'border-box';
      div.style.maxWidth = 'none';
      div.style.width = 'auto';
    });
  }

  window.addEventListener('resize', window.applyZoneResponsive);
  setTimeout(window.applyZoneResponsive, 0);
  
  setTimeout(() => {
    safeAdjustForOrientation();
  }, 100);

  setTimeout(() => {
    const allP = Array.from(container.querySelectorAll('p'));
    if (allP.length > 0) {
      setTimeout(() => {
        allP[0].classList.add('visible');
      }, 400);
      for (let i = 1; i < allP.length; i++) {
        setTimeout(() => {
          allP[i].classList.add('visible');
        }, 400 + i * 100);
      }
    }
  }, 0);

  positionArrows(img, leftArrow, rightArrow);
  addDragEvents(container, leftArrow, rightArrow);
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
  window.currentSlideNumber = current + 1;
  renderSlide(current);
  updatePageIndicator();
}

function prevSlide() {
  let prev = (current - 1 + slideTemplates.length) % slideTemplates.length;
  current = prev;
  window.currentSlideNumber = current + 1;
  renderSlide(current);
  updatePageIndicator();
}

function addDragEvents(container, leftArrow, rightArrow) {
  let startX = null;
  let dragging = false;
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

function setScreenHeight() {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

function hideAddressBar() {
  setTimeout(() => {
    window.scrollTo(0, 1);
  }, 0);
}

function createPageIndicator() {
  const indicator = document.getElementById('page-indicator');
  indicator.innerHTML = '';
  
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
    
    if (index === current) {
      dot.classList.add('active');
    }
    
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar && tabbar.classList.contains('show-tabbar')) {
        return;
      }
      
      if (index === current) return;
      
      current = index;
      window.currentSlideNumber = current + 1;
      renderSlide(current);
      updatePageIndicator();
    });
    
    dot.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar && tabbar.classList.contains('show-tabbar')) {
        return;
      }
      
      if (index === current) return;
      
      current = index;
      window.currentSlideNumber = current + 1;
      renderSlide(current);
      updatePageIndicator();
    });
    
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

function getSlideFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const slideParam = urlParams.get('slide');
  if (slideParam) {
    const slideNumber = parseInt(slideParam, 10);
    if (!isNaN(slideNumber) && slideNumber >= 1 && slideNumber <= window.totalSlides) {
      return slideNumber - 1;
    }
  }
  return null;
}

window.onload = () => {
  const urlSlideIndex = getSlideFromURL();
  if (urlSlideIndex !== null) {
    current = urlSlideIndex;
  }
  
  window.currentSlideNumber = current + 1;
  renderSlide(current);
  createPageIndicator();
  hideAddressBar();
  
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

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

setScreenHeight();
window.addEventListener('resize', () => {
  setScreenHeight();
  setTimeout(() => {
    safeAdjustForOrientation();
  }, 10);
});
window.addEventListener('orientationchange', () => {
  setTimeout(() => {
    setScreenHeight();
    safeAdjustForOrientation();
  }, 100);
});

hideAddressBar();

window.addEventListener('DOMContentLoaded', async () => {
  if (typeof slideTemplates !== 'undefined') {
    window.AllKey = buildAllKey();
  }
  
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
  
  if (searchInput) {
    let previousValue = searchInput.value;
    searchInput.addEventListener('input', function() {
      const currentValue = this.value.trim();
      if (previousValue && window.AllKey && window.AllKey.includes(previousValue)) {
        if (currentValue !== previousValue) {
          this.value = previousValue;
          return;
        }
      }
      previousValue = currentValue;
    });
    
    searchInput.addEventListener('focus', function() {
      const currentValue = this.value.trim();
      if (window.AllKey && window.AllKey.includes(currentValue)) {
        this.setAttribute('readonly', 'readonly');
        this.style.cursor = 'default';
        this.style.color = '#222';
      } else {
        this.removeAttribute('readonly');
        this.style.cursor = 'text';
      }
    });
  }

  const iconMap = {
    'National Geographic': '../assets/img/ReadBook/menu_img/natgeo.png.png'
  };
  const bgSizeMap = {
    'National Geographic': '70% auto'
  };
  tabs.forEach(tab => {
    const label = tab.dataset.label || tab.textContent.trim();
    const iconUrl = iconMap[label];
    if (iconUrl) {
      tab.style.backgroundImage = `url('${iconUrl}')`;
      tab.style.backgroundRepeat = 'no-repeat';
      tab.style.backgroundPosition = 'center';
      tab.style.backgroundSize = bgSizeMap[label] || '70% auto';
      tab.style.color = 'transparent';
      tab.style.textIndent = '-9999px';
      tab.style.padding = '0';
      tab.style.width = '180px';
      tab.style.height = '56px';
      tab.addEventListener('mouseenter', () => { tab.style.opacity = '0.9'; });
      tab.addEventListener('mouseleave', () => { tab.style.opacity = '1'; });
    }
  });
  
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
    searchBtn.addEventListener('click', async function() {
      const query = searchInput.value;
      const results = await searchInChannel('National Geographic', query);
      await renderYoutubeResults(results);
    });
  }
  
  const xBtn = document.getElementById('tabbar-x-btn');
  if (xBtn) {
    xBtn.addEventListener('click', () => {
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar) tabbar.classList.remove('show-tabbar');
      const overlay = document.getElementById('tabbar-modal-overlay');
      if (overlay) overlay.style.display = 'none';
      
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.style.display = '';
      });
      const searchBtn = document.getElementById('searchBtn');
      if (searchBtn) {
        searchBtn.style.display = '';
      }
    });
  }
  
  const overlay = document.getElementById('tabbar-modal-overlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target.closest('#tabbar-container')) {
        return;
      }
      const tabbar = document.getElementById('tabbar-container');
      if (tabbar) tabbar.classList.remove('show-tabbar');
      overlay.style.display = 'none';
      
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => {
        tab.style.display = '';
      });
      const searchBtn = document.getElementById('searchBtn');
      if (searchBtn) {
        searchBtn.style.display = '';
      }
    });
  }
});

// ========================================
// YouTube API 및 Supabase 캐싱 시스템 (백그라운드 업데이트 방식)
// ========================================

const API_KEY = 'AIzaSyDMxjpMi2kB4qJvCb-m_zMSCE4ech59N0k';

const channels = {
    'National Geographic': {
        id: 'UCpVm7bg6pXKo1Pr6k5kxG9A',
        handle: '@NationalGeographic',
        rssUrl: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCpVm7bg6pXKo1Pr6k5kxG9A'
    }
};

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24시간
const BACKGROUND_UPDATE_TRACKING = {}; // 백그라운드 업데이트 중복 방지

// Supabase에서 캐시 조회
async function getCachedFromSupabase(channelKey, query) {
    try {
        const normalizedQuery = (query || '').trim().toLowerCase();
        
        console.log('🔍 [Supabase 조회]', channelKey, ':', normalizedQuery || '(전체)');
        
        const { data, error } = await supabase
            .from('youtube_search_cache')
            .select('*')
            .eq('channel_key', channelKey)
            .eq('search_query', normalizedQuery)
            .maybeSingle();
        
        if (error) {
            console.error('❌ [Supabase 조회 실패]', error);
            return null;
        }
        
        if (!data) {
            console.log('📭 [캐시 없음]');
            return null;
        }
        
        const cacheAge = Date.now() - new Date(data.updated_at).getTime();
        if (cacheAge > CACHE_DURATION) {
            console.log(`⏰ [캐시 만료] ${Math.floor(cacheAge / 1000 / 60 / 60)}시간 경과`);
            return null;
        }
        
        console.log(`✅ [캐시 히트!] ${data.results.length}개 (조회 ${data.hit_count}회)`);
        
        // hit_count 업데이트 (비동기로 백그라운드에서)
        supabase
            .from('youtube_search_cache')
            .update({ 
                hit_count: data.hit_count + 1,
                updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .then(() => {});
        
        return data.results;
        
    } catch (error) {
        console.error('❌ [Supabase 조회 예외]', error);
        return null;
    }
}

// Supabase에 캐시 저장
async function saveCacheToSupabase(channelKey, query, results) {
    try {
        const normalizedQuery = (query || '').trim().toLowerCase();
        
        console.log('💾 [캐시 저장]', channelKey, ':', normalizedQuery || '(전체)', ':', results.length + '개');
        
        const { data, error } = await supabase
            .from('youtube_search_cache')
            .upsert({
                channel_key: channelKey,
                search_query: normalizedQuery,
                results: results,
                hit_count: 1,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'channel_key,search_query'
            })
            .select();
        
        if (error) {
            console.error('❌ [저장 실패]', error);
            return false;
        }
        
        console.log('✅ [저장 성공]');
        return true;
        
    } catch (error) {
        console.error('❌ [저장 예외]', error);
        return false;
    }
}

// RSS에서 영상 목록 가져오기
async function getChannelVideosFromRSS(channelKey) {
    const channel = channels[channelKey];
    if (!channel || !channel.rssUrl) {
        console.error(`[RSS 실패] ${channelKey}: RSS URL이 없습니다`);
        return null;
    }
    
    try {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(channel.rssUrl)}`;
        console.log(`[RSS 요청] ${channelKey}`);
        
        const response = await fetch(proxyUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        
        const parseError = xmlDoc.querySelector('parsererror');
        if (parseError) {
            throw new Error('XML 파싱 오류');
        }
        
        const entries = xmlDoc.querySelectorAll('entry');
        const videos = [];
        
        entries.forEach((entry, index) => {
            if (index >= 15) return;
            
            try {
                let videoId = null;
                
                const idElement = entry.querySelector('id');
                if (idElement) {
                    const idText = idElement.textContent;
                    const idMatch = idText.match(/yt:video:([a-zA-Z0-9_-]{11})/) || 
                                   idText.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
                                   idText.match(/\/([a-zA-Z0-9_-]{11})$/);
                    if (idMatch) {
                        videoId = idMatch[1];
                    }
                }
                
                if (!videoId) {
                    const linkElement = entry.querySelector('link[rel="alternate"]') || entry.querySelector('link');
                    if (linkElement) {
                        const href = linkElement.getAttribute('href') || linkElement.textContent;
                        const hrefMatch = href.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
                                        href.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/);
                        if (hrefMatch) {
                            videoId = hrefMatch[1];
                        }
                    }
                }
                
                if (!videoId) {
                    const mediaGroup = entry.querySelector('group');
                    if (mediaGroup) {
                        const videoIdElement = mediaGroup.querySelector('videoId');
                        if (videoIdElement) {
                            videoId = videoIdElement.textContent.trim();
                        }
                    }
                }
                
                if (!videoId || videoId.length !== 11) {
                    return;
                }
                
                const titleElement = entry.querySelector('title');
                const title = titleElement ? titleElement.textContent : '';
                
                const publishedElement = entry.querySelector('published');
                const published = publishedElement ? publishedElement.textContent : '';
                
                const authorElement = entry.querySelector('author name');
                const channelTitle = authorElement ? authorElement.textContent : channel.handle;
                
                const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/default.jpg`;
                
                videos.push({
                    id: { videoId: videoId },
                    snippet: {
                        title: title,
                        channelTitle: channelTitle,
                        publishedAt: published,
                        thumbnails: {
                            default: {
                                url: thumbnailUrl
                            }
                        }
                    }
                });
            } catch (error) {
                console.error(`[RSS 파싱 오류] entry ${index}:`, error);
            }
        });
        
        console.log(`✅ [RSS 성공] ${videos.length}개 영상`);
        return videos;
        
    } catch (error) {
        console.error(`[RSS 실패] ${channelKey}:`, error);
        return null;
    }
}

// 🎯 백그라운드에서 전체 영상 목록 업데이트
async function updateCacheInBackground(channelKey) {
    const trackingKey = `${channelKey}_full`;
    
    // 이미 업데이트 중이면 중복 실행 방지
    if (BACKGROUND_UPDATE_TRACKING[trackingKey]) {
        return;
    }
    
    BACKGROUND_UPDATE_TRACKING[trackingKey] = true;
    
    console.log(`🔄 [백그라운드 업데이트 시작] ${channelKey}`);
    
    // 사용자는 기다리지 않음!
    setTimeout(async () => {
        try {
            const videos = await getChannelVideosFromRSS(channelKey);
            if (videos && videos.length > 0) {
                await saveCacheToSupabase(channelKey, '', videos);
                console.log(`✅ [백그라운드 업데이트 완료] ${channelKey}: ${videos.length}개`);
            }
        } catch (error) {
            console.error(`❌ [백그라운드 업데이트 실패] ${channelKey}:`, error);
        } finally {
            BACKGROUND_UPDATE_TRACKING[trackingKey] = false;
        }
    }, 100); // 0.1초 후 백그라운드에서 실행
}

// 🚀 메인 검색 함수 (백그라운드 업데이트 방식)
async function searchInChannelNew(channelKey, searchTerm) {
    console.log(`[검색 시작] ${channelKey}: "${searchTerm || '(전체)'}"`);
    
    // 1. 먼저 특정 검색어 캐시 확인
    const cachedResults = await getCachedFromSupabase(channelKey, searchTerm);
    if (cachedResults && cachedResults.length > 0) {
        console.log('⚡ [즉시 반환] 캐시에서');
        
        // 🎯 백그라운드에서 전체 영상 목록 업데이트 (사용자는 기다리지 않음!)
        updateCacheInBackground(channelKey);
        
        return cachedResults;
    }
    
    // 2. 전체 영상 목록 캐시 확인
    const allVideosCache = await getCachedFromSupabase(channelKey, '');
    
    if (allVideosCache && allVideosCache.length > 0) {
        console.log('📦 [전체 목록 캐시 사용]');
        
        // 검색어로 필터링
        if (!searchTerm || searchTerm.trim() === '') {
            const results = allVideosCache.slice(0, 8);
            
            // 🎯 백그라운드 업데이트
            updateCacheInBackground(channelKey);
            
            return results;
        }
        
        const searchLower = searchTerm.toLowerCase().trim();
        const filtered = allVideosCache.filter(video => {
            const title = video.snippet.title.toLowerCase();
            return title.includes(searchLower);
        });
        
        console.log(`🔎 [필터링 결과] ${filtered.length}개`);
        
        const results = filtered.slice(0, 8);
        
        // 검색 결과 캐시에 저장
        if (results.length > 0) {
            await saveCacheToSupabase(channelKey, searchTerm, results);
        }
        
        // 🎯 백그라운드 업데이트
        updateCacheInBackground(channelKey);
        
        return results;
    }
    
    // 3. 캐시 없음 - RSS에서 가져오기 (첫 검색만)
    console.log('🌐 [첫 검색] RSS에서 가져오는 중...');
    const videos = await getChannelVideosFromRSS(channelKey);
    
    if (!videos || videos.length === 0) {
        console.log(`❌ [실패] API로 전환`);
        return await searchInChannelAPI(channelKey, searchTerm);
    }
    
    // 전체 영상 목록 저장
    await saveCacheToSupabase(channelKey, '', videos);
    
    // 검색어로 필터링
    if (!searchTerm || searchTerm.trim() === '') {
        return videos.slice(0, 8);
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    const filtered = videos.filter(video => {
        const title = video.snippet.title.toLowerCase();
        return title.includes(searchLower);
    });
    
    const results = filtered.slice(0, 8);
    
    // 검색 결과도 저장
    if (results.length > 0) {
        await saveCacheToSupabase(channelKey, searchTerm, results);
    }
    
    return results;
}

// 채널 검색 (Supabase 캐시 우선)
async function searchInChannel(channelKey, searchTerm) {
    try {
        const results = await searchInChannelNew(channelKey, searchTerm);
        if (results && results.length > 0) {
            return results;
        }
    } catch (error) {
        console.error(`[검색 오류] ${channelKey}:`, error);
    }
    
    console.log(`[API 백업] ${channelKey}`);
    return await searchInChannelAPI(channelKey, searchTerm);
}

// API를 사용한 채널 검색 (백업용)
async function searchInChannelAPI(channelKey, searchTerm) {
    const channel = channels[channelKey];
    if (!channel) {
        console.error(`[API 실패] ${channelKey}: 채널 정보가 없습니다`);
        return [];
    }
    
    const url = `https://www.googleapis.com/youtube/v3/search?` +
        `part=snippet&type=video&maxResults=8&` +
        `channelId=${channel.id}&q=${encodeURIComponent(searchTerm || '')}&` +
        `key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.error) {
            console.error('[API 에러]:', data.error);
            return [];
        }
        
        const videoIds = (data.items || []).map(item => item.id && item.id.videoId).filter(Boolean);
        if (videoIds.length === 0) return [];
        
        const statusUrl = `https://www.googleapis.com/youtube/v3/videos?part=status&id=${videoIds.join(',')}&key=${API_KEY}`;
        const statusRes = await fetch(statusUrl);
        const statusData = await statusRes.json();
        const embeddableIds = (statusData.items || []).filter(v => v.status && v.status.embeddable).map(v => v.id);
        const results = (data.items || []).filter(item => embeddableIds.includes(item.id.videoId));
        
        console.log(`[API 성공] ${results.length}개`);
        
        if (results.length > 0) {
            await saveCacheToSupabase(channelKey, searchTerm, results);
        }
        
        return results;
    } catch (error) {
        console.error('[API 검색 실패]:', error);
        return [];
    }
}

// 검색 결과 렌더링 함수
async function renderYoutubeResults(items) {
    let html = '';
    if (!items || items.length === 0) {
        html = '<div style="padding:2em; text-align:center;">검색 결과가 없습니다.</div>';
    } else {
        html = items.map((item, idx) => `
            <div class="yt-result-item" data-index="${idx}" style="display:flex;align-items:center;margin-bottom:1em;position:relative;">
                <div class="yt-thumb-title" data-videoid="${item.id.videoId}" style="cursor:pointer;display:flex;align-items:center;">
                    <img src="${item.snippet.thumbnails.default.url}" 
                         style="width:120px;height:90px;margin-right:1em;object-fit:cover;border-radius:8px;"
                         onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiB2aWV3Qm94PSIwIDAgMTIwIDkwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjkwIiBmaWxsPSIjZjBmMGYwIi8+CjxwYXRoIGQ9Ik02MCA0NUw0NSA2MEg3NUw2MCA0NVoiIGZpbGw9IiNjY2NjY2MiLz4KPHN2Zz4K'; this.style.background='#f0f0f0'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center';">
                </div>
                <div>
                    <div class="yt-title-text" data-videoid="${item.id.videoId}" style="font-weight:bold;color:#222;text-decoration:none;cursor:pointer;">
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
    
    document.getElementById('search-iframe-wrap').innerHTML = html;
    
    setTimeout(() => {
        document.querySelectorAll('.yt-thumb-title, .yt-title-text').forEach(el => {
            el.onclick = function() {
                const vid = this.dataset.videoid;
                if (vid) {
                    const youtubeUrl = `https://m.youtube.com/watch?v=${vid}&cc_load_policy=1&cc_lang_pref=ko&hl=ko`;
                    
                    const isWebView = /WebView|wv|Android.*Version\/[0-9]|iPhone.*Safari\/[0-9]/.test(navigator.userAgent);
                    
                    const popupOptions = isWebView ? 
                        'width=800,height=600,left=50,top=50,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no' :
                        'width=' + screen.availWidth + ',height=' + screen.availHeight + ',left=0,top=0,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no,fullscreen=yes';
                    
                    const popup = window.open('', 'youtube_viewer', popupOptions);
                    
                    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
                        window.open(youtubeUrl, '_blank');
                        return;
                    }
                        
                    popup.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>YouTube Video Viewer</title>
                            <link rel="stylesheet" href="https://cdn.plyr.io/3.7.8/plyr.css" />
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    font-family: Arial, sans-serif;
                                    background: #000;
                                    overflow: hidden;
                                }
                                .video-container {
                                    position: relative;
                                    width: 100vw;
                                    height: 100vh;
                                    display: flex;
                                    flex-direction: column;
                                }
                                .close-btn {
                                    position: absolute;
                                    top: 10px;
                                    right: 10px;
                                    background: rgba(0,0,0,0.7);
                                    color: white;
                                    border: none;
                                    border-radius: 50%;
                                    width: 40px;
                                    height: 40px;
                                    font-size: 20px;
                                    cursor: pointer;
                                    z-index: 1000;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    transition: background 0.2s;
                                }
                                .close-btn:hover {
                                    background: rgba(255,0,0,0.8);
                                }
                                .plyr {
                                    width: 100%;
                                    height: 100%;
                                }
                                .plyr__video-wrapper {
                                    height: 100vh !important;
                                }
                                .plyr__video {
                                    height: 100vh !important;
                                }
                                .loading {
                                    position: absolute;
                                    top: 50%;
                                    left: 50%;
                                    transform: translate(-50%, -50%);
                                    color: white;
                                    font-size: 18px;
                                    z-index: 999;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="video-container">
                                <button class="close-btn" onclick="window.close()">×</button>
                                <div class="loading">로딩 중...</div>
                                <div id="player" data-plyr-provider="youtube" data-plyr-embed-id="${vid}"></div>
                            </div>
                            <script src="https://cdn.plyr.io/3.7.8/plyr.js"></script>
                            <script>
                                try {
                                    window.moveTo(0, 0);
                                    window.resizeTo(screen.availWidth, screen.availHeight);
                                    window.focus();
                                    
                                    setTimeout(() => {
                                        try {
                                            window.resizeTo(screen.availWidth, screen.availHeight);
                                            window.moveTo(0, 0);
                                        } catch (e) {}
                                    }, 100);
                                    
                                    document.addEventListener('keydown', function(e) {
                                        if (e.key === 'Escape') {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }
                                    });
                                    
                                    try {
                                        const player = new Plyr('#player', {
                                            controls: ['play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
                                            autoplay: true,
                                            muted: false,
                                            hideControls: true,
                                            resetOnEnd: true,
                                            keyboard: { focused: true, global: true },
                                            tooltips: { controls: true, seek: true },
                                            captions: { active: true, language: 'ko', update: true },
                                            fullscreen: { enabled: true, fallback: true, iosNative: true },
                                            youtube: {
                                                noCookie: true,
                                                rel: 0,
                                                showinfo: 0,
                                                iv_load_policy: 3,
                                                cc_load_policy: 1,
                                                cc_lang_pref: 'ko',
                                                hl: 'ko'
                                            }
                                        });
                                        
                                        player.on('ready', () => {
                                            const loading = document.querySelector('.loading');
                                            if (loading) loading.style.display = 'none';
                                        });
                                        
                                        player.on('error', (event) => {
                                            console.error('Plyr player error:', event);
                                        });
                                        
                                        setTimeout(() => {
                                            try {
                                                player.fullscreen.enter();
                                            } catch (e) {}
                                        }, 1000);
                                        
                                    } catch (error) {
                                        document.getElementById('player').innerHTML = '<iframe width="100%" height="100%" src="https://www.youtube.com/embed/' + '${vid}' + '?autoplay=1&cc_load_policy=1&cc_lang_pref=ko&hl=ko" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
                                        
                                        const loading = document.querySelector('.loading');
                                        if (loading) loading.style.display = 'none';
                                    }
                                    
                                } catch (e) {}
                            </script>
                        </body>
                        </html>
                    `);
                    popup.document.close();
                }
            };
        });
    }, 100);
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    prevSlide();
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    nextSlide();
  }
});