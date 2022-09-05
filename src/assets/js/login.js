$(function() {
    // 회원정보 암호화 필요해서 app.js 파일 속에서 실행시킵니다.
    // fn_login

    // $('#login').submit((e) => {
    //     e.preventDefault()

    //     const email = $('#email')
    //     const password = $('#password')

    //     if(!email.val()) {
    //         email.focus()
    //         return false
    //     }

    //     if(!password.val()) {
    //         password.focus()
    //         return false
    //     }

    //     API.login(email.val(), password.val(), (resp) => {
    //         if(resp.success) {
    //             location.href = 'exchange.html'
    //         } else {
    //             $('.validation--message').find('>p').text(resp.error.message).end().show()
    //         }
    //     })
    //     return false
    // })
})