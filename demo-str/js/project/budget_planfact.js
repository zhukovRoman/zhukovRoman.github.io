var budget_planfact = {
  title: {
    text: "План-факт освоения бюджета государственных программ"
  },
  chart: {
    type: 'columnrange',
    inverted: true
  },
  series: [{
      name: 'План',
      data: [[0, 12000]],
      color: colors[7]
    }, {
      name: 'Факт',
      data: [[0, 5571]],
      color: colors[2]
    }, {
      name: 'Отклонение',
      data: [{high: 12000, low: 5571, color: colors[4]}],
      color: colors[11],
      dataLabels: { enabled: true }
  }],
  tooltip: { 
    enabled: false
  },
  plotOptions: {
    columnrange: { 
      dataLabels: {
        enabled: false,
        inside: true,
        align: 'center',
        formatter: function() {
          var diff, percentage, value;
          diff = this.point.high - this.point.low;
          return diff
        }
      }
    }
  },
  xAxis: {
    title: false,
    categories: [""]
  },
  yAxis: { 
    title: { 
      text: 'млн ₽' 
    },
    min: 0,
    max: 12100 
  }
}