// 모바일 접속 여부
let isMobile = (window.matchMedia('(max-width: 800px)').matches)

$(function() {
    $(window).on('resize', () => {
        isMobile = (window.matchMedia('(max-width: 800px)').matches)
		if($(window).width()>=800) {
			//전체이미지 보이기
		} else {
            //모바일 이미지 보이기
			
        }
    })
})

   