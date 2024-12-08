const smsData = [];
const data = [];
const data2 = [];
const data3 = [];
let this_index = '';
let this_post = '';


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
                        //console.log(resp);
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
    //console.log(smsData);
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
        post.setAttribute("data_index", `${currentIndex[i]}`); 

        if (currentIndex[i] === this_index) {
            this_post = post;
        }

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
            defaultOption.textContent = '물품을 선택하세요';
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

const fn_gettext_type = function(){
    API.getEndTextData((resp) => {
        if (resp.success) {
           
            data3.length = 0; // 기존 내용을 초기화
            data3.push(...resp.payload); // payload 데이터를 data에 추가
             console.log(data3);
            // select 요소를 선택
            const selectElement = document.getElementById('text_type');
            
            // 기존 내용 초기화
            selectElement.innerHTML = '';
            
            // 기본 선택 옵션 추가
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '문장을 선택하세요';
            selectElement.appendChild(defaultOption);
            
            // data 배열을 순회하며 옵션 추가
            data3.forEach(item => {
                const option = document.createElement('option');
                
                // 문자열 처리: 30글자 이상일 경우 '...' 추가
                let tt = item.endt_text || '';  // item.endt_text가 없으면 빈 문자열로 대체
                if (tt.length > 30) {
                    tt = tt.substring(0, 30) + '...';
                }
            
                option.value = item.endt_text;  // itype_index를 value로 사용
                option.textContent = tt;         // tt를 표시 텍스트로 사용
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
    this_index = smsIndex;
    
    fn_getData(smsIndex);
    fn_getItem();
    fn_gettext_type();

    const selectElement = document.getElementById('item_type');

    // change 이벤트 리스너 추가
    selectElement.addEventListener('change', function() {
        // 선택된 value 값 출력
        API.getItemData(selectElement.value, (resp) => {
            if (resp.success) {
                //console.log(resp)
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

     const selectElement2 = document.getElementById('text_type');

    // change 이벤트 리스너 추가
    selectElement2.addEventListener('change', function() {
        // 선택된 value 값 출력
        const sendTextValue = document.getElementById('sendtext').value;
        document.getElementById('sendtext').value = selectElement2.value;
        console.log('하이');
    });
    
    const btnComplete = document.getElementById('btn_complete');

    // 클릭 이벤트 리스너 추가
    btnComplete.addEventListener('click', function(event) {
        event.preventDefault(); // 기본 동작 중지
                
        let sendtext = $('#sendtext').val();
        let receive_call =  $('#receive_call').val();
        // 메시지 내용 확인용 alert 표시
        let confirmationMessage = sendtext + '\n\n' + "위 내용을 전송합니다.";
        
        // 사용자 확인을 위한 confirm 창
        if (confirm(confirmationMessage)) {
            // 'Yes'를 누르면 API 호출
            API.ysSMSSend(receive_call, sendtext, (resp) => {
                console.log(resp);
                if (resp.success) {
                    console.log('전송성공');
                } else {
                    console.log('전송실패');
                }
            });
        } else {
            // 'No'를 누르면 전송 취소
            console.log('전송이 취소되었습니다.');
        }
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

    // 회원가입 버튼 클릭 이벤트
    const customerInputButton = document.getElementById('customer_input');
 
    customerInputButton.addEventListener('click', function() {
        let name = document.getElementById('receive_name').value.trim();
        let call = document.getElementById('receive_call').value.trim();
        let address1 = document.getElementById('receive_address1').value;
        let address2 = document.getElementById('receive_address2').value;
        
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
                //console.log(resp);
                alert('회원가입이 성공하였습니다.');
                
            } else {
                //console.log('fail');
                alert('회원가입이 실패 하였습니다.');
            }
        }); 
    });

    document.getElementById('btn_order').onclick = function () {
        const sendArray = [];
       

        const radioAddress1 = document.getElementById('radio_address1');
        const selectElement = document.getElementById('item');
        const selectedValue = selectElement.value; // 선택된 값
        
        

        let receive_address_ra = $('#receive_address1').val();
        if (radioAddress1.checked) {
            receive_address_ra = $('#receive_address1').val();
        } else {
            receive_address_ra = $('#receive_address2').val();
        }
        
        
        let newData = {
            send_name: $('#c_name').val(),
            send_call: $('#c_call').val(),
            send_address: $('#c_address').val(),
            payment_type: $('#input_type').val(),
            payment: $('#input_charge').val(),
            payment_name: $('#input_charge_name').val(),
            item : selectedValue,
            item_cnt : $('#detail_ea').val(),
            receive_name : $('#receive_name').val(),
            receive_call : $('#receive_call').val(),
            receive_address_num : document.getElementById('selectedAddress').innerHTML,
            receive_address : receive_address_ra
        };
        
        if(validateForm(newData)){
            let selectElement2 = '';
            let selectedValue2 = ''; // 선택된 값
            let selectedItemCnt2 = '';
            let selectElement5 = '';
            let selectedValue5 = ''; // 선택된 값
            let selectedItemCnt5 = '';
            let selectElement4 = '';
            let selectedValue4 = ''; // 선택된 값
            let selectedItemCnt4 = '';
            let selectElement3 = '';
            let selectedValue3 = ''; // 선택된 값
            let selectedItemCnt3 = '';
            console.log(itemCounter);
            switch (itemCounter) {
                case 3:
                    selectElement2 = document.getElementById('item_2');
                    selectedValue2 = selectElement2 ? selectElement2.value : '';
                    selectedItemCnt2 = $('#detail_ea_2').val();
                    break;
                case 4:
                    selectElement2 = document.getElementById('item_2');
                    selectedValue2 = selectElement2 ? selectElement2.value : '';
                    selectElement3 = document.getElementById('item_3');
                    selectedValue3 = selectElement3 ? selectElement3.value : '';
                    selectedItemCnt2 = $('#detail_ea_2').val();
                    selectedItemCnt3 = $('#detail_ea_3').val();
                    break;
                case 5:
                    selectElement2 = document.getElementById('item_2');
                    selectedValue2 = selectElement2 ? selectElement2.value : '';
                    selectElement3 = document.getElementById('item_3');
                    selectedValue3 = selectElement3 ? selectElement3.value : '';
                    selectElement4 = document.getElementById('item_4');
                    selectedValue4 = selectElement4 ? selectElement4.value : '';
                    selectedItemCnt2 = $('#detail_ea_2').val();
                    selectedItemCnt3 = $('#detail_ea_3').val();
                    selectedItemCnt4 = $('#detail_ea_4').val();
                    break;
                case 6:
                    selectElement2 = document.getElementById('item_2');
                    selectedValue2 = selectElement2 ? selectElement2.value : '';
                    selectElement3 = document.getElementById('item_3');
                    selectedValue3 = selectElement3 ? selectElement3.value : '';
                    selectElement4 = document.getElementById('item_4');
                    selectedValue4 = selectElement4 ? selectElement4.value : '';
                    selectElement5 = document.getElementById('item_5');
                    selectedValue5 = selectElement5 ? selectElement5.value : '';
                    selectedItemCnt2 = $('#detail_ea_2').val();
                    selectedItemCnt3 = $('#detail_ea_3').val();
                    selectedItemCnt4 = $('#detail_ea_4').val();
                    selectedItemCnt5 = $('#detail_ea_5').val();
                    break;
                default:
                    console.log('itemCounter 값이 범위를 벗어났습니다.');
                    break;
            }
            let newData2 = {
                send_name: $('#c_name').val(),
                send_call: $('#c_call').val(),
                send_address: $('#c_address').val(),
                payment_type: $('#input_type').val(),
                payment: $('#input_charge').val(),
                payment_name: $('#input_charge_name').val(),
                item : selectedValue,
                item_cnt : $('#detail_ea').val(),
                receive_name : $('#receive_name').val(),
                receive_call : $('#receive_call').val(),
                receive_address_num : document.getElementById('selectedAddress').innerHTML,
                receive_address : receive_address_ra,
                item2 : selectedValue2,
                item_cnt2 : selectedItemCnt2,
                item3 : selectedValue3,
                item_cnt3 : selectedItemCnt3,
                item4 : selectedValue4,
                item_cnt4 : selectedItemCnt4,
                item5 : selectedValue5,
                item_cnt5 : selectedItemCnt5
            };
            sendArray.push(newData2);
            console.log(sendArray);

            
            API.addOrder(sendArray, (resp) => {
                if (resp.success) {
                    markComplete(this_index,this_post);
                    alert('주문이 신청되었습니다.');
                    
                } else {
                    alert('주문이 실패하였습니다.\n 빈내역이 있습니다.\n 다시 확인해주세요');
                }
            })
        }
    };

    document.getElementById('btn_address_num').onclick = function () {
        // 다음 우편번호 서비스 팝업 호출
        new daum.Postcode({
            oncomplete: function (data) {
                // data 객체를 통해 선택한 주소 및 우편번호 정보 가져오기
                const fullAddress = data.address; // 전체 주소
                const zonecode = data.zonecode; // 우편번호

                // 선택한 주소를 표시
                document.getElementById('selectedAddress').innerHTML = 
                    `${zonecode}`;
            }
        }).open();
    };

    let itemCounter = 2; // ID의 숫자를 2부터 시작

    document.getElementById('add_item1').addEventListener('click', function () {
        // 최대 5개의 물품만 추가 가능
        if (itemCounter > 5) {
            alert("물품을 더 추가할 수 없습니다.");
            return; // 추가 작업 중단
        }
    
        // 기존의 check_item 요소를 가져옴
        const originalItem = document.querySelector('.check_item');
    
        // 새로운 요소를 복제
        const newItem = originalItem.cloneNode(true);
        
        // "추가하기" 버튼을 제거
        const addItemButton = newItem.querySelector('#add_item1');
        if (addItemButton) {
            addItemButton.remove();
        }
    
        // ID를 동적으로 변경 (기존 ID에 숫자를 추가)
        newItem.querySelectorAll('[id]').forEach(function (element) {
            const originalId = element.id; // 기존 ID
            
            element.id = `${originalId}_${itemCounter}`; // ID에 숫자 추가
        });

        // detail_ea로 복제된 input 요소의 값을 0으로 초기화
        const detailEaInput = newItem.querySelector(`#detail_ea_${itemCounter}`);
        if (detailEaInput) {
            detailEaInput.value = '';
        }
    
        
        // 복제된 요소를 기존 요소 아래에 추가
        originalItem.parentNode.appendChild(newItem);

        // 새롭게 추가된 item_type에 이벤트 리스너 추가
        const selectElement = newItem.querySelector(`#item_type_${itemCounter}`);
        let select_counter = itemCounter;
        console.log(selectElement);
        if (selectElement) {
            selectElement.addEventListener('change', function () {
                // 선택된 value 값 출력
                API.getItemData(selectElement.value, (resp) => {
                    if (resp.success) {
                        const data2 = []; // 기존 내용을 초기화
                        data2.push(...resp.payload); // payload 데이터를 data2에 추가
    
                        // 새롭게 추가된 select 요소
                        const itemSelectElement = newItem.querySelector(`#item_${select_counter}`);
                        console.log(itemCounter);
                        // 기존 내용 초기화
                        itemSelectElement.innerHTML = '';
    
                        // 기본 선택 옵션 추가
                        const defaultOption = document.createElement('option');
                        defaultOption.value = '';
                        defaultOption.textContent = 'Choose...';
                        itemSelectElement.appendChild(defaultOption);
    
                        // data 배열을 순회하며 옵션 추가
                        data2.forEach(item => {
                            const option = document.createElement('option');
                            option.value = item.item_index; // item_index를 value로 사용
                            option.textContent = item.i_value; // i_value를 표시 텍스트로 사용
                            itemSelectElement.appendChild(option);
                        });
                    } else {
                        console.log('fail');
                    }
                });
            });
        }

        // 카운터 증가
        itemCounter++;
        
    });

});


// 본문 토글 함수
function toggleContent(element) {
  const content = element.nextElementSibling.nextElementSibling;
  content.style.display = content.style.display === "block" ? "none" : "block";
}

function validateForm(data) {
    // 필수 입력값 체크
    for (const key in data) {
        if (!data[key] || data[key].trim() === '') {
            alert(`빈내역이 있습니다!`);
            return false;
        }
    }

    // receive_address_num 글자 길이 체크
    if (data.receive_address_num.length > 10) {
        alert('우편번호를 확인해주세요.');
        return false;
    }

    // 모든 조건 통과
    //console.log('Validation successful!');
    return true;
}

