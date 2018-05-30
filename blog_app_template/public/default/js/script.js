/*jshint jquery:true */

$(document).ready(function ($) {
	"use strict";

	/* global google: false */
	/*jshint -W018 */

	/* ---------------------------------------------------------------------- */
	/*	Sticky sidebar
	/* ---------------------------------------------------------------------- */

	$('.sidebar-sticky').theiaStickySidebar({
		additionalMarginTop: 80
	});

	/*-------------------------------------------------*/
	/* =  OWL carousell
	/*-------------------------------------------------*/

	var owlWrap = $('.owl-wrapper');

	if (owlWrap.length > 0) {

		if (jQuery().owlCarousel) {
			owlWrap.each(function () {

				var carousel = $(this).find('.owl-carousel'),
					dataNum = $(this).find('.owl-carousel').attr('data-num'),
					dataNum2,
					dataNum3;

				if (dataNum === 1) {
					dataNum2 = 1;
					dataNum3 = 1;
				} else if (dataNum === 2) {
					dataNum2 = 2;
					dataNum3 = dataNum - 1;
				} else {
					dataNum2 = dataNum - 1;
					dataNum3 = dataNum - 2;
				}

				carousel.owlCarousel({
					autoPlay: 10000,
					navigation: true,
					items: dataNum,
					itemsDesktop: [1199, dataNum2],
					itemsDesktopSmall: [991, dataNum2],
					itemsTablet: [768, dataNum3],
				});

			});
		}
	}

	/* ---------------------------------------------------------------------- */
	/*	Contact Map
	/* ---------------------------------------------------------------------- */

	try {
		var fenway = [42.345573, -71.098326]; //Change a map coordinate here!
		var markerPosition = [42.345573, -71.098326]; //Change a map marker here!
		$('#map')
			.gmap3({
				center: fenway,
				zoom: 13,
				mapTypeId: google.maps.MapTypeId.ROADMAP
			})
			.marker({
				position: markerPosition,
				icon: 'images/marker.png'
			});
	} catch (err) {

	}

	/*-------------------------------------------------*/
	/* =  flexslider
	/*-------------------------------------------------*/

	var SliderPost = $('.flexslider');

	SliderPost.flexslider({
		slideshowSpeed: 10000,
		easing: "swing"
	});

	/* ---------------------------------------------------------------------- */
	/*	Contact Form
	/* ---------------------------------------------------------------------- */

	var submitContact = $('#submit_contact'),
		message = $('#msg');

	submitContact.on('click', function (e) {
		e.preventDefault();

		var $this = $(this);

		$.ajax({
			type: "POST",
			url: 'contact.php',
			dataType: 'json',
			cache: false,
			data: $('#contact-form').serialize(),
			success: function (data) {

				if (data.info !== 'error') {
					$this.parents('form').find('input[type=text],textarea,select').filter(':visible').val('');
					message.hide().removeClass('alert-success').removeClass('alert-danger').addClass('alert-success').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				} else {
					message.hide().removeClass('alert-success').removeClass('alert-danger').addClass('alert-danger').html(data.msg).fadeIn('slow').delay(5000).fadeOut('slow');
				}
			}
		});
	});

	/*-------------------------------------------------*/
	/* =  vertical Header
	/*-------------------------------------------------*/

	var OpenMenu = $('a.open-menu'),
		VerticalMenu = $('.vertical-box'),
		CloseMenu = $('a.close-menu'),
		Droper = $('li.droper');

	OpenMenu.on('click', function (event) {
		VerticalMenu.addClass('active');
	});

	CloseMenu.on('click', function (event) {
		VerticalMenu.removeClass('active');
	});

	Droper.on('click', function (event) {
		$(this).find('ul.level2').slideToggle();
	});

	/*-------------------------------------------------*/
	/* =  Scroll to TOP
	/*-------------------------------------------------*/

	var animateTopButton = $('a.go-top'),
		htmBody = $('html, body');

	animateTopButton.on('click', function (event) {
		event.preventDefault();
		htmBody.animate({ scrollTop: 0 }, 'slow');
		return false;
	});

	/* ---------------------------------------------------------------------- */
	/*	Header animate after scroll
	/* ---------------------------------------------------------------------- */

	(function () {

		var docElem = document.documentElement,
			didScroll = false,
			changeHeaderOn = 210;
		document.querySelector('header');
		function init() {
			window.addEventListener('scroll', function () {
				if (!didScroll) {
					didScroll = true;
					setTimeout(scrollPage, 100);
				}
			}, false);
		}

		function scrollPage() {
			var sy = scrollY();
			if (sy >= changeHeaderOn) {
				$('header').addClass('active');
			}
			else {
				$('header').removeClass('active');
			}
			didScroll = false;
		}

		function scrollY() {
			return window.pageYOffset || docElem.scrollTop;
		}

		init();

	})();

});

/*-------------------------------------------------*/
/* =  portfolio isotope
/*-------------------------------------------------*/

var winDow = $(window);
// Needed variables
var $container = $('.iso-call');
var $filter = $('.filter');

try {
	$container.imagesLoaded(function () {
		$container.trigger('resize');
		$container.isotope({
			filter: '*',
			layoutMode: 'masonry',
			animationOptions: {
				duration: 750,
				easing: 'linear'
			}
		});
	});
} catch (err) {
}

winDow.on('resize', function () {
	var selector = $filter.find('a.active').attr('data-filter');

	try {
		$container.isotope({
			filter: selector,
			animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false,
			}
		});
	} catch (err) {
	}
	return false;
});
