
let SELECTED_SYMBOL = ''
let SELECTED_NAME = ''
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

    /**
     * #TODO: https://jsfiddle.net/TradingView/yozeu6k1/ 참고해서 실시간 업데이트 구현
     */
    var height = 300
    const sidePanelWidth = $('.side--panel').width()
    const detailsWidth = $('main').width() - sidePanelWidth - 20
    const container = document.getElementById('tvchart')
    // ---------------------------------------------------
    // 차트 생성 
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

    // 거래량 차트 생성
    var volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: {type: 'volume',},
        priceScaleId: '',
        scaleMargins: {top: 0.8,bottom: 0,},
    })

    const period = $('#period').dropdown('selected')

    const displayChart = async (data) => {
        const cdata = data.split('\n').slice(1).map((row, index) => {
            const [time1, _time2, open, high, low, close, volume] = row.split('\t');

            return {
                'time': new Date(time1).getTime() / 1000,
                'open': open * 1,
                'high': high * 1,
                'low': low * 1,
                'close': close * 1,
                'volume': volume * 1,
            }
        })

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

    $.extend( $.fn.dataTable.defaults, {
        responsive: true,
        lengthChange: false,
        select: true,
        info: false,
        paging: false,
        searching: false,
        ordering: true
    } )

    const buyGrid = $('#buyGrid').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        scrollY: 308,
        deferRender: true,
        scroller: true,
        ajax: {
            url: `${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&trading_type=buy`,
            type: 'POST',
            dataSrc: 'payload',
        },
        columns : [
            {
                data: () => {
                    return ''
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
                    return `$${price}`
                }
            },
            // 수량
            { data: 'volume', render: (volume) => {

                // 버튼
                return `${volume}`
            }},
            // 거래금액
            {
                data: 'amount',
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
                            return 'OPEN'
                    }
                }
            },
            { data: () => {
                return '<button type="button" class="btn btn--blue btn--rounded" data-toggle="modal" data-target="#modal-sell" style="width: 70px; height: 25px; line-height: 25px; font-size: 13px">판매</button>'

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
                orderable: true,

            },
            {
                targets: 'price',
                className: 'dt-body-right',
                type: 'any-number',
                orderable: true,
            },
            {
                targets: 4,
                className: 'dt-body-center',
                type: 'any-number',
            },
            {
                targets: 5,
                className: 'dt-body-center',
            },
            {
                targets: 'status',
                className: 'dt-body-center',
            },
            {
                targets: -1,
                className: 'dt-body-center',
                orderable: false,
            }
        ],
    })

    const sellGrid = $('#sellGrid').DataTable({
        processing: true,
        serverSide: true,
        paging: true,
        scrollY: 308,
        deferRender: true,
        scroller: true,
        ajax: {
            url: `${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&trading_type=sell`,
            type: 'POST',
            dataSrc: 'payload',
        },
        columns : [
            {
                data: () => {
                    return ''
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
                data: 'price', render: DataTable.render.number( null, null, 2, '$' )
            },
            // 수량
            { data: 'volume', render: (volume) => {

                // 버튼
                return `${volume}`
            }},
            // 거래금액
            {
                data: 'amount',
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
                            return 'OPEN'
                    }
                }
            },
            { data: (d) => {
                const orderid = d.orderid
                return '<button type="button" class="btn btn--red btn--rounded" data-toggle="modal" data-symbol="' + SELECTED_SYMBOL + '" data-orderid="' + orderid + '" data-target="#modal-buy" style="width: 70px; height: 25px; line-height: 25px; font-size: 13px">구매</button>'

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
                orderable: true,

            },
            {
                targets: 'price',
                className: 'dt-body-right',
                type: 'any-number',
                orderable: true,
            },
            {
                targets: 4,
                className: 'dt-body-center',
                type: 'any-number',
            },
            {
                targets: 5,
                className: 'dt-body-center',
            },
            {
                targets: 'status',
                className: 'dt-body-center',
            },
            {
                targets: -1,
                className: 'dt-body-center',
                orderable: false,
            }
        ],
        order: [[1, 'asc']],

    })

    API.getCurrency('', (resp) => {
        if(resp.success) {
            const requestQueue =[]
            const requestQueue2 =[]

            const data = []

            const spotList = []
            const goodsList = []

            resp.payload.map((item) => {
                const symbol = item.symbol

                requestQueue.push({ method: 'getSpotPrice', params: { token: window.localStorage.token, symbol: symbol } })
                requestQueue2.push({ method: 'getAuction/auction_goods_info.php', params: { token: window.localStorage.token, goods_idx: item.idx } })
            })

            const request = new Promise(async (resolve, _reject) => {
                await API.requestSync(JSON.stringify(requestQueue), async (res) => {
                    res.map((payload) => {
                        spotList[payload.payload[0].symbol] = payload
                    })

                })

                resolve(spotList)
            })

            request.then((spotList) => {
            })

            const request2 = new Promise(async (resolve, _reject) => {
                await API.requestSync(JSON.stringify(requestQueue2), async (res) => {
                    res.map((payload, index) => {
                        const symbol = payload.payload.idx

                        goodsList[symbol] = payload.payload

                        const item = resp.payload[index]

                        const spot = spotList[symbol]?.payload[0]
                        const goods = goodsList[symbol]

                        data.push({
                            no: 1,
                            name: item.name,
                            symbol : symbol,
                            category: '삽니다',
                            meta_type: goods.meta_type ? goods.meta_type : '',
                            meta_wp_production_date: goods.meta_wp_production_date ? goods.meta_wp_production_date : '',
                            price: item.price,
                            price_open: spot?.price_open,
                            price_close: spot?.price_close,
                            icon_url: item.icon_url,
                            origin: goods?.meta_wp_origin,
                            producer: goods?.meta_wp_producer,
                            production_date: goods.meta_wp_production_date,
                            scent: goods.meta_wp_scent,
                            taste: goods.meta_wp_taste ? goods.meta_wp_taste : '',
                            weight: goods.meta_wp_weight,
                            keep_method: goods.meta_wp_keep_method ? goods.meta_wp_keep_method  : '',
                            story: goods.meta_wp_story ? goods.meta_wp_story : '',
                            teamaster_note: goods.meta_wp_teamaster_note ? goods.meta_wp_teamaster_note : '',
                            producer_note: goods.meta_wp_producer_note ? goods.meta_wp_producer_note : '',
                            grade: goods.meta_wp_grade ? goods.meta_wp_grade : '',
                            certificate: goods.meta_certification_mark_name,
                        })
                    })

                    resolve(data)
                })
            })

            request2.then((data) => {
                const grid = $('#jqGrid').on( 'init.dt', function (_e, _settings) {
                    if(isMobile) {
                        const api = new $.fn.dataTable.Api( '#jqGrid' );

                        api.column(1).visible(false)
                    }
                } ).on('responsive-resize', function() {
                    const api = new $.fn.dataTable.Api( '#jqGrid' );

                    if(isMobile) {
                        api.column(1).visible(false)
                    } else {
                        api.column(1).visible(true)
                    }
                }).on('draw.dt', () => {
                    const api = new $.fn.dataTable.Api( '#jqGrid' );

                    const row = api.row(':eq(0)')
                    const data = row.data()

                    row.select()

                    const name = data.name
                    const symbol = data.symbol
                    const type = data.meta_type
                    const division = data.meta_division
                    const producer = data.producer
                    const production_date = data.production_date
                    const origin = data.origin
                    const icon_url = data.icon_url
                    const scent = data.scent
                    const taste = data.taste
                    const weight = data.weight
                    const story = data.story
                    const keep_method = data.keep_method
                    const teamaster_note = data.teamaster_note
                    const producer_note = data.producer_note
                    const grade = data.grade
                    const certificate = data.certificate

                    SELECTED_NAME = name

                    API.getSpotPrice(symbol, (resp) => {
                        if(resp.success) {
                            const spot = resp.payload[0]
    
                            $('#highest-price').text((parseFloat(spot.price_high) * parseFloat(spot.volume)).format())
                            $('#lowest-price').text((parseFloat(spot.price_low) * parseFloat(spot.volume)).format())
                            $('#spot-volume').text(spot.volume.format())
                            $('#spot-volume2').text((parseFloat(spot.price_close) * parseFloat(spot.volume)).format())

                            $('.details--price').text('$' + parseFloat(spot.price_close).toFixed(2))

                            const diff = ((spot.price_close - spot.price_open) / spot.price_open).toFixed(2)
                            const diffPercent = (diff * 100).toFixed(2)
                            $('.details--price').next('span').find('>span').text( (diff >= 0 ? '+' : '') + diffPercent + '%')
                            $('#spot-diff').text(diff.format())
                        } else {
                            alert(resp.error.message)
                        }
                    })

                    $('.details--header .tea--name').text(name)
                    $('#tab-info .division').text(division)
                    $('#tab-info .type').text(type)
                    $('#tab-info .producer').text(producer)
                    $('#tab-info .certificate').text(certificate)
                    $('#tab-info img').attr('src', icon_url)
                    // 원산지
                    $('#white-paper [name=origin]').val(origin)
                    $('#white-paper [name=producer]').val(producer)
                    //생산
                    $('#white-paper [name=production_date]').val(production_date)
                    // 맛
                    $('#white-paper #taste').html(taste.replaceAll(/\r\n/g, '<br>'))
                    // 향
                    $('#white-paper #scent').val(scent)
                    $('#white-paper #weight').val(weight)
                    $('#white-paper #keep-method').html(keep_method.replaceAll(/\r\n/g, '<br>'))
                    $('#white-paper #story').html(story.replaceAll(/\r\n/g, '<br>'))
                    $('#white-paper #teamaster-note').html(teamaster_note.replaceAll(/\r\n/g, '<br>'))
                    $('#white-paper #producer-note').html(producer_note.replaceAll(/\r\n/g, '<br>'))
                    $('#white-paper #grade').html(grade.replaceAll(/\r\n/g, '<br>'))
                }).
DataTable( {
                    data: data,
                    columns : [
                        { data: 'name', render: (data, _type, row) => {
                            const classOn = row.Checked ? 'btn--star--on' : 'btn--star'
            
                            // 버튼
                            if(isMobile) {
                                return `<button type="button" class="btn ${classOn}"></button>${data}<br><span class="text--gray005">${row.meta_type}</span>`
                            }
                            return `<button type="button" class="btn ${classOn}"></button>${data}`
                        }},
                            // 타입
                            { data: 'meta_type'},
                            // 생산년도
                            { data: 'meta_wp_production_date' },
                            // 현재가
                            { data: 'price', render: (data, _type, row) => {
                                const diff = row.price_close - row.price_open
                        
                                if(typeof(Intl) !== 'undefined') {
                                    return diff >= 0 ? '<span class="text-red text-bold">' + new Intl.NumberFormat('ko-KR').format(data) + '</span>' : '<span class="text-blue text-bold">' + new Intl.NumberFormat('ko-KR').format(data) + '</span>'
                                }
                    
                                return '<span class="text-red text-bold">' + data.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '</span>'
                            } },
                            { data: (row, _type, _set) => {
                                const diff = (row.price_close - row.price_open)  / row.price_open * 100
                        
                                if(typeof(Intl) !== 'undefined') {
                                    return diff >= 0 ? '<span class="text-red text-bold">+' + new Intl.NumberFormat('ko-KR', {
                                        minimumFractionDigits: 2,
                                        maximumFractionDigits: 2,
                                    }).format(diff) + '%</span>' : '<span class="text-blue text-bold">' + new Intl.NumberFormat('ko-KR').format(diff) + '%</span>'
                                }
                    
                                return '<span class="text-red text-bold">' + diff.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '</span>'
                            } },
                            { data: (row, _type, _set) => {
                                let price = row.price
                                if(price >= 1000000 && price % 1000000 == 0) {
                                    price = price / 1000000 + '백만'
                                    return price
                                }
                                return price
                            } },
                        ],
                        "columnDefs": [
                            {
                                targets: '_all',
                                className: 'dt-head-center',
                            },
                            {
                                targets: 'name',
                                className: 'dt-body-left',
                                type: 'title-string',
                            },
                            {
                                targets: 'meta_type',
                                className: 'dt-body-center',
                            },
                            {
                                targets: 'meta_wp_production_date',
                                className: 'dt-body-center',
                                "type": "any-number",
                            },
                            {
                                targets: 'price',
                                className: 'dt-body-right',
                            },
                            {
                                targets: [-1, -2],
                                className: 'dt-body-right',
                            },
                        ],
                        responsive: true,
                        lengthChange: false,
                        select: true,
                        info: false,
                        paging: false,
                    })

                    // 그리드를 선택하면
                    grid.on( 'select', function ( _e, _dt, type, indexes ) {
                        if ( type === 'row' ) {
                            const { name, symbol, type, meta_division, producer, production_date, origin, icon_url, scent, taste } = grid.rows( indexes ).data()[0]
                            const weight = grid.rows( indexes ).data().pluck( 'weight' )[0]
                            const story = grid.rows( indexes ).data().pluck( 'story' )[0]
                            const keep_method = grid.rows( indexes ).data().pluck( 'keep_method' )[0]
                            const teamaster_note = grid.rows( indexes ).data().pluck( 'teamaster_note' )[0]
                            const producer_note = grid.rows( indexes ).data().pluck( 'producer_note' )[0]
                            const grade = grid.rows( indexes ).data().pluck( 'grade' )[0]
                            const certificate = grid.rows( indexes ).data().pluck( 'certificate' )[0]

                            SELECTED_SYMBOL = symbol
                            SELECTED_NAME = name

                            // 로딩 애니메이션 출력
                            $('.details').addClass('loading')

                            API.getSpotPrice(SELECTED_SYMBOL, (resp) => {
                                API.getChartData(SELECTED_SYMBOL, period, (resp) => {
                                    $('.details').removeClass('loading')

                                    if(resp.success) {
                                        displayChart(resp.payload)
                                    } else {
                                        alert(resp.error.message)
                                    }
                                })
            
                                if(resp.success) {
                                    const spot = resp.payload[0]

                                    $('#highest-price').text((parseFloat(spot.price_high) * parseFloat(spot.volume)).format())
                                    $('#lowest-price').text((parseFloat(spot.price_low) * parseFloat(spot.volume)).format())
                                    $('#spot-volume').text(spot.volume.format())
                                    $('#spot-volume2').text((parseFloat(spot.price_close) * parseFloat(spot.volume)).format())

                                    $('.details--price').text('$' + parseFloat(spot.price_close).toFixed(2))

                                    const diff = ((spot.price_close - spot.price_open) / spot.price_open).toFixed(2)
                                    const diffPercent = (diff * 100).toFixed(2)
                                    $('.details--price').next('span').find('>span').text( (diff >= 0 ? '+' : '') + diffPercent + '%')
                                    $('#spot-diff').text(diff.format())
                                } else {
                                    alert(resp.error.message)
                                }
                            })

                            $('.details .tabs').on('beforeShow', (_event, _index, target) => {
                                if(target === '#tab-sell') {
                                    sellGrid.ajax.url(`${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&trading_type=sell`)
                                    sellGrid.clear().load()
                                    sellGrid.on('order.dt search.dt', function () {
                                        let i = 1;

                                        sellGrid.cells(null, 0, { search: 'applied', order: 'applied' }).every(function (cell) {
                                            this.data(i++);
                                        });
                                    }).draw()

                                } else if ( target === '#tab-buy') {
                                    buyGrid.ajax.url(`${API.BASE_URL}/getOrderList/?symbol=${SELECTED_SYMBOL}&trading_type=buy`)
                                    buyGrid.clear().load()
                                    buyGrid.on('order.dt search.dt', function () {
                                        let i = 1;

                                        buyGrid.cells(null, 0, { search: 'applied', order: 'applied' }).every(function (cell) {
                                            this.data(i++);
                                        });
                                    }).draw()
                                }
                            })

                            $('.tab--sell').click()

                            $('.details--header .tea--name').text(name)
                            $('#tab-info .division').text(meta_division)
                            $('#tab-info .type').text(type)
                            $('#tab-info .producer').text(producer)
                            $('#tab-info .certificate').text(certificate)
                            $('#tab-info img').attr('src', icon_url)
                            // 원산지
                            $('#white-paper [name=origin]').val(origin)
                            $('#white-paper [name=producer]').val(producer)
                            //생산
                            $('#white-paper [name=production_date]').val(production_date)
                            // 맛
                            $('#white-paper #taste').html(taste.replaceAll(/\r\n/g, '<br>'))
                            // 향
                            $('#white-paper #scent').val(scent)
                            $('#white-paper #weight').val(weight)
                            $('#white-paper #keep-method').html(keep_method.replaceAll(/\r\n/g, '<br>'))
                            $('#white-paper #story').html(story.replaceAll(/\r\n/g, '<br>'))
                            $('#white-paper #teamaster-note').html(teamaster_note.replaceAll(/\r\n/g, '<br>'))
                            $('#white-paper #producer-note').html(producer_note.replaceAll(/\r\n/g, '<br>'))
                            $('#white-paper #grade').html(grade.replaceAll(/\r\n/g, '<br>'))
                        }
                    } )
                })



        } else {

        }
    })
})


