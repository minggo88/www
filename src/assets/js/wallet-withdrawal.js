let currency

API.getCurrency(symbol, (resp) => {
    $('#address').val(resp.payload[0].backup_address)

    currency = resp.payload[0]
})
API.getBalance(symbol, null, (resp) => {
    console.log(resp)
})

$('#text').on('input', (e) => {
    const self = $(e.target)

    const out = parseFloat(self.val().replaceAll(/[^0-9]+/g, ''))

    if(isNaN(out)) {
        $('#fee').val(Number(0).toFixed(currency.display_decimals))
        $('#realOut').val('')
        self.val('')
    } else {
        // 출금 수수료 계산
        const fee = parseFloat(out * currency.fee_out)
        $('#fee').val(fee.toFixed(currency.display_decimals).format())
        $('#realOut').val((out - fee).toFixed(currency.display_decimals).format())
        self.val(out.format())
    }
})

$('.btn--validate').click(e => {
    API.validateAddress(symbol, $('#address').val(), (resp) => {
        if(resp.success) {
            alert('OK')
        } else {
            alert(resp.error.message)
        }
    })
})