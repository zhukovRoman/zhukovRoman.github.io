var sales_logic = {
    current_chart: null,
    init: function(){
        this.setCurrentChart();
        $('#rooms-tabs input, #sales-filter div.objects input').change(sales_logic.applyFilters);
        $('#mesure-tabs input, #interval-select, #statuses_detail_charts_tabs input').change(sales_logic.applyFilters);
        $('#sales-charts-tabs input').change(sales_logic.setCurrentChart)

    },
    setCurrentChart: function(){
        $('#sales-charts-content div.sales_chart').hide();
        var div_id = $("#sales-charts-tabs input:checked").attr('data-div');
        $('#'+div_id).show();
        var name = $("#sales-charts-tabs input:checked").attr('data-chart');
        sales_logic.current_chart = charts[name];
        sales_logic.current_chart.createChart();
        sales_logic.current_chart.need_measure ?
                            sales_filter.showMeasureFilter() :
                            sales_filter.hideMeasureFilter();
        sales_logic.current_chart.need_interval ?
                                sales_filter.showIntervalFilter() :
                                sales_filter.hideIntervalFilter()
    },
    applyFilters: function(){
        sales_logic.current_chart.redrawChart();
    },
    showCommonInfo: function(){
        $('#main_content').hide();
        $('#common_content').show();
        $('#back-button').show();
        sales_logic.createAndFillCommonChart();
    },
    showChartsPart: function(){
        $('#common_content').hide();
        $('#back-button').hide();
        $('#main_content').show();
    },
    createAndFillCommonChart: function(){
        apartment_all_sell_status_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                type: 'column',
                renderTo:'sales_common_info_chart'
            },
            title: {
                text: 'Всего продано квартир'
            },
            xAxis: {
                categories: sales_objects
            },
            yAxis: {
                title: {
                    text: 'Количество'
                }
            },
            tooltip:{
                shared: true,
                valueSuffix: " кв"
            },
            plotOptions: {
                column: {
                    stacking: 'percent'
                }
            },
            series: [{
                name: '1-ком осталось',
                data: [10, 32, 0],
                stack: "1k",
                color: 'rgba(124, 181, 236, 0.5)'
            },{
                name: '1-ком продано',
                data: [32, 0, 0],
                stack: "1k",
                color: 'rgb(124, 181, 236)'

            },{
                name: '2-ком осталось ',
                data: [18, 64, 86],
                stack: "2k",
                color: 'rgba(187, 83, 236, 0.5)'
            },{
                name: '2-ком продано ',
                data: [46, 0, 42],
                stack: "2k",
                color: 'rgb(187, 83, 236)'
            },{
                name: '3-ком осталось',
                data: [10, 33, 109],
                stack: '3k',
                color: "rgba(144, 237, 125, 0.5)"
            },{
                name: '3-ком продано',
                data: [23, 0, 19],
                stack: '3k',
                color: "rgb(144, 237, 125)"
            }]
        });

        var data = {}

        $.each(apartments, function(i,apart){
            if(data[apart.object]==null) data[apart.object]={sell:[0,0,0,0], not_sell:[0,0,0,0]}
            if (apart.status=="ДКП" || apart.status=="ПС")
                data[apart.object]['sell'][apart.rooms-1]++ ;
            else data[apart.object]['not_sell'][apart.rooms-1]++;
        })

        var k1_sell = [];
        var k2_sell = [];
        var k3_sell = [];
        var k1_not_sell = [];
        var k2_not_sell = [];
        var k3_not_sell = [];
        var objs = []
        $.each (data, function(obj,val){
            objs.push(obj);
            k1_sell.push(val.sell[0]);
            k2_sell.push(val.sell[1]);
            k3_sell.push(val.sell[2]);

            k1_not_sell.push( val.not_sell[0]);
            k2_not_sell.push( val.not_sell[1]);
            k3_not_sell.push( val.not_sell[2]);
        })

        var data = [k1_not_sell, k1_sell, k2_not_sell, k2_sell, k3_not_sell, k3_sell, objs];
        apartment_all_sell_status_chart.xAxis[0].setCategories(data[6],false);
        apartment_all_sell_status_chart.series[0].setData(data[0],false);
        apartment_all_sell_status_chart.series[1].setData(data[1],false);
        apartment_all_sell_status_chart.series[2].setData(data[2],false);
        apartment_all_sell_status_chart.series[3].setData(data[3],false);
        apartment_all_sell_status_chart.series[4].setData(data[4],false);
        apartment_all_sell_status_chart.series[5].setData(data[5]);
    },
    getWeeksCategories: function(){
        res = []
        for (var i=4; i>=0; i--)
        {
            var start = moment().subtract(i, 'week').startOf('isoweek')
            var end = moment().subtract(i, 'week').endOf('isoweek')
            res.push(start.format("DD.MM")+"-"+end.format("DD.MM"))
        }
        return res;
    },
    getWeeksStarts: function(){
        res = []
        for (var i=4; i>=0; i--)
        {
            var start = moment().subtract(i, 'week').startOf('isoweek')
            res.push(start)
        }
        return res;
    },
    getWeeksStartsForCategories: function (){
        res = []
        for (var i=4; i>=0; i--)
        {
            var start = moment().subtract(i, 'week').startOf('isoweek')
            res.push(start.format("DD.MM"));
        }
        return res;
    },
    getIntervalStarts: function (interval){
        res = []
        for (var i=4; i>=0; i--){
            var start;
            var end;
            switch (interval) {
                case 'week':
                    start = moment().subtract(i, 'week').startOf('isoweek');
                    end = moment().subtract(i-1, 'week').startOf('isoweek');
                    break;
                case 'month':
                    start = moment().subtract(i, 'month').startOf('month');
                    end = moment().subtract(i-1, 'month').startOf('month');
                    break;
                case 'qartal':
                    start = moment().subtract(i*3, 'month').startOf('quarter');
                    end = moment().subtract((i-1)*3, 'month').startOf('quarter');
                    break;
                case 'half_year':
                    start_of_current_quarter =
                        (moment().quarter()%2==1) ?
                            moment().startOf('quarter') :
                            moment().add(3, 'month').startOf('quarter') ;
                    end_of_current_quarter =
                        (moment().quarter()%2==0) ?
                            moment().endOf('quarter') :
                            moment().subtract(3, 'month').endOf('quarter') ;

                    start = start_of_current_quarter.subtract((i+1)*6, 'month');
                    end = end_of_current_quarter.subtract((i)*6, 'month');
                    break;
                case 'year':
                    start = moment().subtract(i, 'year').startOf('year');
                    end = moment().subtract(i-1, 'year').startOf('year');
                    break;
                default:
                    start = moment().subtract(i, 'week').startOf('isoweek');
                    end = moment().subtract(i-1, 'week').startOf('isoweek');
                    break;
            }
            res.push({start: start, end: end})
        }
        return res;
    },
    getIntervalCategories: function (interval){
        res = []
        for (var i=4; i>=0; i--)
        {
            var start;

            switch (interval) {
                case 'week':
                    start = moment().subtract(i, 'week').startOf('isoweek')
                    var end = moment().subtract(i, 'week').endOf('isoweek')
                    res.push(start.format("DD.MM")+"-"+end.format("DD.MM"))
                    break;
                case 'month':
                    res.push (months[moment().subtract(i, 'month').get('month')+1])
                    break;
                case 'qartal':
                    res.push(moment().subtract(i*3, 'month').format("Q/YYYY"));
                    break;
                case 'half_year':
                    start_of_current_quarter =
                        (moment().quarter()%2==1) ?
                            moment().startOf('quarter') :
                            moment().add(3, 'month').startOf('quarter') ;
                    end_of_current_quarter =
                        (moment().quarter()%2==0) ?
                            moment().endOf('quarter') :
                            moment().subtract(3, 'month').endOf('quarter') ;

                    start = start_of_current_quarter.subtract((i+1)*6, 'month');
                    end = end_of_current_quarter.subtract((i)*6, 'month');
                    res.push((months[start.month()+1])+"/"+start.format('YY')+"-"+months[end.month()+1]+"/"+end.format('YY'))
                    break;
                case 'year':
                    res.push(moment().subtract(i, 'year').format("YYYY"));
                    break;
                default:
                    start = moment().subtract(i, 'week').startOf('isoweek')
                    var end = moment().subtract(i, 'week').endOf('isoweek')
                    res.push(start.format("DD.MM")+"-"+end.format("DD.MM"))
                    break;
            }

        }
        return res;
    }
}

