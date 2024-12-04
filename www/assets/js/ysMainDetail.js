const smsData = [];
const data = [];
const data2 = [];

const fn_getData = function (num) {
    // check_login();
    API.getSmsDetailData(num, (resp) => {
        if (resp.success) {
            //console.log(smsData);
            smsData.length = 0; // 기존 내용을 초기화
            smsData.push(...resp.payload); 
            const item = smsData.find(entry => entry.sms_index == num);
            //console.log(item);
            // 예시로 name 값을 설정
            let name = item.name;  // `(`와 `)`가 있는 경우
            // let name = "textOnly";   // `(`와 `)`가 없는 경우
            
            let text1 = '';
            let text2 = '';
            
            // `(`가 있는지 확인하고 처리
            if (name.includes('(')) {
                // '('를 기준으로 분리하고, ')'는 생략
                let parts = name.split('(');  // '('로 나누기
                text1 = parts[0];  // 첫 번째 부분(text1)
                text2 = parts[1].replace(')', '');  // 두 번째 부분에서 ')'를 제거
            } else {
                // '('가 없으면 text2에 전체 값을 넣음
                text2 = name;
            }
            document.getElementById("context").value = item.tvalue;;
            document.getElementById("receive_name").value = text1;
            document.getElementById("receive_call").value = text2;
            if(text1 != ''){
                API.getCustomerData(text1 ,text2 , (resp) => {
                    if (resp.success) {
                        console.log(resp);
                        document.getElementById("receive_address1").value = resp.payload[0].c_address1;
                        document.getElementById("receive_address2").value = resp.payload[0].c_address2;
                    }else{
                        console.log('fail');
                    }
                });
            }

            generatePosts();
            //document.getElementById("address").value = item.;

            
        } else {
            console.log('fail');
        }
    });
}

let currentPage = 1;
const itemsPerPage = 5;
const pagesPerGroup = 10; // 한 그룹당 페이지 버튼 수
let currentGroup = 1; // 현재 페이지 그룹

function generatePosts() {
    const titles = smsData.map(item => item.tvalue);
    const contentSamples = smsData.map(item => item.tvalue);
    const time = smsData.map(item => item.stime);
    const data_index = smsData.map(item => item.sms_index);
    const completeYN = smsData.map(item => item.complete);
    renderPage(titles, contentSamples,time,data_index,completeYN);
}

function renderPage(titles, contentSamples, time, data_index, completeYN) {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    console.log(smsData);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = titles.slice(startIndex, endIndex);
    const currentContents = contentSamples.slice(startIndex, endIndex);
    const currentTime = time.slice(startIndex, endIndex);
    const currentIndex = data_index.slice(startIndex, endIndex);
    const currentComplete = completeYN.slice(startIndex, endIndex);
    
    
    
    for (let i = 0; i < currentItems.length; i++) {
        const post = document.createElement("div");
        post.className = "post";
        post.setAttribute("data_index", `${currentIndex[i]}`); // 1~99 사이 랜덤 값 설정

        const title = document.createElement("div");
        title.className = "title";
        title.textContent = currentItems[i].length > 50 ? currentItems[i].slice(0, 50) + "..." : currentItems[i];
        title.setAttribute("onclick", "toggleContent(this)");

        const meta = document.createElement("div");
        meta.className = "meta";
        const comText = '미완료';
        //console.log(i);
        //console.log(currentComplete[i]);
        if (currentComplete[i] === 'N') {
            meta.textContent = `시간: ${currentTime[i]} / 상태: 미완료`;
            meta.style.color = "#dc3545";
        } else {
            meta.textContent = `시간: ${currentTime[i]} / 상태: 완료`;
            meta.style.color = "#28a745";
        }
        

        const content = document.createElement("div");
        content.className = "content";
        content.style.display = "none";
        content.textContent = currentContents[i];

        // 버튼 추가
        const buttonContainer = document.createElement("div");
        buttonContainer.className = "button-container";

        const completeButton = document.createElement("button");
        completeButton.textContent = "완료";
        completeButton.onclick = () => markComplete(currentIndex[i],post);

        const incompleteButton = document.createElement("button");
        incompleteButton.textContent = "미완료";
        incompleteButton.onclick = () => markIncomplete(currentIndex[i],post);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.onclick = () => deletePost(currentIndex[i],post);

        buttonContainer.appendChild(completeButton);
        buttonContainer.appendChild(incompleteButton);
        buttonContainer.appendChild(deleteButton);

        post.appendChild(title);
        post.appendChild(meta);
        post.appendChild(content);
        content.appendChild(buttonContainer);
        board.appendChild(post);
    }

    renderPagination(titles.length);
}

