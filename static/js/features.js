

/*
	Describes every features as displayed on the map and journal's page.
*/


function Sighting(feature, m){

	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var name = feature.properties.SpeciesName;
	var visible = true;
	var marker = m;

	function getData(){
		return {
			type: 'sighting',
			date: date,
			latLng: latLng,
			name: name
		}
	}

	function getLatLng(){
		return latLng;
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) sightingLayer.addLayer(marker);
				else sightingLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		marker: marker,
		setVisible: setVisible
	};
}


function Beacon(feature, m){

	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var visible = true;
	var marker = m;

	function getData(){
		return {
			type: 'beacon',
			date: date,
			latLng: latLng
		}
	}

	function getLatLng(){
		return latLng;
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) sightingLayer.addLayer(marker);
				else sightingLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		marker: marker,
		setVisible: setVisible
	};
}


function PhotoPost(feature, m){
	var feedPos = 0;
	var height = 0;
	// var date = new Date(Math.round(parseFloat(feature.properties.t_utc*1000)));
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].photo)*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var photoUrl = feature.properties.Url;
	var size = feature.properties.Dimensions;
	var visible = true;
	var marker = m;
	var member = feature.properties.Member;
	var notes = feature.properties.Notes;
	// console.log(member);

	function getData(){
		return {
			type: 'photo',
			date: date,
			latLng: latLng,
			photoUrl: photoUrl,
			feedPos: feedPos,
			size: size,
			setFeedPos: setFeedPos,
			height: height,
			notes: notes
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height,
			index: i
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) photoLayer.addLayer(marker);
				else photoLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	function getMember(){
		return member;
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible,
		getMember: getMember
	};
}




function TweetPost(feature, m){

	var tweetProperties = expeditionYear == '15' ? feature.properties : feature.properties.Tweet;

	var feedPos = 0;
	var height = 0;
	var message = expeditionYear == '15' ? tweetProperties.Text : tweetProperties.text;
	if(message.substring(0,2).toLowerCase() == 'rt') return null;
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].tweet)*1000)));
	var visible = true;
	var marker = m;

	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var id = feature.id;
	var url = feature.properties.Url
	var photoUrl;
	var size = [];
	try{
		if(tweetProperties.extended_entities.media[0].type == 'photo'){
			photoUrl = tweetProperties.extended_entities.media[0].media_url;
			size[0] = tweetProperties.extended_entities.media[0].sizes.large.w;
			size[1] = tweetProperties.extended_entities.media[0].sizes.large.h;
		}
	} catch(e){}


	function getData(){
		return {
			type: 'tweet',
			message: message,
			date: date,
			latLng: latLng,
			id: id,
			photoUrl: photoUrl,
			size: size,
			feedPos: feedPos,
			setFeedPos: setFeedPos,
			height: height
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) tweetLayer.addLayer(marker);
				else tweetLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible
	};
}


function BlogPost(feature, m){


	var feedPos = 0;
	var height = 0;
	var title = feature.properties.Title;
	var message = feature.properties.Summary;
	var member = feature.properties.Member;
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].tweet)*1000)));
	var visible = true;
	var marker = m;
	var latLng;
	if(feature.geometry != null) latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	else latLng = new L.LatLng(0,0);
	var id = feature.id;
	var url = feature.properties.Url


	function getData(){
		return {
			type: 'blog',
			message: message,
			title: title,
			date: date,
			latLng: latLng,
			id: id,
			feedPos: feedPos,
			setFeedPos: setFeedPos,
			height: height,
			url: url
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) tweetLayer.addLayer(marker);
				else tweetLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible
	};
}



function SoundPost(feature, m){

	var feedPos = 0;
	var height = 0;
	var notes = feature.properties.Notes;
	var member = feature.properties.Member;
	var date = new Date(Math.round(parseFloat((feature.properties.t_utc+timeOffsets[expeditionYear].tweet)*1000)));
	var visible = true;
	var marker = m;
	var latLng;
	if(feature.geometry != null) latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	else latLng = new L.LatLng(0,0);
	var id = feature.id;
	var url = feature.properties.SoundCloudURL;


	function getData(){
		return {
			type: 'sound',
			notes: notes,
			title: title,
			date: date,
			latLng: latLng,
			id: id,
			feedPos: feedPos,
			setFeedPos: setFeedPos,
			height: height,
			url: url
		}
	}


	function getLatLng(){
		return latLng;
	}


	function setFeedPos(y, h){
		feedPos = y;
		height = h;
	}


	function getFeedPos(){
		return{
			feedPos: feedPos,
			height: height
		};
	}

	function setVisible(v){
		if(v != visible){
			if(marker){
				if(v) tweetLayer.addLayer(marker);
				else tweetLayer.removeLayer(marker);
				visible = v;
			}
		}
	}

	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos,
		marker: marker,
		setVisible: setVisible
	};
}

