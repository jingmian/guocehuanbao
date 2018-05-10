/**
 * 基予jQuery的导航插件 插件名字：elm.thh_navPlug(elm,opt,callBack)
 *  options:导航结构
 *  skin:选择皮肤 目前有:skin1、skin2
 *  callBack:导航点击回调函数集合,会注入一个jQuery代理的DOM元素，该元素就是当前被点击的元素
 *  codeArr:权限控制数组，后台返还的权限数组
 */
(function (root, factory, plugName) {
    factory(root.jQuery, plugName);
})(window, function ($, plugName) {
    $.fn[plugName] = function (options, skin, callBack,codeArr) {
        var lineHeight = 30;//css定义的行高
        var twoHeight=36; //二级导航高度
        var skinChoose = 'skin1';//默认皮肤位 skin1
        var fontsIconName = 'icon iconfont ';//字体图标className
        if (skin) {
            skinChoose = skin;
        }
        var $box = $('<div class="thh-nav-plug ' + skinChoose + '">');
        //收缩菜单
        $('<div class="trigger"><i class="iconfont icon-shouqi"></i><div>').appendTo($box);
        /*参数中包含权限数组*/
        if(codeArr){
            //第一级导航的个数

            var oneLen = options.length;
            for (var i = 0; i < oneLen; i++) {
                var $oneBox = $('<div class="one">');
                //若全限数组中包含当前模块的权限，生成第一级导航,并添加自定义属性
                if($.inArray(options[i].code.code, codeArr)!=-1){
                    var navOne = $('<h4>');
                    $('<i>').addClass(fontsIconName + options[i].fontIcon).css({
                        // color: options[i].fontIconColor || '#fff',
                        fontIconSize: options[i].fontIconSize || '#fff'
                    }).appendTo(navOne);
                    $('<span>').html(options[i].nav).appendTo(navOne);
                    $('<em>').attr('class','arrow-right').appendTo(navOne);
                    if (options[i].navAttr) {
                        if(! (options[i].code) ){
                            navOne.attr(options[i].navAttr).appendTo($oneBox);
                        } else{
                            navOne.attr(options[i].navAttr).attr(options[i].code).appendTo($oneBox);
                        }
                    }else if(!options[i].navAttr && options[i].code){
                        navOne.attr(options[i].code).appendTo($oneBox);
                    } else {
                        navOne.appendTo($oneBox);
                    }
                    if (options[i].subnav) {
                        var twoData = options[i].subnav;
                        var twoLen = twoData.length;//第二级导航个数
                        for (var j = 0; j < twoLen; j++) {
                            var $twoBox = $('<div class="two" style="width:100%">');
                            //生成第二级导航,并添加自定义属性
                            var navTwo = $('<h5>');
                            if(twoData[j].code==undefined ){
                                return;
                            }
                            if($.inArray(parseInt(twoData[j].code.code), codeArr)!=-1){
                                 $('<i>').addClass(fontsIconName + options[i].fontIcon+" v-align").css({
                                     color: options[i].fontIconColor || '#fff',
                                     fontIconSize: options[i].fontIconSize || '#fff',
                                     padding:'0 5px'
                                 }).appendTo(navTwo);
                                $('<span>').html(twoData[j].nav).appendTo(navTwo);
                                if (twoData[j].navAttr) {
                                    if(! (twoData[j].code) ){
                                        navTwo.attr(twoData[j].navAttr).appendTo($twoBox);
                                    } else{
                                        navTwo.attr(twoData[j].navAttr).attr(twoData[j].code).appendTo($twoBox);
                                    }
                                }else if(!twoData[j].navAttr && twoData[j].code){
                                    navTwo.attr(twoData[j].code).appendTo($twoBox);
                                } else {
                                    navTwo.appendTo($twoBox);
                                }
                                if (twoData[j].subnav) {
                                    var threeData = twoData[j].subnav;
                                    var threeLen = threeData.length;
                                    $('<em>').attr('class','arrow-right twoNav-arrow').appendTo(navTwo);
                                    //生成第三级,并添加自定义属性
                                    var $threeBox = $('<ul class="three">');
                                    for (var k = 0; k < threeLen; k++) {
                                        var navThree = $('<li>');
                                        // $('<i>').addClass(fontsIconName + options[i].fontIcon+" v-align").css({
                                        //     color: options[i].fontIconColor || '#fff',
                                        //     fontIconSize: options[i].fontIconSize || '#fff'
                                        // }).appendTo(navThree);
                                        // $('<i>').addClass(fontsIconName + threeData[k].fontIcon+" v-align").css({
                                        //    color: threeData[k].fontIconColor || '#000',
                                        //    fontIconSize: threeData[k].fontIconSize || '#fff'
                                        // }).appendTo(navThree);
                                        $('<span>').html(threeData[k].nav).appendTo(navThree);
                                        if (threeData[k].navAttr) {
                                            navThree.attr(threeData[k].navAttr).appendTo($threeBox);
                                        } else {
                                            navThree.appendTo($threeBox);
                                        }
                                    }
                                    $threeBox.appendTo($twoBox);
                                }
                                $twoBox.appendTo($oneBox);
                            }
                        }
                    }
                    $oneBox.appendTo($box);
                }
            }
        }else{
            var oneLen = options.length;//第一级导航的个数
            for (var i = 0; i < oneLen; i++) {
                var $oneBox = $('<div class="one">');
                //生成第一级导航,并添加自定义属性
                var navOne = $('<h4>');
                $('<i>').addClass(fontsIconName + options[i].fontIcon).css({
                    color: options[i].fontIconColor || '#fff',
                    fontIconSize: options[i].fontIconSize || '#fff'
                }).appendTo(navOne);
                $('<span>').html(options[i].nav).appendTo(navOne);
                $('<em>').attr('class','arrow-right').appendTo(navOne);
                if (options[i].navAttr) {
                    if(! (options[i].code) ){
                        navOne.attr(options[i].navAttr).appendTo($oneBox);
                    } else{
                        navOne.attr(options[i].navAttr).attr(options[i].code).appendTo($oneBox);
                    }
                }else if(!options[i].navAttr && options[i].code){
                    navOne.attr(options[i].code).appendTo($oneBox);
                } else {
                    navOne.appendTo($oneBox);
                }
                if (options[i].subnav) {
                    var twoData = options[i].subnav;
                    var twoLen = twoData.length;//第二级导航个数
                    for (var j = 0; j < twoLen; j++) {
                        var $twoBox = $('<div class="two" style="width:100%">');
                        //生成第二级导航,并添加自定义属性
                        var navTwo = $('<h5>');
                        $('<i>').addClass(fontsIconName + options[i].fontIcon+" v-align").css({
                            color: options[i].fontIconColor || '#fff',
                            fontIconSize: options[i].fontIconSize || '#fff',
                            padding:'0 5px'
                        }).appendTo(navTwo);
                        $('<span>').html(twoData[j].nav).appendTo(navTwo);

                        if (twoData[j].navAttr) {
                            if(! (twoData[j].code) ){
                                navTwo.attr(twoData[j].navAttr).appendTo($twoBox);
                            } else{
                                navTwo.attr(twoData[j].navAttr).attr(twoData[j].code).appendTo($twoBox);
                            }
                        }else if(!twoData[j].navAttr && twoData[j].code){
                            navTwo.attr(twoData[j].code).appendTo($twoBox);
                        } else {
                            navTwo.appendTo($twoBox);
                        }
                        if (twoData[j].subnav) {
                            var threeData = twoData[j].subnav;
                            var threeLen = threeData.length;

                            //生成第三级,并添加自定义属性
                            var $threeBox = $('<ul class="three">');
                            for (var k = 0; k < threeLen; k++) {
                                var navThree = $('<li>');
                                // $('<i>').addClass(fontsIconName + options[i].fontIcon+" v-align").css({
                                //     color: options[i].fontIconColor || '#fff',
                                //     fontIconSize: options[i].fontIconSize || '#fff'
                                // }).appendTo(navThree);
                                // $('<i>').addClass(fontsIconName + threeData[k].fontIcon).css({
                                //    color: threeData[k].fontIconColor || '#000',
                                //    fontIconSize: threeData[k].fontIconSize || '#fff'
                                // }).appendTo(navThree);
                                $('<span>').html(threeData[k].nav).appendTo(navThree);
                                if (threeData[k].navAttr) {
                                    navThree.attr(threeData[k].navAttr).appendTo($threeBox);
                                } else {
                                    navThree.appendTo($threeBox);
                                }
                            }
                            $threeBox.appendTo($twoBox);
                        }
                        $twoBox.appendTo($oneBox);
                    }
                }
                $oneBox.appendTo($box);
            }
        }
        //将生成的结构添加到页面中
        $(this).html('');
        $($box).appendTo($(this));
        //第一级导航点击
        var _this = this;
        $(_this).find('.thh-nav-plug h4').click(function () {
            $(_this).find('.thh-nav-plug .two').css('height', '0px');
            $(_this).find('.thh-nav-plug .three').css('height', '0px');
            $(_this).find('.thh-nav-plug h5').removeClass('active');//二级导航
            $(_this).find('.thh-nav-plug li').removeClass('active');//三级导航
            if ($(this).hasClass('active')) {
                $(this).removeClass('active').nextAll('.two').animate({
                    height: 0
                }, 200);
                $(this).find('em').attr('class','arrow-right');
            } else {
                $(_this).find('.thh-nav-plug h4').removeClass('active');//一级导航
                $(this).addClass('active').nextAll('.two').animate({
                    height: twoHeight + 'px'
                }, 200);
                $(_this).find('.thh-nav-plug h4 em').attr('class','arrow-right');
                $(this).find('em').attr('class','arrow-bottom');
                callBack.navOne && callBack.navOne($(this));//一级回调
            }
            /*加上背景色*/
            $(_this).find('.thh-nav-plug .current').removeClass('current');$(this).addClass('current');
            //2018-1-15点击一级导航，第二级导航第一个选中
            $(this).siblings().find('h5').eq(0).addClass('active current');
            return false;
        });
        //2018-1-11左侧公共导航图标颜色
        setLeftNavColor($(_this));
        function setLeftNavColor(dom) {
            var $h4=dom.find('.thh-nav-plug h4');
            $h4.on('click',function () {
                $(this).find('i,span').css({'color':'#3096fe'});
                $(this).parent().siblings().find('i,span').css({'color':'#fff'});
            });
            $h4.on('mouseover',function () {
                $(this).find('i,span').css({'color':'#3096fe'});
            });
            $h4.on('mouseout',function () {
                var $i=$(this).find('i,span');
                if($(this).hasClass('active')||$(this).hasClass('current')){
                    $i.css({'color':'#3096fe'});
                }else{
                    $i.css({'color':'#fff'});
                }
            });
        };
        //第二级导航点击
        $(_this).find('.thh-nav-plug h5').click(function () {
            $(_this).find('.thh-nav-plug .three').css('height', '0px');
            var iHeight = $(this).next('.three').find('li').length * lineHeight;//计算第三级导航的高度
            $(this).parent().siblings('.two').animate({
                height: twoHeight+'px'
            }, 200);
            $(_this).find('.thh-nav-plug li').removeClass('active');//三级导航
            if ($(this).hasClass('active')) {
                $(this).parent().animate({
                    height:twoHeight
                }, 200);
                $(this).removeClass('active').nextAll('.three').animate({
                    height: 0
                }, 200);
                $(this).find('em').attr('class','arrow-right twoNav-arrow');
            } else {
                if($(this).parent().children().length==2){
                    $(this).parent().animate({
                        height: $(this).height() + iHeight
                    }, 200);
                }else{
                    $(this).parent().animate({
                        height: twoHeight
                    }, 200);
                }
                $(this).find('em').attr('class','arrow-bottom twoNav-arrow');
                $(this).parent().siblings('div').find('em').attr('class','arrow-right twoNav-arrow');
                $(_this).find('.thh-nav-plug h5').removeClass('active');//二级导航
                $(this).addClass('active').nextAll('.three').animate({
                    height: iHeight + 'px'
                }, 200);

                callBack.navTwo && callBack.navTwo($(this));//二级回调
            }
            /*加上背景色*/
            $(_this).find('.thh-nav-plug .current').removeClass('current');$(this).addClass('current');
            return false;
        });
        //第三级导航
        $(_this).find('.thh-nav-plug .three>li').click(function () {
            $(_this).find('.thh-nav-plug li').removeClass('active');//三级导航
            $(this).addClass('active');
            callBack.navThree && callBack.navThree($(this));//三级回调
            /*加上背景色*/
            $(_this).find('.thh-nav-plug .current').removeClass('current');$(this).addClass('current');
            return false;
        });
    }
}, 'thh_navPlug');
