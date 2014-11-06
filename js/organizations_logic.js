var organizations_logic = {
    _id: null,
    current_organization: null,
    initList: function(){
        var $ul = $("#org_list")
        var html = ''
        $.each (organizations, function(i,val){
            html+='<li><a href="org_view.html?id='+val.id+'">'+
                '<h1>'+val.name+'</h1>'+
                '</a></li>'
            console.log(val);
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
        var parts_table = document.getElementById('body_table_parts');
        $(parts_table).html('');
        $.each(organizations_logic.current_organization.tenders_parts.current, function(year, parts){
            var row = document.createElement('tr');
            var count = parts['count']
            var allCount = organizations_logic.current_organization.tenders_parts.all[year]['count'];

            var sum = parts['sum']/1000000;
            var allSumm = organizations_logic.current_organization.tenders_parts.all[year]['sum']/1000000;

            row.innerHTML = "<td>"+year+"</td>"+
                "<td>"+count+" из "+allCount+ " ("+ (count*100/allCount).toFixed(2) +"%)</td>"+
                "<td>"+thousands_sep(sum.toFixed(3))+" из "+thousands_sep(allSumm.toFixed(3))+ " ("+ (sum*100/allSumm).toFixed(2) +"%)</td>";
            parts_table.appendChild(row);
        })
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
                text: 'Оплаты по контрагенту'
            },
            tooltip: {
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
                y: 600,
                useHTML: true,
                itemStyle: { "color": "#333333", "fontSize": "18pt", "fontWeight": "bold", "white-space": "normal" },
                labelFormatter: function () {
                    console.log(this.y)
                    return '<div style="width: 500px;border-bottom: 1px solid;display: block"><div class = "legend-series-name" style="float: left; width: 300px; white-space: normal">'+this.name+'</div>' +
                        '<div style="text-align: right; float: right; width: 200px"> '+ thousands_sep((this.y/1000000).toFixed(0)) +' млн ₽ </div></div>';
                }
            },
            plotOptions: {
                pie: {
                    center: ['50%', '32%'],
                    dataLabels: {
                        enabled: false
                    },
                    showInLegend: true,
                    size: 300
                }
            },
            series: [{
                type: 'pie',
                name: 'Сумма',
                innerSize: '50%',
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
                type: 'bar'
            },
            title: {
                text: 'Выполнение работ по произведенным оплатам'
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
                    stacking: 'percent'
                }
            },
            legend:{
                align: 'left',
                useHTML: true,
                floating: true,
                layout: 'horizontal',
                itemStyle: { "color": "#333333", "fontSize": "18pt", "fontWeight": "bold", "white-space": "normal" },
                labelFormatter: function () {

                    return '<div class = "legend-series-name" style="float: left; width: 500px; white-space: normal">'+this.name +
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
        var tenders_table = document.getElementById('body_table_tenders');
        $(tenders_table).html('');
        $.each(organizations_logic.current_organization.tenders, function(i, val){
            var row = document.createElement('tr');
            date = new Date(val.DataFinish);
            row.innerHTML = "<td>"+val.TenderSName+"</td>"+
                "<td>"+date.getDate()+"-"+date.getMonth()+"-"+date.getFullYear()+"</td>"+
                "<td>"+thousands_sep((val.TenderPriceBegin||0))+" ₽</td>"+
                "<td>"+thousands_sep((val.TenderPriceEnd||0).toFixed(0))+" ₽</td>"+
                "<td>"+(val.TenderProcentDecline||0).toFixed(2)+"</td>"+
                "<td>"+val.TenderQtyPresent+"/"+val.TenderQtyAccept+"</td>";
            tenders_table.appendChild(row);
        })
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
        var table = document.getElementById('body_table');
        $(table).html('');
       // num = 0;
        var objects = organizations_logic.current_organization.objects.sort(this.compare_objects_by_year)
        $.each(objects, function(i, val){
            var row = document.createElement('tr');
            if (val.internal_delay!=0 || val.constructive_delay!=0 || val.network_delay!=0)
                $(row).addClass('danger');
            row.innerHTML = "<td>"+(i+1)+"</td><td>"+val.region+"</td>"+
                "<td>"+val.year+"</td>"+
                //"<td>"+organizations_logic.get_url_for_object_view(val.id, val.address)+"</td>"+
                "<td>"+val.address+"</td>"+
                "<td>"+val.status+"</td>"+
                "<td>"+thousands_sep(val.contract_sum)+" ₽</td>"+
                "<td>"+val.network+'/'+val.network_delay+"</td>"+
                "<td>"+val.constructive+'/'+val.constructive_delay+"</td>"+
                "<td>"+val.internal+'/'+val.internal_delay+"</td>";
            table.appendChild(row);
        })
    }
}