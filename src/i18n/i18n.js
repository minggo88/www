
(function () {
    const i18n_key = 'i189n';
    const in_array = function(val, array) {
        for (i in array) {
            if (array[i] == val) return true;
        }
        return false;
    }
    // const support_lang = ['en', 'zh', 'ko'],
    const support_lang = ['ko'], // 우선 한국어만 지원
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

    const reset_key = function (str) {
        str = str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/gi, '');
        str = str.replace("\r\n", '\\'+'n'); 
        str = str.replace("\n", '\\'+'n'); 
        str = str.replace('"', '\"');
        return str;
    }

    const translate = function (p_lang_data) {
        lang_data = p_lang_data ? p_lang_data : lang_data;
        $('[data-i18n]').each(function () { 
            const str = reset_key($(this).html());
            const trstr = lang_data[str] ? lang_data[str] : '';
            if (trstr) {
                $(this).html(trstr);
            }
        })
        $('[placeholder]').each(function () { 
            const str = reset_key($(this).attr('placeholder'));
            const trstr = lang_data[str] ? lang_data[str] : '';
            if (trstr) {
                $(this).attr('placeholder',trstr);
            }
        })
        $('[alt]').each(function () { 
            const str = reset_key($(this).attr('alt'));
            const trstr = lang_data[str] ? lang_data[str] : '';
            if (trstr) {
                $(this).attr('placeholder',trstr);
            }
        })
        $('[title]').each(function () { 
            const str = reset_key($(this).attr('title'));
            const trstr = lang_data[str] ? lang_data[str] : '';
            if (trstr) {
                $(this).attr('placeholder',trstr);
            }
        })
    }
    window.translate = translate;

    const get_lang_data = function(callback) {
        let cache_time = Math.ceil(((new Date().getTime()) / 1000) / (60 * 60 * 1));
        let data_file = './i18n/' + lang + '/LC_MESSAGES/WWW.json?v=' + cache_time;
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
    if (!lang_data.gentime || lang_data.gentime < time() - 60 * 15) {
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



// (() => {
//     const in_array = (val, array) => {
//         for (i in array) {
//             if (array[i] == val) return true;
//         }
//         return false;
//     }
//     const support_lang = ['en', 'es', 'zh', 'ja', 'vi', 'th'],
// 		default_lang = 'en';
//     var lang_data = {},
//         lang = navigator.language || navigator.userLanguage,
//         cookielang = getCookie('lang');
//     lang = lang.substr(0, 2);
// 	lang = in_array(lang, support_lang) ? lang : default_lang;
//     lang = cookielang && cookielang !== lang && in_array(cookielang, support_lang) ? cookielang : lang;
//     if (cookielang !== lang) {
//         setCookie('lang', lang, 365);
// 	}
// 	if (window.lang !== lang) {
// 		window.lang = lang;
// 	}

//     const get_lang_data = (callback) => {

// 		let cache_time = Math.ceil(((new Date().getTime())/1000)/(60*60*1));
//         let data_file = '/assets/i18n/' + lang + '/LC_MESSAGES/WWW.json?v='+cache_time;
//         httpRequest = new XMLHttpRequest();
//         if (httpRequest) {
//             httpRequest.onreadystatechange = function() {
//                 if (httpRequest.readyState === XMLHttpRequest.DONE) {
//                     if (httpRequest.status === 200) {
//                         r = JSON.parse(httpRequest.responseText);
// 						lang_data = r.data;
//                     } else {
//                         console.error('Failed to get translation data.');
// 					}
// 					if(callback) {callback();}
//                 }
//             };
//             httpRequest.open('GET', data_file);
//             httpRequest.send();
//         }
// 	}
// 	get_lang_data();
// 	window.__ = (key) => {
// 		return lang_data[key] ? lang_data[key] : key;
// 	};
// 	window._e = (key) => {
// 		document.write(__(key));
// 	};
// 	window._c = (l, callback) => {
// 		if(!in_array(l, support_lang)) {l=default_lang;}
// 		if(l!=lang) {
// 			lang = l;
// 			setCookie('lang', l, 365);
// 			get_lang_data(callback);
// 			// window.location.reload();
// 		}
// 	}

// })();