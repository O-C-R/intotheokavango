

/*
	Interactive timeline on the map and journal page. Also handles all time related interactions.
*/


function Timeline(){

	var timeFrame = [0,new Date().getTime()];
	var node = d3.select('#timeline');
	var dayCursor = 0;
	var timeCursor = timeFrame[0];
	var prevTimeCursor = timeFrame[0];
	var speed = 1;
	var tSpeed = 1;
	var wheelDelta = 0;
	var paused = false;


	function init(day){
		if(day == 0){
			node.append('line')
				.attr('x1','50%')
				.attr('y1',0)
				.attr('x2','50%')
				.attr('y2','100%')
				.attr('stroke','#FFFFFF');
		}
		setTimeFrame();
	}	


	function setTimeFrame(){
		var timestamps = [];
		for(m in loader.members){
			var member = loader.members[m];
			timestamps.push(member.pathQueue[0][0].time);
		}
		timeFrame[0] = timestamps.min();
		timestamps = [];
		for(m in loader.members){
			var member = loader.members[m];
			var d = member.pathQueue[member.pathQueue.length-1];
			timestamps.push(d[d.length-1].time);
		}
		timeFrame[1] = timestamps.max();
	}


	function update(frameRate){
		speed = Math.lerp(speed,tSpeed,0.2);
		prevTimeCursor = timeCursor;
		timeCursor += speed*60/frameRate + wheelDelta;
		timeCursor = Math.constrain(timeCursor, timeFrame[0], timeFrame[1]);
		wheelDelta = 0;
		console.log(new Date(timeCursor*1000));
	}


	function navigateMap(delta){
		tSpeed = 0;
		speed = 0;
		requestAnimationFrame(function(){
			tSpeed = paused ? 0 : 1;
		})
		wheelDelta = -delta/4;
		if(pages.active.id == 'map'){
			d3.select('#feed').node().parentNode.scrollTop += delta;
		}
	}


	function navigateJournal(t){
		tSpeed = 0;
		speed = 0;
		requestAnimationFrame(function(){
			tSpeed = paused ? 0 : 1;
		})
		wheelDelta = t-timeCursor;
		if(pages.active.id == 'map'){
			console.log('what?');
			d3.select('#feed').node().parentNode.scrollTop += delta;
		}
	}


	function getTimeCursor(){
		return {current: timeCursor, last: prevTimeCursor, day: dayCursor};
	}


	function togglePause(state){
		if(state) paused = state == 'pause';
		else paused = !paused;
		tSpeed = paused ? 0 : 1;
	}

	return {
		init: init,
		getTimeCursor: getTimeCursor,
		navigateMap: navigateMap,
		navigateJournal: navigateJournal,
		update: update,
		togglePause: togglePause
	};
}

