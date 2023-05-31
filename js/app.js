$( document ).ready(function() {
    window.god = window.god || {};

    var projectsLoaded = false;
    var racesLoaded = false;
    var speechLoaded = false;
    var conferenceLoaded = false;
    var patentLoaded = false;
    var hackathonLoaded = false;

    $(window).scroll(function() {
	// projects
	if (!projectsLoaded) {
	    var hT = $('#projects-single-item').offset().top,
		hH = $('#projects-single-item').outerHeight(),
		wH = $(window).height(),
		wS = $(this).scrollTop();
	    if (wS > (hT+hH-wH)){
		$.ajax({
		    url: 'nodejs/projects.json',
		    type: 'get',
		    dataType: 'json',
		    cache: false,
		    success: postProcessDataProjects,
		    async:true,
		});
	    }
	}

	// races
	if (!racesLoaded) {
	    var hT = $('#race-single-item').offset().top,
		hH = $('#race-single-item').outerHeight(),
		wH = $(window).height(),
		wS = $(this).scrollTop();
	    if (wS > (hT+hH-wH)){
		$.ajax({
		    url: 'nodejs/races.json',
		    type: 'get',
		    dataType: 'json',
		    cache: false,
		    success: postProcessDataRaces,
		    async:true,
		});
	    }
	}

	// speech
	if (!speechLoaded) {
	    var hT = $('#speech-single-item').offset().top,
		hH = $('#speech-single-item').outerHeight(),
		wH = $(window).height(),
		wS = $(this).scrollTop();
	    if (wS > (hT+hH-wH)){
		$.ajax({
		    url: 'nodejs/speech.json',
		    type: 'get',
		    dataType: 'json',
		    cache: false,
		    success: postProcessDataSpeech,
		    async:true,
		});
	    }
	}

	// conference
	if (!conferenceLoaded) {
	    var hT = $('#conference-single-item').offset().top,
		hH = $('#conference-single-item').outerHeight(),
		wH = $(window).height(),
		wS = $(this).scrollTop();
	    if (wS > (hT+hH-wH)){
		$.ajax({
		    url: 'nodejs/conference.json',
		    type: 'get',
		    dataType: 'json',
		    cache: false,
		    success: postProcessDataConference,
		    async:true,
		});
	    }
	}

	// patents
	if (!patentLoaded) {
	    var hT = $('#patent-single-item').offset().top,
		hH = $('#patent-single-item').outerHeight(),
		wH = $(window).height(),
		wS = $(this).scrollTop();
	    if (wS > (hT+hH-wH)){
		$.ajax({
		    url: 'nodejs/patent.json',
		    type: 'get',
		    dataType: 'json',
		    cache: false,
		    success: postProcessDataPatent,
		    async:true,
		});
	    }
	}

	// hackathon
	if (!hackathonLoaded) {
	    var hT = $('#hackathon-single-item').offset().top,
		hH = $('#hackathon-single-item').outerHeight(),
		wH = $(window).height(),
		wS = $(this).scrollTop();
	    if (wS > (hT+hH-wH)){
		$.ajax({
		    url: 'nodejs/hackathon.json',
		    type: 'get',
		    dataType: 'json',
		    cache: false,
		    success: postProcessDataHackathon,
		    async:true,
		});
	    }
	}
    })

    function postProcessDataProjects(data) {
	postProcessData(data, "projects");
    }

    function postProcessDataRaces(data) {
	postProcessData(data, "race");
    }

    function postProcessDataSpeech(data) {
	postProcessData(data, "speech");
    }

    function postProcessDataConference(data) {
	postProcessData(data, "conference");
    }

    function postProcessDataPatent(data) {
	postProcessData(data, "patent");
    }

    function postProcessDataHackathon(data) {
	postProcessData(data, "hackathon");
    }

    function postProcessData(data, type) {
	var modalBody = "";
	for (var i = 0; i < data.records.length; i++) {
	    var entry = data.records[i];

	    if (entry.type != type) continue;

	    modalBody += `
                              <div class="row">
                                    <div class="col-xl-12 left-info">
	                                            <h2>${entry.label}</h2>
                                        <div class="project-info mt-md-50 mt-xs-40 mb-40">
                                            <div class="content">
                                                <ul class="project-basic-info">`;


	    for (var detail in entry.details) {
		var detailLabel = detail.charAt(0).toUpperCase() + detail.substr(1).toLowerCase();
		modalBody += `
                                <li>
                                  ${detailLabel} <span>${entry.details[detail]}</span>
                                </li>`;
	    }

modalBody += `</ul>
                                                <ul class="social" style="display:none">
                                                    <li>
                                                        <h4>Share:</h4>
                                                    </li>
                                                    <li>
                                                        <a href="#"><i class="fab fa-facebook-f"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="#"><i class="fab fa-twitter"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="#"><i class="fab fa-linkedin-in"></i></a>
                                                    </li>
                                                    <li>
                                                        <a href="#"><i class="fab fa-pinterest-p"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <p>
                                            ${entry.desc}
                                        </p>
                                        <ul class="check-list mt-40" style="display:none">
                                            <li>
                                                <h4>WordPress Support</h4>
                                                <p>
                                                    Tempor nonummy metus lobortis. Sociis velit etiam, dapibus. Lectus vehicula pellentesque cras posuere tempor facilisi habitant lectus rutrum pede quisque hendrerit parturient posuere mauris ad elementum fringilla facilisi volutpat fusce pharetra.
                                                </p>
                                            </li>
                                            <li>
                                                <h4>Social Media Management</h4>
                                                <p>
                                                    Energy nonummy metus lobortis. Sociis velit etiam, dapibus. Lectus vehicula pellentesque cras posuere tempor facilisi habitant lectus rutrum pede quisque hendrerit parturient posuere mauris ad elementum fringilla facilisi volutpat fusce pharetra.
                                                </p>
                                            </li>
                                        </ul>
                                    </div>
                                </div>`;

	    // buttons
	    if (entry["agendaLink"]) {
		modalBody += `
                        <div class="button mt-55">
                            <a class="btn btn-md circle btn-dark" href="${entry.agendaLink}">Download Agenda</a>
                        </div>`;
	    }
	    
	    if (entry["powerpointLink"]) {
		modalBody += `
                        <div class="button mt-55">
                            <a class="btn btn-md circle btn-dark" href="${entry.powerpointLink}">Download Presentation</a>
                        </div>`;
	    }

	    if (entry["disclosure"]) {
		modalBody += `
                        <div class="button mt-55">
                            <a class="btn btn-md circle btn-dark" href="${entry.disclosure}">Download Disclosure</a>
                        </div>`;
	    }
	    
	    if (entry["link"]) {
		var buttonLabel = "Check it out";
		if (type == "race") buttonLabel = "View Results";
		if (type == "speech") buttonLabel = "Watch Speech";
		if (type == "patent") buttonLabel = "View Patent";

		modalBody += `
                        <div class="button mt-55">
                            <a class="btn btn-md circle btn-dark" href="${entry.link}">${buttonLabel}</a>
                        </div>`;
	    }

	    // pictures
	    modalBody += `<div class="main-content mt-40">
                                <p>
                                </p>
                                <div class="row">`;

	    if (entry["image"]) {
		modalBody += `<div class="col-lg-6 col-md-6">
                                        <img src="${entry.image}" alt="Thumb" style="width:340px;height:339px">
                                    </div>`;
	    }

	    if (entry["gallery"] && entry.gallery.length) {
		for (var j = 0; j < entry.gallery.length; j++) {
		    modalBody += `
                                    <div class="col-lg-6 col-md-6"">
                                        <img src="${entry.gallery[j]}" alt="Thumb" style="width:340px;height:339px">
                                    </div>`;
		}
	    }

	    modalBody += `<div class="devider"></div>`;
	    
	    modalBody += `</div></div>`;

	    // seperator
	    modalBody += `
<div class="blog-comments">
                            <div class="comments-area">
                                <div class="comments-title">

                                </div>
                                <div class="comments-form">
                                </div>
                            </div>
                        </div>`;
	}

	var bannerImage = "img-new/banner/2.jpg";

	if (type == "projects") bannerImage = "img/banner/workOutside2.jpg";
	if (type == "race") bannerImage = "img/banner/1211883_320906403_XLarge.jpg";
	if (type == "speech") bannerImage = "img/contests/DSC_0350.jpg";
	if (type == "conference") bannerImage = "cfca/cfca.jpg";
	if (type == "hackathon") bannerImage = "img-new/banner/hackathonBanner.jpeg";
	if (type == "patent") bannerImage = "img-new/banner/patentBanner.jpg";

	var modal = `
        <!-- Start ${type} Modal -->
      <div class="modal fade" id="${type}Modal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                <div class="modal-content">
                    <div class="modal-body">

                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="project-details-items">
                            <div class="project-thumb">
                                <img src="${bannerImage}" alt="Thumb">
                            </div>
                            <div class="top-info">
${modalBody}
</div>
</div>
</div>
</div>
</div>
        <!-- End ${type} Modal -->`;

	$("#" + type + "Modal").replaceWith(modal);
    }

    $("#submit").click(function() {
	// send email
	var params = {
	    "userId": 353,
	    "message": $("#comments").val() + "|" + $("#name").val() + "|" + $("#phone").val(),
	    "email": $("#email").val()
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
		    $("#message").html(data.error);
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

