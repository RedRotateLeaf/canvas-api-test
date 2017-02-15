window.onload = () => {

    var canvas = document.getElementById("app") as HTMLCanvasElement;
    var context2D = canvas.getContext("2d");
    var stage = new DisplayObjectContainer();

    setInterval(() => {
        context2D.clearRect(0, 0, canvas.width, canvas.height);
        stage.draw(context2D);
    }, 100)

    var textfield = new TextField();
    textfield.x = 50;
    textfield.y = 50;
    textfield.text = "文字 文字 文字";
    textfield.color = "#00FFFF"
    
    var image = document.createElement("img");
    image.src = "picture.jpg";
    image.onload = () => {
        var mypicture = new Bitmap();
        mypicture.image = image;
        stage.addChild(mypicture);
        stage.addChild(textfield);
    }
};


interface Drawable{
    draw(context2D: CanvasRenderingContext2D);
}

class DisplayObject implements Drawable{
    x : number = 0;
    y : number = 0;
    
    draw(context2D: CanvasRenderingContext2D) {

    }
}


class Bitmap extends DisplayObject{
    image: HTMLImageElement;

    draw(context2D: CanvasRenderingContext2D) {
        context2D.drawImage(this.image, this.x, this.y);
    }
}

class TextField extends DisplayObject{
    text: string = "";
    color : string = "";
    size : number = 0;

    draw(context2D: CanvasRenderingContext2D) {
        context2D.fillStyle = this.color;
        context2D.fillText(this.text, this.x, this.y);
    }

}

class DisplayObjectContainer implements Drawable {
    array: Drawable[] = [];

    draw(context2D : CanvasRenderingContext2D) {
        for (let drawable of this.array) {
            drawable.draw(context2D);
        }
    }

    addChild(displayObject : DisplayObject){
        this.array.push(displayObject);
    }
}

