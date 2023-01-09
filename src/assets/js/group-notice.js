// NOTICE
let pagination = {
	point: 0,
}
let currentPage = 1
let totalPage = 1
const pageCount = 10
const fetchList = (page = 1) => {
	API.getBBSList('GROUP-NOTICE', page, pageCount, (resp) => {
		$('.board--list tbody').empty()
		$('.notification--list').empty()
		let no = resp.payload.total - ((page - 1)*pageCount);
		resp.payload.data.map((item) => {
			const tr = $('<tr>')
			const li = $('<li>')
			let icon = ''
			const regDate = new Date(item.regdate)
			if ( new Date().getTime() - 60 * 60 * 24 *1000 <= regDate.getTime() ) {
				icon = '<i class="icon--new"></i>'
			}
			if (item.division == "a") {
				tr.append(`<td>공지</td>`)
			} else {
				tr.append(`<td>${no}</td>`)
			}

			tr.append(`<td><a href="notice_detail.html?idx=${item.idx}">${item.subject}</a>${icon}</td>`)
			tr.append(`<td>${item.regdate.substr(0, 16)}</td>`)
			tr.appendTo('.board--list tbody')
			li.append(`<div class="notification--header"><span class="notifictaion--date">${item.regdate.substr(0, 16)}</span><span class="notification--nick">${item.author}</span></div>`)
			li.append(`<div class="notification--content"><a href="notice_detail.html?idx=${item.idx}">${item.subject}${icon}</a></div>`);
			li.appendTo('.notification--list')

			no--;
		})
		$('.board--pagination').find('>ul').empty().end().show()
		totalPage = Math.ceil(resp.payload.total / 10)
		if (totalPage > 1) {
			pagination.point = 0
			if (page > 1) {
				$('<li>')
					.addClass('pagination--prev')
					.append(`<a href="#page-${page - 1}">이전 페이지</a>`)
					.appendTo('.board--pagination > ul')
			}
			while (pagination.point < pageCount && currentPage + pagination.point <= totalPage) {
				const page = currentPage + pagination.point
				pagination.point++
				$('<li>').append(`<a href="#page-${page}">${page}</a>`).appendTo('.board--pagination > ul')
			}
			if (page < totalPage) {
				$('<li>')
					.addClass('pagination--next')
					.append(`<a href="#page-${page + 1}">다음 페이지</a>`)
					.appendTo('.board--pagination > ul')
			}
			if (!resp.payload.total) {
				$('<tr>')
					.addClass('board--empty')
					.append('<td colspan="3">게시물이 없습니다</td>')
					.appendTo('.board--list tbody')
			}
		}
	})
}
fetchList(currentPage)
$('.board--pagination').on('click', 'a', (e) => {
	e.preventDefault()
	const page = $(e.target)
		.attr('href')
		.replaceAll(/#page-/g, '')
	fetchList(page)
	return false
})