$( document ).ready(function() {
    window.god = window.god || {};

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const module = urlParams.get('module')
    
    $.ajax({
	url: 'nodejs/' + module + '.json',
	type: 'get',
	dataType: 'json',
	cache: false,
	success: postProcessDataProjects,
	async:true,
    });

    function toTitleCase(str) {
	return str.replace(
	    /\w\S*/g,
	    function(txt) {
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	    }
	);
    }

    function postProcessDataProjects(data) {
	var navTabHtml = "";
	var navTabContentHtml = "";

	for (var i = 0; i < data.records.length; i++) {
	    var project = data.records[i];
	    console.log(project);

	    var navLinkActive = `class="nav-link"`;
	    var active = "";
	    var index = i+1;
	    if (i == 0) {
		navLinkActive = `class="nav-link active"`;
		active = "active";
	    }

	    var indexLabel = (index < 10) ? "0" + index : index;

	    navTabHtml += `
                            <button ${navLinkActive} id="nav-id-${index}" data-bs-toggle="tab" data-bs-target="#tab${index}" type="button" role="tab" aria-controls="tab${index}" aria-selected="true">
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
                    <h4 class="sub-title">${project.label}</h4>
		    <h2 class="title">${project.label}</h2>
                    <p>
${project.desc}
                    </p>
                    <div class="skill-list">
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
    }

    function postProcessData(data, type) {
	var hackathonDesc = "AT&T Hackathon and Software Symposium is a company-wide coding competition. Given only 24 hours to design, develop and present an innovative solution to an AT&T business problem.";
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

	    if (entry["certificate"]) {
		modalBody += `
                        <div class="button mt-55">
                            <a class="btn btn-md circle btn-dark" href="${entry.certificate}">Download Certificate</a>
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
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <i class="bg-fixed">
			<img src="img/close-white-big.svg" alt="Icon" style="margin-top:-10px"></img>
		      </i>
                       </button>
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

