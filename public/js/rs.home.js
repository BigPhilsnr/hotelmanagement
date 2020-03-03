(function() {

	"use strict";


			// Revolution Slider Initialize
			if($(".fullwidth_home_banner").get(0)) {
				var rev = $(".fullwidth_home_banner").revolution({
					delay:9000,
					startheight:570,
					startwidth:1350,

					hideThumbs:10,

					thumbWidth:100,
					thumbHeight:50,
					thumbAmount:5,

					navigationType:"on",
					navigationArrows: "nexttobullets",
					

					touchenabled:"on",
					onHoverStop:"on",

					navOffsetHorizontal:0,
					navOffsetVertical:20,

					stopAtSlide:-1,
					stopAfterLoops:-1,

					shadow:0,
					fullWidth:"on"
				});

				$("#revolutionSlider .tp-caption").on("mousedown", function(e) {
					e.preventDefault();
					rev.revpause();
					return false;
				});

			}

})();


(function() {

	"use strict";


			// Revolution Slider Initialize
			if($(".fullwidth_home_two_banner").get(0)) {
				var rev = $(".fullwidth_home_two_banner").revolution({
					delay:80,
					startheight:570,
					startwidth:1350,

					hideThumbs:10,

					thumbWidth:100,
					thumbHeight:50,
					thumbAmount:5,

					navigationType:"on",
					navigationArrows: "nexttobullets",

					touchenabled:"on",
					onHoverStop:"on",

					navOffsetHorizontal:0,
					navOffsetVertical:20,

					stopAtSlide:-1,
					stopAfterLoops:-1,

					shadow:0,
					fullWidth:"on"
				});

				$("#revolutionSlider .tp-caption").on("mousedown", function(e) {
					e.preventDefault();
					rev.revpause();
					return false;
				});

			}

})();
