'use strict';

var getNextVideo = (function () {
	var videoList = [
		{
			id: '753cgzmSAi4',
			start: 90,
			end: 352,
			name: 'bow'
		},
		{
			id: '753cgzmSAi4',
			start: 389,
			end: 658,
			name: 'coffeemaker'
		},
		{
			id: '753cgzmSAi4',
			start: 728,
			end: 963,
			name: 'mascot'
		},
		{
			id: '753cgzmSAi4',
			start: 30,
			end: 33,
			name: 'hammock'
		},
		{
			id: 'hyVuHpR6E08',
			start: 18,
			end: 199,
			name: 'condom'
		}
	]

	function fisherYatesShuffleInPlace(array) {
		console.log('shuffling');
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
	var player = new YT.Player('player', {
		height: '390',
		width: '640',
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
		}
	});
}

function onPlayerReady(event) {
	console.log('player is ready');
	document.getElementById('next-button').addEventListener('click', function () {
		loadVideo(event.target, getNextVideo());
	});
	
	event.target.mute();
	loadVideo(event.target, getNextVideo());
}

var onPlayerStateChange = (function () {
	var seenBuffering = false;
	return function (event) {
		if (event.data == YT.PlayerState.BUFFERING) {
			seenBuffering = true;
		} else if (event.data == YT.PlayerState.ENDED && seenBuffering) {
			seenBuffering = false;
			loadVideo(event.target, getNextVideo());
		} 
	}
})();

function loadVideo(player, video) {
	player.loadVideoById({ videoId: video.id,
												 startSeconds: video.start,
												 endSeconds: video.end })
}

