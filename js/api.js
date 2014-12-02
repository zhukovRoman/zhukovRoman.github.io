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
    hash_url: '/api/gethash',
    getUrl: function(method_name){
       return http_api.url+http_api.port+(http_api.methods[method_name]||'')
    },
    request: function (part, md5){
        console.log('request data - ' + part);
        data_saver.active_request_counter++;
        data_saver.spinnerUpdate();
        $.ajax({
            url: http_api.getUrl(part),
            success: function(data) {
                console.log('get response from '+ part);
                data_saver.active_request_counter--;
                data_saver.spinnerUpdate();
                $.each(data, function(i,val){
                    //eval('window.'+i+'='+JSON.stringify(val))
                    data_saver.setNewValue(i,'window.'+i+'='+JSON.stringify(val))
                })
                data_saver.setValue(part+'_md5',md5)
            },
            error:function(){
              console.log('error while pending data - '+ part);
                data_saver.active_request_counter--;
                data_saver.spinnerUpdate();
            },
            dataType: 'jsonp'
        });

    },
    checkHashAndUpdate: function(part){
        data_saver.active_request_counter++;
        data_saver.spinnerUpdate();

        $.ajax({
            url: http_api.url+http_api.port+http_api.hash_url+'?part='+part,
            success: function(data) {
                console.log('get md5 from '+ part);
                data_saver.active_request_counter--;
                data_saver.spinnerUpdate();
                data_saver.updatePart(part, data.md5)
            },
            error:function(){
                console.log('error while pending md5 - '+ part);
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
    refresh_delay:  24*60*60*1000,
    getLastUpdateDate: function(){
        return localStorage['lastUpdateDate']||null
    },
    updateData: function(){
        var lastUpdate = data_saver.getLastUpdateDate()
        var mlInDay = data_saver.refresh_delay
        if(true||new Date().getTime() - lastUpdate > mlInDay){
            //last update was yesterday … => execute update
            console.log('start update data from server')
            http_api.checkHashAndUpdate('employee');
            http_api.checkHashAndUpdate('tenders');
            http_api.checkHashAndUpdate('organizations');
            http_api.checkHashAndUpdate('apartments');
            http_api.checkHashAndUpdate('objects');


            data_saver.setNewValue('lastUpdateDate', new Date().getTime())
        }
        else{
            console.log('data is fresh');
            return;
        }
    },
    updatePart:function(part, md5){
        console.log(part, md5)
        if (data_saver.getValue(part+'_md5')!= md5){
            http_api.request(part, md5);
        }

    },
    setNewValue: function(key, val){
        data_saver.setValue(key,val)
        data_saver.evalValue(val);
        return;
    },
    setValue: function(key, val){
        localStorage.setItem(key, val);
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
            if (i.indexOf('md5')==-1)
                data_saver.evalValue(val);
        })
    },
    getData: function(){
        data_saver.evalAllData();
        data_saver.updateData();
        data_saver.evalAllData();
    },
    spinnerUpdate: function() {
        console.log(data_saver.active_request_counter, 'active count')
        if(data_saver.active_request_counter>0) $("#update_msg").show();
        else $("#update_msg").hide();
    }
}