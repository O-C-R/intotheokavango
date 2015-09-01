

/*
	Describes the journal page's feed.
*/


function Gallery(){

	var node = d3.select('#gallery');
	node.on('wheel', scroll);
	var postsByDay = [];
	var allPosts = [];
	var posts;
	var loading = false;
	var focused = false;
	var focusImg;

	d3.select('#galleryFocus')
	    .on('click', function(){
	    	d3.select(this)
	    		.transition()
	    		.duration(150)
	    		.style('opacity',0)
	    		.each('end',function(){
	    			d3.select(this)
	    				.style('display','none');
	    			d3.select('#galleryPage').classed('focused',false);
	    			focused = false;
	    		})
	    });

	d3.select('#galleryFocus img')
	    .on('click', function(){
	    	d3.event.stopPropagation();
	    });

	function init(day){
		
		// var monthNames = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

		// var newPosts = [];
		// var photos = loader.getPhotos()[day];
		// for(var i=0; i<photos.length; i++){
		// 	// if(photos[i].getMember() != null) newPosts.push(photos[i]);
		// 	newPosts.push(photos[i]);
		// }
		// var instagrams = loader.getInstagrams()[day];
		// for(var i=0; i<instagrams.length; i++){
		// 	// if(instagrams[i].getMember() != null) newPosts.push(instagrams[i]);
		// 	newPosts.push(instagrams[i]);
		// }
		// newPosts.sort(function(a, b){
		// 	return b.getData().date.getTime() - a.getData().date.getTime();
		// });
		// postsByDay[day] = newPosts;
		// allPosts = allPosts.concat(newPosts);
		// allPosts.sort(function(a, b){
		// 	return b.getData().date.getTime() - a.getData().date.getTime();
		// });

		// posts = node.selectAll('div.post')
	 //        .data(allPosts, function(d){ 
	 //        	d = d.getData();
	 //        	return d.date.getTime() + '-' + d.latLng.lat;
	 //        })

	 //    posts.enter()
	 //        .append('div')
	 //        .attr("class", function(d) { return ' post brick ' + d.getData().type; })
	 //        .each(function(d,i){
	 //        	d = d.getData();
	 //        	var t = new Date(offsetTimezone(d.date.getTime()));
	 //        	t = ((parseInt(t.getDate())) + monthNames[t.getMonth()] + ' ' + ((t.getHours()+'').length==1?'0':'') + t.getHours() + ':'+ ((t.getMinutes()+'').length==1?'0':'') +t.getMinutes());
	 //        	d3.select(this)
	 //        		.append('img')
	 //        		.attr('src','http://intotheokavango.org'+d.photoUrl)
	 //        		.attr('alt','Photo taken on ' + t)
	 //        		.on('click',function(){startFocus(d.photoUrl)});

	 //        	var that = this;
	 //        	requestAnimationFrame(function(){
	 //        		d3.select(that).classed('visible',true);
	 //        	})
	 //        });

		// posts.order();

		// resize(posts);
		// window.addEventListener("resize", function(){resize(posts)});

		// if(newPosts.length < 5) loadNewBatch();

	}

	function startFocus(url){

		d3.select('#galleryPage').classed('focused',true);

		d3.select('#galleryFocus')
			.style('display','block')
			.style('margin-top',d3.select('#galleryPage').node().scrollTop +'px')

		focusImg = new Image();
		focusImg.onload = function(){
			d3.select('#galleryFocus').select('img')
				.attr('src','http://intotheokavango.org'+url);
			resizeFocus();
		}
		focusImg.src = 'http://intotheokavango.org'+url;

		requestAnimationFrame(function(){
			d3.select('#galleryFocus')
				.transition()
				.duration(150)
				.style('opacity',1)
		});

		focused = true;
	}


	function resize(bricks) {

		var outerWidth = d3.select('body').node().clientWidth;

		var masonic = d3.masonic()
			.width(function(d) { 
				var w = d.getData().size[0];
				var h = d.getData().size[1];
				if(w >= h){
					w = outerWidth*0.0833*3;
				} else {
					w *= (outerWidth*0.0833*3)/h;
					h = outerWidth*0.0833*3;
				}
				return w;
			})
			.height(function(d) { 
				var w = d.getData().size[0];
				var h = d.getData().size[1];
				if(w >= h){
					h *= (outerWidth*0.0833*3)/w;
					w = outerWidth*0.0833*3;
				} else {
					h = outerWidth*0.0833*3;
				}
				return h;
			})
			.columnWidth(outerWidth*0.0833*3);

		masonic
			.outerWidth(outerWidth)
			.reset();

		bricks
			.datum(masonic)
			.style("width", function(d) { return d.width + "px"; })
			.style("height", function(d) { return d.height + "px"; })
			.style("left", function(d) { return d.x + "px"; })
			.style("top", function(d) { return d.y + "px"; })
			.datum(function(d) {
				return d.data;
			});
		node.style("height", masonic.outerHeight() + "px");

	}	


	function resizeFocus(){

		if(focused){
			var focusImage = d3.select('#galleryFocus img');
			var outerWidth = window.innerWidth;
			outerWidth -= outerWidth*(0.0833*2);
			var outerHeight = window.innerHeight -155;
			var w = focusImg.width;
			var h = focusImg.height;

			if(w/outerWidth >= h/outerHeight){
				var width = Math.min(w,outerWidth);
				focusImage.style('width', width);
			} else {
				var height = Math.min(h,outerHeight);
				focusImage.style('height', height +'px');
			}
		}

	}



	function scroll(){
		var y = d3.select('#galleryPage').node().scrollTop;
		var h = node.node().clientHeight;
		if(y + window.innerHeight > h - 200 + 85 && !loading){
			loadNewBatch();
		}
	}

	function loadNewBatch(){
		var photos = loader.getPhotos();
		for(var i=photos.length-1; i>=0; i--){
			if(!photos[i]){
				loader.loadGallery(i,function(){
					init(i);
					loading = false;
				});
				break;
			}
		}
		loading = true;
	}

	

	return{
		init: init,
		resize: resize
	};
}

