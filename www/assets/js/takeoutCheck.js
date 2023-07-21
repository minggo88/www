
window.onload = function() {
    fn_takeout();
};

const fn_wallet = function () {
    check_login();
    force_rander('user_info', Model.user_info);

    API.getTakeOutItem('ALL', '', (resp) => {
        if(resp.success) {
            console.log(resp);
        }else{
            console.log('fail');
        } 
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
///-------------------------------------------------------------------------------------------
$(document).ready(function() {
    
});


