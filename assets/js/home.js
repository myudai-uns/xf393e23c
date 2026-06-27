// home.js
$(function(){
  if(navigator.userAgent.match(/MSIE 10/i) || navigator.userAgent.match(/Trident\/7\./) || navigator.userAgent.match(/Edge\/12\./)) {
    $('body').on("mousewheel", function () {
      event.preventDefault();
      var wd = event.wheelDelta;
      var csp = window.pageYOffset;
      window.scrollTo(0, csp - wd);
    });
  }

  newsTabDis();
  newsTabScroll();
});

function newsTabScroll(){
  $(".scrollBtn").find("a").on("touchstart click", function (e) {
    // スクロールの速度
    var speed = 200, // ミリ秒
        href = $(this).attr("href"),
        target = $(href == "#" || href == "" ? 'html' : href),
        position = target.offset().top,
        plusH = "";
    if( $(".html-pc").length ){
      plusH = $(".globalHeaderInner").outerHeight();
    } else if ( $(".html-tb").length ) {
      plusH = $(".globalHeaderInner").outerHeight();
    } else if( $(".html-sp").length ){
      plusH = $(".globalHeaderInner").outerHeight();
    }
    $('body,html').animate({scrollTop:position - plusH}, speed);
    return false;
  });
}

//newsTabDis(Index Only)
function newsTabDis() {
  var $newsTab = $(".newsTab").children("li"),
      $newsBox = $(".newsBox"),
      selectClass = "active";

  $newsTab.eq(0).addClass(selectClass);
  $newsBox.hide().eq(0).show();

  $newsTab.on('click', function() {
    var num = $newsTab.index(this),
        numTop = $('#whatsnew').offset().top,
        plusH = "";
    if( $(".html-pc").length ){
      plusH = $(".globalHeaderInner").outerHeight();
    } else if ( $(".html-tb").length ){
      plusH = $(".globalHeaderInner").outerHeight();
    } else if( $(".html-sp").length ){
      plusH = $(".globalHeaderInner").outerHeight();
    }
    $('body,html').animate({scrollTop:numTop - plusH}, "300");
    $newsTab.find("a").removeClass(selectClass);
    $(this).find("a").addClass(selectClass);
    $newsBox.hide().eq(num).stop().fadeIn(200);
    return false;
  });
}
