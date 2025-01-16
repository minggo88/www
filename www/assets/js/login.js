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

$(document).ready(function() {
    check_login();
});

const check_login = function (msg) {
	    const userModel = JSON.parse(sessionStorage.getItem('userModel'));
	    if (!userModel) { // 세션이 없는 경우
	        if (window.location.pathname !== '/login.html') {
	            // 현재 페이지가 로그인 페이지가 아니라면 로그인 페이지로 이동
	            window.location.href = LOGIN_PAGE;
	        }
	    } else { // 세션이 있는 경우
	        if (window.location.pathname === '/login.html') {
	            // 이미 로그인 상태에서 로그인 페이지라면 wallet.html로 이동
	            window.location.href = '/wallet.html';
	        }
	    }
	};