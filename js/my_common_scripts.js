function thousands_sep (value)
{
    return (value||'').toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function million_to_text (value){
    return  thousands_sep(((parseFloat(value)||0)/1000000).toFixed(3)) + ' млн ₽'
}

var months = ["", "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
var months_short = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
$.mobile.buttonMarkup.hoverDelay = 330;
$.support.cors = true;

