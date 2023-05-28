$( document ).ready(function() {
    window.god = window.god || {};

    $.ajax({
        url: 'nodejs/projects.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessDataProjects,
        async:true,
    });

    $.ajax({
        url: 'nodejs/races.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessDataRaces,
        async:true,
    });

    $.ajax({
        url: 'nodejs/speech.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessDataSpeech,
        async:true,
    });

    $.ajax({
        url: 'nodejs/conference.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessDataConference,
        async:true,
    });

    $.ajax({
        url: 'nodejs/patent.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessDataPatent,
        async:true,
    });

        $.ajax({
        url: 'nodejs/hackathon.json',
        type: 'get',
        dataType: 'json',
        cache: false,
        success: postProcessDataHackathon,
        async:true,
    });

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

    function doBlogs(blogItems) {
	var blogHtml = "";

	for (var i = 0; i < blogItems.length; i++) {
	    var blogItem = blogItems[i];
	    var title = blogItem.title;
	    var date = blogItem.date;
	    var image = blogItem.image;
	    var modalName = blogItem.link;
	    var content = blogItem.content;

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
                                        <a href="#"><i class="fas fa-user-circle"></i> User</a>
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
${content}
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
	    content: `
<div class="col-lg-9 col-md-9 blog_details">
                                <p>
				  It was, as you can imagine, a very good experience. Actually, one of the people IÊ¼ve been corresponding with about the event is some director at AT&amp;T (had no idea!) and even he gave me very positive feedback and told me that others at the conference had very positive feedback as well. Obviously, my manager was kept in the loop with the feedback and thus, my plan to get a window office is resumed. Hahahahahaha. ThatÊ¼s right!! I did all of this just to get a window office. It wonÊ¼t happen, but I keep trying. ^_^
                                </p>
                                <p>

                                </p>
                            </div>
<div class="col-lg-12">
                                <div class="row">
                                    <div class="col-6">
                                        <img class="img-fluid" src="cfca/20180625_170113.jpg" alt="">
                                    </div>
                                    <div class="col-6">
                                        <img class="img-fluid" src="cfca/20180626_122932.jpg" alt="">
                                    </div>	
                                    <div class="col-lg-12 mt-25">
                                        <p>
                                            Flying to Chicago was eventful, in a bad way. My original flight was canceled on Monday morning and rescheduled to late afternoon from LaGuardia. Not sure if youÊ¼ve ever been to that airport but getting there is pretty horrendous. I was already in Newark airport when I learned about the change. IÊ¼m glad that AT&amp;T pays for the transportation, I was using Lyft to get everywhere (very convenient way to travel, BTW!).
                                        </p>
                                        <p>
                                            When I got to Chicago finally, I was pretty exhausted. You would think that my nights in Chicago would be super pleasant, what with all the non-crying from my kids. But I woke up at around 2 AM to a weird, very loud, hum noise. Not sure if it was coming from outside or in the hotel, but it was definitely disruptive. And then I couldnÊ¼t go back to sleep. So I went out to some office area on the same floor and did some work and reviewed my slides for the presentation the next day. I visited the conference room where I would be speaking (pictures taken at around 2:30 AM):
                                        </p>
                                    </div>
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/20180626_011817.jpg" alt="">
                                        </div>
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/20180626_011842.jpg" alt="">
                                        </div>	
                                        <div class="col-lg-12 mt-25">
                                            <p>
                                            I was a little disappointed at first because the room didnÊ¼t seem to have a large capacity, and I expected like a thousand people there (hahaha). But itÊ¼s good enough to the point where I would get scared. They also already had the soda laid out, so it was nice to know IÊ¼d be able to drink very unhealthy things that evening. :-)
                                        </p>
                                        <p>
                                            I eventually went back to sleep but weÊ¼re talking about the wee hours of the morning at this point. I guess IÊ¼m getting used to giving speeches on very little sleep. ItÊ¼s not like I could sleep during the actual conference itself (I was sitting through other peopleÊ¼s presentation). So, about an hour and a half before my presentation it finally dawns on me, âHey, this is it.â Instead of listening to peopleÊ¼s talks, IÊ¼d be doing one of my own. It was really cool to listen to other peopleÊ¼s presentation styles. I remember two in particular who seemed nervous, which in turn made me feel better about myself. One gentleman (actually ran into him in the hotel lobby later that night) just looked directly into his laptop screen the entire time. He never made eye contact and had many filler words. Another young lady, who admitted she was nervous, looked back at her slides a lot and had quite a few filler words â IÊ¼d almost say every other word. She also spoke very quietly and had trouble when handling the Q&amp;A part.
                                        </p>
                                        <p>
                                            There was an AI presentation that was supposed to happen just before my own. The speaker wasnÊ¼t there so they moved onto me! My heart skipped many beats. They did not read my introduction (which I emailed them a while back) and just called me up. The host naturally pronounced my name wrong even though he confirmed the pronunciation with me moments before (and got it right that time).
                                        </p>
                                        <p>
                                            While I was sitting at my table, there was a very nice English gentleman named Richard who flew there all the way from .. uhh... I dunno, Europe? Britain? Some English country â my geography isnÊ¼t very good. Nor is my intellect. Or general knowledge of things. LOL. He was actually very pleasant to speak with (maybe because of his lovely accent). HeÊ¼s married and has two daughters who are in high school so we related to each other in a way. Anyway, he joked with me and I then subsequently stole both jokes to use as an ice breaker during my presentation (more on that later). He commented on the title of my presentation âSteps to Manage a Successful Fraud System Migrationâ and said something like âOh, IÊ¼m glad it was successful.â And he made another comment about how they have happy hour just after my presentation (mine was the last on the agenda before the evening events).
                                        </p>
                                        <p>
                                            I felt pretty gosh darn nervous. I was snacking on a pretzel they had maybe an hour before I got up. I wasnÊ¼t hungry but it was late in the afternoon/early evening and I knew I should put something in my belly so I donÊ¼t pass out. When I got up, the host confirmed he has the right slides up. He set me up with the microphone (it was one that just clipped onto my suit jacket which was great). It reminded me of doing the district speech contest for Toastmasters - haha. The one thing I forgot when I got up to the podium was my phone. They didnÊ¼t have a timer like in Toastmasters so I had meant to pace myself. I didnÊ¼t really know how long I did, if I was too short and or went too long, I just had to rely on my practice runs at our club which isnÊ¼t precise.
                                    </p>
                                    <div class="row">
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/20180626_122807.jpg" alt="">
                                        </div>
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/20180626_151308.jpg" alt="">
                                        </div>
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    <p>
                                            So, I opened with jokes!!! And they laughed!!! This was after sitting through talks all day, so IÊ¼m glad I could quickly connect with the audience right off the bat. The host introduced me a little bit by saying IÊ¼m from AT&amp;T. So I started by asking, just out of curiosity, how many people in the audience (by a show of hands) are using AT&amp;T as their network provider. After they raised their hands, I said, âOh, IÊ¼m so sorry to hear that. IÊ¼d ask you to mute your phones but if you got a call it wouldnÊ¼t go through anyway.â That got a lot of laughs. ItÊ¼s a reliable joke because I used it when I chaired the Toastmasters Area 62 contest. Yay.
                                        </p>
                                        <p>
                                            I also mentioned that IÊ¼m the only thing standing between âall of youâ and happy hour so IÊ¼ll try to make this presentation painless. That also got laughs. When I got to the presentation title, I emphasized that the migration was âsuccessful.â If it wasnÊ¼t, I wouldnÊ¼t be up there speaking to them. That got some chuckles.
                                        </p>
                                        <p>
                                            Anyway, I definitely got things off to a good start, with some help from my new friend Richard. I went to the slide (I think you saw it) with the quote and all of the hands on top of each other. I really liked the way I introduced the quote and I read it out loud this time (I donÊ¼t think I did it at our club). I joked and told them this is the only important slide of the presentation so they can go back to checking email and playing games on their phone (that also got laughs). I told them that a system migration shouldnÊ¼t be viewed just as getting rid of the old system, but rather as teamwork and working with the new system to expand it and build upon it. It was a good way to introduce a boring topic. Haha.
                                        </p>
                                        <p>
                                            The rest of the presentation was pretty much autopilot, just based on my practice runs at my home Toastmasters club. I honestly didnÊ¼t really review it that much (or even do practice runs) since my practice. The last two slides I feel I fumbled because I didnÊ¼t practice it at my club. It really goes to show how important Toastmasters is as a platform to run through these things. It helps on so many levels.
                                        </p>
                                        <p>
                                            The Q&amp;A was by far my favorite part (aside from getting laughs). ItÊ¼s REALLY cool to listen to the audienceÊ¼s feedback through their questions. When people asked questions, I walked towards them like politicians do at town halls. I really felt like I connected with the audience, it feels very special. They had good questions. One person in the audience asked a tough question about how I make the decision to cut out code thatÊ¼s no longer useful versus re-implementing it from scratch.  So, at what point do you determine itÊ¼s best to just re-engineer the entire module. I didnÊ¼t have a good answer and definitely fumbled around with no real content. :-(
                                        </p>
                                        <p>
                                            Other than that, I got a total of like 6 questions which was a lot more than other speakers and felt my responses were strong and meaningful. It was really cool that my talk generated a lot of interest.
                                        </p>
                                        <p>
                                            One person asked if it was easy to get the old users to move over to use the new system. I started by saying, âYes. IÊ¼m very handsome and good with selling things so it was easy.â I paused and said, âIÊ¼m just jokingâ and that got laughs. I also told them that I get into a lot of arguments with my wife and I feel theyÊ¼re not driven by logic on her end but, rather, by emotion. I related that to getting users to move off of an old system â how their attachment is really just emotional and not a functional one. It was a nice way to answer the question with a personal touch. Also, IÊ¼m pretty sure I offended all of the married women in the audience. Hahaha.
                                        </p>
                                        <p>
                                            During my presentation, I remember one guy in particular yawning A LOT. And he did it with the upmost confidence, making direct eye contact with me while yawning. Hahaha. I learned to not mind these things especially with a varied audience. And it was in the early evening anyway, IÊ¼m sure many people were sleepy at that point.
                                        </p>
                                        </div>  
                                        <div class="row">
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/IMG_0184.JPG" alt="">
                                        </div>
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/20180626_190439.jpg" alt="">
                                        </div>
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                        <p>
                                            I think thatÊ¼s about it. Here is a picture of Happy Paul (HP for short) after my presentation when they handed me a nice certificate.
                                        </p>
                                        <p>
                                        </p>
                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest10",
	    title: "It's the thought that counts",
	    date: "March 2019",
	    image: "img/contests/divcontest.jpg",
	    content: `
<p class="excert">
There were many obstacles since the contest that prevented me from writing this email. Nonetheless, itÊ¼s been on my mind ever since so hopefully I didnÊ¼t
forget too many of the intricate details and can still manage to re-live the experience!
								</p>
<p>
Spoiler alert: I end up winning first place!!!! AAAAHHHHHH!!! :)
                                </p>
<div class="col-lg-12">
                                <div class="quotes">
                                    I really do feel humbled that I got to compete against some very talented evaluators.
                                </div>
                                <div class="row">
								<p>
</p>							
<p>
It was a wonderful evening, obviously just because I won (hahaha). IÊ¼ll start with the beginning since thatÊ¼s where most things start. I got to the same
hospital (no kid drama this time around!). I told my kids that daddy *might* get a trophy and if so, they can play with it the next morning on the way to
school (an effort to trick them to get in the car in the morning). So, to my surprise, I walked past the executive board room where we had filled out our
evaluations from the Area contest and saw people inside. I thought, âOdd, who would meet in that room at the same time as our contest?â I peered inside
and saw people who I recognize. It turns out we were meeting in this new room this time! Same hospital, different room. :) The other room is apparently not
useable anymore, as there are desktop computers at each chair. Oops.
</p>
<p>
I was somewhat thrown off guard, but IÊ¼m used to quickly adjusting to new speaking areas by now. I walked to the front, it was a decent space with that very
big, beautiful TV screen hanging against the wall. It was definitely crowded but I found a reserved spot for the contestants equipped with a table for writing my evaluation. Good stuff so far.
I sat next to --37--, with his full face intact, and joked around with him and told him how awesome his speech is and how heÊ¼ll win (spoiler alert â he
doesnÊ¼t). --32-- walks in and I recognize her immediately from the humor contest last year. She gave a âhumorâ speech about taking care of her
daughters. It didnÊ¼t really connect and wasnÊ¼t all that funny. So, naturally, I told her âHey, I remember your speech about your daughters! It really connected
and was very funny.â LOL. I mean, well, it was a decent enough speech and I apparently had remembered it from last year so it managed to have some kind
of lasting impact.
</p>
<p>
The briefing was eventful. --28--, the Chief Judge and/or Contest Chair and/or Grand Master Wizard of Toastmasters, used playing cards to pick speaking
order (very clever). I pulled out the Ace (meaning first speaker) and my heart sank immediately. I even sent you a text message and described myself as a
âsad panda.â I really think that, with an evaluation contest, going towards the end gives you an edge.
</p>
<p>
Enough about the prelude, letÊ¼s begin the contest!
</p>
<p>
I was lucky enough to be able to see *everyone* do their evaluation this time! ThatÊ¼s the only advantage of being the first speaker. :)
</p>
<h1>Evaluation Contest</h1>
<p>
Target Speaker â --45-- (as in âsee moreâ). Her speech title is âItÊ¼s the thought that counts.â She walks in carrying a box. During her speech, she
pulls out different props and seamlessly incorporates them into her story. She begins by talking about gift giving and transitions into talking about her dog.
She told a story about her dog giving her a gift of a half-dead squirrel (or a dead half squirrel?). I think the dog ends up accidentally biting her finger and she
ends up in the hospital, has some funny verbal exchanges with the nurse, gets treated, returns home to a police officer who needs to question her and in
the end, --45-- learns to appreciate the gift. Yeah, not a very detailed summary, but dude itÊ¼s Wednesday and the contest was Monday. Haha. But, more
importantly, --45-- is a *really good* speaker and story teller. She had perfect speech mechanics: vocal variety, volume, pacing, pauses, *lots* of very good
humor that got the audience laughing, and she did a really good Southern accent went imitating the nurse.
</p>
<p>
</p><ol>
<li>Paul Ireifej (placed first)</li>
<p>This guy really rocked it. It was interesting, I knew I wouldnÊ¼t have much time to prepare my evaluation from my notes (which
are, BTW, attached to this email) since I was the first one up. So I was frantic to use every second I had. I started editing my notes, drawing arrows, happy
faces, stars, etc. immediately when the speaker was done. When we were led out into the hallway, there was some disarray &amp; confusion because they didnÊ¼t
have a spot prepared for us to work on our evaluations. They were supposed to use the same meeting room from the last contest but the doors were locked.
Oops! I didnÊ¼t miss a second, I was writing on walls, on the floor, on a table, as they moved us around. During this chaos, one of my competitors, 
--46--, tried to âheckleâ me a little bit. She said things like, âCan I see your notes?â and âYou know weÊ¼re given 5 minutes to do this right?â She teased me a
bit with comments like that. I think it was perfectly innocent, she tends to joke a lot which I actually really appreciate. But, like we talked about in person, I
really need this specific time window to concentrate and prepare my speech. So I just ignored her and focused on drawing on my notes.
</p>
<p>
HereÊ¼s a basic outline of my verbal evaluation:
</p>
<p>
--45--, thank God you survived this harrowing experience <got laughs="">. Because of this, we had the privilege to listen to your adventure and learn from it.
There were three (magic number, as per Thomas Kenny, haha) things IÊ¼d like to highlight and three things I think you can improve on. First, your speech mechanics were very good. You had it all: vocal variety, dialog (along with a convincing southern accent), pauses in all the right places, good use of the
stage. This wasnÊ¼t a speech, it was an adventure. You didnÊ¼tÊ¼ speak at us, you spoke with us, and let us live the adventure with you. Second, you had props.
From the box in the beginning (which made us curious &amp; interested from the get-go), gloves, a book, bandages to show your injured finger, you seamlessly
pulled out props and it added nicely to your story. Third, your humor (which is something IÊ¼m usually good at <got laughs="">) got the audience to laugh. Now
some things to improve. Warning, IÊ¼m going to be critical, but just remember: itÊ¼s the thought that counts! <this got="" very="" nice="" laughter="">
First, when you do dialog, make sure youÊ¼re confident about your position on stage when you switch back &amp; forth to represent the different characters. Make sure to pause after you deliver a line of dialog before the next character speaks. Two, your structure really felt just like one long story. You only
referred to your speech mantra (âitÊ¼s the thought that countsâ) twice in the beginning and then once in the very end. During your story, I lost track of what
your mantra was. It helps to refer back to it every so often so that, by the end of your speech, saying it again will have a more lasting impact on the
audience. Third, throughout your entire speech, I was wondering what gift would finally end up in that box! <got laughs=""> Maybe leave one last âjokeâ prop
so that weÊ¼re not left wondering.
</got></this></got></got></p>
<p>
Overall, you did a great job --45--. The next time we have an international speech contest, I want to see you up standing up here along with all of the other
speakers to compete. Thank you.
</p>
<p>
</p><li>--32-- (didnÊ¼t place)</li>
<p>
First of all, --32-- deserves credit. For the second contest in a row now, --32-- was the only person that literally all of Area 64 dispersed to represent them for
*both* contests. SheÊ¼s a brave individual and she definitely gets my kudos. This being said, --32-- never fails to impress me with how unimpressive she
is. J She made what I consider to be two cardinal sins during this contest. One of which was with her evaluation: she said that PeggyÊ¼s speech had NOTHING
to improve. She basically said her speech is perfect. Nooooooooooooooo way --32--!!!! Asides from that, her evaluation was mostly mediocre. It was honestly
just a story about how she struggled to come up with constructive feedback. She said things like, âI thought and thought about things you can do to
improve and then I ran out of time and thought âEh, your speech is perfect and canÊ¼t possibly improve.Ê¼â *sigh*
</p>
<li>--46-- (placed third)</li>
<p>
--46--, --46--, --46--. YouÊ¼re so consistently awesome. Each time she gives an evaluation, it feels like a performance. SheÊ¼s just really good, really peppy,
her feedback is always on point, she actually finds ways to use hand gestures (and itÊ¼s all, like, appropriate and adds to her points). I think she shouldÊ¼ve
placed second. If I had to fault her for anything and, please wait for me to explain, itÊ¼s that sheÊ¼s too perfect <gasp!!!>. I can understand how that makes it
feel like IÊ¼m just jealous (and I am BTW) but sheÊ¼s just too polished. ItÊ¼s too obvious that sheÊ¼s a really good speaker and, she sometimes comes across as
inauthentic or phony. The tip I was really proud of that I offered --45-- is the one about the fact that her mantra âitÊ¼s the thought that countsâ got lost in her
stories. --46-- gave her very similar feedback which, to me, was very impressive.
</gasp!!!></p>
<li>--42-- (placed second)</li>
<p>
--42-- is just as polished and peppy / charismatic as --46--. However, her feedback was lacking in my opinion. Also, she discredited her own feedback at
one point. She made a comment (I forgot what exactly it was) and then almost walked back and said something like, â ... but itÊ¼s not a big deal.â I feel like, if
itÊ¼s not a big deal, then just donÊ¼t mention it. Three minutes isnÊ¼t a lot of time to waste on things that arenÊ¼t a big deal. But, really, the cherry to her cake (or
whatever the expression is) is her conclusion. She referred back to PeggyÊ¼s idea of giving gift and said something like, â--45--, you wrapped up your speech
and put a bow on it to present this gift to us.â I didnÊ¼t get the wording exact, but her last line was a PERFECT way to wrap up her evaluation.
</p>
<h1>International Speech Contest</h1>
<ol>
<li> --37-- (placed second)</li>
<p>
IÊ¼ll just say that this version wasnÊ¼t as good as the previous one. I
canÊ¼t really put my finger on it, maybe because I knew what was coming (the acid on the face, etc.). But I also feel like he allowed too much extraneous
information to sneak into his speech. He digressed from time to time and it wasnÊ¼t as polished as his first attempt. All the good things from his first speech
were still there, but it just sort of fell flat. And in the end, when he was trying to convey his takeaway to the audience, he said something like âI put
everything into what I do and thatÊ¼s how I live every damn day of my life.â Now, saying âdamnâ isnÊ¼t necessarily bad â I donÊ¼t consider it profanity. I do,
however, consider it a poor substitute for trying to convey something impactful. I think there were other ways to more elegantly get his message across. But
the issue is that his message isnÊ¼t really for the audience. ItÊ¼s more of just something he decided to do. I think Dave failed to connect with the audience. I
think his message just failed to translate.
</p>
<li> --31-- (didnÊ¼t place)</li>
<p>
Something interesting happened even before he began his speech. I felt anxiety and trepidation while --31-- was walking to the stage. I heard his speech
before and remembered how dull &amp; slow it was, and I was very much NOT looking forward to sitting through it again. It felt longer and slower than before. He
does a parrot voice during his speech and it comes across as annoying. It was an uneventful, slow paced speech and itÊ¼s easy to lose track (pun intended,
his speech is about hiking LOL).
</p>
<li>--32-- (placed third)</li>
<p>
--32--, --32--, --32--. She committed a second cardinal sin of contests: --32--, I kid you not, brought up a script. Not just index cards, not just one sheet of paper,
but (I counted) *three* sheets of paper full of text. O â M â G. She started by reading a long quote from the first piece of paper. And then she laid the papers
on the table in front of her and NEVER even glanced back at them. *SIGH* I understand the need to read a quote, itÊ¼s difficult to memorize a quote (and this
one happened to be from the Bible â canÊ¼t screw that up or God will smite you). She shouldÊ¼ve really just brought up a single index card with that quote, read
it, and then HIDE the card so she doesnÊ¼t lose credibility. Her speech wasnÊ¼t a speech, really, it was a eulogy to her father who passed away recently. It was
honestly a very beautiful recounting of his life and the impact that he had on her. It was a beautiful eulogy, but certainly not a speech. That being said,
imagine how bad you have to be to have --32-- beat you in a contest LOL (sorry --31--!!!).
</p>
<li> --15-- (placed first)</li>
<p>
--15--, AKA seat stealer, did really well. I heard her do the same speech at the previous contest and this was an obvious step up. It was obvious that she
had practiced this speech and improved it. She added (I counted) two new jokes and both killed. All of her humor was appropriate, spot on, delivered with
confidence and connected with the audience. She had a strong take away about âjust driveâ and I would be hard pressed to come up with advice. Ah, just
one thing. She referred to a âbillboardâ and never told us what was on the billboard or why it was important. It seemed to have some importance but IÊ¼m not
sure why it was relevant. I have her email address and told her IÊ¼ll send her feedback. Even though weÊ¼re enemies (or friendemies?) I want her to win. Haha.
</p>
</ol>
<p>
Announcing the winners was a very interesting experience. I couldÊ¼ve sworn I saw my name on a red certificate, which means third place winner. I thought
this because I saw a short first name and a long last name on the certificate. So I quickly accepted my third place fate. I was settled into it and even moved my chair back a little to prepare to stand up and accept my non-trophy. When they announced the winners, I was *carefully* watching --28--'s lips to see
what sounds they were about to form. The âPâ sound has an obvious lip arrangement before its uttered. I watched her lips form an âAâ as in --46-- and even
before she spoke I was in shock. She announced --46-- as third place winner and my heart was racing. I knew --32-- wouldnÊ¼t place, so second place
is either me or --42--. And I didnÊ¼t think --42-- did as well as --46--. However, she did go last in speaking order so itÊ¼s possible the judges were just lazy and
picked her. Then --28--'s lips formed the M sound and I was truly blown away. Many emotions raced through my head: gratitude, shock, joy, humility (IÊ¼m very
humble as you know). I was flabbergasted when --28-- made that P sound and announced me as the winner. I think I was visibly shocked, too, I even had
trouble walking hahaha. IÊ¼m pretty sure my hands were shaking. It was a beautiful moment and IÊ¼ll remember it for at least a month â hahaha. Probably until
the district contest.
</p>
<p>
Interesting after-contest experience. There was a lady who I believe was devoid of emotion and spoke quite monotone (--38--'s sister?). I learned she was
a judge. She asked me, âWhy were you so surprised that you won?â I answered, âThe competition was really good. Also I thought that in the evaluation
contest going first gives you a disadvantage.â She replied, âWell, as a judge, I took notes. When I ranked everyone, I referred to my notes to remember who
did what well.â I hope all judges follow this robotÊ¼s model! Taking notes and actually referring back to them sounds very reasonable. :-)
</p>
<p>
The interview was mediocre. I wasnÊ¼t as energetic at that point because I wasnÊ¼t confident with my evaluation compared to the competition. --47--
(JessicaÊ¼s sister? LOL) was the interviewer and she did a really NICE job. She actually walked up to the contestants ahead of time and asked if there was
anything on our profile we would like to highlight. I mentioned to her that I ran a 10K and beat my previous record on Sunday (the day before). So she ended
up asking me what parallels I see between Toastmasters and running. I explained that both require endurance and practice (actually, a pretty good table
topics answer!). I hope people are impressed that I ran a 10K the day before and then competed in this contest. Haha.
</p>
<p>
ThatÊ¼s it. Onwards to the District Evaluation Contest for the first time ever. I really do feel humbled that I got to compete against some very talented
evaluators. Thanks again for all your support. It really helps when we talk about speeches we heard in Toastmasters and discuss them! I also have learned A
LOT from watching you do evaluations in our club. YouÊ¼ll always be the Top Evaluator (or TE) in my book. :-)
</p>
<div class="col-lg-12 mt-25">
										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/diveval.jpg" alt="">
															<a class="light" href="img/contests/diveval.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
										</div>
