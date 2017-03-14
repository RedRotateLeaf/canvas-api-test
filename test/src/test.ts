var canvas = document.getElementById("app") as HTMLCanvasElement;
var stage = engine.run(canvas);

engine.Ticker.getInstance().register((deltaTime) => {

    console.log(deltaTime);
    button.y = button.y + deltaTime / 10;

});

//第二层容器
var panel = new engine.DisplayObjectContainer();
panel.x = 120;
panel.y = 50;
panel.alpha = 0.5;

//按钮
var button = new engine.Button();
button.x = 10;
button.y = 30;
button.text = "点我";
button.color = "#FF0000"
button.size = 20;
button.enable = true;
button.addEventListener("onclick", ()=>{

    button.text = "欧尼酱";     

},this,false);

var word2 = new engine.TextField();
word2.text = "第二层容器"
word2.color = "#0000FF"
word2.size = 30;

var list = new engine.DisplayObjectContainer();
list.addEventListener("onmousemove", (e : MouseEvent) =>{

    var dy = engine.currentY - engine.lastY;
    list.y = list.y + dy;

}, this, false);


//帧动画
var idleData : engine.MovieClipData = {

    name : "111",

    frames : [
        {"image" : "playerIdle1.jpg"},
        {"image" : "playerIdle1.jpg"},
        {"image" : "playerIdle1.jpg"},
        {"image" : "playerIdle1.jpg"},
        {"image" : "playerIdle1.jpg"},
        {"image" : "playerIdle1.jpg"},
        {"image" : "playerIdle2.jpg"},
        {"image" : "playerIdle2.jpg"},
        {"image" : "playerIdle2.jpg"},
        {"image" : "playerIdle2.jpg"},
        {"image" : "playerIdle2.jpg"},
        {"image" : "playerIdle2.jpg"}

    ]

}

var moveData : engine.MovieClipData = {

    name : "111",

    frames : [
        {"image" : "playerMove1.jpg"},
        {"image" : "playerMove1.jpg"},
        {"image" : "playerMove1.jpg"},
        {"image" : "playerMove1.jpg"},
        {"image" : "playerMove1.jpg"},
        {"image" : "playerMove1.jpg"},
        {"image" : "playerMove2.jpg"},
        {"image" : "playerMove2.jpg"},
        {"image" : "playerMove2.jpg"},
        {"image" : "playerMove2.jpg"},
        {"image" : "playerMove2.jpg"},
        {"image" : "playerMove2.jpg"}

    ]

}

var player = new engine.MovieClip(idleData);
player.image.src = "player1.jpg";
player.image.width = 100;
player.image.height = 100;
player.x = 300;

stage.addEventListener("onclick", (e : MouseEvent) =>{

    if(!player.isMove){

        player.isMove = true;
        player.setMovieClipData(moveData);
        
        this.moveTimer = setInterval(function(){
                
        if(Math.abs(player.x - e.offsetX) < player.moveSpeed && Math.abs(player.x - e.offsetX) < player.moveSpeed){
            
            player.x = e.offsetX;
            player.y = e.offsetY;
            player.isMove = false;
            player.setMovieClipData(idleData);
            clearInterval(this.moveTimer);
        }
                

        if(player.x >= e.offsetX){
                    
            player.x = player.x - player.moveSpeed;
                
        }else{
                    
            player.x = player.x + player.moveSpeed;
        }
                
        if(player.y >= e.offsetY){
                    
            player.y = player.y - player.moveSpeed;
                
        }else{
                    
            player.y = player.y + player.moveSpeed;
                
        }

    }, 50);


   }else{
       
       clearInterval(this.moveTimer);
       //player.setMovieClipData(idleData);

       this.moveTimer = setInterval(function(){
                
        if(Math.abs(player.x - e.offsetX) < player.moveSpeed && Math.abs(player.x - e.offsetX) < player.moveSpeed){
            
            player.x = e.offsetX;
            player.y = e.offsetY;
            player.isMove = false;
            player.setMovieClipData(idleData);
            clearInterval(this.moveTimer);
        }
                

        if(player.x >= e.offsetX){
                    
            player.x = player.x - player.moveSpeed;
                
        }else{
                    
            player.x = player.x + player.moveSpeed;
        }
                
        if(player.y >= e.offsetY){
                    
            player.y = player.y - player.moveSpeed;
                
        }else if(player.y < e.offsetY){
                    
            player.y = player.y + player.moveSpeed;
                
        }

    }, 100);

    player.isMove = true;
       
    }

    //engine.Tween.moveTo(player, e.offsetX, e.offsetY);
    //engine.Tween.removeTween(player);
    //player.setMovieClipData();

}, this, false);




//图片
var avater = new engine.Bitmap();
avater.image.src = "avater.jpg";


//加载完图片资源
avater.image.onload = () => {



    stage.addChild(avater);
    //list.addChild(button);
        
    //panel.addChild(word2);

    //list.addChild(player);

    stage.addChild(player);
    //stage.addChild(panel);

    

        
}


//vertexShaderSourceCode : 顶点着色器，决定形状  模型-决定数据
//fragmentShaderSourceCode ： 片元着色器，决定颜色   材质-决定数据



