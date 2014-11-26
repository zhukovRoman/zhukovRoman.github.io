var main_logic = {
    animateInAll: function(){
        //alert(1)
        var duration = 300;
        $('#left-menu').css("background-color", "transparent");
        $('#left-menu').css("background-image", "url('css/images/main-menu-bg.png')");
        $('#logo').css("background-image", "none");
        $('body').css("background-image", "/css/images/main_bg.png");

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
        $('#main_page').css('background-color', 'transparent');
        //$('body').css('background-repeat', 'no-repeat');
        //$('body').css('background-image', 'url("css/images/main_bg.png")');

    },
    animateOutAll: function(){
        var duration = 300;

        $('#left-menu').css("background-color", "");
        $('#left-menu').css("background-image", "");
        $('#logo').css("background-image", "url('css/images/logo.png')");

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
    } ,
    fillData: function(){
        $('#salary_avg').text(thousands_sep(avg_salary[avg_salary.length-1])+ '₽')
        $('#empl_count').text(empl_counts[empl_counts.length-1])
        $('#vac_count').text(empl_counts[empl_counts.length-1])

        var payed = 0;
        var payed_left = 0;
        var work_compl = [0, 0];
        $.each(data.objects, function(i,obj){
            payed+=obj.payed  + obj.avans_pogasheno + obj.avans_ne_pogasheno
            payed_left+=obj.payed_left
            work_compl[0]+= obj.work_complete
            work_compl[1]+= obj.work_left
        });

        $('#payed_status').text(thousands_sep((payed/1000000).toFixed(0))+'/'+thousands_sep((payed_left/1000000).toFixed(0))+ 'млн ₽')
        $('#active_obj_count').text(data.objects.length)
        $('#work_percent').text((work_compl[0]/(work_compl[0]+work_compl[1])).toFixed(2)+'%')

        $('#org_count').text(organizations.length)

        var summ =0;
        var count = 0;
        var percent = 0;
        var one_qty = 0;

        var year = new Date().getFullYear();



        $.each(tenders, function(i,val ){
            if(val.year_finish!=year) return
            summ+= val.price_end;
            count++;
            percent+=val.percent
            if (val.qty_accept==1) one_qty+= val.price_end
        })

        $('#summ_count_tenders').text(thousands_sep((summ/1000000000).toFixed(0))+'млрд ₽ / '+count )
        $('#tenders_with_one_qty').text((one_qty/summ).toFixed(2)+'%')
        $('#tenders_percent').text((percent/count).toFixed(2)+'%')

        var apart_count=0
        var m2_price =0
        $.each(apartments, function(i,val ){
           if(val.status=='ПС'||val.status=='ДКП') {
                apart_count++;
                m2_price+=val.price_m2_end
           }
        })
        $('#sales_avg_m2').text(thousands_sep((m2_price/apart_count).toFixed(0))+ ' тыс ₽')
        $('#sales_all_count').text(apart_count)



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