

/*


	Okavango 2015 front-end.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html	

	TODOS
	- scroll is now too slow
	- map doesn't refresh in firefox
	- journal nav doesn't update timeline in firefox
	- labels timeline
	- layout mobile

	- teleport map once in a while
	- loading screen
	- unzoom at car speed
	- starts on last day
	- add note field to documentary images
	- free camera mode
	- scroll map while hovering a marker
	- dim out zoom buttons when max is reached
	- sound
	- linkable features
	- fix trail in about page
	- core features?
	- add link to tweets and blogposts
	- -4h in setDates(x2) and setTimeFrame(x2)
	- add location to post meta + link
	- test without smooth scroll and with touch scroll
	- How to cache data?
	- API error handling
	- filter crazy path points
	- scrollbar event for feed navigation?
	- there are 2 getBodyHeight functions
	- marker labels and popups
	- video features	
	- sightings taxonomy color
	- 'click to pause, scroll to navigate'
	- proper teleport
	- remove global functions/variables
	- margin journal alignment with timeline
	- label for day transition
	- finer grained culling
	- heartrate peak feature
	- live mode
	- togglePause highlight on map
	- dim out night sections of timeline
	- highlight journal in header nav on new contents
	- transitions between pages
	- no night on journal

*/


var debug = false;
var frameCount = 0;

var mapbox_username = "brianhouse"; //"blprnt";
var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";

var loader;
var pages = {};
var mapWorld;
var tweetLayer;
var photoLayer;
var sightingLayer;
var beaconLayer;
var beaconPathLayer;
var blogLayer;
var soundLayer;
var timeline;
var feed;
var wanderer;

var expeditionYear = '15';

var timeOffsets = {
	'14':{
		'timeAmbit': 0,
		'dateAmbit': 2*24*3600,
		'tweet': 172760,
		'photo': 24*3600,
		'timezone': 4,
		'query': -1,
		'departure': 3,
		'startDate':0
	},
	'15':{
		'timeAmbit': 0,
		'dateAmbit': 0,
		'tweet': 0,
		'photo': 0,
		'timezone': 4,
		'query': 0,
		'departure': 3,
		'startDate':-1
	}
}

var paused = false;
var blurred = false;
var jumping = false;

var carCounter = 0;
var isMobile = false;