$(function() { 
    $('#modal-sell').submit(e => {
        e.preventDefault()

        API.sell($('#modal-sell').serializeObject(), (resp) => {
            if(resp.success) {

            } else {
                alert(resp.error.message)
            }

            console.log(SELECTED_NAME)
            $('#modal-sell').myModal('hide')

            $('#modal-sell-success .tea--name').text(SELECTED_NAME)
            $('#modal-sell-success .volume').text($('#modal-sell [name=volume]').val().format())
            $('#modal-sell-success').myModal('show')
        })
        return false
    })

    $('#modal-buy [name=price], #modal-buy [name=volume]').on('input', _e => {
        const price = parseFloat($('#modal-buy [name=price]').val())
        const volume = parseFloat($('#modal-buy [name=volume]').val())
        $('#modal-buy [name=total]').val('$ ' + (price * volume).toFixed(2).format())
    })
    $('#modal-sell [name=price], #modal-sell [name=volume]').on('input', _e => {
        const price = parseFloat($('#modal-sell [name=price]').val())
        const volume = parseFloat($('#modal-sell [name=volume]').val())
        $('#modal-sell [name=total]').val('$ ' + (price * volume).toFixed(2).format())
    })

    $('#modal-buy').submit(e => {
        e.preventDefault()

        API.buyDirect($('#modal-buy').serializeObject(), (resp) => {
            if(resp.success) {

            } else {
                alert(resp.error.message)
            }

            $('#modal-buy').myModal('hide')

            const price = parseFloat($('#modal-buy [name=price]').val())
            const volume = parseFloat($('#modal-buy [name=volume]').val())

            $('#modal-buy-success .tea--name').text(SELECTED_NAME)
            $('#modal-buy-success .volume').text(volume.format())
            $('#modal-buy-success .total').text((price * volume).format())
            $('#modal-buy-success').myModal('show')
        })

        return false
    })

    $('#modal-buy').myModal('beforeOpen', (_event, btn) => {
        const orderid = btn.data('orderid')
        const symbol = btn.data('symbol')
        const name = SELECTED_NAME
        const modal = $('#modal-buy')

        modal.find('[name=orderid]').val(orderid)
        modal.find('[name=symbol]').val(symbol)
        modal.find('.tea--name').text(name)
    })
    $('#modal-sell').submit(e => {
        e.preventDefault()

        API.sellDirect($('#modal-sell').serializeObject(), (resp) => {
            if(resp.success) {

            } else {
                alert(resp.error.message)
            }

            $('#modal-sell').myModal('hide')
            $('#modal-sell-success').myModal('show')
        })

        return false
    })
    $('#modal-sell').myModal('beforeOpen', (_event, btn) => {
        const orderid = btn.data('orderid')
        const symbol = btn.data('symbol')
        const name = SELECTED_NAME
        const modal = $('#modal-sell')

        modal.find('[name=orderid]').val(orderid)
        modal.find('[name=symbol]').val(symbol)
        modal.find('.tea--name').text(name)
    })
})