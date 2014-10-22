var tenders_logic = {
    id: null,
    filtered_objects: [],
    filtered_tenders: [],
    chart_div_content: 'tender-current-chart',
    year_enter: null,
    year_tender: null,
    month_tender: null,
    // charts
    m2_price_chart: null,
    m2_social_price_chart: null,
    uk_notuk_chart: null,
    uk_notuk_social_chart: null,
    price_percent_chart: null,
    qty_line_chart: null,
    summ_chart: null,

    ///
    init: function(id){
        this.id = '#'+id;
        this.el = $("#id");
        $(".tenders-tabs input").change(tenders_logic.changeActiveChart)
        $('#tender-filter input').change(tenders_logic.redrawAllCharts)
        this.redrawAllCharts();

    },
    redrawAllCharts: function(){
        tenders_logic.filterTenders();
        tenders_logic.createPriceM2HouseChart();
        tenders_logic.createPriceSocialPrice();
        tenders_logic.createUKHouseChart();
        tenders_logic.createUKSocialChart();
        tenders_logic.createPercentChart();
        tenders_logic.createQtyChart();
        tenders_logic.createSummChart();
        tenders_logic.createCountChart();
    },
    changeActiveChart: function(){
         $("#tender-charts-content div.tender_chart").hide();
         $("#"+$(this).attr('data-div')).show();
    },
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
        tenders_logic.filtered_tenders.length=0;
        types = tenders_logic.getTypesFilter();
        appointments = tenders_logic.getAppointmetsFilter();
        $.each(tenders, function(i,t){
            if ($.inArray( t.type, types )!=-1 &&
                $.inArray(t.appointment, appointments)!= -1)
            {
                tenders_logic.filtered_tenders.push(t);
            }
        })
        return tenders_logic.filtered_tenders;
    },
    setEnterYearForTable: function(type, category){
        console.log(type, category);
    },
    setAttrYearOrMonthFotTable: function(cat){
      console.log(cat);
    },
    createPriceM2HouseChart: function(){
        tenders_logic.m2_price_chart = new Highcharts.Chart({
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
        var data =  tenders_logic.getDataForHouseM2PriceChart()  ;
        console.log(data);
        tenders_logic.m2_price_chart.xAxis[0].setCategories(data[0],false)
        tenders_logic.m2_price_chart.series[0].setData(data[1]);
    },
    getDataForHouseM2PriceChart: function(){
        var years = [];
        var prices = {};
        $.each(objects_tenders, function (i,obj){
            if ($.inArray(obj.appointment, tenders_logic.getHouseAppointmentsFilter())==-1) return;
            if ($.inArray(obj.series, tenders_logic.getLivingTypeFilter())==-1) return;

            var year = obj.year_enter||"----";
            if (years.indexOf(year)==-1) years.push (year)
            if (prices[year]==null) prices[year] = {power:0, sum: 0};
            var tenders_sum = 0;

            $.each(obj.tenders, function(i,tender){
                if ($.inArray(tender.type, tenders_logic.getTypesFilter())==-1 )
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
    createPriceSocialPrice: function(){
        tenders_logic.m2_social_price_chart = new Highcharts.Chart({
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
//            categories: data.years
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
                //valueSuffix: ' тыс. руб'
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
        var data = tenders_logic.getDataForSocialM2PriceChart();
        tenders_logic.m2_social_price_chart.xAxis[0].setCategories(data[0],false)
        tenders_logic.m2_social_price_chart.series[0].setData(data[1])
    },
    getDataForSocialM2PriceChart: function(){
        var years = [];
        var prices = {};
        $.each(objects_tenders, function (i,obj){
            if ($.inArray(obj.appointment, tenders_logic.getSocialFilter())==-1) return;
            var year = obj.year_enter||"----";
            if (years.indexOf(year)==-1) years.push (year)

            if (prices[year]==null) prices[year] = {power:0, sum: 0};
            var tenders_sum = 0;
            $.each(obj.tenders, function(i,tender){

                if ($.inArray(tender.type,tenders_logic.getTypesFilter())==-1 )
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
    createUKHouseChart: function(){
        tenders_logic.uk_notuk_chart = new Highcharts.Chart({
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

        var data = tenders_logic.getDataForUKNotUKM2HousePriceChart();
        console.log(data);
        tenders_logic.uk_notuk_chart.xAxis[0].setCategories(data[0],false)
        tenders_logic.uk_notuk_chart.series[0].setData(data[1],false)
        tenders_logic.uk_notuk_chart.series[1].setData(data[2])

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
    },
    getDataForUKNotUKM2HousePriceChart: function(){
        var years = [];
        var prices_uk = {};
        var prices_not_uk = {};
        $.each(objects_tenders, function (i,obj){
            if ($.inArray(obj.appointment, tenders_logic.getHouseAppointmentsFilter())==-1) return;
            if ($.inArray(obj.series, tenders_logic.getLivingTypeFilter())==-1) return;

            if (tenders_logic.objectHaveUKTenderOnly(obj)==false && tenders_logic.objectDontHaveUKTenders(obj)==false) return;

            var year = obj.year_enter||"----";
            if (years.indexOf(year)==-1) years.push (year)

            if (tenders_logic.objectHaveUKTenderOnly(obj))
            {
                if (prices_uk[year]==null) prices_uk[year] = {power:0, sum: 0};
                var tenders_sum = 0;
                $.each(obj.tenders, function(i,tender){
                    if ($.inArray(tender.type, tenders_logic.getTypesFilter())==-1 )
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
                    if ($.inArray(tender.type, tenders_logic.getTypesFilter())==-1 )
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
    createUKSocialChart: function(){
        tenders_logic.uk_notuk_social_chart = new Highcharts.Chart({
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

        var data = tenders_logic.getDataForUKNotUKM2SocialPriceChart();
        tenders_logic.uk_notuk_social_chart.xAxis[0].setCategories(data[0],false)
        tenders_logic.uk_notuk_social_chart.series[0].setData(data[1],false)
        tenders_logic.uk_notuk_social_chart.series[1].setData(data[2])
    },
    getDataForUKNotUKM2SocialPriceChart: function(){
        var years = [];
        var prices_uk = {};
        var prices_not_uk = {};
        $.each(objects_tenders, function (i,obj){
            if ($.inArray(obj.appointment, tenders_logic.getSocialFilter())==-1) return;

            if (tenders_logic.objectHaveUKTenderOnly(obj)==false && tenders_logic.objectDontHaveUKTenders(obj)==false) return;

            var year = obj.year_enter||"----";
            if (years.indexOf(year)==-1) years.push (year)
            if (tenders_logic.objectHaveUKTenderOnly(obj))
            {
                if (prices_uk[year]==null) prices_uk[year] = {power:0, sum: 0};
                var tenders_sum = 0;
                $.each(obj.tenders, function(i,tender){
                    if ($.inArray(tender.type, tenders_logic.getTypesFilter())==-1 )
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
                    if ($.inArray(tender.type, tenders_logic.getTypesFilter())==-1 )
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
    createPercentChart: function(){
        tenders_logic.price_percent_chart = new Highcharts.Chart({
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
                },
                min: 0
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
        tenders_logic.price_percent_chart.series[0].setData(tenders_logic.getDataForPricePercentChart())

    },
    getDataForPricePercentChart: function(){
        var res = []
        var tmp_res = {};
        $.each(tenders_logic.filtered_tenders, function(i,val){
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
    createQtyChart: function(){
        tenders_logic.qty_line_chart = new Highcharts.Chart({
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
        var data = tenders_logic.getDataForQtyLineChart();
        tenders_logic.qty_line_chart.series[0].setData(data[0],false)
        tenders_logic.qty_line_chart.series[1].setData(data[1])
    },
    getDataForQtyLineChart:function(){
        var res_all = [];
        var res_accept = [];
        var tmp_res = {};
        $.each(tenders_logic.filtered_tenders, function(i,val){
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
    createSummChart: function(){
        tenders_logic.summ_chart = new Highcharts.Chart({
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
        var data =  tenders_logic.getDataForSummChart()['sum']
        tenders_logic.summ_chart.series[0].setData(data[0],false)
        tenders_logic.summ_chart.series[1].setData(data[1],false)
        tenders_logic.summ_chart.series[2].setData(data[2])
    },
    getDataForSummChart: function(){
        var res = {}
        var tmp_res = {};

        $.each(tenders_logic.filtered_tenders, function(i,val){

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
        return {sum: [summ_data['Другое'],summ_data['генподрядчик'],summ_data['управляющая компания']]}
    },
    createCountChart: function(){
        tenders_logic.count_chart = new Highcharts.Chart({
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

        while(tenders_logic.count_chart.series.length > 0)
            tenders_logic.count_chart.series[0].remove(false);
        var count_data=tenders_logic.getDataForCountChart();
        $.each(count_data, function(type,type_data){
            tenders_logic.count_chart.addSeries(type_data,false)
        })
        tenders_logic.count_chart.redraw();

    },
    getDataForCountChart: function()
    {
        var tmp_res = {};
        $.each(tenders_logic.filtered_tenders, function(i,val){

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
    }


}