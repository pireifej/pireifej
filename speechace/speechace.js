var gettingResults = 0;
var totalInsightScore = 0;

navigator.mediaDevices.getUserMedia({audio:true})
    .then(stream => {handlerFunction(stream)})

function handlerFunction(stream) {
    rec = new MediaRecorder(stream);
    rec.ondataavailable = e => {
        audioChunks.push(e.data);
        if (rec.state == "inactive"){
            let blob = new Blob(audioChunks,{type:'audio/mpeg-3'});
            recordedAudio.src = URL.createObjectURL(blob);
            recordedAudio.controls=true;
            recordedAudio.autoplay=true;

            uploadSoundData(blob)
        }
    }
}

function uploadSoundData(blob) {
//    var gFileData = new File([imageResized], img.name, {
//        type: "image/jpg",
//    });

    var formData = new FormData();
    formData.append("fileToUpload", blob);

    $.ajax({
        url: "upload.php",
        dataType: 'script',
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        type: 'post',
        success: function(response){
            console.log("upload.php success");
            console.log(response);
            var json = JSON.parse(response);
            console.log(json);
	    
            if (json.error == 1) {
                console.log("error:" + json.message);
            }
            if (json.error == 0) {
                console.log("success:" + json.message);
            }
        }
    });
}

function sendData(blob) {

    var fd = new FormData();
    fd.append('fname', 'test.wav');
    fd.append('data', blob);
    console.log(blob.src);
    
    $.ajax({
	type: 'POST',
	url: "https://prayoverus.com:3001/saveAudioFile",
	data: fd,
	processData: false,
	contentType: false
    }).done(function(data) {
	console.log(data);
    });
    return;
    // call ajax
    var port = "3001";
    
    const url = "https://prayoverus.com:" + port + "/saveAudioFile";
	var headers = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	};

//    const formData = new FormData();
//    formData.append('audio-file', blob);
    //    console.log(formData);

    console.log(blob);
    var options = {
	method : "POST",
	cache: "no-cache",
	headers: headers,
	body: JSON.stringify({"data":blob})
    };
    fetch(url, options)
	.then((response) => {
	    if (!response.ok) {
		console.log("ERROR RESULT");
		throw new Error(response.error)
	    }
	    console.log("SUCCESS RESULT");
	    console.log(response);
	    return response.json();
	})
	.then(data => {
	    console.log("SUCCESS RESULT WITH DATA");
	    console.log(data);
	})
	.catch(function(error) {
	    console.log("FAILED");
	    console.log(error);
	});
}

function displaySpeechMetric(name, value, min, max) {
    // badge-primary - blue
    // badge-info - light-blue
    // badge-warning - yellow
    // badge-danger - red
    $("#" + name).html(value);
    const negativeText = "LOW";
    const positiveText = "HIGH";
    const neutralText = "FINE";

    if (name == "all-pause-count" || name == "all-pause-duration") {
	if (value <= min) {
	    $("#" + name + "-status").addClass("badge-primary");
	    $("#" + name + "-status-text").html(positiveText);
	    totalInsightScore++;
	    return;
	}
	if (value >= max) {
	    $("#" + name + "-status").addClass("badge-danger");
	    $("#" + name + "-status-text").html(negativeText);
	    return;
	}
    } else if (name == "cefr-score-1" || name == "cefr-score-2") {
	if (value == "A1" || value == "A2" || value == "A2+") {
	    $("#" + name + "-status").addClass("badge-danger");
	    $("#" + name + "-status-text").html(negativeText);
	    return;
	}
	if (value == "C2") {
	    $("#" + name + "-status").addClass("badge-primary");
	    $("#" + name + "-status-text").html(positiveText);
	    totalInsightScore++;
	    return;
	}
    } else {
	if (value >= max) {
	    $("#" + name + "-status").addClass("badge-primary");
	    $("#" + name + "-status-text").html(positiveText);
	    totalInsightScore++;
	    return;
	}
	if (value <= min) {
	    $("#" + name + "-status").addClass("badge-danger");
	    $("#" + name + "-status-text").html(negativeText);
	    return;
	}
    }
    
    $("#" + name + "-status").addClass("badge-info");
    $("#" + name + "-status-text").html(neutralText);
    totalInsightScore++;
}

function getAdvice() {
    // call ajax
    var port = "3001";
    var params = {
	"request": "if someone stutters and has a block and repitition on F sounds, what non-medical advice can you give them?"
    };
    const url = "https://prayoverus.com:" + port + "/openAI";
	var headers = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	};
	var options = {
	    method : "POST",
	    cache: "no-cache",
	    headers: headers,
	    body: JSON.stringify(params)
	};
	fetch(url, options)
	    .then((response) => {
		if (!response.ok) {
		    console.log("ERROR RESULT");
		    throw new Error(response.error)
		}
		console.log("SUCCESS RESULT");
		console.log(response);
		return response.json();
	    })
	.then(data => {
	    console.log("yay");
	    console.log(data.result);
	    $("#advice-text").html(data.result);
	    $("#advice-header").html("Done");
	})
	.catch(function(error) {
	    console.log("FAILED");
	    console.log(error);
	});
}

function getSpeechMetrics() {
    // call ajax
    var port = "3001";
    var params = {
    };
    const url = "https://prayoverus.com:" + port + "/getSpeechMetrics";
	var headers = {
	    'Accept': 'application/json',
	    'Content-Type': 'application/json'
	};
	var options = {
	    method : "POST",
	    cache: "no-cache",
	    headers: headers,
	    body: JSON.stringify(params)
	};
	fetch(url, options)
	    .then((response) => {
		if (!response.ok) {
		    console.log("ERROR RESULT");
		    throw new Error(response.error)
		}
		console.log("SUCCESS RESULT");
		console.log(response);
		return response.json();
	    })
	    .then(data => {
		console.log("SUCCESS RESULT WITH DATA");
		$("#refresh-btn").html("Done");
		displayMetrics(data);
	    })
	    .catch(function(error) {
		console.log("FAILED");
		console.log(error);
	    });
}

function displayMetrics(data) {
    var textScore = data.text_score;
    console.log(textScore);

    var ieltsScore1 = textScore.ielts_score.fluency;
    displaySpeechMetric("ielts-score-1", ieltsScore1, 5.5, 8.5);

    var pteScore1 = textScore.pte_score.fluency;
    displaySpeechMetric("pte-score-1", pteScore1, 45, 90);
    
    var speechaceScore1 = textScore.speechace_score.fluency;
    displaySpeechMetric("speechace-score-1", speechaceScore1, 63, 95);
		
    var toeicScore1 = textScore.toeic_score.fluency;
    displaySpeechMetric("toeic-score-1", toeicScore1, 110, 190);
		
    var cefrScore1 = textScore.cefr_score.fluency;
    displaySpeechMetric("cefr-score-1", cefrScore1, 0, 0);

    var segmentMetricsList = textScore.fluency.segment_metrics_list[0];
		
    var articulationLength = segmentMetricsList.articulation_length;
    displaySpeechMetric("articulation-length", articulationLength, 3.16, 16);
		
    var speechRate = segmentMetricsList.speech_rate;
    var speechRateRounded = Math.round(speechRate * 100) / 100
    displaySpeechMetric("speech-rate", speechRateRounded, 1.45, 3);
		
    var articulationRate = segmentMetricsList.articulation_rate;
    var articulationRateRounded = Math.round(articulationRate * 100) / 100
    displaySpeechMetric("articulation-rate", speechRateRounded, 1.45, 3);
		
    var syllableCorrectPerMinute = segmentMetricsList.syllable_correct_per_minute;
    var syllableCorrectPerMinuteRounded = Math.round(syllableCorrectPerMinute * 100) / 100
    displaySpeechMetric("syllable-correct-per-min", syllableCorrectPerMinuteRounded, 8, 220);
		
    var allPauseCount = segmentMetricsList.all_pause_count;
    displaySpeechMetric("all-pause-count", allPauseCount, 3, 30);
		
    var allPauseDuration = segmentMetricsList.all_pause_duration;
    displaySpeechMetric("all-pause-duration", allPauseDuration, 1.5, 25);

    var ieltsScore2 = segmentMetricsList.ielts_score.fluency;
    displaySpeechMetric("ielts-score-2", ieltsScore2, 5, 8.5);
		
    var pteScore2 = segmentMetricsList.pte_score.fluency;
    displaySpeechMetric("pte-score-2", pteScore2, 49, 90);
		
    var speechaceScore2 = segmentMetricsList.speechace_score.fluency;
    displaySpeechMetric("speechace-score-2", speechaceScore2, 66, 95);
		
    var toeicScore2 = segmentMetricsList.toeic_score.fluency;
    displaySpeechMetric("toeic-score-2", toeicScore2, 119, 190);
    
    var cefrScore2 = segmentMetricsList.cefr_score.fluency;
    displaySpeechMetric("cefr-score-2", cefrScore2, 0, 0);

    $("#total-insight-score-label").html("calculated just now");
    var totalInsightScoreForever = (totalInsightScore / 16) * 100;
    $("#total-insight-score-heading").html(totalInsightScoreForever + "%");

		// pie chart colors
		// 0 - blue
		// 1 - red
		// 2 - yellow
		// 3 - darkyellow
		// 4 - black
		// 5 - green
		    new Chartist.Pie('#ct-chart9', {
			series: [0, 0, 0, 0, 100-totalInsightScoreForever, totalInsightScoreForever]
    }, {
        donut: true,
        donutWidth: 20,
        donutSolid: true,
        startAngle: 270,
        showLabel: false
    });

    $("#refresh-btn").html("Refresh");
    totalInsightScore = 0;
}

