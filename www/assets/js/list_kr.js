// YouTube 리스트 한글 번역 기능
// Google Translate API를 사용하여 영어 제목을 한글로 번역

// 번역 API 키 (실제 사용시에는 보안을 위해 환경변수로 관리해야 함)
//09
//const TRANSLATE_API_KEY = 'AIzaSyAQ-7v5A_AFccpbRuXX0LgAL5CAEQlwmgo';
//sin
const TRANSLATE_API_KEY = 'AIzaSyCk4YGMoqc4uZvLFta0rwreIEUQEuMY_PI';


// 텍스트 번역 함수
async function translateText(text, targetLang = 'ko', sourceLang = 'en') {
    if (!text || text.trim() === '') {
        return text;
    }
    
    try {
        const url = `https://translation.googleapis.com/language/translate/v2?key=${TRANSLATE_API_KEY}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                target: targetLang,
                source: sourceLang,
                format: 'text'
            })
        });
        
        if (!response.ok) {
            console.error('번역 API 호출 실패:', response.status, response.statusText);
            return text; // 번역 실패시 원본 텍스트 반환
        }
        
        const data = await response.json();
        
        if (data.data && data.data.translations && data.data.translations.length > 0) {
            const translatedText = data.data.translations[0].translatedText;
            console.log(`번역 완료: "${text}" → "${translatedText}"`);
            return translatedText;
        } else {
            console.error('번역 결과가 없습니다:', data);
            return text;
        }
    } catch (error) {
        console.error('번역 중 오류 발생:', error);
        return text; // 오류 발생시 원본 텍스트 반환
    }
}

// YouTube 검색 결과를 한글로 번역하는 함수
async function translateYoutubeResults(items) {
    if (!items || items.length === 0) {
        return items;
    }
    
    console.log('YouTube 검색 결과 번역 시작...');
    
    const translatedItems = [];
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const originalTitle = item.snippet.title;
        
        try {
            // 제목 번역
            const translatedTitle = await translateText(originalTitle, 'ko', 'en');
            
            // 번역된 아이템 생성
            const translatedItem = {
                ...item,
                snippet: {
                    ...item.snippet,
                    title: translatedTitle,
                    originalTitle: originalTitle // 원본 제목도 보관
                }
            };
            
            translatedItems.push(translatedItem);
            
            // 번역 진행상황 로그
            console.log(`[${i + 1}/${items.length}] 번역 완료:`, {
                original: originalTitle,
                translated: translatedTitle
            });
            
            // API 호출 제한을 위한 지연 (초당 10회 제한 고려)
            if (i < items.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
        } catch (error) {
            console.error(`아이템 ${i + 1} 번역 실패:`, error);
            // 번역 실패시 원본 아이템 사용
            translatedItems.push(item);
        }
    }
    
    console.log('YouTube 검색 결과 번역 완료!');
    return translatedItems;
}

// 번역된 결과를 렌더링하는 함수 (4zoneApp.js의 renderYoutubeResults 대체)
function renderTranslatedYoutubeResults(items) {
    let html = '';
    
    if (!items || items.length === 0) {
        html = '<div style="padding:2em; text-align:center;">검색 결과가 없습니다.</div>';
    } else {
        html = items.map((item, idx) => {
            const title = item.snippet.translatedTitle || item.snippet.title;
            const originalTitle = item.snippet.originalTitle || item.snippet.title;
            
            return `
                <div class="yt-result-item" style="display:flex;align-items:center;margin-bottom:1em;position:relative;">
                    <div class="yt-thumb-title" data-videoid="${item.id.videoId}" style="cursor:pointer;display:flex;align-items:center;">
                        <img src="${item.snippet.thumbnails.default.url}" style="width:120px;height:90px;margin-right:1em;">
                    </div>
                    <div style="flex:1;">
                        <div class="yt-thumb-title" data-videoid="${item.id.videoId}" style="font-weight:bold;color:#222;text-decoration:none;cursor:pointer;margin-bottom:0.5em;">
                            ${title}
                        </div>
                        <div style="font-size:0.8em;color:#888;margin-bottom:0.3em;">
                            <strong>원본:</strong> ${originalTitle}
                        </div>
                        <div style="font-size:0.9em;color:#666;">${item.snippet.channelTitle}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // 모달 생성 및 결과 표시
    let modal = document.getElementById('search-result-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'search-result-modal';
        modal.style.cssText = `
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0,0,0,0.55);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
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
    
    // YouTube 플레이어 이벤트 바인딩 (기존 4zoneApp.js 로직과 동일)
    setTimeout(() => {
        let currentPlayer = null;
        let currentPlayerContainer = null;
        
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

// 번역 기능 활성화/비활성화 토글
let translationEnabled = true;

function toggleTranslation() {
    translationEnabled = !translationEnabled;
    console.log(`번역 기능 ${translationEnabled ? '활성화' : '비활성화'}`);
    return translationEnabled;
}

// 번역 설정 업데이트
function updateTranslationSettings(apiKey) {
    if (apiKey) {
        TRANSLATE_API_KEY = apiKey;
        console.log('번역 API 키가 업데이트되었습니다.');
    }
}

// 전역 함수로 노출 (4zoneApp.js에서 사용할 수 있도록)
window.translateYoutubeResults = translateYoutubeResults;
window.renderTranslatedYoutubeResults = renderTranslatedYoutubeResults;
window.toggleTranslation = toggleTranslation;
window.updateTranslationSettings = updateTranslationSettings;
window.translationEnabled = translationEnabled;
