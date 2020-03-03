(function ($) {
	"use strict";


jQuery(document).ready(function($){
	
	// showcase slider
	$('.showcase_slider').owlCarousel({
        loop:true,
        autoHeight: true,
        autoplay: true,
        nav: false,
        margin:0,
        responsive:{
            0:{
                items:2
            },
            600:{
                items:4
            },
            1000:{
                items:6
            }
        }
    });

	//bootstrap carousel
	$('.carousel').carousel({
	    pause: true,
	    interval: 2000
	});
	
	// start vertical lightslider
	$('#vertical').lightSlider({
      gallery:true,
      item:1,
      vertical:true,
      verticalHeight:320,
      vThumbWidth:100,
      thumbItem:4,
      thumbMargin:15,
      enableDrag: true,
      slideMargin:0
    });

	// end vertical lightslider


	// start normal lightslider
	$('#image-gallery').lightSlider({
	      gallery:true,
	      item:1,
	      thumbItem:6,
	      slideMargin: 0,
	      thumbMargin:24,
	      verticalHeight:600,
	    	vThumbWidth:100,
	      speed:500,
	      auto:true,
	      loop:true,
	      onSliderLoad: function() {
	          $('#image-gallery').removeClass('cS-hidden');
	      }  
	  });
	// end normal lightslider


	

})
	
	/** start prelaoder js **/

	$(window).load(function() { // makes sure the whole site is loaded
		$('#status').fadeOut(); // will first fade out the loading animation
		$('#loader-wrapper').delay(300).fadeOut('slow'); // will fade out the white DIV that covers the website.
		$('body').delay(350).css({'overflow-x':'hidden'});
		setTimeout(function () {
		
			$('#loader-wrapper').hide();

		  },5000)
	})

	/** end prelaoder js **/

}(jQuery));