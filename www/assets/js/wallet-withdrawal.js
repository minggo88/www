const fn_wallet_withdrawal = function () {
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
    $('[name="btn-withdraw"]').on('click', function () { 
        $('#pin_number').addClass('modal--open');
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
                    const amount = $('[name=amount]').val().replace(/[^0-9.]/g, "");
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
    $('[name="amount"]').on('keyup', function (e) { 
        const fee_out = Model.withdraw_currency.fee_out;
        const fee_out_ratio = Model.withdraw_currency.fee_out_ratio;
        const amount = $(this).val().replace(/[^0-9.]/g, "");
        const fee = fee_out_ratio > 0 ? amount * fee_out_ratio : (fee_out > 0 ? fee_out : 0);
        const real_receive_amount = amount-fee>0 ? amount-fee : 0;
        console.log(amount, fee, real_receive_amount)
        $('[name=fee]').val( real_number_format(fee) )
        $('[name=real_out]').val( real_number_format(real_receive_amount) )
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

window.addEventListener('load', fn_wallet_withdrawal);