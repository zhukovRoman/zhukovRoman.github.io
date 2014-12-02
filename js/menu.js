var menu_float_background = {
    positions : {
        "empl.html" : 133,
        "objects.html": (135+253*1),
        "organizations.html": (135+253*2),
        "tenders.html": (136+253*3),
        "sales.html": (137+253*4)
    },
    heights : {
        "empl.html" : 254,
        "objects.html": 253,
        "organizations.html": 254,
        "tenders.html": 254,
        "sales.html": 260
    },
    pages:{
        "employee": "empl.html",
        'charts': "objects.html",
        'organization_page': "organizations.html",
         "tenders":  "tenders.html",
         "sales": "sales.html"
    },

    moveTo: function(y, h, newItem){
        //$("#float_background").css('top',y+'px')

        $("#float_background").animate({
            top: y+'px',
            height: h+'px'
        }, 300, function() {
            newItem.children().addClass('menu-item-active')
        });
    },
    changeActiveItem: function(page){

        var new_page_url = menu_float_background.pages[page]
        //  var new_page = $(this).attr('href');
        var new_page = $('#left-menu a[href="'+new_page_url+'"]');

        console.log(menu_float_background.positions[new_page_url]);
        console.log(menu_float_background.heights[new_page_url]);
        $('#left-menu div.menu a div.menu-item-active').removeClass('menu-item-active');
        menu_float_background.moveTo(menu_float_background.positions[new_page_url],
                                        menu_float_background.heights[new_page_url],
                                        new_page)


    },
    bindEvents: function(){
        $('#left-menu div.menu a').on('click', this.changeActiveItem)
    }
}