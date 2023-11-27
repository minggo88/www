setTimeout(function() {
	$("#title_3").hide()
    $("#title_3_on").show()
    fn_wallet_deposit();
}, 500);

setTimeout(function() {
	//check_login();
}, 100);

function fn_wallet_deposit (){
	//로그인 체크 필요
    //check_login();
    // access level 3
    // request_user_info();
    force_rander('user_info', Model.user_info);
    // 사이트 정보
    force_rander('site_info', Model.site_info);
    /*add_request_item('getConfig', {}, function (r) {
        if (r && r.success) {
            Model.site_info = r.payload;
        }
    });*/
    // 지갑 정보
    force_rander('user_wallet', Model.user_wallet); // 화면에 잔액 표시 후
    //get_user_wallet(); // DB 값으로 다시 잔액 표시

    const clipboard = new ClipboardJS('.btn--copy');
    clipboard.on('success', function (e) {
        alert('클립보드에 복사되었습니다.')
        e.clearSelection()
    });

    // 입금하기
    $('[name="btn-save-deposit"]').on('click', function () { 
        const symbol = "KRW";
        const $deposit_amount = $('[name=deposit_amount]');
        const deposit_amount = $.trim($deposit_amount.val()).replace(/[^0-9.]/g, "");
        if (deposit_amount <= 9999) {
            alert(__('입금액을 확인해주세요.')); $deposit_amount.select(); return false;
        }
        const $deposit_name = $('[name=deposit_name]');
        const deposit_name = $.trim($deposit_name.val());
        if (!deposit_name) {
            alert(__('입금자 이름을 입력해주세요.')); $deposit_name.select(); return false;
        }
        const address = $.trim($('[name=address]').val());
		
		//api.js로 넘기는 로직 통일
		API.deposit(symbol,deposit_amount, deposit_name, address, (resp) => {
			if(resp.success) {
				alert(__('입금 신청을 완료했습니다.'))
                $('[name=deposit_amount]').val('0');
                $('[name=deposit_name]').val('');
            } else {
                alert(__('입금 신청을 완료하지 못했습니다.'))
            }
		});

/*
        add_request_item('deposit', { 'symbol': symbol, 'deposit_amount': deposit_amount, 'deposit_name': deposit_name, 'address': address }, function (r) {
            if (r && r.success) {
                alert(__('입금 신청을 완료했습니다.'))
                $('[name=deposit_amount]').val('0');
                $('[name=deposit_name]').val('');
            } else {
                alert(__('입금 신청을 완료하지 못했습니다.'))
            }
        })*/
    })

}
/*
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
*/

(jQuery(function ($) {
	const force_rander = function (name, value) {
		// console.log('==force_rander== ', name);
		rander(name, value, value, true);
	}

    const rander = function (property, value, oldValue, force) {
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
					$('[data-bind="' + property + '.' + i + '"]').each(function () {
						var tagname = this.tagName,
							tagname = tagname.toUpperCase(),
							format = $(this).attr('data-format');
						// 데이터 출력 형식 변경
						switch (format) {
							case 'table':
								const data = vn;
								const $target = $(this), $empty = $target.find('[name=empty]'), $search = $target.find('[name=search]');
								$search.hide().addClass('hide');
								$empty.hide().addClass('hide');
								// console.log('target:', $target);
								// console.log('$tpl:', $tpl);
								if (!data || data.length < 1) {
									$empty.show().removeClass('hide');
									$target.children().not('[name=tpl],[name=search],[name=empty]').remove();
								} else {
									let html = [], $tpl = $('<div></div>').append($target.find('[name=tpl]').clone().attr('name', '').removeClass('hide')); // div로 감싸사 tpl 첫 DOM도 data-bind를 쓸수 있도록 합니다. 그리고 $tpl.html()을 하면 div는 제외하고 tpl만 추출됩니다.
									for (let i in data) {
										let _row = data[i], _tpl = $tpl.clone();
										for (let k in _row) {
											let $row = _tpl.find('[data-bind="row.' + k + '"]'), vn = _row[k], format = $row.attr('data-format'), decimals = $row.attr('data-decimals');
											switch (format) {
												case 'attr': $row.attr('data-' + k, vn); break;
												case 'comma': $row.text(real_number_format(vn, decimals)); break;
												case 'date':
													$row.each(function () {
														let date_format = $(this).attr('data-date_format') || '';
														$(this).text(date_format ? date(date_format, vn) : vn);
													})
													break;
												case 'add-class': $row.addClass(vn); break;
												case 'number': $row.text((vn + '').replace(/[^0-9.-]/g, '')); break;
												// case 'html': $row.html(vn); break;
												default:
													$row.each(function () {
														const TAGNAME = this.tagName ? this.tagName.toUpperCase() : '';
														switch (TAGNAME) {
															case 'A':
																$row.attr('href', vn); break;
															default:
																if (format == 'html') {
																	$row.html(vn);
																} else {
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
								return; // 클래스 추가후 끝.
								break;
							case 'background-image':
								$(this).css('background-image', 'url('+vn+')');
								return; // 클래스 추가후 끝.
								break;
							default:
								vt = vn;
						}
						// 값 지정
						// console.log('tagname:', tagname);
						switch (tagname) {
							case 'INPUT':
								let type = ($(this).attr('type') + '').toUpperCase();
								switch (type) {
									case 'CHECKBOX':
										// $(this).prop('checked', vn==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
										let same_value = vn == $(this).val(); // 값이 같은가?
										// 값이 같은데 체크 안되있으면 클릭해서 체크함.
										// 값이 다른데 체크 되있으면 클릭해서 언체크함.
										// console.log('same_value:', same_value);
										// console.log('checked:', $(this).is(':checked'));
										if (same_value && !$(this).is(':checked') || !same_value && $(this).is(':checked')) {
											$(this).trigger('click');
										}
										break;
									case 'RADIO': // 라디오, 채크박스는 값이 같으면 checked 속성을 넣습니다.
										// $(this).prop('checked', vt==$(this).val()); // 안바뀌는 경우 있어서 click으로 변경.
										if (vt == $(this).val()) { $(this).trigger('click'); }
										break;
									case 'NUMBER': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
									case 'HIDDEN': // <input type="hidden" 에 숫자 값은 콤마 없이 넣고 hidden이 아니면 콤마를 추가합니다.
										$(this).val(vt);
										break;
									default:
										vt = (vt && vt.toNumber() == vt && (typeof (vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
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
									vt = (vt && vt.toNumber() == vt && (typeof (vt)).toLowerCase() == 'number' && !(vt + '').match(/[^0-9.]/)) ? real_number_format(vt) : vt;
								}
								// console.log('vt:', vt, '$(this):', $(this));
								$(this).html(vt);
								break;
						}
					});

					// display-bind
					// <div data-display="market.use_userpw=Y"></div>
					$('[data-display^="' + property + '.' + i + '"]').each(function () { //
						let data = $(this).attr('data-display');
						data = data.split('=');
						if (vn == data[1]) {
							$(this).removeClass('hide').attr('style', '');
						} else {
							$(this).addClass('hide').attr('style', '');
						}
					});
				}
			}
		}
	}
}));

/**나가기버튼 이벤트**/
function page_exit(){
	// 새로운 페이지의 URL
	var newPageUrl = "wallet-inout.html"; // 실제로 이동하고자 하는 페이지의 URL로 변경해주세요.

	// 페이지 이동
	window.location.href = newPageUrl;
}