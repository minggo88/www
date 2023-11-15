setTimeout(function() {
	$("#title_1_on").show();
	$("#title_1").hide();
}, 190);

let USER_INFO = {}
API.getMyInfo((resp) => {
    if(resp.success) {
        const payload = resp.payload

        USER_INFO = {
            ...USER_INFO,
            userno: payload.userno,
            userid: payload.userid,
            phone: payload.phone,
            mobile: payload.mobile,
            bool_email: payload.bool_email,
            bool_sms: payload.bool_sms,
            regdate: payload.regdate,
            bank_name: payload.bank_name,
            bank_account: payload.bank_account,
            bank_owner: payload.bank_owner,
        }

        if(USER_INFO.userno) {
            // $('.nav--side .btn--login').hide()
            // $('.profile').show()
            // $('.wallet').show()
            // $('.profile .dropdown').text(USER_INFO.userid)
        }
    }
})

const gen_user_wallet_key = (symbol, goods_grade) => {
    return symbol + '/' + goods_grade;
}

let USER_WALLET = {}
const set_user_wallet = function () {
    API.getTradeBalance('ALL','',(r) => {
        if (r && r.success) {
            const payload = r.payload
            for (row of payload) {
                USER_WALLET[gen_user_wallet_key(row.symbol, row.goods_grade)] = row
            }
        }
    })
}
set_user_wallet();

let CURRENCY_INFO = [];
let SELECTED_SYMBOL = '';  //'G4K95O56R2'
let SELECTED_NAME = '';  //'끽다거 세작'
let SELECTED_SYMBOL_PRICE = 0
let SELECTED_EXCHANGE = getURLParameter('exchange') || 'KRW'
let CHART_TIMER
let SELECTED_GOODS_GRADE = 'A';
let PIN_NUMBER_ON = 0;
let sort_num = 0;
let desc_data = [];
let select_price = 0;

// 모바일 접속 여부
let isMobile = (window.matchMedia('(max-width: 800px)').matches)

