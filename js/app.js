$( document ).ready(function() {
    console.log("HELLO!");

    

    $('#projects-single-item').trigger('mouseenter');

    console.log("yes");


    
    console.log($('#projects-single-item'));
    setTimeout(function(){
        //        $('#projects-single-item').trigger('mouseleave');
        console.log("YES!");
    }, 2000); // Adjust the timeout duration as needed
    
    window.god = window.god || {};

    var projectsLoaded = false;
    var racesLoaded = false;
    var speechLoaded = false;
    var conferenceLoaded = false;
    var patentLoaded = false;
    var hackathonLoaded = false;

    $(window).scroll(function() {
        console.log("I am scrolling");
        $("#projects-single-item").trigger("mouseover");
        $("#projects-overlay-content").trigger("mouseover");
        $("#projects-banner").trigger("mouseover");
        // projects
        if (!projectsLoaded) {
            var hT = $('#projects-single-item').offset().top,
                hH = $('#projects-single-item').outerHeight(),
                wH = $(window).height(),
                wS = $(this).scrollTop();
            if (wS > (hT+hH-wH)) {
//              $("body").addClass("loading");
                $.ajax({
                    url: 'https://shouldcallpaul.replit.app/resume/projects',
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
                    url: 'https://shouldcallpaul.replit.app/resume/races',
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
                    url: 'https://shouldcallpaul.replit.app/resume/speech',
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
                    url: 'https://shouldcallpaul.replit.app/resume/conference',
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
                    url: 'https://shouldcallpaul.replit.app/resume/patent',
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
                    url: 'https://shouldcallpaul.replit.app/resume/hackathon',
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
//      $("body").removeClass("loading");

        if (type == "projects") projectsLoaded = true;
        if (type == "race") racesLoaded = true;
        if (type == "speech") speechLoaded = true;
        if (type == "conference") conferenceLoaded = true;
        if (type == "hackathon") hackathonLoaded = true;
        if (type == "patent") patentLoaded = true;      
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
        var content = `Message: ${comments}\n\nContact Details:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}`;
        var params = {
            "subject": "Website Contact Form Submission",
            "to": "shouldcallpaul@gmail.com", 
            "content": content
        };
        const url = "/api/contact";
        
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
                    // Success - clear form and show success message
                    $("#comments").val("");
                    $("#name").val("");
                    $("#phone").val("");
                    $("#email").val("");
                    $("#message").html("Thanks for your message!");
                } else {
                    // Error - keep form fields populated and show error message
                    $("#message").html("Sorry, there was an error sending your message. Please try again or contact me directly at shouldcallpaul@gmail.com");
                }

                $("#message").slideDown('slow');
                $('.contact-form img.loader').fadeOut('slow', function() {
                    $(this).remove()
                });
                $('#submit').removeAttr('disabled');
            })
            .catch(function(error) {
                // Network/fetch error - keep form fields and show error
                $("#message").html("Sorry, there was a connection error. Please try again or contact me directly at shouldcallpaul@gmail.com");
                $("#message").slideDown('slow');
                $('.contact-form img.loader').fadeOut('slow', function() {
                    $(this).remove()
                });
                $('#submit').removeAttr('disabled');
                console.log("Contact form error:", error);
            });
    });

    $("#submit-story").click(function() {
        var person1Name = $("#person1-name").val();
        var person1Like1 = $("#person1-like1").val();
        var person1Like2 = $("#person1-like2").val();
        var person1Disslike = $("#person1-disslike").val();

        var person2Name = $("#person2-name").val();
        var person2Like1 = $("#person2-like1").val();
        var person2Like2 = $("#person2-like2").val();
        var person2Disslike = $("#person2-disslike").val();

        var person3Name = $("#person3-name").val();
        var person3Like1 = $("#person3-like1").val();
        var person3Like2 = $("#person3-like2").val();
        var person3Disslike = $("#person3-disslike").val();

        var scenario = $("#scenario").val();
        
        // get story
        var params = {
            "person1": {
                "name": person1Name,
                "like1": person1Like1,
                "like2": person1Like2,
                "disslike": person1Disslike
            },
            "person2": {
                "name": person2Name,
                "like1": person2Like1,
                "like2": person2Like2,
                "disslike": person2Disslike
            },
            "person3": {
                "name": person3Name,
                "like1": person3Like1,
                "like2": person3Like2,
                "disslike": person3Disslike
            },
            "scenario": scenario
        };

        console.log(params);
        
        const url = "https://prayoverus.com:3000/makeStoryWithChatGpt";
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
                console.log(data);
                
                if (data.error == 0) {
                    $("#story-gpt").val(data.result);
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