<p>

</p>

                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </ol></div>
                            </div>`
	},
	{
	    link: "contest11",
	    title: "The Easiest Area Contest Ever",
	    date: "May 5, 2019",
	    image: "img/contests/IMG_20191002_194504.jpg",
	    content: `
<p class="excert">
Tonight was a good night. A good and ... easy night. I got a text message this morning from --4-- saying that --13-- wouldn't be at the contest tonight. I was disappointed because I was looking forward to hearing his speech, but also naturally happy because he's good competition. I thought there would be a backup, spoiler alert, there wasn't!
								</p>
<p>
I texted --13-- directly and asked him about it. He said he's in the middle of a move (I'm guessing moving from one place of residence to another; I don't think he meant like he was texting me while physically moving). Anyway, when I got to the contest venue, I figured there would be more contestants. iCIMS at the very least has been dependable with sending in people. I did my usual getting-to-the-venue early and pacing around outside in the parking lot. I practiced quite a bit in the office already (better than my real job) but did a few more practice runs in the parking lot under a tree. As I practiced I saw --59-- come into the parking lot. I thought, "Why would anyone come this early to a contest?" and remembered, "Oh ... wait." :-)
                                </p>
<div class="col-lg-12">
                                <div class="quotes">
                                    So I felt a little bit like I was cheating (HA -- cheating) and so my Tall Tales was turning out to be a true story. 
                                </div>
                                <div class="row">
								<p>
</p>

								<div class="col-lg-12 mt-25">

										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/IMG_20191002_194444 - small.jpg" alt="">
															<a class="light" href="img/contests/IMG_20191002_194444.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/IMG_20191002_182600_01 - small.jpg" alt="">
															<a class="light" href="img/contests/IMG_20191002_182600_01.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                    </div>
                                        
										
<p>
I finally went inside at around 5:50 PM (start time was 6:30 PM for briefings). I did my restroom extravaganza. The contest chair, --60--, was still putting the agendas together. When I finally got a hold of one, I saw that Area 61 had just ONE contestant: --27--. Area 62 had just TWO: me and --13--. I figured --13-- would've communicated his absence already to the contest chair so I didn't take the liberty of doing it myself. It's his responsibility and what if he comes in at the last minute or something?  
</p>
<p>
I saw --60-- tearing up little slips of paper to do the ordering. He looked around the room, seemingly dumbfounded. He came to me and said, "We're still waiting for --60-- but we're going to do the contestant briefing now." I thought to myself -- once they do the contestant briefing, they're technically NOT allowed to accept more contestants. So that would be a good thing. :-)
</p>
<p>
I actually texted --13-- and asked if he had a backup. He answered me a while later saying, and I quote, "Not sure?? But you gonna win tonight. Have fun. I'm painting. Thanks." I thought this was kind of silly. I never knew that painting was an urgent do-it-now-or-nothing task. --41-- (who, not sure if you're aware, LOVES to talk) said he was surprised --13-- wasn't showing up, as he's usually very dependable. I was still surprised that iCIMS didn't have anyone! So I felt a little bit like I was cheating (HA -- cheating) and so my Tall Tales was turning out to be a true story. :-)
</p>
<p>
I kept turning my head to the entrance to see if anyone would magically appear. But, nothing. So we kicked off the contest already knowing the outcome. 
</p>
<p>
--16-- was the Contest Chair for Area 61 (I think?). He was pretty gosh-darn (excuse my French) awful. He did almost everything wrong. --61-- (the new District Director) corrected him many times. One embarrassing incident was when he introduced --27--. He did it like a regular club introduction. --61-- then stepped him through the proper way of doing it word-for-word (name, title, title, name). He repeated each word that was uttered by --61--. It was highly depressing and shameful.
</p>
<p>
--27-- did a speech. It reminded me of a bad rendition of your speech. She talked about Toastmasters. Her speech title was something like "My Adventures in Colorado." She said something about hitting her head, falling into a room with expectant mothers. I stopped paying attention after maybe the first 3 or 4 sentences. She bragged that she had an article in one of the TI magazines and then proposed some changes to Toastmasters (like being able to use the TI gift certificates electronically instead of mailing them in). At the end she tried to make a twist, maybe, by saying something like "Fact or fiction? You decide." I though to myself, "I don't really care enough to guess at this point." She droned on &amp; on and it felt more like an informative speech. Just listing things to improve Toastmasters and Pathways. Blah. At least I know she's going to be very easy competition for the division contest.
</p>
<p>
I didn't have to wait long for my turn. I was still a little tense and nervous even though I knew I was going to win if I didn't go under/over time. I executed my speech really well. It was very polished, little to no hesitation or stutters. It was really well done and got many laughs. I got laughs where I didn't expect it. I actually thought I would be short on time towards the end because my practice runs never accounted for all the laughs. It was nice, too, when I looked around the room - *everyone* was paying attention. Granted, I'm only the second speakers, so they didn't have much time to have their attention dwindle, but they were probably glad to have a good speaker after seeing --27--. I seemed to really grab their attention and own the room. It was very satisfying. All the jokes connected, the Trump joke went very well. And, yes, --41-- heard it. =D I perfected my Ralph Smedley -- he feels much more like a separate character and I feel better with channeling him and making him a distinct entity. It was well done. I love the change in my description of him -- removing the rectangular frame thing helped out a lot. The plastic surgery joke was really good. It got a lot of laughs too.
</p>
<p>
One point of confusion, which I realized later, and you can see in the clip I sent you via Google Photos. --60-- comments about a spot on someone's hand. I realized that when I mention the "ghost-like complexion", I circle my hand. I'm guessing the audience interprets that as a white spot on his hand and not an overall ghost-like complexion. So I'll try and clear that up going forward.
</p>
<p>
I was underwhelmed when they announced I had won, haha, but it was still a victory that I earned. I practiced a lot and delivered a really polished speech.
</p>

