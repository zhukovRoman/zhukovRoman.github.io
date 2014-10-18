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
            html+='<li><a href="#">'+
                '<h1>'+val.adress+'</h1>'+
                '<p>'+val.okrug+'</p>'+
                '</a></li>'
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
            html+='<li><a href="#">'+
                '<h1>'+val.adress+'</h1>'+
                '<p>'+val.plansDates[document]+'</p>'+
                '</a></li>'
        })
        $ul.html(html)
        $ul.listview( "refresh" );
        $ul.trigger( "updatelayout");
    } ,

    showOverdues: function(){
        $("#charts-content").hide();
        $("#list-overdue-content").show();

        $("#charts h1.ui-title").before('<a href="#" class="ui-btn-left ui-btn ui-btn-inline ui-mini ui-corner-all ui-btn-icon-left ui-icon-arrow-l">Назад</a>')
        $("#charts div.ui-header a.ui-btn").click(objects_logic.returnFromOverdue)
        objects_logic.bindOverdueObjects();

    },
    returnFromOverdue:function(){
          objects_logic.showCharts();
        $("#charts div.ui-header a.ui-btn").remove()
    }
}