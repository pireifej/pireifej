$( document ).ready(function() {
    window.god = window.god || {};

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const module = urlParams.get('module')
    const section = urlParams.get('section')


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
            url: 'https://shouldcallpaul.replit.app/resume/' + module,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: postProcessDataYLP,
            async:true,
        });
    } else {
        $.ajax({
            url: 'https://shouldcallpaul.replit.app/resume/' + module,
            type: 'get',
            dataType: 'json',
            cache: false,
            success: postProcessDataProjects,
            async:true,
        });
    }


    window.scrollToDiv = function(event) {
        // No auto-scroll for races module
        if (module === 'races') {
            return;
        }

        event.preventDefault(); // Prevent the default behavior

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

    // Race distance categorization function - based ONLY on distance property
    // IMPORTANT: Check longer distances FIRST to avoid substring matches (13.1 contains 3.1)
    function getRaceCategory(distance) {
        if (!distance) return 'other';
        var dist = distance.toLowerCase().trim();
        
        // Marathon: 26.2 miles (check BEFORE 6.2)
        if (dist.includes('26.2')) {
            return 'marathon';
        }
        // Half Marathon: 13.1 miles (check BEFORE 3.1)
        if (dist.includes('13.1')) {
            return 'half';
        }
        // 10K: 6.2 miles
        if (dist.includes('6.2')) {
            return '10k';
        }
        // 5K: 3.1 miles
        if (dist.includes('3.1')) {
            return '5k';
        }
        // Everything else (5 miles, 1 mile, 4 miles, etc.)
        return 'other';
    }

    // Current active filter for races (single-select)
    var activeRaceFilter = null;
    
    // Store race data for modal population
    var raceDataStore = [];

    // Filter races function (single-select)
    window.filterRaces = function(category) {
        // Update active filter (single-select)
        activeRaceFilter = category;
        $('.race-filter-btn').removeClass('active');
        $('#filter-' + category).addClass('active');
        
        // Show the nav-tab container
        $('#nav-tab').show();
        
        if (category === 'all') {
            // Show all races
            $('#nav-tab button').show();
        } else {
            // Apply single filter
            $('#nav-tab button').each(function() {
                var cat = $(this).attr('data-category');
                if (cat === category) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        
        // Scroll to top of filter panel
        var filterPanel = $('#race-filter-panel');
        if (filterPanel.length && filterPanel.offset()) {
            $('html, body').animate({
                scrollTop: filterPanel.offset().top - 20
            }, 300);
        }
        
        // Hide nav-tab if no races match
        if ($('#nav-tab button:visible').length === 0) {
            $('#nav-tab').hide();
        }
    }
    
    // Open race modal with specific race data
    window.openRaceModal = function(raceIndex) {
        var race = raceDataStore[raceIndex];
        if (!race) return;
        
        // Build details HTML
        var detailsHtml = "";
        if (race.details) {
            for (var key in race.details) {
                var detailTitle = toTitleCase(key);
                detailsHtml += `
                    <li>
                        <div class="icon">
                            <i class="fab fa-figma"></i>
                        </div>
                        <div class="content">
                            <h4>${detailTitle}</h4>
                            <span>${race.details[key]}</span>
                        </div>
                    </li>`;
            }
        }
        
        // Build pictures HTML
        var pictureHtml = "";
        if (race.image) {
            pictureHtml = `<div class="thumb"><img src="${race.image}" alt="Race Image" style="max-width: 100%; border-radius: 10px;"></div>`;
        }
        if (race.gallery && race.gallery.length > 0) {
            for (var j = 0; j < race.gallery.length; j++) {
                pictureHtml += `<div class="thumb" style="margin-top: 15px;"><img src="${race.gallery[j]}" alt="Gallery" style="max-width: 100%; border-radius: 10px;"></div>`;
            }
        }
        
        // Build link button - using original purple theme color, full width
        var linkButtonHtml = "";
        if (race.link) {
            linkButtonHtml = `<a class="btn btn-md circle btn-theme" href="${race.link}" target="_blank" style="margin-top: 20px; width: 100%; text-align: center; display: block;">View Results</a>`;
        }
        
        // Build modal content using same template structure
        var modalContent = `
            <div class="container">
                <div class="row">
                    <div class="col-12" style="text-align: center; margin-bottom: 20px;">
                        <button type="button" class="race-modal-close-btn btn btn-md circle btn-theme" style="width: 100%; text-align: center; display: block;">Close</button>
                    </div>
                </div>
                <div class="row align-center justify-content-center">
                    <div class="col-lg-5 col-md-6" style="margin-bottom: 30px;">
                        ${pictureHtml}
                    </div>
                    <div class="col-lg-6 col-md-6 offset-lg-1">
                        <h4 class="sub-title" style="color: #fff;">Race Details</h4>
                        <h2 class="title" style="color: #fff; font-size: 2rem;">${race.label}</h2>
                        <div style="color: #fff; margin-bottom: 20px; font-size: 16px; line-height: 1.6;">
                            ${race.desc || ''}
                        </div>
                        <div class="skill-list" style="margin-bottom: 25px;">
                            <ul style="color: #fff;">
                                ${detailsHtml}
                            </ul>
                        </div>
                        ${linkButtonHtml}
                    </div>
                </div>
            </div>
        `;
        
        $('#raceModalContent').html(modalContent);
        var raceModal = new bootstrap.Modal(document.getElementById('raceModal'));
        raceModal.show();
        
        // Add click handler for dynamically added close button
        $('.race-modal-close-btn').on('click', function() {
            raceModal.hide();
        });
    }

    function postProcessDataProjects(data) {
        var navTabHtml = "";
        var navTabContentHtml = "";
        var rotatingTextHtml = "";
        var rotatingTextClass = "is-visible";
        var isRacesModule = module === 'races';

        // Add race filter UI if races module
        if (isRacesModule) {
            var filterHtml = `
                <div id="race-filter-panel" style="background: rgba(255,255,255,0.95); border-radius: 15px; padding: 25px; margin-bottom: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <p style="font-size: 1.1rem; color: #666; margin-bottom: 20px; text-align: center;">
                        Browse my running journey by selecting a distance category below.
                    </p>
                    <div id="race-filters" style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
                        <button id="filter-5k" class="race-filter-btn btn btn-md circle" onclick="filterRaces('5k')" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); color: white; border: none; padding: 12px 25px;">
                            <i class="fas fa-running" style="margin-right: 8px;"></i>5K
                        </button>
                        <button id="filter-10k" class="race-filter-btn btn btn-md circle" onclick="filterRaces('10k')" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); color: white; border: none; padding: 12px 25px;">
                            <i class="fas fa-running" style="margin-right: 8px;"></i>10K
                        </button>
                        <button id="filter-half" class="race-filter-btn btn btn-md circle" onclick="filterRaces('half')" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); color: white; border: none; padding: 12px 25px;">
                            <i class="fas fa-medal" style="margin-right: 8px;"></i>Half Marathon
                        </button>
                        <button id="filter-marathon" class="race-filter-btn btn btn-md circle" onclick="filterRaces('marathon')" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); color: white; border: none; padding: 12px 25px;">
                            <i class="fas fa-trophy" style="margin-right: 8px;"></i>Marathon
                        </button>
                        <button id="filter-other" class="race-filter-btn btn btn-md circle" onclick="filterRaces('other')" style="background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%); color: white; border: none; padding: 12px 25px;">
                            <i class="fas fa-road" style="margin-right: 8px;"></i>Other
                        </button>
                        <button id="filter-all" class="race-filter-btn btn btn-md circle" onclick="filterRaces('all')" style="background: #333; color: white; border: none; padding: 12px 25px;">
                            <i class="fas fa-list" style="margin-right: 8px;"></i>Show All
                        </button>
                    </div>
                </div>
                <style>
                    .race-filter-btn.active {
                        box-shadow: 0 0 0 3px #fff, 0 0 0 5px #6c5ce7 !important;
                        transform: scale(1.05);
                    }
                    .race-filter-btn:hover {
                        opacity: 0.9;
                        transform: scale(1.02);
                    }
                </style>
            `;
            $('#nav-tab').before(filterHtml);
        }

        // Store race data for modal if races module
        if (isRacesModule) {
            raceDataStore = data.records;
        }

        for (var i = 0; i < data.records.length; i++) {
            var project = data.records[i];
            var projectLabelRotatingText = (project.label.length > 15) ? project.label.substring(0,15) + "..." : project.label;

            if (i > 0) rotatingTextClass = "is-hidden";
            rotatingTextHtml += `<b class="${rotatingTextClass}">${projectLabelRotatingText}</b>`;

            var navLinkActive = `class="nav-link"`;
            var active = "";
            var index = i+1;
            if (i == 0 && !isRacesModule) {
                navLinkActive = `class="nav-link active"`;
                active = "active";
            }

            var indexLabel = (index < 10) ? "0" + index : index;
            
            // Get race category for filtering - based ONLY on distance property
            var raceCategory = '';
            if (isRacesModule) {
                var distance = (project.details && project.details.distance) ? project.details.distance : '';
                raceCategory = getRaceCategory(distance);
            }
            var dataCategoryAttr = raceCategory ? `data-category="${raceCategory}"` : '';

            // For races, use modal; for other modules, use tabs
            if (isRacesModule) {
                navTabHtml += `
                            <button class="nav-link" id="nav-id-${index}" ${dataCategoryAttr} type="button" onclick="openRaceModal(${i})" style="display:none;">
                                ${project.label} <strong>${indexLabel}</strong>
                            </button>`;
            } else {
                navTabHtml += `
                            <button ${navLinkActive} id="nav-id-${index}" ${dataCategoryAttr} data-bs-toggle="tab" data-bs-target="#tab${index}" type="button" role="tab" aria-controls="tab${index}" aria-selected="true" onclick="scrollToDiv(event)">
                                ${project.label} <strong>${indexLabel}</strong>
                            </button>`;
            }

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
        
        // Hide tab content and nav-tab initially for races module
        if (isRacesModule) {
            $("#nav-tabContent-ireifej").hide();
            $("#nav-tab").hide();
        } else {
            scrollToOffset = $('#sub-heading').offset().top;
        }
        
        // Update scrollToOffset when tabs are shown (for non-races modules)
        $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (e) {
            if (module !== 'races') {
                var targetTabId = $(e.target).attr('data-bs-target');
                var targetPane = $(targetTabId);
                var subHeading = targetPane.find('#sub-heading');
                if (subHeading.length && subHeading.offset()) {
                    scrollToOffset = subHeading.offset().top;
                }
            }
        });
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

