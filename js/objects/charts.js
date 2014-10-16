var charts ={
    document_id: 'document-chart',
    finance_id:  'finance-chart',
    filter: null,
    document_chart: null,
    finance_chart: null,
    count: 0,
    all_title_x:  250,
    all_title_y: 400,
    init: function(filter){
        this.filter = filter;
        this.createDocumentChart();
        this.redrawDocumentChart();
    },
    createDocumentChart: function(){
       this.document_chart=new Highcharts.Chart({
           credits:  {
               enabled: false
           },
           chart: {
               renderTo: this.document_id,
               plotBackgroundColor: null,
               plotBorderWidth: 0,
               plotShadow: true
           },
           title: {
               text: 'Наличие ГПЗУ'
           },
           tooltip: {
               formatter: function () {
                   var s ="";
                   $.each(this.series.points, function (i, point) {
                       s += "<b>"+point.name + '</b> ' + point.y + ' объектов <br/>';
                   });
                   return s;

               },
               shared: true,
               useHTML: true
           },
           plotOptions: {
               pie: {
                   center: ['50%', '35%'],
                   dataLabels: {
                       enabled: false
                   }
               }
           },
           series: [{
               type: 'pie',
               name: 'Статус получения: ',
               innerSize: '50%',
               data: [
                   ['С ГПЗУ',   0],
                   ['БЕЗ ГПЗУ',  0],
                   ['ПРОСРОЧЕНО', 0]

               ]
           }]
       });
       allTitle = this.document_chart.renderer.text(this.count, this.all_title_x, this.all_title_y).css({color: "black","font-size" : "70pt"}).add();
    },
    redrawDocumentChart: function(){
        var currentDocument = filter.getCurrentDocument()
        var data = {};
        $.each(filter.filtered_objects, function(i,obj){
            data[obj[currentDocument]] = (data[obj[currentDocument]] || 0) + 1
        });
        var series = []
        var summ = 0;
        for (variable in data) {
            series.push([variable, data[variable]])
            summ += data[variable];
        }
        charts.document_chart.series[0].setData(series, true);
        allTitle.attr({
            text: summ
        });
        charts.document_chart.setTitle({ text: charts.filter.getCurrentDocumentTitle() })

    },
    redrawAllCharts:function(){

        charts.filter.filter_objects();
        charts.redrawDocumentChart();
    }

}