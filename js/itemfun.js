var stores = JSON.parse(localStorage.getItem('personinfo')).stores;
var store_name = stores[0].name;
var store_serial = stores[0].serial;
var guider_phone = JSON.parse(localStorage.getItem('personinfo')).phone_num;
var guider_serial = JSON.parse(localStorage.getItem('personinfo')).uid;
var guider_name = JSON.parse(localStorage.getItem('personinfo')).nickname;
var pallet_data = function(){}
pallet_data.prototype = {
    init :function(){
        this.ParamList = {//初始化数据
            rfids : [],
            products : [],
            style_serials:[],
            start_time : new Date().getTime()/1000,//开始看货时间
            end_time : null,//结束看货时间
            view_product_count:0,//看货件数
            view_time_total:0,//看货总时长
            try_count_total :0,//试戴次数
            try_time_total:0,//试戴总时长
            store_name:store_name,//门店名称
            store_serial:store_serial,//门店编号
            guider_phone:guider_phone,//导购手机号
            guider_serial:guider_serial,//导购编号
            guider_name:guider_name//导购姓名
        }
        var that = this;
        toggleStore(stores,function(store_serial,store_name){
            that.getStore(store_serial,store_name);
        });
        (function browserRedirect(){
            var sUserAgent = navigator.userAgent.toLowerCase();
            var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
            var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
            var bIsMidp = sUserAgent.match(/midp/i) == "midp";
            if(bIsIpad || bIsIphoneOs || bIsMidp){
                that.platform = 'ios'
            }else{
                that.platform = 'android'
            }
        })();
    },
    getStore:function(store_serial,store_name){//获取门店信息
        this.ParamList.store_name = store_name;//门店名称
        this.ParamList.store_serial  = store_serial ;//门店编号
    },
    getProducts:function(rfid,oldrfid){//获取商品信息
        rfid = rfid.replace(/[^0-9a-zA-Z]/g,"")
        var rfids = this.ParamList.rfids;
        var style_serials= this.ParamList.style_serials;
        var that = this;
        var url = rfidurl+rfid;
        new if_access_token({
            type:'get',
            url:url,
            data:{
                store_serial: that.ParamList.store_serial
            },
            success:function(data){
                console.log(data)
                if(data.code === "SUCCESS"){
                    var style_serial = data.data.style_serial;//款式编号
                    var File = '../img/item/'+style_serial+'/banner0.mp4';
                    var videomp4 = '../img/item/'+style_serial+'/banner0.mp4';
                    var videoimg = '../img/item/'+style_serial+'/banner0.jpg';
                    var banner1 = '../img/item/'+style_serial+'/banner1.jpg';
                    var banner2 = '../img/item/'+style_serial+'/banner2.jpg';
                    var banner3 = '../img/item/'+style_serial+'/banner3.jpg';
                    var banner4 = '../img/item/'+style_serial+'/banner4.jpg';
                    var banner5 = '../img/item/'+style_serial+'/banner5.jpg';
                    if(!that.isExistFile(File)){
                        videomp4 = '../img/item/common/banner0.mp4';
                        videoimg = '../img/item/common/banner0.jpg';
                        banner1 = '../img/item/common/banner1.jpg';
                        banner2 = '../img/item/common/banner2.jpg';
                        banner3 = '../img/item/common/banner3.jpg';
                        banner4 = '../img/item/common/banner4.jpg';
                        banner5 = '../img/item/common/banner5.jpg';
                    }
                    rfids.push(rfid);
                    var style_buy_count = data.data.style_buy_count;//款式购买次数
                    var style_try_count = data.data.style_try_count;//款式购买次数
                    var style_view_count = data.data.style_view_count;//款式购买次数
                    var product_name = data.data.style_name;//款式名称
                    var infoobj = {
                        rfid: rfid,
                        product_name: product_name,
                        style_serial: style_serial,
                        start_time: new Date().getTime()/1000,//开始看货时间
                        end_time: null,//结束看货时间
                        is_try: 0,//是否进行了试戴
                        try_time: 0,//试戴时长
                        try_count: 0,//试戴次数
                        view_time: 0,//看货时长
                        view_serial: rfids.indexOf(rfid) + 1//看货编号
                    };
                    that.ParamList.products.push(infoobj);
                    if(style_serials.indexOf(style_serial) < 0) {
                        var navstr = '<div class="option" style_serial="' + style_serial + '"><span class="details">查看详情</span><div class="left"><img src = "'+banner5+'"></div><div class="right">' +
                            '<p>款式购买次数：'+style_buy_count+'次</p><p>款式试戴次数：'+style_try_count+'次</p><p>款式被看次数：'+style_view_count+'次</p></div></div>';
                        var itemstr = ' <div class="item" style_serial="' + style_serial + '"><div class="banner banner_details"><div class="swiper-container swiper-container'+style_serial+'"><div class="swiper-wrapper">'
                            + '<div class="swiper-slide"><img class="play" src="../img/play.png"><img class="poster" src="' + videoimg + '"><video id="videos" preload="none" controls="controls" poster="'
                            + videoimg+ '" src="' + videomp4 + '"><source src="'
                            + videomp4 + '" type="video/mp4" class="ng-scope"></video></div>'
                        itemstr += '<div class="swiper-slide"><img src="' + banner1 + '"/></div>'
                        itemstr += '<div class="swiper-slide"><img src="' + banner2 + '"/></div>'
                        itemstr += '<div class="swiper-slide"><img src="' + banner3 + '"/></div>'
                        itemstr += '<div class="swiper-slide"><img src="' + banner4 + '"/></div>'
                        itemstr += '<div class="swiper-slide"><img src="' + banner5 + '"/></div>'
                        itemstr += '</div><div class="swiper-pagination"></div></div></div></div>'
                        $(".nav").append(navstr);
                        $(".main").append(itemstr);
                        style_serials.push(style_serial);
                        $("section").css('background', 'none')
                        $(".main .item:last").addClass("active").siblings(".item").removeClass("active");
                        window["myswiper"+style_serial] = new Swiper('.swiper-container'+style_serial, {//解决页面多轮播错误
                            pagination: '.swiper-pagination',
                            paginationClickable: true
                        });
                        that.player($(".item.active"))
                    }else{
                        that.player($(".item[style_serial="+style_serial+"]"))
                    }
                }else{
                    new Toast({context:$('body'),message:'标签编号：'+oldrfid+'/商品编号：'+rfid+'不存在'}).show();
                }

            },
            error:function(e){
                console.log(e)
                new Toast({context:$('body'),message:'网络错误'}).show();
            }
        })

    },
    player: function (obj){//播放视频
        var style_serial = obj.attr("style_serial");
        eval("myswiper"+style_serial).slideTo(0);
        $(".item").removeClass("active");
        obj.addClass("active");
        var vd = obj.find("video");
        var md=vd.siblings("img");
        $("video").each(function(){this.pause() })
        vd[0].play();
        vd.css('display','block');
        vd[0].addEventListener("play",function(){
            md.css('display','none');
        })
        vd[0].addEventListener("ended",function(){
            md.css('display','block');
            vd.css('display','none');
        })
        vd[0].addEventListener("pause",function(){
            md.css('display','block');
            vd.css('display','none');
        })
    },
    productIsTry :function(rfid){//试戴
        var index = this.ParamList.rfids.indexOf(rfid);
        var product = this.ParamList.products[index];
        var style_serial = product.style_serial;
        var end_time = product.end_time;
        console.log(end_time)
        if(end_time){//如果此商品的拿出时间存在 则再次放入播放视频
            var time = Math.ceil((new Date().getTime()/1000 -product.end_time));//试戴时长
            this.player($(".item[style_serial="+style_serial+"]"));
            product.end_time = null;//再次放入就把结束时间清空
            if(time >= 15){//超出15秒才算试戴
                product.try_time += time;
                product.try_count++;//试戴次数
                product.is_try = 1;//是否试戴
            }
        }
    },
    isExistFile(url) {
        var xmlHttp;
        if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        xmlHttp.open("post", url, false);
        xmlHttp.send();
        if (xmlHttp.readyState ==4 && xmlHttp.status == 200) {
            return true;//url存在
        }else if (xmlHttp.readyState ==4 && xmlHttp.status == 0) {
            return true;//url存在
        } else {
            return false
        }
    },
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
    },
    SetTagInListener: function(rfid){//放入商品
        var oldrfid  = rfid;
        if(this.platform === 'android'){
            rfid = this.hexToString(rfid);
        }
        console.log(rfid.indexOf('\x01'));
        rfid = rfid.replace(/[^0-9a-zA-Z]/g,"");
        var index = this.ParamList.rfids.indexOf(rfid);
        if(index < 0){//没有放过
            // if(this.ParamList.products.length <= 0)//如果商品列表不存在 算客户开始时间
            //     this.ParamList.start_time = new Date().getTime()/1000;
            this.getProducts(rfid,oldrfid)//获取商品信息
        }else{//之前放过
            this.productIsTry(rfid)//试戴信息
        }
    },
    SetTagOutListener: function(rfid){//拿出商品
        if(this.platform === 'android'){
            rfid = this.hexToString(rfid);
        }
        var index = this.ParamList.rfids.indexOf(rfid);
        var product = this.ParamList.products[index];
        product.end_time = new Date().getTime()/1000;//结束时间
    },
    endInit: function(){
        //获取结束时间和看货时长
        if(this.ParamList.products.length > 0){
            this.ParamList.end_time = new Date().getTime()/1000;//看货结束时间
            this.ParamList.view_product_count = this.ParamList.products.length;//看货件数
            this.ParamList.try_count_total = 0;//试戴次数
            this.ParamList.try_time_total= 0;//试戴总时长
            this.ParamList.view_time_total = parseInt(this.ParamList.end_time - this.ParamList.start_time);//看货总时长
            console.log(this.ParamList.view_time_total)
            var products = this.ParamList.products;
            var that = this;
            $(products).each(function(){
                if(!this.end_time){
                    this.end_time = new Date().getTime()/1000;
                }
                this.view_time = Math.ceil((this.end_time - this.start_time));//看货时长
                if(this.try_count){
                    that.ParamList.try_count_total++
                }
                // that.ParamList.try_count_total += this.try_count;
                that.ParamList.try_time_total += this.try_time;
                console.log(this.view_time)
            })
            var maskstr = "";
            $(this.ParamList.products).each(function(){
                maskstr += '<div class="m_info" style_serial="'+this.style_serial+'"><span class="left">'+this.product_name +'：</span>'
                         +'<div class="right">' +
                        '<div class="rightint">是否购买：<input type="radio" class="check isbuy" name="isbuy'+this.rfid+'" value="0"/><label>未购买</label>' +
                        '<input type="radio" class="check isbuy" name="isbuy'+this.rfid+'" value="1"/><label>已购买</label></div>' +
                        '<div class="rightint">推荐方式：<input type="radio" class="check ischoice" name="ischoice'+this.rfid+'" value="self"/><label>顾客自选</label>' +
                        '<input type="radio" class="check ischoice" name="ischoice'+this.rfid+'" value="recommended"/><label>导购推荐</label></div>' +
                        '<div class="nobuyboxmask"><div class="nobuybox"><div class="removebtn">确定</div><span class="remove"><img src="../img/xo.png"></span>'+
                        '<p class="name">'+this.product_name+'：</p>' +
                        '<p><input type="radio" class="check nobuy" name="nobuy'+this.rfid+'" value="考虑一下"/><label>考虑一下</label></p>' +
                        '<p><input type="radio" class="check nobuy" name="nobuy'+this.rfid+'" value="没打算买"/><label>没打算买</label></p>' +
                        '<p><input type="radio" class="check nobuy" name="nobuy'+this.rfid+'" value="货比三家"/><label>货比三家</label></p>' +
                        '<p><input type="radio" class="check nobuy" name="nobuy'+this.rfid+'" value="设计怪异"/><label>设计怪异</label></p>' +
                        '<p><input type="radio" class="check nobuy" name="nobuy'+this.rfid+'" value="不喜欢"/><label>不喜欢</label></p>' +
                        '<p><input type="radio" class="check nobuy" name="nobuy'+this.rfid+'" value="喜欢但太贵"/><label>喜欢但太贵</label></p>' +
                        '<p><input type="radio" class="check nobuy" name="nobuy'+this.rfid+'" value="对产品不太了解"/><label>对产品不太了解</label></p>' +
                        '</div></div></div></div>'
            })
            $(".mask .checklist").html(maskstr)
            $(".mask").addClass("active");
        }else{
            new Toast({context:$('body'),message:'请放入商品'}).show();
        }
    },
    getData:function(){
        var name = $(".mask .name input").val();
        var phone = $(".mask .phone input").val();
        var namereg = /^[a-zA-Z\u4e00-\u9fa5]+$/;
        var phonereg=/^[1][3,5,6,7,8,9][0-9]{9}$/;
        if(namereg.test(name) && name.length > 0){
            var that = this;
            this.ParamList.name = name;//顾客姓名
            this.ParamList.gender = $(".mask .gender input[type='radio']:checked").val();//顾客性别
            this.ParamList.age = $(".mask .age input[type='radio']:checked").val();//顾客年龄段
            this.ParamList.attach = $(".mask .attach textarea").val();//顾客年龄段
            var info =  $(".checklist .m_info");
            var nobuyarr = [];
            var isbuyarr = [];
            info.each(function(n){
                if($(this).find(".isbuy[type='radio']:checked").length <=0){
                    isbuyarr.push($(this).find(".name").text());
                }else if($(this).find(".isbuy[value='0']:checked").length >0 && $(this).find(".nobuy[type='radio']:checked").length <= 0){
                    nobuyarr.push($(this).find(".name").text());
                }
            })
            if(isbuyarr.length>0){
                new Toast({context:$('body'),message:'请选择'+isbuyarr[0].slice(0,isbuyarr[0].length-1)+'是否购买'}).show();
            }else if(nobuyarr.length>0){
                new Toast({context:$('body'),message:'请选择'+nobuyarr[0].slice(0,nobuyarr[0].length-1)+'的未购买原因'}).show();
            }else{
                if(!phone || phonereg.test(phone)){
                    $(this.ParamList.products).each(function(n){
                        this.choice = info.eq(n).find(".ischoice[type='radio']:checked").val();
                        this.is_buy = info.eq(n).find(".isbuy[type='radio']:checked").val();
                        if(this.is_buy == 0){
                            this.not_buy_reason = info.eq(n).find(".nobuyboxmask .nobuy[type='radio']:checked").val();
                        }else{
                            this.not_buy_reason = '已购买';
                        }
                        that.ParamList.products[n] = JSON.stringify(this);
                    })
                    this.ParamList.products = '['+this.ParamList.products.join(",")+']'
                    this.ParamList.phone = phone;//顾客联系方式
                    console.log(that.ParamList)
                    new if_access_token({
                        type:'post',
                        url:records,
                        data:that.ParamList,
                        success:function(data){
                            console.log(data)
                            if(data.code === "SUCCESS"){
                                //停止捕获标签事件
                                cordova.plugins.TfPlugin.EndCapture();
                                window.location.href = "../index.html"
                            }
                        },
                        error:function(){
                            new Toast({context:$('body'),message:'网络错误'}).show();
                        }
                    })
                }else{
                    new Toast({context:$('body'),message:'请输入正确的手机号'}).show();
                }
            }
        }else{
            new Toast({context:$('body'),message:'客户姓名为不为空的汉字或字母'}).show();
        }
    }
}

