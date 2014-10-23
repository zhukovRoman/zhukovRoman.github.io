var empl_logic = {
    salary_structure_chart:null,
    empl_count_info: null,
    init: function(){
        this.empl_count_info =  empl_counts;

        $('#empl-charts-tabs input, #empl-charts-tabs2 input').change(empl_logic.changeChart)
        this.createSalaryStructureChart();
        this.createEmplDepartmentChart();
        this.createPersonalChart();
        this.createKoefChart();
        this.createAUPChart();
        this.createAttitudeChart();
    },
    changeChart: function(){
        $('.empl_chart').hide();
        $('#'+$(this).attr('data-div')).show();
    },
    createSalaryStructureChart: function(){
        this.salary_structure_chart =  new Highcharts.Chart({
           credits:  {
               enabled: false
           },
           chart: {
               type: 'column',
               renderTo: 'salary_structure_chart'
           },
           title: {
               text: 'Структура заработной платы'
           },
           xAxis: {
               labels: {
                   formatter: function () {return this.value.length < 40 ? this.value : this.value.substring(0,40)+"...";}
               },
               categories: xaxis
           },
           yAxis: [{
               min: 0,
               title: {
                   text: 'Сумма'
               },
               stackLabels: {
                   enabled: false,
                   style: {
                       fontWeight: 'bold',
                       color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                   }
               },
               labels: {
                   formatter: function() {
                       return thousands_sep(this.value / 1000) +' тыс ₽';
                   }
               }
           },{
               title:{text:'Средняя зарплата'},
               opposite: true,
               labels: {
                   formatter: function() {
                       return thousands_sep(this.value / 1000) +' тыс ₽';
                   }
               }
           }],
           legend: {
               align: 'right',
               x: -70,
               verticalAlign: 'top',
               y: 20,
               floating: true,
               backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
               borderColor: '#CCC',
               borderWidth: 1,
               shadow: false
           },
           tooltip: {
               formatter: function() {
                   var result = '<b>' + this.x + '</b>';
                   $.each(this.points, function(i, datum) {
                       result += '<br /> <i style="color:'+datum.series.color+'">' + datum.series.name + '</i>: ' + thousands_sep(datum.y) + ' ₽';
                   });
                   result += '<br /> Всего сотрудников:' + empl_logic.empl_count_info[this.points[0].point.index]
                   return result;
               },
               shared: true,
               useHTML: true
           },
           plotOptions: {
               column: {
                   stacking: 'normal'
               }
           },
           series: [{
               name: 'Налоги',
               data: tax,
               tooltip: {
                   valueSuffix: ' руб'
                   }
               },{
                   name: 'Премии',
                   data: bonus,
                   tooltip: {
                   valueSuffix: ' руб'
                   }
               }, {
                   name: 'Зарплата',
                   data: salary,
                   tooltip: {
                   valueSuffix: ' руб'
                   }
               }
               ,{
                   name: 'Средняя зарплата',
                   type: 'spline',
                   yAxis: 1,
                   data: avg_salary,
                   tooltip: {
                   valueSuffix: ' руб'
                   }
               }
           ]
        });
        $('#salary_structure_chart .highcharts-xaxis-labels text').click(empl_logic.drilldown)
    },
    createEmplDepartmentChart: function(){
        empl_department_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                type: 'bar',
                renderTo: 'empl_department_chart'
            },
            title: {
                text: 'Число сотрудников и вакансий по подразделениям'
            },
            xAxis: {
                categories: departments,
                labels: {
                    rotation: -0,
                    formatter: function () {return this.value.length < 40 ? this.value : this.value.substring(0,40)+"...";}
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: ''
                }
            },
            tooltip: {
                formatter: function() {
                    var result = '<b>' + this.x + '</b>';
                    $.each(this.points, function(i, datum) {
                        result += '<br /> <i>' + datum.series.name + '</i>: ' + datum.y + ' человек';

                    });
                    //console.log()
                    result += '<br />Руководитель: ' + this.points[0].point.manager

                    return result;
                },
                shared: true,
                useHTML: true
            },
            legend: {
                align: 'right',
                x: -70,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            plotOptions: {
                bar: {
//                pointPadding: 0.2,
//                borderWidth: 0,
                    stacking: 'normal',
                    minPointLength: 2
                }
            },
            series: [{
                name: 'Вакансий',
                data: deps_infos['vacancy'],
                color: 'rgb(144, 237, 125)'
            },{
                name: 'Сотрудников',
                data: deps_infos['employee_count'] ,
                color: 'rgb(124, 181, 236)'

            }]
        });

    },
    createPersonalChart: function(){
        personal_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {

                renderTo: 'personal_chart'
            },
            title: {
                text: 'Персонал'
            },
            xAxis: {
                categories: xaxis
            },
            plotOptions: {
                column: {
                    minPointLength: 3
                }
            },
            yAxis: [{ // Primary yAxis
                title: {
                    text: 'Человек',
                    style: {
                        color: Highcharts.getOptions().colors[1]
                    }
                }
            }, { // Secondary yAxis
                title: {
                    text: 'Человек',
                    style: {
                        color: Highcharts.getOptions().colors[0]
                    }
                },
                labels: {
                    format: '{value}'
                },
                opposite: true,
                tickInterval: 1
            }],
            labels: {
                items: []
            },
            tooltip: {
                shared: true
            },
            series: [{
                type: 'column',
                name: 'Принято',
                data: empl_add
            },
            {
                type: 'column',
                name: 'Уволено',
                data: empl_dismiss
            },  {
                type: 'column',
                name: 'Вакансий',
                data: vacancy_counts
            }, {
                type: 'spline',
                name: 'Число сотрудников',
                color: 'red',
                data: empl_counts,
                yAxis: 1,
                marker: {
                lineWidth: 2,
                lineColor: 'red',
                fillColor: 'white'
                }
            }]
        });
    },
    createKoefChart: function(){
        koef_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                renderTo: 'koef_chart'
            },
            title: {
                text: 'Коэффициент текучести кадров'
            },
            xAxis: {
                categories: xaxis
            },
            yAxis: {
                min: 0,
                title: {
                    text: '%'
                }
            },
            tooltip: {
                valueSuffix: '%'
            },
            series: [{
                name: 'Неукомплектованность кадров',
                data: k_neuk,
                type: 'spline'
            }, {
                name: 'Коэффициент текучести кадров',
                type: 'spline',
                data: k_tek
            }]
        })
    },
    createAUPChart: function(){
        AUP_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                type: 'column',
                renderTo: 'aup_salary_structure_chart'
            },
            title: {
                text: 'Структура заработной платы АУП'
            },
            xAxis: {
                categories: xaxis
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'Сумма'
                },
                stackLabels: {
                    enabled: false,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                labels: {
                    formatter: function() {
                        return thousands_sep(this.value / 1000) +' тыс ₽';
                    }
                }
                },{
                    title:{text:'Средняя зарплата'},
                    opposite: true,
                    labels: {
                        formatter: function() {
                            return thousands_sep(this.value / 1000) +' тыс ₽';
                        }
                    }
            }
            ,{
                title:{text:'Количество персонала'}
            }],
            legend: {
                align: 'right',
                x: -100,
                verticalAlign: 'top',
                y: 20,
                floating: true,
                backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
                borderColor: '#CCC',
                borderWidth: 1,
                shadow: false
            },
            tooltip: {
                formatter: function() {
                    var result = '<b>' + this.x + '</b>';
                    $.each(this.points, function(i, datum) {
                        result += '<br /> <i style="color:'+datum.series.color+'">' + datum.series.name + '</i>: ' + thousands_sep(datum.y) + datum.series.tooltipOptions.valueSuffix ;
                        console.log(datum);
                    });
                    return result;
                },
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                }
            },
            series: [{
                name: 'Налоги',
                stack: 'ZP',
                data: manager_tax,
                tooltip: {
                    valueSuffix: ' ₽'
                    }
                },{
                    name: 'Премии',
                    stack: 'ZP',
                    data: manager_bonus,
                    tooltip: {
                    valueSuffix: ' ₽'
                    }
                }, {
                    name: 'ЗП',
                    stack: 'ZP',
                    data: manager_salary,
                    tooltip: {
                        valueSuffix: ' ₽'
                    }
                }, {
                    name: 'Количество АУП',
                    stack: 'none',
                    yAxis: 2,
                    data: aup_counts,
                    tooltip: {
                        valueSuffix: ' чел'
                    },
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                        style: {
                            textShadow: '0 0 3px black, 0 0 3px black'
                        }
                    }
                },{
                    name: 'Средняя зарплата',
                    type: 'spline',
                    yAxis: 1,
                    data: manager_avg_salary,
                    tooltip: {
                        valueSuffix: ' ₽'
                    }}
            ]
        })
    },
    createAttitudeChart: function(){
        attitude_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                type: 'column',
                renderTo: 'attitude_chart'
            },
            title: {
                text: 'Отношение производственного персонала к управленческому'
            },
            xAxis: {
                categories: xaxis
            },
            yAxis: {
                min: 0,
                title: {
                    text: '%'
                }
            },
            tooltip: {
                shared: true,
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.0f}%)</b><br/>',
                valueSuffix: ' человек '
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true
//                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
//                        style: {
//                            textShadow: '0 0 3px black, 0 0 3px black'
//                        }
                    }
                }
            },
            series: [{
                name: 'Производественный',
                data:  prod_counts

                }, {
                    name: 'Управленческий',
                    data: mamnger_counts
            }]
        })
    },
    drilldown:function(){
        var chart = empl_logic.salary_structure_chart;
        empl_logic.empl_count_info =  months_empl_count[this.textContent];
        chart.xAxis[0].setCategories(drilldown_data[this.textContent].categories, false);
        chart.xAxis[0].options.labels.rotation = -65;
        //chart.xAxis[0].options.labels.formatter = formatterFunction;
        chart.series[0].setData(drilldown_data[this.textContent].data[0].data, false )
        chart.series[1].setData(drilldown_data[this.textContent].data[1].data, false )
        chart.series[2].setData(drilldown_data[this.textContent].data[2].data, false )
        //chart.series[2].hide();
        chart.series[3].setData(drilldown_data[this.textContent].data[3].data, true )
        chart.renderer.button('Назад',
            200,
            10,
            empl_logic.returnYearChart).add();
        //chart.series[2].show();
    },
    returnYearChart: function(){
        setTimeout(function(){
            empl_logic.empl_count_info =  empl_counts;
            empl_logic.createSalaryStructureChart();
        }, 100);

    }
}