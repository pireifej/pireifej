$( document ).ready(function() {    
	window.god = window.god || {};

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

	    god.query("logVisitor", "afterLogVisitor", {details:JSON.stringify(visitorDetails)}, false, true);
	  }

	  function error(err) {
	      god.query("logVisitor", "afterLogVisitor", {details:JSON.stringify(visitorDetails)}, false, true);
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

    window.afterHelp = function(response) {
	console.log("afterHelp");
	console.log(response);
    }

    var fullElem = "";
    var stuff = [
	{
	    image: 'img/gallery/portfolio-12.jpg',
	    label: 'aiOpX',
	    type: 'projects',
	    href: 'aiopx',
	    gallery: [],
	    link: "google.com",
	    details: {
		date: '2020',
		company: 'AT&T',
		other: 'other',
		technology: 'AngularJS,HTML,CSS,MongoDB'
	    },
	    desc: '<p>aiOpX (or Artifical Intelligence Operations X - any) is a real-time fraud monitoring application. It performs a health check on internal fraud systems and tracks errors, down-time, and generates metrics based on log files.</p><p>There are dynamic rules that include a mitigation to when a rule is triggered. The mitigation includes responses such as sending an email to a preset distribution list (business hours vs. off-hours), and paging a cell phone.</p><p><b>Developed key front-end capabilities: severity cases landing page, raw JSON record view, application field type with virtual field support.</b></p>'
	},
	{
	    image: 'img/gallery/portfolio-11.jpg',
	    label: 'Crossroads',
	    type: 'projects',
	    href: 'xrds',
	    details: {
		date: '2019',
		company: 'AT&T',
		other: 'other',
		technology: 'AngularJS,HTML,CSS,MongoDB'
	    },
	    desc: '<p>CrossRoads (XRDs) provides a single interface to search for customer information across multiple AT&T data sources. It has the capability to find and verify customer contact information by searching on the address, name, or telephone number of the AT&T customer. Redesigned the four main query lookup pages: Address, Telephone Number, Name, Account/SPI.</p><p><b>Redesigned the GUI using latest technology (AngularJS, JavaScript, HTML, CSS, MongoDB).</b></p><p>Merged capabilities of another application (Global Fraud Management System) into XRDs to do a customer search and finding affiliated accounts with given customer phone number, SSN, email.</p>'
	},
	{
	    image: 'img/gallery/portfolio-10.jpg',
	    label: 'Watch Dog',
	    type: 'projects',
	    href: 'watchdog',
	    details: {
		date: '2018',
		company: 'AT&T',
		other: 'other',
		technology: 'AngularJS,Tomcat,Java,Hbase,MongoDB,Hadoop'
	    },
	    desc: '<p>Partner with Chief Security Office (CSO) and Global Fraud Management Organization (GFMO) to provide analytics that help identify questionable and/or malicious behavior by internal employees accessing customer data. Uses \"watermarking\" which tracks access to SPI and CPNI data that AT&T is a steward of.</p><p><b>Productionized application that was originally built on a development environment using offshore resources.</b> Brought stability, production support, alerting and well defined system flow & architecture. Automated daily data ingestion with mech IDs. <b>Work so highly regarded that is resulted in a professional talk at the 2019 Communications Fraud Control Association (CFCA).</b></p><p>UI (AngularJS, Tomcat), UI backend (Java Springboot Restful webservices), Datalake service (webservices layer for Hbase), Data ingestion & case creation (Java), Cron jobs & Scheduler (daily/weekly housekeeping), Data Stores (MongoDB for low latency access, and Hbase for long-term big data storage using Hadoop File System HDFS).</p>'
	},
	{
	    image: 'img/gallery/portfolio-09.jpg',
	    label: 'FASTR',
	    type: 'projects',
	    href: 'fastr',
	    details: {
		date: '2016',
		company: 'AT&T',
		other: 'other',
		technology: 'AngularJS,HTML,CSS,Java,MongoDB'
	    },
	    desc: '<p>Fraud Analysis and Service Order Tracking and Reporting (FASTR) tracks correlations between personnel that sell Internet service and Direct TV products and abnormalities or irregularities in the order and/or billing processes. Works by applying Potential Fraud Group (PFG) rules that describe a potential fraud pattern. It looks for PFG violations in the billing data and generates alerts.</p><p> <b>Leading the effort to redesign legacy FASTR application using JavaScript (AngularJS), HTML, CSS with Java and MongoDB for data access.</b><p>The new design is a fraud case management system that allows the users to look through transaction data to sift out the benign fraud alert from the serious ones. Implemented several query form pages to search through data, implementation a novel configuration-based page generation solution.</p>'
	},
	{
	    image: 'img/gallery/portfolio-07.PNG',
	    label: 'Project Frugality',
	    type: 'projects',
	    href: 'frugality',
	    details: {
		date: '2015',
		company: 'AT&T',
		other: 'other',
		technology: 'Scala'
	    },
	    desc: '<p>Project Frugality looks at how cell site construction is conducted in 25 initiatives and determines if the implementation is meeting the expectations of Big Data C&E leadership, who gathers requirements and assumptions surrounding cell site construction. Completed deliverables given very ambitious deadlines. Led development efforts and data ingestion work flow process. Led discussions with data ingest developers and product owners. <b> Overall savings of ~ $1B just for 2016.</b></p>'
	},
	{
	    image: 'img/gallery/portfolio-06.jpg',
	    label: 'Electronic Law Enforcement Activity Tracker',
	    type: 'projects',
	    href: 'eleat',
	    details: {
		date: '2014',
		company: 'AT&T',
		other: 'other',
		technology: 'Perl,HTML,jQuery,jVectorMap'
	    },
	    desc: '<p>Augmenting the Electronic Law Enforcement Activity Tracker (ELEAT) application with surveillance intercept automation. Developed 4 new interfaces in Perl and a web interface for direct node access. Took BVoIP development over from previous developer after his abrupt leave and was still able to deliver top quality code ahead of expected completion deadline.</p><p><b> Undergone several initiates to improve ELEAT code infrastructure:</b></p><p>Effort to re-design dated ELEAT web interface using HTML, JavaScript and jQuery for faster response time, enhanced usability and ease-of-use. jVectorMap API was used to generate an interactive SVG map based on node longitude/latitude information. Markers on map are updated in real-time using Ajax.</p>'
	},
	{
	    image: 'img/gallery/portfolio-08.PNG',
	    label: 'Parent Locator Service (PLS)',
	    type: 'projects',
	    href: 'pls',
	    details: {
		date: '2013',
		company: 'AT&T',
		award: '\"Can-Do\" Excellence Award',
		technology: 'TBD'
	    },
	    desc: 'Parent Locator Service (PLS) allows state child support services to request information about \"delinquent\" parents. Led technical discussions with various state agencies to integrate their systems onto PLS. Worked against aggressive schedule and continually met milestones and deliverables. Coordinated activities among state clients, AT&T Subpoena Center, production support and firewall team to on-board several new state agencies.</p><p><b>Drastically reduced agency onboarding time from 6 months to 1 week</b> by leveraging Voltage SecureMail; this displaces the need for complex SSH/firewall rule configuration and eliminates the need for state client to set up a dedicated server.</p>'
	},
	{
	    image: 'img/gallery/portfolio-05.jpg',
	    label: 'Consolidated Compliance System',
	    type: 'projects',
	    href: 'css',
	    details: {
		date: '2012',
		company: 'AT&T',
		award: 'Vice President Excellence and \"Can-Do\" Excellence Award',
		technology: 'HTML,PHP'
	    },
	    desc: '<p>Led the client-side development of a release for the Consolidated Compliance System (CCS). Worked closely with project management, technical team lead and clients to architect business requirements and engineer a process work flow. Also led the development and deployment of a subsequent CCS release.</p><p><b>This deployment included a completely new technology base (from a Java Web Start framework to a purely web-based solution using HTML and PHP)</b> and re-designed database schema. Led weekly status meetings with developers to discuss current requirement gaps and technical hurdles. Trained new developers and testers. Presented new interface and functionality to end users in the National Compliance Center (NCC) via technical demos.</p>'
	},
	{
	    image: 'img/gallery/portfolio-04.jpg',
	    label: 'Mobility Community of Interest',
	    type: 'projects',
	    href: 'mcoi',
	    details: {
		date: '2011',
		company: 'AT&T',
		award: 'Vice President Excellence',
		technology: 'Perl CGI,jQuery'
	    },
	    desc: '<p>Development of Mobility Community of Interest (MCOI) Visualization, an online application that helps fraud analysts identify telephone numbers most often called by suspected fraudsters.</p><p><b>Utilizes internal AT&T Research technology to generate an infograph representing the suspect\'s COI.</b></p><p>Uses Perl CGI and jQuery for data presentation and graphical zooming.</p>'
	},
	{
	    image: 'img/gallery/portfolio-03.jpg',
	    label: 'Integrated Software Environment',
	    type: 'projects',
	    href: 'ise',
	    details: {
		date: '2010',
		company: 'AT&T',
		award: 'Vice President Excellence',
		technology: 'YUI,HTML5,WebKit,CSS,Oracle DB XML'
	    },
	    desc: '<p>Collaborated on the Integrated Software Environment (ISE), an online alert management application that graphically represents remote file system architecture. Used YUI 2.0 framework for GUI development, HTML5 for drag-and-drop capabilities and WebKit CSS for graphical transformation. Incorporated Oracle\'s Berkley DB XML for alert database storage.</p>'
	},
	{
	    image: 'img/gallery/portfolio-02.jpg',
	    label: 'Software Engineer - AMD',
	    type: 'projects',
	    href: 'amd',
	    details: {
		date: '2008',
		company: 'AT&T',
		other: 'other',
		technology: 'Visual Studio,C#,SQL'
	    },
	    desc: '<p>Developed the Automated Characterization Environment (ACE), an application that automates the testing processes of hardware. Development of ACE was done using Visual Studio 2008 with C#. Designed the data access layer, including stored procedures, through SQL Enterprise Manager.</p><p><b>Facilitated joint effort between teams to develop a common API to access low-level code libraries.</b><p>Also contributed to the development of Net Tool, an application that performs user-defined rule checks on a motherboard. Significantly decreased bugs by developing auto testing functionality to aid developers.</p>'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Student Researcher',
	    type: 'projects',
	    href: 'reu',
	    details: {
		date: '2006',
		company: 'AT&T',
		other: 'other',
		technology: 'C++,Unix'
	    },
	    desc: '<p>Developed C++ code based on "Zones method" that incorporates shortest-path algorithms to determine the best route for exploration through a graphic representation of system complexity. Designed novel data structure and operations in C++ to represent the difference bound matrix.</p>'
	},
		{
	    image: 'img/running/disneySmall.jpg',
	    label: '2020 Walt Disney World Marathon',
	    type: 'race',
	    href: 'disney',
	    details: {
		date: '01/11/20',
		distance: '13.1 miles',
		time: '2 hours 36 min',
		location: 'Florida'
	    },
	    gallery: ['img/running/disney1.jpg','img/running/disney2.jpg','img/running/disney3.jpg','img/running/disney4.jpg'],
	    link: 'https://www.trackshackresults.com/disneysports/results/wdw/wdw20/hm_results.php?Link=98&amp;Type=3&amp;LName=ireifej&amp;FName=&amp;City=&amp;State=&amp;Country=',
	    desc: 'TBD'
	},
	{
	    image: 'img/running/rockySmall.jpg',
	    label: '2019 Rocky Run',
	    type: 'race',
	    href: 'rocky',
	    details: {
		date: '11/09/19',
		distance: '3.1 miles',
		time: '27 min 09 sec',
		location: 'Philadelphia'
	    },
	    gallery: ['img/running/phillyCert.png'],
	    link: 'https://www.athlinks.com/event/122368/results/Event/891873/Course/1723472/Bib/2526',
	    desc: 'TBD'
	},
	{
	    image: 'img/running/rhodeSmall.jpg',
	    label: 'Independence Rhode Race Half Marathon',
	    type: 'race',
	    href: 'rhode',
	    details: {
		date: '06/29/19',
		distance: '13.1 miles',
		time: '2 hours 15 min',
		location: 'Rhode Island'
	    },
	    link: 'https://runscore.runsignup.com/Race/Results/34245/IndividualResult/QhLB?#U34244592',
	    desc: 'TBD'
	},
	{
	    image: 'img/running/rhineSmall.jpg',
	    label: 'Rhinebeck Hudson Valley Half Marathon',
	    type: 'race',
	    href: 'rhine',
	    details: {
		date: '05/11/19',
		distance: '13.1 miles',
		time: '2 hours 17 min',
		location: 'Hudson Valley, NY'
	    },
	    link: 'https://www.trisignup.com/Race/Results/65311/IndividualResult/QBGZ?#U36163320,U2638680',
	    gallery: ['img/running/rhineCert.PNG'],
	    desc: '<p>TBD</p>'
	},
	{
	    image: 'img/running/phillySmall.jpg',
	    label: 'Philadelphia Half Marathon',
	    type: 'race',
	    href: 'philly',
	    desc: '<p>11/23/19 / 13.1 miles / 2:07</p>'
	},
	{
	    image: 'img/running/winter.png',
	    label: 'Run from Winter 10K',
	    type: 'race',
	    href: 'winter',
	    desc: '<p><a href="https://runsignup.com/Race/Results/54760/IndividualResult/tYqb?#U34244592">Results</a></p><p>03/24/19 / 6.2 miles / 54:02</p>'
	},
	{
	    image: 'img/running/autismSmall.jpeg',
	    label: 'Hustle for the Puzzle 5k Road Race for Autism',
	    type: 'race',
	    href: 'autism',
	    desc: '<p><a href="https://www.athlinks.com/event/16532/results/Event/158372/Course/218826/Bib/327">Results</a></p><p>04/03/2011 / 3.1 miles / 26:13</p>'
	},
	{
	    image: 'img/running/verizonSmall.jpg',
	    label: 'Verizon Wireless Corporate Classic',
	    type: 'race',
	    href: 'verizon',
	    desc: '<p><a href="http://www.bestrace.com/verizonwirelessclassic/overall-2010.HTML">Results</a></p><p>07/15/10 / 3.1 miles / 26:31</p>'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Internship at the White House',
	    type: 'speech',
	    image: 'img/contests/internship.JPG',
	    href: 'internship',
	    desc: '<p>2014 Area 62 Humorous Speech 1st Place</p><p>2014 Division F Humorous Speech</p>',
	    gallery: ['img/contests/internship2.JPG', 'img/contests/internship3.JPG', 'img/contests/internship4.PNG', 'img/trophy/trophy1Large.jpg'],
	    details: {
		year: '2014',
		location: 'library?',
		contest: 'Humor',
		other2: 'other2'
	    },
	    link: 'https://youtu.be/wLer565RD-o'
	},
	{
	    image: 'img/trophy/trophy2Large.jpg',
	    label: 'How I Met My Wife',
	    type: 'speech',
	    desc: '<p>2015 Area 62 Tall Tales 1st Place</p><p>2015 Divison F Tall Tales 2nd Place</p>',
	    href: 'metmywife',
	    gallery: ['img/trophy/trophy3Large.jpg'],
	    details: {
		year: '2015',
		location: 'Freehold',
		contest: 'Tall Tales',
		other2: 'other2'
	    }
	},
	{
	    image: 'img/contests/DSC_0350.jpg',
	    label: 'The Greatest Father in the World',
	    type: 'speech',
	    desc: '<p>2016 Area 62 Humorous Speech 1st Place on Saturday, Nov. 5, 2016.</p><p>2016 Divison F Humorous Speech 1st Place</p><p>2016 District Humorous Speech on Saturday, Nov. 5, 2016.</p>',
	    href: 'father',
	    link: 'https://www.youtube.com/watch?v=-u9xwoalSf8&t=79s&ab_channel=PaulIreifej',
	    gallery: ['img/trophy/trophy4Large.jpg','img/trophy/trophy5Large.jpg'],
	    details: {
		year: '2016',
		location: 'edison?',
		contest: 'Humorous',
		other2: 'other2'
	    }
	},
	{
	    image: 'img/contests/iampaulPNG.PNG',
	    label: 'I am P-P-Paul',
	    type: 'speech',
	    desc: '<p>Placed first at the 2018 Area 61 & 62 Humorous Speech Contest on October 15, 2018 at the Eastern Branch, Monmouth County Library in Shrewsbury, NJ, USA.</p><p>Did not place at the 2018 Division F Humorous Speech on TBD at the Hospital.</p>',
	    href: 'pppaul',
	    link: 'https://www.youtube.com/watch?v=qkGwzyczOCc&ab_channel=PaulIreifej',
	    gallery: ['img/contests/FB_IMG_1539660566388.jpg','img/contests/20181015_171742.jpg','img/contests/20181015_171729.jpg','img/contests/20181015_171722.jpg'],
	    details: {
		year: '2018',
		location: 'tbd',
		contest: 'Humorous',
		other2: 'other2'
	    }
	},
	{
	    image: 'img/contests/diseval4Large.jpg',
	    label: 'Evaluation Contest',
	    type: 'speech',
	    desc: '<p>Placed first at the 2019 Area 62 Evaluation 1st Place at the Bayshore Medical Center on March, 2019.</p><p>Placed first at the 2019 Division F Evaluation at the Bayshore Medical Center on March 2019.</p><p>Placed first at the 2019 District 83 Evaluation 1st Place at the APA Woodbridge Hotel in Iselin, NJ.</p>',
	    href: 'evaluation',
	    gallery: ['img/trophy/trophy11Large.jpg','img/trophy/trophy7Large.jpg','img/trophy/trophy8Large.jpg','img/contests/areaeval.jpeg','img/contests/diveval.jpg','img/contests/disteval.jpg','img/contests/diseval3Large.jpg','img/contests/diseval2Large.JPG','img/contests/FB_IMG_1558405948064.jpg'],
	    details: {
		year: '2019',
		location: 'tbd',
		contest: 'Evaluation',
		other2: 'other2'
	    }
	},
	{
	    image: 'img/ralph.jpg',
	    label: 'Improvise and Don\'t Apologize',
	    type: 'speech',
		desc: '<p>Placed first at the 2019 Area 62 Tall Tales.</p><p>Placed first at the 2019 2019 Division F Tall Tales.</p>',
	    href: 'improvise',
	    gallery: ['img/trophy/trophy9Large.jpg','img/trophy/trophy10Large.jpg','img/contests/IMG_20191002_194504.jpg','img/contests/IMG_0078%20(1).JPG','img/contests/Screenshot_20191114-215011%20(1).png','img/contests/IMG_1213 - Copy.jpg'],
			details: {
			year: '2020',
			location: 'tbd',
			contest: 'Tall Tales',
			other2: 'other2'
	    }
	},
	{
	    image: 'img/contests/cookie.PNG',
	    label: 'Don\'t Stop Speaking',
	    type: 'speech',
		desc: '<p>Placed first at the 2020 Area 61/62 Humor 1st Place on Zoom.</p><p>Placed first at the 2020 Division F Humor 1st Place on Zoom.</p><p>Placed first at the 2021 District 83 Humor Speech Contest on Zoom.</p>',
	    href: 'dontstopspeaking',
		link: 'https://www.youtube.com/watch?v=jaQD_r7Xe8s&t=409s&ab_channel=SingwalaIreifej',
	    gallery: ["img/trophy/trophy14Large.jpg","img/contests/cert.PNG","img/contests/Screenshot_20210501-160712.png","img/contests/Screenshot_20210501-141044.png","img/contests/Screenshot_20210428-193907.png","img/contests/Screenshot_20210428-193916.png"],
			details: {
			year: '2020',
			location: 'Zoom',
			contest: 'Humor',
			other2: 'other2'
	    }
	},
	{
	    image: 'img/contests/whatsthepoint.PNG',
	    label: 'What\'s the Point?',
	    type: 'speech',
		desc: '<p>Placed first at the 2021 Area 62 & 64 International Speech Contest on Zoom.</p><p>Placed first at the 2021 Division F International Speech Contest.</p>Competed at the District 83 International Speech Contest, but did not place.</p>',
	    href: 'point',
		link: "https://youtu.be/57r37xeTq5c",
	    gallery: ["img/trophy/trophy12Large.jpg","img/trophy/trophy13Large.jpg"],
			details: {
			year: '2021',
			location: 'Zoom',
			contest: 'International Speech',
			other2: 'other2'
	    }
	},
	{
	    image: 'cfca/cfca.jpg',
	    label: 'CFCA 2018 - Chicago',
	    type: 'conference',
		desc: '<p>Communications Fraud Control Association (CFCA) 2018 Annual Meeting & Summer Educational Event in the Kimpton Monaco Hotel in Chicago, IL, USA. The title of my talk was "Managing a Succesful System Migration." This was my first time speaking at the CFCA.</p>',
	    href: 'cfca1',
	    gallery: ['cfca/20180625_170113.jpg','cfca/20180626_122932.jpg','cfca/20180626_011817.jpg','cfca/20180626_011842.jpg','cfca/20180626_122807.jpg','cfca/20180626_151308.jpg','cfca/IMG_0184.JPG','cfca/20180626_190439.jpg'],
			details: {
			date: 'June 26, 2018',
			location: 'Kimpton Monaco in Chicago, IL',
			agenda: '<a href="cfca/Chicago 2018 Agenda - Final SG2 6-20-2018.pdf">Download Agenda<i class="fa fa-thumb-tack"></i></a>',
			cfca: '<a href="https://www.cfca.org/">CFCA website<i class="lnr lnr-home"></i></a>'
	    }
	},
	{
	    image: 'cfca/47F7693E-AC09-4CF6-A628-A2B5BE57166B-519-0000002C1532B394.jpg',
	    label: 'CFCA 2019 - Tucson',
	    type: 'conference',
		desc: '<p>Powerful and sustained change requires constant communication, not only throughout the rollout but after the major elements of the plan are in place. The more kinds of communication employed, the more effective they are.</p><p>Communications Fraud Control Association (CFCA) Fall 2019 Educational Event in the El Conquistador Tucson Hilton Resort in Tucson, AZ, USA. The title of my talk was \"Reeling in Outsourced Fraud Mitigation Development.\" This was my second time speaking at the CFCA.</p>',
	    href: 'cfca2',
	    gallery: ['cfca/IMG_20191014_172247.jpg','cfca/IMG_20191015_0831219.jpg','cfca/frontRoomLarge.jpg','cfca/backRoomLarge.jpg','cfca/outsideLarge.jpg','cfca/chickenLarge.jpg','cfca/IMG_20191015_151101.jpg','cfca/IMG_20191015_141121.jpg'],
			details: {
			date: 'June 26, 2018',
			location: 'Kimpton Monaco in Chicago, IL',
			agenda: '<a href="cfca/Chicago 2018 Agenda - Final SG2 6-20-2018.pdf">Download Agenda<i class="fa fa-thumb-tack"></i></a>',
			cfca: '<a href="https://www.cfca.org/">CFCA website<i class="lnr lnr-home"></i></a>'
	    }
	},
	{
	    image: 'img/gallery/cfcaMain.png',
	    label: 'CFCA 2020 - Zoom',
	    type: 'conference',
		desc: '<p>In corporate America, we operate by the maxim: what gets measured, gets done. We use data to recognize trends, inform our goals, and drive our decision-making and actions.</p><p>Communications Fraud Control Association (CFCA) Fall 2020 Educational Event on Zoom. The title of my talk was \"Real Time Machine Learning and AI Operations.\" This was my third time speaking at the CFCA.</p><a href="docs/Speaker Certificate Paul Ireifej 27 October 20.pdf">Download Certificate<i class="fa fa-thumb-tack"></i></a><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vRK_tNmWEXUO7C1oJwm1I7E-X8TrCp1uIY-xAqPEYIes52ne3H2xJbZjlpfyFLzAg/embed?start=false&loop=false&delayms=3000" frameborder="0" width="640" height="389" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>',
		href: 'cfca3',
	    gallery: ['cfca/Screenshot_20201028-093200.png'],
			details: {
			date: 'October 27, 2020',
			location: 'Zoom',
			agenda: '<a href="docs/aagenda.pdf>Download Agenda<i class="fa fa-thumb-tack"></i></a>',
			cfca: '<a href="https://www.cfca.org/">CFCA website<i class="lnr lnr-home"></i></a>'
	    }
	},
	{
	    image: 'img/gallery/cfcaMain.png',
	    label: 'CFCA 2021 - Zoom',
	    type: 'conference',
		desc: '<p>Communications Fraud Control Association (CFCA) \'Spring into 2020ONE Education Event\' on Zoom. The title of my talk was \"Transformation as a Service.\" This was my fourth time speaking at the CFCA.</p><p>Let your customers be your parnters; let your vendors be your employees. What\'s necessary in this transformation more than anything else is courage and willingness to change</p><a href="docs/CFCA Speaker Certificate Paul Ireifej - AT&amp;T.pdf">Download Certificate<i class="fa fa-thumb-tack"></i></a><iframe src="https://docs.google.com/presentation/d/e/2PACX-1vQLKZQKIcP6-hrvXVsJNMd6vMY3b4qn0BUWDpOwxIA_G5Pm44RT1xehgQJjPNrjfQ/embed?start=false&loop=false&delayms=3000" frameborder="0" width="640" height="389" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>',
		href: 'cfca4',
	    gallery: ['cfca/Screenshot_20210421-163038.png','cfca/Screenshot_20210412-122217.png'],
			details: {
			date: 'April 19, 2021',
			location: 'Zoom',
			agenda: '<a href="docs/agenda.pdf">Download Agenda<i class="fa fa-thumb-tack"></i></a>',
			cfca: '<a href="https://www.cfca.org/">CFCA website<i class="lnr lnr-home"></i></a>'
	    }

	},
	{
	    image: 'img/hack/itcantwaitpng.png',
	    label: 'It Can\'t Wait',
	    type: 'hackathon',
		desc: '<p>AT&T Hackathon and Software Symposium is a company-wide coding competition. Given only 24 hours to design, develop and present an innovative solution to an AT&T business problem.</p>',
		href: 'hack1',
		link: 'https://pireifej.com/it-cant-wait.html',
		details: {
			date: 'May 15, 2019',
			location: 'AT&T Research in Middletown, NJ',
			other1: 'TBD',
			other2: 'TBD'
	    }
	},
	{
	    image: 'img/hack/fraudFinderMainPNG.PNG',
	    label: 'Fraud Finder',
	    type: 'hackathon',
		link: 'https://pireifej.com/fraud-finder.html',
		desc: '<p>AT&T Hackathon and Software Symposium is a company-wide coding competition. Given only 24 hours to design, develop and present an innovative solution to an AT&T business problem.</p>',
		href: 'hack2',
		gallery: ['img/hack/fraud-finder-first-place.png'],
		details: {
			date: 'May 5, 2019',
			location: 'AT&T Research in Middletown, NJ',
			other1: 'TBD',
			other2: 'TBD'
	    }
	},
	{
	    image: 'img/hack/polishedSpeaker.PNG',
	    label: 'Polished Speaker',
	    type: 'hackathon',
		link: 'https://pireifej.com/polished-speaker.html',
		desc: '<p>AT&T Hackathon and Software Symposium is a company-wide coding competition. Given only 24 hours to design, develop and present an innovative solution to an AT&T business problem.</p>',
		href: 'hack3',
		gallery: ['img/hack/fraud-finder-first-place.png'],
		details: {
			date: '2017',
			location: 'AT&T Research in Middletown, NJ',
			other1: 'TBD',
			other2: 'TBD'
	    }
	},
	{
	    image: 'img/hack/smsStalker2small.jpg',
	    label: 'SMS Stalker',
	    type: 'hackathon',
		link: 'https://pireifej.com/sms.html',
		desc: '<p>AT&T Hackathon and Software Symposium is a company-wide coding competition. Given only 24 hours to design, develop and present an innovative solution to an AT&T business problem.</p>',
		href: 'hack4',
		gallery: ['img/hack/smsStalker1.jpg'],
		details: {
			date: '2015',
			location: 'AT&T Research in Middletown, NJ',
			other1: 'TBD',
			other2: 'TBD'
	    }
	},
	{
	    image: 'img/gallery/network.jpg',
	    label: 'Routing Optimization Based On Historical Network Measures',
	    type: 'patent',
	    link: 'https://patents.justia.com/patent/20200112905',
		href: 'patent1',
		desc: '<p>The present disclosure relates generally to network communications, and relates more particularly to devices, computer-readable media, and methods for optimizing the routing of communications through networks based on historical network measures.</p>',
		details: {
			date: 'Oct 09, 2018',
			applicationNo: '20200112905',
			other1: 'other',
			other2: 'other'
	    }
	},
	{
	    image: 'img/gallery/interface.jpg',
	    label: 'Extending Legacy Scripting Languages with Graphical References',
	    type: 'patent',
	    link: 'https://patents.google.com/patent/US20170329620A1/en',
		href: 'patent2',
		desc: '<p>A graphical data type inference transparently transforms a legacy text-oriented command line interface (CLI) into a graphic-oriented or graphic-aware CLI (G-CLI).</p>',
		details: {
			date: 'Dec 08, 2010',
			applicationNo: 'US20120150939A1',
			other1: 'other',
			other2: 'other'
	    }
	},
    ];

    for (var i = 0; i < stuff.length; i++) {
		var href = stuff[i].href;
		var size = "style='height:339px; width: 338px'";
		if (stuff[i].type == "speech") {
			size = "style='height:200px; width: 338px'"
		}
		if (stuff[i].type == "conference") {
			size = "style='height:175px; width: 325px'"
		}
		
		fullElem += "<div class='single-item col-6 col-lg-4 " + stuff[i].type + "'><a class='portfolio-item' href='#" + href + "'><div class='portfolio-wrapper'><img " + size + " class='img-fluid' alt='Item' src='" + stuff[i].image + "'><div class='item-content'><h6 class='content-title'>" + stuff[i].label + "</h6><span class='content-more'>More Info</span></div></div></a></div>";
    }
    $("#ireifej").html(fullElem);

    fullElem = "";
    for (var i = 0; i < stuff.length; i++) {
	if (!stuff[i].href) continue;
	if (stuff[i].href.includes("http")) continue;
	var desc = stuff[i].desc;
	desc = (desc) ? desc : "Description coming soon!";
	var images = "<img class='img-fluid item-img' alt='Item' src='" + stuff[i].image + "'>";
	var gallery = stuff[i].gallery;
	if (gallery) {
	    for (var j = 0; j < gallery.length; j++) {
		images += "<img class='img-fluid item-img' alt='Item' src='" + gallery[j] + "'>";
	    }
	}
	var extraDetails = "";
	if (stuff[i].type == "projects" && stuff[i].details) {
	    var details = stuff[i].details;
		var date = details.date;
		var company = details.company;
		var award = (details["award"]) ? details.award : "N/A";
		var technology = details.technology;

	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+date + "</p></li><li class='list-inline-item single-info'><span>Company:</span><p>"+company + "</p></li><li class='list-inline-item single-info'><span>Award:</span><p>"+award+"</p></li><li class='list-inline-item single-info'><span>Technologies:</span><p>"+technology+"</p></li>";
	}
	if (stuff[i].type == "race" && stuff[i].details) {
	    var details = stuff[i].details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Distance:</span><p>"+details.distance + "</p></li><li class='list-inline-item single-info'><span>Location:</span><p>"+details.location+"</p></li><li class='list-inline-item single-info'><span>Time:</span><p>"+details.time+"</p></li>";
	}
	if (stuff[i].type == "speech" && stuff[i].details) {
	    var details = stuff[i].details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Year:</span><p>"+details.year + "</p></li><li class='list-inline-item single-info'><span>Location:</span><p>"+details.location + "</p></li><li class='list-inline-item single-info'><span>Contest:</span><p>"+details.contest+"</p></li><li class='list-inline-item single-info'><span>Other2:</span><p>"+details.other2+"</p></li>";
	}
	if (stuff[i].type == "conference" && stuff[i].details) {
	    var details = stuff[i].details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Location:</span><p>"+details.location + "</p></li><li class='list-inline-item single-info'><span>Agenda:</span><p>"+details.agenda+"</p></li><li class='list-inline-item single-info'><span>CFCA:</span><p>"+details.cfca+"</p></li>";
	}
	if (stuff[i].type == "hackathon" && stuff[i].details) {
	    var details = stuff[i].details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Location:</span><p>"+details.location + "</p></li><li class='list-inline-item single-info'><span>Other1:</span><p>"+details.other1+"</p></li><li class='list-inline-item single-info'><span>Other2:</span><p>"+details.other2+"</p></li>";
	}
	if (stuff[i].type == "patent" && stuff[i].details) {
	    var details = stuff[i].details;
	    extraDetails = "<li class='list-inline-item single-info'><span>Date:</span><p>"+details.date + "</p></li><li class='list-inline-item single-info'><span>Application Number:</span><p>"+details.applicationNo + "</p></li><li class='list-inline-item single-info'><span>Other1:</span><p>"+details.other1+"</p></li><li class='list-inline-item single-info'><span>Other2:</span><p>"+details.other2+"</p></li>";
	}

	var buttonText = "Visit Project";
	if (stuff[i].type == "race") buttonText = "Visit Results";
	if (stuff[i].type == "speech") buttonText = "Watch Speech";
	if (stuff[i].type == "conference") buttonText = "Visit Presentation";
	if (stuff[i].type == "patent") buttonText = "View Patent";

	var visitProject = (stuff[i].link) ? "<a class='btn content-btn button-main button-scheme' href='" + stuff[i].link + "' role='button'>" + buttonText + "</a>" : "";
	
	var nextElem = "<!-- Single lightbox--><div class='lightbox-wrapper' id='" + stuff[i].href + "'><div class='f-basis-100'><div class='lightbox-close' data-modal-close><span class='close-btn'><span class='btn-line'></span></span></div></div><div class='container'><div class='row'><div class='col-12 col-lg-5'><div class='lightbox-gallery owl-carousel owl-theme'>" + images + "</div></div><div class='col-12 col-lg-7'><div class='lightbox-content'><h3 class='content-title'>" + stuff[i].label + "</h3><div class='content-description'>"+desc+"</div><ul class='list-inline content-info'>" + extraDetails + "</ul>" + visitProject + "</div></div></div></div></div>";
	fullElem += nextElem;
    }
    $("#ireifej2").html(fullElem);

    var blogs = [
	{
	    date: 'June 26, 2018',
	    title: 'CFCA in Chicago',
	    href: 'https://pireifej.com/chicago.html',
	    heading: 'My trip to Chicago, IL to present at the 2018 CFCA.',
	    tag1: 'System',
	    tag2: 'Migration',
	    image: 'img/gallery/cfcaMain.png'
	},
	{
	    date: 'June 26, 2018',
	    title: 'CFCA in Tucson',
	    href: 'https://pireifej.com/tucson.html',
	    heading: 'My trip to Tucson, AZ to present at the 2019 CFCA.',
	    tag1: 'Outsourcing',
	    tag2: 'Migration',
	    image: 'img/gallery/cfcaMain.png'
	},
	{
	    date: '2015',
	    title: 'Freehold Excursion',
	    href: 'https://pireifej.com/contest3.html',
	    heading: 'Story documenting my visit to the contest venue the day before to scope it out.',
	    tag1: 'Freehold',
	    tag2: 'Hospital',
	    image: 'img/trophy/trophy2Large.jpg'
	},
	{
	    date: '2015',
	    title: 'Brutually Honest',
	    href: 'https://pireifej.com/contest4.html',
	    heading: 'A brutually honest evaluation from a trusted audience member about my performance at this contest.',
	    tag1: 'Judges',
	    tag2: 'Comedy',
	    image: 'img/trophy/trophy3Large.jpg'
	},
	{
	    date: '2016',
	    title: 'The Most Important Day of my Life',
	    href: 'https://pireifej.com/contest7.html',
	    heading: 'One of the most important days of my life. Finally got to the District stage in the Humorous Contest',
	    tag1: 'Humor',
	    tag2: 'Children',
	    image: 'img/contests/DSC_0350.jpg'
	},
	{
	    date: '2018',
	    title: 'My Most Painful Contest Yet',
	    href: 'https://pireifej.com/contest8.html',
	    heading: 'A long and challenging contest.',
	    tag1: 'Painful',
	    tag2: 'Callback',
	    image: 'img/contests/FB_IMG_1539660566388.jpg'
	},
	{
	    date: '2019',
	    title: 'The Contest Heard Around the World',
	    href: 'https://pireifej.com/contest9.html',
	    heading: 'Iʼm still recovering from a whopping 4 1/2 hour long contest.',
	    tag1: 'Longest',
	    tag2: 'Contests',
	    image: 'img/trophy/trophy7Large.jpg',
	},
	{
	    date: '2019',
	    title: 'It\'s the thought that counts',
	    href: 'https://pireifej.com/contest10.html',
	    heading: 'My harrowing journey to place first at the 2019 Division F Evaluation Contest.',
	    tag1: 'Evaluation',
	    tag2: 'Division',
	    image: 'img/contests/divcontest.jpg'
	},
	{
	    date: 'May 5, 2019',
	    title: 'Aced it!',
	    href: 'https://pireifej.com/contest13.html',
	    heading: 'Placing first at the District 83 Evaluation Contest.',
	    tag1: 'Evaluation',
	    tag2: 'Ace It',
	    image: 'img/contests/disteval1.jpg'
	},
	{
	    date: 'May 5, 2019',
	    title: 'The Easiest Area Contest Ever',
	    href: 'https://pireifej.com/contest11.html',
	    heading: 'Tonight was a good night. A good and ... easy night.',
	    tag1: 'Easy',
	    tag2: 'Tall Tales',
	    image: 'img/contests/IMG_20191002_194504.jpg'
	},
	{
	    date: 'Nov 14, 2019',
	    title: 'Much Ado About Nothing',
	    href: 'https://pireifej.com/contest12.html',
	    heading: '',
	    tag1: 'Nervous',
	    tag2: 'Charismatic',
	    image: 'img/contests/IMG_0078%20(1).JPG'
	},
	{
	    date: 'TBD',
	    title: 'Coming Soon!',
	    href: '',
	    heading: 'TBD',
	    tag1: 'N/A',
	    tag2: 'N/A',
	    image: 'img/blog/cat-post/cat-post-2.jpg'
	}
    ];

    var blogPosts = "";
    for (var i = 0; i < blogs.length; i++) {
	var nextBlogPost = "<!-- Single post--><div class='col-12 col-sm-8 col-lg-4'><div class='card single-post'><a class='post-img' href='" + blogs[i].href + "'><img style='height: 218px; hwidth: 302px' class='card-img-top' src='" + blogs[i].image + "' alt='Blog post'><span class='content-date'>" + blogs[i].date + "</span></a><div class='card-body post-content'><a href='#0'><h5 class='card-title content-title'>" + blogs[i].title + "</h5><p class='card-text content-description' style='color: #333;'>" + blogs[i].heading + "</p><div class='content-tags'><span class='tags-title'>Tags:</span><ul class='list-unstyled list-inline tags-list'><li class='list-inline-item'><a href='#0'>" + blogs[i].tag1 + "</a></li><li class='list-inline-item'><a href='#0'>" + blogs[i].tag2 + "</a></li></ul></div></div></div></div>";
	blogPosts += nextBlogPost;
    }

    var finalBlogPost = "<div class='row justify-content-center'>" + blogPosts + "</div>";
    $("#ireifej-blog").html(finalBlogPost);
});
