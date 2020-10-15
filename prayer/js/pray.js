$( document ).ready(function() {
    window.god = window.god || {};
    
    var params = {};
    var userId = "";
    var globalPrayerHtml = "";
    var prayerObj = [];
    var requestId = $.urlParam('requestId');
    
    god.login();
    getRequest();
    
    window.afterGetRequest = function(response) {
	console.log("afterGetRequest success");
	console.log(response);
	var request = response.result[0];
	$("#request-title").html(request.request_title);
	$("#prayer-category").html(request.category_name);
	$("#request-timestamp").html(god.getFormattedTimestamp(request.timestamp));
	$("#user-name").html(request.user_name);
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

    function prayFor() {
	params = {
	    command: 'prayFor',
	    jsonpCallback: 'afterPrayFor',
	    userId: userId,
	    requestId: '456'
	};
	sendQuery(params);
    }

	window.afterGetPrayer = function(response) {
	    console.log('afterGetPrayer success');
	    console.log(response);
	    var prayer = response.result[0];
	    $("#prayer-title").html(prayer.prayer_title);
	    var prayerLines = prayer.prayer_text.split("\n");
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
	    //start_img.src = '/intl/en/chrome/assets/common/images/content/mic-animate.gif';
	    //start_img.src = "img/users/7.jpg";
	};

	recognition.onerror = function(event) {
	    console.log("ERROR");
	    console.log(event);
	    if (event.error == 'no-speech') {
		//start_img.src = "img/users/11.jpg";
		showInfo('info_no_speech');
		ignore_onend = true;
	    }
	    if (event.error == 'audio-capture') {
		//start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
		//start_img.src = "img/users/4.jpg";
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
	    //start_img.src = '/intl/en/chrome/assets/common/images/content/mic.gif';
	    if (!final_transcript) {
		showInfo('info_start');
		return;
	    }
	    showInfo('');
	    if (window.getSelection) {
		window.getSelection().removeAllRanges();
		var range = document.createRange();
		range.selectNode(document.getElementById('final_span'));
		window.getSelection().addRange(range);
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
		if (event.results[i].isFinal) {
		    final_transcript += event.results[i][0].transcript;
		} else {
		    interim_transcript += event.results[i][0].transcript;
		}
	    }
	    final_transcript = capitalize(final_transcript);
	    verifyPrayer(linebreak(interim_transcript));
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
	var highlight="background-color: yellow;color: black;";
	var myWords = words.split(" ");;
	var myWord = myWords[myWords.length - 1];

	for (var i = 0; i < prayerObj.length; i++) {
	    if (prayerObj[i].done) continue;
	    if (cleanWord(prayerObj[i].text) == cleanWord(myWord)) {
		prayerObj[i].done = true;
		break;
	    }
	}

	refreshPrayerDisplay();

	var doneCount = 0;
	for (var i = 0; i < prayerObj.length; i++) {
	    if (prayerObj[i].done) doneCount++;
	}

	var percentComplete = Math.ceil(doneCount / prayerObj.length * 100);
	console.log(percentComplete + "%");
	$("#percent-complete").html(percentComplete + "%");
	
//	for (var i = 0; i < myWords.length; i++) {
//	    var myWord = myWords[i];
//	    var index = globalPrayerHtml.indexOf(myWord);
/*	    var prayerText = globalPrayerHtml.replace(
		new RegExp("\\b" + myWord + "\\b"),
		"<span style='" + highlight + "'>" + myWord + "</span>"
	    );
*/
/*	    var prayerText = globalPrayerHtml.replace(
		new RegExp("\\b" + myWord + "\\b"),
		"<strong>" + myWord + "</strong>"
	    );
*/
//	    var prayerText = replaceAt(globalPrayerHtml, index, "<strong>" + myWord + "</string>");
//	    $("#prayer").html(prayerText);
//	}
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
	//start_img.src = '/intl/en/chrome/assets/common/images/content/mic-slash.gif';
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
