$( document ).ready(function() {
    window.god = window.god || {};

    // global variables
    var userIdsWhoPrayed = {};
    var newPrayerCreated = null;
    var userPictureGlobal = "";
    var commentRequestId = null;
    var guestUserIdGlobal = 569;
    var adminUserIdGlobal = 483;
    var prayForRequestIdGlobal = null;
    var requestIds = [];
    var explorerIsActive = false;

    var userGlobal = {};

    // global persistent variables
    var prayerAdminPrayerListGlobal = {};
    var prayerAdminUserListGlobal = {};

    // exceptions are creating a user, logging in, contact the website for help
    var exceptions = {
	"/register.html": true,
	"/prayer/register.html": true,
	"/prayer/contact.html": true,
	"/contact.html": true,
	"/login.html": true,
	"/tos.html": true,
	"/about.html": true
    };

    var adminPages = {
	"/assign-prayer.html": true,
	"/prayer/assign-prayer.html": true,
	"/prayer-admin.html": true,
	"/contact-admin.html": true
    };

    $.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	if (!results) return null;
	return results[1] || 0;
    }

    $("#terms-text").hide();
    $("#cookies-text").hide();
    $("#privacy-text").hide();

    var mode = $.urlParam("mode");

    if (mode == "terms") {
	$("#terms-text").show();
    }
    if (mode == "cookies") {
	$("#cookies-text").show();
    }
    if (mode == "privacy") {
	$("#privacy-text").show();
    }

    function replaceStr(strToReplace, oldStr, newStr) {
	const regex =  new RegExp("\\b" + oldStr +"\\b",'g');
	const result = strToReplace.replace(regex,newStr);
	return result;
    }

    function getUserPopovers(requestUserId) {	
	$('*[data-user-popover]').each(function () {
            var e = $(this);
            var userRef = $(this).attr('data-user-popover');

	    // some users are hard-coded in the HTML as placeholders
	    if (!userIdsWhoPrayed[userRef]) return;
	    
	    var user = userIdsWhoPrayed[userRef];
            var messageIcon = feather.icons['message-circle'].toSvg();
            var profileIcon = feather.icons['more-horizontal'].toSvg();
            var pinIcon = feather.icons['map-pin'].toSvg();
            var bookmarkIcon = feather.icons.bookmark.toSvg();
	    var giftIcon = feather.icons["gift"].toSvg();

	    // user details
	    var userPic = "uploads/profile/" + user.picture;
	    var realname = user.real_name;
	    var about = (user.user_about.length > 25) ? user.user_about.substring(0,24) + "..." : user.user_about;
	    var username = user.user_name;
	    var timestamp = user.user_timestamp;
	    var title = user.user_title;
	    var prayerCount = user.prayer_count;
	    var requestCount = user.request_count;
	    var location = user.location;
	    var coverPic = (user.cover) ? user.cover : "3.jpg";

            e.webuiPopover({
                trigger: 'hover',
                placement: 'auto',
                width: 300,
                padding: false,
                offsetLeft: 0,
                offsetTop: 20,
                animation: 'pop',
                cache: false,
                content: function () {

                    var destroyLoader = setTimeout(function () {
                        $('.loader-overlay').removeClass('is-active');
                    }, 1000);

                    var html = `
                                <div class="profile-popover-block">

                                    <div class="loader-overlay is-active">
                                        <div class="loader is-loading"></div>
                                    </div>

                                    <div class="profile-popover-wrapper" onclick="viewProfile(${userRef})">
                                        <div class="popover-cover">
                                            <img src="img/cover/${coverPic}">
                                            <div class="popover-avatar">
                                                <img class="avatar" src="${userPic}">
                                            </div>
                                        </div>

                                        <div class="popover-meta">
                                            <span class="user-meta">
                                                <span class="username">${title} ${username}</span>
                                            </span>
                                            <span class="job-title">${about}</span>
                                            <div class="common-friends">
                                                ${giftIcon}
                                                <div class="text">
                                                    ${prayerCount} prayers
                                                </div>
                                            </div>
                                            <div class="common-friends">
                                                ${bookmarkIcon}
                                                <div class="text">
                                                    ${requestCount} requests
                                                </div>
                                            </div>
                                            <div class="user-location">
                                                ${pinIcon}
                                                <div class="text">
                                                    <a href="#">${location}</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="popover-actions" hidden>

                                        <a href="#" class="popover-icon">
                                            ${profileIcon}
                                        </a>
                                        <a href="#" class="popover-icon">
                                            ${bookmarkIcon}
                                        </a>
                                        <a href="#" class="popover-icon">
                                            ${messageIcon}
                                        </a>
                                    </div>
                                </div>
                            `;

                    return html;
                    return destroyLoader;
                }
	    });
	})
    }

    god.populatePrayerModal = function(prayerList) {
	var prayerHtml = "";
	var prayerListGlobal = {};
	for (var i = 0; i < prayerList.length; i++) {
	    var prayer = prayerList[i];

	    var title = prayer.prayer_title;
	    var tags = prayer.tags;
	    var id = prayer.prayer_id;
	    prayerAdminPrayerListGlobal[id] = prayer;
	    prayerListGlobal[id] = prayer;
	    var picture = (prayer["prayer_pic"]) ? prayer.prayer_pic : "cross-svgrepo-com.svg";
	    var prayerItemSize = ""
	    var prayerItem = `
                                <!-- Album item -->`;
	    
	    prayerItem += "<div class=\"column is-3\" onclick=\"selectPrayer(" + id + ")\" >";
	    
	   if (god.mobileCheck()) {
	       prayerItemSize = "style=\"height:50%;width:75%\"";
	   }
	    prayerItem += "<div " + prayerItemSize + " class=\"album-wrapper\" data-album=\"album-photos-1\"><div class=\"album-image\">";

	    if (god.mobileCheck()) {
		prayerItemSize = "style=\"height:25%;width:25%\"";
	    }
	    
	    prayerItem += "<img " + prayerItemSize + " id=\"prayer-item\" src=\"uploads/prayer/" + picture + "\" alt=\"\"></img>";
	    
	   prayerItem += `
                                        </div>
                                        <div class="album-meta">
                                            <div class="album-title">`;

	   prayerItem += "<span>" + title + "</span>";
	   prayerItem += "<span>" + tags + "</span>";
	   
           prayerItem += `</div>`;
                                   //         <div class="image-count">
                                     //           <i data-feather="image"></i>
                                       //         <span>8</span>
           //   </div>
	   prayerItem += `
                                        </div>
                                    </div>
                                </div>`;
	   prayerHtml += prayerItem;
	}

	$("#prayer-item-list").html(prayerHtml);
	return prayerListGlobal;
    }

    // god functions
    god.init = function () {
	console.log("god.init()");

	var mode = $.urlParam("mode");
	if (mode == "guest") {
	    localStorage.setItem("userId", 569);
	}
	
	localStorage.setItem('originalUrl', window.location.href);

	// load all request for this user
	var userId = localStorage.getItem("userId");
	var currentPage = window.location.pathname;
	
	if (userId && !exceptions[currentPage]) {
	    god.query("getUser", "afterGetUser", {}, true, true, "all");
	}

	// site wide configuration
	if (!userId && !exceptions[currentPage]) {
	    localStorage.removeItem("userId");
	    window.location.href = "login.html";
	}

	if (userId == "undefined") {
	    localStorage.removeItem("userId");
	    window.location.href = "login.html";
	}
    }

    god.insertAtCaret = function(areaId, text) {
	console.log("god.insertAtCaret");
	var txtarea = document.getElementById(areaId);
	if (!txtarea) {
	    return;
	}

	var scrollPos = txtarea.scrollTop;
	var strPos = 0;
	var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
		  "ff" : (document.selection ? "ie" : false));
	if (br == "ie") {
	    txtarea.focus();
	    var range = document.selection.createRange();
	    range.moveStart('character', -txtarea.value.length);
	    strPos = range.text.length;
	} else if (br == "ff") {
	    strPos = txtarea.selectionStart;
	}

	var front = (txtarea.value).substring(0, strPos);
	var back = (txtarea.value).substring(strPos, txtarea.value.length);
	txtarea.value = front + text + back;
	strPos = strPos + text.length;
	if (br == "ie") {
	    txtarea.focus();
	    var ieRange = document.selection.createRange();
	    ieRange.moveStart('character', -txtarea.value.length);
	    ieRange.moveStart('character', strPos);
	    ieRange.moveEnd('character', 0);
	    ieRange.select();
	} else if (br == "ff") {
	    txtarea.selectionStart = strPos;
	    txtarea.selectionEnd = strPos;
	    txtarea.focus();
	}

	txtarea.scrollTop = scrollPos;
    }

    god.validateEmail = function(email) {
	return String(email)
	    .toLowerCase()
	    .match(
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	    );
    };

    god.inputHasError = function(elemId) {
	// clear styles
	$("#" + elemId + "-control").removeClass("has-error");
	$("#" + elemId + "-control").removeClass("has-success");
	$("#" + elemId + "-field").css("border", "1px solid #e8e8e8");

	// apply new styles
	$("#" + elemId + "-field").css("border-color", "#f71416");
	$("#" + elemId + "-control").addClass("has-error");	
    }

    god.inputHasSuccess = function(elemId) {
	// clear styles
	$("#" + elemId + "-control").removeClass("has-error");
	$("#" + elemId + "-control").removeClass("has-success");
	$("#" + elemId + "-field").css("border", "1px solid #e8e8e8");

	// apply new styles
	$("#" + elemId + "-field").css("border-color", "#1ce589");
	$("#" + elemId + "-control").addClass("has-success");
    }


    god.dataURLToBlob = function(dataURL) {
	var BASE64_MARKER = ';base64,';
	if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = parts[1];
            return new Blob([raw], {type: contentType});
	}

	var parts = dataURL.split(BASE64_MARKER);
	var contentType = parts[0].split(':')[1];
	var raw = window.atob(parts[1]);
	var rawLength = raw.length;

	var uInt8Array = new Uint8Array(rawLength);

	for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
	}

	return new Blob([uInt8Array], {type: "image/jpg"});
    }

    god.makeId = function(length) {
	var result           = '';
	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var charactersLength = characters.length;
	for ( var i = 0; i < length; i++ ) {
	    result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
    }

    window.loadNotifications = function() {
	god.query("getNotifications", "afterGetNotifications", {}, true, true);
//	$("#notification-list-display").addClass("is-active");
    };

    window.switchToAdmin = function() {
	localStorage.setItem("userId", "483");
	window.location.href = "index.html";
    };

    window.switchToKimberly = function() {
	localStorage.setItem("userId", "61");
	window.location.href = "index.html";
    };

    window.switchToPaul = function() {
	localStorage.setItem("userId", "353");
	window.location.href = "index.html";
    };

    window.viewProfile = function(userId) {
	window.location.href = "profile.html?userId=" + userId;
    }

    window.loadPrayerAdminPrayerListGlobal = function(response) {
	var prayerList = response.result;
	for (var i = 0; i < prayerList.length; i++) {
	    var prayer = prayerList[i];
	    prayerAdminPrayerListGlobal[prayer.prayer_id] = prayer;
	}
    };

    window.emailShare = function(requestId) {
	console.log(requestId);
	var linkToSend = encodeURIComponent("https://prayoverus.com/index.html?requestId=" + requestId);
	var href = "mailto:enter email address" + "?"
         + "subject=Prayer Just For You!&"
         + "body=" + "Hello! I am praying for you. Click here to pray: " + linkToSend;
	window.open(href, "mail");
    }

    window.copyToClipboard = function(requestId) {
	var linkToSend = "https://prayoverus.com/index.html?requestId=" + requestId;
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(linkToSend).select();
	document.execCommand("copy");
	$temp.remove();
	$("#copy-to-clipboard-" + requestId).text("Link copied!");
    }
    
    god.mobileCheck = function() {
	let check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
    };

    god.compare = function(a,b) {
	if ( a.prayer_title < b.prayer_title ){
	    return -1;
	}
	if ( a.prayer_title > b.prayer_title ){
	    return 1;
	}
	return 0;
    }

    god.getLocalTime = function(dateString) {
	const date = new Date(dateString);

	// Get hours, minutes, and seconds
	const hours = date.getHours();
	const minutes = date.getMinutes();

	// Convert hours to 12-hour format and determine AM/PM
	const meridiem = hours >= 12 ? 'PM' : 'AM';
	const hours12 = hours % 12 || 12;

	// Format minutes with leading zero if needed
	const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

	// Construct the time string
	const timeString = `${hours12}:${formattedMinutes} ${meridiem}`;

	return timeString;
    }

    god.getTimeAgo = function (time) {
        var thisTimestamp = time.replace(".000Z", "");
        var current = new Date().getTime();
        var prayedFor = new Date(thisTimestamp).getTime();
        var difference = current - prayedFor;

        var seconds = (current-prayedFor)/1000;
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);
	var months = Math.floor(days / 30);
	var years = Math.floor(months / 12);
        var timeAgo = days + " days ago";

	if (days == 1) timeAgo = " yesterday";

        if (days == 0) {
            if (hours == 1) timeAgo = hours + " hour ago";
            else timeAgo = hours + " hours ago";
        }

        if (days == 0 && hours == 0) {
            if (minutes == 1) timeAgo = " a minute ago";
            else timeAgo = minutes + " minutes ago";
        }

	if (months > 0) {
            if (months == 1) timeAgo = " a month ago";
            else timeAgo = months + " months ago";
        }

	if (years > 0) {
            if (years == 1) timeAgo = " a year ago";
            else timeAgo = years + " years ago";
        }

        if (days == 0 && hours == 0 && minutes == 0 && months == 0 && years == 0) {
            //timeAgo = parseInt(seconds) + " just now";
	    timeAgo = " just now";
        }
	return timeAgo;
    }

    window.clickRequestFeedAd = function(elem) {
	window.location.href = "//betzapdoson.com/4/5426363";
    }

    window.afterGetRequestFeed = function(response) {
	// error in response
	if (response.error !== 0) return;
	
	var result = response.result;

	var viewComment = $.urlParam("viewComment");

	var adIcons = [
	    "domino.jpg",
	    "havas.svg",
	    "lonelydroid.svg",
	    "pizzahut.png",
	    "store.svg",
	    "android.svg",
	    "drop.svg",
	    "html5.svg",
	    "mcdonalds.png",
	    "subs.svg",
	    "angular.svg",
	    "epicburger.svg",
	    "imdb.png",
	    "metamovies.svg",
	    "quick-fashion.svg",
	    "subway.png",
	    "bk.png",
	    "fastpizza.svg",
	    "kfc.svg",
	    "nuclearjs.svg",
	    "reactjs.svg",
	    "vuejs.svg",
	    "brent.svg",
	    "gopizza.svg",
	    "la.svg",
	    "oreilly.svg",
	    "sass.svg",
	    "wordpress.svg",
	    "bulma.svg",
	    "gulp.svg",
	    "lipflow.svg",
	    "photoshop.svg",
	    "slicer.svg"];

	// request feed empty
	if (result.length == 0) {
	    var placeholder = `
<div id="page-placeholder" class="container">

            <div class="page-placeholder">
                <div class="placeholder-content">
                    <img class="light-image" src="assets/img/illustrations/placeholders/1.svg" alt="">
                    <img class="dark-image" src="assets/img/illustrations/placeholders/1.svg" alt="">
                    <h3>No requests found.</h3>
                    <p class="is-large">There aren't any requests in the category you selected.</p>
                </div>
            </div>

        </div>`;
	    $("#request-feed").html(placeholder);
	    return;
	}

	var requestHtml = "";
	requestIds = [];
	
	for (var i = 0; i < result.length; i++) {
	    var adIcon = "slicer.svg";
	    adIcon = (!adIcons[i]) ? "slicer.svg" : adIcons[i];

	    var ad = `
                            <!-- PropellerAds -->
                            <!-- /partials/widgets/fake-add-widget.html -->
                            <div class="card is-ad" onclick="clickRequestFeedAd(this)">
                              <div class="card-body" style="cursor: pointer">
                                <img style="height: 73px; width: 73px" src="assets/img/icons/logos/${adIcon}" alt="">
                                <div class="ad-text">
                                  Support Our Sponsors
                                </div>
                                <div class="ad-brand">
				  Clicking here will leave this site.
                                </div>
                              </div>
                            </div>
`;
	    
	    var request = result[i];

	    var prayerId = request.fk_prayer_id;	    
	    var timeAgo = god.getTimeAgo(request.timestamp);
	    var requestText = request.request_text;
	    if (request.use_alias) {
		request["real_name"] = request.user_name;
	    }
	    var requestOwnerName = request.real_name;
	    var requestPicture = request.request_picture;
	    var requestOwnerPicture =  request.picture;

	    var requestId = request.request_id;
	    var userId = localStorage.getItem("userId");
	    var isGuest = (userId == guestUserIdGlobal);

	    var requestUserId = request.user_id;
	    var requestOtherPerson = request.other_person;

	    requestIds.push(requestId);
	    requestOtherPerson = (requestOtherPerson !== "undefined" && requestOtherPerson) ? " (for " + requestOtherPerson + ")" : "";

	    //	    var profileIcon = feather.icons['sunrise'].toSvg();
	    var handPrayingIcon = `<img src="img/favicons/hand-svgrepo-com.svg" alt="Praying hands">`;
	    
	    var requestText = request.request_text;
	    requestHtml += `
<div class="card is-post" id="request-feed-post-${requestId}" requestId="${requestId}">
                                <!-- Main wrap -->
                                <div class="content-wrap">
                                    <!-- Header -->
                                    <div class="card-heading">
                                        <div class="user-block">
                                            <div class="image">`;

	    requestHtml += "<img src=\"uploads/profile/" + requestOwnerPicture + "\" data-demo-src=\"uploads/profile/" + requestOwnerPicture + "\" data-user-popover=\"" + requestUserId + "\" alt=\"\">";

	    requestHtml += `
                                            </div>
                                            <div class="user-info">`;
	    
	    requestHtml += "<a href=\"#\">" + requestOwnerName + "</a>";
	    requestHtml += "<span class=\"time\">" + timeAgo + "</span>";

	    requestHtml += `
                                            </div>
                                        </div>
                                        <!-- /partials/pages/feed/dropdowns/feed-post-dropdown.html -->
                                        <div class="dropdown is-spaced is-right is-neutral dropdown-trigger" onclick="dropdownTrigger(this)">
                                            <div>
                                                <div class="button">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                </div>
                                            </div>
                                            <div class="dropdown-menu" role="menu">

                                                <div class="dropdown-content">`;
	    
	    if (userId == requestUserId || userId == adminUserIdGlobal) {
		var editIcon = feather.icons.edit.toSvg();
		requestHtml += `
                                                    <a class="dropdown-item" onclick="editRequest(${requestId})">
                                                        <div class="media">
                                                            ${editIcon}
                                                            <div class="media-content">
                                                                <h3>Edit</h3>
                                                                <small>Change the details of your request.</small>
                                                            </div>
                                                        </div>
                                                    </a>`;
	    }

	    // admin-only options (begin)
	    if (userId == adminUserIdGlobal) {
		var urgentIcon = feather.icons["alert-circle"].toSvg();
		requestHtml += `
                                                    <a class="dropdown-item" onclick="broadcastUrgentRequest(${requestId})">
                                                        <div class="media">
                                                            ${urgentIcon}
                                                            <div class="media-content">
                                                                <h3>Urgent Broadcast</h3>
                                                                <small>Alert all users of your urgent prayer request</small>
                                                            </div>
                                                        </div>
                                                    </a>`;

		requestHtml += `
                                                    <a class="dropdown-item" onclick="broadcastRequest(${requestId})">
                                                        <div class="media">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-bell"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                                                            <div class="media-content">
                                                                <h3>Broadcast</h3>
                                                                <small>Alert all users of your prayer request</small>
                                                            </div>
                                                        </div>
                                                    </a>`;

/*		var apertureIcon = feather.icons.aperture.toSvg();
		requestHtml += `
                                                    <a class="dropdown-item" onclick="getPrayerForRequest(${requestId})">
                                                        <div class="media">
                                                            ${apertureIcon}
                                                            <div class="media-content">
                                                                <h3>Generate Prayer</h3>
                                                                <small>Use AI to get a prayer</small>
                                                            </div>
                                                        </div>
                                                    </a>`;*/

		var apertureIcon = feather.icons.aperture.toSvg();
		requestHtml += `
                                                    <a class="dropdown-item" onclick="copyPrayerPromptForRequest(${requestId})">
                                                        <div class="media">
                                                            ${apertureIcon}
                                                            <div class="media-content">
                                                                <h3>Copy Prayer for ChatGPT</h3>
                                                                <small>Get prompt for ChatGPT to generate prayer</small>
                                                            </div>
                                                        </div>
                                                    </a>`;

		var apertureIcon = feather.icons.airplay.toSvg();		
		requestHtml += `
                                                    <a class="dropdown-item" >
                                                        <div class="media" onclick="assignCustomPrayerForRequest(${requestId})">
                                                            ${apertureIcon}
                                                            <div class="media-content">
                                                                <h3>Assign Custom Prayer</h3>
                                                                <small>Enter a custom prayer for this request</small>
                                                            </div>
                                                        </div>
                                                    </a>`;

		var edit2Icon = feather.icons['edit-2'].toSvg();
		requestHtml += `
                                                    <a class="dropdown-item" onclick="editPrayerForRequest(${prayerId})">
                                                        <div class="media">
                                                            ${edit2Icon}
                                                            <div class="media-content">
                                                                <h3>Edit Prayer</h3>
                                                                <small>Edit the prayer assigned to this request.</small>
                                                            </div>
                                                        </div>
                                                    </a>`;
	    }

	    if (userId == requestUserId || userId == adminUserIdGlobal) {
		var deleteIcon = feather.icons["trash-2"].toSvg();
	    requestHtml += `
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item" onclick="deleteRequest(${requestId})">
                                                        <div class="media">
                                                            ${deleteIcon}
                                                            <div class="media-content">
                                                                <h3>Delete</h3>
                                                                <small>Remove this request from the feed.</small>
                                                            </div>
                                                        </div>
                                                    </a>`;
	    }
	    // admin-only options (end)

	    var share2Icon = feather.icons["share-2"].toSvg();
	    requestHtml += `
                                                    <hr class="dropdown-divider">
                                                    <a class="dropdown-item" onclick="copyToClipboard(${requestId})">
                                                        <div class="media">
                                                            ${share2Icon}
                                                            <div class="media-content">
                                                                <h3>Copy link</h3>
                                                                <small>Copy the direct link to this request to share.</small>
                                                            </div>
                                                        </div>
                                                    </a>`;

	    requestHtml += `
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- /Header -->

                                    <!-- Post body -->
                                    <div class="card-body">
                                        <!-- Post body text -->
                                        <div class="post-text">`;

	    requestHtml += "<p id=\"request-text-" + requestId + "\">" + requestText + "</p></div>";

	    requestHtml += "<a style=\"margin-top:10px\" data-morphing=\"\" id=\"morphing\" data-src=\"#morphing-content\" href=\"javascript:;\" class=\"button is-solid primary-button raised is-rounded morphing-btn\" onclick='clickPray(" + requestId + ")'><div id=\"pray-button-text-" + requestId + "\">Pray</div></a>";

	    requestHtml += `
                                        <!-- Featured image -->
                                        <div class="post-image">
                                            <a data-fancybox="post2" data-lightbox-type="comments" data-thumb="assets/img/demo/unsplash/2.jpg" href="https://via.placeholder.com/1600x900" data-demo-href="assets/img/demo/unsplash/2.jpg">
`;

	    if (requestPicture !== "undefined") {
		requestHtml += "<img style=\"width:75%;height:50%;margin-left:auto;margin-right:auto\" src=\"uploads/request/" + requestPicture + "\" data-demo-src=\"uploads/request/" + requestPicture + "\" alt=\"\">";
	    }

	    requestHtml += `
                                            </a>
                                            <!-- Post actions -->
                                            <!-- /partials/pages/feed/buttons/feed-post-actions.html -->
                                            <div hidden class="like-wrapper">`;

	    requestHtml += "<a href=\"javascript:void(0);\" onclick=\"likeButton(this," + requestId + ")\" class=\"like-button\">";

	    requestHtml += `
                                                    <i class="mdi mdi-heart not-liked bouncy"></i>
                                                    <i class="mdi mdi-heart is-liked bouncy"></i>
                                                    <span class="like-overlay"></span>
                                                </a>
                                            </div>
`;
  /*                                          <div class="fab-wrapper is-share">
                                                <a href="javascript:void(0);" class="small-fab share-fab modal-trigger" data-modal="share-modal "`;

	    
	    requestHtml += "onclick='window.share(" + requestId + ")'";

requestHtml += `
                                                 >   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link-2"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                                </a>
                                            </div>
*/
            requestHtml += `                                <div class="fab-wrapper is-comment">`;
	    requestHtml += "<a id=\"request-comment\" href=\"javascript:void(0);\" onclick=\"isComment(this," + requestId + ")\" class=\"small-fab\">";

	    requestHtml += `
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- /Post body -->`;

	    requestHtml += `                                    <!-- Post footer -->
                                    <div class="card-footer">
                                        <!-- Followers -->`;

	    requestHtml += "<div id=\"people-who-prayed-img-" + requestId + "\"></div>";
	    
	    requestHtml += "<div class=\"likers-text\" id=\"people-who-prayed-" + requestId + "\">";

	    requestHtml += "<p>No one prayed for this</p></div>";

	    requestHtml += `
                                        <!-- Post statistics -->
                                        <div class="social-count">
                                            <div class="likes-count" style="margin-right:20px">
                                                ${handPrayingIcon}`;

            requestHtml += "<span id=\"prayer-count-" + requestId + "\">0</span>";

	    requestHtml += `
                                            </div>`;
/*                                            <div class="shares-count">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-link-2"><path d="M15 7h3a5 5 0 0 1 5 5 5 5 0 0 1-5 5h-3m-6 0H6a5 5 0 0 1-5-5 5 5 0 0 1 5-5h3"></path><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                                <span>0</span>
						</div>*/

	    requestHtml += `
                                            <div class="comments-count">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>`;

	    requestHtml += "<span id=\"comment-count-" + requestId + "\">0</span>";

	    requestHtml += `
                                            </div>
                                        </div>
                                    </div>
                                    <!-- /Post footer -->
                                </div>
                                <!-- /Main wrap -->

                                <!-- Post #3 comments -->
                                <div class="comments-wrap is-hidden">
                                    <!-- Header -->
                                    <div class="comments-heading">
                                        <h4>Comments `;

	    requestHtml += "<small id=\"comments-count-" + requestId + "\">(0)</small>";

	    requestHtml += `
                                        </h4>
	    <div id="request-comment" class="close-comments" onclick="isComment(this)">`;

	    requestHtml += `
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </div>
                                    </div>
                                    <!-- Header -->
                                    <!-- Comments body -->`;

	    requestHtml += "<div id=\"comments-" + requestId + "\" class=\"comments-body has-slimscroll\">";
	    
            requestHtml += `
                                    </div>
                                    <!-- Comments body -->

                                    <!-- Comments footer -->
                                    <div class="card-footer">
                                        <div class="media post-comment has-emojis">
                                            <!-- Textarea -->
                                            <div class="media-content">
                                                <div class="field">
                                                    <p class="control">`;

	    requestHtml += "<textarea class=\"textarea comment-textarea\" rows=\"5\" placeholder=\"Write a comment...\" id=\"enter-comment-" + requestId + "\" onkeyup=\"commentKeyup(this)\"></textarea>";

	    requestHtml += `
                                                    </p>
                                                </div>
                                                <!-- Additional actions -->
                                                <div class="actions">
                                                    <div class="image is-32x32">`;

	    requestHtml += "<img style=\"width:40px;height:40px\" class=\"is-rounded\" src=\"uploads/profile/" + userPictureGlobal + "\" data-demo-src=\"uploads/profile/" + userPictureGlobal + "\" data-user-popover=\"" + requestUserId + "\" alt=\"\">";

	    requestHtml += `
                                                    </div>
                                                    <div class="toolbar">
                                                        <div class="action is-auto">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-at-sign"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>
                                                        </div>
                                                        <div class="action is-emoji" id="post-comment-button-2">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-smile"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
                                                        </div>
                                                        <div class="action is-upload">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-camera"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
                                                            <input type="file">
                                                        </div>`;

	    if (isGuest) {
		requestHtml += "<a id=\"send-comment-button-" + requestId + "\" class=\"button is-solid primary-button raised clicky\" onclick=\"sendComment(" + requestId + ")\">Login to post Comment</a>";
	    } else {
		requestHtml += "<a id=\"send-comment-button-" + requestId + "\" class=\"button is-solid primary-button raised clicky\" onclick=\"sendComment(" + requestId + ")\">Post Comment</a>";
	    }


	    requestHtml += `
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- /Comments footer -->
                                </div>
                                <!-- /Post #3 Comments -->
                            </div>`;
	    requestHtml += ad;
	}

	$("#request-feed").html(requestHtml);

	if (viewComment) {
	    $("#request-comment").trigger("click");
	}
	ireifejFunction();

	function sliceIntoChunks(arr, chunkSize) {
	    const res = [];
	    for (let i = 0; i < arr.length; i += chunkSize) {
		const chunk = arr.slice(i, i + chunkSize);
		res.push(chunk);
	    }
	    return res;
	}

//	var chunks = requestIds;

//	if (requestIds.length > 50) {
//	    chunks = sliceIntoChunks(requestIds, 50);
//	    console.log("I am chunking ... before size " + requestIds.length + ", after size " + chunks.length);
//	    $(".pageloader").addClass("is-active");
//	    $(".infraloader").addClass("is-active");
//	}

//	console.log("chunks..");
//	console.log(chunks);
	if (requestIds.length > 0) {
//	    for (var j = 0; j < chunks.length; j++) {
//		god.query("getPeopleWhoPrayed", "afterGetPeopleWhoPrayed", { requestId: requestIds.join(",") }, false, true);
//	    }
//	    god.query("getCommentCount", "afterGetCommentCount", {}, false, false);
	}
    };

    /* FIXME: taking this from assets/js/elements.js and applying dynamically */
    window.ireifejFunction = function() {
	if($("#elements-page").length){var t=function(t){if(0==(t="string"==typeof t?t:$(this).attr("href")).indexOf("#")){var n=$(t);if(n.length&&($("html, body").animate({scrollTop:n.offset().top-50-20}),history&&"pushState"in history))return history.pushState({},document.title,window.location.pathname+t),!1}},n=function(){$("#albums-help-modal .next-modal").one("click",(function(){$(this).closest(".card-body").find(".content-block, .dot").toggleClass("is-active"),$(this).text("got it").off(),e()}))},e=function(){$("#albums-help-modal .next-modal").on("click",(function(){var t=$(this),e=t.attr("data-modal");t.closest(".modal").removeClass("is-active"),$("#"+e).addClass("is-active"),setTimeout((function(){t.closest(".card-body").find(".content-block, .dot").toggleClass("is-active"),t.text("Next").off(),n()}),800)}))},o=function(){$("#videos-help-modal .next-modal").one("click",(function(){$(this).closest(".card-body").find(".content-block, .dot").toggleClass("is-active"),$(this).text("got it").off(),i()}))},i=function(){$("#videos-help-modal .next-modal").on("click",(function(){var t=$(this),n=$(this).attr("data-modal");t.closest(".modal").removeClass("is-active"),$("#"+n).addClass("is-active"),setTimeout((function(){t.closest(".card-body").find(".content-block, .dot").toggleClass("is-active"),t.text("Next").off(),o()}),800)}))};t(window.location.hash),$("body").on("click",".submenu-wrap a",t),$(".element-menu .menu-trigger").on("click",(function(){$(this).closest(".element-menu").siblings(".element-menu").find(".menu-trigger").removeClass("is-active"),$(this).closest(".element-menu").siblings(".element-menu").find(".submenu-wrap").slideUp(),$(this).toggleClass("is-active"),$(this).siblings(".submenu-wrap").slideToggle("fast")})),$(".submenu-wrap li a").on("click",(function(){$(".submenu-wrap li a").removeClass("is-active"),$(this).addClass("is-active")})),n(),o(),$(".lightbox-trigger, .close-lightbox").on("click",(function(){$(".custom-profile-lightbox").toggleClass("is-active"),setTimeout((function(){$(".image-loader, .comments-loader").toggleClass("is-active")}),1200)})),$((function(){$('[data-fancybox="cl-group-demo"]').fancybox({baseClass:"fancybox-custom-layout",infobar:!1,touch:{vertical:!1},buttons:["close","thumbs","share"],animationEffect:"fade",transitionEffect:"fade",preventCaptionOverlap:!1,idleTime:!1,gutter:0,caption:function(t){return'<div style="padding: 20px;"><h3>home</h3><p>interiors, exteriors, and the humans that inhabit them.</p><p><a href="https://unsplash.com/collections/curated/162" target="_blank">unsplash.com</a></p></div>'}}),$(".quick_view").fancybox({baseClass:"quick-view-container",infobar:!1,buttons:!1,thumbs:!1,margin:0,touch:{vertical:!1},animationEffect:!1,transitionEffect:"slide",transitionDuration:500,baseTpl:'<div class="fancybox-container" role="dialog"><div class="quick-view-content"><div class="quick-view-carousel"><div class="fancybox-stage"></div></div><div class="quick-view-aside"></div><button data-fancybox-close class="quick-view-close">X</button></div></div>',onInit:function(t){for(var n='<ul class="quick-view-bullets">',e=0;e<t.group.length;e++)n+='<li><a data-index="'+e+'" href="javascript:;"><span>'+(e+1)+"</span></a></li>";n+="</ul>",$(n).on("click touchstart","a",(function(){var t=$(this).data("index");$.fancybox.getInstance((function(){this.jumpTo(t)}))})).appendTo(t.$refs.container.find(".quick-view-carousel"));var o=t.group[t.currIndex].opts.$orig.data("qw-form");t.$refs.container.find(".quick-view-aside").append($("#"+o).clone(!0).removeClass("is-hidden"))},beforeShow:function(t){t.$refs.container.find(".quick-view-bullets").children().removeClass("active").eq(t.currIndex).addClass("active")}}),$.fancyConfirm=function(t){t=$.extend(!0,{title:"Are you sure?",message:"",okButton:"OK",noButton:"Cancel",callback:$.noop},t||{}),$.fancybox.open({type:"html",src:'<div class="fancybox-confirm fc-content p-5 rounded"><h2 class="title mb-10">'+t.title+"</h2><p>"+t.message+'</p><p class="text-right buttons mt-10"><a data-value="0" data-fancybox-close href="javascript:;" class="button">'+t.noButton+'</a><button data-value="1" data-fancybox-close class="button is-solid primary-button raised">'+t.okButton+"</button></p></div>",opts:{animationDuration:350,animationEffect:"material",modal:!0,baseTpl:'<div class="fancybox-container fc-container" role="dialog" tabindex="-1"><div class="fancybox-bg"></div><div class="fancybox-inner"><div class="fancybox-stage"></div></div></div>',afterClose:function(n,e,o){var i=o?o.target||o.currentTarget:null,a=i?$(i).data("value"):0;t.callback(a)}}})},$("#test_confirm").click((function(){$.fancyConfirm({title:"Are you sure you want to delete this post?",message:"You are about to delete a post permanently. Post content and attachements will be lost without being ablt to be recovered",okButton:"Delete",noButton:"Cancel",callback:function(t){t?alert("This is a demo callback. Delete was clicked"):alert("This is a demo callback. Cancel was clicked")}})})),$.fn.fancyMorph=function(t){var n=function(t,n){var e=this;e.opts=$.extend({animationEffect:!1,infobar:!1,buttons:["close"],smallBtn:!1,touch:!1,baseClass:"fancybox-morphing",afterClose:function(){e.close()}},n),e.init(t)};return n.prototype.init=function(t){var n=this;n.$btn=t.addClass("morphing-btn"),n.$clone=$('<div class="morphing-btn-clone" />').hide().insertAfter(t),t.wrap('<span class="morphing-btn-wrap"></span>').on("click",(function(t){t.preventDefault(),n.start()}))},n.prototype.start=function(){var t=this;t.$btn.hasClass("morphing-btn_circle")||(t.$btn.width(t.$btn.width()).parent().width(t.$btn.outerWidth()),t.$btn.off(".fm").on("transitionend.fm webkitTransitionEnd.fm oTransitionEnd.fm MSTransitionEnd.fm",(function(n){"width"===n.originalEvent.propertyName&&(t.$btn.off(".fm"),t.animateBg())})).addClass("morphing-btn_circle"))},n.prototype.animateBg=function(){var t=this;t.scaleBg(),t.$clone.show(),t.$clone[0].offsetHeight,t.$clone.off(".fm").on("transitionend.fm webkitTransitionEnd.fm oTransitionEnd.fm MSTransitionEnd.fm",(function(n){t.$clone.off(".fm"),t.complete()})).addClass("morphing-btn-clone_visible")},n.prototype.scaleBg=function(){var t=this.$clone,n=this.getScale(),e=this.$btn,o=e.offset();t.css({top:o.top+.5*e.outerHeight()-e.outerHeight()*n*.5-$(window).scrollTop(),left:o.left+.5*e.outerWidth()-e.outerWidth()*n*.5-$(window).scrollLeft(),width:e.outerWidth()*n,height:e.outerHeight()*n,transform:"scale("+1/n+")"})},n.prototype.getScale=function(){var t=this.$btn,n=.5*t.outerWidth(),e=t.offset().left+n-$(window).scrollLeft(),o=t.offset().top+n-$(window).scrollTop(),i=$(window).width(),a=$(window).height(),s=e>i/2?e:i-e,c=o>a/2?o:a-o;return Math.ceil(Math.sqrt(Math.pow(s,2)+Math.pow(c,2))/n)},n.prototype.complete=function(){var t=this.$btn;$.fancybox.open({src:t.data("src")||t.attr("href")},this.opts)},n.prototype.close=function(){var t=this,n=t.$clone;t.scaleBg(),n.one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",(function(e){n.hide(),t.$btn.removeClass("morphing-btn_circle")})),n.removeClass("morphing-btn-clone_visible"),$(window).off("resize.fm")},this.each((function(){var e=$(this);e.data("morphing")||e.data("morphing",new n(e,t))})),this},$("[data-morphing]").fancyMorph({hash:"morphing"})}))};
    }

    window.commentKeyup = function(elem) {
	var enterComment = $(elem);
	var commentText = enterComment.val();
	var commentLength = commentText.length;

	enterComment.css("border-color", "#e0e0e0");
	if (commentLength > 450) {
	    enterComment.val(commentText.substring(0,450));
	    enterComment.css("border-color", "red");
	}
    };

    window.goToContact = function() {
	window.location.href = "contact.html";
    };

    window.clickPray = function(requestId) {
	god.query("getPrayer", "afterGetPrayer", {requestId: requestId}, true, true);
    }

    window.prayerModalSearch = function() {
	console.log("prayerModalSearch");
	god.searchPrayer(prayerAdminPrayerListGlobal);
    }

    $(".fancybox-button fancybox-button--close").on('click', function(event){
	event.stopPropagation();
	event.stopImmediatePropagation();
	//(... rest of your JS code)
    });

    god.searchPrayer = function(prayerList) {
	var searchText = $("#search-prayer-text").val().toLowerCase();
	var prayerHtml = "";

	for (var key in prayerList) {
	    var prayer = prayerList[key];
	    var prayerTitle = prayer.prayer_title.toLowerCase();
	    var prayerDesc = prayer.tags.toLowerCase();

	    var id = prayer.prayer_id;
	    var title = prayer.prayer_title;
	    var picture = (prayer["prayer_pic"]) ? prayer.prayer_pic : "cross-svgrepo-com.svg";
	    var tags = prayer.tags;
	    var prayerItemSize = ""
	    
	    if (!prayerTitle.includes(searchText) && !prayerDesc.includes(searchText)) continue;

	    var prayerItem = `
                                <!-- Album item -->`;

	    prayerItem += "<div class=\"column is-3\" onclick=\"selectPrayer(" + id + ")\" >";

	    if (god.mobileCheck()) {
		prayerItemSize = "style=\"height:50%;width:75%\"";
	    }
	    prayerItem += "<div " + prayerItemSize + " class=\"album-wrapper\" data-album=\"album-photos-1\"><div class=\"album-image\">";

	    if (god.mobileCheck()) {
		prayerItemSize = "style=\"height:25%;width:25%\"";
	    }

	    prayerItem += "<img " + prayerItemSize + " id=\"prayer-item\" src=\"uploads/prayer/" + picture + "\" alt=\"\"></img>";

	    prayerItem += `
                                        </div>
                                        <div class="album-meta">
                                            <div class="album-title">`;

	    prayerItem += "<span>" + title + "</span>";
	    prayerItem += "<span>" + tags + "</span>";

            prayerItem += `</div>`;
                                   //         <div class="image-count">
                                     //           <i data-feather="image"></i>
                                       //         <span>8</span>
            //   </div>
	    prayerItem += `
                                        </div>
                                    </div>
                                </div>`;
	    prayerHtml += prayerItem;
	}

	$("#prayer-item-list").html(prayerHtml);
    }

    window.afterGetPrayer = function(response) {
	console.log("window.afterGetPrayer");
	console.log(response);
	if (response.error !== 0) return;

	// request no longer exists
	if (!response.result) {
	    return;
	}
	
	var result = response.result;
	var prayerText = result.prayer_text;
	var requestId = result.request_id;

	var prayerLines = prayerText.split("\n");
	var prayerDisplay = "";
	for (var i = 0; i < prayerLines.length; i++) {
	    var prayerLine = prayerLines[i];
	    if (!prayerLine) continue;
	    prayerDisplay += "<p>" + prayerLine + "</p></br>";
	}

	var userId = localStorage.getItem("userId");
	var amenButtonText = (userId == guestUserIdGlobal) ? "Login to Pray" : "Amen";

	var amenButtonStyle = "style='color:white;text-decoration:underline;cursor:pointer;'"
	$("#amen-button").html(amenButtonText);

	prayerDisplay += "<span id=\"amen-button\" onclick=\"clickAmen(" + requestId + ")\" " + amenButtonStyle + ">" + amenButtonText + "</span>";

	$("#morphing-content").html(prayerDisplay);
    }

    window.clickAmen = function(requestId) {
	// guest account cannot publish
	var userId = localStorage.getItem("userId");
	if (userId == guestUserIdGlobal) {
	    localStorage.removeItem("userId");
	    window.location.href = "login.html";
	    return;
	}

//	$("#amen-button").html("Sending prayer ...");
	$(".fancybox-button").trigger("click");
	
	prayForRequestIdGlobal = requestId;
	god.query("prayFor", "afterPrayFor", {requestId: requestId}, true, true);
    }

    window.resetTabHighlight = function() {
	// reset tab coloring
	$("#feed-tab").css("border-bottom-color", "#dbdbdb");
	$("#feed-tab").css("color", "#dbdbdb");
	$("#my-feed-tab").css("border-bottom-color", "#dbdbdb");
	$("#my-feed-tab").css("color", "#dbdbdb");
	$("#unassigned-feed-tab").css("border-bottom-color", "#dbdbdb");
	$("#unassigned-feed-tab").css("color", "#dbdbdb");
	$("#prayed-feed-tab").css("border-bottom-color", "#dbdbdb");
	$("#prayed-feed-tab").css("color", "#dbdbdb");
    }

    window.fireModalWindow = function() {
	$("#main-page-sub-nav").hide();
    }

    window.closeModalWindow = function() {
	$("#main-page-sub-nav").show();
    }

    window.closePrayerModal = function() {
	var modal = UIkit.modal("#user-photos-modal");
	modal.hide();
    }

    window.isComment = function(elem, requestId) {
	if (requestId) {
	    god.query("getRequestComments", "afterGetRequestComments", { requestId: requestId, limited: true }, false, true);
	}
	
	$(elem)
	    .addClass("is-active")
	    .closest(".card")
	    .find(".content-wrap, .comments-wrap")
	    .toggleClass("is-hidden");
	var jump = $(elem).closest(".is-post");
	var new_position = $(jump).offset();

	$("html, body")
	    .stop()
	    .animate({ scrollTop: new_position.top - 70 }, 500);
	//e.preventDefault();
	setTimeout(function () {
	    $(".emojionearea-editor").val("");
	}, 400);
    };

    window.likeButton = function(elem, requestId) {
	$(elem).toggleClass("is-active");
    };

    window.afterPrayFor = function(response) {
	if (response.error == 0) {
	    // refresh prayed for display
	    god.query("getPeopleWhoPrayed", "afterGetPeopleWhoPrayed", { requestId: prayForRequestIdGlobal }, false, true);

	    $("#pray-button-text-" + prayForRequestIdGlobal).html("Prayed for");
	    
	    // set new prayer icon to denote prayed for
	    var newPrayerButtonHtml = "<div class='flex space-x-4 lg:font-bold'><a class='flex items-center space-x-2'><span class='bg-gray-100 h-9 p-1.5 rounded-full text-blue-600 w-9 cursor-pointer iconify' data-icon='fa-solid:hands-wash' style='height:50px;width:50px;color:black'></span><div> Prayed For!</div></a></div>";
	    $("#pray-for-container-" + prayForRequestIdGlobal).html(newPrayerButtonHtml);
	}
    };

    window.sendComment = function(requestId) {
	console.log("sendComment " + requestId);
	commentRequestId = requestId;

	var userId = localStorage.getItem("userId");
	var isGuest = (userId == guestUserIdGlobal);

	if (isGuest) {
	    localStorage.removeItem("userId");
	    window.location.href = "login.html";
	}

	var commentText = $("#enter-comment-" + requestId).val();
	commentText = commentText.replace(/'/g, "\\'");
	
	if (!commentText) return;

	$("#send-comment-button-" + requestId).html("Posting...");
	$("#send-comment-button-" + requestId).addClass("is-loading");
	$("#send-comment-button-" + requestId).css("pointer-events", "none");
	
	var params = {
	    requestId: requestId,
	    comment: commentText
	};
	god.query("postComment", "afterPostComment", params, true, true);
    }

    window.afterPostComment = function(response) {
	$("#enter-comment-" + commentRequestId).val("");
	$("#send-comment-button-" + commentRequestId).html("Post Comment");
	$("#send-comment-button-" + commentRequestId).removeClass("is-loading");
	$("#send-comment-button-" + commentRequestId).css("pointer-events", "auto");
	god.query("getRequestComments", "afterGetRequestComments", { requestId: commentRequestId }, false, true, "comments-" + commentRequestId);
    };

    window.loadComments = function(requestId) {
	commentRequestId = requestId;
	god.query("getRequestComments", "afterGetRequestComments", { requestId: requestId }, false, true, "comments-"+requestId);
    }

    window.afterGetRequestComments = function(response) {
	if (response.error !== 0) return;

	var comments = response.result;

	if (comments.length == 0) return;

	var commentsHtml = "";
	var requestId = comments[0].request_id;

	console.log("window.afterGetRequestComments!");
	console.log(comments);

	for (var i = 0; i < comments.length; i++) {
	    var comment = comments[i];
	    var picture = comment.picture;
	    var userId = comment.user_id;
	    var name = (comment.use_alias) ? comment.user_name : comment.real_name;
	    var timeAgo = god.getTimeAgo(comment.timestamp);
	    var text = comment.comment;
	    
	    commentsHtml += `                                        <!-- Comment -->
                                        <div class="media is-comment">
                                            <!-- User image -->
                                            <div class="media-left">
                                                <div class="image">`;

	    commentsHtml += "<img src=\"uploads/profile/" + picture + "\" data-demo-src=\"" + picture + "\" data-user-popover=\"" + userId + "\" alt=\"\">";

	    commentsHtml += `
                                                </div>
                                            </div>
                                            <!-- Content -->
                                            <div class="media-content">`;

	    commentsHtml += "<a href=\"#\">" + name + "</a>";

	    commentsHtml += "<span class=\"time\">" + timeAgo + "</span>";

	    commentsHtml += "<p>" + text + "</p>";

	    commentsHtml += `
                                                <!-- Comment actions -->
                                                <div class="controls">
`;
//                                                    <div class="like-count">
//                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
//                                                        <span>1</span>
//                                                    </div>
//                                                    <div class="reply">
//                                                        <a href="#">Reply</a>
	    //                                                    </div>

	    commentsHtml += `
                                                </div>
                                            </div>`;

	    commentsHtml += `
                                            <!-- Right side dropdown -->
                                            <div class="media-right">
                                                <div class="dropdown is-spaced is-right is-neutral dropdown-trigger">
                                                    <div>
                                                        <div class="button">
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                                                        </div>
                                                    </div>
                                                    <div class="dropdown-menu" role="menu">
                                                        <div class="dropdown-content">
                                                            <a class="dropdown-item">
                                                                <div class="media">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                                    <div class="media-content">
                                                                        <h3>Hide</h3>
                                                                        <small>Hide this comment.</small>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                            <div class="dropdown-divider"></div>
                                                            <a href="#" class="dropdown-item">
                                                                <div class="media">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-flag"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                                                                    <div class="media-content">
                                                                        <h3>Report</h3>
                                                                        <small>Report this comment.</small>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <!-- /Comment -->`;
	}

	$("#comments-" + requestId).html(commentsHtml);
	$("#comments-count-" + requestId).html("(" + comments.length + ")");
    };

    function emojiUnicode (emoji) {
	var comp;
	if (emoji.length === 1) {
            comp = emoji.charCodeAt(0);
	}
	comp = (
            (emoji.charCodeAt(0) - 0xD800) * 0x400
		+ (emoji.charCodeAt(1) - 0xDC00) + 0x10000
	);
	if (comp < 0) {
            comp = emoji.charCodeAt(0);
	}
	return comp.toString("16");
    };

    window.afterGetCommentCount = function(response) {
	if (response.error !== 0) return;

	var result = response.result;

	if (result.length == 0) return;

	for (var i = 0; i < result.length; i++) {
	    var requestId = result[i].request_id;
	    var commentCount = result[i].count;
	    $("#comment-count-" + requestId).text(commentCount);
	}
    }

    window.afterGetPeopleWhoPrayed = function(response) {
	console.log("window.afterGetPeopleWhoPrayed");
	console.log(response);
	if (!response.result.length) return;
	console.log("window.afterGetPeopleWhoPrayed");
	console.log(response);
	var requests = {};
	var result = response.result;

        for (var i = 0; i < result.length; i++) {
	    var entry = result[i];
	    var entryRequestId = entry.request_id;
            if (!requests[entryRequestId]) requests[entryRequestId] = [];
	    userIdsWhoPrayed[entry.user_id] = true;
	    requests[entryRequestId].push(
		{
		    name: entry.real_name,
		    userId: entry.user_id,
		    picture: entry.picture,
		    timestamp: god.getTimeAgo(entry.timestamp)
		}
	    );
        }

        for (var key in requests) {
            var people = requests[key];
	    var peopleText = "";
	    var peopleImg = "";

	    var allPeopleList = "";
	    var allPeoplePicsHtml = "";
	    var firstPerson = "";
	    
	    for (var j = 0; j < people.length; j++) {
		allPeoplePicsHtml += "<img src=\"uploads/profile/" + people[j].picture + "\" data-demo-src=\"uploads/profile/" + people[j].picture + "\" data-user-popover=\"" + people[j].userId + "\" alt=\"\">";
	    }

	    firstPerson = people[0].name;

	    $("#prayer-count-" + key).text(people.length);
	    
	    if (people.length == 1) {
		peopleText = " prayed for this";
	    }
	    
	    if (people.length > 1) {
		peopleText = "and " + (people.length - 1) + " more prayed for this";
	    }

	    $("#people-who-prayed-" + key).html("<p><a href=\"#\">" + firstPerson + "</a></p><p>" + peopleText + "</p></div>");

	    $("#people-who-prayed-img-" + key).html("<div class=\"likers-group\">" + allPeoplePicsHtml + "</div>");
        }

	var myArray = [];
	for (var key in userIdsWhoPrayed) {
	    myArray.push(key);
	}
	god.query("getAllUsers", "afterGetAllUsers", {userId:myArray.join(",")}, false, true);
    }

    window.showAllPeopleWhoPrayed = function(allPeopleList) {
	if (!allPeopleList) return;
	var modal = UIkit.modal("#all-people-who-prayed-modal");
	var items = allPeopleList.split(",");

	$("#people-who-prayed-name-list").html("");

	for (var i = 0; i < items.length; i+=3) {
	    if (!items[i]) continue;
	$("#people-who-prayed-name-list").append("<div class='clicky row'><img style='margin:10px 10px 10px 10px;height:50px;width:50px' class='w-10 h-10 rounded-full' src='uploads/profile/" + items[i+1] + "'><div class='column'><h2 style='color:black;font-weight:100'>" + items[i] + "</h2><p style='color:black'>" + items[i+2] + "</p></div></div>");
	}
	
	modal.show();
    };

    /* Prayer Admin */
    function compare( a, b ) {
	if ( a.prayer_title < b.prayer_title ){
	    return -1;
	}
	if ( a.prayer_title > b.prayer_title ){
	    return 1;
	}
	return 0;
    }

    window.afterGetActiveAndInactivePrayers = function(response) {
	var prayerList = response.result;
	var newPrayerId = $("#create-new-prayer-content").val();
	newPrayerCreated = false;
	
	prayerList.sort(compare);

	if (newPrayerId) {
	    newPrayerCreated = true;
	}

	newPrayerId = (newPrayerId) ? newPrayerId : prayerList[0].prayer_id;

	$("#select-prayer-box").html("");

	var prayerListHtml = "";
	for (var i = 0; i < prayerList.length; i++) {
	    var prayer = prayerList[i];
	    prayerAdminPrayerListGlobal[prayer.prayer_id] = prayer;

	    if (prayer.prayer_id == newPrayerId) {
		prayerListHtml += "<option selected value='" + prayer.prayer_id + "'>" + prayer.prayer_title + "</option>";
	    } else {
		prayerListHtml += "<option value='" + prayer.prayer_id + "'>" + prayer.prayer_title + "</option>";
	    }
	}
	$("#select-prayer-box").append("<select id='select-prayer-dropdown-box'>" + prayerListHtml + "</select>");

	// get first prayer
	var firstPrayer = prayerAdminPrayerListGlobal[newPrayerId];

	// set prayer title
	$("#prayer-title").val(firstPrayer.prayer_title);

	// set prayer description
	$("#prayer-desc").val(firstPrayer.tags);

	god.query("getPrayerById", "afterGetFirstPrayerById", {"prayerId":newPrayerId}, false, false, "all");

	// set prayer active
	if (firstPrayer.active == 1) {
	    $("#prayer-active").prop('checked', true);
	} else {
	    $("#prayer-active").prop('checked', false);
	}

	$("#feed-upload-input-2").attr("filename", firstPrayer.prayer_pic);

	var feedUploadHtml = `
<div id="feed-upload" class="feed-upload" style="width: 100px !important; height: 100px !important">                        
                <div class="upload-wrap">
                    <img src="uploads/prayer/${firstPrayer.prayer_pic}" alt="">
                </div>
            </div>`;
	$("#feed-upload").html(feedUploadHtml);

	$("#create-new-prayer-title").val("");
	$("#create-new-prayer-content").val("");
	$("#create-prayer-desc").val("");
    }

    window.afterGetFirstPrayerById = function(response) {
	// get prayer text
	var firstPrayer = response.result[0];
	var prayerText = firstPrayer.prayer_text;
	if (newPrayerCreated) {
	    prayerText = replaceStr(prayerText, "me", "{{name}}");
	    prayerText = replaceStr(prayerText, "I", "{{name}}");
	    prayerText = replaceStr(prayerText, "us", "{{name}}");
	    prayerText = replaceStr(prayerText, "my", "{{gender1}}");
	    prayerText = replaceStr(prayerText, "our", "{{gender1}}");
	    prayerText = replaceStr(prayerText, "his", "{{gender1}}");
	    prayerText = replaceStr(prayerText, "her", "{{gender1}}");
	    prayerText = replaceStr(prayerText, "he", "{{gender2}}");
	    prayerText = replaceStr(prayerText, "she", "{{gender2}}");
	    prayerText = replaceStr(prayerText, "him", "{{gender3}}");
	    prayerText = replaceStr(prayerText, "her", "{{gender3}}");
	}

	// set prayer content
	$("#prayer-content").val(prayerText);

	// set prayer content for me
	$("#prayer-content-me").val(firstPrayer.prayer_text_me);
    }

    /* End Prayer Admin */

    window.afterGetAllUsers = function(response) {
	var users = response.result;

	$("#select-user-box").append("<option style=\"width:auto;\" data-icon=\"fa-heart\" value=\"all\">ALL</option>");
	for (var i = 0; i < users.length; i++) {
	    var user = users[i];
	    userIdsWhoPrayed[user.user_id] = user;
//	    prayerAdminUserListGlobal[user.user_id] = user;
	    $("#select-user-box").append('<option style="width:auto;" data-icon="fa-heart" value="'+ user.user_id + '">'+ user.real_name + '-' + user.user_id+'</option>');
	}
	console.log(userIdsWhoPrayed);

	if (window["afterGetOtherPeople"]) {
	    window.afterGetOtherPeople(response);
	}
	
	getUserPopovers();
    }

    $('#is-friends-button').click(function(){
        alert('Sign new href executed.');
    });

    window.afterGetNotifications = function(response) {
	$("#notification-list").empty();
	$("#notification-list-mobile").empty();
	var htmlNotifications = "";

	var notifications = response.result;
	if (!notifications.length) return;

	for (var i = 0; i < notifications.length; i++) {
	    var entry = notifications[i];
	    var timeAgo = god.getTimeAgo(entry.timestamp);
	    var realName = entry.real_name;
	    var picture = entry.picture;

	    	htmlNotifications += `
	                                <div class="media">
                                    <figure class="media-left">
                                        <p class="image">`;

	    htmlNotifications += "<img src=\"uploads/profile/" + picture + "\" data-demo-src=\"uploads/profile/" + picture + "\" alt=\"\">";

	    htmlNotifications += `
                                        </p>
                                    </figure>
                                    <div class="media-content">
`;

	    htmlNotifications += "<span><a href=\"#\">" + realName + "</a> prayed for <a href=\"#\">your request</a>.</span><span class=\"time\">" + timeAgo + "</span>";

	    htmlNotifications += `
                                    </div>
                                    <div class="media-right">
                                        <div class="added-icon">
                                            <i data-feather="message-square"></i>
                                        </div>
                                    </div>
                                </div>`;
	}

	$("#notification-list").html("<div class='nav-drop-body is-notifications'>" + htmlNotifications + "</div>");
	$("#notification-list-mobile").html("<div class='nav-drop-body is-notifications'>" + htmlNotifications + "</div>");
    }

    window.isFriendsClick = function() {
	console.log("isFriensdClick");
    };

    window.goToRequestFeed = function() {
	window.location.href = "request-feed.html";
    }

    window.afterGetSuperUsers = function(response) {
	var kimberly = response.result[0];
	var paul = response.result[1];
	
	var kimberlyPic = kimberly.picture;
	var paulPic = paul.picture;

	$("#kimberly-user-switch-pic").attr("src", "uploads/profile/" + kimberlyPic);
	$("#paul-user-switch-pic").attr("src", "uploads/profile/" + paulPic);

	$("#kimberly-user-switch-pic-mobile").attr("src", "uploads/profile/" + kimberlyPic);
	$("#paul-user-switch-pic-mobile").attr("src", "uploads/profile/" + paulPic);
    };

    god.getCurrentUser = function() {
	return userGlobal;
    }
    
    window.afterGetUser = function(response) {
	var result = response.result;
	var user = result[0];
	userGlobal = user;

	// guest account
	if (!user) {
	    user = {
		picture: "defautlUser.png",
		email: "guest@prayoverus.com",
		user_name: "Guest",
		location: "Guest Account",
		user_title: "Guest Account",
		user_about: "This is a Guest Account only",
		real_name: "Guest",
		last_name: "Guest",
		family_id: 2,
		family_name: "None",
		family_desc: "None"
	    };
	    $("#settings-option").hide();
	    $("#profile-menu").hide();
	}

	// set group ID (or family ID)
	localStorage.setItem('groupId', user.family_id);

	userPictureGlobal = user.picture;

	// admin-level displays
	$("#assign-prayer-menu").hide();
	$("#prayer-admin-menu").hide();
	$("#contact-admin-menu").hide();
	$("#unassigned-feed-tab").hide();
	$("#prayer-admin-explore-item").hide();
	$("#email-admin-explore-item").hide();
	$("#prayer-browser-explore-item").hide();
	
	$("#admin-user-switch").hide();
	$("#kimberly-user-switch").hide();
	$("#paul-user-switch").hide();
	
	$("#admin-user-switch-mobile").hide();
	$("#kimberly-user-switch-mobile").hide();
	$("#paul-user-switch-mobile").hide();

	if (user.email == "guest@prayoverus.com") {
	    $("#contacts-explore-item").hide();
	    $("#header-settings-option").hide();
	    $("#header-settings-option").css("visibility", "hidden");
	    $("#header-settings-option").css("display", "none");
	    $("#header-settings-option").removeAttr("href");
	    
	    $("#header-settings-option-mobile").hide();
	    $("#header-settings-option-mobile").css("visibility", "hidden");
	    $("#header-settings-option-mobile").css("display", "none");
	    $("#header-settings-option-mobile").removeAttr("href");
	}

	if (user.email == "paul@prayoverus.com") {
	    $("#assign-prayer-menu").show();
	    $("#prayer-admin-menu").show();
	    $("#contact-admin-menu").show();
	    $("#unassigned-feed-tab").show();
	    $("#prayer-admin-explore-item").show();
	    $("#email-admin-explore-item").show();
	    $("#prayer-browser-explore-item").show();
	    
	    $("#paul-user-switch").show();
	    $("#kimberly-user-switch").show();
	    
	    $("#paul-user-switch-mobile").show();
	    $("#kimberly-user-switch-mobile").show();

	    god.query("getAllUsers", "afterGetSuperUsers", {userId:"61,353"}, false, true);
	}

	if (user.email == "pireifej@gmail.com" ||
	    user.email == "kimchung80@gmail.com") {
	    $("#admin-user-switch").show();
	    $("#admin-user-switch-mobile").show();
	    god.query("getAllUsers", "afterGetSuperUsers", {userId:"61,353"}, false, true);
	}
	

	// set user details on screen header, requests, elsewhere
	$('*[id*=real-name]').each(function() {
	    $(this).html(user.real_name);
	    $(this).val(user.real_name);
	});
	$('*[id*=user-name]').each(function() {
	    $(this).html(user.user_name);
	});
	$('*[id*=full-name]').each(function() {
	    $(this).html(user.real_name + " " + user.last_name);
	});

	$('*[id*=last-name]').each(function() {
	    $(this).html(user.last_name);
	    $(this).val(user.last_name);
	});

	$('*[id*=user-name]').each(function() {
	    $(this).html(user.user_name);
	    $(this).val(user.user_name);
	});
	$('*[id*=user-title]').each(function() {
	    $(this).html(user.user_title);
	});
	$('*[id*=user-location]').each(function() {
	    $(this).html(user.location);
	    $(this).val(user.location);
	});
	$('*[id*=user-gender]').each(function() {
	    $(this).html(user.gender);
	});
	$('*[id*=user-about]').each(function() {
	    $(this).html(user.user_about);
	    $(this).val(user.user_about);
	});
	$('*[id*=user-created]').each(function() {
	    $(this).html(god.getFormattedTimestamp(user.timestamp));
	});
	$('*[id*=user-created-short]').each(function() {
	    var parts = god.getFormattedTimestamp(user.timestamp).split("@");
	    var partOne = parts[0];
	    $(this).html(partOne);
	});
	$('*[id*=user-picture]').each(function() {
	    $(this).attr("src", "uploads/profile/" + user.picture);
	});

	$("#feed-upload").attr("src", "uploads/profile/" + user.picture);
	var coverPic = (user.cover) ? user.cover : "3.jpg";
	$("#cover-image-profile").attr("src", "img/cover/" + coverPic);
	$('*[id*=my-email-address]').each(function() {
	    $(this).html(user.email);
	});

	$("#email").html(user.email);
	$("#email").val(user.email);

	$('select[name=settings-group]').val(user.family_id);

	if (user.gender == "male") {
	    $('#gender').val('0');
	    $('#gender').trigger('change');
	    $("#gender-male").prop('checked', true);
	}
	if (user.gender == "female") {
	    $('#gender').val('1');
	    $('#gender').trigger('change');
	    $("#gender-female").prop('checked', true);
	}
	
	$("#settings-group").val(user.family_id);
	$("#settings-group").trigger("change");

	// User Settings page
	console.log("User Settings");
	console.log(user);
	$("#user-settings-email").val(user.email);
	$("#user-settings-last-name").val(user.last_name);
	$("#user-settings-real-name").val(user.real_name);
	$("#user-settings-user-name").val(user.user_name);
	$("#user-settings-title").val(user.user_title);
	$("#user-settings-about").val(user.user_about);
	$("#user-settings-location").val(user.location);
	$("#user-settings-family-name").val(user.place_id);
	$("#user-settings-phone-number").val(user.phone_number);

	$('#user-settings-use-alias').prop('checked', (user.use_alias == 1));
	$('#user-settings-request-emails').prop('checked', (user.request_emails == 1));
	$('#user-settings-prayer-emails').prop('checked', (user.prayer_emails == 1));
	$('#user-settings-allow-comments').prop('checked', (user.allow_comments == 1));
	$('#user-settings-general-emails').prop('checked', (user.general_emails == 1));
	$('#user-settings-summary-emails').prop('checked', (user.summary_emails == 1));
	
	// end User Settings page
    }

    //Open explorer menu
    $('#explorer-trigger, #mobile-explorer-trigger').on('click', function(){
	if (explorerIsActive) {
	    $("#full-navigation-menu").removeClass("is-active");
	    explorerIsActive = false;
	} else {
	    $("#full-navigation-menu").addClass("is-active");
	    explorerIsActive = true;
	}
    });

    god.getPrayerAdminPrayerListGlobal = function() {
	return prayerAdminPrayerListGlobal;
    };

    god.getPrayerAdminUserListGlobal = function() {
	return prayerAdminUserListGlobal;
    };

    god.getEnv = function() {
	return "prod";
    }

    window.logout = function() {
	var userId = localStorage.getItem("userId");
	console.log("window.logout", userId);
	if (userId) {
	    localStorage.removeItem("userId");
	    window.location.href = "login.html";
	}
    }

    god.getFormattedTimestamp = function(timestamp) {
	var timestamp = timestamp.split("T");
	var date = timestamp[0];
	var time = timestamp[1];
	var times = time.split(":");
	var hour = parseInt(times[0]);
	var amOrPM = "AM";
	if (hour > 12) {
	    hour -= 12;
	    amOrPM = "PM"
	}
	time = hour + ":" + times[1] + " " + amOrPM;
	date = date + " " + time;

	var dateVals = date.split("-");
	var year = dateVals[0];
	var month = dateVals[1];
	var day = dateVals[2];

	var dayArray = day.split(" ");
	day = dayArray[0];

	if (month == 1) month = "January";
	if (month == 2) month = "February";
	if (month == 3) month = "March";
	if (month == 4) month = "April";
	if (month == 5) month = "May";
	if (month == 6) month = "June";
	if (month == 7) month = "July";
	if (month == 8) month = "August";
	if (month == 9) month = "September";
	if (month == 10) month = "October";
	if (month == 11) month = "November";
	if (month == 12) month = "December";

	return month + " " + day + ", " + year + " @ " + time;
	//return date;
    }

    // commandName - command name to send to nodejs/sendQuery
    // jsonpCallback - function to callback after query returns with a response
    // params - object that includes key/value parameters for query
    // includeUserId - do you want to include current user ID?
    // includeTimeZone - do you want to include client time zone?
    // showLoadingOverlay - show the spinny circle thing on entire page 'all' or element 'id of elem'
    god.query = function(commandName, jsonpCallback, params, includeUserId, includeTimeZone, showLoadingOverlay) {
	params = (!params) ? {} : params;

	if (!commandName) return;
	if (!jsonpCallback) return;

	if (commandName == "prayFor") {
	    $("#amen-button").html("Sending prayer ...");
	}

	params["command"] = commandName;
	params["jsonpCallback"] = jsonpCallback;
	
	if (includeTimeZone) {
	    // get time zone
	    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
	    params["tz"] = tz;
	}

	// redirect to login screen if user is not already logged on
	var userId = localStorage.getItem("userId");
	userId = 12;

	// exceptions are creating a user, logging in, contact the website for help
	var cmdExceptions = {
	    "getUserByEmail": true,
	    "updateUserSettings": true,
	    "createUser": true,
	    "login": true,
	    "email": true,
	    "help" :true,
	    "logVisitor": true,
	    "loginWithService": true,
	    "getUserCount": true,
	    "getAllPrayersCount": true,
	    "getRequestCount": true,
	    "getAllPrayers": true,
	    "getFamily": true,
	    "passwordChangeEmail": true,
	    "addSponge": true,
	    "getSponges": true,
	    "getSpongeById": true,
	    "sendPromotionalEmail": true,
	    "createNewChurchInfo": true
	};
	
	var currentPage = window.location.pathname;

	if (!cmdExceptions[params["command"]] && !userId) {
	    if (exceptions[currentPage]) {
		console.log("Command '" + params.command + "' is not called.");
		return;
	    }
//	    window.location.href = "login.html";
	    return;
	}

	if (includeUserId) {
	    params["userId"] = userId;
	}

	god.sendQuery(params, showLoadingOverlay);
    }

    god.sendQuery = function(params, showLoadingOverlay) {
	console.log("SEND QUERY - " + params.command);

	// local
	if (window.location.protocol == "file:") {
		var command = params["command"];
		var jsonpCallback = params["jsonpCallback"];
		console.log("This is a local env running " + command + " with callback " + jsonpCallback);

		if (!window[command]) {
			console.log(command + " missing in get-json-responses.js");
			return;
		}
		var localResponse = window[command]();
		window[jsonpCallback](localResponse);
		return;
	} else if (window.location.protocol !== "https:") {
	    var command = params["command"];
	    alert("URL is not using HTTPS - query will not run.");
	    return;
	}
	console.log("YES!");
	var port = "3000"; // prod
	if (window.location.href.indexOf("pireifej") >= 0) {
	    params["env"] = "test";
	    port = "3001";
	} else {
	    params["env"] = "prod";
	}

	const url = "https://prayoverus.com:" + port + "/" + params.command;
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
		    console.log("ERROR RESULT FOR " + params.command);
		    throw new Error(response.error)
		}
		console.log("SUCCESS RESULT FOR " + params.command);
		console.log(response);
		return response.json();
	    })
	    .then(data => {
		console.log("SUCCESS RESULT FOR " + params.command + " WITH DATA");
		console.log(params.jsonpCallback);
		console.log(data);
		window[params.jsonpCallback](data);
	    })
	    .catch(function(error) {
		console.log("FAILED FOR " + params.command);
		console.log(error);
	    });

/*	$.ajax({
	    type: "GET",
	    url: "callSendQuery.php",
	    data: params,
	    cache: false,
	    dataType: 'jsonp',
	    jsonpCallback: params.jsonpCallback,
	    contentType: 'application/json; charset=utf-8;',
	    success: function(data) {
		console.log("SUCCESS RESULT FOR " + params.command);
		console.log(data);
		console.log(params.jsonpCallback);
	    },
	    error: function(jqXHR, textStatus, errorThrown) {
		console.log("ERROR RESULT FOR " + params.command);
		console.log(params);
		console.log(textStatus);
		console.log(jqXHR.statusText);
		console.log(errorThrown);
	    }
	});*/
    }

    $(".dual-nav").on('shown.bs.collapse',function(){
	$(".dual-navv").collapse('show');
    })
    $(".dual-nav").on('hidden.bs.collapse',function(){
	$(".dual-navv").collapse('hide');
    })
});
