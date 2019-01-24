$(function(){
    var palletData = new pallet_data();
    var SetTagInListener = function(rfid){//放入商品
        palletData.SetTagInListener(rfid)
    }
    var SetTagOutListener = function(rfid){//拿出商品
        palletData.SetTagOutListener(rfid)
    }
    palletData.init();
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        cordova.plugins.TfPlugin.SetTagInListener(SetTagInListener);
        cordova.plugins.TfPlugin.SetTagOutListener(SetTagOutListener);
        cordova.plugins.TfPlugin.BeginCapture();
    }
    FastClick.attach(document.body);
    $(".goback").click(function(){//返回
        cordova.plugins.TfPlugin.EndCapture();
        history.go(-1)
    })
    $(".nav").delegate(".option","click",function(){
        var style_serial = $(this).attr("style_serial");
        palletData.player($(".item[style_serial="+style_serial+"]"))
    })
    $(".nav").delegate(".option .details","click",function(event){
        $(this).parent(".option").toggleClass("active");
        if($(this).html() === "查看详情"){
            $(this).html("查看缩略图")
        }else{
            $(this).html("查看详情")
        }
        event.stopPropagation()
    })
    $(".main").delegate(".item","click",function(){
        $(this).removeClass("active").find("video")[0].pause();
    })
    $(".main").delegate(".top li","click",function(event){
        var index = $(this).index();
        $(this).addClass("active").siblings("li").removeClass("active");
        $(this).parents(".top").siblings(".bottom").find(".banner_details").eq(index).addClass("active").siblings(".banner_details").removeClass("active");
    })
    $(".exit").click(function(){
        palletData.endInit();
    })
    $(".button.submit").click(function(){
        palletData.getData();
    })
    $(".button.cancel").click(function(){
        $(".mask").removeClass("active");
    })
    $(".main").delegate(".play","click",function(event){
        palletData.player($(this).parents(".item"))
        event.stopPropagation()
    })
    $(".flag_in").click(function(){
        var rfid =  $(".flag_input").val();
        SetTagInListener(rfid);
    })
    $(".flag_out").click(function(){
        var rfid =  $(".flag_input").val();
        SetTagOutListener(rfid)
    })
    $(".checklist").delegate(".isbuy","click",function(){
        var val = $(this).val()
        if(val == 0){
            $(this).parent('.rightint').siblings(".nobuyboxmask").css("display","block");
        }
    })
    $(".checklist").delegate(".remove","click",function(){
        $(this).parents(".nobuyboxmask").css("display","none");
    })
    $(".checklist").delegate(".removebtn","click",function(){
        $(this).parents(".nobuyboxmask").css("display","none");
    })
})
