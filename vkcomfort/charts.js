$(function () {
    
    var data = [
        [6899,3200,2205,4503,3118,6840],
        [5291,2519,2410,9166,3035,2192],
        [2726,3507,5912,8383,1585,9077],
        [5653,3832,2344,4787,1992,9295],
        [6358,8714,6569,1998,1686,7231],
        [2802,4728,8921,1756,9806,1087],
        [5273,3200,7721,2498,6799,3801],
        [9708,2097,2096,5064,3481,2130]
    ]
    $('#chart').highcharts({
        chart: {
            type: 'column'
        },
        credits:{
            enabled: false
        },
        title: {
            text: 'Анализ суммы задолженности на 31.03.15'
        },
        xAxis: {
            categories: [
                'до 1 месяца',
                '1-2 месяца',
                '2-3 месяца',
                '3-6 месяцев',
                '6-12 месяцев',
                'более 12 месяцев'
            ],
            crosshair: true
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Сумма ДЗ'
            }
        },
        tooltip: {
            useHTML: true,
            shared: true,
            formatter: function(){
                console.log(this.points)
                var res = "<span style='font-size: 12px'>Период задолженности - "+this.points[0].point.category+"</span><br>";
                var summ = 0;
                $.each(this.points, function(i, point){
                    summ += point.y;
                    res+= "<span style='color: "+point.series.color+"'>"+point.series.name+"</span> : <span style='font-weight: bold'>"+point.y+" ₽</span><br>"
                })
                return res+"<br>Всего на сумму: " + summ.toFixed() +" ₽";
            }
        },
        legend:{
            layout:'vertical',
            floating: false,
            useHTML: true,
            //left: 0,
            //align: 'left',
            labelFormatter: function(){
                console.log(this)
                var sum = 0;
                $.each(this.yData, function(i,val){
                    sum += val;
                });

                return  "<span>"+this.name+". Общая сумма долга для этой категории: "+sum +" ₽";
            }
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: [{
            name: 'до 500 ₽',
            data: data[0]

        }, {
            name: '500-1000 ₽',
            data: data[1]

        }, {
            name: '1000-3000 ₽',
            data: data[2]

        }, {
            name: '3000-8000 ₽',
            data: data[3]

        },{
            name: '8000-15000 ₽',
            data: data[4]

        },{
            name: '15000-25000 ₽',
            data: data[5]

        },{
            name: '25000-40000 ₽',
            data: data[6]

        },{
            name: 'свыше 40000 ₽',
            data: data[7]

        }]
    });
});


$(function () {
    var data = [
        [-39,26,-90,-42],
        [-76,48,44,-46],
        [72,-38,90,62],
        [20,-98,-53,78],
        [54,-80,16,55],
        [-7,56,18,-46],
        [8,43,71,-97],
        [-62,-88,80,-71]
    ]
    function setData (index){
        var res = [];
        $.each(data[index], function (i,val){
            res.push({y:val, color: (val<=0) ? '#90ed7d' : '#f15c80'})
        })
        return res;
    }
    $('#chart2').highcharts({
        chart: {
            type: 'column'
        },
        title: {
            text: 'Изменение суммы задолженности по отношению к 28.02.15'
        },
        xAxis: {
            categories: [
                '2-3 месяца',
                '3-6 месяцев',
                '6-12 месяцев',
                'более 12 месяцев'
            ]
        },
        yAxis: {

            title: {
                text: 'Изменение суммы ДЗ'
            }
        },
        legend:{
            layout:'vertical',
            floating: false,
            useHTML: true,
            //left: 0,
            //align: 'left',
            labelFormatter: function(){
                console.log(this)
                var sum = 0;
                $.each(this.yData, function(i,val){
                    sum += val;
                });

                return  "<span>"+this.name+". Общая сумма долга для этой категории: "+sum +" ₽";
            }
        },
        credits: {
            enabled: false
        },
        tooltip: {
            useHTML: true,
            shared: true,
            formatter: function(){
                console.log(this.points)
                var res = "<span style='font-size: 12px'>Период задолженности - "+this.points[0].point.category+"</span><br>";
                var summ = 0;
                $.each(this.points, function(i, point){
                    summ += point.y;
                    res+= "<span style='color: "+point.series.color+"'>"+point.series.name+"</span> : <span style='font-weight: bold'>"+point.y+" ₽</span><br>"
                })
                return res+"<br>Всего на сумму: " + summ.toFixed() +" ₽";
            }
        },
        series: [{
            name: 'до 500 ₽',
            data: setData(0)

        }, {
            name: '500-1000 ₽',
            data: setData(1)

        }, {
            name: '1000-3000 ₽',
            data: setData(2)

        }, {
            name: '3000-8000 ₽',
            data: setData(3)

        },{
            name: '8000-15000 ₽',
            data: setData(4)

        },{
            name: '15000-25000 ₽',
            data: setData(5)

        },{
            name: '25000-40000 ₽',
            data: setData(6)

        },{
            name: 'свыше 40000 ₽',
            data: setData(7)

        }]
    });
});