


var map = new ol.Map({
    target: 'map',
    layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
    ],
    view: new ol.View({
        center: ol.proj.transform([78.38745117187499,11.86466302072273], 'EPSG:4326', 'EPSG:3857'),
        zoom: 10
    })
});
 var onSuccess = function(position) {

 map.getView().setCenter(ol.proj.transform([position.coords.longitude, position.coords.latitude], 'EPSG:4326', 'EPSG:3857'));
    map.getView().setZoom(13);

      //  alert('Latitude: '          +     position.coords.latitude      + '\n' +
      //        'Longitude: '         + position.coords.longitude         + '\n' +
      //        'Altitude: '          + position.coords.altitude          + '\n' +
      //        'Accuracy: '          + position.coords.accuracy          + '\n' +
      //        'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
      //        'Heading: '           + position.coords.heading           + '\n' +
      //        'Speed: '             + position.coords.speed             + '\n' +
      //        'Timestamp: '         + position.timestamp                + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);



map.on('click', function(evt) {
var lonlat = ol.proj.transform(evt.coordinate, 'EPSG:3857', 'EPSG:4326');
  var lon = lonlat[0];
  var lat = lonlat[1];

		$.ajax('https://sravankumar1990.herokuapp.com/getassemblyname.php?lat='+lat+'&long='+lon, {
                    type: 'get',
                    data: {
                        outputFormat: 'application/json'
                    },
                success : function (response) {
			//fields = [];

			
                    		var ac_name=response[0].ac_name
				var geom=response[0].geom
				//fields.push(geom);
				console.log(ac_name);
				var format = new ol.format.WKT();
      				var feature = format.readFeature(geom);
				feature.getGeometry().transform('EPSG:4326', 'EPSG:3857');
				feature.set('ac_name', ac_name);
				feature.setStyle(styleFunction);
				function styleFunction() {
				  return [
					new ol.style.Style({
				  		fill: new ol.style.Fill({color: '#00bbff'}),
				  		stroke: new ol.style.Stroke({color: '#fff'}),
				  		image: new ol.style.Icon( ({
				    		anchor: [16, 16],
				    		anchorXUnits: 'pixels',
				    		anchorYUnits: 'pixels',
				    		scale : 0.1,
				    		opacity: 1,
				    		src: 'http-248797.jpeg?cs=srgb&dl=beach-exotic-holiday-248797.jpg&fm=jpg'
				  	})),
 				 	text: new ol.style.Text({
				 		font: '15px Roboto',
				 		text: ac_name,
				 		fill: new ol.style.Fill({
				      			color: '#ffbb00'
				 		}),
				 		stroke: new ol.style.Stroke({
				      			color: '#000',
				      		width: 1
				    	      })
				  	   }) 
					})
				     ];
				}
      				var vector = new ol.layer.Vector({
        				source: new ol.source.Vector({
          					features: [feature]
        				})
      				});
				map.addLayer(vector);

			
      				
                },
                });


});

function checData(){
 //var point= new ol.geom.Point(ol.proj.transform(, 'EPSG:4326', 'EPSG:3857'))
//var input=layerWFS.getSource().getFeaturesAtCoordinate(point);

var coord = ol.proj.fromLonLat([77.519105,10.248160]);
var features=tamilWFS.getSource().getFeatures();	
features.forEach(function(feature){ 
var polygon_extent=feature.getGeometry().getExtent();
var att = feature.getProperties();
  var contains = ol.extent.containsCoordinate(polygon_extent, coord);
  console.info(contains+" , "+att.ac_name);
if(contains==true){
console.log(feature.getGeometry());
}

});
}
