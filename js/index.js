// 首页轮播
$(function(){
    if(localStorage.getItem('personinfo')){
        var personinfo = JSON.parse(localStorage.getItem('personinfo'));
        var stores = JSON.parse(localStorage.getItem('personinfo')).stores;
        $(personinfo.permissions).each(function(){
            eval('$(".'+this+'").addClass("active")')
        })
        $(".switch_account").html('<img src="'+dataimgsrc(personinfo.head_image,UsersdomainL)+'">'+personinfo.nickname);
        if(stores.length<=1){
            $(".storename").html(stores[0].name)
        }else{
            $(".storename").html('经销商')
        }
    }//权限

    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        cordova.plugins.TfPlugin.CheckBT(OnCheckBT);
    }
    function OnCheckBT(result){
        if(result === "yes"){
            $(".Bluetooth").text("取消看货盘连接")
        }else{
            $(".Bluetooth").text("连接看货盘")
        }
    }
    var swiper = new Swiper('.banner', {
        pagination: '.swiper-pagination',
        paginationClickable: true,
        autoplay: 3000,
        autoplayDisableOnInteraction: false,
        loop:true,
        lazyLoading : true
    });
    $(".about").click(function(){//关于我们
        window.location.href = "html/about.html"
    })
    $(".watch_statistics").click(function(){//看货统计
        window.location.href = "html/Statistics.html"
    })
    $(".watch_records").click(function(){//看货记录
        window.location.href = "html/palletRecord.html"
    })
    $(".feedback").click(function(){//意见反馈
        if(localStorage.getItem('access_token'))
            window.location.href = "html/feedBack.html"
        else
            toggleusername()
    })
    $(".search").click(function(){//看货记录
        if($(".Bluetooth").text() === "取消看货盘连接"){
            window.location.href = "html/search.html"
        }else{
            new Toast({context:$('body'),message:'请先连接看货盘'}).show();
        }
    })
    $(".switch_account").click(function(){
        toggleusername()
    })
    $(".regulating_power").click(function(){//调节功率
        if($(".Bluetooth").text() === "取消看货盘连接"){
            regulatingPower()
        }else{
            new Toast({context:$('body'),message:'请先连接看货盘'}).show();
        }
    })
    $("header .exit").click(function(){
        exitLogin()
    })
    $(".Start").click(function(){//开始看货
        if($(".Bluetooth").text() === "取消看货盘连接"){
            if(localStorage.getItem('access_token'))
                window.location.href = "html/item.html"
            else
                toggleusername()
        }else{
            new Toast({context:$('body'),message:'请先连接看货盘'}).show();
        }
    })
    var checkbt;
    $(".Bluetooth").click(function(){//链接看后盘
        clearInterval(checkbt);
        if($(this).text() === "连接看货盘"){
            cordova.plugins.TfPlugin.ConnectBT();
        }else{
            cordova.plugins.TfPlugin.DisconnectBT();
        }
        checkbt = setInterval(function(){
            cordova.plugins.TfPlugin.CheckBT(OnCheckBT);
        },1000)
    })
    document.body.addEventListener('touchstart', function () {});
    $(".nav-button").click(function(){
        $(this).toggleClass("nav-button-i");
        $(".nav").toggle(400);
    })
})

