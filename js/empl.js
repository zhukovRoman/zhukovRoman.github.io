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

        $('#empl-charts-tabs, #empl-charts-tabs2').removeClass('tabs-active');
        $(this).parents('fieldset').addClass('tabs-active')

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
                   formatter: function () {return this.value.length < 40 ? this.value : this.value.substring(0,40)+"...";},
                   style:{
                       border: '3px solid #65afc1',
                           borderRadius: '10px',
                           padding: '5px 10px'
                   },
                   useHTML: true
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
               title:{text:'Средняя зарплата', align: 'middle'},
               opposite: true,
               labels: {
                   formatter: function() {
                       return thousands_sep(this.value / 1000) +' тыс ₽';
                   }
               }
           }],

           tooltip: {
               formatter: function() {
                   var result = generateTooltipHeader(this.x)
                   $.each(this.points, function(i, datum) {
                       result += generateTooltipLine (datum.series.name, thousands_sep(datum.y) + ' ₽',datum.point.series.color);
                   });
                   result += generateTooltipLine('Всего сотрудников', empl_logic.empl_count_info[this.points[0].point.index],'', true)

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
        $('#salary_structure_chart .highcharts-xaxis-labels span').click(empl_logic.drilldown)
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
                    formatter: function () {
                        console.log(this.value)
                        return this.value.length < 40 ? this.value : this.value.substring(0,40)+"...";}
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
                    var result = generateTooltipHeader(this.x)
                    $.each(this.points, function(i, datum) {
                        result += generateTooltipLine (datum.series.name, datum.y + ' человек',datum.point.series.color);
                    });
                    result += generateTooltipLine('Руководитель', this.points[0].point.manager,'', true)

                    return result;
                },
                shared: true,
                useHTML: true
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
                color: '#3598db'
            },{
                name: 'Сотрудников',
                data: deps_infos['employee_count'] ,
                color: '#34495e'

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
                    text: 'Человек'
                    //align: 'middle'

                }
            }, { // Secondary yAxis
                title: {
                    text: 'Человек',
                    align: 'middle'

                },
                labels: {
                    format: '{value}'
                },
                opposite: true,
                tickInterval: 1
            }],
            //labels: {
            //    items: []
            //},
            tooltip: {
                shared: true,
                useHTML: true,
                formatter: function() {
                    var result = generateTooltipHeader(this.x)
                    $.each(this.points, function(i, datum) {
                        result += generateTooltipLine (datum.series.name, datum.y  ,datum.point.series.color);
                    });


                    return result;
                }
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
                shared: true,
                useHTML: true,
                formatter: function() {
                    var result = generateTooltipHeader(this.x)
                    $.each(this.points, function(i, datum) {
                        result += generateTooltipLine (datum.series.name, datum.y +'%' ,datum.point.series.color);
                    });
                    return result;
                }

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
                    title:{text:'Средняя зарплата', align: 'middle'},
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
            tooltip: {
                formatter: function() {

                    var result = generateTooltipHeader(this.x)
                    $.each(this.points, function(i, datum) {
                        result += generateTooltipLine (datum.series.name, thousands_sep(datum.y) + datum.series.tooltipOptions.valueSuffix ,datum.point.series.color);
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
                            //textShadow: '0 0 3px black, 0 0 3px black'
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
                useHTML: true,
                formatter: function() {

                    var result = generateTooltipHeader(this.x)
                    $.each(this.points, function(i, datum) {
                        result += generateTooltipLine (datum.series.name, datum.y + ' ('+datum.percentage.toFixed(0)+'%)',datum.point.series.color);
                    });
                    return result;
                },
                pointFormat: '{series.name}: <b>{point.y} ({point.percentage:.0f}%)</b><br/>',
                valueSuffix: ' человек '
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
                    stacking: 'percent',
                    dataLabels: {
                        enabled: true,
                        color:  'white'
//                        style: {
//                            textShadow: '0 0 3px black, 0 0 3px black'
//                        }
                    }
                }
            },
            series: [{
                name: 'Производственный',
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

        chart.xAxis[0].update({labels:{
            useHTML: false,
            style:{
                border: '0px solid rgb(135,150,164)'
            }
        }
        }, false);
        chart.xAxis[0].options.labels.rotation = -65;
        //chart.xAxis[0].options.labels.formatter = formatterFunction;
        chart.series[0].setData(drilldown_data[this.textContent].data[0].data, false )
        chart.series[1].setData(drilldown_data[this.textContent].data[1].data, false )
        chart.series[2].setData(drilldown_data[this.textContent].data[2].data, false )
        //chart.series[2].hide();
        chart.series[3].setData(drilldown_data[this.textContent].data[3].data, true )

        chart.renderer.image('images/back-btn.png',160,0,137,52)
            .add().on('click',empl_logic.returnYearChart);

    },
    returnYearChart: function(){
        setTimeout(function(){
            empl_logic.empl_count_info =  empl_counts;
            empl_logic.createSalaryStructureChart();
        }, 100);

    }
}