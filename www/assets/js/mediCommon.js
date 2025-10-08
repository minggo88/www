/**
 * 공통 함수 모음
 * 파일 위치: /assets/js/mediCommon.js
 */

// ============================================
// 암호화/복호화 함수
// ============================================

/**
 * 데이터 암호화
 */
async function encryptData(text) {
    try {
        const response = await fetch('https://onfrhbbbxbilletwivoo.supabase.co/functions/v1/encrypt-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ text })
        });
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        return data.encrypted;
    } catch (error) {
        console.error('암호화 실패:', error);
        throw error;
    }
}

/**
 * 데이터 복호화
 */
async function decryptData(encrypted) {
    try {
        const response = await fetch('https://onfrhbbbxbilletwivoo.supabase.co/functions/v1/decrypt-data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            },
            body: JSON.stringify({ encrypted })
        });
        
        const data = await response.json();
        
        if (data.error) throw new Error(data.error);
        
        return data.text;
    } catch (error) {
        console.error('복호화 실패:', error);
        throw error;
    }
}

// ============================================
// 입력 검증 함수
// ============================================

/**
 * 이름 검증 (한글 2-10자)
 */
function validateName(name) {
    const regex = /^[가-힣]{2,10}$/;
    return regex.test(name);
}

/**
 * 전화번호 검증 (010-0000-0000)
 */
function validatePhone(phone) {
    const regex = /^010-\d{4}-\d{4}$/;
    return regex.test(phone);
}

/**
 * 전화번호 자동 포맷팅 (01012345678 -> 010-1234-5678)
 */
function formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return phone;
}

// ============================================
// 세션스토리지 관리
// ============================================

/**
 * 환자 정보 저장
 */
function savePatientData(data) {
    sessionStorage.setItem('patientData', JSON.stringify(data));
}

/**
 * 환자 정보 가져오기
 */
function getPatientData() {
    const data = sessionStorage.getItem('patientData');
    return data ? JSON.parse(data) : null;
}

/**
 * 환자 정보 삭제
 */
function clearPatientData() {
    sessionStorage.removeItem('patientData');
}

// ============================================
// 접수번호 생성
// ============================================

/**
 * 접수번호 생성 (YYYYMMDD01, YYYYMMDD02...)
 */
async function generateBookingNumber() {
    const today = new Date();
    const dateStr = today.getFullYear() + 
                    String(today.getMonth() + 1).padStart(2, '0') + 
                    String(today.getDate()).padStart(2, '0');
    
    try {
        // 오늘 날짜의 마지막 접수번호 찾기
        const { data, error } = await supabase
            .from('bookings')
            .select('booking_number')
            .like('booking_number', `${dateStr}%`)
            .order('booking_number', { ascending: false })
            .limit(1);
        
        if (error) throw error;
        
        let sequence = 1;
        if (data && data.length > 0) {
            const lastNumber = data[0].booking_number;
            sequence = parseInt(lastNumber.slice(-2)) + 1;
        }
        
        return dateStr + String(sequence).padStart(2, '0');
        
    } catch (error) {
        console.error('접수번호 생성 실패:', error);
        // 에러 발생 시 임시 번호 생성
        return dateStr + '01';
    }
}

// ============================================
// UI 헬퍼 함수
// ============================================

/**
 * 로딩 스피너 표시
 */
function showLoading(message = '처리 중...') {
    // 기존 로딩이 있으면 제거
    hideLoading();
    
    const loadingHTML = `
        <div id="loadingOverlay" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        ">
            <div style="
                background: white;
                padding: 30px;
                border-radius: 10px;
                text-align: center;
            ">
                <div style="
                    border: 4px solid #f3f4f6;
                    border-top: 4px solid #2563eb;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 15px;
                "></div>
                <p style="margin: 0; color: #1e293b;">${message}</p>
            </div>
        </div>
    `;
    
    // CSS 애니메이션 추가
    if (!document.getElementById('spinnerStyle')) {
        const style = document.createElement('style');
        style.id = 'spinnerStyle';
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.insertAdjacentHTML('beforeend', loadingHTML);
}

/**
 * 로딩 스피너 숨기기
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.remove();
    }
}

/**
 * 알림 메시지 표시
 */
function showAlert(message, type = 'info') {
    const colors = {
        info: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
        success: { bg: '#d1fae5', border: '#10b981', text: '#065f46' },
        warning: { bg: '#fef3c7', border: '#f59e0b', text: '#92400e' },
        danger: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' }
    };
    
    const color = colors[type] || colors.info;
    
    const alertHTML = `
        <div class="custom-alert" style="
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${color.bg};
            color: ${color.text};
            border-left: 4px solid ${color.border};
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 90%;
            animation: slideDown 0.3s ease-out;
        ">
            ${message}
        </div>
    `;
    
    // CSS 애니메이션 추가
    if (!document.getElementById('alertStyle')) {
        const style = document.createElement('style');
        style.id = 'alertStyle';
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.insertAdjacentHTML('beforeend', alertHTML);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        const alert = document.querySelector('.custom-alert');
        if (alert) alert.remove();
    }, 3000);
}

/**
 * 확인 다이얼로그
 */
function showConfirm(message) {
    return confirm(message);
}

// ============================================
// 접근 로그 기록
// ============================================

/**
 * 페이지 접근 로그 기록
 */
async function logAccess(action, page = null) {
    try {
        const patientData = getPatientData();
        
        await supabase
            .from('access_logs')
            .insert({
                user_id: patientData?.userId || null,
                action: action,
                page: page || window.location.pathname,
                ip_address: await getClientIP(),
                user_agent: navigator.userAgent
            });
    } catch (error) {
        console.error('로그 기록 실패:', error);
    }
}

/**
 * 클라이언트 IP 가져오기
 */
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

// ============================================
// 날짜/시간 포맷팅
// ============================================

/**
 * 날짜 포맷팅 (YYYY-MM-DD HH:MM)
 */
function formatDateTime(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 날짜 포맷팅 (YYYY년 MM월 DD일)
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    return `${year}년 ${month}월 ${day}일`;
}

// ============================================
// 에러 처리
// ============================================

/**
 * 에러 메시지 표시
 */
function handleError(error, customMessage = null) {
    console.error('에러 발생:', error);
    
    let message = customMessage || '오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    
    // Supabase 에러 메시지 파싱
    if (error && error.message) {
        console.error('상세 에러:', error.message);
        if (error.message.includes('violates')) {
            message = '데이터 형식이 올바르지 않습니다.';
        }
    }
    
    showAlert(message, 'danger');
}

// ============================================
// 페이지 이동
// ============================================

/**
 * 페이지 이동
 */
function navigateTo(url) {
    window.location.href = url;
}

/**
 * 뒤로가기
 */
function goBack() {
    window.history.back();
}

// 전화번호로 기존 환자 확인
async function checkExistingPatient(phone) {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('id, name, phone, created_at')
            .eq('phone', phone)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('기존 환자 확인 오류:', error);
        return null;
    }
}

// 환자의 최근 접수 내역 확인
async function getRecentBooking(userId) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select('id, status, created_at')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(1);

        if (error) throw error;
        return data && data.length > 0 ? data[0] : null;
    } catch (error) {
        console.error('최근 접수 확인 오류:', error);
        return null;
    }
}