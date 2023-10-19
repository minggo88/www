setTimeout(function() {
    $("#title_2").hide()
    $("#title_2_on").show()
}, 500);

function showTab(tabNumber) {
    // 모든 탭 내용을 숨김
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`tab${i}`).style.display = 'none';
    }

    // 선택한 탭 내용을 표시
    document.getElementById(`tab${tabNumber}`).style.display = 'block';
	wallet_tab(tabNumber);

    // 모든 탭 버튼의 선택 상태를 초기화
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => button.classList.remove("selected"));

    // 선택한 탭 버튼에 선택 상태를 추가
    const selectedTabButton = document.querySelector(`.tab-button:nth-child(${tabNumber})`);
    selectedTabButton.classList.add("selected");
}

function wallet_tab(tabNumber) {
	switch(tabNumber){
		case 1:
			// set default exchange currency symbol
			const exchange = 'KRW';

			const withdrawable_symbols = ['KRW']; // , 'USD', 'ETH'
		
			API.getBalance('ALL', '', (resp) => {
				$('.wallet--tab1--grid').removeClass('loading')
	
				let total_evaluated_balance = 0; // 총 보유 자산
				let total_available_evaluated_balance = 0; // 총 사용 가능 자산
				let total_locked_evaluated_balance = 0; // 총 동결 평가 자산
				let total_buyable_balance = 0; // 총 구매 가능 자산
				let total_income = 0;
				let total_money = 0;
				let frozen_money = 0;
				let total_buy = 0;//총매수
				let total_plat_money = 0;//총평가
	
				// console.log('getBalance resp:', resp);
				if(resp.payload.length > 0) {
					$('[name="d-grid--empty"]').removeClass('d-grid--empty');
					$('[name="grid--empty"]').hide();
					$('.table.table-bordered').empty();
					$('.wallet--tab1--grid').empty();
					
					resp.payload.filter(function(item) {
						if (item.crypto_currency === 'N') {
							return false; // skip
						}
						return true;
					}).map((item) => {
	
						// 원은 목록에서 제거
						if (item.symbol==='KRW') {
							total_buyable_balance = item.confirmed;
							$('.d-grid.wallet-summary #totalBuyableBalance').text(real_number_format(item.confirmed,0))
							$('.d-grid.wallet-summary2 #totalBuyableBalance').text(real_number_format(item.confirmed,0))
							return ;
						}
						// 다른 화폐 제거
						if(item.symbol ==='USD' || item.symbol ==='ETH'){
							return;
						}
	
						//console.log(item);
						//console.log("평가수익 : "+item.eval_income);
	
						//기존 item.confirmed > 0 -> 기준 오류(모둔 상품이 거래가 있을시 0으로 계산 됨)
						if (item.valuation > 0 || item.symbol=='KRW' ) {
							item.eval_tadable = item.tradable * item.price;		// 코인의 거래가능한 평가금액 tradable == confirmed
							item.eval_locked = item.locked * item.price;		// 코인의 잠긴 평가금액
							item.eval_valuation = item.valuation * item.price;	// 코인의 전체 평가금액
							item.eval_trading = item.trading * item.price;		// 코인의 전체 매도중금액
							if(typeof item.eval_income != typeof undefined){
								//total_income += item.eval_income;                   // 총 수입
							}
							total_money = item.total_money;                        // 현금보유
	
							total_evaluated_balance += item.eval_valuation; 		// 총 보유 자산
							total_available_evaluated_balance += item.eval_tadable; 	// 총 사용 가능 자산
							frozen_money = item.withdrawing + item.wait_buy;                //동결자산(출금 금액 + 물품 구매금액)
							frozen_money = item.withdrawing;                //동결자산 강제입력(출금금액만)230724 수정해야함
							total_locked_evaluated_balance = frozen_money;	// 총 동결 평가 자산
	
							// 잔액 230206 mk 지갑내 수량 (거래중일때 감소되는 현상) 수정
							//item.confirmed_str = real_number_format(item.confirmed);
							item.confirmed_str = real_number_format(item.valuation);
							item.eval_valuation_str = real_number_format(item.eval_valuation);
							
	
							const symbol_str = in_array(item.symbol,['KRW','USD']) ? item.symbol : __('개') ;
							const confirmed = item.confirmed;
							const deposit_hide_style = in_array(item.symbol, withdrawable_symbols) ? '' : 'style="display:none"';
							const withdraw_hide_style = in_array(item.symbol, withdrawable_symbols) ? '' : 'style="display:none"';
							const trade_hide_style = in_array(item.symbol, withdrawable_symbols) ? 'style="display:none"' : '';
							//const item_name = item.name+ (item.goods_grade ? ', '+item.goods_grade+'등급':'');
							const item_name = item.name;
							const item_price = item.currency_price*1;
							//const item_income = real_number_format(item.eval_income,1); //DB에서 가져오지만 잘못된 정보를 갖고와 수입 다시 계산
							const item_total = item.currency_price * item.valuation;
							const item_grade = item.goods_grade;
							//const avg_price_one = real_number_format(item.avg_buy_price,1);
							//const avg_price = item.avg_buy_price*item.confirmed_str;
							
							const avg_price_tot = item.sum_buy_goods * item.valuation;
							const avg_price_one = real_number_format(item.sum_buy_goods,0);
							//230724 값을 다시계산해야하므로 강제로 같은값 주기 
							//const avg_price_tot = item_total;
							//const avg_price_one = item_price;
							const avg_price_num = real_number_format(avg_price_tot,0);
							const income = item_total - avg_price_tot;
							const item_income = real_number_format(income,0);
							const income_rate = income / avg_price_tot * 100;
							const make_year = item.make_year;
							let style_text = '';
							total_income += income;
							
							let grid = $(`<div class="grid" style="border-left-color: #${item.color};" />`);
							
							/* mk0306 grid_mobile 형태 추가 */
							const grid_mobile = $(`<tbody name="table_profit">`);
							let tr_color = '#333333';
							if(income < 0){
								tr_color = '#114FAC';
							}else if(income > 0){
								tr_color = '#E21A32';
							}
							
								grid_mobile.append(`
									<tr name="tpl" >
										<td class="pcenter text-left mergeTd symbol light">
											${item_name}
										</td>
										<td class="pcenter text-center mergeTd cord">
											${item_grade}
										</td>
										<td class="pcenter text-right numberDiv">
											${item.confirmed_str}
										</td>
										<td class="pcenter text-right numberDiv">
											`+real_number_format(item_price,0) + `
										</td>
										<td class="symbol_div">`+real_number_format(avg_price_one,0) + `
										</td>
										
										${item.symbol !== exchange ? '<td class="number_div"> '+real_number_format(item_total,0)+'</td>' : ''}
										${item.symbol !== exchange ? '<td class="number_div"> '+real_number_format(avg_price_num,0) +'</td>' : ''}
										
										${item.symbol !== exchange ? '<td class="pcenter text-right numberDiv" style="color: '+tr_color +' !important;">' : ''}
											${item_income}										
										</td>	
										${item.symbol !== exchange ? '<td class="pcenter text-right numberDiv" style="color: '+tr_color +' !important;">' : ''}
												${income_rate.toFixed(2) +'%'}
										</td>
								`)
													
							if(income>0){
								style_text = 'color: var(--red-up) !important';
							}else if(income<0){
								style_text = "color:  var(--blue-dn) !important";
							}else{
								style_text = "";
							}
							//console.log(style_text);
							grid.append( `
								
								<!-- 각 값과 타이틀 -->
								<div class=list_tbody>
									<table class="list_tbody_1">
										<tbody>
											<tr>
												<th class="wallet_list" style="width: 22%;">${item_name}</th>
												<th class="wallet_list" style="width: 10%;">${make_year}</th>
												<th class="wallet_list" style="width: 20%; ${style_text}">${item_income}</th>
												<th class="wallet_list" style="width: 28%;">`+real_number_format(item_total,0)+`</th>
												<th class="wallet_list_end" style="width: 20%;">`+real_number_format(item_total,0)+`</th>
											</tr>
										</tbody>
									</table>
									<table class="list_tbody_2">
										<tbody>
											<tr>
												<th class="wallet_list" style="width: 22%;">
													<div class="wallet_list2">
														<p class="p1">${item_grade}</p>
														<p>${item.confirmed_str}</p>
													</div>
												</th>
												<th class="wallet_list" style="width: 10%;">${item.confirmed_str}</th>
												<th class="wallet_list" style="width: 20%; ${style_text}">${income_rate.toFixed(2) +'%'}</th>
												<th class="wallet_list" style="width: 28%;">`+ real_number_format(avg_price_num,0) +`</th>
												<th class="wallet_list_end" style="width: 20%;">`+ real_number_format(avg_price_one) +`</th>
											</tr>
										</tbody>
									</table>
								</div>
								`);
							total_buy += avg_price_tot;
							total_plat_money += avg_price_tot;
												
							/* mk 그리드 새로 제작
							grid.append(`
								<div class="grid--inner-right">
									<div class="text-right" style="display: flex; flex-basis: 100%; flex-direction: column; column-gap: 5px; justify-content: flex-start">
										<div class="wallet--price">${item.confirmed_str} ${symbol_str}</div>
										${item.symbol !== exchange ? '<div class="wallet--market-price">≈ '+item.eval_valuation_str+' '+exchange+'</div>' : ''}
									</div>
									<div class="wallet--btn">
										<a href="wallet-deposit.html?symbol=${item.symbol}" class="btn btn--red btn--rounded" ${deposit_hide_style}>입금</a>
										<a href="wallet-withdrawal.html?symbol=${item.symbol}" class="btn btn--withdrawal btn--rounded" ${withdraw_hide_style}>출금</a>
										<a href="exchange.html?symbol=${item.symbol}" class="btn btn--withdrawal btn--rounded" ${trade_hide_style}>거래</a>
									</div>
								</div>
							`)*/
							$('.table.table-bordered').append(grid_mobile);
							$('.wallet--tab1--grid').append(grid);
							// $('.currency').dropdown('add', { value: item.symbol, text: item.symbol })
						}
	
					})
	
					//총보유자산->자산평가금액
					//$('#totalBalance').text(real_number_format(total_evaluated_balance))
					//사용가능자산
					//$('#totalAvailableBalance').text(real_number_format(total_available_evaluated_balance))
					//동결평가자산
					//$('#totalLockedBalance').text(real_number_format(total_locked_evaluated_balance))
					//구매가능금액
					//$('#totalBuyableBalance').text(real_number_format(total_buyable_balance))
					
					//---------------------------------------------------
					//총보유자산
					let num = total_evaluated_balance*1 + total_buyable_balance*1;
					$('#totalBalance').text(real_number_format(num,0));
					var divElement = document.querySelector('.firsth_title_2');
					var pElement = divElement.querySelector('p');
					pElement.textContent = real_number_format(num,0);
					//평가손익
					$('#totalAvailableBalance').text(real_number_format(total_income,0));
	
					var divElement = document.querySelector('.second_title_1_2');
					var pElement = divElement.querySelector('p');
					pElement.textContent = real_number_format(total_income,0);
					//자산평가금액 --mk 모바일용, 웹용 전부 입력 가능하도록 변경
					$('.d-grid.wallet-summary #totalLockedBalance').text(real_number_format(total_evaluated_balance,0))
					$('.d-grid.wallet-summary2 #totalLockedBalance').text(real_number_format(total_evaluated_balance,0))
					//보유금액
					// <div class="firsth_title_1"> 요소를 선택합니다.
					var divElement = document.querySelector('.firsth_title_1');
					var pElement = divElement.querySelector('p');
					pElement.textContent = real_number_format(total_money,0);
					//$('.d-grid.wallet-summary #totalBuyableBalance').text(real_number_format(total_money,0))
					//$('.d-grid.wallet-summary2 #totalBuyableBalance').text(real_number_format(total_money,0))
					//주문 및 동결 금액
					$('.d-grid.wallet-summary #totalBuingBalance').text(real_number_format(total_locked_evaluated_balance,0))
					$('.d-grid.wallet-summary2 #totalBuingBalance').text(real_number_format(total_locked_evaluated_balance,0))
					//총매수
					var divElement = document.querySelector('.second_title_1_1');
					var pElement = divElement.querySelector('p');
					pElement.textContent = real_number_format(total_buy,0);
					//총평가
					var divElement = document.querySelector('.second_title_2_1');
					var pElement = divElement.querySelector('p');
					//pElement.textContent = real_number_format(total_plat_money,0);
					pElement.textContent = real_number_format(total_buy + total_income,0);
					//수익률
					var total_per = total_income / total_plat_money * 100;
					
					var divElement = document.querySelector('.second_title_2_2');
					var pElement = divElement.querySelector('p');
					pElement.textContent = real_number_format(total_per,0) +'%';
					
					
	
				}
			})
			
	
			$('.totalBalance').on('change', (event, symbol) => {
				API.getBalance('ALL', symbol, (resp) => {
					if(resp.success) {
						//console.log(resp)
						$('.wallet-summary .grid:eq(0)').find('.text-').text(resp.payload.price)
					} else {
						alert(resp.error.message)
					}
				})
			})
			$('.availableBalance').on('change', (event, symbol) => {
				API.getBalance('ALL', symbol, (resp) => {
					if(resp.success) {
						const price = resp.payload.price
						$('.wallet-summary .grid:eq(1)').find('.text-').text(price.format())
					} else {
						alert(resp.error.message)
					}
				})
			})
			$('.unconfirmedBalance').on('change', (event, symbol) => {
				API.getBalance('ALL', symbol, (resp) => {
					if(resp.success) {
						const price = resp.payload.price
						$('.wallet-summary .grid:eq(1)').find('.text-').text(price.format())
					} else {
						alert(resp.error.message)
					}
				})
			})
	
	
			// 팝업띄우기
			$(document).on('click', '[name="goods_desc"]', function(e){
				e.preventDefault()
				$("#goods-desc").addClass('modal--open');
				let symbol = $(this).data('symbol')
				let goods_grade = $(this).data('goods_grade')
				//console.log($(this).data('symbol'))
				//console.log($(this).data('goods_grade'))
				
				// modal창 clear작업
				$('#goods-desc .tea--name').text('상품이름');
				$('#goods-desc .tea--grade').empty();
				$('#goods-desc .thumb img').attr('src', './assets/img/dummy/noimage.gif')
				$('#desc_table tbody').empty();
				$('#goods-desc .table tbody td > *').empty();
				
				
				add_request_item('getGoodsNftInfo', {'token': getCookie('token'), 'symbol': symbol, 'goods_grade':goods_grade}, function (r) {
					if (r && r.success) {
						console.log(r.payload)
						//Model.site_info = r.payload;
						console.log(r.payload.good_info.title)
						const goodInfo = r.payload.good_info;
						const nftInfo = r.payload.nft_info;
						$('#goods-desc .tea--name').text(goodInfo.title);
						$('#goods-desc .tea--grade').text(goodInfo.goods_grade);
	
						// 상품사진
						$('#goods-desc .thumb img').attr('src', goodInfo.main_pic)
	
						//구분
						$('#goods-desc [name=meta_division]').text(goodInfo.meta_division);
						//타입
						$('#goods-desc [name=meta_type]').text(goodInfo.meta_type);
						// 생산
						$('#goods-desc [name=meta_produce]').text(goodInfo.meta_produce);
						// 인증
						$('#goods-desc [name=meta_certification_mark_name]').text(goodInfo.meta_certification_mark);
						// 차소개
						$('#goods-desc [name=meta_wp_teamaster_note]').text(goodInfo.content);
	
	
						$('#desc_table tbody').empty()
						nftInfo.map((item) => {
							console.log(item)						
							const tr = $('<tr>')
							tr.append(`<td><span>${item.idx}</span></td>`)
							tr.append(`<td><span>${item.nft_blockchain}</span></td>`)
							tr.append(`<td><span>${item.nft_id}</span></td>`)
							tr.append(`<td><div class="copyTd"><span id="${item.nft_tokenuri}">${item.nft_tokenuri}</span><button type="button" class="copyBtn" data-clipboard-target="#${item.nft_tokenuri}">COPY</button></div></td>`)
							tr.append(`<td><div class="copyTd"><span id="${item.nft_txnid}">${item.nft_txnid}</span><button type="button" class="copyBtn" data-clipboard-target="#${item.nft_txnid}">COPY</button></div></td>`)
							tr.appendTo('#desc_table tbody')
						})
					}
				});
			})
			break;	
	
		case 2: //거래내역페이지
			let search_type = 0;//0: 전체, 1: 매수, 2: 매도
			// 거래내역 검색
			let sdate = date('Y-m-d', time()-60*60*24*7);
			let edate = date('Y-m-d');
			$('[name="start"]').val(sdate);
			$('[name="end"]').val(edate);
			$('[name="mstart"]').val(sdate);
			$('[name="mend"]').val(edate);
			
			let wallet_symbols = {};
	
			if (Object.values(Model.user_wallet).length > 1) {
				wallet_symbols['all'] = { 'symbol': 'all', 'name': '상품 전체 검색', 'icon_url':'' }
	
				for (row of Object.values(Model.user_wallet)) {
					wallet_symbols[row.symbol] = { 'symbol': row.symbol, 'name': row.name};
				};
	
				let first_dropdown_value = 'all';
			$('[name="symbol"]').dropdown('add', { value: 'all', text: '전체' })	
			for(i in wallet_symbols) {
				row = wallet_symbols[i];
				//console.log(i, row);
				if (row.symbol.length >= 10 || row.symbol=='all') {
					if(!first_dropdown_value) {
						if (row.symbol.length >= 10) {
							first_dropdown_value = row.symbol;
						}
					}
						// $('#symbol').dropdown('add', { value: i.symbol, text: i.name })
						// let goods_grade = i.goods_grade ? i.goods_grade + '등급' : '';
						if(row.symbol == 'all' || row.name ==''){
							
						}else{
							$('[name="symbol"]').dropdown('add', { value: row.symbol, text: row.name })	
						}
					}
				}
				$('[name="symbol"]').dropdown('select', first_dropdown_value)
					
	
				let selected_symbol = $('[name=symbol]:visible').dropdown('selected');
				let selected_category = '';
				let wallet = Model.user_wallet[selected_symbol];
				let wallet_icon_url = wallet?.icon_url;
				let wallet_name = wallet?.name;
	
				$('.modal--content [name=symbol]').on('change', function () {
					console.log('detect changed2');
					
					if ($(this).is(':visible')) {
						selected_symbol = $(this).dropdown('selected');
						selected_symbol = $('.top_area [name=symbol]');
						wallet = Model.user_wallet[selected_symbol];
						const buttonElement = $('.modal--content #dropdown_selected')[0];
						const buttonText = buttonElement.innerText;
						$('#search_item').val(buttonText);
					}
				});

				
				//const value = document.querySelectorAll(".option_div").getAttribute('value');

				if(selected_symbol != ''){
					//23039 mk 모바일용 주문내역 
					$('#transactionGrid2').DataTable().destroy();
					let select_symbol = $('.modal--content [name=symbol]').dropdown('selected');
					const transactionGrid2 = $('#transactionGrid2').DataTable({
						"lengthChange": false,
						"responsive": true,
						"processing": true,
						"serverSide": true,
						'pageLength': 10 ,
						"order": [[ 0, 'desc' ]],
						"searching" : false,
						ajax: {
							type: "post",
							url: `${API.BASE_URL}/getMyOrderList/`,
							// url: `${API.BASE_URL}/getMyTradingList/`,
							// dataSrc: 'payload.data',
							data:  function ( d ) {
								d.token = getCookie('token');
								d.symbol = $('.modal--content [name=symbol]').dropdown('selected');
								d.exchange = 'KRW';
								d.return_type = 'datatable';
								d.status = 'all';
								d.start_date = $('#start2').val();
								d.end_date = $('[name="end"]').val();
								d.trading_type = $('#trade_type').val();
							}							
						},
	
						"language": {
							"emptyTable": "데이터가 없음.",
							"lengthMenu": "페이지당 _MENU_ 개씩 보기",
							"info": "현재 _START_ - _END_ / _TOTAL_건",
							"infoEmpty": "",
							"infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
							"search": "검색: ",
							"zeroRecords": "일치하는 데이터가 없음",
							"loadingRecords": "로딩중...",
							"processing": '잠시만 기다려 주세요.',
							"paginate": {
								"next": "다음",
								"previous": "이전"
							}
						},
						columns : [
							{data: 'time_traded', render: (time_traded) => {
								if(time_traded != ''){
									let date1 = date('Y-m-d', time_traded);
									let date2 = date('H:i', time_traded);
									let date_text = date1+ '<br>' + date2;
									return date_text; 
								}else{
									return ''
								} ;}
							},  // 체결시간
							{
								data: 'currency_name' //, render: (data, type, row) => {return `<span class="product&#45;&#45;image"><img src="${wallet_icon_url}" alt=""></span>${data}`}
								, orderable: false,
							},  // 상품명
							//{data: 'goods_grade'},  // 등급
							{data: 'production_date', render: (production_date) => {return production_date;}},  // 생산년도
							{data: 'trading_type', render: (trading_type_str, type, row, meta) => {
								let trading_type_str2 = '매수';
								if(trading_type_str == "sell"){
									trading_type_str2 = '매도';
								}
								return trading_type_str2;}},  // 거래종류
							{data: 'status', render: (status, type, row, meta) => {
									// '매매 상태. O: 대기중, C: 완료, T: 매매중, D: 삭제(취소)'
									//mk수정필요 : 강제값 적용(DB호출시 C와 D만 불러와야함)
									let status_str = "취소"
									if (status == "O") {
										status_str = "대기중"
									} else if (status == "C") {
										status_str = "완료"
									} else if (status == "T") {
										status_str = "매매중"
									} else if (status == "D") {
										status_str = "취소"
									}
									if (row.status == 'O' || row.status == 'T' && row.volume_remain > 0) {
										// status_str + 버튼
										status_str = `<button type="button" class="btn btn--cancal" name="order_cancal" data-symbol="${row.symbol}" data-order_id="${row.orderid}" data-goods_grade="${row.goods_grade}"  >취소</button>`;
									}
									return status_str;
								}
							},  // 거래종류
							{data: 'volume', render: (volume) => {return real_number_format(volume);}},  // 거래수량
							{data: 'price', render: (price) => {return real_number_format(price);}},  // 거래단가
							{data: 'amount', render: (amount) => {return real_number_format(amount);}},  // 거래금액
							{data: 'fee', render: (fee) => {return real_number_format(fee);}},  // 수수료
							{data: 'settl_price', render: (settl_price) => {return real_number_format(settl_price);}},  // 정산금액
						],
						columnDefs: [
							{searchable: false,
							 createdCell: function (td) {
									$(td).attr('id', 'tab2_fix_title'); // '상품명' 열에 id 'aa' 추가
								},orderable: true,targets: 0, "responsivePriority": 1,},  // 체결시간
							{targets: 1,className: 'dt-body-center',
							 createdCell: function (td) {
									$(td).attr('id', 'tab2_fix_title'); // '상품명' 열에 id 'aa' 추가
								}, type: 'title-string',orderable: false,},  // 상품명
							//{targets: 2,className: 'dt-body-center',type: 'title-string',orderable: true,},  // 등급
							{targets: 2,className: 'dt-body-center',
							 createdCell: function (td) {
									$(td).attr('id', 'tab2_fix_title'); // '상품명' 열에 id 'aa' 추가
								},type: 'title-string',orderable: false,"responsivePriority": 1},  // 생산년도
							{targets: 3,
							 createdCell: function (td, cellData, rowData, row, col) {
									$(td).css('color', '#E21A32');
									if (cellData === 'sell') {
									$(td).css('color', '#114FAC'); // '매수'인 경우 글자를 빨간색으로 스타일링
									}
						        },
							},
							{targets: 4,className: 'dt-body-center',type: 'title-string',orderable: true, "responsivePriority": 1,},   // 거래종류
							{targets: 5,className: 'dt-body-center',type: 'title-string',orderable: true, "responsivePriority": 1,},   // 거래수량
							{targets: 6,className: 'dt-body-right',type: 'title-string',orderable: true, "responsivePriority": 1,},   // 거래단가
							{targets: 7,className: 'dt-body-right',type: 'title-string',orderable: true, "responsivePriority": 1,},   // 거래금액
							{targets: 8,className: 'dt-body-right',type: 'title-string',orderable: true, "responsivePriority": 1,},  // 수수료
							{targets: 9,className: 'dt-body-right',type: 'title-string',orderable: true, "responsivePriority": 1,},  // 정산금액
						],
						"order": [ [0, 'desc'] ]
					})
	
					$('[name="btn-search"]').on('click', function() {
						$("#modal-wallet-option").hide(); 
						selected_symbol = $('.modal--container [name=symbol]:visible').dropdown('selected');
						category = '';
						sdate = $('#start2').val();
						edate = $('[name="etart"]').val();
						console.log(sdate);
						//transactionGrid.ajax.reload(null, !!'reset page');
						transactionGrid2.ajax.reload(null, !!'reset page');
					});
					$('[name="btn-search2"]').on('click', function() {
						selected_symbol = $('[name=symbol]:visible').dropdown('selected');
						category = '';
						sdate = $('#start2').val();
						edate = $('[name="etart"]').val();
						//transactionGrid.ajax.reload(null, !!'reset page');
						transactionGrid2.ajax.reload(null, !!'reset page');
					});
					$('[name="btn-reload"]').on('click', function() {
						//transactionGrid.ajax.reload(null, !!'reset page');
						transactionGrid2.ajax.reload(null, !!'reset page');
					});
	
					$('[name="m_dropdown"]').on('click', 'button', (e) => {
						e.preventDefault()
						let selected_text = $(e.target).text();
						if (selected_text) {
							$('[name="m_category_label"]').text(selected_text);
							selected_category = $(e.target).data('category')
							//transactionGrid.ajax.reload(null, !!'reset page');
							transactionGrid2.ajax.reload(null, !!'reset page');
						}
	
					})
	
					$(document).on('click', ".btn--cancal", function() {
						// alert($(this).data('order_id'));
						add_request_item('cancel', {'symbol':$(this).data('symbol'), 'orderid':$(this).data('order_id'),  'goods_grade':$(this).data('goods_grade') }, function(r) {
							if(r && r.success) {
								//transactionGrid.ajax.reload(null, false);
								transactionGrid2.ajax.reload(null, false);
							}
						});
					})
				}
			}
			
			//검색버튼 클릭 이벤트
			$(document).on('click', "#btn_popup", function() {
			  $("#modal-wallet-option").show(); // 모달을 표시
			});
			
			$("#wallet-option-clear").click(function() {
				$("#option_btn1").click();
				$("#option_btn2").click();
				$('.dropdown--item:eq(6) li:first').click();
			  //$("#modal-wallet-option").hide(); // 모달을 가림
			});

			$("#modal-wallet-option").click(function(e) {
				if (!$(e.target).closest("#modal--dialog-wallet-option").length) {
		          $("#modal-wallet-option").hide();
				}
			});

			
			break;
		case 3:
			break;
		default:
			break;
	}
	
}



