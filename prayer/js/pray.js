$( document ).ready(function() {
    window.god = window.god || {};
    god.init();
    
    var params = {};
    var userId = "";
    var userRealName = "";
    var globalPrayerHtml = "";
    var prayerObj = [];
    var requestId = $.urlParam('requestId');
    var prayerComplete = false;

    getRequest();

    var options = {
	classname: 'prayer-progress-class',
	id: 'prayer-progress'
    };
    var nanobar = new Nanobar( options );

    window.afterGetRequest = function(response) {
	console.log("afterGetRequest success");
	console.log(response);
	var request = response.result[0];
	$("#request-title").html(request.request_title);
	$("#prayer-category").html(request.category_name);
	$("#request-timestamp").html(god.getFormattedTimestamp(request.timestamp));
	$("#user-name-for-request").html(request.real_name);
	userRealName = request.real_name;
	$("#requestor-picture").attr("src", request.picture);

	$("#headerImage").css("background-position", "center center");
	$("#headerImage").css("-webkit-background-size", "cover");
	$("#headerImage").css("-moz-background-size", "cover");
	$("#headerImage").css("-o-background-size", "cover");
	$("#headerImage").css("background-size", "cover");
	$("#headerImage").css("background-attachment", "scroll");
	$("#headerImage").css("color", "#fff");
	$("#headerImage").css("height", "65vh");
	$("#headerImage").css("display", "flex");
	$("#headerImage").css("flex-direction", "column");
	$("#headerImage").css("justify-content", "center");
	$("#headerImage").css("align-items", "center");
	$("#headerImage").css("text-align", "center");
	$("#headerImage").css("background", "linear-gradient(rgba(34, 34, 34, 0.7), rgba(34, 34, 34, 0.7)), url('img/blog/FULL.jpg') no-repeat center center fixed");
	
	getPrayer(request.category_name);
    }
    
    function getRequest() {
	params = {
	    command: 'getRequest',
	    jsonpCallback: 'afterGetRequest',
	    requestId: requestId
	};
	god.sendQuery(params);
    }

    function getPrayer(category) {
	params = {
	    command: 'getPrayer',
	    jsonpCallback: 'afterGetPrayer',
	    category: category
	};
	god.sendQuery(params);
    }

    window.afterGetPrayer = function(response) {
	console.log('afterGetPrayer success');
	console.log(response);
	var prayer = response.result[0];

	// substitute for name and gender
	$.ajax({
	    url: "https://api.genderize.io?name=" + userRealName,
	    dataType: "json",
	    success: function(data) {
		console.log("Success!");
		console.log(data);

		$("#user-name-for-request").html(userRealName);
		
		var prayerText = god.getCustomPrayer(prayer.prayer_text, data.gender, userRealName);
		$("#prayer-title").html(prayer.prayer_title);
		var prayerLines = prayerText.split("\n");
		for (var i = 0; i < prayerLines.length; i++) {
		    var prayerWords = prayerLines[i].split(" ");
		    for (var j = 0; j < prayerWords.length; j++) {
			var newline = "none";
			if (j == 0) {
			    newline = "start";
			}
			if (j == prayerWords.length - 1) {
			    newline = "end";
			}
			var obj = {
			    text: prayerWords[j],
			    done: false,
			    newline: newline
			};
			prayerObj.push(obj);
		    }
		}
		$("#prayer-category").html(prayer.category);
		refreshPrayerDisplay();
	    }
	});
    }

    function refreshPrayerDisplay() {
	var prayerHtml = "<p>";
	for (var i = 0; i < prayerObj.length; i++) {
	    var strongStartTag = "";
	    var strongEndTag = "";
	    
	    if (prayerObj[i].done) {
		strongStartTag = "<strong>";
		strongEndTag = "</strong>";
	    }
	    if (prayerObj[i].newline == "end") {
		prayerHtml += strongStartTag + prayerObj[i].text + strongEndTag + "</p>";
		continue;
	    }
	    if (prayerObj[i].newline == "start") {
		prayerHtml += "<p>" + strongStartTag + prayerObj[i].text + " " + strongEndTag;
		continue;
	    }
	    prayerHtml += strongStartTag + prayerObj[i].text + " " + strongEndTag;
	}
	$("#prayer").html(prayerHtml);
    }

    window.afterPrayFor = function(response) {
	console.log('afterPrayFor success');
	console.log(response);
	if (response.error == 0) {
	    window.location.href = "request-feed.html?pray=true";
	}
    }

    var create_email = false;
    var final_transcript = '';
    var recognizing = false;
    var ignore_onend;
    var start_timestamp;
    if (!('webkitSpeechRecognition' in window)) {
	upgrade();
    } else {
	start_button.style.display = 'inline-block';
	var recognition = new webkitSpeechRecognition();
	recognition.continuous = true;
	recognition.interimResults = true;

	recognition.onstart = function() {
	    recognizing = true;
	    showInfo('info_speak_now');
	    start_img.src = 'img/mic/mic-animate.gif';
	};

	recognition.onerror = function(event) {
	    console.log("ERROR");
	    console.log(event);
	    if (event.error == 'no-speech') {
		start_img.src = "img/mic/mic-slash.gif";
		showInfo('info_no_speech');
		ignore_onend = true;
	    }
	    if (event.error == 'audio-capture') {
		start_img.src = 'img/mic/mic.gif';
		showInfo('info_no_microphone');
		ignore_onend = true;
	    }
	    if (event.error == 'not-allowed') {
		if (event.timeStamp - start_timestamp < 100) {
		    showInfo('info_blocked');
		} else {
		    showInfo('info_denied');
		}
		ignore_onend = true;
	    }
	};

	recognition.onend = function() {
	    recognizing = false;
	    if (ignore_onend) {
		return;
	    }
	    start_img.src = 'img/mic/mic.gif';
	    if (!final_transcript) {
		showInfo('info_start');
		return;
	    }
	    showInfo('');
	    if (window.getSelection) {
		window.getSelection().removeAllRanges();
	    }
	    if (create_email) {
		create_email = false;
		createEmail();
	    }
	};

	recognition.onresult = function(event) {
	    var interim_transcript = '';
	    if (typeof(event.results) == 'undefined') {
		recognition.onend = null;
		recognition.stop();
		upgrade();
		return;
	    }
	    for (var i = event.resultIndex; i < event.results.length; ++i) {
		verifyPrayer(event.results[i][0].transcript);
		if (event.results[i].isFinal) {
		    final_transcript += event.results[i][0].transcript;
		} else {
		    interim_transcript += event.results[i][0].transcript;
		}
	    }
	    final_transcript = capitalize(final_transcript);
	    if (final_transcript || interim_transcript) {
		showButtons('inline-block');
	    }
	};
    }
    
    function cleanWord(wordToClean) {
	var wordToMatch = wordToClean;
	wordToMatch = wordToMatch.trim();
	wordToMatch = wordToMatch.toLowerCase();
	wordToMatch = wordToMatch.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
	return wordToMatch;
    }

    function verifyPrayer(words) {
	if (prayerComplete) return;

	var highlight="background-color: yellow;color: black;";
	var myWords = words.split(" ");;
	var myWord = myWords[myWords.length - 1];
	console.log("myWord = " + myWord);
	
	var i = 0;
	var counter = 0;
	for (i = 0; i < prayerObj.length; i++) {
	    if (!prayerObj[i].done) break;
	}

	var match = false;
	for (var j = i; j < prayerObj.length; j++) {
	    if (cleanWord(prayerObj[j].text) == cleanWord(myWord)) {
		match = true;
		prayerObj[j].done = true;
		if (prayerObj[j-1]) prayerObj[j-1].done = true; // fill in the gaps
		break;
	    }
	    counter++;
	    if (counter >= 5) break;
	}

	console.log(match);

	if (!match) {
	    for (var i = 0; i < prayerObj.length; i++) {
		if (prayerObj[i].done && !prayerObj[i+1].done) {
		    prayerObj[i].done = true;
		    prayerObj[i+1].done = true;
		    break;
		}
	    }
	}

	refreshPrayerDisplay();

	var doneCount = 0;
	for (var i = 0; i < prayerObj.length; i++) {
	    if (prayerObj[i].done) doneCount++;
	}

	var percentComplete = Math.ceil(doneCount / prayerObj.length * 100);
	nanobar.go(percentComplete);

	// done with prayer
	if (percentComplete == 100) {
	    prayerComplete = true;
	    if (recognizing) {
		recognition.stop();
	    }
	    prayForMe();
	}
    }

    window.amen = function() {
	console.log("amen!");
	prayerComplete = true;
	prayForMe();
    }

    $("#amen").hover(function() {
	$(this).css("color", "forestgreen");
    }, function(){
	$(this).css("color", "white");
    });
    
//capture scroll any percentage
$(window).scroll(function(){
    var wintop = $(window).scrollTop(), docheight = $(document).height(), winheight = $(window).height();
    var scrolltrigger = 0.95;

    console.log('wintop='+wintop);
    console.log('docheight='+docheight);
    console.log('winheight='+winheight);
    console.log(wintop+'=='+(docheight-winheight));
    console.log(wintop==(docheight-winheight));
    console.log('%scrolled='+(wintop/(docheight-winheight))*100);
    nanobar.go(wintop/(docheight-winheight)*100);

    if  ((wintop/(docheight-winheight)) > scrolltrigger) {
       console.log('scroll bottom');
   //    lastAddedLiveFunc();
    }
});
    
    function prayForMe() {
	params = {
	    command: "prayFor",
	    jsonpCallback: "afterPrayFor",
	    requestId: requestId,
	    userId: god.userId
	}
	console.log(params);
	god.sendQuery(params);
    }

    function upgrade() {
	start_button.style.visibility = 'hidden';
	showInfo('info_upgrade');
    }

    var two_line = /\n\n/g;
    var one_line = /\n/g;
    function linebreak(s) {
	return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
    }

    var first_char = /\S/;
    function capitalize(s) {
	return s.replace(first_char, function(m) { return m.toUpperCase(); });
    }

    window.startButton = function(event) {
	if (recognizing) {
	    recognition.stop();
	    return;
	}
	final_transcript = '';
	recognition.lang = "en-US";
	recognition.start();
	ignore_onend = false;
	start_img.src = 'img/mic/mic-slash.gif';
	showInfo('info_allow');
	showButtons('none');
	start_timestamp = event.timeStamp;
    }

    function showInfo(s) {
	if (s) {
	    for (var child = info.firstChild; child; child = child.nextSibling) {
		if (child.style) {
		    child.style.display = child.id == s ? 'inline' : 'none';
		}
	    }
	    info.style.visibility = 'visible';
	} else {
	    info.style.visibility = 'hidden';
	}
    }

    var current_style;
    function showButtons(style) {
	if (style == current_style) {
	    return;
	}
	current_style = style;
    }
});
