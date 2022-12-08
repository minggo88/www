$(function() {
    API.getTransactionList(symbol, page, (resp) => {
        if(resp.success) {
            resp.payload.map((item) => {
                const tr = $('<tr>')
                const li = $('<li>')

                let category

                switch (item.msg) {
                    case 'bidding':
                        category = '경매'
                        break
                    case 'buy':
                        category = '구매'
                        break
                
                    default:
                        break;
                }

                switch(item.direction) {
                    case 'out':
                        console.log('test')
                        break
                    case 'in':
                        break
                }

                const timeTraded = new Date(parseInt(item.time, 10) * 1000)
                const amount = parseFloat(item.amount)
                const volume = parseFloat(item.volume)
                console.log(item)
                console.log("수량", volume)
                console.log("가격",  amount)
                console.log(item.volume * item.amount)

                const tradedDate  = item.time ? String(timeTraded.getFullYear()).substr(2, 2) + '-' + String(timeTraded.getMonth() + 1).padStart(2, '0') + '-' + String(timeTraded.getDate()).padStart(2, '0') : ''

                tr.append(`<td class="" style="font-size: 12px"><i class="ico-${category}"></i> ${category}</td>`)
                // 제품이미지
                tr.append(`<td class="text--left" style="font-size: 12px"><span class="product--image">
                        <img src="./assets/img/청소타차_누끼이미지1.png" alt="">
                    </span>
                    원영호 원창호</td>`)
                // 가격?
                tr.append(`<td class="" style="font-size: 12px">${item.volume * item.amount}</td>`)
                // 수량
                tr.append(`<td class="" style="font-size: 12px">${item.volume}</td>`)
                tr.append(`<td class="" style="font-size: 12px">${item.amount}</td>`)
                tr.append(`<td class="" style="font-size: 10px">${item.from_name}</td>`)
                tr.append(`<td class="" style="font-size: 10px">${item.to_name}</td>`)
                tr.append(`<td class="" style="font-size: 12px">${tradedDate}</td>`)

                li.append(`<div class="notification--header"><span class="notification--date"></span><span class="notification--nick"></span></div>`)
                li.append(`<div class="notification--content">${item.content}</div>`)

                    tr.appendTo('.transaction--list tbody')
                    li.appendTo('.notification--list')
            })
        } else {
            
        }
    })
})