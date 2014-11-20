var filter = {
    el: null,
    id: null,
    years:  window.enter_years,
    distincts: window.distincts,
    filtered_objects: [],
    init: function(id){
        this.id = '#'+id;
        this.el = $("#id");
        this.insertYearsIntoFilter();
        this.insertDistinctsIntoFilter();
        //var objects = this.filtered_objects
        //$.each(data['objects'], function(i, val){
        //    objects.push(val);
        //})
    },
    insertYearsIntoFilter: function(){
        var container = $(this.id+" div.years")
        var count = 0;
        var html = '<div class="filter-items columns5 years-filter ">'
        $.each(this.years, function(i, year){
            if (count++ % 5 == 0  ){
                html += '</div><div class="filter-items columns5 years-filter ">'
            }
            var label = (year.length==4) ? year.substring(2,4) : year
            html += '<input type="checkbox" data-role="none" data-value="'+year+'" checked id="y'+i+'"> <label for="y'+i+'">'+label+'</label>'

        })
        container.append(html+'</div>');
    },
    insertDistinctsIntoFilter: function(){
        var container = $(this.id+" div.distincts")
        var count = 0;
        var html = '<div class="filter-items columns4 distincts-filter distincts">'
        $.each(this.distincts, function(i, dist){

            if (count++ % 4 == 0  ){
                 html += '</div><div class="filter-items columns4 distincts-filter distincts">'
            }

            html += '<input type="checkbox" data-role="none" data-value="'+dist.ObjectRegionName+'" checked id="d'+i+'"> <label for="d'+i+'">'+dist.ObjectRegionName+'</label>'

        })
        container.append(html+'</div>');
    },
    getYearsFilter: function(){
        var res = []
        $.each($(this.id+" div.years input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        return res;
    },
    getDistinctFilter: function(){
        var res = []
        $.each($(this.id+" div.distincts input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        return res;
    },
    getAppointmetFilter: function(){
        var res = []
        $.each($(this.id+" div.appointments input:checked"), function(i,val){
            res.push($(val).attr('data-value'))
        })
        return res;
    },
    getCurrentDocument: function(){
         return $('#documents-filter input:checked').attr('data-value');
    },
    getCurrentDocumentTitle: function(){
        return $('#documents-filter input:checked').attr('data-title');
    },
    filter_objects: function(){
        var objects = data['objects'];
        filter.filtered_objects.length=0;
        var years =  filter.getYearsFilter();
        var distincts = filter.getDistinctFilter();
        var appointments = filter.getAppointmetFilter();
        $.each(objects, function(i, obj){
            if ($.inArray(obj.year, years )!=-1 &&
                $.inArray(obj.okrug, distincts)!= -1 &&
                $.inArray(obj.appointment,appointments ) != -1)
            {
                filter.filtered_objects.push(obj);
            }
        })
    }


}