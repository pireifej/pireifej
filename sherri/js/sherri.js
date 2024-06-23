$( document ).ready(function() {
    window.god = window.god || {};

    // global variables
    var currentlyOpenBlogArticleId = "";

    window.afterGetBlogArticle = function(response) {
	console.log(response);
    }

    window.afterCreateBlogArticle = function(response) {
	console.log(response);
    }

    window.afterGetAllBlogArticles = function(response) {
	for (var i = 0; i < response.result.length; i++) {
	    var article = response.result[i];
	    $("#blog-articles").append("<option value=" + article.id + ">" + article.title + "</option>");
	}

	currentlyOpenBlogArticleId = response.result[0].id;
	$("#blog-articles").val(currentlyOpenBlogArticleId);
	
	god.query("getBlogArticle", "afterGetBlogArticle", { id: currentlyOpenBlogArticleId }, true, true);
    }

    window.afterGetBlogArticle = function(response) {
	var content = response.result.content;
	var title = response.result.title;
	$("#singleLineInput").val(title);
	$("#largeTextInput").jqteVal(content);
    }

    god.query("getAllBlogArticles", "afterGetAllBlogArticles", { }, true, true);

    $("#blog-articles").change(function(){
	var selectedValue = $(this).val();
	currentlyOpenBlogArticleId = selectedValue;
	god.query("getBlogArticle", "afterGetBlogArticle", {id:selectedValue}, true, true);
    });

    $("#newButton").click(function() {
	currentlyOpenBlogArticleId = "";
	$("#singleLineInput").val("");
	$("#largeTextInput").jqteVal("");
	$("#blog-articles").val("none");
    });

    $("#insertButton").click(function() {
	var title = $("#singleLineInput").val();
	var content = $("#largeTextInput").val();

	var text = $("#largeTextInput").text();
	var plainText = $('#largeTextInput').closest('.jqte').find('.jqte_editor').text().trim();
	var wordsArray = plainText.split(/\s+/); // Split text into words using regex
	var truncatedText = wordsArray.slice(0, 30).join(' ');

	if (currentlyOpenBlogArticleId) {
	    god.query("editBlogArticle", "afterEditBlogArticle", { "title": title, "content": content, "id": currentlyOpenBlogArticleId, "preview": truncatedText }, true, true);
	} else {
	    god.query("createBlogArticle", "afterCreateBlogArticle", { "title": title, "content": content , "preview": truncatedText }, true, true);
	}
    });
});
