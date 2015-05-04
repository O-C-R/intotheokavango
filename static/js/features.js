

/*
	Describes every features as displayed on the map and journal's page.
*/



function PhotoPost(feature){

	var feedPos = 0;
	var height = 0;
	var date = new Date(Math.round(parseFloat(feature.properties.t_utc*1000)));
	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var photoUrl = feature.properties.Url;
	var size = feature.properties.Size;


	function getData(){
		return {
			type: 'photo',
			date: date,
			latLng: latLng,
			photoUrl: photoUrl,
			feedPos: feedPos,
			size: size,
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


	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos
	};
}




function TweetPost(feature){

	var feedPos = 0;
	var height = 0;
	var username = feature.properties.Tweet.user.name;
	var message = feature.properties.Tweet.text;
	if(message.substring(0,2).toLowerCase() == 'rt') return null;
	var date = new Date(Math.round(parseFloat(feature.properties.t_utc*1000)));

	// console.log(new Date(feature.properties.t_utc*1000), t.message);

	var latLng = new L.LatLng(feature.geometry.coordinates[0],feature.geometry.coordinates[1]);
	var id = feature.id;
	var photoUrl;
	var size = [];
	try{
		if(feature.properties.Tweet.extended_entities.media[0].type == 'photo'){
			photoUrl = feature.properties.Tweet.extended_entities.media[0].media_url;
			size[0] = feature.properties.Tweet.extended_entities.media[0].sizes.large.w;
			size[1] = feature.properties.Tweet.extended_entities.media[0].sizes.large.h;
		}
	} catch(e){}


	function getData(){
		return {
			type: 'tweet',
			username: username,
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


	return{
		getData: getData,
		getLatLng: getLatLng,
		getFeedPos: getFeedPos,
		setFeedPos: setFeedPos
	};
}

