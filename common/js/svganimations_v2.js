/**
 * svganimations.js v1.0.0
 * http://www.codrops.com
 *
 * the svg path animation is based on http://24ways.org/2013/animating-vectors-with-svg/ by Brian Suda (@briansuda)
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013, Codrops
 * http://www.codrops.com
 */
 (function() {

   'use strict';

   var docElem = window.document.documentElement;

   window.requestAnimFrame = function(){
        // console.log("here");
        return (
         window.requestAnimationFrame       ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||
         function(/* function */ callback){

            window.setTimeout(callback, 1000 / 60);

        }
        );
    }();

    window.cancelAnimFrame = function(){
      return (
         window.cancelAnimationFrame       ||
         window.webkitCancelAnimationFrame ||
         window.mozCancelAnimationFrame    ||
         window.oCancelAnimationFrame      ||
         window.msCancelAnimationFrame     ||
         function(id){
            window.clearTimeout(id);
        }
        );
  }();

  function SVGEl( el ) {
      this.el = el;
      this.image = this.el.previousElementSibling;
      this.current_frame = 0;
      this.total_frames = 180;
      this.path = new Array();
      this.length = new Array();
      this.handle = 0;
      this.done = false;
      this.init();
  }

  SVGEl.prototype.init = function(callback) {
      classie.remove( this.el, 'hide' );
      var self = this;
      var path_length = [].slice.call( this.el.querySelectorAll( 'path' ) ).length;
        // console.log(path_length);
        [].slice.call( this.el.querySelectorAll( 'path' ) ).forEach( function( path, i ) {
         self.path[i] = path;
         var l = self.path[i].getTotalLength();
         self.length[i] = l;
         self.path[i].style.strokeDasharray = l + ' ' + l;
         self.path[i].style.strokeDashoffset = l;
         if(i === path_length - 1)
         {
            self.done = true;
            if (callback && typeof(callback) === "function") {
                callback();
            }
        }
            // console.log(i + " " + self);

        } );
    };

    SVGEl.prototype.render = function() {
      if( this.rendered ) return;
      this.rendered = true;

      var rd = Math.floor((Math.random() * 2) + 1);
      console.log(rd);
      switch (rd){
        case 1:
        this.draw();
        console.log("here")
        break;
        case 2:
        this.draw_rv();
        break;
    }

};

SVGEl.prototype.draw = function(revert) {
  var self = this,
  progress = this.current_frame/this.total_frames;
  if (progress > 1) {
     window.cancelAnimFrame(this.handle);
     // this.showImage();
     transitionToImage();
     console.log("done");
 } else {
     this.current_frame++;
            // console.log(this.current_frame);

            // console.log(Math.floor((Math.random() * 2) + 1));

            for(var j=0, len = this.path.length; j<len;j++){
                this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
                // if (j == len - 1)
                // console.log(j + " - " + len);
                // alert(Math.floor(this.length[j] * (1 - progress)));
            }

            // console.log(this);
            this.handle = window.requestAnimFrame(function() { self.draw(revert); });
        }
    };

    SVGEl.prototype.draw_rv = function(revert) {
        var self = this,
        progress = this.current_frame/this.total_frames;
        if (progress > 1) {
            window.cancelAnimFrame(this.handle);
            // this.showImage();
            transitionToImage();
            console.log("done");
        } else {
            this.current_frame++;
            // console.log(this.current_frame);

            // console.log(Math.floor((Math.random() * 2) + 1));

            for(var j=0, len = this.path.length; j<len;j++){
                this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * -(1 - progress));
                // if (j == len - 1)
                // console.log(j + " - " + len);
                // alert(Math.floor(this.length[j] * (1 - progress)));
            }

            // console.log(this);
            this.handle = window.requestAnimFrame(function() { self.draw_rv(revert); });
        }
    };

    SVGEl.prototype.showImage = function() {
      classie.add( this.image, 'show' );
      classie.add( this.el, 'hide' );
  };

  function getViewportH() {
      var client = docElem['clientHeight'],
      inner = window['innerHeight'];

      if( client < inner )
         return inner;
     else
         return client;
 }

 function scrollY() {
  return window.pageYOffset || docElem.scrollTop;
}

	// http://stackoverflow.com/a/5598797/989439
	function getOffset( el ) {
		var offsetTop = 0, offsetLeft = 0;
		do {
			if ( !isNaN( el.offsetTop ) ) {
				offsetTop += el.offsetTop;
			}
			if ( !isNaN( el.offsetLeft ) ) {
				offsetLeft += el.offsetLeft;
			}
		} while( el = el.offsetParent )

		return {
			top : offsetTop,
			left : offsetLeft
		};
	}

	function inViewport( el, h ) {
		var elH = el.offsetHeight,
     scrolled = scrollY(),
     viewed = scrolled + getViewportH(),
     elTop = getOffset(el).top,
     elBottom = elTop + elH,
			// if 0, the element is considered in the viewport as soon as it enters.
			// if 1, the element is considered in the viewport only when it's fully inside
			// value in percentage (1 >= h >= 0)
			h = h || 0;

          return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
      }

      function SVGinit() {
        // $(".top_animate .line-drawing").removeClass("hide");


        var svgs = Array.prototype.slice.call( document.querySelectorAll( '#main svg' ) ),
        svgArr = new Array(),
        didScroll = false,
        resizeTimeout;
            // console.log(svgs[0]);

		// the svgs already shown...
        // console.log(svgs.css("display","block"));
        svgs.forEach( function( el, i ) {
         var svg = new SVGEl( el );

         svgArr[i] = svg;
            // console.log(svg);
            setTimeout(function( el ) {
                return function() {
                   if( inViewport( el.parentNode ) ) {
                      svg.render();
                  }
              };
          }( el ), 250 );
        } );




		// var scrollHandler = function() {
		// 		if( !didScroll ) {
		// 			didScroll = true;
		// 			setTimeout( function() { scrollPage(); }, 60 );
		// 		}
		// 	},
		// 	scrollPage = function() {
		// 		svgs.forEach( function( el, i ) {
		// 			if( inViewport( el.parentNode, 0.5 ) ) {
		// 				svgArr[i].render();
		// 			}
		// 		});
		// 		didScroll = false;
		// 	},
		// 	resizeHandler = function() {
		// 		function delayed() {
		// 			scrollPage();
		// 			resizeTimeout = null;
		// 		}
		// 		if ( resizeTimeout ) {
		// 			clearTimeout( resizeTimeout );
		// 		}
		// 		resizeTimeout = setTimeout( delayed, 200 );
		// 	};

		// window.addEventListener( 'scroll', scrollHandler, false );
		// window.addEventListener( 'resize', resizeHandler, false );
        // callback();
    }

    function transitionToImage(callback){
        $(".top_animate .img_sketch").fadeIn(5000),function(){

        };
        $(".top_animate .line-drawing").fadeOut(5000,function(){

            $(".top_animate .illustration").removeClass("zoom_in");
            $(".top_logo_animate").removeClass("begin_position");

            setTimeout(function(){
                $(".top_logo_animate").removeClass("first_position",function(){
                });
                setTimeout(function(){
                    // show FirstTest
                    $(".frame_text").fadeIn(300);

                    setTimeout(function(){
                        // show bottom bar
                        $(".top_animate .frame_bottom .h2_title").fadeIn(1000,function(){
                            $(".top_animate .frame_bottom .img_po").fadeIn(1000).removeClass("hide");
                        }).removeClass("hide");

                    })
                },2000)
            },5000)

            if (callback && typeof(callback) === "function") {
                callback();
            }
        });
    }

    // function zoomout_showtext(

    // )


    function go_slider(frame){
        // if(frame.html())
        if(typeof(frame) === "undefined")
            frame = $(".img_sketch li:first-child")


        console.log(frame);
        // console.log(frame.next());
        // if( !$frame && console.)
        // var current_element = $(".img_sketch li.show_img")[0];
        // // typeof
        // var current_element = $(".img_sketch li:first-child");


            setTimeout(function(){
                console.log(frame.next());
                if (frame.next() !== null)
                    go_slider(frame.next());
                else
                    go_slider();
                // console.log("while loop")
            },1000);
        // }
    }

    function first_screen(callback){
        setTimeout(function(){
            console.log(typeof(callback));
            console.log("first_screen");
            $(".First_text").fadeOut(2000,function(){
                // console.log(123 + " " + callback);
                if (callback && typeof(callback) === "function") {
                    callback();
                }
            });
        },3000)
    }
    $(document).ready(function(){
        // go_slider($(".img_sketch li:first-child"));
        go_slider();
        // first_screen(function(){
        //     SVGinit();
        // });
    })


})();