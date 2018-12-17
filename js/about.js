"use strict";

let lang = "nl";
$("#header_image_picture").append(createPicture("img/header", {location: "", image: "header"}, sizes));
$("#main_image_picture").append(createPicture("img/header", {location: "", image: "about"}, sizes));

$(()=>{
    $.getJSON("content/about.json", (json) => {
        $.each(json, (k,v) =>{
            let div = $("<div/>", {
                class: "lang " + k + ((k !== lang) ? " visuallyhidden" : ""),
            });
            let flag = $("<span/>", {
                class: `flag-icon flag-icon-${k} ${k} ${((k === lang) ? " selected" : "")}`,
            });
            for(let c of v) {
                let p = $("<p/>", { html: c });
                div.append(p);
            }
            console.log(div);
            $("#aboutMe").append(div);
            $("#flags").append(flag);
        });
        $(".flag-icon").click((e)=>{
            $(".flag-icon").toggleClass("selected", false);
            $("#content .lang").toggleClass("visuallyhidden", true);
            $(e.target).toggleClass("selected", true);
            lang = [...e.target.classList.values()].reduce((a, b) => a.length <= b.length ? a : b);
            $("#content .lang."+lang).toggleClass("visuallyhidden", false);
        });
    });
});
