namespace engine{

    //记录位置
    export var currentX : number;
    export var currentY : number;
    export var lastX : number;
    export var lastY : number;

    export let run = (canvas: HTMLCanvasElement) => {

        var stage = new DisplayObjectContainer();
        let context2D = canvas.getContext("2d");
        let lastNow = Date.now();

        let frameHandler = () => {
            
            let now = Date.now();
            let deltaTime = now - lastNow;
            Ticker.getInstance().notify(deltaTime);
            
            context2D.clearRect(0, 0, 400, 400);
            context2D.save();
            stage.draw(context2D);
            context2D.restore();
            lastNow = now;
            window.requestAnimationFrame(frameHandler);
        }
    
        window.requestAnimationFrame(frameHandler);




        var isMouseDown = false;//检测鼠标是否按下
        var hitResult : DisplayObject;//检测是否点到控件

        window.onmousedown = (e)=>{
            
            isMouseDown = true;
            let targetDisplayObjectArray = EventManager.getInstance().targetDisplayObjcetArray;
            targetDisplayObjectArray.splice(0,targetDisplayObjectArray.length);
            hitResult = stage.hitTest(e.offsetX, e.offsetY);
            currentX = e.offsetX;
            currentY = e.offsetY;
        }



        window.onmousemove = (e)=>{
            
            let targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
            lastX = currentX;
            lastY = currentY;
            currentX = e.offsetX;
            currentY = e.offsetY;

            if (isMouseDown) {

                for (let i = 0; i < targetDisplayObjcetArray.length; i++) {

                    for (let event of targetDisplayObjcetArray[i].eventArray) {
                    
                        if (event.type.match("onmousemove") && event.ifCapture) {

                             event.func(e);
                        }
                    }
                }

                for (let i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {

                    for (let event of targetDisplayObjcetArray[i].eventArray) {

                        if (event.type.match("onmousemove") && !event.ifCapture) {

                            event.func(e);
                        }
                    }
                }
            }
        }


        window.onmouseup = (e)=>{

            isMouseDown = false;
            let targetDisplayObjcetArray = EventManager.getInstance().targetDisplayObjcetArray;
            targetDisplayObjcetArray.splice(0,targetDisplayObjcetArray.length);
            let newHitRusult = stage.hitTest(e.offsetX, e.offsetY)

            for (let i = targetDisplayObjcetArray.length - 1; i >= 0; i--) {

                for (let event of targetDisplayObjcetArray[i].eventArray) {

                    if (event.type.match("onclick") && newHitRusult == hitResult ) {

                        event.func(e);
                    }
                }
            }
        }


        return stage;

    }



}
