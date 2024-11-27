const fn_getData = function () {
//    check_login();
    API.getSmsData((resp) => {
        if(resp.success) {
            console.log(resp);
            const smsData = [
                { "sms_index": "42", "name": "01099996577", "tvalue": "[문앞배송완료] 주문하신 배달상품(음식)을 안전하게 배송 완료했습니다.", "stime": "2024-11-22 20:13:15", "complete": "N", "complete_manager": "" },
                { "sms_index": "41", "name": "027081007", "tvalue": "", "stime": "2024-11-21 12:32:05", "complete": "N", "complete_manager": "" },
                { "sms_index": "40", "name": "15889955", "tvalue": "", "stime": "2024-11-21 11:47:43", "complete": "N", "complete_manager": "" },
                { "sms_index": "38", "name": "01051445940", "tvalue": ":", "stime": "2024-11-20 21:18:38", "complete": "N", "complete_manager": "" },
                { "sms_index": "34", "name": "15995000", "tvalue": "[Web발신][우리은행]본인확인 인증번호 5139 (타인제공금지) qO96WTeHvcR", "stime": "2024-11-20 21:18:38", "complete": "N", "complete_manager": "" },
                { "sms_index": "33", "name": "15995000", "tvalue": "[Web발신][우리은행] 김*규님 11/20 10:23 인증서 (재)발급신청중/본인 아니면 즉시신고요망", "stime": "2024-11-20 21:18:38", "complete": "N", "complete_manager": "" }
                // 더 많은 데이터 추가 가능
              ];
          
              const rowsPerPage = 15;
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
                      <td>${item.tvalue || 'N/A'}</td>
                      <td>${item.name}</td>
                      <td>${item.stime}</td>
                      <td>${item.complete === 'Y' ? '완료' : '미완료'}</td>
                      <td>${item.complete_manager || 'N/A'}</td>
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
          
              document.addEventListener('DOMContentLoaded', () => {
                displayTable(smsData, currentPage);
                setupPagination(smsData);
              });
        }else{
            console.log('fail');
        } 
    });
}

const dateChange = function(dateTime){
    var dateObj = new Date(dateTime);
    // 년, 월, 일 추출
    var year = dateObj.getFullYear();
    var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    var day = ('0' + dateObj.getDate()).slice(-2);
    
    // 'yyyy-mm-dd' 형식으로 결과 출력
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}
const stateChage = function(text){
    if(text == 'R'){
        return "배달 준비중"
    }else if(text == 'C'){
        return "취소"
    }else if(text == 'D'){
        return "배달 완료"
    }
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
});


