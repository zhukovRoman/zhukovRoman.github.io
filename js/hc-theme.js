Highcharts.kpugs = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
        '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: 'rgba(0,0,0,0)'
    },
    title: {
        style: {
            fontSize:'30px',
            color: 'rgb(135,150,164)'
        }
    },
    subtitle: {
        style: {
            color: '#666666',
            font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
        }
    },
    xAxis:{
        labels:{
            style:{
                fontSize: '22px',
                color: 'rgb(135,150,164)'
            }
        }
    },
    yAxis:{
       title:{
           style:{
               fontSize:'24px',
               color: 'rgb(135,150,164)'
           }
       },
        labels:{
            style: {
                fontSize: '22px',
                color: 'rgb(135,150,164)',
                font: '22px PT Sans, sans-serif'
            }
        }
    } ,
    legend: {
        //itemWidth: 80,
        symbolHeight: 20,
        symbolWidth:20,
        symbolRadius: 10,
        lineHeight: 22,
        itemMarginTop: 5,
        itemMarginBottom: 5,
        itemStyle: {
            fontSize: '22px',
            color: 'rgb(135,150,164)'
        },
        itemHoverStyle:{
            color: 'gray'
        }
    },
    tooltip:{
        style:{
            color: 'gray',
            font: '20px PT Sans, sans-serif',
            fontSize: '20px'
        }
    }
};

Highcharts.setOptions(Highcharts.kpugs);