//滑动解锁插件
//2017年2月16日 作者:holy_nova
;
(function ($) {
    function Slider(elem, options) {
        this.$container = elem;
        this.default = {
            width: this.$container.width() - 2,
            height: this.$container.height() - 2,
            bgColor: '#E8E8E8',
            progressColor: '#FFE97F',
            handleColor: '#fff',
            succColor: '#78D02E',
            text: 'slide to unlock',
            succText: 'ok!',
            textColor: '#000',
            succTextColor: '#000',
            successFunc: function () {
                alert('successfully unlock!');
            }
        };
        this.options = $.extend({}, this.default, options);
        this.isSuccess = false;
    }
    Slider.prototype = {
        create: function () {
            var $container = this.$container;
            var options = this.options;
            initDOM();
            initStyle();

            function initDOM() {
                var template = '<div class="slide-to-unlock-bg"><span>' +
                    options.text +
                    '</span></div><div class="slide-to-unlock-progress"></div><div class="slide-to-unlock-handle"></div>';
                $container.html(template);
                //$(document).on('touchmove', function (event) {event.preventDefault();});
            }

            function initStyle() {
                $container.css({
                    position: 'relative',
                });
                $container.find('span').css({
                    lineHeight: options.height + 'px',
                    fontSize: options.height / 3.5,
                    color: options.textColor
                });
                $container.find('.slide-to-unlock-bg').css({
                    width: options.width + 'px',
                    height: options.height + 'px',
                    backgroundColor: options.bgColor,
                });
                $container.find('.slide-to-unlock-progress').css({
                    backgroundColor: options.progressColor,
                    height: options.height - 2 + 'px'
                });
                $container.find('.slide-to-unlock-handle').css({
                    backgroundColor: options.handleColor,
                    height: (options.height - 0) + 'px',
                    lineHeight: (options.height - 0) + 'px',
                    width: (Math.floor(options.width / 8)) + 'px',
                });
            }
        },
        reset: function () {
            $container.css({
                position: 'relative',
            });
            $container.find('span').css({
                lineHeight: options.height + 'px',
                fontSize: options.height / 3.5,
                color: options.textColor
            });
            $container.find('.slide-to-unlock-bg').css({
                width: options.width + 'px',
                height: options.height + 'px',
                backgroundColor: options.bgColor,
            });
            $container.find('.slide-to-unlock-progress').css({
                backgroundColor: options.progressColor,
                height: options.height - 2 + 'px'
            });
            $container.find('.slide-to-unlock-handle').css({
                backgroundColor: options.handleColor,
                height: (options.height - 0) + 'px',
                lineHeight: (options.height - 0) + 'px',
                width: (Math.floor(options.width / 8)) + 'px',
            });
            $prog.width(0);
            $handle.css({
                left: 0
            });
            $container.find('span').html(options.text);
        },
        bindDragEvent: function () {
            var that = this;
            var $container = this.$container;
            var options = this.options;
            var downX;
            var vectorX, vectorY;
            var histroyVectorX, histroyVectorY;
            if (histroyVectorX == "undefined") histroyVectorX = 0;
            if (histroyVectorY == "undefined") histroyVectorY = 0;
            var $prog = $container.find('.slide-to-unlock-progress'),
                $bg = $container.find('.slide-to-unlock-bg'),
                $handle = $container.find('.slide-to-unlock-handle');
            var succMoveWidth = $bg.width() - $handle.width();
            //$handle.on('mousedown', null, mousedownHandler);
            $handle[0].addEventListener('touchstart', mousedownHandler, false);

            function getLimitNumber(num, min, max) {
                if (num > max) {
                    num = max;
                } else if (num < min) {
                    num = min;
                }
                return num;
            }
            var intervl;

            function mousedownHandler(event) {
                downX = event.touches[0].clientX;
                //                $(document).on('mousemove', null, mousemoveHandler);
                //                $(document).on('vmousemove', null, mousemoveHandler);
                //                $(document).on('vmouseup', null, mouseupHandler);
                //                $(document).on('touchend', null, mouseupHandler);
                vectorX = event.touches[0].clientX;
                vectorY = event.touches[0].clientY;
                histroyVectorX = localStorage.getItem("verfyVectorX");
                histroyVectorY = localStorage.getItem("verfyVectorY");
                document.addEventListener('touchmove', mousemoveHandler, false);
                document.addEventListener('touchend', mouseupHandler, false);
                event.preventDefault();
            }

            function mousemoveHandler(event) {
                var moveX = event.touches[0].clientX;
                var moveY = event.touches[0].clientY;
                vectorX += moveX;
                vectorY += moveY;
                console.log("mousemoveHandler:" + moveX);
                var diffX = getLimitNumber(moveX - downX, 0, succMoveWidth);
                $prog.width(diffX);
                $handle.css({
                    left: diffX
                });
                if (diffX === succMoveWidth) {
                    if (histroyVectorX && histroyVectorY) {
                        if (histroyVectorX == vectorX && histroyVectorY == vectorY) {
                            //verfy failed
                            event.preventDefault();
                            return;
                        }
                    }
                    success();
                }
                event.preventDefault();
            }

            function mouseupHandler(event) {
                if (!that.isSuccess) {
                    $prog.animate({
                        width: 0
                    }, 100);
                    $handle.animate({
                        left: 0
                    }, 100);
                }
                localStorage.setItem("verfyVectorX", vectorX);
                localStorage.setItem("verfyVectorY", vectorY);
                //                $(document).off('mousemove', null, mousemoveHandler);
                //                $(document).off('vmousemove', null, mousemoveHandler);
                //                $(document).off('vmouseup', null, mouseupHandler);
                //                $(document).off('touchend', null, mouseupHandler);
                document.removeEventListener('touchmove', mousemoveHandler, false);
                document.removeEventListener('touchend', mouseupHandler, false);
            }

            function success() {
                $prog.css({
                    backgroundColor: options.succColor,
                });
                $container.find('span').css({
                    color: options.succTextColor
                });
                that.isSuccess = true;
                $container.find('span').html(options.succText);
                $handle.off('mousedown', null, mousedownHandler);
                //                $(document).off('vmousemove', null, mousemoveHandler);
                //                $(document).off('touchmove', null, mousemoveHandler);
                document.removeEventListener('touchmove', mousemoveHandler, false);
                setTimeout(function () {
                    options.successFunc && options.successFunc();
                }, 30);
            }
        }
    };
    $.fn.extend({
        slideToUnlock: function (options) {
            return this.each(function () {
                var slider = new Slider($(this), options);
                slider.create();
                slider.bindDragEvent();
            });
        }
    });
})(jQuery);
