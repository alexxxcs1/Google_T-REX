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
    init:function()
    {
        $('#mycanvas').attr('width',$('#stageSection').width());
        $('#mycanvas').attr('height',$('#stageSection').height());

        stage.Base = new createjs.Stage('mycanvas');

        stage.Width = ScreenSize.width;
        stage.Height = ScreenSize.height;

        stage.Already();
    },
    Already:function()
    {



        var handleTick = function(e)
        {
            stage.Base.update(e);
        };
        createjs.Ticker.addEventListener("tick",handleTick);
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

    $('#stageSection').css('width',640+'px');
    $('#stageSection').css('height',ScreenSize.height);

    $("#loaderScence").css('width',640+'px');
    $("#loaderScence").css('height',ScreenSize.height);
    $("#loaderScence").css('left',(ScreenSize.width-640)/2);

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
