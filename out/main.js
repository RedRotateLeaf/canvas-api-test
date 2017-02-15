var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
window.onload = function () {
    var canvas = document.getElementById("app");
    var context2D = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();
    setInterval(function () {
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
    }, 100);
    var textfield = new TextField();
    textfield.x = 50;
    textfield.y = 50;
    textfield.text = "文字 文字 文字";
    textfield.color = "#00FFFF";
    var image = document.createElement("img");
    image.src = "picture.jpg";
    image.onload = function () {
        var mypicture = new Bitmap();
        mypicture.image = image;
        stage.addChild(mypicture);
        stage.addChild(textfield);
    };
};
var DisplayObject = (function () {
    function DisplayObject() {
        this.x = 0;
        this.y = 0;
    }
    DisplayObject.prototype.draw = function (context2D) {
    };
    return DisplayObject;
}());
var Bitmap = (function (_super) {
    __extends(Bitmap, _super);
    function Bitmap() {
        _super.apply(this, arguments);
    }
    Bitmap.prototype.draw = function (context2D) {
        context2D.drawImage(this.image, this.x, this.y);
    };
    return Bitmap;
}(DisplayObject));
var TextField = (function (_super) {
    __extends(TextField, _super);
    function TextField() {
        _super.apply(this, arguments);
        this.text = "";
        this.color = "";
        this.size = 0;
    }
    TextField.prototype.draw = function (context2D) {
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    };
    return TextField;
}(DisplayObject));
var DisplayObjectContainer = (function () {
    function DisplayObjectContainer() {
        this.array = [];
    }
    DisplayObjectContainer.prototype.draw = function (context2D) {
        for (var _i = 0, _a = this.array; _i < _a.length; _i++) {
            var drawable = _a[_i];
            drawable.draw(context2D);
        }
    };
    DisplayObjectContainer.prototype.addChild = function (displayObject) {
        this.array.push(displayObject);
    };
    return DisplayObjectContainer;
}());
//# sourceMappingURL=main.js.map