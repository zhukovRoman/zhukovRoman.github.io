var organizations_logic = {
    _id: null,
    current_organization: null,
    initList: function(){
        var $ul = $("#org_list")
        var html = ''
        $.each (organizations, function(i,val){
            html+='<li><a href="org_view.html?id='+val.id+'">'+
                '<span class="org_list_column">'+val.name+'</span>'+
                '<span class="org_list_column">'+val.objects.length+'</span>'+
                '<span class="org_list_column">'+val.tenders.length+'</span>'+
                '</a></li>'
            //console.log(val);
        })
        $ul.html(html)
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");


    },
    changeTab: function(){
        $('#common_and_finance_info').hide();
        $('#tenders_table').hide();
        $('#objects_table').hide();
        var id = $(this).attr('data-tab');
        $('#'+id).show();
    },
    initOrganization: function (data) {
        var parameters = data.split("?")[1];
        var id = parameters.replace("id=","");
        this._id = id;
        console.log(this._id);
        $.each(organizations, function(i,val){
            if (organizations_logic._id==val.id){
                organizations_logic.current_organization = val;
            }
        })
        if (this.current_organization==null) return;
        this.fillAdressAndName();
        this.fillPartsInTenders();
        this.fillFinChart();
        this.fillWorkChart();
        this.fillTendersTable();
        this.fillObjectsTable();
        $('#organization_tabs input').change(this.changeTab)



    },
    fillAdressAndName: function(){
        $("#organization-name").html(this.current_organization['name'])
        $("#org_phone").html(this.current_organization['phone'])
        $("#org_email").html(this.current_organization['email'])
        $("#org_director").html(this.current_organization['FIO'])
        $("#org_address").html(this.current_organization['address'])
        $("#tenders_count").html(organizations_logic.current_organization.tenders.length)
        $("#objects_count").html(organizations_logic.current_organization.objects.length)
    },
    fillPartsInTenders: function(){

        var years = [];
        var counts = [];
        var sums = [];
        $.each(organizations_logic.current_organization.tenders_parts.current, function(year, parts){
            years.push(year);
            counts.push(parts.count);
            sums.push(parts.sum)
        })

        var fin_chart = new Highcharts.Chart({
            credits: {
                enabled: false
            },
            chart: {
                renderTo: 'parts-chart',
                type: 'bar'
            },
            title: {
                text: 'Доля в конкурсах'
            },
            xAxis: {
                categories: years
            },
            yAxis: [{
                min: 0,
                title: {
                    text: 'Доля в объектах',
                    style: {
                        fontSize: '24px',
                        color: 'rgb(135,150,164)',
                        font: '22px PT Sans, sans-serif'
                    }
                } ,
                allowDecimals: false,
                minTickInterval: 1,
                lineWidth: 3,
                lineColor: '#65afc1'
            },
            {
                min: 0,
                opposite: true,
                title: {
                    text:  'Доля в финансах (млрд ₽)',
                    style: {
                        fontSize: '24px',
                        color: 'rgb(135,150,164)',
                        font: '22px PT Sans, sans-serif'
                    }
                },
                labels: {
                    formatter: function() {
                        return (this.value / 1000000000).toFixed(1) ;
                    }
                }
                //minTickInterval: 1000000000
            }],
            legend: {
                reversed: true
            },
            tooltip:{
                enabled: true,
                shared: true,
                useHTML: true,
                formatter: function(){
                    var result = generateTooltipHeader("Доля в "+this.x+" году")
                    $.each(this.points, function(i, datum) {
                        var text = '';
                        if (this.series.name == 'Доля в объектах')
                             text = this.y + ' из '+ organizations_logic.current_organization.tenders_parts.all[this.x]['count'] +
                                 ' ('+(this.y*100/organizations_logic.current_organization.tenders_parts.all[this.x]['count']).toFixed(2) + '%)'

                        if (this.series.name == 'Доля в финансах')
                            text =  thousands_sep((this.y/1000000).toFixed(0)) + ' из '+ thousands_sep((organizations_logic.current_organization.tenders_parts.all[this.x]['sum']/1000000).toFixed(0)) + ' млрд'+
                                ' ('+(this.y*100/organizations_logic.current_organization.tenders_parts.all[this.x]['sum']).toFixed(2) + '%)'

                            result += generateTooltipLine (datum.series.name, text ,datum.point.series.color);
                    });
                    return result;
                }
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    dataLabels: {
                        enabled: true,
                        color: 'white',
                        style:{
                            fontSize: '20px'
                        },

                        formatter: function(){
                            var width = this.point.shapeArgs.height
                            if(width<100) return
                            if (this.series.name == 'Доля в объектах')
                            return this.y + ' из '+ organizations_logic.current_organization.tenders_parts.all[this.x]['count'] +
                                ((width>=170) ? ' ('+(this.y*100/organizations_logic.current_organization.tenders_parts.all[this.x]['count']).toFixed(2) + '%)' : '')

                            if (this.series.name == 'Доля в финансах')
                                return thousands_sep((this.y/1000000).toFixed(0)) + ' из '+ thousands_sep((organizations_logic.current_organization.tenders_parts.all[this.x]['sum']/1000000).toFixed(0)) +
                                    ( (width>=300)?' ('+(this.y*100/organizations_logic.current_organization.tenders_parts.all[this.x]['sum']).toFixed(2) + '%)': '')
                        }
                    }
                }

            },
            series: [{
                name: 'Доля в объектах',
                stack: 'obj',
                data: counts
            }, {
                name: 'Доля в финансах',
                stack: 'fin',
                data: sums ,
                yAxis: 1
            }]
        });

        //var parts_table = document.getElementById('body_table_parts');
        //$(parts_table).html('');
        //$.each(organizations_logic.current_organization.tenders_parts.current, function(year, parts){
        //    var row = document.createElement('tr');
        //    var count = parts['count']
        //    var allCount = organizations_logic.current_organization.tenders_parts.all[year]['count'];
        //
        //    var sum = parts['sum']/1000000;
        //    var allSumm = organizations_logic.current_organization.tenders_parts.all[year]['sum']/1000000;
        //
        //    row.innerHTML = "<td>"+year+"</td>"+
        //        "<td>"+count+" из "+allCount+ " ("+ (count*100/allCount).toFixed(2) +"%)</td>"+
        //        "<td>"+thousands_sep(sum.toFixed(3))+" из "+thousands_sep(allSumm.toFixed(3))+ " ("+ (sum*100/allSumm).toFixed(2) +"%)</td>";
        //    parts_table.appendChild(row);
        //})
    },
    fillFinChart: function(){
        var c_org =  organizations_logic.current_organization;
        var fin_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                renderTo:'fin_chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title: {
                text: 'Оплаты по контрагенту',
                style: {
                    "fontSize": "20pt"
                }
            },
            tooltip: {
                enabled: false,
                formatter: function () {
                    var s ="";
                    $.each(this.series.points, function (i, point) {
                        s += "<b>"+point.name + '</b> ' + million_to_text(point.y)+ '<br/>';
                    });
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
                y: 580,
                useHTML: true,
                itemStyle: { "color": "#8d9296", "fontSize": "18pt", "fontWeight": "normal", "white-space": "normal" },
                labelFormatter: function () {
                    return '<div style="width: 500px;">' +
                        '<div class = "legend-series-name" style="float: left; width: 270px; white-space: normal">'+this.name+'</div>' +
                        '<div style="text-align: right; float: right; width: 230px"> '+ million_to_text(this.y) +'</div></div>';
                }
                //layout: 'vertical',
                //backgroundColor: '#FFFFFF',
                //align: 'left',
                //verticalAlign: 'top',
                //floating: true,
                //x: 30,
                //y: 600,
                //useHTML: true,
                //itemStyle: { "color": "#333333", "fontSize": "18pt", "fontWeight": "bold", "white-space": "normal" },
                //labelFormatter: function () {
                //    console.log(this.y)
                //    return '<div style="width: 500px;border-bottom: 1px solid;display: block"><div class = "legend-series-name" style="float: left; width: 300px; white-space: normal">'+this.name+'</div>' +
                //        '<div style="text-align: right; float: right; width: 200px"> '+ thousands_sep((this.y/1000000).toFixed(0)) +' млн ₽ </div></div>';
                //}
            },
            plotOptions: {
                pie: {
                    center: ['50%', '32%'],
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
                size: 450,
                data: [
                    ['Остаток оплаты', c_org.payed_left],
                    ['Авансов выдано и не погашено', c_org.avans_ne_pogasheno],
                    ['Аванасов выдано и погашено', c_org.avans_pogasheno],
                    ['Оплачено не в счет авансов', c_org.payed]

                ]
            }]


        });
    },
    fillWorkChart: function(){
        var c_org =  organizations_logic.current_organization;
        var work_chart = new Highcharts.Chart({
            credits:  {
                enabled: false
            },
            chart: {
                renderTo:'work_chart',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'bar',
                marginTop: -50
            },
            title: {
                text: 'Выполнение работ по произведенным оплатам',
                margin:20,
                floating: true,
                y: 20
            },
            xAxis: {
                lineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            yAxis: {
                title:{
                    text: null
                },
                gridLineWidth: 0,
                labels: {
                    enabled: false
                }
            },
            tooltip: {
                enabled: false

            },
//            tooltip: {
//                formatter: function () {
//                    var s ="";
//                    $.each(this.series.points, function (i, point) {
//                        s += "<b>"+point.name + '</b> ' + thousands_sep(point.y) + ' млн ₽ <br/>';
//                    });
//                    return s;
//                },
//                shared: true,
//                useHTML: true
//            },
            plotOptions: {
                series: {
                    stacking: 'percent',
                    pointWidth: 50
                }
            },
            legend:{
                reversed: true,
                align: 'left',
                useHTML: true,
                floating: true,
                layout: 'horizontal',
                itemStyle: { "color": "#91a0ab",
                    "fontSize": "26px",
                    //"fontWeight": "bold",
                    "white-space": "normal"
                    //font: '18pt Helvetica, Arial, sans-serif'
                },
                labelFormatter: function () {
                    //console.log(this)
                    return '<div class = "legend-series-name" style="float: left; width: 500px; white-space: normal; ">'+this.name +
                        ' <span id="work-chart-values'+this._i+'"> '+ million_to_text((this.userOptions.data[0])) +'</span> </div>';
                }
            },
            series: [
                {name: 'Выполнено работ', data: [c_org.work_complete]},
                {name: 'Остаток выполнения', data:[c_org.work_left]}
            ]



        });
    },
    fillTendersTable: function(){
        var tenders_table = $('#body_table_tenders');
        $(tenders_table).html('');
        var html = '' ;
        $.each(organizations_logic.current_organization.tenders, function(i, val){

            date = new Date(val.DataFinish);

            html += '<div class="organizations-tenders-list-row">'+
                    '<span class="organizations-tenders-list-column">'+val.TenderSName+'</span>' +
                    '<span class="organizations-tenders-list-column">'+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+'</span>' +
                    '<span class="organizations-tenders-list-column">'+thousands_sep((val.TenderPriceBegin||0))+' ₽</span>' +
                    '<span class="organizations-tenders-list-column">'+thousands_sep((val.TenderPriceEnd||0).toFixed(0))+' ₽</span>' +
                    '<span class="organizations-tenders-list-column">'+(val.TenderProcentDecline||0).toFixed(2)+'</span>' +
                    '<span class="organizations-tenders-list-column">'+val.TenderQtyPresent+"/"+val.TenderQtyAccept+'</span>' +'</div>'

        })


        tenders_table.html(html);
    } ,
    compare_objects_by_year: function(a,b) {
        if (a.year < b.year)
            return -1;
        if (a.year > b.year)
            return 1;
        return 0;
    },
    get_url_for_object_view: function (id, adr){
        return "<a href='object_view.html?id="+id+"' >"+adr+"</a>"
    },
    fillObjectsTable: function(){

        var $ul = $("#organization-objects-table-body")

        var html = ''
       // num = 0;
        var objects = organizations_logic.current_organization.objects.sort(this.compare_objects_by_year)
        $.each(objects, function(i, val){

            html+='<li>' +
            '<a href="object_view.html?id='+val.id+'">'+
                '<span class="organizations-objects-table-column">'+ (i+1)+"</span>" +
                '<span class="organizations-objects-table-column">'+  val.region +"</span>" +
                '<span class="organizations-objects-table-column">'+  val.year +"</span>" +
                '<span class="organizations-objects-table-column">'+  val.address +"</span>" +
                '<span class="organizations-objects-table-column">'+  val.status +"</span>" +
                '<span class="organizations-objects-table-column">'+  thousands_sep(val.contract_sum) +" ₽</span>" +
                '<span class="organizations-objects-table-column">'+
                    '<span class="organizations-objects-table-subcolumn">'+val.network+'/<br>'+val.network_delay+'</span>'+
                    '<span class="organizations-objects-table-subcolumn">'+val.constructive+'/<br>'+val.constructive_delay+'</span>'+
                    '<span class="organizations-objects-table-subcolumn">'+val.internal+'/<br>'+val.internal_delay+'</span>'+
                "</span>" +

            '</a></li>'
        })
        $ul.html(html)
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");

    }
}