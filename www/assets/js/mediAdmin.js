/**
 * 관리자 전용 함수 모음
 * 파일 위치: /assets/js/mediAdmin.js
 * 수정: parseQuestionnaireData 함수 - JSON/텍스트 모두 처리 가능
 */

// ============================================
// 관리자 인증 확인
// ============================================

/**
 * 관리자 로그인 확인
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
    let data = sessionStorage.getItem('adminData');
    if (data) return JSON.parse(data);
    
    data = localStorage.getItem('adminData');
    if (data) {
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
 * 전체 접수 조회 (날짜 제한 없음)
 * ⚠️ 수정됨: 오늘 날짜 필터 제거하여 전체 데이터 조회
 */
async function getTodayBookings() {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                *,
                users (name, phone)
            `)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log('📋 전체 접수 데이터 로드:', data?.length || 0, '건');
        
        return data;
        
    } catch (error) {
        console.error('접수 조회 실패:', error);
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
        const thisMonth = new Date();
        thisMonth.setDate(1);
        thisMonth.setHours(0, 0, 0, 0);
        
        const { data: pendingData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .eq('status', 'pending');
        
        const { data: confirmedData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .eq('status', 'confirmed');
        
        const { data: completedData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .eq('status', 'completed')
            .gte('created_at', thisMonth.toISOString());
        
        const { data: monthData } = await supabase
            .from('bookings')
            .select('id', { count: 'exact' })
            .gte('created_at', thisMonth.toISOString());
        
        const todayCount = (pendingData?.length || 0) + (confirmedData?.length || 0);
        
        return {
            todayCount: todayCount,
            pendingCount: pendingData?.length || 0,
            confirmedCount: confirmedData?.length || 0,
            completedCount: completedData?.length || 0,
            monthCount: monthData?.length || 0
        };
        
    } catch (error) {
        console.error('통계 데이터 조회 실패:', error);
        return {
            todayCount: 0,
            pendingCount: 0,
            confirmedCount: 0,
            completedCount: 0,
            monthCount: 0
        };
    }
}

// ============================================
// 데이터 업데이트
// ============================================

/**
 * 접수 상태 업데이트
 */
async function updateBookingStatus(bookingId, newStatus) {
    try {
        const { data, error } = await supabase
            .from('bookings')
            .update({ 
                status: newStatus,
                updated_at: new Date().toISOString()
            })
            .eq('id', bookingId)
            .select()
            .single();
        
        if (error) throw error;
        
        console.log('상태 업데이트 성공:', data);
        return data;
        
    } catch (error) {
        console.error('상태 업데이트 실패:', error);
        throw error;
    }
}

/**
 * 처방전 저장
 */
async function savePrescription(prescriptionData) {
    try {
        const { data, error } = await supabase
            .from('prescriptions')
            .insert([prescriptionData])
            .select()
            .single();
        
        if (error) throw error;
        
        await updateBookingStatus(prescriptionData.booking_id, 'confirmed');
        
        return data;
        
    } catch (error) {
        console.error('처방전 저장 실패:', error);
        throw error;
    }
}

/**
 * 결제 정보 저장
 */
async function savePayment(paymentData) {
    try {
        const { data, error } = await supabase
            .from('payments')
            .insert([paymentData])
            .select()
            .single();
        
        if (error) throw error;
        
        await updateBookingStatus(paymentData.booking_id, 'completed');
        
        return data;
        
    } catch (error) {
        console.error('결제 정보 저장 실패:', error);
        throw error;
    }
}

// ============================================
// 유틸리티 함수
// ============================================

/**
 * 문진표 데이터 파싱 (복호화는 별도로 처리)
 * 이 함수는 이미 복호화된 데이터를 받는다고 가정
 */
function parseQuestionnaireData(notesString) {
    // 데이터가 없는 경우
    if (!notesString) {
        console.log('문진표 데이터 없음');
        return null;
    }

    // 이미 객체인 경우
    if (typeof notesString === 'object') {
        return notesString;
    }

    // 문자열인 경우 JSON 파싱 시도
    try {
        return JSON.parse(notesString);
    } catch (error) {
        console.error('문진표 JSON 파싱 실패:', error);
        // 파싱 실패 시 텍스트로 반환
        return {
            rawText: notesString,
            note: '문진표를 JSON으로 파싱할 수 없습니다.'
        };
    }
}

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
 * 관리자 네비게이션 메뉴 (설정 버튼 제거)
 */
function createAdminNav(currentPage) {
    const menuItems = [
        { page: 'dashboard', label: '대시보드', icon: '📊' },
        { page: 'patients', label: '환자 목록', icon: '👥' }
        // 설정 메뉴 제거
    ];
    
    let navHTML = '<div style="background: white; padding: 10px 0; margin-bottom: 20px; border-bottom: 2px solid #e2e8f0;"><div class="container-wide"><div class="d-flex gap-2">';
    
    menuItems.forEach(item => {
        const isActive = currentPage === item.page;
        const activeStyle = isActive ? 
            'background: #3b82f6; color: white;' : 
            'background: #f1f5f9; color: #64748b;';
        
        navHTML += `
            <button 
                onclick="navigateTo('${item.page}.html')" 
                style="padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; ${activeStyle}"
            >
                ${item.icon} ${item.label}
            </button>
        `;
    });
    
    navHTML += '</div></div></div>';
    
    return navHTML;
}

console.log('✅ mediAdmin.js 로드 완료 (전체 데이터 조회 + 문진표 복호화 + 설정 버튼 제거)');