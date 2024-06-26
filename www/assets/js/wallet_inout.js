setTimeout(function() {
    $("#title_3").hide();
    $("#title_3_on").show();
}, 500);

setTimeout(function() {
	check_login();
}, 300);

var search_type = 0;

const fn_total_money = function(){
	API.getBalance('ALL', '', (resp) => {
		let total_evaluated_balance = 0; // 총 보유 자산
		let total_buyable_balance = 0; // 총 구매 가능 자산
		let total_money = 0;

		// console.log('getBalance resp:', resp);
		if(resp.payload.length > 0) {
			resp.payload.filter(function(item) {
				if (item.crypto_currency === 'N') {
					return false; // skip
				}
				return true;
			}).map((item) => {

				// 원은 목록에서 제거
				if (item.symbol==='KRW') {
					total_buyable_balance = item.confirmed;
				}
				// 다른 화폐 제거
				if(item.symbol ==='USD' || item.symbol ==='ETH'){
					return;
				}

				//console.log(item);
				//console.log("평가수익 : "+item.eval_income);

				//기존 item.confirmed > 0 -> 기준 오류(모둔 상품이 거래가 있을시 0으로 계산 됨)
				if (item.valuation > 0 || item.symbol=='KRW' ) {
					item.eval_valuation = item.valuation * item.price;	// 코인의 전체 평가금액
					if(typeof item.eval_income != typeof undefined){
						//total_income += item.eval_income;                   // 총 수입
					}
					total_money = item.total_money;                        // 현금보유

					total_evaluated_balance += item.eval_valuation; 		// 총 보유 자산
				}

			})

			//총보유자산
			//let num = total_evaluated_balance*1 + total_buyable_balance*1;
			let num = total_money;
			//var divElement = document.querySelector('.firsth_title_2');
			//var pElement = divElement.querySelector('p');
			//pElement.textContent = real_number_format(num,0);
			console.log("총금액 : " + num);
			fn_total();
			// 원래의 값을 가져와서 쉼표로 구분하여 표시
			let originalValue = document.getElementById("total_money").textContent;
			let formattedValue = numberWithCommas(num);
			document.getElementById("total_money").textContent = formattedValue;
		}
	})
}

const fn_total = function () {
    check_login();
	$('.wallet--grid').empty();

	API.getMyInoutList(search_type, (resp) => {
		console.log(resp.payload.data.length);
		if(resp.success) {
            if(resp.payload.data.length > 0) {
				console.log(resp);
                
				$('[name="d-grid--empty"]').removeClass('d-grid--empty');
				$('[name="grid--empty"]').hide();
                resp.payload.data.filter(function(item) {
					if (item.crypto_currency === 'N') {
						return false; // skip
					}
					return true;
				}).map((item) => {
					console.log(item);
					console.log(search_type);

					const item3 = [item];
					//for (const d_item of item2) {

					//item2 = [item];
					for (const d_item of item3) {
						const t_time = d_item.regdate;
						const t_cnt = numberWithCommas(d_item.amount);
						const t_status = d_item.status;
						
						var font_c = "var(--red-up)";
						var grid_type ="입금";

						if(d_item.txn_type != 'R'){
							font_c = "var(--blue-dn)";
							grid_type ="출금";
						}

						var txt_status = " 완료";
						
						if(t_status == "O"){
							txt_status = " 진행 중";
						} else if(t_status == "C"){
							txt_status = " 취소";
						} else if(t_status == "P"){
							txt_status = " 처리 중";
						}

						const grid_type2 = txt_status;

						const grid = $(`<table class="myinout_list" />`);
						grid.append(`
							<tr class="myinout_list_left">
								<td id="myinout_table_check" style="color: ${font_c};" class='item_name'>${grid_type}</td>
								<td id="myinout_table_right1" class='item_grade'>${t_time}</td>
								<td id="myinout_table_right1_2" style="text-align: right; color: ${font_c};" class="rdate">${t_cnt}</td>
							</tr>
							<tr class="myinout_list_left2">
								<td id="myinout_table_right2_1" class='item_grade'>상태</td>
								<td id="myinout_table_right2_2" class="rdate">${grid_type2}</td>
							</tr>
						`);

						if((search_type = 1 && d_item.txn_type == 'R') || (search_type = 2 && d_item.txn_type != 'R') || (search_type == 0)){
							$('.wallet--grid').append(grid);	
						}
						
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

window.addEventListener('load', function() {
	// 선택 상자 엘리먼트를 가져옵니다.
	var selectBox = document.getElementById("menuSelect");
	
	// 선택 상자의 값이 변경될 때 알림을 표시하는 이벤트 핸들러를 추가합니다.
	selectBox.addEventListener("change", function() {
		var selectedValue = selectBox.value;
		if (selectedValue === "all") {
			search_type = 0;
			fn_total();
		} else if (selectedValue === "deposit") {
			search_type = 1;
			fn_total();
		} else if (selectedValue === "withdraw") {
			search_type = 2;
			fn_total();
		}
	});
	fn_total_money();
});

const check_login = function () {
    if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
        alert('로그인 해주세요');
		const LOGIN_PAGE = '/login.html';
        window.location.href = LOGIN_PAGE;
    }
}
const check_logout = function (msg) {
    if (Model.user_info && Model.user_info.userid && Model.user_info.userno) {
        if (msg) alert(msg);
        window.location.href = "/";
    }
}

// 숫자를 3자리마다 쉼표로 구분하는 함수
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}