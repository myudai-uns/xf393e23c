// navi

$(function(){
var menu = $('.slide_menu'), // スライドインするメニューを指定
    menuBtn = $('.slide_menu_trigger'), // メニューボタンを指定
    body = $(document.body),
    menuWidth = menu.outerWidth();

    // メニューボタンをクリックした時の動き
    menuBtn.on('click', function(){
    // body に open クラスを付与する
    body.toggleClass('open');
        if(body.hasClass('open')){
            // open クラスが body についていたらメニューをスライドインする
            body.animate({'right' : menuWidth }, 300);
            menu.animate({'right' : 0 }, 300);
        } else {
            // open クラスが body についていなかったらスライドアウトする
            menu.animate({'right' : -menuWidth }, 300);
            body.animate({'right' : 0 }, 300);
        }
    menuBtn.toggleClass('close');
    });
});



// page scrool

$(function(){
    var pageup = $('#pageup');
    $(window).scroll(function () {
        if ($(this).scrollTop() > 200) {
            pageup.fadeIn();
        } else {
            pageup.fadeOut();
        }
    });

    // #で始まるアンカーをクリックした場合に処理（lity対応：data-lity属性は除外）
    $('a[href^="#"]').not('[data-lity]').click(function() {
        // スクロールの速度
        var speed = 400; // ミリ秒
        // アンカーの値取得
        var href= $(this).attr("href");
        // 移動先を取得
        var target = $(href == "#" || href == "" ? 'html' : href);
        // 移動先がない場合は処理しない（lity要素など）
        if(!target.length || target.hasClass('lity-hide')) return true;
        // 移動先を数値で取得
        var position = target.offset().top;
        // スムーススクロール
        $('body,html').animate({scrollTop:position}, speed, 'swing');
        return false;
    });
});



// ===== UX Enhancement: Global Animations =====

$(function(){

    // --- Header shadow on scroll ---
    $(window).on('scroll', function(){
        if($(this).scrollTop() > 10){
            $('header').addClass('is-scrolled');
        } else {
            $('header').removeClass('is-scrolled');
        }
    });

    // --- Scroll entrance animation ---
    // Auto-apply animation classes to content elements
    var targets = [
        { sel: '#main h2',                   cls: 'anim-fade' },
        { sel: '#main h3',                   cls: 'anim-fade' },
        { sel: '#main div.img',              cls: 'anim-fade' },
        { sel: '#main div.btn',              cls: 'anim-fade' },
        { sel: '#main dl.list_table',        cls: 'anim-fade' },
        { sel: '#main dl.list_table_history dt', cls: 'anim-fade-left' },
        { sel: '#main table',                cls: 'anim-fade' },
        { sel: '#main ul.company_menu li',   cls: 'anim-fade' },
        { sel: '#main ul.recruit_menu li',   cls: 'anim-fade' },
        { sel: '#main ul.list_img li',       cls: 'anim-fade' },
        { sel: '#main div.border',           cls: 'anim-fade' },
        { sel: '#main div.fill',             cls: 'anim-fade' },
        { sel: '#sidebar',                   cls: 'anim-fade' }
    ];

    // Apply animation classes (skip if already has js-fade from recruit page)
    $.each(targets, function(i, t){
        $(t.sel).each(function(){
            if(!$(this).hasClass('js-fade') && !$(this).hasClass('js-fade-scale') && !$(this).hasClass('js-fade-left') && !$(this).hasClass('js-fade-right')){
                $(this).addClass(t.cls);
            }
        });
    });

    // Add stagger delays to company_menu / recruit_menu items
    $('#main ul.company_menu li, #main ul.recruit_menu li').each(function(i){
        var delay = Math.min(i, 4);
        $(this).addClass('anim-delay-' + delay);
    });

    // Observe scroll
    var $anims = $('.anim-fade, .anim-fade-left');
    function checkAnims(){
        var winBottom = $(window).scrollTop() + $(window).height() * 0.88;
        $anims.each(function(){
            if($(this).offset().top < winBottom){
                $(this).addClass('is-visible');
            }
        });
    }
    $(window).on('scroll resize', checkAnims);
    // Initial check (with small delay for page load)
    setTimeout(checkAnims, 100);

});


// ===== megaNav: hover-only with sticky "lastActive" while inside drawerMenu =====
$(function(){
    var $items = $('.megaNavParent > li.parent');
    if(!$items.length) return;
    // ページ読込時は必ず閉じた状態にする（遷移直後にメニュー/バックドロップが残らないように）
    $items.removeClass('tabActive tbWideActive megaOpen');

    // ロード直後（遷移直後）はカーソルがナビ上にあっても開かない。
    // ユーザーが実際にマウスを動かして初めて hover を有効化する。
    var armed = false;
    $(document).one('mousemove', function(){ armed = true; });

    // When cursor enters a parent: mark it as currently-open, clear siblings.
    // 【仕様分離】スマホ(≤767)では megaOpen を発動させない＝他項目を消さず全項目を常時表示。
    //           タブレット/PC(≥768)は従来どおり（ホバーで該当だけ展開・他は消えてOK）。
    $items.on('mouseenter', function(){
        if(!armed) return;
        if(window.innerWidth < 768) return;
        $items.removeClass('megaOpen');
        $(this).addClass('megaOpen');
    });

    // When cursor leaves the entire header (.drawerMenu/.globalHeader): clear all.
    $('.drawerMenu, .globalHeader').on('mouseleave', function(){
        $items.removeClass('megaOpen');
    });

    // クリックでページ遷移する際はメガメニューを閉じる（megaOpen/バックドロップを残さない）
    $('.megaNav').on('click', 'a[href]', function(){
        $items.removeClass('megaOpen tabActive tbWideActive');
    });
});


// ===== Mobile hamburger toggle (independent of main.js, which fails on this page) =====
// NOTE: main.js も #acdBtn に click ハンドラを付与しており、両方走るとトグルが相殺されて
// ドロワーが開いた直後に閉じる現象が発生する。ここで .off('click') により先行ハンドラを
// 全てクリアしてから登録し、このハンドラ単独で動作させる。
$(function(){
    var $btn = $('#acdBtn');
    var $drawer = $('.drawerMenu');
    var $body = $('body');
    if(!$btn.length || !$drawer.length) return;

    $btn.off('click').on('click', function(e){
        e.preventDefault();
        e.stopImmediatePropagation();
        var opening = !$btn.hasClass('spActive');
        $btn.toggleClass('spActive');
        $drawer.toggleClass('spActive');
        $body.toggleClass('drawer-open', opening);
    });

    // Close drawer when an in-drawer link is tapped (so navigation feels natural)
    $drawer.on('click', 'a', function(){
        $btn.removeClass('spActive');
        $drawer.removeClass('spActive');
        $body.removeClass('drawer-open');
    });
});