<iframe width="560" height="315" src="https://www.youtube.com/embed/80fEt6oAHL4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>


                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest12",
	    title: "Much Ado About Nothing",
	    date: "Nov 14, 2019",
	    image: "img/contests/IMG_0078%20(1).JPG",
	    content: `<p class="excert">
The subject of this email, of course, refers to the gossip/rumor from --49-- that he attempted to spread that turned out to be, uh, nothing. :-) I'm very clever. Not sure if you heard but I placed first in the Division Tall Tales Contest. I had a good feeling really early on. Actually, I had planned to ask someone in the audience to record my speech because, being that it's division, I acknowledge it might be the last time I perform the speech in front of an audience. But, literally moments before I had the opportunity to ask someone, I decided not to just because I felt really confident (it was a magical feeling, really). I also felt like having someone record me would act as a safety net; almost as if I was giving myself permission to fail. We don't want that!!!
								</p>
<p>
The contest started out normal enough with --50-- taking the helm. She seemed fairly organized and dealt with the hurdles of people not showing up last minute pretty well. Her introduction was a little sloppy (she forgot that she had to call up the Chief Judge) but, eh, whatever. She was totally charismatic and committed to her role. I considered it to be a minor overlook. It was much better than the train wreck that is --16-- (is that his name?).
                                </p>
<div class="col-lg-12">
                                <div class="quotes">
                                   I had a good feeling really early on. 
                                </div>
                                <div class="row">
								<p>
</p>

								<div class="col-lg-12 mt-25">

										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/Screenshot_20191114-215011 (1) - small.png" alt="">
															<a class="light" href="img/contests/Screenshot_20191114-215011 (1).png"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/IMG_1213small.jpg" alt="">
															<a class="light" href="img/contests/IMG_1213 - Copy.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                    </div>
                                        
										
<p>
I got to the parking lot of the Bayshore Community Hospital roughly 1.5 hours early (which is a little conservative.. wanted to give myself a buffer in case it takes me a long time to walk from the car to the hospital door - LOL). It was cold out so I sat inside, contemplating all of the decisions I made in my life that led up to this point (typical Paul Ireifej fashion). I went over my speech, just the verbal part, in my car while watching the timer. I made my rounds to-and-from the hospital to use the bathroom but pretty much stayed in the car for about an hour.
</p>									
<p>
Eventually I decided it was about the time where if someone did see me inside, they wouldn't think I'm crazy. So I head inside directly to the (you guessed it) bathroom.  Oh, sweet solace of the bathroom. There were actually people there (the contest room, not the bathroom). So I wasn't that crazy. They were setting up the food and things. --27-- was there, I gave her a hug, and did the usual pleasantries.
</p>
<p>
My competitor, whom I built up a great fear towards at this point, --51-- was there. He was dressed up in workout clothes so I thought he wasn't taking this contest very seriously. I gave up on the suit-and-tie attire during these lower level contests but at least I still attempt to dress professionally. Little did I know (foreshadowing!) he was dressed this way for his speech (lead the audience on to continue reading!) ...
</p>
<p>
I made my usual rounds of nervously pacing back &amp; forth around the hallways of the hospital. And then, --52-- came!!! Our --52-- from our club (my mentee). It was nice to see him and I relaxed a bit. He sat next to me, and I apologized to him ahead of time because I admitted he would see a different side of me which is the nervous/sweaty/anxious/pacing pre-contest Paul Ireifej. --52--, with his typical indifferent / easygoing personality, grumbled things like "eh, well, whatever, it's OK." Hahahaha. He had his giant binder, which I'm now convinced he carries around with him everywhere he goes.
</p>
<p>
My dear friend, --53-- (previous Area 23 Director and previous Division, I want to say, D Director?) joined us as well! I was pleasantly surprised to see her. She said she had a lot of vacation hours to burn up before the end of the year but I knew she really just came for the free food. LOL. I was hoping contest officials would jump at her to recruit her to be a judge. Being that she's not in our area, she's a very attractive candidate to be recruited as a judge (and she would be totally biased towards me). But, alas, they only recruited her as a ballot counter because our friend --54--, didn't make it. I texted him about it later and he said he couldn't come because of "wife issues." I thought he meant health issues but he assured me she was OK. Not to pull a --49-- and spread rumors, but I'm guessing there's trouble in paradise. Yeah, probably. Also, Henry Ford is a racist.
</p>
<p>
When we did the contestant briefings, it was noted that --55-- (the other contestant) wasn't there. --50-- hinted that she was still waiting for --55-- to show up but both --27-- and myself reminded --50-- that, as per the contest rule book, once the contestant briefings finished, the window for contestants is closed. We later heard from --55-- (via text message to a friend) that he had a work emergency and couldn't make it. When we drew the numbers for speaking order, I picked my piece of paper last and got #1. I felt bad because I don't prefer going up first as you know. --27-- got #2 and --51-- got #3. I felt --51-- would have the edge but, in a contest of just 3, I don't know that it matters that much.
</p>
<p>
At this point, they're doing the contest introduction (--50-- Contest Chair and --45--, brandished with what appeared to be a lovely finger/hand cast, as Chief Judge). They were fine, got to the meat &amp; potatoes fairly quickly. --50--, God Bless her soul, pronounced my last name 100% correctly. I'm really tense now because I'm expecting an amazing speech from --51-- (who stole my first name and used it as his last name). Interesting side factoid: I try not to judge a contestant just from casual conversation before the contest because I know that it's a tense time for everyone. The side formalities does not reflect how they will perform when it's show time. But, I will say that, just from talking to him briefly I kind of knew he wouldn't be terribly intimidating as a speaker. He seemed like generally a reluctant person and he had a slight accent. I'm not being racist (like Henry Ford) but I know that an accent equates to slight complexity on the side of the listener to interpret words. Which is normally fine but in a contest, I would think the judges prefer the path of least resistance when it comes to audio processing.
</p>
<p>
There I am, in my chair, pen in hand and notebook -- oh, wait, sorry. I'm sitting there, feeling very tense and confident at the same time. And then, I am called up!
</p>
<h1>1. Paul Ireifej - "Improvise and Don't Apologize" (placed first)</h1>
<p>
--50-- read my speech title as "Improvise. Don't Apologize." which is, eh, OK I guess. Maybe she was exercising her artistic license which she actually isn't entitled to as a contest chair LOL. I purposefully started using the word "and" instead of the ampersand "&amp;" just to avoid confusion. But, yeah, apparently didn't help. At this point, I've been practicing my speech like a crazy person all day. I also did it during one of my nervous paces before the contest in the little huddle space I described in my first email about the Area contest. So I was truly on auto-pilot, spitting out words in almost the exact order as I did countless times before almost on an automatic timer (since I watch the clock closely during my practice runs) - haha.
</p>
<p>
I performed well. My mouth felt dry (despite the fact that I took many sips of water beforehand) and so I felt the speech wasn't as fluent as it usually is but it's a very minor point that wasn't at all noticeable. One artifact of the dry mouth was that my "Rrrrrrr" sound after describing my plastic surgery wasn't that audible. But it got giggles anyway.
</p>
<p>
During my practice runs, I was playing around with different body movements during my evaluation to appear as "charismatic" as per Dr. Ralph Smedly's advice. One thing I did which I personally enjoyed is jumping from one side of the stage to the other when describing the speaker making "words come out of his mouth." I did this during my contest speech and, boy, it went over really well. The audience was very entertained by the body language.
</p>
<p>
One global comment I have about my speech is that it felt *too* polished. Again, an artifact of practicing incessantly. It's hard to find the right balance between sounding polished and sounding genuine. Eh, whatever. A second global comment I have is that I went too fast. I can actually understand how Randolph got a time of 4:45, I think I was just blaming his timing skills, but now that I think about it, it might reflect reality. I think I legitimately speed up (significantly) when I'm up there. I saw --56-- (the timer man) raise the yellow flag and I felt I really started to ramp up at that point. I never saw the red flag, even when I finished my speech, so I suspect I was good on time and panicked unnecessarily. 
</p>
<p>
I added something at the end, which was the result of collective feedback from the club and from you. I mentioned that "the old man" was applauding with the rest of the audience and smiled at me "approvingly." I said this part nice &amp; slow. I think it was very effective. Nice touch!
</p>
<p>
Something I felt myself do is ... breath. When I felt a trouble word coming up, I felt myself exercise the "breathing" technique and just blended my breath into the trouble word. This is something they taught me to do in speech therapy and it's really cool to feel myself doing it now. I think, if anything, the pauses acted as effective breaks in the flow of the story.
</p>
<p>
Here is my "laugh summary characterization table" (or LSCT for short):
</p>
<ol>
<li>President joke -- Laugh +++</li>
<li>"Words came out of his mouth" -- Laugh+++</li>
<li>E-alliteration sentence -- Laugh+</li>
<li>U/P- alliteration sentences -- Laugh</li>
<li>Plastic surgery -- few giggles</li>
<li>"Probably because I wasn't paying attention" -- few giggles</li>
</ol>
<p>
Something that I was genuinely amazed by (and didn't expect) was the suspense I was able to orchestrate at the end of my speech. It is so empowering to have the ability to grab &amp; hold on to everyone's attention for a brief moment. I did the ending with such incredible slow pacing &amp; suspense that you could feel the tension in the room. I saw everyone looking at me, not blinking, bated breath, as I revealed the identity of the old man. It was really cool. 
</p>
<p>
I got amazing feedback from people individually. One gentleman told me that my evaluation sounds like ALL of the evaluations he's ever done at his club. Which, actually speaks to my larger (more cynical) point of the speech (I have two points): 
</p><ol>
<li>evaluations in Toastmasters are cheesy. I feel like what is typically considered a "good" evaluation can lack in substance but make up for it in the performance / presentation. This then leads to my larger point</li>
<li>which is that Toastmasters speeches in general tend to be a tad superficial and puts too much emphasis on the theatrics. Of course, I don't advertise this opinion because I like to win trophies. I'm incredibly insecure and need trophies to reaffirm my manhood...</li>
</ol>
<p></p>
<p>
One gentleman, I wish I knew his name, and a woman next to him (possibly his wife? mistress? I love to spread rumors now). They both gave me VERY flattering feedback. I was almost embarrassed.  The gentleman acknowledged that the ending was very suspenseful and that I had his attention. He also told me he saw a live show recently with Alec Baldwin (the Trump impersonator) and some other guy (didn't recognize the name) and said my performance reminded him of that show! He asked if I was a thespian. I almost punched him in the face, but after <a href="https://www.dictionary.com/browse/thespian">googling the term</a>, was flattered.  He further commented on my ability to transform in between characters seamlessly. The nice lady next to him was interested in trying our improv group (I talked about it during my interview) and she emailed me after the contest asking to be added to the distribution list. I need to consult with the Improv 2 Improve Master --57-- and ask for permission first since she's a community member and I'm not sure how that will work. I'll wait to hear back from him. :-)
</p>
<p>
Another thing: The Contest Chair, --50--, admitted to us during the contestant briefings that she has tremors. So, her hand shakes uncontrollably. Well, with my Ralph Smedly impersonation, I make my hand shake (if you recall). I felt bad for doing that. I kind of regret incorporating that into the act. That was how I practiced it and that's one way I help myself to transform into Ralph Smedly so I didn't feel comfortable taking it out at the last minute, I feel it would've thrown off my performance. 
 </p>
<h1>2. --27-- - "My Adventure in Colorado" (placed second)</h1>
<p>
Her speech didn't change that much. I think, if anything, she had more props at the table to her side. She had Toastmasters gift certificates, the Toastmasters magazine where her article was published and some other things that weren't used. I think that it's very impressive that she got an article in the TI magazine. I feel like she wanted to speak about it, and build a Tall Tales around it, but she approached the story from a boring angle. I would've made up a story about how she got her article to be recognized by TI but instead she cobbled together two stories that are real (1 being her published article and 2 being the fact that she fell into a wall and ended up in a class for expectant mothers just before doing a speech -- like, that really happened). She tried to loosely tie those two stories together with ideas she has to improve Toastmasters. So it really felt like an informational speech / proposal that she would like to put forward. And her ending is weak, something like, "Truth or fiction? You decide."
</p>
<p>
But, in all honestly and sincerity, she placed second in a Division contest. Taking that by itself at face value, is an accomplishment for someone like --27--. I make fun of her a lot (um, like a lot, as in every 20 minutes or so) but I've really seen her grow as a speaker and she is deserving of accolades. I heard her do a roast of --58-- earlier this year at some recognition event (Hare and Farewell?) and it was really funny. She was one of the best &amp; most entertaining speakers there. So, yeah, cheers to you --27--.
</p>
<h1>3. --51-- - "Exercise" (placed third)</h1>
<p>
Another reason I felt that --51-- wouldn't live up to the hype is his speech title. I thought, "Exercise", well, it's boring and forgettable. But, on the other hand, there's a lot of opportunity for humor when talking about a subject like exercise. When he started to speak, I knew it wasn't going to be that competitive of a speech. His speech quickly became boring and redundant. I took notes and for some reason outlined his speech so here it is in a nutshell:
</p>
<ul>
<li>The secret to lose weight / stay healthy is to clap a lot (this is actually a one line substitution that encompasses his entire speech LOL)</li>
<li>NASA did rereplace on this</li>
<li>5 minutes of clapping creates "Artificial Intelligence" around your body and causes your internal organs to vibrate violently (I understand it's tall tales, but seriously it should at least be a LITTLE bit plausible and shouldn't use random tech terms that you heard about on a podcast that you have no idea what it means LOL)</li>
<li>Three reasons to clap more: no cost, no pain / side effects, can do it anywhere/everywhere</li>
<li>This part he had what I consider to be inappropriate jokes / literally toilet humor. He said: you can do it while "taking a dump" (literal words), during a meeting / conference call and then for (kidding you not) "self pleasure" (to put it eloquently). He made a joke that you can do it while in bed with your partner. And if she's not interested you can do it alone (and proceeded, kid you not, to "clap" around his genital area). Yes, you read this correctly. I am not joking. Sightly lacking tact if you will.</li>
<li>He then tried to make politic jokes which largely fell flat because his pronunciation of people's names just wasn't clear. He made reference to the 2020 election, how health care isn't needed anymore, something about Elizabeth Warren and Warren Buffett (hey we're on a role for people who's last names are other people's first names LOLOL).</li>
<li>TI has made a patent for clapping.</li>
<li>I don't remember the ending. Oh, yeah, he got everyone to clap which is, um, what people normally do at the end of a speech anyway.</li>
</ul>
<p>
One reason for his downfall was that it wasn't a tall tale. --27--'s speech was more of a legitimate tall tale and that's probably why she placed 2nd and this guy placed 3rd. It felt like the elixir speech in that it was just a false sales pitch. During his interview, he mentioned that he doesn't really exercise much and the he had only purchased the workout clothes for his speech. Hahahahaha. :-)
</p>
<p>
Well, look at that, I'm all done! Thanks again for reading. Now I need a nap. I hope your event with Wynter went well and thanks so much for responding to my texts last night. I hope your wife didn't mind too much :-)
</p>
<p>
Onward to District!!!!!!!!!!!! Time to put this speech on the shelf for 6 months LOL. I don't have to do the Rrrrrrr sound in a while, or pretend to be a zombie version of Ralph Smedly. ^_^
</p>
	<div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest13",
	    title: "NOT a long email",
	    date: "May 5, 2019",
	    image: "img/contests/disteval1.jpg",
	    content: `<p class="excert">
