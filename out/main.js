var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var canvas = document.getElementById("mycanvas");
    var context2D = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();
    var panel = new DisplayObjectContainer();
    panel.x = 100;
    panel.y = 100;
    panel.alpha = 0.5;
    var textfield = new TextField();
    textfield.x = 50;
    textfield.y = 50;
    textfield.size = 32;
    textfield.text = "文字 文字 文字";
    textfield.color = "#FF0000";
    textfield.scaleX = 0.8;
    textfield.scaleY = 0.8;
    textfield.alpha = 0.5;
    var textfield1 = new TextField();
    textfield1.x = 50;
    textfield1.y = 50;
    textfield1.size = 32;
    textfield1.text = "asdfasfawef";
    textfield1.color = "#FF0000";
    textfield1.alpha = 2;
    var mypicture = new Bitmap();
    mypicture.imageID = "picture.jpg";
    mypicture.alpha = 1;
    // mypicture.rotation = 30;
    var mypicture1 = new Bitmap();
    mypicture1.imageID = "picture.jpg";
    mypicture1.alpha = 0.5;
    stage.addChild(mypicture);
    stage.addChild(textfield);
    panel.addChild(mypicture1);
    panel.addChild(textfield1);
    stage.addChild(panel);
    setInterval(function () {
        context2D.setTransform(1, 0, 0, 1, 0, 0);
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
        if (textfield.x <= 0) {
            textfield.x++;
        }
        else if (textfield.x >= 200) {
            textfield.x--;
        }
    }, 100);
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.type = null;
        this.x = 0;
        this.y = 0;
        this.alpha = 1;
        this.globalAlpha = 1;
        this.parent = null;
        this.scaleX = 1;
        this.scaleY = 1;
        this.rotation = 0;
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    DisplayObject.prototype.draw = function (context2D) {
        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation); //初始化矩阵
        if (this.parent) {
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }
        else {
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
    };
    DisplayObject.prototype.render = function (context2D) {
    };
    return DisplayObject;
}());
var DisplayObjectContainer = (function (_super) {
    __extends(DisplayObjectContainer, _super);
    function DisplayObjectContainer() {
        _super.apply(this, arguments);
        // type = null;
        this.array = [];
    }
    DisplayObjectContainer.prototype.render = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var gameObject = _a[_i];
            gameObject.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        if (this.array.indexOf(displayObject) == -1) {
            this.array.push(displayObject);
            displayObject.parent = this;
        }
    };
    DisplayObjectContainer.prototype.removeChild = function (displayObject) {
        var tempArray = this.array;
        for (var _i = 0, tempArray_1 = tempArray; _i < tempArray_1.length; _i++) {
            var each = tempArray_1[_i];
            if (each == displayObject) {
                var index = this.array.indexOf(each);
                tempArray.splice(index);
                // this.array = tempArray;
                return;
            }
        }
    };
    return DisplayObjectContainer;
}(DisplayObject));
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
        this.imageID = null;
        this.imageID_temp = null;
        this.type = "image";
        this.image_test = new Image();
        this.isLoaded = false;
    }
    Bitmap.prototype.render = function (context2D) {
        var _this = this;
        if (this.isLoaded) {
            context2D.drawImage(this.image_test, this.x, this.y);
        }
        else {
            this.image_test.src = this.imageID;
            this.image_test.onload = function () {
                context2D.drawImage(_this.image_test, _this.x, _this.y);
                _this.imageID_temp = _this.imageID;
                _this.isLoaded = true;
            };
        }
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.size = 12;
        this.style = "";
        this.type = "text";
    }
    TextField.prototype.render = function (context2D) {
        context2D.font = this.size + "px Arial";
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    };
    return TextField;
}(DisplayObject));
//# sourceMappingURL=main.js.map