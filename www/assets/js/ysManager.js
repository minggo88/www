const fn_getManagerData = function () {
    // check_login();
    API.getManagerData((resp) => {
        if (resp.success) {
            console.log(resp);
        } else {
            console.log('fail');
        }
    });
}


$('#passModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('패스워드 변경')
    modal.find('.modal-body #recipient-id').val('111111');
})

// 입력 필드 초기화
function resetForm() {
    document.getElementById('m_name').value = '';
    document.getElementById('m_call').value = '';
    document.getElementById('m_id').value = '';
    document.getElementById('m_pass').value = '';
    document.getElementById('m_pass_check').value = '';
}

// 회원가입 버튼 클릭 이벤트
document.getElementById('manager_input').addEventListener('click', function() {
    let name = document.getElementById('m_name').value.trim();
    let call = document.getElementById('m_call').value.trim();
    let id = document.getElementById('m_id').value.trim();
    let pass = document.getElementById('m_pass').value.trim();
    let passCheck = document.getElementById('m_pass_check').value.trim();

    let missingFields = [];

    // 1. 빈 필드 체크
    if (!name) missingFields.push('이름');
    if (!call) missingFields.push('전화번호');
    if (!id) missingFields.push('ID');
    if (!pass) missingFields.push('패스워드');
    if (!passCheck) missingFields.push('패스워드 확인');

    if (missingFields.length > 0) {
        alert('다음 항목을 입력하세요: ' + missingFields.join(', '));
        return;
    }

    // 2. 패스워드 일치 확인
    if (pass !== passCheck) {
        alert('패스워드와 패스워드 확인이 일치하지 않습니다.');
        return;
    }

    // 3. 성공 메시지
    alert('회원가입이 성공하였습니다.');

    // 초기화
    resetForm();
});

const check_logout = function (redirectUrl = "/ys_login.html") {
    // 세션 스토리지 초기화
    sessionStorage.clear();
    
    // 로그아웃 메시지 출력 (선택 사항)
    alert("로그아웃 되었습니다.");
    
    // 로그인 페이지로 리다이렉트
    window.location.href = redirectUrl;
};

///-------------------------------------------------------------------------------------------
$(document).ready(function() {
    fn_getManagerData();
});
