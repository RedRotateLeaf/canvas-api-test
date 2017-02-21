window.onload = () => {

    var canvas = document.getElementById("mycanvas") as HTMLCanvasElement;
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
    textfield.color = "#FF0000"
    textfield.scaleX = 0.8;
    textfield.scaleY = 0.8;
    textfield.alpha = 0.5;

    var textfield1 = new TextField();
    textfield1.x = 50;
    textfield1.y = 50;
    textfield1.size = 32;
    textfield1.text = "asdfasfawef";
    textfield1.color = "#FF0000"
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

    setInterval(() => {
        context2D.setTransform(1, 0, 0, 1, 0, 0);
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
        if(textfield.x<=0) {
            textfield.x++;
        }else if(textfield.x>=200){
            textfield.x--;
        }
    }, 100);
};


interface Drawable {
    type: string;
    draw(context2D: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable {
    type = null;
    x = 0;
    y = 0;
    alpha = 1;
    globalAlpha = 1;                          
    parent : DisplayObjectContainer = null;

    matrix : math.Matrix;
    globalMatrix : math.Matrix;
    scaleX : number = 1;
    scaleY : number = 1;
    rotation : number = 0;
    constructor(){
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
    }
    draw(context2D: CanvasRenderingContext2D) {
       this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);//初始化矩阵

        if(this.parent){
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
        }else{
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        context2D.globalAlpha = this.globalAlpha;
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);
        
    }
    render(context2D: CanvasRenderingContext2D){

    }
}

class DisplayObjectContainer extends DisplayObject {
    // type = null;
    array: DisplayObject[] = [];

    render(context2D: CanvasRenderingContext2D) {
        for (let gameObject of this.array) {
            gameObject.draw(context2D);
        }
    }

    addChild(displayObject: DisplayObject) {
        if (this.array.indexOf(displayObject) == -1) {
            this.array.push(displayObject);
            displayObject.parent = this;
        }
    }

    removeChild(displayObject : DisplayObject){
        var tempArray = this.array;
        for(let each of tempArray){
            if(each == displayObject){
                var index = this.array.indexOf(each);
                tempArray.splice(index);
                // this.array = tempArray;
                return;
            }
        }
    }
}

class Bitmap extends DisplayObject {
    imageID: string = null;
    imageID_temp:string = null;
    image: HTMLImageElement;
    type = "image";
    image_test = new Image();
    isLoaded = false;

    render(context2D: CanvasRenderingContext2D) {
        if(this.isLoaded) {
            context2D.drawImage(this.image_test, this.x, this.y);
        } else {
            this.image_test.src = this.imageID;
            this.image_test.onload = () => {
                context2D.drawImage(this.image_test, this.x, this.y);
                this.imageID_temp = this.imageID;
                this.isLoaded = true;
            }
        }

    }
    
}

class TextField extends DisplayObject {
    text = "";
    color = "";
    size = 12;
    style = "";
    type = "text";

    render(context2D: CanvasRenderingContext2D) {
        context2D.font = this.size + "px Arial";
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    }

}
