// 우측 클릭 방지, 선택 방지, 드래그 방지
$('label,.btn,button,a,th').on('contextmenu selectstart dragstart', function() {return false;});
$('body').on('contextmenu', function() {return false;});
document.onmousedown = disableclick;

function disableclick(event) {
    if (event.button == 2) {
        return false;
    }
}
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
	url = new URL(url);
	url.searchParams.set(key, val);
	return url.href;
}

function real_number_format(n, d){
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

// "use strict";

// i18n.js

(function () {
    const i18n_key = 'i189n';
    const in_array = function(val, array) {
        for (i in array) {
            if (array[i] == val) return true;
        }
        return false;
    }
    const support_lang = ['en', 'zh', 'ja', 'vi', 'th', 'ko'],
        default_lang = 'ko';
    var lang_data = window.localStorage['lang_data_'+lang] ? JSON.parse(Decrypt(window.localStorage['lang_data_'+lang], i18n_key, 256)) : {},
        lang = navigator.language || navigator.userLanguage,
        // cookieLang = getCookie('lang'),
        localeLang = window.localStorage.locale
        ;
    lang = lang.substr(0, 2);
    // lang = in_array(lang, support_lang) ? lang : default_lang; // 브라우저 언어 설정값을 기준으로 첫번째 언어를 선택하도록 할때
    lang = default_lang; // 브라우저 언어 설정에 상관없이 처음 언어 지정할때 사용.
    lang = localeLang && localeLang !== lang && in_array(localeLang, support_lang) ? localeLang : lang;
    // lang = cookieLang && cookieLang !== lang && in_array(cookieLang, support_lang) ? cookieLang : lang;

    if (window.localStorage.locale !== lang) {window.localStorage.locale = lang;}
    // if (cookieLang !== lang) {setCookie('lang', lang, 365);}
    if (window.lang !== lang) {window.lang = lang;}

    const translate = function (lang_data) {
        $('[data-i18n]').each(function () { 
            const str = $(this).html();
            const trstr = lang_data[str] ? lang_data[str] : '';
            if (trstr) {
                $(this).html(trstr);
            }
        })
    }

    const get_lang_data = function(callback) {
        let cache_time = Math.ceil(((new Date().getTime()) / 1000) / (60 * 60 * 1));
        let data_file = '/i18n/' + lang + '/LC_MESSAGES/WWW.json?v=' + cache_time;
        httpRequest = new XMLHttpRequest();
        if (httpRequest) {
            httpRequest.onreadystatechange = function() {
                if (httpRequest.readyState === XMLHttpRequest.DONE) {
                    if (httpRequest.status === 200) {
                        r = JSON.parse(httpRequest.responseText);
                        window.localStorage['lang_data_'+lang] = Encrypt(JSON.stringify(r), i18n_key, 256);
                        lang_data = r.data;
                        translate(r.data);
                    } else {
                        console.error(__('번역 데이터 가져오지 못함.'));
                    }
                    if (callback && typeof callback == typeof function(){}) { callback(); }
                }
            };
            httpRequest.open('GET', data_file);
            httpRequest.send();
        }
    }
    // 번역 데이터 캐시 시간 확인
    if (!lang_data.gentime || lang_data.gentime < time() - 60 * 60) {
        get_lang_data();
    }
    if (lang_data.data) {
        lang_data = lang_data.data;
        translate(lang_data);
    }
    window.__ = function(key) {
        return lang_data && lang_data[key] ? lang_data[key] : key;
    };
    window._e = function(key) {
        document.write(__(key));
    };
    window._c = function(l, callback) {
        if (!in_array(l, support_lang)) { l = default_lang; }
        if (l != lang) {
            lang = l;
            setCookie('lang', l, 365);
            get_lang_data(callback);
            // window.location.reload();
        }
    }

})();


// app

;
(jQuery(function($) {

    const SERVICE_NAME = 'kkikda';

    /* 언어 */
    $('.box_language').on('click', '.box_current', function() {
        $('.box_option').toggle();
        $(this).find('.arrow.up,.arrow.down').toggle();
    });
    $('.box_language').on('click', '.box_option', function() {
        let lang = $(this).attr('data-lang');
        if (lang != window.lang) {
            $('.box_option').toggle();
            // let $box_current = $('.box_current');
            // $box_current.find('.arrow.up,.arrow.down').toggle();
            // let lang_str = $(this).text();
            // $box_current.find('.txt-lang').text(lang_str);
            // let $img = $box_current.find('img')
            // $img.attr('src', $img.attr('src').replace('_'+window.lang+'.png', '_'+lang+'.png'));
            _c(lang, function() { window.location.reload(); });
        }
    });

    /* window resize */
    $(window).resize(function() {
        // headerEvent();
        // imgCheck();
    });

    /* for file upload */
    $(document).on('change', 'input.file-upload', function() {
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
    const upload_file = function($input_file, $item_name) {
        $item_name = $item_name ? $item_name : '';
        let image_tmp_url = '';
        // 이미지 업로드 후 s3 이미지url 설정
        if ($.trim($input_file.val()) != '') {
            $form = $('<form><input type="hidden" name="token" value="'+getCookie('token')+'"></form>');
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
                'success': function(r) {
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
                'fail': function() {
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
    SERVICE_DOMAIN = window.location.host.replace('www.','');
    if (window.location.host.indexOf('loc.') !== -1 || window.location.host.indexOf('localhost') !== -1) {
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
    const LOGIN_PAGE = '/login.php';


    // jQuery plugins ----------------------------------------------------------------------------
    // get Numeric Value
    $.fn.numericVal = function() {
        return $(this).val().replace(/[^0-9.]/g, '') * 1;
    };
    // 마우스 휠 횡스크롤
    // https://www.it-swarm-ko.tech/ko/html/div%ec%97%90%ec%84%9c-%eb%a7%88%ec%9a%b0%ec%8a%a4-%ed%9c%a0%eb%a1%9c-%ea%b0%80%eb%a1%9c-%ec%8a%a4%ed%81%ac%eb%a1%a4/1067923375/
    // https://jsfiddle.net/q3pf2hge
    $.fn.hScroll = function(amount) {
        amount = amount || 120;
        $(this).bind("DOMMouseScroll mousewheel", function(event) {
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
    const change_language = function(lang) {
        if (lang && lang !== APP_LANG) {
            tpl = {}; // let으로 정의한 tpl도 사용가능함.
            APP_LANG = lang;
            $('html').attr('lang', APP_LANG);
            // 서버에 언어 저장. 쿠키 값을 사용하지만 서버에서도 필요할까하여 저장함. 이메일을 보내거나 할때 ... 사용하면 좋아서.
            if (Model.user_info.userid) {
                add_request_item('putMyInfo/putLanguage.php', { 'display_language': lang }, function(r) {});
            }
            _c(lang, function() {
                reload();
            });
        }
    }
    // 언어 변경 버튼 처리
    $('.box_language').on('click', function() {
        $('.box_language .flags').toggle();
    })
    $('.box_language [name=btn_language]').on('click', function() {
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
        local_item = model_item && model_item.local_item || ['hide_notice', 'auto_login', 'exchange_rate', 'goods', 'web_config', 'company_info', 'last_login_info', 'currency', 'hide_popup_time', 'model_item'], // item name using local storage ( delete user action or cleaner programes )
        cookie_item = model_item && model_item.cookie_item || ['check_pin'], // item name using local storage ( delete user action or cleaner programes )
        _no = ((Math.random() + ((new Date).getTime() / Math.random())) + '').replace('.', ''),
        key = getCookie('token');
    if (key) {
        key = APP_NAME + APP_VERSION + key;
    } else {
        setCookie('token', _no, 0, TOKEN_DOMAIN);
        key = APP_NAME + APP_VERSION + _no;
    }
    const set_model_location = function(itemname, location) {
        if (location === 'session') {
            local_item = remove_array_by_value(local_item, itemname);
            if (typeof(session_item[itemname]) == typeof(undefined)) {
                session_item.push(itemname);
            }
        }
        if (location === 'local') {
            session_item = remove_array_by_value(session_item, itemname);
            if (typeof(local_item[itemname]) == typeof(undefined)) {
                local_item.push(itemname);
            }
        }
    }
    const clone = function(obj) {
        return JSON.parse(JSON.stringify(obj))
    }

    /**
     * @param String property 감지할 데이터이름
     * @param String name 콜백이름(중복방지용)
     * @param Function listener 콜백함수
     */
    const addChangeListener = function(property, name, listener) {
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
    const rander = function(property, value, oldValue, force) {
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
                    $('[data-bind="' + property + '.' + i + '"]').each(function() {
                        var tagname = this.tagName,
                            tagname = tagname.toUpperCase(),
                            format = $(this).attr('data-format');
                        // 데이터 출력 형식 변경
                        switch (format) {
                            case 'table':
                                const data = vn;
                                const $target = $(this), $empty =$target.find('[name=empty]'), $search =$target.find('[name=search]');
                                $search.hide().addClass('hide');
                                $empty.hide().addClass('hide');
                                // console.log('target:', $target);
                                // console.log('$tpl:', $tpl);
                                if(!data || data.length < 1) {
                                    $empty.show().removeClass('hide');
                                    $target.children().not('[name=tpl],[name=search],[name=empty]').remove();
                                } else {
                                    let html = [], $tpl = $('<div></div>').append($target.find('[name=tpl]').clone().attr('name','').removeClass('hide')); // div로 감싸사 tpl 첫 DOM도 data-bind를 쓸수 있도록 합니다. 그리고 $tpl.html()을 하면 div는 제외하고 tpl만 추출됩니다.
                                    for( let i in data) {
                                        let _row = data[i], _tpl = $tpl.clone();
                                        for(let k in _row) {
                                            let $row = _tpl.find('[data-bind="row.'+k+'"]'), vn = _row[k], format = $row.attr('data-format'), decimals = $row.attr('data-decimals');
                                            switch(format) {
                                                case 'attr': $row.attr('data-'+k, vn); break;
                                                case 'comma': $row.text(real_number_format(vn,decimals)); break;
                                                case 'date':
                                                    $row.each(function(){
                                                        let date_format = $(this).attr('data-date_format')||'';
                                                        $(this).text(date_format ? date(date_format, vn) : vn);
                                                    })
                                                break;
                                                case 'add-class':$row.addClass(vn);break;
                                                case 'number': $row.text((vn+'').replace(/[^0-9.-]/g,'')); break;
                                                // case 'html': $row.html(vn); break;
                                                default:
                                                    $row.each(function(){
                                                        const TAGNAME = this.tagName ? this.tagName.toUpperCase() : '';
                                                        switch (TAGNAME) {
                                                            case 'A' :
                                                                $row.attr('href',vn); break;
                                                            default :
                                                                if(format=='html') {
                                                                    $row.html(vn);
                                                                } else{
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
                                return ; // 클래스 추가후 끝.
                                break;
                            default:
                                vt = vn;
                        }
                        // 값 지정
                        // console.log('tagname:', tagname);
                        switch (tagname) {
                            case 'INPUT':
                                let type = ($(this).attr('type') + '').toUpperCase();
                                switch(type) {
                                    case 'CHECKBOX':
                                        // $(this).prop('checked', vn==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
                                        let same_value = vn==$(this).val(); // 값이 같은가?
                                        // 값이 같은데 체크 안되있으면 클릭해서 체크함.
                                        // 값이 다른데 체크 되있으면 클릭해서 언체크함.
                                        // console.log('same_value:', same_value);
                                        // console.log('checked:', $(this).is(':checked'));
                                        if(same_value && !$(this).is(':checked') || !same_value && $(this).is(':checked')) {
                                            $(this).trigger('click');
                                        }
                                        break;
                                    case 'RADIO': // 라디오, 채크박스는 값이 같으면 checked 속성을 넣습니다.
                                        // $(this).prop('checked', vt==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
                                        if(vt==$(this).val()) { $(this).trigger('click');}
                                        break;
                                    case 'NUMBER': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
                                    case 'HIDDEN': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
                                        $(this).val(vt);
                                        break;
                                    default:
                                        vt = (vt && vt.toNumber() == vt && (typeof(vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
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
                                    vt = (vt && vt.toNumber() == vt && (typeof(vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
                                }
                                // console.log('vt:', vt, '$(this):', $(this));
                                $(this).html(vt);
                                break;
                        }
                    });

                    // display-bind
                    // <div data-display="market.use_userpw=Y"></div>
                    $('[data-display^="'+property+'.'+i+'"]').each(function() { //
                        let data = $(this).attr('data-display');
                        data = data.split('=');
                        if(vn == data[1]) {
                            $(this).removeClass('hide').attr('style','');
                        } else {
                            $(this).addClass('hide').attr('style','');
                        }
                    });
                }
            }
        }
    }
    if (APP_RUNMODE != 'live') {
        window.rander = rander;
    }
    const force_rander = function(name, value) {
        // console.log('==force_rander== ', name);
        rander(name, value, value, true);
    }
    if (APP_RUNMODE != 'live') {
        window.force_rander = force_rander;
    }

    const _get_Model_value = function(target, property) {
        let r = target[property] ? JSON.parse(Decrypt(target[property], key, 256)) : '';
        try {
            if (session_item.indexOf(property) > -1 && sessionStorage.getItem(property)) {
                r = JSON.parse(Decrypt(sessionStorage.getItem(property), key, 256));
            }
            if (local_item.indexOf(property) > -1) {
                r = JSON.parse(Decrypt(localStorage.getItem(property), key, 256));
            }
            if (cookie_item.indexOf(property) > -1) {
                console.log(key);
                // r = JSON.parse(Decrypt(getCookie(property), key, 256));
                r = getCookie(property);
            }
        } catch (e) {
            r = '';
        }
        return r;
    }
    const handler = {
        get: function(target, property) {
            return _get_Model_value(target, property);
        },
        set: function(target, property, value) {
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
        const check_proxy_value = function() {
            for (i in Model) {
                let __n = Model[i],
                    __o = OLD_Model[i];
                if (JSON.stringify(__n) !== JSON.stringify(__o) && rander) {
                    rander(i, __n, __o);
                }
            }
            OLD_Model = clone(Model);
            setTimeout(function() { check_proxy_value(); }, 100);
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
        'KRW': { 'pre_symbol': '', 'sub_symbol': __('원'), 'exchange_price': 0.00076, 'is_blockchain': false, 'is_virtual_currency': false, 'symbol_image': '', 'name': '대한민국 원' },
        'USD': { 'pre_symbol': '$ ', 'sub_symbol': '', 'exchange_price': 1, 'is_blockchain': false, 'is_virtual_currency': false, 'symbol_image': '', 'name': 'USD' }
    }
    Model.exchange_rate = { // 환율
        'base_currency': 'USD',
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
    const request_api = function() {
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
            $.post(API_URL + '/request/?', form, function(r) {
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

    const add_request_item = function(method_name, params, callback, repeat_time, old_path_name, duplicate) {
        var curr_path_name = path_name,
            old_path_name = old_path_name ? old_path_name : curr_path_name;
        if (repeat_time > 0 && old_path_name !== curr_path_name) { // 이전에 얘약걸어 둔 작업이 페이지가 다르면 종료합니다.(path_name으로 확인해 전체 경로를 비교합니다.)
            return false;
        }
        if (Model.token) { params.token = Model.token; }
        const item = { "method": method_name, "params": params };
        if (!duplicate) {
            for (var i in items) {
                if (JSON.stringify(items[i]) == JSON.stringify(item)) {
                    return; // 중복시 추가 종료.
                }
            }
        }
        items.push(item);
        let indexno = items.length - 1;
        callbacks[indexno] = callback;
        if (repeat_time > 0 && old_path_name === curr_path_name) {
            let newtimeoutkey = setTimeout(function() {
                add_request_item(method_name, params, callback, repeat_time, curr_path_name);
            }, repeat_time);
            timeoutkeys[indexno] = newtimeoutkey;
        }
    };

    /* Utils ----------------------------------------------------------------------------------- */

    // 가격 변환
    const dprice = function(p, c) {
        let exchange_currency = c || Model.user_info && Model.user_info.exchange_currency || 'USD',
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
    const genPagingStube = function(p_total, p_page, p_cnt_rows, p_cnt_pages) {
        p_total = p_total ? p_total*1 : 0;
        p_page = p_page ? p_page*1 : 1;
        p_cnt_rows = p_cnt_rows ? p_cnt_rows*1 : 10;
        p_cnt_pages = p_cnt_pages ? p_cnt_pages*1 : 10;
        max_pages = p_total ? Math.ceil(p_total / p_cnt_rows ) : 1;
        r = ''; //'<div class="paging">';
        // 이전페이지로
        if (p_total > 0 && p_page > 1) {
            r += '<span><a href="'+setUrlParamValue('page', p_page - 1, window.location.search)+'"><img src="/@resource/images/icon/ico_arr_prev.png" alt=""></a></span>';
        } else {
            r += '<span><img src="/@resource/images/icon/ico_arr_prev.png" alt="" class="inactive"></span>';
        }
        // 중간 페이지 번호영역
        batch = Math.ceil(p_page / p_cnt_pages );
        end = batch * p_cnt_pages;
        if (end == p_page) {
            //end = end + p_cnt_pages - 1;
            //end = end + ceil(p_cnt_pages/2);
        }
        if (end > max_pages) {
            end = max_pages;
        }
        start = end - p_cnt_pages + 1;
        start = (start<1) ? 1 : start;
        for(i = start; i <= end; i ++) {
            if (i == p_page) {
                r += '<span class="num active"><a href="'+setUrlParamValue('page', i, window.location.search)+'">'+i+'</a></span>';
            } else {
                r += '<span class="num"><a href="'+setUrlParamValue('page', i, window.location.search)+'">'+i+'</a></span>';
            }
        }
        // 다음페이지로
        if (p_total > 0 && p_page < max_pages) {
            r += '<span><a href="'+setUrlParamValue('page', p_page + 1, window.location.search)+'"><img src="/@resource/images/icon/ico_arr_next.png" alt=""></a></span>';
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
            setTimeout(function() { display_remain_time(end_time, target_m, target_s); }, 500);
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

            reader.onload = function(e) {
                $('#photo').attr('src', e.target.result);

                img.onload = function() {
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

            reader.onload = function(e) {
                src = e.target.result;
                if (tagName == 'IMG') {
                    $img.attr('src', src);
                } else {
                    $img.css('background', 'url(' + src + ') no-repeat 50% 50%/cover #e1e1e1');
                }
                img.onload = function() {
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

            reader.onload = function(e) {
                $iframe.attr('src', e.target.result);

                //$img.attr('src', src);
                iframe.onload = function() {
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

        fileReader.onload = function() {
            var blob = new Blob([fileReader.result], { type: file.type });
            //console.log(blob);
            var url = URL.createObjectURL(blob);
            var video = document.createElement('video');
            var timeupdate = function() {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                    video.pause();
                }
            };
            video.addEventListener('loadeddata', function() {
                if (snapImage()) {
                    video.removeEventListener('timeupdate', timeupdate);
                }
            });
            var snapImage = function() {
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
                    function() {}) {
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
    const get_video_url = function(html) {
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
    const get_video_img = function(videourl) {
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
                'url':'https://www.youtube.com/oembed?format=xml&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D'+id,
                'async':false,
                'success':function(res){
                    r.push($('thumbnail_url',r).text()); // 
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

    const check_userinfo = function() {
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

    //레벨별 사용 가능 포인트
    const get_lv_amount = function(lv) {
        let r = '1';
        switch (lv) {
            case 1:
                r = 1;
                break;
            case 2:
                r = 10;
                break;
            case 3:
                r = 20;
                break;
            case 4:
                r = 50;
                break;
            case 5:
                r = 100;
                break;
            case 6:
                r = 200;
                break;
            case 7:
                r = 500;
                break;
            case 8:
                r = 1000;
                break;
            case 9:
                r = 2000;
                break;
            default:
                r = 1;
        }
        return r;
    }
    const get_coin_icon_class = function(amount) {
        let r = 'coin-1';
        amount = amount * 1;
        switch (amount) {
            case 1:
                r = 'coin-1';
                break;
            case 10:
                r = 'coin-10';
                break;
            case 20:
                r = 'coin-20';
                break;
            case 50:
                r = 'coin-50';
                break;
            case 100:
                r = 'coin-100';
                break;
            case 200:
                r = 'coin-200';
                break;
            case 500:
                r = 'coin-500';
                break;
            case 1000:
                r = 'coin-1000';
                break;
            case 2000:
                r = 'coin-5000';
                break;
            default:
                r = 'coin-1';
        }
        return r;
    }

    /**
     * https 가 아닌 http로 페이지를 열어야 할때 사용합니다.
     */
    const use_http = function() {
        // if(window.location.href.indexOf('https://')>-1) {
        // 	window.location.replace( window.location.href.replace('https://', 'http://') );
        // }
    }

    // 페이징 처리
    let scroll_searching = false,
        scroll_end = false;
    // const tpl_video_item = '<li><a href="/views.php?video_idx={video_idx}"><div class="img" style="background-image:url({video_img});background-size:cover" alt="{title}"></div></a><div class="explan"><span class="picture"><img src="{user_profile_img}" alt="{nickname}"></span><p class="txt"><a href="/views.php?video_idx={video_idx}">{title}</a></p><div class="pay_date"><p class="pay"><a href="user-main.php?userno={video_userno}"><span class="name">{nickname}</span></a><span class="ico_pay"></span><span>{view_cnt}</span></p><p class="date">{reg_date}</p></div></div></li>';
    const tpl_video_item = '<li><a href="/views.php?video_idx={video_idx}"><div class="img" style="background-image:url({video_img});background-size:cover" alt="{title}"></div></a><div class="explan"><a href="user-main.php?userno={video_userno}"><span class="picture" style="background-image:url({user_profile_img})"></span></a><p class="txt"><a href="/views.php?video_idx={video_idx}">{title}</a></p><div class="pay_date"><p class="pay"><a href="user-main.php?userno={video_userno}"><span class="name">{nickname}</span></a><span class="ico_pay"></span><span>{view_cnt}</span></p><p class="date">{reg_date}</p></div></div></li>';

    const gen_video_htmnl = function(r) {
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


    const add_event_click_left_menu_tab = function() {
        $('#left_menu .inTabs li').on('click', function() {
            let t = $(this).attr('data-target');
            $(this).addClass('active').siblings().removeClass('active');
            $(t).show().siblings('.tab_con').hide();
        });
    }

    const check_login = function() {
        if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
            window.location.href = LOGIN_PAGE;
        }
    }
    const check_logout = function() {
        if (Model.user_info && Model.user_info.userid && Model.user_info.userno) {
            window.location.href = "/";
        }
    }

    /**
     * 새 채팅 매시지 가져오기
     * 채팅 페이지 컨트롤러에 있던 함수를 전체 페이지에서 사용할수 있게 위치변경함.
     * @param {number} t
     */
    const get_new_message = function(t) {
            let last_msg_idx = $('[name=msg_box]:last').attr('data-idx');
            add_request_item('getChatMessage', { 'token': getCookie('token'), 'last_msg_idx': last_msg_idx, 'target_idx': window.chat_target_idx }, function(r) {
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
                        console.log('view_end:',view_end);
                        if (view_end) {
                            // $('.comment-wrap').scrollTop($('[name=comment-list]').height() * 1 + 100);
                            set_scroll_bottom();
                        }
                    }
                }
            });
            if (t > 0) {
                setTimeout(function() { get_new_message(t); }, t);
            }
        }
        // 채팅 내용 가져오기
    const tpl_suport = '<div class="realtime_spon" name="msg_box" data-idx="{idx}">\
    {html_delete_icon}\
    <p class="pay_meney">{amount_str}<img src="/@resource/images/icon/ico_smart_pay.png" alt=""></p><p class="txt"><a href="/user-main.php?userno={userno}">{nickname}</a> 님이 {amount_str} PAY를 조공하였습니다</p></div>';
    const tpl_chat = '<dl name="msg_box" data-idx="{idx}">\
    {html_delete_icon}\
    <dt><a href="/user-main.php?userno={userno}"><img src="{profile_img}" alt="{nickname}"></a></dt><dd><p class="name"><a href="/user-main.php?userno={userno}">{nickname}</a> <img src="/@resource/images/icon/ico_fan1.png" alt=""></p><p class="txt">{comment}</p></dd></dl>';
    const get_html = function(msg) {
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
    const get_old_message = function() {
        if (scroll_searching || scroll_end) { return false; } // 작업중이거나 끝까지 로딩 했으면 중단.
        scroll_searching = true;
        let prev_msg_idx = $('[name=msg_box]:first').attr('data-idx');
        add_request_item('getChatMessage', { 'token': getCookie('token'), 'prev_msg_idx': prev_msg_idx, 'target_idx': window.chat_target_idx }, function(r) {
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
    const set_scroll_bottom = function() {
        $('.comment-wrap:visible').scrollTop($('[name=comment-list]:visible').height());
    }
    // 모바일에서는 채팅위치 변경 - 우측 채팅영역이 숨겨지면 동영상 밑으로 이동
    const set_position_chatbox = function() {
        if($('.right_menu').is(':visible')) {
            $('.mobile_cheat_box').hide();
            set_scroll_bottom();
        } else {
            $('.mobile_cheat_box').show();
            set_scroll_bottom();
        }
    }

    /* Controller ----------------------------------------------------------------------------------- */

    const fn_index = function() {
        API.getBBSList('notice', 1, 5, (resp) => {
            if(resp.success) {
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
    }


    const fn_check_pin = function() {
        

        window.keypress_support = false;

        // 폼 초기화
        $('#check_pin form').each(function() { if ($(this).reset) { $(this).reset(); } });

        // 폼 필터
        $('#check_pin input[type=password]').on('keypress keyup', function(evt) {
            if(evt.type=='keypress') {window.keypress_support = true;}
            if(window.keypress_support && evt.type=='keyup') {return false;}

            let keyCode = get_keycode(evt);
            let keyStr = get_str_by_keycode(keyCode);
            if(evt.type=='keyup') {keyStr = $(this).val();}
            // console.log(keyCode, keyStr);
            // 8:backspace, 9:tab, 13:enter, 16:shift, 17:ctrl, 18:alt, 19:pause, 20:caps lock, 46: delete
            if (keyCode == '8' || keyCode == '46' || keyCode == '9' || keyCode == '13' || keyCode == '16' || keyCode == '17' || keyCode == '18' || keyCode == '19' || keyCode == '20') {
                // keydown에서 처리.
            } else {
                if (keyStr.match(/[^0-9]/)) { return false; }
                $(this).val(keyStr);
                $(this).next('input[type=password]').select();
                $('#check_pin [name=userpw]').val($('#check_pin [name=userpw1]').val() + '' + $('#check_pin [name=userpw2]').val() + '' + $('#check_pin [name=userpw3]').val() + '' + $('#check_pin [name=userpw4]').val() + '' + $('#check_pin [name=userpw5]').val() + '' + $('#check_pin [name=userpw6]').val());
            }
            return false;
        }).on('keydown', function(evt) { // 크롬 keypress에서 backspace, space, delete 키 이벤트 작동 않되서 따로 적용합니다.
            let keyCode = get_keycode(evt);
            if (keyCode == '8' || keyCode == '46') { // backspace
                $(this).prev('input[type=password]').select();
                $(this).val('');
                $('#check_pin [name=userpw]').val($('#check_pin [name=userpw1]').val() + '' + $('#check_pin [name=userpw2]').val() + '' + $('#check_pin [name=userpw3]').val() + '' + $('#check_pin [name=userpw4]').val() + '' + $('#check_pin [name=userpw5]').val() + '' + $('#check_pin [name=userpw6]').val());
                return false;
            }
            if (keyCode == 13) { // enter
                $('.btn_group .btn:eq(0)').trigger('click');
            }
        }).on('click', function() {
            $(this).select();
        });
        // 애러 메시지 표시
        const display_error = function(str) {
                $('#check_pin .error_txt').text(str);
            }
            // 로그인
        $('#check_pin [name=btn-checkpin]').on('click', function() {
            let $input_pin = $('#check_pin [name=userpw]'),
                pin = $input_pin.val();
            if (!pin) {
                display_error(__('핀번호를 입력해주세요.'));
                $input_pin.focus();
                return false;
            }
            add_request_item('checkPin', { 'pin': pin }, function(r) {
                if (r && r.success && r.payload) {
                    Model.check_pin = time();
                    let ret_url = getURLParameter('ret_url')
                    window.location.href = ret_url ? base64_decode(ret_url) : '/user-info.php';
                } else {
                    let msg = r.error && r.error.message ? r.error.message.replace('거래보안번호', '핀번호') : __('핀번호가 올바른지 확인해주세요.');
                    display_error(msg);
                }
            });
            return false;
        });

    }
    const fn_login = function () {
        check_logout();
        window.keypress_support = false;

        // 폼 초기화
        $('#box_login form').each(function() { if ($(this).reset) { $(this).reset(); } });
        
        // 아이디 포커스
        $('#box_login [name=email]').get(0).focus();

        // 로그인
        $('#box_login form[name=login]').on('submit', function (e) {
            
            e.preventDefault()

            const $email = $('#email'), email = trim($email.val())
            const $password = $('#password'), password = trim($password.val())

            if(!email) {
                $email.focus()
                return false
            }

            if(!password) {
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
                    get_user_info();
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
        $.post(API_URL + '/logout/', { 'token': getCookie('token') }, function(r) {
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
    const fn_join = function() {
        
        // 약관가져오기
        $.get('/template/stube/uselaw_ko.txt', function(r) { ///template/uselaw_'+APP_LANG+'.txt
            $('#join [name=uselaw]').text(r);
        });
        $.get('/template/stube/privacy_ko.txt', function(r) {
            $('#join [name=privacy]').text(r);
        });
        $('[name=btn-agree]').on('click', function() {
            let $ck1 = $('#ck1'),
                $ck2 = $('#ck2');
            if (!$ck1.is(':checked')) {
                alert('이용 약관을 확인 후 동의해주세요.');
                $ck1.focus();
                return false;
            }
            if (!$ck2.is(':checked')) {
                alert('개인 정보 이용 약관을 확인 후  동의해주세요.');
                $ck2.focus();
                return false;
            }
            $('#agree').hide();
            $('#write').show();
        });
        // 가입폼 초기화
        $('#join form').each(function() { if ($(this).reset) { $(this).reset(); } });
        // 핸드폰번호 인증
        let end_time = 0;
        let sending = false;
        let confirmed_mobile = false,
            confirmed_mobile_number = '',
            confirmed_mobile_country_code = '',
            confirmed_country_code = '';
        $('[name=btn-request]').on('click', function() {
            let mobile_number1 = ($('[name=mobile_number1]').val() + '').trim(),
                mobile_number2 = ($('[name=mobile_number2]').val() + '').trim(),
                mobile_number3 = ($('[name=mobile_number3]').val() + '').trim(),
                mobile_number = mobile_number1 + mobile_number2 + mobile_number3,
                mobile_calling_code = '82',
                mobile_country_code = 'KR'; //$('[name=mobile_country_code]').val();
            // if(mobile_country_code!='+82') {
            // 	alert(__('미지원 국가입니다. 대한민국을 선택해 주세요.')); return false;
            // }
            if (!mobile_number || !mobile_number1 || !mobile_number2 || !mobile_number3) {
                alert(__('핸드폰 번호를 입력해주세요'));
                return false;
            }
            mobile_number = mobile_calling_code + (mobile_number.replace(/^0/, ''));
            if (sending) {
                alert(__('인증번호를 보내는중입니다.') + __('잠시만 기다려주세요.'));
                return false;
            }

            $('[name=mobile_number1],[name=mobile_number2],[name=mobile_number3]').attr('disabled', true);

            confirmed_mobile_number = mobile_number.replace(/[^0-9]/g, '');
            confirmed_mobile_calling_code = mobile_calling_code;
            confirmed_mobile_country_code = mobile_country_code;
            sending = true;
            // 가입여부 확인
            $.post(API_URL+'/checkJoin/', {'media':'mobile', 'ids':mobile_number}, function(r){
                let joined = false;
                if(r && r.payload) {
                    for(i in r.payload) {
                        if(r.payload[i].id==mobile_number && r.payload[i].status=='joined') {
                            joined = true;
                        }
                    }
                }
                if(joined) {
                    alert(__('이미 가입하셨습니다.')+' '+__('로그인 해주세요.'));
                    return ;
                }
                // firebase auth 사용하기.
                window.send_authmsg(mobile_number, function(r) {
                    sending = false;
                    if (r && r.success) {
                        end_time = Math.floor(new Date().getTime() / 1000) + 60 * 60;
                        display_remain_time(end_time, '#form_phone [name=min]', '#form_phone [name=sec]');
                        $('#form_phone [name=min]').parent().removeClass('hide');
                        $('[name=confirm_number]').focus();
                        alert(__('인증번호를 발송했습니다.'));
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('인증메시지를 보내지 못했습니다.') + ' ' + msg);
                        $('#form_phone [name=min]').parent().addClass('hide');
                        $('[name=mobile_number1],[name=mobile_number2],[name=mobile_number3]').attr('disabled', false);
                    }
                })
            })
                // 일반 sms 전송 사용하기.
                // add_request_item('sendConfirmCode', {'media':'mobile', 'mobile_number':'+82'+mobile_number, 'mobile_country_code':'KR'}, function(r){
                // 	sending = false;
                // 	if(r && r.success && r.payload) {
                // 		end_time = Math.floor(new Date().getTime()/1000) + 60*60;
                // 		display_remain_time(end_time, '#form_phone [name=min]', '#form_phone [name=sec]');
                // 		$('#form_phone [name=min]').parent().removeClass('hide');
                // 		alert(__('인증번호를 발송했습니다.'));
                // 	} else {
                // 		let msg = r.error && r.error.message ? r.error.message : __('인증메시지를 보내지 못했습니다.');
                // 		alert(msg);
                // 		$('#form_phone [name=min]').parent().addClass('hide');
                // 	}
                // });
        });
        $('[name=btn-confirm]').on('click', function() {
            let confirm_number = $('[name=confirm_number]').val();
            if (end_time == 0) {
                alert(__('인증 요청을 해주세요.'));
                return false;
            }
            if (end_time - Math.floor(new Date().getTime() / 1000) <= 0) {
                $('[name=mobile_number1],[name=mobile_number2],[name=mobile_number3]').attr('disabled', false);
                alert(__('유효시간이 지났습니다. 다시 인증 요청을 해주세요.'));
                return false;
            }
            if (!confirm_number) {
                alert(__('인증번호를 입력해주세요.'));
                return false;
            }

            window.check_authcode(confirm_number, function(r) {
                if (r && r.success) {
                    confirmed_mobile = true;
                    $('[name=confirm_number]').attr('disabled', true);
                    alert(__('휴대폰번호가 인증되었습니다.'));
                } else {
                    $('[name=confirm_number]').attr('disabled', false);
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('올바른 인증번호를 입력해주세요.') + ' ' + msg);
                }
            });
        });
        $('[name=btn-join]').on('click', function() {
            // if(confirmed_mobile) {
            // 	alert(__('휴대폰번호 인증을 완료해주세요.')); return false;
            // }
            let pin_number = $('[name=pin]').val();
            if (!pin_number) {
                alert(__('핀번호를 입력해주세요.'));
                return false;
            }

            var uaparser = new UAParser();
            uaparser.setUA(window.navigator.userAgent);
            var os = uaparser.getOS();
            var device = uaparser.getDevice();

            const data = {
                // 'token': getCookie('token'),
                'userid': 'mobile' + confirmed_mobile_number,
                'userpw': $('[name=pin]').val(),
                'name': $('[name=username]').val(),
                'mobile': confirmed_mobile_number,
                'mobile_country_code': confirmed_mobile_country_code,
                'mobile_calling_code': confirmed_mobile_calling_code,
                'pushkey': getCookie('fcm_token'),
                'os': os ? os.name + '-' + os.version : '',
                'uuid': device ? device.vendor + '-' + device.model + '-' + os.name + '-' + os.version : ''
            };
            $.post(API_URL + '/join/', data, function(r) {
                if (r && r.success) {
                    alert(__('회원가입을 완료했습니다.'));
                } else {
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('회원가입을 하지 못했습니다.') + ' ' + msg);
                }
            }, 'json');
        });



    }

    // const fn_userinfo = function() {
    //     
    //     check_login();
    //     rander('user_info', Model.user_info, null, true);
    //     if (Model.user_info.level) {
    //         $box_level = $('[name=box_level] li:eq(' + (Model.user_info.level - 1) + ')');
    //         $box_level.addClass('active').siblings('li').removeClass('active');
    //         $box_level.find('button').attr('disabled', false);
    //         $box_level.prevAll('li').find('button').attr('disabled', false);
    //         $box_level.nextAll('li').find('button').attr('disabled', true);
    //     }
    // }
    const fn_transaction = function() {
        
        check_login();
        let wallet_address = $('[name=wallet_address]').val();
        let rows = $('[name=rows]').val();
        let cnt_total = $('[name=cnt_total]').val();
        // 거래내역 페이지 클릭시 내용가져오기. 첫번째 내용은 서버에서 완성해서 dom 생성했음.
        $('.paging').on('click', 'a', function(){
            var url = $(this).attr('href'), p = url.match(/page=(.[^&]*)/), p = p&&p[1] ? p[1] : '';
            let tpl = '<tr class="{row_class}"><td>{reg_date}</td><td>{amount} PAY</td><td>{txn_type_str}</td><td>{relative_info}</td><td>{status_str}</td></tr>';
            if(p) {
                add_request_item('/getTransactionList/', {'symbol':'SPAY', 'address':wallet_address,'page':p, 'rows':rows}, function(r){
                    if(r && r.success) {
                        let html = [];
                        // console.log(r.payload);
                        for(i in r.payload) {
                            let row = r.payload[i];
                            if(row.cnt_total) cnt_total = row.cnt_total;
                            html.push( tpl
                                .replace('{row_class}', row.direction=='out' ? 'deposit' : '')
                                .replace('{reg_date}', date('m-d H:i', row.regtime))
                                .replace('{amount}', row.direction=='out' ? '-'+row.amount : '+'+row.amount)
                                .replace('{txn_type_str}', row.txn_type_str||'')
                                .replace('{relative_info}', row.relative_info||'')
                                .replace('{status_str}', row.status_str||'')
                            );
                            $('.pay_trade tbody').html(html.join(''));
                        }
                        $('.paging').html( genPagingStube(cnt_total, p, rows) );
                    }
                });
            }
            return false;
        })
    }

    const fn_message = function() {
        
        check_login();
        // rander('user_info', Model.user_info, null, true);
        $('[name=btn-gotolist]').on('click', function() {
            $('[name=box_view],[name=box_list]').toggleClass('hide');
            $('[name=box_view] [name=message]').html('');
        })
        $('[name=box_list]').on('click', '[name=row_message]', function() {
            let idx = $(this).attr('data-idx');
            let msg = $(this).attr('data-message');
            let sender = $(this).attr('data-sender');
            let date = $(this).attr('data-date');
            $('[name=box_view] [name=message]').html(msg);
            $('[name=box_view] [name=sender]').html(sender);
            $('[name=box_view] [name=date]').html(date);
            $('[name=box_view],[name=box_list]').toggleClass('hide');
            if (idx) {
                $.post(API_URL + '/putMessage/msg_read.php', { 'idx': idx, 'token': getCookie('token') }, function(r) {
                    // r
                });
            }
            $(this).addClass('fc-gray1');
        })
        // read
        $('#message [name="message"]').on('click', function() {
            $(this).find('[name=tiny],[name=full]').toggleClass('hide');
            let readed = $(this).attr('data-read_date');
            if(!readed) {
                let idx = $(this).attr('data-idx');
                const $tr = $(this).closest('tr');
                $.post(API_URL+'/putMessage/msg_read.php', {'token': getCookie('token'), 'idx':idx}, function(r){
                    if(r && r.success) {
                        $tr.find('[name="read_date"]').removeClass('unread').html(date('m-d H:i'));
                    }
                });
            }
        })
        // stop click event bubble on message's link
        $('#message [name="message"] [name="full"] a').on('click', function(e){
            e.stopPropagation();
        });
        // checkall
        $('#message #check_all').on('click', function() {
            let checked = $(this).is(':checked');
            $('#message [name="check_idx"]').each(function(){this.checked=checked;});
        })
        // save
        $('#message [name="btn-save"]').on('click', function() {
            let idxs = [];
            $('#message [name="check_idx"]:checked').each(function(){
                idxs.push( $(this).val() );
            });
            $.post(API_URL+'/putMessage/msg_keep.php', {'token': getCookie('token'), 'idxs':idxs.join(',')}, function(r){
                if(r && r.success) {
                    alert('메시지를 보관했습니다.');
                    setTimeout(function(){window.location.reload();}, 500);
                }
            })
            return false;
        })
        // cancel save
        $('#message [name="btn-cancel"]').on('click', function() {
            let idxs = [];
            $('#message [name="check_idx"]:checked').each(function(){
                idxs.push( $(this).val() );
            });
            $.post(API_URL+'/putMessage/msg_keep.php', {'token': getCookie('token'), 'idxs':idxs.join(','), 'action':'del'}, function(r){
                if(r && r.success) {
                    alert('메시지 보관을 취소했습니다.');
                    setTimeout(function(){window.location.reload();}, 500);
                }
            })
            return false;
        })
        // delete message
        $('#message [name="btn-delete"]').on('click', function() {
            let idxs = [];
            $('#message [name="check_idx"]:checked').each(function(){
                idxs.push( $(this).val() );
            });
            let c = confirm('{cnt}개의 메시지를 삭제하시겠습니까?'.replace('{cnt}', idxs.length));
            if(c) {
                $.post(API_URL+'/putMessage/msg_delete.php', {'token': getCookie('token'), 'idxs':idxs.join(','), 'action':'del'}, function(r){
                    if(r && r.success) {
                        alert('메시지를 삭제했습니다.');
                        setTimeout(function(){window.location.reload();}, 500);
                    }
                })
            }
            return false;
        })
    }
    const fn_write_msg = function() {
        
        check_login();
        var myeditor_kr = new cheditor();
        myeditor_kr.templateFile = 'template-simple.xml';
        myeditor_kr.inputForm = 'contents';
        myeditor_kr.config.editorHeight        = '300px';
        myeditor_kr.config.editorWidth         = '100%';
        myeditor_kr.config.imgMaxWidth         = 800;
        myeditor_kr.config.useFullScreen         = false;
        myeditor_kr.run();

        $('#write_msg [name="btn-write_msg"]').on('click',function(){
            let recever_userno = $('#write_msg [name=recever_userno]').val();
            let message = myeditor_kr.outputBodyHTML();
            $.post(API_URL+'/putMessage/msg_save.php', {'token': getCookie('token'), 'recever_userno':recever_userno, 'message':message, 'service_name':SERVICE_NAME}, function(r){
                if(r && r.success) {
                    alert(__('메시지를 보냈습니다.'));
                    closeModal();
                } else {
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('메시지를 보내지 못했습니다.')+' '+msg);
                }
            }, 'json')
        });
    }


    const fn_upload_type = function() {
        
        check_login();
        //check_userinfo();
    }

    const fn_photo_upload = function() {
        
        check_login();
        // url로 가져오기
        $('[name=photo-download]').on('click', function() {
            let $fileUrl = $('#fileUrl'),
                url = $fileUrl.val();
            if (!url) {
                alert(__('URL을 입력해주세요.'));
                return false;
            }
            for (i = 1; i <= 4; i++) {
                // 이미지 빈자리 찾기
                if ($('#image' + i).val() || $('#image' + i + '_url').val()) { continue; }
                // @todo 이미지 미리 로딩해 사용가능한지 확인하기
                // 이미지 소스 사용하기.
                $('#image' + i + '_url').val(url);
                $('#thumb' + i + '')
                    .css('background', 'url(' + url + ') 50% 50% / cover no-repeat #e1e1e1')
                    .siblings('.btn-delete').show();
                $fileUrl.val('');
                return;
            }
            alert(__('추가할 공간이 없습니다.') + ' ' + __('기존 사진을 삭제하시고 추가해주세요.'));
        });
        $('.modal').on('click', '.video-thumb', function() {
            console.error($(this).attr('data-target'));
            $($(this).attr('data-target')).click();
        });
        $('.modal').on('change', 'input[name^=pre_img]', function() {
            if (view_image(this, $($(this).attr('data-target')), 'arasajin')) {
                $(this).siblings('.btn-delete').show();
            }
        });
        $('.modal').on('click', '.btn-delete', function() {
            $(this).siblings('.video-thumb').css('background', '');
            $(this).siblings('input').val('');
            $(this).hide();
        });
        $('.modal').on('click', '[name="btn-upload-video"]', function() {
            let video_file = $('#video_file').val(),
                video_idx = $('#video_idx').val(),
                htmlcode = $('#htmlcode').val(),
                title = $('#title').val(),
                cate_idx = $('#cate_idx').val(),
                image1 = $('#image1').val(),
                image2 = $('#image2').val(),
                image3 = $('#image3').val(),
                image4 = $('#image4').val(),
                image1_url = $('#image1_url').val(),
                image2_url = $('#image2_url').val(),
                image3_url = $('#image3_url').val(),
                image4_url = $('#image4_url').val();
            if (!title) { alert(__('사진 제목을 선택해주세요.')); return false; }
            if (!cate_idx) { alert(__('사진 종류를 선택해주세요.')); return false; }
            if (!image1 && !image2 && !image3 && !image4 && !image1_url && !image2_url && !image3_url && !image4_url) { alert(__('사진을 선택해주세요.')); return false; }

            var self = this,
                $form = $('[name="form-video-upload"]');
            $form.attr('enctype', 'multipart/form-data');
            var formData = new FormData($form[0]);
            formData.append("token", getCookie('token'));
            $('[name="btn-upload-video"]').attr('disabled', true).text(__('업로드중입니다.'));
            $.ajax({
                'url': API_URL + '/putMyInfo/video_upload.php',
                'processData': false,
                'contentType': false,
                'data': formData,
                'type': 'POST',
                'cache': false,
                'timeout': 60 * 15 * 1000,
                'success': function(r) {
                    $('[name="btn-upload-video"]').attr('disabled', false).text(__('사진 업로드'));
                    if (r && r.success) {
                        if (confirm(__('등록했습니다.') + ' ' + __('사진 목록으로 이동하시겠습니까?'))) {
                            if (window.location.href.indexOf('user-main.php') > -1) {
                                closeModal();
                                window.location.reload();
                            } else {
                                window.location.href = "/user-main.php?userno=" + Model.user_info.userno + "#recent";
                            }
                        } else {
                            closeModal();
                            window.location.reload();
                        }
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('등록하지 못했습니다.') + ' ' + msg);
                    }
                },
                'fail': function() {
                    alert(__('등록하지 못했습니다.'));
                }
            })
        });
    }

    const fn_photo_event = function() {
        
        check_login();
        // QR스캔 시작
        $('.box-qr, .box-qrscan').on('click', function() {
            if (window.AraApp && window.AraApp.qrscanner && typeof window.AraApp.qrscanner == typeof
                function() {}) {
                window.AraApp.qrscanner(); // 인자 넣으면 애러발생 조심하세요.
            } else {
                alert(__('BDS지갑 앱을 이용해주세요.'));
            }
        })
        if (!window.set_qr_code) {
            window.set_qr_code = function(qrcode) {
                $('#qrcode').val(qrcode);
            }
        }
        // url로 가져오기
        $('[name=photo-download]').on('click', function() {
            let $fileUrl = $('#fileUrl'),
                url = $fileUrl.val();
            if (!url) {
                alert(__('URL을 입력해주세요.'));
                return false;
            }
            if (!url.match(/\.jpg|\.gif|\.png|\.jpeg/)) {
                alert(__('이미지 파일의 URL을 입력해주세요.'))
            }
            for (i = 1; i <= 4; i++) {
                // 이미지 빈자리 찾기
                if ($('#image' + i).val() || $('#image' + i + '_url').val()) { continue; }
                // @todo 이미지 미리 로딩해 사용가능한지 확인하기
                // 이미지 소스 사용하기.
                $('#image' + i + '_url').val(url);
                $('#thumb' + i + '')
                    .css('background', 'url(' + url + ') 50% 50% / cover no-repeat #e1e1e1')
                    .siblings('.btn-delete').show();
                $fileUrl.val('');
                return;
            }
            alert(__('추가할 공간이 없습니다.') + ' ' + __('기존 사진을 삭제하시고 추가해주세요.'));
        });
        $('.modal').on('click', '.video-thumb', function() {
            console.error($(this).attr('data-target'));
            $($(this).attr('data-target')).click();
        });
        $('.modal').on('change', 'input[name^=pre_img]', function() {
            if (view_image(this, $($(this).attr('data-target')), 'arasajin')) {
                $(this).siblings('.btn-delete').show();
            }
        });
        $('.modal').on('click', '.btn-delete', function() {
            $(this).siblings('.video-thumb').css('background', '');
            $(this).siblings('input').val('');
            $(this).hide();
        });
        $('.modal').on('click', '[name="btn-upload-video"]', function() {
            let video_file = $('#video_file').val(),
                video_idx = $('#video_idx').val(),
                htmlcode = $('#htmlcode').val(),
                title = $('#title').val(),
                cate_idx = $('#cate_idx').val(),
                image1 = $('#image1').val(),
                image2 = $('#image2').val(),
                image3 = $('#image3').val(),
                image4 = $('#image4').val(),
                image1_url = $('#image1_url').val(),
                image2_url = $('#image2_url').val(),
                image3_url = $('#image3_url').val(),
                image4_url = $('#image4_url').val(),
                qrcode = $('#qrcode').val();
            if (!title) { alert(__('사진 제목을 선택해주세요.')); return false; }
            if (!cate_idx) { alert(__('사진 종류를 선택해주세요.')); return false; }
            if (!qrcode) { alert(__('QR 코드를 스캔해주세요.')); return false; }
            if (!image1 && !image2 && !image3 && !image4 && !image1_url && !image2_url && !image3_url && !image4_url) { alert(__('사진을 선택해주세요.')); return false; }

            var self = this,
                $form = $('[name="form-video-upload"]');
            $form.attr('enctype', 'multipart/form-data');
            var formData = new FormData($form[0]);
            formData.append("token", getCookie('token'));
            $('[name="btn-upload-video"]').attr('disabled', true).text(__('업로드중입니다.'));
            $.ajax({
                'url': API_URL + '/putMyInfo/video_upload.php',
                'processData': false,
                'contentType': false,
                'data': formData,
                'type': 'POST',
                'cache': false,
                'timeout': 60 * 15 * 1000,
                'success': function(r) {
                    $('[name="btn-upload-video"]').attr('disabled', false).text(__('사진 업로드'));
                    if (r && r.success) {
                        if (confirm(__('등록했습니다.') + ' ' + __('사진 목록으로 이동하시겠습니까?'))) {
                            if (window.location.href.indexOf('user-main.php') > -1) {
                                closeModal();
                                window.location.reload();
                            } else {
                                window.location.href = "/user-main.php?userno=" + Model.user_info.userno + "#recent";
                            }
                        } else {
                            closeModal();
                            window.location.reload();
                        }
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('등록하지 못했습니다.') + ' ' + msg);
                    }
                },
                'fail': function() {
                    alert(__('등록하지 못했습니다.'));
                }
            })
        });
    }

    // const fn_modal_layer2 = function() {
    //     fn_video_link();
    // }
    const fn_video_link = function() {
        
        check_login();
        $('.modal').on('click', '[name="btn-preivew"]', function() {
            let html = $.trim($('#htmlcode').val()),
                src = '';
            var chk1 = html.indexOf("https://youtu.be/");
            var chk2 = html.indexOf("https://m.youtube.com/watch?v=");
            var chk_naver = html.indexOf("https://tv.naver.com/");
            var chk_kakao = html.indexOf("https://tv.kakao.com/channel/");
            var chk_dailymotion = html.indexOf("ttps://www.dailymotion.com");
            // if(html.indexOf('<')>-1 || chk1>-1 || chk2>-1 || chk_naver>-1 || chk_kakao>-1 || chk_dailymotion>-1) {
            src = get_video_url(html);
            // }
            // if(html.indexOf('http')===0){ // 동영상 url을 직접 넣었을때
            // 	src = html;
            // }
            if (src) {
                $('#video_url').val(src);
                html = src ? '<iframe class="" frameborder="0" name="movie" scrolling="no" src="' + src + '" width="100%" height="auto" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen="" style="height: 100%;"></iframe>' : '';
            } else {
                html = '<p class="center">' + __('올바른 동영상 HTML을 입력해주세요') + '</p>';
            }
            $('#preview-area').html(html);
        }).on('click', '.video-thumb', function() {
            $($(this).attr('data-target')).click();
        }).on('click', '[name=btn-past]', function(e) {
            // var pasteText = $('#htmlcode').get(0);
            // pasteText.focus();
            // document.execCommand("paste");
            //   console.log(pasteText.textContent);
        }).on('change', 'input[name^=pre_img]', function() {
            if (view_image(this, $($(this).attr('data-target')), 'arasajin')) {
                $(this).siblings('.btn-delete').show();
            } else {
                $(this).siblings('.btn-delete').hide();
            }
        }).on('click', '.btn-delete', function() {
            $(this).siblings('.video-thumb').css('background', '');
            $(this).siblings('input').val('');
            $(this).hide();
        }).on('keyup blur', '#htmlcode', function() {
            let videourl = get_video_url($(this).val());
            let thumbnails = get_video_img(videourl);

            // 한개만 보여줄때
            // 애러 이미지가 많으면 여러 이미지중에서 사용자가 고르도록 하자.
            for (i in thumbnails) {
                let url = thumbnails[i];
                if (url) {
                    $('[name="pre_img1_url"]').val(url).trigger('change');
                    break;
                }
            }

            // 이미지 로드 못할때 다른 이미지 사용하기 - youtube에서 미작동함 . onError에서 404 검색하지 못함. 쩝.
            // let set_thumbnail = function(url) {
            // 	$('[name="pre_img1_url"]').val(url).trigger('change');
            // }
            // let no = 0;
            // // 이미지 있는지 로드해보기
            // $.ajax({
            // 	url: '/path/to/image.img',
            // 	async: false,
            // 	failure: function () {
            // 		 alert('Image not found in server');
            // 	},
            // 	success: function () {
            // 		defaultImage = "/path/to/image.img";
            // 	}
            // });
            // let img = $('<img>')
            // .on('load', function(){ set_thumbnail($(this).attr('src')); })
            // .on('error', function(){ $(this).attr('src', thumbnails[++no]); })
            // .attr('src', thumbnails[no]);

            // 썸네일 여러개 뽑을때
            // for (i in thumbnails) {
            // 	i=i*1;
            // 	let url = thumbnails[i];
            // 	if(url) {
            // 		$('[name="pre_img'+(i+1)+'_url"]').eq(i).val(url).trigger('change');
            // 	}
            // }
        });
        // 유튜브정보 조회
        let youtube_url_prev = '';
        $('.modal').on('change keyup', '#youtube_url', function() {
            let youtube_url = $(this).val().trim();
            if (youtube_url == youtube_url_prev) {
                return;
            }
            youtube_url_prev = youtube_url;
            let video_idx = $('.modal [name=video_idx]').val();
            if (youtube_url) {
                $.post('/api/v1.0/getSiteInfo/youtube.php', { 'url': youtube_url }, function(r) {
                    if (r && r.payload) {
                        // if(!video_idx) {
                        // if(!r.payload.video_url) {alert('올바른 유튜브 주소를 입력해주세요.');}
                        if (r.payload.title) { $('#title').val(r.payload.title); }
                        $('#video_url').val(r.payload.video_url);
                        if (r.payload.description) { $('#description').val(r.payload.description) };
                        if (r.payload.keywords) {
                            $('#cate_idx option').each(function() {
                                const val = $(this).val(),
                                    category = $(this).text(),
                                    ps = category.indexOf('('),
                                    pe = category.indexOf(')'),
                                    ename = category.substr(0, ps),
                                    name = category.substr(ps + 1, pe - ps - 1);
                                // console.log(r.payload.keywords.match(new RegExp(ename, 'i')), r.payload.keywords.match(new RegExp(name, 'i')));
                                if (r.payload.keywords.match(new RegExp(ename, 'i')) || r.payload.keywords.match(new RegExp(name, 'i'))) {
                                    $('#cate_idx').val(val);
                                }
                            })
                            $('#description').val(htmlspecialchars_decode(r.payload.description, 'ENT_QUOTES'))
                        };
                        if (r.payload.image) { $('#pre_img1_url').val(r.payload.image) };
                        // }
                    } else {
                        // alert('유듀브주소가 올바른지 확인해주세요.');
                    }
                });
            } else {
                // if(!video_idx) {
                $('#title').val('');
                $('#description').val('');
                $('#cate_idx').val('');
                $('#pre_img1_url').val('');
                // }
            }
        })
        // 주매뉴(매인카테고리) 선택시 부매뉴 가져와 셋팅하기
        $('#cate_idx').on('change', function(){
            let cate_idx = $(this).val();
            add_request_item('getVideo/cate_list.php', { 'parent_idx': cate_idx }, function(r) {
                if (r && r.success && r.payload) {
                    let cate2 = r.payload;
                    let opt = ['<option value="" readonly>부매뉴를 선택해주세요.</option>'];
                    let empty = ['<option value="" readonly>부매뉴가 없습니다.</option>'];
                    if(cate2 && cate2.length>0) {
                        for( i in cate2 ) {
                            opt.push('<option value="'+cate2[i].idx+'">'+cate2[i].cate_name+'</option>')
                        }
                    } else {
                        opt = empty;
                    }
                    $('#cate_idx_2').find('option').remove();//.not('[readonly]')
                    $('#cate_idx_2').append(opt.join(''));
                }
            });
        });
        // 상품배너 이미지 변경
        $('[name="preview-img"]').on('click', function() {
            $('#sales_banner_url_new').trigger('click');
        })
        $('#sales_banner_url_new').on('change', function() {
            view_image(this, $('[name="preview-img"]'), 'stube');
            $('[name="preview-img"]').show();
            $('#sales_banner_url').val('');
        })
        $('#sales_banner_url').on('change', function() {
            view_image(this, $('[name="preview-img"]'), 'stube');
            $('[name="preview-img"]').show();
            $('#sales_banner_url_new').get(0).value='';
        })
        // 저장
        $('.modal').on('click', '[name="btn-save-video"]', function() {
            let video_url = $('#video_url').val(),
                video_idx = $('#video_idx').val(),
                htmlcode = $('#htmlcode').val(),
                title = $('#title').val(),
                description = $('#description').val(),
                cate_idx = $('#cate_idx').val(),
                // cate_idx_2 = $('#cate_idx_2').val(),
                sales_url = $('#sales_url').val(),
                image1 = $('#image1').val(),
                image2 = $('#image2').val(),
                image3 = $('#image3').val(),
                image4 = $('#image4').val(),
                image1_url = $('#pre_img1_url').val(),
                image2_url = $('#pre_img2_url').val(),
                image3_url = $('#pre_img3_url').val(),
                image4_url = $('#pre_img4_url').val();
            //https://www.youtube.com/embed/tjdjmxxcYds 리턴
            video_url = video_url ? video_url : get_video_url(htmlcode);
            if (!video_url) { alert(__('올바른 동영상주소를 입력해주세요.')); return false; } else { $('#video_url').val(video_url); }
            // if(!htmlcode)  {alert(__('올바른 동영상 HTML코드를 입력해주세요.')); return false;}
            if (!title) { alert(__('동영상 제목을 입력해주세요.')); return false; }
            if (!cate_idx) { alert(__('동영상 종류를 선택해주세요.')); return false; }
            if (!image1 && !image2 && !image3 && !image4 && !image1_url && !image2_url && !image3_url && !image4_url) { alert(__('미리보기 이미지를 선택해주세요.')); return false; }
            // if(!image1)  {alert(__('첫 번째 미리보기 이미지를 선택해주세요.')); return false;}
            // if(!image2)  {alert(__('두 번째 미리보기 이미지를 선택해주세요.')); return false;}
            // if(!image3)  {alert(__('세 번째 미리보기 이미지를 선택해주세요.')); return false;}
            // if(!image4)  {alert(__('네 번째 미리보기 이미지를 선택해주세요.')); return false;}


            // 이미지 업로드 후 s3 이미지url 설정
            if(sales_url) {
                let $sales_banner_url_new = $('#sales_banner_url_new');
                if ($.trim($sales_banner_url_new.val()) != '') {
                    tmp_url = upload_file($sales_banner_url_new, '상품 배너');
                    if(tmp_url) {
                        $('[name=sales_banner_url]').val(tmp_url);
                    } else {
                        alert(__('상품 배너를 업로드하지 못했습니다.')); return false;
                    }
                } else {
                    if($.trim($('#sales_banner_url').val()) == '') {
                        alert(__('상품 배너를 선택해주세요.')); return false;
                    }
                }
            }

            var self = this,
                $form = $('[name="form-video-link"]');
            $form.attr('enctype', 'multipart/form-data');
            var formData = new FormData($form[0]);
            formData.append("token", getCookie('token'));
            $.ajax({
                'url': API_URL + '/putMyInfo/video_upload.php',
                'processData': false,
                'contentType': false,
                'data': formData,
                'type': 'POST',
                'success': function(r) {
                    if (r && r.success) {
                        if (confirm(__('등록했습니다.') + ' ' + __('동영상 목록으로 이동하시겠습니까?'))) {
                            if (window.location.href.indexOf('cate.php') > -1) {
                                closeModal();
                                window.location.reload();
                            } else {
                                window.location.href = "/cate.php?cate_idx=" + cate_idx + "";
                            }
                        } else {
                            closeModal();
                            window.location.reload();
                        }
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('등록하지 못했습니다.') + msg);
                    }
                },
                'fail': function() {
                    alert(__('등록하지 못했습니다.'));
                }
            })
        });
        return false;
    }

    const fn_video_upload = function() {
        
        check_login();
        $('#video_file').on('change', function(event) {
            view_video(this, $($(this).attr('data-target')));
            view_video_thumnail(event, function() { $('#thumb1').siblings('.btn-delete').show(); });
        })
        $('.modal').on('click', '.video-thumb', function() {
            // console.error($(this).attr('data-target'));
            $($(this).attr('data-target')).click();
        });
        $('.modal').on('change', 'input[name^=pre_img]', function() {
            if (view_image(this, $($(this).attr('data-target')), 'aratube')) {
                $(this).siblings('.btn-delete').show();
            }
        });
        $('.modal').on('click', '.btn-delete', function() {
            $(this).siblings('.video-thumb').css('background', '');
            $(this).siblings('input').val('');
            $(this).hide();
        });
        $('.modal').on('click', '[name="btn-upload-video"]', function() {
            let video_file = $('#video_file').val(),
                video_idx = $('#video_idx').val(),
                htmlcode = $('#htmlcode').val(),
                title = $('#title').val(),
                cate_idx = $('#cate_idx').val(),
                image1 = $('#image1').val(),
                image2 = $('#image2').val(),
                image3 = $('#image3').val(),
                image4 = $('#image4').val(),
                image1_url = $('#image1_url').val(),
                image2_url = $('#image2_url').val(),
                image3_url = $('#image3_url').val(),
                image4_url = $('#image4_url').val();
            if (!video_idx && !video_file) { alert(__('동영상 파일을 선택해주세요.')); return false; }
            if (!title) { alert(__('동영상 제목을 선택해주세요.')); return false; }
            if (!cate_idx) { alert(__('동영상 종류를 선택해주세요.')); return false; }
            //if(!image1 && !image2 && !image3 && !image4 && !image1_url && !image2_url && !image3_url && !image4_url)  {alert(__('미리보기 이미지를 선택해주세요.')); return false;}
            // if(!image1)  {alert(__('첫 번째 미리보기 이미지를 선택해주세요.')); return false;}
            // if(!image2)  {alert(__('두 번째 미리보기 이미지를 선택해주세요.')); return false;}
            // if(!image3)  {alert(__('세 번째 미리보기 이미지를 선택해주세요.')); return false;}
            // if(!image4)  {alert(__('네 번째 미리보기 이미지를 선택해주세요.')); return false;}

            var self = this,
                $form = $('[name="form-video-upload"]');
            $form.attr('enctype', 'multipart/form-data');
            var formData = new FormData($form[0]);
            formData.append("token", getCookie('token'));
            $('[name="btn-upload-video"]').attr('disabled', true).text(__('업로드중입니다.'));
            $.ajax({
                'url': API_URL + '/putMyInfo/video_upload.php',
                'processData': false,
                'contentType': false,
                'data': formData,
                'type': 'POST',
                'cache': false,
                'timeout': 60 * 15 * 1000,
                'success': function(r) {
                    $('[name="btn-upload-video"]').attr('disabled', false).text(__('동영상 업로드'));
                    if (r && r.success) {
                        if (confirm(__('등록했습니다.') + ' ' + __('동영상 목록으로 이동하시겠습니까?'))) {
                            if (window.location.href.indexOf('user-main.php') > -1) {
                                closeModal();
                                window.location.reload();
                            } else {
                                window.location.href = "/user-main.php?userno=" + Model.user_info.userno + "#recent";
                            }
                        } else {
                            closeModal();
                            window.location.reload();
                        }
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('등록하지 못했습니다.') + ' ' + msg);
                    }
                },
                'fail': function() {
                    alert(__('등록하지 못했습니다.'));
                }
            })
        });
    }

    const fn_video_delete = function() {
        
        check_login();
        $('.modal').on('submit', '[name="form-video-delete"]', function() {
            let video_idx = $('[name=video_idx]').val();
            if (!video_idx) { alert(__('동영상 정보가 없습니다.')); return false; }
            let cate_idx = $('.modal [name=cate_idx]').val();
            let $ch_confirm_delete = $('.modal [name=ch_confirm_delete]');
            if ($ch_confirm_delete.length > 0 && !$ch_confirm_delete.is(':checked')) {
                alert(__('"복구할 수 없게 완전히 삭제함"에 체크 해주세요.'));
                return false;
            }

            $('[name="btn-save-video"]').attr('disabled', true).text(__('삭제중입니다.'));
            $.post(API_URL + '/putMyInfo/video_delete.php', { 'video_idx': video_idx, "token": getCookie('token') }, function(r) {
                $('[name="btn-save-video"]').attr('disabled', true).text(__('공유영상으로 게시'));
                if (r && r.success) {
                    if (confirm(__('삭제했습니다.') + ' ' + __('목록으로 이동하시겠습니까?'))) {
                        if (window.location.href.indexOf('cate.php?cate_idx=' + cate_idx) > -1) {
                            closeModal();
                            window.location.reload();
                        } else {
                            window.location.href = 'cate.php?cate_idx=' + cate_idx;
                        }
                    } else {
                        closeModal();
                        window.location.reload();
                    }
                } else {
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('삭제하지 못했습니다.') + ' ' + msg);
                }
            });
            return false;
        });
    }

    // 채팅 회원강퇴 페이지
    const fn_chat_banishment = function() {
        $('#chat_banishment').on('click', '[name="btn-banishment"]', function() {
            let creator_userno = $(this).attr('data-creator_userno');
            let target_idx = $(this).attr('data-target_idx');
            let ban_userno = $(this).attr('data-ban_userno');
            let action = $(this).hasClass('red') ? 'del' : 'add';
            let msg = action == 'add' ? __('선택한 회원을 채팅창에서 강제 퇴장시키시겠습니까?') + ' ' + __('강제 퇴장된 회원은 모든 메시지가 자동 삭제되며 다시 입장이 불가합니다.') : __('선택한 회원을 다시 입장시키시겠습니까?') + ' ' + __('삭제된 메시지는 복구되지 않습니다.');
            let self = this;

            let c = confirm();
            if (c) {
                $.post(API_URL + '/putBanInfo/', { 'token': getCookie('token'), 'target_idx': target_idx, 'creator_userno': creator_userno, 'ban_userno': ban_userno, 'action': action }, function(r) {
                    if (r && r.success) {
                        if (action == 'add') {
                            alert('강제퇴장 처리했습니다.');
                            $(self).addClass('red');
                        } else {
                            alert('강제퇴장을 해지했습니다.');
                            $(self).removeClass('red');
                        }
                    } else {
                        alert('강제퇴장을 처리하지 못했습니다.' + ' ' + (r.error && r.error.message ? r.error.message : ''));
                    }
                })
            }
            return false;
        });
    }

    // 매니저 권한 설정 페이지
    const fn_fan_permission = function() {
        $('#fan_permission').on('click', '[name="btn-addmanager"]', function() {
            let creator_userno = $(this).attr('data-creator_userno');
            // let fan_userno = $(this).attr('data-fan_userno');
            let permission = $(this).hasClass('red') ? 'N' : 'Y';
            let self = this;
            $.post(API_URL + '/putFanInfo/', { 'token': getCookie('token'), 'creator_userno': creator_userno, 'fan_userno': fan_userno, 'bool_manager': permission }, function(r) {
                if (r && r.success) {
                    if (permission == 'Y') {
                        alert('매니저로 등록했습니다.');
                        $(self).addClass('red');
                    } else {
                        alert('매니저권한을 해제했습니다.');
                        $(self).removeClass('red');
                    }
                    // closeModal();
                    // window.location.reload();
                } else {
                    alert('매니저권한을 변경하지 못했습니다.' + ' ' + (r.error && r.error.message ? r.error.message : ''));
                }
            })
            return false;
        });
    }

    // 팬 가입 페이지
    const fn_join_fan = function() {
        $('[name="btn-joinfan"]').on('click', function() {
            let fan_level = $('#box-joinfan [name="fan_level"]').val();
            let creator_userno = $('#box-joinfan [name="creator_userno"]').val();
            $.post(API_URL + '/putJoinFan/', { 'token': getCookie('token'), 'creator_userno': creator_userno, 'fan_level': fan_level }, function(r) {
                if (r && r.success) {
                    alert('팬으로 가입했습니다.');
                    // closeModal();
                    window.location.reload();
                } else {
                    alert('팬으로 가입하지 못했습니다.' + ' ' + (r.error && r.error.message ? r.error.message : ''));
                }
            })
            return false;
        });
    }

    // warrant 설정페이지
    const fn_warrant = function() {
        // 최소기부금액 콤마처리
        $('.inList input.baseline').on('blur', function(){
            let n = $(this).val().toNumber();
            $(this).val( real_number_format(n) );
        })

        // 저장
        $('[name="btn-save-warrant"]').on('click', function() {
            let b1 = $('[name=b1]').val().toNumber();
            let b2 = $('[name=b2]').val().toNumber();
            let b3 = $('[name=b3]').val().toNumber();
            let b4 = $('[name=b4]').val().toNumber();
            let b5 = $('[name=b5]').val().toNumber();
            let b6 = $('[name=b6]').val().toNumber();
            let r1 = ($('[name=r1_1]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r1_2]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r1_3]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r1_4]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r1_5]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r1_6]').val());
            let r2 = ($('[name=r2_1]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r2_2]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r2_3]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r2_4]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r2_5]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r2_6]').val());
            let r3 = ($('[name=r3_1]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r3_2]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r3_3]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r3_4]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r3_5]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r3_6]').val());
            let r4 = ($('[name=r4_1]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r4_2]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r4_3]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r4_4]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r4_5]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r4_6]').val());
            let r5 = ($('[name=r5_1]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r5_2]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r5_3]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r5_4]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r5_5]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r5_6]').val());
            let r6 = ($('[name=r6_1]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r6_2]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r6_3]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r6_4]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r6_5]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r6_6]').val());
            let r7 = ($('[name=r7_1]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r7_2]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r7_3]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r7_4]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r7_5]').is(':checked') ? 'Y' : 'N') + ',' + ($('[name=r7_6]').val());
            $.post(API_URL + '/putWarrantRule/', { 'token': getCookie('token'), 'video_idx': getURLParameter('video_idx'), 'r1': r1, 'r2': r2, 'r3': r3, 'r4': r4, 'r5': r5, 'r6': r6, 'r7': r7, 'b1': b1, 'b2': b2, 'b3': b3, 'b4': b4, 'b5': b5, 'b6': b6}, function(r) {
                if (r && r.success) {
                    alert('저장했습니다.');
                    // closeModal();
                    window.location.reload();
                } else {
                    alert('저장하지 못했습니다.' + ' ' + (r.error && r.error.message ? r.error.message : ''));
                }
            })
        });
        return false;
    }

    // 화상채팅 시작 - 매니저만 작동하는건데 .. 일단 모두 작동시키기 최대 5명 크리에이터 제외.
    const init_cam = function() {

        // alert('init_cam start');
        if($('.cam .user').is(':visible')) {
            $('.cam .btn-close-cam').trigger('click');
            return ;
        }

        const $cam = $('.cam'); // 화상채팅 DOM
        const evt_start_success = $.Event('start_success'); // 시작 성공 이벤트
        const evt_start_fail = $.Event('start_fail');       // 시작 실패 이벤트
        const evt_end = $.Event('end');                     // 종료 이벤트

        /** @type {SocketIOClient.Socket} */
        window.socket = io.connect('https://video-chat.stube.co.kr:3334/'); // 반복 호출되서 window. 변수로 사용해 중복을 피합니다.
        // console.log('init socket:', socket);
        // window.socket = socket;
        window.localSocketID = ''; // 반복 호출되서 window. 변수로 사용해 중복을 피합니다.
        let localVideo = document.querySelector('.localVideo');
        const remoteVideos = document.querySelector('.remoteVideos');
        window.peerConnections = window.peerConnections ? window.peerConnections : {}; // 반복 호출되서 window. 변수로 사용해 중복을 피합니다.
        // window.peerConnections = peerConnections;
        let is_manager = true; //참여인원수 < getUserMediaAttempts ? true : false;

        const room = sha1(window.location.host+'/room/'+getURLParameter('video_idx'));
        // console.log('socket room:', room);
        let getUserMediaAttempts = 4; // 최대참여인원
        let gettingUserMedia = false;
        let 참여인원수 = 0;
        let 내채팅아이디;
        window.localStream = null; // 로컬 비디오 종료시 사용. 반복 호출되서 window. 변수로 사용해 중복을 피합니다.

        /** @type {RTCConfiguration} */
        const config = {
            'iceServers': [{
                'urls': ['stun:stun.l.google.com:19302']
            }]
        };

        /** @type {MediaStreamConstraints} */
        const constraints = {
            audio: true,
            video: {
                facingMode: "user"
                ,frameRate: { min: 10, ideal: 15, max: 60 } // for webrtc
                ,width: { ideal: 512, max: 1024 } // 256, 1280, 1920
                ,height: { ideal: 288, max: 576 } // 144, 720, 1080
                // ,width: { min: 256, ideal: 512, max: 1024 } // 256, 1280, 1920
                // ,height: { min: 144, ideal: 288, max: 576 } // 144, 720, 1080
            }
        };

        socket.on('full', function(room) {
            // alert('화상채팅방에 자리가 없습니다.');
            $cam.trigger(evt_start_fail, '화상채팅방에 자리가 없습니다.');
        });

        socket.on('bye', function(id) {
            // console.log('bye start. id:' + id);
            handleRemoteHangup(id);
        });

        socket.on('init', function(numClients) {
            // alert('init start. numClients:' + numClients);
            // console.log('init start. numClients:' + numClients);
            참여인원수 = numClients * 1;
            // console.log('init socket.id:'+ socket.id);
            if(socket.id) window.localSocketID = socket.id;
            // alert('init start. 화상채팅참여자수: '+ (numClients*1+1));
        });

        window.onunload = window.onbeforeunload = function() {
            socket.close();
            // window.socket.close();
        };

        /**
         * 상대방이 접속할때 작동함.
         */
        socket.on('ready', function(id) {
            // console.log('ready socket.id:'+ socket.id);
            // alert('ready start. id:' + id);
            // console.log('ready start. id:' + id);
            if (!(localVideo instanceof HTMLVideoElement) || !localVideo.srcObject) {
                return;
            }
            const peerConnection = new RTCPeerConnection(config);
            peerConnections[id] = peerConnection;
            if (localVideo instanceof HTMLVideoElement && is_manager) {
                peerConnection.addStream(localVideo.srcObject);
            }
            peerConnection.createOffer()
                .then(sdp => peerConnection.setLocalDescription(sdp))
                .then(function() {
                    socket.emit('offer', id, peerConnection.localDescription);
                });
            peerConnection.onaddstream = event => handleRemoteStreamAdded(event.stream, id);
            peerConnection.onicecandidate = function(event) {
                if (event.candidate) {
                    socket.emit('candidate', id, event.candidate);
                }
            };
        });

        /**
         * 내가 접속할 때 작동함.
         */
        socket.on('offer', function(id, description) {
            // console.log('offer socket.id:'+ socket.id);
            // alert('offer start. id:' + id);
            // console.log('offer start. id:' + id);
            const peerConnection = new RTCPeerConnection(config);
            peerConnections[id] = peerConnection;
            if (localVideo instanceof HTMLVideoElement && is_manager) {
                peerConnection.addStream(localVideo.srcObject);
            }
            peerConnection.setRemoteDescription(description)
            .then(() => peerConnection.createAnswer())
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(function() {
                socket.emit('answer', id, peerConnection.localDescription);
            });
            peerConnection.onaddstream = event => handleRemoteStreamAdded(event.stream, id);
            peerConnection.onicecandidate = function(event) {
                if (event.candidate) {
                    socket.emit('candidate', id, event.candidate);
                }
            };
        });

        socket.on('candidate', function(id, candidate) {
            // console.log('candidate socket.id:'+ socket.id);
            // alert('candidate start. id:' + id);
            // console.log('candidate start. id:' + id);
            // console.log('candidate peerConnections:',peerConnections);
            peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
                .catch(e => console.error(e));
        });

        socket.on('answer', function(id, description) {
            // alert('answer start');
            // console.log('answer start');
            peerConnections[id].setRemoteDescription(description);
        });

        socket.on('broadcast', function(id, name, data) {
            // alert('broadcast start');
            // console.log('broadcast start ', id, name, data);
            switch(name) {
                case 'mic':
                    handleRemoteMic(id, data);
                break;
                case 'video':
                    handleRemoteVideo(id, data);
                break;
                case 'disconnect':
                    handleRemoteHangup(id);
                break;
            }
            // alert('broadcast 서버로부터 실행됨. id:' + id + ',name:' + name + ', data:'+data);
        });

        const gen_html_id = function (id) {
            return id.replace(/[^a-zA-Z]+/g, "").toLowerCase()
        }

        // const $tpl_remote = $('<div class="user"><img id="test" src="/@resource/images/chat/close_BTN.png" class="btn-close-cam"></div>');
        // const $tpl_remote = $('<div class="user"><div class="centered"></div></div>');
        const $tpl_remote = $('<div class="user remote"><div class="btn btn-mic off"><i class="fas fa-microphone-alt-slash off"></i><i class="fas fa-microphone-alt on"></i></div><div class="btn btn-video on"><i class="fas fa-video-slash off"></i></div><div class="centered"></div></div>');

        function handleRemoteStreamAdded(stream, id) {
            // alert('handleRemoteStreamAdded start. id:' + id);
            // console.log('handleRemoteStreamAdded start. id:' + id);
            const remoteVideo = document.createElement('video');
            remoteVideo.srcObject = stream;
            // remoteVideo.setAttribute("id", gen_html_id(id));
            remoteVideo.setAttribute("playsinline", "true");
            remoteVideo.setAttribute("autoplay", "true");
            remoteVideo.setAttribute("muted", "true");
            // remoteVideo.setAttribute("class", "user");
            let tpl_id = gen_html_id(id);
            let $tpl = $('#'+tpl_id).length>0 ? $('#'+tpl_id).empty() : $tpl_remote.clone();
            $tpl.find('video').remove();
            $tpl.attr('id', tpl_id);
            $tpl.find('.btn-mic').addClass('off').removeClass('on');
            $tpl.find('.btn-video').addClass('on').removeClass('off');
            $tpl.find('.centered').append(remoteVideo);
            // remoteVideos.appendChild($tpl.get(0));
            remoteVideos.insertBefore($tpl.get(0), remoteVideos.firstChild);
            //   if (remoteVideos.querySelectorAll("video").length === 1) {
            //     remoteVideos.setAttribute("class", "one remoteVideos");
            //   } else {
            //     remoteVideos.setAttribute("class", "remoteVideos");
            //   }
            // console.log('현재참여인원수:', get_join_cnt());
        }

        function getUserMediaError(error) {
            // alert('화상채팅에 참여하지 못했습니다. '+error);
            // console.log('getUserMediaError start');
            console.error(error);
            gettingUserMedia = false;
            // (--getUserMediaAttempts > 0) && setTimeout(getUserMediaDevices, 1000);
            localVideo = null;
            $cam.trigger(evt_start_fail, '화상채팅에 참여하지 못했습니다. '+error);
        }

        function getUserMediaSuccess(stream) {
            localStream = stream;
            // alert('getUserMediaSuccess start');
            // console.log('getUserMediaSuccess start');
            if (is_manager) {
                if (room && !!room) {
                    socket.emit('join', room);
                }
                // getUserMediaDevices
                gettingUserMedia = false;
                if (localVideo instanceof HTMLVideoElement) {
                    localStream.getAudioTracks()[0].enabled = false; // mic off
                    !localVideo.srcObject && (localVideo.srcObject = localStream); // set video stream to local
                }
                let $user = $('.cam .user');
                $user.find('.btn-mic').addClass('off').removeClass('on');
                $user.find('.btn-video').addClass('on').removeClass('off');
                $user.slideDown();
                socket.emit('ready');
                if(socket.id) window.localSocketID = socket.id;
            } else {
                localVideo = null;
            }
            $cam.trigger(evt_start_success);
        }

        function getUserMediaDevices() {
            // console.log('getUserMediaDevices start');
            // 내 화면
            if (localVideo instanceof HTMLVideoElement && is_manager) {
                // if (localVideo.srcObject) {
                //     getUserMediaSuccess(localVideo.srcObject);
                // } else if (!gettingUserMedia && !localVideo.srcObject) {
                    gettingUserMedia = true;
                    if(navigator.mediaDevices) {
                        navigator.mediaDevices.getUserMedia(constraints)
                            .then(getUserMediaSuccess)
                            .catch(getUserMediaError);
                    } else {
                        getUserMediaError('카메라가 작동하지 않습니다.');
                    }
                // }
            } else {
                getUserMediaError('카메라가 작동하지 않습니다.');
            }
            // 준비완료 - 내화면과 상관없이 준비완료해서 다른 방문자 화면을 봅니다.
            // 방문자는 접속자 화면을 보도록 하려 했지만 트래픽이 과도해서그런지 거의 안나오고 로딩만 해서 중단함.
            // socket.emit('ready');
        }

        getUserMediaDevices(); // init 함수로 로직을 분리했기때문에 함수가 실행되면 캠 디바이스부터 작동시키고 소켓에 접속합니다.

        /**
         * 현재 참여인원수
         */
        function get_join_cnt() {
            let n=0;
            for (i in peerConnections) {
                n++;
            }
            return n;
        }

        function handleRemoteMic(id, onoff) {
            // console.log('handleRemoteMic start. id:' + id);
            let $p = $('#'+gen_html_id(id)).closest('.user');
            if(onoff=='on') {
                $p.find('.btn-mic').addClass('on').removeClass('off');
            } else {
                $p.find('.btn-mic').addClass('off').removeClass('on');
            }
        }
        function handleRemoteVideo(id, onoff) {
            // console.log('handleRemoteVideo start. id:' + id);
            let $p = $('#'+gen_html_id(id)).closest('.user');
            if(onoff=='on') {
                $p.find('.btn-video').addClass('on').removeClass('off');
            } else {
                $p.find('.btn-video').addClass('off').removeClass('on');
            }
        }
        function handleRemoteHangup(id) {
            // console.log('handleRemoteHangup start. id:' + id);
            peerConnections[id] && peerConnections[id].close();
            delete peerConnections[id];
            let _v = document.querySelector("#" + gen_html_id(id));
            if (_v) _v.remove();
            // console.log('현재참여인원수:', get_join_cnt());
        }

        if(! $cam.attr('data-init')) {
            $cam
            // 화상채팅종료 버튼
            .on('click', '.btn-close-cam', function(){
                // if(confirm('화상채팅을 종료하시겠습니까?')) {
                    localStream.getTracks().forEach(function(track) { // 캠코더 audio,video 모든 track 종료
                        track.stop();
                    });
                    localVideo.srcObject = null;// 이미지 소스 연결 제거
                    for ( let id in peerConnections) { // 소켓 연결 종료
                        handleRemoteHangup(id);
                    }
                    peerConnections[window.localSocketID] && peerConnections[window.localSocketID].close(); // webrtc 종료
                    socket.emit('broadcast', 'disconnect', window.localSocketID); // remote에 접속 종료 신호 전달.내 접속 아이디로도 종료처리함.
                    r = socket.disconnect(); // socket 종료
                    // window.socket.disconnect();
                    r = socket.close();
                    socket = null;
                    // window.socket.close();
                    $(localVideo).closest('.user').slideUp();
                    $cam.find('.user.remote').remove();
                    $cam.trigger(evt_end);
                // }
            })
            // mic on/off 버튼
            .on('click', '.btn-mic', function(){
                let onoff = $(this).hasClass('on') ? 'on' : 'off';
                if($(this).hasClass('on')) { // on -> off
                    localStream.getAudioTracks()[0].enabled = false; // mic off
                    socket.emit('broadcast', 'mic', 'off');
                    $(this).addClass('off').removeClass('on');
                } else {// off -> on
                    localStream.getAudioTracks()[0].enabled = true; // mic on
                    socket.emit('broadcast', 'mic', 'on');
                    $(this).addClass('on').removeClass('off');
                }
            })
            // video on/off 버튼
            .on('click', '.btn-video', function(){
                let onoff = $(this).hasClass('on') ? 'on' : 'off';
                if($(this).hasClass('on')) { // on -> off
                    localStream.getVideoTracks()[0].enabled = false; // mic off
                    socket.emit('broadcast', 'video', 'off');
                    $(this).addClass('off').removeClass('on');
                } else {// off -> on
                    localStream.getVideoTracks()[0].enabled = true; // mic on
                    socket.emit('broadcast', 'video', 'on');
                    $(this).addClass('on').removeClass('off');
                }
            })
            .attr('data-init', true)
        }
    };

    // views 페이지 controller
    const fn_views = function() {
        
        // 화상채팅시작 버튼
        $('.cam')
        .on('click', '.btn-open-cam', function(){
            init_cam();
        })
        .on('start_fail', function(e, msg){
            alert(msg);
        })
        .on('start_success', function(){
            $('.cam .cam-off').hide();
            $('.cam .cam-on').show();
        })
        .on('end', function(msg){
            $('.cam .cam-off').show();
            $('.cam .cam-on').hide();
        })
        ;
        // 화상채팅 박스 영역 세로(수직)화면 가운데로 정렬시키기
        let check_vertical_video = function() {
            $('.cam .user video').each(function(){
                // console.log($(this).width(),$(this).height());
                if($(this).width() < $(this).height()) {
                    $(this).addClass('vertical');
                } else {
                    $(this).removeClass('vertical');
                }
            });
            setTimeout(function(){check_vertical_video();}, 1000);
        };
        setTimeout(function(){check_vertical_video();}, 1000);

        // 채팅 박스 DOM 복사
        $('.mobile_cheat_box').append($('.chat_box').clone());
        // 모바일에서는 채팅위치 변경 - 우측 채팅영역이 숨겨지면 동영상 밑으로 이동
        set_position_chatbox();
        $(window).on('resize', set_position_chatbox);

        // 채팅 관리 매뉴 on/off
        $('.setting').on('click', function() {
            $('.setting_list').toggleClass('active');
        });

        // 채팅 화면 최신 메시지 보기
        set_scroll_bottom();
        // // 채팅 내용 가져오기
        get_new_message(5000);
        $('.comment-wrap').on('scroll', function() {
                // console.log('scrollTop():', $(this).scrollTop(), ', innerHeight():', $(this).innerHeight(), ', scrollHeight:', $(this)[0].scrollHeight)
                if ($(this).scrollTop() < 50 && !scroll_searching) {
                    get_old_message();
                }
            }).on('click', '.btn-delete-msg', function() {
                let data = { 'token': getCookie('token') },
                    $li = $(this).closest('[name="msg_box"]');
                data.idx = $(this).attr('data-idx');
                if (confirm(__('삭제된 메시지는 복구되지 않습니다.') + ' \n' + __('삭제하시겠습니까?'))) {
                    $.post(API_URL + '/putChatMessage/delete.php', data, function(r) {
                        if (r && r.success) {
                            $li.remove();
                        } else {
                            let msg = r.error && r.error.message ? r.error.message : '';
                            alert(__('메시지를 삭제하지 못했습니다.') + ' ' + msg);
                        }
                    });
                }
            })
            // 전체 삭제
        $('[name="btn-del_chat"]').on('click', function() {
            let data = { 'token': getCookie('token'), 'target_idx': getURLParameter('video_idx') };
            if (confirm(__('삭제된 메시지는 복구되지 않습니다.') + ' \n' + __('전체 메시지를 삭제하시겠습니까?'))) {
                $.post(API_URL + '/putChatMessage/delall.php', data, function(r) {
                    if (r && r.success) {
                        $('[name=comment-list] [name="msg_box"]').remove();
                        alert(__('메시지를 삭제했습니다.'));
                        $('.setting_list').toggleClass('active');
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('메시지를 삭제하지 못했습니다.') + ' ' + msg);
                    }
                });
            }
        })

        let send_coin_info = { 'symbol': 'SPAY', 'amount': 0, 'coin_name': '' };
        const send_message = function(msg) {
            let data = { 'token': getCookie('token') };
            data.video_idx = window.chat_target_idx;
            data.target_idx = window.chat_target_idx;
            data.symbol = send_coin_info.symbol;
            data.point_amount = send_coin_info.amount;
            data.message = msg||$('[name=message]:visible').val();
            if (send_coin_info.amount > 0) {
                $.post(API_URL + '/putMyInfo/send_point.php', data, function(r) {
                    if (r && r.success) {
                        $.post(API_URL + '/putChatMessage/', data, function(r) {
                            if (r && r.success) {
                                $('[name=message]:visible').val('');
                                send_coin_info = { 'symbol': '', 'amount': 0 };
                                get_new_message();
                            } else {
                                let msg = r.error && r.error.message ? r.error.message : '';
                                alert(__('메시지를 보내지 못했습니다.') + ' ' + msg);
                            }
                        });
                        // $('[name=btn-donate-'+data.point_amount+']').attr('disabled', true).attr('title', __('이미 사용하셨습니다.')); // 버튼 하나만 비활성화 시킬때 사용.
                        $('.support-coins .btn-coins').attr('disabled', true).attr('title', __('이미 사용하셨습니다.')); // 모든 버튼 비활성화 시킬때 사용.
                        $('[name=btn-close-popup]').click();
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('포인트를 보내지 못했습니다.') + ' ' + msg);
                    }
                });
            } else {
                $.post(API_URL + '/putChatMessage/', data, function(r) {
                    if (r && r.success) {
                        $('[name=message]:visible').val('');
                        send_coin_info = { 'symbol': '', 'amount': 0 };
                        get_new_message();
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('메시지를 보내지 못했습니다.') + ' ' + msg);
                    }
                });
            }

        }
        $('[name="message"]').on('keyup keypress', function() {
            let msg = $(this).val().substr(0, 300);
            $('#msg_cnt').text(number_format(msg.length));
            $(this).val(msg);
        }).on('keydown', function(evt) {
            let msg = $(this).val(),
                msg_max = $('#msg_max').text(),
                keyCode = get_keycode(evt);
            // if(msg.length>=msg_max) {return false;}
            if (keyCode == 13) { $('[name=btn-write-message]:visible').click(); return false; }
        });
        $('[name=btn-write-message]').on('click', function() {
            let msg = $('[name="message"]:visible').val();
            if (!$.trim(msg) && send_coin_info.amount < 1) {
                alert(__('메시지를 작성해주세요.'));
                return false;
            }
            send_message(msg);
        });
        $('[name=btn-close-popup]').on('click', function() {
            $('.support-popup').addClass('hide');
            $('[name=message]:visible').css('padding-top', '10px');
            send_coin_info = { 'symbol': '', 'amount': 0, 'coin_name': '' };
        });
        $('.support-coins .btn-coins').on('click', function() {
            let amount = $(this).val(),
                symbol = $(this).attr('data-symbol');
            send_coin_info.symbol = symbol;
            send_coin_info.coin_name = Model.currency[symbol] ? Model.currency[symbol].name : symbol;
            send_coin_info.amount = amount;
            send_coin_info.amount_str = number_format(amount);
            $('[name=send_coin_icon]').removeClass(function(index, className) {
                return (className.match(/(^|\s)coin-\S+/g) || []).join(' ');
            }).addClass(get_coin_icon_class(amount));
            force_rander('send_coin_info', send_coin_info);
            $('.form-area .support-popup').removeClass('hide');
            $('[name=message]:visible').css('padding-top', $('.support-message').height() + 8);
        });
        $('.support-coins ul.content-pd1 li').on('click', function() {
            // if($(this).find('button').is(':disabled')) return;
            $(this).addClass('active').siblings('li').removeClass('active');
        });

        // 사진클릭시 메인뷰어에 넣기
        $('.photo-area .photo:gt(0)').on('click', function() {
            let src = $(this).attr('data-src');
            $('.photo-area .photo.main img').attr('src', src);
        })

        // 상품 광고 클릭시
        $('.sales a').on('click', function(){
            let sales_url = (this.href+'').indexOf('?')<0 ? this.href+'?t='+time() : this.href+'&t='+time();
            if(sales_url.indexOf('shop.app.stube.co.kr')>-1 || sales_url.indexOf('shop.stube.co.kr')>-1) {
                $.ajax({
                    'url':sales_url,
                    'method':'post',
                    'async':false,
                    'cache':false,
                    'data':{'token':getCookie('token')
                }}, function(){

                }); // 로그인 요청 보냄
            }
            if($(window).width()<=450) {
                let $window_sales = $('#window_sales');
                $window_sales.find('iframe').attr('src', sales_url);
                $window_sales.slideToggle();
                return false;
            }
        })
        $('#window_sales [name="btn_close_sales"]').on('click', function(){
            $('#window_sales').slideToggle();
        })
        $('.sales a').each(function(){
            let sales_url = (this.href+'').indexOf('?')<0 ? this.href+'?t='+time() : this.href+'&t='+time();
            // if(sales_url.indexOf('shop.app.stube.co.kr')>-1 || sales_url.indexOf('shop.stube.co.kr')>-1) {
            //     $.ajax({
            //         'url':sales_url,
            //         'method':'post',
            //         'async':false,
            //         'cache':false,
            //         'data':{'token':getCookie('token')
            //     }}, function(){

            //     }); // 로그인 요청 보냄
            // }
        })

    }

    const fn_user_main = function() {
        

        // 채팅 박스 DOM 복사
        $('.mobile_cheat_box').append($('.chat_box').clone());
        // 모바일에서는 채팅위치 변경 - 우측 채팅영역이 숨겨지면 동영상 밑으로 이동
        set_position_chatbox();
        $(window).on('resize', set_position_chatbox);

        // 채팅 관리 매뉴 on/off
        $('.setting').on('click', function() {
            $('.setting_list').toggleClass('active');
        });

        // 채팅 화면 최신 메시지 보기
        set_scroll_bottom();
        // 채팅 내용 가져오기
        get_new_message(5000);
        $('.comment-wrap').on('scroll', function() {
                if ($(this).scrollTop() < 50 && !scroll_searching) {
                    get_old_message();
                }
            }).on('click', '.btn-delete-msg', function() {
                let data = { 'token': getCookie('token') },
                    $li = $(this).closest('[name="msg_box"]');
                data.idx = $(this).attr('data-idx');
                if (confirm(__('삭제하시겠습니까?'))) {
                    $.post(API_URL + '/putChatMessage/delete.php', data, function(r) {
                        if (r && r.success) {
                            $li.remove();
                        } else {
                            let msg = r.error && r.error.message ? r.error.message : '';
                            alert(__('메시지를 삭제하지 못했습니다.') + ' ' + msg);
                        }
                    });
                }
            })
            // 전체 삭제
        $('[name="btn-del_chat"]').on('click', function() {
            let data = { 'token': getCookie('token'), 'target_idx': getURLParameter('userno') };
            if (confirm(__('삭제된 메시지는 복구되지 않습니다.') + ' \n' + __('전체 메시지를 삭제하시겠습니까?'))) {
                $.post(API_URL + '/putChatMessage/delall.php', data, function(r) {
                    if (r && r.success) {
                        $('[name=comment-list] [name="msg_box"]').remove();
                        alert(__('메시지를 삭제했습니다.'));
                        $('.setting_list').toggleClass('active');
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('메시지를 삭제하지 못했습니다.') + ' ' + msg);
                    }
                });
            }
        })

        let send_coin_info = { 'symbol': '', 'amount': 0, 'coin_name': '' };
        const send_message = function(msg) {
            let data = { 'token': getCookie('token') };
            data.userno = window.chat_target_idx;
            data.target_idx = window.chat_target_idx;
            data.symbol = send_coin_info.symbol;
            data.point_amount = send_coin_info.amount;
            data.message = msg||$('[name=message]:visible').val();
            if (send_coin_info.amount > 0) {
                $.post(API_URL + '/putMyInfo/send_point.php', data, function(r) {
                    if (r && r.success) {
                        $.post(API_URL + '/putChatMessage/', data, function(r) {
                            if (r && r.success) {
                                $('[name=message]:visible').val('');
                                send_coin_info = { 'symbol': '', 'amount': 0 };
                                get_new_message();
                            } else {
                                let msg = r.error && r.error.message ? r.error.message : '';
                                alert(__('메시지를 보내지 못했습니다.') + ' ' + msg);
                            }
                        });
                        // $('[name=btn-donate-'+data.point_amount+']').attr('disabled', true).attr('title', __('이미 사용하셨습니다.')); // 버튼 하나만 비활성화 시킬때 사용.
                        $('.support-coins .btn-coins').attr('disabled', true).attr('title', __('이미 사용하셨습니다.')); // 모든 버튼 비활성화 시킬때 사용.
                        $('[name=btn-close-popup]').click();
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('포인트를 보내지 못했습니다.') + ' ' + msg);
                    }
                });
            } else {
                $.post(API_URL + '/putChatMessage/', data, function(r) {
                    if (r && r.success) {
                        $('[name=message]:visible').val('');
                        send_coin_info = { 'symbol': '', 'amount': 0 };
                        get_new_message();
                    } else {
                        let msg = r.error && r.error.message ? r.error.message : '';
                        alert(__('메시지를 보내지 못했습니다.') + ' ' + msg);
                    }
                });
            }
        }
        $('[name="message"]').on('keyup keypress', function() {
            let msg = $(this).val().substr(0, 300);
            $('#msg_cnt').text(number_format(msg.length));
            $(this).val(msg);
        }).on('keydown', function(evt) {
            let msg = $(this).val(),
                msg_max = $('#msg_max').text(),
                keyCode = get_keycode(evt);
            // if(msg.length>=msg_max) {return false;}
            if (keyCode == 13) { $('[name=btn-write-message]:visible').click(); return false; }
        });
        $('[name=btn-write-message]').on('click', function() {
            let msg = $('[name="message"]:visible').val();
            if (!$.trim(msg) && send_coin_info.amount < 1) {
                alert(__('메시지를 작성해주세요.'));
                return false;
            }
            send_message(msg);
        });
        $('[name=btn-close-popup]').on('click', function() {
            $('.support-popup').addClass('hide');
            $('[name=message]:visible').css('padding-top', '10px');
            send_coin_info = { 'symbol': '', 'amount': 0, 'coin_name': '' };
        });
        $('.support-coins .btn-coins').on('click', function() {
            let amount = $(this).val(),
                symbol = $(this).attr('data-symbol');
            send_coin_info.symbol = symbol;
            send_coin_info.coin_name = Model.currency[symbol] ? Model.currency[symbol].name : symbol;
            send_coin_info.amount = amount;
            send_coin_info.amount_str = number_format(amount);
            $('[name=send_coin_icon]').removeClass(function(index, className) {
                return (className.match(/(^|\s)coin-\S+/g) || []).join(' ');
            }).addClass(get_coin_icon_class(amount));
            force_rander('send_coin_info', send_coin_info);
            $('.form-area .support-popup').removeClass('hide');
            $('[name=message]:visible').css('padding-top', $('.support-message').height() + 8);
        });
        $('.support-coins ul.content-pd1 li').on('click', function() {
            // if($(this).find('button').is(':disabled')) return;
            $(this).addClass('active').siblings('li').removeClass('active');
        });

        // 사진클릭시 메인뷰어에 넣기
        $('.photo-area .photo:gt(0)').on('click', function() {
            let src = $(this).attr('data-src');
            $('.photo-area .photo.main img').attr('src', src);
        })

        // 카테고리 영상 계속가져오기
        let page = 1;
        const cate_idx = getURLParameter('cate_idx');
        const userno = getURLParameter('userno');
        const sort = getURLParameter('sort');
        if(cate_idx) {
            $(document).on('scroll', function() {
                let videoBoxHeight = $('.item-grid li:eq(0)').height(); //, RowVideoCnt = $('.item-grid').width()/$('.item-grid li:eq(0)').width();
                if ($(this).scrollTop() + $(window).innerHeight() + videoBoxHeight*4 >= $('body').height() && !scroll_searching && !scroll_end) {
                    scroll_searching = true;
                    get_video(cate_idx=='full'?'':cate_idx, userno, '', ++page, sort, gen_video_htmnl);
                }
            })
        }

    }

    /**
     * 회원정보 보기 및 수정
     */
    const fn_user_info = function() {
        

        // check pin 확인.
        if (Model.check_pin < time() - 60 * 10) {
            window.location.href = "/check-pin.php";
        } else {
            // $(window).on('unload', function() {
            // if(window.location.href.indexOf('user-info.php')<0) {
            //     console.error('unload and reset Model.check_pin ');
            Model.check_pin = 0;
            //     }
            // });
        }

        // 폼 초기화
        $('#user_info form').each(function() {
            if ($(this).reset) { $(this).reset(); }
        });
        // 폼 필터
        $('#user_info input[type=password]').on('keypress', function(evt) {
            let keyCode = get_keycode(evt);
            let keyStr = get_str_by_keycode(keyCode);
            // console.log(keyCode, keyStr);
            // 8:backspace, 9:tab, 13:enter, 16:shift, 17:ctrl, 18:alt, 19:pause, 20:caps lock, 46: delete
            if (keyCode == '8' || keyCode == '46' || keyCode == '9' || keyCode == '13' || keyCode == '16' || keyCode == '17' || keyCode == '18' || keyCode == '19' || keyCode == '20') {
                if (keyCode == '8' || keyCode == '46') { // backspace , delete
                    $(this).prev('input[type=password]').select();
                }
                $(this).val('');
            } else {
                if (keyStr.match(/[^0-9]/)) { return false; }
                $(this).val(keyStr);
                $(this).next('input[type=password]').select();
                $('#user_info [name=userpw]').val($('#user_info [name=userpw1]').val() + '' + $('#user_info [name=userpw2]').val() + '' + $('#user_info [name=userpw3]').val() + '' + $('#user_info [name=userpw4]').val() + '' + $('#user_info [name=userpw5]').val() + '' + $('#user_info [name=userpw6]').val());
            }
            return false;
        }).on('keydown', function(evt) { // 크롬 keypress에서 backspace, space, delete 키 이벤트 작동 않되서 따로 적용합니다.
            let keyCode = get_keycode(evt);
            if (keyCode == '8') { // backspace
                $(this).prev('input[type=password]').select();
                $(this).val('');
                $('#user_info [name=userpw]').val($('#user_info [name=userpw1]').val() + '' + $('#user_info [name=userpw2]').val() + '' + $('#user_info [name=userpw3]').val() + '' + $('#user_info [name=userpw4]').val() + '' + $('#user_info [name=userpw5]').val() + '' + $('#user_info [name=userpw6]').val());
                return false;
            }
            if (keyCode == 13) { // enter
                // $('[name="btn-checkpin"]').trigger('click');
                $('.btn_group .btn:eq(0)').trigger('click');
            }
        }).on('click', function() {
            $(this).select();
        });
        // 애러 메시지 표시
        const display_error = function(str) {
                $('#user_info .error_txt').text(str);
            }
            // 핀번호 확인
        $('#user_info [name=btn-check-pin]').on('click', function() {
            let $input_userpw = $('#user_info [name=userpw]'),
                userpw = $input_userpw.val();
            if (!userpw) {
                display_error(__('핀번호를 입력해주세요.'));
                $input_userpw.focus();
                return false;
            } else {
                $('#user_info [name=userpw]').val(userpw);
            }
            display_error('');
            add_request_item('checkPin', { 'pin': userpw }, function(r) {
                if (r && r.success && r.payload) {
                    $('#check_pin').hide();
                    $('#edit_info').show();
                } else {
                    display_error(__('핀번호가 일치하지 않습니다!'));
                }
            });
            return false;
        });
        // 핸드폰번호 인증
        let end_time = 0;
        let sending = false;
        let confirmed_mobile = false,
            confirmed_mobile_number = '',
            confirmed_mobile_country_code = '',
            confirmed_country_code = '';
        $('[name=btn-request]').on('click', function() {
            if (sending) {
                alert(__('인증번호를 보내는중입니다.') + __('잠시만 기다려주세요.'));
                return false;
            }
            let mobile_number = ($('[name=mobile_number]').val() + '').trim(),
                mobile_calling_code = '82',
                mobile_country_code = 'KR'; //$('[name=mobile_country_code]').val();
            // if(mobile_country_code!='+82') {
            // 	alert(__('미지원 국가입니다. 대한민국을 선택해 주세요.')); return false;
            // }
            if (!mobile_number) {
                alert(__('핸드폰 번호를 입력해주세요'));
                return false;
            }
            mobile_number = mobile_calling_code + (mobile_number.replace(/^0/, ''));
            mobile_number = mobile_number.replace(/[^0-9]/g, '');
            $('[name=mobile_number]').attr('disabled', true);
            confirmed_mobile_number = mobile_number;
            confirmed_mobile_calling_code = mobile_calling_code;
            confirmed_mobile_country_code = mobile_country_code;
            sending = true;
            // firebase auth 사용하기.
            window.send_authmsg(mobile_number, function(r) {
                sending = false;
                if (r && r.success) {
                    end_time = Math.floor(new Date().getTime() / 1000) + 60 * 60;
                    display_remain_time(end_time, '#form_phone [name=min]', '#form_phone [name=sec]');
                    $('#form_phone [name=min]').parent().removeClass('hide');
                    $('[name=btn-confirm]').show();
                    $('[name=confirm_number]').show().focus();
                    alert(__('인증번호를 발송했습니다.'));
                } else {
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('인증메시지를 보내지 못했습니다.') + ' ' + msg);
                    $('#form_phone [name=min]').parent().addClass('hide');
                    $('[name=mobile_number1],[name=mobile_number2],[name=mobile_number3]').attr('disabled', false);
                }
            })
        });
        $('[name=btn-confirm]').on('click', function() {
            let confirm_number = $('[name=confirm_number]').val();
            if (end_time == 0) {
                alert(__('인증 요청을 해주세요.'));
                return false;
            }
            if (end_time - Math.floor(new Date().getTime() / 1000) <= 0) {
                $('[name=mobile_number1],[name=mobile_number2],[name=mobile_number3]').attr('disabled', false);
                alert(__('유효시간이 지났습니다. 다시 인증 요청을 해주세요.'));
                return false;
            }
            if (!confirm_number) {
                alert(__('인증번호를 입력해주세요.'));
                return false;
            }
            window.check_authcode(confirm_number, function(r) {
                if (r && r.success) {
                    confirmed_mobile = true;
                    $('[name=confirm_number]').attr('disabled', true);
                    alert(__('휴대폰번호가 인증되었습니다.'));
                } else {
                    $('[name=confirm_number]').attr('disabled', false);
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('올바른 인증번호를 입력해주세요.') + ' ' + msg);
                }
            });
        });
        // 프로필 이미지 변경
        $('[name="preview-profile_img"]').on('click', function() {
            $('#preview_img').trigger('click');
        })
        $('#preview_img').on('change', function() {
            view_image(this, $('[name="preview-profile_img"]'), 'stube');
        })
            // 회원정보 저정
        $('[name="btn-save_info"]').on('click', function() {
            // 이미지 업로드 후 s3 이미지url 설정
            if ($.trim($('#preview_img').val()) != '') {
                $form = $('[name="form-profile_img"]');
                $form.attr('enctype', 'multipart/form-data');
                var formData = new FormData($form[0]);
                formData.append("token", getCookie('token'));
                $.ajax({
                    'url': API_URL + '/upload/?',
                    'async': false,
                    'processData': false,
                    'contentType': false,
                    'data': formData,
                    'type': 'POST',
                    'success': function(r) {
                        if (r && r.success && r.payload) {
                            let file = r.payload[0];
                            if (file.url) {
                                $('[name=profile_img]').val(file.url);
                                readURL(self);
                            } else {
                                alert(__('파일을 저장하지 못했습니다.'));
                            }
                        } else {
                            let msg = r.error && r.error.message ? r.error.message : '';
                            alert(__('파일을 저장하지 못했습니다.') + ' ' + msg)
                        }
                    },
                    'fail': function() {
                        alert(__('파일을 업로드하지 못했습니다.'));
                    }
                });
                if (!$('[name=profile_img]').val()) { return; }
            }

            // 회원정보 저장.
            save_my_info(function(r) {
                if (r && r.payload) {
                    alert(__('저장했습니다.'));
                    // window.location.reload();
                } else {
                    let m = r.error && r.error.message ? r.error.message : '';
                    alert(__('저장하지 못했습니다.') + ' ' + m);
                }
            });
        });

        // 주매뉴(매인카테고리) 선택시 부매뉴 가져와 셋팅하기
        $('[name=default_cate_idx]').on('change', function(){
            let cate_idx = $(this).val();
            add_request_item('getVideo/cate_list.php', { 'parent_idx': cate_idx }, function(r) {
                if (r && r.success && r.payload) {
                    let cate2 = r.payload;
                    let opt = ['<option value="" readonly>부매뉴를 선택해주세요.</option>'];
                    let empty = ['<option value="" readonly>부매뉴가 없습니다.</option>'];
                    if(cate2 && cate2.length>0) {
                        for( i in cate2 ) {
                            opt.push('<option value="'+cate2[i].idx+'">'+cate2[i].cate_name+'</option>')
                        }
                    } else {
                        opt = empty;
                    }
                    $('[name=second_cate_idx]').find('option').remove();//.not('[readonly]')
                    $('[name=second_cate_idx]').append(opt.join(''));
                }
            });
        });

    }

    const fn_user_edit = function() {
        
        $('#check_pin').show();
        $('#edit_info').hide();

        // 폼 초기화
        $('#user_info form').each(function() { if ($(this).reset) { $(this).reset(); } });
        // 폼 필터
        $('#user_info input[type=password]').on('keypress', function(evt) {
            let keyCode = get_keycode(evt);
            let keyStr = get_str_by_keycode(keyCode);
            // console.log(keyCode, keyStr);
            // 8:backspace, 9:tab, 13:enter, 16:shift, 17:ctrl, 18:alt, 19:pause, 20:caps lock, 46: delete
            if (keyCode == '8' || keyCode == '46' || keyCode == '9' || keyCode == '13' || keyCode == '16' || keyCode == '17' || keyCode == '18' || keyCode == '19' || keyCode == '20') {
                if (keyCode == '8' || keyCode == '46') { // backspace , delete
                    $(this).prev('input[type=password]').select();
                }
                $(this).val('');
            } else {
                if (keyStr.match(/[^0-9]/)) { return false; }
                $(this).val(keyStr);
                $(this).next('input[type=password]').select();
                $('#user_info [name=userpw]').val($('#user_info [name=userpw1]').val() + '' + $('#user_info [name=userpw2]').val() + '' + $('#user_info [name=userpw3]').val() + '' + $('#user_info [name=userpw4]').val() + '' + $('#user_info [name=userpw5]').val() + '' + $('#user_info [name=userpw6]').val());
            }
            return false;
        }).on('keydown', function(evt) { // 크롬 keypress에서 backspace, space, delete 키 이벤트 작동 않되서 따로 적용합니다.
            let keyCode = get_keycode(evt);
            if (keyCode == '8') { // backspace
                $(this).prev('input[type=password]').select();
                $(this).val('');
                $('#check_pin [name=userpw]').val($('#check_pin [name=userpw1]').val() + '' + $('#check_pin [name=userpw2]').val() + '' + $('#check_pin [name=userpw3]').val() + '' + $('#check_pin [name=userpw4]').val() + '' + $('#check_pin [name=userpw5]').val() + '' + $('#check_pin [name=userpw6]').val());
                return false;
            }
            if (keyCode == 13) { // enter
                $('.btn_group .btn:eq(0)').trigger('click');
            }
        }).on('click', function() {
            $(this).select();
        });
        // 애러 메시지 표시
        const display_error = function(str) {
                $('#user_info .error_txt').text(str);
            }
            // 핀번호 확인
        $('#user_info [name=btn-check-pin]').on('click', function() {
            let $input_userpw = $('#user_info [name=userpw]'),
                userpw = $input_userpw.val();
            if (!userpw) {
                display_error(__('핀번호를 입력해주세요.'));
                $input_userpw.focus();
                return false;
            } else {
                $('#user_info [name=userpw]').val(userpw);
            }
            display_error('');
            add_request_item('checkPin', { 'pin': userpw }, function(r) {
                if (r && r.success && r.payload) {
                    $('#check_pin').hide();
                    $('#edit_info').show();
                } else {
                    display_error(__('핀번호가 일치하지 않습니다!'));
                }
            });
            return false;
        });
        // 핸드폰번호 인증
        let end_time = 0;
        let sending = false;
        let confirmed_mobile = false,
            confirmed_mobile_number = '',
            confirmed_mobile_country_code = '',
            confirmed_country_code = '';
        $('[name=btn-request]').on('click', function() {
            if (sending) {
                alert(__('인증번호를 보내는중입니다.') + __('잠시만 기다려주세요.'));
                return false;
            }
            let mobile_number = ($('[name=mobile_number]').val() + '').trim(),
                mobile_calling_code = '82',
                mobile_country_code = 'KR'; //$('[name=mobile_country_code]').val();
            // if(mobile_country_code!='+82') {
            // 	alert(__('미지원 국가입니다. 대한민국을 선택해 주세요.')); return false;
            // }
            if (!mobile_number) {
                alert(__('핸드폰 번호를 입력해주세요'));
                return false;
            }
            mobile_number = mobile_calling_code + (mobile_number.replace(/^0/, ''));
            mobile_number = mobile_number.replace(/[^0-9]/g, '');
            $('[name=mobile_number]').attr('disabled', true);
            confirmed_mobile_number = mobile_number;
            confirmed_mobile_calling_code = mobile_calling_code;
            confirmed_mobile_country_code = mobile_country_code;
            sending = true;
            // firebase auth 사용하기.
            window.send_authmsg(mobile_number, function(r) {
                sending = false;
                if (r && r.success) {
                    end_time = Math.floor(new Date().getTime() / 1000) + 60 * 60;
                    display_remain_time(end_time, '#form_phone [name=min]', '#form_phone [name=sec]');
                    $('#form_phone [name=min]').parent().removeClass('hide');
                    $('[name=btn-confirm]').show();
                    $('[name=confirm_number]').show().focus();
                    alert(__('인증번호를 발송했습니다.'));
                } else {
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('인증메시지를 보내지 못했습니다.') + ' ' + msg);
                    $('#form_phone [name=min]').parent().addClass('hide');
                    $('[name=mobile_number1],[name=mobile_number2],[name=mobile_number3]').attr('disabled', false);
                }
            })
        });
        $('[name=btn-confirm]').on('click', function() {
            let confirm_number = $('[name=confirm_number]').val();
            if (end_time == 0) {
                alert(__('인증 요청을 해주세요.'));
                return false;
            }
            if (end_time - Math.floor(new Date().getTime() / 1000) <= 0) {
                $('[name=mobile_number1],[name=mobile_number2],[name=mobile_number3]').attr('disabled', false);
                alert(__('유효시간이 지났습니다. 다시 인증 요청을 해주세요.'));
                return false;
            }
            if (!confirm_number) {
                alert(__('인증번호를 입력해주세요.'));
                return false;
            }
            window.check_authcode(confirm_number, function(r) {
                if (r && r.success) {
                    confirmed_mobile = true;
                    $('[name=confirm_number]').attr('disabled', true);
                    alert(__('휴대폰번호가 인증되었습니다.'));
                } else {
                    $('[name=confirm_number]').attr('disabled', false);
                    let msg = r.error && r.error.message ? r.error.message : '';
                    alert(__('올바른 인증번호를 입력해주세요.') + ' ' + msg);
                }
            });
        });

    }

    const fn_cate = function() {
        
        add_event_click_left_menu_tab();
        let page = 1;
        const cate_idx = getURLParameter('cate_idx');
        const userno = getURLParameter('userno');
        const sort = getURLParameter('sort');

        $(document).on('scroll', function() {
            let videoBoxHeight = $('.item-grid li:eq(0)').height(); //, RowVideoCnt = $('.item-grid').width()/$('.item-grid li:eq(0)').width();
            // console.log($(this).scrollTop(), $('body').height(), $(this).innerHeight(), $(window).innerHeight(),
            //     $(this).scrollTop() + $('body').height() >= $(this).innerHeight() - 400,
            //     $(this).scrollTop() + $(window).innerHeight() + videoBoxHeight*4 >= $('body').height() // 마지막 4줄 비디오 에서 다음것 가져오기
            // );
            if ($(this).scrollTop() + $(window).innerHeight() + videoBoxHeight*4 >= $('body').height() && !scroll_searching && !scroll_end) {
                scroll_searching = true;
                get_video(cate_idx, userno, '', ++page, sort, gen_video_htmnl);
            }
        })

    }

    const fn_search = function() {
        
        let page = 1;
        const cate_idx = getURLParameter('cate_idx');
        const keyword = getURLParameter('keyword');
        const userno = getURLParameter('userno');
        const sort = getURLParameter('sort');

        $(document).on('scroll', function() {
            let videoBoxHeight = $('.item-grid li:eq(0)').height(); //, RowVideoCnt = $('.item-grid').width()/$('.item-grid li:eq(0)').width();
            if ($(this).scrollTop() + $(window).innerHeight() + videoBoxHeight*4 >= $('body').height() && !scroll_searching && !scroll_end) {
                scroll_searching = true;
                get_video(cate_idx, userno, keyword, ++page, sort, gen_video_htmnl);
            }
        })

    }

    const fn_pay = function(){
        $('#pay').on('click', '.btn.btn-method', function(){
            let method = $(this).attr('data-method');
            $('.box_bank').hide();
            switch(method) {
                case 'bank' : $('.box_bank').show(); break;
                default: alert('준비중입니다.');
            }
            return false;
        });
        $('#pay').on('click', '.btn.btn-pay', function(){
            let method = $(this).attr('data-method'),
                goods_no = $('#pay [name=goods_no]').val(),
                price = $('#pay [name=price]').val(),
                amount = $('#pay [name=amount]').val(),
                sell_symbol = $('#pay [name=sell_symbol]').val(),
                item_symbol = $('#pay [name=item_symbol]').val()
            ;
            switch(method) {
                case 'bank' : fn_pay_bank(goods_no, price, sell_symbol, amount, item_symbol); break;
            }
            return false;
        });
    }
    const fn_pay_bank = function(goods_no, pay_amount, pay_symbol, charge_amount, charge_symbol) {
        let deposit_name = $('#pay [name=deposit_name]').val(),
        address = $('#pay [name=address]').val()
            ;
        if(!deposit_name) {
            alert('입금자명을 입력해주세요.'); $('#pay [name=deposit_name]').focus(); return ;
        }
        $.post(API_URL+'/charge/', {'goods_no':goods_no, 'pay_amount':pay_amount, 'pay_symbol':pay_symbol, 'charge_amount':charge_amount, 'charge_symbol':charge_symbol, 'app_id':SERVICE_NAME, 'service_name':SERVICE_NAME, 'pay_method':'bank', 'deposit_name':deposit_name, 'address':address, 'token':getCookie('token')}, function(r){
            // console.log(r);
            if(r && r.success) {
                alert(__('등록 되었습니다.')+'<br> '+__('입금주소로 결제금액을 입금해주세요.'));
            } else {
                let m = r.error && r.error.message ? r.error.message : '';
                alert('계좌이체를 등록하지 못했습니다.'+ m);
            }
        }, 'json');
    }

    /* 공통 기능 ----------------------------------------------------------------------------------- */

    const reset_logedin_status = function () {
        const user_info = Model.user_info;
        console.log('user_info:', user_info);
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


    // php 파일용 컨트롤러 실행
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

    /* 서버 값 가져오기 ----------------------------------------------------------------------------------- */

    /**
     * 회원정보 가져오기
     */
    const get_user_info = function () {
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
    get_user_info();

    /**
     * 회원지갑(잔액)정보 가져오기
     */
    const get_user_wallet = function() {
        add_request_item('getBalance', { 'token': getCookie('token') }, function(r) {
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
    const get_currency = function() {
        add_request_item('getCurrency', {}, function(r) {
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
                            'symbol_image': ''
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
    get_currency();


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