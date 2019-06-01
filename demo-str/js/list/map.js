/**
 * Created by zhuk on 20.02.16.
 */

var map_wrapper = {
    initMap: function() {
        listApp.map = L.map('map',{maximumAge: 1000000,scrollWheelZoom:false,zoomControl: true}).setView([55.5705, 37.43], 10);
        L.tileLayer(
            //'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw'
            // 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw'
            'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
            , {
            maxZoom: 18,
            attribution: '',
            id: 'examples.map-i86l3621',
            detectRetina: true,
            reuseTiles: true,
            unloadInvisibleTiles: true
        }).addTo(listApp.map);


        L.geoJson(mo_regions, {style: style}).addTo(listApp.map);


        listApp.map.dragging.enable();

        function style(feature) {
            return {
                weight: 1,
                opacity: 0.3,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.15,
                fillColor: '#065ed6'
            };
        }
        function onEachFeature(feature, layer) {
            //layer.on({
            //    //mouseover: highlightFeature,
            //    //mouseout: resetHighlight,
            //    //click: zoomToFeature
            //});
        }

    },



    bindMarkersOnMap: function(){
        if (listApp.map && listApp.marker_group)
            listApp.map.removeLayer(listApp.marker_group);
        var markerArray = [];
        $.each(listApp.filtrateObjects, function (i,obj){
            //L.marker([obj.latitude, obj.longitude]).addTo(listApp.map)
            markerArray.push(L.marker([obj.latitude, obj.longitude], {icon: listApp.getMarkerOption(obj)})
                                .bindPopup(map_wrapper.getMarkerPopupContent(obj),{closeButton:false}))
        });

        if (markerArray.length==0) return;
        listApp.marker_group = L.featureGroup(markerArray).addTo(listApp.map);
        listApp.map.fitBounds(listApp.marker_group.getBounds().pad(0.001));

    },


    getMarkerPopupContent: function(obj){
        return ('<a href="project.html">'+obj.address+'</a><br>'
        +'<p>Отставание: '+obj.delay+' дней</p>'
        +'<a href="project.html" class="btn tooltip-btn btn-block btn-sm">Подробнее</a>')
    }

}


//L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpandmbXliNDBjZWd2M2x6bDk3c2ZtOTkifQ._QA7i5Mpkd_m30IGElHziw', {
//    maxZoom: 18,
//    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
//    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
//    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
//    id: 'mapbox.streets'
//}).addTo(map);
