/* $(function() {
    $('#member-account [name=email]').val(USER_INFO.userid)
    $('#member-account [name=phone]').val(USER_INFO.mobile)


    $('#member-account').submit((e) => {
        e.preventDefault()

        API.putMyInfo({
            email: $('#email').val(),
            mobile: $('#phone').val(),

        }, (resp) => {
            if(resp.success) {

            } else {
                alert(resp.error.message)
            }
        })
        return false
    })
}) */