//dropdown 버튼 이벤트
document.addEventListener("DOMContentLoaded", function() {
    // "dropdown_date" 드롭다운에서 항목을 클릭할 때 이벤트 핸들러 추가
    var dropdownDateItems = document.querySelectorAll('.dropdown-wrapper[name="dropdown_date"] ul li button');
    dropdownDateItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // 클릭된 항목의 텍스트를 가져와서 "dropdown_date_selected" 버튼의 텍스트로 설정
            var selectedDropdownDate = item.textContent;
            document.getElementById('dropdown_date_selected').textContent = selectedDropdownDate;
        });
    });

    // "dropdown_type" 드롭다운에서 항목을 클릭할 때 이벤트 핸들러 추가
    var dropdownTypeItems = document.querySelectorAll('.dropdown-wrapper[name="dropdown_type"] ul li button');
    dropdownTypeItems.forEach(function(item) {
        item.addEventListener('click', function() {
            // 클릭된 항목의 텍스트를 가져와서 "dropdown_type_selected" 버튼의 텍스트로 설정
            var selectedDropdownType = item.textContent;
            document.getElementById('dropdown_type_selected').textContent = selectedDropdownType;
        });
    });
});

//option 버튼 이벤트
function changeStyle(button) {
	// 모든 버튼을 기본 스타일로 초기화
	var buttons = document.querySelectorAll(".option_div");
	const value = button.getAttribute('value');
	  console.log('클릭한 버튼의 value 값:', value);
	for (var i = 0; i < buttons.length; i++) {
	  buttons[i].style.border = "1px solid #999999";
	  buttons[i].style.color = "#999999";
	}

	if(value ==''){
		$('#search_type').val('전체');
		$('#trade_type').val('');
		selected_category = '';
	}else if(value =='buy'){
		$('#search_type').val('매수');
		$('#trade_type').val('b');
		selected_category = 'buy';
	}else{
		$('#search_type').val('매도');
		$('#trade_type').val('s');
		selected_category = 'sell';
	}
  
	// 클릭된 버튼에 새로운 스타일 적용
	button.style.border = "1px solid var(--red-up)";
	button.style.color = "var(--red-up)";
}