document.addEventListener('DOMContentLoaded', function(){

	(function() {
	  var check = false;
	  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	  isMobile = check;
	})();

    mapWorld = new L.map('mapWorld', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/' + mapbox_username + '.map-' + mapbox_map_id + '/{z}/{x}/{y}.png'),
        zoomControl: false,
        center:new L.LatLng(-12.811059,18.175099),
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        minZoom: 0,                    
        maxZoom: 20,
        zoom:17,
        scrollWheelZoom:false
    });

    tweetLayer = new L.layerGroup().addTo(mapWorld);
    photoLayer = new L.layerGroup().addTo(mapWorld);
    sightingLayer = new L.layerGroup().addTo(mapWorld);
    beaconLayer = new L.layerGroup().addTo(mapWorld);
    beaconPathLayer = new L.layerGroup().addTo(mapWorld);
    blogLayer = new L.layerGroup().addTo(mapWorld);
    soundLayer = new L.layerGroup().addTo(mapWorld);

    if(d3.selectAll('#navigation li')[0].length > 3){
	    loader = Loader();
	    pages.about = AboutPage('about');
	    pages.map = MapPage('map');    
	    pages.journal = JournalPage('journal');
	    pages.data = DataPage('data');
	    pages.share = Page('share');
	    timeline = Timeline();
		feed = Feed();
	} else {
		console.log('creating about');
		pages.about = AboutPage('about');
		pages.about.show();
	}
    wanderer = Wanderer(mapWorld.getCenter());

    if(d3.selectAll('#navigation li')[0].length > 3){
		// pages.mapWorld.show();
		pages.about.show();
		setLayoutInteractions();
		loader.getDayCount(function(dayCount,startDate){
			timeline.setDates(dayCount,startDate);
			loader.loadDay(timeline.getTimeCursor().day,function(day){
				timeline.setTimeFrame();
				feed.init(day);
				timeline.init(day);
				timeline.initGraphics();
				timeline.initTimeCursor();
				animate(new Date().getTime()-16);
			});
		});
		
	} else {
		window.addEventListener('resize',resize);
		resize();	
		animate(new Date().getTime()-16);
	}


	function animate(lastFrameTime){
		if(!paused){
			var frameTime = new Date().getTime();
			var frameRate = 1000/(frameTime - lastFrameTime);
			if(frameRate < 0.5) frameRate = 60;
		    frameCount ++;
		    if(!blurred && !jumping){
			    if(pages.active.id == 'map' || pages.active.id == 'journal'){
				    timeline.update(frameRate);
				    var coord = [0,0];
				    var i = 0;
					
					for(m in loader.members){
						var member = loader.members[m];
						var isCore = member.move(timeline.getTimeCursor());
						// if(isCore){
						// 	var c = member.getLatLng();
						// 	coord[0] += c.lat;
						// 	coord[1] += c.lng;
						// 	i++;
						// }
					}
					// coord[0] /= i;
					// coord[1] /= i;

					// var latLng = new L.LatLng(coord[0],coord[1]);
					// if(loader.members['Steve'].getLatLng().distanceTo(latLng) > 500) latLng = loader.members['Steve'].getLatLng();
					// var previousCenter = mapWorld.getCenter();
					
					mapWorld.panTo(loader.members['Steve'].getLatLng(), {animate:false});

					var matrix = d3.select('#mapWorld div.leaflet-map-pane').style('transform').split(', ');
					matrix = matrix[0]+', '+matrix[1]+', '+matrix[2]+', '+matrix[3]+', '+(-1*parseFloat(matrix[4]))+', '+(-1*parseFloat(matrix[5]))+')';
					d3.select('#mapWorld div.scrollPane').style('transform',matrix);
					d3.select('#mapWorld div.scrollPane').node().scrollTop = 2000;
				
				} else {
					wanderer.wander();
			    	var target = wanderer.update();
			    	mapWorld.panTo(new L.LatLng(target.y,target.x), {animate:false});
				}
			}
		}
		requestAnimationFrame(function(){animate(frameTime)});
	}


	function setLayoutInteractions(){			

		d3.selectAll('#navigation li')
	    	.on('click',function(d,i){
	    		if(i<4){
		    		var btn = d3.select(this);
		    		var t = btn.text().toLowerCase();
		    		pages.active.hide();
		    		pages[t].show();
		    		resize();
		    	}
	    	});

	    if(d3.selectAll('#navigation li')[0].length > 3){
			d3.selectAll('#cta')
		    	.on('click',function(d,i){
		    		pages.active.hide();
		    		pages['map'].show();
		    		resize();
		    	});
	    }

	    d3.select('#mapWorld div.leaflet-objects-pane')
	    	.append('div')
		    	.attr('class','scrollPane')
		    	.append('div')
			    	.on('click',function(){
			    		if(pages.active.id == 'map') timeline.togglePause();
			    	})
			    	.on('wheel',function(){
			    		if(pages.active.id == 'map') timeline.navigateMap(-d3.event.deltaY);
			    	})

	    d3.select('#mapPage div.button.control-playback')
	    	.on('click',function(){
	    		if(pages.active.id == 'map') timeline.togglePause();
	    	});

	    d3.select('a.control-zoom-out')
	    	.on('click',function(){
	    		mapWorld.setZoom(Math.round(Math.constrain(mapWorld.getZoom()-1,9,17)),{animate:false});
	    		d3.event.stopPropagation();
	    	});

	    d3.select('a.control-zoom-in')
	    	.on('click',function(){
	    		mapWorld.setZoom(Math.round(Math.constrain(mapWorld.getZoom()+1,9,17)),{animate:false});
	    		d3.event.stopPropagation();
	    	});
		
		window.addEventListener('resize',resize);
		resize();

	}


	function resize(){
		var height = getBodyHeight();

		d3.select('#mapPage')
			.style('height',height+'px');

		d3.select('#timeline')
			.style('height',(height-60)+'px');

		d3.select('#video')
			.style('height',Math.round(document.body.clientWidth*0.53) + 'px');

		d3.select('#video iframe')
			.style('height',Math.round(document.body.clientWidth*0.53) + 'px')
			.style('width',document.body.clientWidth + 'px');

		if(timeline) timeline.resize();
	}

});


function getBodyHeight(){
	var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
	var headerHeight = d3.select('#header').node().clientHeight;
	return containerHeight - headerHeight;
}


// kind of buggy, only takes full 13 digit long timestamps for now
function offsetTimezone(t){
	var shorthand = Math.floor(t).length == 10;
	if(shorthand) t*=1000;
	var date = new Date(t);
	var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
	var newDate = new Date(utc + (3600000 * timeOffsets[expeditionYear].timezone)).getTime();
	if(shorthand) newDate /= 1000;
	return newDate;
}



