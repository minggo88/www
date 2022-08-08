$(function() {
    $('#forget').submit((e) => {
        e.preventDefault()

        $('#validation--message').hide()

        $('#forget').addClass('loading')
        $('#forget input[type=submit]').prop('disabled', true)

        API.findPW($('#email').val(), (resp) => {
            $('#forget').removeClass('loading')

            if(resp.success) {

            } else {
                $('.validation--message').find('p').text(resp.error.message).end().show()

                $('#forget input[type=submit]').prop('disabled', false)

            }
        })

        return false
    })
})