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

let USER_INFO = {}

// 기본 언어설정
if(!window.localStorage.locale) {
    window.localStorage.locale = 'ko'
}

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
};