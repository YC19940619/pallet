//定义接口
//域名
var domainL = "https://com.api.lovecantouch.com";
var UsersdomainL = "https://mch.api.lovecantouch.com";
// var domainL = "http://com.apidev.lovecantouch.com";
// var UsersdomainL = "http://mch.apidev.lovecantouch.com";
// var domainL = "http://192.168.3.66:9120";
var records= domainL+'/records';
var chartdata= domainL+'/chartdata';
var rfidurl = domainL+'/rfids/';
var norfidurl = domainL+'/un/rfids/';//查看rfid 无需登录
var store_styles= domainL+'/store/styles';//门店款式被砍列表
var store_auth= UsersdomainL+'/store/auth';//门店登录
var distributor_auth= UsersdomainL+'/auth';//经销商和导购登录 获取token
var auth_refresh_token= UsersdomainL+'/auth/refresh_token';//刷新token
var users_me= UsersdomainL+'/users/me';//查询用户信息
var feedback= domainL+'/feedback'
var app_check = 'https://www.pgyer.com/apiv2/app/check' //查询蒲公英的版本信息
var Request = { //获取url地址参数
    QueryString: function(val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : "");
    }
}

//加载完取消启动页
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.addEventListener("backbutton", onBackKeyDown, false);
}
function onBackKeyDown() {
    new Toast({context:$('body'),message:('再点击一次退出!')}).show();
    document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
    document.addEventListener("backbutton", exitApp, false);//绑定退出事件
    // 3秒后重新注册
    var intervalID = window.setInterval(function() {
        window.clearInterval(intervalID);
        document.removeEventListener("backbutton", exitApp, false); // 注销返回键
        document.addEventListener("backbutton", onBackKeyDown, false); // 返回键
    }, 3000);
}
function exitApp(){
    navigator.app.exitApp();
}
//秒数转换成时分秒
function formatSeconds(value) {
    var secondTime = parseInt(value);// 秒
    var minuteTime = 0;// 分
    var hourTime = 0;// 小时
    if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if(minuteTime > 60) {
            //获取小时，获取分钟除以60，得到整数小时
            hourTime = parseInt(minuteTime / 60);
            //获取小时后取佘的分，获取分钟除以60取佘的分
            minuteTime = parseInt(minuteTime % 60);
        }
    }
    var result = "" + parseInt(secondTime) + "秒";

    if(minuteTime > 0) {
        result = "" + parseInt(minuteTime) + "分" + result;
    }
    if(hourTime > 0) {
        result = "" + parseInt(hourTime) + "小时" + result;
    }
    return result;
}
//时间戳转换格式
function date(date){
    date = new Date(date * 1000)
    var year = date.getFullYear();
    var month = date.getMonth()+1;    //js从0开始取
    var date1 = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();
    if(month<10){
        month='0'+month
    }
    if(date1<10){
        date1='0'+date1
    }
    if(hour<10){
        hour='0'+hour
    }
    if(minutes<10){
        minutes='0'+minutes
    }
    if(second<10){
        second='0'+second
    }
    return year+"年"+month+"月"+date1+"日"+hour+"时"+minutes +"分"+second+"秒"
}
//排序
function compare(property){
    return function(a,b){
        var value1 = a[property];
        var value2 = b[property];
        return value2 - value1;
    }
}
//图片地址
function dataimgsrc(src,domain){
    if(src.indexOf("http") === -1 && src.indexOf("https") === -1 ){
        if(src.indexOf("media") > -1){
            src =domain+src;
        }else{
            src =domain+"/media/"+src;
        }
    }
    return src
}

