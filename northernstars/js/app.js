function setText(id, text) {
    document.getElementById(id).textContent = text;
}

var websiteText = {
    // section one
    "heading-one": "Enhance Your Speaking with Expert Evaluations",
    "heading-desc-one": "Receive precise, actionable feedback to sharpen your speaking skills.",
    "heading-two": "Compete and Succeed at District Contests",
    "heading-desc-two": "Join a club where members regularly excel in district-level competitions.",
    "heading-three": "Step into Distinguished Leadership Roles",
    "heading-desc-three": "Develop your leadership potential through active roles within the district.",
    // section two
    "major-heading": "Join Northern Stars Advanced Toastmasters",
    "major-heading-sub": "A club known for top evaluations, contests, and leadership.",
    "major-heading-sub-p": "Are you looking to improve?",
    "major-point-one": "Do you want better feedback on your speeches?",
    "major-point-two": "Do you want to compete and win?",
    "major-point-three": "Do you want to develop leadership skills and take on significant district roles?",
    "major-point-four": "Do you want to be part of a high-achieving club?",
    // section three
    "minor-heading-one": "Learn from Top Achieving Members",
    "minor-heading-two": "Our accomplished members are ready to mentor and guide you to success.",
    // section four
    "improve-desc": "Have fun while doing it!"
};

for (var key in websiteText) {
    console.log(key, websiteText[key]);
    setText(key, websiteText[key]);
}
