

/*
	Interactive timeline on the map and journal page. Also handles all time related interactions.
*/


function Timeline(){

	var timeFrame = [100000000000000,0];
	var totalTimeFrame = [0,new Date().getTime()];
	var node = d3.select('#timeline');
	var height;
	var controlNode = d3.select('div.controls div.control-playback');
	var lastControlState = 'Pause';
	var dayCursor = 0;
	var timeCursor = -1;
	var prevTimeCursor = -1;

	var autoSpeed = 2;
	var speed = autoSpeed;
	var tSpeed = autoSpeed;
	var wheelDelta = 0;
	var paused = false;
	var isNightTime = false;
	var nightTime = [];

	var dayCount = 16;
	var graphicsInitialized = false;
	var dates = [];
	var dayRad = 2.5;
	var margin = 10;
	var cursor;
	var cursorY = 0;
	var cursorTY = 0;
	var cursorHovered = false;
	var cursorDate = new Date();


	node.append('line')
		.attr('x1','80%')
		.attr('y1',margin)
		.attr('x2','80%')
		.attr('y2','100%')
		.attr('stroke','#FFFFFF')
		.style('pointer-events','none');

	var nightNode = d3.select('#map').append('div').attr('id','night');

	function setDates(count,start){
		dates = [];
		dayCount = count;
		var t = new Date(start).getTime()/1000;
		totalTimeFrame[0] = t;
		for(var i=0; i<=dayCount; i++){
			var d = new Date((t+(24*3600*(i)))*1000);
			dates.push(d);
			totalTimeFrame[1] = t+(24*3600*(i));
		}
	}

	function init(day, lastDay){
		for(var i=day-1; i<day+2; i+=2){
			if(i >= 0 && !loader.getLoading()[i]){
				if(i>=0 && i<dayCount){
					loader.loadDay(i,function(day){
						// day = day that was just loaded
						feed.init(day);
						setTimeFrame();
					});
				}
			}
		}
	}	

	function initGraphics(){

		node.selectAll('circle.day')
			.data(dates)
			.enter()
			.append('circle')
			.attr('class','day')
			.attr('cx','80%')
			.attr('r',dayRad)
			.attr('fill','rgb(255,255,255)')
			.style('pointer-events','none');

		cursor = node.append('g')
			.style('pointer-events','none')
			.attr('class','cursor')
			.each(function(){
				d3.select(this)
					.append('text')
					.each(function(){
						d3.select(this)
							.append('tspan')
							.attr('x','66%')
							.attr('dy','-0.8em')
							.text('jun 05');
						d3.select(this)
							.append('tspan')
							.attr('x','66%')
							.attr('dy','1.6em')
							.text('05:05');
					})

				d3.select(this)
					.append('line')
					.attr('x1','90%')
					.attr('x2','100%')
					.attr('stroke','#FFFFFF');

				d3.select(this)
					.append('line')
					.attr('x1','0%')
					.attr('x2','10%')
					.attr('stroke','#FFFFFF');
			})

		node.on('mousemove',function(){
			if(!jumping){
				cursorHovered = true;
				cursorTY = d3.event.layerY-30;
				updateCursor(d3.event.layerY-30);
			}
		}).on('mouseout',function(){
			cursorHovered = false;
		}).on('click',function(){
			cursorHovered = false;
			if(!jumping){
				d3.event.stopPropagation();
				var d = Math.round(Math.constrain(Math.map(d3.event.layerY-30,margin,height-dayRad*2,totalTimeFrame[0],totalTimeFrame[1]),totalTimeFrame[0],totalTimeFrame[1]));
				jumpTo(d);
			}
		});

		resize();

	}

	function resize(){

		height = getBodyHeight()-70;

		node.select('line')
			.attr('y1',margin)
			.attr('y2',height);

		node.selectAll('circle.day')
			.attr('cy',function(d,i){
				return margin + dayRad + (i*((height-margin-dayRad*2)/(dates.length-1)));
			});
	}

	function initTimeCursor(){
		var timestamps = [];
		for(m in loader.members){
			var member = loader.members[m];
			timestamps.push(member.getPathQueue()[0].time);
		}
		timeCursor = timestamps.min();
		prevTimeCursor = timeFrame[0]-1;
		isNightTime = timeCursor >= nightTime[dayCursor][0] || prevTimeCursor < nightTime[dayCursor][1];
	}

	function setTimeFrame(aga){

		var loaded = loader.getLoadedDays();
		if(timeCursor != -1) dayCursor = Math.constrain(Math.floor(Math.map(timeCursor,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount-1);
		timeFrame = [dates[dayCursor].getTime()/1000,dates[dayCursor+1].getTime()/1000-1];
		for(var i=dayCursor-1; i>=0; i--){
			if(loaded[i]) {
				timeFrame[0] = dates[i].getTime()/1000;
			} else break;
		}
		for(var i=dayCursor; i<dates.length-1; i++){
			if(loaded[i]) {
				timeFrame[1] = dates[i+1].getTime()/1000-1;
			} else break;
		}
	}


	function update(frameRate){
		speed = Math.lerp(speed,tSpeed,0.2);
		if(wheelDelta == 0 && Math.abs(tSpeed-speed) < 0.2) {
			updateControl(paused?'Play':'Pause');
		}
		prevTimeCursor = timeCursor;
		timeCursor += (speed*60/frameRate)*(isNightTime ? 300:1) + wheelDelta*(isNightTime && pages.active.id == 'map' ? 20:1);
		timeCursor = Math.constrain(timeCursor, timeFrame[0], timeFrame[1]);

		wheelDelta = 0;

		var day = Math.constrain(Math.floor(Math.map(timeCursor-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
		var lastDay = Math.constrain(Math.floor(Math.map(prevTimeCursor-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
				
		if(day != lastDay) {
			newDay();
		} else{
			for(var i=0; i<2; i++){
				if(timeCursor < nightTime[dayCursor][i] && prevTimeCursor >= nightTime[dayCursor][i]) toggleNightTime(i,false); 
				if(timeCursor >= nightTime[dayCursor][i] && prevTimeCursor < nightTime[dayCursor][i]) toggleNightTime(i,true); 
			}
		}
		updateCursor();
	}

	function updateCursor(hover){
		if(!cursorHovered) cursorTY = margin + Math.map(timeCursor,totalTimeFrame[0],totalTimeFrame[1],0,height-margin-dayRad*2);
		cursorY = Math.lerp(cursorY,cursorTY,0.2);
		cursor.attr('transform','translate(0,'+cursorY+')');
		if(!cursorHovered) cursorDate = new Date(timeCursor*1000);
		else if(hover){
			cursorDate = new Date(Math.constrain(Math.map(hover,margin,height-dayRad*2,totalTimeFrame[0],totalTimeFrame[1]),totalTimeFrame[0],totalTimeFrame[1])*1000);
		}
		var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		var mo = monthNames[cursorDate.getMonth()];
		var da = cursorDate.getDate();
		if(da < 10) da = '0' + da;
		cursor.select('text tspan:first-child').text(mo + ' ' + da);
		var ho = cursorDate.getHours();
		if(ho < 10) ho = '0'+ho;
		var mi = cursorDate.getMinutes();
		if(mi < 10) mi = '0'+mi;
		cursor.select('text tspan:last-child').text(ho + ':' + mi);
	}

	function toggleNightTime(i,forward){
		isNightTime = (i==0 && !forward) || (i==1 && forward);
		timeCursor = nightTime[dayCursor][i] + (forward?1:-1);
		nightNode.classed('night',isNightTime);
	}


	function newDay(){
		var forward = timeCursor > prevTimeCursor;
		dayCursor += forward ? 1 : -1;
		console.log('new day: ' + dayCursor);
		init(dayCursor);
		cullMarkersByDay();
	}

	function cullMarkersByDay(){
		var features = ['sightings', 'tweets', 'photos'];
		for(var k=0; k<features.length; k++){
			var f = loader.getFeatures()[features[k]]
			for(var i=0; i<f.length; i++){
				if(f[i]){
					var len = f[i].length;
					for(var j=0; j<len; j++){
						var sighting = f[i][j];
						if(Math.abs(dayCursor-i)<=1){
							sighting.setVisible(true);
						} else {
							sighting.setVisible(false);
						}
					}
				}
			}
		}
	}

	function navigateMap(delta){
		tSpeed = 0;
		speed = 0;
		requestAnimationFrame(function(){
			tSpeed = paused ? 0 : autoSpeed;
		})
		wheelDelta = -delta/4;
		updateControl(wheelDelta>0?'FastForward':'FastBackward');
		if(pages.active.id == 'map'){
			d3.select('#map div.scrollPane').node().scrollTop = 2000;
		}
	}


	function navigateJournal(t){
		tSpeed = 0;
		speed = 0;
		wheelDelta = t-timeCursor;
	}


	function jumpTo(d){

		function updatePos(){
			var coord = [0,0];
			for(m in loader.members){
				var member = loader.members[m];
				member.teleport(timeCursor);
			}
		}

		function checkNightTime(){
			isNightTime = timeCursor < nightTime[dayCursor][0] || prevTimeCursor >= nightTime[dayCursor][1];
			nightNode.classed('night',isNightTime);
		}

		function resume(){
			feed.init(day);
			init(day);
			setTimeFrame(true);
			checkNightTime();
			jumping = false;
			updatePos();
			if(pages.active.id == 'journal') feed.jump(getTimeCursor());
			if(!paused){
				togglePause('pause');
				setTimeout(function(){
					togglePause('play')
				},2000)
			}
			speed = 0;
			wheelDelta = 0;
			cullMarkersByDay();
		}

		var day = Math.constrain(Math.floor(Math.map(d-4*3600,totalTimeFrame[0],totalTimeFrame[1],0,dayCount)),0,dayCount);
		timeCursor = d;
		prevTimeCursor = timeCursor-1;
		console.log('Jumping to day: ' + day);
		if(!loader.getLoading()[day]){
			jumping = true;
			loader.loadDay(day,function(day){
				resume();
			});
		} else {
			resume();
		}
	}


	function getTimeCursor(){
		return {current: timeCursor, last: prevTimeCursor, day: dayCursor};
	}


	function togglePause(state){
		if(state) paused = state == 'pause';
		else paused = !paused;
		tSpeed = paused ? 0 : autoSpeed;
		updateControl(paused?'Play':'Pause');
	}

	function updateControl(state){
		if(lastControlState != state) controlNode.style('background-image','url("static/img/icon'+state+'.svg")');
		lastControlState = state;
	}

	function setNightTime(day, interval){
		nightTime[day] = interval;
	}

	function getBodyHeight(){
		var containerHeight = d3.select('#mapPage').node().parentNode.parentNode.clientHeight;
		var headerHeight = d3.select('#header').node().clientHeight;
		return containerHeight - headerHeight;
	}

	return {
		init: init,
		initGraphics: initGraphics,
		initTimeCursor: initTimeCursor,
		getTimeCursor: getTimeCursor,
		navigateMap: navigateMap,
		navigateJournal: navigateJournal,
		resize: resize,
		togglePause: togglePause,
		setTimeFrame: setTimeFrame,
		setNightTime: setNightTime,
		update: update,
		updateControl: updateControl,
		setDates: setDates,
		jumpTo: jumpTo
	};
}



