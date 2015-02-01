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
                    data_saver.saveValueInDB(i,'window.'+i+'='+JSON.stringify(val), true)
                })
                data_saver.saveValueInDB('md5_'+part,md5)
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
                //data_saver.updatePart(part, data.md5)
            },
            error:function(){
                console.log('error while pending md5 - '+ part);
                data_saver.active_request_counter--;
                data_saver.spinnerUpdate();
            },
            dataType: 'jsonp'
        });
    },
    getMD5ForPart: function (part){
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
    db: null,
    refreshData: function(){
        console.log('data')
        data_saver.openOrCreateDB();
        data_saver.checkTableExist();
    },
    openOrCreateDB: function(){
        data_saver.db = window.openDatabase("kpugs", "1.1", "kpugs", 1000000);
    },
    checkTableExist: function(){
        console.log('checking table exist')
        data_saver.db.transaction(createTable, data_saver.errorDB, data_saver.evalAllRowsInTable);
        function createTable(tx) {
            //tx.executeSql('DROP TABLE IF EXISTS INFO');
            tx.executeSql('CREATE TABLE IF NOT EXISTS INFO ("id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "key" TEXT, "value" TEXT)');
            console.log('tabel create or exist');
        }
    },
    evalAllRowsInTable: function(){
        data_saver.db.transaction(readAllRows, data_saver.errorDB);
        function readAllRows(tx) {
            tx.executeSql('SELECT * FROM INFO', [], querySuccess, data_saver.errorDB);
        }
        function querySuccess(tx, results) {
            var len = results.rows.length;
            console.log("read " + len + " in INFO TABLE");
            for (var i=0; i<len; i++){
                //console.log(" key = " + results.rows.item(i).key );
                data_saver.evalValue(results.rows.item(i).value)
            }
            //Проверяем время последнего апдейта
            main_logic.fillData();
            data_saver.checkLastUpdate();
        }
    },

    evalValue: function(val){
        if (val.indexOf('window')!= -1)
            eval(val);
    },
    checkLastUpdate: function(){
        data_saver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM INFO where key=?", ['lastUpdateDate'],querySuccess, data_saver.errorDB);
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 || new Date().getTime() - results.rows.item(0).value > data_saver.refresh_delay) {
                //если не было обновления или оно было давно то запускаем апдейт всех частей
                console.log('start update data from server')
                http_api.getMD5ForPart('employee');
                http_api.getMD5ForPart('tenders');
                http_api.getMD5ForPart('organizations');
                http_api.getMD5ForPart('apartments');
                http_api.getMD5ForPart('objects');
            }
        }
    },
    updatePart:function(part, md5){
        console.log(part, md5)
        // проверяем изменилась ли часть данных по md5
        data_saver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM INFO where key=?", ['md5_'+part],querySuccess, data_saver.errorDB);
        });
        function querySuccess(tx, results) {
            console.log( part, "result = " +results.rows.length )
            if (results.rows.length == 0 || results.rows.item(0).value != md5) {
                console.log('data for '+part+ ' is changed. refreshing…');
                http_api.request(part, md5)
            }
            else console.log('data for '+ part + ' is fresh');
        }
    },
    spinnerUpdate: function() {
        console.log(data_saver.active_request_counter, 'active count')
        if(data_saver.active_request_counter>0) $("#update_msg").show();
        else {
            $("#update_msg").hide();
            main_logic.fillData();
        }
    },
    errorDB: function(err){
        console.log("Error processing SQL: "+err.code, err);
    },

    saveValueInDB: function(key, val, needEval){
        //добавить проверку на наличие такого значиния
        data_saver.db.transaction(function(tx) {
            tx.executeSql("SELECT * FROM INFO where key=?", [key], querySuccess, data_saver.errorDB);
            console.log('inserted or update ' + key)
        });
        function querySuccess(tx, results) {
            if (results.rows.length == 0 ) {
                data_saver.db.transaction(function(tx) {
                    tx.executeSql("INSERT INTO INFO (key, value) values(?, ?)", [key, val], evalSavedValue, data_saver.errorDB);
                    console.log('inserted ' + key)
                });

            }
            else data_saver.db.transaction(function(tx) {
                tx.executeSql("UPDATE INFO SET  value = ? where key =  ?", [val, key], evalSavedValue, data_saver.errorDB);
                console.log('update ' + key)
            });

        }

        function evalSavedValue(tx, result){
            if (needEval) data_saver.evalValue(val);
        }

    },
    testMD5: function(){
        data_saver.db.transaction(function(tx) {
            tx.executeSql("UPDATE INFO SET  value = ? where key =  ?", ['2111', 'md5_employee'], null, data_saver.errorDB);
            console.log('update ' )
        });
    }
};