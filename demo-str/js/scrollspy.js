/**
 * Created by zhuk on 23.02.16.
 */
$(function(){
    var lastId,
        topMenu = $("#menu"),
        topMenuHeight = topMenu.outerHeight()+100,
        menuItems = topMenu.find("a"),
        scrollItems = menuItems.map(function(){
            var item = $($(this).attr("data-anchor"));
            if (item.length) { return item; }
        });
    menuItems.click(function(e){
        var href = $(this).attr("data-anchor"),
            offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight;
        $('html, body').stop().animate({
            scrollTop: offsetTop
        }, 300);
        onScroll();
        e.preventDefault();
    });

    function onScroll(){
        var fromTop = $(this).scrollTop()+topMenuHeight+100;

        var cur = scrollItems.map(function(){
            if ($(this).offset().top < fromTop)
                return this;
        });
        cur = cur[cur.length-1];
        var id = cur && cur.length ? cur[0].id : "";

        if (lastId !== id) {
            lastId = id;
            menuItems
                .parent().removeClass("active")
                .end().filter("[data-anchor=#"+id+"]").parent().addClass("active");
        }
    }

    $(window).scroll(function(){
        onScroll()
    });
})
