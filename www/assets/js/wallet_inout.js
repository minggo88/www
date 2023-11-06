setTimeout(function() {
    $("#title_2").hide()
    $("#title_2_on").show()
}, 500);

const fn_total = function () {
    check_login();

	API.getMyOrderList(search_type, (resp) => {
		console.log(resp);
		if(resp.success) {
            if(resp.payload.length > 0) {
                
				$('[name="d-grid--empty"]').removeClass('d-grid--empty');
				$('[name="grid--empty"]').hide();
                resp.payload.filter(function(item) {
					if (item.crypto_currency === 'N') {
						return false; // skip
					}
					return true;
				}).map((item) => {
                    
					const item2 = [{txn_type: 'R', t_pdate: '2023-07-28 00:00:05', regdate: '2023-07-25 12:25:05', amount: '1000'}
					,{txn_type: 'R', txndate: '1', t_pdate: '2023-07-25 00:00:05', regdate: '2023-07-24 12:25:05', amount: '10000'}
					,{txn_type: 'R', txndate: '1', t_pdate: '2023-07-24 00:00:05', regdate: '2023-07-23 12:25:05', amount: '3000'}];

					//for (const d_item of item2) {

					//item2 = [item];
					for (const d_item of item2) {
						const t_type = d_item.txn_type;
						const t_time = d_item.regdate;
						const t_cnt = d_item.amount;
						
						var font_c = "var(--red-up)";
						const grid_type ="입금";

						if(d_item.txn_type != 'R'){
							font_c = "var(--blue-dn)";
							grid_type ="출금";
						}

						const grid_type2 = grid_type + " 완료";


						const grid = $(`<table class="cancel_list" />`);
						grid.append(`
							<tr class="cancel_list_left">
								<td rowspan="2" id="cancel_table_check" style="width: 10%; text-align: center; padding-left:5px !important; " class='item_name'><input type="checkbox" class="checkbox" style=" color: ${font_c};" value="${grid_type}"></td>
								<td id="cancel_table_right1" style="width: 60%; text-align: center;" class='item_grade'>${t_time}</td>
								<td id="cancel_table_right1" style="width: 30%; text-align: center;" class="rdate">${t_cnt}</td>
							</tr>
							<tr class="cancel_list_left">
								<td id="cancel_table_right2" style="width: 10%; text-align: center;" class='item_grade'>상태</td>
								<td id="cancel_table_right2" style="width: 60%; text-align: center;" class="rdate">${grid_type2}</td>
							</tr>
						`);
						$('.wallet--grid').append(grid);
					}
                });
            }
        }else{
            $('#loading_text').hide();
            $('#empty_text').show();
            console.log('fail');
        } 
    });
}

//dropdown 버튼 이벤트
document.addEventListener("DOMContentLoaded", function() {
    // "dropdown_date" 드롭다운에서 항목을 클릭할 때 이벤트 핸들러 추가
    var dropdownDateItems = document.querySelectorAll('.dropdown-wrapper[name="dropdown_date"] ul li button');
    dropdownDateItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // 클릭된 항목의 텍스트를 가져와서 "dropdown_date_selected" 버튼의 텍스트로 설정
            var selectedDropdownDate = item.textContent;
            document.getElementById('dropdown_date_selected').textContent = selectedDropdownDate;
        });
    });

    // "dropdown_type" 드롭다운에서 항목을 클릭할 때 이벤트 핸들러 추가
    var dropdownTypeItems = document.querySelectorAll('.dropdown-wrapper[name="dropdown_type"] ul li button');
    dropdownTypeItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // 클릭된 항목의 텍스트를 가져와서 "dropdown_type_selected" 버튼의 텍스트로 설정
            var selectedDropdownType = item.textContent;
            document.getElementById('dropdown_type_selected').textContent = selectedDropdownType;
        });
    });
});

