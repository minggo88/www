

const Exchange = {
    // 그리드 포매터
    formatter: {
        Name: (cellValue, _options, rowObject) => {
            const classOn = rowObject.Checked ? 'btn--star--on' : 'btn--star'
    
            // 버튼
            return `<button type="button" class="btn ${classOn}"></button>${cellValue}`
        },
        //현재가
        CurrentPrice: (cellValue, _options, rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                return rowObject.Difference >= 0 ? '<span class="text-red text-bold">' + new Intl.NumberFormat('ko-KR').format(cellValue) + '</span>' : '<span class="text-blue text-bold">' + new Intl.NumberFormat('ko-KR').format(cellValue) + '</span>'
            }

            return '<span class="text-red text-bold">' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '</span>'
        },
        TransactionPrice: (cellValue, _options, rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                if(cellValue >= 1000000 && cellValue % 1000000 == 0) {
                    cellValue = cellValue / 1000000 + '백만'
                    return cellValue
                }

                return new Intl.NumberFormat('ko-KR').format(cellValue)
            }

            return cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
        // 전일대비
        Difference: (cellValue, _options, _rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                const nf = new Intl.NumberFormat('ko-KR', {
                    minimumFractionDigits: 2,
                })

                return cellValue >= 0 ?  '<span class="text-red text-bold">+' + nf.format(cellValue) + '%</span>' : '<span class="text-blue text-bold">' + nf.format(cellValue) + '%</span>'
            }

            return cellValue >= 0 ? '<span class="text-red">' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '%</span>' : '<span class="text-blue">' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '%</span>'
        },
        // 가격
        Price: (cellValue, _options, _rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                return '$' + new Intl.NumberFormat('ko-KR', {
                    minimumFractionDigits: 1,
                }).format(cellValue)
            }
            return '$' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
        },
        // 총액
        TotalPrice: (cellValue, _options, _rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                return '$' + new Intl.NumberFormat('ko-KR', {
                    minimumFractionDigits: 1,
                }).format(cellValue)
            }
    
            return '$' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
        }
    }
}

