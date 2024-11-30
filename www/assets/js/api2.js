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
    },

    /**
     * getData
     * @param {*} callback 
     */
    getSmsData: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getSmsData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },

    /**
     * getData
     * @param {*} callback 
     */
    getManagerData: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getManagerData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * insertData
     * @param {*} callback 
     * 
     */
    addManager: (m_name, m_call, m_id, m_pw, m_use, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/addManager/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                add_id: m_id,
                add_name: m_name,
                add_pw: m_pw,
                add_call: m_call,
                add_use: m_use,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * updateData
     * @param {*} callback 
     * 
     */
    updateManager: (m_index, m_name, m_call, m_id, m_pw, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/updateManager/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                up_index: m_index,
                up_id: m_id,
                up_name: m_name,
                up_pw: m_pw,
                up_call: m_call
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * updateManagerUse
     * @param {*} callback 
     * 
     */
    updateManagerUse: (m_index, m_use, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/updateManagerUse/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                up_index: m_index,
                up_use: m_use
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * getCustomerData
     * @param {*} callback 
     */
    getCustomerData: (s_name, s_call, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getCustomerData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                c_name: s_name,
                c_call: s_call,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * insertData
     * @param {*} callback 
     * 
     */
    addCustomer: (c_name, c_call, c_address1, c_address2, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/addCustomer/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                add_name: c_name,
                add_call: c_call,
                add_address1: c_address1,
                add_address2: c_address2
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * upCustomerData
     * @param {*} callback 
     * 
     */
    upCustomerData: (c_index, c_name, c_call, c_address1, c_address2, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/upCustomerData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                up_index: c_index,
                up_name: c_name,
                up_call: c_call,
                up_address1: c_address1,
                up_address2: c_address2
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    
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