//option 버튼 이벤트
function changeStyle(button) {
	// 모든 버튼을 기본 스타일로 초기화
	var buttons = document.querySelectorAll(".option_div");
	const value = button.getAttribute('value');
	  console.log('클릭한 버튼의 value 값:', value);
	for (var i = 0; i < buttons.length; i++) {
	  buttons[i].style.border = "1px solid #999999";
	  buttons[i].style.color = "#999999";
	}

	if(value ==''){
		$('#search_type').val('전체');
		$('#trade_type').val('');
		selected_category = '';
	}else if(value =='buy'){
		$('#search_type').val('매수');
		$('#trade_type').val('b');
		selected_category = 'buy';
	}else{
		$('#search_type').val('매도');
		$('#trade_type').val('s');
		selected_category = 'sell';
	}
  
	// 클릭된 버튼에 새로운 스타일 적용
	button.style.border = "1px solid var(--red-up)";
	button.style.color = "var(--red-up)";
}

function changeStyle2(button) {
	// 모든 버튼을 기본 스타일로 초기화
	var buttons = document.querySelectorAll(".option_div2");
	const value = button.getAttribute('value');
	  console.log('클릭한 버튼의 value 값:', value);
	for (var i = 0; i < buttons.length; i++) {
	  buttons[i].style.border = "1px solid #999999";
	  buttons[i].style.color = "#999999";
	}
  
	// 클릭된 버튼에 새로운 스타일 적용
	button.style.border = "1px solid var(--red-up)";
	button.style.color = "var(--red-up)";

	//날자 변경
	var startInput = document.getElementById('start');
	var endInput = document.getElementById('end');
	var startInput2 = document.getElementById('start2');
	var endInput2 = document.getElementById('end2');
	
	if(value<1){
		startInput.value = getOneWeekAgoDate();
		startInput2.value = getOneWeekAgoDate();
		$('#search_date').val('일주일');
	}else if(value>99){
		$('#search_date').val('임의입력');
	}else{
		startInput.value = getNDaysAgo(value);
		startInput2.value = getNDaysAgo(value);
		if(value==12){
			$('#search_date').val('1년');
		}else{
			const date_text = value + '개월';
			$('#search_date').val(date_text);
		}
	}
	 // 오늘 날짜 설정
	if(value<99){
		endInput.value = getTodayDate();	
		endInput2.value = getTodayDate();	
	}
	
}

function changeStyle3(button){
	const directInputOption = document.querySelector('.transaction-select .option_div2[value="100"]');
	if (directInputOption) {
		directInputOption.click();
		console.log(`Clicked: ${directInputOption.textContent}`);
	}
}

// 오늘 날짜를 가져오는 함수
function getTodayDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

// 일주일 전 날짜를 가져오는 함수
function getOneWeekAgoDate() {
	const today = new Date();
	today.setDate(today.getDate() - 7);
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getNDaysAgo(n) {
  const today = new Date();
  today.setMonth(today.getMonth() - n);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

window.addEventListener('load', function() {
	// 선택 상자 엘리먼트를 가져옵니다.
	var selectBox = document.getElementById("menuSelect");
	var search_type = 0;
	// 선택 상자의 값이 변경될 때 알림을 표시하는 이벤트 핸들러를 추가합니다.
	selectBox.addEventListener("change", function() {
		var selectedValue = selectBox.value;
		if (selectedValue === "all") {
			search_type = 0;
			alert("전체를 선택했습니다.");
		} else if (selectedValue === "deposit") {
			search_type = 1;
			alert("입금을 선택했습니다."  + search_type);
		} else if (selectedValue === "withdraw") {
			search_type = 2;
			alert("출금을 선택했습니다." + search_type);
		}
	});

	fn_total();
});

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
const check_login = function (msg) {
    if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
        if (msg) alert(msg);
        window.location.href = LOGIN_PAGE;
    }
}
const check_logout = function (msg) {
    if (Model.user_info && Model.user_info.userid && Model.user_info.userno) {
        if (msg) alert(msg);
        window.location.href = "/";
    }
}