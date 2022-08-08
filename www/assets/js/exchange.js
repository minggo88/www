

const Exchange = {
    formatter: {
        Name: (cellValue, _options, rowObject) => {
            const classOn = rowObject.Checked ? 'btn--star--on' : 'btn--star'
    
            return `<button type="button" class="btn ${classOn}"></button>${cellValue}`
        },
        CurrentPrice: (cellValue, _options, rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                return rowObject.Difference >= 0 ? '<span class="text-red text-bold">' + new Intl.NumberFormat('ko-KR').format(cellValue) + '</span>' : '<span class="text-blue text-bold">' + new Intl.NumberFormat('ko-KR').format(cellValue) + '</span>'
            }

            return '<span class="text-red text-bold">' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '</span>'
        },
        TransactionPrice: (cellValue, options, rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                if(cellValue >= 1000000 && cellValue % 1000000 == 0) {
                    cellValue = cellValue / 1000000 + '백만'
                    return cellValue
                }

                return new Intl.NumberFormat('ko-KR').format(cellValue)
            }

            return cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
        },
        Difference: (cellValue, options, rowObject) => {
            if(typeof(Intl) !== 'undefined') {
                const nf = new Intl.NumberFormat('ko-KR', {
                    minimumFractionDigits: 2,
                })

                return cellValue >= 0 ?  '<span class="text-red text-bold">+' + nf.format(cellValue) + '%</span>' : '<span class="text-blue text-bold">' + nf.format(cellValue) + '%</span>'
            }

            return cellValue >= 0 ? '<span class="text-red">' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '%</span>' : '<span class="text-blue">' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") + '%</span>'
        }
    }
}
$(function() {
    const sidePanelWidth = $('.side--panel').width()
    const detailsWidth = $('main').width() - sidePanelWidth - 20

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
        width: 560,
        height: 971,
        rowNum: 20,
        viewrecords: true
    })
    $("#detailsGrid").jqGrid({
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
            { label: '가격', name: 'Price', width: detailsWidth * 92 / 834, formatter: (cellValue, _options, rowObject) => {
                if(typeof(Intl) !== 'undefined') {
                    return '$' + new Intl.NumberFormat('ko-KR', {
                        minimumFractionDigits: 1,
                    }).format(cellValue)
                }
                return '$' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")

            }, align: 'right', sorttype:'number', resizable: false },
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
            { label: '거래버튼', width: detailsWidth * 70 / 834, formatter: (cellValue) => {
                return '<button type="button" class="btn btn--blue btn--rounded" data-toggle="modal" data-target="#modal-buy" style="width: 100%; height: 25px; line-height: 25px">구매</button>'
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
            { label: '가격', name: 'Price', width: detailsWidth * 92 / 834, formatter: (cellValue, _options, rowObject) => {
                if(typeof(Intl) !== 'undefined') {
                    return '$' + new Intl.NumberFormat('ko-KR', {
                        minimumFractionDigits: 1,
                    }).format(cellValue)
                }
                return '$' + cellValue.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")

            }, align: 'right', sorttype:'number', resizable: false },
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
                return '<button type="button" class="btn btn--red btn--rounded" data-toggle="modal" data-target="#modal-sell" style="width: 100%; height: 25px; line-height: 25px">판매</button>'
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
        
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
  ];

  const config = {
    type: 'line',
    data: {
        datasets: [{
            type: 'bar',
            label: 'Bar Dataset',
            data: [10, 20, 30, 40]
        }, {
            type: 'line',
            label: 'Line Dataset',
            data: [50, 50, 50, 50],
        }],
        labels: ['January', 'February', 'March', 'April']
    },
    options: {
        barThickness: 14,
        responsive: true,
        layout: {
            padding: 0,
        },
        elements: {
            line: {
                borderJoinStyle: 'round',
                tension: 0.1,
            }
        },
        plugins: {
            legend: {
                display: false,
            }
        },
        scales: {
            xAxes: {
                display: true,
            },
            yAxes:{
                ticks: {
                    stepSize: 25,
                },
                position: 'right',
                min: 0,
                max: 100,
                gird: {
                    display: false,
                    drawTicks: false,
                },
                pointRadus: 0,
            }
        }
    }
  };

  const myChart = new Chart(
    document.getElementById('detailsCanvas'),
    config
  );