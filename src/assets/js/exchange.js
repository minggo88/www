
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

let USER_WALLET = {}
API.getTradeBalance('ALL','',(r) => {
    if (r && r.success) {
        const payload = r.payload
        for (row of payload) {
            USER_WALLET[row.symbol] = row
        }
    }
})

let CURRENCY_INFO = [];
let SELECTED_SYMBOL = '';  //'G4K95O56R2'
let SELECTED_NAME = '';  //'끽다거 세작'
let SELECTED_SYMBOL_PRICE = 0
let SELECTED_EXCHANGE = getURLParameter('exchange') || 'USD'
let CHART_TIMER

// 모바일 접속 여부
let isMobile = (window.matchMedia('(max-width: 600px)').matches)

$(function() {
    $(window).on('resize', () => {
        isMobile = (window.matchMedia('(max-width: 600px)').matches)
    })

    const genVolumeData = (data) => {
        let previous_close = 0

        const rdata = data.map((row) => {
            const price_decrease_color = 'rgba(255,82,82, 0.8)'; // 종가 상승시 거래량 색
            const price_increase_color = 'rgba(0, 150, 136, 0.8)'; // 종가 하락시 거래량 색
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
    // const detailsWidth = $('main').width() - sidePanelWidth - 30
	const detailsWidth = $('.details').width()
    const periodList = [
        { text: '1분', value: '1m' },
        { text: '3분', value: '3m' },
        { text: '3분', value: '3m' },
        { text: '5분', value: '5m' },
        { text: '10분', value: '10m' },
        { text: '15분', value: '15m' },
        { text: '1시간', value: '1h' },
        { text: '12시간', value: '12h' },
        { text: '1일', value: '1d' },
        { text: '1주', value: '1w' },
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

        clearTimeout(CHART_TIMER)

        API.getChartData(SELECTED_SYMBOL, period, (resp) => {
            $('.details').removeClass('loading')

            if(resp.success) {
                displayChart(resp.payload)
            } else {
                alert(resp.error.message)
            }
        })

        CHART_TIMER = setTimeout(() => {
            API.getChartData(SELECTED_SYMBOL, period, (resp) => {
                $('.details').removeClass('loading')

                if(resp.success) {
                    updateChart(resp.payload)
                } else {
                    alert(resp.error.message)
                }
            })
        }, 10000)

        API.getChartData(SELECTED_SYMBOL, period, (resp) => {
            displayChart(resp.payload, period)
        })
    })
    const period = $('#period').dropdown('selected')
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

        const container = document.getElementById('tvchart')
        $(container).empty();
        const chart = LightweightCharts.createChart(container, {
            width: detailsWidth,
            height: height,
            crosshair: {
                mode: LightweightCharts.CrosshairMode.Normal,
            },
        })
        // ---------------------------------------------------
        // 가격봉 차트 생성
        var candleSeries = chart.addCandlestickSeries()
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
            "emptyTable": "데이터가 없음.",
            "lengthMenu": "페이지당 _MENU_ 개씩 보기",
            "info": "현재 _START_ - _END_ / _TOTAL_건",
            "infoEmpty": "",
            "infoFiltered": "( _MAX_건의 데이터에서 필터링됨 )",
            "search": "검색: ",
            "zeroRecords": "데이터가 없음",
            "loadingRecords": "로딩중...",
            "processing": '<img src="/template/vwyx3Z/script/plug_in/loading/loading.gif"> 잠시만 기다려 주세요.',
            "paginate": {
                "next": "다음",
                "previous": "이전"
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
        ajax: {
            url: `${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=buy&status=trading`,
            type: 'POST',
            dataSrc: 'payload',
        },
        columns : [
            {
                data: (_d, _type, _row, meta) => {
                    const api = new $.fn.dataTable.Api( '#buyGrid' )
                    const pageInfo = api.page.info()
                    return pageInfo.length - meta.row + 1
                }
            },
            {
                data: () => {
                    return '삽니다'
                }
            },
            // 등록일
            {
                data: 'time_order', render: (timestamp) => {
                    const date = new Date(timestamp * 1000)
                    return date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0')
                }
            },
            // 가격
            {
                data: 'price', render: (price) => {
                    return real_number_format(price);
                }
            },
            // 수량
            {
                data: 'volume_remain', render: (volume_remain) => {
                    return number_format(volume_remain, 4);
                }
            },
            // 거래금액
            {
                data: 'amount', render: (amount) => {
                    return real_number_format(amount);
                }
            },
            // 상태
            {
                data: 'status', render: (status, _type, _row) => {
                    switch(status) {
                        case 'close':
                            return '판매완료'
                        case 'buy':
                            return '구매완료'
                        case 'trading':
                            return '거래중'
                        case 'open':
                            return '대기'
                    }
                }
            },
            { data: (d) => {
                const price = d.price
                const exchange = d.exchange
                // const volume = d.volume
                const volume_remain = d.volume_remain
                const orderid = d.orderid
                return '<button type="button" class="btn btn--blue btn--rounded" data-toggle="modal" data-symbol="' + SELECTED_SYMBOL + '" data-exchange="' + exchange + '" data-volume="' + volume_remain + '" data-price="' + price + '" data-orderid="' + orderid + '" data-target="#modal-sell-direct" style="width: 70px; height: 25px; line-height: 25px; font-size: 13px">판매</button>'

            } },
        ],
        columnDefs: [
            {
                searchable: false,
                orderable: false,
                targets: 0,
            },
            {
                targets: '_all',
                orderable: false,
                className: 'dt-head-center',
            },
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
            },
            {
                targets: 4,
                className: 'dt-body-right text-right',
                type: 'any-number',
                orderable: false,
            },
            {
                targets: 5,
                className: 'dt-body-right text-right',
                orderable: false,
            },
            {
                targets: 6,
                className: 'dt-body-center',
                orderable: false,
            },
            {
                targets: -1,
                className: 'dt-body-center',
                orderable: false,
            }
        ],
        order: [[0, 'desc']],
    })

    const sellGrid = $('#sellGrid').DataTable({
        processing: false,
        serverSide: true,
        paging: true,
        scrollY: 308,
        deferRender: true,
        scroller: true,
        ajax: {
            url: `${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=sell&status=trading`,
            type: 'POST',
            dataSrc: 'payload',
        },
        columns : [
            {
                data: (_d, _type, _row, meta) => {
                    const api = new $.fn.dataTable.Api( '#sellGrid' )
                    const pageInfo = api.page.info()

                    if(!meta) {
                        return
                    }
                    return pageInfo.length - meta.row + 1
                }
            },
            {
                data: () => {
                    return '삽니다'
                }
            },
            // 등록일
            {
                data: 'time_order', render: (timestamp) => {
                    const date = new Date(timestamp * 1000)
                    return date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0')
                }
            },
            // 가격
            {
                // data: 'price', render: DataTable.render.number( null, null, 0, '' )
                data: 'price', render: (price) => {
                    return real_number_format(price);
                }
            },
            // 수량
            {
                data: 'volume_remain', render: (volume_remain) => {
                    return number_format(volume_remain, 4);
                }
            },
            // 거래금액
            {
                data: 'amount', render: (volume) => {
                    return real_number_format(volume);
                }
            },
            // 상태
            {
                data: 'status', render: (status, _type, _row) => {
                    switch(status) {
                        case 'close':
                            return '판매완료'
                        case 'buy':
                            return '구매완료'
                        case 'trading':
                            return '거래중'
                        case 'open':
                            return '대기'
                    }
                }
            },
            {
                data: (d) => {
                const price = d.price
                const exchange = d.exchange
                const volume_remain = d.volume_remain
                const orderid = d.orderid
                return '<button type="button" class="btn btn--red btn--rounded" data-toggle="modal" data-symbol="' + SELECTED_SYMBOL + '" data-exchange="' + exchange + '" data-price="' + price + '" data-volume="' + volume_remain + '" data-orderid="' + orderid + '" data-target="#modal-buy-direct" style="width: 70px; height: 25px; line-height: 25px; font-size: 13px">구매</button>'
            } },
        ],
        columnDefs: [
            {
                searchable: false,
                orderable: false,
                targets: 0,
            },
            {
                targets: '_all',
                className: 'dt-head-center',
                orderable: false,
            },
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
            },
            {
                targets: 4,
                className: 'dt-body-right text-right',
                type: 'any-number',
                orderable: false,
            },
            {
                targets: 5,
                className: 'dt-body-right text-right',
                orderable: false,
            },
            {
                targets: 6,
                className: 'dt-body-center',
                orderable: false,
            },
            {
                targets: -1,
                className: 'dt-body-center',
                orderable: false,
            }
        ],
        order: [[0, 'desc']],

    })

    const itemGrid = $('#jqGrid')
    .on('init.dt', function (_e, _settings) {
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
            api.row(ROWS_COUNT-1).select() // 첫번째 선택
            // api.row(0).select() // 마지막 선택
        }

        if(isMobile) {
            api.column(1).visible(false)
        }
    })
    .on('responsive-resize', function () {
        const api = new $.fn.dataTable.Api( '#jqGrid' );

        if(isMobile) {
            api.column(1).visible(false)
        } else {
            api.column(1).visible(true)
        }
    })// 그리드를 선택하면
    .on('select.dt', function (_e, row, type, indexes) {
        if ( type === 'row' ) {
            const data = row.data()
            
            console.log('select.dt === data:', data);

            const { name, symbol, type, meta_division, producer, production_date, origin, icon_url, scent, taste } = data
            console.log(window.itemGridData);
            const { weight, story } = data
            const { keep_method } = data
            const { teamaster_note, producer_note }= data
            const { grade } = data
            const { animation } = data

            SELECTED_SYMBOL = symbol
            SELECTED_NAME = name

            // 로딩 애니메이션 출력
            $('.details').addClass('loading')

            API.getSpotPrice(SELECTED_SYMBOL, SELECTED_EXCHANGE, (resp) => {
                API.getChartData(SELECTED_SYMBOL, period, (resp) => {
                    $('.details').removeClass('loading')

                    if (resp.success) {
                        displayChart(resp.payload)
                        // 갱신은 이렇게 말고 함수로 변경합니다.
                        // CHART_TIMER = setTimeout(() => {
                        //     API.getChartData(SELECTED_SYMBOL, period, (resp) => {
                        //         $('.details').removeClass('loading')

                        //         if(resp.success) {
                        //             updateChart(resp.payload)
                        //         } else {
                        //             alert(resp.error.message)
                        //         }
                        //     })
                        // }, 10000)
                    } else {
                        alert(resp.error.message)
                    }

                })

                if(resp.success && resp.payload[0]) {
                    const spot = resp.payload[0]

                    // 최고가
                    $('#highest-price').text(real_number_format(spot.price_high))
                    // 최저가
                    $('#lowest-price').text(real_number_format(spot.price_low))
                    $('#spot-volume').text(spot.volume.format())
                    $('#spot-volume2').text((parseFloat(spot.price_close) * parseFloat(spot.volume)).format())

                    SELECTED_SYMBOL_PRICE = parseFloat(spot.price_close).toFixed(2)

                    const diff = ((spot.price_close - spot.price_open) / spot.price_open).toFixed(2)
                    const diffPercent = Math.abs(diff * 100).toFixed(2)
                    const diff_sign = diff > 0 ? '+' : (diff < 0 ? '-' : '');
                    const diff_text = diff > 0 ? 'text-red' : (diff < 0 ? 'text-blue' : '');
                    const diff_icon = diff > 0 ? './assets/img/icon/icon-up.svg' : (diff < 0 ? './assets/img/icon/icon-down.svg' : 'about:blank');

                    $('.details--price').text('' + parseFloat(spot.price_close).toFixed(2).format() + '원').removeClass('text-red text-blue').addClass(diff_text)
                    $('.details--diffPercent').text( diff_sign + diffPercent + '%').removeClass('text-red text-blue').addClass(diff_text)
                    $('#spot-diff').text(diff.format()).removeClass('text-red text-blue').addClass(diff_text)
                    $('#spot-diff').siblings('img').attr('src', diff_icon)
                } else {
                    const msg = resp.error && resp.error.message ? resp.error.message : '';
                    if(msg) alert(msg)
                }
            })

            $('.details .tabs').on('beforeShow', (_event, _index, target) => {
                if(target === '#tab-sell') {
                    sellGrid.ajax.url(`${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=sell&status=trading`)
                    sellGrid.clear().load()
                } else if ( target === '#tab-buy') {
                    buyGrid.ajax.url(`${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&exchange=${SELECTED_EXCHANGE}&trading_type=buy&status=trading`)
                    buyGrid.clear().load()
                }
            })

            $('.tab--sell').click()

            $('.tea--name').text(name) // .details--header 
            $('#tab-info .certificate').text(data.meta_certification_mark_name)
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
        }
    })
    // .on('draw.dt', () => {
    //     const api = new $.fn.dataTable.Api( '#jqGrid' )

    //     const row = api.row(':eq(0)')
    //     const data = row.data()

    //     console.log('draw.dt === data:', data);

    //     const { name, symbol } = data

    //     SELECTED_SYMBOL = symbol
    //     SELECTED_NAME = name

    //     // row.select() // ?? getChartData 를 두번 부르게 하는 원인... 선택시 차트 그리기때문에 여기서는 제외함.

    //     const type = data.meta_type
    //     const division = data.meta_division
    //     const { producer, production_date, origin, icon_url } = data
    //     const { scent, taste, weight } = data
    //     const { story, keep_method }= data
    //     const { teamaster_note, producer_note } = data
    //     const { grade, certificate } = data

    //     API.getSpotPrice(symbol, SELECTED_EXCHANGE, (resp) => {
    //         if(resp.success) {
    //             const spot = resp.payload[0]
    //             if (!undefined) return;
    //             $('#highest-price').text(real_number_format(spot.price_high))
    //             $('#lowest-price').text(real_number_format(spot.price_low))
    //             $('#spot-volume').text(real_number_format(spot.volume))
    //             $('#spot-volume2').text(real_number_format(parseFloat(spot.price_close) * parseFloat(spot.volume)))

    //             $('.details--price').text('' + parseFloat(spot.price_close).toFixed(2) + '원')

    //             const diff = ((spot.price_close - spot.price_open) / spot.price_open).toFixed(2)
    //             const diffPercent = (diff * 100).toFixed(2)
    //             $('.details--price').next('span').find('>span').text( (diff >= 0 ? '+' : '') + diffPercent + '%')
    //             $('#spot-diff').text(diff.format())
    //         } else {
    //             alert(resp.error.message)
    //         }
    //     })

    //     $('.details--header .tea--name').text(name)
    //     $('#tab-info .division').text(division)
    //     $('#tab-info .type').text(type)
    //     $('#tab-info .producer').text(producer)
    //     $('#tab-info .certificate').text(certificate)
    //     $('#tab-info img').attr('src', icon_url)
    //     // 입체스캔
    //     $('#scan .modal--body img').attr('src', data.animation)
    //     // 원산지
    //     $('#white-paper [name=origin]').val(origin)
    //     $('#white-paper [name=producer]').val(producer)
    //     //생산
    //     $('#white-paper [name=production_date]').val(production_date)
    //     // 맛
    //     $('#white-paper #taste').html(nl2br(taste))
    //     // 향
    //     $('#white-paper #scent').val(scent)
    //     $('#white-paper #weight').val(weight)
    //     $('#white-paper #keep-method').html(nl2br(keep_method))
    //     $('#white-paper #story').html(nl2br(story))
    //     $('#white-paper #teamaster-note').html(nl2br(teamaster_note))
    //     $('#white-paper #producer-note').html(nl2br(producer_note))
    //     $('#white-paper #grade').html(nl2br(grade))

    // })

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
                    const classOn = row.Checked ? 'btn--star--on' : 'btn--star'

                    // 버튼
                    if (isMobile) {
                        return `<button type="button" class="btn ${classOn}"></button>${data}<br><span class="text--gray005">${row.meta_type}</span>`
                    }
                    return `<button type="button" class="btn ${classOn}"></button>${data}`
                }
            },
            // 타입
            { data: 'meta_type' },
            // 생산년도
            { data: 'meta_wp_production_date' },
            // 현재가
            {
                data: 'price', render: (data, _type, row) => {
                    const diff = row.price_close - row.price_open
            
                    if (typeof (Intl) !== 'undefined') {
                        return diff >= 0 ? '<span class="text-red text-bold">' + new Intl.NumberFormat('ko-KR').format(data) + '</span>' : '<span class="text-blue text-bold">' + new Intl.NumberFormat('ko-KR').format(data) + '</span>'
                    }
        
                    return '<span class="text-red text-bold">' + data.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '</span>'
                }
            },
            // 전일대비
            {
                data: (row, _type, _set) => {
                    const diff = row.price_close > 0 && row.price_close > 0 ? (row.price_close - row.price_open) / row.price_open * 100 : 0;

                    if (typeof (Intl) !== 'undefined') {
                        return diff >= 0 ? '<span class="text-red text-bold">+' + new Intl.NumberFormat('ko-KR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        }).format(diff) + '%</span>' : '<span class="text-blue text-bold">' + new Intl.NumberFormat('ko-KR').format(diff) + '%</span>'
                    }
    
                    return '<span class="text-red text-bold">' + diff.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '</span>'
                }
            },
            // 거래대금
            {
                data: (row, _type, _set) => {
                    let price = row.price
                    if (price >= 1000000 && price % 1000000 == 0) {
                        price = price / 1000000 + '백만'
                        return price
                    }
                    return price
                }
            },
        ],
        columnDefs: [
            {
                targets: '_all',
                className: 'dt-head-center',
                "orderable": true,
            },
            {
                targets: 'name',
                className: 'dt-body-left',
                type: 'title-string',
                "orderable": false,
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
            },
            {
                targets: [-1, -2],
                className: 'dt-body-right',
                "orderable": false,
            },
        ],
        responsive: true,
        lengthChange: false,
        select: true,
        info: false,
        paging: false,
        order: [[0, 'desc']],
    })

    const setItemGrid = function (data) {
        console.log('setItemGrid START');
        itemGrid.clear().draw();
        if (data) {
            itemGrid.rows.add(data).draw();
        }
    }

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
                setItemGrid(CURRENCY_INFO);
            } else {
                setItemGrid(null);
            }
        });
    }
    // 종목 구분 탭 클릭시 종목목록 조회
    $('[name=tab_item]').on('click', function () { 
        const type = $(this).attr('data-target');
        getTradeItems(type);
    })
    // 전체 탭 클릭
    $('#tab_all_item').trigger('click');


    // API.getCurrency('', (resp) => {
    //     if(resp.success) {
    //         const requestQueue =[]
    //         const requestQueue2 =[]

    //         const data = []

    //         const spotList = []
    //         const goodsList = []

    //         CURRENCY_INFO = resp.payload;
    //         setItemGrid(CURRENCY_INFO);

    //         // console.log('----------getCurrency resp.payload:', resp.payload);
    //         // resp.payload.map((item) => {
    //         //     const symbol = item.symbol

    //         //     requestQueue.push({ method: 'getSpotPrice', params: { token: window.localStorage.token, symbol: symbol, exchange: SELECTED_EXCHANGE } })
    //         //     if(item.idx) requestQueue2.push({ method: 'getAuction/auction_goods_info.php', params: { token: window.localStorage.token, goods_idx: item.idx } })
    //         // })

    //         // const request = new Promise(async (resolve, _reject) => {
    //         //     await API.requestSync(JSON.stringify(requestQueue), async (res) => {
    //         //         res.map((payload) => {
    //         //             if (!payload || !payload.payload || payload.payload.length<1) return;
    //         //             spotList[payload.payload[0].symbol] = payload
    //         //         })

    //         //     })

    //         //     resolve(spotList)
    //         // })

    //         // request.then((spotList) => {
    //         // })

    //         // const request2 = new Promise(async (resolve, _reject) => {
    //         //     console.log('requestQueue2:',requestQueue2)
    //         //     await API.requestSync(JSON.stringify(requestQueue2), async (res) => {
    //         //         res.map((payload, index) => {
    //         //             if (!payload || !payload.payload || payload.payload.length<1) return;
                            
    //         //             const symbol = payload.payload.idx

    //         //             goodsList[symbol] = payload.payload

    //         //             const item = resp.payload[index]

    //         //             const spot = spotList[symbol]?.payload[0]
    //         //             const goods = goodsList[symbol]

    //         //             data.push({
    //         //                 no: 1,
    //         //                 name: item.name,
    //         //                 symbol : symbol,
    //         //                 category: '삽니다',
    //         //                 meta_type: goods.meta_type ? goods.meta_type : '',
    //         //                 meta_wp_production_date: goods.meta_wp_production_date ? goods.meta_wp_production_date : '',
    //         //                 price: item.price,
    //         //                 price_open: spot?.price_open,
    //         //                 price_close: spot?.price_close,
    //         //                 icon_url: item.icon_url,
    //         //                 origin: goods?.meta_wp_origin,
    //         //                 producer: goods?.meta_wp_producer,
    //         //                 production_date: goods.meta_wp_production_date,
    //         //                 scent: goods.meta_wp_scent,
    //         //                 taste: goods.meta_wp_taste ? goods.meta_wp_taste : '',
    //         //                 weight: goods.meta_wp_weight,
    //         //                 keep_method: goods.meta_wp_keep_method ? goods.meta_wp_keep_method  : '',
    //         //                 story: goods.meta_wp_story ? goods.meta_wp_story : '',
    //         //                 teamaster_note: goods.meta_wp_teamaster_note ? goods.meta_wp_teamaster_note : '',
    //         //                 producer_note: goods.meta_wp_producer_note ? goods.meta_wp_producer_note : '',
    //         //                 grade: goods.meta_wp_grade ? goods.meta_wp_grade : '',
    //         //                 certificate: goods.meta_certification_mark_name,
    //         //                 animation: goods.animation,
    //         //             })
    //         //         })

    //         //         resolve(data)
    //         //     })
    //         // })

    //         // request2.then((data) => {
    //         //     SELECTED_SYMBOL = data[0].symbol
    //         //     console.log('-----------', data); 
    //         //     setItemGrid(data);
    //         // })

    //     } else {

    //     }
    // })
})

