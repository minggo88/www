const data = [];

const fn_getCustomerData = function () {
    // check_login();
    API.getCustomerData('','',(resp) => {
        if (resp.success) {
            console.log(resp);
            data.length = 0; // 기존 내용을 초기화
            data.push(...resp.payload); // payload 데이터를 data에 추가
            displayTable(data,1);
            setupPagination(resp.payload);
            //renderMembers(resp.payload);
        } else {
            console.log('fail');
        }
    });
}

// 입력 필드 초기화
function resetForm() {
    document.getElementById('c_name').value = '';
    document.getElementById('c_call').value = '';
    document.getElementById('c_address1').value = '';
    document.getElementById('c_address2').value = '';
}

// 회원가입 버튼 클릭 이벤트
document.addEventListener("DOMContentLoaded", function() {
    // 회원가입 버튼 클릭 이벤트
    const customerInputButton = document.getElementById('customer_input');
 
    customerInputButton.addEventListener('click', function() {
        let name = document.getElementById('c_name').value.trim();
        let call = document.getElementById('c_call').value.trim();
        let address1 = document.getElementById('c_address1').value;
        let address2 = document.getElementById('c_address2').value;
        
        let missingFields = [];

        // 1. 빈 필드 체크
        if (!name) missingFields.push('이름');
        if (!call) missingFields.push('전화번호');
        if (!address1) missingFields.push('주소');
        
        if (missingFields.length > 0) {
            alert('다음 항목을 입력하세요: ' + missingFields.join(', '));
            return;
        }

        // 3. 성공 메시지
        API.addCustomer(name, call, address1, address2, (resp) => {
            if (resp.success) {
                console.log(resp);
                alert('회원가입이 성공하였습니다.');
                fn_getCustomerData();
                displayTable(data, currentPage);
                setupPagination(data);

                // 초기화
                resetForm();
            } else {
                console.log('fail');
                alert('회원가입이 실패 하였습니다.');
            }
        }); 
    });
});

const rowsPerPage = 9;
let currentPage = 1;

function displayTable(data, page) {
    const tableBody = document.getElementById('customerTableBody');
    tableBody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);
    pageData.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.c_name}</td>
                <td>${item.c_call}</td>
                <td>${item.c_address1}</td>
                <td>${item.c_address2}</td>
                <td><button class="button update-btn" id="btn_up_customer" data-toggle="modal" data-target="#passModal" data-whatever="${item.c_index}">수정</button></td>
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

function setupPagination(data) {
    const totalPages = Math.ceil(data.length / rowsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', () => {
            currentPage = i;
            displayTable(data, currentPage);
            setupPagination(data);
        });
        pagination.appendChild(li);
    }
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
    fn_getCustomerData();
    displayTable(data, currentPage);
    setupPagination(data);

    $('#passModal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        var modal = $(this);
        // m_index 값이 4인 항목의 m_name 출력
        
        const item = data.find(entry => entry.c_index == recipient);
        if (item) {
            modal.find('.modal-title').text('회원정보 수정');
            $('#recipient-name').val(item.c_name); // ID 설정
            $('#recipient-call').val(item.c_call); // ID 설정
            $('#recipient-address1').val(item.c_address1);
            $('#recipient-address2').val(item.c_address2);
            $('#recipient-index').val(item.c_index);
        } else {
            console.log("m_index가 4인 항목을 찾을 수 없습니다.");
        }

        //비밀번호 번경
        document.getElementById('btn_up_pw').addEventListener('click', function() {
            // 버튼 클릭 시 실행할 코드 작성
            let up_index = $('#recipient-index').val(); // index값
            let up_name = $('#recipient-name').val(); // 이름 설정
            let up_call = $('#recipient-call').val();
            let up_address1 = $('#recipient-address1').val();
            let up_address2 = $('#recipient-address2').val();
            
            // 예시: 버튼 클릭 시 알림을 띄우기
            API.updateCustomer(up_index, up_name, up_call, up_address1, up_address2, (resp) => {
                if (resp.success) {
                    alert('회원정보 수정이 성공하였습니다.');
                    fn_getCustomerData();
                    displayTable(data, currentPage);
                    setupPagination(data);
                } else {
                    console.log('fail');
                    alert('회원정보 수정이 실패 하였습니다.');
                }
            });
            
            
            
            // 추가로 실행할 작업을 이곳에 추가할 수 있습니다.
        });
    })
});