$(function() {
    $('.number').autotab({ tabOnSelect: true },'filter', 'number');

    $(window).on('resize', () => {
        isMobile = (window.matchMedia('(max-width: 800px)').matches)
		if($(window).width()>=800) {
			$(".side--panel").show();
			$(".details").show();
		} else {
			//$(".side--panel").show();
			//$(".details").hide();
		}
    })

    $(document).on('click', ".btn--star, .btn--star--on", function() {
        $.ajax({
            url:`${API.BASE_URL}/putSubscribe/`,
            type: 'POST',
            dataType: 'JSON',
            data: {
                token: window.localStorage.token,
                target_type: 'trade',
                target_idx: SELECTED_SYMBOL,
                subscribe_type: 'like',
            },
            success: (r) => {
                if (r && r.success && r.payload) {
                    if (r.payload.added == "Y") {
                        $(this).addClass("btn--star--on").removeClass("btn--star")
                        $('[name=btn_view_stat]').addClass("btn--star--on").removeClass("btn--star")
                        $('[data-star-idx="'+SELECTED_SYMBOL+'"]').addClass("btn--star--on").removeClass("btn--star")
                    } else {
                        $(this).addClass("btn--star").removeClass("btn--star--on")
                        $('[name=btn_view_stat]').addClass("btn--star").removeClass("btn--star--on")
                        $('[data-star-idx="'+SELECTED_SYMBOL+'"]').addClass("btn--star").removeClass("btn--star--on")
                    }
                }
            }
        })
    })

	$("[name=btn_view_list]").on('click',function(){
		$(".side--panel").show();
		$(".details").hide();
        //너비가 맞지 않아 resize 하는 기능 추가
        var bodywidth = $('.dataTables_scrollBody').width();
		$('.dataTables_scrollHeadInner').css('width', bodywidth);
	})

    $("[name=bbb]").on('click', function() {
        alert('fasdf');
    })

    const genVolumeData = (data) => {
        let previous_close = 0

        const rdata = data.map((row) => {
            const price_decrease_color = 'rgba(255,82,82, 0.6)'; // 종가 상승시 거래량 색
            const price_increase_color = 'rgba(82, 82, 255, 0.6)'; // 종가 하락시 거래량 색
            const price_color = previous_close <= row.close ? price_increase_color : price_decrease_color;
            previous_close = row.close;

            return {
                'time': row.time,
                'value': row.volume * 1,
                'color': price_color
            }
        })

        return rdata;
    }

    const mergeTickToBar = (price) => {
        const bar = {
            time: price.time,
            open: price.open,
            high: price.high,
            low: price.low,
            close: price.close,
            volume: price.volume
        }

        return bar
    }

    /**
     * #TODO: https://jsfiddle.net/TradingView/yozeu6k1/ 참고해서 실시간 업데이트 구현
     */
    var height = 300
   	// const sidePanelWidth = $('.side--panel').width()
    const periodList = [
        { text: '1'+__('분'), value: '1m' },
        { text: '3'+__('분'), value: '3m' },
        // { text: '3'+__('분'), value: '3m' },
        { text: '5'+__('분'), value: '5m' },
        { text: '10'+__('분'), value: '10m' },
        { text: '15'+__('분'), value: '15m' },
        { text: '1'+__('시간'), value: '1h' },
        { text: '12'+__('시간'), value: '12h' },
        { text: '1'+__('일'), value: '1d' },
        { text: '1'+__('주'), value: '1w' },
    ]
    periodList.map((period) => {
        $('#period').dropdown('add', period )
    })
    $('#period').dropdown('select', '1d')
    $('#period').on('change', (event, text) => {
        let period;

        period = text.replaceAll('주', 'w')
        period = text.replaceAll('일', 'd')
        period = text.replaceAll('시간', 'h')
        period = text.replaceAll('분', 'm')

        // clearTimeout(CHART_TIMER)

        genChartLine();

	switch (SELECTED_GRADE) {
	case 'S':
		API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'S', (resp) => {
			$('.details').removeClass('loading')
			if (resp.success && resp.payload) {
				displayChartLine('S', resp.payload);
			}
		})
	break;
	case 'A':
		API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'A', (resp) => {
			$('.details').removeClass('loading')
			if (resp.success && resp.payload) {
				displayChartLine('A', resp.payload);
			}
		})
	break;
	case 'B':
		API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'B', (resp) => {
			$('.details').removeClass('loading')
			if (resp.success && resp.payload) {
				displayChartLine('B', resp.payload);
			}
		})
	break;
	}    
	    
        //API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'S', (resp) => {
        //    $('.details').removeClass('loading')
        //    if (resp.success && resp.payload) {
        //        displayChartLine('S', resp.payload);
        //    }
        //})
        //API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'A', (resp) => {
        //    $('.details').removeClass('loading')
        //    if (resp.success && resp.payload) {
        //        displayChartLine('A', resp.payload);
        //    }
        //})
        //API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'B', (resp) => {
        //    $('.details').removeClass('loading')
        //    if (resp.success && resp.payload) {
        //        displayChartLine('B', resp.payload);
        //    }
        //})

        // API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, SELECTED_GRADE,(resp) => {
        //     $('.details').removeClass('loading')

        //     if(resp.success) {
        //         displayChart(resp.payload)
        //     } else {
        //         alert(resp.error.message)
        //     }
        // })

        // CHART_TIMER = setTimeout(() => {
        //     API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, SELECTED_GRADE,(resp) => {
        //         $('.details').removeClass('loading')

        //         if(resp.success) {
        //             updateChart(resp.payload)
        //         } else {
        //             alert(resp.error.message)
        //         }
        //     })
        // }, 10000)

        // API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, SELECTED_GRADE,(resp) => {
        //     displayChart(resp.payload, period)
        // })
    })
    const period = $('#period').dropdown('selected');


    const covertLineChartRowData = (row) => {
        const [date, open, high, low, close, volume] = row.split('\t');
        return {
            'time': new Date(`${date}`).getTime() / 1000,
            'value': close * 1
        }
    }
    const getLineChartData = (data) => {
        return data ? data.split('\n').slice(1).map((row, index) => {
            return covertLineChartRowData(row);
        }) : [];
    }

    let chart = null;
    const genChartLine = () => {
        // 범례 숨기기
        $('#legend_s_grade').hide();
        $('#legend_a_grade').hide();
        $('#legend_b_grade').hide();
        
        // 차트 대상 아이디
        const target_id = 'tvchart';
        // ---------------------------------------------------
        // 차트 생성
        const container = document.getElementById(target_id)
        $(container).empty();
        chart = LightweightCharts.createChart(container, {
            width: $('.details').width(),
            height: height,
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
        })
        // ---------------------------------------------------
        // 반응형처리
        $(window).resize(function() {
            chart.applyOptions({
            //230324 chart 모바일 크기 수정
            //width: $('#'+target_id).outerWidth(),
            width: Math.floor(window.innerWidth / 100)*100,
            height: $('#'+target_id).outerHeight()
	    });    
	});
    }
    genChartLine();


    /**
     * 라인 차트를 그립니다.
     * 처음 화면에 라이 차트를 만들어 그려 넣습니다.
     */
    const displayChartLine = async (grade, data) => {
        
        // ---------------------------------------------------
        // 라인 차트 생성
        switch (grade) {
            case 'S':
                if (data) {
                    window.lineSeries_S = chart.addLineSeries({
                        color: '#333333',
                        lineWidth: 2,
                    });
                    window.lineSeries_S.setData(getLineChartData(data));
                    //$('#legend_s_grade').show();
			
			window.lineSeries_S.applyOptions({
					priceScale: {
						autoScale: true,
					},
					priceFormat: { // price format - y축
						type: 'custom',
						minMove: 500,
						formatter: function(f){
							return f
						}
						
					},
	                })
                }
                break;
            case 'A':
                if (data) {
                    window.lineSeries_A = chart.addLineSeries({
                        color: '#333333',
                        lineWidth: 1,
                    });
                    window.lineSeries_A.setData(getLineChartData(data));
                    //$('#legend_a_grade').show();
			
			window.lineSeries_A.applyOptions({
					priceScale: {
						autoScale: true,
					},
					priceFormat: { // price format - y축
						type: 'custom',
						minMove: 500,
						formatter: function(f){
							return f
						}
						
					},
	                })
                }
                break;
            case 'B':
                if (data) {
                    window.lineSeries_B = chart.addLineSeries({
                        color: '#333333',
                        lineWidth: 1,
                    });
                    window.lineSeries_B.setData(getLineChartData(data));
                    //$('#legend_b_grade').show();
					
		    window.lineSeries_B.applyOptions({
					priceScale: {
						autoScale: true,
					},
					priceFormat: { // price format - y축
						type: 'custom',
						minMove: 500,
						formatter: function(f){
							return f
						}
						
					},
	                })	
                }
                break;
        }

        // ---------------------------------------------------
        // 차트 스케일 맞춤
        chart.timeScale().fitContent();
	    
	    //mk y축 변경 및 x축 표기 변경
	    chart.applyOptions({
		priceScale: {
			autoScale: true,
		},
		priceFormat: { // price format - y축
			type: 'custom',
			//minMove: 0.5,
			formatter: function(f){
				return f
			}
		},
		timeScale: { // time format - x축
		//barSpacing: 100, // 그래프 사이의 간격
			tickMarkFormatter: (time, tickMarkType, locale) => {
				const t = new Date(time * 1000);
				const dateStr = ((t.getMonth() + 1 + 100).toString().substring(1)) + '/' + ((t.getDate() * 1 + 100).toString().substring(1));
				return dateStr;
			}
		},
	});

    }

    /**
     * 라인 차트를 갱신합니다. 
     * @param {*} grade 등급
     * @param {*} data 차트데이터. API에서 받은값 그대로 전달 하면 됩니다.
     */
    const updateChartLine = (grade, data) => {
        series_name = 'lineSeries_' + (grade).toUpperCase();
        const last_data = covertLineChartRowData(data.split('\n').pop());
        if(last_data) window[series_name].update(last_data)
    }


    const displayChart = async (data) => {
        const cdata = data.split('\n').slice(1).map((row, index) => {
            const [date, open, high, low, close, volume] = row.split('\t');
            return {
                'time': new Date(`${date}`).getTime() / 1000,
                'open': open * 1,
                'high': high * 1,
                'low': low * 1,
                'close': close * 1,
                'volume': volume * 1,
            }
        })

        // 차트 대상 아이디
        const target_id = 'tvchart';

        // 차트 생성
        const container = document.getElementById(target_id)
        $(container).empty();
        const chart = LightweightCharts.createChart(container, {
            width: $('.details').width(),
            height: height,
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
        })
        
        // ---------------------------------------------------
        // 반응형처리
        $(window).resize(function() {
            chart.applyOptions({
            //230324 chart 모바일 크기 수정
            //width: $('#'+target_id).outerWidth(),
            width: Math.floor(window.innerWidth / 100)*100,
            height: $('#'+target_id).outerHeight()
            });
        });
  
        // ---------------------------------------------------
        // 가격봉 차트 생성
        var candleSeries = chart.addCandlestickSeries({
            'upColor': '#f00', 'borderUpColor': '#f00', 'wickUpColor': '#f00', // https://tradingview.github.io/lightweight-charts/docs/api/interfaces/CandlestickStyleOptions
            'downColor':'#00f', 'borderDownColor': '#00f', 'wickDownColor': '#00f',
        })
        $(container).data('candleSeries', candleSeries);
    
        // 거래량 차트 생성
        var volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {type: 'volume',},
            priceScaleId: '',
            scaleMargins: {top: 0.8,bottom: 0,},
        })
        $(container).data('volumeSeries', volumeSeries);

        // ---------------------------------------------------
        // 데이터 추가 
        //var data = await getData(); // 날짜,시간,시,고,저,종,거래량
        candleSeries.setData(cdata); // 봉차트 데이터 추가
        volumeSeries.setData(genVolumeData(cdata)) // 거래량 차트 데이터 추가

        // ---------------------------------------------------
        // MA 생성 
        addSMAtoChart(cdata, 10, '#F00');
        addSMAtoChart(cdata, 30, '#0F0');
        addSMAtoChart(cdata, 90, '#00F'); 

        function addSMAtoChart(data, cnt, color, line_width) {
            var smaData = calculateSMA(data, cnt);
            var smaLine = chart.addLineSeries({
                'color': color||'rgba(4, 111, 232, 1)',
                'lineWidth': line_width||1,
            });
            smaLine.setData(smaData);
        }

        function calculateSMA(data, count) {
            var avg = function(data) {
                var sum = 0;
                for (var i = 0; i < data.length; i++) {
                    sum += data[i].close;
                }
                return sum / data.length;
            };
            var result = [];
            for (var i=count - 1, len=data.length; i < len; i++){
                var val = avg(data.slice(i - count + 1, i));
                result.push({ time: data[i].time, value: val});
            }
            return result;
        }

        function fillBarsSegment(left, right, points) {
            var deltaY = right.price - left.price;
            var deltaX = right.index - left.index;
            var angle = deltaY / deltaX;
            for (var i = left.index; i <= right.index; i++) {
                var basePrice = left.price + (i - left.index) * angle;
                var openNoise = (0.1 - Math.random() * 0.2) + 1;
                var closeNoise = (0.1 - Math.random() * 0.2) + 1;
                var open = basePrice * openNoise;
                var close = basePrice * closeNoise;
                var high = Math.max(basePrice * (1 + Math.random() * 0.2), open, close);
                var low = Math.min(basePrice * (1 - Math.random() * 0.2), open, close);
                points[i].open = open;
                points[i].high = high;
                points[i].low = low;
                points[i].close = close;
            }
        }

        function generateControlPoints(res, period, dataMultiplier) {
            var time = period !== undefined ? period.timeFrom : { day: 1, month: 1, year: 2018 };
            var timeTo = period !== undefined ? period.timeTo : { day: 1, month: 1, year: 2019 };
            var days = getDiffDays(time, timeTo);
            dataMultiplier = dataMultiplier || 1;
            var controlPoints = [];
            controlPoints.push({ index: 0, price: getRandomPrice() * dataMultiplier });
            for (var i = 0; i < days; i++) {
                if (i > 0 && i < days - 1 && Math.random() < 0.05) {
                    controlPoints.push({ index: i, price: getRandomPrice() * dataMultiplier });
                }
                res.push({ time: time });
                time = nextBusinessDay(time);
            }
            controlPoints.push({ index: res.length - 1, price: getRandomPrice() * dataMultiplier });
            return controlPoints;
        }

        function getDiffDays(dateFrom, dateTo) {
            var df = convertBusinessDayToUTCTimestamp(dateFrom);
            var dt = convertBusinessDayToUTCTimestamp(dateTo);
            var diffTime = Math.abs(dt.getTime() - df.getTime());
            return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        function convertBusinessDayToUTCTimestamp(date) {
            return new Date(Date.UTC(date.year, date.month - 1, date.day, 0, 0, 0, 0));
        }

        function nextBusinessDay(time) {
            var d = convertBusinessDayToUTCTimestamp({ year: time.year, month: time.month, day: time.day + 1 });
            return { year: d.getUTCFullYear(), month: d.getUTCMonth() + 1, day: d.getUTCDate() };
        }

        function getRandomPrice() {
            return 10 + Math.round(Math.random() * 10000) / 100;
        }
    }
    const updateChart = async (data) => {
        const cdata = data.split('\n').slice(1).map((row, index) => {
            const [date, open, high, low, close, volume] = row.split('\t');
            candleSeries.update({
                'time': new Date(`${date}`).getTime() / 1000,
                'open': open * 1,
                'high': high * 1,
                'low': low * 1,
                'close': close * 1,
                'volume': volume * 1,
            })
        })
    }

    // Datatables 에러 끄기
    $.fn.dataTable.ext.errMode = 'none'

    $.extend( $.fn.dataTable.defaults, {
        responsive: true,
        lengthChange: false,
        select: true,
        info: false,
        paging: false,
        searching: false,
        ordering: true,
        "language": {
            "emptyTable": __("데이터가 없음"),
            "lengthMenu": __("페이지당 _MENU_ 개씩 보기"),
            "info": __("현재 _START_ - _END_ / _TOTAL_건"),
            "infoEmpty": "",
            "infoFiltered": "( "+__("_MAX_건의 데이터에서 필터링됨")+" )",
            "search": __("검색")+": ",
            "zeroRecords": __("데이터가 없음"),
            "loadingRecords": __("로딩중..."),
            "processing": '<img src="/template/vwyx3Z/script/plug_in/loading/loading.gif"> '+__('잠시만 기다려 주세요.')+'',
            "paginate": {
                "next": __("다음"),
                "previous": __("이전")
            }
        },
    } )


    const buyGrid = $('#buyGrid').DataTable({
        processing: false,
        serverSide: true,
        paging: true,
        scrollY: 308,
        deferRender: true,
        scroller: true,
	    autoWidth: false,
        ajax: {
            url: `${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=buy&status=unclose`,
            type: 'POST',
            dataSrc: 'payload',
        },
        columns : [
            {
                data: 'orderid'
                // (_d, _type, _row, meta) => {
                //     const api = new $.fn.dataTable.Api( '#buyGrid' )
                //     const pageInfo = api.page.info()
                //     // return pageInfo.length - meta.row + 1
                //     // return meta.row + 1
                //     return _d.orderid;
                // }
		, width: '15%'
            },
            // {
            //     data: () => {
            //         return __('삽니다')
            //     }
            // },
            // 등록일
            {
                data: 'time_order', render: (timestamp) => {
                    return date('Y-m-d H:i', timestamp);
                    // const date = new Date(timestamp * 1000)
                    // return date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0')
                }, width: '20%'
            },
            {
                data: 'goods_grade', render: (goods_grade) => {
                    return goods_grade;
                }, width: '15%'
            },
            // 가격
            {
                data: 'price', render: (price) => {
                    return real_number_format(price);
                }, width: '20%'
            },
            // 수량
            {
                data: 'volume_remain', render: (volume_remain) => {
                    return number_format(volume_remain, 0);
                }, width: '12%'
            },
            // 거래금액
            //{
            //    data: 'amount_remain', render: (amount_remain) => {
            //        return real_number_format(amount_remain);
            //    }
            //},
            // // 상태
            // {
            //     data: 'status', render: (status, _type, _row) => {
            //         switch(status) {
            //             case 'close':
            //                 return __('판매완료')
            //             case 'buy':
            //                 return __('구매완료')
            //             case 'trading':
            //                 return __('거래중')
            //             case 'open':
            //                 return __('대기')
            //         }
            //     }
            // },
            { data: (d) => {
				const price = d.price
				const exchange = d.exchange
				// const volume = d.volume
				const volume_remain = d.volume_remain
				const orderid = d.orderid
				const goods_grade = d.goods_grade

                let cookie_check = $.cookie(Model.user_info.userid)
                let btn = ''

                if (Model.user_info.userno == d.userno) {
                    btn = '<button type="button" class="btn btn btn--cancal" data-symbol="' + SELECTED_SYMBOL + '" data-orderid="' + orderid + '" data-goods_grade="' + goods_grade + '" style="width: 90px; height: 35px; line-height: 25px; font-size: 13px" >'+__('취소')+'</button>'

                } else if (Model.user_info.userno !== d.userno && cookie_check === Model.user_info.userno) {
                    btn = '<button type="button" class="btn btn--blue btn" data-toggle="modal" data-symbol="' + SELECTED_SYMBOL + '" data-exchange="' + exchange + '" data-volume="' + volume_remain + '" data-price="' + price + '" data-orderid="' + orderid + '" data-goods_grade="' + goods_grade + '" data-target="#modal-sell-direct" style="width: 90px; height: 35px; line-height: 25px; font-size: 13px">'+__('판매')+'</button>'
                }
                else {
                    btn = '<button type="button" class="btn btn--blue btn" data-toggle="modal" data-symbol="' + SELECTED_SYMBOL + '" data-exchange="' + exchange + '" data-volume="' + volume_remain + '" data-price="' + price + '" data-orderid="' + orderid + '" data-goods_grade="' + goods_grade + '" data-target="#modal-sell-direct-pin" style="width: 90px; height: 35px; line-height: 25px; font-size: 13px">'+__('판매')+'</button>'

                }

                return btn
            	}, width: '18%'
	    },
        ],
        columnDefs: [
            {
                searchable: false,
                orderable: false,
                targets: 0
            },
            // {
            //     targets: '_all',
            //     orderable: false,
            //     className: 'dt-head-center',
            // },
            {
                targets: 1,
                className: 'dt-body-center',
                type: 'title-string',
                orderable: false,

            },
            {
                targets: 2,
                className: 'dt-body-center',
                type: 'any-number',
                orderable: false,

            },
            {
                targets: 3,
                className: 'dt-body-right text-right',
                type: 'any-number',
                orderable: false,
                responsivePriority: 1,

            },
            {
                targets: 4,
                className: 'dt-body-right text-right',
                type: 'any-number',
                orderable: false,
                responsivePriority: 1,

            },
            {
                targets: 5,
                className: 'dt-body-right text-right',
                orderable: false,
                responsivePriority: 1,

            },
            // {
            //     targets: 6,
            //     className: 'dt-body-center',
            //     orderable: false,
            // },
            {
                targets: -1,
                className: 'dt-body-center',
                orderable: false,
                responsivePriority: 1
            }
        ],
        "order": [ [3, 'desc'] ] // 가격 고가부터
    })

    const sellGrid = $('#sellGrid').DataTable({
        processing: false,
        serverSide: true,
        paging: true,
        scrollY: 308,
        deferRender: true,
        scroller: true,
	autoWidth: false,
        ajax: {
            url: `${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=sell&status=unclose`,
            type: 'POST',
            dataSrc: 'payload',
        },
        columns : [
            {
                data: 'orderid'
                //  (_d, _type, _row, meta,) => {
                //     return _d.orderid;
                //     const api = new $.fn.dataTable.Api( '#sellGrid' )
                //     const pageInfo = api.page.info()
                //     if(!meta) {
                //         return
                //     }
                //     // return pageInfo.length - meta.row + 1 // 역순(점점작게)
                //     // return meta.row+1 // 정순(점점크게)
                // }
		, width: '15%'
            },
            // {
            //     data: () => {
            //         return __('팝니다')
            //     }
            // },
            // 등록일
            {
                data: 'time_order', render: (timestamp) => {
                    return date('Y-m-d H:i', timestamp);
                    // const date = new Date(timestamp * 1000)
                    // return date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0')
                }, width: '20%'
            },
            {
                data: 'goods_grade', render: (goods_grade) => {
                    return goods_grade;
                }, width: '15%'
            },
            // 가격
            {
                // data: 'price', render: DataTable.render.number( null, null, 0, '' )
                data: 'price', render: (price) => {
                    return real_number_format(price);
                }, width: '20%'
            },
            // 수량
            {
                data: 'volume_remain', render: (volume_remain) => {
                    return number_format(volume_remain, 0);
                }, width: '12%'
            },
            // 거래금액 - price * volume_remain을 해야 하는데 남은 수량이 바뀔때마다 계산해서 정렬을 해줘야 해서 숨깁니다.
            //{
            //    data: 'amount_remain', render: (amount_remain) => {
            //        return real_number_format(amount_remain);
            //    }
            //},
            // // 상태
            // {
            //     data: 'status', render: (status, _type, _row) => {
            //         switch(status) {
            //             case 'close':
            //                 return __('판매완료')
            //             case 'buy':
            //                 return __('구매완료')
            //             case 'trading':
            //                 return __('거래중')
            //             case 'open':
            //                 return __('대기')
            //         }
            //     }
            // },
            {
                data: (d) => {
                const price = d.price
                const exchange = d.exchange
                const volume_remain = d.volume_remain
                const orderid = d.orderid
                const goods_grade = d.goods_grade

                let cookie_check = $.cookie(Model.user_info.userid)
                let btn = '';
                if (Model.user_info.userno == d.userno) {
                    btn = '<button type="button" class="btn btn btn--cancal" data-symbol="' + SELECTED_SYMBOL + '" data-orderid="' + orderid + '" data-goods_grade="' + goods_grade + '" style="width: 90px; height: 35px; line-height: 25px; font-size: 13px" >'+__('취소')+'</button>'

                } else if (Model.user_info.userno !== d.userno && cookie_check === Model.user_info.userno){
                    btn = '<button type="button" class="btn btn--red btn" data-toggle="modal" data-symbol="' + SELECTED_SYMBOL + '" data-exchange="' + exchange + '" data-price="' + price + '" data-volume="' + volume_remain + '" data-orderid="' + orderid + '" data-goods_grade="' + goods_grade + '" data-target="#modal-buy-direct" style="width: 90px; height: 35px; line-height: 25px; font-size: 13px">'+__('구매')+'</button>'
                }else {
                    btn = '<button type="button" class="btn btn--red btn" data-toggle="modal" data-symbol="' + SELECTED_SYMBOL + '" data-exchange="' + exchange + '" data-price="' + price + '" data-volume="' + volume_remain + '" data-orderid="' + orderid + '" data-goods_grade="' + goods_grade + '" data-target="#modal-buy-direct-pin" style="width: 90px; height: 35px; line-height: 25px; font-size: 13px">'+__('구매')+'</button>'

                }
                return btn
            	}, width: '18%'
	    },
        ],
        columnDefs: [
            {
                searchable: false,
                orderable: false,
                targets: 0,
            },
            // {
            //     targets: '_all',
            //     className: 'dt-head-center',
            //     orderable: false,
            // },
            {
                targets: 1,
                className: 'dt-body-center',
                type: 'title-string',
                orderable: false,
            },
            {
                targets: 2,
                className: 'dt-body-center',
                type: 'any-number',
                orderable: false,
                responsivePriority: 1,
            },
            {
                targets: 3,
                className: 'dt-body-right text-right',
                type: 'any-number',
                orderable: true,
                responsivePriority: 1,
            },
            {
                targets: 4,
                className: 'dt-body-right text-right',
                type: 'any-number',
                orderable: false,
                responsivePriority: 1,
            },
            {
                targets: 5,
                className: 'dt-body-right text-right',
                orderable: false,
                responsivePriority: 1,
            },
            // {
            //     targets: 6,
            //     className: 'dt-body-center',
            //     orderable: false,
            // },
            {
                targets: -1,
                className: 'dt-body-center',
                orderable: false,
                responsivePriority: 1
            }
        ],
        order: [[3, 'asc']], // 가격 저가부터

    })


    $(document).on('click', ".btn--cancal", function(e) {
        e.preventDefault();

        API.orderCancel($(this).data('symbol'), $(this).data('orderid'), $(this).data('goods_grade'), (resp) => {
            if (resp.success) {
                $('#sellGrid').DataTable().ajax.reload(null, false);
                $('#buyGrid').DataTable().ajax.reload(null, false);
            }
        })
	set_user_wallet();
	getTradeItems($('.tabs li.tab--active [name=tab_item]').attr('data-target'));
	set_user_wallet();
    })

    $('.details .tabs').on('beforeShow', (_event, _index, target) => {
        const cnt_sellable = USER_WALLET[gen_user_wallet_key(SELECTED_SYMBOL,SELECTED_GOODS_GRADE)]?.confirmed || 0;
        let cookie_check = $.cookie(Model.user_info.userid);

        if(PIN_NUMBER_ON <1) {
            if(cookie_check === Model.user_info.userno){
                $('#modal-buy-button').attr('data-target','#modal-buy-pin');
                //console.log('3333333 : ' + PIN_NUMBER_ON);
            }else{
                $('#modal-buy-button').attr('data-target','#modal-sell-pin');
            }
        }else{
            $('#modal-buy-button').attr('data-target','#modal-buy-pin');
        }
            
        const tabContainer = document.querySelector('.tab-container');
        tabContainer.style.paddingBottom = '0px';
        if(target === '#tab-sell') {
            sellGrid.ajax.url(`${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=sell&status=unclose`)
            sellGrid.clear().load()
        } else if ( target === '#tab-buy') {
            buyGrid.ajax.url(`${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=buy&status=unclose`)
            buyGrid.clear().load()
        } else if( target === '#tab-info'){ 
            if (window.innerWidth < 800 && window.innerWidth >= 680) {
                tabContainer.style.paddingBottom = '100px';
            } else if(window.innerWidth < 680 && window.innerWidth >= 520) {
                tabContainer.style.paddingBottom = '150px';
            } else if(window.innerWidth < 520 && window.innerWidth >= 440) {
                tabContainer.style.paddingBottom = '190px';
            } else if(window.innerWidth < 440 && window.innerWidth >= 1) {
                tabContainer.style.paddingBottom = '280px';
            }
        }
    })

    const itemGrid = $('#jqGrid')
    .on('init.dt', function (_e, _settings) {
        const api = new $.fn.dataTable.Api( '#jqGrid' );
        if(isMobile) {
            // api.column(1).visible(false)
        }
    })
    .on('responsive-resize', function () {
        const api = new $.fn.dataTable.Api( '#jqGrid' );

        if(isMobile) {
            // api.column(1).visible(false)
        } else {
            // api.column(1).visible(true)
        }
    })
    // 그리드를 비선택하면
    .on('deselect.dt', function (_e, row, type, indexes) {
    })
    // 그리드를 선택하면
    .on('select.dt', function (_e, row, type, indexes) {
        // console.log('select.dt');
        window.selected_row = indexes;
        if ( type === 'row' ) {

			/*if(isMobile) {
				$(".side--panel").hide();
				$(".details").show();
			} else {
				$(".side--panel").show();
				$(".details").show();
			}*/

            const data = row.data()
            
            // console.log('select.dt === data:', data);

            const { name, symbol, exchange, type, meta_division, producer, production_date, origin, icon_url, scent, taste } = data
            // console.log(data);
            const { weight, story } = data
            const { keep_method } = data
            const { teamaster_note, producer_note }= data
            const { grade } = data
            const { animation } = data

            if (!symbol || !exchange) {
                return false;
            }

            SELECTED_SYMBOL = symbol
            SELECTED_EXCHANGE = exchange
            SELECTED_NAME = name
            SELECTED_GRADE = data.goods_grade
	        SELECTED_GOODS_GRADE = SELECTED_GRADE
            // console.log('SELECTED_GRADE:', SELECTED_GRADE);
            $("#buy_price").val(data.price);
            $("#buy_val").val(1);
            $("#sell_price").val(data.price);
            $("#buy_val").val(1);

            // 로딩 애니메이션 출력
            //$('.details').addClass('loading')
            // console.log(SELECTED_SYMBOL, SELECTED_EXCHANGE);

            genChartLine();

            let period = $('#period').dropdown('selected');

	    switch (SELECTED_GRADE) {
		case 'S':
			API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'S', (resp) => {
				$('.details').removeClass('loading')
				if (resp.success && resp.payload) {
				displayChartLine('S', resp.payload);
			}
		})
		break;
		case 'A':
			API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'A', (resp) => {
				$('.details').removeClass('loading')
				if (resp.success && resp.payload) {
					displayChartLine('A', resp.payload);
				}
			})
		break;
		case 'B':
			API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'B', (resp) => {
				$('.details').removeClass('loading')
				if (resp.success && resp.payload) {
					displayChartLine('B', resp.payload);
				}
			})
		break;
	    }
		
            //API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'S', (resp) => {
            //    $('.details').removeClass('loading')
            //    if (resp.success && resp.payload) {
            //        displayChartLine('S', resp.payload);
            //    }
            //})
            //API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'A', (resp) => {
            //    $('.details').removeClass('loading')
            //    if (resp.success && resp.payload) {
            //        displayChartLine('A', resp.payload);
            //    }
            //})
            //API.getChartData(SELECTED_SYMBOL, SELECTED_EXCHANGE, period, 'B', (resp) => {
            //    $('.details').removeClass('loading')
            //    if (resp.success && resp.payload) {
            //        displayChartLine('B', resp.payload);
            //    }
            //})
            

            API.getSpotPrice(SELECTED_SYMBOL, SELECTED_EXCHANGE, SELECTED_GRADE, (resp) => {

                if(resp.success && resp.payload[0]) {
                    const spot = resp.payload[0];
                    spot.price_low = spot.price_low > data.price_open ? data.price_open : spot.price_low;

                    // 최고가
                    $('#highest-price').text(real_number_format(spot.price_high))
                    // 최저가
                    $('#lowest-price').text(real_number_format(spot.price_low))
                    
					//거래량
					$('#spot-volume').text(spot.volume.format())

					//거래대금
					$('#spot-volume2').text(asianUintNumber((parseFloat(spot.price_close/2) * parseFloat(spot.volume))))

                    SELECTED_SYMBOL_PRICE = parseFloat(spot.price_close).toFixed(2)
                    // console.log('data:', data);
                    const diff = (data.price - data.price_open).toFixed(2)
                    const diffRate = ((data.price - data.price_open) / data.price_open).toFixed(4)
                    const diffPercent = Math.abs(diffRate * 100).toFixed(2)
                    const diff_sign = diff > 0 ? '+' : (diff < 0 ? '-' : '');
                    const diff_text = diff > 0 ? 'text-red' : (diff < 0 ? 'text-blue' : '');
                    const diff_icon = diff > 0 ? './assets/img/icon/icon-up.svg' : (diff < 0 ? './assets/img/icon/icon-down.svg' : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAQAAADa613fAAAAaklEQVR42u3PMREAAAgEID+50TWCuwcNyHS9EBERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRywL1OpWdVwPKBwAAAABJRU5ErkJggg==');

                    $('.details--price').html('' + parseFloat(data.price).toFixed(2).format() + ' '+SELECTED_EXCHANGE+'').removeClass('text-red text-blue').addClass(diff_text)
                    $('.details--diffPercent').text( diff_sign + diffPercent + '%').removeClass('text-red text-blue').addClass(diff_text)
                    $('#spot-diff').text(diff.format()).removeClass('text-red text-blue').addClass(diff_text)
                    $('#spot-diff').siblings('img').attr('src', diff_icon)
                } else {
                    const msg = resp.error && resp.error.message ? resp.error.message : '';
                    if(msg) alert(msg)
                }
            })

            // $('.tab--sell').click()
            $('.details .tabs li.tab--active').click()

            $('.tea--name').text(name) // .details--header 
            $('#tab-info .certificate').text(data.meta_certification_mark_name)
	    $('#tab-info .meta_wp_teamaster_note').text(data.content)
            $('#tab-info [name=meta_wp_teamaster_note]').text(data.meta_wp_teamaster_note)
            // 상품사진
            $('#tab-info img').attr('src', data.main_pic)
            // 원산지
            $('#white-paper [name=origin]').val(origin)
            $('#white-paper [name=producer]').val(producer)
            //생산
            $('#white-paper [name=production_date]').val(production_date)
            // 맛
            $('#white-paper #taste').html(nl2br(taste))
            // 향
            $('#white-paper #scent').val(scent)
            $('#white-paper #weight').val(weight)
            $('#white-paper #keep-method').html(nl2br(keep_method))
            $('#white-paper #story').html(nl2br(story))
            $('#white-paper #teamaster-note').html(nl2br(teamaster_note))
            $('#white-paper #producer-note').html(nl2br(producer_note))
            $('#white-paper #grade').html(nl2br(grade))

            // 백서
            for (i in data) {
                if (i.indexOf('meta_') === 0) {
                    $('#white-paper input[name='+i+'], #tab-info input[name='+i+']').val(data[i])
                    $('#white-paper [name='+i+'], #tab-info [name='+i+']').html(nl2br(data[i]))
                }
            }

            if (animation) {
                const isYoutube = animation.match(/^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/)
                const scanEmbbed = isYoutube ? $('<iframe />').attr('src', animation).attr('frameborder', 0).attr('allowfullscreen', true) : $('<img />').attr('src', animation)
                $('button[data-target="#scan"]').attr('disabled', false)
                $('#scan .modal--body').empty().append(scanEmbbed)
            } else {
                $('button[data-target="#scan"]').attr('disabled', true)
            }

            if (data.like == "Y") {
                $("[name='btn_view_stat']").addClass("btn--star--on").removeClass("btn--star")
            } else if (data.like == "N") {
                $("[name='btn_view_stat']").addClass("btn--star").removeClass("btn--star--on")
            }
        }
		$('#right_buy').click();
		trade_list();
    })
    .on('draw.dt', () => {
    
        const api = new $.fn.dataTable.Api( '#jqGrid' );
        const REQUEST_SYMBOL = getURLParameter('symbol')
        const ROWS_COUNT = api.rows().data().length

        if(REQUEST_SYMBOL) {
            for(let i = 0; i < ROWS_COUNT; i++) {
                const row = api.row(i).data()
                const symbol = row.symbol
                if(REQUEST_SYMBOL === symbol) {
                    api.row(i).select()
                    break
                }
            }
        } else {
            // api.row(ROWS_COUNT-1).select() // 마지막 선택
			if(isMobile) {
                //$(".side--panel").show();
				//$(".details").hide();
            } else {
                row_no = window.selected_row ? window.selected_row : null;
                api.row(row_no).select() // 첫번째 선택, 모바일에서는 목록만 먼저 나와야 해서 선택 안합니다.
            }
        }
    
    })
    .DataTable({
        data: [],
        scrollY: 820,
        scroller: true,
        deferRender: true,
        processing: false,
        columns: [
            {
                data: 'name',
                render: (data, _type, row) => {
                    const classOn = row.like == 'Y' ? 'btn--star--on' : 'btn--star'
                    // 버튼
                    if (isMobile) {
                        return `<button type="button" class="btn ${classOn}" data-star-idx="${row.idx}"></button><span id="item_name" onclick="mobile_title_click()">${data}</span>`
                    }else{
	                    return `<button type="button" class="btn ${classOn}" data-star-idx="${row.idx}"></button><span id="item_name">${data}</span>`
					}
                }
            },
            // 등급
            // { data: 'meta_type', render: (data, _type, row) => { return data ? data : '' } },
            { 
                data: 'display_grade',
                render: (data, _type, row)=> {
                      return `<span onclick="mobile_title_click()">${data}</span>`
                }
            },
            // 생산년도
            { 
                data: 'meta_wp_production_date', 
                render: (data, _type, row) => { 
                    if (isMobile) {
                        return `<span onclick="mobile_title_click()">${data}</span>`
                    }else{
                        return data ? data : '' 
					}
                   
                } 
            },
            // 현재가
            {
                data: 'price', responsivePriority: 1, render: (data, _type, row) => {
                    const diff = row.price_close - row.price_open

                    if (typeof (Intl) !== 'undefined') {
                        return diff > 0 ? ('<span class="text-red text-bold" onclick="mobile_title_click()">' + new Intl.NumberFormat('ko-KR').format(row.price_close) + '</span>') : diff < 0 ? ('<span class="text-blue text-bold">' + new Intl.NumberFormat('ko-KR').format(row.price_close) + '</span>') : '<span class="text-bold" onclick="mobile_title_click()">' + new Intl.NumberFormat('ko-KR').format(row.price_close) + '</span>'
                    }
        
                    return '<span class="text-red text-bold" onclick="mobile_title_click()">' + real_number_format(row.price_close) + '</span>'
                }
            },
            // 전일대비
            {
                data: (row, _type, _set) => {
                    // console.log('전일대비 row.price:', row.price);  
                    // console.log('전일대비 row.price_open:', row.price_open);  
                    row.price = row.price*1
                    row.price_open = row.price_open*1
                    const diff = row.price > 0 && row.price > 0 ? (row.price - row.price_open) / row.price_open * 100 : 0;
                    if (typeof (Intl) !== 'undefined') {
                        return diff > 0 ? ('<span class="text-red text-bold" onclick="mobile_title_click()">+' + new Intl.NumberFormat('ko-KR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(diff) + '%</span>') : diff < 0 ? ('<span class="text-blue text-bold" onclick="mobile_title_click()">' + new Intl.NumberFormat('ko-KR').format(diff) + '%</span>') : '<span class="text-bold" onclick="mobile_title_click()">' + new Intl.NumberFormat('ko-KR').format(diff) + '%</span>'
                    }
                    return '<span class="text-red text-bold" onclick="mobile_title_click()">' + real_number_format(diff) + '</span>'
                }
            },
            // 거래대금
            {
                data: (row, _type, _set) => {
                    let price = row.price
                    if (price >= 100000000 && price < 1000000000000 ) {
                        price = price / 100000000 + __('억')
                    } else if (price >= 10000 && price < 100000000) {
                        price = price / 10000 + __('만')
                    } else {
                        price = price + __('원')
                    }

                    if (isMobile) {
                        return `<span onclick="mobile_title_click()">${price}</span>`
                    }else{
                        return price
					}
                }
            },
        ],
        columnDefs: [
            {
                targets: '_all',
                className: 'dt-head-center',
                //"orderable": false,
            },
            {
                targets: 'name',
                className: 'dt-body-left',
                type: 'title-string',
                "orderable": false,
                responsivePriority: 1
            },
            {
                targets: 'meta_type',
                className: 'dt-body-center',
                "orderable": false,
            },
            {
                targets: 'meta_wp_production_date',
                className: 'dt-body-center',
                "type": "any-number",
                "orderable": false,
            },
            {
                targets: 'price',
                className: 'dt-body-right',
                "orderable": false,
                responsivePriority: 1
            },
            {
                targets: [-1, -2],
                className: 'dt-body-right',
                "orderable": false,
                responsivePriority: 1
            },
        ],
        responsive: true,
        lengthChange: false,
        select: true,
        info: false,
        paging: false
    })

    const setItemGrid = function (data) {
        // console.log('setItemGrid START');
        itemGrid.clear();
        if (data) {
            //itemGrid.rows.add(data).draw();
			itemGrid.rows.add(data);
			itemGrid.order([4, 'asc']).draw();
        }
    }

	$(".name:eq(0)").click(function() {
		if(sort_num<1){
			itemGrid.clear().draw();
			itemGrid.rows.add(desc_data);
			itemGrid.order([4, 'desc']).draw();	
			sort_num = 1;
		}else{
			itemGrid.clear().draw();
			itemGrid.rows.add(CURRENCY_INFO);
			itemGrid.order([4, 'asc']).draw();
			sort_num = 0;
		}
	});

    const getTradeItems = function (type) {
        let symbol = 'ALL';
        switch (type) {
            case 'wish':
                symbol = 'WISH';
                break;
            case 'hold':
                symbol = 'HOLD';
                break;
            default: // case 'all':
                break;
        }
        
        API.getCurrency(symbol, (resp) => {
            if (resp.success) {
                CURRENCY_INFO = resp.payload;
            //이름순으로 순서 변경
            //CURRENCY_INFO.sort((a, b) => a.name > b.name ? 1 : -1);
            //CURRENCY_INFO.sort((a, b) => a.name.localeCompare(b.name));
				desc_data = new Array();
				for (let i = CURRENCY_INFO.length - 1; i >= 0; i--) {
				    desc_data.push(CURRENCY_INFO[i]); // 데이터 그리드 배열에 데이터 추가
				}
				setItemGrid(CURRENCY_INFO);
            } else {
                setItemGrid(null);
            }
        });
    }
    window.getTradeItems = getTradeItems;

	// Get references to the input element and the search button
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.querySelector('.search-button');

    // Add a keydown event listener to the input element
    searchInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            performSearch(); // Call the performSearch function when Enter key is pressed
        }
    });
	
    ////230822
    const performSearch = function () {
	    const query = searchInput.value.trim();
	    if (query !== '') {
	        console.log('검색 : ' + query);
	        API.getSearchCurrency(query, (resp) => {
	            if (resp.success) {
	                CURRENCY_INFO = resp.payload;
					desc_data = new Array();
					for (let i = CURRENCY_INFO.length - 1; i >= 0; i--) {
					    desc_data.push(CURRENCY_INFO[i]); // 데이터 그리드 배열에 데이터 추가
					}
	                itemGrid.clear().draw();
	               
	                itemGrid.rows.add(CURRENCY_INFO);
			        itemGrid.order([1, 'asc']).draw();
	               
	            } else {
	                setItemGrid(null);
	            }
	        });
	        window.getTradeItems = getTradeItems;
	    }
		
	    return false; // Prevent form submission
	}

    // 종목 구분 탭 클릭시 종목목록 조회
    $('[name=tab_item]').on('click', function () { 
        if ($(this).parent().hasClass('tab--active')) { return false; } // active 에서 중지
        getTradeItems($(this).attr('data-target'));
    })
    // 전체 탭 클릭
    $('#tab_all_item').parent().removeClass('tab--active').end().trigger('click');

})


