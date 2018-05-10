/**
 * Created by Administrator on 2017/9/7.
 */

$(function(){
    var isLogin1=false,userType=0,userDeptId='',userId='';
    var timer=null, //定时器
        n=0,        //图片下标
        len=$(".BtnList>li").length;
    $(".NatPoll-bo").css({"left":0});
    $(".BtnList>li").eq(0).addClass("active").siblings().removeClass("active");
    createTimer();
    $(".NatPoll-bo>div").hover(function(){
        clearTimer();
    },function(){
        createTimer();
    });
    $(".BtnList>li").click(function(){
        n=$(this).index();
        clearTimer();
        scrolling(n);
        createTimer();
    });
    /*定时器功能函数*/
    function scrolling(index){
        var pos=-index*1920;
        $(".NatPoll-bo").stop(true,false).animate({left:pos+"px"},2000);
        $(".BtnList>li").eq(index).addClass("active").siblings().removeClass("active");
    }
    function createTimer(){
        timer=setInterval(function(){
            n++;
            if(n==len) n=0;
            scrolling(n);
        },5000);
    }
    function clearTimer(){
        clearInterval(timer);
        timer=null;
    }
    //登录
    var userName=$('[name="userName"]'),
        userPwd=$('[name="userPwd"]'),
        flag=$('[type=checkbox]').prop('checked'),
        msg=$('#msg'),
        loginData={};
    /*if(getCookie("userName")!="undefined"){
        userName.val(getCookie("userName"));
        userPwd.val(getCookie("password"));
    }else{
        userName.val('');
        userPwd.val('');
    }*/
    userName.blur(function(){
        if(userName.val()==''){
            msg.html('用户名不能为空');
        }else{
            msg.html('');
        }
    });
    userPwd.blur(function(){
        if(userPwd.val()==''){
            msg.html('密码不能为空');
        }else{
            msg.html('');
        }
    });
    $('.login_btn').click(function(){
        userLogin();
    });
    //enter事件
    $(document).keyup(function(event){
        if(event.keyCode ==13){
            userLogin();
        }
    });
    function userLogin(){
        msg.html('');
        if(userName.val()==''){
            msg.html('用户名不能为空');
            //return;
        }else if(userPwd.val()==''){
            msg.html('密码不能为空');
            //return;
        }else{
            msg.html('');
            loginData.userName=userName.val();
            loginData.password=userPwd.val();
            $.ajax({
                type: 'POST',
                data: loginData,
                url:requestUrl+'loginManage/login',
                beforeSend:function(){
                    $('.login_btn').attr("disabled",true).html('正在登录...');
                },
                success: function(data) {
                    if(data==''){
                        $('.login_btn').attr("disabled",false).html('登录');
                        msg.html('数据异常');
                    }else{
                        var data = $.parseJSON(data);
                        if (data.code == 0) {
                            isLogin1=true;
                            userType=data.data.userType;
                            userDeptId=data.data.depatmentId;
                            userId=data.data.userId;
                            setCookie("token",data.data.token);
                            setCookie("userName",loginData.userName);
                            setCookie("password",loginData.password);
                            setCookie("userDeptId",data.data.depatmentId);
                            setCookie("deptId",data.data.depatmentId);
                            setCookie("userId",data.data.userId);
                            setCookie('refresh',true);
                            setTimeout(function(){
                                /*var loginGetInfo=isLogin1+','+userType+','+userDeptId+','+userId;
                                window.name=loginGetInfo;*/
                                if(data.data.powers/*!='{}'*/){
                                    // if(data.data.powers.indexOf('0')!=-1){
                                    //     var code=data.data.powers.replace(/""/g,"\"1\"");
                                    //     window.name=code;
                                    // }else{
                                    //     window.name=data.data.powers
                                    // }
                                    // window.name='BAAAAAAAAAAAAAAAAAAAAAgAQE';
                                    // window.name='____________________________________B';
                                    window.name=data.data.powers;
                                    window.location.href = "page/default/main/main.html";
                                }else{
                                    $('.login_btn').attr("disabled",false).html('登录');
                                    msg.html('当前用户无权限,请联系管理员');
                                }
                                //window.name='{"0":"1","1":"1,2","3":"1,21,22,2,3","5":"2","6":"1,2,3,4"}';

                            },1000)
                        }/*else if(data.code==8){
							$('.login_btn').attr("disabled",false).html('登录');
							msg.html('当前用户无权限,请联系管理员');
						}*/ else {
                            $('.login_btn').attr("disabled",false).html('登录');
                            msg.html('用户名或密码不正确');
                        }
                    }
                },
                error:function(data){
                    $('.login_btn').attr("disabled",false).html('登录');
                    msg.html('服务器异常')
                }
            })
        }
    }
    //二维码悬浮效果
    var $downloadCode=$('.download-code');
    var $NatPollDengE=$('.NatPoll-dengE');
    var $ewmBox=$('.ewmBox');
    $downloadCode.hover(function () {
        $NatPollDengE.hide();
        $ewmBox.show();
    },function () {
        $NatPollDengE.show();
        $ewmBox.hide();
    })
});
(function(window) {
    var theUA = window.navigator.userAgent.toLowerCase();
    if ((theUA.match(/msie\s\d+/) && theUA.match(/msie\s\d+/)[0]) || (theUA.match(/trident\s?\d+/) && theUA.match(/trident\s?\d+/)[0])) {
        var ieVersion = theUA.match(/msie\s\d+/)[0].match(/\d+/)[0] || theUA.match(/trident\s?\d+/)[0];
        if (ieVersion <8) {
            window.location.href="./nationalPolicy/root/page/default/login/banbenguodi.html";
        }
    }
})(window);
