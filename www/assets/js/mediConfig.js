/**
 * Supabase 연결 설정
 * 파일 위치: /assets/js/config.js
 */

// Supabase 설정
const SUPABASE_URL = 'https://onfrhbbbxbilletwivoo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZnJoYmJieGJpbGxldHdpdm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk3OTA0MjYsImV4cCI6MjA3NTM2NjQyNn0.z9CKuOnC9MF3pp-elTWtlu8HXlOizFkloYn8zCxgDas';

// Supabase 클라이언트 초기화
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 연결 테스트
async function testConnection() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('count');
        
        if (error) throw error;
        console.log('✅ Supabase 연결 성공!');
        return true;
    } catch (error) {
        console.error('❌ Supabase 연결 실패:', error);
        return false;
    }
}

// 페이지 로드 시 연결 테스트 (개발 모드)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    testConnection();
}