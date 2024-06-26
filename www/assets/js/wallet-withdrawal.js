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
        
        if(amount <= value ){
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
        console.log("a"+ Model.user_info.userno)
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
        
        console.log(pin)

        if(check) {
            API.checkPin(pin, (resp) => {
                if(resp.success) {
                    // 출금액
                    //const amount = $('[name=amount]').val().replace(/[^0-9.]/g, "");
                    // <input> 요소의 name 속성을 사용하여 요소를 찾습니다.
                    const depositAmountInput = document.querySelector("input[name=deposit_amount]");
                    // 값을 가져옵니다.
                    const value = depositAmountInput.value;
                    
                    const newValue2 = value.replace(/\D/g, '');
                    const amount = parseInt(newValue2, 10) - 1000;
                    
                    const to_address = $('[name="address"]').val();
                    const symbol = Model.withdraw_currency.symbol;
                    const symbol_addres = Model.withdraw_currency.symbol+'/A';

                    // console.log(to_address)
                    add_request_item('withdraw', { 'symbol': symbol, 'from_address': Model.user_wallet[symbol_addres].address, 'to_address': to_address, 'amount': amount, 'pin': pin }, function (r) {
                        if (r?.success) {
                            alert(__('출금신청을 완료했습니다.'));
                        } else {
                            const msg = r?.error?.message || '';
                            alert(__('출금신청을 완료하지 못했습니다.')+ ' '+msg);
                        }
                    })

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
        console.log(text);
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