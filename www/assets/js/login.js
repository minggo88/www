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

            } else {
                $('.validation--message').find('>p').text(resp.error.message).end().show()
            }
        })
        return false
    })
})