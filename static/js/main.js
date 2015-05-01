

/*


	Okavango 2015 front-end.
	Please note I have been using the following javascript pattern: 
	http://radar.oreilly.com/2014/03/javascript-without-the-this.html

	API NEEDS :
	- Should we use Jer's or Brian's mapbox credentials? Should they be hidden?

	TODO IAN: 
	- handle group split
	- time control button
	- add preloader graphics
	- add location to post meta + link
	- make all post type to inherit from super class
	- test without smooth scroll
	- localstorage for caching data?
	- API error handling
	- layout transitions
	- replace data loading with promises
	- set expedition duration
	- pause when blurred
	- filter crazy path points
	- remove feed elements that happened before of after the expedition
	- highlight new days' meta node
	- handle scrollbar event for feed navigation?
	- tweets offset by one day
	- there are 2 getBodyHeight functions

*/


// These should eventually be moved into the closure.

var debug = false;
var frameCount = 0;

var mapbox_username = "brianhouse"; //"blprnt";
var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";

var loader;
var pages = {};
var map;
var timeline;
var feed;
var wanderer;

var timeOffset = 8*3600;
var paused = false;


document.addEventListener('DOMContentLoaded', function(){

	setVimeoCover();

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
        zoom:17
    });



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
		loader.loadDay(timeline.getTimeCursor().day,function(day){
			timeline.setTimeFrame();
			feed.init(day);
			timeline.init(day);
			animate(new Date().getTime()-16);
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
		    frameCount ++;
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
			} else {
				wanderer.wander();
		    	var target = wanderer.update();
		    	map.panTo(new L.LatLng(target.y,target.x), {animate:false});
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

		d3.select('#contentContainer')
	    	.on('mousewheel',function(){
	    		if(pages.active.id == 'map') timeline.navigateMap(d3.event.wheelDeltaY);
	    	});

	    d3.select('#mapPage')
	    	.on('click',function(){
	    		if(pages.active.id == 'map') timeline.togglePause();
	    	});

	    d3.select('a.control-zoom-out')
	    	.on('click',function(){
	    		map.setZoom(Math.constrain(map.getZoom()-1,9,17));
	    	});

	    d3.select('a.control-zoom-in')
	    	.on('click',function(){
	    		map.setZoom(Math.constrain(map.getZoom()+1,9,17));
	    	});
		
		window.addEventListener('resize',resize);
		resize();

		setPause();	
	}

	function setPause(){
		d3.select('body, iframe')
			.on('blur',function(){
				paused = true;
			})
		d3.select('body, iframe')
			.on('focus',function(){
				paused = false;
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


	function getBodyHeight(){
		var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
		var headerHeight = d3.select('#header').node().clientHeight;
		return containerHeight - headerHeight;
	}


	function setVimeoCover(){
		var player = d3.select('iframe').node();
	    var playerOrigin = '*';

        window.addEventListener('message', onMessageReceived, false);
	    function onMessageReceived(event) {
	        if (!(/^https?:\/\/player.vimeo.com/).test(event.origin)) {
	            return false;
	        }	        
	        if (playerOrigin === '*') {
	            playerOrigin = event.origin;
	        }
	        var data = JSON.parse(event.data);
	        if(data.event == 'ready') onReady();
	        if(data.event == 'play') onPlay();
	    }

	    function onReady() {
	        var data = {
	          method: 'addEventListener',
	          value: 'play'
	        };
	        var message = JSON.stringify(data);
	        player.contentWindow.postMessage(data, playerOrigin);
	    }

	    function onPlay(){
	    	d3.select('#aboutPage #video div.cover')
	    		.transition()
	    		.style('opacity',0)
	    		.remove();
	    }
	}

});



