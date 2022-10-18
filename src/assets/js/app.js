// 우측 클릭 방지, 선택 방지, 드래그 방지
$('label,.btn,button,a,th').on('contextmenu selectstart dragstart', function() {return false;});
$('body').on('contextmenu', function() {return false;});
document.onmousedown = disableclick;

function disableclick(event) {
    if (event.button == 2) {
        return false;
    }
}


$(document).ready(function() {
	// 상단 모바일 매뉴
	$('[name=btn-hamburger]').on('click', function () {
		$(this).toggleClass('on');
		$("[name=box-menu]").animate({
			width: "toggle", opacity: "toggle"
		}, 50, "swing");
		return false;
	});
	// 모바일 사이즈에서 매뉴를 닫은 후 창을 키우면 매뉴가 안보임
	$(window).on('resize', function(){
		if($(window).width() > 840) {
			$('[name="box-menu"]').attr('style','');
		}
	})
});


// F12 버튼 방지
$(document).ready(function() {
    $(document).bind('keydown', function(evt) {
        let keyCode = get_keycode(evt);
        if (evt.keyCode == 123 /* F12 */ ) {
            evt.preventDefault();
            evt.returnValue = false;
            return false;
        }
    });
});

String.prototype.trim = function() {
	var str = this;
	return this.replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, '');
}

String.prototype.toNumber = Number.prototype.toNumber = function() {
	var num = this.toString();
	num = num.replace(/[^0-9.]/g, '');
	return (num=='') ? 0 : num*1;
	num = /^[0-9]+\.[0-9]+$/.test(num) ? parseFloat(num) : parseInt(num);
	if(isNaN(num)) num = 0;
	return num;
}

String.prototype.format = function(args1, args2, args3, args4, args5) {
	var arguments = new Array();
	if(args1) arguments[0] = args1;
	if(args2) arguments[1] = args2;
	if(args3) arguments[2] = args3;
	if(args4) arguments[3] = args4;
	if(args5) arguments[4] = args5;

    var formatted = this;
    for (var arg in arguments) {
        formatted = formatted.replace("{" + arg + "}", arguments[arg]);
    }
    return formatted;
}
if(! Object.assign) {
	Object.prototype.assign = function(o1, o2) {
		jQuery.extend(o1, o2); // for un-support assign
	}
}

function setCookie(name, value, expiredays){
	var todayDate = new Date();
	todayDate.setDate( todayDate.getDate() + expiredays );
	document.cookie = name + "=" + escape( value ) + "; path=/; expires=" + todayDate.toGMTString() + ";"
}

function getCookie( name ){
	var nameOfCookie = name + "=";
	var x = 0;
	while(x <= document.cookie.length) {
		var y = (x+nameOfCookie.length);
		if(document.cookie.substring( x, y ) == nameOfCookie ){
		if((endOfCookie=document.cookie.indexOf( ";", y )) == -1)
			endOfCookie = document.cookie.length;
			var r = unescape( document.cookie.substring( y, endOfCookie ) );
			return (r=="undefined") ? '' : r;
		}
		x = document.cookie.indexOf( " ", x ) + 1;
		if(x == 0) break;
	}
	return "";
}

/**
 * get url parameter value
 * @param String key Parameter Name
 * @param URL url 찾고자하는 url. undefined면 window.location.href
 */
 function getURLParameter(key, url) {
    url = new URL(url || window.location.href);
    r = url.searchParams.get(key)
	return r ? r : '';
}

/**
 * get url parameter value
 *
 * @param String key 파라메터 이름
 * @param String val 파라메터 값
 * @param URL url 변경하고자하는 url. undefined면 window.location.href
 * 
 * @return String URL
 * 
 */
function setURLParameter(key, val, url) {
    url = trim(url);
    url = url ? url : window.location.origin;
    url = url==='.' ? window.location.href : url ;
    url = url.indexOf('./') === 0 ? window.location.origin + url : url;
    url = url.indexOf('/') === 0 ? window.location.origin + url : url;
    url = url.indexOf('http') <  0 ? window.location.origin +'/'+ url : url;
	url = new URL(url);
	url.searchParams.set(key, val);
	return url.href;
}

/**
 * jQuery.serialize() 결과를 Ojbect 로 변환합니다.
 * @param {String} serializedData jQuery.serialize() 결과
 * @returns 
 */
function unserialize(serializedData) {
    let urlParams = new URLSearchParams(serializedData); // get interface / iterator
    let unserializedData = {}; // prepare result object
    for (let [key, value] of urlParams) { // get pair > extract it to key/value
        unserializedData[key] = value;
    }
    return unserializedData;
}

function real_number_format(n, d) {
    if (!d && Number(n) === n && n % 1 !== 0) d = 6; // float 숫자의 무의미한 소숫점을 제거하기위해 d 값 미설정시 8자리로 사용합니다.
	if(typeof n==typeof undefined || n=='' || is_null(n) || is_nan(n) ){n='0';}
	var sign = n<0 ? '-':''; 
	if(d) { n = number_format(n, d); }
	n = n+'';
	n = n.replace(/[^0-9.]/g,'');
	var r = n.split('.');
	r[0] = r[0].length==1 ? r[0] : r[0].replace(/^0+/g,'');// 숫자얖 0 제거
	if(1000 <= n) { r[0] = number_format(r[0]); }// 콤마추가
	r[1] = r[1] ? r[1].replace(/0{1,}$/g, '') : '';
	if(r[1] && r[1].length>0) {
		r = r.join('.');
	} else {
		r = r[0];
	}
	return sign + r;
}
/**
 * float 형식의 숫자도 정확한 숫자가 되도록 수정하는 함수입니다.
 * 
 * real_number(1.1 + 0.1) => 1.2
 * 1.1 + 0.1 => 1.2000000000000002
 * 
 * @param {*} n 숫자나 숫자형 문자
 * @returns 숫자
 */
function real_number(n) {
    return n ? (n * 1).toFixed(8) * 1 : 0;
}

function remove_array_by_value(array, value) {
    var what, a = arguments, L = a.length, ax;
    while (L && array.length) {
        what = a[--L];
        while ((ax = array.indexOf(what)) !== -1) {
            array.splice(ax, 1);
        }
    }
    return array;
};

function get_keycode(evt) {
	return evt.which?evt.which:window.event.keyCode;
}

function get_str_by_keycode(keycode) {
	let char = '';
	if (window.event.which == null)
		char= String.fromCharCode(event.keyCode);    // old IE
	else
		char= String.fromCharCode(window.event.which);	  // All others
	return char;
}

/**
 * INPUT 객체에 keydown 이벤트 발생시 숫자만 입력할 수 있도록 하는 필터링함수.
 * 숫자와 커서이동에 필요한 화살표, 탭, Del, Backspace 키등만 허용되고 모두 필터링.
 * @param {window.event}} evt
 * @example $('#box_login form input[type=password]').on('keydown', input_filter_number)
 */
 function input_filter_number (evt) {
	let keyCode = evt.which?evt.which:event.keyCode,
		val = String.fromCharCode(keyCode);
	if(val.match(/[^0-9]/g) && keyCode!=8 && keyCode!=9 && keyCode!=46 && keyCode!=35 && keyCode!=36 && keyCode!=37 && keyCode!=38 && keyCode!=39 && keyCode!=40 && keyCode!=96 && keyCode!=97 && keyCode!=98 && keyCode!=99 && keyCode!=100 && keyCode!=101 && keyCode!=102 && keyCode!=103 && keyCode!=104 && keyCode!=105 && keyCode!=48 && keyCode!=49 && keyCode!=50 && keyCode!=51 && keyCode!=52 && keyCode!=53 && keyCode!=54 && keyCode!=55 && keyCode!=56 && keyCode!=57) {
		return false;
	}
}

function inIframe () {
	try {
		return window.self !== window.top;
	} catch (e) {
		return true;
	}
}

function inPopup () {
	return window.opener ? true : false;
}

// "use strict";

// i18n.js
translate();// head 에서 번역처리 할때 누락된것들이 있어 HMLT 끝에 있는 app.js 에서 다시 번역 처리합니다. 그러면 화면 깜박임(한글 -> 영어) 없이 원문이 않보이게 바뀝니다.


// app

