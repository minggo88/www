$(function () {
    
    let sended_email = '';

    $('#forget').submit((e) => {
        e.preventDefault()

        if(!$('#email').val()) {
            $('#email').focus()
            return false
        }

        $('#validation--message').hide()

        $('#forget').addClass('loading')
        $('#forget input[type=submit]').prop('disabled', true)

        API.findPW($('#email').val(), (resp) => {
            $('#forget').removeClass('loading')

            if (resp.success) {
                
                sended_email = $('#email').val();
				
                $('[name=box-form]').hide();
                $('[name=box-success]').show();
				alert('이메일이 발송되었습니다.');
				window.location.replace('login.html')
            } else {
                $('.validation--message').find('p').text(resp.error.message).end().show()

                $('#forget input[type=submit]').prop('disabled', false)

            }
        })

        return false
    })

    // re send
    $('[name=btn-resend]').on('click', function () { 
        
        $('#forget').addClass('loading')
        API.findPW(sended_email, (resp) => {
            $('#forget').removeClass('loading')

            if (resp.success) {
                
                $('[name=box-form]').hide();
                $('[name=box-success]').show();

            } else {
                $('.validation--message').find('p').text(resp.error.message).end().show()

                $('#forget input[type=submit]').prop('disabled', false)

            }
        })

        return false
    })
})