$(function() { 

    $('.form-order').on('input', _e => {
        $form = $(_e.target).closest('form')
        const price = $form.find('[name=price]').length>0 ? parseFloat($form.find('[name=price]').val().replace(/[^0-9.\-\+]/g, '')) : 0;
        const volume = $form.find('[name=volume]').length>0 ? parseFloat($form.find('[name=volume]').val().replace(/[^0-9.\-\+]/g, '')) : 0;
        $form.find('[name=total]').val('' + real_number_format(price * volume) + '')
    })
    // $('#modal-buy [name=price], #modal-buy [name=volume]').on('input', _e => {
    //     const price = parseFloat($('#modal-buy [name=price]').val())
    //     const volume = parseFloat($('#modal-buy [name=volume]').val())
    //     $('#modal-buy [name=total]').val('' + real_number(price * volume) + '')
    // })
    // $('#modal-sell [name=price], #modal-sell [name=volume]').on('input', _e => {
    //     const price = parseFloat($('#modal-sell [name=price]').val())
    //     const volume = parseFloat($('#modal-sell [name=volume]').val())
    //     $('#modal-sell [name=total]').val('' + real_number(price * volume) + '')
    // })

    $('#modal-buy-direct-pin')
        .myModal('beforeOpen', _e => {
            if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
                $('#modal-buy-direct-pin').myModal('stopEvent');
                alert('로그인 해주세요');
                return false;
            } 
        })
        
        .submit((e) => {
            $('#modal-buy-direct-pin').find('button[type=submit]').attr('disabled', false)
            e.preventDefault()

            let check = true
            let pin = ''
            $('#modal-buy-direct-pin').find('input[name=pin]').each((_index, elem) => {
                if(!$(elem).val()) {
                    check = false
                    $(elem).focus()
                    return false
                }
                pin += $(elem).val()
            })

            if(check) {
                API.checkPin(pin, (resp) => {
                    if(resp.success) {
                        $.cookie(Model.user_info.userid,Model.user_info.userno,{
                            "expires": 0.5,
                            // "domain": "loc.kkikda.com",
                            "path": "/"
                            })
                        $("#modal-buy-direct-pin").myModal('hide')
                        $("#modal-buy-direct").myModal('show')
                    } else {
                        alert(resp.error.message)
                    }
                })
            } else {
                alert('내용을 채워주세요. 항목을 입력해 주세요.')
            }
            
            return false
        })
    $('#modal-buy-direct')
        .myModal('beforeOpen', (_event, btn) => {
            const orderid = btn.data('orderid')
            const symbol = btn.data('symbol')
            const exchange = btn.data('exchange')
            const price = btn.data('price')*1
            const volume = btn.data('volume')*1
            const goods_grade = btn.data('goods_grade')
            const name = SELECTED_NAME
            const modal = $('#modal-buy-direct')
            //const cnt_buyable = USER_WALLET[gen_user_wallet_key(SELECTED_EXCHANGE, '')]?.confirmed || 0;
	    const cnt_buyable = Model.user_wallet.KRW.total_money;
            modal.find('.tea--available').text('' + real_number_format(cnt_buyable) + ' ' + SELECTED_EXCHANGE)
            modal.find('[name=orderid]').val(orderid)
            modal.find('[name=symbol]').val(symbol)
            modal.find('[name=exchange]').val(exchange)
            modal.find('[name=orderid]').text('#'+orderid)
            modal.find('[name=price]').val(real_number_format(price))
            modal.find('[name=volume]').val(volume)
            modal.find('[name=volume]').prop('max',volume)
            modal.find('[name=total]').val('' + real_number_format(price * volume) + '')
            modal.find('.tea--name').text(name)
            modal.find('[name=goods_grade]').val(goods_grade)
	    $('[name=use_agreement]').prop('checked', false);
	    
	    //mk 물품 구매시 total가격, 수량 수정
	    modal.find('[name=volume]').val(1)
            modal.find('[name=volume]').prop('min',1)
            modal.find('[name=total]').val('' + real_number_format(price * 1) + '')
        })
        .submit(e => {
            $('#modal-buy-direct').find('button[type=submit]').attr('disabled', true);
            e.preventDefault()
            let data = $('#modal-buy-direct').serializeObject()
            data.price = data.price.replace(/[^\d]+/g, '');
            data.total = data.total.replace(/[^\d]+/g, '');
            API.buyDirect(data, (resp) => {
                $('#modal-buy-direct').find('button[type=submit]').attr('disabled', false);
                if (resp.success) {
                    set_user_wallet();
                    $('#modal-buy-direct').myModal('hide')
                    const payload = resp.payload;
                    const price = payload.order_price;
                    const volume = payload.volume;
                    // const price = parseFloat($('#modal-buy-direct [name=price]').val().replace(/[^0-9.\-\+]/g, ''))
                    // const volume = parseFloat($('#modal-buy-direct [name=volume]').val().replace(/[^0-9.\-\+]/g, ''))
                    const exchange = parseFloat($('#modal-buy-direct [name=exchange]').val())
                    const goods_grade = ($('#modal-buy-direct [name=goods_grade]')).val()
                    $('#modal-buy-success .tea--name').text(SELECTED_NAME)
                    $('#modal-buy-success .volume').text(volume.format())
                    $('#modal-buy-success .total').text(real_number_format(price * volume))
                    // $('#modal-buy-success .exchange').text(exchange)
                    $('#modal-buy-success .goods_grade').text(goods_grade)
                    $('#modal-buy-success').myModal('show')
                    // 판매목록 갱신
                    $('#sellGrid').DataTable().ajax.reload(null, false);
                    // 상품목록 갱신
                    getTradeItems($('.tabs li.tab--active [name=tab_item]').attr('data-target'));
                } else {
                    alert(resp.error.message)
                }
            })
            return false
        })
    
    $('#modal-buy-pin')
        .myModal('beforeOpen', _e => {
            
            let cookie_check = $.cookie(Model.user_info.userid)

            if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
                $('#modal-buy-pin').myModal('stopEvent');
                alert('로그인 해주세요');
                return false;
            } else if (cookie_check === Model.user_info.userno) {
                $('#modal-buy-pin').hide();
                $('#modal-buy-button').attr('data-target','#modal-buy');
                $('#modal-buy-button').trigger('click');
		$("#modal-buy").myModal('show');
            } else {
            return false
            }
        })
        $('[name=tab_item]').on('click', function () { 
            //$("#modal-buy-pin").myModal('hide')
            //$("#modal-buy").myModal('show')
        })

        .submit((e) => {
            
            e.preventDefault()
		
	    $('#modal-buy-pin').find('button[type=submit]').attr('disabled', false)

            let check = true
            let pin = ''
            $('#modal-buy-pin').find('input[name=pin]').each((_index, elem) => {
                if(!$(elem).val()) {
                    check = false
                    $(elem).focus()
                    return false
                }
                pin += $(elem).val()
            })

            if(check) {
                API.checkPin(pin, (resp) => {
                    if(resp.success) {
                        $.cookie(Model.user_info.userid,Model.user_info.userno,{
                            "expires": 0.5,
                            // "domain": "loc.kkikda.com",
                            "path": "/"
                            })
                        $("#modal-buy-pin").myModal('hide')
                        //$("#modal-buy").myModal('show')
			    
			    return false
                    } else {
                        alert(resp.error.message)
                    }
                })
            } else {
                alert('내용을 채워주세요. 항목을 입력해 주세요.')
            }
            
            return false
        })
    $('#modal-buy')
        .myModal('beforeOpen', _e => {
            const modal = $('#modal-buy')
            //const cnt_buyable = USER_WALLET[gen_user_wallet_key(SELECTED_EXCHANGE,'')]?.confirmed || 0;
	        const cnt_buyable = Model.user_wallet.KRW.total_money;

            modal.find('.tea--available').text(real_number_format(cnt_buyable) + ' ' + SELECTED_EXCHANGE)
            modal.find('input[name=symbol]').val(SELECTED_SYMBOL)
            modal.find('input[name=exchange]').val(SELECTED_EXCHANGE)
            modal.find('[name=orderid]').text('')
            modal.find('[name=price]').val(real_number_format($('#buy_price').val()));
            modal.find('[name=volume]').val(real_number_format($('#buy_val').val()));
            const t_buy_money = $('#buy_price').val() * $('#buy_val').val();
            modal.find('[name=total]').val(real_number_format(t_buy_money));
            modal.find('.tea--name').text(SELECTED_NAME)
            modal.find('[name=goods_grade]').val(SELECTED_GOODS_GRADE)
	    $('[name=use_agreement]').prop('checked', false);
        })
        .submit(e => {
            $('#modal-buy').find('button[type=submit]').attr('disabled', true);
            e.preventDefault()
	    const price_num2 =parseFloat($('#modal-buy').find('[name=price]').val().replace(/[^0-9.\-\+]/g, ''));
	    $('#modal-buy [name=price]').val(price_num2);	
            API.buy($('#modal-buy').serializeObject(), (resp) => {
                $('#modal-buy').find('button[type=submit]').attr('disabled', false);
                if(resp.success) {
                    set_user_wallet();
                    $('#modal-buy').myModal('hide')
                    const price = parseFloat($('#modal-buy [name=price]').val().replace(/[^0-9.\-\+]/g, ''))
                    const volume = parseFloat($('#modal-buy [name=volume]').val().replace(/[^0-9.\-\+]/g, ''))
                    const exchange = parseFloat($('#modal-buy [name=exchange]').val())
                    const goods_grade = ($('#modal-buy [name=goods_grade]')).val()
                    $('#modal-buy-success .tea--name').text(SELECTED_NAME)
                    $('#modal-buy-success .volume').text(volume.format())
                    $('#modal-buy-success .total').text(real_number_format(price * volume))
                    //$('#modal-buy-success .exchange').text(exchange)
                    $('#modal-buy-success .goods_grade').text(goods_grade)
                    $('#modal-buy-success').myModal('show')
                    // 구매목록 갱신
                    $('#buyGrid').DataTable().ajax.reload(null, false);
                    // 상품목록 갱신
                    getTradeItems($('.tabs li.tab--active [name=tab_item]').attr('data-target'));
                } else {
                    alert(resp.error.message)
                }
            })
            return false
        })
    
    $('#modal-sell-direct-pin')
        .myModal('beforeOpen', _e => {
            if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
                $('#modal-sell-direct-pin').myModal('stopEvent');
                alert('로그인 해주세요');
                return false;
            }
        })
        
        .submit((e) => {
            $('#modal-sell-direct-pin').find('button[type=submit]').attr('disabled', false)
            e.preventDefault()

            let check = true
            let pin = ''
            $('#modal-sell-direct-pin').find('input[name=pin]').each((_index, elem) => {
                if(!$(elem).val()) {
                    check = false
                    $(elem).focus()
                    return false
                }
                pin += $(elem).val()
            })

            if(check) {
                API.checkPin(pin, (resp) => {
                    if(resp.success) {
                        $.cookie(Model.user_info.userid,Model.user_info.userno,{
                            "expires": 0.5,
                            // "domain": "loc.kkikda.com",
                            "path": "/"
                            })
                        $("#modal-sell-direct-pin").myModal('hide')
                        $("#modal-sell-direct").myModal('show')
                    } else {
                        alert(resp.error.message)
                    }
                })
            } else {
                alert('내용을 채워주세요. 항목을 입력해 주세요.')
            }
            
            return false
        })
    $('#modal-sell-direct')
        .myModal('beforeOpen', (_event, btn) => {
            
            const orderid = btn.data('orderid')
            const symbol = btn.data('symbol')
            const exchange = btn.data('exchange')
            const price = btn.data('price')*1
            const volume = btn.data('volume')*1
            const goods_grade = btn.data('goods_grade')
            const name = SELECTED_NAME
            const modal = $('#modal-sell-direct')
            const cnt_sellable = USER_WALLET[gen_user_wallet_key(symbol,goods_grade)]?.confirmed || 0;

            modal.find('.tea--available').text(real_number_format(cnt_sellable)+__('개'))
            modal.find('[name=orderid]').val(orderid)
            modal.find('input[name=symbol]').val(symbol)
            modal.find('[name=orderid]').text('#'+orderid)
            modal.find('[name=price]').val(real_number_format(price))
            modal.find('[name=volume]').val(volume)
            modal.find('[name=volume]').prop('max',volume)
            modal.find('[name=total]').val('' + real_number_format(price * volume) + '')
            modal.find('.tea--name').text(name)
            modal.find('[name=goods_grade]').val(goods_grade)
			
	    $('[name=use_agreement]').prop('checked', false);
	    
	    //mk 물품 구매시 total가격, 수량 수정
	    modal.find('[name=volume]').val(1)
            modal.find('[name=volume]').prop('min',1)
            modal.find('[name=total]').val('' + real_number_format(price * 1) + '')
        })
        .submit(e => {
            $('#modal-sell-direct').find('button[type=submit]').attr('disabled', true);
            e.preventDefault()
            let data = $('#modal-sell-direct').serializeObject()
            data.price = data.price.replace(/[^\d]+/g, '');
            data.total = data.total.replace(/[^\d]+/g, '');
            API.sellDirect(data, (resp) => {
                $('#modal-sell-direct').find('button[type=submit]').attr('disabled', false);
                if (resp.success) {
                    const payload = resp.payload;
                    set_user_wallet();
                    $('#modal-sell-direct').myModal('hide')
                    const price = payload.order_price
                    const volume = payload.volume
                    const exchange = parseFloat($('#modal-sell-direct [name=exchange]').val())
                    const goods_grade = ($('#modal-sell-direct [name=goods_grade]')).val()
                    $('#modal-sell-success .tea--name').text(SELECTED_NAME)
                    $('#modal-sell-success .volume').text(volume.format())
                    $('#modal-sell-success .total').text(real_number_format(price * volume))
                    // $('#modal-sell-success .exchange').text(exchange)
                    $('#modal-sell-success .goods_grade').text(goods_grade)
                    $('#modal-sell-success').myModal('show')
                    // 구매목록 갱신
                    $('#buyGrid').DataTable().ajax.reload(null, false);
                    // 상품목록 갱신
                    getTradeItems($('.tabs li.tab--active [name=tab_item]').attr('data-target'));
                } else {
                    alert(resp.error.message)
                }
            })
            return false
        })
        
        
        $('#modal-sell-pin')
        .myModal('beforeOpen', _e => {
            
            let cookie_check = $.cookie(Model.user_info.userid)
            
            if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
                $('#modal-sell-pin').myModal('stopEvent');
                alert('로그인 해주세요');
                return false;
            } else if (cookie_check === Model.user_info.userno) {
                $('#modal-sell-pin').hide();
                $('#modal-sell-button').attr('data-target','#modal-sell');
                $('#modal-sell-button').trigger('click');
		$("#modal-sell").myModal('show');
            } else {
            return false
            }
        })

        
        .submit((e) => {
            e.preventDefault()

            let check = true
            let pin = ''
            $('#modal-sell-pin').find('input[name=pin]').each((_index, elem) => {
                if(!$(elem).val()) {
                    check = false
                    $(elem).focus()
                    return false
                }
                pin += $(elem).val()
            })

            if(check) {
                API.checkPin(pin, (resp) => {
                    if(resp.success) {
                        $.cookie(Model.user_info.userid,Model.user_info.userno,{
                            "expires": 0.5,
                            // "domain": "loc.kkikda.com",
                            "path": "/"
                            })
                        $("#modal-sell-pin").myModal('hide')
                        //$("#modal-sell").myModal('show')
			$('#modal-buy-button').attr('data-target','#modal-buy-pin');
			PIN_NUMBER_ON = 1;
                    } else {
                        alert(resp.error.message)
                    }
                }) 
            } else {
                alert('내용을 채워주세요. 항목을 입력해 주세요.')
            }
            
            return false
        })

    $('#modal-sell')
        .myModal('beforeOpen', _e => {
            const modal = $('#modal-sell')
            const cnt_sellable = USER_WALLET[gen_user_wallet_key(SELECTED_SYMBOL,SELECTED_GOODS_GRADE)]?.confirmed || 0;
            modal.find('.tea--available').text(real_number_format(cnt_sellable))
            modal.find('input[name=symbol]').val(SELECTED_SYMBOL)
            modal.find('input[name=exchange]').val(SELECTED_EXCHANGE)
            modal.find('[name=orderid]').text('')
            modal.find('[name=price]').val(real_number_format(SELECTED_SYMBOL_PRICE))
            modal.find('[name=price]').val(real_number_format($('#sell_price').val()));
            modal.find('[name=volume]').val(real_number_format($('#sell_val').val()));
            const t_sell_money = $('#sell_price').val() * $('#sell_val').val();
            modal.find('[name=total]').val(real_number_format(t_sell_money));
            modal.find('.tea--name').text(SELECTED_NAME)
            modal.find('[name=goods_grade]').val(SELECTED_GOODS_GRADE)
	    $('[name=use_agreement]').prop('checked', false);
        })
        .submit(e => {
            $('#modal-sell').find('button[type=submit]').attr('disabled', true);
            e.preventDefault()
	    const price_num2 =parseFloat( $('#modal-sell').find('[name=price]').val().replace(/[^0-9.\-\+]/g, ''));
	    $('#modal-sell [name=price]').val(price_num2);	
            API.sell($('#modal-sell').serializeObject(), (resp) => {
                $('#modal-sell').find('button[type=submit]').attr('disabled', false);
                if (resp.success) {
                    
                    // payload = {
                    //     order_price: 주문가격
                    //     remain_volume: 거래후 남은 수량
                    //     orderid : 주문번호(DB저장된값)
                    //     price: 거래된 평균가격
                    //     volume: 거래된 수량
                    //     amount: 거래된 금액
                    // }

                    set_user_wallet();
                    $('#modal-sell').myModal('hide')
                    // $('#alert-sell').myModal('show')
                    const price = parseFloat($('#modal-sell [name=price]').val().replace(/[^0-9.\-\+]/g, ''))
                    const volume = parseFloat($('#modal-sell [name=volume]').val().replace(/[^0-9.\-\+]/g, ''))
                    const exchange = parseFloat($('#modal-sell [name=exchange]').val())
                    const goods_grade = ($('#modal-sell [name=goods_grade]')).val()
                    $('#modal-sell-success .tea--name').text(SELECTED_NAME)
                    $('#modal-sell-success .volume').text(volume.format())
                    $('#modal-sell-success .total').text(real_number_format(price * volume))
                    //$('#modal-sell-success .exchange').text(exchange)
                    $('#modal-sell-success .goods_grade').text(goods_grade)
                    $('#modal-sell-success').myModal('show')
                    // 판매목록 갱신
                    $('#sellGrid').DataTable().ajax.reload(null, false);
                    // 상품목록 갱신
                    getTradeItems($('.tabs li.tab--active [name=tab_item]').attr('data-target'));
                } else {
                    alert(resp.error.message)
                }
            })
            return false
        })
    $('#modal-sell').find('[name="goods_grade"]').on('change', function () { 
        let goods_grade = $(this).val();
        let cnt_sellable = USER_WALLET[gen_user_wallet_key(SELECTED_SYMBOL, goods_grade)]?.confirmed || 0;
        $('#modal-sell').find('.tea--available').text('' + real_number_format(cnt_sellable) + ' ')
    })
    
    
    $('#scan')
        .myModal('beforeClose', _e => {
            $('#scan .modal--body').find('img,iframe').attr('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAQAAADa613fAAAAaklEQVR42u3PMREAAAgEID+50TWCuwcNyHS9EBERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERGRywL1OpWdVwPKBwAAAABJRU5ErkJggg==')
        })
})

