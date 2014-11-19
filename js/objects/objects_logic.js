var objects_logic = {
    showMap: function(){
        $("#charts-content").hide();
        $("#list-content").hide();
        $("#list-overdue-content").hide();

        $("#map-content").show();
        $.each($("#filter button"), function (i,b){
          $(b).removeClass('ui-btn-b')
        })
        $("#map-button").addClass('ui-btn-b')
    },
    showCharts: function(){
        $("#map-content").hide();
        $("#list-content").hide();
        $("#list-overdue-content").hide();

        $("#charts-content").show();
        charts.init(filter);
        $.each($("#filter button"), function (i,b){
            $(b).removeClass('ui-btn-b')
        })
        $("#chart-button").addClass('ui-btn-b')
    },
    showList: function(){
        $("#charts-content").hide();
        $("#map-content").hide();
        $("#list-overdue-content").hide();

        $("#list-content").show();
        $.each($("#filter button"), function (i,b){
            $(b).removeClass('ui-btn-b');
        });
        $("#list-button").addClass('ui-btn-b');
        objects_logic.bindObjectsList();

    },
    bindObjectsList:function(){
        var $ul = $("#objects-list")
        var html = ''
        $.each (filter.filtered_objects, function(i,val){
            html+='<li>' +
                '<a href="object_view.html?id='+val.id+'">'+
                    '<span class="objects-list-column">'+  val.okrug +"</span>" +
                    '<span class="objects-list-column">'+  val.adress +"</span>" +
                    '<span class="objects-list-column">'+  val.appointment +"</span>" +
                    '<span class="objects-list-column">'+  val.year +"</span>" +
                '</a>' +
            '</li>'
        })
        $ul.html(html)
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");
    },
    bindOverdueObjects: function(){

        var document = filter.getCurrentDocument();
        var overdues_objects = [];
        $.each(filter.filtered_objects, function(i,val){
            if (val[document]=='Просрочено')
                overdues_objects.push(val);
        });

        var $ul = $("#ovedue-objects-list")
        var html = ''
        $.each (overdues_objects, function(i,val){

            html+='<li>' +
                '<a href="object_view.html?id='+val.id+'">'+
                    '<span class="overdue-objects-list-column">'+  val.okrug +', '+val.adress+"</span>" +
                    '<span class="overdue-objects-list-column">'+  val.appointment +"</span>" +
                    '<span class="overdue-objects-list-column">'+  val.plansDates[document] +"</span>" +
                '</a>' +
            '</li>'
        })
        $ul.html(html)
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");
    } ,

    showOverdues: function(){
        $("#charts-content").hide();
        $("#list-overdue-content").show();

        $("#charts h1.ui-title").before('<a href="#" class="ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-carat-l">Назад</a>')
        $("#charts div.ui-header a.ui-btn").click(objects_logic.returnFromOverdue)
        objects_logic.bindOverdueObjects();

    },
    returnFromOverdue:function(){
          objects_logic.showCharts();
        $("#charts div.ui-header a.ui-btn").remove()
    }
}