var objects_logic = {
    showMap: function(){
        $("#charts-content").hide();
        $("#list-content").hide();

        $("#map-content").show();
        $.each($("#filter button"), function (i,b){
          $(b).removeClass('ui-btn-b')
        })
        $("#map-button").addClass('ui-btn-b')
    },
    showCharts: function(){
        $("#map-content").hide();
        $("#list-content").hide();

        $("#charts-content").show();
        $.each($("#filter button"), function (i,b){
            $(b).removeClass('ui-btn-b')
        })
        $("#chart-button").addClass('ui-btn-b')
    },
    showList: function(){
        $("#charts-content").hide();
        $("#map-content").hide();

        $("#list-content").show();
        $.each($("#filter button"), function (i,b){
            $(b).removeClass('ui-btn-b')
        })
        $("#list-button").addClass('ui-btn-b')
    }
}