function open_use_agreement() {
	window.open('https://www.assettea.com/use_agreement.html', '_blank');
}

function mobile_title_click(){
	// 그리드를 선택하면
	if(isMobile) {
		$(".side--panel").hide();
		$(".details").show();
        $('.tabs .tab--sell button').click();
	} else {
		$(".side--panel").show();
		$(".details").show();
        $('#tab_all_item').click();
	}
}

//화면 세로 고정
// 페이지 로드 시 핸드폰 화면을 항상 세로 모드로 고정하는 코드 
window.onload = function() {
    // 화면 회전 이벤트 리스너 등록
    window.addEventListener("orientationchange", function() {
        // 현재 방향을 가져와서 가로 모드일 경우 다시 세로 모드로 고정
        if (window.orientation == 90 || window.orientation == -90) {
        document.body.style.transform = "rotate(0deg)";
        }
    });

    // 초기 방향 설정
    if (window.orientation == 90 || window.orientation == -90) {
        document.body.style.transform = "rotate(0deg)";
    }
	
};

///// 230822 추가


document.getElementById("tea_info_tab").addEventListener("click", function () {
    document.getElementById("tea_info_tab").style.color = "var(--red-up)";
    document.getElementById("tea_chart_tab").style.color = "black";
    $("#tab-info").show();
    $(".chart").hide();
});
document.getElementById("tea_chart_tab").addEventListener("click", function () {
    document.getElementById("tea_chart_tab").style.color = "var(--red-up)";
    document.getElementById("tea_info_tab").style.color = "black";
    $("#tab-info").hide();
    $(".chart").show(); R
});

