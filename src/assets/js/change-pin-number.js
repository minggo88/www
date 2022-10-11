$(function () {
    
    $('#change-security-password').submit((e) => {
        e.preventDefault()
        console.log("a"+Model.user_info.userno)
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