//模拟安卓弹窗
var Toast = function(config) {
    this.context = config.context == null ? $('body') : config.context; //������
    this.message = config.message; //��ʾ����
    this.time = config.time == null ? 3000 : config.time; //����ʱ��
    this.left = config.left; //��������ߵľ���
    this.top = config.top; //�������Ϸ��ľ���
    this.init();
}
var msgEntity;
Toast.prototype = {
    init: function() {
        $("#toastMessage").remove();
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage">');
        msgDIV.push('<span style="font-size:16px;">' + this.message + '</span>');
        msgDIV.push('</div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //������Ϣ��ʽ
        var left = this.left == null ? this.context.width()/2 - msgEntity.find('span').width() /2-10 : this.left;
        var top = this.top == null ? this.context.height() / 2 - msgEntity.find('span').height() / 2 : this.top;
        msgEntity.css({
            'position': 'absolute',
            'top': top,
            'z-index': '999999',
            'left': left,
            'background-color': 'black',
            'color': 'white',
            'font-size': '16px',
            'padding': '10px 10px',
            'border-radius':'3px'

        });
        msgEntity.hide();
    },
    show: function() {
        msgEntity.fadeIn(this.time / 2);
        msgEntity.fadeOut(this.time / 2);
    }
}
//随机数
function RndNum(n) {
    var rnd = "";
    for(var i = 0; i < n; i++)
        rnd += Math.floor(Math.random() * 10);
    return rnd;
}
//模仿confirm弹窗
function show_confirm(info, callback) { //两个参数：info为需要显示的内容,callback为回调函数
    var content = '<div class="show_info_contain" id="contain-info-show"><div class="show_info_content">'+info
        +'</div><div class="show_info_confirm_cancel tr" id="show_info_confirm_cancel"><a href="javascript:void(0);" id="confirm-info-show" class="btn btn1">取消</a><a href="javascript:void(0);" id="cancel-info-show" class="btn btn2">确认</a></div></div>'
    $('body .show_info_contain').remove()
    $('body').append(content);
    $('#show_info_confirm_cancel').click(function(e) {
        if(e.target === $("#cancel-info-show")[0]) {
            $('#contain-info-show').remove();
            callback.call(this, true);
        } else if(e.target === $("#confirm-info-show")[0]) {
            $('#contain-info-show').remove();
            callback.call(this, false);
        }
    });
}

function Base64() {
    // private property
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    // public method for encoding
    this.encode = function (input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding
    this.decode = function (input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding
    _utf8_encode = function (string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding
    _utf8_decode = function (utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while ( i < utftext.length ) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i+1);
                c3 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
function exitLogin(){
    var serial = localStorage.getItem('serial')
    localStorage.clear();
    if(serial)
        localStorage.setItem('serial',serial)
    if(document.title === '首页'){
        window.location.href = "log.html"
    }else if(document.title === 'echart'){
        parent.location.href = "../log.html"
    }else{
        window.location.href = "../log.html"
    }
}
function toggleStore(stores,callback,type){
    stores = stores || JSON.parse(localStorage.getItem('personinfo')).stores;
    var now_store_serial = stores[0].serial;
    var now_store_name = stores[0].name;//默认第一家店
    if(type==='all'){
        var store_serials = [];
        stores.forEach(function(item){
            store_serials.push(item.serial);
        });
        store_serials = store_serials.join(',');
        now_store_serial = store_serials;
        now_store_name = '全部';//默认所有店
    }
    var str = '<div class="mchnav"><p class="mchname" store_serial="'+now_store_serial+'">当前选择：'+now_store_name+'</p><div class="mchlist">' +
        '<p class="selecting">'+now_store_name+'</p><ul class="select-ul">'
        if(type==='all'){
            str+='<li store_serial="'+now_store_serial+'">'+now_store_name+'</li>'
        }
        $(stores).each(function(){
            str+='<li store_serial="'+this.serial+'">'+this.name+'</li>'
        })
        str +='</ul></div></div>';
    $("header p").remove();
    $("header").append(str);
    $(".mchlist").click(function(){
        $(this).toggleClass("down");
    })
    $(".mchlist li").click(function(){
        var serial = $(this).attr("store_serial");
        if($(this).text() !== $(".selecting").html()){
            $(".selecting").html($(this).text());
            $(".mchname").html("当前选择："+$(this).text()).attr("store_serial",$(this).attr("store_serial"))
            callback(serial,$(this).text())
        }
    })
}
function storeAuth(username , password){
    if(username && password){
        $.ajax({
            type:'post',
            url:store_auth,
            data:{
                serial:username,
                password:password
            },
            success:function(data){
                console.log(data)
                if(data.code === "SUCCESS"){
                    localStorage.setItem('serial',data.data.serial)
                    localStorage.setItem('users',JSON.stringify(data.data.users))
                    window.location.href = 'index.html'
                }else if(data.code === "user.INVALID_SERIAL"){
                    new Toast({context:$('body'),message:'账号错误'}).show();
                }else if(data.code === "user.PASSWORD_NOT_MATCH"){
                    new Toast({context:$('body'),message:'密码错误'}).show();
                }else{
                    new Toast({context:$('body'),message:'账号或密码错误'}).show();
                }
            },
            error: function () {
                new Toast({context: $('body'), message: '网络错误'}).show();
            }
        })
    }else{
        new Toast({context:$('body'),message:'请输入账号密码'}).show();
    }
}
function toggleusername(){
    var data = JSON.parse(localStorage.getItem('users'))
    if(data){
        var str = '<div class="maskUsername"><div class="toggleUsername"><p class="title">切换角色</p><div class="group"><span class="iconfont">&#xe61c;</span>'+
            '<select id="Usernames" value="'+data[0].role__name+'-'+data[0].account+'">'
        $(data).each(function(){
            str +='<option value="'+this.role__name+'-'+this.account+'">'+this.role__name+'-'+this.account+'</option>'
        })
        str +='</select></div><div class="group"><span class="iconfont">&#xe64c;</span><input type="password" class="Password" placeholder="输入密码"></div><p class="loginbtn">登录</p></div></div>'
        $("body").append(str);
        $(".maskUsername .loginbtn").click(function(){
            var val = $(".toggleUsername #Usernames").val().split('-')
            var account = val[val.length-1];
            var password = $(".toggleUsername .Password").val();
            auth(account,password)
        })
        $(".maskUsername .toggleUsername").click(function(event){
            event.stopPropagation()
        })
        $(".maskUsername").click(function(){
            $(".maskUsername").remove()
        })
    }
}
function auth(account,password){//导购经销商登录获取token
    if(account && password){
        $.ajax({
            type:'post',
            url:distributor_auth,
            data:{
                account:account,
                password:password,
                sys:'commodity'
            },
            success:function(data){
                console.log(data)
                if(data.code === "SUCCESS"){
                    var access_token = data.data.access_token;
                    var refresh_token = data.data.refresh_token;
                    localStorage.setItem('access_token',access_token);
                    localStorage.setItem('refresh_token',refresh_token);
                    usersMe(access_token)
                }else if(data.code === "user.INVALID_ACCOUNT"){
                    new Toast({context:$('body'),message:'账号错误'}).show();
                }else if(data.code === "user.PASSWORD_NOT_MATCH"){
                    new Toast({context:$('body'),message:'密码错误'}).show();
                }else if(data.code === "user.SYS_REFUSED"){
                    new Toast({context:$('body'),message:'该用户不允许登录此系统'}).show();
                }else{
                    new Toast({context:$('body'),message:'账号或密码错误'}).show();
                }
            },
            error:function(){
                new Toast({context:$('body'),message:'网络错误'}).show();
            }
        })
    }else{
        new Toast({context:$('body'),message:'请输入账号密码'}).show();
    }
}
function usersMe(access_token){
    new if_access_token({
        type:'get',
        url:users_me,
        data:{},
        beforeSend:function(XMLHttpRequest){
            //console.log(XMLHttpRequest)
        },
        success:function(data){
            if(data.code === "SUCCESS"){
                console.log(data)
                localStorage.setItem('personinfo',JSON.stringify(data.data));
                window.location.href = "index.html"
            }else{
                new Toast({context:$('body'),message:'获取信息失败'}).show();
            }
        },
        error:function(){
            new Toast({context:$('body'),message:'网络错误'}).show();
        }
    })
}
var if_access_token = function(obj){
    this.obj = obj;
    this.code = true;
    if( !this.goAjax(obj) ){
        this.goAjax(obj)
    }
};
if_access_token.prototype = {
    goAjax:function(obj){
        var params = {
            type:obj.type || 'get',//类型
            url:obj.url,//地址
            async: false,
            beforeSend: obj.beforeSend,
            data:obj.data || {},//发送数据
            success:function(data){
                //console.log(data)
                if(data.code.indexOf("ACCESS_TOKEN_EXPIRES") >0 ){
                    that.code = false
                    that.refreshToken()
                }else{//access_token未过期的回调
                    obj.success(data)
                }
            },
            error:obj.error
        }
        var access_token = 'Bearer '+localStorage.getItem('access_token');
        if(!obj.access_token){
            params.headers = {
                "Authorization": access_token || ""
            }
        }
        var that = this;
        $.ajax(params)
        return this.code
    },
    refreshToken:function(){
        var that = this;
        $.ajax({
            type:'get',
            url:auth_refresh_token,
            async: false,
            data:{
                refresh_token:localStorage.getItem('refresh_token')
            },
            success:function(data){
                if(data.code === "SUCCESS"){
                    access_token = data.data.access_token;
                    localStorage.setItem('access_token',access_token);
                }else{
                    that.code = true;
                    new Toast({context:$('body'),message:'身份信息已过期，请重新登录'}).show();
                    setTimeout(function(){
                        exitLogin()
                    },1000)
                }
            },
            error: function () {
                new Toast({context: $('body'), message: '网络错误'}).show();
            }
        })
    }
}
//调节功率
function regulatingPower(){
    var maxnum = 27;//最大功率
    var minnum = 15;//最小功率
    var num = sessionStorage.getItem('num') || 15;
    var proportion = (num-minnum)/(maxnum-minnum);//比例
    console.log(proportion)
    var str = '<div class="maskPower"><div class="powerbox"><p class="title">当前功率：'+num+'</p><div class="power"><div class="powerrun" style="width:'
        +proportion*100+'%;"></div><div class="notice" style="left:'
        +proportion*100+'%;">'+num+'</div><div class="powerbtn" style="left:'
        +proportion*100+'%;"></div></div><div class="numnotice"><span class="left">'+minnum+'</span><span class="right">'+maxnum+'</span></div><p class="button submit">提交</p><p class="button cancel">取消</p></div></div>';
    $('body').append(str)
    $(".maskPower").click(function(){
        $('.maskPower').remove();
    })
    $(".cancel").click(function(){
        $('.maskPower').remove();
    })
    $(".submit").click(function(){
        cordova.plugins.TfPlugin.SetPower(num);
        sessionStorage.setItem('num',num)
        setTimeout(function(){
            $('.maskPower').remove();
            new Toast({context:$('body'),message:'成功设置看货盘功率为'+num}).show();
        },1000)
    })
    var powerbtn =  $(".powerbtn");
    var power = $(".power");
    var powerrun = $(".powerrun");
    var notice = $(".notice");
    var title = $(".title");
    $(".powerbox").click(function(event){
        event.stopPropagation()
    })
    powerbtn.on('touchstart',function(){
        event.stopPropagation()
    })
    powerbtn.on('touchmove',function(){
        var X = event.targetTouches[0].pageX-$(".powerrun").offset().left;//滑动的位置
        if(X <= power.width() && X>=0){
            btnproportion = X/power.width();
            powerbtn.css({
                left:btnproportion*100+'%'
            })
            powerrun.css({
                width:btnproportion*100+'%'
            })
            notice.css({
                left:btnproportion*100+'%'
            })
        }
        num = Math.round(btnproportion*(maxnum-minnum))+minnum;
        notice.html(num);
        title.html('当前功率：'+num);
    })
    powerbtn.on('touchend',function(){
        console.log(num)
    })
}
//16进制转字符串
var ToString = function(){}
ToString.prototype = {
    hexToString:function(str){
        var arr = this.groupArray(str);    //将16进制字符串进行每两个分组
        var val = "";
        for (var i = 0; i < arr.length; i++) {
            val += String.fromCharCode(parseInt(arr[i], 16));    //将分组后的16进制字符串转10进制Unicode码,然后将Unicode码转换为字符
        }
        return val;
    },
    groupArray:function(str){
        var result = [];
        for (var i = 0; i < str.length/2; i++) {
            var aa = str.slice(i*2, (i+1)*2);
            result.push(aa);
        }
        return result;
    }
}
// $(function(){
//     document.addEventListener("deviceready", onDeviceReady, false);
//     function onDeviceReady() {
//         document.removeEventListener("backbutton", onBackKeyDown, false); // 注销返回键
//     }
// })
// function if_access_token(obj){
//     if( !goAjax(obj) ){
//         goAjax(obj)
//     }
//     function goAjax(obj){
//         var code = true;
//         var access_token = 'Bearer '+localStorage.getItem('access_token');
//         $.ajax({
//             headers: {
//                 "Authorization": access_token || ""
//             },
//             type:obj.type || 'get',//类型
//             url:obj.url,//地址
//             async: false,
//             beforeSend: obj.beforeSend,
//             data:obj.data || {},//发送数据
//             success:function(data){
//                 console.log(data)
//                 if(data.code.indexOf("ACCESS_TOKEN_EXPIRES") >0 ){
//                     code = false
//                     refreshToken()
//                 }else{//access_token未过期的回调
//                     obj.success(data)
//                 }
//             },
//             error:obj.error
//         })
//         return code
//     }
//     function refreshToken(){//刷新token
//         $.ajax({
//             type:'get',
//             url:auth_refresh_token,
//             async: false,
//             data:{
//                 refresh_token:localStorage.getItem('refresh_token')
//             },
//             success:function(data){
//                 if(data.code === "SUCCESS"){
//                     access_token = data.data.access_token;
//                     localStorage.setItem('access_token',access_token);
//                 }else{
//                     localStorage.clear();//refresh_token过期
//                     new Toast({context:$('body'),message:'身份信息已过期，请重新登录'}).show();
//                     setTimeout(function(){
//                         window.location.href = '../log.html'
//                     },1000)
//                 }
//             },
//             error: function () {
//                 new Toast({context: $('body'), message: '网络错误'}).show();
//             }
//         })
//     }
// }




// var c = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJTM1RQTDN3a055VEVmS1p0NExGQjJkIiwiaXNzIjoiTUdDIE9ubGluZSIsImlhdCI6MTUzMjA1NzMyNSwiZXhwIjoxNTMyMDU3MzI3LCJzdWIiOiIxMTEiLCJzdG9yZV9zZXJpYWwiOiIxMTEtMSIsInRva2VuX3R5cGUiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOltdfQ.oN3397RPH1RGfGYj9vg283r5b4WxsYRh7fx1TqMfvto"
// var a = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJBSE5SUVhoZlVxQms0UUtXenBtenBXIiwiaXNzIjoiTUdDIE9ubGluZSIsImlhdCI6MTUzMjA1NjU0MywiZXhwIjoxNTMyMDU2NTQ1LCJzdWIiOiIxMTEiLCJzdG9yZV9zZXJpYWwiOiIxMTEtMSIsInRva2VuX3R5cGUiOiJhY2Nlc3NfdG9rZW4iLCJzY29wZXMiOltdfQ.CINqsM-H3AejouLUe0fxO0DLnRZjNVj7pV-RU0KVl8M";
// var b = c.split(".")[1];
// var base = new Base64();
// console.log(base.decode(b))