//하단 스크립트
var buy_list = [];
var sell_list = [];
var order_list = [];

// 주문목록을 생성하는 함수
function createOrderList() {
    order_list = [];
    const table = document.querySelector('.left');
    table.innerHTML = '';
    const tableHeader = document.createElement('div');
    tableHeader.className = 'table-header';
    tableHeader.innerHTML = `
	    <span>주문번호</span>
	    <span>주문상태</span>
	    <span>상품가격</span>
	    <span>수량</span>
	`;
    table.appendChild(tableHeader);

    const tableRowAdd = document.createElement('div');
    tableRowAdd.className = 'table-row-add';
    tableRowAdd.innerHTML = `
      <div class="order-details-minus" style="color: #0B2871;" onclick="showDivPlus('1')">매도 주문 더보기</div>
    `;
    table.appendChild(tableRowAdd);

    const orderList = document.createElement('div');
    orderList.className = 'order-list';
    table.appendChild(orderList);
	
	//소팅
    buy_list.sort(function(a, b) {
        return a.productPrice - b.productPrice;
    });

    sell_list.sort(function(a, b) {
        return a.productPrice - b.productPrice;
    });

	order_list.push(...sell_list);
	order_list.push(...buy_list);

    for (const item of order_list) {
        const tableRow = document.createElement('div');
        tableRow.className = 'table-row';
        tableRow.innerHTML = `
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${item.orderNumber} </div>
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${item.orderStatus}</div>
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${real_number_format(item.productPrice)}</div>
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${real_number_format(item.quantity)}</div>
        `;
        orderList.appendChild(tableRow);
    }

    const tableRowAdd2 = document.createElement('div');
    tableRowAdd2.className = 'table-row-add';
    tableRowAdd2.innerHTML = `
      <div class="order-details-minus" style="color: var(--red-up);" onclick="showDivPlus('2')">매수 주문 더보기</div>
    `;
    table.appendChild(tableRowAdd2);
}

