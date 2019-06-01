$(function () {
  Highcharts.setOptions(options);
  $('#budget_dynamics').highcharts(budget_dynamics);
  $('#budget_planfact').highcharts(budget_planfact);
  $('#payment_statuses').highcharts(payment_statuses);
  $('#gantt_chart').highcharts('StockChart', gantt_chart);
});