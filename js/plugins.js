"use strict";

// Avoid `console` errors in browsers that lack a console.
(function() {
    let method;
    const noop = function () {
    };
    const methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    let length = methods.length;
    const console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

$.fn.imagesLoaded = function(callback){
    let elems = this.filter('img'),
        len = elems.length;

    elems.bind('load',function(){
        if (--len <= 0){ callback.call(elems,this); }
    }).each(function(){
        // cached images don't fire load sometimes, so we reset src.
        if (this.complete || this.complete === undefined){
            let src = this.src;
            // webkit hack from http://groups.google.com/group/jquery-dev/browse_thread/thread/eee6ab7b2da50e1f
            // data uri bypasses webkit log warning (thx doug jones)
            this.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            this.src = src;
        }
    });

    return this;
};

$.fn.visibleHeight = function() {
    let elBottom, elTop, scrollBot, scrollTop, visibleBottom, visibleTop;
    scrollTop = $(window).scrollTop();
    scrollBot = scrollTop + $(window).height();
    elTop = this.offset().top;
    elBottom = elTop + this.outerHeight();
    visibleTop = elTop < scrollTop ? scrollTop : elTop;
    visibleBottom = elBottom > scrollBot ? scrollBot : elBottom;
    return visibleBottom - visibleTop
};

function vh(v) {
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    return (v * h) / 100;
}

function vw(v) {
    const w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return (v * w) / 100;
}

function vmin(v) {
    return Math.min(vh(v), vw(v));
}

function vmax(v) {
    return Math.max(vh(v), vw(v));
}

function logHash() {
    if(typeof(gtag) !== "undefined") {
        const link = location.pathname.replace(/^[\/]/, '') + location.search + location.hash;
        gtag('event', 'page_view', {'page_path': link});
    }
}

const sizes = {".small": 1280, ".medium": 1920, ".large":2160, "": 9999};
function createPicture(base, result, sizes = {"": 9999}) {
    let pic = $("<picture/>");
    if(result.ext === "svg") {
        let source_svg = $("<source/>",{
            type: "image/svg+xml",
            srcset: base + result.location + "//" + result.image + ".svg",
        });
        pic.append(source_svg);
    }
    for (let type of ["webp", "jpg"]) {
        for (let size in sizes) {
            let source = $("<source/>", {
                type: "image/"+type,
                srcset: base + result.location + "//" + result.image + size + "."+type,
                media: `(max-width: ${sizes[size]}px)`
            });
            pic.append(source)
        }
    }
    let img = $("<img/>", {
        src: base + result.location + "//" + result.image + ".jpg",
        alt: result.title
    });
    pic.append(img);
    return pic;
}

function scrollToTop() {
    $(".spacer.small")[0].scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
    // toggleMenu(false);
}
let menuToggle = "#main, .header, #menu, #viewer, #menu_link";
let menuWatcher = "#main.menu, .header.menu, #menu_link.menu";

function toggleMenu(toggle) {
    const funToggle = function() { $(menuToggle).toggleClass("menu"); };

    if(typeof(toggle) === "undefined") {
        funToggle();
        return;
    }
    toggle =  String(toggle).toLowerCase() === 'true';
    if(toggle !== isMenuOpen()){
        funToggle();
    }
}

function isMenuOpen() {
    return $("#menu.menu").length === 0;
}

$(() => {
    if(window.location.hash === "#menu") { // If it has menu hash, open menu by default
        toggleMenu(true);
    }
    $(document).on('click', menuWatcher, function() {
        toggleMenu();
        return false;
    });

    // Allow for smooth scrolling instead of popping into view
    $("#arrow-link").click(() => {
        scrollToTop();
    });
});
