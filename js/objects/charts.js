var charts ={
    document_id: 'document-chart',
    finance_id:  'finance-chart',
    work_id:  'work-chart',
    filter: null,
    document_chart: null,
    finance_chart: null,
    work_chart: null,
    count: 0,
    all_title_x:  250,
    all_title_y: 210,
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
               text: 'Выполнение плана',
               floating: true,
               x: 100,
               y: 50
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
               useHTML: true,
               enabled: false
           },
           plotOptions: {
               pie: {
                   center: ['22%', '50%'],
                   showInLegend: true,
                   dataLabels: {
                       enabled: false
                   },
                   size: 380
               }
           },
           legend: {
               layout: 'vertical',
               //backgroundColor: '#FFFFFF',
               align: 'left',
               verticalAlign: 'top',
               floating: true,
               x: 550,
               y: 60,
               useHTML: true,
               itemStyle: {
                   "color": "#333333",
                   "fontSize": "30px",
                   //"fontWeight": "bold",
                   "white-space": "normal" },
               labelFormatter: function () {
                   return '<div style="width: 550px;font-size: 33px; color: #91a0ab">' +
                       '<div class = "legend-series-name" style="float: left; width:375px; white-space: normal">'+this.name+'</div>' +
                       '<div style="text-align: right; float: right; width: 175px"> '+ ((this.y)) +'</div></div>';
               }
           },
           series: [{
               type: 'pie',
               name: 'Статус получения: ',
               innerSize: '50%',
               data: [['получено', 10] ]
           }]
       });
       allTitle = this.document_chart.renderer.text(this.count, this.all_title_x, this.all_title_y)
                                        .css({color: "#626160","font-size" : "36px", fontWeight:"bold"})
                                        .add();
        this.document_chart.renderer.text('(объектов)', this.all_title_x-40, this.all_title_y+30)
            .css({color: "#626160","font-size" : "28px", fontWeight:"bold"})
            .add();
       //this.document_chart.renderer.button('Список просроченных',
       //     50,
       //     820,
       //     objects_logic.showOverdues).css({
       //       color:'black',
       //        width:'600px',
       //        marginLeft:'300px',
       //        fontSize: '30px'
       //
       //    }).add();

        var img = this.document_chart.renderer.image('images/overdue.png',570,340,572,70);
        img.add();
        img.css({'cursor':'pointer'});
        //img.attr({'title':'Pop out chart'});
        img.on('click',objects_logic.showOverdues);
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
        }).css({"font-size" : "36px"});
//        charts.document_chart.setTitle({ text: charts.filter.getCurrentDocumentTitle() })
//        charts.document_chart.setTitle({ text: ''})

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
                text: 'Состояние оплат',
                floating: true,
                x: 100,
                y: 50
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
                useHTML: true,
                enabled: false
            },
            plotOptions: {
                pie: {
                    center: ['22%', '50%'],
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    },
                    size: 380
                }

            },

            legend: {
                layout: 'vertical',
                //backgroundColor: '#FFFFFF',
                align: 'left',
                verticalAlign: 'top',
                floating: true,
                x: 550,
                y: 60,
                useHTML: true,
                itemStyle: {
                    "color": "#333333",
                    "fontSize": "30px",
                    //"fontWeight": "bold",
                    "white-space": "normal" },

                labelFormatter: function () {
                    return '<div style="width: 550px;font-size: 33px; color: #91a0ab">' +
                        '<div class = "legend-series-name" style="float: left; width:350px; white-space: normal">'+this.name+'</div>' +
                        '<div style="text-align: right; float: right; width: 200px"> '+ thousands_sep((this.y/1000000).toFixed(0)) +' млн ₽ </div></div>';
                }
            },

            series: [{
                type: 'pie',
                name: 'Сумма',
                innerSize: '50%',
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
               plotShadow: false,
               type: 'bar',
               marginTop: -50

           },
           title: {
               text: 'Выполнение работ',
               margin:0,
               floating: true,
               y: 20
           },
           legend:{
               reversed: true,
               align: 'left',
               useHTML: true,
               floating: true,
               layout: 'horizontal',
               itemStyle: { "color": "#91a0ab",
                            "fontSize": "26px",
                            //"fontWeight": "bold",
                            "white-space": "normal"
                            //font: '18pt Helvetica, Arial, sans-serif'
               },
               labelFormatter: function () {
                   //console.log(this)
                   return '<div class = "legend-series-name" style="float: left; width: 500px; white-space: normal; ">'+this.name +
                       ' <span id="work-chart-values'+this._i+'"> '+ million_to_text((this.userOptions.data[0])) +'</span> </div>';
               }
           },
           xAxis: {
               lineWidth: 0,
               labels: {
                   enabled: false
               }
           },
           yAxis: {
               title:{
                   text: null
               },
               gridLineWidth: 0,
               labels: {
                   enabled: false
               }
           },
           tooltip: {
               formatter: function () {
                   var s ="";
                   console.log(this)
                   $.each(this.points, function (i, point) {
                       s += '<b style="color: '+point.series.color+'">'+point.series.name + '</b> ' + million_to_text(point.y) + ' ('+point.percentage.toFixed(2)+'%)<br/>';
                   });
                   return s;
               },
               shared: true,
               useHTML: true,
               enabled: false
           },

           plotOptions: {
               series: {
                   stacking: 'percent',
                   //borderRadius: 20,
                   pointWidth: 50
               }
           },


           series: [{
               name: 'Выполнено',
               data: [111]
           }, {
               name: 'Остаток выполнения',
               data: [222]
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

        charts.work_chart.series[0].setData([data[0][1]], false);
        charts.work_chart.series[1].setData([data[1][1]], false);
        $("#work-chart-values1").text(million_to_text(data[1][1]))
        $("#work-chart-values0").text(million_to_text(data[0][1]))
        charts.work_chart.redraw();

    },
    redrawAllCharts:function(){
        charts.filter.filter_objects();
        charts.redrawDocumentChart();
        charts.redrawFinanceChart();
        charts.redrawWorkChart();
    }

}