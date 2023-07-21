
window.onload = function() {
    fn_takeout();
};

const fn_takeout = function () {
    check_login();
    force_rander('user_info', Model.user_info);

    API.getTakeOutItem('ALL', '', (resp) => {
        if(resp.success) {
            console.log(resp);
            if(resp.payload.length > 0) {
				$('[name="d-grid--empty"]').removeClass('d-grid--empty');
				$('[name="grid--empty"]').hide();
                resp.payload.filter(function(item) {
					if (item.crypto_currency === 'N') {
						return false; // skip
					}
					return true;
				}).map((item) => {
                    const t_name = item.t_name;
                    const t_pdate = item.t_pdate;
                    const t_cnt = item.t_cnt;
                    const t_rdate = item.t_rdate;
                    const t_state = item.t_state;

                    const grid = $(`<table class="takeout_list" />`)
                    grid.append(`
							<tr class="takeout_list_left">
								<td style="	width: 22%; text-align: center; border-right: 1px solid #DDDDDD;" class='item_name'>${t_name}</td>
								<td style="	width: 10%; text-align: center; border-right: 1px solid #DDDDDD;" class='item_grade'>${t_pdate}</td>
								<td style="	width: 22%; text-align: center; border-right: 1px solid #DDDDDD;" class="rdate">`+dateChange(t_rdate)+`</td>
								<td style="	width: 22%; text-align: center; border-right: 1px solid #DDDDDD;" class="tcnt">${t_cnt}개</td>
                                <td style="	width: 24%; text-align: center;" class="tstate">`+stateChage(t_state)+`</td>
                            </tr>`);
                    $('.wallet--grid').append(grid)
                });
            }
        }else{
            console.log('fail');
        } 
    });
}

const dateChange = function(dateTime){
    var dateObj = new Date(dateTime);
    // 년, 월, 일 추출
    var year = dateObj.getFullYear();
    var month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
    var day = ('0' + dateObj.getDate()).slice(-2);
    
    // 'yyyy-mm-dd' 형식으로 결과 출력
    var formattedDate = year + '-' + month + '-' + day;
    return formattedDate;
}
const stateChage = function(text){
    if(text == 'R'){
        return "배달 준비중"
    }else if(text == 'C'){
        return "취소"
    }else if(text == 'D'){
        return "배달 완료"
    }
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


