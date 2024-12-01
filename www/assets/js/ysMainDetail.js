const fn_getData = function () {
    // check_login();
    API.getSmsData((resp) => {
        if (resp.success) {
            console.log(resp.payload);
            // 기존 내용 초기화
            smsData.length = 0;
            
            // 새 데이터 추가
            smsData.push(...resp.payload);
            displayTable(resp.payload, currentPage);
            console.log("=========================");
            console.log(resp.payload);
            console.log(currentPage);
            setupPagination(resp.payload);
        } else {
            console.log('fail');
        }
    });
}

const dateChange = function(dateTime) {
    var dateObj = new Date(dateTime);
    // 년, 월, 일 추출
    var year = dateObj.getFullYear();
    var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    var day = ('0' + dateObj.getDate()).slice(-2);
    
    // 'yyyy-mm-dd' 형식으로 결과 출력
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}

const smsData = [];
const rowsPerPage = 9;
let currentPage = 1;

function displayTable(data, page) {
    const tableBody = document.getElementById('smsTableBody');
    tableBody.innerHTML = '';
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const pageData = data.slice(start, end);
    pageData.forEach((item, index) => {
        const row = `
            <tr>
                <td>${item.sms_index}</td>
                <td class="content-col">${formatText(item)}</td>
                <td>${item.name}</td>
                <td>${item.stime}</td>
                <td>
                    <span class="${item.complete === 'Y' ? 'status-complete' : 'status-incomplete'}">
                        <a href="./ys_main_detail.html?sms_index=${item.sms_index}">
                            ${item.complete === 'Y' ? '완료' : '미완료'}
                        </a>
                    </span>
                </td>
                <td>${item.complete_manager}</td>
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

function formatText(item) {
    let text = item.tvalue || '내용이 없습니다.';
    // 텍스트가 너무 길면 '...'으로 생략
    if (text.length > 140) { // 140글자 이상인 경우
        text = text.substring(0, 140) + '...';
    }
    // 텍스트가 2줄 이상이면 자동으로 줄임
    if (text.split('\n').length > 2) {
        text = text.split('\n').slice(0, 2).join('\n') + '...';
    }
    return text;
}

const check_login = function (redirectUrl = "/ys_login.html") {
    // 세션 값에서 id 확인
    const userId = sessionStorage.getItem("id"); // 세션 스토리지에서 'id'를 가져옴
    
    if (!userId) {
        // id가 없으면 로그인 페이지로 리다이렉트
        alert("로그인이 필요합니다.");
        window.location.href = redirectUrl;
    } else {
        console.log("로그인 상태 확인됨:", userId);
        // 추가 작업이 필요한 경우 여기에 작성
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
    fn_getData();
    displayTable(smsData, currentPage);
    setupPagination(smsData);
});
