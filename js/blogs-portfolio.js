$(document).ready(function() {
    var blogData = [
        {
            id: 'chicago',
            title: 'Managing a Successful System Migration',
            date: 'June 26, 2018',
            image: 'cfca/20180626_122932.jpg',
            tag: 'CFCA',
            category: 'cfca',
            excerpt: 'My experience speaking at the CFCA conference in Chicago about managing a successful fraud system migration.'
        },
        {
            id: 'tucson',
            title: 'CFCA in Tucson',
            date: 'October 15, 2019',
            image: 'cfca/IMG_20191015_151101.jpg',
            tag: 'CFCA',
            category: 'cfca',
            excerpt: 'Another memorable trip to the CFCA conference, this time in sunny Tucson, Arizona.'
        },
        {
            id: 'contest9',
            title: 'The Contest Heard Around the World',
            date: 'March 2019',
            image: 'img/trophy/trophy7Large.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'The story of one of my most memorable Toastmasters contest experiences.'
        },
        {
            id: 'contest10',
            title: "It's the thought that counts",
            date: 'March 2019',
            image: 'img/contests/divcontest.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'Sometimes winning isn\'t everything - it\'s about the journey and the effort you put in.'
        },
        {
            id: 'contest8',
            title: 'My Most Painful Contest Yet',
            date: 'Oct 15, 2018',
            image: 'img/contests/FB_IMG_1539660566388.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'A candid look at a contest that didn\'t go as planned, and what I learned from it.'
        },
        {
            id: 'contest11',
            title: 'The Easiest Area Contest Ever',
            date: 'May 5, 2019',
            image: 'img/contests/IMG_20191002_194504.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'When preparation meets opportunity, sometimes contests feel effortless.'
        },
        {
            id: 'contest12',
            title: 'Much Ado About Nothing',
            date: 'Nov 14, 2019',
            image: 'img/contests/IMG_0078%20(1).JPG',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'Reflections on a contest experience that was more about the experience than the outcome.'
        },
        {
            id: 'contest7',
            title: 'Ranting',
            date: 'Nov 5, 2016',
            image: 'img/contests/DSC_0350.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'Sometimes you just need to get things off your chest - a raw and honest reflection.'
        },
        {
            id: 'contest4',
            title: 'Brutally Honest',
            date: 'Nov 5, 2016',
            image: 'img/trophy/trophy3Large.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'The power of honesty in public speaking and how it shaped my contest speech.'
        },
        {
            id: 'contest3',
            title: 'Before the 2015 Division F Tall Tales',
            date: 'Nov 5, 2016',
            image: 'img/trophy/trophy2Large.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'The preparation and anticipation leading up to a major Tall Tales contest.'
        },
        {
            id: 'contest13',
            title: 'NOT a long blog',
            date: 'May 5, 2019',
            image: 'img/contests/disteval1.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'A quick read about a contest experience - short but meaningful.'
        },
        {
            id: 'talltales',
            title: 'What is Tall Tales?',
            date: 'Sept 5, 2021',
            image: 'img/cat-post-2.jpg',
            tag: 'Toastmasters',
            category: 'toastmasters',
            excerpt: 'An introduction to the Tall Tales contest format in Toastmasters and why it\'s so much fun.'
        }
    ];

    function renderBlogCards(filter) {
        var grid = $('#blog-grid');
        grid.empty();

        var filteredData = filter === 'all' ? blogData : blogData.filter(function(item) {
            return item.category === filter;
        });

        if (filteredData.length === 0) {
            grid.html('<div class="no-items">No blog posts found for this category.</div>');
            return;
        }

        filteredData.forEach(function(blog) {
            var card = $('<a href="blog.html?id=' + blog.id + '" class="portfolio-card" data-category="' + blog.category + '">' +
                '<div class="card-image">' +
                    '<img src="' + blog.image + '" alt="' + blog.title + '">' +
                    '<div class="card-overlay">' +
                        '<span class="view-btn"><i class="fas fa-arrow-right"></i> Read More</span>' +
                    '</div>' +
                '</div>' +
                '<div class="card-content">' +
                    '<span class="card-tag">' + blog.tag + '</span>' +
                    '<h3 class="card-title">' + blog.title + '</h3>' +
                    '<p class="card-excerpt">' + blog.excerpt + '</p>' +
                    '<div class="card-meta">' +
                        '<span><i class="fas fa-calendar-alt"></i> ' + blog.date + '</span>' +
                    '</div>' +
                '</div>' +
            '</a>');
            grid.append(card);
        });
    }

    renderBlogCards('all');

    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).data('filter');
        renderBlogCards(filter);
    });
});