$("#get-advice-button").click(function() {
    console.log("get advice..");
    getAdvice();
    $("#advice-header").html("Loading...");
});

$("#refresh-btn").click(function() {
    console.log("REFRESH CLICK");
    $("#refresh-btn").html("Loading..");

    //getSpeechMetrics();

    var data = {};

    if (gettingResults == 0) {
	data = {"status":"success","quota_remaining":-1,"text_score":{"text":"'And I have one sister. She likes being a doctor and finding out things. And I like doing football. And I want to be a football player when I'm older.'","word_score_list":[{"word":"And","quality_score":57,"phone_score_list":[{"phone":"ae","stress_level":1,"extent":[141,165],"quality_score":96.25,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ae"},{"phone":"n","stress_level":null,"extent":[165,180],"quality_score":76.06666666666666,"word_extent":[1,2],"sound_most_like":"dh","child_phones":[{"extent":[165,174],"quality_score":99,"sound_most_like":"n"},{"extent":[174,180],"quality_score":41.666666666666664,"sound_most_like":"dh"}]},{"phone":"d","stress_level":null,"extent":[180,180],"quality_score":0,"word_extent":[2,3],"sound_most_like":null}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"and","quality_score":57,"stress_score":100,"predicted_stress_level":1,"extent":[141,180]}]},{"word":"I","quality_score":58,"phone_score_list":[{"phone":"ay","stress_level":1,"extent":[180,186],"quality_score":58.00000000000001,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ah"}],"syllable_score_list":[{"phone_count":1,"stress_level":1,"letters":"i","quality_score":58,"stress_score":100,"predicted_stress_level":0,"extent":[180,186]}]},{"word":"have","quality_score":85,"phone_score_list":[{"phone":"hh","stress_level":null,"extent":[186,195],"quality_score":72.33333333333333,"word_extent":[0,1],"sound_most_like":"t"},{"phone":"ae","stress_level":1,"extent":[195,213],"quality_score":83.44444444444444,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"ae"},{"phone":"v","stress_level":null,"extent":[213,222],"quality_score":98,"word_extent":[2,4],"sound_most_like":"v"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"have","quality_score":85,"stress_score":100,"predicted_stress_level":0,"extent":[186,222]}]},{"word":"one","quality_score":100,"phone_score_list":[{"phone":"w","stress_level":null,"extent":[222,234],"quality_score":99.75,"word_extent":[0,1],"sound_most_like":"w"},{"phone":"ah","stress_level":1,"extent":[234,246],"quality_score":99,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ah"},{"phone":"n","stress_level":null,"extent":[246,255],"quality_score":100,"word_extent":[1,3],"sound_most_like":"n"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"one","quality_score":100,"stress_score":100,"predicted_stress_level":1,"extent":[222,255]}]},{"word":"sister","quality_score":95,"phone_score_list":[{"phone":"s","stress_level":null,"extent":[255,273],"quality_score":82.83333333333333,"word_extent":[0,1],"sound_most_like":"s","child_phones":[{"extent":[255,270],"quality_score":92.4,"sound_most_like":"sh"},{"extent":[270,273],"quality_score":35,"sound_most_like":"y"}]},{"phone":"ih","stress_level":1,"extent":[273,285],"quality_score":96.25,"stress_score":0,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"ih"},{"phone":"s","stress_level":null,"extent":[285,303],"quality_score":100,"word_extent":[2,3],"sound_most_like":"s"},{"phone":"t","stress_level":null,"extent":[303,312],"quality_score":97,"word_extent":[3,4],"sound_most_like":"t"},{"phone":"er","stress_level":0,"extent":[312,336],"quality_score":97.875,"stress_score":0,"predicted_stress_level":1,"word_extent":[4,6],"sound_most_like":"er"}],"ending_punctuation":".","syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"sis","quality_score":93,"stress_score":0,"predicted_stress_level":0,"extent":[255,303]},{"phone_count":2,"stress_level":0,"letters":"ter","quality_score":97,"stress_score":0,"predicted_stress_level":1,"extent":[303,336]}]},{"word":"She","quality_score":99,"phone_score_list":[{"phone":"sh","stress_level":null,"extent":[375,393],"quality_score":100,"word_extent":[0,2],"sound_most_like":"sh"},{"phone":"iy","stress_level":1,"extent":[393,399],"quality_score":97.5,"stress_score":100,"predicted_stress_level":1,"word_extent":[2,3],"sound_most_like":"iy"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"she","quality_score":99,"stress_score":100,"predicted_stress_level":1,"extent":[375,399]}]},{"word":"likes","quality_score":86,"phone_score_list":[{"phone":"l","stress_level":null,"extent":[399,417],"quality_score":76.16666666666667,"word_extent":[0,1],"sound_most_like":"ah","child_phones":[{"extent":[399,402],"quality_score":80,"sound_most_like":"y"},{"extent":[402,408],"quality_score":39.5,"sound_most_like":"ah"},{"extent":[408,417],"quality_score":99.33333333333333,"sound_most_like":"l"}]},{"phone":"ay","stress_level":1,"extent":[417,429],"quality_score":98.25,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"ay"},{"phone":"k","stress_level":null,"extent":[429,438],"quality_score":76.33333333333333,"word_extent":[2,3],"sound_most_like":"jh","child_phones":[{"extent":[429,435],"quality_score":97,"sound_most_like":"k"},{"extent":[435,438],"quality_score":35,"sound_most_like":"jh"}]},{"phone":"s","stress_level":null,"extent":[438,447],"quality_score":94.33333333333333,"word_extent":[4,5],"sound_most_like":"s"}],"syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"likes","quality_score":86,"stress_score":100,"predicted_stress_level":0,"extent":[399,447]}]},{"word":"being","quality_score":73,"phone_score_list":[{"phone":"b","stress_level":null,"extent":[447,459],"quality_score":96,"word_extent":[0,1],"sound_most_like":"b"},{"phone":"iy","stress_level":1,"extent":[459,474],"quality_score":81.4,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"iy"},{"phone":"ih","stress_level":0,"extent":[474,486],"quality_score":79.625,"stress_score":100,"predicted_stress_level":0,"word_extent":[2,3],"sound_most_like":"ah"},{"phone":"ng","stress_level":null,"extent":[486,490],"quality_score":35,"word_extent":[3,5],"sound_most_like":"d"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"be","quality_score":89,"stress_score":100,"predicted_stress_level":1,"extent":[447,474]},{"phone_count":2,"stress_level":0,"letters":"ing","quality_score":57,"stress_score":100,"predicted_stress_level":0,"extent":[474,490]}]},{"word":"a","quality_score":0,"phone_score_list":[{"phone":"ah","stress_level":0,"extent":[490,490],"quality_score":0,"stress_score":0,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":null}],"syllable_score_list":[{"phone_count":1,"stress_level":0,"letters":"a","quality_score":0,"stress_score":0,"predicted_stress_level":0,"extent":[490,490]}]},{"word":"doctor","quality_score":97,"phone_score_list":[{"phone":"d","stress_level":null,"extent":[490,504],"quality_score":99.14285714285714,"word_extent":[0,1],"sound_most_like":"d"},{"phone":"aa","stress_level":1,"extent":[504,522],"quality_score":100,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"aa"},{"phone":"k","stress_level":null,"extent":[522,531],"quality_score":98,"word_extent":[2,3],"sound_most_like":"k"},{"phone":"t","stress_level":null,"extent":[531,546],"quality_score":95.4,"word_extent":[3,4],"sound_most_like":"t"},{"phone":"er","stress_level":0,"extent":[546,579],"quality_score":94.45454545454545,"stress_score":0,"predicted_stress_level":1,"word_extent":[4,6],"sound_most_like":"er"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"doc","quality_score":99,"stress_score":100,"predicted_stress_level":1,"extent":[490,531]},{"phone_count":2,"stress_level":0,"letters":"tor","quality_score":95,"stress_score":0,"predicted_stress_level":1,"extent":[531,579]}]},{"word":"and","quality_score":64,"phone_score_list":[{"phone":"ae","stress_level":1,"extent":[645,666],"quality_score":95.71428571428571,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ae"},{"phone":"n","stress_level":null,"extent":[666,675],"quality_score":97.66666666666667,"word_extent":[1,2],"sound_most_like":"n"},{"phone":"d","stress_level":null,"extent":[675,675],"quality_score":0,"word_extent":[2,3],"sound_most_like":null}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"and","quality_score":64,"stress_score":100,"predicted_stress_level":1,"extent":[645,675]}]},{"word":"finding","quality_score":93,"phone_score_list":[{"phone":"f","stress_level":null,"extent":[675,684],"quality_score":100,"word_extent":[0,1],"sound_most_like":"f"},{"phone":"ay","stress_level":1,"extent":[684,702],"quality_score":99.83333333333333,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"ay"},{"phone":"n","stress_level":null,"extent":[702,711],"quality_score":99.33333333333333,"word_extent":[2,3],"sound_most_like":"n"},{"phone":"d","stress_level":null,"extent":[711,717],"quality_score":61.5,"word_extent":[3,4],"sound_most_like":"th","child_phones":[{"extent":[711,714],"quality_score":88,"sound_most_like":"l"},{"extent":[714,717],"quality_score":35,"sound_most_like":"th"}]},{"phone":"ih","stress_level":0,"extent":[717,726],"quality_score":98.33333333333333,"stress_score":100,"predicted_stress_level":0,"word_extent":[4,5],"sound_most_like":"ih"},{"phone":"ng","stress_level":null,"extent":[726,732],"quality_score":100,"word_extent":[5,7],"sound_most_like":"ng"}],"syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"find","quality_score":90,"stress_score":100,"predicted_stress_level":1,"extent":[675,717]},{"phone_count":2,"stress_level":0,"letters":"ing","quality_score":99,"stress_score":100,"predicted_stress_level":0,"extent":[717,732]}]},{"word":"out","quality_score":96,"phone_score_list":[{"phone":"aw","stress_level":1,"extent":[732,753],"quality_score":94.57142857142857,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,2],"sound_most_like":"aw"},{"phone":"t","stress_level":null,"extent":[753,762],"quality_score":96.66666666666667,"word_extent":[2,3],"sound_most_like":"t"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"out","quality_score":96,"stress_score":100,"predicted_stress_level":1,"extent":[732,762]}]},{"word":"things","quality_score":98,"phone_score_list":[{"phone":"th","stress_level":null,"extent":[765,780],"quality_score":99.2,"word_extent":[0,2],"sound_most_like":"th"},{"phone":"ih","stress_level":1,"extent":[780,792],"quality_score":99.75,"stress_score":100,"predicted_stress_level":1,"word_extent":[2,3],"sound_most_like":"ih"},{"phone":"ng","stress_level":null,"extent":[792,807],"quality_score":99.2,"word_extent":[3,5],"sound_most_like":"ng"},{"phone":"z","stress_level":null,"extent":[807,828],"quality_score":94.28571428571428,"word_extent":[5,6],"sound_most_like":"z"}],"ending_punctuation":".","syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"things","quality_score":98,"stress_score":100,"predicted_stress_level":1,"extent":[765,828]}]},{"word":"And","quality_score":99,"phone_score_list":[{"phone":"ae","stress_level":1,"extent":[894,924],"quality_score":98.5,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ae"},{"phone":"n","stress_level":null,"extent":[924,933],"quality_score":99.33333333333333,"word_extent":[1,2],"sound_most_like":"n"},{"phone":"d","stress_level":null,"extent":[933,939],"quality_score":99.5,"word_extent":[2,3],"sound_most_like":"d"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"and","quality_score":99,"stress_score":100,"predicted_stress_level":1,"extent":[894,939]}]},{"word":"I","quality_score":99,"phone_score_list":[{"phone":"ay","stress_level":1,"extent":[939,948],"quality_score":99.33333333333333,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ay"}],"syllable_score_list":[{"phone_count":1,"stress_level":1,"letters":"i","quality_score":99,"stress_score":100,"predicted_stress_level":0,"extent":[939,948]}]},{"word":"like","quality_score":78,"phone_score_list":[{"phone":"l","stress_level":null,"extent":[948,957],"quality_score":99.66666666666667,"word_extent":[0,1],"sound_most_like":"l"},{"phone":"ay","stress_level":1,"extent":[957,966],"quality_score":98,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"ay"},{"phone":"k","stress_level":null,"extent":[966,967],"quality_score":35,"word_extent":[2,3],"sound_most_like":"l"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"like","quality_score":78,"stress_score":100,"predicted_stress_level":0,"extent":[948,967]}]},{"word":"doing","quality_score":97,"phone_score_list":[{"phone":"d","stress_level":null,"extent":[967,987],"quality_score":93.86666666666666,"word_extent":[0,1],"sound_most_like":"d"},{"phone":"uw","stress_level":1,"extent":[987,999],"quality_score":98,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"uw"},{"phone":"ih","stress_level":0,"extent":[999,1005],"quality_score":100,"stress_score":100,"predicted_stress_level":0,"word_extent":[2,3],"sound_most_like":"ih"},{"phone":"ng","stress_level":null,"extent":[1005,1014],"quality_score":98,"word_extent":[3,5],"sound_most_like":"ng"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"do","quality_score":96,"stress_score":100,"predicted_stress_level":1,"extent":[967,999]},{"phone_count":2,"stress_level":0,"letters":"ing","quality_score":99,"stress_score":100,"predicted_stress_level":0,"extent":[999,1014]}]},{"word":"football","quality_score":93,"phone_score_list":[{"phone":"f","stress_level":null,"extent":[1014,1026],"quality_score":99,"word_extent":[0,1],"sound_most_like":"f"},{"phone":"uh","stress_level":1,"extent":[1026,1035],"quality_score":78.33333333333333,"stress_score":0,"predicted_stress_level":0,"word_extent":[1,3],"sound_most_like":"ih","child_phones":[{"extent":[1026,1032],"quality_score":100,"sound_most_like":"uh"},{"extent":[1032,1035],"quality_score":35,"sound_most_like":"ih"}]},{"phone":"t","stress_level":null,"extent":[1035,1047],"quality_score":90,"word_extent":[3,4],"sound_most_like":"t"},{"phone":"b","stress_level":null,"extent":[1047,1050],"quality_score":92,"word_extent":[4,5],"sound_most_like":"b"},{"phone":"ao","stress_level":2,"extent":[1050,1077],"quality_score":96.33333333333333,"stress_score":100,"predicted_stress_level":1,"word_extent":[5,7],"sound_most_like":"ao"},{"phone":"l","stress_level":null,"extent":[1077,1089],"quality_score":100,"word_extent":[7,8],"sound_most_like":"l"}],"ending_punctuation":".","syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"foot","quality_score":89,"stress_score":0,"predicted_stress_level":0,"extent":[1014,1047]},{"phone_count":3,"stress_level":2,"letters":"ball","quality_score":96,"stress_score":100,"predicted_stress_level":1,"extent":[1047,1089]}]},{"word":"And","quality_score":64,"phone_score_list":[{"phone":"ae","stress_level":1,"extent":[1162,1183],"quality_score":96.42857142857143,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ae"},{"phone":"n","stress_level":null,"extent":[1183,1195],"quality_score":95.5,"word_extent":[1,2],"sound_most_like":"n"},{"phone":"d","stress_level":null,"extent":[1195,1195],"quality_score":0,"word_extent":[2,3],"sound_most_like":null}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"and","quality_score":64,"stress_score":100,"predicted_stress_level":1,"extent":[1162,1195]}]},{"word":"I","quality_score":99,"phone_score_list":[{"phone":"ay","stress_level":1,"extent":[1195,1210],"quality_score":99.2,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ay"}],"syllable_score_list":[{"phone_count":1,"stress_level":1,"letters":"i","quality_score":99,"stress_score":100,"predicted_stress_level":0,"extent":[1195,1210]}]},{"word":"want","quality_score":74,"phone_score_list":[{"phone":"w","stress_level":null,"extent":[1210,1225],"quality_score":100,"word_extent":[0,1],"sound_most_like":"w"},{"phone":"aa","stress_level":1,"extent":[1225,1243],"quality_score":95.5,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"aa"},{"phone":"n","stress_level":null,"extent":[1243,1252],"quality_score":99.66666666666667,"word_extent":[2,3],"sound_most_like":"n"},{"phone":"t","stress_level":null,"extent":[1252,1252],"quality_score":0,"word_extent":[3,4],"sound_most_like":null}],"syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"want","quality_score":74,"stress_score":100,"predicted_stress_level":0,"extent":[1210,1252]}]},{"word":"to","quality_score":98,"phone_score_list":[{"phone":"t","stress_level":null,"extent":[1252,1261],"quality_score":100,"word_extent":[0,1],"sound_most_like":"t"},{"phone":"uw","stress_level":1,"extent":[1261,1270],"quality_score":96.66666666666667,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"uw"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"to","quality_score":98,"stress_score":100,"predicted_stress_level":1,"extent":[1252,1270]}]},{"word":"be","quality_score":93,"phone_score_list":[{"phone":"b","stress_level":null,"extent":[1270,1276],"quality_score":93.5,"word_extent":[0,1],"sound_most_like":"b"},{"phone":"iy","stress_level":1,"extent":[1276,1285],"quality_score":92.33333333333333,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"iy"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"be","quality_score":93,"stress_score":100,"predicted_stress_level":0,"extent":[1270,1285]}]},{"word":"a","quality_score":96,"phone_score_list":[{"phone":"ah","stress_level":0,"extent":[1285,1291],"quality_score":96,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ah"}],"syllable_score_list":[{"phone_count":1,"stress_level":0,"letters":"a","quality_score":96,"stress_score":100,"predicted_stress_level":0,"extent":[1285,1291]}]},{"word":"football","quality_score":80,"phone_score_list":[{"phone":"f","stress_level":null,"extent":[1294,1303],"quality_score":93.33333333333333,"word_extent":[0,1],"sound_most_like":"f"},{"phone":"uh","stress_level":1,"extent":[1303,1309],"quality_score":58.5,"stress_score":0,"predicted_stress_level":0,"word_extent":[1,3],"sound_most_like":"ah"},{"phone":"t","stress_level":null,"extent":[1309,1310],"quality_score":35,"word_extent":[3,4],"sound_most_like":"r"},{"phone":"b","stress_level":null,"extent":[1310,1327],"quality_score":97.94117647058823,"word_extent":[4,5],"sound_most_like":"b"},{"phone":"ao","stress_level":2,"extent":[1327,1339],"quality_score":97.25,"stress_score":100,"predicted_stress_level":2,"word_extent":[5,7],"sound_most_like":"ao"},{"phone":"l","stress_level":null,"extent":[1339,1348],"quality_score":97.33333333333333,"word_extent":[7,8],"sound_most_like":"l"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"foot","quality_score":62,"stress_score":0,"predicted_stress_level":0,"extent":[1294,1310]},{"phone_count":3,"stress_level":2,"letters":"ball","quality_score":98,"stress_score":100,"predicted_stress_level":2,"extent":[1310,1348]}]},{"word":"player","quality_score":90,"phone_score_list":[{"phone":"p","stress_level":null,"extent":[1348,1360],"quality_score":100,"word_extent":[0,1],"sound_most_like":"p"},{"phone":"l","stress_level":null,"extent":[1360,1369],"quality_score":100,"word_extent":[1,2],"sound_most_like":"l"},{"phone":"ey","stress_level":1,"extent":[1369,1384],"quality_score":83.8,"stress_score":100,"predicted_stress_level":1,"word_extent":[2,4],"sound_most_like":"ey"},{"phone":"er","stress_level":0,"extent":[1384,1396],"quality_score":75.75,"stress_score":100,"predicted_stress_level":0,"word_extent":[4,6],"sound_most_like":"ow","child_phones":[{"extent":[1384,1393],"quality_score":89.33333333333333,"sound_most_like":"y"},{"extent":[1393,1396],"quality_score":35,"sound_most_like":"ow"}]}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"play","quality_score":95,"stress_score":100,"predicted_stress_level":1,"extent":[1348,1384]},{"phone_count":1,"stress_level":0,"letters":"er","quality_score":76,"stress_score":100,"predicted_stress_level":0,"extent":[1384,1396]}]},{"word":"when","quality_score":84,"phone_score_list":[{"phone":"w","stress_level":null,"extent":[1396,1405],"quality_score":98.66666666666667,"word_extent":[0,1],"sound_most_like":"w"},{"phone":"eh","stress_level":1,"extent":[1405,1411],"quality_score":84.5,"stress_score":100,"predicted_stress_level":0,"word_extent":[2,3],"sound_most_like":"eh"},{"phone":"n","stress_level":null,"extent":[1411,1417],"quality_score":68.83333333333333,"word_extent":[3,4],"sound_most_like":"dh"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"when","quality_score":84,"stress_score":100,"predicted_stress_level":0,"extent":[1396,1417]}]},{"word":"I'm","quality_score":93,"phone_score_list":[{"phone":"ay","stress_level":1,"extent":[1417,1420],"quality_score":89,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ay"},{"phone":"m","stress_level":null,"extent":[1420,1435],"quality_score":97.8,"word_extent":[2,3],"sound_most_like":"m"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"i'm","quality_score":93,"stress_score":100,"predicted_stress_level":0,"extent":[1417,1435]}]},{"word":"older","quality_score":97,"phone_score_list":[{"phone":"ow","stress_level":1,"extent":[1435,1444],"quality_score":98,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ow"},{"phone":"l","stress_level":null,"extent":[1444,1456],"quality_score":97.5,"word_extent":[1,2],"sound_most_like":"l"},{"phone":"d","stress_level":null,"extent":[1456,1462],"quality_score":96,"word_extent":[2,3],"sound_most_like":"d"},{"phone":"er","stress_level":0,"extent":[1462,1480],"quality_score":98,"stress_score":100,"predicted_stress_level":0,"word_extent":[3,5],"sound_most_like":"er"}],"ending_punctuation":".","syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"ol","quality_score":98,"stress_score":100,"predicted_stress_level":1,"extent":[1435,1456]},{"phone_count":2,"stress_level":0,"letters":"der","quality_score":97,"stress_score":100,"predicted_stress_level":0,"extent":[1456,1480]}]}],"ielts_score":{"pronunciation":8,"fluency":6},"pte_score":{"pronunciation":82,"fluency":52},"speechace_score":{"pronunciation":87,"fluency":68},"toeic_score":{"pronunciation":180,"fluency":120},"cefr_score":{"pronunciation":"C1+","fluency":"B1"},"fluency":{"segment_metrics_list":[{"segment":[0,5],"duration":2.145,"articulation_length":1.95,"syllable_count":6,"correct_syllable_count":4,"correct_word_count":3,"word_count":5,"speech_rate":2.797202797202797,"articulation_rate":3.076923076923077,"syllable_correct_per_minute":111.8881118881119,"word_correct_per_minute":83.91608391608392,"all_pause_count":1,"all_pause_duration":0.195,"mean_length_run":1.95,"max_length_run":1.95,"all_pause_list":[[336,355.5]],"ielts_score":{"pronunciation":7.5,"fluency":6},"pte_score":{"pronunciation":77,"fluency":50},"speechace_score":{"pronunciation":84,"fluency":67},"toeic_score":{"pronunciation":170,"fluency":120},"cefr_score":{"pronunciation":"C1","fluency":"B1"}},{"segment":[5,14],"duration":5.055,"articulation_length":3.84,"syllable_count":12,"correct_syllable_count":9,"correct_word_count":6,"word_count":9,"speech_rate":2.3738872403560833,"articulation_rate":3.125,"syllable_correct_per_minute":106.82492581602375,"word_correct_per_minute":71.2166172106825,"all_pause_count":4,"all_pause_duration":1.215,"mean_length_run":1.28,"max_length_run":2.04,"all_pause_list":[[355.5,375],[579,645],[762,765],[828,861]],"ielts_score":{"pronunciation":7.5,"fluency":6},"pte_score":{"pronunciation":80,"fluency":49},"speechace_score":{"pronunciation":86,"fluency":66},"toeic_score":{"pronunciation":170,"fluency":120},"cefr_score":{"pronunciation":"C1","fluency":"B1"}},{"segment":[14,19],"duration":2.645,"articulation_length":1.95,"syllable_count":7,"correct_syllable_count":6,"correct_word_count":4,"word_count":5,"speech_rate":2.6465028355387523,"articulation_rate":3.58974358974359,"syllable_correct_per_minute":136.10586011342156,"word_correct_per_minute":90.73724007561437,"all_pause_count":2,"all_pause_duration":0.695,"mean_length_run":1.95,"max_length_run":1.95,"all_pause_list":[[861,894],[1089,1125.5]],"ielts_score":{"pronunciation":8.5,"fluency":7.5},"pte_score":{"pronunciation":90,"fluency":74},"speechace_score":{"pronunciation":93,"fluency":82},"toeic_score":{"pronunciation":190,"fluency":170},"cefr_score":{"pronunciation":"C2","fluency":"C1"}},{"segment":[19,30],"duration":3.545,"articulation_length":3.15,"syllable_count":14,"correct_syllable_count":10,"correct_word_count":9,"word_count":11,"speech_rate":3.9492242595204514,"articulation_rate":4.444444444444445,"syllable_correct_per_minute":169.2524682651622,"word_correct_per_minute":152.32722143864598,"all_pause_count":2,"all_pause_duration":0.395,"mean_length_run":1.575,"max_length_run":1.86,"all_pause_list":[[1125.5,1162],[1291,1294]],"ielts_score":{"pronunciation":7.5,"fluency":6},"pte_score":{"pronunciation":79,"fluency":52},"speechace_score":{"pronunciation":85,"fluency":68},"toeic_score":{"pronunciation":170,"fluency":120},"cefr_score":{"pronunciation":"C1","fluency":"B1"}}],"overall_metrics":{"segment":[0,30],"duration":13.39,"articulation_length":10.89,"syllable_count":39,"correct_syllable_count":29,"correct_word_count":22,"word_count":30,"speech_rate":2.912621359223301,"articulation_rate":3.5812672176308538,"syllable_correct_per_minute":129.9477221807319,"word_correct_per_minute":98.58103061986557,"all_pause_count":6,"all_pause_duration":2.5,"mean_length_run":1.5557142857142858,"max_length_run":2.04,"all_pause_list":[[336,375],[579,645],[762,765],[828,894],[1089,1162],[1291,1294]]},"fluency_version":null}},"version":"9.5"};
    }

    if (gettingResults == 1) {
	data = {"status":"success","quota_remaining":-1,"text_score":{"text":"'And I have one sister. She likes being a doctor and finding out things. And I like doing football. And I want to be a football player when I'm older.'","word_score_list":[{"word":"And","quality_score":81,"phone_score_list":[{"phone":"ae","stress_level":1,"extent":[144,156],"quality_score":80.83333333333333,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ae","child_phones":[{"extent":[144,153],"quality_score":92,"sound_most_like":"ae"},{"extent":[153,156],"quality_score":47.333333333333336,"sound_most_like":"eh"}]},{"phone":"n","stress_level":null,"extent":[156,171],"quality_score":95.6,"word_extent":[1,2],"sound_most_like":"n"},{"phone":"d","stress_level":null,"extent":[171,183],"quality_score":67.91666666666667,"word_extent":[2,3],"sound_most_like":"s","child_phones":[{"extent":[171,174],"quality_score":35,"sound_most_like":"s"},{"extent":[174,177],"quality_score":41.666666666666664,"sound_most_like":"z"},{"extent":[177,180],"quality_score":96,"sound_most_like":"s"},{"extent":[180,183],"quality_score":99,"sound_most_like":"d"}]}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"and","quality_score":81,"stress_score":100,"predicted_stress_level":0,"extent":[144,183]}]},{"word":"I","quality_score":9,"phone_score_list":[{"phone":"ay","stress_level":1,"extent":[183,204],"quality_score":8.749999999999998,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ow","child_phones":[{"extent":[183,189],"quality_score":8.75,"sound_most_like":"ah"},{"extent":[189,198],"quality_score":8.749999999999996,"sound_most_like":"ow"},{"extent":[198,201],"quality_score":8.75,"sound_most_like":"er"},{"extent":[201,204],"quality_score":8.75,"sound_most_like":"ah"}]}],"syllable_score_list":[{"phone_count":1,"stress_level":1,"letters":"i","quality_score":9,"stress_score":100,"predicted_stress_level":0,"extent":[183,204]}]},{"word":"have","quality_score":76,"phone_score_list":[{"phone":"hh","stress_level":null,"extent":[216,237],"quality_score":98,"word_extent":[0,1],"sound_most_like":"hh"},{"phone":"ae","stress_level":1,"extent":[237,246],"quality_score":98.66666666666667,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"ae"},{"phone":"v","stress_level":null,"extent":[246,261],"quality_score":31.66666666666665,"word_extent":[2,4],"sound_most_like":"s","child_phones":[{"extent":[246,258],"quality_score":34.99999999999998,"sound_most_like":"s"},{"extent":[258,261],"quality_score":18.333333333333325,"sound_most_like":"ih"}]}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"have","quality_score":76,"stress_score":100,"predicted_stress_level":0,"extent":[216,261]}]},{"word":"one","quality_score":52,"phone_score_list":[{"phone":"hh","stress_level":null,"extent":[264,294],"quality_score":75.7,"word_extent":[0,1],"sound_most_like":"n","child_phones":[{"extent":[264,267],"quality_score":35,"sound_most_like":"t"},{"extent":[267,276],"quality_score":49.999999999999986,"sound_most_like":"n"},{"extent":[276,285],"quality_score":96,"sound_most_like":"th"},{"extent":[285,291],"quality_score":95,"sound_most_like":"p"},{"extent":[291,294],"quality_score":94,"sound_most_like":"l"}]},{"phone":"w","stress_level":null,"extent":[294,294],"quality_score":0,"word_extent":[0,1],"sound_most_like":null},{"phone":"ah","stress_level":1,"extent":[294,309],"quality_score":92.2,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"ah"},{"phone":"n","stress_level":null,"extent":[309,312],"quality_score":41.666666666666664,"word_extent":[1,2],"sound_most_like":"ng"}],"syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"one","quality_score":52,"stress_score":100,"predicted_stress_level":0,"extent":[264,312]}]},{"word":"sister","quality_score":78,"phone_score_list":[{"phone":"s","stress_level":null,"extent":[312,459],"quality_score":97.9795918367347,"word_extent":[0,1],"sound_most_like":"s"},{"phone":"ih","stress_level":1,"extent":[459,468],"quality_score":94.66666666666667,"stress_score":86,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"ih"},{"phone":"s","stress_level":null,"extent":[468,480],"quality_score":98.5,"word_extent":[2,3],"sound_most_like":"s"},{"phone":"t","stress_level":null,"extent":[480,492],"quality_score":89,"word_extent":[3,4],"sound_most_like":"t"},{"phone":"er","stress_level":0,"extent":[492,513],"quality_score":7.559523809523808,"stress_score":98,"predicted_stress_level":1,"word_extent":[4,6],"sound_most_like":"ow","child_phones":[{"extent":[492,495],"quality_score":8.75,"sound_most_like":"ah"},{"extent":[495,504],"quality_score":8.749999999999996,"sound_most_like":"ow"},{"extent":[504,507],"quality_score":0.41666666666666796,"sound_most_like":"n"},{"extent":[507,513],"quality_score":8.75,"sound_most_like":"ow"}]}],"ending_punctuation":".","syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"sis","quality_score":97,"stress_score":86,"predicted_stress_level":0,"extent":[312,480]},{"phone_count":2,"stress_level":0,"letters":"ter","quality_score":48,"stress_score":98,"predicted_stress_level":1,"extent":[480,513]}]},{"word":"She","quality_score":90,"phone_score_list":[{"phone":"sh","stress_level":null,"extent":[585,609],"quality_score":92.58333333333333,"word_extent":[0,2],"sound_most_like":"sh","child_phones":[{"extent":[585,606],"quality_score":99.85714285714286,"sound_most_like":"sh"},{"extent":[606,609],"quality_score":41.666666666666664,"sound_most_like":"hh"}]},{"phone":"iy","stress_level":1,"extent":[609,663],"quality_score":87.55555555555556,"stress_score":100,"predicted_stress_level":1,"word_extent":[2,3],"sound_most_like":"iy","child_phones":[{"extent":[609,627],"quality_score":95.83333333333333,"sound_most_like":"iy"},{"extent":[627,633],"quality_score":46.50000000000001,"sound_most_like":"n"},{"extent":[633,639],"quality_score":94,"sound_most_like":"y"},{"extent":[639,642],"quality_score":94,"sound_most_like":"uw"},{"extent":[642,645],"quality_score":99,"sound_most_like":"iy"},{"extent":[645,657],"quality_score":87,"sound_most_like":"ih"},{"extent":[657,660],"quality_score":86,"sound_most_like":"eh"},{"extent":[660,663],"quality_score":93,"sound_most_like":"ng"}]}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"she","quality_score":90,"stress_score":100,"predicted_stress_level":1,"extent":[585,663]}]},{"word":"likes","quality_score":88,"phone_score_list":[{"phone":"l","stress_level":null,"extent":[711,729],"quality_score":97.33333333333333,"word_extent":[0,1],"sound_most_like":"l"},{"phone":"ay","stress_level":1,"extent":[729,753],"quality_score":83.79166666666667,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"ay","child_phones":[{"extent":[729,747],"quality_score":97.83333333333333,"sound_most_like":"ay"},{"extent":[747,753],"quality_score":41.666666666666664,"sound_most_like":"aw"}]},{"phone":"k","stress_level":null,"extent":[753,771],"quality_score":77.72222222222223,"word_extent":[2,3],"sound_most_like":"g"},{"phone":"s","stress_level":null,"extent":[771,786],"quality_score":93.6,"word_extent":[4,5],"sound_most_like":"s"}],"syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"likes","quality_score":88,"stress_score":100,"predicted_stress_level":1,"extent":[711,786]}]},{"word":"being","quality_score":63,"phone_score_list":[{"phone":"b","stress_level":null,"extent":[855,858],"quality_score":35,"word_extent":[0,1],"sound_most_like":"hh"},{"phone":"iy","stress_level":1,"extent":[858,876],"quality_score":94.5,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"iy"},{"phone":"ih","stress_level":0,"extent":[876,888],"quality_score":42.12500000000001,"stress_score":100,"predicted_stress_level":0,"word_extent":[2,3],"sound_most_like":"ah","child_phones":[{"extent":[876,879],"quality_score":35,"sound_most_like":"ow"},{"extent":[879,888],"quality_score":44.500000000000014,"sound_most_like":"ah"}]},{"phone":"ng","stress_level":null,"extent":[888,900],"quality_score":80.91666666666667,"word_extent":[3,5],"sound_most_like":"ng"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"be","quality_score":65,"stress_score":100,"predicted_stress_level":1,"extent":[855,876]},{"phone_count":2,"stress_level":0,"letters":"ing","quality_score":62,"stress_score":100,"predicted_stress_level":0,"extent":[876,900]}]},{"word":"a","quality_score":78,"phone_score_list":[{"phone":"ah","stress_level":0,"extent":[900,914],"quality_score":78.23809523809523,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"d","child_phones":[{"extent":[900,912],"quality_score":91,"sound_most_like":"uw"},{"extent":[912,914],"quality_score":1.6666666666666718,"sound_most_like":"d"}]}],"syllable_score_list":[{"phone_count":1,"stress_level":0,"letters":"a","quality_score":78,"stress_score":100,"predicted_stress_level":1,"extent":[900,914]}]},{"word":"doctor","quality_score":93,"phone_score_list":[{"phone":"d","stress_level":null,"extent":[972,1108],"quality_score":100,"word_extent":[0,1],"sound_most_like":"d"},{"phone":"ao","stress_level":1,"extent":[1108,1117],"quality_score":98.66666666666667,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"ao"},{"phone":"k","stress_level":null,"extent":[1117,1135],"quality_score":97.66666666666667,"word_extent":[2,3],"sound_most_like":"k"},{"phone":"t","stress_level":null,"extent":[1135,1156],"quality_score":98.14285714285714,"word_extent":[3,4],"sound_most_like":"t"},{"phone":"er","stress_level":0,"extent":[1156,1174],"quality_score":70.33333333333333,"stress_score":0,"predicted_stress_level":1,"word_extent":[4,6],"sound_most_like":"ao"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"doc","quality_score":99,"stress_score":100,"predicted_stress_level":1,"extent":[972,1135]},{"phone_count":2,"stress_level":0,"letters":"tor","quality_score":84,"stress_score":0,"predicted_stress_level":1,"extent":[1135,1174]}]},{"word":"and","quality_score":87,"phone_score_list":[{"phone":"ah","stress_level":0,"extent":[1177,1192],"quality_score":90.2,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"ah"},{"phone":"n","stress_level":null,"extent":[1192,1219],"quality_score":90.22222222222223,"word_extent":[1,2],"sound_most_like":"n"},{"phone":"d","stress_level":null,"extent":[1219,1231],"quality_score":79.41666666666667,"word_extent":[2,3],"sound_most_like":"z"}],"syllable_score_list":[{"phone_count":3,"stress_level":0,"letters":"and","quality_score":87,"stress_score":100,"predicted_stress_level":0,"extent":[1177,1231]}]},{"word":"finding","quality_score":72,"phone_score_list":[{"phone":"f","stress_level":null,"extent":[1264,1273],"quality_score":100,"word_extent":[0,1],"sound_most_like":"f"},{"phone":"ay","stress_level":1,"extent":[1273,1291],"quality_score":96.5,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"ay"},{"phone":"n","stress_level":null,"extent":[1291,1292],"quality_score":41.666666666666664,"word_extent":[2,3],"sound_most_like":"ng"},{"phone":"d","stress_level":null,"extent":[1292,1292],"quality_score":0,"word_extent":[3,4],"sound_most_like":null},{"phone":"ih","stress_level":0,"extent":[1292,1293],"quality_score":96,"stress_score":100,"predicted_stress_level":0,"word_extent":[4,5],"sound_most_like":"ih"},{"phone":"ng","stress_level":null,"extent":[1293,1315],"quality_score":97.54545454545455,"word_extent":[5,7],"sound_most_like":"ng"}],"syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"find","quality_score":60,"stress_score":100,"predicted_stress_level":1,"extent":[1264,1292]},{"phone_count":2,"stress_level":0,"letters":"ing","quality_score":97,"stress_score":100,"predicted_stress_level":0,"extent":[1292,1315]}]},{"word":"out","quality_score":55,"phone_score_list":[{"phone":"aw","stress_level":1,"extent":[1450,1474],"quality_score":98.75,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,2],"sound_most_like":"aw"},{"phone":"t","stress_level":null,"extent":[1474,1492],"quality_score":11.666666666666664,"word_extent":[2,3],"sound_most_like":"f","child_phones":[{"extent":[1474,1477],"quality_score":11.666666666666666,"sound_most_like":"l"},{"extent":[1477,1486],"quality_score":11.66666666666666,"sound_most_like":"f"},{"extent":[1486,1492],"quality_score":11.666666666666666,"sound_most_like":"v"}]}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"out","quality_score":55,"stress_score":100,"predicted_stress_level":1,"extent":[1450,1492]}]},{"word":"things","quality_score":96,"phone_score_list":[{"phone":"th","stress_level":null,"extent":[1498,1522],"quality_score":85.41666666666667,"word_extent":[0,2],"sound_most_like":"th"},{"phone":"ih","stress_level":1,"extent":[1522,1534],"quality_score":98.5,"stress_score":100,"predicted_stress_level":0,"word_extent":[2,3],"sound_most_like":"ih"},{"phone":"ng","stress_level":null,"extent":[1534,1552],"quality_score":100,"word_extent":[3,5],"sound_most_like":"ng"},{"phone":"z","stress_level":null,"extent":[1552,1570],"quality_score":100,"word_extent":[5,6],"sound_most_like":"z"}],"ending_punctuation":".","syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"things","quality_score":96,"stress_score":100,"predicted_stress_level":0,"extent":[1498,1570]}]},{"word":"And","quality_score":60,"phone_score_list":[{"phone":"ae","stress_level":1,"extent":[1648,1669],"quality_score":59.61904761904762,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"aw","child_phones":[{"extent":[1648,1660],"quality_score":78.08333333333333,"sound_most_like":"eh"},{"extent":[1660,1669],"quality_score":34.999999999999986,"sound_most_like":"aw"}]},{"phone":"n","stress_level":null,"extent":[1669,1681],"quality_score":34.99999999999999,"word_extent":[1,2],"sound_most_like":"y","child_phones":[{"extent":[1669,1672],"quality_score":35,"sound_most_like":"l"},{"extent":[1672,1681],"quality_score":34.999999999999986,"sound_most_like":"y"}]},{"phone":"d","stress_level":null,"extent":[1681,1705],"quality_score":86.25,"word_extent":[2,3],"sound_most_like":"d"}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"and","quality_score":60,"stress_score":100,"predicted_stress_level":1,"extent":[1648,1705]}]},{"word":"I","quality_score":25,"phone_score_list":[{"phone":"ay","stress_level":1,"extent":[1720,1765],"quality_score":25.229629629629628,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"er","child_phones":[{"extent":[1720,1726],"quality_score":19.666666666666664,"sound_most_like":"aa"},{"extent":[1726,1732],"quality_score":11.666666666666666,"sound_most_like":"er"},{"extent":[1732,1735],"quality_score":6.111111111111108,"sound_most_like":"r"},{"extent":[1735,1762],"quality_score":33.11111111111111,"sound_most_like":"ay"},{"extent":[1762,1765],"quality_score":11.666666666666666,"sound_most_like":"ah"}]}],"syllable_score_list":[{"phone_count":1,"stress_level":1,"letters":"i","quality_score":25,"stress_score":100,"predicted_stress_level":1,"extent":[1720,1765]}]},{"word":"like","quality_score":78,"phone_score_list":[{"phone":"l","stress_level":null,"extent":[1765,1780],"quality_score":99.8,"word_extent":[0,1],"sound_most_like":"l"},{"phone":"ay","stress_level":1,"extent":[1780,1804],"quality_score":97.875,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"ay"},{"phone":"k","stress_level":null,"extent":[1804,1822],"quality_score":34.99999999999998,"word_extent":[2,3],"sound_most_like":"jh","child_phones":[{"extent":[1804,1807],"quality_score":35,"sound_most_like":"d"},{"extent":[1807,1822],"quality_score":34.99999999999998,"sound_most_like":"jh"}]}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"like","quality_score":78,"stress_score":100,"predicted_stress_level":1,"extent":[1765,1822]}]},{"word":"doing","quality_score":96,"phone_score_list":[{"phone":"d","stress_level":null,"extent":[1861,1899],"quality_score":94.66666666666667,"word_extent":[0,1],"sound_most_like":"d"},{"phone":"uw","stress_level":1,"extent":[1899,1917],"quality_score":96.5,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"uw"},{"phone":"ih","stress_level":0,"extent":[1917,1932],"quality_score":98,"stress_score":100,"predicted_stress_level":0,"word_extent":[2,3],"sound_most_like":"ih"},{"phone":"ng","stress_level":null,"extent":[1932,1947],"quality_score":96,"word_extent":[3,5],"sound_most_like":"ng"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"do","quality_score":96,"stress_score":100,"predicted_stress_level":1,"extent":[1861,1917]},{"phone_count":2,"stress_level":0,"letters":"ing","quality_score":97,"stress_score":100,"predicted_stress_level":0,"extent":[1917,1947]}]},{"word":"football","quality_score":60,"phone_score_list":[{"phone":"f","stress_level":null,"extent":[1986,2016],"quality_score":99.5,"word_extent":[0,1],"sound_most_like":"f"},{"phone":"uh","stress_level":1,"extent":[2016,2022],"quality_score":96,"stress_score":0,"predicted_stress_level":0,"word_extent":[1,3],"sound_most_like":"uh"},{"phone":"t","stress_level":null,"extent":[2022,2023],"quality_score":35,"word_extent":[3,4],"sound_most_like":"r"},{"phone":"b","stress_level":null,"extent":[2023,2024],"quality_score":35,"word_extent":[4,5],"sound_most_like":"r"},{"phone":"ao","stress_level":2,"extent":[2024,2024],"quality_score":0,"stress_score":50,"predicted_stress_level":0,"word_extent":[5,7],"sound_most_like":null},{"phone":"l","stress_level":null,"extent":[2024,2031],"quality_score":97.42857142857143,"word_extent":[7,8],"sound_most_like":"l"}],"ending_punctuation":".","syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"foot","quality_score":77,"stress_score":0,"predicted_stress_level":0,"extent":[1986,2023]},{"phone_count":3,"stress_level":2,"letters":"ball","quality_score":44,"stress_score":50,"predicted_stress_level":0,"extent":[2023,2031]}]},{"word":"And","quality_score":36,"phone_score_list":[{"phone":"ah","stress_level":0,"extent":[2051,2082],"quality_score":65.9032258064516,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"uw"},{"phone":"n","stress_level":null,"extent":[2082,2091],"quality_score":41.66666666666667,"word_extent":[1,2],"sound_most_like":"m"},{"phone":"d","stress_level":null,"extent":[2091,2091],"quality_score":0,"word_extent":[2,3],"sound_most_like":null}],"syllable_score_list":[{"phone_count":3,"stress_level":0,"letters":"and","quality_score":36,"stress_score":100,"predicted_stress_level":1,"extent":[2051,2091]}]},{"word":"I","quality_score":10,"phone_score_list":[{"phone":"ay","stress_level":1,"extent":[2193,2253],"quality_score":10.383333333333333,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ah","child_phones":[{"extent":[2193,2196],"quality_score":16.8,"sound_most_like":"hh"},{"extent":[2196,2199],"quality_score":7,"sound_most_like":"er"},{"extent":[2199,2205],"quality_score":0,"sound_most_like":"hh"},{"extent":[2205,2208],"quality_score":7,"sound_most_like":"ow"},{"extent":[2208,2223],"quality_score":10.919999999999996,"sound_most_like":"ah"},{"extent":[2223,2229],"quality_score":1.8333333333333357,"sound_most_like":"l"},{"extent":[2229,2235],"quality_score":7,"sound_most_like":"iy"},{"extent":[2235,2238],"quality_score":15.799999999999997,"sound_most_like":"ey"},{"extent":[2238,2253],"quality_score":17.76,"sound_most_like":"iy"}]}],"syllable_score_list":[{"phone_count":1,"stress_level":1,"letters":"i","quality_score":10,"stress_score":100,"predicted_stress_level":1,"extent":[2193,2253]}]},{"word":"want","quality_score":57,"phone_score_list":[{"phone":"w","stress_level":null,"extent":[2610,2611],"quality_score":0,"word_extent":[0,1],"sound_most_like":"ow"},{"phone":"ao","stress_level":1,"extent":[2611,2631],"quality_score":70.4,"stress_score":100,"predicted_stress_level":1,"word_extent":[1,2],"sound_most_like":"ow"},{"phone":"n","stress_level":null,"extent":[2631,2634],"quality_score":91,"word_extent":[2,3],"sound_most_like":"n"},{"phone":"t","stress_level":null,"extent":[2634,2652],"quality_score":66.16666666666667,"word_extent":[3,4],"sound_most_like":"hh","child_phones":[{"extent":[2634,2640],"quality_score":100,"sound_most_like":"t"},{"extent":[2640,2652],"quality_score":49.24999999999999,"sound_most_like":"hh"}]}],"syllable_score_list":[{"phone_count":4,"stress_level":1,"letters":"want","quality_score":57,"stress_score":100,"predicted_stress_level":1,"extent":[2610,2652]}]},{"word":"to","quality_score":42,"phone_score_list":[{"phone":"t","stress_level":null,"extent":[2670,2671],"quality_score":35,"word_extent":[0,1],"sound_most_like":"l"},{"phone":"uw","stress_level":1,"extent":[2671,2690],"quality_score":48,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"m","child_phones":[{"extent":[2671,2682],"quality_score":82.9090909090909,"sound_most_like":"ah"},{"extent":[2682,2690],"quality_score":0,"sound_most_like":"m"}]}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"to","quality_score":42,"stress_score":100,"predicted_stress_level":0,"extent":[2670,2690]}]},{"word":"be","quality_score":61,"phone_score_list":[{"phone":"b","stress_level":null,"extent":[2718,2719],"quality_score":35,"word_extent":[0,1],"sound_most_like":"y"},{"phone":"iy","stress_level":1,"extent":[2719,2739],"quality_score":86.95,"stress_score":100,"predicted_stress_level":0,"word_extent":[1,2],"sound_most_like":"iy"}],"syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"be","quality_score":61,"stress_score":100,"predicted_stress_level":0,"extent":[2718,2739]}]},{"word":"a","quality_score":2,"phone_score_list":[{"phone":"ah","stress_level":0,"extent":[2739,2742],"quality_score":1.666666666666672,"stress_score":100,"predicted_stress_level":0,"word_extent":[0,1],"sound_most_like":"v"}],"syllable_score_list":[{"phone_count":1,"stress_level":0,"letters":"a","quality_score":2,"stress_score":100,"predicted_stress_level":0,"extent":[2739,2742]}]},{"word":"football","quality_score":55,"phone_score_list":[{"phone":"f","stress_level":null,"extent":[2865,2901],"quality_score":97.83333333333333,"word_extent":[0,1],"sound_most_like":"f"},{"phone":"uh","stress_level":1,"extent":[2901,2910],"quality_score":96,"stress_score":0,"predicted_stress_level":0,"word_extent":[1,3],"sound_most_like":"uh"},{"phone":"t","stress_level":null,"extent":[2910,2911],"quality_score":35,"word_extent":[3,4],"sound_most_like":"b"},{"phone":"b","stress_level":null,"extent":[2911,2915],"quality_score":100,"word_extent":[4,5],"sound_most_like":"b"},{"phone":"ao","stress_level":2,"extent":[2915,2915],"quality_score":0,"stress_score":50,"predicted_stress_level":0,"word_extent":[5,7],"sound_most_like":null},{"phone":"l","stress_level":null,"extent":[2915,2915],"quality_score":0,"word_extent":[7,8],"sound_most_like":null}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"foot","quality_score":76,"stress_score":0,"predicted_stress_level":0,"extent":[2865,2911]},{"phone_count":3,"stress_level":2,"letters":"ball","quality_score":33,"stress_score":50,"predicted_stress_level":0,"extent":[2911,2915]}]},{"word":"player","quality_score":25,"phone_score_list":[{"phone":"p","stress_level":null,"extent":[2915,2936],"quality_score":98.95238095238095,"word_extent":[0,1],"sound_most_like":"p"},{"phone":"l","stress_level":null,"extent":[2936,2936],"quality_score":0,"word_extent":[1,2],"sound_most_like":null},{"phone":"ey","stress_level":1,"extent":[2936,2936],"quality_score":0,"stress_score":0,"predicted_stress_level":0,"word_extent":[2,4],"sound_most_like":null},{"phone":"er","stress_level":0,"extent":[2936,2936],"quality_score":0,"stress_score":100,"predicted_stress_level":0,"word_extent":[4,6],"sound_most_like":null}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"play","quality_score":33,"stress_score":0,"predicted_stress_level":0,"extent":[2915,2936]},{"phone_count":1,"stress_level":0,"letters":"er","quality_score":0,"stress_score":100,"predicted_stress_level":0,"extent":[2936,2936]}]},{"word":"when","quality_score":35,"phone_score_list":[{"phone":"w","stress_level":null,"extent":[2952,2961],"quality_score":97,"word_extent":[0,1],"sound_most_like":"w"},{"phone":"ih","stress_level":1,"extent":[2961,3000],"quality_score":8.429487179487175,"stress_score":100,"predicted_stress_level":1,"word_extent":[2,3],"sound_most_like":"uw","child_phones":[{"extent":[2961,2973],"quality_score":8.749999999999995,"sound_most_like":"uw"},{"extent":[2973,2976],"quality_score":8.75,"sound_most_like":"uh"},{"extent":[2976,2979],"quality_score":4.583333333333331,"sound_most_like":"r"},{"extent":[2979,3000],"quality_score":8.749999999999995,"sound_most_like":"uw"}]},{"phone":"n","stress_level":null,"extent":[3000,3000],"quality_score":0,"word_extent":[3,4],"sound_most_like":null}],"syllable_score_list":[{"phone_count":3,"stress_level":1,"letters":"when","quality_score":35,"stress_score":100,"predicted_stress_level":1,"extent":[2952,3000]}]},{"word":"I'm","quality_score":16,"phone_score_list":[{"phone":"ah","stress_level":0,"extent":[3018,3063],"quality_score":17.037037037037035,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ow","child_phones":[{"extent":[3018,3021],"quality_score":0.5555555555555574,"sound_most_like":"l"},{"extent":[3021,3045],"quality_score":15.833333333333329,"sound_most_like":"ow"},{"extent":[3045,3054],"quality_score":10.555555555555557,"sound_most_like":"sil"},{"extent":[3054,3057],"quality_score":33.33333333333333,"sound_most_like":"ah"},{"extent":[3057,3060],"quality_score":31.666666666666664,"sound_most_like":"er"},{"extent":[3060,3063],"quality_score":31.666666666666664,"sound_most_like":"eh"}]},{"phone":"m","stress_level":null,"extent":[3063,3093],"quality_score":15.058333333333334,"word_extent":[2,3],"sound_most_like":"n","child_phones":[{"extent":[3063,3066],"quality_score":8.75,"sound_most_like":"l"},{"extent":[3066,3072],"quality_score":10.416666666666666,"sound_most_like":"n"},{"extent":[3072,3075],"quality_score":0,"sound_most_like":"ao"},{"extent":[3075,3078],"quality_score":0,"sound_most_like":"ah"},{"extent":[3078,3087],"quality_score":24.833333333333332,"sound_most_like":"m"},{"extent":[3087,3090],"quality_score":23.25,"sound_most_like":"p"},{"extent":[3090,3093],"quality_score":23.25,"sound_most_like":"t"}]}],"syllable_score_list":[{"phone_count":2,"stress_level":0,"letters":"i'm","quality_score":16,"stress_score":100,"predicted_stress_level":1,"extent":[3018,3093]}]},{"word":"older","quality_score":85,"phone_score_list":[{"phone":"ow","stress_level":1,"extent":[3105,3135],"quality_score":86.83333333333333,"stress_score":100,"predicted_stress_level":1,"word_extent":[0,1],"sound_most_like":"ow","child_phones":[{"extent":[3105,3117],"quality_score":89,"sound_most_like":"er"},{"extent":[3117,3120],"quality_score":18.333333333333325,"sound_most_like":"r"},{"extent":[3120,3123],"quality_score":94,"sound_most_like":"ao"},{"extent":[3123,3135],"quality_score":100,"sound_most_like":"ow"}]},{"phone":"l","stress_level":null,"extent":[3135,3144],"quality_score":99,"word_extent":[1,2],"sound_most_like":"l"},{"phone":"d","stress_level":null,"extent":[3144,3156],"quality_score":98,"word_extent":[2,3],"sound_most_like":"d"},{"phone":"er","stress_level":0,"extent":[3156,3177],"quality_score":58.142857142857146,"stress_score":92,"predicted_stress_level":1,"word_extent":[3,5],"sound_most_like":"m","child_phones":[{"extent":[3156,3168],"quality_score":79.00000000000001,"sound_most_like":"ao"},{"extent":[3168,3177],"quality_score":30.33333333333332,"sound_most_like":"m"}]}],"ending_punctuation":".","syllable_score_list":[{"phone_count":2,"stress_level":1,"letters":"ol","quality_score":93,"stress_score":100,"predicted_stress_level":1,"extent":[3105,3144]},{"phone_count":2,"stress_level":0,"letters":"der","quality_score":78,"stress_score":92,"predicted_stress_level":1,"extent":[3144,3177]}]}],"ielts_score":{"pronunciation":6,"fluency":5.5},"pte_score":{"pronunciation":48,"fluency":42},"speechace_score":{"pronunciation":65,"fluency":61},"toeic_score":{"pronunciation":120,"fluency":110},"cefr_score":{"pronunciation":"B1","fluency":"A2+"},"fluency":{"segment_metrics_list":[{"segment":[0,5],"duration":4.05,"articulation_length":3.54,"syllable_count":6,"correct_syllable_count":2,"correct_word_count":1,"word_count":5,"speech_rate":1.4814814814814816,"articulation_rate":1.694915254237288,"syllable_correct_per_minute":29.62962962962963,"word_correct_per_minute":14.814814814814815,"all_pause_count":3,"all_pause_duration":0.51,"mean_length_run":1.18,"max_length_run":2.49,"all_pause_list":[[204,216],[261,264],[513,549]],"ielts_score":{"pronunciation":6,"fluency":4},"pte_score":{"pronunciation":51,"fluency":49},"speechace_score":{"pronunciation":67,"fluency":66},"toeic_score":{"pronunciation":115,"fluency":115},"cefr_score":{"pronunciation":"B1","fluency":"B1"}},{"segment":[5,14],"duration":10.6,"articulation_length":6.33,"syllable_count":12,"correct_syllable_count":7,"correct_word_count":5,"word_count":9,"speech_rate":1.1320754716981132,"articulation_rate":1.8957345971563981,"syllable_correct_per_minute":39.62264150943396,"word_correct_per_minute":28.30188679245283,"all_pause_count":9,"all_pause_duration":4.27,"mean_length_run":0.79125,"max_length_run":2.02,"all_pause_list":[[549,585],[663,711],[786,855],[914,972],[1174,1177],[1231,1264],[1315,1450],[1492,1498],[1570,1609]],"ielts_score":{"pronunciation":7.5,"fluency":6},"pte_score":{"pronunciation":72,"fluency":47},"speechace_score":{"pronunciation":81,"fluency":64},"toeic_score":{"pronunciation":170,"fluency":115},"cefr_score":{"pronunciation":"C1","fluency":"B1"}},{"segment":[14,19],"duration":4.32,"articulation_length":2.9,"syllable_count":7,"correct_syllable_count":2,"correct_word_count":1,"word_count":5,"speech_rate":1.6203703703703702,"articulation_rate":2.413793103448276,"syllable_correct_per_minute":27.777777777777775,"word_correct_per_minute":13.888888888888888,"all_pause_count":5,"all_pause_duration":1.42,"mean_length_run":0.725,"max_length_run":1.02,"all_pause_list":[[1609,1648],[1705,1720],[1822,1861],[1947,1986],[2031,2041]],"ielts_score":{"pronunciation":6.5,"fluency":5.5},"pte_score":{"pronunciation":55,"fluency":42},"speechace_score":{"pronunciation":70,"fluency":61},"toeic_score":{"pronunciation":140,"fluency":110},"cefr_score":{"pronunciation":"B1+","fluency":"A2+"}},{"segment":[19,30],"duration":11.36,"articulation_length":4.52,"syllable_count":14,"correct_syllable_count":1,"correct_word_count":1,"word_count":11,"speech_rate":1.2323943661971832,"articulation_rate":3.097345132743363,"syllable_correct_per_minute":5.281690140845071,"word_correct_per_minute":5.281690140845071,"all_pause_count":9,"all_pause_duration":6.84,"mean_length_run":0.5022222222222222,"max_length_run":0.75,"all_pause_list":[[2041,2051],[2091,2193],[2253,2610],[2652,2670],[2690,2718],[2742,2865],[2936,2952],[3000,3018],[3093,3105]],"ielts_score":{"pronunciation":4,"fluency":0},"pte_score":{"pronunciation":20,"fluency":10},"speechace_score":{"pronunciation":46,"fluency":0},"toeic_score":{"pronunciation":50,"fluency":0},"cefr_score":{"pronunciation":"A1","fluency":"A0"}}],"overall_metrics":{"segment":[0,30],"duration":30.33,"articulation_length":17.29,"syllable_count":39,"correct_syllable_count":12,"correct_word_count":8,"word_count":30,"speech_rate":1.2858555885262117,"articulation_rate":2.255639097744361,"syllable_correct_per_minute":23.738872403560833,"word_correct_per_minute":15.825914935707221,"all_pause_count":23,"all_pause_duration":13.04,"mean_length_run":0.7204166666666667,"max_length_run":2.49,"all_pause_list":[[204,216],[261,264],[513,585],[663,711],[786,855],[914,972],[1174,1177],[1231,1264],[1315,1450],[1492,1498],[1570,1648],[1705,1720],[1822,1861],[1947,1986],[2031,2051],[2091,2193],[2253,2610],[2652,2670],[2690,2718],[2742,2865],[2936,2952],[3000,3018],[3093,3105]]},"fluency_version":null}},"version":"9.5"}
    }

    gettingResults++;
    displayMetrics(data);
});

record.onclick = e => {
    console.log('I was clicked')
    record.disabled = true;
    record.style.backgroundColor = "blue"
    stopRecord.disabled=false;
    audioChunks = [];
    rec.start();
}

stopRecord.onclick = e => {
    console.log("I was clicked")
    record.disabled = false;
    stop.disabled=true;
    record.style.backgroundColor = "red"
    rec.stop();
}
