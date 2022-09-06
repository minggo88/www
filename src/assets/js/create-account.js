$(function () {
    const email = $('#email')
    const password = $('#password')
    let sended_email = ''; // 발송 성공한 이메일 - 재발송시 사용
    let sended_phoneCountry = '';
    let sended_phone = '';
    let bool_confirm_email = 0; // 이메일 인증 여부
    let bool_confirm_mobile = 0; // 핸드폰 인증 여부

    API.getCountry((resp) => {
        let firstItem = ''
        resp.payload.map((country) => {
            if(!firstItem) {
                firstItem = country.code.toLowerCase()
            }

            $('#country').dropdown('add', { value: country.code.toLowerCase(), text: `<i class="flag ${country.code.toLowerCase()}"></i> ${country.name}` })
        })

        $('#country').dropdown('select', firstItem).dropdown('add_search')
        
    })

    $('#create-account-country').on('submit', (e) => {
        e.preventDefault()

        window.sessionStorage.country = $('#country').dropdown('selected')

        $('#create-account-country').hide()
        $('#create-account-info').show()

        return false
    })

    $('#create-account-info').on('submit', (e) => {
        e.preventDefault()

        if(!email.val()) {
            email.focus()
            return false
        }

        // 메일주소가 아닌경우
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.val()) === false) {
            email.focus()
            alert('올바른 E-mail 주소를 입력해주세요')
            return false
        }

        if(!password.val()) {
            password.focus()
            return false
        }

        $('#create-account-info').addClass('loading')
        $('#create-account-info input[type=submit]').prop('disabled', true)

        API.sendEmailConfirmCode(email.val(), (resp) => {
            $('#create-account-info').removeClass('loading')

            if (resp.success) {
                sended_email = email.val();
                $('#create-account-info').hide()
                $('#create-account-mail-auth').show().find('.grid--code>input:eq(0)').focus()
            } else {
                $('#create-account-info input[type=submit]').prop('disabled', false)

                alert(resp.error.message)
            }
        })

        return false
    })

    // 이메일 재발송
    $('[name="btn-resend-email"]').on('click', function () { 
        $('#create-account-mail-auth').addClass('loading')
        API.sendEmailConfirmCode(sended_email, (resp) => {
            $('#create-account-mail-auth').removeClass('loading')
            if(resp.success) {
                // $('#create-account-info').hide()
                $('#create-account-mail-auth').show().find('.grid--code>input:eq(0)').focus()
            } else {
                // $('#create-account-info input[type=submit]').prop('disabled', false)
                alert(resp.error.message)
            }
        })
        return false;
    });

    $('#create-account-mail-auth').on('submit', (e) => {
        e.preventDefault()

        let code = ''

        $('#create-account-mail-auth .grid--code input[type=number]').each((_index, elem) => {
            if(!$(elem).val()) {
                check = false
                $(elem).focus()
                return
            }

            code += $(elem).val()
        })

        $('#create-account-mail-auth').addClass('loading')
        $('#create-account-mail-auth input[type=submit]').prop('disabled', true)

        API.checkEmailConfirmCode(email.val(), code, (resp) => {
            $('#create-account-mail-auth').removeClass('loading')

            if (resp.success) {
                bool_confirm_email = 1; // 이메일 인증 여부
                $('#create-account-mail-auth').hide()
                $('#create-account-phone').show()
            } else {
                bool_confirm_email = 0; // 이메일 인증 여부
                $('#create-account-mail-auth input[type=submit]').prop('disabled', false)

                alert(resp.error.message)
            }
        })

        return false
    })

    $('#create-account-phone').on('submit', (e) => {
        e.preventDefault()

        const phoneCountry = $('#phoneCountry').val()
        const phone = $('#phone').val()

        if(!phoneCountry) {
            $('#phoneCountry').focus()
            return false
        }
        if(!phone) {
            $('#phone').focus()
            return false
        }

        $('#create-account-phone').addClass('loading')
        $('#create-account-phone input[type=submit]').prop('disabled', true)

        API.sendMobileConfirmCode(phoneCountry, phone, (resp) => {
            if (resp.success) {
                
                sended_phoneCountry = phoneCountry;
                sended_phone = phone;

                $('#create-account-phone').hide()
                $('#create-account-phone-auth').show()
            } else {
                $('#create-account-phone input[type=submit]').prop('disabled', false)

                alert(resp.error.message)
            }
        })

        return false
    })

    // SMS 인증문자 재발송
    $('[name="btn-resend-sms"]').on('click', function () { 
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
    });

    $('#create-account-phone-auth').on('submit', () => {
        let code = ''

        let check = true

        $('#create-account-phone-auth .grid--code input[type=number]').each((_index, elem) => {
            if(!$(elem).val()) {
                check = false
                $(elem).focus()
                return
            }

            code += $(elem).val()
        })

        if(check) {
            $('#create-account-phone-auth').addClass('loading')
            $('#create-account-phone-auth input[type=submit]').prop('disabled', true)

            API.checkMobileConfirmCode(phone, (resp) => {
                $('#create-account-phone-auth').removeClass('loading')

                if (resp.success) {
                    bool_confirm_mobile = 1; // 핸드폰 인증 여부
                    $('#create-account-phone-auth').hide()
                    $('#create-account-pin-number').show()
                } else {
                    bool_confirm_mobile = 0; // 핸드폰 인증 여부
                    $('#create-account-phone-auth input[type=submit]').prop('disabled', false)

                    alert(resp.error.message)
                }
            })
        }

        return false
    })
    $('#create-account-pin-number').on('submit', () => {

        for (i = 0; i < 6; i++) {
            const $i = $('#create-account-pin-number input[name=pin]:eq(' + i + ')');
            if (!$.trim($i.val())) {
                $i.focus();
                break;
            }
        }

        $('#create-account-pin-number').hide()
        $('#create-account-pin-number-confirm').hide()

        return false
    })
    $('#create-account-pin-number-confirm').on('submit', () => {
        let pin = ''
        let pinConfirm = ''

        let check = true

        $('#create-account-pin-number .grid--code input[type=number]').each((elem) => {
            pin += $(elem).val()
        })

        $('#create-account-pin-number-confirm .grid--code input[type=number]').each((elem) => {
            if(!$(elem).val()) {
                check = false
                $(elem).focus()
                return
            }

            pinConfirm += $(elem).val()
        })

        // 핀번호가 다른경우
        if(pin !== pinConfirm) {
            alert('핀번호가 다릅니다')
            check = false
        }

        if(check) {
            $('#create-account-pin-number-confirm').addClass('loading')
            
            API.join({
                'social_id': email.val(),
                'social_name': '', // 아이디/비번 방식으로 email 방식 제거
                'email': email.val(),
                'userpw': password.val(),
                'mobile_calling_code': sended_phoneCountry,
                'mobile_country_code': (window.sessionStorage.country + '').toUpperCase(),
                'pin': pin,
                'bool_email': $('#mailing').is(':checked') ? 1 : 0,
                'bool_marketing': $('#marketing').is(':checked') ? 1 : 0,
                'bool_confirm_email': bool_confirm_email,
                'bool_confirm_mobile': bool_confirm_mobile
            }, (resp) => {
                $('#create-account-pin-number-confirm').removeClass('loading')

                if(resp.success) {
                    $('#create-account-pin-number').hide()
                    $('#create-account-pin-number-confirm').hide()
                } else {
                    alert(resp.error.message)
                }
            })
        }

        return false
    })
})