const data = [];
const data2 = [];

const fn_getItemTypeData = function () {
    // check_login();
    API.getItemTypeData((resp) => {
        if (resp.success) {
            console.log(resp);
            data.length = 0; // 기존 내용을 초기화
            data.push(...resp.payload); // payload 데이터를 data에 추가
            data.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.itype_name; // 항목 이름 사용
                div.setAttribute('data-index', item.itype_index); // 아이템 인덱스 저장
                div.onclick = () => selectItem(div);
                listBox.appendChild(div);
            });
        } else {
            console.log('fail');
        }
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
    

    
    
});
