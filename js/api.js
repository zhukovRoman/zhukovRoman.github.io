var http_api = {
    url: 'http://213.85.34.118',
    port: ':50080',
    //url: 'http://0.0.0.0',
    //port: ':3000',
    methods: {
        employee: '/api/employee',
        tenders: '/api/tenders',
        objects: '/api/objects',
        organizations: '/api/organizations',
        apartments: '/api/apartments'
    },
    getUrl: function(method_name){
       return http_api.url+http_api.port+(http_api.methods[method_name]||'')
    },
    request: function (part){
        console.log('request data - ' + part);
        data_saver.active_request_counter++;
        data_saver.spinnerUpdate();
        $.ajax({
            url: http_api.getUrl(part),
            success: function( data ) {
                //console.log( data)
                console.log('get response from '+ part);
                data_saver.active_request_counter--;
                data_saver.spinnerUpdate();
                $.each(data, function(i,val){
                    //eval('window.'+i+'='+JSON.stringify(val))
                    data_saver.setNewValue(i,'window.'+i+'='+JSON.stringify(val))
                })
            },
            error:function(){
              console.log('error while pending data - '+ part);
                data_saver.active_request_counter--;
                data_saver.spinnerUpdate();
            },
            dataType: 'jsonp'
        });

    }
}

var data_saver = {
    is_current_update: false,
    active_request_counter: 0,
    getLastUpdateDate: function(){
        return localStorage['lastUpdateDate']||null
    },
    updateData: function(){
        var lastUpdate = data_saver.getLastUpdateDate()
        var mlInDay = 24*60*60*1000
        if(true||new Date().getTime() - lastUpdate > mlInDay){
            //last update was yesterday … => execute update
            console.log('start update data from server')

            //http_api.request('employee');
            http_api.request('tenders');
            //http_api.request('organizations');
            //http_api.request('apartments');
            //http_api.request('objects');

            data_saver.setNewValue('lastUpdateDate', new Date().getTime())
        }
        else{
            console.log('data is fresh');
            return;
        }
    },
    setNewValue: function(key, val){
        localStorage.setItem(key, val);
        data_saver.evalValue(val);
        return;
    },
    getValue: function(key){
        return localStorage[key];
    },
    evalValue: function(val){
        eval(val);
    },
    evalAllData: function(){
        $.each(localStorage, function(i,val){
            data_saver.evalValue(val);
        })
    },
    getData: function(){
        data_saver.updateData();
        data_saver.evalAllData();
    },
    spinnerUpdate: function() {
        console.log(data_saver.active_request_counter, 'active count')
        if(data_saver.active_request_counter>0) $(".spinner").show();
        else $(".spinner").hide();
    }
}