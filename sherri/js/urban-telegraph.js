$( document ).ready(function() {
    window.god = window.god || {};

    window.afterGetAllBlogArticles = function(response) {
        var blogElements = "";
        for (var i = 0; i < response.result.length; i++) {
            var article = response.result[i];
            var datetime = god.getLocalDateTime(article.timestamp);
            var image = article.image;
            
            var dataColumnLast = (i%2==0) ? `data-column="last"` : "";

            var blogElement = `<!-- Begin each blog post -->
<div id="post-45" class="post-45 post type-post status-publish format-standard has-post-thumbnail hentry category-art category-movie category-travel tag-city tag-travel" ${dataColumnLast}>

        <div class="post_wrapper">
            
            <div class="post_content_wrapper">
            
                <div class="post_header">
                                                        
                                        <div class="post_img static">
                                            <a href="article.html?id=${article.id}">
                                                <img src="${image}" alt="" class="" style="width:700px !important;height:300px !important;"/>
                                            </a>
                                        </div>
                                                        <br class="clear"/>
                                
                                <div class="post_header_title">
                                <h5><a href="article.html?id=${article.id}" title="${article.title}">${article.title}</a></h5>
                                <div class="post_detail post_date">
                                        <span class="post_info_date">
                                                <span>
                                                        ${datetime}
                                                </span>
                                        </span>
                                        </div>
                           </div>
                              
                            <p><p>${article.preview} …</p></p>                      <div class="post_button_wrapper">
                                <a class="readmore" href="article.html?id=${article.id}">Read More</a>
                            </div>
                            
                            <div class="post_info_comment">
                                        <a href="https://themes.themegoods.com/letsblog/demo/big-city-light/#respond">No Comment</a>
                                </div>
                        </div>
                        
            </div>
            
        </div>

</div>
            <!-- End each blog post -->`;
            blogElements += blogElement;
        }
        $("#ireifej").replaceWith(blogElements);
    }

    god.query("getAllBlogArticles", "afterGetAllBlogArticles", { }, true, true);
})