var sales_filter = {
    filtered_apartments: [],
    initFilter: function(){
      this.fillObjects();
    },
    fillObjects: function(){
       var el = $('#sales-filter div.objects');
        $.each(sales_objects, function(i,val){
           el.append('<input type="checkbox" data-role="none" data-value="'+val+'" checked>'+val);
        })
    },
    getMeasureFilterValue: function(){
        return $('#mesure-tabs input:checked').attr('id')
    },
    getIntervalValue: function(){
       return $('#interval-select').val();
    },
    getObjectsFilterValue: function(){
        var res = []
        $.each($('#sales-filter div.objects input:checked'), function(i,val){
           res.push($(val).attr('data-value'))
        })
        return res;
    },
    getRoomsValue: function(){
        var room = $('#rooms-tabs input:checked').attr('data-room')
        if (room=='all') return [1,2,3,4]
        parseInt(room)
        return [parseInt(room)]
    },
    getFilteredApartments: function(){
        sales_filter.filtered_apartments.length = 0;
        var selected_objects =  sales_filter.getObjectsFilterValue();
        var selected_rooms = sales_filter.getRoomsValue();
        $.each(apartments, function(i,val){
             if($.inArray( val.object, selected_objects)==-1 ||
                 $.inArray( val.rooms, selected_rooms)==-1) return;
            sales_filter.filtered_apartments.push(val)
        })

        return sales_filter.filtered_apartments;
    },
    showMeasureFilter:function(){
        $('#measure-filter').show();
    },
    hideMeasureFilter:function(){
        $('#measure-filter').hide();
    },
    showIntervalFilter:function(){
        $('#interval-filter').show();
    },
    hideIntervalFilter:function(){
        $('#interval-filter').hide();
    },
    getCurrentDetailStatus:function(){
        return $("#statuses_detail_charts_tabs input:checked").attr('data-status')
    }



}

