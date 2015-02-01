var main_logic = {
    animateInAll: function(){
        //alert(1)
        var duration = 300;
        $('#logo').addClass('hide_image')
        $('body').addClass('bg_body');
        $('#left-menu').addClass('transparent-menu');
        $('#main_page').css('background-color', 'transparent');

        $('#float_background').hide()
        $('#main-logo').animate({
            left: '0px'
        }, {
            duration: duration, queue: false
        })
        $('#left-menu').animate({
            left: '612px'
        }, {
            duration: duration, queue: false
        })


        $('#search_field').on('focus',main_logic.searchOnFocus);
        //$('#search_field').on('blur',main_logic.searchOnBlur);
        $('#search_cancel_button').on('click',
            function(){
                main_logic.searchOnBlur();
                $('#search_field').val('');
            })
        $("#search-result-bg").on('click', main_logic.searchOnBlur )
        $('#search_field').on('keyup',main_logic.search_items)

        $('#search-result-bg .search-wrapper, #search-result-bg').on("scrollstart",function(e){
            $('#search_field').blur();
            return;
        });
        //$('#search-result-bg').on("scrollstart",function(e){
        //    console.log('a')
        //    e.stopPropagation()
        //    //$('#search_field').blur();
        //    //main_logic.searchOnBlur();
        //    return;
        //});
    },
    animateOutAll: function(){
        var duration = 300;

        $('#float_background').show()
        $('#main-logo').animate({
            left: '-800px'
        }, {
            duration: duration, queue: false
        })
        $('#left-menu').animate({
            left: '0px'
        }, {
            duration: duration, queue: false
        })
        $('#logo').removeClass('hide_image')
        $('body').removeClass('bg_body');
        $('#left-menu').removeClass('transparent-menu')
    } ,
    fillData: function(){
        console.log('fill!!!!')
        $('#salary_avg').text(thousands_sep(avg_salary[avg_salary.length-1])+ '₽')
        $('#empl_count').text(empl_counts[empl_counts.length-1])
        $('#vac_count').text(vacancy_counts[empl_counts.length-1])

        var payed = 0;
        var payed_left = 0;
        var work_compl = [0, 0];
        $.each(data.objects, function(i,obj){
            payed+=obj.payed  + obj.avans_pogasheno + obj.avans_ne_pogasheno
            payed_left+=obj.payed_left
            work_compl[0]+= obj.work_complete
            work_compl[1]+= obj.work_left+obj.work_left
        });

        $('#payed_status').text(thousands_sep((payed/1000000).toFixed(0))+'/'+thousands_sep((payed_left/1000000).toFixed(0))+ ' млн ₽')
        $('#active_obj_count').text(data.objects.length)
        $('#work_percent').text((work_compl[0]*100/(work_compl[1])).toFixed(2)+'%')

        $('#org_count').text(organizations.length)

        var summ =0;
        var count = 0;
        var percent = 0;
        var one_qty = 0;

        var year = new Date().getFullYear();
        $.each(tenders, function(i,val ){
            if(val.year_finish!=year) return
            if(val.type=='прочие') return
            summ+= val.price_end;
            count++;
            percent+=val.percent
            if (val.bid_accept==1) one_qty+= val.price_end
        })

        $('#summ_count_tenders').text(thousands_sep((summ/1000000000).toFixed(0))+' млрд ₽ / '+count )
        $('#tenders_with_one_qty').text((one_qty*100/summ).toFixed(2)+'%')
        $('#tenders_percent').text((percent/count).toFixed(2)+'%')

        var apart_count=0
        var m2_price =0
        $.each(apartments, function(i,val ){
           if(val.status=='ПС') {
                apart_count++;
                m2_price+=val.price_m2_end
           }
        })
        $('#sales_avg_m2').text(thousands_sep((m2_price/apart_count).toFixed(0))+ ' тыс ₽')
        $('#sales_all_count').text(apart_count)



    },
    searchOnFocus: function(){
       var duration = 300;
        $('#search_field').animate({
            width: '1550px',
            "background-position-x": '1%'
        }, {
            duration: duration, queue: false
        })
        $('#search-result-bg').animate({
            height: '1412px'
        }, {
            duration: duration, queue: false
        })
        $('#search-result-bg .search-wrapper').animate({
            height: '1400px'
        }, {
            duration: duration, queue: false
        })
        $('#search_cancel_button').animate({
            right: '90px'
        }, {
            duration: duration, queue: false
        })
        $('#search_field').css('text-align', 'left')
        $('#search-result-bg .search-wrapper').css('overflow-y', 'scroll')
        main_logic.search_items();

    },
    searchOnBlur: function(){
        var duration = 300;

        $('#search_field').animate({
            width: '1960px',
            "background-position-x": '47.7%'
        }, {
            duration: duration, queue: false
        })
        $('#search-result-bg').animate({
            height: '0px'
        }, {
            duration: duration, queue: false
        })
        $('#search-result-bg .search-wrapper').animate({
            height: '0px'
        }, {
            duration: duration, queue: false
        })
        $('#search_cancel_button').animate({
            right: '-190px'
        }, {
            duration: duration, queue: false
        })
        $('#search_field').css('text-align', 'center')
        $('#search-result-bg .search-wrapper').html('');
    },
    search_items: function(){
        var input_str = $("#search_field").val().toLowerCase();
        if (input_str.length<2) return;
        var res = [];
        //search objects by address
        $.each(objects, function(i, o){
            if((o.ObjectAdress||"").toLowerCase().indexOf(input_str)==-1) return;

            res.push({
                name:o.ObjectAdress,
                type:'obj',
                id: o.ObjectId,
                add_info: o.ObjectRegionName+', '+ o.ObjectEnterYearCorrect+', '+ o.ObjectAppointmentName
            })
        })
        //search orgs by name
        $.each(organizations, function(i, org){
            //console.log(org.name.toLowerCase(), input_str)
            if(org.name.toLowerCase().indexOf(input_str)==-1) return;

            res.push({
                name: org.name,
                type:'org',
                add_info: org.objects.length+' (объектов)',
                id: org.id
            })
        })
        //console.log(res)
        main_logic.bind_rows(res);
    },
    bind_rows: function(arr){
       var html = '';
       function generate_html_item(item){
           return "<a href='"+
               ((item.type=='org') ? "org_view.html?id="+item.id : "object_view.html?id="+item.id )
               +"'>"+
                "<div class='search-item search-item-"+item.type+"'>"+
                    "<div class='search-item-name'>"+item.name+"</div>"+
                    "<div class='search-item-add-info'>"+item.add_info+"</div>"+
               "</div> </a>"
       }

        $.each(arr, function(i,item){
            html+=generate_html_item(item);
        })
        $('#search-result-bg .search-wrapper').html(html);

    }
}

//$(function () {
//    $("#first").animate({
//        width: '200px'
//    }, { duration: 200, queue: false });
//    $("#second").animate({
//        width: '600px'
//    }, { duration: 200, queue: false });
//});

