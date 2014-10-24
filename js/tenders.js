var tenders_logic = {

    chart_div_content: 'tender-current-chart',
    current_chart: null,

    ///
    init: function(){

        $(".tenders-tabs input").change(tenders_logic.changeActiveChart);
        $('#tender-filter input').change(tenders_logic.applyFilter);
        $('#show_table_button').click(tenders_logic.showTendersTable)
        this.changeActiveChart();

    },
    changeActiveChart: function(){
        $("#tender-charts-content div.tender_chart").hide();
        var active_tab =   $(".tenders-tabs input:checked")
        tenders_logic.current_chart =  tenders_charts[active_tab.attr('data-chart')]
        tenders_logic.current_chart.redrawChart();
        $("#"+active_tab.attr('data-div')).show();
        tenders_logic.changeDetailButtonText();
    },
    applyFilter: function(){
        tenders_logic.current_chart.redrawChart();
    },
    setEnterYearForTable: function(type, category, uk){
        tenders_logic.current_chart.selectedYear = category;
        tenders_logic.changeDetailButtonText();
    },
    changeDetailButtonText: function(){
        var btn = $('#show_table_button');
        var text = 'Посмотреть список конкурсов';

        if(this.current_chart.selectedYear==null) {
            btn.hide(); return;
        }
        else btn.show();

        if(this.current_chart.select_type =='enter_year' && this.current_chart.selectedYear!=null)
        {
            text+= ' по '+ (this.current_chart.type=='social' ? ' социальным ' : ' жилым ') +'объектам '+ this.current_chart.selectedYear+' года ввода'

            if (this.current_chart.isUKAnalys)
            text+= ' (УК/не УК)'
        }

        if(this.current_chart.select_type=='year' && this.current_chart.selectedYear!=null){
            text+= ' заврешившихся в '
            if (this.current_chart.selectedMonth!=null)
                text+= this.current_chart.selectedMonth
            if (this.current_chart.selectedYear!=null)
                text+= ' '+this.current_chart.selectedYear+' году'
        }
        btn.text(text);
    },
    getObjectSeries: function(tender){
        if(tender.series!=null)
            return " ("+tender.series+")"
        return "";
    } ,
    showChartsPart: function(){
        $('#table_content').hide();
        $('#common_charts').hide();
        $('#charts_content').show();
        $('#back-button').hide();
    },
    showCommonInfo: function(){
        $('#charts_content').hide();
        $('#common_charts').show();
        $('#back-button').show();
    },
    showTendersTable: function(){
        var type = tenders_logic.current_chart.type||null
        var month = tenders_logic.current_chart.selectedMonth||null
        var year = tenders_logic.current_chart.selectedYear||null
        var uk_flag = tenders_logic.current_chart.isUKAnalys||null
        var data =  tenders_logic.filterTendersForTable(type, month, year, year, uk_flag);
        tenders_logic.bindTableRows(data);
        $('#charts_content').hide();
        $('#table_content').show();
        $('#back-button').show();

    },
    bindTableRows: function(data){
        var tbody = $("#tenders_table tbody")
        var rows = '';
        $.each(data, function(i,t){
            rows += "<tr><td>"+ t.object_address+tenders_logic.getObjectSeries(t)+"</td>" +
                "<td>"+ t.object_power+"</td>"+
                "<td>"+ t.type+"</td>"+
                "<td>"+ t.organization+"</td>"+
                "<td>"+ t.date_finish+"</td>"+
                "<td>"+ t.bid_accept+"/"+t.bid_all+"</td>"+
                "<td>"+ thousands_sep(t.price_start.toFixed(0))+" ₽</td>"+
                "<td>"+ thousands_sep(t.price_end.toFixed(0))+" ("+
                thousands_sep((t.price_end/t.object_power).toFixed(0))+") ₽</td>"+
                "<td>"+ t.percent.toFixed(2)+"</td></tr>"

        })
        tbody[0].innerHTML = rows;
    } ,
    filterTendersForTable: function(type, month, year, enter_year, uk_flag){
//        console.log(type, month, year, enter_year, uk_flag );
        var tenders = [];
        if (type!=''||type!=null){
            //iterate by objsData and social or house
            $.each(objects_tenders, function (i,obj){

                var year = obj.year_enter||"----";
                if (year!=enter_year) return;

                if ( type == 'social'){
                    if ($.inArray(obj.appointment, tender_filter.getSocialFilter())==-1) return;
                }
                if (type == 'house'){
//                    console.log(obj.appointment, tender_filter.getHouseAppointmentsFilter(),$.inArray(obj.appointment, tender_filter.getHouseAppointmentsFilter()))
                    if ($.inArray(obj.appointment, tender_filter.getHouseAppointmentsFilter())==-1) return;
                    if ($.inArray(obj.series, tender_filter.getLivingTypeFilter())==-1) return;

                }

//                console.log(uk_flag,tenders_logic.objectHaveUKTenderOnly(obj), tenders_logic.objectDontHaveUKTenders(obj))
                if (uk_flag && !(tenders_logic.objectHaveUKTenderOnly(obj) || tenders_logic.objectDontHaveUKTenders(obj))) return;

                $.each(obj.tenders, function(i,t){
                    if ($.inArray( t.type, tender_filter.getTypesFilter() )==-1) return;
                    tenders.push({
                        object_address: obj.address,
                        series: obj.series,
                        type: t.type,
                        object_power: obj.power,
                        organization: t.organization,
                        date_finish: t.date_finish,
                        bid_accept: t.bid_accept,
                        bid_all: t.bid_all,
                        price_start: t.price_start,
                        price_end: t.price_end,
                        percent: t.percent
                    })
                })

            })
            return tenders;
        }
        $.each(tender_filter.getFilteredTenders(), function (i, t){
            if(year!='' && t.year_finish!=year) return;
            if (month!='' && t.month_finish!=month) return;
            tenders.push({
                object_address: t.object_address,
                series: t.series,
                type: t.type,
                object_power: t.object_power,
                organization: t.organization,
                date_finish: t.date_finish,
                bid_accept: t.bid_accept,
                bid_all: t.bid_all,
                price_start: t.price_start,
                price_end: t.price_end,
                percent: t.percent
            })
        })
        return tenders;
    } ,
    setAttrYearOrMonthFotTable: function(cat){
        if(tenders_logic.current_chart.is_drilldown)
            tenders_logic.current_chart.selectedMonth = cat;
        else
            tenders_logic.current_chart.selectedYear = cat;

        tenders_logic.changeDetailButtonText();

    },
    objectHaveUKTenderOnly : function(obj){
        var not_uk_exist = false;
        $.each(obj.tenders, function(i,tender){
            if (tender.type != 'управляющая компания')
                not_uk_exist = true;
        })
        return !not_uk_exist;
    },
    objectDontHaveUKTenders: function(obj){
        var uk_exist = false;
        $.each(obj.tenders, function(i,tender){
            if (tender.type == 'управляющая компания')
                uk_exist = true;
        })
        return !uk_exist;
    }



}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var tenders_charts={
    PriceM2HouseChart: {
        chart: null,
        select_type: "enter_year",
        selectedYear: null,
        isUKAnalys: false,
        type: 'house',
        createChart: function(){
            this.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'spline',
                    renderTo:'house_m2_price'
                },
                title: {
                    text: 'Изменение средней стоимости кв. м. '
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Средняя стоимость кв. м.'
                    },
                    labels: {
                        formatter: function () {
                            return this.value/1000 + 'тыс ₽';
                        }
                    },
                    min: 0
                },
                tooltip: {
                    crosshairs: true,
                    useHTML: true,
                    //valueSuffix: ' тыс. руб'
                    formatter: function() {
                        return "" +
                            "<b>"+this.point.category+"</b><br>" +
                            "<i>"+this.series.name+"</i>: "+
                            thousands_sep(this.y) + '  ₽ '}

                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events:{
                                click: function(e){
                                    tenders_logic.setEnterYearForTable('house', this.category);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'средняя стоимость кв. м по годам ввода'
                }]

            });
            var data =  this.getData();
            this.chart.xAxis[0].setCategories(data[0],false)
            this.chart.series[0].setData(data[1]);
        },
        getData: function(){
            var years = [];
            var prices = {};
            $.each(objects_tenders, function (i,obj){
                if ($.inArray(obj.appointment, tender_filter.getHouseAppointmentsFilter())==-1) return;
                if ($.inArray(obj.series, tender_filter.getLivingTypeFilter())==-1) return;

                var year = obj.year_enter||"----";
                if (years.indexOf(year)==-1) years.push (year)
                if (prices[year]==null) prices[year] = {power:0, sum: 0};
                var tenders_sum = 0;

                $.each(obj.tenders, function(i,tender){
                    if ($.inArray(tender.type, tender_filter.getTypesFilter())==-1 )
                        return;
                    tenders_sum+=tender.sum

                })
                prices[year].power+=obj.power
                prices[year].sum+=tenders_sum;

            })
            years = years.sort();
            var data = [];
            $.each(years, function(i,year){
                data[i]= parseFloat((prices[year].sum/(prices[year].power||1)).toFixed(0))
            })
            return [years, data];
        },
        redrawChart: function(){
            this.createChart();
        }
    },
    PriceSocialPrice:{
        chart: null,
        select_type: "enter_year",
        selectedYear: null,
        isUKAnalys: false,
        type: 'social',
        createChart: function(){
            this.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'spline',
                    renderTo:'social_place_price'
                },
                title: {
                    text: 'Изменение средней стоимости одного места '
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Средняя стоимость места'
                    },
                    labels: {
                        formatter: function () {
                            return this.value/1000000 + ' млн. ₽';
                        }
                    },
                    min: 0
                },
                tooltip: {
                    crosshairs: true,
                    useHTML: true,
                    formatter: function() {
                        return "" +
                            "<b>"+this.point.category+"</b><br>" +
                            "<i>"+this.series.name+"</i>: "+
                            thousands_sep((this.y/1000).toFixed(0)) + ' тыс  ₽'}

                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events:{
                                click: function(e){
                                    tenders_logic.setEnterYearForTable('social', this.category);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'средняя стоимость места по годам ввода',
                    data: []
                }]
            });
            var data = this.getData();
            this.chart.xAxis[0].setCategories(data[0],false)
            this.chart.series[0].setData(data[1])
        },
        getData: function(){
            var years = [];
            var prices = {};
            $.each(objects_tenders, function (i,obj){
                if ($.inArray(obj.appointment, tender_filter.getSocialFilter())==-1) return;
                var year = obj.year_enter||"----";
                if (years.indexOf(year)==-1) years.push (year)

                if (prices[year]==null) prices[year] = {power:0, sum: 0};
                var tenders_sum = 0;
                $.each(obj.tenders, function(i,tender){

                    if ($.inArray(tender.type,tender_filter.getTypesFilter())==-1 )
                        return;
                    tenders_sum+=tender.sum
                })
                prices[year].power+=obj.power
                prices[year].sum+=tenders_sum
            })
            years = years.sort();
            var data = [];
            $.each(years, function(i,year){
                data[i]= parseFloat((prices[year].sum/(prices[year].power||1)).toFixed(0))
            })
            return [years, data];
        },
        redrawChart: function(){
            this.createChart();
        }
    },
    UKHouseChart:{
        chart:null,
        select_type: "enter_year",
        selectedYear: null,
        isUKAnalys: true,
        type: 'house',
        createChart: function(){
            this.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'spline',
                    renderTo:'uk_notuk_chart'
                },
                title: {
                    text: 'Изменение средней стоимости кв м'
                },
                xAxis: {
                    title: {
                        text: 'год ввода'
                    },
                    type: 'category'
                },
                yAxis: {
                    title: {
                        text: 'Средняя стоимость кв м'
                    },
                    labels: {
                        formatter: function () {
                            return this.value/1000 + ' тыс  ₽';
                        }
                    },
                    min: 0
                },
                tooltip: {
                    crosshairs: true,
                    useHTML: true,
                    //valueSuffix: ' тыс. руб'
                    formatter: function() {
                        return "" +
                            "<b>"+this.point.category+"</b><br>" +
                            "<i>"+this.series.name+"</i>: "+
                            thousands_sep((this.y/1000).toFixed(0)) + ' тыс ₽'}

                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events:{
                                click: function(e){
                                    tenders_logic.setEnterYearForTable('house',  this.category,true);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'средняя стоимость кв м объектов только с УК',
                    data: []
                },{
                    name: 'средняя стоимость кв м объектов без УК',
                    data: []
                }]
            });

            var data = this.getData();
            this.chart.xAxis[0].setCategories(data[0],false)
            this.chart.series[0].setData(data[1],false)
            this.chart.series[1].setData(data[2])
        } ,
        getData: function(){
            var years = [];
            var prices_uk = {};
            var prices_not_uk = {};
            $.each(objects_tenders, function (i,obj){
                if ($.inArray(obj.appointment, tender_filter.getHouseAppointmentsFilter())==-1) return;
                if ($.inArray(obj.series, tender_filter.getLivingTypeFilter())==-1) return;

                if (tenders_logic.objectHaveUKTenderOnly(obj)==false && tenders_logic.objectDontHaveUKTenders(obj)==false) return;

                var year = obj.year_enter||"----";
                if (years.indexOf(year)==-1) years.push (year)

                if (tenders_logic.objectHaveUKTenderOnly(obj))
                {
                    if (prices_uk[year]==null) prices_uk[year] = {power:0, sum: 0};
                    var tenders_sum = 0;
                    $.each(obj.tenders, function(i,tender){
                        if ($.inArray(tender.type, tender_filter.getTypesFilter())==-1 )
                            return;
                        tenders_sum+=tender.sum
                    })
                    prices_uk[year].power+=obj.power
                    prices_uk[year].sum+=tenders_sum
                }
                if (tenders_logic.objectDontHaveUKTenders(obj)){
                    if (prices_not_uk[year]==null) prices_not_uk[year] = {power:0, sum: 0};
                    var tenders_sum = 0;
                    $.each(obj.tenders, function(i,tender){
                        if ($.inArray(tender.type, tender_filter.getTypesFilter())==-1 )
                            return;
                        tenders_sum+=tender.sum
                    })
                    prices_not_uk[year].power+=obj.power
                    prices_not_uk[year].sum+=tenders_sum
                }

            })
            years = years.sort();
            var data_uk = [];
            var data_not_uk = [];
            $.each(years, function(i,year){
                var price_uk = null;
                var price_not_uk=null;
                if (prices_uk[year]!=null)  price_uk = parseFloat((prices_uk[year].sum/(prices_uk[year].power||1)).toFixed(0))
                if (prices_not_uk[year]!=null) price_not_uk = parseFloat((prices_not_uk[year].sum/(prices_not_uk[year].power||1)).toFixed(0))
                data_uk[i] = price_uk;
                data_not_uk[i] = price_not_uk;
            })
            return [years, data_uk, data_not_uk];
        },
        redrawChart: function(){
            this.createChart();
        }
    },
    UKSocialChart:{
        chart:null,
        select_type: "enter_year",
        selectedYear: null,
        isUKAnalys: true,
        type: 'social',
        createChart: function(){
             this.chart = new Highcharts.Chart({
                 credits:  {
                     enabled: false
                 },
                 chart: {
                     type: 'spline',
                     renderTo:'uk_notuk_social_chart'
                 },
                 title: {
                     text: 'Изменение средней стоимости места'
                 },
                 xAxis: {
                     title: {
                         text: 'год ввода'
                     },
                     type: 'category'
                 },
                 yAxis: {
                     title: {
                         text: 'Средняя стоимость места'
                     },
                     labels: {
                         formatter: function () {
                             return this.value/1000 + ' тыс  ₽';
                         }
                     },
                     min: 0
                 },
                 tooltip: {
                     crosshairs: true,
                     useHTML: true,
                     //valueSuffix: ' тыс. руб'
                     formatter: function() {
                         return "" +
                             "<b>"+this.point.category+"</b><br>" +
                             "<i>"+this.series.name+"</i>: "+
                             thousands_sep((this.y/1000).toFixed(0)) + ' тыс ₽'}

                 },
                 plotOptions: {
                     spline: {
                         marker: {
                             radius: 4,
                             lineColor: '#666666',
                             lineWidth: 1
                         }
                     },
                     series: {
                         cursor: 'pointer',
                         point: {
                             events:{
                                 click: function(e){
                                     tenders_logic.setEnterYearForTable('social', this.category, true);
                                 }
                             }
                         }
                     }
                 },
                 series: [{
                     name: 'средняя стоимость места объектов только с УК',
                     data: []
                 },{
                     name: 'средняя стоимость места объектов без УК',
                     data: []
                 }]
             });

            var data = this.getData();
            this.chart.xAxis[0].setCategories(data[0],false)
            this.chart.series[0].setData(data[1],false)
            this.chart.series[1].setData(data[2])
        },
        getData: function(){
            var years = [];
            var prices_uk = {};
            var prices_not_uk = {};
            $.each(objects_tenders, function (i,obj){
                if ($.inArray(obj.appointment, tender_filter.getSocialFilter())==-1) return;

                if (tenders_logic.objectHaveUKTenderOnly(obj)==false && tenders_logic.objectDontHaveUKTenders(obj)==false) return;

                var year = obj.year_enter||"----";
                if (years.indexOf(year)==-1) years.push (year)
                if (tenders_logic.objectHaveUKTenderOnly(obj))
                {
                    if (prices_uk[year]==null) prices_uk[year] = {power:0, sum: 0};
                    var tenders_sum = 0;
                    $.each(obj.tenders, function(i,tender){
                        if ($.inArray(tender.type, tender_filter.getTypesFilter())==-1 )
                            return;
                        tenders_sum+=tender.sum
                    })
                    prices_uk[year].power+=obj.power
                    prices_uk[year].sum+=tenders_sum
                }
                if (tenders_logic.objectDontHaveUKTenders(obj)){
                    if (prices_not_uk[year]==null) prices_not_uk[year] = {power:0, sum: 0};
                    var tenders_sum = 0;
                    $.each(obj.tenders, function(i,tender){
                        if ($.inArray(tender.type, tender_filter.getTypesFilter())==-1 )
                            return;
                        tenders_sum+=tender.sum
                    })
                    prices_not_uk[year].power+=obj.power
                    prices_not_uk[year].sum+=tenders_sum
                }

            })
            years = years.sort();
            var data_uk = [];
            var data_not_uk = [];
            $.each(years, function(i,year){
                var price_uk = null;
                var price_not_uk=null;
                if (prices_uk[year]!=null)  price_uk = parseFloat((prices_uk[year].sum/(prices_uk[year].power||1)).toFixed(0))
                if (prices_not_uk[year]!=null) price_not_uk = parseFloat((prices_not_uk[year].sum/(prices_not_uk[year].power||1)).toFixed(0))
                data_uk[i] = price_uk;
                data_not_uk[i] = price_not_uk;
            })
            return [years, data_uk, data_not_uk];
        },
        redrawChart: function(){
            this.createChart();
        }
    },
    PricePercentChart: {
        chart: null,
        select_type: "year",
        selectedYear: null,
        selectedMonth: null,
        is_drilldown: false,
        current_year: null,
        createChart: function(){
            tenders_charts.PricePercentChart.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'spline',
                    renderTo:'price_percent_chart'
                },
                title: {
                    text: 'Среднее снижение цены от НМЦК'
                },
                xAxis: {
                    categories: tenders_data.years
                },
                yAxis: {
                    title: {
                        text: 'Среднее снижение цены (%)'
                    },
                    labels: {
                        formatter: function () {
                            return this.value + '% ';
                        }
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueSuffix: '%'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }
                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events:{
                                click: function(e){
                                    tenders_logic.setAttrYearOrMonthFotTable(this.category);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'Снижение цены',
                    data: []
                }]
            });
            tenders_charts.PricePercentChart.is_drilldown = false;
            tenders_charts.PricePercentChart.selectedMonth= null;
            tenders_logic.changeDetailButtonText();
            var data = tenders_charts.PricePercentChart.getData();
            tenders_charts.PricePercentChart.chart.series[0].setData(data) ;
            tenders_charts.PricePercentChart.bindDrilldownEvents();
        },
        getData: function(){
            var res = []
            var tmp_res = {};
            $.each(tender_filter.getFilteredTenders(), function(i,val){
                if (tmp_res[val.year_finish]==null)
                    tmp_res[val.year_finish]={percent:0, count:0}

                tmp_res[val.year_finish]['percent'] += val.percent;
                tmp_res[val.year_finish]['count'] ++;
            })
            $.each(tmp_res, function(i,val){
                res.push({y:parseFloat((val.percent/val.count).toFixed(0)), name: i});
            })
            return res
        },
        redrawChart: function(){
            if (this.is_drilldown==false)
                this.createChart();
            else
                this.drilldownChart()
        },
        bindDrilldownEvents: function(){
            $('#price_percent_chart .highcharts-xaxis-labels > text').click(function(){
                tenders_charts.PricePercentChart.current_year =  $(this).text();
                tenders_charts.PricePercentChart.is_drilldown = true;
                tenders_charts.PricePercentChart.selectedYear =   $(this).text();
                tenders_logic.changeDetailButtonText();
                tenders_charts.PricePercentChart.redrawChart();
            });
        },
        drilldownChart:function(){

            var chart = tenders_charts.PricePercentChart
            var year =  chart.current_year

            chart.chart.renderer.button('Назад',
                150,
                10,
                chart.createChart).add();
            chart.chart.xAxis[0].setCategories(months,false);
            var series = chart.getDrilldownData()[year]
            var data = [];

            $.each(series.data, function(i,val){
                if (val[1]!=null)
                    data.push([months.indexOf(val[0]), val[1]])
            })

            chart.chart.series[0].setData(data);
        },
        getDrilldownData: function(){
            percents_data={};
            avgs = {};
            $.each(tender_filter.getFilteredTenders(), function(i,val){
                if (avgs[val.year_finish]==null)
                    avgs[val.year_finish] = {}

                if (avgs[val.year_finish][val.month_finish]==null)
                    avgs[val.year_finish][val.month_finish]={ count:0, percent: 0}

                //avgs[val.year_finish][val.month_finish]['m2']+=val.price_m2_end
                avgs[val.year_finish][val.month_finish]['percent']+=val.percent
                avgs[val.year_finish][val.month_finish]['count']++;
            })

            $.each (avgs, function(year,val){
                if(percents_data[val.year_finish]==null)
                    percents_data[year]={name: year+'', data:[
                        ['Янв',null],['Фев',null],['Март',null],['Апр',null],['Май',null],['Июнь',null],['Июль',null],['Авг',null],['Сен',null],['Окт',null],['Ноя',null],['Дек',null]
                    ]}
                $.each(val, function(month, month_data){
                    percents_data[year]['data'][month-1][1]=parseFloat((month_data.percent/(month_data['count'])).toFixed(2))||0
                    if (percents_data[year]['data'][month-1][1]==0) {
                        percents_data[year]['data'][month-1][1]=null
                    }
                })
            })
            return percents_data;
        }

    },
    QtyChart: {
        chart: null,
        select_type: "year",
        selectedYear: null,
        selectedMonth: null,
        is_drilldown: false,
        current_year: null,
        createChart: function(){
            tenders_charts.QtyChart.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'spline',
                    renderTo:'qty_line_chart'
                },
                title: {
                    text: 'Среднее число заявок'
                },
                xAxis: {
                    categories: tenders_data.years
                },
                yAxis: {
                    title: {
                        text: 'Число заявок'
                    },
                    labels: {
                        formatter: function () {
                            return this.value + '';
                        }
                    }
                },
                tooltip: {
                    crosshairs: true,
                    shared: true,
                    valueSuffix: ' шт'
                },
                plotOptions: {
                    spline: {
                        marker: {
                            radius: 4,
                            lineColor: '#666666',
                            lineWidth: 1
                        }

                    },
                    series: {
                        cursor: 'pointer',
                        point: {
                            events:{
                                click: function(e){
                                    tenders_logic.setAttrYearOrMonthFotTable(this.category);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name: 'Среднее число поданных заявок',
                    data: []
                },
                    {
                        name: 'Среднее число допущенных заявок',
                        data: []
                    }]

            });
            tenders_charts.QtyChart.is_drilldown = false;
            tenders_charts.QtyChart.selectedMonth= null;
            tenders_logic.changeDetailButtonText();
            var data = tenders_charts.QtyChart.getData();

            tenders_charts.QtyChart.chart.series[0].setData(data[0],false)
            tenders_charts.QtyChart.chart.series[1].setData(data[1])
            tenders_charts.QtyChart.bindDrilldownEvents();
        },
        getData:function(){
            var res_all = [];
            var res_accept = [];
            var tmp_res = {};
            $.each(tender_filter.getFilteredTenders(), function(i,val){
                if (tmp_res[val.year_finish]==null)
                    tmp_res[val.year_finish]={all:0, count:0, accept:0}

                tmp_res[val.year_finish]['all'] += val.bid_all;
                tmp_res[val.year_finish]['accept'] += val.bid_accept;
                tmp_res[val.year_finish]['count'] ++;
            });

            $.each(tmp_res, function(i,val){
                res_all.push({y:parseFloat((val.all/val.count).toFixed(1)), name: i});
                res_accept.push({y:parseFloat((val.accept/val.count).toFixed(1)), name: i});
            });

            return [res_all, res_accept];
        },
        redrawChart: function(){
            if (this.is_drilldown==false)
                this.createChart();
            else
                this.drilldownChart()
        },
        bindDrilldownEvents: function(){
            $('#qty_line_chart .highcharts-xaxis-labels > text').click(function(){
                tenders_charts.QtyChart.current_year =  $(this).text();
                tenders_charts.QtyChart.is_drilldown = true;
                tenders_charts.QtyChart.selectedYear =   $(this).text();
                tenders_logic.changeDetailButtonText();
                tenders_charts.QtyChart.redrawChart();
            });
        },
        drilldownChart:function(){

            var chart = tenders_charts.QtyChart
            var year =  chart.current_year

            chart.chart.renderer.button('Назад',
                150,
                10,
                chart.createChart).add();
            chart.chart.xAxis[0].setCategories(months,false);
            var series = chart.getDrilldownData()[year]

            chart.chart.series[0].setData(series['data_all'], false)
            chart.chart.series[1].setData(series['data_accept'] )


        },
        getDrilldownData: function(){
            avgs = {};
            qty_data={};

            $.each(tender_filter.getFilteredTenders(), function(i,val){
                if (avgs[val.year_finish]==null)
                    avgs[val.year_finish] = {}

                if (avgs[val.year_finish][val.month_finish]==null)
                    avgs[val.year_finish][val.month_finish]={ count:0, qty_all: 0, qty_accept:0}

                //avgs[val.year_finish][val.month_finish]['m2']+=val.price_m2_end
                avgs[val.year_finish][val.month_finish]['qty_all']+=val.bid_all
                avgs[val.year_finish][val.month_finish]['qty_accept']+=val.bid_accept
                avgs[val.year_finish][val.month_finish]['count']++;
            })

            $.each (avgs, function(year,val){
                if(qty_data[val.year_finish]==null)
                    qty_data[year]={name: year+'', data_all:[], data_accept:[]}
                $.each(val, function(month, month_data){
                    qty_data[year]['data_all'][month-1]=parseFloat((month_data.qty_all/(month_data['count'])).toFixed(1))||null
                    qty_data[year]['data_accept'][month-1]=parseFloat((month_data.qty_accept/(month_data['count'])).toFixed(1))||null
                })
            })
            return qty_data;
        }
    },
    SummChart: {
        chart: null,
        select_type: "year",
        selectedYear: null,
        selectedMonth: null,
        is_drilldown: false,
        current_year: null,
        createChart: function(){
            tenders_charts.SummChart.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'column',
                    renderTo:'sum_chart'
                },
                title: {
                    text: 'Доля конкурсов по их типу'
                },
                xAxis: {
                    type: 'category',
                    categories: tenders_data.years
                },
                yAxis: {
                    title: {
                        text: 'Доля конкурсов по типу'
                    },
                    labels: {
                        formatter: function () {
                            return this.value/1000 + ' млрд ₽';
                        }
                    }
                },
                tooltip:{
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        var sum = 0;
                        $.each(this.points, function(i, datum) {
                            sum+=datum.y;
                        });
                        $.each(this.points, function(i, datum) {
                            result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                + datum.series.name + '</i>: '
                                + thousands_sep(datum.y.toFixed(0)) + ' млн ₽ ('
                                + (datum.y*100/sum).toFixed(0) + '%)';
                        });
                        return result;
                    },
                    shared: true,
                    useHTML: true
                },

                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events:{
                                click: function(e){
                                    tenders_logic.setAttrYearOrMonthFotTable(this.category);
                                }
                            }
                        }
                    }
                },
                series: [{
                    name:'Прочее',
                    data: []
                },
                    {
                        name:'Генподряд',
                        data: []
                    },
                    {
                        name:'УК',
                        data: []
                    }]
            });
            var data =  tenders_charts.SummChart.getData();
            tenders_charts.SummChart.is_drilldown = false;
            tenders_charts.SummChart.selectedMonth= null;
            tenders_logic.changeDetailButtonText();
            tenders_charts.SummChart.chart.series[0].setData(data[0],false)
            tenders_charts.SummChart.chart.series[1].setData(data[1],false)
            tenders_charts.SummChart.chart.series[2].setData(data[2])
            tenders_charts.SummChart.bindDrilldownEvents();
        },
        getData: function(){
            var tmp_res = {};

            $.each(tender_filter.getFilteredTenders(), function(i,val){
                if (tmp_res[val.year_finish]==null)
                    tmp_res[val.year_finish]={}
                var type = (val.type=="управляющая компания"||val.type=="генподрядчик") ? val.type : 'Другое'
                if(tmp_res[val.year_finish][type]==null)
                    tmp_res[val.year_finish][type]={sum:0, count:0}

                tmp_res[val.year_finish][type]['sum'] += val.price_end;
                tmp_res[val.year_finish][type]['count'] ++;
            });
            summ_data = {}

            $.each(tmp_res, function(year, year_data){
                $.each(year_data, function(type, data){

                    if(summ_data[type]==null)
                        summ_data[type]=[]
                    summ_data[type].push(data.sum/1000000)
                })
            })
            //Другое, ГП, УК
            return [summ_data['Другое'],summ_data['генподрядчик'],summ_data['управляющая компания']]
        } ,
        redrawChart: function(){
            if (this.is_drilldown==false)
                this.createChart();
            else
                this.drilldownChart()
        },
        bindDrilldownEvents: function(){
            $('#sum_chart .highcharts-xaxis-labels > text').click(function(){
                tenders_charts.SummChart.current_year =  $(this).text();
                tenders_charts.SummChart.is_drilldown = true;
                tenders_charts.SummChart.selectedYear =   $(this).text();
                tenders_logic.changeDetailButtonText();
                tenders_charts.SummChart.redrawChart();
            });
        },
        drilldownChart:function(){

            var chart = tenders_charts.SummChart
            chart.chart.renderer.button('Назад',
                150,
                10,
                chart.createChart).add();
            var data= chart.getDrilldownData(chart.current_year);


            chart.chart.xAxis[0].setCategories(months,false)
            chart.chart.series[0].setData(data['sum'][0],false)
            chart.chart.series[1].setData(data['sum'][1],false)
            chart.chart.series[2].setData(data['sum'][2],true)


        },
        getDrilldownData: function(year){

            var tmp_res = {};

            $.each(tender_filter.getFilteredTenders(), function(i,val){
                if (val.year_finish != year)
                    return;

                if (tmp_res[val.month_finish]==null)
                    tmp_res[val.month_finish]={}
                var type = (val.type=="управляющая компания"||val.type=="генподрядчик") ? val.type : 'Другое'
                if(tmp_res[val.month_finish][type]==null)
                    tmp_res[val.month_finish][type]={sum:0}

                tmp_res[val.month_finish][type]['sum'] += val.price_end;

            });


            summ_data = {}

            $.each(tmp_res, function(month, month_data){
                $.each(month_data, function(type, data){
                    if(summ_data[type]==null)
                        summ_data[type]=[]
                    summ_data[type][month-1]=(data.sum/1000000)
                })
            })

            $.each(summ_data, function(type, type_data){
                for(var i = 0; i<12; i++)
                {
                    if (type_data[i]==null) type_data[i]=null
                }
            })
            //Другое, ГП, УК
            return {sum: [summ_data['Другое'],summ_data['генподрядчик'],summ_data['управляющая компания']]}
        }
    },
    CountChart: {
        chart: null,
        select_type: "year",
        selectedYear: null,
        selectedMonth: null,
        is_drilldown: false,
        current_year: null,
        createChart: function(){
            tenders_charts.CountChart.chart = new Highcharts.Chart({
                credits:  {
                    enabled: false
                },
                chart: {
                    type: 'column',
                    renderTo:'count_chart'
                },
                title: {
                    text: 'Доля конкурсов по их типу'
                },
                xAxis: {
                    type: 'category',
                    categories: tenders_data.years
                },
                yAxis: {
                    title: {
                        text: 'Доля конкурсов по типу'
                    }
                },
                tooltip:{
                    formatter: function() {
                        var result = '<b>' + this.x + '</b>';
                        var sum = 0;
                        $.each(this.points, function(i, datum) {
                            sum+=datum.y;
                        });
                        $.each(this.points, function(i, datum) {
                            result += '<br /> <i style="color: '+datum.point.series.color+'">'
                                + datum.series.name + '</i>: '
                                + thousands_sep(datum.y.toFixed(0)) + ' процедур ('
                                + (datum.y*100/sum).toFixed(0) + '%)';
                        });
                        return result;
                    },
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        cursor: 'pointer',
                        point: {
                            events:{
                                click: function(e){
                                    tenders_logic.setAttrYearOrMonthFotTable(this.category);
                                }
                            }
                        }
                    }
                },
                series: []
            });
            tenders_charts.CountChart.is_drilldown = false;
            tenders_charts.CountChart.selectedMonth= null;
            tenders_logic.changeDetailButtonText();
            var chart = tenders_charts.CountChart.chart;
            while(chart.series.length > 0)
                chart.series[0].remove(false);
            var count_data=tenders_charts.CountChart.getData();

            $.each(count_data, function(type,type_data){
                chart.addSeries(type_data,false)
            })
            chart.redraw();
            tenders_charts.CountChart.bindDrilldownEvents();

        },
        getData: function(){
            var tmp_res = {};
            $.each(tender_filter.getFilteredTenders(), function(i,val){

                if (tmp_res[val.year_finish]==null)
                    tmp_res[val.year_finish]={}
                var type = val.type
                if(tmp_res[val.year_finish][type]==null)
                    tmp_res[val.year_finish][type]={count:0}


                tmp_res[val.year_finish][type]['count'] ++;
            });
            var count_data = {}
            $.each(tmp_res, function(year, year_data){
                $.each(year_data, function(type, data){
                    if(count_data[type]==null)
                        count_data[type]={name: type, data:[]}
                    count_data[type]['data'].push([parseInt(year), data.count])
                })
            })
            return count_data;
        },
        redrawChart: function(){
            if (this.is_drilldown==false)
                this.createChart();
            else
                this.drilldownChart()
        },
        bindDrilldownEvents: function(){
            $('#count_chart .highcharts-xaxis-labels > text').click(function(){
                tenders_charts.CountChart.current_year =  $(this).text();
                tenders_charts.CountChart.is_drilldown = true;
                tenders_charts.CountChart.selectedYear =   $(this).text();
                tenders_logic.changeDetailButtonText();
                tenders_charts.CountChart.redrawChart();
            });
        },
        drilldownChart:function(){

            var chart = tenders_charts.CountChart
            chart.chart.renderer.button('Назад',
                150,
                10,
                chart.createChart).add();
            var data= chart.getDrilldownData(chart.current_year);
            chart.chart.xAxis[0].setCategories(months,false)
            while(chart.chart.series.length > 0)
                chart.chart.series[0].remove(false);


            $.each(data, function(type,type_data){
                chart.chart.addSeries(type_data,false)
            })
            chart.chart.redraw();
        },
        getDrilldownData: function(year){
            var tmp_res = {};
            $.each(tender_filter.getFilteredTenders(), function(i,val){

                if (val.year_finish != year)
                    return;

                if (tmp_res[val.month_finish]==null)
                    tmp_res[val.month_finish]={}
                var type = val.type
                if(tmp_res[val.month_finish][type]==null)
                    tmp_res[val.month_finish][type]={count:0}


                tmp_res[val.month_finish][type]['count'] ++;
            });
            var count_data = {}
            $.each(tmp_res, function(month, month_data){
                $.each(month_data, function(type, data){
                    if(count_data[type]==null)
                        count_data[type]={name: type, data:[]}
                    count_data[type]['data'].push([parseInt(month-1), data.count])
                })
            })
            return count_data;

        }

    }
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var tender_filter={
    id: '#tender-filter',
    filtered_objects: [],
    filtered_tenders: [],

    getAppointmetsFilter: function(){
        var res = []
        $.each($(this.id+" div.appointments input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        if(this.getLivingTypeFilter().length>0) res.push('жилье')
        return res;
    },
    getHouseAppointmentsFilter: function(){
        var res = []
        $.each($(this.id+" div.house-appointmets input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        if(this.getLivingTypeFilter().length>0) res.push('жилье')
        return res;

    },
    getLivingTypeFilter: function(){
        var res = []
        $.each($(this.id+" div.living_types input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        return res;
    },
    getSocialFilter: function(){
        var res = []
        $.each($(this.id+" div.social input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        return res;
    },
    getTypesFilter: function(){
        var res = []
        $.each($(this.id+" div.types input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        return res;
    },
    filterTenders: function(){
        this.filtered_tenders.length=0;
        types = this.getTypesFilter();
        appointments = this.getAppointmetsFilter();
        $.each(tenders, function(i,t){
            if ($.inArray( t.type, types )!=-1 &&
                $.inArray(t.appointment, appointments)!= -1)
            {
                tender_filter.filtered_tenders.push(t);
            }
        })
        return this.filtered_tenders;
    },
    getFilteredTenders: function(){
        return this.filterTenders();
    }
}

var tenders_common_charts = {
    prices_chart: null,
    qty_chart: null,
    qty_drilldown_category: 'sum',
    init:function(){
      this.createCharts();
        this.fillCharts();
        this.bindDrilldownEvents();
    },
    createCharts:function(){
        this.prices_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                type: 'column',
                renderTo:'prices_chart'
            },
            title: {
                text: 'Общая стоимость конкурсов'
            },
            xAxis: {
                categories: tenders_data.years
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'Сумма конкурсов '
                },
                labels: {
                    formatter: function () {
                        return this.value/(1000*1000*1000) + ' млрд ₽';
                    }
                }
            }],
            plotOptions: {
                column: {
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                        }
                    }
                }
            },
            tooltip:{
                formatter: function() {
                    var result = '<b>' + this.x + '</b>';
                    $.each(this.points, function(i, datum) {

                        result += '<br /> <i style="color: '+datum.point.series.color+'">' + datum.series.name + '</i>: ' + million_to_text(datum.y);

                    });
                    result += '<br />Среднее снижение цены ' + (this.points[0].point.percent).toFixed(2) + '%'

                    return result;
                },
                shared: true,
                useHTML: true
            },
            series: [{
                name: 'Начальная цена',
                data: []

            }, {
                name: 'Итоговая цена',
                data: []
            }]
        });

        this.qty_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                type: 'column',
                renderTo:'qty_chart'
            },
            title: {
                text: 'Конкурсы по числу допущенных заявок'
            },
            xAxis: {
                categories: tenders_data.qty_years
            },
            yAxis: [{
                min: 0,
                title: {
                    text: '%'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }

                }
            }],
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y} </b> ({point.percentage:.0f}%)<br/>',
                shared: true
                //valueSuffix: " конкурсов"
            },
            plotOptions: {
                column: {
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        },
                        formatter: function(){

                            return this.percentage.toFixed(0)+ ' %'+'<br>'+(this.y||0).toFixed(0)+ ' млрд'
                            //return ""
                        }
                    }
                }
            },
            series: []
        });
    },
    fillCharts: function(){
        var series = this.getPricesChartData();
        this.prices_chart.series[0].setData(series[0], false);
        this.prices_chart.series[1].setData(series[1]);

        while(this.qty_chart.series.length > 0)
            this.qty_chart.series[0].remove(false);
        $.each (tenders_data.qty_sum, function (i,qty){
            tenders_common_charts.qty_chart.addSeries({data: qty.data, name: qty.name, tooltip: { valueSuffix: ' млрд ₽'}}, false);
        })
        this.qty_chart.xAxis[0].setCategories(tenders_data.qty_years, false)
        this.qty_chart.redraw();
    },
    bindDrilldownEvents: function(){
        $('#prices_chart .highcharts-xaxis-labels text').click(this.drilldownSummChart)
        $('#qty_chart .highcharts-xaxis-labels  text').click(this.drilldownQtyChart)
    },
    getPricesChartData: function(){
        var res =[];
        res[0] = [];
        res[1] = [];
//        res[2] = [];
//        res[3] = [];
//        res[4] = [];
//        res[5] = [];
//        res[6] = [];

        $.each (tenders_data.prices_begin, function (i,val){
            res[0].push({y: (tenders_data.prices_begin[i]), percent: tenders_data.prices_percent[i]/tenders_data.count[i], drilldown:i})
            res[1].push({y: (tenders_data.prices_end[i]), percent: tenders_data.prices_percent[i]/tenders_data.count[i], drilldown:i});
//            res[2].push(toFixedAndParse(data.prices_percent[i]/data.count[i],2));
//            res[3].push(toFixedAndParse(data.one_start[i],2))
//            res[4].push(toFixedAndParse(data.one_end[i],2))
//            res[5].push(toFixedAndParse(data.one_end[i]/data.count[i],2))
        })

        //console.log(res);
        return res;
    },
    drilldownSummChart: function(){
        var drilldownsSumm = {
            '2012': [[
                {y:0, percent:0},
                {y:9557, percent:4.48},
                {y:15294, percent:7.30},
                {y:559, percent:0.49},
                {y:5801, percent:0.67},
                {y:4474, percent:2.03},
                {y:8136, percent:2.95},
                {y:2511, percent:0.59},
                {y:925, percent:4.0},
                {y:2364, percent:4.45},
                {y:4611, percent:5.24},
                {y:14434, percent:8.29}
            ],
                [
                    {y:0, percent:0},
                    {y:9123, percent:4.48},
                    {y:14159, percent:7.30},
                    {y:557, percent:0.49},
                    {y:5749, percent:0.67},
                    {y:4330, percent:2.03},
                    {y:7792, percent:2.95},
                    {y:2490, percent:0.59},
                    {y:848, percent:4.0},
                    {y:2256, percent:4.45},
                    {y:4282, percent:5.24},
                    {y:12793, percent:8.29}]
            ],
            '2013': [[
                {y:5381, percent:3.35},
                {y:3672, percent:4.44},
                {y:27431, percent:5.18},
                {y:25706, percent:4.94},
                {y:3206, percent:4.18},
                {y:259, percent:0},
                {y:4003, percent:2.92},
                {y:7214, percent:4.40},
                {y:1251, percent:3.},
                {y:2053, percent:3.49},
                {y:942, percent:3.86},
                {y:13544, percent:5.04}        ],
                [
                    {y:5202, percent:3.35},
                    {y:3417, percent:4.44},
                    {y:25414, percent:5.18},
                    {y:23576, percent:4.94},
                    {y:2996, percent:4.18},
                    {y:0, percent:0},
                    {y:3797, percent:2.92},
                    {y:6572, percent:4.40},
                    {y:1182, percent:3.28},
                    {y:1983, percent:3.49},
                    {y:913, percent:3.86},
                    {y:12798, percent:5.04}]
            ],
            '2014': [[
                {y:4846, percent:5.75},
                {y:7985, percent:5.11},
                {y:4061, percent:4.67},
                {y:1997, percent:3.51},
                {y:44558, percent:5.55},
                {y:1700, percent:5.70},
                {y:892, percent:5.08},
                {y:2596, percent:7.13},
                {y:14673, percent:3.35},
                {y:342, percent:0}
            ],
                [
                    {y:4499, percent:5.75},
                    {y:7592, percent:5.11},
                    {y:4014, percent:4.67},
                    {y:1942, percent:3.51},
                    {y:42445, percent:5.55},
                    {y:1641, percent:5.70},
                    {y:848, percent:5.08},
                    {y:2412, percent:7.13},
                    {y:51, percent:3.35},
                    {y:0, percent:0}]
            ]
        }
        var months = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
        tenders_common_charts.prices_chart.xAxis[0].setCategories(months, false)
        tenders_common_charts.prices_chart.series[0].setData(drilldownsSumm[$(this).text()][0], false);
        tenders_common_charts.prices_chart.series[1].setData(drilldownsSumm[$(this).text()][1], true);
        tenders_common_charts.prices_chart.renderer.button('Назад',
            200,
            10,
            tenders_common_charts.returnYearChart).add();
    },
    drilldownQtyChart: function(){
        var months = ["Янв", "Фев", "Март", "Апр", "Май", "Июнь", "Июль", "Авг", "Сен", "Окт", "Ноя", "Дек"];

        var series = [null, null, null, null, null, null, null, null, null, null, null, null];
        tenders_common_charts.qty_chart.xAxis[0].setCategories(months, false)
        $.each (tenders_data['qty_drilldowns'][$(this).text()][tenders_common_charts.qty_drilldown_category]['one'], function(i,val){
            series[months.indexOf(val[0])]=val[1];
        })

        tenders_common_charts.qty_chart.series[2].setData(series, false);

        var series = [null, null, null, null, null, null, null, null, null, null, null, null];
        tenders_common_charts.qty_chart.xAxis[0].setCategories(months, false)
        $.each (tenders_data['qty_drilldowns'][$(this).text()][tenders_common_charts.qty_drilldown_category]['two_four'], function(i,val){
            series[months.indexOf(val[0])]=val[1];
        })
        tenders_common_charts.qty_chart.series[1].setData(series, false);

        var series = [null, null, null, null, null, null, null, null, null, null, null, null];
        tenders_common_charts.qty_chart.xAxis[0].setCategories(months, false)
        $.each (tenders_data['qty_drilldowns'][$(this).text()][tenders_common_charts.qty_drilldown_category]['g_four'], function(i,val){
            series[months.indexOf(val[0])]=val[1];
        })
        tenders_common_charts.qty_chart.series[0].setData(series, true);


        tenders_common_charts.qty_chart.renderer.button('Назад',
            200,
            10,
            tenders_common_charts.returnYearQtyChart).add();
    },
    returnYearChart: function(){
        $('#prices_chart .highcharts-button').remove();
        var series = tenders_common_charts.getPricesChartData();
        tenders_common_charts.prices_chart.xAxis[0].setCategories(tenders_data.years, false)
        tenders_common_charts.prices_chart.series[0].setData(series[0], false);
        tenders_common_charts.prices_chart.series[1].setData(series[1],false);
        tenders_common_charts.prices_chart.redraw();
        $('#prices_chart .highcharts-xaxis-labels text').click(tenders_common_charts.drilldownSummChart)
    },
    returnYearQtyChart:function(){
        $('#qty_chart .highcharts-button').remove();
        while(tenders_common_charts.qty_chart.series.length > 0)
            tenders_common_charts.qty_chart.series[0].remove(false);
        $.each (tenders_data.qty_sum, function (i,qty){
            tenders_common_charts.qty_chart.addSeries({data: qty.data, name: qty.name, tooltip: { valueSuffix: ' млрд ₽'}}, false);
        })
        tenders_common_charts.qty_chart.xAxis[0].setCategories(tenders_data.qty_years, false)
        tenders_common_charts.qty_chart.redraw();
        $('#qty_chart .highcharts-xaxis-labels  text').click(tenders_common_charts.drilldownQtyChart)

    }

}