;
(jQuery(function ($) {

    const SERVICE_NAME = 'kkikda';

    /* 언어 */
    $('.box_language').on('click', '.box_current', function () {
        $('.box_option').toggle();
        $(this).find('.arrow.up,.arrow.down').toggle();
    });
    $('.box_language').on('click', '.box_option', function () {
        let lang = $(this).attr('data-lang');
        if (lang != window.lang) {
            $('.box_option').toggle();
            // let $box_current = $('.box_current');
            // $box_current.find('.arrow.up,.arrow.down').toggle();
            // let lang_str = $(this).text();
            // $box_current.find('.txt-lang').text(lang_str);
            // let $img = $box_current.find('img')
            // $img.attr('src', $img.attr('src').replace('_'+window.lang+'.png', '_'+lang+'.png'));
            _c(lang, function () { window.location.reload(); });
        }
    });

    /* window resize */
    $(window).resize(function () {
        // headerEvent();
        // imgCheck();
    });

    /* for file upload */
    $(document).on('change', 'input.file-upload', function () {
        var fileSelect = $(this).closest('.file-select');
        var file = $(this)[0].files[0];
        var totalSize = $(this)[0].files[0].size;
        var totalSizeMb = totalSize / Math.pow(1024, 2);

        if (file.type.match('image.*')) { // 이미지 파일일 경우

        } else if (file.type.match('video.*')) { // 비디오 파일일 경우
            var maxSizeMb = 100;
            if (totalSizeMb > maxSizeMb) {
                // 동영상이 100mb를 넘을 경우
                alert(__('100MB를 넘는 영상은 유투브 등에 업로드하시고 소스 코드를 복사해서 붙여주세요.'));
            } else {
                // 동영상 파일명 가져오기
                if (window.FileReader) {
                    var fileName = file.name;
                } else {
                    var fileName = $(this).val().split('/').pop().split('\\').pop();
                }
                fileSelect.find('input.file-name').val(__('파일이름') + ' : ' + fileName);
                // console.log(fileName);
            }
        }
    });

    /**
     * 파일 업로드
     * upload api 를 이용해 파일을 s3에 업로드 합니다. s3의 경우 임시 url이 리턴됩니다. 폼 저장할때 정식 경로로 이동시켜야 합니다.
     * @param {jQueryObject} $input_file  <input type="file"> 의 jQuery 객체
     * @returns 파일 URL
     */
    const upload_file = function ($input_file, $item_name) {
        $item_name = $item_name ? $item_name : '';
        let image_tmp_url = '';
        // 이미지 업로드 후 s3 이미지url 설정
        if ($.trim($input_file.val()) != '') {
            $form = $('<form><input type="hidden" name="token" value="' + getCookie('token') + '"></form>');
            $form.attr('enctype', 'multipart/form-data');
            $input_file.attr('name', 'file_data').after($input_file.clone(true));
            $form.append($input_file);
            var formData = new FormData($form[0]);
            // formData.append("token", getCookie('token'));
            $.ajax({
                'url': API_URL + '/upload/?',
                'async': false,
                'processData': false,
                'contentType': false,
                'data': formData,
                'type': 'POST',
                'success': function (r) {
                    if (r && r.success && r.payload) {
                        let file = r.payload[0];
                        if (file.url) {
                            image_tmp_url = file.url;
                        } else {
                            alert(__('{item_name} 파일을 저장하지 못했습니다.').replace('{item_name}', $item_name));
                        }
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('{item_name} 파일을 저장하지 못했습니다.').replace('{item_name}', $item_name) + ' ' + msg)
                    }
                },
                'fail': function () {
                    alert(__('{item_name} 파일을 업로드하지 못했습니다.').replace('{item_name}', $item_name));
                }
            });
        }
        return image_tmp_url;
    }

    const APP_NAME = 'stube';
    const APP_VERSION = '1.00.1';
    const APP_LOAD_TIME = new Date().getTime();
    let APP_RUNMODE = 'live';
    let TOKEN_DOMAIN = window.location.host; //"";
    let API_URL = "//api." + (window.location.host.replace('www.', '')) + "/v1.0";
    // let API_WALLET_URL = 'https://api.wallet.smart-talk.io/v1.0';
    SERVICE_DOMAIN = window.location.host.replace('www.', '');
    if (window.location.host.indexOf('loc.') !== -1 || window.location.host.indexOf('localhost') !== -1 || window.location.host.indexOf('src.') !== -1) {
        APP_RUNMODE = "loc";
        API_URL = "//api." + (window.location.host) + "/v1.0";
        // SERVICE_DOMAIN = window.location.host.replace('www.','');
        // API_WALLET_URL = 'http://loc.wallet.smart-talk.io/api/v1.0';
    }
    if (window.location.host.indexOf('dev.') !== -1) {
        APP_RUNMODE = "dev";
        API_URL = "//api." + (window.location.host) + "/v1.0";
        // SERVICE_DOMAIN = window.location.host.replace('www.','');
        // API_WALLET_URL = 'http://dev.wallet.smart-talk.io/api/v1.0';
    }
    if (window.location.host.indexOf('stage.') !== -1) {
        APP_RUNMODE = "stage";
        API_URL = "//api." + (window.location.host) + "/v1.0";
        // SERVICE_DOMAIN = window.location.host.replace('www.','');
        // API_WALLET_URL = 'http://stage.wallet.smart-talk.io/api/v1.0';
    }
    const LOGIN_PAGE = '/login.html';


    // jQuery plugins ----------------------------------------------------------------------------
    // get Numeric Value
    $.fn.numericVal = function () {
        return $(this).val().replace(/[^0-9.]/g, '') * 1;
    };
    // 마우스 휠 횡스크롤
    // https://www.it-swarm-ko.tech/ko/html/div%ec%97%90%ec%84%9c-%eb%a7%88%ec%9a%b0%ec%8a%a4-%ed%9c%a0%eb%a1%9c-%ea%b0%80%eb%a1%9c-%ec%8a%a4%ed%81%ac%eb%a1%a4/1067923375/
    // https://jsfiddle.net/q3pf2hge
    $.fn.hScroll = function (amount) {
        amount = amount || 120;
        $(this).bind("DOMMouseScroll mousewheel", function (event) {
            var oEvent = event.originalEvent,
                direction = oEvent.detail ? oEvent.detail * -amount : oEvent.wheelDelta,
                position = $(this).scrollLeft();
            position += direction > 0 ? -amount : amount;
            $(this).scrollLeft(position);
            event.preventDefault();
        })
    };

    // set language ----------------------------------------------------------------------------
    let APP_LANG = window.lang || 'ko';
    const change_language = function (lang) {
        if (lang && lang !== APP_LANG) {
            tpl = {}; // let으로 정의한 tpl도 사용가능함.
            APP_LANG = lang;
            $('html').attr('lang', APP_LANG);
            // 서버에 언어 저장. 쿠키 값을 사용하지만 서버에서도 필요할까하여 저장함. 이메일을 보내거나 할때 ... 사용하면 좋아서.
            if (Model.user_info.userid) {
                add_request_item('putMyInfo/putLanguage.php', { 'display_language': lang }, function (r) { });
            }
            _c(lang, function () {
                reload();
            });
        }
    }
    // 언어 변경 버튼 처리
    $('.box_language').on('click', function () {
        $('.box_language .flags').toggle();
    })
    $('.box_language [name=btn_language]').on('click', function () {
        let lang = $(this).attr('data-lang');
        change_language(lang);
    });

    // 최소구매금액
    // const min_limit_balance = 200;


    /**
     * Router - 미사용버전
     */
    var referrer = '';
    let path_name = window.location.pathname;
    let page_name = '';

    /**
     * Model 객체
     */
    let __listener__ = {},
        __data__ = {}, // in memory storage (delete on reload, default)
        model_item = false, //get_model_item(),
        session_item = model_item && model_item.session_item || ['token', 'user_info', 'user_wallet', 'visited_notice', 'hide_popup_time', 'user_goods'], // item name using session storage ( delete on close )
        local_item = model_item && model_item.local_item || ['hide_notice', 'auto_login', 'exchange_rate', 'goods', 'web_config', 'company_info', 'last_login_info', 'currency', 'hide_popup_time', 'model_item', 'site_info'], // item name using local storage ( delete user action or cleaner programes )
        cookie_item = model_item && model_item.cookie_item || ['check_pin'], // item name using local storage ( delete user action or cleaner programes )
        _no = ((Math.random() + ((new Date).getTime() / Math.random())) + '').replace('.', ''),
        key = getCookie('token');
    if (key) {
        key = APP_NAME + APP_VERSION + key;
    } else {
        setCookie('token', _no, 0, TOKEN_DOMAIN);
        key = APP_NAME + APP_VERSION + _no;
    }
    const set_model_location = function (itemname, location) {
        if (location === 'session') {
            local_item = remove_array_by_value(local_item, itemname);
            if (typeof (session_item[itemname]) == typeof (undefined)) {
                session_item.push(itemname);
            }
        }
        if (location === 'local') {
            session_item = remove_array_by_value(session_item, itemname);
            if (typeof (local_item[itemname]) == typeof (undefined)) {
                local_item.push(itemname);
            }
        }
    }
    const clone = function (obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    /**
     * @param String property 감지할 데이터이름
     * @param String name 콜백이름(중복방지용)
     * @param Function listener 콜백함수
     */
    const addChangeListener = function (property, name, listener) {
        const key = name; // md5, sha1으로 변경하기.
        // 단일 콜백.
        // __listener__[property] = listener;
        // 다중 콜백.
        if (__listener__[property]) {
            __listener__[property][key] = listener;
        } else {
            __listener__[property] = {};
            __listener__[property][key] = listener;
        }
    }
    const rander = function (property, value, oldValue, force) {
        for (i in value) {
            // console.error('property:', property);
            // console.error('value:', value);
            // console.error('i:', i);
            // console.error('value[i]:', value[i]);
            // console.error('oldValue:', oldValue);
            // console.error('oldValue[i]:', oldValue[i]);
            let vn = value[i],
                vt = null,
                vo = oldValue && oldValue[i] ? oldValue[i] : '';
            if (vn !== vo || force) { // 값이 다를때만 수정하기.
                if (typeof vn == typeof {}) {
                    rander(property + '.' + i, vn, vo, force);
                } else {
                    // console.error('property:', property);
                    // console.error('i:', i);
                    // console.error('value:', value);
                    // console.error('selector:', '[data-bind="' + property + '.' + i + '"]');
                    $('[data-bind="' + property + '.' + i + '"]').each(function () {
                        var tagname = this.tagName,
                            tagname = tagname.toUpperCase(),
                            format = $(this).attr('data-format');
                        // 데이터 출력 형식 변경
                        switch (format) {
                            case 'table':
                                const data = vn;
                                const $target = $(this), $empty = $target.find('[name=empty]'), $search = $target.find('[name=search]');
                                $search.hide().addClass('hide');
                                $empty.hide().addClass('hide');
                                // console.log('target:', $target);
                                // console.log('$tpl:', $tpl);
                                if (!data || data.length < 1) {
                                    $empty.show().removeClass('hide');
                                    $target.children().not('[name=tpl],[name=search],[name=empty]').remove();
                                } else {
                                    let html = [], $tpl = $('<div></div>').append($target.find('[name=tpl]').clone().attr('name', '').removeClass('hide')); // div로 감싸사 tpl 첫 DOM도 data-bind를 쓸수 있도록 합니다. 그리고 $tpl.html()을 하면 div는 제외하고 tpl만 추출됩니다.
                                    for (let i in data) {
                                        let _row = data[i], _tpl = $tpl.clone();
                                        for (let k in _row) {
                                            let $row = _tpl.find('[data-bind="row.' + k + '"]'), vn = _row[k], format = $row.attr('data-format'), decimals = $row.attr('data-decimals');
                                            switch (format) {
                                                case 'attr': $row.attr('data-' + k, vn); break;
                                                case 'comma': $row.text(real_number_format(vn, decimals)); break;
                                                case 'date':
                                                    $row.each(function () {
                                                        let date_format = $(this).attr('data-date_format') || '';
                                                        $(this).text(date_format ? date(date_format, vn) : vn);
                                                    })
                                                    break;
                                                case 'add-class': $row.addClass(vn); break;
                                                case 'number': $row.text((vn + '').replace(/[^0-9.-]/g, '')); break;
                                                // case 'html': $row.html(vn); break;
                                                default:
                                                    $row.each(function () {
                                                        const TAGNAME = this.tagName ? this.tagName.toUpperCase() : '';
                                                        switch (TAGNAME) {
                                                            case 'A':
                                                                $row.attr('href', vn); break;
                                                            default:
                                                                if (format == 'html') {
                                                                    $row.html(vn);
                                                                } else {
                                                                    $row.text(vn);
                                                                }
                                                        }
                                                    });
                                                    break;
                                            }
                                        }
                                        html[i] = _tpl.html();
                                    }
                                    $target.children().not('[name=tpl],[name=search],[name=empty]').remove();
                                    $target.append(html.join(''));
                                }
                                break;
                            case 'comma':
                                vt = real_number_format(vn);
                                break;
                            case 'number':
                                vt = (vn + '').replace(/[^0-9.]/g, '') * 1;
                                break;
                            case 'add-class':
                                $(this).addClass(vn);
                                return; // 클래스 추가후 끝.
                                break;
                            case 'background-image':
                                $(this).css('background-image', 'url('+vn+')');
                                return; // 클래스 추가후 끝.
                                break;
                            default:
                                vt = vn;
                        }
                        // 값 지정
                        // console.log('tagname:', tagname);
                        switch (tagname) {
                            case 'INPUT':
                                let type = ($(this).attr('type') + '').toUpperCase();
                                switch (type) {
                                    case 'CHECKBOX':
                                        // $(this).prop('checked', vn==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
                                        let same_value = vn == $(this).val(); // 값이 같은가?
                                        // 값이 같은데 체크 안되있으면 클릭해서 체크함.
                                        // 값이 다른데 체크 되있으면 클릭해서 언체크함.
                                        // console.log('same_value:', same_value);
                                        // console.log('checked:', $(this).is(':checked'));
                                        if (same_value && !$(this).is(':checked') || !same_value && $(this).is(':checked')) {
                                            $(this).trigger('click');
                                        }
                                        break;
                                    case 'RADIO': // 라디오, 채크박스는 값이 같으면 checked 속성을 넣습니다.
                                        // $(this).prop('checked', vt==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
                                        if (vt == $(this).val()) { $(this).trigger('click'); }
                                        break;
                                    case 'NUMBER': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
                                    case 'HIDDEN': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
                                        $(this).val(vt);
                                        break;
                                    default:
                                        vt = (vt && vt.toNumber() == vt && (typeof (vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
                                        $(this).val(vt);
                                }
                                break;
                            case 'TEXTAREA':
                            case 'SELECT':
                                $(this).val(vt);
                                break;
                            case 'IMG':
                            case 'IFRAME':
                                $(this).attr('src', vt);
                                break;
                            default:
                                if ('userid' != i) { // userid는 콤마 미입력
                                    vt = (vt && vt.toNumber() == vt && (typeof (vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
                                }
                                // console.log('vt:', vt, '$(this):', $(this));
                                $(this).html(vt);
                                break;
                        }
                    });

                    // display-bind
                    // <div data-display="market.use_userpw=Y"></div>
                    $('[data-display^="' + property + '.' + i + '"]').each(function () { //
                        let data = $(this).attr('data-display');
                        data = data.split('=');
                        if (vn == data[1]) {
                            $(this).removeClass('hide').attr('style', '');
                        } else {
                            $(this).addClass('hide').attr('style', '');
                        }
                    });
                }
            }
        }
    }
    if (APP_RUNMODE != 'live') {
        window.rander = rander;
    }
    const force_rander = function (name, value) {
        // console.log('==force_rander== ', name);
        rander(name, value, value, true);
    }
    if (APP_RUNMODE != 'live') {
        window.force_rander = force_rander;
    }
    // inpuut에 입력값 bind 데이터에 반영하기... 작업중
    // $('[data-bind]').on('click keyup', function () { 
    //     let target = $(this).attr('data-bind');
    //         target = target.split('.');
    //         let parent = target[0];
    //         parent = clone(Model[parent]);
    //         parent = null;
    //         for (i in target) {
    //             const key = target[i];
    //             if (i == 0) {
    //                 parent = clone(Model[key]);
    //             } else {
    //             }
    //             if(i == target.length-1){
    //             }
    //         }
    // })

    const _get_Model_value = function (target, property) {
        let r = target[property] ? JSON.parse(Decrypt(target[property], key, 256)) : '';
        try {
            if (session_item.indexOf(property) > -1 && sessionStorage.getItem(property)) {
                r = JSON.parse(Decrypt(sessionStorage.getItem(property), key, 256));
            }
            if (local_item.indexOf(property) > -1) {
                r = JSON.parse(Decrypt(localStorage.getItem(property), key, 256));
            }
            if (cookie_item.indexOf(property) > -1) {
                // console.log(key);
                // r = JSON.parse(Decrypt(getCookie(property), key, 256));
                r = getCookie(property);
            }
        } catch (e) {
            r = '';
        }
        return r;
    }
    const handler = {
        get: function (target, property) {
            return _get_Model_value(target, property);
        },
        set: function (target, property, value) {
            // get oldValue
            let oldValue = _get_Model_value(target, property);
            try {
                if (session_item.indexOf(property) > -1) {
                    sessionStorage.setItem(property, Encrypt(JSON.stringify(value), key, 256));
                } else if (local_item.indexOf(property) > -1) {
                    localStorage.setItem(property, Encrypt(JSON.stringify(value), key, 256));
                } else if (cookie_item.indexOf(property) > -1) {
                    // setCookie(property, Encrypt(JSON.stringify(value), key, 256))
                    setCookie(property, value)
                } else {
                    target[property] = Encrypt(JSON.stringify(value), key, 256);
                }
                // Notify model changes if value is changed.
                if (JSON.stringify(value) !== JSON.stringify(oldValue) && rander) {
                    // alert(property)
                    rander(property, value, oldValue);
                }
            } catch (e) {
                console.error(e)
            }
            return true;
        }
    };

    let Model = {};

    try {

        // proxy 방식
        Model = new Proxy(__data__, handler);

    } catch (e) {

        // Proxy 객체 정의가 안되면 무식하게 무한루핑으로 값이 바뀌는 것을 찾아야 한다.
        let OLD_Model = clone(Model);
        const check_proxy_value = function () {
            for (i in Model) {
                let __n = Model[i],
                    __o = OLD_Model[i];
                if (JSON.stringify(__n) !== JSON.stringify(__o) && rander) {
                    rander(i, __n, __o);
                }
            }
            OLD_Model = clone(Model);
            setTimeout(function () { check_proxy_value(); }, 100);
        };
        check_proxy_value();

    }

    if (APP_RUNMODE != 'live') {
        window.Model = Model;
    }
    // Model.addChangeListener = addChangeListener;

    // 기본 데이터 셋팅
    // Model.user_info = {};
    // Model.user_wallet = {};
    Model.check_SMS_for_bank = false; // 은행정보 수정시 sms 인증 확인하기여부
    Model.currency = {
        'KRW': { 'pre_symbol': '', 'sub_symbol': __('원'), 'exchange_price': 1, 'is_blockchain': false, 'is_virtual_currency': false, 'symbol_image': '', 'name': '대한민국 원' },
        'USD': { 'pre_symbol': '$ ', 'sub_symbol': '', 'exchange_price': 1400, 'is_blockchain': false, 'is_virtual_currency': false, 'symbol_image': '', 'name': 'USD' }
    }
    Model.exchange_rate = { // 환율
        'base_currency': 'KRW',
        'base_symbol': '$',
        'KRW': Model.currency.KRW.exchange_price,
        'USD': Model.currency.USD.exchange_price
    };
    Model.company_info = { // getMyInfo/company_bank_info.php
        'bank_name': '',
        'bank_address': '',
        'depositor': '',
        'fee_address': {
            'BDC': '',
            'GWS': '',
            'HTC': '',
            'KRW': ''
        }
    }
    Model.goods = { // 판매상품
        'product': [ // 상품
            // { // goods.idx = 1
            // 	'idx':'1',
            // 	'goods_name' : __('Building'),
            // 	'goods_image' : '',
            // 	'goods_type' : 'BUILDING/HOTEL'
            // }
        ]
    };
    Model.web_config = {
        // '1st_mentor': 10, //첫번째 멘토 10% 수수료 지급
        // '2nd_mentor': 5, //두번째 멘토- 첫번째 수수료에 5% 지급
        // 'active_goldkey': 200, //활성화 필요 골든애그
        // 'match_per': 40, //회사 매칭 퍼센트 기본 60%
        // 'withdrawal_fee_percent': 1, //출금수수료(percent, 1%)
        // 'min_withdrawal_amount': 50, // 최소 출금 금액(50 USDT)
        // 'myself': 12 //판매자 본인 이익금에 12%
    }

    /**
     * API Request 객체
     */
    var items = [],
        callbacks = [],
        timeoutkeys = [],
        request_warkable = true;
    const request_api = function () {
        // console.log('----------request_api --------------------');
        // console.log('request_warkable:',request_warkable);
        // console.log('items:',items);
        setTimeout(request_api, 300); //key_request =
        if (request_warkable && items && items.length > 0) {
            // console.log('---------------> request_api working');
            request_warkable = false;
            var _items = items,
                _callbacks = callbacks;
            items = [];
            callbacks = [];
            let form = { 'item': _items };
            form.token = getCookie('token');
            $.post(API_URL + '/request/?', form, function (r) {
                request_warkable = true;
                const cnt = r.payload.length;
                for (let i = 0; i < cnt; i++) {
                    const tr = r.payload[i];
                    const response = JSON.parse(tr.data);
                    if (response.error && response.error.code === '001') {
                        // console.log('---------------> logout response:', response);
                        // alert(__('다시 로그인 해주세요.'));
                        // fn_logout();
                        // return false;
                    }
                    if (_callbacks[i]) { _callbacks[i](response, i); }
                }
            }, 'json');
        }
    };
    request_api();

    const add_request_item = function (method_name, params, callback, repeat_time, old_path_name, duplicate) {
        var curr_path_name = path_name,
            old_path_name = old_path_name ? old_path_name : curr_path_name;
        if (repeat_time > 0 && old_path_name !== curr_path_name) { // 이전에 얘약걸어 둔 작업이 페이지가 다르면 종료합니다.(path_name으로 확인해 전체 경로를 비교합니다.)
            return false;
        }
        if (typeof params == typeof '') {
            params = unserialize(params);
        }
        params.lang = APP_LANG;
        if (Model.token) { params.token = Model.token; }
        const item = { "method": method_name, "params": params };
        if (!duplicate) {
            for (var i in items) {
                // console.log('add_request_item 중복여부:', JSON.stringify(items[i]) == JSON.stringify(item), JSON.stringify(items[i]) ,  JSON.stringify(item))
                if (JSON.stringify(items[i]) == JSON.stringify(item)) {
                    return; // 중복시 추가 종료.
                }
            }
        }
        items.push(item);
        let indexno = items.length - 1;
        callbacks[indexno] = callback;
        if (repeat_time > 0 && old_path_name === curr_path_name) {
            let newtimeoutkey = setTimeout(function () {
                add_request_item(method_name, params, callback, repeat_time, curr_path_name);
            }, repeat_time);
            timeoutkeys[indexno] = newtimeoutkey;
        }
    };

    /* Utils ----------------------------------------------------------------------------------- */

    // 가격 변환
    const dprice = function (p, c) {
        let exchange_currency = c || Model.user_info && Model.user_info.exchange_currency || Model.exchange_rate.base_currency,
            pre_symbol = Model.currency[exchange_currency].pre_symbol,
            sub_symbol = Model.currency[exchange_currency].sub_symbol,
            exchange_price = Model.currency[exchange_currency].exchange_price;
        return pre_symbol + real_number_format(p * exchange_price) + sub_symbol;
    }

    /**
     * 페이징 HTML을 생성합니다.
     * <div class="paging"></div>  속에 들어갈 HTML을 생성합니다. 외부 div태그는 이미 있어야 합니다.
     * @param {Number} p_total 전체 row수. 기본 0
     * @param {Number} p_page 현재 페이지번호. 기본 1
     * @param {Number} p_cnt_rows 한페이지에 표시할 row수. 기본 10
     * @param {Number} p_cnt_pages 페이지에 표시할 페이지수. 기본 10
     * @returns
     */
    const genPagingStube = function (p_total, p_page, p_cnt_rows, p_cnt_pages) {
        p_total = p_total ? p_total * 1 : 0;
        p_page = p_page ? p_page * 1 : 1;
        p_cnt_rows = p_cnt_rows ? p_cnt_rows * 1 : 10;
        p_cnt_pages = p_cnt_pages ? p_cnt_pages * 1 : 10;
        max_pages = p_total ? Math.ceil(p_total / p_cnt_rows) : 1;
        r = ''; //'<div class="paging">';
        // 이전페이지로
        if (p_total > 0 && p_page > 1) {
            r += '<span><a href="' + setUrlParamValue('page', p_page - 1, window.location.search) + '"><img src="/@resource/images/icon/ico_arr_prev.png" alt=""></a></span>';
        } else {
            r += '<span><img src="/@resource/images/icon/ico_arr_prev.png" alt="" class="inactive"></span>';
        }
        // 중간 페이지 번호영역
        batch = Math.ceil(p_page / p_cnt_pages);
        end = batch * p_cnt_pages;
        if (end == p_page) {
            //end = end + p_cnt_pages - 1;
            //end = end + ceil(p_cnt_pages/2);
        }
        if (end > max_pages) {
            end = max_pages;
        }
        start = end - p_cnt_pages + 1;
        start = (start < 1) ? 1 : start;
        for (i = start; i <= end; i++) {
            if (i == p_page) {
                r += '<span class="num active"><a href="' + setUrlParamValue('page', i, window.location.search) + '">' + i + '</a></span>';
            } else {
                r += '<span class="num"><a href="' + setUrlParamValue('page', i, window.location.search) + '">' + i + '</a></span>';
            }
        }
        // 다음페이지로
        if (p_total > 0 && p_page < max_pages) {
            r += '<span><a href="' + setUrlParamValue('page', p_page + 1, window.location.search) + '"><img src="/@resource/images/icon/ico_arr_next.png" alt=""></a></span>';
        } else {
            r += '<span><img src="/@resource/images/icon/ico_arr_next.png" alt="" class="inactive"></span>';
        }
        // r += '</div>';
        return r;
    }

    /**
     * 남은 시간 표시
     * @param {Number} end_time
     * @param {String} target_m
     * @param {Stirng} target_s
     */
    const display_remain_time = (end_time, target_m, target_s) => {
        let delta_time = end_time - Math.floor(new Date().getTime() / 1000),
            min = delta_time < 0 ? 0 : Math.floor(delta_time / 60),
            sec = delta_time < 0 ? 0 : delta_time % 60;
        $(target_m).text(sprintf("%02d", min));
        $(target_s).text(sprintf("%02d", sec));
        if (delta_time >= 0) {
            setTimeout(function () { display_remain_time(end_time, target_m, target_s); }, 500);
        }
    }

    const load_file = (file) => {
        // $('#'+md5(file)).remove();
        if ($('#' + md5(file)).length > 0) {
            return false;
        }
        if (file.indexOf('.js') > 0) {
            $('body').append('<script type="text/javascript" src="' + file + '" id="' + md5(file) + '"></script>');
        }
        if (file.indexOf('.css') > 0) {
            $('head').append('<link rel="stylesheet" type="text/css" href="' + file + '" id="' + md5(file) + '">');
        }
    }

    const gen_qrcode = (target, qrdata) => {
        $(target).empty().qrcode({ width: $(target).width(), height: $(target).width(), text: qrdata });
    }

    const CopyUrlToClipboard = (target) => {
        var obShareUrl = document.getElementById("ShareUrl");

        obShareUrl.value = window.document.location.href; // 현재 URL 을 세팅해 줍니다.
        obShareUrl.select(); // 해당 값이 선택되도록 select() 합니다
        document.execCommand("copy"); // 클립보드에 복사합니다.
        obShareUrl.blur(); // 선택된 것을 다시 선택안된것으로 바꿈니다.
        // alert(__("URL이 클립보드에 복사되었습니다"));
    }

    let sound_obj = {};
    const sound_file = {
        // 'switch': '/assets/sound/switch.mp3',
        // 'new_message': '/assets/sound/new_order.mp3',
        // 'new_order': '/assets/sound/new_order.mp3'
    }
    for (i in sound_file) {
        let audio = new Audio();
        audio.src = sound_file[i];
        sound_obj[i] = audio;
    }
    const sound_play = (name) => {
        if (Model.user_info.sound_onoff !== 'N' && sound_obj[name]) {
            // sound_obj[name].play();
        }
    }

    /**
     * create thumbnail image from video file
     * @param video DOM
     */
    function thumbnail_video(video) {
        var canvas = document.getElementById('canvas');
        // var video = document.getElementById('video');
        canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    }

    /* for users photo */
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var img = document.getElementById("photo");

            reader.onload = function (e) {
                $('#photo').attr('src', e.target.result);

                img.onload = function () {
                    imgW = this.naturalWidth;
                    imgH = this.naturalHeight;
                    // console.log(imgW, imgH)

                    if (imgW > imgH) { // 이미지 가로 사이즈가 세로 사이즈보다 클 경우 실행
                        $('#photo').addClass('land');
                    } else {
                        $('#photo').removeClass('land');
                    }
                }
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function view_image(input, $img, service) {
        var img = $img ? $img.get(0) : null,
            src = '';
        let tagName = img.tagName.toUpperCase();
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            if (!img) { return; }

            reader.onload = function (e) {
                src = e.target.result;
                if (tagName == 'IMG') {
                    $img.attr('src', src);
                } else {
                    $img.css('background', 'url(' + src + ') no-repeat 50% 50%/cover #e1e1e1');
                }
                img.onload = function () {
                    imgW = this.naturalWidth;
                    imgH = this.naturalHeight;
                    if (imgW > imgH) { // 이미지 가로 사이즈가 세로 사이즈보다 클 경우 실행
                        $img.addClass('land');
                    } else {
                        $img.removeClass('land');
                    }
                }
            }
            reader.readAsDataURL(input.files[0]);
            return true;
        } else if (input.type == 'hidden' || input.type == 'text') {
            src = input.value;
            if (tagName == 'IMG') {
                $img.attr('src', src);
            } else {
                $img.css('background', 'url(' + src + ') no-repeat 50% 50%/cover #e1e1e1');
            }
            return true;
        } else {
            console.error(__('파일이 없습니다.'));
            return false;
        }
    }

    function view_video(input, $iframe) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var iframe = $iframe ? $iframe.get(0) : null;
            if (!iframe) { return; }

            reader.onload = function (e) {
                $iframe.attr('src', e.target.result);

                //$img.attr('src', src);
                iframe.onload = function () {
                    iframeW = this.naturalWidth;
                    iframeH = this.naturalHeight;
                    // console.log(this, iframeW, iframeH)

                    if (iframeW > iframeH) { // 이미지 가로 사이즈가 세로 사이즈보다 클 경우 실행
                        $iframe.addClass('land');
                    } else {
                        $iframe.removeClass('land');
                    }
                }
            }

            reader.readAsDataURL(input.files[0]);
        }
    }

    function view_video_thumnail(event, callback) {
        var file = event.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = function () {
            var blob = new Blob([fileReader.result], { type: file.type });
            //console.log(blob);
            var url = URL.createObjectURL(blob);
            var video = document.createElement('video');
            var timeupdate = function () {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                    video.pause();
                }
            };
            video.addEventListener('loadeddata', function () {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                }
            });
            var snapImage = function () {
                var canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
                var image = canvas.toDataURL();
                //console.log(image);
                var success = image.length > 100000;
                if (success) {
                    $("#thumb1").css('background', 'url(' + image + ') no-repeat 50% 50%/cover #e1e1e1');
                    //console.log(image);
                    //document.getElementsByTagName('div')[0].appendChild(img);
                    URL.revokeObjectURL(url);
                }
                if (callback && typeof callback == typeof
                    function () { }) {
                    callback();
                }
                return success;
            };

            video.addEventListener('timeupdate', timeupdate);
            video.preload = 'metadata';
            video.src = url;
            // Load video in Safari / IE11
            video.muted = true;
            video.playsInline = true;
            video.play();
        };
        fileReader.readAsArrayBuffer(file);
    }

    //url 가져오기
    const get_video_url = function (html) {
        html = $.trim(html);
        let src = '',
            res = ''; //https://www.youtube.com/watch?v=RGuMWr79G00
        if (html.indexOf("//youtu.be/") > -1) { // https://youtu.be/RGuMWr79G00
            src = "https://www.youtube.com/embed/" + (html.replace(/.*\/\/youtu.be\//, '').replace(/\&.*/, ''));
        } else if (html.indexOf("//youtube.com/watch?v=") > -1) { // https://youtube.com/watch?v=xpW7mWSa-1g&feature=youtu.be
            src = "https://www.youtube.com/embed/" + (html.replace(/.*\/\/youtube.com\/watch\?v=/, '').replace(/\&.*/, ''));
        } else if (html.indexOf("//m.youtube.com/watch?v=") > -1) { // https://m.youtube.com/watch?v=xpW7mWSa-1g&feature=youtu.be
            src = "https://www.youtube.com/embed/" + (html.replace(/.*\/\/m.youtube.com\/watch\?v=/, '').replace(/\&.*/, ''));
        } else if (html.indexOf("//www.youtube.com/watch?v=") > -1) { // https://www.youtube.com/watch?v=xpW7mWSa-1g&feature=youtu.be
            src = "https://www.youtube.com/embed/" + (html.replace(/.*\/\/www.youtube.com\/watch\?v=/, '').replace(/\&.*/, ''));
            // } else if( html.indexOf("https://tv.naver.com/")>-1 ) { // https://tv.naver.com/v/15313024
            // 	res = html.match(/(https?:\/\/)?tv\.naver\.com\/v\/(\w+)/);
            // 	src ="https://tv.naver.com/embed/"+ res[2];
            // } else if( html.indexOf("https://tv.kakao.com/channel/")>-1 ) { // https://tv.kakao.com/channel/2785655/cliplink/410787506
            // 	res = html.match(/(https?:\/\/)?tv\.kakao\.com\/(\w+)\/(\w+)\/cliplink\/(\w+)/);
            // 	src ="https://tv.kakao.com/embed/player/cliplink/"+ res[4];
            // } else if( html.indexOf("https://www.dailymotion.com")>-1 ) { // https://www.dailymotion.com/video/x7vxo1m?playlist=x6hzyk
            // 	res = html.match(/(https?:\/\/)?www\.dailymotion\.com\/video\/(\w+)\?/);
            // 	src ="https://www.dailymotion.com/embed/video/"+ res[2];
        } else if (html.indexOf('<iframe ') > -1) { // <iframe width="684" height="315" src="https://www.youtube.com/embed/mvf87FPh55s" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            src = html.match(/src="(.[^"]*)"/);
            src = src ? src[1] : (html.match(/src='(.[^']*)'/) ? html.match(/src='(.[^']*)'/)[1] : '');
            src = src ? src : (html.match(/src=(.[^ ]*) /) ? html.match(/src=(.[^ ]*) /)[1] : '');
        } else if (html.indexOf('http://') > -1 || html.indexOf('https://') > -1) { // https://www.youtube.com/embed/RGuMWr79G00 그냥 진짜 동영상 URL 입력시
            // src = html;
        }
        return src;
    }

    //youtube 이미지 가져오기
    const get_video_img = function (videourl) {
        let r = [];
        // youtube
        if (videourl.indexOf('youtube') > -1) {
            // https://www.youtube.com/embed/pYuqTryDdw4
            let id = '';
            if (videourl.indexOf('//www.youtube.com/embed/') > -1) {
                id = videourl.replace('https://www.youtube.com/embed/', '');
                if (id && id.indexOf('?') > -1) {
                    id = id.substr(0, id.indexOf('?'));
                }
            }
            if (videourl.indexOf('//www.youtube.com/watch') > -1) {
                id = videourl.match(/youtube.com\/watch\?v=(.[^&]*)/);
                id = id ? id[1] : '';
            }
            // jQuery.get('https://www.youtube.com/oembed?format=xml&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DW86o7aLA9ZQ', function(r){console.log('r.thumbnail_url:',$('thumbnail_url',r).text());});
            /*
            <oembed>
                <title>[Ali] 알리 베스트63 연속듣기</title>
                <author_name>euna4ever</author_name>
                <author_url>https://www.youtube.com/c/euna4ever</author_url>
                <type>video</type>
                <height>113</height>
                <width>200</width>
                <version>1.0</version>
                <provider_name>YouTube</provider_name>
                <provider_url>https://www.youtube.com/</provider_url>
                <thumbnail_height>360</thumbnail_height>
                <thumbnail_width>480</thumbnail_width>
                <thumbnail_url>https://i.ytimg.com/vi/W86o7aLA9ZQ/hqdefault.jpg</thumbnail_url>
                <html><iframe width="200" height="113" src="https://www.youtube.com/embed/W86o7aLA9ZQ?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></html>
            </oembed>
            */
            $.get({
                'url': 'https://www.youtube.com/oembed?format=xml&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D' + id,
                'async': false,
                'success': function (res) {
                    r.push($('thumbnail_url', r).text()); // 
                }
            })
            // r.push('https://img.youtube.com/vi/' + id + '/maxresdefault.jpg'); // 1280x1080
            // r.push('https://img.youtube.com/vi/' + id + '/sddefault.jpg'); // 520x390
            // r.push('https://img.youtube.com/vi/' + id + '/hqdefault.jpg'); // 480x360
            // r.push('https://img.youtube.com/vi/' + id + '/mqdefault.jpg'); // 320x180
        }
        // 카카오.. 음.. html 파싱해야하는데 crossdomain 정책때문에 서버에서 해야 할것 같음. 쩝.
        return r;
    }

    const check_userinfo = function () {
        if (!Model.user_info || !Model.user_info.userno) {
            alert(__('로그인 해주세요'));
            closeModal();
            return false;
        }
        if (Model.user_info && Model.user_info.userno && !Model.user_info.nickname) {
            alert(__('회원정보를 등록 해주세요'));
            closeModal();
            $('.btn-user-menu[name="btn-userinfo"]').click();
            return false;
        }
    }

    /**
     * https 가 아닌 http로 페이지를 열어야 할때 사용합니다.
     */
    const use_http = function () {
        // if(window.location.href.indexOf('https://')>-1) {
        // 	window.location.replace( window.location.href.replace('https://', 'http://') );
        // }
    }

    // 페이징 처리
    let scroll_searching = false,
        scroll_end = false;
    // const tpl_video_item = '<li><a href="/views.php?video_idx={video_idx}"><div class="img" style="background-image:url({video_img});background-size:cover" alt="{title}"></div></a><div class="explan"><span class="picture"><img src="{user_profile_img}" alt="{nickname}"></span><p class="txt"><a href="/views.php?video_idx={video_idx}">{title}</a></p><div class="pay_date"><p class="pay"><a href="user-main.php?userno={video_userno}"><span class="name">{nickname}</span></a><span class="ico_pay"></span><span>{view_cnt}</span></p><p class="date">{reg_date}</p></div></div></li>';
    const tpl_video_item = '<li><a href="/views.php?video_idx={video_idx}"><div class="img" style="background-image:url({video_img});background-size:cover" alt="{title}"></div></a><div class="explan"><a href="user-main.php?userno={video_userno}"><span class="picture" style="background-image:url({user_profile_img})"></span></a><p class="txt"><a href="/views.php?video_idx={video_idx}">{title}</a></p><div class="pay_date"><p class="pay"><a href="user-main.php?userno={video_userno}"><span class="name">{nickname}</span></a><span class="ico_pay"></span><span>{view_cnt}</span></p><p class="date">{reg_date}</p></div></div></li>';

    const gen_video_htmnl = function (r) {
        if (r && r.payload) {
            let html = [];
            let data = r.payload.data || [];
            if (data.length < 1) {
                scroll_end = true;
            }
            for (i = 0; i < data.length; i++) {
                let row = data[i];
                // console.log(row);
                html[i] = tpl_video_item
                    .replace(/\{video_img\}/g, row.file_name || 'about:blank')
                    .replace(/\{user_profile_img\}/g, row.profile_img || '/@resource/images/common/basic_profile.png')
                    .replace(/\{nickname\}/g, row.nickname || '')
                    .replace(/\{title\}/g, row.title || '')
                    .replace(/\{reg_date\}/g, row.reg_date.substr(1, 10) || '')
                    .replace(/\{video_idx\}/g, row.idx || '')
                    .replace(/\{video_userno\}/g, row.userno || '')
                    .replace(/\{view_cnt\}/g, real_number_format(row.view_cnt) || '')
                    // .replace(/\{level_class\}/g, row.level_class||'lv-red')
                    // .replace(/\{level_name\}/g, row.level_name||__('Red'))
                    ;
            }
            $('.play-list ul.item-grid').append(html.join(''));
        }
        scroll_searching = false;
    }
    // 페이징 처리


    const add_event_click_left_menu_tab = function () {
        $('#left_menu .inTabs li').on('click', function () {
            let t = $(this).attr('data-target');
            $(this).addClass('active').siblings().removeClass('active');
            $(t).show().siblings('.tab_con').hide();
        });
    }

    const check_login = function (msg) {
        if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
            if (msg) alert(msg);
            window.location.href = LOGIN_PAGE;
        }
    }
    const check_logout = function (msg) {
        if (Model.user_info && Model.user_info.userid && Model.user_info.userno) {
            if (msg) alert(msg);
            window.location.href = "/";
        }
    }

    /**
     * 새 채팅 매시지 가져오기
     * 채팅 페이지 컨트롤러에 있던 함수를 전체 페이지에서 사용할수 있게 위치변경함.
     * @param {number} t
     */
    const get_new_message = function (t) {
        let last_msg_idx = $('[name=msg_box]:last').attr('data-idx');
        add_request_item('getChatMessage', { 'token': getCookie('token'), 'last_msg_idx': last_msg_idx, 'target_idx': window.chat_target_idx }, function (r) {
            if (r && r.success && r.payload && !r.error) {
                let messages = r.payload;
                let html = [],
                    i = 0,
                    view_end = false;
                if (messages.length > 0) {
                    for (i in messages) {
                        let msg = messages[i];
                        if ($('li[name=msg_box][data-idx=' + msg.idx + ']').length > 0) { continue; }
                        html[i] = get_html(msg);
                        i++;
                    }
                    // 채팅창이 밑 끝에서 -20px 정도까지 내려가 있으면 끝에 있다고 생각하기
                    // console.error($('.comment-wrap').scrollTop(), $('.comment-wrap').innerHeight(), $('.comment-wrap')[0].scrollHeight);
                    if ($('.comment-wrap').scrollTop() + $('.comment-wrap').innerHeight() > $('.comment-wrap')[0].scrollHeight - 20) {
                        view_end = true;
                    }
                    $('[name=comment-list]').append(html.join(''));
                    // 끝에 있으면  새글볼 수 있게 밑으로 자동으로 내려가기
                    // console.log('view_end:',view_end);
                    if (view_end) {
                        // $('.comment-wrap').scrollTop($('[name=comment-list]').height() * 1 + 100);
                        set_scroll_bottom();
                    }
                }
            }
        });
        if (t > 0) {
            setTimeout(function () { get_new_message(t); }, t);
        }
    }
    // 채팅 내용 가져오기
    const tpl_suport = '<div class="realtime_spon" name="msg_box" data-idx="{idx}">\
    {html_delete_icon}\
    <p class="pay_meney">{amount_str}<img src="/@resource/images/icon/ico_smart_pay.png" alt=""></p><p class="txt"><a href="/user-main.php?userno={userno}">{nickname}</a> 님이 {amount_str} PAY를 조공하였습니다</p></div>';
    const tpl_chat = '<dl name="msg_box" data-idx="{idx}">\
    {html_delete_icon}\
    <dt><a href="/user-main.php?userno={userno}"><img src="{profile_img}" alt="{nickname}"></a></dt><dd><p class="name"><a href="/user-main.php?userno={userno}">{nickname}</a> <img src="/@resource/images/icon/ico_fan1.png" alt=""></p><p class="txt">{comment}</p></dd></dl>';
    const get_html = function (msg) {
        // console.log(msg, msg.amount, get_coin_icon_class(msg.amount));
        let tpl = msg.amount > 0 ? tpl_suport : tpl_chat;
        return tpl
            .replace(/\{idx\}/g, msg.idx)
            .replace(/\{profile_img\}/g, msg.profile_img || '/@resource/images/common/basic_profile.png')
            .replace(/\{nickname\}/g, msg.nickname || msg.name)
            .replace(/\{amount\}/g, msg.amount)
            .replace(/\{userno\}/g, msg.userno)
            .replace(/\{amount_str\}/g, number_format(msg.amount))
            .replace(/\{coinname\}/g, Model.currency && Model.currency[msg.symbol] && Model.currency[msg.symbol].name)
            .replace(/\{coin_icon\}/g, get_coin_icon_class(msg.amount))
            .replace(/\{comment\}/g, nl2br(htmlspecialchars(msg.comment)))
            .replace(/\{supported-user\}/g, msg.amount > 0 ? 'supported-user' : '')
            .replace(/\{hide_spon\}/g, msg.amount > 0 ? '' : 'hide')
            .replace(/\{html_delete_icon\}/g, msg.userno == Model.user_info.userno ? '<a href="#" class="chat_close"><img src="/@resource/images/icon/ico_close2.png" alt="" data-idx="' + msg.idx + '" class="btn btn-delete-msg"></a>' : '');
    }
    const get_old_message = function () {
        if (scroll_searching || scroll_end) { return false; } // 작업중이거나 끝까지 로딩 했으면 중단.
        scroll_searching = true;
        let prev_msg_idx = $('[name=msg_box]:first').attr('data-idx');
        add_request_item('getChatMessage', { 'token': getCookie('token'), 'prev_msg_idx': prev_msg_idx, 'target_idx': window.chat_target_idx }, function (r) {
            scroll_searching = false;
            if (!r.payload || !r.payload.length) {
                scroll_end = true;
                $('[name=comment-list]').prepend('<li class="center">' + __('더이상 내용이 없습니다.') + '</li>');
            }
            if (r && r.success && !r.error) {
                let messages = r.payload;
                let html = [],
                    i = 0;
                for (i in messages) {
                    let msg = messages[i];
                    html[i] = get_html(msg);
                    i++;
                }
                $('[name=comment-list]').prepend(html.join(''));
                // 현재 보고 있는 위치가 변경되는 현상때문에 보던 위치로 이동합니다.
                $('.comment-wrap').scrollTop($('li[data-idx=' + prev_msg_idx + ']').position().top);
            }
        });
    }
    const set_scroll_bottom = function () {
        $('.comment-wrap:visible').scrollTop($('[name=comment-list]:visible').height());
    }
    // 모바일에서는 채팅위치 변경 - 우측 채팅영역이 숨겨지면 동영상 밑으로 이동
    const set_position_chatbox = function () {
        if ($('.right_menu').is(':visible')) {
            $('.mobile_cheat_box').hide();
            set_scroll_bottom();
        } else {
            $('.mobile_cheat_box').show();
            set_scroll_bottom();
        }
    }

    /* 서버 값 가져오기 ----------------------------------------------------------------------------------- */

    /**
     * 회원정보 가져오기
     */
    const request_user_info = function () {
        add_request_item('getMyInfo', { 'token': getCookie('token') }, function (r) {
            console.log('getMyInfo r:', r);
            if (r && r.success && !r.error) {
                let user_info = r.payload;
                Model.user_info = user_info;
                force_rander('user_info', user_info);
                reset_logedin_status();
            }
        });
    }
    request_user_info();

    window.get_user_info = function () {
        return clone(Model.user_info);
    }

    /**
     * 회원지갑(잔액)정보 가져오기
     */
    const get_user_wallet = function () {
        add_request_item('getBalance', { 'token': getCookie('token') }, function (r) {
            if (r && r.success && !r.error) {
                let user_wallet = {};
                for (i in r.payload) {
                    let row = r.payload[i];
                    row.confirmed = row.confirmed * 1;
                    row.unconfirmed = row.unconfirmed * 1;
                    user_wallet[row.symbol] = row;
                }
                Model.user_wallet = user_wallet;
            }
        });
    }
    get_user_wallet();

    /**
     * 화폐정보 가져오기
     */
    const get_currency = function (symbol) {
        symbol = symbol ? symbol : ''
        add_request_item('getCurrency', {'symbol':symbol}, function (r) {
            if (r && r.success && !r.error) {
                let currency = Model.currency;
                let exchange_rate = Model.exchange_rate;
                for (i in r.payload) {
                    let row = r.payload[i];
                    // 아라튜브에서는 HTC : HTP = 1 : 1000 으로 유지해야 해서 HTC의 가격을 10000으로 고정합니다.
                    if (row.symbol == 'HTC') {
                        row.price = 10000;
                    }
                    // 화폐정보
                    if (currency[row.symbol]) {
                        currency[row.symbol].exchange_price = row.price * 1;
                        currency[row.symbol].name = row.name;
                    } else {
                        currency[row.symbol] = {
                            'exchange_price': row.price * 1,
                            'is_blockchain': row.crypto_currency == 'Y' ? true : false,
                            'is_virtual_currency': true,
                            'pre_symbol': '',
                            'sub_symbol': ' ' + row.symbol,
                            'name': ' ' + row.name,
                            'symbol_image': row.icon_url
                        }
                    }
                    // 환율
                    if (exchange_rate[row.symbol]) {
                        exchange_rate[row.symbol] = row.price * 1;
                    }
                }
                Model.currency = currency;
                Model.exchange_rate = exchange_rate;
            }
        });
    }
    get_currency('USD,KRW');


    /* Controller ----------------------------------------------------------------------------------- */

    const fn_index = function () {
        
        $(".icon--help").hover(function () {
            $(".pop_up").show();
        }, function () {
            $(".pop_up").hide();
        });
        
        API.getBBSList('notice', 1, 5, (resp) => {
            if (resp.success) {
                $('#notice--list').empty()
                resp.payload.data.map((item) => {
                    const li = $('<li>')
                    const regDate = new Date(item.regdate)
                    li.append(`<a href="notice_detail.html" class="list--text">${item.subject}</a>`);
                    li.append(`<span class="list--date list--right">${regDate.getFullYear()}.${regDate.getMonth()}.${regDate.getDate()}</sp>`);
                    li.appendTo('#notice--list')
                })
            }
        })
        add_request_item('getTradeGoodsSummary', {}, function (r) {
            if (r && r.success && r.payload) {
                Model.trade_goods_summary = r.payload;
            }
        });
        add_request_item('getMainNoticeList', { 'bbscode': 'notice', 'by_category': 'N' }, function (r) {
            if (r && r.success && r.payload) {
                let html = [];
                const $target = $('[name=main_notice]');
                const tpl = $('<div></div>').append($target.find('[name=tpl]').clone().attr('name', '').css('display', '').removeClass('hide')).html();
                notice_list = r.payload;
                for (i in notice_list) {
                    let r = notice_list[i];
                    if (r.file) {
                        html.push(tpl
                            .replace('{message}', r.file ? '<img src="' + r.file + '" style="height:50px">' : r.contents)
                            .replace('{hide_new}', 'style="display:none;"')
                            .replace('{hide_tag}', 'style="display:none;"')
                        )
                    }
                }
                if (!notice_list || notice_list.length < 1) {
                    $target.closest('.news').hide();
                }
                $('[name=main_notice]').empty().append(html.join(''));
                // swiper 시작
                new Swiper('.news .column .swiper .swiper-wrapper', {
                    slidesPerView: 1,
                    direction: 'vertical',
                    loop: true,
                    allowTouchMove: true,
                    noSwiping: true,
                    noSwipingClass: 'swiper-slide',
                    preventInteractionOnTransition: true,
                    autoplay: {
                        delay: 2500,
                        disableOnInteraction: false,
                    },
                })
            }
        });
        // 지수 차트 생성
        window.displayChart('indexCanvas', 'GCA18KTDKK', Model.exchange_rate.base_currency, '1h'); // window.displayChart('chartdomid', 'GCA18KTDKK', 'KRW', '1h');

        // 인기 종목 표시 ( + 차트)
        const $PriceTableTarget = $('[name=price_table]');
        const $PriceTableEmpty = $PriceTableTarget.find('[name=empty]');
        const $PriceTableSearch = $PriceTableTarget.find('[name=search]');
        $PriceTableSearch.removeClass('hide').show();
        add_request_item('getSpotPrice', { 'symbol': 'HOT' }, function (r) {
            if (r && r.success && r.payload) {
                const spot_prices = r.payload;
                // Model.chart_data = [];
    
                // 가격표 표시
                let html = [];
                const tpl = $('<div></div>').append($PriceTableTarget.find('[name=tpl]').clone().attr('name', '').css('display', '').removeClass('hide')).html();
                for (i in spot_prices) {
                    const r = spot_prices[i];
                    if (!r || !r.name) { continue; }
                    // console.log('i:',i)
                    // $.get(API_URL+'/getChartData/', { 'symbol': r.symbol }, function (r) { 
                    // add_request_item('getChartData', { 'symbol': r.symbol }, function (r) { 
                    //     console.log(' r.payload:',  r.payload);
                    //     Model.chart_data[i] = r.payload;
                    // }); // 차트 데이터 요청
    
                    r.price_open *= 1;
                    r.price_close *= 1;
                    r.exchange = Model.exchange_rate.base_currency;
                    r.price_updown_sign = r.price_close > r.price_open ? '+' : (r.price_close < r.price_open ? '-' : '');
                    r.price_updown_symbol = r.price_updown_sign == '+' ? '▲' : (r.price_updown_sign == '-' ? '▼' : '');
                    r.price_updown_color = r.price_updown_sign == '+' ? 'text-red' : (r.price_updown_sign == '-' ? 'text-blue' : '');
                    r.price_updown_amount = r.price_close - r.price_open;
                    r.price_updown_rate = (r.price_close - r.price_open) / r.price_open;
                    r.price_updown_percent = ((r.price_close - r.price_open) / r.price_open * 100).toFixed(2) + '%';
                    
                    spot_prices[i] = r;  /// 계산값 재사용하기
    
                    html.push(tpl
                        .replace('{symbol}', r.symbol)
                        .replace('{exchange}', r.exchange)
                        .replace('{stock_name}', r.name)
                        .replace(/\{stock_updown_color\}/g, r.price_updown_color)
                        .replace('{stock_price}', real_number_format(r.price_close))
                        .replace('{stock_exchange}', r.exchange)
                        .replace('{stock_updown_percent}', r.price_updown_percent)
                    )
                }
                
                Model.spot_prices = spot_prices;
    
                $PriceTableTarget.children().not('[name=tpl],[name=search],[name=empty]').remove();
                if (html.length > 0) {
                    $PriceTableTarget.append(html.join('')).find('li:visible').trigger('click');
                } else {
                    $PriceTableEmpty.removeClass('hide').show()
                }
                $PriceTableSearch.addClass('hide').hide()
            }
        });
        Model.chart_info = {
            symbol: '',
            exchange: '',
            term: '12h',
            last_time: time(),
            last_date: date('Y.m.d H:i A')
        }
        // 종목 클릭시 차트 보여주기 .. 미사용
        $('[name=price_table]').on('click', 'li', function () {
            // const no = $(this).siblings().length - $(this).index(); // index는 안보이는것까지 포함되서 순위가 나와서 전체 친구들 수에서 index 값을 빼서 정확한 순서를 정합니다.
            // let p = Model.spot_prices[no];
            // if (p) {
            //     // 모델에 저장
            //     Model.selected_spot_price = p; // 선택된 상품 가격이 차트주변 지수가격에 보이도록 선택.
            //     // 차트 그리기
            //     chart_info = clone(Model.chart_info);
            //     chart_info.symbol = p.symbol;
            //     chart_info.exchange = p.exchange;
            //     chart_info.last_time = time();
            //     chart_info.last_date = date('Y.m.d H:i A');
            //     Model.chart_info = chart_info;
            //     window.displayChart('indexCanvas', chart_info.symbol, chart_info.exchange, chart_info.term); // window.displayChart('chartdomid', 'GCA18KTDKK', 'KRW', '1h');
            //     // 차트 기간 버튼 on/off
            //     $('[name="chart_term"]').find('[name="btn-term-' + chart_info.term + '"]').closest('li').addClass('on').siblings('li').removeClass('on');
            // }
        })
        // 차트 기간 변경
        $('[name="chart_term"] button').on('click', function () {
            const name = $(this).attr('name');
            const term = name.replace('btn-term-', '');
            chart_info = clone(Model.chart_info);
            chart_info.term = term;
            Model.chart_info = chart_info;
            window.displayChart('indexCanvas', chart_info.symbol, chart_info.exchange, chart_info.term); // window.displayChart('chartdomid', 'GCA18KTDKK', 'KRW', '1h');
            $(this).closest('li').addClass('on').siblings('li').removeClass('on');
        })
    
    }

    const fn_change_account_number = function() {
        check_login();

        if(Model.user_info.image_bank_url) $('.preview[for="file_identify_url"]').css('background-image', 'url(' + Model.user_info.image_bank_url + ')');

        // permission 값 의미 : 1: 가입여부, 2: 로그인여부, 3: 핸드폰 인증여부, 4: 신분증 인증 여부, 5:은행 인증 여부
        const permission_level = Model.user_info.permission.match(/1/g).length; // '11000' => 2 ,
        if (Model.user_info.permission.substr(4, 1) == '1') {// 신분증 인증 완료
            $('[name=status_success]').show();
        } else {
            if (Model.user_info.image_bank_url) { // 신분증 인증 대기중
                $('[name=status_waiting]').show();
            } else { // 신분증 인증 입력 필요
                $('[name=status_default]').show();
            }
        }
        let image_url = "";
        $('input[type="file"]').on('change', function () {
            const name = $(this).attr('title');
            const target = $(this).attr('data-target');
            image_url = upload_file($(this), name);
            $(target).val(image_url);
            $(target).siblings('[name="preview"]').css('background-image', 'url(' + image_url + ')').show();
            $('#bool_confirm_bank').val('0');
        })

        $('.box-image-selector .preview').on('click', function(){   $('#'+$(this).attr('for')).trigger('click'); })

        $('[name="btn_save"]').on('click', function () {
            if (!$('input[name="bank_name"]').val()) {
                alert(__('은행명을 입력하세요.'))
                return false
            }

            if (!$('input[name="bank_owner"]').val()) {
                alert(__('이름을 입력하세요.'))
                return false
            }

            if (!$('input[name="bank_account"]').val()) {
                alert(__('계좌번호를을 입력하세요.'))
                return false
            }

            if (!$('#change-account-number #file_bank_url').val()) {
                alert(__('통장사본을 선택해주세요.'))
                return false
            }

            add_request_item('putMyInfo', unserialize($('#change-account-number').serialize()), function(r) {
                if (r?.success) {
                    alert(__('저장했습니다.'));
                    $('[name=status_waiting]').show().siblings().hide();
                } else {
                    alert(__('저장하지 못했습니다.') + r?.error?.message||'')
                }
            })

            return false;
        })

    }

    const fn_transaction = function() {
        check_login();

        $('input[name="range"]').daterangepicker({
            format: 'YYYY-MM-DD',
            maxDate: (new Date()),
            autoUpdateInput: true,
            autoApply: true,
            locale: {
                format: 'YYYY-MM-DD',
                "daysOfWeek": [
                    __("일"),
                    __("월"),
                    __("화"),
                    __("수"),
                    __("목"),
                    __("금"),
                    __("토")
                ],
                "monthNames": [
                    __("1월"),
                    __("2월"),
                    __("3월"),
                    __("4월"),
                    __("5월"),
                    __("6월"),
                    __("7월"),
                    __("8월"),
                    __("9월"),
                    __("10월"),
                    __("11월"),
                    __("12월")
                ],
            }
        });

        // 검색기간
        let sdate = date('Y-m-d');
        let edate = date('Y-m-d');

        $('[name="btn-reset-1w"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*7);
            edate = date('Y-m-d');
            $('input[id="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range"]').data('daterangepicker').setEndDate(edate);
            $('input[id="range2"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range2"]').data('daterangepicker').setEndDate(edate);
        });
        $('[name="btn-reset-1m"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*30);
            edate = date('Y-m-d');
            $('input[id="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range"]').data('daterangepicker').setEndDate(edate);
            $('input[id="range2"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range2"]').data('daterangepicker').setEndDate(edate);
        });
        $('[name="btn-reset-6m"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*30*6);
            edate = date('Y-m-d');
            $('input[id="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range"]').data('daterangepicker').setEndDate(edate);
            $('input[id="range2"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range2"]').data('daterangepicker').setEndDate(edate);
        });
        $('[name="btn-reset-1y"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*365);
            edate = date('Y-m-d');
            $('input[id="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range"]').data('daterangepicker').setEndDate(edate);
            $('input[id="range2"]').data('daterangepicker').setStartDate(sdate);
            $('input[id="range2"]').data('daterangepicker').setEndDate(edate);
        });

        let first_dropdown_value = '';
        for(i of Object.values(Model.user_wallet)) {
            if(!first_dropdown_value) { first_dropdown_value = i.symbol;}
            if (i.symbol.length >= 10) {
                // $('#symbol').dropdown('add', { value: i.symbol, text: i.name })
                $('[name="symbol"]').dropdown('add', { value: i.symbol, text: i.name })
            }
        }
        $('[name="symbol"]').dropdown('select', first_dropdown_value)


        $('[name="btn-search"]').on('click', function() {
            check_login();

            const selected_symbol = $('[name=symbol]:visible').dropdown('selected');

            if (!selected_symbol) {
                alert('상품을 선택하세요.ㄴ');
                return false;
            }

            if (!sdate) {
                alert('조회 기간을 선택하세요.');
                return false;
            }

            if (!edate) {
                alert('조회 기간을 선택하세요.');
                return false;
            }

            let last_idx = 0
            let page = 1
            let totalPage = 1
            const rows = 10

            getTransactionList(page, rows)
        });

        $('[name="btn-search2"]').on('click', function() {
            check_login();

            const selected_symbol = $('[name=symbol]:visible').dropdown('selected');

            if (!selected_symbol) {
                alert('상품을 선택하세요.ㄴ');
                return false;
            }

            if (!sdate) {
                alert('조회 기간을 선택하세요.');
                return false;
            }

            if (!edate) {
                alert('조회 기간을 선택하세요.');
                return false;
            }

            let last_idx = 0
            let page = 1
            let totalPage = 1
            const rows = 10

            getTransactionList(page, rows)
        });

        let selected_category = '';
        const getTransactionList = (page, rows) => {
            const selected_symbol = $('[name=symbol]:visible').dropdown('selected');
            const category = selected_category;
            add_request_item('getMyTradingList', {'token':getCookie('token'), 'symbol':selected_symbol, 'exchange':'krw', 'start_date':sdate, 'end_date':edate, 'category':category, 'page':page, 'rows':rows }, function(r) {
                $('.board--list tbody').empty();
                $('.m-transaction--list').empty();

                r.payload.map((item) => {
                    const tr = $('<tr>')
                    tr.append(`<td class="text--left" style="font-size: 12px"><i class="ico-${item.trading_type_str}"></i>${item.trading_type_str}</td>`)
                    tr.append(`<td class="text&#45;&#45;left"  style="font-size: 12px"><span class="product&#45;&#45;image"><img src="${Model.user_wallet[selected_symbol].icon_url}" alt=""></span>${Model.user_wallet[selected_symbol].name}</td>`)
                    tr.append(`<td class="text--right" style="font-size: 12px">${real_number_format(item.price)}</td>`)
                    tr.append(`<td class="text--right" style="font-size: 12px">${real_number_format(item.volume)}</td>`)
                    tr.append(`<td class="text--right" style="font-size: 12px">${real_number_format(item.amount)}</td>`)
                    tr.append(`<td class="" style="font-size: 10px">${item.sell_userid}</td>`)
                    tr.append(`<td class="" style="font-size: 10px">${item.buy_userid}</td>`)
                    tr.append(`<td class="" style="font-size: 12px">${date('Y-m-d H:i', item.time_traded).substr(2,11)}</td>`)
                    tr.appendTo('.board--list tbody')

                    const div = $('<div class="accordion&#45;&#45;item">')
                    div.append('<header class="accordion--header">\n' +
                        '\t\t\t\t\t\t\t\t<a href>\n' +
                        '\t\t\t\t\t\t\t\t\t<div class="product">\n' +
                        '\t\t\t\t\t\t\t\t\t\t<span class="product--image">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t<img src="'+Model.user_wallet[selected_symbol].icon_url+'" alt="01">\n' +
                        '\t\t\t\t\t\t\t\t\t\t</span>\n' +
                        '\t\t\t\t\t\t\t\t\t\t<div class="items">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t<div class="name">'+Model.user_wallet[selected_symbol].name+'</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t<div class="item">\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t<span><i class="ico-제품등록"></i> 제품 등록</span>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t\t<span>'+date('Y-m-d H:i', item.time_traded).substr(2,11)+'</span>\n' +
                        '\t\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t\t<div class="price">\n' +
                        '\t\t\t\t\t\t\t\t\t\t'+real_number_format(item.amount)+'\n' +
                        '\t\t\t\t\t\t\t\t\t</div>\n' +
                        '\t\t\t\t\t\t\t\t</a>\n' +
                        '\t\t\t\t\t\t\t</header>')
                    div.append('<div class="accordion--contents">\n' +
                        '\t\t\t\t\t\t\t\t<ul>\n' +
                        '\t\t\t\t\t\t\t\t\t<li>\n' +
                        '\t\t\t\t\t\t\t\t\t\t단가<span>'+real_number_format(item.price)+'</span>\n' +
                        '\t\t\t\t\t\t\t\t\t</li>\n' +
                        '\t\t\t\t\t\t\t\t\t<li>\n' +
                        '\t\t\t\t\t\t\t\t\t\t수량<span>'+real_number_format(item.volume)+'</span>\n' +
                        '\t\t\t\t\t\t\t\t\t</li>\n' +
                        '\t\t\t\t\t\t\t\t\t<li>\n' +
                        '\t\t\t\t\t\t\t\t\t\t보냄<span>'+item.sell_userid+'</span>\n' +
                        '\t\t\t\t\t\t\t\t\t</li>\n' +
                        '\t\t\t\t\t\t\t\t\t<li>\n' +
                        '\t\t\t\t\t\t\t\t\t\t받음<span>'+item.buy_userid+'</span>\n' +
                        '\t\t\t\t\t\t\t\t\t</li>\n' +
                        '\t\t\t\t\t\t\t\t</ul>\n' +
                        '\t\t\t\t\t\t\t</div>')
                    div.appendTo('.m-transaction--list')

                })

                totalPage = Math.ceil(r.payload.length / rows)

                $('.board--pagination').find('>ul').empty().end().show()
                if (totalPage > 1) {
                    let prev = (page <= 1) ? 1 : page -1
                    $('<li>')
                        .addClass('pagination--prev')
                        .append(`<a href="#page-${prev}">이전 페이지</a>`)
                        .appendTo('.board--pagination > ul')

                    for (let i=1; i<=totalPage; i++) {
                        $('<li>').append(`<a href="#page-${i}">${i}</a>`).appendTo('.board--pagination > ul')
                    }

                    let next = (page >= totalPage) ? totalPage : page+1
                    $('<li>')
                        .addClass('pagination--next')
                        .append(`<a href="#page-${next}">다음 페이지</a>`)
                        .appendTo('.board--pagination > ul')
                }

            })
        }

        $('.board--pagination').on('click', 'a', (e) => {
            e.preventDefault()
            const page = $(e.target)
                .attr('href')
                .replaceAll(/#page-/g, '')
            getTransactionList(page, 10)
            return false
        })

        $('[name="select_category"]').on('click', 'a', (e) => {
            e.preventDefault()

            // console.log($(e.target).text());
            $('[name="category_label"]').text($(e.target).text());
            selected_category = $(e.target).data('category')
            getTransactionList(1, 10)
            return false
        })

        $('[name="select_category"]').on('click', 'a', (e) => {
            e.preventDefault()

            $('[name="category_label"]').text($(e.target).text());
            selected_category = $(e.target).data('category')
            getTransactionList(1, 10)
            return false
        })

        $('[name="m_dropdown"]').on('click', 'button', (e) => {
            e.preventDefault()

            $('[name="m_category_label"]').text($(e.target).text());
            selected_category = $(e.target).data('category')
            getTransactionList(1, 10)

        })

    }


    const fn_notification = function() {
        check_login();

        let last_idx = 0
        let page = 1
        let totalPage = 1
        const rows = 10

        const fetchList = function(page) {

            add_request_item('getMyMessageList', { 'token': getCookie('token'), last_idx:0, page:page, rows:rows  }, function(r){
                $('.board--list tbody').empty();
                r.payload.list.map((item) => {
                    const tr = $('<tr>')
                    tr.append(`<td>${item.reg_date.substr(0, 16)}</td>`)
                    tr.append(`<td>${item.message}</td>`)
                    tr.append(`<td>${item.sender_name}</td>`)
                    tr.appendTo('.board--list tbody')

                    const li = $('<li>')
                    li.append(`<div class="notification&#45;&#45;header"><span class="notifictaion&#45;&#45;date">${item.reg_date.substr(0, 16)}</span><span class="notification--nick">${item.message}</span>`)
                    li.append(`<span class="notification&#45;&#45;nick">${item.sender_name}</span></div>`);
                    li.appendTo('.notification--list')


                    last_idx = item.idx
                })
                totalPage = Math.ceil(r.payload.totel_count / rows)

                $('.board--pagination').find('>ul').empty().end().show()
                if (totalPage > 1) {
                    let prev = (page <= 1) ? 1 : page -1
                    $('<li>')
                        .addClass('pagination--prev')
                        .append(`<a href="#page-${prev}">이전 페이지</a>`)
                        .appendTo('.board--pagination > ul')

                    for (let i=1; i<=totalPage; i++) {
                        $('<li>').append(`<a href="#page-${i}">${i}</a>`).appendTo('.board--pagination > ul')
                    }

                    let next = (page >= totalPage) ? totalPage : page+1
                    $('<li>')
                        .addClass('pagination--next')
                        .append(`<a href="#page-${next}">다음 페이지</a>`)
                        .appendTo('.board--pagination > ul')
                }

                if (!r.payload.totel_count) {
                    $('<tr>')
                        .addClass('board--empty')
                        .append('<td colspan="3">알림이 없습니다</td>')
                        .appendTo('.board--list tbody')
                }
            })
        }

        fetchList(page);

        $('.board--pagination').on('click', 'a', (e) => {
            e.preventDefault()
            const page = $(e.target)
                .attr('href')
                .replaceAll(/#page-/g, '')
            fetchList(page)
            return false
        })
        // add_request_item('getMyMessageList', { 'token': getCookie('token') }, function(r){
        //     console.log(r);
        //     // $('.board--list tbody').empty();
        //     // r.payload.list.map((item) => {
        //     //
        //     //     const tr = $('<tr>')
        //     //     tr.append(`<td>${item.reg_date}</td>`)
        //     //     tr.append(`<td>${item.message}</td>`)
        //     //     tr.append(`<td>${item.sender_name}</td>`)
        //     //     tr.appendTo('.board--list tbody')
        //     // })
        //
        // })

    }

    const fn_login = function () {
        check_logout();
        window.keypress_support = false;

        // 폼 초기화
        $('#box_login form').each(function () { if ($(this).reset) { $(this).reset(); } });
        
        // 아이디 포커스
        $('#box_login [name=email]').get(0).focus();

        // 로그인
        $('#box_login form[name=login]').on('submit', function (e) {
            
            e.preventDefault()

            const $email = $('#email'), email = trim($email.val())
            const $password = $('#password'), password = trim($password.val())

            if (!email) {
                $email.focus()
                return false
            }

            if (!password) {
                $password.focus()
                return false
            }

            API.login(email, password, (r) => {
                if (r && r.success && r.payload) {
                    setCookie('token', r.payload.token);
                    Model.token = r.payload.token;
                    Model.last_login_info = { 'userid': email };
                    let user_info = { 'userid': email };
                    Model.user_info = user_info;
                    get_user_wallet();
                    request_user_info();
                    let ret_url = getURLParameter('ret_url')
                    ret_url = ret_url ? $.trim(base64_decode(ret_url)) : '/'; // location.href = 'exchange.html'
                    ret_url = setURLParameter('t', time(), ret_url);
                    window.location.href = ret_url;
                } else {
                    let msg = r.error && r.error.message ? r.error.message : __('로그인 정보가 올바른지 확인해주세요.');
                    $('.validation--message').find('>p').text(msg).end().show()
                }
            })
            return false;

        });

    }
    const fn_logout = function () {
        $.post(API_URL + '/logout/', { 'token': getCookie('token') }, function (r) {
            // console.log(r);
            // if(r && r.success && !r.error) {
            Model.user_info = {};
            reset_logedin_status();
            Model.auto_login = false;
            Model.visited_notice = false;
            setCookie('token', '', -1);
            setCookie('token', '', -1, '.' + TOKEN_DOMAIN);
            // window.location.href = LOGIN_PAGE.replace(/ret_url=.[^\&]*/, 'ret_url='+base64_encode(window.location.origin)); // window.location.origin: "http://loc.aratube.io"
            // window.location.href = LOGIN_PAGE;
            window.location.href = '/';
            // window.location.reload();
            // } else {
            // 	let msg = r.error && r.error.message ? r.error.message : '';
            // 	alert(__('로그아웃하지 못했습니다.')+' '+msg);
            // }
        });
    }
    window.logout = fn_logout;

    const fn_member_account = function () {
        check_login();
        request_user_info();
        Model.form = clone(Model.user_info);
        // force_rander('user_info', Model.user_info);

        $('#member-account').on('submit', function () {
            $('#country').dropdown('selected')

            add_request_item('putMyInfo', $(this).serialize(), function (r) {
                if (r?.success) {
                    alert(__('저장했습니다.'));
                } else {
                    alert(__('저장하지 못했습니다.') + r?.error?.message||'')
                }
            })
            return false;
        });

        // 국가 선택 
        function select_country(code) {
            if (code) {
                $('#country').find('button[value=' + (code.toLowerCase()) + ']').trigger('click');
            }
        }

        API.getCountry((resp) => {
            // console.log('getCountry resp:', resp)
            let firstItem = ''
            resp.payload.map((country) => {
                if(!firstItem) {
                    firstItem = country.code.toLowerCase()
                }
    
                $('#country').dropdown('add', { value: country.code.toLowerCase(), text: `<i class="flag ${country.code.toLowerCase()}"></i> ${country.name}` })
            })
            $('#country').dropdown('select', firstItem).dropdown('add_search')
            // 국가 선택
            select_country(Model.user_info.mobile_country_code);
        })

        $('#change_password_btn').on('click', function (e) {
            e.preventDefault()
            let password = $('[name=password]');
            let new_password = $('[name=new_password]');
            let new_password2 = $('[name=new_password2]');

            if(!password.val()) {
                password.focus()
                return false
            }

            if(!new_password.val()) {
                new_password.focus()
                return false
            }

            if(!new_password2.val()) {
                new_password2.focus()
                return false
            }

            if (/^.{8,}$/.test(new_password.val()) === false) {
                alert('비밀번호는 8 자리 이상 입력 해주세요.');
                return false;
            }

            if (/^(?=.*[a-z]).*$/.test(new_password.val()) === false) {
                alert('비밀번호는 영문자 포함해서 입력 해주세요.');
                return false;
            }

            if (/^(?=.*[0-9]).*$/.test(new_password.val()) === false) {
                alert('비밀번호는 숫자 포함해서 입력 해주세요.');
                return false;
            }

            if (/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test(new_password.val()) === false) {
                alert('비밀번호는 특수문자 포함해서 입력 해주세요.');
                return false;
            }


            if (new_password.val() != new_password2.val()) {
                alert('비밀번호가 다릅니다.');
                return false;
            }

            add_request_item('changePW', $('#change-password').serializeObject(), function (r) {
                if (r && r.success) {
                    alert("변경 되었습니다.");
                    $('#change-password').hide();
                } else {
                    alert(r.error.message)
                }
            });

            return false;
        })

    }

    const fn_verification = function () {

        $('[name=step_1]').on('click', function () {
            $('#verification').hide()
            $('#verification2').show()
        })

        $('[name=step_2]').on('click', function () {
            $('#verification2').hide()
            $('#verification3').show()
        })

        $('[name=step_3]').on('click', function () {
            $('#verification3').hide()
            $('#verification4').show()
        })

        $('input[type="file"]').on('change', function () {
            const name = $(this).attr('title');
            const target = $(this).attr('data-target');
            const image_url = upload_file($(this), name);

            $(target).val(image_url);
            $(target).siblings('[name="preview"]').css('background-image', 'url(' + image_url + ')').show();

        })

        $('[name=step_4]').on('click', function () {
            if (!$('#verification4 #file_identify_url').val()) {
                alert(__('신분증 사진을 선택해주세요.'))
                return false;
            }
            if (!$('#verification4 #file_mix_url').val()) {
                alert(__('신분증 및 회원 사진을 선택해주세요.'))
                return false;
            }
            add_request_item('putMyInfo', unserialize($('#verification4').serialize()), function (r) {
                if (r?.success) {
                    alert(__('저장했습니다.'));
                    $('#verification4').hide()
                    $('#verification5').show()
                }
            })
            return false;
        })

        // 국가 선택
        function select_country(code) {
            if (code) {
                $('#country').find('button[value=' + (code.toLowerCase()) + ']').trigger('click');
            }
        }
        API.getCountry((resp) => {
            // console.log('getCountry resp:', resp)
            let firstItem = ''
            resp.payload.map((country) => {
                console.log(country);
                if(!firstItem) {
                    firstItem = country.code.toLowerCase()
                }

                $('#country').dropdown('add', { value: country.code.toLowerCase(), text: `<i class="flag ${country.code.toLowerCase()}"></i> ${country.name}` })
            })
            $('#country').dropdown('select', firstItem).dropdown('add_search')
            // 국가 선택
            select_country(Model.user_info.mobile_country_code);
        })


        $('[name=step_5]').on('click', function () {

            if (!$('#verification5 #bank_name').val()) {
                alert(__('은행명을 입력해주세요.'))
                return false;
            }

            if (!$('#verification5 #bank_owner').val()) {
                alert(__('이름을 입력해주세요.'))
                return false;
            }

            if (!$('#verification5 #bank_account').val()) {
                alert(__('계좌번호를 입력해주세요.'))
                return false;
            }

            if (!$('#verification5 #file_bank_url').val()) {
                alert(__('통장 사진을 선택해주세요.'))
                return false;
            }

            if (!$('#verification5 #city').val()) {
                alert(__('도시를 입력해주세요'))
                return false;
            }

            if (!$('#verification5 #address_a').val()) {
                alert(__('주소를 입력해주세요'))
                return false;
            }

            if (!$('#verification5 #address_b').val()) {
                alert(__('상세주소를 입력해주세요'))
                return false;
            }

            if (!$('#verification5 #zipcode').val()) {
                alert(__('우편번호를 입력해주세요'))
                return false;
            }

            $('#mobile_country_code').val($('#btn_country i').attr("class").replaceAll(/flag /g,'').toUpperCase());


            add_request_item('putMyInfo', unserialize($('#verification5').serialize()), function (r) {
                if (r?.success) {
                    alert(__('저장했습니다.'));
                    $('#verification5').hide()
                    $('#verification6').show()
                }
            })
            return false;
        })

        $('[name=step_6]').on('click', function () {
            window.location.href = '/'
        })
    }



    /**
     * ID 인증 관리
     */
    const fn_my_verification = function () { 
        check_login();

        if(Model.user_info.image_identify_url) $('.preview[for="file_identify_url"]').css('background-image', 'url(' + Model.user_info.image_identify_url + ')');
        if(Model.user_info.image_mix_url) $('.preview[for="file_mix_url"]').css('background-image', 'url(' + Model.user_info.image_mix_url + ')');
        

        // permission 값 의미 : 1: 가입여부, 2: 로그인여부, 3: 핸드폰 인증여부, 4: 신분증 인증 여부, 5:은행 인증 여부
        const permission_level = Model.user_info.permission.match(/1/g).length; // '11000' => 2 , 
        if (Model.user_info.permission.substr(3, 1) == '1') {// 신분증 인증 완료
            $('[name=status_success]').show();
        } else {
            if (Model.user_info.image_identify_url) { // 신분증 인증 대기중
                $('[name=status_waiting]').show();
            } else { // 신분증 인증 입력 필요
                $('[name=status_default]').show();
            }
        }

        $('input[type="file"]').on('change', function () { 
            const name = $(this).attr('title');
            const target = $(this).attr('data-target');
            const image_url = upload_file($(this), name);

            $(target).val(image_url);
            $(target).siblings('[name="preview"]').css('background-image', 'url(' + image_url + ')').show();
            $('#bool_confirm_idimage').val('0');
        })

        $('.box-image-selector .preview').on('click', function(){   $('#'+$(this).attr('for')).trigger('click'); })

        $('[name="btn_save"]').on('click', function () { 
            if (!$('#verification4 #file_identify_url').val()) {
                alert(__('신분증 사진을 선택해주세요.'))
            }
            if (!$('#verification4 #file_mix_url').val()) {
                alert(__('신분증 및 회원 사진을 선택해주세요.'))
            }
            add_request_item('putMyInfo', unserialize($('#verification4').serialize()), function (r) { 
                console.log(r);
                if (r?.success) {
                    alert(__('저장했습니다.'));
                    $('[name=status_waiting]').show().siblings().hide();
                } 
            })
            return false;
        })
        

    }

    const fn_repw = function () {
        check_logout(__('로그아웃 해주세요.'));

        $('[name=btn_repw]').on('click', function () {
            $('[name=box_notice]').html('').parent().hide();

            let password = $('[name=password]').val();
            if (!password) {
                show_notice(__('비밀번호를 입력해주세요.'));
                $('[name=password]').trigger('select');
                return false;
            }

            if (/^.{8,}$/.test(password) === false) {
                show_notice(__('비밀번호는 8 자리 이상 입력 해주세요.'));
                return false;
            }

            if (/^(?=.*[a-z]).*$/.test(password) === false) {
                show_notice(__('비밀번호는 영문자 포함해서 입력 해주세요.'));
                return false;
            }

            if (/^(?=.*[0-9]).*$/.test(password) === false) {
                show_notice(__('비밀번호는 숫자 포함해서 입력 해주세요.'));
                return false;
            }

            if (/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/.test(password) === false) {
                show_notice(__('비밀번호는 특수문자 포함해서 입력 해주세요.'));
                return false;
            }


            let password2 = $('[name=password2]').val();
            if (password != password2) {
                show_notice(__('비밀번호가 다릅니다.') + ' ' + __('올바른 비밀번호를 다시 입력해주세요.'));
                $('[name=pin2]').trigger('select');
                return false;
            }

            const data = {
                't': getURLParameter('t'),
                'password': password
            };
            add_request_item('resetPW', data, function (r) {
                if (r && r.success) {
                    if ($('#form_repw').length > 0) $('#form_repw').get(0).reset();
                    alert(__('Changed your password.') + ' ' + __('Please log in again.'));
                    setTimeout(function () { window.location.href = 'login.html'; }, 2000);
                } else {
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('Failed to change password.') + ' ' + msg);
                }
            });
            return false;
        });

        const show_notice = function (msg) {
            $('[name=box_notice]').html(msg).parent().show();
        }
    }

    const fn_wallet = function () {
        check_login();
    };

    const fn_wallet_withdrawal = function () {
        check_login();
        // access level 4 
        force_rander('user_info', Model.user_info);
        // 사이트 정보
        force_rander('site_info', Model.site_info);
        add_request_item('getConfig', {}, function (r) {
            if (r && r.success) {
                Model.site_info = r.payload;
            }
        });
        // currency 정보 갱신
        let withdraw_symbol = 'KRW';// 필요시 dropdown 값 사용
        if (Model?.withdraw_currency?.symbol != withdraw_symbol) {
            add_request_item('getCurrency', {'symbol':withdraw_symbol}, function (r) {
                // out_max_volume_1day
                console.log('getCurrency r:', r);
                if (r && r.success) {
                    c = r.payload[0];
                    c.fee_out_str = c.fee_out_ratio > 0 ? number_format(c.fee_out_ratio * 100, 2) + ' %' : (c.fee_out > 0 ? real_number_format(c.fee_out) + ' ' + c.symbol : __('수수료 없음'));
                    c.fee_out_intra_str = __('수수료 없음'); //'0 '+c.symbol
                    c.out_min_volume_str = real_number_format(c.out_min_volume) + ' ' + c.symbol;
                    c.out_max_volume_str = c.out_max_volume > 0 ? real_number_format(c.out_max_volume) + ' ' + c.symbol : __('제한 없음');
                    Model.withdraw_currency = c;
                }
            });
        } else {
            force_rander('withdraw_currency', Model.withdraw_currency)
        }

        // 지갑 정보
        force_rander('user_wallet', Model.user_wallet); // 화면에 잔액 표시 후
        get_user_wallet(); // DB 값으로 다시 잔액 표시

        const clipboard = new ClipboardJS('.btn--copy');
        clipboard.on('success', function (e) {
            alert(__('클립보드에 복사되었습니다.'))
            e.clearSelection()
        });

        // 출금신청
        $('[name="btn-withdraw"]').on('click', function () { 
            // 출금액
            const amount = $('[name=amount]').val();
            const to_address = $('[name="address"]').val();
            const pin = $('[name="pin"]').val();
            const symbol = Model.withdraw_currency.symbol;
            add_request_item('withdraw', { 'symbol': symbol, 'from_address': Model.user_wallet[symbol].address, 'to_address': to_address, 'amount': amount, 'pin': pin }, function (r) { 
                if (r?.success) {
                    alert(__('출금신청을 완료했습니다.'));
                } else {
                    const msg = r?.error?.message || '';
                    alert(__('출금신청을 완료하지 못했습니다.')+ ' '+msg);
                }
            })
        })

        // 출금수수료 계산
        $('[name="amount"]').on('keyup', function (e) { 
            const fee_out = Model.withdraw_currency.fee_out;
            const fee_out_ratio = Model.withdraw_currency.fee_out_ratio;
            const amount = $(this).val();
            const fee = fee_out_ratio > 0 ? amount * fee_out_ratio : (fee_out > 0 ? fee_out : 0);
            const real_receive_amount = amount-fee>0 ? amount-fee : 0;
            console.log(amount, fee, real_receive_amount)
            $('[name=fee]').val( real_number_format(fee) )
            $('[name=real_out]').val( real_number_format(real_receive_amount) )
        })

    };

    const fn_wallet_withdrawal_guide = function () {
        // check_login();
        // access level 4 
        force_rander('user_info', Model.user_info);
        // 사이트 정보
        force_rander('site_info', Model.site_info);
        add_request_item('getConfig', {}, function (r) {
            if (r && r.success) {
                Model.site_info = r.payload;
            }
        });
        // currency 정보 갱신
        let withdraw_symbol = 'KRW';// 필요시 dropdown 값 사용
        if (Model?.withdraw_currency?.symbol != withdraw_symbol) {
            add_request_item('getCurrency', {'symbol':withdraw_symbol}, function (r) {
                // out_max_volume_1day
                console.log('getCurrency r:', r);
                if (r && r.success) {
                    c = r.payload[0];
                    c.fee_out_str = c.fee_out_ratio > 0 ? number_format(c.fee_out_ratio * 100, 2) + ' %' : (c.fee_out > 0 ? real_number_format(c.fee_out) + ' ' + c.symbol : __('수수료 없음'));
                    c.fee_out_intra_str = __('수수료 없음'); //'0 '+c.symbol
                    c.out_min_volume_str = real_number_format(c.out_min_volume) + ' ' + c.symbol;
                    c.out_max_volume_str = c.out_max_volume > 0 ? real_number_format(c.out_max_volume) + ' ' + c.symbol : __('제한 없음');
                    Model.withdraw_currency = c;
                }
            });
        } else {
            force_rander('withdraw_currency', Model.withdraw_currency)
        }
    };

    const fn_wallet_deposit = function () {
        check_login();
        // access level 3
        // request_user_info();
        force_rander('user_info', Model.user_info);
        // 사이트 정보
        force_rander('site_info', Model.site_info);
        add_request_item('getConfig', {}, function (r) {
            if (r && r.success) {
                Model.site_info = r.payload;
            }
        });
        // 지갑 정보
        force_rander('user_wallet', Model.user_wallet); // 화면에 잔액 표시 후
        get_user_wallet(); // DB 값으로 다시 잔액 표시

        const clipboard = new ClipboardJS('.btn--copy');
        clipboard.on('success', function (e) {
            alert('클립보드에 복사되었습니다.')
            e.clearSelection()
        });

        // 입금하기
        $('[name="btn-save-deposit"]').on('click', function () { 
            const symbol = $.trim($('[name=symbol]').text());
            const $deposit_amount = $('[name=deposit_amount]');
            const deposit_amount = $.trim($deposit_amount.val());
            if (deposit_amount <= 0) {
                alert(__('입금액을 입력해주세요.')); $deposit_amount.select(); return false;
            }
            const $deposit_name = $('[name=deposit_name]');
            const deposit_name = $.trim($deposit_name.val());
            if (!deposit_name) {
                alert(__('입금자 이름을 입력해주세요.')); $deposit_name.select(); return false;
            }
            const address = $.trim($('[name=address]').val());
            add_request_item('deposit', { 'symbol': symbol, 'deposit_amount': deposit_amount, 'deposit_name': deposit_name, 'address': address }, function (r) {
                if (r && r.success) {
                    alert(__('입금 신청을 완료했습니다.'))
                    $('[name=deposit_amount]').val('0');
                    $('[name=deposit_name]').val('');
                } else {
                    alert(__('입금 신청을 완료하지 못했습니다.'))
                }
            })
        })

    }

    const fn_wallet_analysis = function () {
        check_login();
        // request_user_info();
        force_rander('user_info', Model.user_info);

        $('input[name="range"]').daterangepicker({
            format: 'YYYY-MM-DD',
            maxDate: (new Date()),
            autoUpdateInput: true,
            autoApply: true,
            locale: {
                format: 'YYYY-MM-DD',
                "daysOfWeek": [
                    __("일"),
                    __("월"),
                    __("화"),
                    __("수"),
                    __("목"),
                    __("금"),
                    __("토")
                ],
                "monthNames": [
                    __("1월"),
                    __("2월"),
                    __("3월"),
                    __("4월"),
                    __("5월"),
                    __("6월"),
                    __("7월"),
                    __("8월"),
                    __("9월"),
                    __("10월"),
                    __("11월"),
                    __("12월")
                ],
            }
        });
        // 검색기간
        let sdate = date('Y-m-d');
        let edate = date('Y-m-d');
        $('input[name="range"]').on('apply.daterangepicker', function(ev, picker) {
            sdate = picker.startDate.format('YYYY-MM-DD');
            edate = picker.endDate.format('YYYY-MM-DD');
            console.log('sdate:', sdate, ',edate:', edate);
        });
        $('[name="btn-search"]').on('click', function() {
            getMyProfit();
        });
        $('[name="btn-reset"]').on('click', function() {
            sdate = date('Y-m-d');
            edate = date('Y-m-d');
            $('input[name="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[name="range"]').data('daterangepicker').setEndDate(edate);
        });
        $('[name="btn-reset-1w"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*7);
            edate = date('Y-m-d');
            $('input[name="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[name="range"]').data('daterangepicker').setEndDate(edate);
        });
        $('[name="btn-reset-1m"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*30);
            edate = date('Y-m-d');
            $('input[name="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[name="range"]').data('daterangepicker').setEndDate(edate);
        });
        $('[name="btn-reset-6m"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*30*6);
            edate = date('Y-m-d');
            $('input[name="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[name="range"]').data('daterangepicker').setEndDate(edate);
        });
        $('[name="btn-reset-1y"]').on('click', function() {
            sdate = date('Y-m-d', time()-60*60*24*365);
            edate = date('Y-m-d');
            $('input[name="range"]').data('daterangepicker').setStartDate(sdate);
            $('input[name="range"]').data('daterangepicker').setEndDate(edate);
        });
        // 잔액 조회
        const getMyProfit = () => {
            add_request_item('getMyProfit', { 'sdate': sdate, 'edate': edate }, function (r) { 
                console.log(r, r?.success)
                if (r?.success) {
                    Model.MyProfit = r.payload;
                    const $target = $('[name="table_profit"]');
                    const tpl = $('<div></div>').append($target.find('[name=tpl]').clone().attr('name', '').removeClass('hide').css('display','')).html();
                    let html = [];
                    const detail = r.payload.detail;
                    for (i in detail) {
                        const row = detail[i];
                        html.push(tpl
                            .replace(/\{coin.icon_url\}/g, row.icon_url||'about:blank')
                            .replace(/\{coin.name\}/g, row.name||'')
                            .replace(/\{coin.SYMBOL\}/g, row.symbol||'')
                            .replace(/\{coin.basic_balance\}/g, real_number_format(row.basic_balance))
                            .replace(/\{coin.basic_evaluation_amount\}/g, real_number_format(row.basic_evaluation_amount))
                            .replace(/\{coin.final_balance\}/g, real_number_format(row.final_balance))
                            .replace(/\{coin.final_evaluation_amount\}/g, real_number_format(row.final_evaluation_amount))
                            .replace(/\{coin.deposit_evaluation_amount\}/g, real_number_format(row.deposit_evaluation_amount))
                            .replace(/\{coin.withdraw_evaluation_amount\}/g, real_number_format(row.withdraw_evaluation_amount))
                            .replace(/\{hide_trade_btn\}/g, row.tradable=='Y' ? '' :'hide')
                            .replace(/\{hide_deposit_btn\}/g, row.symbol==row.exchange ? '' :'hide')
                            .replace(/\{hide_withdrawal_btn\}/g, row.symbol==row.exchange ? '' :'hide')
                        )
                    }
                    $target.children().not('[name=tpl],[name=search],[name=empty]').remove();
                    $target.append(html.join(''));
                    $target.children('[name=search]').hide();
                }

            })
        }
        getMyProfit();
        
    }

    const fn_inquiry = function () {
        check_login();
    }

    const fn_change_pin_number = function () {
        check_login();
    }

    const fn_create_account = function () {
        check_logout('로그 아웃 후 이용가능 합니다.');
    }

    // 페이지 컨트롤러 실행
    let page_controller = window.location.pathname.replace(/\/(.*).php|.html/, '$1');
    page_controller = page_controller.replace(/-/g, '_');
    page_controller = page_controller && page_controller != '/' ? page_controller : 'index';
    page_controller = page_controller.indexOf('/') === 0 ? substr(page_controller, 1) : page_controller;
    // function run_fn(fn) {
    //     // console.log(fn);
    //     try {
    //         eval(fn + '()');
    //     } catch (e) {
    //         // console.error(e)
    //     }
    // }
    // run_fn('fn_' + page_controller);
    try {
        // console.log('fn_' + page_controller + '()');  //fn_/index.html()
        eval('fn_' + page_controller + '()');
    } catch (e) {
        // console.error(e)
    }



    /* 공통 기능 ----------------------------------------------------------------------------------- */

    // 내부 링크 이동시 패이지 새로고침 방지
    // 스크립트 실행해야 해서 미사용.
    // $(document).on('click', 'a', function () { 
    //     const href = $(this).attr('href');
    //     if (href.indexOf('//') < 0) {
    //         html = '';
    //         $.ajax({
    //             'url': setURLParameter('t', time(), href),
    //             'async': false,
    //             'success': function(res) {
    //                 if(res && res.indexOf('<!DOCTYPE html>')>-1) {
    //                     html = res;
    //                 } else {
    //                     // r = '<div id="' + page_name + '" class="box404 text-center"><h1>404</h1><h3 class="font-bold mb-3">'+__('Page Not Found')+'</h3><div class="error-desc">'+__('Sorry, but the page you are looking for has note been found. Try checking the URL for error, then hit the refresh button on your browser or try found something else in our app.')+'</div><a href="/">['+__('Go Homepage')+']</a></div>';
    //                 }
    //                 // tpl[href] = r;
    //             }
    //         });
    //         if (html) {
    //             window.history.pushState(null, null, href); // 페이지 이동없이 주소줄만 변경
    //             $('body').html()
    //             return false;
    //         }
    //     }
    // })

    const reset_logedin_status = function () {
        const user_info = Model.user_info;
        // console.log('user_info:', user_info);
        if (user_info.userno && user_info.userid) {
            $('[name=box_logedin]').show();
            $('[name=box_unlogedin]').hide();
        } else {
            $('[name=box_logedin]').hide();
            $('[name=box_unlogedin]').show();
        }
    };
    // reset_logedin_status();

    /* 로그아웃 */
    $('[name="btn-logout"]').on('click', function() {
        fn_logout();
        return false;
    })

    // 프로필 서브매뉴 표시
    $('[name="btn-profile"]').on('click', function() {
        $('.box_submenu').toggle();
        return false;
    })

    // 프로필 이미지 로딩에러시 기본 프로필이미지로 치환
    const default_profile_img = '/@resource/images/common/basic_profile.png';
    $(document).on('error', '.img_profile', function() {
        alert(1);
        $(this).attr('src', default_profile_img);
    });


    // headerEvent();
    // headerFolding();
    // imgCheck();

    /* jquery scrollbar */
    if ($('.scroll-content').length > 0) {
        $('.scroll-content').each(function() {
            $(this).scrollbar({
                "ignoreMobile": true
            });
        });
    }

    $(document).on("keyup", ".onlynum", function(ev) { $(this).val($(this).val().replace(/[^0-9.,]/g, "")); }).on('keydown', ".onlynum", input_filter_number);
    $(document).on("keyup change", ".realnumber", function(ev) { $(this).val(real_number_format($(this).val())); }).on('keydown', ".onlynum", input_filter_number);
    $(document).on("keyup", ".onlyeng", function(ev) { $(this).val($(this).val().replace(/[^\!-z]/g, "")); });



}))

function htmlencode(str) {
    return str.replace(/[&<>"']/g, function($0) {
        return "&" + { "&": "amp", "<": "lt", ">": "gt", '"': "quot", "'": "#39" }[$0] + ";";
    });
}