Since youÊ¼re unable to travel today, I figure you have time to read a NOT long email! I decided NOT to write an overwhelmingly long email, instead IÊ¼ll just
summarize my verbal evaluation (as best as I remember it). Here are my notes that I wrote during the target speech:
								</p>
<p>
The target speaker was a lovely lady named --48--. Her speech title was âAce It.â She spoke about the sales process and how it relates (or can be applied
to) a job interview. Here is my verbal evaluation (from what I can recall, haha).
                                </p>
<div class="col-lg-12">
                                <div class="quotes">
                                quote
                                </div>
                                <div class="row">
								<p>
</p>

								<div class="col-lg-12 mt-25">

										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/diseval3Small.jpg" alt="">
															<a class="light" href="img/contests/diseval3Large.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/diseval4Small.jpg" alt="">
															<a class="light" href="img/contests/diseval4Large.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                    </div>
                                        
										
<p>
Some context:
</p><ul>
<li> my parents were able to make it. They were in the audience at the time.</li>
<li>in her speech, --48-- told us to say a phrase at the end of a job interview: âBefore we part ways, IÊ¼d like to tell you ... <something>â</something></li>
<li>I had my notes in my hand, but they were rolled up and I never even glanced at them! I only looked down to remember the speakerÊ¼s quote above.</li>
</ul>
<p></p>

									<div class="col-lg-12 mt-25">
										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<a class="light" href="img/contests/diseval6Large.JPG"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                    </div>
									
<p>
âWelcome, Toastmasters, honored guests and my mommy &amp; daddy. [laughs] Thank you, --48--, for sharing your experience with us about the sales
process and how we can apply it to a job interview. Your advice was so good that IÊ¼m going to use it right now. Like a good sales person, IÊ¼m going to make
you like me by telling you three things that you did well. IÊ¼ll then sell you on three pieces of advice that I will convince you that you need.
</p>
<p>
First, you established yourself upfront. How can we trust you? Well, you answered that question by telling us that youÊ¼re an HR professional and a coach.
This way, we know that the advice youÊ¼re about to give is valid. Second, the information you gave us is tangible and relatable. Not only can it be applied to a
job interview, it can be applied to our personal lives. For example, we learned how to make someone else like us. IÊ¼m going to take that advice, go home and
immediately apply it to my wife. [laughs]
</p>
<p>
Third, your speech mechanisms were all there. You had vocal variety, gestures, good speech cadence with well placed pauses. You spoke with crisp
precision. Well done!
</p>
<p>
Now, hereÊ¼s some advice to elevate your speech to the next level. First, you gave us advice to tell a personal story to get someone to like us. Well, I would
like to turn this same advice over to you. If you tell us a personal story about why you got into HR and interested in the process upfront, that would help to
establish a human connection with your audience. Tell us about your first interview. If you donÊ¼t have a story, make one up. [laughs] I make up stuff every
time my wife asks me a question. [laughs]
</p>
<p>
Second, you had a lot of really good information. But at times, I felt it was information overload. I would suggest that you have a hand out with explicit takes
ways that you want the audience to remember. Third, the title of your speech was âAce It.â You used it in the intro and again in the conclusion. I would
recommend that you make âAce Itâ your speech mantra, and sprinkle the phrase throughout your speech.
</p>
<p>
[first time I glance at my notes]
</p>
								<div class="col-lg-12 mt-25">
										<div class="row">
											<div class="col-8">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/disteval.jpg" alt="">
															<a class="light" href="img/contests/disteval.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                    </div>
<p>
Before we part ways, IÊ¼d like to tell you about .... how I admire your speaking ability. You spoke with confidence, were very organized, had really good speech mechanics and I congratulate you on a job well done.â
</p>
<p>
I ended just after 3 minutes (I would estimate 3 min 10 seconds). When I finished my evaluation content, I was at the yellow flag. So I figured I had some
leeway to come up with a decent conclusion and a summary to wrap everything up.
</p>
<p>
Interesting note on some of the other evaluators: I was speaking order #4 (which I was really excited about, itÊ¼s a good number to have chosen). The guy
next to me, during the target speakerÊ¼s speech, had used TWO sheets of paper for his notes!!! I was very surprised. He was writing A LOT during the
speech. When he went up there, it was somewhat amusing to see him fumble through his two sheets of notes to find more advice for the speaker. The
lesson that I learned is that less is more. My notes were pretty succinct, I even finished marking them up before the 5 minute time limit we were given.
Also, in the room where they put us while we finish our evaluation, *many* people were just having idle chats with each other. I, on the other hand, was
pacing back &amp; forth and planning out my speech (which removed my dependency on the notes during my evaluation â yay!).
</p>
<p>
It was a very good and humbling experience. I canÊ¼t wait to chat about it in person! I feel very humbled and proud of the progress I made with giving an
effective evaluation. I really do credit you with much of that progress. IÊ¼ve watched you give evaluations in our club and give me evaluations when I practiced my contest speeches in front of you. Thank you as always for being my friend and mentor. :-)
This is our trophy! Of course, IÊ¼ll keep it with me though. Hahahahahaha.
Me with my parents at the contest:
</p>
<p></p>
									<div class="col-lg-12 mt-25">
										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/diseval2Small.JPG" alt="">
															<a class="light" href="img/contests/diseval2Large.JPG"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
											
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/FB_IMG_1558405948064 - small.jpg" alt="">
															<a class="light" href="img/contests/FB_IMG_1558405948064.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                    </div>
<p>

</p>

                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest3",
	    title: "Before the 2015 Divison F Tall Tales",
	    date: "Nov 5, 2016",
	    image: "img/trophy/trophy2Large.jpg",
	    content: `<p class="excert">
                                </p>
<p>
                                I made an excursion this afternoon to the Freehold hospital with my son. I have pictures, but unfortunately, the important thing (the actual room and stage area) isn't here:
                                </p>
<p>
                                    On the plus side, I have many cute pictures of my son including a video of him jumping around. 
                                </p>
<div class="col-lg-12">
<p>
The conference room was being used so I felt weird walking in and taking pictures. I can describe it. It's not an auditorium type setting, so the stage is at the same level as the audience. The room is very wide and I saw what looked like two stage areas next to each other, each with its own podium and microphone. 
</p>
<p>
I don't know what the set up will be like for the contest, but there's ample space for a decent sized audience and they even had tables set up (so you can find the judges easily ... haha). 
</p>
<p>
The actual venue is very nice, despite the fact that it's a hospital. This building doesn't seem very hospital-ish at all and it's physically separate from the main hospital anyway. There's a nice looking outdoor area right outside the conference room. Bathrooms are easily accessible and nearby. It's definitely the better venue among the three contest settings I've been to (the church, the Rahway library, and your second contest where I brought my wife and son). 
</p>
<p>
Finding the medical center was easy but I got lost inside the campus. You have to check the signs and look for "Star and Barry Tobias Ambulatory Campus" (just like in Aida's email). Eventually though, the signs stopped showing this and I followed "North Parking Lot". From there, I parked in the employee parking lot (Since I'm a doctor) and went into Medical Building A. I went here just by luck but it turned out to be the entrance closest to the Jack Aaronson Conference Center. Turns out your assumption is correct: the auditorium is a room inside the conference center but is not at all your traditional auditorium. Just a regular room.
</p>
<p>
Anyway, hope this helps. Sorry I couldn't get pictures of the actual speaking area but hope I described it ok. Feel free to share this email with whomever might be interested, including the Dropbox link since my son is so handome.
</p>
								<p></p>
                                <div class="row">
                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest4",
	    title: "Brutally Honest",
	    date: "Nov 5, 2016",
	    image: "img/trophy/trophy3Large.jpg",
	    content: `
<p class="excert">
An honest critique of my performance from a trust audience member.                          
                                </p>
<div class="col-lg-12">
                                <div class="quotes">
                                I'm just going to be brutally honest about everything, which I believe you'll appreciate... at least in the long run. So yeah, to start off - I know of 3 judges who all listed the order that won (colin 1, you 2, whatever 3) - so it probably wasn't a judging fluke.<br><br>

The main problem was that Colin killed it. Personally I thought his jokes were hilarious, his writing was very good, and his delivery was virtually flawless. And he even pulled a Paul, and semi-condescendingly referenced your speech in his. A little extra vocal variety he could've used, but his wasn't even too bad. Yours was a bit better, sure.<br><br>

You did mess up, and I was sad to see that. Your recovery was quick, obviously infinitely better than #3 dude (not a good comparison, I know). But it was a solid stumble, which unfortunately you didn't even do in your last performance. I've noticed sometimes we don't do our best at later rounds in the contest, for a multitude of reasons, and well, f*, that's just life. But you likely did lose some significant points for that. You had a big throat clearing and restart, that I noticed. And I've noticed at division/district level most people don't have delivery lapses, and still get owned. Delivery is expected to be perfect. Can we do anything about that... I don't know. I think the stress of competing seriously is necessary for our growth so we're just forced to work through those kind of mishaps in the long-run. Sometimes you get one shot, one opportunity, for everything you ever wanted... and you f* up (a bit). But the truth is in the long run there's never just one shot.<br><br>

Your general expressiveness was a bit better, I like how you can make very big facial expressions, smile with your eyes, and have very animated hand movements. But I do remember feeling like you were a bit nervous this time around. Maybe it's an effect of seeing your speech a second time, or maybe I'm right, but I feel like your delivery was a bit muted/rushed, like you were a bit more nervous at some level. You did get in right before time limit, so maybe the rushing was a necessity...<br><br>

Anyway, it's all relative. And I think perhaps concretely Colin's punchlines were a bit more hard-hitting. A lot of your jokes were cute, credit-score and financial stability related and what not, whereas I might say Colin had some well structured jokes, like "crying? what was there to cry about" [after being born].<br><br>

As someone that's studied comedy a little bit, it's hard to describe, but I'm theorizing here for your potential benefit... it's like, his comedic conceit was a little more deeply developed. Like he went hardcore into the narcissism for his comic perspective, and didn't hold back. Your jokes about meeting your wife and talking to the computer were pretty soft and gentle. Here's a controversial saying I think is probably true: comedy is about truth and pain. When Colin talks like a cocky asshole, there's a greater "pain", he's more insulting to the audience, but we know he's joking so the audience is on board. When you talk about the mildly nuanced annoyances of marriage, it's funny, most of the audience can related, but it's less stimulating and memorable. (Again, all relative. Your speech was obviously still very funny in absolute terms) Like... you could've been more edgy in what you were saying about your own flaws, or the pains of marriage. Higher risk approach, but higher potential reward.<br><br>

With your Obama speech... you did go a little deeper. You were kind of implying Biden/Obama were really bizarre people with their pie obsessions, and the theatrics really brought it all together pleasantly. So you were lacking those competitive edges this time.<br><br>

In the end, it's hard to compare speeches, especially good ones. It's kind of a bullshit process, not really a naturally competitive domain. Competitive public speaking shouldn't really be a valid life pursuit, for that reason IMO.<br><br>

