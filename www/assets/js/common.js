//title 변경
document.title = "ASSETTEA" ;

let os = ''

if(navigator.userAgent.match(/Windows/)) {
    os = 'ms'
}
else if(navigator.userAgent.match(/Android/))
{
    os = 'android'
}
else if(navigator.userAgent.match(/(iPhone|iPad)/))
{
    os = 'ios'
}
else if(navigator.userAgent.match(/Macintosh/))
{
    os = 'mac'
}
else if(navigator.userAgent.match(/Linux/)) {
    os = 'linux'
}
// 기본 언어설정
if(!window.localStorage.locale) {
    window.localStorage.locale = 'ko'
}

$(document).ready( function() {
	$(".nav--side div .dropdown--item").load("./nav_side.html");
    $(".sub header .header_inner").load("./header.html");  
	document.getElementsByClassName("mobile-panel").innerHTML = "";
	$(".mobile-panel").load("./mobile_aside.html");  
    
});

$.fn.serializeObject = function() {
    var obj = null;
    
    try {
        // this[0].tagName이 form tag일 경우
        if(this[0].tagName && this[0].tagName.toUpperCase() == "FORM" ) {
            var arr = this.serializeArray();
            if(arr){
                obj = {};
                jQuery.each(arr, function() {
                    // obj의 key값은 arr의 name, obj의 value는 value값
                    obj[this.name] = this.value;
                });
            }
        }
    } catch(e) {
        alert(e.message);
    } finally {}
    
    return obj;
}

if(typeof window.getURLParameter === 'undefined') {
    function getURLParameter(key, url) {
        url = new URL(url || window.location.href);
        r = url.searchParams.get(key)
        return r ? r : '';
    }
}

$(function() {
    $('.mobile-bottom .more').click((e) => {
        e.preventDefault()
        //230329 모바일 로그인 버튼 페이지 수정
        mobile_login_config()
        $('.mobile-panel').show()
    })
})

function asianUintNumber(n){
	if (n >= 1000000000000 && n < 10000000000000000 ) {
		n = n / 1000000000000 + __('조')
	} else if (n >= 100000000 && n < 1000000000000 ) {
		n = n / 100000000 + __('억')
	} else if (n >= 10000 && n < 100000000) {
		n = n / 10000 + __('만')
	} else {
		n = n + __('')
	}
	return n;
}

function mobile_login_config(){
	let windowHeight = window.innerHeight;
	let mobile_screenWidth = window.innerWidth;
	if(windowHeight < 650 && mobile_screenWidth < 801){
		$('.nav--side.mobile').hide();
		$('.mobile_side_login').show();
	}else{
		$('.nav--side.mobile').show();
		$('.mobile_side_login').hide();
	}
	
}