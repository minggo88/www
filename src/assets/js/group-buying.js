/* 배너 */
var $bnnNum = 0;
var $lastNum = $(".banner_frame > section").length -1;
console.log($lastNum)
var $banner_w = $("body > section").width(); //배너의 넓이

//리사이즈 반응형이기 때문
$(window).resize(function(){
	$banner_w = $("body > section").width();
});


/* 오토배너 */
function autoBanner(){
	$bnnNum++;
	if($bnnNum > $lastNum) $bnnNum = 0;
	$(".banner_frame").stop().animate({"left":$bnnNum * (-$banner_w)},600,"linear",function(){		
		$(".banner_roll a").removeClass("on");
		$(".banner_roll a").eq($bnnNum).addClass("on");
	});
};

// 일정한 시간 동안 계속 반복
var $autoBnn = setInterval(autoBanner,5000);



/* 롤링 클릭 */
// 해당index번호에 해당되는 배너번호로 기차가 움직이면 되는것!
var $banner = $(".banner_roll a").click(function(){
	$bnnNum = $banner.index(this); // 해당 클릭된 a를 $bnnNum에 넣어준다 // 배너 인덱스 번호로 저장을 해준다. 

	//바뀐 배너번호로 움직이면 된다. // 바뀐 배너번호로 기차가 이동해라
	$(".banner_frame").stop().animate({"left":$bnnNum * (-$banner_w)},600,"linear",function(){		
		$(".banner_roll a").removeClass("on");
		$(".banner_roll a").eq($bnnNum).addClass("on");
	});
});


// 모바일 기기의 방향을 전환(가로/세로)할 때 화면의 너비가 달라지는 것에 대비해서 항상 바른 위치에 있도록 에니메이션 적용
$("body > section").bind("orientationchange",function(){
	$banner_w = $("body > section").width();
	$(".banner_frame").animate({"left":$bnnNum * (-$banner_w)},600,"linear");
});

// 모바일에서 
$("body > section").bind("swipeleft",function(){
	$(".next").trigger("click");
});
$("body > section").bind("swiperight",function(){
	$(".prev").trigger("click");
});

// 공동구매 불러오기
$(function () {
    var $container = $('.gallery'), //리스트
        $loadMoreBtn = $('.more'), //로드 버튼
        $addItemCount = 9, //추가 갯수
        $added = 0 // 추가된 로드 갯수. 전체 데이터 수와 일치하면 버튼 사라짐
        $allData = [];

		
		//$.getJSON('파일경로', 할일); JSON 불러오는 방법
		$.getJSON('./assets/data/content.json', initGallery);
		

		function initGallery(data){
			$allData = data;
			console.log($allData);
			addItem(); //기본 리스트

			$loadMoreBtn.click(addItem);
		}//initGallery

	function addItem(){
        var slicedData;
        var elements = [];

        slicedData = $allData.slice($added, $added+$addItemCount); //데이터 3개씩 호출
        console.log(slicedData);

        // $.each('배열', function(idx, item){}); // JSON 배열값마다 할 일
        $.each(slicedData, function(idx, item){
            var itemHTML =
            '<li class="gallery-item">' +
                '<div class="bg">' +
                    '<a href="group-buying-detail.html">' +
                        '<img src="' + item.main_pic + '">' +
                    '</a>' +
                '</div>' +
                '<div class="item-desc">' +
                    '<p class="tea-type">' + item.title + '</p>' +
                    '<p class="tea-name">' + item.sub_title + '</p>'
                '</div>' +
            '</li>' ;

            elements.push($(itemHTML).get(0));
        });
        
        console.log(elements);
        $container.append(elements);
        
        $added += slicedData.length;

        if($added < $allData.length){
            $loadMoreBtn.show()
        } else {
            $loadMoreBtn.hide()
        }

    }//addItem


	// <-- NOTICE 게시판
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
			totalPage = Math.ceil(resp.payload.total / 10)
			if (totalPage > 1) {
				$('.board--pagination').find('>ul').empty().end().show()
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
			} else {
				$('<tr>')
				.addClass('board--empty')
				.append('<td colspan="3">게시물이 없습니다</td>')
				.appendTo('.board--list tbody')
			}
		})//getBBSList
	}
	fetchList(currentPage)
	$('.board--pagination').on('click', 'a', (e) => {
		e.preventDefault()
		const page = $(e.target)
			.attr('href')
			.replaceAll(/#page-/g, '')
		fetchList(page)
		return false
	})//NOTICE 게시판 -->

});//ready function