function renderPagination(totalItems) {
    const pagination = document.querySelector(".pagination");
    pagination.innerHTML = "";

    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const totalGroups = Math.ceil(totalPages / pagesPerGroup);
    const startPage = (currentGroup - 1) * pagesPerGroup + 1;
    const endPage = Math.min(startPage + pagesPerGroup - 1, totalPages);

    for (let i = startPage; i <= endPage; i++) {
        const button = document.createElement("button");
        button.textContent = i;
        button.className = i === currentPage ? "active" : "";
        button.onclick = () => {
            currentPage = i;
            generatePosts();
        };
        pagination.appendChild(button);
    }

    if (endPage < totalPages) {
        const nextGroupButton = document.createElement("button");
        nextGroupButton.textContent = ">";
        nextGroupButton.onclick = () => {
            currentGroup++;
            renderPagination(totalItems);
        };
        pagination.appendChild(nextGroupButton);
    }

    if (currentGroup > 1) {
        const prevGroupButton = document.createElement("button");
        prevGroupButton.textContent = "<";
        prevGroupButton.onclick = () => {
            currentGroup--;
            renderPagination(totalItems);
        };
        pagination.insertBefore(prevGroupButton, pagination.firstChild);
    }
}

function toggleContent(element) {
    const content = element.nextElementSibling.nextElementSibling;
    const buttonContainer = content.nextElementSibling; // 버튼 컨테이너

    if (content.style.display === "block") {
        content.style.display = "none";
        buttonContainer.style.display = "none"; // 버튼 숨기기
    } else {
        content.style.display = "block";
        buttonContainer.style.display = "flex"; // 버튼 보이기
    }
}

function markComplete(index, post) {
    event.preventDefault(); // 기본 동작 중지
    API.upSMSStateData('Y' ,index , (resp) => {
        // post 요소 내에서 meta 요소를 찾음
        const meta = post.querySelector(".meta");
        if (meta) {
                meta.textContent = `시간: ${new Date().toLocaleString()} / 상태: 완료`; // 시간 갱신
                meta.style.color = "#28a745"; // 글자색 초록색으로 변경
        }else{
            console.log('fail');
        }
    });

    
    return;
}

function markIncomplete(index, post) {
    event.preventDefault(); // 기본 동작 중지
    API.upSMSStateData('N' ,index , (resp) => {
        // post 요소 내에서 meta 요소를 찾음
        const meta = post.querySelector(".meta");
        if (resp.success) {
            meta.textContent = `시간: ${new Date().toLocaleString()} / 상태: 미완료`;
            meta.style.color = "#dc3545";
        }else{
            console.log('fail');
        }
    });
    return;
}

function deletePost(index, post) {
    event.preventDefault(); // 기본 동작 중지
    API.upSMSStateData('D' ,index , (resp) => {
        // post 요소 내에서 meta 요소를 찾음
        const meta = post.querySelector(".meta");
        if (resp.success) {
            generatePosts();
        }else{
            console.log('fail');
        }
    });
    location.reload(); // 버튼 클릭 시 페이지 새로 고침    
}

const fn_ysCompleteOrder = function (c_index, c_name, c_call, c_address1, c_address2, c_order, c_ordernum, sendtext) {
    // check_login();
    API.ysCompleteOrder(c_index, c_name, c_call, c_address1, c_address2, c_order, c_ordernum, sendtext, (resp) => {
        console.log(resp);
        if (resp.success) {
            smsData.length = 0; // 기존 내용을 초기화
            smsData.push(...resp.payload); 
            const item = smsData.find(entry => entry.sms_index == num);

            
            
            // 예시로 name 값을 설정
            let name = item.name;  // `(`와 `)`가 있는 경우
            // let name = "textOnly";   // `(`와 `)`가 없는 경우
            
            let text1 = '';
            let text2 = '';
            
            // `(`가 있는지 확인하고 처리
            if (name.includes('(')) {
                // '('를 기준으로 분리하고, ')'는 생략
                let parts = name.split('(');  // '('로 나누기
                text1 = parts[0];  // 첫 번째 부분(text1)
                text2 = parts[1].replace(')', '');  // 두 번째 부분에서 ')'를 제거
            } else {
                // '('가 없으면 text2에 전체 값을 넣음
                text2 = name;
            }
            document.getElementById("context").value = resp.payload[0].tvalue;;
            document.getElementById("detail_name").value = text1;
            document.getElementById("detail_call").value = text2;
            if(text1 != ''){
                API.getCustomerData(text1 ,text2 , (resp) => {
                    if (resp.success) {
                        console.log(resp);
                        document.getElementById("address").value = resp.payload[0].c_address1;
                        document.getElementById("address2").value = resp.payload[0].c_address2;
                    }else{
                        console.log('fail');
                    }
                });
            }
            //document.getElementById("address").value = item.;

            
        } else {
            console.log('fail');
        }
    });
}

const fn_getItem = function(){
    API.getItemTypeData((resp) => {
        if (resp.success) {
            data.length = 0; // 기존 내용을 초기화
            data.push(...resp.payload); // payload 데이터를 data에 추가

            // select 요소를 선택
            const selectElement = document.getElementById('item_type');
            
            // 기존 내용 초기화
            selectElement.innerHTML = '';
            
            // 기본 선택 옵션 추가
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Choose...';
            selectElement.appendChild(defaultOption);
            
            // data 배열을 순회하며 옵션 추가
            data.forEach(item => {
                const option = document.createElement('option');
                option.value = item.itype_index;  // itype_index를 value로 사용
                option.textContent = item.itype_name;  // itype_name을 표시 텍스트로 사용
                selectElement.appendChild(option);
            });
        } else {
            console.log('fail');
        }
    });
}

