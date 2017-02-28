interface Drawable {
    draw(canvas: CanvasRenderingContext2D);
}

abstract class DisplayObject implements Drawable {



    x = 0;
    y = 0;
    width = 1;
    height = 1;
    scaleX : number = 1;
    scaleY : number = 1;
    rotation : number = 0;

    matrix : math.Matrix ;
    globalMatrix : math.Matrix ;

    alpha  = 1;
    globalAlpha  = 1;//全局                             
    parent :  DisplayObjectContainer =null;

    touchEnabled:boolean =false;
    listeners : TouchEvents[] = [];


     constructor(){
        this.matrix = new math.Matrix();
        this.globalMatrix = new math.Matrix();
     }

    



    //每个子类都要这么干，final
    draw(canvas: CanvasRenderingContext2D) {
        this.matrix.updateFromDisplayObject(this.x,this.y, this.scaleX, this.scaleY, this.rotation);//初始化矩阵
        
        if(this.parent){
            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = math.matrixAppendMatrix(this.matrix, this.parent.globalMatrix);
           
      
        }else{
            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }
        canvas.globalAlpha = this.globalAlpha;
        canvas.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(canvas);

        //模板方法模式
    }
   abstract    render(context2D: CanvasRenderingContext2D)

     addEventListener(type : TouchEventsType,touchFunction : Function,object : any,ifCapture? : boolean,priority?: number){
        var touchEvent = new TouchEvents(type,touchFunction,object,ifCapture,priority);
        this.listeners.push(touchEvent);
    }
abstract hitTest(x : number,y : number):DisplayObject 
}



class DisplayObjectContainer extends DisplayObject  {
    list: DisplayObject[] = [];

    

    addChild(child: DisplayObject) {
        if (this.list.indexOf(child) == -1) {
            this.list.push(child);
            child.parent = this;
        }
    }
    removeChild(child: DisplayObject) {
        for (var element of this.list) {
            if (element == child) {
                var index = this.list.indexOf(child);
                this.list.splice(index);
                return;
            }
        }
    }

     removeall() {

        this.list = [];

    }

    render(canvas: CanvasRenderingContext2D) {
        for (var child of this.list) {
            child.draw(canvas);
        }
    }
   hitTest(x : number,y: number) : DisplayObject{
        // console.log(x);
        // console.log(y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.width;
        rect.height = this.height;
        var result = null;
        if(rect.isPointInRectangle(x,y)){
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType && listener.capture){
            //         //TouchEventService.getInstance().addPerformer(listener.func());   //捕获
            //         //listener.func();
            //         // TouchEventService.getInstance().addPerformer(this);
            //     }
            // }
            result = this;
            TouchEventService.getInstance().addPerformer(this);//从父到子把相关对象存入数组


            for(let i = this.list.length - 1;i >= 0;i--){
                var child = this.list[i];
                var point = new math.Point(x,y);
                var invertChildenLocalMatirx = math.invertMatrix(child.matrix);
                var pointBasedOnChild = math.pointAppendMatrix(point,invertChildenLocalMatirx);
                var hitTestResult = child.hitTest(pointBasedOnChild.x,pointBasedOnChild.y);
                //console.log(hitTestResult);
                if(hitTestResult){
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
    }


}



class TextField extends DisplayObject {
    text = "";
    color = "";
    fontSize = 10;
    fontName = "";
    render(canvas: CanvasRenderingContext2D) {
        canvas.fillStyle = this.color;
        canvas.globalAlpha = this.alpha;
        canvas.font = this.fontSize.toString() + "px " + this.fontName.toString();
        canvas.fillText(this.text, this.x, this.y + this.fontSize);
    }
     hitTest(x : number,y :number){
        // console.log("text" + x);
        // console.log("text" + y);
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.fontSize * this.text.length;
        rect.height = this.fontSize;
        if(rect.isPointInRectangle(x,y)){
            // for(var listener of this.listeners){
            //     if(listener.type == TouchEventService.currentType){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else{
            return null;
        }
    }
}

class Bitmap extends DisplayObject {
    private img: HTMLImageElement = null;
    private isLoaded = false;

    constructor(id : string) {
       super();
        this.img = new Image();
        this.src = id;
        this.img.onload = () =>{
            this.width = this.img.width;
            this.height = this.img.height;
        }
    }
    private _src = "";
    set src(value: string) {
  
        this._src = value;
        this.isLoaded = false;
    }

    render(canvas: CanvasRenderingContext2D) {
        canvas.globalAlpha = this.alpha;
        if (this.isLoaded) {
            canvas.drawImage(this.img, this.x, this.y, this.img.width * this.scaleX, this.img.height * this.scaleY);
        }
        else {
           
            this.img.src = this._src;

            this.img.onload = () => {
                canvas.drawImage(this.img, this.x, this.y, this.img.width * this.scaleX, this.img.height * this.scaleY);
                this.isLoaded = true;
            }
        }
    }
    hitTest(x : number,y :number){
        console.log("image" + x);
        console.log("image" + y);
        
        var rect = new math.Rectangle();
        rect.x = rect.y = 0;
        rect.width = this.img.width;
        rect.height = this.img.height;
        if(rect.isPointInRectangle(x,y)){
            // for(var listener of this.listeners){
            //     if(listener.type == type){
            //         listener.func();
            //     }
            // }
            TouchEventService.getInstance().addPerformer(this);
            return this;
        }
        else{
            return null;
        }
    }
}