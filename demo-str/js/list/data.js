var otraslFilterValues = [
    ['zdrav', 'Здравоохранение'], ['kulture', "Культура"], ['education', 'Образование'],
    ['prom','Промышленность'], ['build','Строительство'], ['trasnport','Транспорт']
];

var otraslIdVaules = function(){
    var res = [];
    otraslFilterValues.forEach(function(val){res.push(val[0])})
    return res;
};

var getOtraslNameById = function(id){
    var res = null;
    otraslFilterValues.forEach(function(val){if (val[0]===id) res = val[1]})
    return res;
};


var typeFilterValues = [
    ['childrengarden', 'Детский сад'], ['school', "Школа"], ['percentr', 'Перинатальный центр'],
    ['polick','Поликлиника']
];

var typelIdVaules = function(){
    var res = [];
    typeFilterValues.forEach(function(val){res.push(val[0])})
    return res;
};

var getTypeNameById = function(id){
    var res = null;
    typeFilterValues.forEach(function(val){if (val[0]===id) res = val[1]})
    return res;
};


var programFilterValues = [
    ['aip', 'АИП'], ['fcp', "ФЦП"]
];

var programlIdVaules = function(){
    var res = [];
    programFilterValues.forEach(function(val){res.push(val[0])})
    return res;
};

var getProgramNameById = function(id){
    var res = null;
    programFilterValues.forEach(function(val){if (val[0]===id) res = val[1]})
    return res;
};