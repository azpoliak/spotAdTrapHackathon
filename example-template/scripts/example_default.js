function ExampleDefault(settings) {
    var settings = settings,
        gradientPrefix = getCssValuePrefix('backgroundImage', 'linear-gradient(left, #fff, #fff)'),
        basePath = spotgamesUtils.getScriptPath(),
        isMobile = spotgamesUtils.isMobile.any(),
        touchStartEvent = "mousedown",
        touchEndEvent = "mouseup",
        touchMoveEvent = "mousemove",
        imagesLoaded = false,
        styleLoaded = false,
        isEngaged = false,
        thisgame = this,
        detectStylesInterval, mainWrapper, btn,
        gameContainer = settings.container,
        stylesAmount, imagesForPreload = [],
        meta = '<meta name="viewport" content="user-scalable=no, initial-scale=1, width=device-width" />',
        style = ' #main-container{width: 100%; height: 100%; position: absolute; text-align: center;}#main-container.hide{visibility: hidden;}#cont-box{display: table; height: 80%; width: 100%;}#cont-box > div{height: 100%; width: 100%; display: table-cell; vertical-align: middle;}#logo{height: 15%;}#logo img, #footer img{max-height: 70%; max-width: 100%; margin: 5% 0;}#footer{height: 5%;}.font-setter{width: 100%; height: 100%;}#image img{width: 50%; max-width: 300px; max-height: 300px;}#btn{max-height: 100px; max-width: 300px; width: 40%; margin-top: 70px;}body {background-color: #FFF;font-family: sans-serif;}#startTrap {display: none;}#russianDollGame {display: block;width: 600px;height: 800px;}h1 {text-align: center;font-weight: bold;color: #F00;}#russianDoll {cursor: pointer;display: block;margin: 0 auto;padding: 0;}.dollHalves {width: 200px;}.dollHalves img {z-index: 1;width: 200px;}.dollInside img {z-index: -1;width: 200px;}#fullOfWin, #lose {width: 400px;display: none;}#fullOfWin img, #lose img {width: 400px;display: block;}',
        html = '<div id="russianDollGame"><div id="russianDoll"><div class="dollOutside"><img class="russianDollOutside" src="images/ItsATrap_Doll.png" /></div><div class="dollInside" style="display:none;"><img class="russianDollInside" src="images/ItsATrap_Screen2.jpg" /></div></div></div><div id="startTrap"> <img src="images/trap.png"/></div><div id="fullOfWin"><img src="images/win.jpg" /><img src="images/grandprize.jpg" /></div><div id="lose"><h1>better luck next time, buddy...</h1><img src="images/nicetry.jpg" /></div><script type="text/javascript">document.getElementById("russianDollGame").style.backgroundImage="url(\'images/background.jpg\')";</script>';
        
        
       
       


    if (isMobile) {
        touchStartEvent = "touchstart";
        touchEndEvent = "touchend";
        touchMoveEvent = "touchmove";
    }

    /*first function that is called to template*/
    thisgame.init = function (preload) {
        if (html) {
            stylesAmount = document.styleSheets.length;
            document.head.innerHTML += meta;
            mainWrapper = document.createElement('div');
            mainWrapper.innerHTML += '<style>' + style + '</style>' + html;
            mainWrapper.className = "hide";
            mainWrapper.id = "main-container";
            gameContainer.appendChild(mainWrapper);
        }
        //preload is something decided in the editor,
        //if you need to preload content no mather what ignore this if statement
        if (preload == 'true') {
            detectStylesInterval = setInterval(function () {
                if (document.styleSheets.length > stylesAmount) {
                    clearInterval(detectStylesInterval);
                    styleLoaded = true;
                    if (imagesLoaded) {
                        spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_INIT, thisgame.constructor.name);
                    }
                }
            }, 10);

            addImagesToArrayForLoading();
            preloadImages(imagesForPreload);

        }
        else {
            spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_INIT, thisgame.constructor.name);
        }
    };


    /*this function changes frames regarding what frame was requested*/
    thisgame.changeFrame = function (frame) {
        switch (frame) {
            case spotgames.frame_state.START_FRAME:
                return false;
            case spotgames.frame_state.PLAY_FRAME:
                break;
            case spotgames.frame_state.WIN_FRAME:
                return false;
            case spotgames.frame_state.LOSE_FRAME:
                return false;
        }
        spotgamesEventManager.dispatchEvent(spotgames.event_type.FRAME_CHANGED, thisgame.constructor.name);
    };

    var shrinkCount = 0;
	var shrinkPercentage = 0.9;
	thisgame.play = function () {
        mainWrapper.className = "";
		$().ready(function(e) {
			$('.dollOutside').on("swipe", SwipeDoll);
        });
		document.getElementById("russianDollGame").style.backgroundImage="url('images/background.jpg')";
    }
		
	function SwipeDoll(event) {
		shrinkCount += 1;
		var newHeight = $('.russianDollOutside').height() * shrinkPercentage;
		var newWidth = $('.russianDollOutside').width() * shrinkPercentage;
		$('.russianDollOutside').fadeOut().height(newHeight).width(newWidth).fadeIn();
	};

    function preloadBigImages() {
        var distinct = {};
        for (var i = 0; i < wheelItems.length; i++) {
            if (!distinct[wheelItems[i].win_item.image]) {
                var img = new Image();
                img.src = basePath + 'images/' + wheelItems[i].win_item.image;
                distinct[wheelItems[i].win_item.image] = true;
            }
        }
    }

    /*function in wich  images ,
    who are needed to be displayd and loaed,
    are added to array*/
    function addImagesToArrayForLoading() {
        if (settings.header.show == 'true')
        { imagesForPreload.push(settings.header.logo); }
    }

    /*the usual image preloader function*/
    function preloadImages(images) {
        imagesAmount = images.length;
        for (var i = 0; i < images.length; i++) {
            var img = new Image();
            img.addEventListener('load', imageLoadedCallback, false);
            img.src = basePath + 'images/' + images[i];
        }
    }

    /*the usual style preload function*/
    function imageLoadedCallback() {
        if (++imagesAmount >= imagesForPreload.length) {
            imagesLoaded = true;
            if (styleLoaded) {
                spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_INIT, thisgame.constructor.name);
            }

        }
    }

    /*requests to change current frame */
    function requestPlayFrame() {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.PLAY_FRAME_REQUESTED, thisgame.constructor.name);
    }

    /*requests to change current frame*/
    function requestWinFrame(link) {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_WIN, thisgame.constructor.name, { redirectUrl: link });
    }

    /*requests to change current frame*/
    function requestLoseFrame() {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.AD_LOSE, thisgame.constructor.name);
    }

    function requestRedirect() {
        spotgamesEventManager.dispatchEvent(spotgames.event_type.REDIRECT, thisgame.constructor.name);
    }

    function getCssValuePrefix(name, value) {
        var prefixes = ['', '-o-', '-ms-', '-moz-', '-webkit-'];
        var dom = document.createElement('div');
        for (var i = 0; i < prefixes.length; i++) {
            dom.style[name] = prefixes[i] + value;
            if (dom.style[name]) {
                return prefixes[i];
            }
            dom.style[name] = '';
        }
    }
}