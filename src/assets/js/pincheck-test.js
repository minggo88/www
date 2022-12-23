
// 쿠키 저장하기 함수
export function setCookie(name, value = "", expireDays = "", path = "/") {
    let expires = "";
    if (expireDays) {
    let date = new Date();
    date.setTime(date.getTime() + expireDays * 24 * 60 * 60 * 1000);
    expires = `expires=${date.toUTCString()};`;
    }
    document.cookie = `${name}=${value || ""};${expires}path=${path}`;
}


$(function () {
    $('.number').autotab({ tabOnSelect: true },'filter', 'number');

    $('.btn.btn--red').submit((e) => {
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
        }



        return false
    })
  
})