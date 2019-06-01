/**
 * Created by zhuk on 20.02.16.
 */
$(function(){
    Highcharts.setOptions(options);
    generate_fake_objects()
    listApp.init();
})

var objects = [];
function generate_fake_objects(){
    faker.locale = "ru";
    for (var i = 0; i <112 ; i++){
        objects.push(
            {
                id: i,
                address: faker.address.streetName(),
                latitude: faker.finance.amount(54.5,56.5,4),
                longitude: faker.finance.amount(36,38.7,4),
                type: faker.random.number({min:1, max:10}),
                district: faker.random.number({min:1, max:10}),
                delay: faker.random.number({min:-30, max:150}),
                finance: {
                    budget: parseFloat(faker.finance.amount(2, 130,1)),
                    plan: parseFloat(faker.finance.amount(2, 120,1)),
                    done: parseFloat(faker.finance.amount(2, 110,1)),
                    acts: parseFloat(faker.finance.amount(2, 100,1)),
                    payed: parseFloat(faker.finance.amount(2, 80,1))
                },
                otrasl: faker.random.arrayElement(otraslIdVaules()),
                type: faker.random.arrayElement(typelIdVaules()),
                program: faker.random.arrayElement(programlIdVaules()),


            }
        );
        console.log(objects[i])
    }
    //console.log(objects)
}