var charts = {
    floorPriceChart: {
       _div_id:  'floors_price',
       chart: null,
       need_interval: false,
       need_measure: false,
       createChart: function (){
           this.chart = new Highcharts.Chart({
               credits:  {
                   enabled: false
               },
               title: {
                   text: 'Стоимость м2 от этажа'
               },
               chart: {
                   //type: 'column',
                   renderTo: this._div_id
               },
               xAxis: {
                   min: 1,
                   max: 20,
                   allowDecimals: false,
                   tickInterval: 1
//                  type: 'datetime'
               },

               yAxis: {
                   title: {
                       text: 'Стоимость квадратного метра'
                   },
                   labels: {
                       formatter: function () {
                           return this.value/1000 + ' тыс ₽';
                       }
                   }
               },
               xAxis: {
                   tickmarkPlacement: 'on',
                   title: {
                       text: 'Этаж'
                       //align: 'center'
                   }
               },
               tooltip: {
                   formatter: function() {
                       var result = '<b>' + this.x + '</b>';
                       $.each(this.points, function(i, datum) {
                           if (i%2==0)
                               result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                   + datum.series.name + '</i>: '
                                   + thousands_sep(datum.y.toFixed(0)) + ' ₽ ';
                           else
                               result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                   + datum.series.name + '</i>: '
                                   + thousands_sep(datum.point.low.toFixed(0)) + ' - '
                                   + thousands_sep(datum.point.high.toFixed(0)) + ' ₽ ';
                       });
                       return result;
                   },
                   shared: true,
                   useHTML: true
               },

               legend: {
               },

               series: [{
                   name: 'Оценочная',
                   data: [],
                   zIndex: 1,
                   marker: {
                       fillColor: 'white',
                       lineWidth: 2,
                       lineColor: Highcharts.getOptions().colors[0]
                   }
               }, {
                   name: 'Корридор оценочной цены',
                   data: [],
                   type: 'arearange',
                   lineWidth: 0,
                   linkedTo: ':previous',
                   color: Highcharts.getOptions().colors[0],
                   fillOpacity: 0.3,
                   zIndex: 0
               },{
                   name: 'Итоговая',
                   data: [],
                   zIndex: 1,
                   marker: {
                       fillColor: 'white',
                       lineWidth: 2,
                       lineColor: Highcharts.getOptions().colors[1]
                   }
               }, {
                   name: 'Корридор итоговой цены',
                   data: [],
                   type: 'arearange',
                   lineWidth: 0,
                   linkedTo: ':previous',
                   color: Highcharts.getOptions().colors[1],
                   fillOpacity: 0.3,
                   zIndex: 0
               }]
           });
           this.redrawChart();
       },
       redrawChart: function(){
           var data =  this.getData();
           //console.log(data.range_start)
           this.chart.xAxis[0].setCategories(data.cat,false)
           this.chart.series[0].setData(data.avgs_start,false)
           this.chart.series[2].setData(data.avgs_end, false)
           this.chart.series[1].setData(data.range_start, false)
           this.chart.series[3].setData(data.range_end, false)
           this.chart.redraw();
       },
       getData: function(){
           var floors = []
           var data_avg = {first_price:[],end_price:[], count:[]};
           var data_range = {first_price:[],end_price:[]};

           $.each(sales_filter.getFilteredApartments(), function(i, val){
               if (val.dkp_date==null) return;

               var floor = val['floor']
               if (floors.indexOf(floor)==-1) floors.push(floor);
               if (data_range.first_price[floor]==null) data_range.first_price[floor] = [10000000, 0]
               if(data_range.first_price[floor][0]>val.price_m2_start) data_range.first_price[floor][0]=val.price_m2_start
               if(data_range.first_price[floor][1]<val.price_m2_start) data_range.first_price[floor][1]=val.price_m2_start

               if (data_range.end_price[floor]==null) data_range.end_price[floor] = [10000000, 0];
               if(data_range.end_price[floor][0]>val.price_m2_end) data_range.end_price[floor][0]=val.price_m2_end
               if(data_range.end_price[floor][1]<val.price_m2_end) data_range.end_price[floor][1]=val.price_m2_end

               if(data_avg.count[floor]==null) data_avg.count[floor]=0
               data_avg.count[floor]++
               data_avg.first_price[floor]=val.price_m2_start+(data_avg.first_price[floor]||0)
               data_avg.end_price[floor]=val.price_m2_end+(data_avg.end_price[floor]||0)

           })

           floors= floors.sort(function(a,b){return a-b;});
           var avgs_start = [];
           var avgs_end = [];
           var range_start = [];
           var range_end = [];
           $.each(data_avg.first_price, function(i,price){
               if(price == null) return;
               avgs_start.push([floors.indexOf(i),data_avg.first_price[i]/data_avg.count[i]])
           })
           $.each(data_avg.end_price, function(i,price){
               if(price == null) return;
               avgs_end.push ([floors.indexOf(i),data_avg.end_price[i]/data_avg.count[i]])
           })

           $.each(data_range.first_price, function(i,range){
               if(range == null) return;
               range_start.push ([floors.indexOf(i), range[0], range[1]])
           })
           $.each(data_range.end_price, function(i,range){
               if(range == null) return;
               range_end.push ([floors.indexOf(i), range[0], range[1]])
           })

           return {cat: floors, avgs_start: avgs_start, avgs_end: avgs_end, range_start: range_start, range_end: range_end};
       }
    },
    avgM2Price: {
        _div_id:  'avg_m2_price',
        chart: null,
        need_interval: false,
        need_measure: false,
        createChart: function (){
            this.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    renderTo: this._div_id
                },
                title: {
                    text: 'Стоимость кв м'
                },

                xAxis: {
                    categories: sales_logic.getWeeksCategories()
                    //tickmarkPlacement: 'on'
                },

                yAxis: {
                    title: {
                        text: 'тыс ₽'
                    },
                    labels: {
                        formatter: function () {
                            return this.value/1000 + ' тыс ₽';
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        $.each(this.points, function(i, datum) {
                            if (i%2==0)
                                result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                    + datum.series.name + '</i>: '
                                    + thousands_sep(datum.y.toFixed(0)) + ' ₽ ';
                            else
                                result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                    + datum.series.name + '</i>: '
                                    + thousands_sep(datum.point.low.toFixed(0)) + ' - '
                                    + thousands_sep(datum.point.high.toFixed(0)) + ' ₽ ';
                        });
                        return result;
                    },
                    shared: true,
                    useHTML: true
                },

                legend: {
                },
                series: [{
                    name: 'Начальная стоимость',
                    data: [1,1,1,1,1],
                    zIndex: 10,
                    marker: {
                        fillColor: 'white',
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[0]
                    }
                },{
                    name: 'Диапазон (начальная)',
                    data: [],
                    type: 'arearange',
                    lineWidth: 0,
                    linkedTo: ':previous',
                    zIndex: 2,
                    color: Highcharts.getOptions().colors[0],
                    fillOpacity: 0.15
                },{
                    name: 'Средняя по приказу',
                    data: [],
                    zIndex: 6,
                    marker: {
                        fillColor: 'white',
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[2]
                    },
                    color: Highcharts.getOptions().colors[2]
                },{
                    name: 'Диапазон (по приказу)',
                    data: [],
                    type: 'arearange',
                    lineWidth: 0,
                    linkedTo: ':previous',
                    color: Highcharts.getOptions().colors[2],
                    zIndex: 2,
                    fillOpacity: 0.15
                },{
                    name: 'Средняя итоговая',
                    data: [],
                    zIndex: 8,
                    marker: {
                        fillColor: 'white',
                        lineWidth: 2,
                        lineColor: Highcharts.getOptions().colors[1]
                    },
                    color: Highcharts.getOptions().colors[1]
                },{
                    name: 'Диапазон (итоговая)',
                    data: [],
                    type: 'arearange',
                    lineWidth: 0,
                    linkedTo: ':previous',
                    color: Highcharts.getOptions().colors[1],
                    zIndex: 1,
                    fillOpacity: 0.15
                }]


            });
            this.redrawChart();
        },
        redrawChart: function(){
            var data = this.getData();
            this.chart.series[0].setData(data.start_price, false)
            this.chart.series[1].setData(data.start_price_range, false)

            this.chart.series[2].setData(data.contract_price, false)
            this.chart.series[3].setData(data.contract_price_range, false)

            this.chart.series[4].setData(data.end_price, false)
            this.chart.series[5].setData(data.end_price_range, false)
            this.chart.redraw();
        },
        getData: function(){
            var weeks_group = []

            $.each(sales_filter.getFilteredApartments(), function(i,val){

                apart_date = moment(val.dkp_date)

                $.each(sales_logic.getWeeksStarts(), function(t,week){
                    if(weeks_group[t]==null) weeks_group[t]=[]
                    if (apart_date.diff(week, 'days')>=0 && apart_date.diff(week, 'days')<7)
                    {
                        weeks_group[t].push(val)
                    }
                })
            })

            var weeks_data = [];
            $.each (weeks_group, function(i,group){
                if (weeks_data[i]==null)
                    weeks_data[i]={count:0, first_price:0, end_price:0, max_first_price:0, max_end_price:0,
                        avg_first_price:0, avg_end_price:0, min_first_price: 100000000, min_end_price:100000000,
                        contract_price:0, max_contract_price:0, avg_contract_price:0, min_contract_price:1000000  }
                $.each(group, function(t,apart){
                    weeks_data[i]['count']++;
                    weeks_data[i]['first_price']+=apart.price_m2_start;
                    weeks_data[i]['end_price']+=apart.price_m2_end;
                    weeks_data[i]['contract_price']+=apart.price_m2_contract;

                    if(apart.price_m2_start>weeks_data[i].max_first_price) weeks_data[i].max_first_price= apart.price_m2_start
                    if(apart.price_m2_end>weeks_data[i].max_end_price) weeks_data[i].max_end_price= apart.price_m2_end
                    if(apart.price_m2_contract>weeks_data[i].max_contract_price) weeks_data[i].max_contract_price= apart.price_m2_contract

                    if(apart.price_m2_start<weeks_data[i].min_first_price)   weeks_data[i].min_first_price=apart.price_m2_start
                    if(apart.price_m2_end<weeks_data[i].min_end_price) weeks_data[i].min_end_price=apart.price_m2_end
                    if(apart.price_m2_contract<weeks_data[i].min_contract_price) weeks_data[i].min_contract_price=apart.price_m2_contract
                })
                weeks_data[i].avg_first_price = weeks_data[i].first_price/(weeks_data[i].count)
                weeks_data[i].avg_end_price = weeks_data[i].end_price/(weeks_data[i].count)
                weeks_data[i].avg_contract_price = weeks_data[i].contract_price/(weeks_data[i].count)
//                  console.log (weeks_data[i], group);
                if (weeks_data[i].count == 0)
                {
                    weeks_data[i]={count:0, first_price:null, end_price:null, max_first_price:null, max_end_price:null,
                        avg_first_price:null, avg_end_price:null, min_first_price: null, min_end_price:null,
                        contract_price:null, max_contract_price:null, avg_contract_price:null, min_contract_price:null  }
                }


            })

            var res={
                start_price: [],
                start_price_range: [],
                end_price: [],
                end_price_range: [],
                contract_price: [],
                contract_price_range: []
            }

            $.each(weeks_data, function(i,val){
                if (val.avg_first_price!=null)  res.start_price.push ([i, val.avg_first_price]);
                if (val.min_first_price!=null && val.max_first_price!=null) res.start_price_range.push([i, val.min_first_price, val.max_first_price])
                if (val.avg_end_price!=null) res.end_price.push([i, val.avg_end_price])
                if (val.min_end_price!=null && val.max_end_price!=null) res.end_price_range.push([i, val.min_end_price, val.max_end_price]);
                if (val.avg_contract_price) res.contract_price.push([i, val.avg_contract_price])
                if (val.min_contract_price!=null &&  val.max_contract_price!=null ) res.contract_price_range.push([i, val.min_contract_price, val.max_contract_price]);
            })

            return res;

        }
    },
    hypotecChart: {
        _div_id:  'hypotect_chart',
        chart: null,
        need_interval: false,
        need_measure: false,
        createChart: function (){
            this.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'pie',
                    renderTo: this._div_id
                },
                title: {
                    text: 'Распространенность ипотеки'
                },
                yAxis: {
                    title: {
                        text: 'empty'
                    }
                },
                plotOptions: {
                    pie: {
                        shadow: false,
                        center: ['50%', '50%']
                    }
                },
                tooltip: {
                    valueSuffix: ' квартир'
                },
                series: [{
                    name: 'Как покупают',
                    data: [],
                    size: '60%',
                    dataLabels: {
                        formatter: function() {
                            return this.y > 5 ? this.point.name : null;
                        },
                        color: 'white',
                        distance: -30
                    }
                }, {
                    name: 'Доля',
                    data: [],
                    size: '80%',
                    innerSize: '60%',
                    dataLabels: {
                        formatter: function() {
                            // display only if larger than 1
                            return this.y > 1 ? '<b>'+ this.point.name +':</b> '+ this.percentage +'%'  : null;
                        }
                    }
                }]
            });
            this.redrawChart();
        },
        redrawChart: function(){
            var data = this.getData();
            this.chart.series[0].setData(data.common_data,false)
            this.chart.series[1].setData(data.detail_data,false)

            this.chart.redraw();
        },
        getData: function(){
            var mortrage_count = 0;
            var not_mortrage_count = 0;

            var detail = {};
            $.each (sales_filter.getFilteredApartments(), function(i, a){
                if (!(a.status=='ПС' || a.status=='ДКП' )) return;
                if (a.hypotec)
                    mortrage_count++;
                else not_mortrage_count++;

                if (detail[a.bankName]==null) detail[a.bankName] = 0;
                detail[a.bankName]++;

            })

            var details = [];
            $.each (detail, function(name,count){
                details.push ([name, count]);
            })

            return {
                common_data: [['Ипотека', mortrage_count],['Личные средства', not_mortrage_count]],
                detail_data: details
            }

        }
    },
    financeChart: {
        _div_id:  'finance_chart',
        chart: null,
        need_interval: false,
        need_measure: false,
        createChart: function (){
            this.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
//                type: 'area'
                    type: 'column',
                    renderTo: this._div_id
                },
                title: {
                    text: 'Накопительное получение финансов'
                },
                xAxis: {
                    categories: sales_logic.getWeeksStartsForCategories(),
                    tickmarkPlacement: 'on'
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            return this.value / 1000000 + ' млн ₽';
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        },
                        formatter: function() {return thousands_sep((this.total/1000000).toFixed(3))}
                    }
                },
                tooltip: {
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        $.each(this.points, function(i, datum) {

                            result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                + datum.series.name + '</i>: '
                                + thousands_sep((datum.y/1000000).toFixed(3)) + ' млн ₽ ';

                        });
                        return result;
                    },
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
//                area: {
//                    stacking: 'normal',
//                    lineColor: '#666666',
//                    lineWidth: 1,
//                    marker: {
//                        lineWidth: 1,
//                        lineColor: '#666666'
//                    }
//                }
                    column: {
                        stacking: 'normal',
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            },
                            formatter: function() {return thousands_sep((this.y/1000000).toFixed(3))}
                        }
                    }
                },
                series: [{
                    name: 'Комиссия риэлтора',
                    data: []
                }, {
                    name: 'Получено КП',
                    data: []

                }]
            });
            this.redrawChart();
        },
        redrawChart: function(){
            var weeks_group=[];
            $.each(sales_filter.getFilteredApartments(), function(i,val){
                apart_date = moment(val.dkp_date)
                $.each(sales_logic.getWeeksStarts(), function(t,week){
                    if(weeks_group[t]==null) weeks_group[t]=[]
                    if (apart_date.diff(week, 'days')<0)
                    {
                        weeks_group[t].push(val)
                    }
                })
            })
            weeks_data = [];
            $.each (weeks_group, function(i,group){
                if (weeks_data[i]==null) weeks_data[i]={getFinance:0, fee:0}

                $.each(group, function(t,apart){
                    weeks_data[i]['fee']+=apart.fee;
                    weeks_data[i]['getFinance']+=apart.end_sum
                })

            })
            console.log(weeks_data)
            series_fee = []
            series_get = []
            $.each(weeks_data, function(i,val){
                if (i==0){
                    series_fee.push(val.fee)
                    series_get.push(val.getFinance)
                }
                else{
                    series_fee.push(val.fee)
                    series_get.push(val.getFinance)
                }
            })
            $.each(series_fee, function(i,val){
                series_fee[i]=parseFloat((series_fee[i]).toFixed(0))
                series_get[i]=parseFloat((series_get[i]).toFixed(0))
            })
            this.chart.series[0].setData(series_fee)
            this.chart.series[1].setData(series_get)
        },
        getData: function(){
           return;
        }
    },
    addPriceChart: {
        _div_id:  'add_price_chart',
        chart: null,
        need_interval: false,
        need_measure: false,
        createChart: function (){
            this.chart =  new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'column',
                    renderTo: this._div_id
                },
                title: {
                    text: 'Повышение стоимости квартир на торгах'
                },
                xAxis: {
                    categories: sales_logic.getWeeksCategories()
                },
                yAxis: {
                    title: {
                        text: ''
                    },
                    labels: {
                        formatter: function() {
                            return this.value / 1000000 + ' млн ₽';
                        }
                    },
                    stackLabels: {
                        enabled: true,
                        style: {
                            fontWeight: 'bold',
                            color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                        }
                    }
                },
                tooltip: {
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        $.each(this.points, function(i, datum) {

                            result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                + datum.series.name + '</i>: '
                                + thousands_sep((datum.y/1000000).toFixed(3)) + ' млн ₽ ';

                        });
                        return result;
                    },
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        dataLabels: {
                            enabled: true,
                            color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                            style: {
                                textShadow: '0 0 3px black, 0 0 3px black'
                            },
                            formatter: function() {return thousands_sep((this.y/1000000).toFixed(3))}
                        }
                    }
                },
                series: [
                    {name: 'Добавочная стоимость',data: []},
                    {name: 'Начальная стоимость',data: []}
                ]
            });
            this.redrawChart();
        },
        redrawChart: function(){
            var weeks_group = []

            $.each(sales_filter.getFilteredApartments(), function(i,val){

                apart_date = moment(val.dkp_date)

                $.each(sales_logic.getWeeksStarts(), function(t,week){
                    if(weeks_group[t]==null) weeks_group[t]=[]
                    if (apart_date.diff(week, 'days')>=0 && apart_date.diff(week, 'days')<7)
                    {
                        weeks_group[t].push(val)
                    }
                })
            })

            series =  [
                {name: 'Добавочная стоимость',data: [0,0,0,0,0]},
                {name: 'Начальная стоимость',data: [0,0,0,0,0]}
            ];

            $.each(weeks_group, function(gi, week_data){
                $.each(week_data, function(i,val){
                    series[1]['data'][gi]+=parseFloat((val.sum))
                    series[0]['data'][gi]+=parseFloat((val.end_sum))
                })
            })

            series[0]['data'][1]= parseFloat((series[0]['data'][1]).toFixed(3))
            series[1]['data'][1]= parseFloat((series[1]['data'][1]).toFixed(3))

            this.chart.series[0].setData(series[0]['data'], false)
            this.chart.series[1].setData(series[1]['data'], false)
            this.chart.redraw();
        },
        getData: function(){
            return;
        }
    },
    planFactChart: {
        _div_id:  'plan_fact_chart',
        chart: null,
        need_interval: true,
        need_measure: true,
        createChart: function (){
            this.chart =  new  Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'column',
                    renderTo: this._div_id
                },
                title: {
                    text: 'План выполнения продаж'
                },
                xAxis: {
                    categories: sales_logic.getIntervalCategories(sales_filter.getIntervalValue())
                },
                yAxis: {
                    //min: 0,
                    allowDecimals: false,
                    title: {
                        text: 'Количество'
                    },
                    labels:{
                        formatter: function(){return charts.planFactChart.AxisFormatters[sales_filter.getMeasureFilterValue()](this.value);}
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        $.each(this.points, function(i, datum) {

                            result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                + datum.series.name + '</i>: '
                                + charts.planFactChart.TooltipFormatters[sales_filter.getMeasureFilterValue()](datum.y);

                        });
                        return result;
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: .1,
                        borderWidth: 0,
                        dataLabels: {
                            enabled: true,
                            formatter: function () {return charts.planFactChart.DatalabelsFormatters[sales_filter.getMeasureFilterValue()](this.y)}
                        }
                    }

                },
                series: [{
                    name: 'Планировалось заключить ДКП ',
                    data: []

                }, {
                    name: 'Фактически заключено ДКП',
                    data: []

                }]
            });
            this.redrawChart();
        },
        redrawChart: function(){
            var data = this.getData();
            this.chart.xAxis[0].setCategories(sales_logic.getIntervalCategories(sales_filter.getIntervalValue()),false);
            this.chart.yAxis[0].setTitle({text: ''})
            this.chart.series[0].setData(data[sales_filter.getMeasureFilterValue()]['plan'],false);
            this.chart.series[1].setData(data[sales_filter.getMeasureFilterValue()]['fact'],false);
            this.chart.redraw();
        },
        getData: function(){
            weeks_group_plan = []
            weeks_group_fact = []

            var intervals =  sales_logic.getIntervalStarts(sales_filter.getIntervalValue())
            $.each(sales_filter.getFilteredApartments(), function(i,val){
                apart_date_fact = moment(val.dkp_date)
                apart_date_plan = moment(val.sale_plan_date)

                $.each(intervals, function(t,week){
                    if(weeks_group_fact[t]==null) weeks_group_fact[t]=[]
                    if (apart_date_fact.diff(week.start, 'days')>=0 && apart_date_fact.diff(week.end, 'days')<0)
                    {
                        weeks_group_fact[t].push(val)
                    }
                    if(weeks_group_plan[t]==null) weeks_group_plan[t]=[]
                    if (apart_date_plan.diff(week.start, 'days')>=0 && apart_date_plan.diff(week.end, 'days')<0)
                    {
                        weeks_group_plan[t].push(val)
                    }
                })
            })

            series =  {'m2': {plan:[],fact:[]}, 'fin': {plan:[],fact:[]}, 'pcs':{plan:[],fact:[]}};

            series['m2']['plan'] = [0,0,0,0,0]
            series['fin']['plan'] = [0,0,0,0,0]
            series['pcs']['plan'] = [0,0,0,0,0]
            $.each(weeks_group_plan, function(gi, week_data){

                $.each(week_data, function(i,val){

                    series['m2']['plan'][gi] = (series['m2']['plan'][gi]==null ? val.square : series['m2']['plan'][gi]+val.square)
                    series['fin']['plan'][gi] = (series['fin']['plan'][gi]==null ? val.order_sum : series['fin']['plan'][gi]+val.order_sum)
                    series['pcs']['plan'][gi] = (series['pcs']['plan'][gi]==null ? 0 : series['pcs']['plan'][gi]+1)

                })
            })
            series['m2']['fact'] = [0,0,0,0,0]
            series['fin']['fact'] = [0,0,0,0,0]
            series['pcs']['fact'] = [0,0,0,0,0]
            $.each(weeks_group_fact, function(gi, week_data){

                $.each(week_data, function(i,val){

                    series['m2']['fact'][gi] = (series['m2']['fact'][gi]==null ? 0 : series['m2']['fact'][gi]+val.square)
                    series['fin']['fact'][gi] = (series['fin']['fact'][gi]==null ? 0 : series['fin']['fact'][gi]+val.order_sum)
                    series['pcs']['fact'][gi] = (series['pcs']['fact'][gi]==null ? 0 : series['pcs']['fact'][gi]+1)
                })
            })


            return series;
        },
        AxisFormatters: {
            pcs: function(value){return value+''},
            m2: function(value){return value+' кв.м.'},
            fin: function(value){return value/1000000+' млн. ₽'}
        },
        DatalabelsFormatters: {
            pcs: function(value){return value+''},
            m2: function(value){return thousands_sep(value.toFixed(0))+''},
            fin: function(value){return thousands_sep((value/1000000).toFixed(3))+''}
        },
        TooltipFormatters:{
            pcs: function(value){return value+' квартир'},
            m2: function(value){return thousands_sep(value.toFixed(0))+' кв.м.'},
            fin: function(value){return thousands_sep((value/1000000).toFixed(3))+' млн. ₽'}
        }

    },
    statusChart: {
        _div_id:  'status_chart',
        _add_div_id: 'status_detail_chart',
        chart: null,
        need_interval: false,
        need_measure: true,
        add_chart:null,
        createChart: function (){
            this.chart =  new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    renderTo:this._div_id,
                    type: 'column'
                },
                title: {
                    text: 'Статусы квартир'
                },
                xAxis: {
                    categories: sales_logic.getWeeksStartsForCategories(),
                    tickmarkPlacement: 'on'
                },
                yAxis: {
                    //min: 0,
                    allowDecimals: false,
                    title: {
                        text: ''
                    },
                    labels:{
                        formatter: function(){return charts.statusChart.AxisFormatters[sales_filter.getMeasureFilterValue()](this.value);}
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        $.each(this.points, function(i, datum) {

                            result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                + datum.series.name + '</i>: '
                                + charts.statusChart.TooltipFormatters[sales_filter.getMeasureFilterValue()](datum.y);

                        });
                        return result;
                    }
                },
                series: [{
                    name: 'ПС',
                    data: []
                },
                {
                    name: 'ДКП',
                    data: []
                },
                {
                    name: 'Аукцион',
                    data: []
                },
                {
                    name: 'Имеет заявку',
                    data: []
                },
                {
                    name: 'Свободна',
                    data: []
                }]
            });

            this.add_chart = new Highcharts.Chart({
                chart: {
                    type: 'column',
                    renderTo: this._add_div_id
                },
                credits:  {
                    enabled: false
                },
                title: {
                    text: 'Данамика статуса "'+sales_filter.getCurrentDetailStatus()+'"'
                },
                xAxis: {
                    categories: sales_logic.getWeeksStartsForCategories(),
                    tickmarkPlacement: 'on'
                },
                yAxis: {
                    //min: 0,
                    allowDecimals: false,
                    title: {
                        text: ''
                    },
                    labels:{
                        formatter: function(){return charts.statusChart.AxisFormatters[sales_filter.getMeasureFilterValue()](this.value);}
                    }
                },
                tooltip: {
                    shared: true,
                    useHTML: true,
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        $.each(this.points, function(i, datum) {

                            result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                + datum.series.name + '</i>: '
                                + charts.statusChart.TooltipFormatters[sales_filter.getMeasureFilterValue()](datum.y);

                        });
                        return result;
                    }
                },
                plotOptions: {
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: this.getObjectsCategories()
            });

            this.redrawChart();
        },
        redrawChart: function(){
            //redraw main chart
            var data = this.getData();
            var t =0;
            $.each (data, function (i,ser){
                charts.statusChart.chart.series[t++].setData(ser.data, false);
            })
            this.chart.redraw();

            //redraw add chart
            $.each(charts.statusChart.add_chart.series, function(i,val){
                val.setData(charts.statusChart.getAddDataForObject(val.name), false)
            })
            this.add_chart.redraw();

        },
        getData: function(){
            weeks_group={
                'ПС':[],
                'ДКП':[],
                'Аукцион':[],
                'Имеет заявку': [],
                'Свободна': []
            };
            $.each(sales_filter.getFilteredApartments(), function(i,val){

                ps_date = moment(val.ps_date)
                dkp_date = moment(val.dkp_date)
                auk_date = moment(val.auction_date)
                has_qty_date = moment(val.has_qty_date)
                free_date = moment(val.free_date)
                $.each(sales_logic.getWeeksStarts(), function(t,week){
                    //опрделяем статус квартиры на текущей неделе

                    if (weeks_group['ПС'][t]==null) weeks_group['ПС'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['ДКП'][t]==null) weeks_group['ДКП'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['Аукцион'][t]==null) weeks_group['Аукцион'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['Имеет заявку'][t]==null) weeks_group['Имеет заявку'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['Свободна'][t]==null) weeks_group['Свободна'][t]={pcs:0, fin:0, m2:0}

                    //доавляем квартиру в статус ПС если дата была когда либо до этой даты.
                    if (ps_date.diff(week, 'days')<0)
                    {
                        weeks_group['ПС'][t]['pcs']++;
                        weeks_group['ПС'][t]['fin']+=val.end_sum
                        weeks_group['ПС'][t]['m2']+=val.square
                    }

                    //добавляем квартиру в дкп если дата у нее дата дкп была до это недели и она еще не перешла в статус ПС
                    if (dkp_date.diff(week, 'days')<0 && (ps_date.diff(week, 'days')>=0 || ps_date==null))
                    {
                        weeks_group['ДКП'][t]['pcs']++;
                        weeks_group['ДКП'][t]['fin']+=val.end_sum
                        weeks_group['ДКП'][t]['m2']+=val.square
                    }

                    //добавляем квартиру в аук если дата у нее дата аук была до это недели и она еще не перешла в статус ДКП
                    if (auk_date.diff(week, 'days')<0 && (dkp_date.diff(week, 'days')>=0 || dkp_date==null))
                    {
                        weeks_group['Аукцион'][t]['pcs']++;
                        weeks_group['Аукцион'][t]['fin']+=val.end_sum
                        weeks_group['Аукцион'][t]['m2']+=val.square
                    }

                    if (has_qty_date.diff(week, 'days')<0 && (auk_date.diff(week, 'days')>=0 || auk_date==null))
                    {
                        weeks_group['Имеет заявку'][t]['pcs']++;
                        weeks_group['Имеет заявку'][t]['fin']+=val.end_sum
                        weeks_group['Имеет заявку'][t]['m2']+=val.square
                    }

                    if (free_date.diff(week, 'days')<0 && (has_qty_date.diff(week, 'days')<7 || has_qty_date==null))
                    {
                        weeks_group['Свободна'][t]['pcs']++;
                        weeks_group['Свободна'][t]['fin']+=val.end_sum
                        weeks_group['Свободна'][t]['m2']+=val.square
                    }
                })
            })
            // object {status: array[counts, fin, m2 in weeks]}

            weeks_data = {};
            $.each(weeks_group, function(i,status_data){
                console.log(status_data)
                if(weeks_data[i]==null) weeks_data[i]={name: i,data:[]}

                $.each(status_data, function(t, week_status_data){
                    weeks_data[i]['data'].push(week_status_data[sales_filter.getMeasureFilterValue()])
                })

            })
            return weeks_data;

        },
        getAddDataForObject: function(obj){
            var weeks_group={
                'ПС':[],
                'ДКП':[],
                'Аукцион':[],
                'Имеет заявку': [],
                'Свободна': []
            };
            $.each(sales_filter.getFilteredApartments(), function(i,val){
                if(obj != val.object) return;
                ps_date = moment(val.ps_date)
                dkp_date = moment(val.dkp_date)
                auk_date = moment(val.auction_date)
                has_qty_date = moment(val.has_qty_date)
                free_date = moment(val.free_date)
                $.each(sales_logic.getWeeksStarts(), function(t,week){
                    //опрделяем статус квартиры на текущей неделе
                    if (weeks_group['ПС'][t]==null) weeks_group['ПС'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['ДКП'][t]==null) weeks_group['ДКП'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['Аукцион'][t]==null) weeks_group['Аукцион'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['Имеет заявку'][t]==null) weeks_group['Имеет заявку'][t]={pcs:0, fin:0, m2:0}
                    if (weeks_group['Свободна'][t]==null) weeks_group['Свободна'][t]={pcs:0, fin:0, m2:0}

                    //доавляем квартиру в статус ПС если дата была когда либо до этой даты.
                    if (ps_date.diff(week, 'days')<0)
                    {
                        weeks_group['ПС'][t]['pcs']++;
                        weeks_group['ПС'][t]['fin']+=val.end_sum
                        weeks_group['ПС'][t]['m2']+=val.square
                    }

                    //добавляем квартиру в дкп если дата у нее дата дкп была до это недели и она еще не перешла в статус ПС
                    if (dkp_date.diff(week, 'days')<0 && (ps_date.diff(week, 'days')>=0 || ps_date==null))
                    {
                        weeks_group['ДКП'][t]['pcs']++;
                        weeks_group['ДКП'][t]['fin']+=val.end_sum
                        weeks_group['ДКП'][t]['m2']+=val.square
                    }

                    //добавляем квартиру в аук если дата у нее дата аук была до это недели и она еще не перешла в статус ДКП
                    if (auk_date.diff(week, 'days')<0 && (dkp_date.diff(week, 'days')>=0 || dkp_date==null))
                    {
                        weeks_group['Аукцион'][t]['pcs']++;
                        weeks_group['Аукцион'][t]['fin']+=val.end_sum
                        weeks_group['Аукцион'][t]['m2']+=val.square
                    }

                    if (has_qty_date.diff(week, 'days')<0 && (auk_date.diff(week, 'days')>=0 || auk_date==null))
                    {
                        weeks_group['Имеет заявку'][t]['pcs']++;
                        weeks_group['Имеет заявку'][t]['fin']+=val.end_sum
                        weeks_group['Имеет заявку'][t]['m2']+=val.square
                    }

                    if (free_date.diff(week, 'days')<0 && (has_qty_date.diff(week, 'days')<7 || has_qty_date==null))
                    {
                        weeks_group['Свободна'][t]['pcs']++;
                        weeks_group['Свободна'][t]['fin']+=val.end_sum
                        weeks_group['Свободна'][t]['m2']+=val.square
                    }
                })


            })

            var res = []
            $.each(weeks_group[sales_filter.getCurrentDetailStatus()],function(i,val){
                res.push(val[sales_filter.getMeasureFilterValue()])
            })
            return res;
        },
        getObjectsCategories: function(){
            var series = [];
            $.each(sales_objects.sort(), function(i,obj){
                series.push({name: obj, data: []})
            })
            return series;
        },
        AxisFormatters: {
            pcs: function(value){return value+''},
            m2: function(value){return value+' кв.м.'},
            fin: function(value){return value/1000000+' млн. ₽'}
        },
        DatalabelsFormatters: {
            pcs: function(value){return value+''},
            m2: function(value){return thousands_sep(value.toFixed(0))+''},
            fin: function(value){return thousands_sep((value/1000000).toFixed(3))+''}
        },
        TooltipFormatters:{
            pcs: function(value){return value+' квартир'},
            m2: function(value){return thousands_sep(value.toFixed(0))+' кв.м.'},
            fin: function(value){return thousands_sep((value/1000000).toFixed(3))+' млн. ₽'}
        }

    }
}