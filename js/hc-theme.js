Highcharts.kpugs = {
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
        '#FF9655', '#FFF263', '#6AF9C4'],
    colors: ['#7bc5d7', '#273e43', '#84d77b', '#ef9338', '#7d7bd7', '#d77bcf',
        '#dace4b', '#FFF263', '#6AF9C4'],
    chart: {
        backgroundColor: 'rgba(0,0,0,0)'
    },
    title: {
        style: {
            fontSize:'30px',
            color: 'rgb(135,150,164)'
        }
    },
    xAxis:{
        labels:{
            style:{
                fontSize: '22px',
                color: 'rgb(135,150,164)'
            }
        },
        title: {
            style: {
                fontSize: '24px',
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
            fontSize: '26px',
            color: 'rgb(135,150,164)',
            font: '26px PT Sans, sans-serif'
        },
        itemHoverStyle:{
            color: 'gray'
        },
        backgroundColor: 'rgba(0,0,0,0)',
        useHTML: true
    },
    tooltip:{
        style:{
            color: 'gray',
            fontFamily: 'PT Sans, sans-serif',
            fontSize: '28px'
        }
    },
    plotOptions:{
        column:{
            borderWidth: '0',
            dataLabeles:{
                style: {
                    color: 'rgb(146,144,144)',
                    fontSize: '20px',
                    font: '20px PT Sans, sans-serif'
                }
            }
        }


    }
};

Highcharts.setOptions(Highcharts.kpugs);