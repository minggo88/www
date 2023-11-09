const fn_wallet_withdrawal = function () {
    /*
    $('.number').autotab({ tabOnSelect: true },'filter', 'number');
    
    check_login();
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
            // console.log('getCurrency r:', r);
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

    // 지갑 정보
    force_rander('user_wallet', Model.user_wallet); // 화면에 잔액 표시 후
    get_user_wallet(); // DB 값으로 다시 잔액 표시

    const clipboard = new ClipboardJS('.btn--copy');
    clipboard.on('success', function (e) {
        alert(__('클립보드에 복사되었습니다.'))
        e.clearSelection()
    });

    // 보안 비밀번호 입력창 
    /* $('[name="pin"]').val(); */
    fn_current_money();
    
    $('[name="pin_btn"]').on('click', function () { 
        $('#pin_number').addClass('modal--open');
    })

    

    // pin Number popup 띄우기
    $('[name="btn-save-widthdraw"]').on('click', function () { 
        const sourceInput = document.getElementById("able_out_max_money");
        const amount = sourceInput.value;
        
        // <input> 요소의 name 속성을 사용하여 요소를 찾습니다.
        const depositAmountInput = document.querySelector("input[name=deposit_amount]");
        // 값을 가져옵니다.
        const value = depositAmountInput.value;
        if(amount < value ){
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

					// '/'를 기준으로 문자열을 나누기
					let splitValues = inputValue.split('/');
					
					// 공백을 제거하고 결과를 정리
					let text1 = splitValues[0].trim() + ' / ' + splitValues[1].trim();
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
                } else {
                    alert(resp.error.message)
                }
            })
        }
        return false
    })

    // 출금수수료 계산
    /*$('[name="amount"]').on('keyup', function (e) { 
        const fee_out = Model.withdraw_currency.fee_out;
        const fee_out_ratio = Model.withdraw_currency.fee_out_ratio;
        const amount = $(this).val().replace(/[^0-9.]/g, "");
        const fee = fee_out_ratio > 0 ? amount * fee_out_ratio : (fee_out > 0 ? fee_out : 0);
        const real_receive_amount = amount-fee>0 ? amount-fee : 0;
        console.log(amount, fee, real_receive_amount)
        $('[name=fee]').val( real_number_format(fee) )
        $('[name=real_out]').val( real_number_format(real_receive_amount) )
    })*/
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
            console.log('getCurrency r:', r);
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
      }else if(newValue.length <= 4){
        const text = "최소가격은 10,000원 이상입니다.";
          const outMoneyT = document.getElementById('out_money_t');
          outMoneyT.value = text;
      }
  }
  
  // 천 단위 쉼표를 포함한 문자열로 변환하는 함수
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

window.addEventListener('load', fn_wallet_withdrawal);

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
			document.getElementById("able_out_max_money").value = formattedValue2;
		}
	})
}