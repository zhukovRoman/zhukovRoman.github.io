var options = {
  lang: {
    loading: 'Секундочку...',
    months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    weekdays: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресение'],
    shortMonths: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    exportButtonTitle: 'Экспорт',
    printButtonTitle: 'Печать',
    rangeSelectorFrom: 'От',
    rangeSelectorTo: 'до',
    rangeSelectorZoom: 'Период',
    downloadPNG: 'Скачать PNG',
    downloadJPEG: 'Скачать JPEG',
    downloadPDF: 'Скачать PDF',
    downloadSVG: 'Скачать SVG',
    resetZoom: 'Сбросить масштаб',
    resetZoomTitle: 'Сбросить масштаб',
    thousandsSep: ' ',
    decimalPoint: ',',
    noData: 'Нет данных',
    numericSymbols: null
  },
  credits: { enabled: false },
  title: { 
    text: null, 
    style: { 
      "color": "#333333", 
      "fontSize": "14px" 
    }
  },
  yAxis: {
    title: {
      align: 'high'
    },
    // labels: {
    //   format: "{value:,.0f}"
    // }
  },
  legend: {
    symbolRadius: 6,
    symbolHeight: 12,
    symbolWidth: 12,
    itemStyle: { 
      "fontWeight": "normal" 
    }
  },
  colors: [
    '#e34932',   // 0 tomato
    '#ef735b',   // 1 fadedOrange
    '#fca100',   // 2 orangeYellowTwo
    '#f8db59',   // 3 lightMustard
    '#85aa3d',   // 4 nastyGreen
    '#00a984',   // 5 greenBlue
    '#74aac2',   // 6 greyblue
    '#2480cc',   // 7 bluish
    '#9362ba',   // 8 deepLavender
    '#34405a',   // 9 darkGreyBlue
    '#a48f83',   // 10 warmGrey
    '#95a5a5',   // 11 coolGrey
  ],
  chart: {
    backgroundColor: 'transparent'
  },
  rangeSelector: {
    buttons: [{
        type: 'month',
        count: 1,
        text: '1 мес.'
    }, {
        type: 'month',
        count: 3,
        text: '3 мес.'
    }, {
        type: 'month',
        count: 6,
        text: '6 мес.'
    }, {
        type: 'year',
        count: 1,
        text: '1 год'
    }, {
        type: 'all',
        text: 'Всё'
    }],
    selected: 3,
    buttonTheme: {
      width: 50
    }
  }
}