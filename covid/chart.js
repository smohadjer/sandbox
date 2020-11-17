$(function() {
    var $person = $('#person');
    var $area = $('.area');
    var isfirstMove = true;
    var lastMouseX;
    var areaWidth = $area.width();
    var maxX = areaWidth - $person.width();
    var minX = 0;
    var lastLeftPositionOfPerson = $person.position().left;
    var myTimerId;
    var $ab1 = $('#antibody_1');
    var $ab2 = $('#antibody_2');
    var $ab3 = $('#antibody_3');
    var $ab4 = $('#antibody_4');
    var $ab5 = $('#antibody_5');
    var $ab6 = $('#antibody_6');
    var $ab7 = $('#antibody_7');
    var $ab8 = $('#antibody_8');
    var $ab9 = $('#antibody_9');
    var $ab10 = $('#antibody_10');
    var pauseBrowser = function(millis) {
        var date = Date.now();
        var curDate = null;
        do {
            curDate = Date.now();
        } while (curDate-date < millis);
    }
    var updatePage = function(percent) {
        //pauseBrowser(500);

        $('.pos span').text(percent);

        if (percent > 7) {
            $ab7.addClass('active');
        } else {
            $ab7.removeClass('active');
        }

        if (percent > 11) {
            $ab2.addClass('active');
        } else {
            $ab2.removeClass('active');
        }

        if (percent > 14) {
            $ab3.addClass('active');
        } else {
            $ab3.removeClass('active');
        }

        if (percent > 17) {
            $ab8.addClass('active');
        } else {
            $ab8.removeClass('active');
        }

        if (percent > 20) {
            $ab4.addClass('active');
        } else {
            $ab4.removeClass('active');
        }

        if (percent > 25) {
            $ab9.addClass('active');
        } else {
            $ab9.removeClass('active');
        }

        if (percent > 29) {
            $ab5.addClass('active');
        } else {
            $ab5.removeClass('active');
        }

        if (percent > 34) {
            $ab6.addClass('active');
        } else {
            $ab6.removeClass('active');
        }

        if (percent > 38) {
            $ab10.addClass('active');
        } else {
            $ab10.removeClass('active');
        }

        if (percent > 45) {
            $ab1.addClass('active');
        } else {
            $ab1.removeClass('active');
        }
    };
    var centerPerson = function() {
        // animate person to center on page load as a hint to user that person
        // can be dragged.
        $person.addClass('hasTransition');
        $person.on('transitionend', function(e) {
            if ($(e.target).attr('id') === 'person') {
                lastLeftPositionOfPerson = $person.position().left;
                var percent = Math.round(lastLeftPositionOfPerson/maxX * 100);

                updatePage(percent);

                // we don't need transition effect anymore
                $person.removeClass('hasTransition');
                $person.off('transitionend');
            }
        });

        // put person in center of area
        $person.css({
            left: maxX/2 + 'px'
        });
    };
    var mouseMoveHandler = function(e) {
        // support for touch devices
        if (e.originalEvent.touches) {
            var touch = e.originalEvent.touches[0]
        }
        var pageX = e.pageX || touch.pageX;

        if (isfirstMove) {
            isfirstMove = false;
            lastMouseX = pageX;
            return;
        }

        var distance = pageX - lastMouseX;
        var newPosition = lastLeftPositionOfPerson + distance;

        if (newPosition < minX) {
            newPosition = 0;
        }

        if (newPosition > maxX) {
            newPosition = maxX;
        }

        $person.css({
            left: newPosition + 'px'
        });

        setTimeout(function() {
            var percent = Math.round(newPosition/maxX * 100);
            updatePage(percent);
        }, 50);
    };

    //centerPerson();

    $(window).on('resize', function() {
        // if area is not resized do nothing
        if ($area.width() === areaWidth) {
            return;
        }

        // keep position of person the same relative to area
        var newAreaWidth = $area.width();
        var areaChange = newAreaWidth / areaWidth;
        var newPosition = $person.position().left * areaChange;

        maxX = newAreaWidth - $person.width();

        if (newPosition > maxX) {
            newPosition = maxX;
        }

        $person.css({
            left: newPosition + 'px'
        });

        lastLeftPositionOfPerson = newPosition;
        areaWidth = newAreaWidth;
    });

    $person.on('mousedown touchstart', function(e) {
        // use preventDefault() to stop browser from native drag and dropping of element
        //https://stackoverflow.com/questions/13236484/mouseup-not-working-after-mousemove-on-img
        e.preventDefault();
        $(document).on('mousemove touchmove', mouseMoveHandler);
    });

    $(document).on('mouseup touchend', function(e) {
        isfirstMove = true;
        lastLeftPositionOfPerson = $person.position().left;
        $(document).off('mousemove');
    });
});
