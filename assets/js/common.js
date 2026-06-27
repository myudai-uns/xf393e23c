/* Index
------------------------------------------
User Agent 2014/08/14 修正
SP View 2014/09/24 追加
Image Rollover
Smooth Scroll
Header SearchBox Placeholder
Activation of Local Navigation
IE6-7 RightIcon
Synchro Hover
------------------------------------------ */

/* =================================================================

	User Agent

================================================================= */
var uaFlg = 1;

var uaMedia = [
	'iPhone',
	'iPod',
	'iPad',
	'Android'
];
var ua = navigator.userAgent;

var uaPattern = new RegExp(uaMedia.join('|'), 'i');
if (uaPattern.test(ua)) {
	// iPhone
	if (ua.indexOf('iPhone') != -1 && ua.indexOf('iPad') == -1 && ua.indexOf('iPod') == -1) {
		uaFlg = 2;
	// iPod
	} else if (ua.indexOf('iPod') != -1) {
		uaFlg = 2;
	// iPad
	} else if (ua.indexOf('iPad') != -1) {
		uaFlg = 3;
	// Android Phone
	} else if (ua.indexOf('Android') != -1 && ua.indexOf('Mobile') != -1) {
		uaFlg = 2;
	// Android Tablet
	} else if (ua.indexOf('Android') != -1) {
		uaFlg = 3;
	}
}

// Tabletの設定 2014/08/14
if(uaFlg == 3) {
	var viewport = '<meta name="format-detection" content="telephone=no">\n'+
					'<meta name="viewport" content="width=1030, maximum-scale=1.6, user-scalable=yes" >';
	$("head").append(viewport);

	$(function(){
		$("body").addClass("sptb");
	});
}

/* =================================================================

	SP View

================================================================= */
var isSPView = (window.innerWidth ? window.innerWidth : document.documentElement.clientWidth) > 640 ? false : true;

/* =================================================================

	Image Rollover

================================================================= */
$(function(){
	var cls = "rollover";

	if (uaFlg != 1) return;

	preloadImg();
	imgRollover();

	function preloadImg () {
		var preload = new Array();

		$("img." + cls + ", input[type='image']." + cls).each(function(){
			var path = $(this).attr("src");
			var ext = path.slice(path.length-4, path.length);
			preload.push(path.replace(ext, "_on"+ext));
		});

		for(var i=0; i<preload.length; i++) {
			$("<img>").attr("src", preload[i]);
		}
	}

	function imgRollover () {
		$("img." + cls + ", input[type='image']." + cls).hover(function() {
			if($(this).parent("a").is("." + cls)) {return;}
			var path = $(this).attr("src");
			var ext = path.slice(path.length-4, path.length);
			$(this).attr("src", $(this).attr("src").replace(ext, "_on" + ext));

		}, function() {
			if($(this).parent("a").is("." + cls)) {return;}
			var path = $(this).attr("src");
			var ext = path.slice(path.length-4, path.length);
			$(this).attr("src", $(this).attr("src").replace("_on" + ext, ext));
		});

		$("a." + cls).hover(function() {
			$(this).children("." + cls).each(function() {
				var path = $(this).attr("src");
				var ext = path.slice(path.length-4, path.length);
				$(this).attr("src", $(this).attr("src").replace(ext, "_on" + ext));
			});

		}, function() {
			$(this).children("." + cls).each(function() {
				var path = $(this).attr("src");
				var ext = path.slice(path.length-4, path.length);
				$(this).attr("src", $(this).attr("src").replace("_on" + ext, ext));
			});
		});
	}
});

/* =================================================================

	Smooth Scroll

================================================================= */
$(function(){
    $("a[href^=#]").click(function() {
        var speed = 300;
        var href= $(this).attr("href");
        var target = $(href == "#" || href == "" ? "html" : href);
        var position = target.offset().top;
		var html = "html";
		if (navigator.userAgent.match(/Chrome|Safari/)) {
    	    html = "body";
		}
        $(html).animate({scrollTop:position}, speed, "swing");
        return false;
    });
});

/* =================================================================

	Header SearchBox Placeholder

================================================================= */
$(function(){
	var phTxt = "検索";
	var phColor = "#999999";
	var searchBox = $("#header .searchTxt");
	var searchBtn = $("#header .searchBtn");

	if (!searchBox || !searchBtn) {return;}

	searchBox.val(phTxt).css({color: phColor});

	searchBox.
	focus(function() {
		if (searchBox.val() == phTxt) {
			$(this).val("").css({color: ""});
		}
	}).
	blur(function() {
		if (searchBox.val() == "") {
			$(this).val(phTxt).css({color: phColor});
		} else if (searchBox.val() == phTxt) {
			$(this).css({color: ""});
		}
	}).
	closest("form").submit(function() {
		if (searchBox.val() == phTxt) {
			searchBox.val("");
		}
	});
});

/* =================================================================

	Activation of Local Navigation

================================================================= */
$(function(){
	var lnavi = $("#lNavi .naviBlock");
	if (lnavi.length == 0) {return;}

	$("ul ul", lnavi).hide();

	var path = window.location.pathname.replace(/index\.(.+)/g, "");

	$("a", lnavi).each(function(){
		var href = $(this).attr("href");
		if (href.match(/\/index\.(.+)/) && !(href.match(/(^http)/))) {
			this.href = this.href.replace(/\/index\.html/, "/");
		}
	});

	var dir = path.split("/");
	var curDir = "";
	var matchPath = false;
	for(var i=dir.length; i>=2; i--){
		curDir = dir[i];
		if (dir[i] == "") return;
		var comparisonPath = path.replace(curDir, "").replace(/\/\/(.*)/g, "/");
		if (!matchPath) {
			$('a[href$="' + comparisonPath + '"]', lnavi).each(function() {
				if ($(this).siblings("ul").length > 0) {
					$(this).closest("li").addClass("current");
					$(this).parent("li").find("ul").show();
				}
				if ($(this).parents("ul").length > 0) {
					$(this).parents("li").addClass("current");
					$(this).parents("ul").show();
				}
				matchPath = true;
			});
		}
	}
});

/* =================================================================

	IE6-7 RightIcon

================================================================= */
$(function(){
	var icoArray = [
		"linkWin",
		"linkPdf",
		"linkJpg",
		"linkDl"
	];

	var lnavIcoArray = [
		"win",
		"pdf"
	];

	var uaType = window.navigator.userAgent.toLowerCase();

	if(uaType.indexOf("msie 7") >= 0){
		for (key in icoArray) {
			var icoHtml = '<span class="'+icoArray[key]+'Obj">&nbsp;</span>';
			$("a span."+icoArray[key]).each(function() {
				$(this).css({background: "none", paddingRight: 0}).append(icoHtml);
			});
		}

		for (key in lnavIcoArray) {
			var icoHtml = '<span class="'+lnavIcoArray[key]+'Obj">&nbsp;</span>';
			$("#lNavi li."+lnavIcoArray[key]).each(function() {
				$(this).children("a").children("span").css({background: "none", paddingRight: 0}).append(icoHtml);
			});
		}
	}
});

/* =================================================================

	Synchro Hover

================================================================= */
$(function(){
	if (uaFlg != 1) return;

	var syHoverElem = $(".syHover");

	syHoverElem.hover(function() {
		$(this).find("a").css({"textDecoration": "underline"}).find("img").css({"opacity": 0.7});
	}, function() {
		$(this).find("a").css({"textDecoration": ""}).find("img").css({"opacity": ""});
	});
});
