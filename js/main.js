"use strict";

let initialPos = 80;

function createFigure(base, result) {
    let figure = $("<figure/>", {
        class: "img"
    });
    let pic = createPicture(base, result);
    let fig_caption = $("<figcaption/>", {
        class: "caption",
        text: result.title
    });
    figure.append(pic).append(fig_caption);
    return figure;
}

function showViewer(base, images, result, pos=0) {
    let files = result.files;
    pos = ( pos + files.length ) % files.length;
    let name = files[pos];

    if(result.location.trim().length === 0) { result = images.filter(res => res.image.startsWith(name))[0];}
    result.image = name;
    $("#viewer").toggleClass("visuallyhidden", false);
    $("#viewer-prev, #viewer-next").toggleClass("visuallyhidden", files.length <= 1);
    $("#viewer-close").off().on('click', () => {$("#viewer").toggleClass("visuallyhidden", true);});
    $("#viewer-prev").off().on('click', () => {showViewer(base, images, result, pos - 1);});
    $("#viewer-next").off().on('click', () => {showViewer(base, images, result, pos + 1);});

    window.location.hash = window.location.hash.split("/")[0] + "/" + result.title.split(" ").join("_");
    logHash();
    let pic = createPicture(base, result, sizes);
    $("#viewer-wrapper").empty().append(pic);
}

function parseContent(name, scroll=true) {
    const url = "content/" + name + ".json";
    return $.ajax({
        dataType: "json",
        url: url,
        success: function (json) {
            if(scroll) { window.location.hash = name; }
            logHash();
            const content = $("#content");
            const base = json.base;
            const images = json.images;
            content.empty();

            $("#back").toggleClass("visuallyhidden", typeof(json.parent) === "undefined");
            $("#back a").attr("parent", json.parent);

            for (let result of images) {
                if (!result.ext) {
                    result.ext = "jpg"
                }
                let figure = createFigure(base, result);
                if(json.type === "file" && result.location.trim().length > 0) {
                    let folder = $("<span/>", {
                        class: "folder mdi mdi-folder-multiple-image"
                    });
                    figure.append(folder);
                }
                let link = $("<a/>", {
                    click: () => {
                        if (json.type) {
                            if (json.type === "folder") {
                                parseContent(result.location)
                            }
                            else if (json.type === "file") {
                                let pos = (typeof(json.startFromZero) !== "undefined" && json.startFromZero) ? 0 : images.indexOf(result);
                                showViewer(base, images, result, pos);
                            }
                        }
                    }
                });
                link.append(figure);
                content.append(link);
            }
            content.append($("<figure/>", {class: "img empty"}));
            content.append($("<figure/>", {class: "img empty"}));
            content.append($("<figure/>", {class: "img empty"}));
            if (scroll) {
                scrollToTop();
            }
        },
        error: () => {}
    });
}

$(window).scroll(function() {
    let headerScrolled = $("#content").visibleHeight();
    let opacity = $("#shopname").offset().top;
    opacity = (opacity - $(window).scrollTop()) / opacity;
    $("#main_image_text").css({
        opacity: opacity
    });
    if (headerScrolled >= window.innerHeight - initialPos) {
        $("#header").addClass("affix");
    }
    else {
        $("#header").removeClass("affix");
    }
});
$("#header_image_picture").append(createPicture("img/header", {location: "", image: "header", title: "Header image"}, sizes));
$("#main_image_picture").append(createPicture("img/header", {location: "", image: "header", title: "Header image"}, sizes));
$(() => {
    $("#back").on('click', 'a', function() {
        let par = $(this).attr("parent");
        if(par) {
            parseContent(par);
        }
    });

    parseContent("work", false);
    $(window).on('load', function() {
        if(window.location.hash === "#work") {
            setTimeout(() => {
                scrollToTop();
            });
        }
    });
});