$('[name=tab_item]').on('click', function () { 
    const target = $(this).attr('data-target');

})


$(function() { 
    $('#modal-sell').submit(e => {
        e.preventDefault()

        API.sell($('#modal-sell').serializeObject(), (resp) => {
            if(resp.success) {
                $('#modal-sell').myModal('hide')

                $('#modal-sell-success .tea--name').text(SELECTED_NAME)
                $('#modal-sell-success .volume').text($('#modal-sell [name=volume]').val().format())
                $('#modal-sell-success').myModal('show')
            } else {
                alert(resp.error.message)
            }
        })
        return false
    })

    $('.form-order').on('input', _e => {
        $form = $(_e.target).closest('form')
        const price = parseFloat($form.find('[name=price]').val())
        const volume = parseFloat($form.find('[name=volume]').val())
        $form.find('[name=total]').val('' + real_number(price * volume) + '')
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

    $('#modal-buy-direct')
        .myModal('beforeOpen', (_event, btn) => {
            const orderid = btn.data('orderid')
            const symbol = btn.data('symbol')
            const price = btn.data('price')*1
            const volume = btn.data('volume')*1
            const name = SELECTED_NAME
            const modal = $('#modal-buy-direct')
            const cnt_buyable = USER_WALLET[SELECTED_EXCHANGE]?.confirmed || 0;

            modal.find('.tea--available').text('' + real_number_format(cnt_buyable) + ' 원')
            modal.find('[name=orderid]').val(orderid)
            modal.find('[name=symbol]').val(symbol)
            modal.find('[name=orderid]').text('#'+orderid)
            modal.find('[name=price]').val(price)
            modal.find('[name=volume]').val(volume)
            modal.find('[name=total]').val('' + real_number(price * volume) + '')
            modal.find('.tea--name').text(name)
        })
        .submit(e => {
            e.preventDefault()

            API.buyDirect($('#modal-buy-direct').serializeObject(), (resp) => {
                if(resp.success) {
                    $('#modal-buy-direct').myModal('hide')

                    const price = parseFloat($('#modal-buy-direct [name=price]').val())
                    const volume = parseFloat($('#modal-buy-direct [name=volume]').val())

                    $('#modal-buy-success .tea--name').text(SELECTED_NAME)
                    $('#modal-buy-success .volume').text(volume.format())
                    $('#modal-buy-success .total').text(real_number(price * volume))
                    $('#modal-buy-success').myModal('show')

                    // 판매목록 갱신
                    sellGrid.ajax.reload(null, false);
                } else {
                    alert(resp.error.message)
                }

            })

            return false
        })
    $('#modal-sell-direct')
        .myModal('beforeOpen', (_event, btn) => {
            const orderid = btn.data('orderid')
            const symbol = btn.data('symbol')
            const price = btn.data('price')*1
            const volume = btn.data('volume')*1
            const name = SELECTED_NAME
            const modal = $('#modal-sell-direct')
            const cnt_sellable = USER_WALLET[symbol]?.confirmed || 0;

            modal.find('.tea--available').text(real_number_format(cnt_sellable)+'개')
            modal.find('[name=orderid]').val(orderid)
            modal.find('input[name=symbol]').val(symbol)
            modal.find('[name=orderid]').text('#'+orderid)
            modal.find('[name=price]').val(price)
            modal.find('[name=volume]').val(volume)
            modal.find('[name=total]').val('' + real_number(price * volume) + '')
            modal.find('.tea--name').text(name)
        })
        .submit(e => {
            e.preventDefault()

            API.sellDirect($('#modal-sell-direct').serializeObject(), (resp) => {
                if(resp.success) {
                    $('#modal-sell-direct').myModal('hide')
                    $('#alert-sell').myModal('show')
                    
                    // 구매목록 갱신
                    buyGrid.ajax.reload(null, false);
                } else {
                    alert(resp.error.message)
                }
            })

            return false
        })

    $('#modal-buy')
        .myModal('beforeOpen', _e => {
            const modal = $('#modal-buy')
            const cnt_buyable = USER_WALLET[SELECTED_EXCHANGE]?.confirmed || 0;

            modal.find('.tea--available').text(real_number_format(cnt_buyable))
            modal.find('input[name=symbol]').val(SELECTED_SYMBOL)
            modal.find('[name=orderid]').text('')
            modal.find('[name=price]').val(SELECTED_SYMBOL_PRICE)
            modal.find('[name=volume]').val('')
            modal.find('[name=total]').val('0')
            modal.find('.tea--name').text(SELECTED_NAME)
        })
        .submit(e => {
            e.preventDefault()

            API.buy($('#modal-buy').serializeObject(), (resp) => {
                if(resp.success) {
                    $('#modal-buy').myModal('hide')

                    const price = parseFloat($('#modal-buy [name=price]').val())
                    const volume = parseFloat($('#modal-buy [name=volume]').val())

                    $('#modal-buy-success .tea--name').text(SELECTED_NAME)
                    $('#modal-buy-success .volume').text(volume.format())
                    $('#modal-buy-success .total').text(real_number(price * volume))
                    $('#modal-buy-success').myModal('show')

                    // 구매목록 갱신
                    buyGrid.ajax.reload(null, false);
                } else {
                    alert(resp.error.message)
                }

            })

            return false
        })
    
    $('#modal-sell')
        .myModal('beforeOpen', _e => {
            const modal = $('#modal-sell')
            const cnt_sellable = USER_WALLET[SELECTED_SYMBOL]?.confirmed || 0;

            modal.find('.tea--available').text(real_number_format(cnt_sellable))
            modal.find('input[name=symbol]').val(SELECTED_SYMBOL)
            modal.find('[name=orderid]').text('')
            modal.find('[name=price]').val(SELECTED_SYMBOL_PRICE)
            modal.find('[name=volume]').val('')
            modal.find('[name=total]').val('0')
            modal.find('.tea--name').text(SELECTED_NAME)
        })
        .submit(e => {
            e.preventDefault()

            API.sell($('#modal-sell').serializeObject(), (resp) => {
                if(resp.success) {
                    $('#modal-sell').myModal('hide')
                    $('#alert-sell').myModal('show')
                    
                    const price = parseFloat($('#modal-buy [name=price]').val())
                    const volume = parseFloat($('#modal-buy [name=volume]').val())

                    $('#modal-buy-success .tea--name').text(SELECTED_NAME)
                    $('#modal-buy-success .volume').text(volume.format())
                    $('#modal-buy-success .total').text(real_number(price * volume))
                    $('#modal-buy-success').myModal('show')

                    // 판매목록 갱신
                    sellGrid.ajax.reload(null, false);
                } else {
                    alert(resp.error.message)
                }
            })

            return false
        })
    
    $('#scan')
        .myModal('beforeClose', _e => {
            $('#scan .modal--body').find('img,iframe').attr('src', 'about:blank')
        })
})