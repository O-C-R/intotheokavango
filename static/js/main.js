

/*


	Okavango 2015 front-end.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html

	API:
	- Should we use Jer's or Brian's mapbox credentials? Should they be hidden?

	TODO IAN: 
	- add location to post meta + link
	- make all post type to inherit from super class
	- test without smooth scroll
	- localstorage for caching data?
	- API error handling
	- replace data loading with promises
	- filter crazy path points
	- remove feed elements that happened before of after the expedition
	- handle scrollbar event for feed navigation?
	- there are 2 getBodyHeight functions

	- some photos are not being displayed on the map?
	- disable click pause on timeline



	KNOWN BUGS
	- jumping + loading not finished
	- links are removed from the end of the tweets
	- scroll map when hovering a marker

	TODOS
	- marker labels and popups
	- transition to 2015
	- linkable features
	- loading screen
	- sound and video features
	- logos
	- medium posts
	- replace share with twitter icon
	
	- core expedition members
	- cross-browser compatibility
	- sightings taxonomy color
	- 'click to pause, scroll to navigate'
	- proper teleport
	- remove global functions/variables

	NICE TO HAVE
	- margin journal alignment with timeline
	- label for day transition
	- finer grained culling
	- heartrate peak feature
	- live mode
	- togglePause highlight on map
	- handle unzoom
	- dim out night sections of timeline
	- highligh journal in nav on new contents
	- add scrolling behavior to markers



*/


// These should eventually be moved into the closure.

var debug = false;
var frameCount = 0;

var mapbox_username = "brianhouse"; //"blprnt";
var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";

var loader;
var pages = {};
var map;
var tweetLayer;
var photoLayer;
var sightingLayer;
var beaconLayer;
var beaconPathLayer;
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
		'query': -1
	},
	'15':{
		'timeAmbit': 0,
		'dateAmbit': 0,
		'tweet': 0,
		'photo': 0,
		'timezone': 4,
		'query': 0
	}
}

// var timeOffset = 8*3600;
// var dayOffset = 2*24*3600;
var paused = false;
var blurred = false;
var jumping = false;


document.addEventListener('DOMContentLoaded', function(){

    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/' + mapbox_username + '.map-' + mapbox_map_id + '/{z}/{x}/{y}.png'),
        zoomControl: false,
        center:new L.LatLng(-19.003049,22.414856),
        attributionControl: false,
        doubleClickZoom: false,
        scrollWheelZoom: true,
        boxZoom: false,
        touchZoom: false,
        dragging: false,
        keyboard: false,
        minZoom: 1,                    
        maxZoom: 20,
        zoom:17,
        scrollWheelZoom:false
    });

 //    //Extend to add labels on circle markers
	// L.CircleMarker.include({

	//     bindLabel: function (content, options) {

	//         if (!this._label || this._label.options !== options) {
	//         	console.log(L.Label)
	//             this._label = new L.Label(options, this);
	//         }

	//         if (!this.label || this.label.options !== options) {
	//             this.label = new L.Label(options, this);
	//         }

	//         this._map = map;
	//         this.label.setContent(content);
	//         this._labelNoHide = options && options.noHide;

	//         if (!this._showLabelAdded) {
	//             if (this._labelNoHide) {
	//                 this
	//                     .on('remove', this.hideLabel, this)
	//                     .on('move', this._moveLabel, this);
	//                 this._showLabel({latlng: this.getLatLng()});
	//             } else {
	//                 this
	//                     .on('mouseover', this._showLabel, this)
	//                     .on('mousemove', this._moveLabel, this)
	//                     .on('mouseout remove', this._hideLabel, this);
	//                 if (L.Browser.touch) {
	//                     this.on('click', this._showLabel, this);
	//                 }
	//             }
	//             this._showLabelAdded = true;
	//         }

	//         return this;
	//     },

	//     unbindLabel: function () {
	//         if (this._label) {
	//             this._hideLabel();
	//             this._label = null;
	//             this._showLabelAdded = false;
	//             if (this._labelNoHide) {
	//                 this
	//                     .off('remove', this._hideLabel, this)
	//                     .off('move', this._moveLabel, this);
	//             } else {
	//                 this
	//                     .off('mouseover', this._showLabel, this)
	//                     .off('mousemove', this._moveLabel, this)
	//                     .off('mouseout remove', this._hideLabel, this);
	//             }
	//         }
	//         return this;
	//     }
	// });

    tweetLayer = new L.layerGroup().addTo(map);
    photoLayer = new L.layerGroup().addTo(map);
    sightingLayer = new L.layerGroup().addTo(map);
    beaconLayer = new L.layerGroup().addTo(map);
    beaconPathLayer = new L.layerGroup().addTo(map);

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
    wanderer = Wanderer(map.getCenter());

    if(d3.selectAll('#navigation li')[0].length > 3){
		pages.map.show();
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
		setPause();
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
					for(m in loader.members){
						var member = loader.members[m];
						member.move(timeline.getTimeCursor());
						var c = member.getLatLng();
						coord[0] += c.lat;
						coord[1] += c.lng;
					}
					coord[0] /= Object.keys(loader.members).length;
					coord[1] /= Object.keys(loader.members).length;
					map.panTo(new L.LatLng(coord[0],coord[1]), {animate:false});

					var matrix = d3.select('#map div.leaflet-map-pane').style('transform').split(', ');
					matrix = matrix[0]+', '+matrix[1]+', '+matrix[2]+', '+matrix[3]+', '+(-1*parseFloat(matrix[4]))+', '+(-1*parseFloat(matrix[5]))+')';
					d3.select('#map div.scrollPane').style('transform',matrix);
					d3.select('#map div.scrollPane').node().scrollTop = 2000;
				
				} else {
					wanderer.wander();
			    	var target = wanderer.update();
			    	map.panTo(new L.LatLng(target.y,target.x), {animate:false});
				}
			}
		}
		requestAnimationFrame(function(){animate(frameTime)});
	}


	function setLayoutInteractions(){			

		d3.selectAll('#navigation li')
	    	.on('click',function(){
	    		var btn = d3.select(this);
	    		var t = btn.text().toLowerCase();
	    		pages.active.hide();
	    		pages[t].show();
	    		resize();
	    	});

	    d3.select('#map div.leaflet-layer')
	    	.append('div')
	    	.attr('class','scrollPane')
	    	.append('div');

		d3.select('#map div.scrollPane div')
	    	.on('mousewheel',function(){
	    		if(pages.active.id == 'map') timeline.navigateMap(d3.event.wheelDeltaY);
	    	});

	    d3.select('#map div.scrollPane div')
	    	.on('click',function(){
	    		if(pages.active.id == 'map') timeline.togglePause();
	    	});

	    d3.select('a.control-zoom-out')
	    	.on('click',function(){
	    		map.setZoom(Math.constrain(map.getZoom()-1,9,17));
	    		d3.event.stopPropagation();
	    	});

	    d3.select('a.control-zoom-in')
	    	.on('click',function(){
	    		map.setZoom(Math.constrain(map.getZoom()+1,9,17));
	    		d3.event.stopPropagation();
	    	});
		
		window.addEventListener('resize',resize);
		resize();

		setPause();	
	}

	function setPause(){
		d3.select('body, iframe')
			.on('blur',function(){
				blurred = true;
			})
		d3.select('body, iframe')
			.on('focus',function(){
				blurred = false;
			})
		d3.select(window)
			.on('blur',function(){
				blurred = true;
			})
		d3.select(window)
			.on('focus',function(){
				blurred = false;
			})
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



