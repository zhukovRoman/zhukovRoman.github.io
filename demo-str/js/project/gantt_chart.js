var gantt_chart = {
  chart: {
    type: 'xrange',
    alignTicks: false
  },
  series: [{
    name: 'Отклонение',
    data: [{
      x: Date.UTC(2015, 7, 1), 
      x2: Date.UTC(2015, 7, 1),
      y: 3,
      color: colors[4]
    }, {
      x: Date.UTC(2015, 8, 10), 
      x2: Date.UTC(2015, 9, 10),
      color: colors[0],
      y: 4
    }, {
      x: Date.UTC(2016, 4, 1), 
      x2: Date.UTC(2016, 4, 21),
      color: colors[0],
      y: 5
    }],
    color: colors[11]
  }, {
    name: 'Факт',
    data: [{
      x: Date.UTC(2014, 3, 1), 
      x2: Date.UTC(2014, 9, 1),
      y: 0
    }, {
      x: Date.UTC(2014, 9, 1), 
      x2: Date.UTC(2015, 3, 1),
      y: 1
    }, {
      x: Date.UTC(2015, 3, 1), 
      x2: Date.UTC(2015, 6, 1),
      y: 2
    }, {
      x: Date.UTC(2015, 6, 1), 
      x2: Date.UTC(2015, 7, 1),
      y: 3
    }, {
      x: Date.UTC(2015, 7, 1), 
      x2: Date.UTC(2015, 9, 10),
      y: 4
    }, {
      x: Date.UTC(2015, 9, 10), 
      x2: Date.UTC(2016, 4, 21),
      y: 5
    }],
    color: colors[2]
  }, {
    name: 'План',
    data: [{
      x: Date.UTC(2014, 3, 1), 
      x2: Date.UTC(2014, 9, 1),
      y: 0
    }, {
      x: Date.UTC(2014, 9, 1), 
      x2: Date.UTC(2015, 3, 1),
      y: 1
    }, {
      x: Date.UTC(2015, 3, 1), 
      x2: Date.UTC(2015, 6, 1),
      y: 2
    }, {
      x: Date.UTC(2015, 6, 1), 
      x2: Date.UTC(2015, 7, 1),
      y: 3
    }, {
      x: Date.UTC(2015, 7, 1), 
      x2: Date.UTC(2015, 8, 10),
      y: 4
    }, {
      x: Date.UTC(2015, 8, 10), 
      x2: Date.UTC(2016, 4, 1),
      y: 5
    }],
    color: colors[7]
  }],
  yAxis: {
    title: '',
    categories: ['Госпрограмма', 'Исходно-разрешительная документация', 'Проектно-изыскательные работы', 'Материально-техническое обеспечение', 'Строительно-монтажные работы', 'Ввод в эксплуатацию'],
    min: 0,
    max: 5,
    showLastLabel: true,
    opposite: false,
    reversed: true
  },
  xAxis: {
    type: 'datetime',
    ordinal: false,
    pointInterval: 24 * 3600 * 1000 * 7, // one week   
    min: Date.UTC(2014, 3, 1),
    max: Date.UTC(2016, 4, 31),
    plotLines: [{
      value: new Date().getTime(),
      width: 1,
      color: colors[0],
      label: {
        text: 'Сегодня',
        align: 'left',
        textAlign: 'center',
        x: -8,
        y: 5,
        rotation: 270,
        verticalAlign: 'middle',
        zIndex: 99
      }
    }]
  },
  tooltip: { enabled: false },
  plotOptions: {
    xrange: {
      pointWidth: 13,
      pointRadius: 6,
      dataLabels: { 
        enabled: true,
        verticalAlign: 'bottom',
        inside: true,
        padding: 1,
        formatter: function() {
          var diff, percentage, value, days;
          diff = this.point.x2 - this.point.x;
          days = Math.floor(diff / 86400000);
          if (days!=0) {
            return days + ' д.'
          } else {
            return null
          }
        },
        style: {
          "color": "contrast", 
          "fontSize": "10px", 
          "fontWeight": "normal",
          "textShadow": "none" 
        }
      }
    }
  },
  rangeSelector: {
    // allButtonsEnabled: true
    // enabled: false
  },
  legend: { enabled: true, reversed: true },
  navigator: {
    baseSeries: 2,
    xAxis: {
      type: 'datetime',
      ordinal: false,
      min: Date.UTC(2014, 3, 1),
      max: Date.UTC(2016, 4, 31),
      pointInterval: 24 * 3600 * 1000 * 7 // one week   
    },
    yAxis: {
      reversed: true
    },
    series: {
      type: 'xrange',
      color: '#4572A7',
      fillOpacity: 0.05,
      // dataGrouping: {
      //   smoothed: true
      // },
      pointWidth: 2,
      marker: {
        enabled: false
      }
    }
  }
}