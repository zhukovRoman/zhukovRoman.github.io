function thousands_sep (value)
{
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function million_to_text (value){
    return  thousands_sep(((parseFloat(value)||0)/1000000).toFixed(3)) + ' млн ₽'
}