// 테이블 업데이트 함수
function updateTable(newData, text) {
    const orderList = document.querySelector('.order-list');

	if(text === "매도"){
		orderList.innerHTML = "";
		console.log(newData);
	}
	
	
    for (const item of newData) {
		
		const tableRow = document.createElement('div');
        tableRow.className = 'table-row';
        tableRow.innerHTML = `
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${item.orderNumber} </div>
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${item.orderStatus}</div>
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${item.productPrice.toLocaleString()}</div>
        <div class="order-details" style="color: ${item.orderStatus === '매도' ? '#0B2871' : 'var(--red-up)'};" onclick="showOrderDetails('${item.orderNumber}', '${item.orderStatus}', '${item.productPrice.toLocaleString()}', '${item.quantity}')">
            ${item.quantity}</div>
        `;
		
		if (item.orderStatus === '매수') {
            // 매도 주문인 경우, 테이블 하단에 추가
            orderList.appendChild(tableRow);
        } else if (item.orderStatus === '매도') {
            // 매수 주문인 경우, 테이블 상단에 추가
            orderList.insertBefore(tableRow, orderList.firstChild);
        }
		
        orderList.appendChild(tableRow);
    }

}

// 초기화 함수 실행
createOrderList();

// 매수, 매도, 주문관리 창을 토글하는 함수
function toggleOrderContent(orderType) { 
    const orderContents = document.querySelectorAll('.order-content');
    for (const orderContent of orderContents) {
        orderContent.style.display = 'none';
    }
    document.getElementById(`${orderType}-order`).style.display = 'block';
    
    if(`${orderType}` ==="sell"){
        document.getElementById(`right_sell`).style.color = '#0B2871';	
        document.getElementById(`right_buy`).style.color = 'black';	
        document.getElementById(`right_mange`).style.color = 'black';
		const cnt_sellable = USER_WALLET[gen_user_wallet_key(SELECTED_SYMBOL,SELECTED_GOODS_GRADE)]?.confirmed || 0;
		document.getElementsByClassName('tea--available')[1].textContent = real_number_format(cnt_sellable) + '개';
		document.getElementsByName('goods_grade')[1].textContent = SELECTED_GOODS_GRADE + '등급';
		calc_sell();
    }else if(`${orderType}` ==="buy"){
        document.getElementById(`right_sell`).style.color = 'black';	
        document.getElementById(`right_buy`).style.color = 'var(--red-up)';	
        document.getElementById(`right_mange`).style.color = 'black';
		const cnt_buyable = Model.user_wallet.KRW.total_money;
		document.getElementsByClassName('tea--available')[0].textContent = real_number_format(cnt_buyable) + SELECTED_EXCHANGE;
		//modal.find('.tea--available').text(real_number_format(cnt_buyable) + ' ' + SELECTED_EXCHANGE)
        document.getElementsByName('goods_grade')[0].textContent = SELECTED_GOODS_GRADE + '등급';
		calc_buy();
    }else{
        document.getElementById(`right_sell`).style.color = 'black';	
        document.getElementById(`right_buy`).style.color = 'black';	
        document.getElementById(`right_mange`).style.color = 'var(--red-up)';
    }
    
    
}

