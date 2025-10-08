/**
 * 관리자 전용 함수 모음
 * 파일 위치: /assets/js/mediAdmin.js
 */

// ============================================
// 관리자 인증 확인
// ============================================

/**
 * 관리자 로그인 확인
 * 로그인하지 않았으면 로그인 페이지로 이동
 */
function checkAdminAuth() {
    const adminData = getAdminData();
    if (!adminData) {
        showAlert('로그인이 필요합니다', 'warning');
        setTimeout(() => {
            navigateTo('login.html');
        }, 1000);
        return false;
    }
    return true;
}

/**
 * 관리자 정보 가져오기
 */
function getAdminData() {
    // sessionStorage 먼저 확인
    let data = sessionStorage.getItem('adminData');
    if (data) return JSON.parse(data);
    
    // localStorage 확인 (로그인 유지)
    data = localStorage.getItem('adminData');
    if (data) {
        // sessionStorage에도 저장
        sessionStorage.setItem('adminData', data);
        return JSON.parse(data);
    }
    
    return null;
}

/**
 * 관리자 정보 저장
 */
function saveAdminData(data, remember = false) {
    const jsonData = JSON.stringify(data);
    sessionStorage.setItem('adminData', jsonData);
    
    if (remember) {
        localStorage.setItem('adminData', jsonData);
    }
}

/**
 * 로그아웃
 */
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        sessionStorage.removeItem('adminData');
        localStorage.removeItem('adminData');
        navigateTo('login.html');
    }
}

// ============================================
// 환자 데이터 조회
// ============================================

/**
 * 전체 환자 목록 조회
 */
async function getAllPatients(filters = {}) {
    try {
        let query = supabase
            .from('bookings')
            .select(`
                *,
                users (
                    id,
                    name,
                    phone,
                    created_at
                )
            `)
            .order('created_at', { ascending: false });
        
        // 필터 적용
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        
        if (filters.startDate) {
            query = query.gte('created_at', filters.startDate);
        }
        
        if (filters.endDate) {
            query = query.lte('created_at', filters.endDate);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('환자 목록 조회 실패:', error);
        return [];
    }
}

/**
 * 특정 환자 상세 정보 조회
 */
async function getPatientDetail(bookingId) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                users (
                    id,
                    name,
                    phone,
                    created_at
                ),
                prescriptions (*),
                payments (*)
            `)
            .eq('id', bookingId)
            .single();
        
        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('환자 상세 조회 실패:', error);
        return null;
    }
}

/**
 * 오늘 신규 접수 조회
 */
async function getTodayBookings() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                users (name, phone)
            `)
            .gte('created_at', today.toISOString())
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('오늘 접수 조회 실패:', error);
        return [];
    }
}

/**
 * 환자 검색
 */
