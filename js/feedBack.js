$(function(){
    var stores = JSON.parse(localStorage.getItem('personinfo')).stores;
    var feed_store_name = stores[0].name;
    var feed_store_serial = stores[0].serial;
    toggleStore(stores,function(store_serial,store_name){
        feed_store_name  = store_name;
        feed_store_serial = store_serial;
    })
    $(".goback").click(function(){
        history.go(-1)
    });
    $("textarea").bind('input',function(){
        var num = $(this).val().length;
        $(".now-num").text(num);
        if(num >= 200){
            $('.num').addClass('active');
        }else{
            $('.num').removeClass('active');
        }
    });
    $(".reset").click(function(){
        $("textarea").val('')
        $(".now-num").text(0)
    });
    $(".submit").click(function(){
        var val = $("textarea").val();
        var reg = /[ ]/g
        val = val.replace(reg,"")
        console.log(val)
        if(val.length > 0){
            new if_access_token({
                type:'post',
                url:feedback,
                data:{
                    type: $("select").val(),
                    content: val,
                    writer:JSON.parse(localStorage.getItem('personinfo')).nickname,
                    store_name:feed_store_name,
                    store_serial:feed_store_serial
                },
                success:function(data){
                    console.log(data)
                    if(data.code === "SUCCESS"){
                        new Toast({context:$('body'),message:'反馈成功，感谢您的意见~'}).show();
                    }else{
                        new Toast({context:$('body'),message:'系统错误，请稍后再试'}).show();
                    }
                },
                error:function(){
                    new Toast({context:$('body'),message:'网络错误'}).show();
                }
            })
        }else{
            new Toast({context:$('body'),message:'请输入反馈意见'}).show();
        }
    });
})
