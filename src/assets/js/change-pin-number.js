$(function () {
    $('.number').autotab({ tabOnSelect: true },'filter', 'number');

	// 현재 보안비밀번호 재설정하기 click 하기
	$('[name="forget-security-password"]').click((e) => {
		e.preventDefault();
		$('#change-security-password').hide();
		$('#forget-security-password').show();

        $('#phoneCountry').val(Model.user_info.country.calling_code)
        $('#phone').val(Model.user_info.mobile)

        $('[name="btn-send-email"]').hide()
	})

    $('[name="btn-send-sms"]').on('click', (e) => {
        let phoneCountry = $('[name="phoneCountry"]').val()
        let phone = $('[name="phone"]').val()

        API.sendMobileConfirmCode(phoneCountry, phone, (resp) => {
            if (resp.success) {
                alert('인증번호를 발송 했습니다.')
            } else {
                $('#create-account-phone input[type=submit]').prop('disabled', false)

                alert(resp.error.message)
            }
        })
    })

    $('[name="btn-resend-sms"]').on('click', (e) => {
        let phoneCountry = $('[name="phoneCountry"]').val()
        let phone = $('[name="phone"]').val()

        API.sendMobileConfirmCode(phoneCountry, phone, (resp) => {
            if (resp.success) {
                alert('인증번호를 발송 했습니다.')
            } else {
                $('#create-account-phone input[type=submit]').prop('disabled', false)

                alert(resp.error.message)
            }
        })
    })

    $('[name="btn-sms-check"]').on('click', (e) => {
        e.preventDefault();

        let phone = $('[name="phone"]').val()
        let code = $('[name="certify_number"]').val()

        API.checkMobileConfirmCode(phone, code, (resp) => {
            if (resp.success) {
                $('[name="btn-send-email"]').show()
                alert('인증 되었습니다.')
            } else {
                alert(resp.error.message)
            }
        })

    })

    $('[name="btn-send-email"]').on('click', (e) => {
        e.preventDefault();

        if (!Model.user_info.email) {
            alert('등록된 이메일 정보가 없습니다.')
            return false
        }
        let email = Model.user_info.email

        API.findPinNumber(email, (resp) => {
            if (resp.success) {
                alert('이메일이 발송되었습니다.');
            } else {
                alert("1"+resp.error.message)
            }
        })

    })



    $('#change-security-password').submit((e) => {
        e.preventDefault()

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
        } else {
            alert('내용을 채워주세요. 항목을 입력해 주세요.')
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

        if(check) {
            $('#change-security-password2').hide()
            $('#change-security-password-confirm').show()
        } else {
            alert('내용을 채워주세요. 항목을 입력해 주세요.')
        }

        // 핀 번호가 입력되지 않았을 때  
        // if(check) {
        //     API.checkPin(pin, (resp) => {
        //         if(resp.success) {
        //             $('#change-security-password2').hide()
        //             $('#change-security-password-confirm').show()
        //         } else {
        //             alert(resp.error.message)
        //         }
        //     })
        // }

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