function validateForm(index_num) {
    let isValid = true;

    // 필드 가져오기
    const detailName = document.getElementById('detail_name');
    const detailCall = document.getElementById('detail_call');
    const address1 = document.getElementById('address');
    const address2 = document.getElementById('address2');
    const itemType = document.getElementById('item_type');
    const item = document.getElementById('item');
    const detailEa = document.getElementById('detail_ea');
    const t_sendtext = document.getElementById('sendtext');

    // 이름 필드 확인
    if (!detailName.value.trim()) {
        isValid = false;
        alert("이름을 입력해 주세요.");
        return;
    }

    // 전화번호 필드 확인
    if (!detailCall.value.trim()) {
        isValid = false;
        alert("전화번호를 입력해 주세요.");
        return;
    }

    // 주소1 필드 확인
    if (!address1.value.trim()) {
        isValid = false;
        alert("주소1을 입력해 주세요.");
        return;
    }

    // 대분류 선택 확인
    if (!itemType.value.trim()) {
        isValid = false;
        alert("대분류를 선택해 주세요.");
        return;
    }

    // 신청 품목 선택 확인
    if (!item.value.trim()) {
        isValid = false;
        alert("신청 품목을 선택해 주세요.");
        return;
    }

    // 수량 필드 확인
    if (!detailEa.value.trim() || isNaN(detailEa.value.trim()) || detailEa.value.trim() <= 0) {
        isValid = false;
        alert("유효한 수량을 입력해 주세요.");
        return;
    }

    // 최종 검증 결과에 따른 행동
    if (isValid) {
        //alert("주문이 완료되었습니다!");
        
        // 실제 제출 로직 추가 가능
    } else {
        alert("필수 항목을 모두 올바르게 입력해 주세요.");
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
    const urlParams = new URLSearchParams(window.location.search);
    const smsIndex = urlParams.get('sms_index');  // 'sms_index' 값 추출

    fn_getData(smsIndex);
    fn_getItem();

    const selectElement = document.getElementById('item_type');

    // change 이벤트 리스너 추가
    selectElement.addEventListener('change', function() {
        // 선택된 value 값 출력
        API.getItemData(selectElement.value, (resp) => {
            if (resp.success) {
                console.log(resp)
                data2.length = 0; // 기존 내용을 초기화
                data2.push(...resp.payload); // payload 데이터를 data에 추가
    
                // select 요소를 선택
                const selectElement = document.getElementById('item');
                
                // 기존 내용 초기화
                selectElement.innerHTML = '';
                
                // 기본 선택 옵션 추가
                const defaultOption = document.createElement('option');
                defaultOption.value = '';
                defaultOption.textContent = 'Choose...';
                selectElement.appendChild(defaultOption);
                
                // data 배열을 순회하며 옵션 추가
                data2.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.item_index;  // itype_index를 value로 사용
                    option.textContent = item.i_value;  // itype_name을 표시 텍스트로 사용
                    selectElement.appendChild(option);
                });
            } else {
                console.log('fail');
            }
        });
    });
    
    const btnComplete = document.getElementById('btn_complete');

    // 클릭 이벤트 리스너 추가
    btnComplete.addEventListener('click', function(event) {
        event.preventDefault(); // 기본 동작 중지
        // 클릭 시 실행될 코드 작성
        validateForm(smsIndex);

        const detailName = document.getElementById('detail_name');
        const detailCall = document.getElementById('detail_call');
        const address1 = document.getElementById('address');
        const address2 = document.getElementById('address2');
        const itemType = document.getElementById('item_type');
        const item = document.getElementById('item');
        const detailEa = document.getElementById('detail_ea');
        const t_sendtext = document.getElementById('sendtext');
        fn_ysCompleteOrder(smsIndex, detailName, detailCall, address1, address2, item, detailEa, t_sendtext);
        
    });
    
    

});

document.addEventListener("DOMContentLoaded", function () {
    const createIdButtons = document.querySelectorAll(".create-id-btn");

    createIdButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();

            const targetId = button.getAttribute("data-target");
            const collapseElement = document.querySelector(targetId);

            if (collapseElement) {
                //console.log(`Toggling collapse for: ${targetId}`);

                // Bootstrap 5.1.0 이하 버전을 위한 인스턴스 관리
                if (collapseElement.classList.contains('show')) {
                    $(collapseElement).collapse('hide');
                } else {
                    $(collapseElement).collapse('show');
                }
            } else {
                //console.error(`Collapse element with target ${targetId} not found.`);
            }
        });
    });
});


// 본문 토글 함수
    function toggleContent(element) {
      const content = element.nextElementSibling.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
    }
