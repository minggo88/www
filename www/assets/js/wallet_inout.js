setTimeout(function() {
    $("#title_3").hide();
    $("#title_3_on").show();
}, 500);

setTimeout(function() {
	check_login();
}, 300);

var search_type = 0;
var value = 0;

function showTab(tabNumber) {
    // 모든 탭 내용을 숨김
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`walle_inout_tab${i}`).style.display = 'none';
    }

    // 선택한 탭 내용을 표시
    document.getElementById(`walle_inout_tab${tabNumber}`).style.display = 'block';
	wallet_tab(tabNumber);

    // 모든 탭 버튼의 선택 상태를 초기화
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => button.classList.remove("selected"));

    // 선택한 탭 버튼에 선택 상태를 추가
    const selectedTabButton = document.querySelector(`.tab-button:nth-child(${tabNumber})`);
    selectedTabButton.classList.add("selected");
}

function wallet_tab(tabNumber){
	switch(tabNumber){
		case 1:
			fn_total_money();
			break;
		case 2:
			fn_wallet_deposit();
			break;
		case 3:
			fn_wallet_withdrawal();
			break;
		default :
			break;
		
	}
}

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

const fn_current_money = function(){
	API.getBalance('ALL', '', (resp) => {
		let total_evaluated_balance = 0; // 총 보유 자산
		let total_buyable_balance = 0; // 총 구매 가능 자산
		let total_money = 0;

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

				if (item.valuation > 0 || item.symbol=='KRW' ) {
					total_money = item.total_money;                        // 현금보유
				}

			})

			// 원래의 값을 가져와서 쉼표로 구분하여 표시
            //총출금금액
			let formattedValue = numberWithCommas(total_money);
			document.getElementById("max_money").value = formattedValue;
            //출금가능금액
            let formattedValue2 = numberWithCommas(total_money);
			//document.getElementById("able_out_max_money").value = formattedValue2;
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

function transferMaxAmount() {
    const sourceInput = document.getElementById("max_money");
    const amount = sourceInput.value;
  
    // "deposit_amount"에 값을 설정
    const depositAmountInput = document.querySelector("input[name=deposit_amount]");
    depositAmountInput.value = amount;
   var text2 = "최소가격은 10,000원 이상입니다.";
      if(amount.length>5){
          const newValue2 = amount.replace(/\D/g, '');
          const decreasedValue2 = parseInt(newValue2, 10) - 1000;			  
        // 숫자 형식으로 변경하여 입력 상자의 값 업데이트
        
        text2 = numberWithCommas(decreasedValue2) + " KRW";
      }
      
      const outMoneyT = document.getElementById('out_money_t');
      outMoneyT.value = text2;
  
  }

function fn_wallet_deposit (){
	//로그인 체크 필요
    //check_login();
    // access level 3
    // request_user_info();
    force_rander('user_info', Model.user_info);
    // 사이트 정보
    force_rander('site_info', Model.site_info);
    /*add_request_item('getConfig', {}, function (r) {
        if (r && r.success) {
            Model.site_info = r.payload;
        }
    });*/
    // 지갑 정보
    force_rander('user_wallet', Model.user_wallet); // 화면에 잔액 표시 후
    //get_user_wallet(); // DB 값으로 다시 잔액 표시

    const clipboard = new ClipboardJS('.btn--copy');
    clipboard.on('success', function (e) {
        alert('클립보드에 복사되었습니다.')
        e.clearSelection()
    });

    // 입금하기
    $('[name="btn-save-deposit"]').on('click', function () { 
        const symbol = "KRW";
        const $deposit_amount = $('[name=deposit_amount]');
        const deposit_amount = $.trim($deposit_amount.val()).replace(/[^0-9.]/g, "");
        if (deposit_amount <= 9999) {
            alert(__('입금액을 확인해주세요.')); $deposit_amount.select(); return false;
        }
        const $deposit_name = $('[name=deposit_name]');
        const deposit_name = $.trim($deposit_name.val());
        if (!deposit_name) {
            alert(__('입금자 이름을 입력해주세요.')); $deposit_name.select(); return false;
        }
        const address = $.trim($('[name=address]').val());
		
		//api.js로 넘기는 로직 통일
		API.deposit(symbol,deposit_amount, deposit_name, address, (resp) => {
			if(resp.success) {
				alert(__('입금 신청을 완료했습니다.'))
                $('[name=deposit_amount]').val('0');
                $('[name=deposit_name]').val('');
            } else {
                alert(__('입금 신청을 완료하지 못했습니다.'))
            }
		});

/*
        add_request_item('deposit', { 'symbol': symbol, 'deposit_amount': deposit_amount, 'deposit_name': deposit_name, 'address': address }, function (r) {
            if (r && r.success) {
                alert(__('입금 신청을 완료했습니다.'))
                $('[name=deposit_amount]').val('0');
                $('[name=deposit_name]').val('');
            } else {
                alert(__('입금 신청을 완료하지 못했습니다.'))
            }
        })*/
    })

}
/*
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
*/

/** 출금서비스 입력 **/
const fn_wallet_withdrawal = function () {
    fn_current_money();
    
    $('[name="pin_btn"]').on('click', function () { 
        $('#pin_number').addClass('modal--open');
    })

    

    // pin Number popup 띄우기
    $('[name="btn-save-widthdraw"]').on('click', function () { 
        const sourceInput = document.getElementById("max_money");
        const amount = sourceInput.value.replace(/\D/g, '');
        
        // <input> 요소의 name 속성을 사용하여 요소를 찾습니다.
        const depositAmountInput = document.querySelector("input[name=deposit_amount]");
        // 값을 가져옵니다.
        //const value = depositAmountInput.value;
		
        if(Math.max(value, amount) == value ){
            alert("출금은 출금 가능 금액에서 진행해 주세요.")
        }else if(value < 10000){
            alert("출금 최소 금액은 10,000원 이상입니다.")
        }else{
            $('#pin_number').addClass('modal--open');    
        }
        
    })

    // 출금신청
    $('#pin_number').submit((e) =>  { 
        e.preventDefault();
        let check = true
        let pin = ''

        $('#pin_number .grid--code input[type=number]').each((_index, elem) => {
            if(!$(elem).val()) {
                check = false
                $(elem).focus()
                return false
            }
            pin += $(elem).val();
        })
        
        if(check) {
            API.checkPin(pin, (resp) => {
                if(resp.success) {
                    // 출금액
                    //const amount = $('[name=amount]').val().replace(/[^0-9.]/g, "");
					let inputValue = $('#address').val(); 
					setTimeout(function() {
						// '/'를 기준으로 문자열을 나누기
						let splitValues = inputValue.split('/');
						
						// 공백을 제거하고 결과를 정리
						let text1 = splitValues[0].trim() + ' / ' + Model.user_info.bank_account;
						let text2 = splitValues[2].trim();
	
						
	                    // <input> 요소의 name 속성을 사용하여 요소를 찾습니다.
	                    const depositAmountInput = document.querySelector("input[name=deposit_amount]");
	                    // 값을 가져옵니다.
	                    const value = depositAmountInput.value;
						const symbol = 'KRW';
						
	                    const newValue2 = value.replace(/\D/g, '');
	                    const amount = parseInt(newValue2, 10) - 1000;
	                    //나라별 화폐 입력 필요
						const from_address = text1;//받을통장주소
	                    const to_address = text2;//사용자이름
	                    //const symbol = Model.withdraw_currency.symbol;

						console.log(amount);
						
					    //api.js로 넘기는 로직 통일
						
	                    API.withdraw(symbol, from_address, to_address, amount, pin, (resp) => {
	                        if(resp.success) {
	                            alert(__('출금신청을 완료했습니다.'));
	                            fn_current_money();
	                            $('[name=deposit_amount]').val('');
	                            $('#out_money_t').val('최소가격은 10,000원 이상입니다.');
	                        } else {				
	                            const msg = r?.error?.message || '';
	                            alert(__('출금신청을 완료하지 못했습니다.')+ ' '+msg);
	                        }
	                    });
						
	
	                    $('#pin_number').removeClass('modal--open'); //모달 창 닫아주기
	                    $('[name="pincode"]').val(""); //팝업창 비밀번호 초기화
					}, 500);
                } else {
                    alert(resp.error.message)
                }
            })
        }
        return false
    })
};

const fn_wallet_withdrawal_guide = function () {
    // check_login();
    // access level 4 
    force_rander('user_info', Model.user_info);
    // 사이트 정보
    force_rander('site_info', Model.site_info);
    add_request_item('getConfig', {}, function (r) {
        if (r && r.success) {
            Model.site_info = r.payload;
        }
    });
    // currency 정보 갱신
    let withdraw_symbol = 'KRW';// 필요시 dropdown 값 사용
    if (Model?.withdraw_currency?.symbol != withdraw_symbol) {
        add_request_item('getCurrency', {'symbol':withdraw_symbol}, function (r) {
            // out_max_volume_1day
            if (r && r.success) {
                c = r.payload[0];
                c.fee_out_str = c.fee_out_ratio > 0 ? number_format(c.fee_out_ratio * 100, 2) + ' %' : (c.fee_out > 0 ? real_number_format(c.fee_out) + ' ' + c.symbol : __('수수료 없음'));
                c.fee_out_intra_str = __('수수료 없음'); //'0 '+c.symbol
                c.out_min_volume_str = real_number_format(c.out_min_volume) + ' ' + c.symbol;
                c.out_max_volume_str = c.out_max_volume > 0 ? real_number_format(c.out_max_volume) + ' ' + c.symbol : __('제한 없음');
                Model.withdraw_currency = c;
            }
        });
    } else {
        force_rander('withdraw_currency', Model.withdraw_currency)
    }
};

function updateValue(input) {
    // 입력된 값에서 숫자만 추출
	const newValue = input.value.replace(/\D/g, '');
	
	if(newValue.length > 4){
		// -1000 한 값을 출력
		const decreasedValue = parseInt(newValue, 10) - 1000;
							
		// 숫자 형식으로 변경하여 입력 상자의 값 업데이트
		input.value = numberWithCommas(newValue);
		const text = numberWithCommas(decreasedValue);
	
		const outMoneyT = document.getElementById('out_money_t');
		outMoneyT.value = text + " KRW";
		value = newValue;
	}else if(newValue.length <= 4){
		const text = "최소가격은 10,000원 이상입니다.";
		const outMoneyT = document.getElementById('out_money_t');
		outMoneyT.value = text;
	}
}

(jQuery(function ($) {
	const force_rander = function (name, value) {
		// console.log('==force_rander== ', name);
		rander(name, value, value, true);
	}

    const rander = function (property, value, oldValue, force) {
		for (i in value) {
			// console.error('property:', property);
			// console.error('value:', value);
			// console.error('i:', i);
			// console.error('value[i]:', value[i]);
			// console.error('oldValue:', oldValue);
			// console.error('oldValue[i]:', oldValue[i]);
			let vn = value[i],
				vt = null,
				vo = oldValue && oldValue[i] ? oldValue[i] : '';
			if (vn !== vo || force) { // 값이 다를때만 수정하기.
				if (typeof vn == typeof {}) {
					rander(property + '.' + i, vn, vo, force);
				} else {
					// console.error('property:', property);
					// console.error('i:', i);
					// console.error('value:', value);
					// console.error('selector:', '[data-bind="' + property + '.' + i + '"]');
					$('[data-bind="' + property + '.' + i + '"]').each(function () {
						var tagname = this.tagName,
							tagname = tagname.toUpperCase(),
							format = $(this).attr('data-format');
						// 데이터 출력 형식 변경
						switch (format) {
							case 'table':
								const data = vn;
								const $target = $(this), $empty = $target.find('[name=empty]'), $search = $target.find('[name=search]');
								$search.hide().addClass('hide');
								$empty.hide().addClass('hide');
								// console.log('target:', $target);
								// console.log('$tpl:', $tpl);
								if (!data || data.length < 1) {
									$empty.show().removeClass('hide');
									$target.children().not('[name=tpl],[name=search],[name=empty]').remove();
								} else {
									let html = [], $tpl = $('<div></div>').append($target.find('[name=tpl]').clone().attr('name', '').removeClass('hide')); // div로 감싸사 tpl 첫 DOM도 data-bind를 쓸수 있도록 합니다. 그리고 $tpl.html()을 하면 div는 제외하고 tpl만 추출됩니다.
									for (let i in data) {
										let _row = data[i], _tpl = $tpl.clone();
										for (let k in _row) {
											let $row = _tpl.find('[data-bind="row.' + k + '"]'), vn = _row[k], format = $row.attr('data-format'), decimals = $row.attr('data-decimals');
											switch (format) {
												case 'attr': $row.attr('data-' + k, vn); break;
												case 'comma': $row.text(real_number_format(vn, decimals)); break;
												case 'date':
													$row.each(function () {
														let date_format = $(this).attr('data-date_format') || '';
														$(this).text(date_format ? date(date_format, vn) : vn);
													})
													break;
												case 'add-class': $row.addClass(vn); break;
												case 'number': $row.text((vn + '').replace(/[^0-9.-]/g, '')); break;
												// case 'html': $row.html(vn); break;
												default:
													$row.each(function () {
														const TAGNAME = this.tagName ? this.tagName.toUpperCase() : '';
														switch (TAGNAME) {
															case 'A':
																$row.attr('href', vn); break;
															default:
																if (format == 'html') {
																	$row.html(vn);
																} else {
																	$row.text(vn);
																}
														}
													});
													break;
											}
										}
										html[i] = _tpl.html();
									}
									$target.children().not('[name=tpl],[name=search],[name=empty]').remove();
									$target.append(html.join(''));
								}
								break;
							case 'comma':
								vt = real_number_format(vn);
								break;
							case 'number':
								vt = (vn + '').replace(/[^0-9.]/g, '') * 1;
								break;
							case 'add-class':
								$(this).addClass(vn);
								return; // 클래스 추가후 끝.
								break;
							case 'background-image':
								$(this).css('background-image', 'url('+vn+')');
								return; // 클래스 추가후 끝.
								break;
							default:
								vt = vn;
						}
						// 값 지정
						// console.log('tagname:', tagname);
						switch (tagname) {
							case 'INPUT':
								let type = ($(this).attr('type') + '').toUpperCase();
								switch (type) {
									case 'CHECKBOX':
										// $(this).prop('checked', vn==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
										let same_value = vn == $(this).val(); // 값이 같은가?
										// 값이 같은데 체크 안되있으면 클릭해서 체크함.
										// 값이 다른데 체크 되있으면 클릭해서 언체크함.
										// console.log('same_value:', same_value);
										// console.log('checked:', $(this).is(':checked'));
										if (same_value && !$(this).is(':checked') || !same_value && $(this).is(':checked')) {
											$(this).trigger('click');
										}
										break;
									case 'RADIO': // 라디오, 채크박스는 값이 같으면 checked 속성을 넣습니다.
										// $(this).prop('checked', vt==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
										if (vt == $(this).val()) { $(this).trigger('click'); }
										break;
									case 'NUMBER': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
									case 'HIDDEN': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
										$(this).val(vt);
										break;
									default:
										vt = (vt && vt.toNumber() == vt && (typeof (vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
										$(this).val(vt);
								}
								break;
							case 'TEXTAREA':
							case 'SELECT':
								$(this).val(vt);
								break;
							case 'IMG':
							case 'IFRAME':
								$(this).attr('src', vt);
								break;
							default:
								if ('userid' != i) { // userid는 콤마 미입력
									vt = (vt && vt.toNumber() == vt && (typeof (vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
								}
								// console.log('vt:', vt, '$(this):', $(this));
								$(this).html(vt);
								break;
						}
					});

					// display-bind
					// <div data-display="market.use_userpw=Y"></div>
					$('[data-display^="' + property + '.' + i + '"]').each(function () { //
						let data = $(this).attr('data-display');
						data = data.split('=');
						if (vn == data[1]) {
							$(this).removeClass('hide').attr('style', '');
						} else {
							$(this).addClass('hide').attr('style', '');
						}
					});
				}
			}
		}
	}
}));