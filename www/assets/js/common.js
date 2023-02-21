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
	document.getElementsByClassName("contents mobile-only")[0].innerHTML = "";
	$(".contents.mobile-only").load("./nav_side.html");  
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
