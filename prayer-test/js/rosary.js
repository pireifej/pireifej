$( document ).ready(function() {
    window.god = window.god || {};
    god.init();

    // prayer text
    const apostlesCreed = `I believe in God, the Father Almighty, Creator of heaven and earth; And in Jesus Christ, His only Son, our Lord;
    Who was conceived by the Holy Spirit,
    Born of the Virgin Mary,
    Suffered under Pontius Pilate,
    Was crucified, died, and was buried.
	He descended into hell.
	The third day he rose again from the dead.
	He ascended into Heaven,
    And is seated at the right hand of God, the Father Almighty;
    From thence he shall come to judge the living and the dead.
	I believe in the Holy Spirit,
    The Holy Catholic Church,
    The Communion of Saints,
    The forgiveness of sins,
    The resurrection of the body,
    And life everlasting. Amen.`;

    const ourFather = `Our Father, who art in heaven, hallowed be Thy name. Thy Kingdom come. Thy Will be done, on earth as it is in heaven. Give us this day our daily bread; and forgive us our trespasses, as we forgive those who trespass against us; and lead us not into temptation, but deliver us from evil. Amen.`;

    const hailMary = `Hail Mary, full of grace, the Lord is with thee. Blessed art thou among women, and blessed is the fruit of thy womb, Jesus. Holy Mary, Mother of God, pray for us sinners, now and at the hour of our death. Amen.`;

    const gloryBe = `Glory be to the Father, and to the Son, and to the Holy Spirit.  As it was in the beginning, is now and ever shall be, world without end. Amen.`;

    var rosaryPrayers = [
	{title: "The Apostles Creed", text: apostlesCreed},
	{title: "Our Father", text: ourFather},
	{title: "Hail Mary (1/3)", text: hailMary},
	{title: "Hail Mary (2/3)", text: hailMary},
	{title: "Hail Mary (3/3)", text: hailMary},
	{title: "Glory Be", text: gloryBe},
	// THE FIRST JOYFUL MYSTERY: THE ANNUNCIATION
	{title: "test", text: "test", pic: "img/rosary/rosary1.jpg"}
    ];

    var currentPrayerIndex = 0;
    updateDisplayProgress();

    if (god.mobileCheck()) {
	console.log("MOBILE!");
	$("#currentPrayer").css("height", "450px");
	$("#currentPrayer").css("min-height", "450px");
	$("#currentPrayer").css("max-height", "450px");
    } else {
	console.log("DESKTOP!");
	$("#currentPrayer").css("height", "200px");
	$("#currentPrayer").css("min-height", "200px");
	$("#currentPrayer").css("max-height", "200px");
    }
    
    // get day of the week
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var n = weekday[d.getDay()];

    var rosaryMysteries = {
	"Sunday": {
	    "mystery": "Glorious Mysteries of the Rosary"
	},
	"Monday": {
	    "mystery": "Joyful Mysteries of the Rosary"
	},
	"Tuesday": {
	    "mystery": "Sorrowful Mysteries of the Rosary"
	},
	"Wednesday" :{
	    "mystery": "Glorious Mysteries of the Rosary"
	},
	"Thursday": {
	    "mystery": "Luminous Mysteries of the Rosary"
	},
	"Friday": {
	    "mystery": "Sorrowful Mysteries of the Rosary"
	},
	"Saturday": {
	    "mystery": "Joyful Mysteries of the Rosary"
	}
    };

    god.query("getRosarySession", "afterGetRosarySession", {sessionId:"rosary"}, true, true, "all");

    $("#mystery-day").html(n + " - " + rosaryMysteries[n].mystery);
    $( "#back-btn" ).click(function() {
	if (currentPrayerIndex > 0) currentPrayerIndex--;
	updateDisplayProgress();
    });

    $( "#next-btn" ).click(function() {
	if (currentPrayerIndex <= rosaryPrayers.length) currentPrayerIndex++;
	updateDisplayProgress();
    });

    function updateDisplayProgress() {
	if (currentPrayerIndex >= rosaryPrayers.length) return;
	$("#currentPrayer").html(rosaryPrayers[currentPrayerIndex].text);
	$("#prayerTitle").html(rosaryPrayers[currentPrayerIndex].title);
	$("#currentPrayerIndex").html(currentPrayerIndex+1 + "/" + rosaryPrayers.length);

	if (rosaryPrayers[currentPrayerIndex]["pic"]) {
	    $("#rosary-pic").attr("src", rosaryPrayers[currentPrayerIndex].pic);
	}
    }

    main();

    async function main() {
	VoxeetSDK.initialize("lOfJlQThiT-Ocn4gLKgddQ==", "LDtSqNGRZo254GK7ufntF37giOJwVJUjwCqgg-L9xTA=");
	try {
            // Open the session here !!!!
            await VoxeetSDK.session.open({ name: "Paul" });
	    initUI();
	} catch (e) {
            alert('Something went wrong : ' + e);
	}
    }

    window.afterLeaveRosarySession = function(response) {
	console.log("afterLeaveRosarySession");
	console.log(response);
	god.query("getRosarySession", "afterGetRosarySession", {sessionId:"rosary"}, true, true, "all");
    }

    window.afterJoinRosarySession = function(response) {
	console.log("afterJoinRosarySession");
	console.log(response);
	god.query("getRosarySession", "afterGetRosarySession", {sessionId:"rosary"}, true, true, "all");
    }

    window.afterGetRosarySession = function(response) {
	console.log("afterGetRosarySession");
	console.log(response.result);
	$("#user-list").html("");
	var result = "<ul>";
	for (var i = 0; i < response.result.length; i++) {
	    var timeAgo = god.getTimeAgo(response.result[i].timestamp);
	    result += "<li>" + response.result[i].real_name + " -- " + timeAgo + "</li>";
	}
	result += "</ul>";
	$("#user-list").html(result);
    }

    function initUI() {
	const nameMessage = $("#name-message");
	const joinButton = $("#join-btn");
	const conferenceAliasInput = "rosary";
	const leaveButton = $("#leave-btn");
	joinButton.attr("disabled", false);

	$( "#join-btn" ).click(function() {
	    nameMessage.html("You are logged in as " + god.getUserRealName() + ".");
	    god.query("joinRosarySession", "afterJoinRosarySession", {sessionId:"rosary"}, true, true, "all");

            /*
              1. Create a conference room with an alias
              2. Join the conference with its id
            */
            VoxeetSDK.conference.create({ alias: "rosary" })
		.then((conference) => VoxeetSDK.conference.join(conference, {}))
		.then(() => {
                    joinButton.attr("disabled", true);
		    leaveButton.attr("disabled", false);
		})
		.catch((e) => console.log('Something wrong happened : ' + e));
	});

	$( "#leave-btn" ).click(function() {
	    god.query("leaveRosarySession", "afterLeaveRosarySession", {sessionId:"rosary"}, true, true, "all");
	    VoxeetSDK.conference
		.leave()
		.then(() => {
		    joinButton.attr("disabled", false);
		    leaveButton.attr("disabled", true);
		    nameMessage.html("You are logged out.");
		})
		.catch(err => {
		    console.log(err);
		})
	})
    }
})
