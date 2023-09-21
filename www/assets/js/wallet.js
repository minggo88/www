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

    // 모든 탭 버튼의 선택 상태를 초기화
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => button.classList.remove("selected"));

    // 선택한 탭 버튼에 선택 상태를 추가
    const selectedTabButton = document.querySelector(`.tab-button:nth-child(${tabNumber})`);
    selectedTabButton.classList.add("selected");
}

function wallet_tab1(tabNumber) {
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

					console.log(item);
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
						let style_text = '';
						total_income += income;
												
						
												
						const grid = $(`<div class="grid" style="border-left-color: #${item.color};" />`);
						
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
									<div class="number_div">`+real_number_format(item_price,0) + `</div>
									<div class="symbol_div">`+real_number_format(avg_price_one,0) + `</div>
									</td>
									<td class="pcenter text-right numberDiv">
										${item.symbol !== exchange ? '<div class="number_div"> '+real_number_format(item_total,0)+'</div>' : ''}
										${item.symbol !== exchange ? '<div class="number_div"> '+real_number_format(avg_price_num,0) +'</div>' : ''}
									</td>
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
						console.log(style_text);
						grid.append( `
							
							<!-- 각 값과 타이틀 -->
							<div class=list_tbody>
								<table class="list_tbody_1">
									<tbody>
										<tr>
											<th class="wallet_list" style="width: 22%;">${item_name}</th>
											<th class="wallet_list" style="width: 10%;">${confirmed}</th>
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
						
						$('.table.table-bordered').append(grid_mobile)
						$('.wallet--tab1--grid').append(grid)
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
				pElement.textContent = real_number_format(total_buy,0);
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
	};