function changeStyle2(button) {
	// 모든 버튼을 기본 스타일로 초기화
	var buttons = document.querySelectorAll(".option_div2");
	const value = button.getAttribute('value');
	  console.log('클릭한 버튼의 value 값:', value);
	for (var i = 0; i < buttons.length; i++) {
	  buttons[i].style.border = "1px solid #999999";
	  buttons[i].style.color = "#999999";
	}
  
	// 클릭된 버튼에 새로운 스타일 적용
	button.style.border = "1px solid var(--red-up)";
	button.style.color = "var(--red-up)";

	//날자 변경
	var startInput = document.getElementById('start');
	var endInput = document.getElementById('end');
	var startInput2 = document.getElementById('start2');
	var endInput2 = document.getElementById('end2');
	
	if(value<1){
		startInput.value = getOneWeekAgoDate();
		startInput2.value = getOneWeekAgoDate();
		$('#search_date').val('일주일');
	}else if(value>99){
		$('#search_date').val('임의입력');
	}else{
		startInput.value = getNDaysAgo(value);
		startInput2.value = getNDaysAgo(value);
		if(value==12){
			$('#search_date').val('1년');
		}else{
			const date_text = value + '개월';
			$('#search_date').val(date_text);
		}
	}
	 // 오늘 날짜 설정
	if(value<99){
		endInput.value = getTodayDate();	
		endInput2.value = getTodayDate();	
	}
	
}

