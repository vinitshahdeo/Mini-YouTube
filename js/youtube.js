/**
 * @author Vinit Shahdeo <vinitshahdeo@gmail.com>
 */

const API_KEY = "XXXXXXXXXXXXXX"; // Replace it with  your YouTube API Key

var arr = [];

function search() {

    arr = [];
    // loader 
    $("#results").html("<center><i class=\"fas fa-spinner fa-spin loader\"></i></center>");

    var text = document.getElementById('search').value; // retrieving search term

    $.ajax({
        url: "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + text + "&key=" + API_KEY + "",
        method: "GET",
        success: function(data) {
            console.log(data); // Returned JSON Object
            var vidId = [];
            var arrid = [];
            data.items.forEach(function(ele) {
                // console.log(ele["id"]["videoId"]);
                vidId.push({
                    id: ele["id"]["videoId"],
                    title: ele["snippet"]["title"],
                    description: ele["snippet"]["description"],
                    date: ele["snippet"]["publishedAt"]
                });
                arrid.push(ele["id"]["videoId"]);
            });

            $.ajax({
                url: "https://www.googleapis.com/youtube/v3/videos?key=" + API_KEY + "&part=statistics&id=" + arrid.join(','),
                method: "GET",
                success: function(d) {
                    console.log(d); // JSON of Video statistics
                    for (var i = 0; i < vidId.length; i++) {
                        arr.push({
                            vidLink: arrid[i],
                            title: vidId[i].title,
                            description: vidId[i].description,
                            date: vidId[i].date,
                            views: d["items"][i].statistics.viewCount,
                            likes: d["items"][i].statistics.likeCount,
                            comments: d["items"][i].statistics.commentCount
                        });
                        sort(arr);
                    }
                },
                error: function(xhr, status, error) {
                    if (err)
                        console.log(err);
                }
            });
        },
        error: function(xhr, status, error) {
            console.log(error);
        }
    })
}

// function to sort the videos based on selected parameter
function sort(video) {
    var type = document.getElementById('type').value;
    if (type == 'likes')
        video.sort(function(a, b) {
            return parseInt(a.likes) < parseInt(b.likes);
        });
    else if (type == 'views')
        video.sort(function(a, b) {
            return parseInt(a.views) < parseInt(b.views);
        });
    else if (type == 'name')
        video.sort(function(a, b) {
            return ((a.title).toLowerCase()) > ((b.title).toLowerCase());
        });
    else if (type == 'comments')
        video.sort(function(a, b) {
            return parseInt(a.comments) < parseInt(b.comments);
        });
    else
        video.sort(function(a, b) {
            return a.date > b.date;
        });

    $("#results").html(""); // div to display the list of videos

    video.forEach(ele => {
        var output = $("<div class='video-container'></div>").html("");
        $(output).append("<div class=\"responsive-video\"><iframe width=\"600\" height=\"338\" src=\"http://www.youtube.com/embed/" + ele["vidLink"] + "?rel=0&amp;showinfo=0" + "\" frameborder=\"0\" allow=\"autoplay; encrypted-media\" type=\"text/html\" allowfullscreen></iframe></div>");
        $(output).append("<p><a href=\"https://www.youtube.com/watch?v=" + ele["vidLink"] + "\" title='Click to watch the video' target='_blank'>" + ele["title"] + "</a></p>" + " <p class=\"likes\"> <i class=\"fas fa-thumbs-up\"></i> " + ele["likes"] + "  <i class=\"fas fa-eye\"></i> " + ele["views"] + "  <i class=\"fas fa-comments\"></i>    " + ele["comments"] + " </p>");
        $("#results").append(output);
    });
}

$(document).ready(function() {
    $("#type").change(function() {
        sort(arr); // this function is called on change of dropdown menu for sorting
    });
});
