$( document ).ready(function() {
    window.god = window.god || {};

    window.afterGetBlogArticle = function(response) {
	console.log(response);
    }

    window.afterCreateBlogArticle = function(response) {
	console.log(response);
    }

    god.query("getBlogArticle", "afterGetBlogArticle", { "id": 2 }, true, true);

    $("#insertButton").click(function() {
	var title = $("#singleLineInput").val();
	var content = $("#largeTextInput").val();

	console.log(title, content);
	
	god.query("createBlogArticle", "afterCreateBlogArticle", { "title": title, "content": content }, true, true);
    });
});
