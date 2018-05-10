$(function(){
    //2018/3/8
    $('#deptId').attr('data-id',userDeptId);
    search_car_pers('1');
    var carTypeId;//存储车辆typeId
    $('.rTMList').css({
        overflow:'auto',
        height:$('.rTMLBox').height()-5 +'px'
    });
    $('#carData').find('.form-body').css({
        'overflowY':'hidden'
    });
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
            search_car_pers('1');
        });
    });
    $('#popSearch').click(function(){
        var json={};
        if($('#deptId').val()!='' && $('#deptId').attr('data-id')){
            json.deptId=$('#deptId').attr('data-id');
        }
        if($('#personId').val()!='' /*&& $('#personId').attr('keyid')*/){
            // json.carNum=$('#personId').val()
            json.objectName=$('#personId').val();
        }
        paddingPopList(2,json);
    });
    paddingPersonList();
    //填充左侧区域列表
    function paddingPersonList(){
        var cfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/getRealTimeInfo',
            data:{
                deptId:getCookie('deptId'),
                dealType:1
            },
            success:function(data){
                var list=data.data;
                if(!list){
                    return ;
                }
                var str='';
                for(var i=0;i<list.length;i++){
                    for(var key in list[i]){
                        var l=list[i][key];
                        str+='<div class="rTMLType"><p class="rTMTitle" data-id="'+l.typeId+'">';
                        if(l.typeId<0){//车辆数据
                            str+='<i class="iconfont icon-cheliang2"></i>';
                        }else{
                            //扫地车 洒水车 自卸车 勾臂车 巡查车 摆臂车 电动车 压缩车 转运车 翻斗车 工程车
                            if(l.typeId=='0'){
                                str+='<i class="iconfont sprite-car-5"></i>';
                            }else if(l.typeId=='1'){
                                str+='<i class="iconfont sprite-car-4"></i>';
                            }else if(l.typeId=='2'){
                                str+='<i class="iconfont sprite-car-7"></i>';
                            }else if(l.typeId=='3'){
                                str+='<i class="iconfont sprite-car-2"></i>';
                            }else if(l.typeId=='4'){
                                str+='<i class="iconfont sprite-car-1"></i>';
                            }else if(l.typeId=='5'){
                                str+='<i class="iconfont sprite-car-3"></i>';
                            }else if(l.typeId=='6'){
                                str+='<i class="iconfont sprite-car-8"></i>';
                            }else if(l.typeId=='7'){
                                str+='<i class="iconfont sprite-car-6"></i>';
                            }else if(l.typeId=='8'){
                                str+='<i class="iconfont sprite-car-10"></i>';
                            }else if(l.typeId=='9'){
                                str+='<i class="iconfont sprite-car-11"></i>';
                            }else if(l.typeId=='10'){
                                str+='<i class="iconfont sprite-car-9"></i>';
                            }else{//其他
                                str+='<i class="iconfont sprite-car-11"></i>';
                            }
                        }
                        str+='<span>'+l.dictionaryName+'</span><em>('+l.allCountNum+')</em><strong class="iconfont icon-sanjiao-copy-copy-copy1"></strong></p>';
                        str+='<ul class="clear"><li><span>在线数:</span><em class="rColorGreen">'+l.onLineCarNum+'</em></li>';
                        str+='<li><span>离线数:</span><em class="rColorBlue">'+l.offLineCarNum+'</em></li>';
                        str+='<li><span>报警数:</span><em class="rColorRed">'+l.alarmCarNum+'</em></li>';
                        str+='<li><span>未上线数:</span><em style="color:gray;">'+l.notOnlineCountNum+'</em></li></ul></div>';
                    }
                }
                $('.rTMList').html(str);
                $('.rTMList p.rTMTitle').css({
                    'cursor':'pointer'
                }).click(function(){
                    $('#carData .titleText').text($(this).find('span').text());
                    carTypeId=$(this).attr('data-id');
                    paddingPopList(1);
                });
                $('.rTMList p.rTMTitle>strong').click(function(e){
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
     * type 1 左侧p标签请求 2按钮请求
     * */
    function paddingPopList(type,detail){
        var carCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/findCarOrPersonInfo',
            success:function(data){
                //扫地车 洒水车 自卸车 勾臂车 巡查车 摆臂车 电动车 压缩车  转运车  翻斗车  工程车
                var font=['扫','洒','自','勾','巡','摆','电','压','转','翻','工'];
                var customClass=['sprite-bigcar-5','sprite-bigcar-4','sprite-bigcar-7','sprite-bigcar-3','sprite-bigcar-2','sprite-bigcar-1','sprite-bigcar-8','sprite-bigcar-6','sprite-bigcar-10','sprite-bigcar-11','sprite-bigcar-9'];
                var jData=data.data,
                    str='';
                for(var i=0;i<jData.length;i++){
                    var jd=jData[i];
                    if(!jd){
                        $('#carData .pDCont').html('');
                        return ;
                    }
                    if(jd.typeId<20){
                        if(jd.alarmStatus && jd.alarmStatus==1){//报警
                            str+='<li class="alarm"  data-id="'+jd.carId+'">';
                        }else{
                            if(jd.onLineStatus==0){//离线
                                str+='<li class="offline"  data-id="'+jd.carId+'">';
                            }else if(jd.onLineStatus==1){//在线
                                str+='<li class="online"  data-id="'+jd.carId+'">';
                            }else{//其他
                                str+='<li class="else"  data-id="'+jd.carId+'">';
                            }
                        }
                        if(font[parseInt(jd.typeId)] && customClass[parseInt(jd.typeId)]){
                            str+='<em>'+font[parseInt(jd.typeId)]+'</em><span  class="'+customClass[parseInt(jd.typeId)]+'"></span><p>'+jd.carNum+'</p>';
                        }
                        str+='</li>';
                    }
                }
                $('#carData .pDCont').html(str).height(Math.ceil(jData.length/5)*70+50);
                $('.pDCont >li').click(function(){
                    if($(this).siblings('li').hasClass('checked')){
                        $(this).siblings('li').removeClass('checked')
                    }
                    $(this).toggleClass('checked')
                });

                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'635px',
                    content: $('#carData'),
                    move: $('#carData .title'),
                    shade:0,
                    success:function(){
                        // $('#deptId').removeAttr('data-id').val('');
                        // $('#peopleId').removeAttr('data-id').val('');
                    }
                }));
                $('#carData .no').click(function(){
                    layer.close(index);
                });
                $('#carData .yes').off('click');
                $('#carData .yes').click(function(){
                    var liChecked= $('.pDCont').find('li.checked');
                    var checkedCarId=liChecked.attr('data-id');
                    if(liChecked.length>0){
                        layer.closeAll();
                        map.center('1'+checkedCarId,15);
                        map.autoOpenWin('1'+checkedCarId);
                    }else{
                        layer.msg('请选择一辆车辆',{timer:1000})
                    }
                })
            }
        };
        if(parseInt(carTypeId)>=0){
            carCfg.data={
                deptId:getCookie('deptId'),
                dealType:'1',
                typeId:carTypeId
            }
        }else{
            carCfg.data={
                deptId:getCookie('deptId'),
                dealType:'1'
            }
        }
        if(type==2){
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
});
