var payment_statuses = {
  title: {
    text: "Статусы освоения"
  },
  chart: {
    type: 'column'
  },
  series: [{
      name: 'Запланировано',
      data: [5500],
      color: colors[7]
    }, {
      name: 'Выполнено',
      data: [5571],
      color: colors[2]
    }, {
      name: 'Заактировано',
      data: [5055],
      color: colors[5]
    }, {
      name: 'Оплачено',
      data: [4395],
      color: colors[3]
  }],
  tooltip: { 
    enabled: false
  },
  plotOptions: {
    column: { 
      dataLabels: {
        enabled: true
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
    }
  }
}