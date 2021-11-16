$( document ).ready(function() {
    window.god = window.god || {};

    $.ajax({
        url: 'nodejs/myJsonFile.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessing,
        async:true,
    });

    function postProcessing(data) {
	var fullElem = "";
	var firstElem = "";
	var secondElem = "";
	var allStuff = data.records;
	for (var i = 0; i < allStuff.length; i++) {
	    var fullElem = loadStuff(allStuff[i]);
	    firstElem += fullElem.first;
	    secondElem += fullElem.second;
	}

	$("#ireifej").html(firstElem);
	$("#ireifej2").html(secondElem);
    }

    $.getJSON( "nodejs/myJsonFile.json", function( data ) {
	return;
	console.log("getJSON request data");
	console.log(data);
	var fullElem = "";
	var firstElem = "";
	var secondElem = "";
	var allStuff = data.records;
	for (var i = 0; i < allStuff.length; i++) {
	    var fullElem = loadStuff(allStuff[i]);
	    firstElem += fullElem.first;
	    secondElem += fullElem.second;
	}

	$("#ireifej").html(firstElem);
	$("#ireifej2").html(secondElem);
    })
	.done(function() {
	    console.log('getJSON request succeeded!');
	})
	.fail(function(qXHR, textStatus, errorThrown) {
	    console.log('getJSON request failed! ');
	    console.log(errorThrown);
	})
	.always(function() {
	    console.log('getJSON request ended!');
	});

    function loadStuff(stuff) {
	console.log("Loading " + stuff.label);

	var href = stuff.href;
	var size = "style='height:339px; width: 339px'";

	if (god.mobileCheck()) {
	    size = "style='height:250px; width: 339px'";
	}
	
	var fullElem = "<div class='single-item col-6 col-lg-4 " + stuff.type + "'><a class='portfolio-item' href='#" + href + "'><div class='portfolio-wrapper'><img " + size + " class='img-fluid' alt='Item' src='" + stuff.image + "'><div class='item-content'><h6 class='content-title'>" + stuff.label + "</h6><span class='content-more'>More Info</span></div></div></a></div>";

	if (!stuff.href) return;
	if (stuff.href.includes("http")) return;
	var desc = stuff.desc;
	desc = (desc) ? desc : "Description coming soon!";
	var images = "<img class='img-fluid item-img' alt='Item' src='" + stuff.image + "'>";
	var gallery = stuff.gallery;
	if (gallery) {
	    for (var j = 0; j < gallery.length; j++) {
		images += "<img class='img-fluid item-img' alt='Item' src='" + gallery[j] + "'>";
	    }
	}

	var extraDetails = "";
	if (stuff.type == "projects" && stuff.details) {
	    var details = stuff.details;
	    var date = details.date;
	    var company = details.company;
	    var award = (details["award"]) ? details.award : "N/A";
	    var technology = details.technology;

	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+date + "</p></li><li class='list-inline-item single-info'><span>Company:</span><p>"+company + "</p></li><li class='list-inline-item single-info'><span>Award:</span><p>"+award+"</p></li><li class='list-inline-item single-info'><span>Technologies:</span><p>"+technology+"</p></li>";
	}

	if (stuff.type == "race" && stuff.details) {
	    var details = stuff.details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Distance:</span><p>"+details.distance + "</p></li><li class='list-inline-item single-info'><span>Location:</span><p>"+details.location+"</p></li><li class='list-inline-item single-info'><span>Time:</span><p>"+details.time+"</p></li>";
	}
	if (stuff.type == "speech" && stuff.details) {
	    var details = stuff.details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Club:</span><p>"+details.club + "</p></li><li class='list-inline-item single-info'><span>Area:</span><p>"+details.area + "</p></li><li class='list-inline-item single-info'><span>Division:</span><p>"+details.division+"</p></li><li class='list-inline-item single-info'><span>District:</span><p>"+details.district+"</p></li>";
	}
	if (stuff.type == "conference" && stuff.details) {
	    var details = stuff.details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Location:</span><p>"+details.location + "</p></li><li class='list-inline-item single-info'><span>Agenda:</span><p>"+details.agenda+"</p></li><li class='list-inline-item single-info'><span>CFCA:</span><p>"+details.cfca+"</p></li>";
	}
	if (stuff.type == "hackathon" && stuff.details) {
	    var details = stuff.details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Location:</span><p>"+details.location + "</p></li><li class='list-inline-item single-info'><span>Track:</span><p>"+details.track+"</p></li><li class='list-inline-item single-info'><span>Place:</span><p>"+details.place+"</p></li>";
	}
	if (stuff.type == "patent" && stuff.details) {
	    var details = stuff.details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Application Number:</span><p>"+details.applicationNo + "</p></li><li class='list-inline-item single-info'><span>Other1:</span><p>"+details.other1+"</p></li><li class='list-inline-item single-info'><span>Other2:</span><p>"+details.other2+"</p></li>";
	}

	var buttonText = "Visit Project";
	if (stuff.type == "race") buttonText = "Visit Results";
	if (stuff.type == "speech") buttonText = "Watch Speech";
	if (stuff.type == "conference") buttonText = "Visit Presentation";
	if (stuff.type == "patent") buttonText = "View Patent";

	var visitProject = (stuff.link) ? "<a class='btn content-btn button-main button-scheme' href='" + stuff.link + "' role='button'>" + buttonText + "</a>" : "";
	
	var nextElem = "<!-- Single lightbox--><div class='lightbox-wrapper' id='" + stuff.href + "'><div class='f-basis-100'><div class='lightbox-close' data-modal-close><span class='close-btn'><span class='btn-line'></span></span></div></div><div class='container'><div class='row'><div class='col-12 col-lg-5'><div class='lightbox-gallery owl-carousel owl-theme'>" + images + "</div></div><div class='col-12 col-lg-7'><div class='lightbox-content'><h3 class='content-title'>" + stuff.label + "</h3><div class='content-description'>"+desc+"</div><ul class='list-inline content-info'>" + extraDetails + "</ul>" + visitProject + "</div></div></div></div></div>";

	return { first: fullElem, second: nextElem };
    }

    var origin = window.location.origin;
    var originParts = origin.split(":");
    if (originParts[0] == "http") {
	window.location.href = "https://www.pireifej.com";
    }

    var visitorDetails = {
	appName: navigator.appName,
	onLine: navigator.onLine,
	appVersion: navigator.appVersion,
	cookieEnabled: navigator.cookieEnabled,
	language: navigator.language,
	userAgent: navigator.userAgent
    };

	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	  };

    navigator.geolocation.getCurrentPosition(success, error, options);

    function success(pos) {
	var crd = pos.coords;

	visitorDetails["latitude"] = crd.latitude;
	visitorDetails["longitude"] = crd.longitude;
	visitorDetails["accuracy"] = crd.accuracy;

	god.query("logVisitor", "afterLogVisitor", {page: window.location.pathname,details:JSON.stringify(visitorDetails)}, false, true);
    }

    function error(err) {
	god.query("logVisitor", "afterLogVisitor", {page: window.location.pathname,details:JSON.stringify(visitorDetails)}, false, true);
	console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    $("#send-email").submit(function(e) {
	e.preventDefault();

	var name = $("#contact-name").val();
	var email = $("#contact-email").val();
	var subject = $("#contact-subject").val();
	var message = $("#contact-message").val();

	var params = {
	    subject: "'" + subject + "'",
	    message: "'" + message + "'",
	    email: "'" + email + "'",
	    name: "'" + name + "'"
	};

	window.god = window.god || {};
	god.query("help", "afterHelp", params, false, false);
    });

    window.afterLogVisitor = function(response) {
	console.log("window.afterLogVisitor");
	console.log(response);
    }

    window.afterHelp = function(response) {
	console.log("afterHelp");
	console.log(response);
    }

    var blogs = [
	{
	    date: 'June 26, 2018',
	    title: 'CFCA in Chicago',
	    href: 'chicago.html',
	    heading: 'My trip to Chicago, IL to present at the 2018 CFCA.',
	    tag1: 'System',
	    tag2: 'Migration',
	    image: 'cfca/20180626_122932.jpg'
	},
	{
	    date: 'June 26, 2018',
	    title: 'CFCA in Tucson',
	    href: 'tucson.html',
	    heading: 'My trip to Tucson, AZ to present at the 2019 CFCA.',
	    tag1: 'Outsourcing',
	    tag2: 'Migration',
	    image: 'cfca/IMG_20191015_151101.jpg'
	},
	{
	    date: '2015',
	    title: 'Freehold Excursion',
	    href: 'contest3.html',
	    heading: 'Story documenting my visit to the contest venue the day before to scope it out.',
	    tag1: 'Freehold',
	    tag2: 'Hospital',
	    image: 'img/trophy/trophy2Large.jpg'
	},
	{
	    date: '2015',
	    title: 'Brutually Honest',
	    href: 'contest4.html',
	    heading: 'A brutually honest evaluation from a trusted audience member about my performance at this contest.',
	    tag1: 'Judges',
	    tag2: 'Comedy',
	    image: 'img/trophy/trophy3Large.jpg'
	},
	{
	    date: '2016',
	    title: 'The Most Important Day of my Life',
	    href: 'contest7.html',
	    heading: 'One of the most important days of my life. Finally got to the District stage in the Humorous Contest',
	    tag1: 'Humor',
	    tag2: 'Children',
	    image: 'img/contests/DSC_0350.jpg'
	},
	{
	    date: '2018',
	    title: 'My Most Painful Contest Yet',
	    href: 'contest8.html',
	    heading: 'A long and challenging contest.',
	    tag1: 'Painful',
	    tag2: 'Callback',
	    image: 'img/contests/FB_IMG_1539660566388.jpg'
	},
	{
	    date: '2019',
	    title: 'The Contest Heard Around the World',
	    href: 'contest9.html',
	    heading: 'Iʼm still recovering from a whopping 4 1/2 hour long contest.',
	    tag1: 'Longest',
	    tag2: 'Contests',
	    image: 'img/trophy/trophy7Large.jpg',
	},
	{
	    date: '2019',
	    title: 'It\'s the thought that counts',
	    href: 'contest10.html',
	    heading: 'My harrowing journey to place first at the 2019 Division F Evaluation Contest.',
	    tag1: 'Evaluation',
	    tag2: 'Division',
	    image: 'img/contests/divcontest.jpg'
	},
	{
	    date: 'May 5, 2019',
	    title: 'Aced it!',
	    href: 'contest13.html',
	    heading: 'Placing first at the District 83 Evaluation Contest.',
	    tag1: 'Evaluation',
	    tag2: 'Ace It',
	    image: 'img/contests/disteval1.jpg'
	},
	{
	    date: 'May 5, 2019',
	    title: 'The Easiest Area Contest Ever',
	    href: 'contest11.html',
	    heading: 'Tonight was a good night. A good and ... easy night.',
	    tag1: 'Easy',
	    tag2: 'Tall Tales',
	    image: 'img/contests/IMG_20191002_194504.jpg'
	},
	{
	    date: 'Nov 14, 2019',
	    title: 'Much Ado About Nothing',
	    href: 'contest12.html',
	    heading: '',
	    tag1: 'Nervous',
	    tag2: 'Charismatic',
	    image: 'img/contests/IMG_0078%20(1).JPG'
	},
	{
	    date: 'Sept 5, 2021',
	    title: 'Toastmasters Contest Advice',
	    href: 'talltales.html',
	    heading: 'What is Tall Tales?',
	    tag1: 'Imagination',
	    tag2: 'Exaggeration',
	    image: 'img/blog/cat-post/cat-post-2.jpg'
	}/*,
	{
	    date: 'TBD',
	    title: 'Coming Soon!',
	    href: '',
	    heading: 'TBD',
	    tag1: 'N/A',
	    tag2: 'N/A',
	    image: 'img/blog/cat-post/cat-post-2.jpg'
	},
	{
	    date: 'TBD',
	    title: 'Coming Soon!',
	    href: '',
	    heading: 'TBD',
	    tag1: 'N/A',
	    tag2: 'N/A',
	    image: 'img/blog/cat-post/cat-post-2.jpg'
	},
	{
	    date: 'TBD',
	    title: 'Coming Soon!',
	    href: '',
	    heading: 'TBD',
	    tag1: 'N/A',
	    tag2: 'N/A',
	    image: 'img/blog/cat-post/cat-post-2.jpg'
	}*/
    ];

    var blogPosts = "";
    for (var i = 0; i < blogs.length; i++) {
	var nextBlogPost = "<!-- Single post--><div class='col-12 col-sm-8 col-lg-4'><div class='card single-post'><a class='post-img' href='" + blogs[i].href + "'><img style='height: 218px; hwidth: 302px' class='card-img-top' src='" + blogs[i].image + "' alt='Blog post'><span class='content-date'>" + blogs[i].date + "</span></a><div class='card-body post-content'><a href='#0'><h5 class='card-title content-title'>" + blogs[i].title + "</h5><p class='card-text content-description' style='color: #333;'>" + blogs[i].heading + "</p><div class='content-tags'><span class='tags-title'>Tags:</span><ul class='list-unstyled list-inline tags-list'><li class='list-inline-item'><a href='#0'>" + blogs[i].tag1 + "</a></li><li class='list-inline-item'><a href='#0'>" + blogs[i].tag2 + "</a></li></ul></div></div></div></div>";
	blogPosts += nextBlogPost;
    }

    var finalBlogPost = "<div class='row justify-content-center'>" + blogPosts + "</div>";
    $("#ireifej-blog").html(finalBlogPost);
});