Hope I'm not being harsh here, I just figure you can use some very tough love after an experience like this. I know I liked it when people dove in when I lost, even to the detriment of my ego. Let me know if any of this was helpful, or if I can expound any more.<br><br>
                               								</div>
																							<p>-- --62-- (audience member)</p>

                                <div class="row">
                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest7",
	    title: "Ranting",
	    date: "Nov 5, 2016",
	    image: "img/contests/DSC_0350.jpg",
	    content: `
<p class="excert">
I'll start this long rant by saying that I did very well and I'm proud of myself and the progress I made. It was the best version
of that speech. I even had a callback that worked out very well. I got good laughs at all the expected places (except the
pants joke which is mediocre anyway).                          
                                </p>
<p>
The first speaker (who ended up winning the contest) talked about her difficulty with communication because she comes
from Japan. She had a joke about her difficulty to say election because it sounds like erection. I substituted my "attention"
joke with something you'll hear in the video: "You have to pay attention to your son. Unless he's trying to say election and it
sounds like erection. Then just ignore it." Something like that. It got a lot of laughs.
                                </p>
<div class="col-lg-12">
                                <div class="row">
<p>
I disagree completely with the woman who won 2nd place. Her speech was disgusting. It was a speech about getting old.
She used that same thing you did in your speech about being old. I don't remember the words but it was like a poem that
rhymed. It had something about farting in it. She talked about her body parts including her breasts. It was crude and
disgusting. There's even something in the rules about how the speech shouldn't contain crude language.
</p>
<p>
The contestants who won third and first place deserved it. The Japanese woman was very funny. The third place talked
about his GPS. His jokes were clever and well executed.
</p>
<p>
This will sound like sour grapes but I thought I did the best (oh really, Paul?). I even had a call back! Another woman had a
callback to the same speech but didn't go over as well. When they announced the third and second place winners I thought I
got it. But I was SO surprised about that second place winner. She really shouldn't have placed.
</p>
<p>
Now to spread rumors. I heard (people are saying) that the judges were all women so the women competition had an edge
by default. And, thinking about it, all speakers except 3 were women but one guy placed so I'm not totally convinced about
that theory though it might explain that 2nd place winner.
</p>
<p>
The other thing is I heard something about speaker order that goes against my original theory (or at least is an amendment
to my theory). People are saying that the first and last speakers have the edge. I was super happy when I got 4 for my
speaking order. But the middle may not be the best after all. The idea is that judges use the first speech as the standard
(since it's the best speech at that point since it's the only one they heard so far) and judge subsequent speeches against
that. And the last speech is also preferred since it's fresh in their mind. It's like how when you read an email you usually read
the beginning, the end and skim the rest of it. Like what you're probably doing with my email.
</p>
<p>
--3-- (excuse my French) pisses me off. He came up to me afterwards and said "we need to talk later." I knew exactly
what he wanted to talk about and almost threw my diaper bag in his face. He made reference to the "political" joke. I
responded to him very impatiently but told him I don't agree and the joke got good response. He then said that he's proud of
me because I came a long way (keep in mind he was with me from the beginning. He knows the awful place I started from
with TM). I appreciate the kind words he used eventually but that should've been the only thing he told me.
</p>
<p>
One person was disqualified for going over time. People thought it was me and that's why I didn't place. But I was sitting
right next to the timers and saw the woman who went over. She went 7 min 31 seconds. I was shocked. It's such a shame.
Granted, her speech wasn't that good anyway.
</p>
<p>
I would say there were like 3 speeches that simply weren't good. Got very few laughs and not polished.
My interview was hilarious and sincere and wonderful:
<iframe width="560" height="315" src="https://www.youtube.com/embed/WLHowxaV_ZI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe></p><p>
Watch closely in the interview. At one point, the camera man comes up to me to take a picture. I stop talking, look at him and
smile. The timing was perfect. It got good laughs.
</p>
<p>
So, thanks for reading. I'll complain about it next time we meet in person. Thanks for your pep talk and your continued
support. Even if I'm not area director, I'm retiring from contests. It's probably the cocaine talking but I really don't feel I have
anything more to prove. I feel that any future attempts would be me just trying the same thing but hoping I have good luck.
--4-- was amazing. He should've won first place. He was hilarious. His speech had pure emotion. It made us laugh, cry and
everything in between.
</p>
<p>
Sorry for my vicious rant.
</p> 
<p>
I realized I sent my rant to you from my gmail account. I copied over the thread into this email so I can use icloud (just more
convenient for me). First of all, I have your CISSP book ready to return to you. It's still in good condition! I took good care of it. I'll
give it back as soon as you return to the office. I hope the appointment today is going (or went) well.
</p>
<p>
Just a few other tidbits I thought of. Not ranting, just quirky details for amusement. I always struggle with finding a place to sit for
a contest and this past Saturday was no exception. I ended up sitting next to ${5} for the first half the contest (the table
topics portion). This turned out to be a mistake (shouldn't have been a surprise but my judgement isn't great when I'm stressed
out - haha). He made side comments to me after each table topic contestant was done and his clapping literally broke my left
ear. Yes, his clapping is that loud!
</p>
<p>
Speaking of evaluating, I went through the list of candidates on the district 83 website and have comments about their speech. I
find it kind of soothing and it's a good retrospective:
</p>
<p>
--1-- (2nd place winner) - Her speech was about getting old. Even though her speech was crude and disgusting, she got a
lot of laughs. The material was very female-centric for sure and probably only relate-able to the women in the audience. She
used that Dr. Seuss poem I mentioned meaning a good bulk of her content wasn't even her own.
</p>
<p>
--2-- - This was the guy who won first place at the first district humorous contest I attended years ago.
Unfortunately, I didn't watch his speech because I had to step out to call my wife and check up on them. From time to time, I
stood close to the doors of the room during his speech and I heard a decent amount of laughter. I tried to peek in between the
doors and saw him holding a blue folder so I'm guessing he used props.
</p>
<p>
The following four contestants I don't remember and (coincidentally) there were three contestants who's speeches weren't
memorable though I think they got good laughs. One woman spoke about her heritage, another spoke about "aliens" which
meant her teenagers and how they speak a language that's practically foreign, another told a story about a road trip she had with
someone who was diabetic and always used the phrased "... but that's beside the point" which was clever but I felt over used.
The "alien" woman went over time (7 min 31 sec). A fourth woman (I think Majorie) gave a speech that was definitely more
motivational opposed to humorous but definitely fell short on both counts. It was about her playing baseball as a child (I think?). I
tuned it out after like 1 minute of listening.
</p>
<ul>
<li>--6--</li>
<li>--7--</li>
<li>--8--</li>
<li>--9--</li>
</ul>
<p>
--10-- (3rd place winner) - Spoke about his "girlfriend" which was later revealed to be his GPS. This was a GOOD
speech. He deserved second place; must cleaner material than Dori). He had very clever jokes, speech was memorable, he
spoke about an instance where his Google Maps GPS was arguing with his Garmin. Very funny!
</p>
<p>
--11-- (1rst place winner) - Definitely deserved a place in the top 3. She spoke about her difficulty with pronouncing
English words (given she was born in Japan). She had very good gestures, vocal variety, got good laughs. I felt she had too
much "down time" like too much background information about herself; basically, time with no laughs. It was a decent amount of
non-entertaining set up material that allowed me to drift off (maybe I just have a short attention span). My guess is that her
speech had more weight (if you follow the judging criteria strictly) because her message had an inspirational undertone. It was
how she was taught that "silence is gold" but she learned that the gold is worth nothing. So, it was a powerful and original
message -- good optimistic take away.
</p>
<p>
In my opinion, the order should've been: Me 1rst (obviously), --11-- 2nd and --10-- 3rd. We had the best speeches. --1-- getting
up there HAD to be due to politics (either intentionally or unintentionally) or some kind of fluke. 3 days later I still think it's
ridiculous. Hahaha.
</p>
<p>
The lessons that I can probably learn from this are:
</p>
<ol>
<li>Luck is involved in all stages in the competition and it influences the outcome. Basically, the contests are rigged (joking!). From
speaking order to judge selection (especially from the perspective of whether or not the judges are really following the judging criteria), many, many, many factors are variable, non-trivial and out of our control independent of our speeches.</li>
<li>The message is important. It's good to have a theme/motto and refer back to the motto throughout the speech in creative
ways. You might think of the humorous speech as being inspirational that has jokes interleaved smoothly.</li>
<li>No matter what level of the competition, a significant number of contestants won't be good. So, even if there are 10
contestants you still have a good chance of winner with a polished and well intentioned speech. Also, stuff happens like speakers
will drop out and the 2nd place speakers will have to step up. It doesn't mean their speeches are bad but they're typically not as
prepared &amp; rehearsed as they should be.</li>
</ol>
<p>
The other thing that came to mind is that your speech and --4--'s speeches are very competitive. I still feel bad that you didn't
get through but think your material and presentation is good enough for the district level.
</p>
<p>
The other interesting tidbit: the drive to the contest was kind of an adventure. I left our house 5 min to 1 and --4-- was driving
into the driveway while I was stepping out. I love his punctuality. We didn't have to wait too long at all for --5--; maybe 3
minutes. So my concern was moot.
</p>
<p>
First off, --5-- had his long rants about stuff .. I just laid back and tried to phase it out.
I'm actually to blame for the "adventure" part and thank God we had 30 min buffer time! We ran into traffic because a lane was
closed (thanks, Christie!). It took a long time to get out of it so I had to admit to --4-- and --5-- that I REALLY had to pee. I
told them that I have anxiety before a contest and will have an emergency very, very soon. I think the words I used were, "We
might have to clean this seat if we don't find a restroom soon." --4-- was kind enough to take an exit and find a gas station.
During this time, --5-- just HAD to tell us a "joke". He told you that our sense of humor is "corny." Well his sense of humor
sucks -- plain &amp; simple. It was this LONG joke about elephants. "How many elephants blah blah and then how many elephants
blah blah ..". I felt like it went on for 30 min. --4-- and I told him the joke is stupid. I told him not even my kids would enjoy that
joke. That made my "holding it" much more painful.
</p>
<p>
I ran inside, did my business and got out. --4-- was super angry because he also tried to use the restroom but the person
working there was mean to him and didn't let him in (I think I must've ran in behind the guy's back or something! I wasn't stopped
at all). I felt bad because --4-- was furious (like cursing) so I felt it might impact his performance at the contest. After that, we
missed some turns getting back to the highway which was unfortunate but still managed to get to the hotel with ample time.
</p>
<p>
After that, things seemed to settle down. I emailed --4-- and --5-- when I got back home that night to apologize (again) for
the incident but was honest with --4--: I told him he did the best he possibly could with the question. Everything I said in my
presidential email to the group Saturday night is 100% true. He deserved to win but had to settle with 2nd place which is still a
very significant accomplishment for table topics.
</p>
<p>
Finally, in conclusion, I wanted to say that the microphone was indeed transparent. What I didn't know is that audio professionals
set up the contestants ahead of time. Just one time I accidentally hit it with my hand when I added "... of Toastmasters" following
my very offensive "Trump" joke. People were laughing at that point anyway so I doubt people heard it. But other than that, it
worked flawlessly and had 0 impact on my performance.
</p>
<p>
Thanks! Sorry again for the long email. When we meet again, we won't have anything else to talk about. Haha. Good luck with
your appointments today.
</p>

                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest8",
	    title: "My Most Painful Contest Yet",
	    date: "Oct 15, 2018",
	    image: "img/contests/FB_IMG_1539660566388.jpg",
	    content: `
<p class="excert">
									Tonight was physically my most painful contest yet. For an Area contest, the competition was surprising very good for Area 62.				
                                </p>
<p>
I got there one hour early (5 PM) which is standard Paul Ireifej behavior. I did the typical Paul Ireifej precontest one-hour-early OCD things: like using the bathroom 3 - 4 times, pacing around nervously,
checking to make sure I have my suit, tie and props, checking my work bag for no reason and putting
random things like my car keys, wallet, hand lotion for some reason in different pockets.
                                </p>
<div class="col-lg-12">
                                <div class="row">
                                    <div class="col-6">
                                        <img class="img-fluid" src="../img/contests/20181015_171722.jpg" alt="">
                                    </div>
                                    <div class="col-6">
                                        <img class="img-fluid" src="../img/contests/20181015_171729.jpg" alt="">
                                    </div>	
                                    <div class="col-lg-12 mt-25">
<p>
During one of my nervous walks back to the car, I noticed a gentleman trying to help a woman change
her tire in the library parking lot. I thought, âboy, am I glad IÊ¼m not involved since IÊ¼m really tense &amp;
nervous!â Sure enough the gentleman approached me and ask if I have a lug wrench. It was funny
because I actually watched a YouTube video on how to change a car tire recently and knew exactly what
he was asking about! I also knew that the car I drove in had the tools necessary to change a tire in the
back because I checked after I saw the video - hahaha. So I told him âYes!â And handed him the tool he
needed. I was proud that even in my tense/nervous state I was able to be a Good Samaritan. It was very
humbling. Obviously I didnÊ¼t actually HELP to change the tire â IÊ¼m not *that* nice LOL.
</p>
<p>
Eventually I got to the library and changed into my contest attire. At that point it was about 550 PM and
contest officials started showing up. --12-- (our dear Past President) helped me with my shirt
collar and tie (it was sticking up). I told him people would mistake him for my father because heÊ¼s helping
me with my tie and we look so similar (we donÊ¼t).
</p>
<p>
We did the briefing and I was SO pleased to get speaking order #3. With a pool of three contestants,
being last gives you an edge. I know my theory on speaking order changes each time I compete, but this
is my latest theory. :-)
</p>
<p>
IÊ¼m notorious for not paying attention during the briefing because I like to joke with people. --13--,
the funny guy who roasted --4-- at his birthday party, was talking with me and we had a good time. HeÊ¼s
apparently very funny even during casual conversation. He told me he has a hearing problem and I
responded with âWhat?â He laughed. :-)
</p>
<p>
While people were gathering into the tiny room, I was struggling to find someone in the front row to be
my plant to read the âI pay someone to speak along with meâ and get a dollar. I had a hard time and got
stressed out because of it. I saw jackets on the chairs in the front row and wish I knew who the jackets
belonged to! I finally found a very nice guy named --14--. He was really cool and we became friends quickly.
He was happy to help me and also volunteered to help --15-- record her humor speech â all around
good guy! He understood my directions easily and did it really well during my speech.
</p>
<p>
During the interview (which was rushed BTW), I mentioned that IÊ¼m working on an app for the smart
phone to generate prayers. I told people I like prayer because it spreads positivity so IÊ¼m working on an
app to help more people pray. At the end of the contest, --14-- expressed strong interest in my app! He said
he wants to get it when IÊ¼m done.
</p>
<h1>Area 61 Humorous Speech Contest</h1>
<h2>1. --26--</h2>
<p>
When this guy started, I thought âOK heÊ¼s definitely not going to place.â He basically borrowed jokes that
he mustÊ¼ve read on the internet and put it together in a speech. It was supposedly about observing
peopleÊ¼s behaviors. It started off by him rehashing something he heard at a seminar about how people
want to get into Heaven but no one wants to die. He basically had several fragmented stories where
each story led into an eventual punchline. The stories werenÊ¼t personal and really didnÊ¼t feed into his
main theme (whatever that was).
</p>
<h2>2. --16--</h2>
<p>
IÊ¼ve never seriously considered suicide until I heard --16--'s speech. As he spoke, I could feel my soul
leaving my body. This was really the start of my mental decline during the contest (and he was only the
second speaker!). This guy, who weÊ¼ll call --16-- (since thatÊ¼s his name) pretended to be the Grammarian
for a pretend meeting. OK. First of all, he started setting up his props *after* he was introduced by the
contest chair. This is the wrong time to set up props. And he even spoke while setting up the props.
According to the rules, the timers shouldÊ¼ve started timing at that point. Second of all, one of his props
was setting up some black instrument of sorts on a chair next to the podium. I donÊ¼t remember him ever
using this prop. He then had several cards of peopleÊ¼s names. He pretended that he couldnÊ¼t find the
person on the card in the room (he did this âroutineâ which is really an abuse of the word âroutineâ for
every single name). He mustÊ¼ve had like 10 names/cards when he did this. He pretended to
mispronounce the name and then revealed the real name. No one understand the humor. IÊ¼ve never seen
a speech more tedious and cumbersome than this. I actually glanced over at the timerÊ¼s clock several
times and was always surprised at how slowly the clock was ticking.
</p>
<h2>3. --17-- (placed first)</h2>
<p>
When she started her speech I could feel color return to my corpse. She was brilliant. God bless
you, --17-- (baaaah). She was super perky, not very polished (had quite a few filler words) but oh
boy her humor was spot on. She read a diary that she actually wrote when she as in high school and
emphasized how her problems back then were silly. She read two passages back-to-back about she
complained that her mom had Hepatitis and because of that she couldnÊ¼t go out. Her mom couldnÊ¼t cook
for her or buy her stuff. ItÊ¼s was SO FUNNY. And IÊ¼ll be competing against her in the Division Contest!
Lucky me!!!
</p>
<h2>4. --18--</h2>
<p>
He talked about how he worked as EMS and had to deliver a baby. It was an interesting story but not very
humorous or memorable.
</p>
</div>
<div class="row">
                                    <div class="col-6">
                                        <img class="img-fluid" src="img/contests/20181015_171742.jpg" alt="">
                                    </div>
                                    <div class="col-6">
                                        <img class="img-fluid" src="img/contests/FB_IMG_1539660566388 - Copy.jpg" alt="">
                                    </div>	
                                    <div class="col-lg-12 mt-25">
