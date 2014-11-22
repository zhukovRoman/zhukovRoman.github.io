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
        "sales.html": 300
    },

    moveTo: function(y, h, newItem){
        //$("#float_background").css('top',y+'px')

        $("#float_background").animate({
            top: y+'px',
            height: h+'px'
        }, 800, function() {
            newItem.children().addClass('menu-item-active')
        });
    },
    changeActiveItem: function(){
      //this - clecked link
        var new_page = $(this).attr('href');
        $('#left-menu div.menu a div.menu-item-active').removeClass('menu-item-active');
        menu_float_background.moveTo(menu_float_background.positions[new_page],
                                        menu_float_background.heights[new_page],
                                        $(this))


    },
    bindEvents: function(){
        $('#left-menu div.menu a').on('click', this.changeActiveItem)
    }
}