$( document ).ready(function() {
    window.god = window.god || {};

    var blogLoaded = false;

    function doBlogs(blogItems) {
	var blogHtml = "";

	for (var i = 0; i < blogItems.length; i++) {
	    var blogItem = blogItems[i];
	    var title = blogItem.title;
	    var date = blogItem.date;
	    var image = blogItem.image;
	    var modalName = blogItem.link;
	    var content = blogItem.content;
	    var tag = blogItem.tag;


	    blogHtml += `
                <!-- Single item -->
                <div class="blog-style-one mb-30 col-lg-4 col-md-6">
                    <div class="item">
                        <div class="thumb">
                           <a href="#" data-bs-toggle="modal" data-bs-target="#${modalName}"><img src="${image}" alt="Thumb"></a>
                        </div>
                        <div class="info">
                            <h4>
                                <a href="#" data-bs-toggle="modal" data-bs-target="#${modalName}">${title}</a>
                            </h4>
                            <div class="meta">
                                <ul>
                                    <li>
                                        <a href="#"><i class="fas fa-user-circle"></i> ${tag}</a>
                                    </li>
                                    <li>
                                        <i class="fas fa-calendar-alt"></i> ${date}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- End Single item -->`;

	    var singleBlogModal = `
        <!-- Start Services Single Modal -->
        <div class="modal fade" id="${modalName}" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
                <div class="modal-content">
                    
                    <div class="modal-body">

                        <div class="modal-header">
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>

                        <div class="services-single-content">
                            <div class="thumb">
                                <img src="${image}" alt="Thumb">
                            </div>
                            <h2>${title}</h2>
                            <div id="content-${modalName}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- End Services Single Modal -->
`;
	    $("#" + modalName).replaceWith(singleBlogModal);
	}

	$("#blog-list").replaceWith(blogHtml);
    }

    var blogItems = [
	{
	    link: "chicago",
	    title: "Managing a Successful System Migration",
	    date: "June 26, 2018",
	    image: "cfca/20180626_122932.jpg",
	    tag: "CFCA"
	},
	{
	    link: "tucson",
	    title: "CFCA in Tucson",
	    date: "October 15, 2019",
	    image: 'cfca/IMG_20191015_151101.jpg',
	    tag: "CFCA"
	},
	{
	    link: "contest10",
	    title: "It's the thought that counts",
	    date: "March 2019",
	    image: "img/contests/divcontest.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "contest11",
	    title: "The Easiest Area Contest Ever",
	    date: "May 5, 2019",
	    image: "img/contests/IMG_20191002_194504.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "contest12",
	    title: "Much Ado About Nothing",
	    date: "Nov 14, 2019",
	    image: "img/contests/IMG_0078%20(1).JPG",
	    tag: "Toastmasters"
	},
	{
	    link: "contest13",
	    title: "NOT a long email",
	    date: "May 5, 2019",
	    image: "img/contests/disteval1.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "contest3",
	    title: "Before the 2015 Divison F Tall Tales",
	    date: "Nov 5, 2016",
	    image: "img/trophy/trophy2Large.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "contest4",
	    title: "Brutally Honest",
	    date: "Nov 5, 2016",
	    image: "img/trophy/trophy3Large.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "contest7",
	    title: "Ranting",
	    date: "Nov 5, 2016",
	    image: "img/contests/DSC_0350.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "contest8",
	    title: "My Most Painful Contest Yet",
	    date: "Oct 15, 2018",
	    image: "img/contests/FB_IMG_1539660566388.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "contest9",
	    title: "The Contest Heard Around the World",
	    date: "March 2019",
	    image: "img/trophy/trophy7Large.jpg",
	    tag: "Toastmasters"
	},
	{
	    link: "talltales",
	    title: "What is Tall Tales?",
	    date: "Sept 5, 2021",
	    image: "img/blog/cat-post/cat-post-2.jpg",
	    tag: "Toastmasters"
	}
    ];

    $(window).scroll(function() {
	if (blogLoaded) return;
	var hT = $('#blog').offset().top,
	    hH = $('#blog').outerHeight(),
	    wH = $(window).height(),
	    wS = $(this).scrollTop();
	if (wS > (hT+hH-wH)){
	    doBlogs(blogItems);
	    blogLoaded = true;
	    $.get("nodejs/chicago.blog", function(result) {
		$("#content-chicago").replaceWith(result);
	    });
	    $.get("nodejs/contest10.blog", function(result) {
		$("#content-contest10").replaceWith(result);
	    });
	    $.get("nodejs/contest11.blog", function(result) {
		$("#content-contest11").replaceWith(result);
	    });
	    $.get("nodejs/contest12.blog", function(result) {
		$("#content-contest12").replaceWith(result);
	    });
	    $.get("nodejs/contest13.blog", function(result) {
		$("#content-contest13").replaceWith(result);
	    });
	    $.get("nodejs/contest3.blog", function(result) {
		$("#content-contest3").replaceWith(result);
	    });
	    $.get("nodejs/contest4.blog", function(result) {
		$("#content-contest4").replaceWith(result);
	    });
	    $.get("nodejs/contest7.blog", function(result) {
		$("#content-contest7").replaceWith(result);
	    });
	    $.get("nodejs/contest8.blog", function(result) {
		$("#content-contest8").replaceWith(result);
	    });
	    $.get("nodejs/contest9.blog", function(result) {
		$("#content-contest9").replaceWith(result);
	    });
	    $.get("nodejs/talltales.blog", function(result) {
		$("#content-talltales").replaceWith(result);
	    });
	    $.get("nodejs/tucson.blog", function(result) {
		$("#content-tucson").replaceWith(result);
	    });
	}
    });
})
