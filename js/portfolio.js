$( document ).ready(function() {
    window.god = window.god || {};

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const module = urlParams.get('module')
    const section = urlParams.get('section')

    console.log(module, section);

    // load banner image
    var bannerImage = "img-new/banner/2.jpg";

    var scrollToOffset = 0;
    
    if (module == "projects") bannerImage = "img/banner/workOutside2.jpg";
    if (module == "races") bannerImage = "img/banner/1211883_320906403_XLarge.jpg";
    if (module == "speech") bannerImage = "img/contests/DSC_0350.jpg";
    if (module == "conference") bannerImage = "cfca/cfca.jpg";
    if (module == "hackathon") bannerImage = "img-new/banner/hackathonBanner.jpeg";
    if (module == "patent") bannerImage = "img-new/banner/patentBanner.jpg";
    if (module == "workshops") bannerImage = "img/gallery/facebook_1716907446255_7201231769457866151.jpg";
    if (module == "ylp") bannerImage = "img/gallery/facebook_1716907117027_7201230388578389877.jpg";

    $("#banner-image").replaceWith(`<img id="banner-image" class=" wow fadeInDown" src="${bannerImage}" alt="Thumb">`);

    $("#portfolio-heading-1").replaceWith(`<h1 id="portfolio-heading-1" class="text-invisible">${module}</h1>`);
    $("#portfolio-heading-2").replaceWith(`<h2 id="portfolio-heading-2">${module}</h2>`);

    if (module == "ylp") {
	$("#portfolio-heading-2").replaceWith(`<h2 id="portfolio-heading-2">Youth Leadership Program</h2>`);
    }

    if (module == "ylp") {
	$.ajax({
	    url: 'nodejs/' + module + '.json',
	    type: 'get',
	    dataType: 'json',
	    cache: false,
	    success: postProcessDataYLP,
	    async:true,
	});
    } else {
	$.ajax({
	    url: 'nodejs/' + module + '.json',
	    type: 'get',
	    dataType: 'json',
	    cache: false,
	    success: postProcessDataProjects,
	    async:true,
	});
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
	console.log("IREIFEJ");
	console.log(data);
	var navTabHtml = "";
	var navTabContentHtml = "";
	var rotatingTextHtml = "";
	var rotatingTextClass = "is-visible";

	for (var i = 0; i < data.records.length; i++) {
	    var project = data.records[i];
	    var projectLabelRotatingText = (project.label.length > 15) ? project.label.substring(0,15) + "..." : project.label;
	    console.log(project);

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
                            <button ${navLinkActive} id="nav-id-${index}" data-bs-toggle="tab" data-bs-target="#tab${index}" type="button" role="tab" aria-controls="tab${index}" aria-selected="true" onclick="scrollToDiv(event)">
                                ${project.label} <strong>${indexLabel}</strong>
                            </button>`;

	    var details = project.details;
	    var detailsHtml = "";
	    for (var key in details) {
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

	    var aboutMeHtml = `
<div id="about" class="about-style-six-area default-padding-top">
        <div class="container">
            <div class="row align-center">
                <div class="about-style-six col-lg-5">
${pictureHtml}

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
	}

	$("#nav-tab").html(navTabHtml);
	$("#nav-tabContent-ireifej").html(navTabContentHtml);
	$("#rotating-text").replaceWith(rotatingTextHtml);
	scrollToOffset = $('#sub-heading').offset().top;
    }

    function postProcessDataYLP(data) {
	console.log("YLP");
	console.log(data);
	var navTabHtml = "";
	var navTabContentHtml = "";
	var rotatingTextHtml = "";
	var rotatingTextClass = "is-visible";

	for (var i = 0; i < data.records.length; i++) {
	    var project = data.records[i];
	    var parts = project.label.split("-");
	    var projectLabelRotatingText = parts[0];
	    console.log(project);

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
                            <button ${navLinkActive} id="nav-id-${index}" data-bs-toggle="tab" data-bs-target="#tab${index}" type="button" role="tab" aria-controls="tab${index}" aria-selected="true" onclick="scrollToDiv(event)">
                                ${project.label} <strong>${indexLabel}</strong>
                            </button>`;

	    var details = project.details;
	    var detailsHtml = "";
	    for (var key in details) {
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

	    var aboutMeHtml = `
<div id="about" class="about-style-six-area default-padding-top">
        <div class="container">
            <div class="row align-center">
                <div class="about-style-six col-lg-5">
${pictureHtml}

                </div>
                <div class="col-lg-6 offset-lg-1">
                    <h4 id="sub-heading" class="sub-title">${project.label}</h4>
		    <h2 class="title">${project.topic}</h2>
${project.desc}
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
	}

	$("#nav-tab").html(navTabHtml);
	$("#nav-tabContent-ireifej").html(navTabContentHtml);
	$("#rotating-text").replaceWith(rotatingTextHtml);
	scrollToOffset = $('#sub-heading').offset().top;

	$('#nav-id-2').trigger('click');
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

