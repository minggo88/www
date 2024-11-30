const data = [];

const fn_getManagerData = function () {
    // check_login();
    API.getManagerData((resp) => {
        if (resp.success) {
            data.length = 0; // 기존 내용을 초기화
            data.push(...resp.payload); // payload 데이터를 data에 추가
            renderMembers(resp.payload);
        } else {
            console.log('fail');
        }
    });
}

// 입력 필드 초기화
function resetForm() {
    document.getElementById('m_name').value = '';
    document.getElementById('m_call').value = '';
    document.getElementById('m_id').value = '';
    document.getElementById('m_pass').value = '';
    document.getElementById('m_pass_check').value = '';
}

// 회원가입 버튼 클릭 이벤트
document.addEventListener("DOMContentLoaded", function() {
    // 회원가입 버튼 클릭 이벤트
    const managerInputButton = document.getElementById('manager_input');
 
    managerInputButton.addEventListener('click', function() {
        let name = document.getElementById('m_name').value.trim();
        let call = document.getElementById('m_call').value.trim();
        let id = document.getElementById('m_id').value.trim();
        let pass = document.getElementById('m_pass').value.trim();
        let passCheck = document.getElementById('m_pass_check').value.trim();
        let use = document.getElementById('m_enable').checked ? 'Y' : 'N';

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
    //addManager: (m_name, m_call, m_id, m_pw, m_use, callback = null) => {
        API.addManager(name, call, id, pass, use, (resp) => {
            if (resp.success) {
                console.log(resp);
                alert('회원가입이 성공하였습니다.');
                fn_getManagerData();

                // 초기화
                resetForm();
            } else {
                console.log('fail');
                alert('회원가입이 실패 하였습니다.');
            }
        }); 
    });
});





// 데이터 렌더링 함수
function renderMembers(data) {
    // team-ys 컨테이너
    const teamYsContainer = document.querySelector('.team-ys');
    teamYsContainer.innerHTML = ''; // 기존 내용 초기화

    data.forEach(member => {
        // team-member 요소 생성
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('team-member');

        // member-info 요소 생성
        const memberInfoDiv = document.createElement('div');
        memberInfoDiv.classList.add('member-info');

        // 각 데이터 요소 추가
        memberInfoDiv.innerHTML = `
            <span id="title_id"><strong>${member.m_id}</strong></span>
            <span id="title_name"><strong>${member.m_name}</strong></span>
            <span id="title_call">${member.m_call}</span>
            <input style="visibility:hidden;" id="title_index" value="${member.m_index}" />
            <input style="visibility:hidden;" id="title_password" value="${member.m_password}" />
            <input style="visibility:hidden;" id="title_use" value="${member.m_use}" />
            <button class="button password-btn" data-toggle="modal" data-target="#passModal" data-whatever="${member.m_index}">패스워드 변경</button>
            <button class="${member.m_use === 'Y' ? 'button disable-btn' : 'button enable-btn'}" id="use_yn">${member.m_use === 'Y' ? '사용 금지' : '사용 허용'}</button>
        `;

        // team-member에 member-info 추가
        memberDiv.appendChild(memberInfoDiv);

        // team-ys에 team-member 추가
        teamYsContainer.appendChild(memberDiv);
    });

    // 사용유무 확인체크
    document.querySelectorAll('#use_yn').forEach(function(button) {
        button.addEventListener('click', function() {
            // 버튼이 클릭되었을 때, 이 버튼에 포함된 team-member의 id, 비밀번호, 사용 여부 값을 가져옴
            var parentDiv = button.closest('.team-member');  // 버튼이 포함된 부모 div 선택
    
            var titleIndex = parentDiv.querySelector('#title_index').value;
            var titleUse = parentDiv.querySelector('#title_use').value;
            if(titleUse === 'Y'){
                titleUse = 'N';
            }else{
                titleUse = 'Y';
            }
            console.log('title_index:', titleIndex);  // title_index의 값 출력
            console.log('title_use:', titleUse);      // title_use의 값 출력

            API.updateManagerUse(titleIndex, titleUse, (resp) => {
                    if (resp.success) {
                        alert('페이지를 재시작 합니다.')
                        fn_getManagerData();
                    } else {
                        console.log('fail');
                    }
                });
            // title_index와 title_use 값을 사용하여 추가 작업을 할 수 있습니다.
        });
    });
}

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

    $('#passModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        // m_index 값이 4인 항목의 m_name 출력
        
        const item = data.find(entry => entry.m_index == recipient);
        if (item) {
            modal.find('.modal-title').text('패스워드 변경');
            $('#recipient-id').val(item.m_id); // ID 설정
            $('#recipient-name').val(item.m_name); // 이름 설정
            $('#recipient-call').val(item.m_call); // ID 설정
            $('#recipient-password').val(item.m_password);
            $('#recipient-password-check').val(item.m_password);
        } else {
            console.log("m_index가 4인 항목을 찾을 수 없습니다.");
        }

        //비밀번호 번경
        document.getElementById('btn_up_pw').addEventListener('click', function() {
            // 버튼 클릭 시 실행할 코드 작성
            let up_pw =  $('#recipient-password').val();
            let passCheck = $('#recipient-password-check').val();
            
            if(up_pw === passCheck){
                let up_id = $('#recipient-id').val(); // ID 설정
        
                const item = data.find(entry => entry.m_id == up_id);
                
                let up_name = $('#recipient-name').val(); // 이름 설정
                let up_call = $('#recipient-call').val();
                let up_pw = $('#recipient-password').val();
                let up_index = item.m_index;
            
                // 예시: 버튼 클릭 시 알림을 띄우기
                API.updateManager(up_index, up_name, up_call, up_id, up_pw, (resp) => {
                    if (resp.success) {
                        alert('패스워드 변경이 성공하였습니다.');
                        fn_getManagerData();
        
                    } else {
                        console.log('fail');
                        alert('패스워드 변경이 실패 하였습니다.');
                    }
                });
            }else{
                alert('비밀번호를 확인해 주세요');
            }
            
            
            
            // 추가로 실행할 작업을 이곳에 추가할 수 있습니다.
        });
    })
});
