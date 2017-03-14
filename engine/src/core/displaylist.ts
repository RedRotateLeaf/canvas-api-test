namespace engine {


    export type MovieClipData = {

        name : string;
        frames : MovieClipFrameData[]
    }

    export type MovieClipFrameData = {
        "image": string
    }


    export interface Drawable {
        draw(context2D: CanvasRenderingContext2D);
    }

    export abstract class DisplayObject implements Drawable{
        
        x : number = 0;
        y : number = 0;
        scaleX : number = 1;
        scaleY : number = 1;
        rotation : number = 0;

        matrix : Matrix = null;
        globalMatrix : Matrix = null;

        alpha : number = 1;//相对
        globalAlpha : number = 1;//全局                             
        parent : DisplayObject = null;

        moveSpeed : number = 0;

        touchEnable : boolean = false;

        eventArray : TheEvent[] = [];

        constructor(){

            this.matrix = new Matrix();
            this.globalMatrix = new Matrix();
        
        }
    
    
        //final，所有子类都要执行且不能修改
        draw(context2D: CanvasRenderingContext2D) {
        

        this.matrix.updateFromDisplayObject(this.x, this.y, this.scaleX, this.scaleY, this.rotation);//初始化矩阵
        //console.log(this.matrix.toString());


        //Alpha值
        if(this.parent){

            this.globalAlpha = this.parent.globalAlpha * this.alpha;
            this.globalMatrix = matrixAppendMatrix(this.matrix, this.parent.globalMatrix);

        }else{

            this.globalAlpha = this.alpha;
            this.globalMatrix = this.matrix;
        }

        context2D.globalAlpha = this.globalAlpha;
        //console.log(context2D.globalAlpha);
        
        //变换
        
        context2D.setTransform(this.globalMatrix.a, this.globalMatrix.b, this.globalMatrix.c, this.globalMatrix.d, this.globalMatrix.tx, this.globalMatrix.ty);
        this.render(context2D);

        //模板方法模式
    }

        //添加到本控件的EVent数组中
        addEventListener(type : string, func : Function, targetDisplayObject : DisplayObject, ifCapture : boolean){
        
            let e = new TheEvent(type, func, targetDisplayObject, ifCapture);
            this.eventArray.push(e);
        }

        //在子类中重写
        abstract render(context2D: CanvasRenderingContext2D);

        abstract hitTest(x : number, y : number) : DisplayObject;//返回值确定被点击的控件

    }



    export class Bitmap extends DisplayObject{
    
        image: HTMLImageElement;

        constructor() {
        
            super();
            this.image = document.createElement("img");
 
        }

        render(context2D: CanvasRenderingContext2D) {

            context2D.drawImage(this.image, 0, 0, this.image.width, this.image.height);
            //context2D.drawImage(this.image, 0, 0);
        }

        hitTest(x : number, y : number){

            var rect = new Rectangle();
            rect.x = 0;
            rect.y = 0;
            rect.width = this.image.width;
            rect.height = this.image.height;
            if(rect.isPointInRectangle(new Point(x, y))){

                if(this.eventArray.length != 0){
                
                    EventManager.getInstance().targetDisplayObjcetArray.push(this);
                }

                return this;

            }else{

                return null;
            }
    
        }
    }


    export class TextField extends DisplayObject{
    
        text: string = "";

        color : string = "";
  
        size : number = 0;

        render(context2D: CanvasRenderingContext2D) {
        
            context2D.font = "normal lighter " + this.size + "px"  + " cursive";
            context2D.fillStyle = this.color;
            context2D.fillText(this.text, 0, 0);

        }
 
        hitTest(x : number, y : number){

            var rect = new Rectangle();
            rect.x = 0;
            rect.y = -this.size;//????????
            rect.width = this.size * this.text.length;
            rect.height = this.size;

            if(rect.isPointInRectangle(new Point(x, y))){

                if(this.eventArray.length != 0){

                    EventManager.getInstance().targetDisplayObjcetArray.push(this);
                }
                return this;

            }else{

                return null;
            }
        
        }
    }


    export class Button extends DisplayObject{

        text: string = "";

        color : string = "";

        size : number = 0;

        enable : boolean = false;
 
        render(context2D: CanvasRenderingContext2D) {
        
            context2D.font = "normal lighter " + this.size + "px"  + " cursive";
            context2D.fillStyle = this.color;
            context2D.fillText(this.text, 0, 0);

        }

        hitTest(x : number, y : number){

            var rect = new Rectangle();
            rect.x = 0;
            rect.y = -this.size;//????????
            rect.width = this.size * this.text.length;
            rect.height = this.size;

            if(rect.isPointInRectangle(new Point(x, y)) && this.enable){

                if(this.eventArray.length != 0){

                    EventManager.getInstance().targetDisplayObjcetArray.push(this);
                }
                return this;

            }else{

                return null;
            }    
        }

        addEventListener(type : string, func : Function, targetDisplayObject : DisplayObject, ifCapture : boolean){
        
            let e = new TheEvent(type, func, targetDisplayObject, ifCapture);
            this.eventArray.push(e);
        }
    
    }
    


    export class DisplayObjectContainer extends DisplayObject{
    
        children : DisplayObject[] = [];

        render(context2D : CanvasRenderingContext2D){

            for (let displayObject of this.children) {

                displayObject.draw(context2D);
            } 
        }
 
        addChild(child : DisplayObject){

            this.children.push(child);
            child.parent = this;

        }

        removeChild(displayObject : DisplayObject){

            var tempArray = this.children.concat();
            for(let each of tempArray){

                if(each == displayObject){

                    var index = this.children.indexOf(each);
                    tempArray.splice(index, 1);
                    this.children = tempArray;
                    return;
                }
            }
        }

        hitTest(x : number, y : number){

            if(this.eventArray.length != 0){

                EventManager.getInstance().targetDisplayObjcetArray.push(this);
            }

            for(var i = this.children.length - 1; i >= 0; i--){

                var child = this.children[i];
                var pointBaseOnChild = pointAppendMatrix(new Point(x, y), invertMatrix(child.matrix));//通过与逆矩阵相乘得出点的相对坐标---点向量
                var hitTestResult = child.hitTest(pointBaseOnChild.x, pointBaseOnChild.y);//树的遍历
            
                if(hitTestResult){
                                
                    return hitTestResult;
                }
            }

            return null;
        }

    }


    export class MovieClip extends Bitmap {

        private advancedTime: number = 0;

        private static FRAME_TIME = 20;

        private static TOTAL_FRAME = 12;

        private currentFrameIndex: number;
  
        private data: MovieClipData;
        
        isMove : boolean = false;

        constructor(data : MovieClipData) {
            
            super();
            this.moveSpeed = 2;
            this.setMovieClipData(data);//先执行一次更新
            this.play();
        }

        ticker = (deltaTime) => {
            
            this.advancedTime += deltaTime;
            if (this.advancedTime >= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME) {
                this.advancedTime -= MovieClip.FRAME_TIME * MovieClip.TOTAL_FRAME;
            }
            this.currentFrameIndex = Math.floor(this.advancedTime / MovieClip.FRAME_TIME);

            let data = this.data;

            console.log(this.currentFrameIndex);
            this.image.src = data.frames[this.currentFrameIndex].image;
        }

        play() {

            Ticker.getInstance().register(this.ticker);
        }

        stop() {

            Ticker.getInstance().unregister(this.ticker)
        }

        setMovieClipData(data: MovieClipData) {
            this.data = data;
            this.currentFrameIndex = 0;

        }
    }

}