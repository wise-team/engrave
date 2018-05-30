(function($) {
    var fixed_nav = "1";
    var megamenu_carousel_el = null;

  "use strict";
    $=jQuery;

    jQuery(document).ready(function($){
        var delay = (function () {
            var timer = 0;
            return function (callback, ms) {
                clearTimeout(timer);
                timer = setTimeout(callback, ms);
            };
        })();
        if (fixed_nav == 2) {
            var nav = $('nav.main-nav');
            var d = nav.offset().top;
            $(window).scroll(function () {
                if($(window).width() <= 1023) {
                    nav.removeClass("fixed");
                    $('.main-nav').css('margin-top','0');
                    return false;
                }
                if ($(this).scrollTop() > d) {
                    nav.addClass("fixed");
                    //menu fixed if have admin bar
                    var ad_bar = $('#wpadminbar');
                    if(ad_bar.length != 0) {
                        $('.main-nav').css('margin-top',ad_bar.height());
                    }
                } else {
                    nav.removeClass("fixed");
                    $('.main-nav').css('margin-top','0');
                }
            });
        }
        // Back top
    	$(window).scroll(function () {
    		if ($(this).scrollTop() > 500) {
    			$('#back-top').css('bottom','0');
    		} else {
    			$('#back-top').css('bottom','-40px');
    		}
    	});
        // Header search 
        $('#header-search-button').click(function(){
            if ($('#header_searchform input').height() == 0){
                $('#header_searchform input').css('height','40px');
                $('#header_searchform').css('padding','0');
                $('#header_searchform input').css('padding','4px 12px');
                $('#header_searchform input').css('font-size','13px'); 
                $('#header_searchform input').val('');
            } else {
                $('#header_searchform input').css('height','0');
                $('#header_searchform').css('padding','0');
                $('#header_searchform input').css('padding','0');
                $('#header_searchform input').css('font-size','0');
            }
            
        });
        // Social share post 
        //$('.share-post-icon').hover(function(){
           // if ($('.gino_share-box').opacity() == 0){
            //    $('.gino_share-box').css('opacity','1');
           // } else {
           //     $('.gino_share-box').css('opacity','0');
           // }
        //});
    	// scroll body to top on click
    	$('#back-top').click(function () {
    		$('body,html').animate({
    			scrollTop: 0,
    		}, 1300);
    		return false;
    	});
        $(window).resize(function(){
            if($(this).width() >= 1050 ){
                $('#main-mobile-menu').hide();
            }
        });
        $('.main-nav .mobile').click(function(){
            $(this).siblings('#main-mobile-menu').toggle(300);
        });
        $('.main-nav #main-mobile-menu > ul > li.menu-item-has-children').prepend('<div class="expand"><i class="fa fa-angle-down"></i></div>');
        $('.expand').click(function(){
            $(this).siblings('.sub-menu').toggle(300); 
        });
        
        $('#main-search .search-icon').click(function(){
            if ($(this).siblings('#s').height() == 0){
                $('#main-search #s').css('height','45px');
                $('#main-search.search-ltr #s').css('padding','5px 50px 5px 15px');
                $('#main-search #s').css('font-size','14px');  
                $('#main-search #s').css('border','1px solid #fff');  
            } else {
                $('#main-search #s').css('height','0');
                $('#main-search #s').css('padding','0');
                $('#main-search #s').css('font-size','0'); 
                $('#main-search #s').css('border','0');  
            }
            
        });

        //fitvid
        $('.gino_embed-video').fitVids();
        $('.single .article-content').fitVids();
        //Megamenu
        if (megamenu_carousel_el != null) {
            var gino_megamenu_item;
            $.each( megamenu_carousel_el, function( id, maxitems ) {     
                gino_megamenu_item = $('#'+id).find('.gino_sub-post').length;
                if(gino_megamenu_item > maxitems) {
                    $('#'+id).flexslider({
                        animation: "slide",
                        animationLoop: true,
                        slideshow: false,
                        itemWidth: 10,
                        minItems: maxitems,
                        maxItems: maxitems,
                        controlNav: false,
                        directionNav: true,
                        slideshowSpeed: 3000,
                        move: 1,
                        touch: true,
                        useCSS: true,
                        nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="20px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
                        prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="20px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',
                    });
                }else{
                    $('#'+id).removeClass('flexslider');
                    $('#'+id).addClass('flexslider_destroy');
                }
            });
        }
        $('.module-main-slider .main-slider .post-info').removeClass('overlay'); 
        // Main slider
        if (typeof(main_slider) !== 'undefined') {
            $.each( main_slider, function( index, id ) {		                
                $('#slider_'+id).flexslider({
                    animation: 'fade',
                    controlNav: true,
                    animationLoop: true,
                    slideshow: true,
                    slideshowSpeed: 8000,
                    animationSpeed: 600,
                    smoothHeight: true,
                    directionNav: true,
                    nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="20px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
                    prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="20px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',
                    sync: "#carousel_ctrl_"+id,
                    after: function(slider) {
                        if (!slider.playing) {
                            slider.play();
                        }
                    } 
                });
            });
        }
        // Widget Slider 
        $('.widget-slider .slider-wrap').flexslider({
            animation: 'slide',
            controlNav: false,
            animationLoop: true,
            slideshow: true,
            pauseOnHover: true,
            slideshowSpeed: 8000,
            animationSpeed: 600,
            smoothHeight: true,
            directionNav: true,
            nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="20px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
            prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="15px" height="20px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',
        });
        $('.fullwidth-section .gino_carousel-wrap').flexslider({
            animation: "slide",
            controlNav: false,
            itemWidth: 270,
            columnWidth: 1,
            pauseOnHover: true,
            move: 1,
            animationLoop: true,
            slideshowSpeed: 8000,
            animationSpeed: 600,
            nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
            prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',
            minItems: 1, // use function to pull in initial value
            maxItems: 4, // use function to pull in initial value
        });
        $('.content-section .gino_carousel-wrap').flexslider({
            animation: "slide",
            controlNav: false,
            itemWidth: 240,
            columnWidth: 1,
            pauseOnHover: true,
            move: 1,
            animationLoop: true,
            slideshowSpeed: 8000,
            animationSpeed: 600,
            nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
            prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',
            minItems: 1, // use function to pull in initial value
            maxItems: 3, // use function to pull in initial value
        });
        $('.fullwidth-section .gino_carousel-large-wrap').flexslider({
            animation: "slide",
            controlNav: false,
            itemWidth: 270,
            columnWidth: 1,
            pauseOnHover: true,
            move: 1,
            animationLoop: true,
            slideshowSpeed: 8000,
            animationSpeed: 600,
            nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
            prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',
            minItems: 1, // use function to pull in initial value
            maxItems: 3, // use function to pull in initial value
        });
        $('.content-section .gino_carousel-large-wrap').flexslider({
            animation: "slide",
            controlNav: false,
            itemWidth: 240,
            columnWidth: 1,
            pauseOnHover: true,
            move: 1,
            animationLoop: true,
            slideshowSpeed: 8000,
            animationSpeed: 600,
            nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
            prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',
            minItems: 1, // use function to pull in initial value
            maxItems: 3, // use function to pull in initial value
        });
        $('#gino_gallery-slider').flexslider({
            animation: 'slide',
            controlNav: true,
            animationLoop: true,
            slideshow: false,
            pauseOnHover: true,
            slideshowSpeed: 5000,
            animationSpeed: 600,
            smoothHeight: true,
            directionNav: true,
            nextText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="0.375,0.375 45.63,38.087 0.375,75.8 "></polyline></svg>',
            prevText: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25px" height="50px" viewBox="0 0 49 77" xml:space="preserve"><polyline fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" points="45.63,75.8 0.375,38.087 45.63,0.375 "></polyline></svg>',

        }); 
        $('.img-popup-link').magnificPopup({
    		type: 'image',
            removalDelay: 300,
            mainClass: 'mfp-fade',
    		closeOnContentClick: true,
    		closeBtnInside: false,
    		fixedContentPos: true,		
    		image: {
    			verticalFit: true
    		}
    	});
        $('.video-popup-link').magnificPopup({
    		closeBtnInside: false,
    		fixedContentPos: true,
    		disableOn: 700,
    		type: 'iframe',
            removalDelay: 300,
            mainClass: 'mfp-fade',
    		preloader: false,
    	});
        $('#gino_gallery-slider').each(function() { // the containers for all your galleries
            $(this).magnificPopup({
        		delegate: 'a.zoomer',
        		type: 'image',
        		closeOnContentClick: false,
        		closeBtnInside: false,
                removalDelay: 300,
        		//mainClass: 'mfp-with-zoom mfp-img-mobile',
                mainClass: 'mfp-fade',
        		image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
        			verticalFit: true,
        			titleSrc: function(item) {
        				return ' <a class="image-source-link" href="'+item.src+'" target="_blank">'+ item.el.attr('title') + '</a>';
        			}
        		},
        		gallery: {
        			enabled: true,
                    navigateByImgClick: true,
                    preload: [0,1]
        		}
        	});	
    	});  
        if (typeof justified_ids !== 'undefined') {
            $.each( justified_ids, function( index, justified_id ) {
            	$(".justifiedgall_"+justified_id).justifiedGallery({
            		rowHeight: 200,
            		fixedHeight: false,
            		lastRow: 'justify',
            		margins: 4,
            		randomize: false,
                    sizeRangeSuffixes: {lt100:"",lt240:"",lt320:"",lt500:"",lt640:"",lt1024:""},
            	});
            });        
        }
        $('.zoom-gallery').each(function() { // the containers for all your galleries
            $(this).magnificPopup({
        		delegate: 'a.zoomer',
        		type: 'image',
        		closeOnContentClick: false,
        		closeBtnInside: false,
        		mainClass: 'mfp-with-zoom mfp-img-mobile',
        		image: {
                    tError: '<a href="%url%">The image #%curr%</a> could not be loaded.',
        			verticalFit: true,
        			titleSrc: function(item) {
        				return ' <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">'+ item.el.attr('title') + '</a>';
        			}
        		},
        		gallery: {
        			enabled: true,
                    navigateByImgClick: true,
                    preload: [0,1]
        		},
                zoom: {
        			enabled: true,
        			duration: 600, // duration of the effect, in milliseconds
                    easing: 'ease', // CSS transition easing function
        			opener: function(element) {
        				return element.find('img');
        			}
        		}
        	});	
    	}); 
        // Masonry Module Init
        $('.page-wrap').imagesLoaded(function(){
            setTimeout(function() {
                if($('.masonry-content-container').find('.one-col').length > 2){
                    $('.masonry-content-container').masonry({
                        itemSelector: '.one-col',
                        columnWidth: 1,
                        isAnimated: true,
                        isFitWidth: true,
                     });
                }
                $('.ajax-load-btn').addClass('active');
                $('.masonry-content-container').find('.post-details').removeClass('opacity-zero');
                $('.masonry-content-container').find('.post-meta').removeClass('opacity-zero');
             },500);
        });
        
        /* Sidebar stick */    
         var win, tick, curscroll, nextscroll; 
        win = $(window);
        var width = $('.sidebar-wrap').width();
        tick = function() {
            nextscroll = win.scrollTop();
            $(".sidebar-wrap.stick").each(function(){
                var bottom_compare, top_compare, screen_scroll, parent_top, parent_h, parent_bottom, scroll_status = 0, topab; 
                var sbID = "#"+$(this).attr(("id"));
                //var sbID = "#bk_sidebar_4";
                //console.log(sbID);
                var nav = $(sbID).parents('.content-sb-section');
                
                bottom_compare = $(sbID).offset().top + $(sbID).outerHeight(true);
                screen_scroll = win.scrollTop() + win.height();
                if (nav.length) {
                parent_top = nav.offset().top;
                parent_h = nav.height();
                }
                parent_bottom = parent_top + parent_h;
                topab =  parent_h - $(sbID).outerHeight(true);                            
                
                if(window.innerWidth > 1023) {
                    if(parent_h > $(sbID).outerHeight(true)) {
                        //console.log(win.scrollTop()  + "  " +  (parent_bottom - $(sbID).outerHeight(true)) + "   " + scroll_status);
                        if(win.scrollTop() < parent_top) {
                            scroll_status = 0;
                        }else if((win.scrollTop() >= parent_top) && (screen_scroll < parent_bottom)) {
                            //console.log(curscroll+ "    "+nextscroll);
                            if(curscroll <= nextscroll) {
                                scroll_status = 1;
                            }else if(curscroll > nextscroll) {
                                scroll_status = 3;
                            }
                        }else if(screen_scroll >= parent_bottom) {
                            scroll_status = 2;
                        } 
                        if(scroll_status == 0) {
                            $(sbID).css({
                                "position"  : "static",
                                "top"       : "auto",
                                "bottom"    : "auto"
                            });
                        }else if (scroll_status == 1) {
                            if(win.height() > $(sbID).outerHeight(true)) {
                                var ad_bar = $('#wpadminbar');
                                if (fixed_nav == 2) {
                                    if(ad_bar.length != 0) {
                                        var sb_height_fixed = 16 + ad_bar.height() + $('.main-nav').height() + 'px';
                                    }
                                    else {
                                        var sb_height_fixed = 16 + $('.main-nav').height() + 'px';
                                    }

                                }else {
                                    if(ad_bar.length != 0) {
                                        var sb_height_fixed = 16 + ad_bar.height() + 'px';
                                    }else {
                                        var sb_height_fixed = 16 + 'px';
                                    }
                                }
                                $(sbID).css({
                                    "position"  : "fixed",
                                    "top"       : sb_height_fixed,
                                    "bottom"    : "auto",
                                    "width"     : width
                                });
                            }else {
                                if (screen_scroll < bottom_compare) {
                                    topab = $(sbID).offset().top - parent_top;                            
                                    
                                    $(sbID).css({
                                        "position"  : "absolute",
                                        "top"       : topab,
                                        "bottom"    : "auto",
                                        "width"     : width
                                    });
                                }else {
                                    $(sbID).css({
                                        "position"  : "fixed",
                                        "top"       : "auto",
                                        "bottom"    : "16px",
                                        "width"     : width
                                    });
                                }
                            }
                        }else if (scroll_status == 3) {
                            if (win.scrollTop() > ($(sbID).offset().top)) {
                                topab = $(sbID).offset().top - parent_top;                            
                                
                                $(sbID).css({
                                    "position"  : "absolute",
                                    "top"       : topab,
                                    "bottom"    : "auto",
                                    "width"     : width
                                });
                            }else {
                                var ad_bar = $('#wpadminbar');
                                if (fixed_nav == 2) {
                                    if(ad_bar.length != 0) {
                                        var sb_height_fixed = 16 + ad_bar.height() + $('.main-nav').height() + 'px';
                                    }
                                    else {
                                        var sb_height_fixed = 16 + $('.main-nav').height() + 'px';
                                    }

                                }else {
                                    if(ad_bar.length != 0) {
                                        var sb_height_fixed = 16 + ad_bar.height() + 'px';
                                    }else {
                                        var sb_height_fixed = 16 + 'px';
                                    }
                                }
                                $(sbID).css({
                                    "position"  : "fixed",
                                    "top"       : sb_height_fixed,
                                    "bottom"    : "auto",
                                    "width"     : width
                                });
                            }
                        }else if(scroll_status == 2) {
                            if(win.height() > $(sbID).outerHeight(true)) {
                                var status2_inner = 0;
                                if(curscroll <= nextscroll) {
                                    status2_inner = 1;
                                }else if(curscroll > nextscroll) {
                                    status2_inner = 2;
                                }
                                if(((status2_inner == 1) && (bottom_compare < parent_bottom)) || ((status2_inner == 2) && (win.scrollTop() < $(sbID).offset().top))){
                                    var ad_bar = $('#wpadminbar');
                                    if (fixed_nav == 2) {
                                        if(ad_bar.length != 0) {
                                            var sb_height_fixed = 16 + ad_bar.height() + $('.main-nav').height() + 'px';
                                        }
                                        else {
                                            var sb_height_fixed = 16 + $('.main-nav').height() + 'px';
                                        }
    
                                    }else {
                                        if(ad_bar.length != 0) {
                                            var sb_height_fixed = 16 + ad_bar.height() + 'px';
                                        }else {
                                            var sb_height_fixed = 16 + 'px';
                                        }
                                    }
                                    $(sbID).css({
                                        "position"  : "fixed",
                                        "top"       : sb_height_fixed,
                                        "bottom"    : "auto",
                                        "width"     : width
                                    });
                                }else {
                                    $(sbID).css({
                                        "position"  : "absolute",
                                        "top"       : topab,
                                        "bottom"    : "auto",
                                        "width"     : width
                                    });
                                }
                            }else {
                                $(sbID).css({
                                    "position"  : "absolute",
                                    "top"       : topab,
                                    "bottom"    : "auto",
                                    "width"     : width
                                });
                            }
                        }      
                    }
                }   
                $(sbID).parent().css("height", $(sbID).height());   
            });
            curscroll = nextscroll;
        }
        $(".sidebar-wrap.stick").each(function(){
            $(this).wrap("<div class='gino_sticksb-wrapper'></div>");
        });
        delay(function () {
            win.on("scroll", tick);
        }, 2000);
        win.resize(function(){
            $(".sidebar-wrap.stick").each(function(){
                var sbID = "#"+$(this).attr(("id"));
                if(window.innerWidth > 1023) {
                    if($(this).parent().hasClass('gino_sticksb-wrapper')){
                        width = $('.gino_sticksb-wrapper').width();
                        $(sbID).css({
                            "width"     : width
                        });
                    }
                }else {
                    $(sbID).css({
                        "position"  : "static",
                        "top"       : "auto",
                        "bottom"    : "auto"
                    });
                }  
            });
        });
    });  
})(jQuery);          