function changeStyle3(button){
	const directInputOption = document.querySelector('.transaction-select .option_div2[value="100"]');
	if (directInputOption) {
		directInputOption.click();
		console.log(`Clicked: ${directInputOption.textContent}`);
	}
}

// 오늘 날짜를 가져오는 함수
function getTodayDate() {
	const today = new Date();
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

// 일주일 전 날짜를 가져오는 함수
function getOneWeekAgoDate() {
	const today = new Date();
	today.setDate(today.getDate() - 7);
	const year = today.getFullYear();
	const month = String(today.getMonth() + 1).padStart(2, '0');
	const day = String(today.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function getNDaysAgo(n) {
  const today = new Date();
  today.setMonth(today.getMonth() - n);
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

window.addEventListener('load', function() {
  // 'start'와 'end' 입력 필드에 날짜 설정
	const startInput = document.getElementById('start');
	const endInput = document.getElementById('end');
	const startInput2 = document.getElementById('start2');
	const endInput2 = document.getElementById('end2');

	startInput.value = getOneWeekAgoDate(); // 일주일 전 날짜 설정
	startInput2.value = getOneWeekAgoDate(); // 일주일 전 날짜 설정
	endInput.value = getTodayDate(); // 오늘 날짜 설정
	endInput2.value = getTodayDate(); // 오늘 날짜 설정
});

//미체결 js
window.onload = function() {
    setTimeout(function() {
        fn_takeout();    
    }, 500);
    
};

const fn_takeout = function () {
    check_login();
    
    API.getTakeOutItem('ALL', '', (resp) => {
        if(resp.success) {
            if(resp.payload.length > 0) {
                
				$('[name="d-grid--empty"]').removeClass('d-grid--empty');
				$('[name="grid--empty"]').hide();
                resp.payload.filter(function(item) {
					if (item.crypto_currency === 'N') {
						return false; // skip
					}
					return true;
				}).map((item) => {
                    /*
					const item2 = [{t_name: '천년고수 왕중왕2', t_cnt: '1', t_pdate: '2018', t_rdate: '2023-07-25 12:25:05', t_state: 'C'}
					,{t_name: '천년고수 왕중왕2', t_cnt: '1', t_pdate: '2008', t_rdate: '2023-07-25 12:25:05', t_state: 'C'}
					,{t_name: '천년고수 왕중왕3', t_cnt: '1', t_pdate: '2108', t_rdate: '2023-07-25 12:25:05', t_state: 'C'}];

					for (const d_item of item2) {*/

					const itme2 = [item];
					for (const d_item of itme2) {
					  const t_name = d_item.t_name;
					  const t_pdate = d_item.t_pdate;
					  const t_cnt = d_item.t_cnt;
					  const t_rdate = d_item.t_rdate;
					  const t_state = d_item.t_state;
					
					  const grid = $(`<table class="cancel_list" />`);
					  grid.append(`
					    <tr class="cancel_list_left">
					      <td rowspan="2" id="cancel_table_check" style="width: 14%; text-align: center; padding-left:5px !important;" class='item_name'><input type="checkbox" class="checkbox" value="${t_name}"></td>
					      <td id="cancel_table_right1" style="width: 23%; text-align: center;" class='item_grade'>${t_pdate}</td>
					      <td id="cancel_table_right1" style="width: 23%; text-align: center;" class="rdate">${dateChange(t_rdate)}</td>
					      <td rowspan="2" style="width: 39%; text-align: center;" class="tcnt">${t_cnt}개</td>
					      <td id="cancel_table_nond" rowspan="2" style="width: 1%; text-align: center;" class="tstate">${stateChage(t_state)}</td>
					    </tr>
					    <tr class="cancel_list_left">
					      <td id="cancel_table_right2" style="width: 23%; text-align: center;" class='item_grade'>${t_pdate}</td>
					      <td id="cancel_table_right2" style="width: 23%; text-align: center;" class="rdate">${dateChange(t_rdate)}</td>
					    </tr>
					  `);
					  $('.wallet--grid').append(grid);
					}
                });
            }
        }else{
            $('#loading_text').hide();
            $('#empty_text').show();
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