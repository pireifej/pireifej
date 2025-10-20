$( document ).ready(function() {
    window.god = window.god || {};
    var skillsHtml = `                            <!-- Single Item -->
                            <div class="tab-pane fade" id="tab2" role="tabpanel" aria-labelledby="nav-id-2">
                                <div class="row align-center">
                                    <div class="col-lg-12">
                                        <ul class="skill-table">`;

    var skillItems = [
        {
            icon: "fa-robot",
            label: "Artificial Intelligence",
            percent: "90"
        },
        {
            icon: "fa-hand-holding-heart",
            label: "Week of Respect",
            percent: "90"
        },
        {
            icon: "fa-microphone",
            label: "Public Speaking & Communication",
            percent: "95"
        },
        {
            icon: "fa-book-open",
            label: "Story Telling",
            percent: "85"
        },
        {
            icon: "fa-theater-masks",
            label: "Improv",
            percent: "85"
        },
        {
            icon: "fa-users",
            label: "Toastmasters Guest Speaker",
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
