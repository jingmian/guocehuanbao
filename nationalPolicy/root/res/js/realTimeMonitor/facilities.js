$(function () {
    $('.rTMList').css({
        overflow: 'auto',
        maxHeight:$('.rTMLBox').height()-5 +'px'
    });
    paddingCarList();
    //填充左侧区域列表
    function paddingCarList(){
        var cfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/getRealTimeInfo',
            data:{
                deptId:getCookie('deptId'),
                dealType:2
            },
            success:function(data){
                var list=data.data[0].facilitie,
                    $div=$('.rTMList>div'),
                    dev1=$div.eq(0),//公厕
                    dev2=$div.eq(3),//中转站
                    dev3=$div.eq(4),//掩埋厂
                    dev4=$div.eq(2),//垃圾箱
                    dev5=$div.eq(1);//果皮箱
                var t1=0,
                    t2=0,
                    t3=0,
                    t4=0,
                    t5=0; //计算总数
                var str1='',
                    str2='',
                    str3='',
                    str4='',
                    str5='';
                for(var i=0;i<list.length;i++){
                    var l=list[i];
                    //公厕 中转站 掩埋厂 垃圾箱 果皮箱
                    if(l.typeId=='0'){
                        str1+='<li data-id="'+l.facilitiesId+'"><input type="checkbox"> <div class="iconfont icon-xuanzhong"> </div> <span>'+l.facName+'</span></li>';
                        t1++;
                    }else if(l.typeId=='1'){
                        str2+='<li data-id="'+l.facilitiesId+'"><input type="checkbox"> <div class="iconfont icon-xuanzhong"> </div> <span>'+l.facName+'</span></li>';
                        t2++;
                    }else if(l.typeId=='2'){
                        str3+='<li data-id="'+l.facilitiesId+'"><input type="checkbox"> <div class="iconfont icon-xuanzhong"> </div> <span>'+l.facName+'</span></li>';
                        t3++;
                    }else if(l.typeId=='3'){
                        str4+='<li data-id="'+l.facilitiesId+'"><input type="checkbox"> <div class="iconfont icon-xuanzhong"> </div> <span>'+l.facName+'</span></li>';
                        t4++;
                    }else if(l.typeId=='4'){
                        str5+='<li data-id="'+l.facilitiesId+'"><input type="checkbox"> <div class="iconfont icon-xuanzhong"> </div> <span>'+l.facName+'</span></li>';
                        t5++;
                    }
                }
                if(str1!=''){
                    dev1.find('ul').html(str1);
                    dev1.find('em').text('('+t1+')');
                }
                if(str2!=''){
                    dev2.find('ul').html(str2);
                    dev2.find('em').text('('+t2+')');
                }
                if(str3!=''){
                    dev3.find('ul').html(str3);
                    dev3.find('em').text('('+t3+')');
                }
                if(str4!=''){
                    dev4.find('ul').html(str4);
                    dev4.find('em').text('('+t4+')');
                }
                if(str5!=''){
                    dev5.find('ul').html(str5);
                    dev5.find('em').text('('+t5+')');
                }

                $div.on('click','input',function(){
                    $(this).parent().parent().find('li>div').each(function(){
                        $(this).css({
                            backgroundColor: '#dbdbdb',
                            color: '#fff',
                            border: '1px solid #dbdbdb'
                        })
                    });
                    if($(this).siblings('div').attr('data-status')!='true'){
                        $(this).siblings('div').css({
                            backgroundColor: '#fff',
                            color: '#009aff',
                            border: '1px solid #009aff'
                        }).attr('data-status','true');
                    }else{
                        $(this).siblings('div').css({
                            backgroundColor: '#dbdbdb',
                            color: '#fff',
                            border: '1px solid #dbdbdb'
                        }).attr('data-status','false');
                    }
                    var facId=$(this).parent().attr('data-id');
                    map.center(facId,15);
                    map.autoOpenWin(facId);
                });
                $('.rTMList p.rTMTitle>strong').css({cursor:'pointer'}).click(function(e){
                    //var e=e || window.event;
                    $(this).parent().siblings('ul').toggle();
                    if( $(this).attr('class').indexOf('icon-sanjiao-copy-copy-copy1')!=-1){
                        $(this).attr('class','iconfont icon-sanjiao-copy-copy-copy')
                    }else{
                        $(this).attr('class','iconfont icon-sanjiao-copy-copy-copy1')
                    }
                    return false;
                });
            }
        };
        map.ready(function(){
            customAjax(cfg);
        })
    }
});