<h1>Area 62 Humorous Speech Contest</h1>
<h2>1. --13-- (placed third)</h2>
<p>
He really nailed it. I was VERY surprised he placed third. He was the only person I was really worried
about. His speech was about the stately use of âpausesâ in Toastmasters speeches. He gave funny
example after funny example of âpersonal storiesâ where he used pauses. The funny part was that the
stories and his use of pauses really illustrated an irresponsible use of a pause. The only thing that I can
think of as to why he placed last was because some of his humor was âedgyâ. Like he gave an example
of an instance where he ran over his neighborÊ¼s cat. He then took the cat and showed it to his neighbor,
said âsorryâ and just paused. The neighbor eventually took the cat and closed the door. But he gave
other examples where the joke connected. Like he was arrested and the officer told him he has the right
to remain silent. He said, âEven the police like a good pause!â After his speech, I was really shaken up
because I thought he would beat me. I started planning what I would do with my life post contest
because I clearly wasnÊ¼t going to continue on. My head started to really hurt at this point just from the
pressure. :-(
</p>
<h2>2. --15-- (placed second)</h2>
<p>
This was actually a lady and NOT the Super Bowl person. She was really good. She had great vocal
variety, good jokes and her speech was a complete story. It was about her taking care of her kids. She
gave a story about how her husband puts the kids to sleep. He reads the kids a story, sings a lullaby and
then he falls asleep instead. It was good, clever humor. I just felt that her delivery wasnÊ¼t as polished as
--13--'s. I learned that --13-- apparently (maybe ironically) puts on educational live shows for kids! So heÊ¼s
probably not really polished as much as heÊ¼s just experienced.
</p>
<h2>3. Paul Ireifej (placed first)</h2>
<p>
So I just heard two really good &amp; really funny speeches. At this point, IÊ¼m shaken up quite a bit because
the competitions as SO good and I wasnÊ¼t terribly confident in my speech to begin with. So IÊ¼m going into
this with a pretty bad mindset already.
</p>
<p>
ItÊ¼s hard to explain how awful I felt about the delivery of my speech. It was a LONG time before I got up (3
hour long contest ... OMG). By the time I went up, my mind was numb. --16-- speech really hurt me - it
just felt like an abuse of the stage. When I got up, I still felt confident but my delivery was really shaky. I
did my P-P-Paul thing and sang my little song (haha). From there, I definitely felt muted and not as
energetic as I usually am. My speech was sluggish and not as fluent as I had hoped. The thing about the
contest chair mispronouncing my name didnÊ¼t work at all. --19-- actually tried hard to pronounce my
name correctly and she did a fine job. So I actually felt bad when I used that joke! Other than that, my
jokes mostly connected. When I got to the AT&amp;T joke, that got A LOT of laughs. I then added
(unplanned) â â and I work for them!â That got even more laughs. It was great. The line where I read at
the same time as --14-- worked out great. It was very clever and well done.
</p>
<p>
The middle parts were slow - the church reading and then stuff about getting married. I tried out a new
joke about how I tried to sing my way through an argument with my wife. That fell flat. The wedding vows
joke worked â both the âthe audience thought I was reluctant to commitâ and the dialog with the Priest
worked great.
</p>
<p>
From here, I actually lost my place. I panicked and then I did a silly call back that was unplanned to --13--'s
speech about pauses. I joked that I was using a pause on purpose â totally fell flat and I just fumbled at
that point and felt even more lost. It was an awful moment for me personally. I doubt the audience felt
the same way; it was definitely a quick fumble and I think I regained my footing rather quickly. I finally
remembered what I was supposed to say next.
</p>
<p>
The next paragraph about Toastmasters had actually changed quite a bit since I practiced it at our club. I
cut out all jokes to save time (and they didnÊ¼t get laughs at the club anyway) and replaced it with a
single, âI was encouraged by my club and wanted to be the greatest speaker in the world! But my club
just wanted me to be a competent communicator. Their standards were so low.â It got a modest amount
of laughter.
</p>
<p>
Here was when I think I killed it (in a good way) and really saved my speech. The phone dialog with the
OBGYN was GREEEEAAAAAAT. Almost every line got tons of laughter. The BEST part was something I
had planned while suffering through --16--'s speech. After I said my wifeÊ¼s name, I did my âI almost didnÊ¼t
marry her for this reason aloneâ and followed by âGood luck with that name, Grammarian --16--!â This
got the LONGEST and LOUDEST laughter of any joke by anyone that night. It was a Hail Mary for sure
and worked out amazingly well. I made sure to read the printed agenda ahead of time so I got his name
right and added âGrammarianâ because his speech was pretty early on and I wanted to make sure
people knew who I was referring to.
</p>
<p>
A side note, one part of the phone conversation that hurt me was saying the letter âDâ. In my speech I
emphasize that D and L are hard for me to say. This showed. I struggled to say the letter D for realz
when I traced it in the air. After I finally got it out of my mouth I said âSee?â Because it really is something
I have a hard time with. :(
</p>
<p>
I then rushed the ending but it was still effective. I saw the yellow flag and panicked! I knew the long
glorious laugher I got, while amazing lol, ate up time. So did my fumble when I lost my place in the
speech. I ended before the red flag came up.
</p>
</div>
<h1>Area 61 Table Topics Contest</h1>
<ol>
<li>--20--</li>
<li>--21-- (placed third)</li>
<li>--15-- (placed second)</li>
<li>--22-- (placed first)</li>
</ol>
<p>
The Area 61 Table Topics Contest was interesting because the answers got better as it progressed. The
question was, âIf you could have any super hero power, what would it be and why?â --20-- did a
really good job although it was rather generic and kind of corny. He said heÊ¼d want everyone to treat
each other better, etc. And then our very own --21-- went second and gave an even better
answer! He had a very funny answer about being able to change his height. He said heÊ¼d want to be 3
feet tall and be a jockey (ride horses). --15-- went next and it kept getting better: she said sheÊ¼d want to
be to eat as much as possible without gaining weight. She talked about all the food in NYC that sheÊ¼d like
to eat. --22-- from iCIMs ended the round with a really funny answer: she wants the power to allow
herself to do her work, enjoy her personal life and follow her real passion which is to write. She delivered
many jokes that got laughs.
</p>
<h2>Area 62 Table Topics Contest</h2>
<p>
</p><ol>
<li>--23--</li>
<li>--24--</li>
<li>--25--</li>
</ol>
<p></p>
<p>
The question was, âIf you could have dinner with any historical figure
or celebrity, who would you pick and why?â The majority of the answers were boring. I canât even remember how they placed. --23-- 
said Frank Sinatra. --24-- ... canât remember. --25-- said
Courtney Cox, the actress from the TV show âFriends.â
Some older gentleman at the end tried to convince me that I act like a
character from the TV show âMash.â I tried to tell him very nicely that
the show was before my time and Iâm not familiar with it. He argued
that itâs a popular TV show and I should know about it. I really just
wanted to leave at that point so I gave up the argument â haha.
The contest rushed to an end. The library was closing and the funny
part was that they were announcing out loud on the PA system that the
library was closing! They interrupted the contest chair many times. The
interviews were rushed (which is probably a good thing!) and the
announcement of the winners was rushed (which for me was a good
thing because thatâs usually very hard for me to sit through - Iâm
always sooooooo nervous).
</p>
<p>
Thatâs it. Weâll chat more soon for sure. I should sleep now.
Thanks for reading!!
</p>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "contest9",
	    title: "The Contest Heard Around the World",
	    date: "March 2019",
	    image: "img/trophy/trophy7Large.jpg",
	    content: `
<p class="excert">
Welcome to the longest area contest in the history of contests. IÊ¼m still recovering from a whopping 4 1/2 hour long contest. I arrived there at 615 PM (with my kids â long story, much like this email). It ended at 1030 PM.                         
                                </p>
<p>
I arrived at Bell Works to pick up the kids at around 5 PM. I was going to pick up the kids with my wife and have her take them home by herself so I can head
to the contest. I get a text from her saying that sheÊ¼s going to be late with no ETA. Naturally, I do the only Paulian thing to do, which is to panic. After a good
10 to 15 minutes of checking the time, pacing and heavy breathing, I make the Executive Decision to pick up the kids myself and take them to the hospital
(not because IÊ¼m going to have a heart attack; thatÊ¼s just the contest venue). I did it and it was good. We had fun. For the kids, it was a little adventure and
for a brief moment they got to share in doing something that daddy enjoys. They were very well behaved and I had them situated soon after finding the
conference room. I gave them cookies and wraps that was provided to us. It was probably the most pleasant part of the evening. My wife eventually met us
at the hospital to pick them up (before contestant briefings).
                                </p>
<div class="col-lg-12">
                                <div class="quotes">
                                I am tired and hungry.
                                </div>
                                <div class="row">
								<p>
</p>
								
<p>
I had a mild hiccup early on. ThereÊ¼s this lady who, in my opinion, has a bad attitude. SheÊ¼s in the Old Bridge club and gave me trouble during the contest
last year as well. I wonÊ¼t name names because IÊ¼m a decent person but it begins with a --34-- and ends with a --35--. When I got to the room
originally, I found a very nice spot at the table right in the front. I was happy with it and claimed it for my own. I had my iPad to entertain the kids when they
were there (via Paw Patrol) so placed that on the table in front of the chair. I even put something in the chair itself. I then left to use the bathroom.
</p>
<p>
Upon my arrival, I found --34-- physically moving my stuff aside to take my seat. It was appalling. I think old, confidence-less Paul, wouldÊ¼ve apologized and
found another seat. But new, post-many-contests-Paul gave her the attitude she deserved. I told her, and I quote, âThis is definitely my seat. And IÊ¼m NOT moving.â While she put my stuff back, I said, âIÊ¼m sorry, I thought it was obvious because I put down my giant iPad.â I was really pissed off. I then stood there,
begrudgingly, with my arms crossed making random animal huffing &amp; puffing noises waiting while she took her sweet time finding another spot that was
convenient for her. She ended up sitting right next to me anyway hahaha. I felt a little bad and tried to make small talk but she shrugged me off.
</p>
<h1>Let the Contests Begin!</h1>
<p>
As is Toastmasters tradition, they started about 10 minutes late (actually, not that bad!). It started with Area 61 International Speech Contest. HereÊ¼s my
summary for this (and possibly all) international speech contests: itÊ¼s a series of personal tragedies and whomever suffered the worst tragedy wins. ^_^
</p>
<h2>Area 61</h2>
<p>
(In speaking order)
</p><ul>
<li>--14-- â placed third (The Unconscious Mind)</li>
<p>
This was my dear friend --14-- from the humor contest who had volunteered to read a line during my humor speech. He had a very --5-- - like
speech. HeÊ¼s apparently into neuroscience / mind stuff. His speech was about the âunconscious mind.â He started off by saying that he missed a turn on the
drive here. Then got into some mental mumbo jumbo. He got in quite a few laughs. It was a good, finely mediocre speech, but certainly not very memorable.
Felt more like classroom teaching. And I didnÊ¼t feel the takeaway was strong (whatever it was).
</p>
<li> --36-- â placed second (Risk &amp; Reward)</li>
<p>
This gentleman is very funny. He speaks with a slight accent but he had a good general message. He talked about ârisk and rewardâ and gave about three
examples of situations where the reward outweighed the risk. He tried to tie it back into how we should weigh the risk versus reward in our lives and do
things, blah, blah, wonderful. It was OK, but I wish the examples he gave were personal stories. Like he gave one example that âall guys should be familiar
withâ about a guy in a bar trying to flirt with a lady. Sorry, --36--, not all guys have been in this situation LOL. So it wasnÊ¼t relatable to me, though the way he
presented the example got laughs. He also talked about weighing the pressure of paying off a mortgage versus the potential reward of starting your own
business, much like the Facebook people, and possibly scoring it big. Sorry, --36--, but the chances of doing something of that magnitude are VERY slim. ItÊ¼s
just a weak argument â not a strong sell. But heÊ¼s witty and clever and delivers humor well.
</p>
<li> --31-- - placed first</li>
<p>
He had a very interesting story about hiking up the wrong mountain. He transitioned into saying how heÊ¼s directionally challenged but didnÊ¼t let that stop him
from doing more hiking expeditions. It was a good speech, though I donÊ¼t remember the lesson he was trying to have as a takeaway. He delivered it very
well, with humor, and was generally very polished and animated.
</p>
</ul>
<h2>Area 62</h2>
<p>
</p><ul>
<li> --20-- - placed third (Blood Brothers)</li>
<p>
This guy blew me away. He spoke with such conviction and genuine emotion, IÊ¼m pretty sure the entire audience was moved; many were probably moved to
tears. He gave a very dramatic recounting of his best friend from school. They moved away at some point and he learned his friend got sick. He visited his
friend in the hospital only to learn that his friend became severally disabled. He turned away at first but his mom encouraged him to go back. It developed
into a very strong friendship and Don has a new appreciation for the disabled. I think DonÊ¼s strength led to his downfall and less-than-warranted placement.
It was just TOO much. It was too dramatic, too emotional and it became overwhelming. DonÊ¼s speech requires an emotional investment. After listening to
three speakers in Area 61, it was just a lot to take in at night. I was exhausted after the speech. Also, there was a little too much shouting on his end. He
raised his voice at the appropriate times, but then even when he was teaching us a lesson he spoke âatâ us with a little too much vigor. It became slightly
over the top drama. Like, I felt nervous to disagree with him when he made his points. Also, his message is too narrow. I think he was encouraging us to
interact with and appreciate the disabled community. ItÊ¼s a very specific group of people that he wants us to show appreciation for. I think he pigeon-holed
his mantra.
</p>
<li> --12-- - did not place (Involuntary Immigrant)</li>
<p>
This was the best version of his speech that I heard. Unfortunately, his speech wasnÊ¼t entirely strong to begin with. And he was up against really good
competition in Area 62 tonight. IÊ¼m thinking that Area 62 ups the ante each year. --12-- did manage to cut out a lot of the extraneous information in his
speech. He definitely did a good job using the chisel. But, in the end, his speech just sounds like a pity party. He was tortured and abused as a child â no
one would argue with that. But it doesnÊ¼t go anywhere. The takeaway for us isnÊ¼t compelling. He didnÊ¼t use my line of going home to hug your kids. Instead,
he replaced it with some wishy washy line of âgo forth and show more affection to people.â He delivered the father death scene with ample conviction,
though I felt his original speech at the club (even before the club contest) did the father death scene much better. --12-- has good content and stories to
tell but just canÊ¼t package it quite right.
</p>
<li> --37-- - placed first (Best Worst Thing)</li>
<p>
Holy Moses. HOLY MOSES. Dave nailed it. I canÊ¼t think of any suggestions for improvement. It was a beautiful heartfelt speech delivered with genuine
emotion &amp; conviction. And, boy oh boy, was --37-- tortured as a child. He spoke about a time in high school his âfriendâ jokingly sprayed acid on his face. No
kidding. The way he described the immediate aftermath of the incident as the acid ate away at his face was perfection. I never heard anything described as
poignantly at this. He described the incident as there being three screams. The first scream was from the pain. The second scream was from the insides of
his face being exposed to the elements. The third scream never happened because the nerve endings in his face were gone. He described this as the âbest
worst thingâ that ever happened to him. He was always shy and didnÊ¼t have many friends. But after the incident everyone knew who he was. He also got the
second biggest laugh of the night (next to this guy Paul Ireifej; more on that later). So, yeah, congrats --37-- â he deserved this win.
</p>
<li> --38-- - placed second (One Simple Rule)</li>
<p>
Our favorite android is back. Tonight, --38-- practiced the human trait of âvocal variety.â She glitched tonight and got stuck in âhighâ volume mode and
ran with it. She yelled out a speech about being awkward with guys and explaining the many rules that existed with dating. She then told us how she met her
husband. Sorry, I need to take a quick break to yawn. OK, IÊ¼m back. I always feel thereÊ¼s a âflopâ with any speech contest. --38-- speech certainly felt
very floppy, yet she managed to place second. How she beat out Don Matts is anyoneÊ¼s guess. IÊ¼m thinking her speech relates very strongly to woman. IÊ¼m
not sure. Congrats! Or 1001000101110.
</p>
</ul>
<p></p>
<h1>Area 32</h1>
<p>
At this point, I literally snapped. OneÊ¼s brain can only take so much. Many of the speeches were good so it wasnÊ¼t a situation like the area humor contest last
year, but it was exhausting to sit through TWO areas knowing that one more area is still pending. I know I snapped because I kept giggling (out loud, mind
you) during the next speech. The humor flood gates couldnÊ¼t be contained any longer and I kept on coming up with joke after joke after joke that I had
apparently found HILARIOUS.
</p>
<p>
I think at some point during the evening, someone sent out a text message to everyone saying that âlouder is better.â The next two speakers yelled out their
speech.
</p>
<p>
</p><ul>
<li> --39-- - placed second (Spider Story?)</li>
<p>
She had a prop of a box. Clipped to that box was some artwork of a spider. HereÊ¼s the thing: the box was pretty big and was clearly a box for an HP laptop. I
kept thinking that she was showing everyone an empty box of an HP laptop. I barely looked at the spider because the letters H and P kept talking to me. I
donÊ¼t know why she clipped a picture of a spider to an HP box and, to my disappointment, I never will. Throughout her speech, I heard the same questions
repeat âWhy did you clip a picture of a spider to an HP box? Why not simply .... <gasp> ... hold up the picture and maybe even (dare I say) pan the picture
briefly from side to side?â Eventually, the HP box became the mantra of her speech. She yelled out a story about how she failed her exams in school and she
could barely talk to her mom. I thought to myself: âBIG deal. Dave had half his face burned off and could barely talk to ANYONE.â Hahahahahaha. Going after
Dave, everyone elseÊ¼s tragedies seemed childish.
</gasp></p>
<li>--40-- - placed third (Pig Syndrome)</li>
<p>
I donÊ¼t remember much of his speech because I was trying hard to stay awake. My mind is numb and empty at this point, much like an empty HP box. I think
his speech was good; it was about lessons that his father taught him. One good thing that came out of his speech was the quote âWhat canÊ¼t be cured must
be endured.â This line got a lot of laughs. So, I wrote it down and thought to myself, âHmm.. maybe I can use this for later.â And I did! His speech title was
distracting, âPig Syndrome.â By the end of his speech, I still didnÊ¼t understand what âpig syndromeâ is and I think thatÊ¼s a problem.
</p>
<li>--15-- (AKA seat stealer) - placed first (Just Drive)</li>
<p>
As much as IÊ¼d like to give a scathing evaluation of --15--, she did a good job. Her speech was about driving on the highway without encouragement from
her husband. One notable joke, in response to a predicament, was something along the lines of, âI know what I needed to do. Get a new husband!â. She told
a good story with well received jokes. After she sat down, during the intermission, I engaged her and had actually back &amp; forth conversation. She was much more relaxed after her speech and thus, one can argue that her poor attitude was due to being tense and nervous which is something we all can relate to.
That being said, I still think itÊ¼s in poor taste to steal someoneÊ¼s seat LOL. I complimented her, much to my chagrin, and gave her some quick feedback. I told
her that I think she placed first because the first two speakers yelled their speech and I didnÊ¼t pay attention. When she spoke, she grabbed my attention
and, um, didnÊ¼t scream. LOL.
</p>
</ul>
<p></p>
<h1>Evaluation Contest</h1>
<p>
And here we are, international speech gauntlet has ended, and evaluation contest begins!!! We had a very brief intermission, which was good, I had the
opportunity to console --12--, praise &amp; gloat all over --37--, avoid --41-- &amp; --27--, all the things that a standard Paul-during-the-intermission
would do. I commented to my fellow evaluators that itÊ¼s ridiculous to expect us to now *pay attention* to yet another speech *and* give feedback!!!! Our minds are basically numb at this point. Yet we charged ahead.
</p>
<h2>Target Speaker</h2>
<p>
The target speakerÊ¼s name, to this day, is unknown. I wrote down âKatieâ on my evaluation sheet but I heard all sorts of variations. I believe the different
names eventually converge to something like âKadianâ. Which sounds like a cool Game of Thrones character name. I donÊ¼t watch Game of Thrones, just saw
the trailer for the last season because, like, whatever. I do what I want. DonÊ¼t judge me!
She was really good. If she was competing in any of the contests, she would be a good contender. She spoke about the fear of public speaking. Sounds like
a standard topic that would be a snooze fest, right? Perhaps something thatÊ¼s overdone and this point? Yes and yes, but she presented her own unique
perspective and it was refreshing and had excellent takeaways (and humor!!!).
</p>
<h2>Paul Ireifej Evaluation</h2>
<p>
So, I was in speaker order #4 (out of 4) for Area 62. Therefore I didnÊ¼t hear any of the evaluations from Area 61 or 62 (except my own). I heard Area 63 but
really didnÊ¼t listen or retain much of anything. I think many of them had good points but didnÊ¼t seem to make a good story / envelope for their feedback. The
exception is a lady --42-- who placed first for Area 63. I felt her actual feedback was lacking but her delivery was great. Someone named --43-- placed second (oh, actually, sheÊ¼s in our club - I think she was the one who did the evaluation on Monday along with me). And --44-- (the
computer guy we know &amp; love) placed third.
</p>
<p>
From here IÊ¼ll just write up events in chronological order. We heard the speech, I was taking notes in my usual random / sporadic / not organized fashion. As I
went through, I tried marking things she did well with a (+) sign, and things to improve with an up arrow. It was difficult looking through my mess. I guess I
tried to write notes chronologically so the plus signs and arrows were intermixed with other stuff. I guess I always like to touch upon the structure as a main
point for the evaluation and say whether I thought it was good or bad. I always felt like structure is an important part of any speech. It shows whether you
had a good outline / train of thought.
</p>
<p>
Anyway, we were shepherd out of the room to another room. This new room was really nice, where the hospital executives probably sit, drink coffee and
discuss stocks. Everyone was focused on their evaluation notes and trying to formulate a speech out of it (myself included). This was probably the most
stressful part of the evening. After 5 minutes they took our notes away. After that, I turned to --22-- who was sitting right next to me (sheÊ¼s with iCIMs,
very funny lady). I said, âOK, now we can talk about the speaker behind her back!â --22--, very responsibly said, âThatÊ¼s probably not in anyoneÊ¼s best
interest.â Hahaha. We joked for a while back &amp; forth and that led to us joking with everyone else in the room and we got people to laugh at our random
comments. We were also discussing what the test speakerÊ¼s name was. No one seemed to know! I figured if everyone in the room can agree on the *same*
pronunciation, thatÊ¼s a win for us. If the name is wrong, at least everyone pronounces the wrong pronunciation incorrectly! And maybe the target speaker
will think her name has been mispronounced her entire life. Hahahaha.
</p>
<p>
I left the room to use the restroom. When I came back, the room was silent. Some people were standing up, practicing their evaluations semi-out loud.
Some were just sitting down, eyes closed, probably formulating their evaluations in their heads. The Seat Stealer was mouthing her evaluation while pacing
around the room. Basically, from my perspective of someone just walking in the room, it looked like a room of crazies LOL.
</p>
<p>
I sat there in the seat, closed my eyes to remember my zany notes and carefully pieced together my evaluation. I had a good intro, and tied in that
gentlemanÊ¼s quote that got laughs âThat which cannot be cured must be endured.â I really wanted to use that, I figured it would give me an edge. ItÊ¼s a
callback and I already know it would get laughs because it got laughs before. I decided to say that quote upfront preceded with âA wise man once said ...â
because that got laughs when I tried it out during Table Topics at our open house. From there, I picked just three things she did well. I decided to discuss
her speech cadence, speech structure and her tangible points. I said she speaks slowly, deliberately and each word has intention. She had very well placed
paused. I then outlined her speech, *very* concisely. I just wanted to note that she had good organization and move on. Also, her second story was about
her first career with (guess who?) AT&amp;T! When I got to that point, I said, âSomething which I am intimately familiar with!â And that got laughs. I then said that
her content is relatable and she has a strong takeaway. I realized I could tie in a wife joke. I said something like, âher speech was about dread and it
connects to the audience really well because who hasnÊ¼t experienced dread? I experience dread every time my wife asks me a question.â I used a variation
of this joke at the Open House and it got laughs there so itÊ¼s reliable. After that I moved on to three points of improvement. When she got up to speak, her
first word was Glossophobia, a big word that means âfear of public speaking.â I said she shouldÊ¼ve brought in a prop where she writes that word down (and
attach it to an empty HP box LOL â just kidding, I didnÊ¼t use that line but, now that I think about it, it wouldÊ¼ve been a really good joke). But that way, we
know what the word is and how itÊ¼s spelled. I told her, as an evaluator, I panicked because it was the first word that came out of her mouth and I didnÊ¼t know
what it was! That got laughs. :-) I then commented on her body language. I said that sheÊ¼s really good at using her body to speak to us so it wouldÊ¼ve
benefited us to see more of that. I wrote that instances of phrases where she couldÊ¼ve used body language to help. At this point, the yellow flag had been up
for some time so I panicked! I experienced PTSD from our club meeting that afternoon where I went over time. So I decided to wrap up. I skipped my really
good point of improvement about her incorporating personal stories with each of her examples. My conclusion was good, I tied in something she said about
your desire being greater than your fear. So I said sheÊ¼s exemplifying her own quote by making herself vulnerable in front of us and speaking about her fear.
That was it! So I had planned that out in my head. I then waited for my turn ... the longest wait of my life. It was like waiting at the edge of an airplane before
jumping out â haha. People left one by one and never came back. It was kind of eerie. When my turn was up, I wasnÊ¼t nervous. I had planned out my speech
and knew what to execute. I attached a picture of my evaluation notes to this email, in case youÊ¼re interested.
</p>
<div class="col-lg-12 mt-25">
										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1">
													<div class="h_gallery_item">
														<div class="g_img_item">
															<img class="img-fluid" src="img/contests/areaeval.jpeg" alt="">
															<a class="light" href="img/contests/areaeval.jpeg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
										</div>
<p>
When I sat back down, I witnessed the Area 63 evaluations but wasnÊ¼t really present in the moment anymore. I was just tired and numb â again. That seems
to be a common theme with Toastmasters contests these days.
</p>
<p>
SO â the biggest laugh of the night award (an award which no one formally recognizes except for me) goes to Paul Ireifej!!! Yay!!! They wanted to rush the
interviews, so --28-- (the interviewer) announced that everyone will just say THREE things: name, club and favorite quote. My quote was, and I quote, âI am
tired and hungryâ. I followed that up by saying, âThis was said by Paul Ireifej â 2 1/2 hours ago.â This got BIG laughs â both volume and duration. The line
for the candidates doing the interview, as you can imagine, was very long . They had all lined up in front of the room. I had a long walk back to the end of the
line after my turn. By the time I reached the end of the line, people were still laughing. As they laughed, and as I walked to the end of the line, I did a fist
bump with everyone on line. LOL.
</p>
<p>
When they got to announcing the winners, I got lucky!!! They had placed the certificates on a table right in front of me. I saw my name âPaul Ireifejâ written
out on a *blue* certificate. I thought, âWait a minute, isnÊ¼t blue for first place winner?â And I strained my eyes to read the âFirst Placeâ on the certificate!!! So
I celebrated at that point â hahaha. I was relived that I didnÊ¼t have to suffer the usual tension &amp; pressure of trying to read the contest chairÊ¼s lips to see what
name they formulate.
</p>
<p>
I was very happy to leave. Thanks for reading my very long email. IÊ¼d imagine it took you 4.5 hours to read which was the duration of the contest. I literally
spent all day on this email. IÊ¼ve been putting off every AT&amp;T-related task to do this. And I donÊ¼t regret it.
</p>
<p></p>

                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "talltales",
	    title: "What is Tall Tales?",
	    date: "Sept 5, 2021",
	    image: "img/blog/cat-post/cat-post-2.jpg",
	    content: `
<p class="excert">
                                </p>
<p>
				  The objective is to use your imagination and develop and present a story you've created that has exaggerations and twists and turns. There should be a point to your story.
				</p>
<div class="col-lg-12">
			      <div class="quotes">
				People have trouble coming up with ideas for tall tales. Just remember it's an exaggerated speech.
                                </div>
                                <div class="row" padding="10px 10px 10px 10px">

<p>
Tall Tales isn't a humor contest but I haven't seen a winning tall tales speech without humor in it. You have to make the speech funny.
</p>
<p>
  People have trouble coming up with ideas for tall tales. Just remember it's an exaggerated speech. Here's my advice: think of something interesting that happened to you. It could be anything: a flight on an airplane, a jog you took, a Toastmasters meeting. Then add crazy elements. You were on an airplane flying somewhere and the pilot was knocked out. You had to take control of the airplane and land it. Tell us what happened. How did you learn to fly? How did you keep your cool? Act it out for us. Or you were jogging in the woods and you ran into a bear. You were at a Toastmasters meeting and realized you lost the ability to clap. What did you do to substitute the clapping?
</p>
<p>
Think about something that's relevant today and talk about how you were really responsible for it. Like the iPhone. Tell us the story about how you stumbled upon the idea to make an iPhone and why no one gave you credit for it.
</p>
<p>
Study the judging criteria. Go online and find the tally sheet. This is what judges are supposed to follow when evaluating your speech. You'll be surprised!
</p>
<p>
Content 30% - Speech Development - putting ideas together so the audience understands them
</p>
<p>
Delivery 55% - Speech techniques, physical, voice
</p>
<p>
Language 15% - Appropriateness 
</p>
<p>
  The most important components of tall tales are: body movement, hand gestures and vocal variety. Pretend you're reading a fairy tale to your kids. Make voices for the characters. Be as animated as possible!</p>
				</div>
                                <div class="row">
                                    <div class="col-lg-12 mt-25">
                                        
                                    </div>
                                       
                                        <div class="col-lg-12 mt-25">
                                   
                                        
                                    <div class="row">
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    
                                        </div>  
                                        <div class="row">
                                   
                                        </div>
                                        <div class="col-lg-12 mt-25">

                                        </div>
                                    </div>									
                                </div>
                            </div>`
	},
	{
	    link: "tucson",
	    title: "CFCA in Tucson",
	    image: 'cfca/IMG_20191015_151101.jpg',
	    content: `<p class="excert">
                                    Iâm typing this up on the plane from San Francisco back to good old New Jersey. I had a really good experience, as you can probably tell from my text messages. The hotel (more like a resort) was beautiful. Itâs in the middle of nowhere but surrounded by mountains. I even took an opportunity to go hiking in what seemed like a desert; lots of cactuses (cactii?) and other AZ-specific things. It was also rather hot so I turned around early into my hike. Haha.                                
                                </p>
<div class="col-lg-12">
                                <div class="quotes">
                                Powerful and sustained change requires constant communication, not only throughout the rollout but after the major elements of the plan are in place. The more kinds of communication employed, the more effective they are. <br>-- DeAnne Aguirre
                                </div>
                                <div class="row">
                                    <div class="col-6">
                                        <img class="img-fluid" src="cfca/IMG_20191014_172247.jpg" alt="">
                                    </div>
                                    <div class="col-6">
                                        <img class="img-fluid" src="cfca/IMG_20191015_0831219.jpg" alt="">
                                    </div>	
                                    <div class="col-lg-12 mt-25">
                                        <p>
											I came in on Monday and checked the room where I would be speaking but the door was locked. I slept well that night (no weird noises, no waking up and wandering around at 3 AM). I got up really early for AZ time (around 5 AM, since obviously I was still in NJ time so thatâs like 8 AM here). I got to the conference room to scope it out again and it was wide open with a registration desk (no people) just outside. The room was cold, but there were lots of chairs and drinks (soda, coffee, you name it - yummy!). They had two screens (like you probably saw in the picture I sent) and a podium in the center. It was a nice room, the stage is very long. There were lots of chairs, the audience turned out to be (as far as I could remember) bigger than what was in Chicago.
                                        </p>
                                        <p>
                                            Here is a picture from the back. And this is what I saw from the podium (of course, with human beings lol).
                                        </p>
										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1" style="position: relative; height: 395px;">
													<div class="h_gallery_item" style="position: absolute; left: 0px; top: 0px;">
														<div class="g_img_item">
															<img class="img-fluid" src="cfca/IMG_0067.jpg" alt="">
															<a class="light" href="cfca/frontRoomLarge.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1" style="position: relative; height: 395px;">
													<div class="h_gallery_item" style="position: absolute; left: 0px; top: 0px;">
														<div class="g_img_item">
															<img class="img-fluid" src="cfca/IMG_20191015_083306.jpg" alt="">
															<a class="light" href="cfca/backRoomLarge.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                    </div>
                                        
                                        <div class="col-lg-12 mt-25">
                                            <p>
                                            They had an introduction session that morning. I was forced to introduce myself, which was a good ice breaker to my speaking publicly after a long flight. This intro session was apparently something that many people skip out on because the room was sparse. I gave a short intro and we were supposed to say something we had hoped to get out of the conference. I told them I spoke already at the Chicago session last year and appreciate the networking and speaking opportunities. 
                                        </p>
                                        <p>
                                            I skipped out on some talks to go back to the room to change into the suit/tie attire and practice. I was really quite nervous. The people seem, uh, smart and like, more confident with fraud mitigation than myself. I felt a little bit bad that my talk wasnât fraud-centric like others. That hurt my confidence a little. I took a short snooze (canât really sleep-sleep before a talk, haha, the nerves wonât let me). But during this brief moment of unconsciousness, I came up with a few more opportunities to inject fraud-specific information into my talk. So it turned out to be good. 
                                        </p>
                                        <p>
										When I walked to the room for the actual real deal talk, very nervous indeed, I went up the staircase and crossed over the outdoor bridge / walkway. The view is really profound. I had a little moment just be grateful that I was even there with these professionals in this beautiful environment (eating really good, free food).
                                        </p>
										<div class="row">
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1" style="position: relative; height: 395px;">
													<div class="h_gallery_item" style="position: absolute; left: 0px; top: 0px;">
														<div class="g_img_item">
															<img class="img-fluid" src="cfca/IMG_20191015_151217.jpg" alt="">
															<a class="light" href="cfca/outsideLarge.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
											<div class="col-6">
												<div class="gallery_f_inner row imageGallery1" style="position: relative; height: 395px;">
													<div class="h_gallery_item" style="position: absolute; left: 0px; top: 0px;">
														<div class="g_img_item">
															<img class="img-fluid" src="cfca/IMG_20191016_172729.jpg" alt="">
															<a class="light" href="cfca/chickenLarge.jpg"><img src="img/gallery/icon.png" alt=""></a>
														</div>
													</div>
												</div>
											</div>
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                        <p>
                                            But you can see it looks like something from a magazine. Yes, my google phone takes awesome pictures but it was quite the view. The conference room was at this level, only a few feet away. It felt magnificent. We donât get this kind of stuff in Jersey lol.
                                        </p>
                                        <p>
                                            When I went in, a gentleman Seth talked to me. I actually had chatted with him on the phone (I think I told you). Heâs from a start up company that he started that deals with tracking down used phones and giving the customer an inventive (buy-back) for returning them. It uses the IMEI to do this, so heâs looking for large carriers to help by providing an API to basically return a true/false for if the IME is blacklisted or locked. Anyway, he has a very Steve Jobs-like vibe. 
                                    </p>
									</div>
                                    <div class="row">
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/IMG_20191015_151101.jpg" alt="">
                                        </div>
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/IMG_20191015_141121.jpg" alt="">
                                        </div>
                                        </div>
                                        <div class="col-lg-12 mt-25">
                                    <p>
									He talked to me briefly but recognized that I was about to speak and let me off the hook saying something like, âIâll let you get into the gameâ. I appreciate that some people have the sensibility to leave you alone when youâre about to present. It doesnât come naturally to most people!
                                        </p>
                                        <p>
                                            I made my rounds to and from the bathroom (which was downstairs again, so kind of a long walk). The long walk helped to just walk out the anxiety I was feeling. I went down a long corridor that had pictures and explained a little about the history of the hotel. It was educational and a good distraction.
                                        </p>
                                        <p>
										I finally forced myself to walk back to the room. This was all during a break, so I went when the break was supposed to end. They did a rapid fire (which I guess means just a quick 10 minute presentation, I was disappointed because I thought they were going to shoot someone which would have been very entertaining). The presenter was also named Paul! Nice name. He was foreign and spoke with a heavy accent, saying âYes?â After each sentence. At this time, maybe because of the nerves / escalated sense of urgency or the coffee I had just beforehand, my brain was on rapid fire and I came up with new material &amp; jokes really quickly. I jotted everything down. I had heard most of the conference at this point and AT&amp;T was brought up many times but in the form of a question, like people asking to get more insight into what AT&amp;T is doing to tackle certain problems. And jokes just kept pouring into my head. I ended up adding the following content to my intro:
                                        </p>
                                        <p>
										I heard AT&amp;T come up during this conference but usually in the form of a question, such as how does AT&amp;T handle this? How does AT&amp;T handle that? I hope to shed some insight on this today.
I wonât have all the answers for you, and no, I canât help you fix your phone.
I learned that one way to get your abstract accepted is by making the title long and confusing so thatâs what I did here (before explaining what my title meant).
(When I introduced the idea of documentation) I heard and appreciate the vision that many of you have to do knowledge sharing and have the larger carriers expose APIs. Well, it all starts with doing documentation because how do you know what services you can offer if you donât document first?
                                        </p>
                                        <p>
										I confirmed with Roberta (the host/organizer of the presentations) that she had my slides and a remote clicking device. Sheâs very responsive and organized so she had everything ready for me. They hooked me up with a speaking device and off I was! I set up my paper notes and my phone (to time myself) on the podium in the center. I felt rushed but made sure to not rush myself even though I was now the center of attention, all eyes on me, but I took my time because I wanted to time myself. I did my stuff, looked up, and began!
                                        </p>
										<p>
										Like I said before (so no surprise), it went really well. Extraordinarily well. All thanks to you. Haha. Seriously. The slides looked really nice on the two big screens, the text was enlarged because of what you told me, the pictures were much more neatly arranged and I spoke fluently!!! Yay!!! I think I came off as confident &amp; comfortable. At the mid-point of my slides, I checked the time and it just climbed to the 15 minute mark which is perfect. I had a joke: âThis is the mid point of my presentation. If you fell asleep, thatâs fine, but you can wake up now because this is the most important part of the presentation.â This was when I introduced the very cleverly named slide knowledge transfer category ratios (sound familiar? Haha). So itâs important because I highlight the four areas I think should take a priority and how much time you should spend on each task.
</p>
<p>
After that, it was smooth sailing. I had more jokes; all jokes were received well. I ended just before 30 mins and opened it up to questions. The first gentleman who asked a question is someone who seems like comes to every conference. He talks a lot and I remember him from the Chicago conference. He was the first to ask a question even after that talk and it was a hardball question that I struggled with. This time, he didnât ask anything. He just told me what a good job I did and highlighted something specific he wanted felt was noteworthy (I think it had to do with documentation). I responded with âI like the questions that arenât really questions, but are just comments on what a good job I did.â That got the most laughs out of anything that day and even got applause! It was a nice moment. The rest of the questions were fine, I answered them easily as they were mostly just opinion based questions. There were many people that raised their hands and the moderator had to cut them short. I really appreciate that there were was so much interest in my talk.
</p>
<p>
I realized the paper notes really didnâtâ cut it. After each slide, before moving on to the next slide, I took some time to look at my notes to make sure I didnât miss anything. But it was slow, a little more downtime during the talk than I felt comfortable with. So Iâm not sure what would have been better to do the next time. I canât use the noes embedded into the slide because I donât look at my laptop during the talk. Itâs in front of Roberta and I donât see it. I also found myself turning my head to look at the slides more often that I had wanted to.
</p>

<p>
After the talk, someone else went up and they actually made reference to my speech. He noted that before many companies were outsourcing work to places like India but they started bringing them back in-house like Paul explained (haha). 
</p>
<p>
We had another break and I stepped outside. Someone walked up to me and said they really enjoyed my talk. They said it was the most concise and clear/articulate talk they heard all day. I was really flattered. Another lady told me she was texting with Adam Something (last name is masked for confidentiality .. and because I donât know his last name lol). He works for AT&amp;T in fraud, he must be someone higher up. She said she was texting him things like, âThis guy is really good .. and heâs funny!â. I got a kick out of that.
</p>
<p>
It was really nice going to the conference the next day. I got some more verbal accolades from people and obviously felt more comfortable / much less tense. Haha. I felt different when traversing the same route (hotel room to stairs to walkway with the beautiful view). I probably mentioned this before, but I really enjoy revisiting places where I was tense before. Itâs nice to remind myself of the challenge I experienced at that place and then it feels smaller / less intimidating than it did before. Yay.
</p>

                                        <div class="col-lg-12 mt-25">
                                        <p>
                                        </p>
                                        </div>

<p>
Thanks as always for your support. Like I mentioned in my email to the Toastmasters group, your feedback and time with me in particular was very valuable. Your feedback really did make all the difference. I felt much more confident after revising the slides. You gave me a better way to explain âmech IDâ that I wouldnât have thought of before! Yay to Thomas! Itâs early cool that we both did something that scares us a day apart. I could tell you were nervous before your web security tech talk and glad it went went. Sure you didnât get the audience you were hoping for, but there was a storm (out of your control) and youâre still just starting out! I delved into an already well established organization and youâre starting completely from scratch building out your own thing. Itâs very admirable. 
</p>
<p>
That night, after the talk, I went to a Toastmasters group. They were a very friendly group, had a few good speakers, but I was disappointed they didnât give me a table topics question and really an opportunity to speak at great length. I wanted to tell them how I just did a professional talk and Toastmasters helped me to practice. But oh well.
</p>

 <div class="row">
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/IMG_20191015_203828.jpg" alt="">
                                        </div>
                                        <div class="col-6">
                                            <img class="img-fluid" src="cfca/IMG_20191015_190836.jpg" alt="">
                                        </div>
                                        </div>
                                        <div class="col-lg-12 mt-25">
<p>
At the end of that long day, I realized I was awake for over 17 hours. I wanted to pull a Jack Bauer and wait until it became a solid 24 but thought it would be wise to sleep at that point. :-)
</p>
<p>
Canât wait to meet up in person and chat more! Thanks for reading.
</p>
</div>                                  
                                        </div>
                                    </div>									
                                </div>
                            </div>`
	}
    ];
    doBlogs(blogItems);

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
	    })
	    .catch(function(error) {
		console.log("FAILED FOR " + params.command);
		console.log(error);
	    });
    });
})
