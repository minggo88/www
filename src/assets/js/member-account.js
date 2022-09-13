$(function() {
    $('#member-account [name=email]').val(USER_INFO.userid)
    $('#member-account [name=mobile]').val(USER_INFO.mobile)

    $('#member-account').submit((e) => {
        e.preventDefault()

        API.putMyInfo({
            email: $('#email').val(),
            mobile: $('#mobile').val(),
        }, (resp) => {
            if(resp.success) {

            } else {
                alert(resp.error.message)
            }
        })
        return false
    })
})