// 주문취소 창의 주문번호 리스트를 생성하는 함수
function createCancelOrderList() {
    /*const cancelOrderContent = document.getElementById('cancel-order-content');
    cancelOrderContent.innerHTML = '';
    const cancelOrderList = document.createElement('div');
    cancelOrderList.style.height = '440px';
    cancelOrderList.style.overflowY = 'scroll';
    for (const item of data) {
        const orderCheckbox = document.createElement('input');
        orderCheckbox.type = 'checkbox';
        orderCheckbox.value = item.orderNumber;
        orderCheckbox.id = `order-${item.orderNumber}`;
        const orderLabel = document.createElement('label');
        orderLabel.htmlFor = `order-${item.orderNumber}`;
        orderLabel.innerText = `주문번호 ${item.orderNumber}`;
        const orderRow = document.createElement('div');
        orderRow.appendChild(orderCheckbox);
        orderRow.appendChild(orderLabel);
        cancelOrderList.appendChild(orderRow);
    }
    cancelOrderContent.appendChild(cancelOrderList);*/
}

// 매수, 매도, 주문관리 클릭 이벤트 추가
document.querySelector('.menu-item:nth-child(1)').addEventListener('click', () => toggleOrderContent('buy'));
document.querySelector('.menu-item:nth-child(2)').addEventListener('click', () => toggleOrderContent('sell'));
document.querySelector('.menu-item:nth-child(3)').addEventListener('click', () => toggleOrderContent('manage'));

