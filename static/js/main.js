

/*

	API needs :
	- who wears ambit?
	- what are the start and end date of an expedition?
	- allow cross domain queries at least for prototyping
	- problem name on ambit

*/


/* global variables */
var map;
var wanderer;
var debug = false;
var frameCount = 0;

var mapbox_username = "brianhouse"; //"blprnt";
var mapbox_map_id = "oxn5wd2a"; //"vsat7sho";
// var path_to_data = "{{ query }}";
// console.log(path_to_data);

var pages = {};
var panes = [];

var timeline;

var daySkip = false;
var names = ["Steve","Jer","Chris","GB","Giles","Tom"];
var pathQueues = {};
var personMarkers = {};

var focusLatLng = [-19.003049, 22.414856];
var members = {};

var speed = 60;


function init() {
    map = new L.map('map', {
        layers: new L.TileLayer('http://a.tiles.mapbox.com/v3/' + mapbox_username + '.map-' + mapbox_map_id + '/{z}/{x}/{y}.png'),
        zoomControl: false,
        center:new L.LatLng(focusLatLng[0],focusLatLng[1]),
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

    wanderer = newWanderer(map.getCenter());

    pages.about = newPage('about');
    pages.map = newMapPage('map');
    
    pages.journal = newJournalPage('journal');
    pages.data = newPage('data');
    pages.share = newPage('share');

    d3.selectAll('#navigation li')
    	.on('click',function(){
    		var btn = d3.select(this);
    		var t = btn.text().toLowerCase();
    		pages.active.hide();
    		pages[t].show();
    	})

	window.addEventListener('resize',resize);
	resize();

	// var timeline = newTimeline();

	for(var i=0; i<3; i++){
		var p = newPane(i);
		panes.push(p);
	}

	pages.map.show();

	(function animate(){
    	if(pages.active.id == 'about'){
	    	frameCount ++;
	    	wanderer.wander();
	    	var target = wanderer.update();
	    	map.panTo(new L.LatLng(target.y,target.x), {animate:false});
	    }
    	requestAnimationFrame(animate);
    })();

	// LOAD PATH
	loadPaths();


}

function resize(){

	var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
	var headerHeight = d3.select('#header').node().clientHeight;
	var height = containerHeight - headerHeight;

	d3.select('#mapPage')
		.style('height',height+'px');

	d3.select('#timeline')
		.style('height',(height-70)+'px');
}



function newTimeline(t){

	var timeFrame = [t,new Date().getTime()];
	var node = d3.select('#timeline');
	node.append('line')
		.attr('x1','50%')
		.attr('y1',0)
		.attr('x2','50%')
		.attr('y2','100%')
		.attr('stroke','#FFFFFF');
	var timeCursor = timeFrame[0];
	var dayCursor = 0;

	return {
		timeFrame: timeFrame,
		timeCursor: timeCursor,
		dayCursor: dayCursor
	};

}


function newPane(i){

	var node = d3.select('#mapPage div.pane:nth-child(' + (i+1) + ')');

	var show = function(){
		node.classed(i==0?'dimmed':'hidden',false);
	}

	var hide = function(){
		node.classed(i==0?'dimmed':'hidden',true);
	}

	return {
		node: node,
		show: show,
		hide: hide
	};
}


function newMapPage(){

	// Extends Page
	var page = newPage('map');

	page.show = function(){
		page.node.classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		for(var i=0; i<3; i++){
			panes[i].hide();
		}
	}

	return page;
}

function newJournalPage(){

	// Extends Page
	var page = newPage('map');
	page.id = 'journal';
	page.button = d3.select('#navigation li.' + page.id);

	page.show = function(){
		page.node.classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		for(var i=0; i<3; i++){
			panes[i].show();
		}
	}

	page.hide = function(){
		page.node.classed('hidden',true);
		page.button.classed('active',false);
	}

	return page;
}

function newPage(i){

	var id = i;
	var button = d3.select('#navigation li.' + i);
	var node = d3.select('#'+ id + 'Page');

	var show = function(){
		node.classed('hidden',false);
		button.classed('active',true);
		pages.active = this;
		offsetHeader(id=='about');
	}

	var hide = function(){
		node.classed('hidden',true);
		button.classed('active',false);
	}

	var offsetHeader = function(isAbout){
		var header = d3.select('#header');
		if(!isAbout){
			header.style('width','97.2%')
				.style('padding-right','1.4%');
		} else {
			var containerWidth = header.node().clientWidth;
			header.style('width',(97.2 + (15/d3.select('body').node().clientWidth)*100) + '%')
				.style('padding-right',0);

		}
	}

	return{
		id: id,
		button: button,
		node: node,
		show: show,
		hide: hide,
		offsetHeader: offsetHeader
	};
}







function newWanderer(p){
	var pos = {'x':p.lng,'y':p.lat};
	var velocity = {'x':Math.random()*0.002-0.001,'y':Math.random()*0.002-0.001};
	var acceleration = {'x':0,'y':0};
	var r = 0.0003;  // ?
	var wanderTheta = 0;
	// var maxSpeed = 2;
	// var maxForce = 0.05;
	var maxSpeed = 0.000005;
	var maxForce = 0.000000125;


	if(debug){
		var svg = d3.select('#beaconContainer')
	    	.append('svg')
	    	.classed('wanderer',true)

	    svg.append('circle')
	    	.attr('stroke','rgb(255,0,0)')
	    	.attr('fill','none')
	    	.attr('cx',150)
	    	.attr('cy',150)
	    	.attr('r',20)

	    svg.append('rect')
	    	.attr('stroke','rgb(255,0,0)')
	    	.attr('fill','none')
	    	.attr('x',145)
	    	.attr('y',145)
	    	.attr('width',10)
	    	.attr('height',10)

	    svg.append('line')
	    	.attr('stroke','rgb(255,0,0)')
	    	.classed('origin',true)

	    svg.append('line')
	    	.attr('stroke','rgb(255,0,0)')
	    	.classed('target',true)
    }

	var update = function(){

		velocity.x += acceleration.x;
		velocity.y += acceleration.y;
		velocity.x = Math.min(velocity.x, maxSpeed);
		velocity.y = Math.min(velocity.y, maxSpeed);
		pos.x += velocity.x;
		pos.y += velocity.y;
		acceleration.x = 0;
		acceleration.y = 0;


		return pos;
	}

	var wander = function(){

		var wanderR = 0.000018;
		var wanderD = 0.004;
		var change = 0.3;
		wanderTheta += Math.random()*(change*2)-change;
		
		var circlePos = {'x':velocity.x,'y':velocity.y};
		var t = Math.atan2(circlePos.y,circlePos.x);

		circlePos.x = wanderD * Math.cos(t) + pos.x;
		circlePos.y = wanderD * Math.sin(t) + pos.y;

		var t = Math.atan2(velocity.y,velocity.x);
	    var circleOffset = {'x': wanderR*Math.cos(wanderTheta+t), 'y': wanderR*Math.sin(wanderTheta+t)};
	    var target = {'x': circlePos.x + circleOffset.x, 'y': circlePos.y + circleOffset.y}
	    seek(target);

	    if(debug){
		    svg.select('circle')
		    	.attr('cx',150+(circlePos.x - pos.x)*10000)
		    	.attr('cy',150+(-circlePos.y + pos.y)*10000)

		    svg.select('line.target')
		    	.attr('x1',150+(circlePos.x - pos.x)*10000)
		    	.attr('y1',150+(-circlePos.y + pos.y)*10000)
		    	.attr('x2',150+(circlePos.x - pos.x)*10000 + Math.cos(wanderTheta)*20)
		    	.attr('y2',150+(-circlePos.y + pos.y)*10000 - Math.sin(wanderTheta)*20)
	    }

	}

	var applyForce = function(force){
		acceleration.x += force.x;
		acceleration.y += force.y;
	}

	var seek = function(target){
		var desired = {'x':target.x-pos.x,'y':target.y-pos.y};
		var t = Math.atan2(desired.y,desired.x);
	    desired.x = maxSpeed * Math.cos(t);
		desired.y = maxSpeed * Math.sin(t);

		var steer = {'x':desired.x-velocity.x,'y':desired.y-velocity.y};
		var r = Math.sqrt(steer.x*steer.x+steer.y*steer.y);
		r = Math.min(r,maxForce);
		applyForce(steer);
	}
 
	return {
		'update': update,
		'wander': wander,
		'applyForce': applyForce,
		'seek': seek
	};
}

document.addEventListener('DOMContentLoaded', init);





function newMember(n, l){

	var name = n;
	var pathQueue = [];
	var pathTimeCursor = 0;
	var pathDayCursor = 0;
	var latLng = l;
	var icon = L.divIcon({className: 'memberMarker', html: '<p>' + name + '</p>', iconSize:['auto','auto']});
	var marker = L.marker(latLng, {icon: icon}).addTo(map);

	function addAmbitGeo(d, l, t){
		if(!pathQueue[d]) pathQueue[d] = [];
	    pathQueue[d].push({latLng:l, time:t});
	    // if(!pathCursor) pathCursor = pathQueue[d];
	}

	function move(time, forward){
		var len = pathQueue[pathDayCursor].length;
		var interval = [];
		while(interval.length == 0 && pathDayCursor >= 0 && pathDayCursor < 1){
			for(var i=pathTimeCursor; forward?(i<len-1):(i>0); i+= (forward?1:-1)){
				if(time >= pathQueue[pathDayCursor][i + (forward?0:-1)].time && time < pathQueue[pathDayCursor][i + (forward?1:0)].time){
					interval = [pathQueue[pathDayCursor][i + (forward?0:-1)], pathQueue[pathDayCursor][i + (forward?1:0)]];
					pathTimeCursor = i;
					break;
				}
			}
			if(interval.length == 0) pathDayCursor = Math.constraint(pathDayCursor+forward ? 1:-1,0,pathQueue.length-1);
		}

		if(interval.length > 0){
			var lat = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lat, interval[1].latLng.lat);
			var lng = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lng, interval[1].latLng.lng);
			latLng = new L.LatLng(lat,lng);
			marker.setLatLng(latLng);
		}
	}

	function getLatLng(){
		return latLng;
	}

	return{
		addAmbitGeo: addAmbitGeo,
		getLatLng: getLatLng,
		name: name,
		marker: marker,
		move: move,
		pathQueue: pathQueue,
		pathTimeCursor: pathTimeCursor
	}

}



