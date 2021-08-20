;(function($){
    "use strict"
		
	var nav_offset_top = $('header').height() + 50; 
	var my_document = document;
    /*-------------------------------------------------------------------------------
	  Navbar 
	-------------------------------------------------------------------------------*/

	//* Navbar Fixed  
    function navbarFixed(){
        if ( $('.header_area').length ){ 
            $(window).scroll(function() {
                var scroll = $(window).scrollTop();   
                if (scroll >= nav_offset_top ) {
                    $(".header_area").addClass("navbar_fixed");
                } else {
                    $(".header_area").removeClass("navbar_fixed");
                }
            });
        };
    };
    navbarFixed();
	
	
	/*----------------------------------------------------*/
    /*  Parallax Effect js
    /*----------------------------------------------------*/
	function parallaxEffect() {
    	$('.bg-parallax').parallax();
	}
	parallaxEffect();
	
	
//	$('.courses_area').imagesLoaded(function(){
//        $('.courses_inner').isotope({ 
//            layoutMode: 'masonry',
//			percentPosition: true,
//			masonry: {
//				columnWidth: 1,
//			}
//        })
//    });
	
	
	
	
	/*----------------------------------------------------*/
    /*  portfolio_isotope
    /*----------------------------------------------------*/
   
//	$('.courses_inner').imagesLoaded(function(){
//        $('.courses_inner').isotope({ 
//            layoutMode: 'masonry',
//            percentPosition:true,
//            masonry: {
//                columnWidth: 1,
//            }            
//        })
//    });
	
	
	/*----------------------------------------------------*/
    /*  Clients Slider
    /*----------------------------------------------------*/
//    function clients_slider(){
//        if ( $('.clients_slider').length ){
//            $('.clients_slider').owlCarousel({
//                loop:true,
//                margin: 30,
//                items: 5,
//                nav: false,
//                autoplay: false,
//                smartSpeed: 1500,
//                dots:false, 
//                responsiveClass: true,
//                responsive: {
//                    0: {
//                        items: 1,
//                    },
//                    400: {
//                        items: 2,
//                    },
//                    575: {
//                        items: 3,
//                    },
//                    768: {
//                        items: 4,
//                    },
//                    992: {
//                        items: 5,
//                    }
//                }
//            })
//        }
//    }
//    clients_slider();
	/*----------------------------------------------------*/
    /*  MailChimp Slider
    /*----------------------------------------------------*/
    function mailChimp(){
        $('#mc_embed_signup').find('form').ajaxChimp();
    }
    mailChimp();
	
	$('select').niceSelect();
	
	/*----------------------------------------------------*/
    /*  Simple LightBox js
    /*----------------------------------------------------*/
    $('.imageGallery1 .light').simpleLightbox();
	
	$('.counter').counterUp({
		delay: 10,
		time: 1000
	});
	
	
	$(".skill_main").each(function() {
        $(this).waypoint(function() {
            var progressBar = $(".progress-bar");
            progressBar.each(function(indx){
                $(this).css("width", $(this).attr("aria-valuenow") + "%")
            })
        }, {
            triggerOnce: true,
            offset: 'bottom-in-view'

        });
    });
	
	function selectGallery(gallery) {
		$(".gallery_filter li").each(function() {
			if ($(this).data("filter") == gallery) {
				$(this).trigger("click");
			}
		});
	}
	
	$("#projects-menu-link").on('click',function(){
		document.cookie = "filter=.project";
		selectGallery(".project");
		window.location = "index.html#gallery";
	});
	
	$("#patents-menu-link").on('click',function(){
		document.cookie = "filter=.patent";
		selectGallery(".patent");
		window.location = "index.html#gallery";
	});
	
	$("#contests-menu-link").on('click',function(){
		document.cookie = "filter=.contests";
		selectGallery(".contests");
		window.location = "index.html#gallery";
	});
	
	$("#hackathon-menu-link").on('click',function(){
		document.cookie = "filter=.hackathon";
		selectGallery(".hackathon");
		window.location = "index.html#gallery";
	});
	
	$("#cfca-menu-link").on('click',function(){
		document.cookie = "filter=.cfca";
		selectGallery(".cfca");
		window.location = "index.html#gallery";
	});
	
	/*----------------------------------------------------*/
    /*  Isotope Fillter js
    /*----------------------------------------------------*/
	function gallery_isotope(){
		$("[id=twitter]").attr("href", "https://mobile.twitter.com/paulireifej");
		$("[id=linkedin]").attr("href", "https://linkedin.com/in/paul-ireifej-572829b");
		$("[id=instagram]").attr("href", "https://www.instagram.com/ipaullllllll/");
		$("[id=github]").attr("href", "https://github.com/pireifej");
		$("[id=facebook]").attr("href", "https://www.facebook.com/paul.ireifej");
		$("[id=hack-desc]").html("AT&T Hackathon and Software Symposium is a company-wide coding competition. Given only 24 hours to design, develop and present an innovative solution to an AT&T business problem.");

        if ( $('.gallery_f_inner').length ){
            // Activate isotope in container
			$(".gallery_f_inner").imagesLoaded( function() {
                $(".gallery_f_inner").isotope({
                    layoutMode: 'fitRows',
                    animationOptions: {
                        duration: 750,
                        easing: 'linear'
                    }
                }); 
            });
			
            // Add isotope click function
            $(".gallery_filter li").on('click',function(){
                $(".gallery_filter li").removeClass("active");
                $(this).addClass("active");
				console.log($(this));

                var selector = $(this).attr("data-filter");
				document.cookie = "filter=" + selector;
				
                $(".gallery_f_inner").isotope({
                    filter: selector,
                    animationOptions: {
                        duration: 450,
                        easing: "linear",
                        queue: false,
                    }
                });
                return false;
            });
			
			var filterCookies = document.cookie.split(";");
			var filter = "";
			for (var i = 0; i < filterCookies.length; i++) {
				var cookieValue = filterCookies[i].split("=");
				if (!cookieValue[0]) return;
				var key = cookieValue[0].trim();
				var value = cookieValue[1].trim();
				if (key == "filter") {
					filter = value;
				}
			}

			selectGallery(filter);
        }
    }
    gallery_isotope();
	
	/*----------------------------------------------------*/
    /*  Testimonials Slider
    /*----------------------------------------------------*/
    function testimonials_slider(){
        if ( $('.testi_slider').length ){
            $('.testi_slider').owlCarousel({
                loop:true,
                margin: 30,
                items: 3,
                nav: false,
                autoplay: true,
                smartSpeed: 1500,
                dots:true, 
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                    },
                    768: {
                        items: 3,
                    },
                }
            })
        }
    }
    testimonials_slider();
	
	var names = {
		"--1--" : { name: "Dori Zarr", gender: "female" },
		"--2--" : { name: "David Romanchick", gender: "male" },
		"--3--" : { name: "Steve Z", gender: "male" },
		"--4--" : { name: "Frank", gender: "male" },
		"--5--" : { name: "Alexander Matos", gender: "male" },
		"--6--" : { name: "Cathie Ruiterman", gender: "female" },
		"--7--" : { name: "Ally Bhuiyan", gender: "female" },
		"--8--" : { name: "Majorie Nazire", gender: "female" },
		"--9--" : { name: "Jenny Scott", gender: "female" },
		"--10--" : { name: "Michael Gilmore", gender: "male" },
		"--11--" : { name: "Chie Tamaki", gender: "female" },
		"--12--" : { name: "Donald Chong", gender: "male" },
		"--13--" : { name: "Jim Scanlon", gender: "male" },
		"--14--" : { name: "Ed Scarano", gender: "male"},
		"--15--" : { name: "Swathi Krishnananda", gender: "female"},
		"--16--" : { name: "Kevin McDonald", gender: "male"},
		"--17--" : { name: "Brittany Lamb", gender: "female"},
		"--18--" : { name: "Rich Gomulka", gender: "male"},
		"--19--" : { name: "Elizabeth", gender: "female"},
		"--20--" : { name: "Don Matts", gender: "male"},
		"--21--" : { name: "Andrew Edwards", gender: "male"},
		"--22--" : { name: "Eileen Kern", gender: "female"},
		"--23--" : { name: "Michael Barris", gender: "male"},
		"--24--" : { name: "Eric Warsaw", gender: "male"},
		"--25--" : { name: "Shelby Holliman", gender: "female"},
		"--26--" : { name: "Kasi Subramanian", gender: "male"},
		"--27--" : { name: "Su Brooks", gender: "female"},
		"--28--" : { name: "Aida Murphy", gender: "female"},
		"--29--" : { name: "Anne Gilson", gender: "female"},
		"--30--" : { name: "Saikat Maitra", gender: "female"},
		"--31--" : { name: "Michael Barris", gender: "male"},
		"--32--" : { name: "Jane Costagiola", gender: "female"},
		"--33--" : { name: "Jay Mussan-Levy", gender: "male"},
		"--34--" : { name: "Swathi", gender: "female"},
		"--35--" : { name: "Krishnananda", gender: "female"},
		"--36--" : { name: "Dat Le", gender: "male"},
		"--37--" : { name: "Dave Telfeyan", gender: "male"},
		"--38--" : { name: "Rebecca Marzec-Young", gender: "female"},
		"--39--" : { name: "Amrita Ghosh", gender: "male"},
		"--40--" : { name: "Shawn Mandar", gender: "male"},
		"--41--" : { name: "John Connors", gender: "male"},
		"--42--" : { name: "Manali Patel", gender: "female"},
		"--43--" : { name: "Harshika Nahar", gender: "female"},
		"--44--" : { name: "Tom Somers", gender: "male"},
		"--45--" : { name: "Peggy Seymore", gender: "female"},
		"--46--" : { name: "Ashley Rifkin", gender: "female"},
		"--47--" : { name: "Wendy Huang", gender: "female"},
		"--48--" : { name: "Maryann", gender: "female"},
		"--49--" : { name: "Nagz", gender: "male"},
		"--50--" : { name: "Donna Walters", gender: "female"},
		"--51--" : { name: "Sumanjit Paul", gender: "female"},
		"--52--" : { name: "Sami ", gender: "male"},
		"--53--" : { name: "Kimberly Chung", gender: "female"},
		"--54--" : { name: "Frank Schuck", gender: "male"},
		"--55--" : { name: "Andrew Goelz", gender: "male"},
		"--56--" : { name: "Victor Martins", gender: "male"},
		"--57--" : { name: "Thomas Kenny", gender: "male"},
		"--58--" : { name: "Manny", gender: "male"},
		"--59--" : { name: "John Steinhilber", gender: "male" },
		"--60--" : { name: "Rafael", gender: "male" },
		"--61--" : { name: "Lynda Starr", gender: "female" },
		"--62--" : { name: "Sonny Uppal", gender: "male" }
	};
	
	function setFakeName(index) {
		console.log(names[index]);
		if (names[index]["fakeName"]) return;
		$.ajax({
			url: "https://randomuser.me/api/?nat=US&gender=" + names[index].gender,
			dataType: 'json',
			success: function(data) {
				console.log(index, data.results[0].name);
				if (names[index].name.split(" ").length == 2)
					names[index]["fakeName"] = data.results[0].name.first + " " + data.results[0].name.last;
				else
					names[index]["fakeName"] = data.results[0].name.first;
				replaceText("p", index);
				replaceText("li", index);
				replaceText("h2", index);
				replaceText("h1", index);			}
		});
	}

	function replaceText(el, key) {
		var element = $(el);
		element.each(function(i,current){
			var text = $(current).text();
			var re = new RegExp(key, "g");
			if ($(current).text().includes(key)) {
			$(current).text($(current).text().replace(re, names[key].fakeName));
			}
		});
	}
	
	function fakeNameDoIt(el) {
		var element = $(el);
		element.each(function(i,current){
			var text = $(current).text();
			var re = new RegExp("--[0-9]+--", "g");
			var indices = text.match(re);
			if (indices) {
				for (var j = 0; j < indices.length; j++) {
					setFakeName(indices[j]);
				}
			}
		});
	}
	
	$(document).ready(function() {
		fakeNameDoIt("p");
		fakeNameDoIt("li");
		fakeNameDoIt("h2");
		fakeNameDoIt("h1");

		$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
			disableOn: 700,
			type: 'iframe',
			mainClass: 'mfp-fade',
			removalDelay: 160,
			preloader: false,
			fixedContentPos: false
		});
	});
	
	/*----------------------------------------------------*/
    /*  Google map js
    /*----------------------------------------------------*/
     
    if ( $('#mapBox').length ){
        var $lat = $('#mapBox').data('lat');
        var $lon = $('#mapBox').data('lon');
        var $zoom = $('#mapBox').data('zoom');
        var $marker = $('#mapBox').data('marker');
        var $info = $('#mapBox').data('info');
        var $markerLat = $('#mapBox').data('mlat');
        var $markerLon = $('#mapBox').data('mlon');
        var map = new GMaps({
        el: '#mapBox',
        lat: $lat,
        lng: $lon,
        scrollwheel: false,
        scaleControl: true,
        streetViewControl: false,
        panControl: true,
        disableDoubleClickZoom: true,
        mapTypeControl: false,
        zoom: $zoom,
            styles: [
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#dcdfe6"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "color": "#808080"
                        },
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#dcdfe6"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#ffffff"
                        },
                        {
                            "weight": 1.8
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#d7d7d7"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#ebebeb"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "geometry",
                    "stylers": [
                        {
                            "color": "#a7a7a7"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#efefef"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#696969"
                        }
                    ]
                },
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#737373"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "labels",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.stroke",
                    "stylers": [
                        {
                            "color": "#d6d6d6"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {},
                {
                    "featureType": "poi",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#dadada"
                        }
                    ]
                }
            ]
        });
    }
})(jQuery)