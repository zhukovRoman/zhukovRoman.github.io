var object_shower = {
    _id: null,
    smr_finance_chart: null,
    work_chart: null,
    bidjet_chart: null,
    object: null,
    map: null,
    init: function(data){
        var parameters = data.split("?")[1];
        id = parameters.replace("id=","");
        this._id = id;
        this.object =  objects_detail[id]
        if (this.object==null) return;

        $("#tabs input").change(object_shower.changeContent);

        this.fillTeps();
        this.createWorkChart();
        this.createFinanceChart();
        this.createBudjetChart();
        this.fillTenders();
        this.fillDocuments();
        this.fillPlan();
        this.fillVisitInfo();

        this.initMap();
    },
    changeContent: function(){


        $('div[data-tab="fin-tab"]').hide();
        $('div[data-tab="tenders-tab"]').hide();
        $('div[data-tab="plan-tab"]').hide();
        $('div[data-tab="ing-prepare-tab"]').hide();
        $('div[data-tab="'+$(this).attr("id")+'"]').show();
    },
    createFinanceChart: function(){
        this.smr_finance_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                renderTo:'smr-fin-chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Финансы по СМР',
                style: {
                    "fontSize": "20pt"
                }
            },
//            subtitle: {
//                text: '<%= @object.get_object_finance_by_type(1).take.organization_name %> ' +
//                    'по договору '+
//                    '<%= @object.get_object_finance_by_type(1).take.document_number %>'+
//                    '<br>' +
//                    'Сумма конракта '+
//                    '<%= number_to_currency(@object.get_object_finance_by_type(1).take.work_summ.round,
//                unit: "₽", separator: ",", delimiter: " ", format: "%n %u", precision: 0) %>'
//    },
    tooltip: {
        formatter: function () {
            var s ="";
            sum = 0;
            $.each(this.series.points, function (i, point) {
                s += "<b>"+point.name + '</b> ' + million_to_text(point.y)+'<br/>';
                sum += point.y;
            });
            s += "<b>Стоимость по договору </b>" + million_to_text(sum) + '<br/>'
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
            },
            showInLegend: true
        }
    },
    legend: {
        layout: 'vertical',
        backgroundColor: '#FFFFFF',
        align: 'left',
        verticalAlign: 'top',
        floating: true,
        x: 30,
        y: 630,
        useHTML: true,
        itemStyle: { "color": "#333333", "fontSize": "18pt", "fontWeight": "bold", "white-space": "normal" },
        labelFormatter: function () {
            return '<div style="width: 500px;border-bottom: 1px solid;"><div class = "legend-series-name" style="float: left; width: 270px; white-space: normal">'+this.name+'</div>' +
                '<div style="text-align: right; float: right; width: 230px"> '+ million_to_text(this.y) +'</div></div>';
        }
    },
    series: [{
        type: 'pie',
        name: 'Сумма',
        innerSize: '50%',
        data: [
            ['Оплачено не в счет авансов', object_shower.object.payed_for_work],
            ['Авансов выдано и погащено', object_shower.object.avans_pogasheno ],
            ['Авансов выдано и не погащено', object_shower.object.avans_not_pogasheno],
            ['Осталось оплатить',  object_shower.object.payed_left]
            ]
        }]
    });
    } ,
    createWorkChart: function(){
      this.work_chart = new Highcharts.Chart({
          credits:  {
              enabled: false
          },
          chart: {
              renderTo:'smr-work-chart',
              plotBackgroundColor: null,
              plotBorderWidth: null,
              plotShadow: false
          },
          title: {
              text: 'Выполнение СМР',
              style: {
                  "fontSize": "20pt"
              }
          },
//          subtitle: {
//              text: '<%= @object.get_object_finance_by_type(1).take.organization_name %> ' +
//                  'по договору '+
//                  '<%= @object.get_object_finance_by_type(1).take.document_number %>'+
//                  '<br>' +
//                  'Сумма конракта '+
//                  '<%= number_to_currency(@object.get_object_finance_by_type(1).take.work_summ.round,
//              unit: "₽", separator: ",", delimiter: " ", format: "%n %u", precision: 0) %>'
//    },
        tooltip: {
            formatter: function () {
                var s ="";
                sum = 0;
                $.each(this.series.points, function (i, point) {
                    s += "<b>"+point.name + '</b> ' + thousands_sep((point.y/1000000).toFixed(3)) + ' млн ₽ <br/>';
                    sum += point.y;
                });
                s += "<b>Стоимость по договору </b>" + thousands_sep((sum/1000000).toFixed(3)) + ' млн ₽ <br/>'
                return s;
            },
            shared: true,
            useHTML: true
        },
      legend: {
          layout: 'vertical',
          backgroundColor: '#FFFFFF',
          align: 'left',
          verticalAlign: 'top',
          floating: true,
          x: 30,
          y: 630,
          useHTML: true,
          itemStyle: { "color": "#333333", "fontSize": "18pt", "fontWeight": "bold", "white-space": "normal" },
          labelFormatter: function () {
              return '<div style="width: 500px;border-bottom: 1px solid;"><div class = "legend-series-name" style="float: left; width: 270px; white-space: normal">'+this.name+'</div>' +
                  '<div style="text-align: right; float: right; width: 230px"> '+ thousands_sep((this.y/1000000).toFixed(3)) + ' млн ₽</div></div>';
          }
      },
        plotOptions: {
            pie: {
                center: ['50%', '43%'],
                dataLabels: {
                    enabled: false
                },
                showInLegend: true
            }
        },
        series: [{
            type: 'pie',
            name: 'Сумма',
            innerSize: '50%',
            data: [
                ['Работ выполнено',  object_shower.object.work_complite],
                ['Работ не выполнено', object_shower.object.work_left]
                ]
            }]
        });
        } ,
    createBudjetChart: function(){
        this.bidjet_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                renderTo: 'budjet-chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'bar'
            },
            title: {
                text: 'Освоение бюджета в 2014 году'
            },
            legend:{
                align: 'left',
                useHTML: true,
                floating: true,
                layout: 'horizontal',
                itemStyle: { "color": "#333333", "fontSize": "18pt", "fontWeight": "bold", "white-space": "normal" },
                labelFormatter: function () {
                    console.log(this)
                    return '<div class = "legend-series-name" style="float: left; width: 500px; white-space: normal">'+this.name +
                        ' <span id="work-chart-values'+this._i+'"> '+thousands_sep((this.userOptions.data[0]/1000000).toFixed(3)) + ' млн ₽</span> </div>';
                }
            },
            plotOptions: {
                series: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: 'Освоено',
                data: [object_shower.object.budjet_payed]
            }, {
                name: 'Остаток бюджета',
                data: [object_shower.object.limit_residue]
            }]
        });
    },
    initMap: function(){
        console.log('into map init')
        var center = [55.76954, 37.621587];
        ymaps.ready (function(){
            console.log('ymap ready')
            object_shower.map = new ymaps.Map("map_detail", {
                center: [object_shower.object.lat,object_shower.object.lng],
                zoom: 13,
                controls: ["default"]
            });
            object_shower.map.controls.remove('fullscreenControl');
            object_shower.map.controls.remove('geolocationControl');
            object_shower.map.controls.remove('searchControl');
            object_shower.map.controls.remove('typeSelector');
            var marker = new ymaps.Placemark([object_shower.object.lat,object_shower.object.lng]);
            object_shower.map.geoObjects.add(marker);
        })
    },
    fillTeps: function(){
         $('#object-name-address').text(object_shower.object.region +', '
                                        + object_shower.object.address +', '
                                        + object_shower.object.appointment+', '
                                        + object_shower.object.year_correct);
         $('#smr-title').text(object_shower.object.smr_title);
         $('#smr-amount').text(million_to_text(object_shower.object.work_summ));
         $.each($("#teps div.tep-value"), function(i, tep){
            var t = $(tep);
            t.html(object_shower.object[t.attr('data-src')]);
         })
        $.each($("#teps div.tep-value[data-fin='true']"), function(i,tep){
            var t = $(tep);
            t.text(million_to_text(t.text()));
        })
    },
    fillDocuments: function(){
        $.each($("#documents_info div[data-src]"), function(i, tep){
            var t = $(tep);
            t.html(object_shower.object[t.attr('data-src')]);
        })
    } ,
    fillPlan: function(){
        $.each($("#prepare div[data-src]"), function(i, tep){
            var t = $(tep);
            t.html(object_shower.object[t.attr('data-src')]);
        })
    },
    fillTenders: function(){
        if(object_shower.object.tenders.length==0)
            $("#tenders-content").html("Тендеры не проводились");
        else{
           var tbody = $('#tenders_table_body');
            tbody.html('');
            var html = ''
            $.each(object_shower.object.tenders, function(i,t){
                html+=  '<tr>'+
                            '<td>'+t.type+'</td>'+
                            '<td>'+t.status+'</td>'+
                            '<td>'+t.date_start+'</td>'+
                            '<td>'+t.date_end +'</td>' +
                            '<td>'+million_to_text(t.price_begin)+'</td>' +
                            '<td>'+million_to_text(t.price_end)+'</td>'+
                            '<td>'+t.percent+'</td>'+
                            '<td>'+t.bid_all + '/' +  t.bid_accept +'</td>'
                        '</tr>'
            })
            tbody.html(html);
        }



    },
    fillVisitInfo: function(){
        var result = ''
        getProgressBar = function(percent){
            if (percent==null) return '<div></div>';
            return  '<div class="progress">'+
                '<div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="'+percent+'" style="width:'+percent+'%">'+
                percent+'% </div> </div>';
        }

        $.each (object_shower.object.visit_info, function(name, percent){
            result += '<div>'+ "<div>"+name+"</div>"+ getProgressBar(percent)
                    '</div>'
            //console.log(name, ":", percent)
            $("#visit_info").html(result);
        })
        $("div.ui-bar h3 span[data-src]").html(object_shower.object['visit_date'])

    }
}