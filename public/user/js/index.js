$(document).ready(function () {
    $(".accordion-list > li > .answer").hide()

    $(".accordion-list > li").click(function () {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active").find(".answer").slideUp()
        } else {
            $(".accordion-list > li.active .answer").slideUp()
            $(".accordion-list > li.active").removeClass("active")
            $(this).addClass("active").find(".answer").slideDown()
        }
        return false
    })

    var testimonialOwl = $(".testimonial-carousel").owlCarousel({
        items: 3,
        margin: 0,
        loop: true,
        dots: true,
        responsiveClass: true,
        responsive: {
            320: {
                items: 1,
            },
            375: {
                items: 1,
            },
            1024: {
                items: 2,
            },
            1368: {
                items: 3,
            },
        },
    })

    $(".testimonial-prev").click(function () {
        testimonialOwl.trigger("prev.owl.carousel")
    })

    $(".testimonial-next").click(function () {
        testimonialOwl.trigger("next.owl.carousel")
    })

    var aboutOwl = $("#aboutCarousel").owlCarousel({
        items: 3,
        margin: 0,
        loop: true,
        dots: true,
        responsiveClass: true,
        responsive: {
            320: {
                items: 1,
            },
            375: {
                items: 1,
            },
            1024: {
                items: 1,
            },
            1368: {
                items: 1,
            },
        },
    })

    $(".about-next").click(function () {
        aboutOwl.trigger("next.owl.carousel")
    })
})
