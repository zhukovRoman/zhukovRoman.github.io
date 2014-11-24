function thousands_sep (value)
{
    return (value||0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function million_to_text (value){
    return  thousands_sep(((parseFloat(value)||0)/1000000).toFixed(3)) + ' млн ₽'
}

var months = ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var months_short = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
$.mobile.buttonMarkup.hoverDelay = 330;
$.support.cors = true;
$.mobile.page.prototype.options.domCache = false;


//window.onerror = function(message, source, lineno) {
//    alert('Упс, произошла ошбика! '+"\n" +
//        "Для корректной дальнейшей работы следует перезагрузить приложение." +"\n" +
//        "Ошибка:"+message +"\n" +
//        "файл:" + source + "\n" +
//        "строка:" + lineno);
//};


function generateTooltipHeader(text){
    return  "<div class='tooltip-header'><div class='tooltip-padding'></div>"+text+"</div>"
}

function generateTooltipLine (name, value, color, noNeedPoint){

    return  "<div class='tooltip-line'>" +
        ((!noNeedPoint) ? "<span class='tooltip-point' style='color: "+color+"'>\u25CF" + "</span> " : "") +
            name+" : " + value+
            "</div>"
}


