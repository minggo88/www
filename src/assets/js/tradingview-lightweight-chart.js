/**
 * TradingView Lightweight Charts
 * 
 * https://www.tradingview.com/lightweight-charts/
 * https://tradingview.github.io/lightweight-charts/docs
 * 
 * @example window.displayChart('chartdomid', 'GCA18KTDKK', 'USD', '1h');
 */
; (function ($) {

  const getData = async (symbol, exchange, period) => {

    // http://api.loc.kkikda.com/v1.0/getChartData/?symbol=GCA18KTDKK
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", '//api.'+(window.location.host.replace('www.',''))+'/v1.0/getChartData/?symbol=' + symbol + '&exchagne=' + exchange + '&period=' + period, false); // false for synchronous request
    xmlHttp.send(null);
    let json = xmlHttp.responseText;
    if (json.indexOf('{') === 0) {
      json = JSON.parse(json);
      if (json && json.success) {
        resp = json.payload;
        // const res = await fetch('data.csv');
        // const resp = await res.text();
        const cdata = resp.split('\n').filter((row) => {
          if (row.indexOf('date') > -1) { return; } // 첫번째 줄 데이터 컬럼명 일때 제외
          return row;
        }).map((row) => {
          // const [time1, time2, open, high, low, close, volume] = row.split(',');
          const [date, open, high, low, close, volume, symbol] = row.split('\t');
          return {
            // 'time': new Date(`${time1}, ${time2}`).getTime() / 1000,
            'time': new Date(`${date}`).getTime() / 1000,
            'open': open * 1,
            'high': high * 1,
            'low': low * 1,
            'close': close * 1,
            'volume': volume * 1,
          };
        });
        return cdata;
      }
    }
  };

  const genVolumeData = (data) => {
    let previous_close = 0;
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
    });
    return rdata;
  }

  /**
   * 차트를 만듭니다. 데이터도 알아서 가져와서 만듭니다.
   * @param {*} target_id 
   * @param {*} symbol 코인심볼
   * @param {*} exchange 교환화폐. 
   * @param {*} period 봉차트 기간. 1m, 3m, 5m, 10m, 15m, 30m, 1h, 12h, 1d, 1w, 1M
   */
  const displayChart = async (target_id, symbol, exchange, period) => {

    symbol = symbol || '';
    exchange = exchange || 'USD';
    period = period || '1d';
    // document.body.style.position = 'relative';

    // var container = document.createElement('div');
    var container = document.getElementById(target_id);
    // document.body.appendChild(container);
    $(container).empty();

    var width = 600;
    var height = 300;

    // ---------------------------------------------------
    // 차트 생성 

    var chart = LightweightCharts.createChart(container, {
      // width: width,
      // height: height,
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
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
    // 가격봉 차트 생성
    var candleSeries = chart.addCandlestickSeries();

    // 거래량 차트 생성
    var volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: { type: 'volume', },
      priceScaleId: '',
      scaleMargins: { top: 0.8, bottom: 0, },
    });

    // ---------------------------------------------------
    // 데이터 추가 
    var data = await getData(symbol, exchange, period); // 날짜,시간,시,고,저,종,거래량
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
        'color': color || 'rgba(4, 111, 232, 1)',
        'lineWidth': line_width || 1,
      });
      smaLine.setData(smaData);

    }

    function calculateSMA(data, count) {
      var avg = function (data) {
        var sum = 0;
        for (var i = 0; i < data.length; i++) {
          sum += data[i].close;
        }
        return sum / data.length;
      };
      var result = [];
      for (var i = count - 1, len = data.length; i < len; i++) {
        var val = avg(data.slice(i - count + 1, i));
        result.push({ time: data[i].time, value: val });
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

    // ---------------------------------------------------
    // MA 표시 (legend) 

    // var legend = document.createElement('div');
    // legend.className = 'sma-legend';
    // container.appendChild(legend);
    // legend.style.display = 'block';
    // legend.style.left = 3 + 'px';
    // legend.style.top = 3 + 'px';

    // function setLegendText(priceValue) {
    //   let val = '∅';
    //   if (priceValue !== undefined) {
    //     val = (Math.round(priceValue * 100) / 100).toFixed(2);
    //   }
    //   legend.innerHTML = 'MA10 <span style="color:rgba(4, 111, 232, 1)">' + val + '</span>';
    // }

    // setLegendText(smaData[smaData.length - 1].value);

    // chart.subscribeCrosshairMove((param) => {
    //   setLegendText(param.seriesPrices.get(smaLine));
    // });

  };
  window.displayChart = displayChart;

})(jQuery); // jQuery 필요. window.resize 이벤트 때문에