$(function() {
    const sidePanelWidth = $('.side--panel').width()
    const detailsWidth = $('main').width() - sidePanelWidth - 20

    console.log(detailsWidth)
    $("#jqGrid").jqGrid({
        url: 'data.json',
        datatype: "json",
        colModel: [
            { label: '이름', name: 'Name', width: 160, formatter: Exchange.formatter.Name, resizable: false },
            { label: '타입', name: 'Type', width: 64, align: 'center', resizable: false },
            { label: '생산연도', name: 'Year', width: 76, align: 'center', sorttype:'number', resizable: false },
            { label: '현재가', name: 'CurrentPrice', width: 84, sorttype:'number', align: 'right', formatter: Exchange.formatter.CurrentPrice, resizable: false },
            { label: '전일대비', name: 'Difference', width: 76, sorttype:'integer', align: 'right', formatter: Exchange.formatter.Difference, resizable: false },
            { label: '거래대금', name: 'TransactionPrice', width: 105, sorttype:'integer', align: 'right', formatter: Exchange.formatter.TransactionPrice, resizable: false },
            { name: 'Checked', hidden: true}
        ],
        loadonce: true,
        width: sidePanelWidth,
        height: 971,
        rowNum: 20,
        viewrecords: true
    })

    $("#detailsGrid").jqGrid({
        url: 'data2.json',
        datatype: "json",
        colModel: [
            { label: '번호', name: 'Num', width: detailsWidth * 99 / 834, align: 'center', resizable: false },
            { label: '구분', name: 'Category', width: detailsWidth * 96 / 834, align: 'center', resizable: false },
            { label: '등록일', name: 'CreatedAt', width: detailsWidth * 68 / 834, align: 'center', formatter: 'date', formatoptions: {
                srcformat: 'Y/m/d',
                newformat: 'Y/m/d',
            }, resizable: false },
            { label: '가격', name: 'Price', width: detailsWidth * 92 / 834, formatter: Exchange.Price, align: 'right', sorttype:'number', resizable: false },
            { label: '수량', name: 'Quantity', width: detailsWidth * 123 / 834, sorttype:'number', align: 'center', resizable: false },
            { label: '총액', name: 'TotalPrice', width: detailsWidth * 92 / 834, sorttype:'integer', align: 'right', formatter: Exchange.TotalPrice, resizable: false },
            { label: '상태', name: 'Status', width: detailsWidth * 148 / 834, align: 'center', resizable: false },
            { label: '거래버튼', width: detailsWidth * 70 / 834, formatter: (_cellValue) => {
                return '<button type="button" class="btn btn--blue btn--rounded" data-toggle="modal" data-target="#modal-sell" style="width: 100%; height: 25px; line-height: 25px">판매</button>'
            }}
        ],
        loadonce: true,
        width: detailsWidth,
        height: 352,
        rowNum: 20,
        viewrecords: true,
        shrinkToFit: false,
    })
    $("#detailsGrid2").jqGrid({
        url: 'data2.json',
        datatype: "json",
        rownumbers: false,
        colModel: [
            { label: '번호', name: 'Num', width: detailsWidth * 99 / 834, align: 'center', resizable: false },
            { label: '구분', name: 'Category', width: detailsWidth * 96 / 834, align: 'center', resizable: false },
            { label: '등록일', name: 'CreatedAt', width: detailsWidth * 68 / 834, align: 'center', formatter: 'date', formatoptions: {
                srcformat: 'Y/m/d',
                newformat: 'Y/m/d',
            }, resizable: false },
            { label: '가격', name: 'Price', width: detailsWidth * 92 / 834, formatter: Exchange.formatter.Price, align: 'right', sorttype:'number', resizable: false },
            { label: '수량', name: 'Quantity', width: detailsWidth * 123 / 834, sorttype:'number', align: 'center', resizable: false },
            { label: '총액', name: 'TotalPrice', width: detailsWidth * 92 / 834, sorttype:'integer', align: 'right', formatter: (cellValue) => {
                if(typeof(Intl) !== 'undefined') {
                    return '$' + new Intl.NumberFormat('ko-KR', {
                        minimumFractionDigits: 1,
                    }).format(cellValue)
                }
                return '$' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
            }, resizable: false },
            { label: '상태', name: 'Status', width: detailsWidth * 148 / 834, align: 'center', resizable: false },
            { label: '거래버튼', width: detailsWidth * 70 / 834, formatter: (_cellValue) => {
                return '<button type="button" class="btn btn--red btn--rounded" data-toggle="modal" data-target="#modal-buy" style="width: 100%; height: 25px; line-height: 25px">구매</button>'
            }}
        ],
        loadonce: true,
        width: detailsWidth,
        height: 308,
        rowNum: 20,
        viewrecords: true,
        shrinkToFit: false,
    })

    $('#modal-buy').submit(() => {
        $('#alert-buy').addClass('modal--open')
        return false
    })
})


  const getData = async () => {
    const res = await fetch('data.csv')
    const resp = await res.text()

    const cdata = resp.split('\n').map((row) => {
        const [time1, time2, open, high, low, close, volume] = row.split(',');
        return {
            'time': new Date(`${time1}, ${time2}`).getTime() / 1000,
            'open': open * 1,
            'high': high * 1,
            'low': low * 1,
            'close': close * 1,
            'volume': volume * 1,
        };
    });
    return cdata;
}
const genVolumeData = (data) => {
let previous_close = 0;
const rdata = data.map((row) => {
console.log(row);

const price_decrease_color = 'rgba(255,82,82, 0.8)'; // 종가 상승시 거래량 색
const price_increase_color = 'rgba(0, 150, 136, 0.8)'; // 종가 하락시 거래량 색
const price_color = previous_close <= row.close ? price_increase_color : price_decrease_color;
previous_close = row.close;

return {
'time': row.time,
'value': row.volume * 1,
'color': price_color
}
});
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
});
// ---------------------------------------------------
// 가격봉 차트 생성
var candleSeries = chart.addCandlestickSeries();

// 거래량 차트 생성
var volumeSeries = chart.addHistogramSeries({
color: '#26a69a',
priceFormat: {type: 'volume',},
priceScaleId: '',
scaleMargins: {top: 0.8,bottom: 0,},
});
const displayChart = async (data, period = '1d') => {
// ---------------------------------------------------
// 데이터 추가 
//var data = await getData(); // 날짜,시간,시,고,저,종,거래량
candleSeries.setData(data); // 봉차트 데이터 추가
volumeSeries.setData(genVolumeData(data)) // 거래량 차트 데이터 추가

// ---------------------------------------------------
// MA 생성 
addSMAtoChart(data, 10, '#F00');
addSMAtoChart(data, 30, '#0F0');
addSMAtoChart(data, 90, '#00F');

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
};
API.getChartData('btc', (resp) => {
displayChart(resp);

})

$('.tab--sell').click((e) => {
    API.getTradingList(() => {

    })
})