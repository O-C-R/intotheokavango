

/*
	Describes members' markers on the map
*/


function Member(n, l, d){

	var name = n;
	var pathQueueByDay = [];
	var pathQueue = [];
	var timeCursor = 0;
	var dayCursor = d;
	var latLng = l;
	var tLatLng = new L.LatLng(l.lat,l.lng);
	var icon = L.divIcon({
		className: 'memberMarker', 
		html: '<img src="static/img/beacon.svg"/><p>' + name.charAt(0) + '<span>'+ name.slice(1,name.length) +'</span></p>', 
		iconSize:['50px','40px']});
	var marker = L.marker(latLng, {icon: icon}).addTo(mapWorld);


	d3.select(marker._icon)
		.on('click',focus)

	function addAmbitGeo(d, l, t, c, origin){
		if(!pathQueueByDay[d]) pathQueueByDay[d] = [];
	    // pathQueueByDay[d].push({latLng:origin? l:latLng, time:t, core:c});
	    pathQueueByDay[d].push({latLng:l, time:t, core:c});
	}

	function teleport(time){
		var interval = [];
		var len = pathQueue.length;
		for(var i = 1; i<len-1; i++){
			if((time >= pathQueue[i].time && time < pathQueue[i+1].time) || (time < pathQueue[i].time && i==1) || (time > pathQueue[i+1].time && i==len-2)){
				interval = [pathQueue[i], pathQueue[i+1]];
				timeCursor = i;
				break;
			}
		}
		if(interval.length == 2){
			var lat = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lat, interval[1].latLng.lat);
			var lng = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lng, interval[1].latLng.lng);
			latLng = new L.LatLng(lat,lng);
		} else {}
		marker.setLatLng(latLng);
	}


	function move(time, force){
		if(!time) return;
		var forward = time.current >= time.last;
		var fw = forward ? 1:-1;
		time = time.current;
		var interval = [];
		var len = pathQueue.length;


		// UGLY

		var aga = new Date().getTime();

		if(timeCursor > -1){
			for(var i = Math.constrain(timeCursor-fw,0,len-1); forward?(i<len-1):(i>0); i+=fw){
				if(time >= pathQueue[i + (forward?0:-1)].time && time < pathQueue[i + (forward?1:0)].time){
					interval = [pathQueue[i + (forward?0:-1)], pathQueue[i + (forward?1:0)]];
					timeCursor = i;
					break;
				}
			}
		} else {
			for(var i = 1; i<len-1; i++){
				if(time >= pathQueue[i + (forward?0:-1)].time && time < pathQueue[i + (forward?1:0)].time){
					interval = [pathQueue[i + (forward?0:-1)], pathQueue[i + (forward?1:0)]];
					timeCursor = i;
					break;
				}
			}
		}

		if(interval.length == 2){
			var lat = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lat, interval[1].latLng.lat);
			var lng = Math.map(time, interval[0].time, interval[1].time, interval[0].latLng.lng, interval[1].latLng.lng);
			tLatLng = new L.LatLng(lat,lng);
		} else {
			// console.log('could not find path: ' + name);
		}

		if(force){
			latLng.lat = tLatLng.lat;
			latLng.lng = tLatLng.lng;
		} else {
			latLng.lat = Math.lerp(latLng.lat,tLatLng.lat,0.22);
			latLng.lng = Math.lerp(latLng.lng,tLatLng.lng,0.22);
		}
		marker.setLatLng(latLng);

		if(interval.length==2) return interval[0].core;
		else return true;

	}


	function getLatLng(){
		return latLng;
	}

	function getPathQueue(){
		return pathQueue;
	}

	function getPathQueueByDay(i){
		return pathQueueByDay[i];
	}

	function initPathQueue(){
		pathQueue = [];
	    var len = pathQueueByDay.length;
	    for(var i=0; i<len; i++){
	    	if(pathQueueByDay[i]){
	    		if(i >= 1 && pathQueueByDay[i-1]) pathQueueByDay[i][0].latLng = pathQueueByDay[i-1][pathQueueByDay[i-1].length-1].latLng;
		    	if(pathQueue.length == 0) pathQueue = pathQueueByDay[i];
		    	else pathQueue = pathQueue.concat(pathQueueByDay[i]);
		    }
	    }
	    timeCursor = -1;
	}

	function focus(){
		if(mapWorld.focusMember) mapWorld.focusMember.unfocus();
		d3.select(marker._icon).classed('focused',true);
		d3.select(marker._icon).classed('swollen',false);
		mapWorld.focusMember = loader.members[name];
		mapWorld.dragging.disable();
		// mapWorld.scrollWheelZoom.disable();
		mapLatLng = mapWorld.getCenter();
		timeline.checkUnzoom(false, true);
	}

	function dim(){
		d3.select(marker._icon).classed('swollen',true);
	}

	function light(strength){
		strength = 1-strength;
		if(strength>0){
			d3.select(marker._icon).select('p')
				.style('color','rgb('+(Math.floor(255-strength*180))+',255,'+(Math.floor(255-strength*120))+')');
		}
		d3.select(marker._icon).classed('swollen',false);
	}

	function unfocus(unswollen){
		d3.select(marker._icon).classed('swollen',false);
		d3.select(marker._icon).classed('focused',false);
		d3.select(marker._icon).select('p')
				.style('color',null);
		if(!unswollen){
			mapWorld.focusMember = null;
			mapWorld.dragging.enable();
			// mapWorld.scrollWheelZoom.enable();
		}
	}

	return{
		addAmbitGeo: addAmbitGeo,
		getLatLng: getLatLng,
		name: name,
		marker: marker,
		move: move,
		getPathQueue: getPathQueue,
		getPathQueueByDay: getPathQueueByDay,
		timeCursor: timeCursor,
		initPathQueue: initPathQueue,
		teleport: teleport,
		focus: focus,
		unfocus: unfocus,
		dim: dim,
		light: light,
	}
}

