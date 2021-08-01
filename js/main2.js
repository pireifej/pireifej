$( document ).ready(function() {
    var fullElem = "";
    var stuff = [
	{
	    image: 'img/gallery/portfolio-12.jpg',
	    label: 'aiOpX',
	    type: 'projects',
	    href: 'aiopx',
	    desc: '<p>aiOpX (or Artifical Intelligence Operations X - any) is a real-time fraud monitoring application. It performs a health check on internal fraud systems and tracks errors, down-time, and generates metrics based on log files.</p><p>There are dynamic rules that include a mitigation to when a rule is triggered. The mitigation includes responses such as sending an email to a preset distribution list (business hours vs. off-hours), and paging a cell phone.</p><p><b>Developed key front-end capabilities: severity cases landing page, raw JSON recorde view, application field type with virtual field support.</b></p>'
	},
	{
	    image: 'img/gallery/portfolio-11.jpg',
	    label: 'Crossroads',
	    type: 'projects',
	    href: 'xrds',
	    desc: '<p>CrossRoads (XRDs) provides a single interface to search for customer information across multiple AT&T data sources. It has the capability to find and verify customer contact information by searching on the address, name, or telephone number of the AT&T customer. Redesigned the four main query lookup pages: Address, Telephone Number, Name, Account/SPI.</p><p><b>Redesigned the GUI using latest technology (AngularJS, JavaScript, HTML, CSS, MongoDB).</b></p><p>Merged capabilities of another application (Global Fraud Management System) into XRDs to do a customer search and finding affiliated accounts with given customer phone number, SSN, email.</p>'
	},
	{
	    image: 'img/gallery/portfolio-10.jpg',
	    label: 'Watch Dog',
	    type: 'projects',
	    href: 'watchdog',
	    desc: '<p>Partner with Chief Security Office (CSO) and Global Fraud Management Organization (GFMO) to provide analytics that help identify questionable and/or malicious behavior by internal employees accessing customer data. Uses \"watermarking\" which tracks access to SPI and CPNI data that AT&T is a steward of.</p><p><b>Productionized application that was originally built on a development environment using offshore resources.</b> Brought stability, production support, alerting and well defined system flow & architecture. Automated daily data ingestion with mech IDs. <b>Work so highly regarded that is resulted in a professional talk at the 2019 Communications Fraud Control Association (CFCA).</b></p><p>UI (AngularJS, Tomcat), UI backend (Java Springboot Restful webservices), Datalake service (webservices layer for Hbase), Data ingestion & case creation (Java), Cron jobs & Scheduler (daily/weekly housekeeping), Data Stores (MongoDB for low latency access, and Hbase for long-term big data storage using Hadoop File System HDFS).</p>'
	},
	{
	    image: 'img/gallery/portfolio-09.jpg',
	    label: 'FASTR',
	    type: 'projects',
	    href: 'fastr',
	    desc: '<p>Fraud Analysis and Service Order Tracking and Reporting (FASTR) tracks correlations between personnel that sell Internet service and Direct TV products and abnormalities or irregularities in the order and/or billing processes. Works by applying Potential Fraud Group (PFG) rules that describe a potential fraud pattern. It looks for PFG violations in the billing data and generates alerts.</p><p> <b>Leading the effort to redesign legacy FASTR application using JavaScript (AngularJS), HTML, CSS with Java and MongoDB for data access.</b><p>The new design is a fraud case management system that allows the users to look through transaction data to sift out the benign fraud alert from the serious ones. Implemented several query form pages to search through data, implementation a novel configuration-based page generation solution.</p>'
	},
	{
	    image: 'img/gallery/portfolio-07.PNG',
	    label: 'Project Frugality',
	    type: 'projects',
	    href: 'frugality',
	    desc: '<p>Project Frugality looks at how cell site construction is conducted in 25 initiatives and determines if the implementation is meeting the expectations of Big Data C&E leadership, who gathers requirements and assumptions surrounding cell site construction. Completed deliverables given very ambitious deadlines. Led development efforts and data ingestion work flow process. Led discussions with data ingest developers and product owners. <b> Overall savings of ~ $1B just for 2016.</b></p>'
	},
	{
	    image: 'img/gallery/portfolio-06.jpg',
	    label: 'Electronic Law Enforcement Activity Tracker',
	    type: 'projects',
	    href: 'eleat',
	    desc: '<p>Augmenting the Electronic Law Enforcement Activity Tracker (ELEAT) application with surveillance intercept automation. Developed 4 new interfaces in Perl and a web interface for direct node access. Took BVoIP development over from previous developer after his abrupt leave and was still able to deliver top quality code ahead of expected completion deadline.</p><p><b> Undergone several initiates to improve ELEAT code infrastructure:</b></p><p>Effort to re-design dated ELEAT web interface using HTML, JavaScript and jQuery for faster response time, enhanced usability and ease-of-use. jVectorMap API was used to generate an interactive SVG map based on node longitude/latitude information. Markers on map are updated in real-time using Ajax.</p>'
	},
	{
	    image: 'img/gallery/portfolio-08.PNG',
	    label: 'Parent Locator Service (PLS)',
	    type: 'projects',
	    href: 'pls',
	    desc: 'Parent Locator Service (PLS) allows state child support services to request information about \"delinquent\" parents. Led technical discussions with various state agencies to integrate their systems onto PLS. Worked against aggressive schedule and continually met milestones and deliverables. Coordinated activities among state clients, AT&T Subpoena Center, production support and firewall team to on-board several new state agencies.</p><p><b>Drastically reduced agency onboarding time from 6 months to 1 week</b> by leveraging Voltage SecureMail; this displaces the need for complex SSH/firewall rule configuration and eliminates the need for state client to set up a dedicated server.</p>'
	},
	{
	    image: 'img/gallery/portfolio-05.jpg',
	    label: 'Consolidated Compliance System',
	    type: 'projects',
	    href: 'css',
	    desc: '<p>Led the client-side development of a release for the Consolidated Compliance System (CCS). Worked closely with project management, technical team lead and clients to architect business requirements and engineer a process work flow. Also led the development and deployment of a subsequent CCS release.</p><p><b>This deployment included a completely new technology base (from a Java Web Start framework to a purely web-based solution using HTML and PHP)</b> and re-designed database schema. Led weekly status meetings with developers to discuss current requirement gaps and technical hurdles. Trained new developers and testers. Presented new interface and functionality to end users in the National Compliance Center (NCC) via technical demos.</p>'
	},
	{
	    image: 'img/gallery/portfolio-04.jpg',
	    label: 'Mobility Community of Interest',
	    type: 'projects',
	    href: 'mcoi',
	    desc: '<p>Development of Mobility Community of Interest (MCOI) Visualization, an online application that helps fraud analysts identify telephone numbers most often called by suspected fraudsters.</p><p><b>Utilizes internal AT&T Research technology to generate an infograph representing the suspect\'s COI.</b></p><p>Uses Perl CGI and jQuery for data presentation and graphical zooming.</p>'
	},
	{
	    image: 'img/gallery/portfolio-03.jpg',
	    label: 'Integrated Software Environment',
	    type: 'projects',
	    href: 'ise',
	    desc: '<p>Collaborated on the Integrated Software Environment (ISE), an online alert management application that graphically represents remote file system architecture. Used YUI 2.0 framework for GUI development, HTML5 for drag-and-drop capabilities and WebKit CSS for graphical transformation. Incorporated Oracle\'s Berkley DB XML for alert database storage.</p>'
	},
	{
	    image: 'img/gallery/portfolio-02.jpg',
	    label: 'Software Engineer - AMD',
	    type: 'projects',
	    href: 'amd',
	    desc: '<p>Developed the Automated Characterization Environment (ACE), an application that automates the testing processes of hardware. Development of ACE was done using Visual Studio 2008 with C#. Designed the data access layer, including stored procedures, through SQL Enterprise Manager.</p><p><b>Facilitated joint effort between teams to develop a common API to access low-level code libraries.</b><p>Also contributed to the development of Net Tool, an application that performs user-defined rule checks on a motherboard. Significantly decreased bugs by developing auto testing functionality to aid developers.</p>'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Student Researcher',
	    type: 'projects',
	    href: 'reu',
	    desc: '<p>Developed C++ code based on "Zones method" that incorporates shortest-path algorithms to determine the best route for exploration through a graphic representation of system complexity. Designed novel data structure and operations in C++ to represent the difference bound matrix.</p>'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Internship at the White House',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'How I Met My Wife',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'The Greatest Father in the World',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'I am P-P-Paul',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Evaluation Contest',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Improvise and Don\'t Apologize',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Don\'t Stop Speaking',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'What\'s the Point?',
	    type: 'speech'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'CFCA 2018 - Chicago',
	    type: 'conference'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'CFCA 2019 - Tucson',
	    type: 'conference'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'CFCA 2020 - Zoom',
	    type: 'conference'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'CFCA 2021 - Zoom',
	    type: 'conference'
	},
	{
	    image: 'img/gallery/network.jpg',
	    label: 'Routing Optimization Based On Historical Network Measures',
	    type: 'patent',
	    href: 'https://patents.justia.com/patent/20200112905'
	},
	{
	    image: 'img/gallery/interface.jpg',
	    label: 'Extending Legacy Scripting Languages with Graphical References',
	    type: 'patent',
	    href: 'https://patents.google.com/patent/US20170329620A1/en'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'It Can\'t Wait',
	    type: 'hackathon'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Fraud Finder',
	    type: 'hackathon'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Polished Speaker',
	    type: 'hackathon'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: '2016',
	    type: 'hackathon'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'SMS Stalker',
	    type: 'hackathon'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: '2020 Walt Disney World® Maratho',
	    type: 'race'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: '2019 Rocky Run',
	    type: 'race'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Independence Rhode Race Half Marathon',
	    type: 'race'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Rhinebeck Hudson Valley Half Marathon',
	    type: 'race'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Philadelphia Half Marathon',
	    type: 'race'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Run from Winter 10K',
	    type: 'race'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Hustle for the Puzzle 5k Road Race for Autism',
	    type: 'race'
	},
	{
	    image: 'img/gallery/portfolio-01.jpg',
	    label: 'Verizon Wireless Corporate Classic',
	    type: 'race'
	}
    ];
    for (var i = 0; i < stuff.length; i++) {
	var href = stuff[i].href;
	var finalHref = "";
	if (href) {
	    finalHref = (href.includes("http")) ? href : "#" + href;
	    finalHref = "href='" + finalHref + "'";
	}
	fullElem += "<div class='single-item col-6 col-lg-4 " + stuff[i].type + "'><a class='portfolio-item' " + finalHref + "><div class='portfolio-wrapper'><img class='img-fluid' alt='Item' src='" + stuff[i].image + "'><div class='item-content'><h6 class='content-title'>" + stuff[i].label + "</h6><span class='content-more'>More Info</span></div></div></a></div>";
    }
    $("#ireifej").html(fullElem);

    fullElem = "";
    for (var i = 0; i < stuff.length; i++) {
	var desc = stuff[i].desc;
	desc = (desc) ? desc : "Description coming soon!";
	fullElem += "<!-- Single lightbox--><div class='lightbox-wrapper' id='" + stuff[i].href + "'><div class='f-basis-100'><div class='lightbox-close' data-modal-close><span class='close-btn'><span class='btn-line'></span></span></div></div><div class='container'><div class='row'><div class='col-12 col-lg-5'><div class='lightbox-gallery owl-carousel owl-theme'><img class='img-fluid item-img' alt='Item' src='img/item-1.jpg'><img class='img-fluid item-img' alt='Item' src='img/item-2.jpg'><img class='img-fluid item-img' alt='Item' src='img/item-3.jpg'><img class='img-fluid item-img' alt='Item' src='img/item-4.jpg'><img class='img-fluid item-img' alt='Item' src='img/item-5.jpg'><img class='img-fluid item-img' alt='Item' src='img/item-6.jpg'></div></div><div class='col-12 col-lg-7'><div class='lightbox-content'><h3 class='content-title'>" + stuff[i].label + "</h3><div class='content-description'>"+desc+"</div><ul class='list-inline content-info'><li class='list-inline-item single-info'><span>Client:</span><p>Envato</p></li><li class='list-inline-item single-info'><span>Categories:</span><p><a href='#0'>Branding</a>, <a href='#0'>Web Design</a></p></li><li class='list-inline-item single-info'><span>Date:</span><p>12 May, 2019</p></li><li class='list-inline-item single-info'><span>Technologies:</span><p>HTML5, SCSS, JS</p></li></ul><a class='btn content-btn button-main button-scheme' href='#0' role='button'>Visit Project</a></div></div></div></div></div>";
    }
    $("#ireifej2").html(fullElem);
});