async function searchPatients(keyword) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                users (
                    id,
                    name,
                    phone
                )
            `)
            .or(`booking_number.ilike.%${keyword}%,users.name.ilike.%${keyword}%,users.phone.ilike.%${keyword}%`)
            .order('created_at', { ascending: false })
            .limit(50);
        
        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('환자 검색 실패:', error);
        return [];
    }
}

// ============================================
// 통계 데이터
// ============================================

/**
 * 대시보드 통계 데이터 조회
 */
async function getDashboardStats() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        
        // 오늘 신규 접수
        const { data: todayData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .gte('created_at', today.toISOString());
        
        // 대기 중인 환자
        const { data: pendingData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .eq('status', 'pending');
        
        // 완료된 진료 (오늘)
        const { data: completedData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .eq('status', 'completed')
            .gte('created_at', today.toISOString());
        
        // 이번 달 총 접수
        const { data: monthData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .gte('created_at', thisMonth.toISOString());
        
        return {
            todayCount: todayData?.length || 0,
            pendingCount: pendingData?.length || 0,
            completedToday: completedData?.length || 0,
            monthCount: monthData?.length || 0
        };
        
    } catch (error) {
        console.error('통계 조회 실패:', error);
        return {
            todayCount: 0,
            pendingCount: 0,
            completedToday: 0,
            monthCount: 0
        };
    }
}

// ============================================
// 상태 관리
// ============================================

/**
 * 접수 상태 변경
 */
async function updateBookingStatus(bookingId, status) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ status: status })
            .eq('id', bookingId)
            .select()
            .single();
        
        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('상태 변경 실패:', error);
        throw error;
    }
}

// ============================================
// 처방전 관리
// ============================================

/**
 * 처방전 발급
 */
async function createPrescription(prescriptionData) {
    try {
        // 1. 처방전 저장
        const { data: prescription, error: prescError } = await supabase
            .from('prescriptions')
            .insert({
                booking_id: prescriptionData.bookingId,
                diagnosis: prescriptionData.diagnosis,
                prescription_details: prescriptionData.prescriptionDetails,
                amount: prescriptionData.amount,
                prescription_type: prescriptionData.prescriptionType,
                notes: prescriptionData.notes,
                created_by: prescriptionData.adminId
            })
            .select()
            .single();
        
        if (prescError) throw prescError;
        
        // 2. 접수 상태를 'confirmed'로 변경
        await updateBookingStatus(prescriptionData.bookingId, 'confirmed');
        
        // 3. 환자에게 알림 발송 (텔레그램)
        if (prescriptionData.patientName) {
            try {
                await fetch('https://onfrhbbbxbilletwivoo.supabase.co/functions/v1/send-telegram', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                    },
                    body: JSON.stringify({
                        patientName: `${prescriptionData.patientName} 님의 처방전이 발급되었습니다. 금액: ${prescriptionData.amount.toLocaleString()}원`
                    })
                });
            } catch (telegramError) {
                console.error('텔레그램 알림 실패:', telegramError);
            }
        }
        
        return prescription;
        
    } catch (error) {
        console.error('처방전 발급 실패:', error);
        throw error;
    }
}

/**
 * 처방전 조회
 */
async function getPrescription(bookingId) {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .select('*')
            .eq('booking_id', bookingId)
            .single();
        
        if (error) throw error;
        
        return data;
        
    } catch (error) {
        console.error('처방전 조회 실패:', error);
        return null;
    }
}

// ============================================
// UI 헬퍼 함수
// ============================================

/**
 * 상태 뱃지 HTML 생성
 */
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge badge-warning">대기중</span>',
        confirmed: '<span class="badge badge-primary">진료완료</span>',
        completed: '<span class="badge badge-success">결제완료</span>',
        cancelled: '<span class="badge badge-danger">취소</span>'
    };
    
    return badges[status] || '<span class="badge">알 수 없음</span>';
}

/**
 * 상태 한글 변환
 */
function getStatusText(status) {
    const texts = {
        pending: '대기중',
        confirmed: '진료완료',
        completed: '결제완료',
        cancelled: '취소'
    };
    
    return texts[status] || '알 수 없음';
}

/**
 * 금액 포맷팅
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
}

/**
 * 문진표 데이터 파싱
 */
function parseQuestionnaireData(notesString) {
    try {
        return JSON.parse(notesString);
    } catch (error) {
        console.error('문진표 파싱 실패:', error);
        return null;
    }
}

// ============================================
// 관리자 페이지 헤더
// ============================================

/**
 * 관리자 페이지 헤더 생성
 */
function createAdminHeader() {
    const adminData = getAdminData();
    if (!adminData) return '';
    
    return `
        <div style="background: white; border-bottom: 1px solid #e2e8f0; padding: 15px 0; margin-bottom: 20px;">
            <div class="container-wide">
                <div class="d-flex justify-between align-center">
                    <div>
                        <h2 style="margin: 0; color: #1e293b;">어성초 한의원 관리자</h2>
                    </div>
                    <div class="d-flex align-center gap-2">
                        <span style="color: #64748b;">👤 ${adminData.name} (${adminData.role})</span>
                        <button onclick="logout()" class="btn btn-secondary">로그아웃</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * 관리자 네비게이션 메뉴
 */
function createAdminNav(currentPage) {
    const menuItems = [
        { page: 'dashboard', label: '대시보드', icon: '📊' },
        { page: 'patients', label: '환자 목록', icon: '👥' },
        { page: 'settings', label: '설정', icon: '⚙️' }
    ];
    
    let navHTML = '<div style="background: white; padding: 10px 0; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0;"><div class="container-wide"><div class="d-flex gap-2">';
    
    menuItems.forEach(item => {
        const isActive = currentPage === item.page;
        const activeStyle = isActive ? 'background: #2563eb; color: white;' : 'background: #f8fafc; color: #64748b;';
        navHTML += `
            <a href="${item.page}.html" style="
                padding: 10px 20px;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                ${activeStyle}
            ">
                ${item.icon} ${item.label}
            </a>
        `;
    });
    
    navHTML += '</div></div></div>';
    
    return navHTML;
}