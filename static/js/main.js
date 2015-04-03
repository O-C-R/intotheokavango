

console.log('hello world');


/* global variables */
var map;
var wanderer;

/* create the map */
function initMap () {
    map = new L.map('map', {
        layers: new L.TileLayer("http://a.tiles.mapbox.com/v3/" + mapbox_username + ".map-" + mapbox_map_id + "/{z}/{x}/{y}.png"),
        center: new L.LatLng(-19.003049, 22.414856),
        zoomControl: false,
        attributionControl: false,
        doubleClickZoom: true,
        scrollWheelZoom: true,
        boxZoom: true,
        touchZoom: false,
        dragging: true,
        keyboard: true,
        zoom: 16,
        minZoom: 1,                    
        maxZoom: 20
    });   

    wanderer = createWanderer(map.getCenter());
    (function aga(){
    	wanderer.wander();
    	var target = wanderer.update();
    	map.panTo(new L.LatLng(target.y,target.x), map.getZoom());
    	requestAnimationFrame(aga);
    })();
}



function createWanderer(p){
	console.log(p);
	var pos = {'x':p.lng,'y':p.lat};;
	var velocity = {'x':0.001,'y':0.001};
	var acceleration = {'x':0.001,'y':0.001};
	var r = 0.0006;  // ?
	var wanderTheta = 0;
	// var maxSpeed = 2;
	// var maxForce = 0.05;
	var maxSpeed = 0.00001;
	var maxForce = 0.00000025;


	function update(){

		// console.log('u1', pos.x, pos.y, velocity.x, velocity.y);
		velocity.x += acceleration.x;
		velocity.y += acceleration.y;
		velocity.x = Math.min(velocity.x, maxSpeed);
		velocity.y = Math.min(velocity.y, maxSpeed);
		pos.x += velocity.x;
		pos.y += velocity.y;
		acceleration.x = 0;
		acceleration.y = 0;

		// console.log('u2', pos.x, pos.y, velocity.x, velocity.y);

		return pos;
	}

	function wander(){

		var wanderR = 0.000025;
		var wanderD = 0.00080;
		var change = 0.03;
		wanderTheta += Math.random()*(change*2)-change;
		
		var circlePos = {'x':velocity.x,'y':velocity.y};
		var t = Math.atan(circlePos.y/circlePos.x);
		circlePos.x = wanderD * Math.cos(t) + pos.x;
		circlePos.y = wanderD * Math.sin(t) + pos.y;

		var t = Math.atan(velocity.y/velocity.x);
	    var circleOffset = {'x': wanderR*Math.cos(wanderTheta+t), 'y': wanderR*Math.sin(wanderTheta+t)};
	    var target = {'x': circlePos.x + circleOffset.x, 'y': circlePos.y + circleOffset.y}
	    seek(target);

	}

	function applyForce(force){
		acceleration.x += force.x;
		acceleration.y += force.y;
	}

	function seek(target){
		var desired = {'x':target.x-pos.x,'y':target.y-pos.y};
		var t = Math.atan(desired.y/desired.x);
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



/* executes on load */
$(document).ready(function() {
    initMap();
});

