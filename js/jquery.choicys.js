// page scrool

$(document).ready(function() {
    var pagetop = $('#pageup');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            pagetop.fadeIn();
        } else {
            pagetop.fadeOut();
        }
    });
    pagetop.click(function () {
        $('body, html').animate({ scrollTop: 0 }, 500);
        return false;
    });
});



// tab

$(document).ready(function() {
	$('#main div.tab > div:first').show();
    $('#main nav.switch-tab li:first').addClass('active');

    $('#main nav.switch-tab li').click(function() {
        $('#main nav.switch-tab li').removeClass('active');
        $(this).addClass('active');
        $('#main div.tab > div').hide();

        $($(this).find('a').attr('href')).fadeIn();
        return false;
	});
});