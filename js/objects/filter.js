var filter = {
    el: null,
    id: null,
    text_select: "Выделить все",
    text_unselect: "Снять выделение",
    years:  window.enter_years,
    distincts: window.distincts,
    filtered_objects: [],
    init: function(id){
        this.id = '#'+id;
        this.el = $("#id");
        this.insertYearsIntoFilter();
        this.insertDistinctsIntoFilter();
        this.bindCheckBoxesEvents();
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
    },
    bindCheckBoxesEvents: function(){
        $('#select-all-social').click(function(){
            if ($('#select-all-social').prop('checked'))
                filter.selectAllSocialAppointments();
            else
                filter.unselectAllSocialAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })
        $('#select-all-social + label + span').click(function(){
            if (!$('#select-all-social').prop('checked'))
                filter.selectAllSocialAppointments();
            else
                filter.unselectAllSocialAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })

        $('#select-all-living').click(function(){
            if ($('#select-all-living').prop('checked'))
                filter.selectAllLivingAppointments();
            else
                filter.unselectAllLivingAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })
        $('#select-all-living + label + span').click(function(){
            if (!$('#select-all-living').prop('checked'))
                filter.selectAllLivingAppointments();
            else
                filter.unselectAllLivingAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })

        $('#select-all-other').click(function(){
            if ($('#select-all-other').prop('checked'))
                filter.selectAllOthersAppointments();
            else
                filter.unselectAllOthersAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })
        $('#select-all-other + label + span').click(function(){
            if (!$('#select-all-other').prop('checked'))
                filter.selectAllOthersAppointments();
            else
                filter.unselectAllOthersAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })

        $('#select-all-distincts').click(function(){
            if ($('#select-all-distincts').prop('checked'))
                filter.selectAllDistincts();
            else
                filter.unselectAllDistincts();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })
        $('#select-all-distincts + label + span').click(function(){
            if (!$('#select-all-distincts').prop('checked'))
                filter.selectAllDistincts();
            else
                filter.unselectAllDistincts();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })

        $('#select-all-years').click(function(){
            if ($('#select-all-years').prop('checked'))
                filter.selectAllYears();
            else
                filter.unselectAllYears();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })
        $('#select-all-years + label + span').click(function(){
            if (!$('#select-all-years').prop('checked'))
                filter.selectAllYears();
            else
                filter.unselectAllYears();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })

        $('#checkbox-all-appointments').click(function(){
            if ($('#checkbox-all-appointments').prop('checked'))
                filter.selectAllObjectsAppointments();
            else
                filter.unselectAllObjectsAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })
        $('#checkbox-all-appointments + label + span').click(function(){
            if (!$('#select-all-years').prop('checked'))
                filter.selectAllObjectsAppointments();
            else
                filter.unselectAllObjectsAppointments();
            //filter.refreshCheckboxStatuses();
            charts.redrawAllCharts();
        })

        $('#object-filter .distincts.filter-items input').change(filter.refreshDistinctsChechboxes)
        $('#object-filter .years-filter.filter-items input').change(filter.refreshYearsChechboxes)
        $('#object-filter .appointments.filter-items input').change(filter.refreshAppointmentsChechboxes)
        $('#object-filter .appointment-filter .sub-header input, #object-filter .appointment-filter .sub-header .add-filters-action').
                                    click(filter.refreshAllObjectChecbox)

    } ,
    selectAllSocialAppointments: function(){
        $("#object-filter .appointments.social input").prop( "checked", true );
        $('#select-all-social').prop( "checked", true );
        $('#select-all-social + label + span').text(filter.text_unselect)
    },
    unselectAllSocialAppointments: function(){
        $("#object-filter .appointments.social input").prop( "checked", false );
        $('#select-all-social').prop( "checked", false );
        $('#select-all-social + label + span').text(filter.text_select)
    },
    selectAllLivingAppointments: function(){
        $("#object-filter .appointments.living input").prop( "checked", true );
        $('#select-all-living').prop( "checked", true );
        $('#select-all-living + label + span').text(filter.text_unselect)
    },
    unselectAllLivingAppointments: function(){
        $("#object-filter .appointments.living input").prop( "checked", false );
        $('#select-all-living').prop( "checked", false );
        $('#select-all-living + label + span').text(filter.text_select)
    } ,
    selectAllOthersAppointments: function(){
        $("#object-filter .appointments.others input").prop( "checked", true );
        $('#select-all-other').prop( "checked", true );
        $('#select-all-other + label + span').text(filter.text_unselect)
    },
    unselectAllOthersAppointments: function(){
        $("#object-filter .appointments.others input").prop( "checked", false );
        $('#select-all-other').prop( "checked", false );
        $('#select-all-other + label + span').text(filter.text_select)
    },
    selectAllDistincts: function(){
        $("#object-filter .distincts.filter-items input").prop( "checked", true );
        $('#select-all-distincts').prop( "checked", true );
        $('#select-all-distincts + label + span').text(filter.text_unselect)
    },
    unselectAllDistincts: function(){
        $("#object-filter .distincts.filter-items input").prop( "checked", false );
        $('#select-all-distincts').prop( "checked", false );
        $('#select-all-distincts + label + span').text(filter.text_select)
    } ,
    selectAllYears: function(){
        $("#object-filter .years-filter.filter-items input").prop( "checked", true );
        $('#select-all-years').prop( "checked", true );
        $('#select-all-years + label + span').text(filter.text_unselect)
    },
    unselectAllYears: function(){
        $("#object-filter .years-filter.filter-items input").prop( "checked", false );
        $('#select-all-years').prop( "checked", false );
        $('#select-all-years + label + span').text(filter.text_select)
    },
    selectAllObjectsAppointments: function(){
        filter.selectAllSocialAppointments();
        filter.selectAllLivingAppointments();
        filter.selectAllOthersAppointments();
        $('#checkbox-all-appointments').prop( "checked", true );
        $('#checkbox-all-appointments + label + span').text(filter.text_unselect)
    },
    unselectAllObjectsAppointments: function(){
        filter.unselectAllSocialAppointments();
        filter.unselectAllLivingAppointments();
        filter.unselectAllOthersAppointments();
        $('#checkbox-all-appointments').prop( "checked", false );
        $('#checkbox-all-appointments + label + span').text(filter.text_select)
    },

    refreshDistinctsChechboxes: function(){
        if($('.distincts input').length ==
            $('.distincts input:checked').length){
            //выделены все объекты в группе
            $('#select-all-distincts').prop( "checked", true );
            $('#select-all-distincts + label + span').text(filter.text_unselect)
        } else {
            $('#select-all-distincts').prop( "checked", false );
            $('#select-all-distincts + label + span').text(filter.text_select)
        }
    },
    refreshYearsChechboxes: function(){
        if($('.years input').length ==
            $('.years input:checked').length){
            //выделены все объекты в группе
            $('#select-all-years').prop( "checked", true );
            $('#select-all-years + label + span').text(filter.text_unselect)
        } else {
            $('#select-all-years').prop( "checked", false );
            $('#select-all-years + label + span').text(filter.text_select)
        }
    },
    refreshAppointmentsChechboxes: function(){
        if($('.appointments.appointment-filter.social input').length ==
        $('.appointments.appointment-filter.social input:checked').length){
            //выделены все объекты в группе
            $('#select-all-social').prop( "checked", true );
            $('#select-all-social + label + span').text(filter.text_unselect)
        } else {
            $('#select-all-social').prop( "checked", false );
            $('#select-all-social + label + span').text(filter.text_select)
        }
        if($('.appointments.appointment-filter.others input').length ==
            $('.appointments.appointment-filter.others input:checked').length){
            //выделены все объекты в группе
            $('#select-all-other').prop( "checked", true );
            $('#select-all-other + label + span').text(filter.text_unselect)
        } else {
            $('#select-all-other').prop( "checked", false );
            $('#select-all-other + label + span').text(filter.text_select)
        }
        //
        if($('.appointments.appointment-filter.living input').length ==
            $('.appointments.appointment-filter.living input:checked').length){
            //выделены все объекты в группе
            $('#select-all-living').prop( "checked", true );
            $('#select-all-living + label + span').text(filter.text_unselect)
        } else {
            $('#select-all-living').prop( "checked", false );
            $('#select-all-living + label + span').text(filter.text_select)
        }

        filter.refreshAllObjectChecbox();





    } ,
    refreshAllObjectChecbox: function(){

        if($('#object-filter .appointment-filter .sub-header input').length ==
            $('#object-filter .appointment-filter .sub-header input:checked').length){
            //выделены все объекты в группе
            $('#checkbox-all-appointments').prop( "checked", true );
            $('#checkbox-all-appointments + label + span').text(filter.text_unselect)
        } else {
            $('#checkbox-all-appointments').prop( "checked", false );
            $('#checkbox-all-appointments + label + span').text(filter.text_select)
        }
    }


}