// 주문취소 창의 주문번호 리스트를 생성하고 숨깁니다.
createCancelOrderList();
//document.getElementById('cancel-order-content').style.display = 'none';

//주문 더보기
function showDivPlus(checkNum) {
	//매도 주문 더보기
    if (checkNum === '1') {
		const newData = [
		    { orderNumber: 1011, orderStatus: '매도', productPrice: 17000000, quantity: 2 },
		    { orderNumber: 1012, orderStatus: '매도', productPrice: 1650000, quantity: 3 },
		    { orderNumber: 1014, orderStatus: '매도', productPrice: 1630000, quantity: 1 },
		    { orderNumber: 1013, orderStatus: '매도', productPrice: 1610000, quantity: 2 }
		];

		const mergedResult = mergeUniqueData(sell_list, newData);
		const sell_list_copy = [];
		sell_list_copy.push(...mergedResult);
		sell_list_copy.push(...sell_list);

		sell_list.length = 0;
		sell_list.push(...sell_list_copy);

		order_list.length = 0;
		order_list.push(...sell_list);
		order_list.push(...buy_list);
		
        updateTable(order_list, '매도');

    } else if (checkNum === '2') {//매수 주문 더보기
        const newData = [
		    { orderNumber: 1021, orderStatus: '매수', productPrice: 170000, quantity: 2 },
		    { orderNumber: 1022, orderStatus: '매수', productPrice: 16500, quantity: 3 },
		    { orderNumber: 1024, orderStatus: '매수', productPrice: 16300, quantity: 1 },
			{ orderNumber: 1026, orderStatus: '매수', productPrice: 16150, quantity: 5 },
		    { orderNumber: 1023, orderStatus: '매수', productPrice: 16100, quantity: 2 }
		];

		const mergedResult = mergeUniqueData(buy_list, newData);
		const buy_list_copy = [];
		buy_list_copy.push(...buy_list);
		buy_list_copy.push(...mergedResult);

		buy_list.length = 0;
		buy_list.push(...buy_list_copy);

		order_list.length = 0;
		order_list.push(...sell_list);
		order_list.push(...buy_list);
		
        // 새 데이터를 테이블에 추가하고 스크롤을 위로 이동시킴
        updateTable(mergedResult, '');
    }
}

//자료 합치기
function mergeUniqueData(existingData, newData) {
    const mergedData = [];

    for (const item of newData) {
        // 이미 existingData에 orderNumber가 존재하는지 확인
        const orderNumberExists = existingData.some(existingItem => existingItem.orderNumber === item.orderNumber);

        if (!orderNumberExists) {
            mergedData.push(item);
        }
    }

    return mergedData;
}

function showOrderDetails(orderNumber, orderStatus, productPrice, quantity) {
	if(orderStatus === "매도"){
		$('#right_sell').click();
		$('#sell_price').val(productPrice);
		const sell_ea = $('#sell_val').val();
		const sell_price = $('#sell_price').val();
		$('#sell_total').val(addCommas(rmCommas(sell_price)*sell_ea));
	}else if(orderStatus === "매수"){
		$('#right_buy').click();
		$('#buy_price').val(productPrice);
		const buy_ea = $('#buy_val').val();
		const buy_price = $('#buy_price').val();
		$('#buy_total').val(addCommas(rmCommas(buy_price)*buy_ea));
	}
}

//가격 리스너 
document.getElementById('buy_val').addEventListener('input', function() {
  // 입력 요소의 값이 변경될 때마다 실행될 코드
	var inputValue = this.value;
	const buy_price = $('#buy_price').val();
	$('#buy_total').val(addCommas(rmCommas(buy_price)*inputValue));
});


document.addEventListener('DOMContentLoaded', function() {
    var sellValInput = document.getElementById('sell_price');
	var sp_sell_p = document.getElementById('spiner-plus-sell');
	var sp_sell_m = document.getElementById('spiner-minus-sell');

	var buyValInput = document.getElementById('buy_price');

	var spinerPlusButton = document.querySelector('.spiner-plus');
	var spinerMinusButton = document.querySelector('.spiner-minus');

    if (sellValInput) {
        sellValInput.addEventListener('input', function() {
            calc_sell();
        });
    }

	if (buyValInput) {
        buyValInput.addEventListener('input', function() {
            calc_buy();
        });
    }

});

function rmCommas(value) {
    return value.replace(/,/g, '');
}

function addCommas(value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function order_chnage(text){
	const rightIng = document.getElementById('right_ing');
	const rightC = document.getElementById('right_c');
	
	if(text === 'c'){
		console.log("완료");
		rightIng.style.color = 'black';
	    rightIng.style.background = 'white';
	    rightC.style.color = 'white';
	    rightC.style.background = 'var(--red-up)';
	}else{
		console.log("미체결");
		rightC.style.color = 'black';
	    rightC.style.background = 'white';
	    rightIng.style.color = 'white';
	    rightIng.style.background = 'var(--red-up)';
	}
}

function calc_sell(){
	setTimeout(function() {
		const sell_ea = $('#sell_val').val();
		const sell_price = $('#sell_price').val();
		$('#sell_total').val(addCommas(rmCommas(sell_price)*sell_ea));
	}, 50);
}

function calc_buy(){
	setTimeout(function() {
		const buy_ea = $('#buy_val').val();
		const buy_price = $('#buy_price').val();
		$('#buy_total').val(addCommas(rmCommas(buy_price)*buy_ea));
	}, 50);	
}

function trade_list(){
	buy_list = [];
	sell_list = [];
	order_list = [];
	createOrderList();
	
	API.getOrderListTrading(SELECTED_SYMBOL, SELECTED_EXCHANGE, (resp) => {
        //console.log('trade_list:', resp);
         if(resp.payload.length > 0) {
            resp.payload.filter(function(item) {
                if (item.crypto_currency === 'N') {
                    return false; // skip
                }
                return true;
            }).map((item) => {
                const orderNumber = item.orderid;
                let orderStatus = "매수";
                if(item.tradeing_type != "sell"){
                    orderStatus = "매도";
                };
                const productPrice = item.price;
                const quantity = item.volume;
				
                item.orderNumber = orderNumber;
                item.orderStatus = orderStatus;
                item.productPrice = productPrice;
                item.quantity = quantity;

				if(item.tradeing_type != "sell"){
					buy_list.push(item);
				}else{
					sell_list.push(item);
				}
				
    
            })

			createOrderList();
		 }
    })
	
}


    