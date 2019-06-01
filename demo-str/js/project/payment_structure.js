var payment_structure = {
  title: {
    text: "Структура освоения"
  },
  chart: {
    type: 'column'
  },
  series: [{
      name: 'План',
      data: [5500],
      color: colors[4],
      dataLabels: { enabled: false },
      showInLegend: false
    }, {
      name: 'Ещё не заактировано',
      data: [null, 516],
      color: colors[2]
    }, {
      name: 'Заактировано, но не оплачено',
      data: [null, 660],
      color: colors[7]
    }, {
      name: 'Оплачено',
      data: [null, 4395],
      color: colors[6]
  }],
  tooltip: { 
    enabled: false
  },
  plotOptions: {
    column: { 
      stacking: 'normal',
      dataLabels: {
        enabled: true
      }
    }
  },
  xAxis: {
    title: false,
    categories: ["Запланировано", "Выполнено"]
  },
  yAxis: { 
    title: { 
      text: 'млн ₽' 
    },
    stackLabels: { enabled: true }
  },
  legend: { reversed: true }
}