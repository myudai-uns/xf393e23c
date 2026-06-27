// main.js

$(window).on('scroll', function() {
  $.common.pagetop();
});


/*
 * タッチデバイス判定
 */
function isTouchDevice() {
  var result = false;
  if (window.ontouchstart === null) {
    result = true;
  }
  return result;
}

/*
 * ブレイクポイント判定
 */
function isBreakPoint() {
  var $win = $(window);
  var windowWidth = window.innerWidth;

window.innerWidth == undefined ? windowWidth = $(document).width() : null;

  if (windowWidth > 1120) {
    if (isTouchDevice()) {
      return "tb-wide";
    } else {
      return "pc";
    }
  } else if (windowWidth > 767) {
    return "tb";
  } else {
    return "sp";
  }
}

/*
 * UA判定
 */
function getDevice() {
  var ua = navigator.userAgent;
  if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
    return 'sp';
  }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
    return 'tb';
  }else{
    return 'pc';
  }
}

var timer = false;

// html
var pcClass = "html-pc",
      tbWideClass = "html-tbWide",
      tbClass = "html-tb",
      spClass = "html-sp";

/*
 * common 実行
 */
$(function() {
  $(document).ready(function() {
    $.common.breakpointClass();
    $.common.deviceClass();
    $.common.smoothScroll();
    $.common.disLayout();
    $.common.meganavAct();
    $.common.smartPhone();
    $.common.tabletNav();
    $.common.searchBtn();
    $.common.langBtn();
    $.common.accordion();
    $.common.tab();
    $.common.tableScroll();
  });

  // モバイルでドロワーを開くと .wrapper が position:fixed になり、URL バー表示切替で
  // resize が発火する。閾値付近で sp↔tb と判定が揺れて reseTb() が走るとドロワーが
  // 即時閉じてしまうため、ブレイクポイントが実際に変わった時のみ disLayout を呼ぶ。
  var _lastBP = isBreakPoint();
  $(window).on("orientationchange resize",function(){
    if (timer !== false) {
      clearTimeout(timer);
    }
    timer = setTimeout(function() {
      var currentBP = isBreakPoint();
      $.common.breakpointClass();
      $.common.deviceClass();
      if (currentBP !== _lastBP) {
        _lastBP = currentBP;
        $.common.disLayout();
      }
    }, 150);
  });

});


/*
 * common
 */
