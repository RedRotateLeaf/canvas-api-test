var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
        this.width = 1;
        this.height = 1;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.alpha = 1;
        this.globalAlpha = 1; //全局                             
        this.parent = null;
        this.touchEnabled = false;
        this.listeners = [];
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    //每个子类都要这么干，final
    DisplayObject.prototype.draw = function (canvas) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation); //初始化矩阵
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        canvas.globalAlpha = this.globalAlpha;
        canvas.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(canvas);
        //模板方法模式
    };
    DisplayObject.prototype.addEventListener = function (type, touchFunction, object, ifCapture, priority) {
        var touchEvent = new TouchEvents(type, touchFunction, object, ifCapture, priority);
        this.listeners.push(touchEvent);
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        this.list = [];
    }
    DisplayObjectContainer.prototype.addChild = function (child) {
        if (this.list.indexOf(child) == -1) {
            this.list.push(child);
            child.parent = this;
        }
    };
    DisplayObjectContainer.prototype.removeChild = function (child) {
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var element = _a[_i];
            if (element == child) {
                var index = this.list.indexOf(child);
                this.list.splice(index);
                return;
            }
        }
    };
    DisplayObjectContainer.prototype.removeall = function () {
        this.list = [];
    };
    DisplayObjectContainer.prototype.render = function (canvas) {
        for (var _i = 0, _a = this.list; _i < _a.length; _i++) {
            var child = _a[_i];
            child.draw(canvas);
        }
    };
    DisplayObjectContainer.prototype.hitTest = function (x, y) {
        // console.log(x);
        // console.log(y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.width;
        rect.height = this.height;
        var result = null;
        if (rect.isPointInRectangle(x, y)) {
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType && listener.capture){
            //         //TouchEventService.getInstance().addPerformer(listener.func());   //捕获
            //         //listener.func();
            //         // TouchEventService.getInstance().addPerformer(this);
            //     }
            // }
            result = this;
            TouchEventService.getInstance().addPerformer(this); //从父到子把相关对象存入数组
            for (var i = this.list.length - 1; i >= 0; i--) {
                var child = this.list[i];
                var point = new math.Point(x, y);
                var invertChildenLocalMatirx = math.invertMatrix(child.matrix);
                var pointBasedOnChild = math.pointAppendMatrix(point, invertChildenLocalMatirx);
                var hitTestResult = child.hitTest(pointBasedOnChild.x, pointBasedOnChild.y);
                //console.log(hitTestResult);
                if (hitTestResult) {
                    result = hitTestResult;
                    break;
                }
            }
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType){
            //         //listener.func();
            //         TouchEventService.getInstance().addPerformer(this);
            //     }
            // }
            //TouchEventService.getInstance().addPerformer(this);
            return result;
        }
        return null;
    };
    return DisplayObjectContainer;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.fontSize = 10;
        this.fontName = "";
    }
    TextField.prototype.render = function (canvas) {
        canvas.fillStyle = this.color;
        canvas.globalAlpha = this.alpha;
        canvas.font = this.fontSize.toString() + "px " + this.fontName.toString();
        canvas.fillText(this.text, this.x, this.y + this.fontSize);
    };
    TextField.prototype.hitTest = function (x, y) {
        // console.log("text" + x);
        // console.log("text" + y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.fontSize * this.text.length;
        rect.height = this.fontSize;
        if (rect.isPointInRectangle(x, y)) {
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else {
            return null;
        }
    };
    return TextField;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap(id) {
        var _this = this;
        _super.call(this);
        this.img = null;
        this.isLoaded = false;
        this._src = "";
        this.img = new Image();
        this.src = id;
        this.img.onload = function () {
            _this.width = _this.img.width;
            _this.height = _this.img.height;
        };
    }
    Object.defineProperty(Bitmap.prototype, "src", {
        set: function (value) {
            this._src = value;
            this.isLoaded = false;
        },
        enumerable: true,
        configurable: true
    });
    Bitmap.prototype.render = function (canvas) {
        var _this = this;
        canvas.globalAlpha = this.alpha;
        if (this.isLoaded) {
            canvas.drawImage(this.img, this.x, this.y, this.img.width * this.scaleX, this.img.height * this.scaleY);
        }
        else {
            this.img.src = this._src;
            this.img.onload = function () {
                canvas.drawImage(_this.img, _this.x, _this.y, _this.img.width * _this.scaleX, _this.img.height * _this.scaleY);
                _this.isLoaded = true;
            };
        }
    };
    Bitmap.prototype.hitTest = function (x, y) {
        console.log("image" + x);
        console.log("image" + y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.img.width;
        rect.height = this.img.height;
        if (rect.isPointInRectangle(x, y)) {
            // for(var listener of this.listeners){
            //     if(listener.type == type){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else {
            return null;
        }
    };
    return Bitmap;
}(DisplayObject));
//# sourceMappingURL=draw-api.js.map