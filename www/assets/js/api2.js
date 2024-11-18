const API = {    
    BASE_URL: function() {
        // let API_URL = "//api." + (window.location.host.replace('www.', '')) + "/v1.0";
        let API_URL = "https://api.assettea.com/v1.0"; // for live
        if (window.location.host.indexOf('loc.') !== -1 || window.location.host.indexOf('localhost') !== -1) {
            API_URL = "http://api.loc.kkikda.com/v1.0"
        }
        if (window.location.host.indexOf('dev.') !== -1) {
            API_URL = "https://api.dev.assettea.com/v1.0"
        }
        if (window.location.host.indexOf('127.0.0.1') !== -1) {
            API_URL = "https://api.dev.assettea.com/v1.0"
        }
        return API_URL; // 'https://api.dev.assettea.com/v1.0'
    }(),

    /**
     * 로그인
     * @param {*} email ID
     * @param {*} password 비밀번호 
     * @param {*} callback CALLBACK
     */
    login: (email, password, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/socialLogin/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                social_id: email,
                social_name: 'email',
                userpw: password,
                os: os,
            },
            success: (resp) => {
                // 로그인 성공 시 토큰 저장
                if(resp.success) {
                    window.localStorage.token = resp.payload.token
                }

                // 콜백처리
                if(callback) {
                    callback(resp)
                }
            }

        })
    },
    /**
     * 로그아웃
     * @param {*} callback 로그아웃 후 실행할 콜백함수
     */
    logout: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/logout/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }

        })
    },

    /**
     * sms 데이터
     * @param {*} data 
     * @param {*} callback 
     */
    getsms: (data, callback = null) => {
        data = $.extend(data, {
            
        })
        $.ajax({
            url: `${API.BASE_URL}/getSms/`,
            type: 'POST',
            dataType: 'JSON',
            data: data,
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    
    /**
     * 토큰생성
     * @param {*} callback 
     */
    getToken: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getToken/`,
            type: 'POST',
            dataType: 'JSON',
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    }
}

if(!window.localStorage.token) {
    API.getToken((resp) => {
        window.localStorage.token = resp.payload.token
    })
}

$.fn.serializeObject = function () {
    let result = {};
    $.each(this.serializeArray(), function (i, element) {
        let node = result[element.name];
        if (typeof node !== 'undefined' && node !== null) {
            if (jQuery.isArray(node)) {
                node.push(element.value);
            } else {
                result[element.name] = [node, element.value];
            }
        } else {
            result[element.name] = element.value;
        }
    });
    $.each(this.find('input[type=checkbox]'), function (i, element) {
        result[element.name] = $(element).prop('checked');
    });
    return result;
}
