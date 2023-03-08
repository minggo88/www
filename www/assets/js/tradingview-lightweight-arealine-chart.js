/**
 * TradingView Lightweight Charts
 * 
 * https://www.tradingview.com/lightweight-charts/
 * https://tradingview.github.io/lightweight-charts/docs
 * 
 * @example window.displayChart('chartdomid', 'GCA18KTDKK', 'USD', '1h');
 */
; (function ($) {

  const getData = async (symbol, exchange, period, cnt) => {
    datatype = symbol ? 'stock' : 'total_volume'; // 종목코드가 있으면 종목의 차트데이터를 가져오고 종목 코드 없으면 끽다 지수 값을 가져옵니다.

    // http://api.loc.kkikda.com/v1.0/getChartData/?symbol=GCA18KTDKK
    // http://api.loc.kkikda.com/v1.0/getTradeIndex/?code=kkikda
    var xmlHttp = new XMLHttpRequest();
    switch (datatype) {
      case 'total_volume':
        xmlHttp.open("GET", '//api.' + (window.location.host.replace('www.', '')) + '/v1.0/getTradeIndex/?code=kkikda&cnt=' + cnt, false); // false for kkikda index(끽다 지수)
        // xmlHttp.open("GET", '//api.' + (window.location.host.replace('www.', '')) + '/v1.0/getChartDataTotalVolume/?symbol=' + symbol + '&exchagne=' + exchange + '&period=' + period + '&cnt=' + cnt, false); // false for synchronous request
        break;
      default:
        xmlHttp.open("GET", '//api.'+(window.location.host.replace('www.',''))+'/v1.0/getChartData/?symbol=' + symbol + '&exchagne=' + exchange + '&period=' + period + '&cnt=' + cnt, false); // false for synchronous request
        break;
    }
    xmlHttp.send(null);
    let json = xmlHttp.responseText;
    if (json.indexOf('{') === 0) {
      json = JSON.parse(json);
      if (json && json.success) {
        resp = json.payload;
        const cdata = resp.split('\n').filter((row) => {
          if (row.indexOf('date') > -1) { return; } // 첫번째 줄 데이터 컬럼명 일때 제외
          return row;
        }).map((row) => {
          if (datatype === 'total_volume') {
            [date, code, volume] = row.split('\t');
          } else {
            [date, open, high, low, close, volume, symbol] = row.split('\t');
          }
          return {
            'time': new Date(`${date}`).getTime() / 1000,
            //'value': volume * 1
            'value': Math.round(volume * 3 * 100) / 100
          };
        });
        return cdata;
      }
    }
  };

  /**
   * 차트를 만듭니다. 데이터도 알아서 가져와서 만듭니다.
   * @param {*} target_id 
   * @param {*} symbol 코인심볼
   * @param {*} exchange 교환화폐. 
   * @param {*} period 봉차트 기간. 1m, 3m, 5m, 10m, 15m, 30m, 1h, 12h, 1d, 1w, 1M
   */
  const displayChart = async (target_id, symbol, exchange, period, cnt) => {

    symbol = symbol || '';
    exchange = exchange || 'KRW';
    period = period || '1d';
    cnt = cnt || '1000';
    // document.body.style.position = 'relative';

    // var container = document.createElement('div');
    var container = document.getElementById(target_id);
    // document.body.appendChild(container);
    $(container).empty();

    var width = 600;
    var height = 400;

    // ---------------------------------------------------
    // 차트 생성 

    var chart = LightweightCharts.createChart(container, {
      // width: width,
      // height: height,
      rightPriceScale: {
        scaleMargins: {top: 0.35,bottom: 0.2,},
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      grid: {
        horzLines: {color: '#F00',visible: false,},
        vertLines: {color: '#eee',},
      },
      crosshair: {
        horzLine: {visible: false,labelVisible: false},
        vertLine: {visible: true,style: 0,width: 2,color: 'rgba(32, 38, 46, 0.1)',labelVisible: false,}
      },
      layout: {
        backgroundColor: 'transparent',
      },
    });

    // 반응형처리
    $(window).resize(function() {
      chart.applyOptions({
        width: $('#'+target_id).outerWidth(),
        height: $('#'+target_id).outerHeight()
      });
    });

    // ---------------------------------------------------
    // arealine 차트 생성

    var series = chart.addAreaSeries({	
      topColor: 'rgba(0, 120, 255, 0.0)',	
      bottomColor: 'rgba(0, 120, 255, 0.0)',
      lineColor: 'rgba(51, 51, 51, 1.0)',
      lineWidth: 3
    });

    // ---------------------------------------------------
    // 데이터 추가, x축 데이터 변환(5일)

    var data = await getData(symbol, exchange, period, cnt); // 날짜,시간,시,고,저,종,거래량
    series.setData(data);
    
    const now = new Date();
    const fiveDaysAgo = new Date(now.getTime() - (5 * 24 * 60 * 60 * 1000));

    // 현재 시간의 년, 월, 일, 시간, 분, 초 구하기
    const now_year = now.getFullYear();
    const now_month = String(now.getMonth() + 1).padStart(2, '0');
    const now_day = String(now.getDate()).padStart(2, '0');
    // 5일 전 시간의 년, 월, 일, 시간, 분, 초 구하기
    const year = fiveDaysAgo.getFullYear();
    const month = fiveDaysAgo.getMonth() + 1;
    const day = fiveDaysAgo.getDate();
    
    chart.timeScale().setVisibleRange({
        from: year+'-'+month+'-'+day,
        to: now_year+'-'+now_month+'-'+now_day
    });
    
    // ---------------------------------------------------
    //mk 소수점 삭제
    
    series.applyOptions({
      priceFormat: { // price format - y축
        type: 'custom',
        //minMove: 0.5,
        formatter: function(f){
          return f
        }
      },
    });
    //x축 변경
    chart.applyOptions({
      timeScale: {
        tickMarkFormatter: (time, tickMarkType, locale) => {
          //const t = new Date(data[data.length - 1].time * 1000);
          const t = new Date(time * 1000);
          const dateStr = ((t.getMonth() + 1 + 100).toString().substring(1)) + '/' + ((t.getDate() * 1 + 100).toString().substring(1));
          return dateStr;
        },
      },
    });
    
    // ---------------------------------------------------
    // 차트 스타일

    function businessDayToString(businessDay) {
      return new Date(Date.UTC(businessDay.year, businessDay.month - 1, businessDay.day, 0, 0, 0)).toLocaleDateString();
    }
    
    // var toolTipMargin = 10;
    // var priceScaleWidth = 50;
    // var toolTip = document.createElement('div');
    // toolTip.className = 'three-line-legend';
    // container.appendChild(toolTip);
    // toolTip.style.display = 'block';
    // toolTip.style.left = 3 + 'px';
    // toolTip.style.top = 3 + 'px';
    
    function setLastBarText() {
      const t = new Date(data[data.length - 1].time * 1000);
      const dateStr = t.getFullYear() + '/' + ((t.getMonth() + 1 + 100).toString().substring(1)) + '/' + ((t.getDate() * 1 + 100).toString().substring(1));
      $('#chartToolTip [name=dateStr]').text(dateStr)
      $('#chartToolTip [name=point]').text(data[data.length - 1].value)
      // toolTip.innerHTML = '<div style="font-size: 24px; margin: 4px 0px; color: #20262E">' + __('지수') + '<i class="icon--help" style="width: 16px;height: 18px;background: url(\'/assets/img/icon/btn_help.svg\') no-repeat 50%;margin-left: 5px;vertical-align: baseline;"></i></div>'
      //   + '<div class="pop_up"><div class="pop_content">'+__('지수란 Teaplat의 거래지수를 의미하며 거래가 활발한지 아닌지를 나타내는 수치입니다.')+'</div></div>'
      //   + '<div style="font-size: 22px; margin: 4px 0px; color: #20262E">' + data[data.length - 1].value + '</div>' +
      //   '<div>' + dateStr + '</div>';
    }
    
    setLastBarText(); 
    
    chart.subscribeCrosshairMove(function (param) {
      if ( param === undefined || param.time === undefined || param.point.x < 0 || param.point.x > width || param.point.y < 0 || param.point.y > height ) {
        setLastBarText();   
      } else {
        // dateStr = param.time.year +' - '+ param.time.month + ' - ' + param.time.day;
        const t = new Date(param.time * 1000);
        const dateStr = t.getFullYear() + '/' + ((t.getMonth()*1 + 1 + 100).toString().substring(1)) + '/' + ((t.getDate()*1 + 100).toString().substring(1));
        var price = param.seriesPrices.get(series);
        $('#chartToolTip [name=dateStr]').text(dateStr)
        $('#chartToolTip [name=point]').text((Math.round(price * 100) / 100).toFixed(2))
        // toolTip.innerHTML =	'<div style="font-size: 24px; margin: 4px 0px; color: #20262E">'+__('지수')+'<i class="icon--help" style="width: 16px;height: 18px;background: url(\'/assets/img/icon/btn_help.svg\') no-repeat 50%;margin-left: 5px;vertical-align: baseline;"></i></div>'+ '<div style="font-size: 22px; margin: 4px 0px; color: #20262E">' + (Math.round(price * 100) / 100).toFixed(2) + '</div>' + '<div>' + dateStr + '</div>';
      }
    });
  };
  
  window.displayChart = displayChart;

})(jQuery); // jQuery 필요. window.resize 이벤트 때문에