$.common = {

  // ブレイクポイント
  breakpointClass: function (){
    switch (isBreakPoint()) {
      //PC
      case "pc":
        $("html").removeClass().addClass(pcClass);
      break;

      //タブレット（ワイド）
      case "tb-wide":
        $("html").removeClass().addClass(tbWideClass);
      break;

      //タブレット
      case "tb":
        $("html").removeClass().addClass(tbClass);
      break;

      //スマートフォン
      case "sp":
        $("html").removeClass().addClass(spClass);
      break;
    }
  },

  // UA付与
  deviceClass: function (){
    switch ( getDevice() ) {
      //PC
      case "pc":
        $("html").addClass("devicePc");
      break;
      //タブレット
      case "tb":
        $("html").addClass("deviceTb");
      break;
      //スマートフォン
      case "sp":
        $("html").addClass("deviceSp");
      break;
    }
  },

  // スムーススクロール
  smoothScroll: function (){
    $("a.scroll").on("click", function (e) {
      // スクロールの速度
      var speed = 200; // ミリ秒
      var href = $(this).attr("href");
      var target = $(href == "#" || href == "" ? 'html' : href);
      var position = target.offset().top;
      var headH;

      headH = $(".globalHeader").outerHeight();
      if( isBreakPoint() == "pc" || isBreakPoint() == "tb-wide" ){
        $('body,html').animate({scrollTop:position-headH}, speed);
      } else if( isBreakPoint() == "tb" || isBreakPoint() == "sp" ) {
        $('body,html').animate({scrollTop:position-headH}, speed);
      }
      return false;
    });
  },

  // 共通レイアウト表示
  disLayout: function (){

    switch (isBreakPoint()) {
      //PC
      case "pc":
        resePc();
      break;
      case "tb-wide":
        reseWideTb();
      break;
      case "tb":
        reseTb();
      break;
      case "sp":
        reseSp();
      break;
    }

    function resePc() {
      $(".mask").css({ "display" : "" , "overflow" : "" });
      $(".megaNavSlide").css({"display":"","height":""});
      $(".globalHeader").css({"position":""});
      $(".mainContents").css({ "padding-top" : 0 });
      $(".wrapper").css({"position":"" , "top" : "" });
      $("#acdBtn").removeClass("spActive").css({ "position" : "" ,"right" : "" });
      $(".drawerMenu").removeClass("spActive").css({"left" : "100%"});
      if( $(".spActive").length ){
        $(".megaNavParent").find(".spActive").removeClass("spActive").children(".megaNavSlide").css({ "display" : "" });
      }
      if( $(".tabActive").length ){
        $(".megaNavParent").children(".tabActive").removeClass("tabActive").css({ "display" : "" });
        $(".megaNavParent").find(".tabInActive").removeClass("tabInActive").css({ "display" : "" });
      }
      if( $(".tabDefault").length && !$(".tabDefault").hasClass("exception") ){
        $(".tabDefault").addClass("tabActive");
      }
      if( $(".mvBoxWrap").length ){
        $(".mvBoxWrap").css({"margin-top": 0 });
      }
    }
    //resePc

    function reseTb() {
      $(".mask").css({ "display" : "" , "overflow" : "" });
      $(".wrapper").css({"position":"" , "top" : "" });
      $("#acdBtn").removeClass("spActive").css({ "position" : "" ,"right" : "" });
      $(".drawerMenu").removeClass("spActive").css({"left" : "100%"});
      if( $(".spActive").length ){
        $(".megaNavSlide").css({ "display" : "" });
        $(".megaNavParent").find(".spActive").removeClass("spActive").children(".megaNavSlide").css({ "display" : "" });
      }
      if( $(".tbWideActive").length ){
        $(".megaNavParent").children(".tbWideActive").removeClass("tbWideActive").css({ "display" : "" });
        $(".megaNavSlide").css({ "display" : "" });
        $(".megaNavParent").find(".tbWideInActive").removeClass("tbWideInActive").css({ "display" : "" });
      }
      if( $(".tabActive").length ){
        $(".megaNavParent").children(".tabActive").removeClass("tabActive").css({ "display" : "" });
        $(".megaNavSlide").css({ "display" : "" });
        $(".megaNavParent").find(".tabInActive").removeClass("tabInActive").css({ "display" : "" });
      }
      if( $(".mvBoxWrap").length ){
        $(".mvBoxWrap").css({"margin-top": 0 });
      }
    }
    //reseTb

    function reseWideTb() {
      $(".mask").css({ "display" : "" , "overflow" : "" });
      $(".mainContents").css({ "padding-top" : 0 });
      $(".wrapper").css({"position":"" , "top" : "" });
      $("#acdBtn").removeClass("spActive").css({ "position" : "" ,"right" : "" });
      $(".drawerMenu").removeClass("spActive").css({"left" : "100%"});
      if( $(".spActive").length ){
        $(".megaNavParent").find(".spActive").removeClass("spActive").children(".megaNavSlide").css({ "display" : "" });
      }
      if( $(".tabActive").length ){
        $(".globalHeader").css({"position":""});
        $(".megaNavParent").children(".tabActive").removeClass("tabActive").css({ "display" : "" });
        $(".megaNavSlide").css({ "display" : "" });
        $(".megaNavParent").find(".tabInActive").removeClass("tabInActive").css({ "display" : "" });
      }
      if( $(".tabDefault").length ){
        $(".tabDefault").addClass("tbWideActive");
      }
      if( $(".html-tbWide").length ){
        $(".megaNavSlide").css({ "display" : "" , "height" : ""});
      }
      if( $(".mvBoxWrap").length ){
        $(".mvBoxWrap").css({"margin-top": 0 });
      }
    }
    //reseWideTb

    function reseSp() {
      $(".mask").css({ "display" : "" , "overflow" : "" });
      $(".mainContents").css({ "padding-top" : 0 });
      if( $(".tabActive").length ){
        $(".globalHeader").css({"position":""});
        $(".megaNavParent").children(".tabActive").removeClass("tabActive").css({ "display" : "" });
        $(".megaNavSlide").css({ "display" : "" });
        $(".megaNavParent").find(".tabInActive").removeClass("tabInActive").css({ "display" : "" });
      }
      if( $(".tabDefault").length ){
        $(".tabDefault").addClass("tbWideActive");
      }
      if( $(".mvBoxWrap").length ){
        var $breadcrumb = $(".breadcrumb").outerHeight();
        $(".mvBoxWrap").css({"margin-top": -$breadcrumb });
      }
      // $('.megaNav').height(parseInt(window.innerHeight) - 55);
    }
    //reseSp

  },

  // 共通メガナビ
  meganavAct: function (){

    //megaNav
    var $megaNav = $(".megaNav");
    var $megaNavParent = $(".megaNavParent");
    var $megaNavSlide = $(".megaNavSlide");
    var $megaNavParentLi = $megaNavParent.children("li");
    var $megaNavSlideLi = $megaNavSlide.children("ul").children("li");

    $megaNavParentLi.not( ".tabDefault" ).hover(function(e){
      if( isBreakPoint() == "pc" && $(".devicePc").length ){
        $(".tabDefault").addClass("cache");
        $(".cache").removeClass("tabDefault");
        if( $(this).children(".noneBg").length || $(this).children(".icoWin").length ){
          $(".cache").addClass("tabDefault").removeClass("cache");
        }
      }
    },function(){
      if( isBreakPoint() == "pc" && $(".devicePc").length ){
        $(".cache").addClass("tabDefault").removeClass("cache");
      }
    });
  },

  // タブレットナビ
  tabletNav:function(){

    //megaNav
    var $megaNav = $(".megaNav");
    var $megaNavParent = $(".megaNavParent");
    var $megaNavSlide = $(".megaNavSlide");
    var $megaNavParentLi = $megaNavParent.children("li");
    var $megaNavSlideLi = $megaNavSlide.children("ul").children("li");
    var $tabDefault = $(".tabDefault");
    var $mask = $(".mask");
    if( !$(".spActive") ){
      var padding = $(".tabActive").children(".megaNavSlide").outerHeight();
      $(".mainContents").css({"pdding-top":padding});
    }

    // タブレット隠れマスク
    $mask.on("click",function(){
      if( isBreakPoint() == "tb" || isBreakPoint() == "pc"){
        $mask.css({"display":"none"});
        if( $(".tabInActive").length ) {
          $(".tabInActive").removeClass("tabInActive").children(".megaNavSlide").stop().slideUp(300,function(){
            $(".tabActive").removeClass("tabActive").children(".megaNavSlide").stop().slideUp(400);
          });
        } else {
          $(".tabActive").removeClass("tabActive").children(".megaNavSlide").stop().slideUp(400);
        }
      } else if( isBreakPoint() == "tb-wide"){
        $mask.css({"display":"none"});
        $(".tbWideActive").removeClass("tbWideActive");
        $(".tbWideInActive").removeClass("tbWideInActive");
        $tabDefault.addClass("tbWideActive").children(".megaNavSlide").stop().slideDown(400);
      }
      return false;
    });

// タブレット時、メガナビゲーション
    $megaNavParentLi.children("a").on("click",function(){
      var $this = $(this).parent("li"),
            $thisChild = $this.children(".megaNavSlide");

      /* if ( タブレット縦向き時 ) */
      if( isBreakPoint() == "tb" ){

        /* if ( 下層ナビの存在あり ) */
        if( $thisChild.length ) {
          if( !$this.hasClass("tabActive") ){ // クリックしたタブが閉じている

            $mask.css({"display":"block"});
            if( !$megaNavParentLi.hasClass("tabActive") ) { // 開いているタブがひとつもない
              $this.addClass("tabActive");
              $thisChild.stop().slideDown(300);
            } else { // 開いているタブがひとつ以上ある
              if( $(".tabInActive").length ){ //サブナビが開いている
                $(".tabInActive").find(".megaNavSlide").stop().slideUp(100,function(){
                  $megaNavParent.children(".tabActive").children(".megaNavSlide").stop().slideUp(300,function(){
                    $megaNavParent.children(".tabActive").removeClass("tabActive");
                    $this.addClass("tabActive");
                    $thisChild.stop().slideDown(300);
                  });
                });
                $(".tabInActive").removeClass("tabInActive");
              } else { //サブナビが閉じている
                $megaNavParent.children(".tabActive").children(".megaNavSlide").stop().slideUp(300,function(){
                  $megaNavParent.children(".tabActive").removeClass("tabActive");
                  $this.addClass("tabActive");
                  $thisChild.stop().slideDown(300);
                });
              }
            }

          } else { // クリックしたタブが開いている

            $mask.css({"display":"none"});

            //サブナビが開いている
            if( $this.find("li").hasClass("tabInActive") ){
              $this.find(".tabInActive").find(".megaNavSlide").stop().slideUp(100,function(){
                $this.removeClass("tabActive");
                $thisChild.stop().slideUp(300);
              });
              $this.find(".tabInActive").removeClass("tabInActive");

            //サブナビが閉じている
            } else {
              $this.removeClass("tabActive");
              $thisChild.stop().slideUp(300);
            }

          }
          return false;

        /* else if ( 下層ナビなし、なおかつリンク設定あり ) */
        } else if( $thisChild.length == undefined ) {
          return true;
        }

      /* else if ( タブレット横向き時 ) */
      } else if( isBreakPoint() == "tb-wide" ) {

        /* if ( 下層ナビの存在あり ) */
        if( $thisChild.length ) {
          if( !$this.hasClass("tbWideActive") ){ // クリックしたタブが閉じている

            $mask.css({"display":"block"});
            if( !$megaNavParentLi.hasClass("tbWideActive") ) { // 開いているタブがひとつもない
              $this.addClass("tbWideActive");
            } else { // 開いているタブがひとつ以上ある
              if( $(".tbWideInActive").length ){ //サブナビが開いている
                $megaNavParent.children(".tbWideActive").removeClass("tbWideActive");
                $this.addClass("tbWideActive");
                $(".tbWideInActive").removeClass("tbWideInActive");
              } else { //サブナビが閉じている
                $megaNavParent.children(".tbWideActive").removeClass("tbWideActive");
                $this.addClass("tbWideActive");
              }
            }

          } else { // クリックしたタブが開いている

            $mask.css({"display":"none"});
            if( $this.find("li").hasClass("tbWideInActive") ){ //サブナビが開いている
              if( !$this.hasClass("tabDefault") ){
                $this.removeClass("tbWideActive");
                if( $tabDefault.length ){
                  $tabDefault.addClass("tbWideActive");
                }
                $this.find(".tbWideInActive").removeClass("tbWideInActive");
              }
            } else { //サブナビが閉じている
              if( !$this.hasClass("tabDefault") ){
                $this.removeClass("tbWideActive");
                if( $tabDefault.length ){
                  $tabDefault.addClass("tbWideActive");
                }
              }
            }

          }
          return false;

        /* else if ( 下層ナビなし、なおかつリンク設定あり ) */
        } else if( $thisChild.length == undefined ) {
          return true;
        }
      }
    });

// タブレット時、サブナビゲーション
    $megaNavSlideLi.children("a").on("click",function(){
      var $this = $(this).parent("li"),
            $thisChild = $this.children(".megaNavSlide");

      /* if ( タブレットの縦向き時 ) */
      if( isBreakPoint() == "tb"){

        $mask.css({"display":"block"});
        if( $thisChild.length ) { // 下層ナビの存在あり
          if( !$this.hasClass("tabInActive") ){ // クリックしたタブが閉じている
            if( !$megaNavSlideLi.hasClass("tabInActive") ) { // 開いているタブがひとつもない
              $this.addClass("tabInActive");
              $thisChild.stop().slideDown();
            } else { // 開いているタブがひとつ以上ある
              $megaNavParent.find(".tabInActive").find(".megaNavSlide").stop().slideUp(300,function(){
                $megaNavParent.find(".tabInActive").removeClass("tabInActive");
                $this.addClass("tabInActive");
                $thisChild.stop().slideDown(300);
              });
            }
          } else { // クリックしたタブが開いている
            $this.removeClass("tabInActive");
            $thisChild.stop().slideUp();
          }
          return false;
        } else if( $thisChild.length == undefined ) {// 下層なし&リンク設定
          return true;
        }

      /* else if ( タブレットの横向き時 ) */
      } else if( isBreakPoint() == "tb-wide" ) {

        $mask.css({"display":"block"});
        if( $thisChild.length ) { // 下層ナビの存在あり
          if( !$this.hasClass("tbWideInActive") ){ // クリックしたタブが閉じている
            if( !$megaNavSlideLi.hasClass("tbWideInActive") ) { // 開いているタブがひとつもない
              $this.addClass("tbWideInActive");
            } else { // 開いているタブがひとつ以上ある
                $megaNavParent.find(".tbWideInActive").removeClass("tbWideInActive");
                $this.addClass("tbWideInActive");
            }
          } else { // クリックしたタブが開いている
            $this.removeClass("tbWideInActive");
          }
          return false;
        } else if( $thisChild.length == undefined ) {// 下層なし&リンク設定
          return true;
        }
      }

    });

    // 下層ページ、ナビの高さ分Padding

  },

  smartPhone:function(){
    var $btn = $("#acdBtn"),
          $drawer = $(".drawerMenu"),
          $body = $("body"),
          $wrap = $(".wrapper");

    // アイコン用クラス付与
    for( var i = 0; i < $(".megaNavParent").find("li").length; i++ ){
      var target = $(".megaNavParent").find("li").eq(i).find("a");
      if( !target.next().length ){
        !target.hasClass("icoWin") ? target.addClass("noneBg") : null;
      }
    }

    // アコーディオンボタンのクリック動作
    $btn.on("click",function(){
      var scTop;
      if( $(this).hasClass("spActive") ){
        drawerClose();
      } else {
        drawerOpen();
      }
      return false;
    });

    function drawerOpen(){
      $(".megaNav").scrollTop(0);
      $btn.addClass("spActive").css({"position":"fixed"}).stop().delay(50).animate({"right":"0"});
      $drawer.addClass("spActive").stop().animate({"left":"0"});
      scTop = $(window).scrollTop();
      $wrap.css({"position":"fixed","top": -scTop});
      $(window).scrollTop(scTop);
    };
    function drawerClose(){
      $btn.removeClass("spActive").stop().animate({"right":"0"}).css({"position":"absolute"});
      $drawer.removeClass("spActive").stop().delay(50).animate({"left":"100%"});
      $wrap.css({"position":"" , "top" : "" });
      $(window).scrollTop(scTop);
    };

    // メガナビアコーディオン
    $(".megaNavParent").on("click","a",function(){
      /* if ( スマホか確認 ) */
      if( isBreakPoint() == "sp"){
        var $this = $(this).parent("li"),
              $thisChild = $this.children(".megaNavSlide");

        /* if ( 下層ナビの存在なし ) return false */
        if( $thisChild.length ){

          /* if ( ナビが開いてる ) */
          if( $this.hasClass("spActive") ){
            $this.removeClass("spActive");
            $thisChild.stop().slideUp(300);

          /* else ( ナビが閉じてる ) */
          } else {
            $this.addClass("spActive");
            var top = $this.offset().top;
            var all = top + $(".drawerMenu").scrollTop() - $(window).scrollTop() - 55;
            $(".drawerMenu").animate({scrollTop:all},200);
            $thisChild.stop().slideDown(300);
          }

          return false;
        }
      }
    });
    // メインナビアコーディオン
  },
  searchBtn:function(){
    if( isBreakPoint() == "pc" && $(".devicePc").length) {
      $(".searchBtn").on("click","a",function(){
        if ($('.searchArea').hasClass('active')) {
          $('.searchArea').removeClass('active');
        } else {
          $('.searchArea').addClass('active');
        }
      });
      $(".searchArea .closeBtn").on("click","a",function(){
        $('.searchArea').removeClass('active');
      });
    }
  },
  langBtn:function(){
    if( isBreakPoint() == "pc" && $(".devicePc").length) {
      $('.langBtn, .langNav').hover(function(e){
        $('.langNav').addClass('active');
      }, function() {
        if( isBreakPoint() == "pc" && $(".devicePc").length ){
          $('.langNav').removeClass('active');
        }
      });
    } else {
      $(document).on('click', '.langBtn a', function() {
        if ($('.langNav').hasClass('active')) {
          $('.langNav').removeClass('active');
        } else {
          $('.langNav').addClass('active');
        }
      });
    }
  },
  pagetop:function(){
    if ($(window).scrollTop() > 100) {
      $("#pageTop").addClass('active');
    } else {
      $('#pageTop').removeClass('active');
    }
  },
  accordion:function() {
    $('.accordionWrapper .accordionTtl').on('click', function() {
      if ($(this).parent().hasClass('open')) {
        $(this).nextAll('.accordionInner').slideUp();
        $(this).parent().removeClass('open');
      } else {
        $(this).nextAll('.accordionInner').slideDown();
        $(this).parent().addClass('open');
      }
    });
  },
  tab:function() {
    $('.tabVoxWrapper').each(function() {
      var content = $(this).find('.tabContents');
      var btn = $(this).find('.tabs li');

      content.eq(0).show();
      btn.eq(0).addClass('active');

      btn.off('click');
      btn.on('click', function() {
        var num = btn.index(this);

        content.hide().eq(num).fadeIn(1000);
        btn.removeClass('active').eq(num).addClass('active');
      });
    });
  },
  tableScroll:function() {
    if( isBreakPoint() == "sp"){
      $('.baseBlock .tableStyle02').each(function() {
        var margin = parseInt($(this).css('margin-bottom'));
        $(this).wrap('<div class="scrollVox"' + margin + '></div>');
        $(this).css('margin-bottom', 0);
        $(this).parent('.scrollVox').css('margin-bottom', margin);
      });
    }
  }


};

/*
 * ul.indexTile横幅指定
 */
  function changeIndexTileWidth(){
    changeWrapperSize();
    $(window).on('resize', function(){
      changeWrapperSize();
    });

    function changeWrapperSize(){
      var w = $(".mainContents").width()-100;
      var colw = $(".indexTileItem").width();

      var num = Math.floor(w/colw);
      $('.indexTile').css('width',colw*num).show();
    }
  }
