// JavaScript Document
(function($){
	'use strict';
	var $slide=$('.glb-slideshow-container');
    $slide.blzSlide({
		maxDistance:($slide.eq(0).children().length-1)*$(document).width(),
		slideSuccessCallback:function(data){
			var $target=data.$target.closest('.blz-slideshow').find('.blz-slideshow-nav li');
			var n=Math.abs(data.distance/data.displacement);
			$target.removeClass('active').eq(n).addClass('active');
		}
    });
})(window.Zepto||window.jQuery);