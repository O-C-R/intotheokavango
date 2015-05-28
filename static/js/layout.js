

/*
	Several classes handling website's pages and tabs/panes
*/


function AboutPage(){

	// Extends Page
	var page = Page('about');
	(function switchBackground(){
		if(pages.active && pages.active.id == 'about'){
			
			page.node.select('#team div.slides img:first-child')
				.transition()
				.style('opacity',0)
				.each('end',function(){
					d3.select(this).remove().style('opacity',1);
					page.node.select('#team div.slides').node().appendChild(this)
				});
		}
		setTimeout(switchBackground,10000);
	})();	


	page.hide = function(){
		page.node.classed('hidden',true);
		page.button.classed('active',false);
		pauseVimeoPlayer();
		d3.select('#aboutPage #video div.cover').remove();
	}

	return page;
}




function Page(i){

	var id = i;
	var button = d3.select('#navigation li.' + i);
	var node = d3.select('#'+ id + 'Page');
	var header = d3.select('#header');

	var show = function(){
		node.classed('hidden',false);
		button.classed('active',true);
		pages.active = this;
		offsetHeader(id=='about' || id=='data');
		// mapWorld.setZoom(id == 'journal' ? 15 : 17, {animate:false});
		header.classed('dark',false);
		d3.select('#night').style('display',(id != 'journal' && id != 'map' ? 'none':'block'));
		updateLoadingScreen(true);
		if(id != 'about') {
			// pauseVimeoPlayer();
		}
	}


	var hide = function(){
		node.classed('hidden',true);
		button.classed('active',false);
	}


	var offsetHeader = function(isPageRelative){
		
		if(!isPageRelative){
			header.style('width','97.2%')
				.style('padding-right','1.4%');
		} else {
			var containerWidth = header.node().clientWidth;
			header.style('width',(97.2 + (15/d3.select('body').node().clientWidth)*100) + '%')
				.style('padding-right',0);
		}
	}


	function getNode(){
		return node;
	}


	return{
		id: id,
		button: button,
		getNode: getNode,
		show: show,
		hide: hide,
		offsetHeader: offsetHeader,
		node: node,
		header: header
	};
}




function MapPage(){

	// Extends Page
	var page = Page('map');


	page.show = function(){
		var lastActive = pages.active;
		page.getNode().classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		if(pages.journal){
			for(var i=0; i<pages.journal.panes.length; i++){
				pages.journal.panes[i].hide();
			}
		}
		if(timeline) {
			if(lastActive.id != 'journal') timeline.togglePause('pause');
			setTimeout(function(){timeline.togglePause('resume');},lastActive.id == 'journal' ? 1000 : 2000);
		}
		mapWorld.setZoom(timeline.getUnzoomState() ? 15 : 17, {animate:lastActive.id=='journal'});
		page.header.classed('dark',true);
		d3.select('#contentContainer').classed('map',true);
		d3.select('#night').style('display',(page.id != 'journal' && page.id != 'map' ? 'none':'block'));
		d3.select('#mapPage div.logos').classed('hidden',false);
		d3.select('#contentContainer').classed('fixed',true);
		updateLoadingScreen(false);
		// pauseVimeoPlayer();
		timeline.checkNightTime();
	}

	page.hide = function(){
		page.getNode().classed('hidden',true);
		page.button.classed('active',false);
		d3.select('#contentContainer').classed('map',false);
		d3.select('#contentContainer').classed('fixed',false);
	}


	return page;
}




function JournalPage(){

	// Extends Page
	var page = Page('map');

	page.id = 'journal';
	page.button = d3.select('#navigation li.' + page.id);
	page.panes = [];
	for(var i=0; i<3; i++){
		var p = PagePane(i);
		page.panes.push(p);
	}


	page.show = function(){
		var lastActive = pages.active;
		page.getNode().classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		for(var i=0; i<3; i++){
			page.panes[i].show();
		}
		if(timeline) timeline.togglePause('pause');
		mapWorld.setZoom(15, {animate:lastActive.id=='map'});
		feed.jump(timeline.getTimeCursor());
		page.header.classed('dark',false);

		page.node.select('.controls').classed('hidden',true);
		d3.select('#night').style('display',(page.id != 'journal' && page.id != 'map' ? 'none':'block'));
		d3.select('#mapPage div.logos').classed('hidden',true);
		updateLoadingScreen(false);
		// pauseVimeoPlayer();
	}


	page.hide = function(){
		page.getNode().classed('hidden',true);
		page.button.classed('active',false);
		page.node.select('.controls').classed('hidden',false);
	}

	return page;
}




function PagePane(i){

	var node = d3.select('#mapPage div.pane:nth-child(' + (i+1) + ')');


	var show = function(){
		node.classed(i==0?'dimmed':'hidden',false);
	}


	var hide = function(){
		node.classed(i==0?'dimmed':'hidden',true);
	}


	function getNode(){
		return node;
	}


	return {
		getNode: getNode,
		show: show,
		hide: hide
	};
}