var listApp = {
    map: null,
    filtrateObjects: objects,
    marker_group: null,
    init: function(){
        console.log('page init…')
        redrawCharts();
        map_wrapper.initMap();
        map_wrapper.bindMarkersOnMap();
        this.bind_list();
        $('#filter-otrasl').touchFilter({name: 'Отрасль', items:otraslFilterValues});
        $('#filter-type').touchFilter({name: 'Тип', items:typeFilterValues});
        $('#filter-program').touchFilter({name: 'Программа', items:programFilterValues});
        $('#filter-otrasl, #filter-type, #filter-program').on('tf.change', function(){
            listApp.filterObjects();
              redrawCharts();
            listApp.bind_list();
            map_wrapper.bindMarkersOnMap();
        });

        $("input[type='radio'][name='measure']").on('change',listApp.draw_plan_fact_chart)

        function redrawCharts(){
            listApp.draw_dynamics_chart();
            listApp.draw_delays_chart();
            listApp.draw_finance_chart();
            listApp.draw_plan_fact_chart();
        }

    },
    filterObjects: function(){
        var otraslFilterVaules = $('#filter-otrasl').touchFilter('getValues');
        var typeFilterValues = $('#filter-type').touchFilter('getValues');
        var programFilterValues = $('#filter-program').touchFilter('getValues');
        console.log(programFilterValues)
        listApp.filtrateObjects = [];
        objects.forEach(function(val){
           if(otraslFilterVaules.indexOf(val.otrasl)>=0 &&
               typeFilterValues.indexOf(val.type)>=0 &&
               programFilterValues.indexOf(val.program)>=0){
                listApp.filtrateObjects.push(val)
           }
        })


    },
    draw_delays_chart: function(){

        var success_count = getCountByDelay(-9999, 1);
        var warning_count = getCountByDelay(1, 40);
        var warning_important_count = getCountByDelay(40, 60);
        var danger_count = getCountByDelay(60, 999999);
        var chart = new Highcharts.Chart({
            chart: {
                type: 'pie',
                renderTo:'delays_chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Сроки'
            },
            yAxis: {
                title: {
                    text: ''
                }
            },
            plotOptions: {
                pie: {
                    shadow: false,
                    center: ['100px', '65px'],
                    dataLabels: {
                        enabled: true,
                        distance: -30,
                        format: '{y}',
                        style: {
                            fontWeight: 'bold',
                            fontSize: "10px"
                        }
                    },
                    showInLegend: true
                }
            },
            tooltip: {
                enabled: false
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                floating: true,
                x: 230,
                y: 70,
                useHTML: true,
                itemMarginBottom: 10
            },
            series: [{
                name: 'Бюджет',
                data: [{
                    name: 'В срок',
                    y: success_count,
                    color: colors[4]
                },{
                    name: 'С отклонением до 20 дней',
                    y:warning_count,
                    color: colors[3]
                },{
                    name: 'С отклонением от 20 до 60 дней',
                    y:warning_important_count,
                    color: colors[2]
                },{
                    name: 'С отклонением более 60 дней',
                    y:danger_count,
                    color: colors[1]
                }],
                size: 200,
                innerSize: 100
            }]
        });

        function getCountByDelay(from, to){
            var res = 0;
            listApp.filtrateObjects.forEach(function(obj){
                if (obj.delay>=from && obj.delay<to) res++
            })
            return res;
        }

    },
    draw_dynamics_chart: function(){
        var chart = new Highcharts.Chart({
            title: {
                text: "Динамика освоения бюджета",
            },
            chart: {
                type: "column",
                renderTo:'dynamic_chart',
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
                color: colors[7],
                marker: {
                    radius: 2
                }
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
                // categories: ["10.2018", "11.2018", "12.2018", "01.2019", "02.2019", "03.2019", "04.2019", "05.2019", "06.2019", "07.2019", "08.2019", "09.2019", "10.2019", "11.2019", "12.2019", "01.2020", "02.2020", "03.2020"]
            },
            yAxis: { title: { text: 'млн ₽' } }
        })

    },
    draw_finance_chart: function(){

        var plan = 0;
        var done = 0;
        var acts = 0;
        var payed = 0;
        listApp.filtrateObjects.forEach(function(obj){
            plan+= obj.finance.plan;
            done+= obj.finance.done;
            acts += obj.finance.acts;
            payed += obj.finance.payed;
        });
        console.log(plan)
        var chart = new Highcharts.Chart({
            title: {
                text: "Освоение бюджета"
            },
            chart: {
                renderTo:'finance_statuses',
                type: 'bar'
            },
            series: [{
                name: 'Запланировано',
                data: [plan],
                color: colors[7]
            }, {
                name: 'Выполнено',
                data: [done],
                color: colors[2]
            }, {
                name: 'Заактировано',
                data: [acts],
                color: colors[5]
            }, {
                name: 'Оплачено',
                data: [payed],
                color: colors[3]
            }],
            tooltip: {
                enabled: false
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        formatter: function(){
                            return this.y.toFixed(2)
                        }
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
        });
    },
    draw_plan_fact_chart: function(){

        var axisTitle = '';
        var measure =  $("input[type='radio'][name='measure']:checked").val();
        console.log(measure)
        if (measure=='c') axisTitle = 'шт';
        if (measure=='s') axisTitle = 'млн Р';

        var plan = 0;
        var fact = 0;
        listApp.filtrateObjects.forEach(function(obj){
            if (measure=='c'){
                plan++;
                if (obj.finance.plan>0) fact++;
            }
            if (measure=='s'){
                plan += obj.finance.budget;
                fact += obj.finance.plan ;
            }
        })


        var chart = new Highcharts.Chart({
            title: {
                text: "План-факт контрактации"
            },
            chart: {
                type: 'columnrange',
                renderTo:'finance_plan_fact',
                inverted: true
            },
            series: [{
                name: 'План',
                data: [[0, plan]],
                color: colors[7]
            }, {
                name: 'Факт',
                data: [[0, fact]],
                color: colors[2]
            }, {
                name: 'Отклонение',
                data: [{high: plan, low: fact, color: colors[4]}],
                color: colors[11],
                dataLabels: { enabled: true }
            }],
            tooltip: {
                enabled: false
            },
            plotOptions: {
                columnrange: {
                    dataLabels: {
                        enabled: false,
                        inside: true,
                        align: 'center',
                        formatter: function() {
                            var diff, percentage, value;
                            diff = this.point.high - this.point.low;
                            return diff.toFixed(3)
                        }
                    }
                }
            },
            xAxis: {
                title: false,
                categories: [""]
            },
            yAxis: {
                title: {
                    text: axisTitle
                },
                min: 0
            }
        });
    },
    bind_list: function(){
       var table = $('#objects_table').html('')
        $.each(listApp.filtrateObjects, function(i, obj){
            var tr = $(document.createElement('tr'));
            if (obj.delay<1) tr.addClass('success');
            if (obj.delay>=1 && obj.delay<40) tr.addClass('warning');
            if (obj.delay>=40 && obj.delay<60) tr.addClass('warning-important');
            if (obj.delay>=60) tr.addClass('danger');
            tr.append($(document.createElement('td')).text(i+1));
            var a = $(document.createElement('a')).attr('href', 'project.html').text(obj.address);
            tr.append($(document.createElement('td')).append(a));
            tr.append($(document.createElement('td')).text(getOtraslNameById(obj.otrasl)));
            tr.append($(document.createElement('td')).text(getTypeNameById(obj.type)));
            tr.append($(document.createElement('td')).text(getProgramNameById(obj.program)));
            tr.append($(document.createElement('td')).text(obj.delay));
            tr.append($(document.createElement('td')).text(obj.finance.payed+"/"+obj.finance.plan
                                                        +" ("+(obj.finance.payed*100/obj.finance.plan).toFixed()+"%)"));
            table.append(tr)

        });
        $.bootstrapSortable(true)

    },
    getMarkerOption: function(obj){
        if (obj.delay<=0) return markerGreen();
        if (obj.delay>0 && obj.delay<60) return markerYellow();
        if (obj.delay>=60) return markerRed();

        function markerGreen(){
            return L.icon({
                iconUrl: 'css/images/marker_green.png',
                iconRetinaUrl: 'css/images/marker_green@2x.png',
                shadowUrl: 'css/images/marker_shadow.png',
                iconSize:     [24, 39], // size of the icon
                shadowSize:   [72, 61], // size of the shadow
                iconAnchor:   [12, 20], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 39],  // the same for the shadow
                popupAnchor:  [-0, -10] // point from which the popup should open relative to the iconAnchor
            });
        }

        function markerYellow(){
            return L.icon({
                iconUrl: 'css/images/marker_yellow.png',
                iconRetinaUrl: 'css/images/marker_yellow@2x.png',
                shadowUrl: 'css/images/marker_shadow.png',

                iconSize:     [24, 39], // size of the icon
                shadowSize:   [72, 61], // size of the shadow
                iconAnchor:   [12, 20], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 39],  // the same for the shadow
                popupAnchor:  [-0, -10] // point from which the popup should open relative to the iconAnchor
            });
        }

        function markerRed(){
            return L.icon({
                iconUrl: 'css/images/marker_red.png',
                iconRetinaUrl: 'css/images/marker_red@2x.png',
                shadowUrl: 'css/images/marker_shadow.png',

                iconSize:     [24, 39], // size of the icon
                shadowSize:   [72, 61], // size of the shadow
                iconAnchor:   [12, 20], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 39],  // the same for the shadow
                popupAnchor:  [-0, -10] // point from which the popup should open relative to the iconAnchor
            });
        }
    }

}
