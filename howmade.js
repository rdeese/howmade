'use strict';

var getNextVideo = (function () {
	var videoList = [
		//{
		//	id: '753cgzmSAi4',
		//	start: 90,
		//	end: 334
		//},
		{
			id: '753cgzmSAi4',
			start: 90,
			end: 93
		},
		{
			id: '753cgzmSAi4',
			start: 0,
			end: 3
		},
		{
			id: '753cgzmSAi4',
			start: 30,
			end: 33
		},
	]

	function fisherYatesShuffleInPlace(array) {
		console.log("shuffling");
		var temp;
		var randomIndex;
		for (var target = array.length-1; target > 0; target--) {
			randomIndex = Math.floor(Math.random()*target)
			temp = array[target];
			array[target] = array[randomIndex];
			array[randomIndex] = temp;
		}
	}

	var videoIndex = 0;
	var nextVideo;
	fisherYatesShuffleInPlace(videoList)

	return function () {
		console.log('getting next video', videoIndex);
		nextVideo = videoList[videoIndex++];
		if (videoIndex == videoList.length) {
			fisherYatesShuffleInPlace(videoList);
			videoIndex = 0;
		}
		return nextVideo;
	};
})();

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady() {
	var video = getNextVideo();
	var player = new YT.Player('player', {
		height: '390',
		width: '640',
		videoId: video.id,
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		},
		playerVars: {
			autohide: 1,
			autoplay: 1,
			controls: 0,
			iv_load_policy: 3,
			modestbranding: 1,
			origin: 'localhost:8080',
			rel: 0,
			showinfo: 0,
			start: video.start,
			end: video.end
		}
	});
}

function onPlayerReady(event) {
	console.log('player is ready');
	event.target.mute();
}

function onPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		console.log('state change is happening');
		loadVideo(event.target, getNextVideo());
	} else {
		console.log('event data', event.data)
	}
}

function loadVideo(player, video) {
	player.loadVideoById({ videoId: video.id,
												 startSeconds: video.start,
												 endSeconds: video.end })
}

