namespace engine {

        export class Tween {

        private moveTimer;

        private object : engine.MovieClip;

        moveTo(object : engine.MovieClip, targetX : number, targetY : number){

            this.object = object;

            //开启移动线程
            this.moveTimer = setInterval(function(){
                
                if(Math.abs(object.x - targetX) < object.moveSpeed && Math.abs(object.x - targetX) < object.moveSpeed){

                    object.x = targetX;
                    object.y = targetY;
                    object.isMove = false;
                    clearInterval(this.moveTimer);
                }
                

                if(object.x >= targetX){
                    
                    object.x = object.x - object.moveSpeed;
                
                }else{
                    
                    object.x = object.x + object.moveSpeed;
                }
                
                if(object.y >= targetY){
                    
                    object.y = object.y - object.moveSpeed;
                
                }else if(object.y < targetY){
                    
                    object.y = object.y + object.moveSpeed;
                
                }
            
            }, 100);

        }


        removeTween(){

            if(this.moveTimer){

                this.object.isMove = false;
                clearInterval(this.moveTimer);   
            }


        }
    }
}

