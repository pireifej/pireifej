$( document ).ready(function() {
    window.god = window.god || {};
    var skillsHtml = `                            <!-- Single Item -->
                            <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="nav-id-2">
                                <div class="row align-center">
                                    <div class="col-lg-12">
                                        <ul class="skill-table">`;

    var skillItems = [
	{
	    icon: "fa-laravel",
	    label: "AngularJS",
	    percent: "90"
	},
	{
	    icon: "fa-react",
	    label: "ReactJS",
	    percent: "75"
	},
	{
	    icon: "fa-html5",
	    label: "jQuery",
	    percent: "95"
	},
	{
	    icon: "fa-laravel",
	    label: "Express.js",
	    percent: "80"
	},
	{
	    icon: "fa-react",
	    label: "JavaScript",
	    percent: "95"
	},
	{
	    icon: "fa-html5",
	    label: "MongoDB",
	    percent: "90"
	},
	{
	    icon: "fa-laravel",
	    label: "SQL",
	    percent: "90"
	}
    ];

    for (var i = 0; i < skillItems.length; i++) {
	skillsHtml += `
                                            <li>
                                                <div class="row align-center">
                                                    <div class="col-lg-2">
                                                        <div class="icon">
                                                            <i class="fab ${skillItems[i].icon}"></i>
                                                        </div>
                                                    </div>
                                                    <div class="col-lg-5">
                                                        <h4>${skillItems[i].label}</h4>
                                                    </div>
                                                    <div class="col-lg-5">
                                                        <div class="progress-box">
                                                            <h5>${skillItems[i].percent}%</h5>
                                                            <div class="progress">
                                                                <div class="progress-bar" role="progressbar" data-width="${skillItems[i].percent}"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>`;
    }

    skillsHtml += `
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <!-- End Single Item -->`;

    $("#tab2").replaceWith(skillsHtml);
});