//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////





function loadPaths() {


	var widths = [30,26,16,12]	


	for(var i=0; i<names.length; i++){
		pathQueues[names[i]] = [];
	}

	console.log('loading path');

	var day = 0;

	// var query = 'http://dev.intotheokavango.org/api/features?FeatureType=ambit_geo&Expedition=okavango_14&expeditionDay=0&limit=0'
	// d3.json(query, function(error, data) {
	// 	if(error) return console.log("Failed to load " + query + ": " + e.statusText);
	//    });   

	var data = pathData;
	for(var i=0; i<names.length; i++){
		pathQueues[names[i]][day] = [];
	}
    L.geoJson(data, {
        filter: function(feature, layer) {
	    	//Filter out 0,0 points
	        return (feature.geometry.coordinates[0] != 0);
	    },
	    pointToLayer: function (feature, latLng) {
	    	var name = feature.properties.Member;
	    	var timestamp = feature.properties.t_utc;
	        var marker = L.circleMarker(latLng);
	        // pathQueues[name][day].push({latLng:[latLng.lat, latLng.lng], time:timestamp});
	        return marker;
	    },
	    onEachFeature: function(feature){
	    	var name = feature.properties.Member;
	    	var latLng = L.latLng(feature.geometry.coordinates[1],feature.geometry.coordinates[0]);
	    	var time = feature.properties.t_utc;
	        if(!members[name]) {
	        	members[name] = newMember(name, latLng);
	        	if(Object.keys(members).length == 3) {
	        		timeline = newTimeline(time)
	        	}
	        }
	        members[name].addAmbitGeo(day, latLng, time);
	    }
	});
	
	startAnimation();
}



