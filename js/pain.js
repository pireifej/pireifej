$( document ).ready(function() {
    window.god = window.god || {};

    // global data structures
    var dataRecordsGlobal = {};
    
    // reference: https://openweathermap.org/api/air-pollution
    var airQualityIndex = {
	"1": "Good",
	"2": "Fair",
	"3": "Moderate",
	"4": "Poor",
	"5": "Very Poor"
    };
    var currentAirQualityIndex = 0;

    function success(pos) {
	var crd = pos.coords;

	var latitude = crd.latitude;
	var longitude = crd.longitude;
	var accuracy = crd.accuracy;
	var appid = "a4a4f8b76b42b2211a217aa3976d7495";

	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();

	$.ajax({
	    url: "https://geolocation-db.com/jsonp",
	    jsonpCallback: "callback",
	    dataType: "jsonp",
	    success: function(location) {
		$("#weather-location-name").html("<span class=\"location\"><svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" class=\"feather feather-map-pin\"><path d=\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\"></path><circle cx=\"12\" cy=\"10\" r=\"3\"></circle></svg> " + location.city + ", " + location.state + "</span>");
/*
    $('#country').html(location.country_name);
    $('#state').html(location.state);
    $('#city').html(location.city);
    $('#latitude').html(location.latitude);
    $('#longitude').html(location.longitude);
    $('#ip').html(location.IPv4);
*/
	    }
});

	const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
	const d = new Date();
	let day = weekday[d.getDay()];

	$("#weather-date").html("<span id=\"weather-date\" class=\"date\">" + day + " " + dd + "th " + yyyy + "</span>");

	var url = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&exclude=hourly,minutely&appid=" + appid + "&units=imperial";

	var urlAirQuality = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" + latitude + "&lon=" + longitude + "&appid=" + appid;

	$.get(urlAirQuality, function( data ) {
	    currentAirQualityIndex = data.list[0].main.aqi
	    var airQualityIndexExpl = airQualityIndex[currentAirQualityIndex];
	    $("#air-quality-index").replaceWith(`<span id="air-quality-index">${currentAirQualityIndex} (${airQualityIndexExpl})</span>`);
	});
	
	$.get(url, function( data ) {
	    var feelsLike = data.current.feels_like;
	    var weather = data.current.weather[0].main;
	    var currentTemp = Math.floor(data.current.temp);
	    var daily = data.daily;

	    console.log("weather set");

	    var humidity = data.current.humidity;
	    var temperature = data.current.temp;
	    var weather = data.current.weather[0].description;

	    $("#humidity").replaceWith(`<span id="humidity">${humidity}%</span>`);
	    $("#temperature").replaceWith(`<span id="temperature">${temperature}&deg</span>`);
	    $("#weather").replaceWith(`<span id="weather">${weather}</span>`);

	    var currentWeatherIcon = data.current.weather[0].icon
	    var today = daily[0].rain;
	    var dailyHtml = "";
	    var checkoutDate = new Date(); 
	    for (var i = 0; i < daily.length; i++) {
		checkoutDate.setDate( checkoutDate.getDate() + 1 );
		var nextDay = weekday[checkoutDate.getDay()];
		var thisIcon = daily[i].weather[0].icon;
		var thisTemp = Math.floor(daily[i].temp.day);
//		if (!weekday[i]) continue;
		var dayName = nextDay.substring(0,3);
		var dayHtml = `
                                        <div class="day">
                                            <span>${dayName}</span>
                                            <img src="http://openweathermap.org/img/wn/${thisIcon}@2x.png" alt="Current weather icon" width="45" height="45">
                                            <span>${thisTemp}&#730;</span>
                                        </div>`;
		dailyHtml += dayHtml;
	    }
	    $("#daily-info").html("<div class=\"previsions\">" + dailyHtml + "</div>");
	    var weatherIcon = `
<img src="http://openweathermap.org/img/wn/${currentWeatherIcon}@2x.png" alt="Current weather icon" width="90" height="90">
`;
	    
	    $("#weather-summary-icon").html(weatherIcon);
	});
    }

    function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const module = urlParams.get('module')

    // load banner image
    var bannerImage = "img-new/banner/2.jpg";

    $("#banner-image").replaceWith(`<img id="banner-image" class=" wow fadeInDown" src="${bannerImage}" alt="Thumb">`);
    
    $("#portfolio-heading-1").replaceWith(`<h1 id="portfolio-heading-1" class="text-invisible">${module}</h1>`);
    $("#portfolio-heading-2").replaceWith(`<h2 id="portfolio-heading-2">${module}</h2>`);
    
    $.ajax({
	url: 'nodejs/' + module + '.json',
	type: 'get',
	dataType: 'json',
	cache: false,
	success: postProcessDataProjects,
	async:true,
    });

    window.setInfo = function(i) {
	var project = dataRecordsGlobal[i];
	console.log(project);

	var rotatingTextHtml = "";
	var rotatingTextClass = "is-visible";
	var navTabHtml = "";
	var navTabContentHtml = "";

	var projectLabelRotatingText = (project.label.length > 15) ? project.label.substring(0,15) + "..." : project.label;

	var dailyEntryHtml = `

		      		              <!-- Start Contact Area 
    ============================================= -->
    <div id="contact" class="contact-area shape-less default-padding overflow-hidden">
        <h2 class="text-shade">Contact</h2>
        <div class="container">
            <div class="contact-content">
                <div class="row align-center">

                    <div class="col-lg-12 contact-form-box mb-md-50 mb-xs-50">
                        <div class="form-box">
                            <h2 id="daily-journal-heading">${project.label}</h2>
                            <p>
                                   Tell us about your day today.
                            </p>
                            <div class="contact-form">
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="form-group">
                                            <input class="form-control" id="diet" name="name" placeholder="Diet" type="text">
                                            <span class="alert-error"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <input class="form-control" id="stress" name="email" placeholder="Stress" type="email">
                                            <span class="alert-error"></span>
                                        </div>
                                    </div>
                                    <div class="col-lg-6">
                                        <div class="form-group">
                                            <input class="form-control" id="hydration" name="phone" placeholder="Hydration" type="text">
                                            <span class="alert-error"></span>
                                        </div>
                                    </div>
                                </div>
				<div class="row">
                                    <div class="col-lg-12">
                                        <div class="form-group">
                                            <input class="form-control" id="today-medicine" name="name" placeholder="Any medications you took today" type="text">
                                            <span class="alert-error"></span>
                                        </div>
                                    </div>
                                </div>
				<div class="row">
                                    <div class="col-lg-12">
                                        <div class="form-group">
                                           <img id="body-image" src="pain_scale.jpg" alt="Pain Scale">
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <div class="form-group comments">
                                            <textarea class="form-control" id="feelings" name="comments" placeholder="How are you feeling today?"></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12">
                                        <button type="submit" name="submit" id="submit" onclick="giveMeAssessment()">
                                            Get My Assessment
                                        </button>
                                    </div>
                                </div>
                                <!-- Alert Message -->
                                <div class="col-lg-12 alert-notification">
                                    <div id="message" class="alert-msg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- End Contact Area -->`;

	    if (i > 0) rotatingTextClass = "is-hidden";
	    rotatingTextHtml += `<b class="${rotatingTextClass}">${projectLabelRotatingText}</b>`;

	    var navLinkActive = `class="nav-link"`;
	    var active = "";
	    var index = i+1;
	    if (i == 0) {
		navLinkActive = `class="nav-link active"`;
		active = "active";
	    }

	    var indexLabel = (index < 10) ? "0" + index : index;

	    navTabHtml += `
                            <button ${navLinkActive} id="nav-id-${index}" data-bs-toggle="tab" data-bs-target="#tab${index}" type="button" role="tab" aria-controls="tab${index}" aria-selected="true" onclick="setInfo(${index});">
                                ${project.label} <strong>${indexLabel}</strong>
                            </button>`;

	    var details = project.details;
	    var detailsHtml = `
                          <li>
                                <div class="icon">
                                    <i class="fab fa-figma"></i>
                                </div>
                                <div class="content">
                                    <h4>Air Quality Index</h4>
                                    <span id="air-quality-index">--</span>
                                </div>
                            </li>
                          <li>
                                <div class="icon">
                                    <i class="fab fa-figma"></i>
                                </div>
                                <div class="content">
                                    <h4>Temperature</h4>
                                    <span id="temperature">--</span>
                                </div>
                            </li>
                          <li>
                                <div class="icon">
                                    <i class="fab fa-figma"></i>
                                </div>
                                <div class="content">
                                    <h4>Humidity</h4>
                                    <span id="humidity">--</span>
                                </div>
                            </li>
                          <li>
                                <div class="icon">
                                    <i class="fab fa-figma"></i>
                                </div>
                                <div class="content">
                                    <h4>Weather</h4>
                                    <span id="weather">--</span>
                                </div>
                            </li>`;
	    
/*	    for (var key in details) {
		var detailTitle = toTitleCase(key);
		detailsHtml += `
                          <li>
                                <div class="icon">
                                    <i class="fab fa-figma"></i>
                                </div>
                                <div class="content">
                                    <h4>${detailTitle}</h4>
                                    <span>${details[key]}</span>
                                </div>
                            </li>`;
	    }
*/
	    var pictureHtml = "";

	    if (project["image"]) {
		pictureHtml = `
		                    <div class="thumb">
                        <img class="wow fadeInUp" src="${project.image}" alt="Thumb" style="visibility: visible; animation-name: fadeInUp;">
                    </div>`;
	    }

	    if (project["gallery"]) {
		for (var j = 0; j < project.gallery.length; j++) {
		    var galleryPicture = project.gallery[j];

		    pictureHtml += `
		                    <div class="thumb">
                        <img class="wow fadeInUp" src="${galleryPicture}" alt="Thumb" style="visibility: visible; animation-name: fadeInUp;">
                    </div>`;
		}
	    }

	    var linkButtonHtml = "";
	    var buttonLabel = "Check it out";
	    
	    if (project.type == "race") buttonLabel = "View Results";
	    if (project.type == "speech") buttonLabel = "Watch Speech";
	    if (project.type == "patent") buttonLabel = "View Patent";
	    if (project["link"]) {
		linkButtonHtml = `<a style="margin: 20px 20px 20px 20px" class="btn btn-md circle btn-theme smooth-menu" href="${project.link}">${buttonLabel}</a>`;
	    }

	var bodyHtml = `
<div id="body-container">
  <img id="body-image" src="body_diagram.jpg" alt="Human Body Diagram">
  <!-- Front Body Diagram -->
  <div id="front-body">
    <div class="pain-point" style="left: 30%; top: 20%;" data-pain-point="head"></div>
    <div class="pain-point" style="left: 35%; top: 40%;" data-pain-point="neck"></div>
    <!-- Add more pain points as needed -->
  </div>
  <!-- Back Body Diagram -->
  <div id="back-body">
    <div class="pain-point" style="left: 65%; top: 20%;" data-pain-point="upper-back"></div>
    <div class="pain-point" style="left: 60%; top: 40%;" data-pain-point="lower-back"></div>
    <!-- Add more pain points as needed -->
  </div>
</div>`;

	    var aboutMeHtml = `
<div id="about" class="about-style-six-area default-padding-top">
        <div class="container">
            <div class="row align-center">
                <div class="about-style-six col-lg-5">
${bodyHtml}
                </div>
                <div class="about-style-six col-lg-5">

                </div>
<div  id="daily-entry">
${dailyEntryHtml}
</div>
                <div class="about-style-six col-lg-6 offset-lg-1">
                    <h4 id="sub-heading" class="sub-title">${project.label}</h4>
		    <h2 class="title">${project.label}</h2>
                    <p>
${project.desc}
                    </p>
                    <div class="skill-list" style="margin-bottom: 25px">
                        <ul>
${detailsHtml}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`;

	    navTabContentHtml += `
                            <!-- Single Item -->
                            <div class="tab-pane fade show ${active}" id="tab${index}" role="tabpanel" aria-labelledby="nav-id-${index}">
${aboutMeHtml}
                                <div class="row">
${linkButtonHtml}
</div>
</div>
                            <!-- End Single Item -->`;


	$("#nav-tabContent-ireifej").replaceWith(`<div class="tab-content resume-tab-content" id="nav-tabContent-ireifej">${navTabContentHtml}</div>`);
	$("#tab" + (i+1)).addClass("active");
	$("#rotating-text").replaceWith(rotatingTextHtml);
    
	// get location and weather information
	var options = {
	    enableHighAccuracy: true,
	    timeout: 5000,
	    maximumAge: 0
	};
	
	navigator.geolocation.getCurrentPosition(success, error, options);

	document.querySelectorAll('.pain-point').forEach(painPoint => {
	    painPoint.addEventListener('click', () => {
		const point = painPoint.getAttribute('data-pain-point');
		alert(`Clicked on ${point}`);
	    });
	});
    }

    window.giveMeAssessment = function() {
	console.log("give me ass");
    }

    window.scrollToDiv = function(event) {
	event.preventDefault(); // Prevent the default behavior

	console.log($('#sub-heading').offset().top);
	// Smooth scroll to #sub-heading
	$('html, body').animate({
            scrollTop: scrollToOffset
	}, 500); // Adjust the duration as needed (in milliseconds)
    }

    function toTitleCase(str) {
	return str.replace(
	    /\w\S*/g,
	    function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    }
	);
    }

    function postProcessDataProjects(data) {
	dataRecordsGlobal  = data.records;

	var navTabContentHtml = "";
	var navTabHtml = "";
	
	for (var i = 0; i < data.records.length; i++) {
	    var index = i+1;
	    var indexLabel = (index < 10) ? "0" + index : index;
	    var project = data.records[i];

	    var navLinkActive = `class="nav-link"`;
	    var active = "";

	    
	    if (i == 0) {
		navLinkActive = `class="nav-link active"`;
		active = "active";
	    }
	    
	    navTabHtml += `
                            <button ${navLinkActive} id="nav-id-${index}" data-bs-toggle="tab" data-bs-target="#tab${index}" type="button" role="tab" aria-controls="tab${index}" aria-selected="true" onclick="setInfo(${i});">
                                ${project.label} <strong>${indexLabel}</strong>
                            </button>`;

	    	    navTabContentHtml += `
                            <!-- Single Item -->
                            <div class="tab-pane fade show ${active}" id="tab${index}" role="tabpanel" aria-labelledby="nav-id-${index}">

                                <div class="row">

</div>
</div>
                            <!-- End Single Item -->`;
	}

	$("#nav-tab").html(navTabHtml);
    }

    $("#submit").click(function() {
	var comments = $("#comments").val();
	var name = $("#name").val();
	var phone = $("#phone").val();
	var email = $("#email").val();

	if (!comments) {
	    $("#message").html("Please tell me about your project.");
	    return;
	}

	if (!email) {
	    $("#message").html("I need your email address.");
	    return;
	}
	
	// send email
	var params = {
	    "userId": 353,
	    "message": comments + "|" + $("#name").val() + "|" + $("#phone").val(),
	    "email": email
	};
	const url = "https://prayoverus.com:3000/help";
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
		// always executes
		return response.json();
	    })
	    .then(data => {
		if (data.error == 0) {
		    $("#comments").val("");
		    $("#name").val("");
		    $("#phone").val("");
		    $("#email").val("");
		    $("#message").html("Thanks for your message!");
		}

		$("#message").slideDown('slow');
		$('.contact-form img.loader').fadeOut('slow', function() {
		    $(this).remove()
		});
		$('#submit').removeAttr('disabled');
	    })
	    .catch(function(error) {
		console.log("FAILED");
		console.log(error);
	    });
    });
})

