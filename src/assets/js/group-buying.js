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