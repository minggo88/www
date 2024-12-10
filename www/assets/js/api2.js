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
     * updaeCustomer
     * @param {*} callback 
     * 
     */
    updateCustomer: (c_index, c_name, c_call, c_address1, c_address2, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/updateCustomer/`,
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
    /**
     * getItemtypeData
     * @param {*} callback 
     */
    getItemTypeData: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getItemTypeData/`,
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
     * getItemData
     * @param {*} callback 
     */
    getItemData: (item_type_num, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getItemData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                type_num: item_type_num,
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
     * ysCompleteOrder
     * @param {*} callback 
     * 
     */
    ysCompleteOrder: (c_index, c_name, c_call, c_address1, c_address2, c_order, c_ordernum, sendtext, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/ysCompleteOrder/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token, lang: window.localStorage.locale,
                c_index: c_index,
                c_name: c_name,
                c_call: c_call,
                c_address1: c_address1,
                c_address2: c_address2,
                c_order: c_order,
                c_ordernum: c_ordernum,
                c_sendtext: sendtext                
            },
            success: (resp) => {
                if(callback) {
                    callback(resp)
                }
            }
        })
    },

    /**
     * ysSMSSend - 한글이 안된다??
     * @param {*} callback 
     */
    ysSMSSend: (num, text, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/ysSMSSend/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                call: num,
                message: text,
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
     * addItemTypeData
     * @param {*} callback 
     */
    addItemTypeData: (text, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/addItemTypeData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                up_text: text,
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
     * addItemData
     * @param {*} callback 
     */
    addItemData: (index, text, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/addItemData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                add_index: index,
                add_text: text,
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
     * upItemTypeData
     * @param {*} callback 
     */
    upItemTypeData: (select_index, change_text, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/upItemTypeData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                c_index: select_index,
                c_text: change_text,
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
     * upItemData
     * @param {*} callback 
     */
    upItemData: (select_index, change_text, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/upItemData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                c_index: select_index,
                c_text: change_text,
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
     * deleteItem2
     * @param {*} callback 
     */
    deleteItemData: (select_index, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/deleteItemData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                c_index: select_index,
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
     * getEndTextData
     * @param {*} callback 
     */
    getEndTextData: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getEndTextData/`,
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
     * addEndTextData
     * @param {*} callback 
     */
    addEndTextData: (text, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/addEndTextData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                up_text: text,
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
     * upItemData
     * @param {*} callback 
     */
    upEndTextData: (select_index, change_text, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/upEndTextData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                c_index: select_index,
                c_text: change_text,
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
     * deleteEndTextData
     * @param {*} callback 
     */
    deleteEndTextData: (select_index, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/deleteEndTextData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                c_index: select_index,
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
     * getSmsDataDetail
     * @param {*} callback 
     */
    getSmsDetailData: (num, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getSmsDetailData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                s_index: num,
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
     * upSMSData
     * @param {*} callback 
     */
    upSMSStateData: (state, index, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/upSMSStateData/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                c_index: index,
                c_state: state,
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
     * addOrder
     * @param {*} callback 
     */
    addOrder: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/addOrder/`,
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
     * upOrder
     * @param {*} callback 
     */
    upOrder: (data, callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/upOrder/`,
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
     * getOrder
     * @param {*} callback 
     */
    getOrder: (callback = null) => {
        $.ajax({
            url: `${API.BASE_URL}/getOrder/`,
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
