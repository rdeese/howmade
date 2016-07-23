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
			start: 1004,
			end: 1268,
			name: 'hammock'
		},
		{
			id: 'hyVuHpR6E08',
			start: 18,
			end: 199,
			name: 'condom'
		},
    {
      id: '_P-oLoetj5g',
      start: 978,
      end: 1243,
      name: 'pressure gauge'
    },
    {
      id: 'Sm_-SJ31T0w',
      start: 33,
      end: 297,
      name: 'fishing reel'
    },
    {
      id: 'xUioSOvLTPU',
      name: 'lipstick',
      start: 40,
      end: 297
    },
    {
      id: 'GrVKa8pTMCE',
      name: 'scissors',
      start: 5,
      end: 276
    },
    {
      id: 'pRXBBZsseuM',
      name: 'garden fork',
      start: 33,
      end: 295
    },
    {
      id: 'NBihV_PoGWA',
      name: 'english toffee',
      start: 34,
      end: 291
    },
    {
      id: 'roMJblx9FBM',
      name: 'paint chip card',
      start: 37,
      end: 297
    },
    {
      id: 'fRCja1ph0II',
      name: 'bundt pan',
      start: 38,
      end: 298
    },
    {
      id: 'wvUJZ0nWDL4',
      name: 'pewter flask',
      start: 44,
      end: 299
    },
    {
      id: 'GBzi1daU774',
      name: 'potato salad',
      start: 46,
      end: 299
    },
    {
      id: 'LDwS31OE7ak',
      name: 'hydrogen fuel cell',
      start: 46,
      end: 299
    },
    {
      id: '-U8xy7oHa-I',
      name: 'engineered wood siding',
      start: 32,
      end: 299
    },
    {
      id: 'Bq5Dk8YD1JM',
      name: 'canvas tent',
      start: 41,
      end: 299
    }
	]

  function formatVideoListInPlace(list) {
    var entry;
    for (var i = 0; i < list.length; i++) {
      entry = list[i];
    }
  }

	function fisherYatesShuffleInPlace(array) {
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
		height: '485',
		width: '800',
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
      fs: 1
		}
	});
}

function onPlayerReady(event) {
	nextButton.addEventListener('click', function () {
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
  thingNameSpan.innerHTML = video.name;
  toggleShowAnswer(false);
	player.loadVideoById({ videoId: video.id,
												 startSeconds: video.start,
												 endSeconds: video.end })
}

var thingNameSpan = document.getElementById('thing-name');
var answerButton = document.getElementById('answer-button');
var nextButton = document.getElementById('next-button');

var toggleShowAnswer = (function () {
  var isShowing = false;
  function showAnswer () {
    thingNameSpan.style.display = "inline-block";
    nextButton.style.display = "none";
    answerButton.textContent = "hide the truth";
    isShowing = true;
  };
  function hideAnswer () {
    thingNameSpan.style.display = "none";
    nextButton.style.display = "inline-block";
    answerButton.textContent = "what is this thing?";
    isShowing = false;
  };
  return function (shouldShow) {
    if (shouldShow != null) {
      shouldShow ? showAnswer() : hideAnswer();
    } else {
      isShowing ? hideAnswer() : showAnswer();
    }
  };
})();

answerButton.addEventListener('click', function () {
  toggleShowAnswer();
});
