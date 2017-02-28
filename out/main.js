var _this = this;
window.onload = function () {
    var currentTarget; //鼠标点击时当前的对象
    var startTarget; //mouseDown时的对象
    var isMouseDown = false;
    var startPoint = new math.Point(-1, -1);
    var movingPoint = new math.Point(0, 0);
    var canvas = document.getElementById("context");
    var context2d = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();
    var Container = new DisplayObjectContainer();
    var myPhoto = new Bitmap("myPhoto.jpg");
    var myPhoto2 = new Bitmap("1.png");
    myPhoto.alpha = 0.5;
    stage.addChild(Container);
    Container.addChild(myPhoto);
    Container.addChild(myPhoto2);
    stage.draw(context2d);
    stage.addEventListener(TouchEventsType.MOUSEDOWN, function () {
        console.log("stage");
    }, _this);
    Container.addEventListener(TouchEventsType.MOUSEMOVE, function () {
        // console.log("container");
    }, _this);
    myPhoto.addEventListener(TouchEventsType.MOUSEMOVE, function () {
        if (currentTarget == startTarget) {
            Container.x += (TouchEventService.stageX - movingPoint.x);
            Container.y += (TouchEventService.stageY - movingPoint.y);
            console.log("myP");
        }
    }, _this);
    myPhoto2.addEventListener(TouchEventsType.CLICK, function () {
        alert("OnClick!!!");
        console.log("2");
    }, _this);
    window.onmousedown = function (e) {
        var x = e.offsetX - 3;
        var y = e.offsetY - 3;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        startPoint.x = x;
        startPoint.y = y;
        movingPoint.x = x;
        movingPoint.y = y;
        TouchEventService.currentType = TouchEventsType.MOUSEDOWN;
        currentTarget = stage.hitTest(x, y);
        startTarget = currentTarget;
        TouchEventService.getInstance().toDo();
        //  console.log(stage.globalMatrix);
        //console.log(currentTarget);
        //TouchEventService.getInstance().clearList();
        isMouseDown = true;
        //console.log(TouchEventService.currentType);
    };
    window.onmouseup = function (e) {
        var x = e.offsetX - 3;
        var y = e.offsetY - 3;
        TouchEventService.stageX = x;
        TouchEventService.stageY = y;
        var target = stage.hitTest(x, y);
        //console.log(target);
        if (target == currentTarget) {
            TouchEventService.currentType = TouchEventsType.CLICK;
        }
        else {
            TouchEventService.currentType = TouchEventsType.MOUSEUP;
        }
        TouchEventService.getInstance().toDo();
        //TouchEventService.getInstance().clearList();
        //console.log(TouchEventService.currentType);
        currentTarget = null;
        isMouseDown = false;
    };
    window.onmousemove = function (e) {
        if (isMouseDown) {
            var x = e.offsetX - 3;
            var y = e.offsetY - 3;
            TouchEventService.stageX = x;
            TouchEventService.stageY = y;
            TouchEventService.currentType = TouchEventsType.MOUSEMOVE;
            console.log(TouchEventService.currentType);
            currentTarget = stage.hitTest(x, y);
            TouchEventService.getInstance().toDo();
            movingPoint.x = x;
            movingPoint.y = y;
        }
    };
    setInterval(function () {
        context2d.save();
        context2d.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2d);
        context2d.restore();
    }, 60);
};
//# sourceMappingURL=main.js.map