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
     * 인증메일 보내기
     * @param {*} email 
     * @param {*} callback 
     */
    sendEmailConfirmCode: (email, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/sendConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                media: 'email',
                email_address: email,
                lang: window.localStorage.locale,
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
    /**
     * 인증문자 보내기
     * #TODO 국가코드별로 AJAX 요청을 다르게 해야됨
     * @param {*} mobile 
     * @param {*} callback 
     */
    sendMobileConfirmCode: (countryCode, mobile, callback = null) => {
        const asYouType = new libphonenumber.AsYouType()
        asYouType.input(countryCode + '-' + mobile)

        $.ajax({
            url: `${API.BASE_URL}/sendConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                media: 'mobile',
                mobile_number: asYouType.getNumber().number,
                mobile_country_code: asYouType.getNumber().country,
                lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * 가입 확인
     * @param {*} media 기기종류. mobile:핸드폰, email: 이메일, userid: 일반 아이디
     * @param {*} ids 가입여부 확인하고 싶은아이디들. 콤마로 구분
     * @param {*} callback 
     */
    checkJoin: (media, ids, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkJoin/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                'token': window.localStorage.token,
                'media': media,
                'ids': ids,
                'lang': 'en', // status 값 영어로만 받기 위함
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * 인증메일 확인
     * @param {*} email 이메일 주소
     * @param {*} code 인증코드
     * @param {*} callback 
     */
    checkEmailConfirmCode: (email, code, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
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
    /**
     * 인증문자 확인
     * @param {*} mobile 
     * @param {*} code 
     * @param {*} callback 
     */
    checkMobileConfirmCode: (mobile, code, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
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
    /**
     * 회원가입
     * @param {*} data 
     * @param {*} callback 
     */
    join: (data, callback = null) => {
        data = $.extend(data, {
            token: window.localStorage.token, lang: window.localStorage.locale,
            os: os,
        })
        $.ajax({
            url: `${API.BASE_URL}/socialJoin/`,
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
     * 비밀번호 찾기
     * @param {*} address 
     * @param {*} callback 
     */
    findPW: (address, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/findinfo/findpw.php`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                address: address,
                address_type: 'email',
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * 비밀번호 찾기
     * @param {*} address
     * @param {*} callback
     */
    findPinNumber: (address, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/findinfo/findpinnumber.php`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                address: address,
                address_type: 'email',
            },
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
     * PIN코드 확인
     * @param {*} pin 
     * @param {*} callback 
     */
    checkPin: (pin, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkPin/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                pin: pin,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /**
     * 회원정보 수정
     * @param {*} data 
     * @param {*} callback 
     */
    putMyInfo: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/putMyInfo/`,
            type: 'POST',
            dataType: 'JSON',
            data: $.extend({}, data, {
                token: window.localStorage.token, lang: window.localStorage.locale,
            }),
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    /***
     * 계좌정보확인
     */
    checkAccount: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/checkAccount/`,
            type: 'POST',
            dataType: 'JSON',
            data: $.extend({}, data, {
                token: window.localStorage.token, lang: window.localStorage.locale,
            }),
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            },error: (jqXHR) => {
                console.error(jqXHR)
            }
        })
    },
    getTradingList: (symbol, exchange = null, page = 1, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getTradingList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                symbol: symbol,
                exchange: exchange,
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
    getTransactionList: (symbol, page = 1, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getTransactionList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
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
    /**
     * 회원정보 수정
     * @param {*} callback 
     */
    getMyInfo: (callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getMyInfo/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    getMyRevenueStatus: (page = 1, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getMyRevenueStatus/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
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
                token: window.localStorage.token, lang: window.localStorage.locale,
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
    getTradeBalance: (symbol = 'ALL', exchange = null, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getTradeBalance/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
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
                token: window.localStorage.token, lang: window.localStorage.locale,
                bbscode: bbscode,
                page: page,
                rows: rows,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getFaqList: (page = 1, rows = 20, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getFaqList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                faqcode: '',
                page: page,
                rows: rows,
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
                token: window.localStorage.token, lang: window.localStorage.locale,
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
                token: window.localStorage.token, lang: window.localStorage.locale,
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
                token: window.localStorage.token, lang: window.localStorage.locale,
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
    getCurrency: (symbol = null, callback) => {
        // console.log( `${API.BASE_URL}/getCurrency/`)
        $.ajax({
            url: `${API.BASE_URL}/getCurrency/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                symbol: symbol
            },
            success: (resp) => {
                callback(resp)
            },
            error: (jqXHR) => {
                console.error(jqXHR)
            }
        })
    },
    getSearchCurrency: (symbol = null, callback) => {
        // console.log( `${API.BASE_URL}/getCurrency/`)
        $.ajax({
            url: `${API.BASE_URL}/getSearchCurrency/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                symbol: symbol
            },
            success: (resp) => {
                callback(resp)
            },
            error: (jqXHR) => {
                console.error(jqXHR)
            }
        })
    },
    /**
     * 거래소 차트데이터
     * @param {*} symbol 
     * @param {*} callback 
     */
    getChartData: (symbol, exchange='KRW', period = '1d', goods_grade, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getChartData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                symbol: symbol, exchange: exchange,
                period: period, goods_grade: goods_grade
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    /**
     * 지원하는 언어목록
     * @param {*} callback 
     */
    getLanguageList: (callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getLanguageList/`,
            type: 'POST',
            success: (resp) => {
                callback(resp)
            }
        })
    },
    setLanguage: (code, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/setLanguage/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                code: code,
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
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    getCurrentCountryInfo: (ip, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getCurrentCountryInfo/`,
            type: 'POST',
            data: {'ip': ip, lang: window.localStorage.locale},
            dataType: 'JSON',
            success: (resp) => {
                callback(resp)
            }
        })
    },
    /**
     * 구매하기
     * @param {*} data 
     * @param {*} callback 
     */
    buy: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/buy/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                ...data,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    getQuoteList: (symbol, exchange, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getQuoteList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                symbol: symbol,
                exchange: exchange,
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    validateAddress: (symbol, address, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/validateAddress/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                symbol: symbol,
                address: address,
                lang: window.localStorage.locale,
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    getSpotPrice: (symbol, exchange, goods_grade, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getSpotPrice/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                symbol: symbol,
                exchange: exchange,
                lang: window.localStorage.locale,
                goods_grade: goods_grade
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    sell: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/sell/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                ...data,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    sellDirect: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/sell_direct/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                ...data,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    buyDirect: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/buy_direct/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                ...data,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    request: (item, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/request/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                item: item,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    requestSync: async (item, callback = null) => {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `${API.BASE_URL}/request/`,
                type: 'POST',
                dataType: 'JSON',
                data: {
                    item: item,
                    token: window.localStorage.token, lang: window.localStorage.locale,
                },
                success: (resp) => {
                    resolve(resp)
                },
                error: (e) => {
                    reject(e)
                }
            })
        }).then((resp) => {
            const payLoadList = []

            resp.payload.map((payload) => {
                payLoadList.push(JSON.parse(payload.data))
            })
            if(callback) {
                callback(payLoadList)
            }
        })

    },
    getOrderList: (symbol, tradingType, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getOrderList/?symbol=${symbol}&trading_type=${tradingType}`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                symbol: symbol,
                trading_type: tradingType,
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },

    getMyOrderList: (symbol, sdate, edate, tradingType, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getMyOrderList/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                lang: window.localStorage.locale,
                symbol : symbol,
                exchange : 'KRW',
                return_type : 'datatable',
                status : 'all',
                start_date : sdate,
                end_date : edate,
			    trading_type : '',
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },

    getAuctionGoodsInfo: (goods_idx, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/getAuction/auction_goods_info.php`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                goods_idx: goods_idx,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                callback(resp)
            }
        })
    },
    createNewAddress: (symbol, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/createNewAddress/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                symbol: symbol,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },

    orderCancel: (symbol, orderid, goods_grade, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/cancel/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                symbol: symbol,
                orderid: orderid,
                goods_grade: goods_grade,
                token: window.localStorage.token, lang: window.localStorage.locale,
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },
    //상품반출
    takeOutItem: (data, callback) => {
        $.ajax({
            url: `${API.BASE_URL}/takeOutItem/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                dataArray: data,
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
     * 반출신청메일 보내기
     * @param {*} email 
     * @param {*} message
     * @param {*} callback 
     */
    takeOutEmailConfirmCode: (email, message, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/takeOutConfirmCode/`,
            type: 'POST',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                media: 'email',
                message_text: message,
                email_address: email,
                lang: window.localStorage.locale,
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
    //takeoutitem check
    getTakeOutItem: (symbol = 'ALL', exchange = null, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getTakeOutItem/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                symbol: symbol,
                exchange: exchange,
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
