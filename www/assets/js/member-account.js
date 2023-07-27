
window.onload = function() {
    setTimeout(function() {
        fn_member_account();    
    }, 200);
    
};

$(document).ready(function() {
    
});

const fn_member_account = function () {
    check_login();
    request_user_info();
    Model.form = clone(Model.user_info);
    
    if (Model.user_info.user_join_type === "B") {
        document.getElementById("join_type").selectedIndex = 1; // 두 번째 option을 선택 (인덱스는 0부터 시작하므로 1은 두 번째 option을 의미)
    }else{
        document.getElementById("join_type").selectedIndex = 2;
    }
    
    //자료깨짐으로 인한 생략
    //document.getElementById("join_user_passport").value = Model.user_info.user_info_A;
    //document.getElementById("join_user_number_A").value = Model.user_info.user_info_A + '' + Model.user_info.user_info_B;
    if(Model.user_info.user_join_type == "B"){
        document.getElementById("join_user_number_A").style.display = 'none';
        //document.getElementById("join_user_number_B").style.display = 'none';
        document.getElementById("join_user_passport").style.display = 'block';
        document.getElementById("join_user_number_A").value = '';
        //document.getElementById("join_user_number_B").value = '';
        $("#join_user_passport").show();
        $("#join_user_number_A").hide();
    }else{
        document.getElementById("join_user_number_A").style.display = 'block';
        //document.getElementById("join_user_number_B").style.display = 'none';
        document.getElementById("join_user_passport").style.display = 'none';
        document.getElementById("join_user_passport").value = '';
        $("#join_user_number_A").show();
        $("#join_user_passport").hide();
    }
    
    // force_rander('user_info', Model.user_info);
    
    $('#member-account').on('submit', function () {
        //계정 정보 주소 수정
        if(check_num<1){
            $('.btn.btn--check').hide();
            $('.btn.btn--red').show();
            $('.dropdown').attr("disabled", false);
            $('#city').attr("disabled", false);
            $('#address_a').attr("disabled", false);
            $('#address_b').attr("disabled", false);
            $('#zipcode').attr("disabled", false);
            check_num = 1;
    
        }else{
            $('#country').dropdown('selected')
            $('#mobile_country_code').val($('#country').dropdown('selected').toUpperCase())
            add_request_item('putMyInfo', $(this).serialize(), function (r) {
                if (r?.success) {
                    alert(__('저장했습니다.'));
                    $('.btn.btn--check').show();
                    $('.btn.btn--red').hide();
                    $('.dropdown').attr("disabled", true);
                    $('#city').attr("disabled", true);
                    $('#address_a').attr("disabled", true);
                    $('#address_b').attr("disabled", true);
                    $('#zipcode').attr("disabled", true);
                    check_num = 0;
                } else {
                    alert(__('저장하지 못했습니다.') + r?.error?.message||'')
                }
            })
        }
        return false;
    });
    
    //개인정보 저장
    $('#btn-info_num-save').on('click', function () {
        var user_join_type = document.getElementById("join_type").value;
        var user_join_number = '';
        var text = '';
        if(user_join_type == "A"){
            user_join_number = document.getElementById("join_user_number_A").value;
            text = 'mobile_country_code=KR&user_join_type=';
            text += user_join_type;
            text += '&user_join_number=';
            text += user_join_number;
        }else{
            var passport_t = document.getElementById("join_user_passport").value;
            if (passport_t.indexOf('*') !== -1) {
                user_join_number =Model.user_info.user_info_B;
            } else{
                user_join_number = passport_t;	
            }
            text = 'mobile_country_code=KR&user_join_type=';
            text += user_join_type;
            text += '&user_join_number=';
            text += user_join_number;
        }
        if(user_join_number.length<8){
            alert('정확한 정보를 입력해 주세요');
        }else{
            add_request_item('putMyInfo', text, function (r) {
                if (r?.success) {
                    alert(__('등록 했습니다.'));
                } else {
                    alert(__('등록하지 못했습니다.') + r?.error?.message||'')
                }
            })
        }
        return false;
    });
    
    // 신분증 인증 완료
    if (Model.user_info.permission.substr(3, 1) == '1') {
        document.getElementById("join_user_number_A").value = '';
        document.getElementById("join_user_number_B").value = '';
        document.getElementById("join_user_number_A").style.display = 'none';
        document.getElementById("join_user_number_B").style.display = 'none';
        document.getElementById("join_user_passport").style.display = 'none';
        document.getElementById("check_off").style.display = 'none';
        document.getElementById("check_on").style.display = 'inline-block';
        document.getElementById("join_type").style.display = 'none';
        document.getElementById("btn-info_num-save").style.display = 'none';
        $('.boxed').height(575);
    } 

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
	 * 회원정보 가져오기
	 */
const request_user_info = function (callback) {
    add_request_item('getMyInfo', { 'token': getCookie('token') }, function (r) {
        //console.log('getMyInfo r:', r);
        if (r && r.success && !r.error) {
            let user_info = r.payload;
            Model.user_info = user_info;
            user_info.bank_full = user_info.bank_name +' / '+ user_info.bank_account +' / '+ user_info.bank_owner;
            //계좌정보 없을시 정보등록 요구
            if(user_info.bank_name == ''){
                user_info.bank_full = "계좌정보를 등록해 주세요";
            }
            force_rander('user_info', user_info);
            reset_logedin_status();
            if (callback && typeof callback === 'function') {
                callback();
            }
        }
    });
}