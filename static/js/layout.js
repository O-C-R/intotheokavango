

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

	return page;
}




function Page(i){

	var id = i;
	var button = d3.select('#navigation li.' + i);
	var node = d3.select('#'+ id + 'Page');

	var show = function(){
		node.classed('hidden',false);
		button.classed('active',true);
		pages.active = this;
		offsetHeader(id=='about' || id=='data');
		map.setZoom(id == 'journal' ? 15 : 17);
	}


	var hide = function(){
		node.classed('hidden',true);
		button.classed('active',false);
	}


	var offsetHeader = function(isPageRelative){
		var header = d3.select('#header');
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
		node: node
	};
}




function MapPage(){

	// Extends Page
	var page = Page('map');


	page.show = function(){
		page.getNode().classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		if(pages.journal){
			for(var i=0; i<pages.journal.panes.length; i++){
				pages.journal.panes[i].hide();
			}
		}
		if(timeline) timeline.togglePause('resume');
		map.setZoom(page.id == 'journal' ? 15 : 17);
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
		page.getNode().classed('hidden',false);
		page.button.classed('active',true);
		pages.active = this;
		page.offsetHeader(page.id=='about');
		for(var i=0; i<3; i++){
			page.panes[i].show();
		}
		if(timeline) timeline.togglePause('pause');
		map.setZoom(page.id == 'journal' ? 15 : 17);
		feed.jump(timeline.getTimeCursor());
	}


	page.hide = function(){
		page.getNode().classed('hidden',true);
		page.button.classed('active',false);
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

