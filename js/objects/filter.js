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
        var objects = this.filtered_objects
        $.each(data['objects'], function(i, val){
            objects.push(val);
        })
    },
    insertYearsIntoFilter: function(){
        var container = $(this.id+" div.years")
        $.each(this.years, function(i, year){
            var html = '<input type="checkbox" data-role="none" data-value="'+year+'" checked id="y'+i+'"> <label for="y'+i+'">'+year+'</label>'
            container.append(html);
        })
    },
    insertDistinctsIntoFilter: function(){
        var container = $(this.id+" div.distincts")
        $.each(this.distincts, function(i, dist){
            var html = '<input type="checkbox" data-role="none" data-value="'+dist.ObjectRegionName+'" checked id="d'+i+'"> <label for="d'+i+'">'+dist.ObjectRegionName+'</label>'
            container.append(html);
        })
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
        $.each(objects, function(i, obj){
            if ($.inArray(obj.year, filter.getYearsFilter() )!=-1 &&
                $.inArray(obj.okrug, filter.getDistinctFilter())!= -1 &&
                $.inArray(obj.appointment, filter.getAppointmetFilter()) != -1)
            {
                filter.filtered_objects.push(obj);
            }
        })
    }


}