function startAnimation() {
	
	// focusLatLng[0] = map.getCenter().lat;
	// focusLatLng[1] = map.getCenter().lng;

	// targetLatLng[0] = focusLatLng[0];
	// targetLatLng[1] = focusLatLng[1];

	// map.setView(members['Steve'].latLng,16, {animate:false});
	// console.log(members['Steve'].latLng);
	// console.log(timeline.timeCursor);	

    (function animate(lastFrameTime){

    	var frameTime = new Date().getTime();
    	var frameRate = 1000/(frameTime - lastFrameTime);
        frameCount ++;
		timeline.timeCursor += 60/frameRate;

		for(m in members){
			var member = members[m];
			member.move(timeline.timeCursor,true);
			if(member.name == 'Steve') {
				map.panTo(member.getLatLng(), {animate:false});
			}
		}


        // var sp = daySkip ? 0.4:0.1;
        // for (var i = 0; i < names.length; i++) {
        //     var n = names[i];
        //     if(memberMarkers[n]){
        //         var tpos = [0,0];
        //         if(counters[n] > 1){
        //             var r = Math.max(0,Math.min(1,map(new Date().getTime(),timeInterval[n][0],timeInterval[n][1],0,1)));
        //             tpos[0] = map(r,0,1,previousMemberMarkersTarget[n][0],memberMarkersTarget[n][0]);
        //             tpos[1] = map(r,0,1,previousMemberMarkersTarget[n][1],memberMarkersTarget[n][1]);
        //             var memberLatLon = memberMarkers[n].getLatLng();
        //             memberLatLon.lat += (tpos[0] - memberLatLon.lat) * sp * 2;
        //             memberLatLon.lng += (tpos[1] - memberLatLon.lng) * sp * 2;
        //             memberMarkers[n].setLatLng(memberLatLon);
        //             if(i==0 && tpos[0] != 0) map.setView(memberLatLon, map.getZoom(), {pan:{animate:false}});
        //         }
        //     }
        // }

        requestAnimationFrame(function(){animate(frameTime)});
    })(new Date().getTime()-16);

}




