var budget_dynamics = {
  title: {
    text: "Динамика освоения бюджета"
  },
  chart: {
    type: "column",
  },
  series: [{
      name: 'Факт',
      data: [880, 2120, 2860, 3396, 3550, 3730, 4395, 5055, 5571],
      color: colors[2]
    }, {
      name: 'Прогноз',
      data: [null, null, null, null, null, null, null, null, null, 5902, 6603, 7210, 7636, 8152, 8668, 9185, 9701, 10217],
      color: colors[11]
    }, {
      name: 'План',
      type: 'spline',
      data: [1033, 2300, 2800, 3100, 3200, 3300, 3900, 4600, 5000, 5100, 5200, 7300, 7800, 8200, 8800, 9500, 10000, 12000],
      color: colors[7]
    }],
  tooltip: { 
    shared: true,
    pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.y}</b> млн ₽<br/>'
  },
  plotOptions: {
    column: { stacking: 'normal' }
  },
  xAxis: {
    title: false,
    categories: ["06.2015", "07.2015", "08.2015", "09.2015", "10.2015", "11.2015", "12.2015", "01.2016", "02.2016", "03.2016", "04.2016", "05.2016", "06.2016", "07.2016", "08.2016", "09.2016", "10.2016", "11.2016"]
  },
  yAxis: { title: { text: 'млн ₽' } }
}