var ScreenSize = {width:640,height:1040};

var BaseUrl = 'http://packy.club/gitProject/Google_T-REX/';

var pageLock=true;
function pageScoll(e)
{
    if(pageLock)
    {
        e.preventDefault(); //阻止页面滑动动作
    }
}
//添加测试注释
function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

var load_list={
    'img':[
        {'name':'tree','src':'tree.png'},
        {'name':'Trex','src':'Trex.png'},
        
    ],
    'group':[
        // {'name':'bkg','type':'.jpg','endid':'4','srcname':'bkg'},
    ]
};

var stage =
{
    Width:640,
    Height:1040,
    Base:null,
    TreeCon:null,
    Tree:null,
    TreeSlideTime:5000,
    TRexSheet:null,
    TRex:null,
    TRexState:{
        jumping:false,
    },
    init:function()
    {
        $('#mycanvas').attr('width',$('#stageSection').width());
        $('#mycanvas').attr('height',$('#stageSection').height());

        stage.Base = new createjs.Stage('mycanvas');
        stage.TreeCon = new createjs.Container();
        stage.Base.addChild(stage.TreeCon);

        stage.Width = ScreenSize.width;
        stage.Height = ScreenSize.height;

        stage.Already();
    },
    Already:function()
    {
        
        stage.CreateTree();
        var data = {
            images: [LoadedRes.Trex],
            frames: {width:123, height:130},
            animations: {
                run:[0,1],
            }
        };
        stage.TRexSheet = new createjs.SpriteSheet(data);
        stage.TRex = new createjs.Sprite(stage.TRexSheet, "run");

        stage.TRex.set(
            {
                x:stage.Width/4,
                y:stage.Height/2 +5,
                regX:stage.TRex.getBounds().width/2,
                regY:stage.TRex.getBounds().height,
            });
        stage.TRex.framerate = 20;

        stage.Base.addChild(stage.TRex);

        
        $('#stageSection').click(function()
        {

            if (!stage.TRexState.jumping) {
                stage.TRexState.jumping = true;
                var TreeTween = new createjs.Tween.get(stage.TRex)
                                                    .to({y:stage.TRex.y-300},500,createjs.Ease.circOut)
                                                    .to({y:stage.TRex.y},500,createjs.Ease.circIn)
                                                    .call(function()
                                                    {
                                                        stage.TRexState.jumping = false;
                                                    });
            }

        })

        var handleTick = function(e)
        {
            stage.Base.update(e);
            stage.checkHit();
        };
        createjs.Ticker.addEventListener("tick",handleTick);
        createjs.Ticker.timingMode =  createjs.Ticker.RAF_SYNCHED;
        createjs.Ticker.setFPS(60);
    },
    TreeLoop:function()
    {
        var randomScale = Math.random()*2+1;
        stage.Tree = new createjs.Bitmap(LoadedRes.tree);
        stage.Tree.set(
            {
                x:stage.Width+stage.Tree.getBounds().width,
                y:stage.Height/2,
                regX:stage.Tree.getBounds().width/2,
                regY:stage.Tree.getBounds().height,
                scaleX:randomScale,
                scaleY:randomScale,
            });
        var tmpTween = new createjs.Tween.get(stage.Tree)
                                         .to({x:-stage.Tree.getBounds().width},stage.TreeSlideTime)
                                         .call(function()
                                         {         
                                            stage.TreeSlideTime-=10;
                                            stage.TreeCon.removeChild(tmpTween.target);
                                         });
        stage.TreeCon.addChild(stage.Tree);
    },
    CreateTree:function()
    {
        stage.TreeLoop();
        var randomTime = Math.random()*4+1;
        setTimeout(function()
        {
            stage.CreateTree();
        },(stage.TreeSlideTime/8)*randomTime)
    },
    checkHit:function()
    {
        // for (var i = 0; i < stage.TreeCon.children.length; i++) {
        //     var tmp = stage.TreeCon.children[i].globalToLocal(stage.TreeCon.children[i].x, stage.TreeCon.children[i].y);
        //     var hit = stage.TreeCon.children[i].hitTest(0, 0);
        //     console.log(tmp,hit);
        // };
    }
}

$(document).ready(function()
{
    document.body.addEventListener('touchmove',function(e)
    {
        pageScoll(e);
    },false);

    ScreenSize.width = window.innerWidth;
    ScreenSize.height = window.innerHeight;

    $('#stageSection').css('width',ScreenSize.width);
    $('#stageSection').css('height',ScreenSize.height);

    $("#loaderScence").css('width',ScreenSize.width);
    $("#loaderScence").css('height',ScreenSize.height);

    if (GetQueryString('testmode')=='true') {
        loaderClass=new ResLoader(BaseUrl,true,5500,''); // 服务器项目地址，调试模式，本地服务器接口，项目名字
    }else{
        loaderClass=new ResLoader(BaseUrl,false);// 线上
    }

    loaderClass.load(load_list,function(process){
               $("#process").html(process+"%");				//把进度显示在id为process的section上
           },function(){
       stage.init();
       $("#loaderScence").fadeOut(1000);
   });
});
