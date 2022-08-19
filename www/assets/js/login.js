$(function() {
    $('#login').submit((e) => {
        e.preventDefault()

        const email = $('#email')
        const password = $('#password')

        if(!email.val()) {
            email.focus()
            return false
        }

        if(!password.val()) {
            password.focus()
            return false
        }

        API.login(email.val(), password.val(), (resp) => {
            if(resp.success) {
                alert('로그인 성공. 메시지 수정 필요')
                location.href = 'exchange.html'
            } else {
                $('.validation--message').find('>p').text(resp.error.message).end().show()
            }
        })
        return false
    })
})