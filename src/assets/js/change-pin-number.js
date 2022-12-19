$(function () {
    $('.number').autotab({ tabOnSelect: true },'filter', 'number');
	
	/* const email = $('#email')
    const password = $('#password')
	const name = $('#name')
    const password_confirm = $('#password_confirm') */
    let sended_email = ''; // 발송 성공한 이메일 - 재발송시 사용
    let sended_phoneCountry = '';
    let sended_phone = '';
    let bool_confirm_email = 0; // 이메일 인증 여부
    let bool_confirm_mobile = 0; // 핸드폰 인증 여부
    
    let my_calling_code = '+82'; // 접속자 국제전화번호
    let my_country_code = 'KR'; // 접속자 국가코드
    let my_ip = ''; // 접속자 아이피

	// 국가 선택 
    function select_country(code) {
        $('#country').find('button[value=' + (code.toLowerCase()) + ']').trigger('click');
    }

	API.getCurrentCountryInfo(my_ip, (resp) => {
        if(resp.payload.calling_code) my_calling_code = resp.payload.calling_code
        if (resp.payload.country_code) my_country_code = resp.payload.country_code
        // 국가 선택
        select_country(my_country_code)
        if (resp.payload.ip) my_ip = resp.payload.ip
        
        // preset value
        $('#phoneCountry').val(my_calling_code);
    })

	// 현재 보안비밀번호 재설정하기 click 하기
	$('[name="forget-security-password"]').click((e) => {
		e.preventDefault();
		$('#change-security-password').hide();
		$('#forget-security-password').show();
	})

	

	// 현재 보안번호 재설정하기 form
	$('#forget-security-password').submit((e) => {
		e.preventDefault();
		
		const phoneCountry = $('#phoneCountry').val()
        const phone = $('#phone').val()
		let code = ''
        let check = true

		if(!phoneCountry) {
            $('#phoneCountry').focus()
            return false
        }
        if(!phone) {
            $('#phone').focus()
            return false
        }

		// $('#forget-security-password').addClass('loading')
        // $('#forget-security-password input[type=submit]').prop('disabled', true)

		API.sendMobileConfirmCode(phoneCountry, phone, sended_phone, code, (resp) => {
            if (resp.success) {
                
                sended_phoneCountry = phoneCountry;
                sended_phone = phone;

                // $('#create-account-phone').hide()
				$('#create-account-phone').parent("section").hide()
				// $('#create-account-phone-auth').show()
                $('#create-account-phone-auth').parent("section").show()
            } else {
                $('#forget-security-password input[type=submit]').prop('disabled', false)

                alert(resp.error.message)
            }
        })

		
		

        return false
	})
	
	
	// SMS 인증문자 재발송
	/* $('[name="btn-resend-sms"]').on('click', function () { 
		if (!sended_phoneCountry || !sended_phone) return;
		$('#create-account-phone-auth').addClass('loading');
		API.sendMobileConfirmCode(sended_phoneCountry, sended_phone, (resp) => {
			$('#create-account-phone-auth').removeClass('loading');
			if(resp.success) {
				// $('#create-account-phone').hide()
				// $('#create-account-phone-auth').show()
			} else {
				// $('#create-account-phone input[type=submit]').prop('disabled', false)

				alert(resp.error.message)
			}
		})
		return false;
	}); */



    $('#change-security-password').submit((e) => {
        e.preventDefault()
        console.log("a"+ Model.user_info.userno)
        let check = true
        let pin = ''
        $('#change-security-password .grid--code input[type=number]').each((_index, elem) => {
            if(!$(elem).val()) {
                check = false
                $(elem).focus()
                return false
            }

            pin += $(elem).val()
        })

        if(check) {
            API.checkPin(pin, (resp) => {
                if(resp.success) {
                    $('#change-security-password').hide()
                    $('#change-security-password2').show()
                } else {
                    alert(resp.error.message)
                }
            })
        }

		

        return false
    })

    $('#change-security-password2').submit((e) => {
        e.preventDefault()

        let check = true
        let pin = ''
        $('#change-security-password2 .grid--code input[type=number]').each((_index, elem) => {
            if(!$(elem).val()) {
                check = false
                $(elem).focus()
                return false
            }

            pin += $(elem).val()
        })

        $('#change-security-password2').hide()
        $('#change-security-password-confirm').show()

        return false
    })
    $('#change-security-password-confirm').submit((e) => {
        e.preventDefault()

        let check = true
        let pin = ''
        let pin2 = ''

        $('#change-security-password2 .grid--code input[type=number]').each((_index, elem) => {
            pin += $(elem).val()
        })

        $('#change-security-password-confirm .grid--code input[type=number]').each((_index, elem) => {
            if(!$(elem).val()) {
                check = false
                $(elem).focus()
                return false
            }

            pin2 += $(elem).val()
        })

        if(pin === pin2) {
            API.putMyInfo({
                userno:Model.user_info.userno,
                pin: pin
            }, (resp) => {
                if(resp.success) {
                    $('#change-security-password-confirm').hide()
                    $('#change-security-password-complete').show()
                } else {
                    alert(resp.error.message)
                }
            })
        } else {
            alert(__('핀번호가 다릅니다.')+' '+__('다시 확인해 주세요'))
        }

        return false
    })

})