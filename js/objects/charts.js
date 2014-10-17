var charts ={
    document_id: 'document-chart',
    finance_id:  'finance-chart',
    work_id:  'work-chart',
    filter: null,
    document_chart: null,
    finance_chart: null,
    work_chart: null,
    count: 0,
    all_title_x:  230,
    all_title_y: 350,
    init: function(filter){
        this.filter = filter;
        this.createDocumentChart();
        this.redrawDocumentChart();
        this.createWorkChart();
        this.createFinanceChart();

        this.redrawAllCharts();
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
               text: ''
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
                   center: ['50%', '32%'],
                   dataLabels: {
                       enabled: false
                   }
               }
           },
           series: [{
               type: 'pie',
               name: 'Статус получения: ',
               innerSize: '50%',
               data: [ ]
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
        }).css({"font-size" : "70pt"});
//        charts.document_chart.setTitle({ text: charts.filter.getCurrentDocumentTitle() })
        charts.document_chart.setTitle({ text: ''})

    },

    createFinanceChart: function(){
        this.finance_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                renderTo: this.finance_id,
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: ''
            },
            tooltip: {
                formatter: function () {
                    var s ="";
                    $.each(this.series.points, function (i, point) {
                        s += "<b>"+point.name + '</b> ' + thousands_sep((point.y/1000000).toFixed(0)) + ' млн ₽ <br/>';
                    });
                    return s;
                },
                shared: true,
                useHTML: true
            },
            plotOptions: {
                pie: {
                    center: ['50%', '32%'],
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    }
                }

            },
            series: [{
                type: 'pie',
                name: 'Сумма',
                innerSize: '60%',
                data: [ ]
            }]
        });
    },
    redrawFinanceChart: function(){
        var data = [
            ['Оплачено не в счет авансов',   0],
            ['Авансов выдано и погашено',       0],
            ['Авансов выдано и непогашено',   0],
            ['Остаток оплаты',   0]
        ];
        $.each(filter.filtered_objects, function(i,obj){
            data[0][1]+=obj.payed
            data[1][1]+=obj.avans_pogasheno
            data[2][1]+=obj.avans_ne_pogasheno
            data[3][1]+=obj.payed_left
        });
        charts.finance_chart.series[0].setData(data, true);
    },

    createWorkChart: function(){
       charts.work_chart = new Highcharts.Chart({
           credits:  {
               enabled: false
           },
           chart: {
               renderTo: charts.work_id,
               plotBackgroundColor: null,
               plotBorderWidth: null,
               plotShadow: false
           },
           title: {
               text: 'Выполнение работ'
           },
           tooltip: {
               formatter: function () {
                   var s ="";
                   $.each(this.series.points, function (i, point) {
                       s += "<b>"+point.name + '</b> ' + thousands_sep((point.y/1000000).toFixed(0)) + ' млн ₽ <br/>';
                   });
                   return s;
               },
               shared: true,
               useHTML: true
           },
           plotOptions: {
               pie: {
                   center: ['50%', '50%'],
                   showInLegend: true
               }

           },
           series: [{
               type: 'pie',
               name: 'Сумма',
               innerSize: '60%',
               data: [
                   ['Не оплачено',   0],
                   ['Выполнено и оплачено',       0],
                   ['Оплачено, но не выполнено',    0]

               ]
           }]
       });
    },
    redrawWorkChart:function(){
        var data = [
            ['Выполнено',   0],
            ['Остаток выполнения',   0]
            //['Выполнено в счет аванса',       0],
        ];
        $.each(filter.filtered_objects, function(i,obj){
            data[0][1]+=obj.work_complete
            //data[1][1]+=obj.avans_pogasheno
            data[1][1]+=obj.work_left
        });
        charts.work_chart.series[0].setData(data, true);
    },
    redrawAllCharts:function(){
        console.log('fsad');
        charts.filter.filter_objects();
        charts.redrawDocumentChart();
        charts.redrawFinanceChart();
        charts.redrawWorkChart();
    }

}