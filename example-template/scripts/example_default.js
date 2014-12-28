﻿function ExampleDefault(settings) {
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
        style = 'body{background-color: #FFF; font-family: sans-serif;} #startTrap {display: none;} #russianDollGame {display: block; width: 600px; height: 800px;} h1 {text-align: center; font-weight: bold; color: #F00;} #russianDoll {cursor: pointer; display: block; margin: 0 auto; padding: 0;} .dollHalves {width: 200px;} .dollHalves img {z-index: 1; width: 200px;} .dollInside img {z-index: -1; width: 200px;} #fullOfWin, #lose {width: 400px; display: none;} #fullOfWin img, #lose img {width: 400px; display: block;}',
        html = '<div id="russianDollGame"><div id="russianDoll"><div class="dollOutside"><img class="russianDollOutside" src="images/ItsATrap_Doll.png" /></div><div class="dollInside" style="display:none;"><img class="russianDollInside" src="images/ItsATrap_Screen2.jpg" /></div></div></div><div id="startTrap"> <img src="images/trap.png"/></div><div id="fullOfWin"><img src="images/win.jpg" /><img src="images/grandprize.jpg" /></div><div id="lose"><h1>better luck next time, buddy...</h1><img src="images/nicetry.jpg" /></div>';
        
       
       


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
            	break;
            case spotgames.frame_state.PLAY_FRAME:
                setFooterFontSize();
                break;
            case spotgames.frame_state.WIN_FRAME:
                break;
            case spotgames.frame_state.LOSE_FRAME:
                break;
        }
        spotgamesEventManager.dispatchEvent(spotgames.event_type.FRAME_CHANGED, thisgame.constructor.name);
    };

    thisgame.play = function () {
        mainWrapper.className = "";
        gameContainer.addEventListener(touchStartEvent, sendEngage, false);
        btn = gameContainer.querySelector('#btn');
        btn.addEventListener(touchEndEvent, requestRedirect, false);
    }

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

    function sendEngage() {
        gameContainer.addEventListener(touchStartEvent, sendEngage, false);
        console.log('is engaged');
        if (!isEngaged) {
            isEngaged = true;
            spotgamesEventManager.dispatchEvent(spotgames.event_type.ENGAGE_START, thisgame.constructor.name);
        }
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


    //add background depending on settings
    function addBackground(stats) {
        var bg = '';
        if (stats.type.value == "image") {
            bg = '#main-container{background-image:' + 'url(' + basePath + 'images/' + stats.image + ');}';
        }
        else {
            bg = '#main-container{background:' + gradientPrefix + 'linear-gradient(' + stats.gradiant_start + ', ' + stats.gradiant_end + ');}';
        }
        return bg;
    }


    //add header content depending on settings
    function setHeader(stats) {
        var head = '';
        if (stats.show == 'true') {
            head = '<div id="logo" style="text-align:' + stats.align.value + ';"> <img src="' + basePath + 'images/' + stats.logo + '" style="margin:' + calculateMarginFromFreeSpace(0.15, 0.7) + 'px 0"/></div>';
        }
        return head;
    }
    
    //calculates marging from avaliable space
    function calculateMarginFromFreeSpace(boxHeightInPrecent,contentMaxHeight) {
        var allAviHeight = gameContainer.offsetHeight;
        var boxHeight = allAviHeight * boxHeightInPrecent;
        var contentHeight = boxHeight * contentMaxHeight;
        var freeSpace = boxHeight - contentHeight;
        return Math.floor(freeSpace/2) ;
    }

    //add footer content depending on settings
    function setFooter(stats) {
        var footer = '';
        if (stats.show == 'true') {
            if (stats.type.value == "image") {
                footer = '<div id="footer" style="text-align:' + stats.align.value + ';"> <img src="' + basePath + 'images/' + stats.logo + '" /></div>';
            }
            else {
                footer = '<div id="footer" style="text-align:' + stats.align.value + ';"><div class="font-setter" style="font-size:' + stats.size.value + ';">' + stats.text + '</div></div>';
            }
        }
        return footer;
    }


    //add footer content depending on settings
    function setMainImage(stats) {
        var image = '';
        if (stats.show == 'true') {
            image = '<div id="image"> <img src="' + basePath + 'images/' + stats.image + '" /></div>';
        }
        return image;
    }

    function setFooterFontSize() {
        var footer = gameContainer.querySelector('#footer');
        footer.style.fontSize = Math.floor(gameContainer.offsetHeight *0.05 *0.8) + 'px';
    }
}