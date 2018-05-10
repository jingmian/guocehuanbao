$(function(){
    //2018/3/8
    $('#deptId').attr('data-id',userDeptId);
    search_car_pers('0');
    var carTypeId;//存储车辆typeId
    $('.rTMList').css({
        overflow:'auto',
        height:$('.rTMLBox').height()-5 +'px'
    });
    $('#carData').find('.form-body').css({
        'overflowY':'hidden'
    });
    //事件
    $('#deptId').focus(function(){
        var f=$('#form-Tree');
        var treeIndex=layer.open(publicObj({
            kind:'layer',
            area:'400px',
            content: f,
            shade:0,
            move:f.find('.form-top'),
            success: function () {
                lx.getDeptTree($('#windowTree'),treeClick);
            }
        }));
        $('#form-Tree .submit-btn').off();
        $('#form-Tree .submit-btn').click(function(){
            layer.close(treeIndex);
            search_car_pers('0');
        });
    });
    $('#popSearch').click(function(){
        var json={};
        if($('#deptId').val()!='' && $('#deptId').attr('data-id')){
            json.deptId=$('#deptId').attr('data-id')
        }
        if($('#personId').val()!=''){
            // json.personName=$('#deptId').val();
            json.objectName=$('#personId').val();
        }
        paddingPopList(2,json);
    });
    paddingPersonList();
    // personSearch();
    //填充左侧区域列表
    function paddingPersonList(){
        var cfg={
            token:getCookie('deptId'),
            data:{
                deptId:getCookie('deptId'),
                dealType:0
            },
            url:'realTimeProtectionService/getRealTimeInfo',
            success:function(data){
                var list=data.data;
                if(list.length==0){
                    return ;
                }
                var str='';
                for(var i=0;i<list.length;i++){
                    for(var key in list[i]){
                        var l=list[i][key];
                        str+='<div class="rTMLType"><p class="rTMTitle" data-id="'+l.typeId+'">';
                        if(l.typeId<0){//人员数据
                            str+='<i class="iconfont icon-yonghu11"></i>';
                        }else{
                            if(l.typeId==0){//道路保洁
                                str+='<i class="iconfont icon-linshibaoji"></i>';
                            }else if(l.typeId==1){//驾驶员
                                str+='<i class="iconfont icon-siji1"></i>';
                            }else if(l.typeId==2){//巡查人员
                                str+='<i class="iconfont icon-chakan1"></i>';
                            }else if(l.typeId==3){//公厕管理
                                str+='<i class="iconfont icon-cesuo"></i>';
                            }else if(l.typeId==4){//机动人员
                                str+='<i class="iconfont icon-chuli1"></i>';
                            }else if(l.typeId==5){//跟车人员
                                str+='<i class="iconfont icon-siji"></i>';
                            }else if(l.typeId==6){//河道清运
                                str+='<i class="iconfont icon-icon_neihehangdao"></i>';
                            }else if(l.typeId==7){//社区保洁
                                str+='<i class="iconfont icon-shequ"></i>';
                            }else if(l.typeId==8){//填埋人员
                                str+='<i class="iconfont icon-washa"></i>';
                            }else {//其他人员
                                str+='<i class="iconfont icon-pingjia3"></i>';
                            }
                        }
                        str+='<span>'+l.dictionaryName+'</span><em>('+l.allPersonNum+')</em><strong class="iconfont icon-sanjiao-copy-copy-copy1"></strong></p>';
                        str+='<ul class="clear"><li><span>应出勤:</span><em class="rColorGreen">'+l.shouldWorkPersonNum+'</em></li>';
                        str+='<li><span>实出勤:</span><em class="rColorBlue">'+l.workPersonNum+'</em></li>';
                        str+='<li><span>报警数:</span><em class="rColorRed">'+l.alarmNum+'</em></li></ul></div>';
                    }
                }
                $('.rTMList').html(str);
                $('.rTMList p.rTMTitle').css({
                    'cursor':'pointer'
                }).click(function(){
                    $('#peopleData .titleText').text($(this).find('span').text());
                    carTypeId=$(this).attr('data-id');
                    paddingPopList(1);
                });
                $('.rTMList p.rTMTitle>strong').click(function(e){
                    //var e=e || window.event;
                    $(this).parent().siblings('ul').toggle();
                    if( $(this).attr('class').indexOf('icon-sanjiao-copy-copy-copy1')!=-1){
                        $(this).attr('class','iconfont icon-sanjiao-copy-copy-copy')
                    }else{
                        $(this).attr('class','iconfont icon-sanjiao-copy-copy-copy1')
                    }
                    return false;
                })
            }

        };
        map.ready(function(){
            customAjax(cfg);
        });

    }
    /*填充弹窗列表*/
    /*
    * type 1 p标签 2按钮
    * */
    function paddingPopList(type,detail){
        var carCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/findCarOrPersonInfo',
            success:function(data){
                //道路保洁 驾驶员 巡查人员 公厕管理 机动人员 跟车人员 河道清运 社区保洁 填埋人员
                var font=['道','驾','巡','公','机','跟','河','社','填'];
                var customClass=['sprite-bigpeo-5','sprite-bigpeo-9','sprite-bigpeo-8','sprite-bigpeo-1','sprite-bigpeo-4','sprite-bigpeo-2','sprite-bigpeo-3','sprite-bigpeo-6','sprite-bigpeo-7'];
                var jData=data.data;
                if(!jData){
                    $('#peopleData .pDCont').html('');
                    return ;
                }
                var str='';
                for(var i=0;i<jData.length;i++){
                    var jd=jData[i];
                    if(jd.alarmStatus && jd.alarmStatus==1){//报警
                        str+='<li class="alarm" data-id="'+jd.personId+'">';
                    }else{
                        if(jd.onLineStatus==0){//离线
                            str+='<li class="offline" data-id="'+jd.personId+'">';
                        }else if(jd.onLineStatus==1){//在线
                            str+='<li class="online" data-id="'+jd.personId+'">';
                        }else{//其他
                            str+='<li class="else" data-id='+jd.personId+'>';
                        }
                    }
                    str+='<em>'+font[parseInt(jd.typeId)]+'</em><span  class="'+customClass[parseInt(jd.typeId)]+'"></span><p>'+jd.personName+'</p>';
                    str+='</li>';
                }
                $('#peopleData .pDCont').html(str).height(Math.ceil(jData.length/5)*70+50);
                $('.pDCont >li').click(function(){
                    if($(this).siblings('li').hasClass('checked')){
                        $(this).siblings('li').removeClass('checked')
                    }
                    $(this).toggleClass('checked')
                });
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'635px',
                    content: $('#peopleData'),
                    shade:0,
                    move: $('#peopleData .title'),
                    success:function(){
                        // $('#deptId').removeAttr('data-id').val('');
                        // $('#peopleId').removeAttr('data-id').val('');
                    }
                }));
                $('#peopleData .no').click(function(){
                    layer.close(index);
                });
                $('#peopleData .yes').off('click');
                $('#peopleData .yes').click(function(){
                   var liChecked= $('.pDCont').find('li.checked');
                   var checkedPeoId=liChecked.attr('data-id');
                   if(liChecked.length>0){
                      layer.closeAll();
                      map.center('2'+liChecked.attr('data-id'),15);
                      map.autoOpenWin('2'+checkedPeoId);
                   }else{
                       layer.msg('请选择一个人员',{timer:1000})
                   }
                })
            }
        };
        if(type==1){
            if(parseInt(carTypeId)>=0){
                carCfg.data={
                    deptId:getCookie('deptId'),
                    dealType:'0',
                    typeId:carTypeId
                }
            }else{
                carCfg.data={
                    deptId:getCookie('deptId'),
                    dealType:'0'
                }
            }
        }else if(type==2){
            if(parseInt(carTypeId)>=0){
                carCfg.data={
                    deptId:getCookie('deptId'),
                    dealType:'0',
                    typeId:carTypeId
                };
            }else{
                carCfg.data={
                    deptId:getCookie('deptId'),
                    dealType:'0'
                }
            }
            $.each(detail,function(k){
                carCfg.data[k]=detail[k];
            })
        }

        customAjax(carCfg);
    }
    /*部门树单击*/
    function treeClick(event, treeId, treeNode){
        $('#deptId').val(treeNode.name).attr('data-id',treeNode.id);
        $('#personId').val('');
    }
    function personSearch(){
        var pid=$('#personId');
        pid.siblings('span').html('人员姓名:');
        pid.vagueSearch({
            url:'realTimeProtectionService/findCarOrPersonInfo',
            searchKey:'personName',
            dealType:'0',
            deptId:getCookie('deptId')
        });
    }
});
