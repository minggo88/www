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

const API = {
    BASE_URL: 'https://api.dev.kkikda.com/v1.0',
    sendEmailConfirmCode: (email, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/sendConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token,
                media: 'email',
                email_address: email,
                lang: 'ko',
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            },
            error: () => {

            },

        })
    },
    sendMobileConfirmCode: (mobile, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/sendConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token,
                media: 'mobile',
                mobile_number: mobile,
                mobile_country_code: 'KR',
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    checkEmailConfirmCode: (email, code, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token,
                media: 'email',
                email_address: email,
                confirm_number: code,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    checkMobileConfirmCode: (mobile, code, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token,
                media: 'mobile',
                mobile_number: mobile,
                confirm_number: code,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    join: (email, password, pin, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/socialJoin/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                social_id: email,
                social_name: 'email',
                email: email,
                userpw: password,
                pin: pin,
                os: os,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    login: (email, password, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/socialLogin/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                social_id: email,
                social_name: 'email',
                userpw: password,
                os: os,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }

        })
    },
    findPW: (address, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/findinfo/findpw.php`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                address: address,
                address_type: 'email',
                lang: 'ko',
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
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
    checkPin: (pin, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkPin/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                pin: pin,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    putMyInfo: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/putMyInfo/`,
            type: 'POST',
            dataType: 'JSON',
            data: $.extend({}, data, {
                token: window.localStorage.token,
            }),
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getTransactionList: (symbol, page = 1, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getTransactionList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                symbol: symbol,
                page: page,
                rows: 100,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getMyRevenueStatus: (page = 1, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getMyRevenueStatus/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                symbol: ',',
                exchange: 'KRW',
                page: page,
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    getBalance: (symbol = 'ALL', exchange = null, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getBalance/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                symbol: symbol,
                exchange: exchange,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getBBSList: (bbscode, page = 1, rows = 10, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getBBSList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                bbscode: bbscode,
                page: page,
                rows: rows,
                lang: 'ko',
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getBBSView: (idx, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getBBSView/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                idx: idx,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getM2MList: (page = 1, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getM2MList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                page: page,
                rows: 10,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    putM2M: (subject, contents, idx = null, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/putM2M/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                subject: subject,
                contents: contents,
                idx: idx,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getCurrency: (symbol = null, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getCurrency/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                symbol: symbol
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    getChartData: (symbol, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getChartData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                symbol: symbol
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getCountry: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getCountry/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
            },
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