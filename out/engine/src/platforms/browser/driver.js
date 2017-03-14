var engine;
(function (engine) {
    engine.run = function (canvas) {
        var stage = new engine.DisplayObjectContainer();
        var context2D = canvas.getContext("2d");
        var lastNow = Date.now();
        var frameHandler = function () {
            var now = Date.now();
            var deltaTime = now - lastNow;
            engine.Ticker.getInstance().notify(deltaTime);
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.draw(context2D);
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        };
        window.requestAnimationFrame(frameHandler);
        var isMouseDown = false; //检测鼠标是否按下
        var hitResult; //检测是否点到控件
        window.onmousedown = function (e) {
            isMouseDown = true;
            var targetDisplayObjectArray = engine.EventManager.getInstance().targetDisplayObjcetArray;
            targetDisplayObjectArray.splice(0, targetDisplayObjectArray.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            engine.currentX = e.offsetX;
            engine.currentY = e.offsetY;
        };
        window.onmousemove = function (e) {
            var targetDisplayObjcetArray = engine.EventManager.getInstance().targetDisplayObjcetArray;
            engine.lastX = engine.currentX;
            engine.lastY = engine.currentY;
            engine.currentX = e.offsetX;
            engine.currentY = e.offsetY;
            if (isMouseDown) {
                for (var i = 0; i < targetDisplayObjcetArray.length; i++) {
                    for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                        var event_1 = _a[_i];
                        if (event_1.type.match("onmousemove") && event_1.ifCapture) {
                            event_1.func(e);
                        }
                    }
                }
                for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
                    for (var _b = 0, _c = targetDisplayObjcetArray[i].eventArray; _b < _c.length; _b++) {
                        var event_2 = _c[_b];
                        if (event_2.type.match("onmousemove") && !event_2.ifCapture) {
                            event_2.func(e);
                        }
                    }
                }
            }
        };
        window.onmouseup = function (e) {
            isMouseDown = false;
            var targetDisplayObjcetArray = engine.EventManager.getInstance().targetDisplayObjcetArray;
            targetDisplayObjcetArray.splice(0, targetDisplayObjcetArray.length);
            var newHitRusult = stage.hitTest(e.offsetX, e.offsetY);
            for (var i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {
                for (var _i = 0, _a = targetDisplayObjcetArray[i].eventArray; _i < _a.length; _i++) {
                    var event_3 = _a[_i];
                    if (event_3.type.match("onclick") && newHitRusult == hitResult) {
                        event_3.func(e);
                    }
                }
            }
        };
        return stage;
    };
})(engine || (engine = {}));
//# sourceMappingURL=driver.js.map