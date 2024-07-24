$( document ).ready(function() {
    window.god = window.god || {};

    var articleId = $.urlParam("id");
    console.log(articleId);

    window.afterGetBlogArticle = function(response) {
	var content = response.result.content;
	var title = response.result.title;
	var datetime = god.getLocalDateTime(response.result.date);
	var image = response.result.image;

	$("#article-image-1").attr("style", "background-image:url(" + image + ");");
	$("#article-image-2").attr("style", "background-image:url(" + image + ");opacity: 0.695;");
	
	$("#article-date").html(datetime);
	$("#article-title").html(title);
	$("#article-blog-post").html(content);
    }

    god.query("getBlogArticle", "afterGetBlogArticle", { id: articleId }, true, true);
});
