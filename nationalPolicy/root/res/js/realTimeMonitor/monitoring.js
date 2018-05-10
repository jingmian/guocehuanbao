/*监控公共js*/
//扫地车0  洒水车1  自卸车2  勾臂车3  巡查车4  摆臂车5  电动车6  压缩车7  转运车8  翻斗车9  工程车10
var carTypeAlias = {"0":"sd","1":"ss","2":"zx","3":"gb","4":"gw","5":"bb","6":"dd","7":"ys","8":"zcc","9":"fdc","10":"gcc"};
//道路保洁0  驾驶员1  巡查人员2  公厕管理3  机动人员4  跟车人员5  河道清运6  社区保洁7  填埋人员8
var peoTypeAlias = {"0":"dl","1":"sj","2":"xc","3":"gg","4":"jd","5":"gc","6":"hd","7":"sq","8":"tm"};
//离线 在线 其他 报警
var pubStatusAlias={"0":"l","1":"z","2":"q","99":"j"};
var map; //地图对象
var loadType='0,1,2';
var currType="012";
var titleTxt='';
$(function(){
    var flag = {"peo":true,"car":true,"dev":true,area:false,road:false},
        lastTime = 0, //上一次刷新时间
        timer,//定时器
        TimerTime=10000,
        isPathBack=false;
    var personList, //保存自动刷新的数据
        carList,
        devList,
        areaList,
        roadList;

    var personListObj={}, //保存自动刷新的数据
        carListObj={},
        devListObj={},
        areaListObj,
        roadListObj;
    var actuObj={}; //保存数据字典ID
    init();
    //初始化
    function init(){
        initElm();
        paddingHtml();//填充弹窗
        getDicInfo();
        map=new YcyaMap('map');//地图
        map.ready(function(){
            elmBindEvent();
            paintAllIcon('0,1,2');
            timer=setInterval(function(){
                var currTime = new Date().getTime();
                if(currTime-lastTime>=0){
//                    map.clear();
                    //获取数据
                    paintAllIcon('0,1,2');
                    lastTime=currTime;
                }
            },TimerTime);
        })
    }
    //初始化页面元素
    function initElm(){
        //移除padding
        var $searchTitle=$('#searchTitle');
        var $rTMLBox=$('.rTMLBox');
        $('.m-from').css({padding:0});
        if($searchTitle.height()!=undefined){
            $rTMLBox.css({paddingTop:$searchTitle.height()});
        }else{
            $rTMLBox.css({paddingTop:0});
        }
        //改变导航栏字体
        $(".thh-nav-plug .one",window.parent.document).find('span').css({
            'fontSize':'12px'
        });
        //轨迹页面跳转回来时初始化
        if(window.location.href.indexOf('?')!=-1 && window.location.href.split('?')[1]){
            $('.nav',window.parent.document).show();
            $('.content',window.parent.document).css({paddingLeft:'50px'});
        }
        //初始化复选框
        $('.rMapList>ul.clear').find('[type="checkbox"]').each(function(){
            var ind=$(this).parent().index();
            if(ind<=2){
                if(ind==0){
                    $(this).attr('data-name','peo').attr('data-type','0');
                }else if(ind==1){
                    $(this).attr('data-name','car').attr('data-type','1');
                }else{
                    $(this).attr('data-name','dev').attr('data-type','2');
                }
                $(this).prop('checked',true);
            }else{
                if(ind==3){
                    $(this).attr('data-name','area');
                }else{
                    $(this).attr('data-name','road');
                }
            }

        });
    }
    /* 移除定时器*/
    function removeTimer(){
        if(timer){
            clearInterval(timer);
            timer=null;
        }
    }

    //页面元素绑定事件
    function elmBindEvent(){
        //三级列表伸缩
        $('.btnRTMSShrink').click(function(){
            var $i=$(this).find('i');
            if($i.hasClass('icon-shouqi')){//收缩
                $('.search').css('display','none');
                $('.rTMList').css('display','none');
                $('.contentMap').css({'left':0});
                $('.rTMLBox').css({
                    border:0,
                    background:'transparent'
                });
                $i.attr('class','iconfont icon-zhankai');
                $(this).css({
                    right:'185px'
                });
            }else{//展开
                $('.search').css('display','block');
                $('.rTMList').css('display','block');
                $('.contentMap').css({'left':200});
                $('.rTMLBox').css({
                    border:'1px solid #ddd',
                    background:'#fff'
                });
                $i.attr('class','iconfont icon-shouqi');
                $(this).css({
                    right:'-16px'
                });
            }
        });
        /*移除地图上的图标
        * param {type} 0 人员 1 车辆 2设备 3 区域 4路线
        * */
        function  removeIcon(type,typeId){
//        	return ;
            // map.clear();
            if(type==0){
                for(var i in personListObj){
                    for(var k in personListObj[i]){
                        map.clearById('2'+personListObj[i][k].personId);
                    }
                }
            }else if(type==1){
                for(var i in carListObj){
                    for(var k in carListObj[i]){
                        map.clearById('1'+carListObj[i][k].carId);
                    }
                }
            }else if(type==2){
                for(var i in devListObj){
                    for(var k in devListObj[i]){
                        map.clearById(devListObj[i][k].facilitiesId);
                    }
                }
            }else if(type==3){
                for(var i in areaListObj){
                    map.clearById("rail_id"+areaListObj[i].id);
                }
            }else if(type==4){
                for(var i in roadListObj){
                    var name='roadLine'+roadListObj[i].id;
                    map.clearById(name);
                    map.clearById(name+'_startMarker');
                    map.clearById(name+'_endMarker');
                }
            }else{
//                map.clear();
            }
        }
        /*存储发送给后台的类型
        *param {type} 发送给后台的类型
        *param {peoIsChecked} 人员复选框是否选中
        *param {carIsChecked} 车辆复选框是否选中
        *param {devIsChecked} 设备复选框是否选中
        *param {areaIsChecked} 区域复选框是否选中
        *param {roadIsChecked} 路线复选框是否选中
        *  */
        function getDealType(type,peoIsChecked,carIsChecked,devIsChecked,areaIsChecked,roadIsChecked){
            if(arguments.length!=6){
                layer.msg('参数数量不正确!',{time:1000});
                return ;
            }
            type='';
            if(peoIsChecked){
                type+='0,';
            }
            if(carIsChecked){
                type+='1,';
            }
            if(devIsChecked){
                type+='2,';
            }
            if(areaIsChecked){
                type+='3,';
            }
            if(roadIsChecked){
                type+='4,';
            }
            return type;
        }
        /*
        * param {dealType} 类型  0 人员 1 车辆 3设备
        * param {cTime} 当前时间
        * */
        function setNewTimer(dealType,cTime){
            // paintAllIcon(dealType,actuObj);
            timer=setInterval(function(){
                if(cTime-lastTime>=0){
                    if(dealType.indexOf('3')!=-1){
                        dealType=dealType.replace('3','');
                        if(dealType.indexOf(',,')!=-1){
                            dealType=dealType.replace(',,',',')
                        }
                    }
                    removeIcon();
                    paintAllIcon(dealType.slice(0,dealType.length-1),actuObj);
                    lastTime=cTime;
                }
            },TimerTime);
        }
        // 人员/车辆/设施/区域/路线 复选框点击
        $('.rMapList>ul.clear').find('[type="checkbox"]').click(function(e){
            var ind=$(this).parent().index(),
                currTime,
                type='';
            if($(this).prop('checked')){
                currType=ind+'';
            }
            window.event? window.event.cancelBubble = true : e.stopPropagation();

            var r=$('.rMapList'),
                peoIsChecked=r.find('[data-name="peo"]').prop('checked'),
                carIsChecked=r.find('[data-name="car"]').prop('checked'),
                devIsChecked=r.find('[data-name="dev"]').prop('checked'),
                areaIsChecked=r.find('[data-name="area"]').prop('checked'),
                roadIsChecked=r.find('[data-name="road"]').prop('checked');
            flag.peo=peoIsChecked;
            flag.car=carIsChecked;
            flag.dev=devIsChecked;
            flag.area=areaIsChecked;
            flag.road=roadIsChecked;
            type=getDealType(type,peoIsChecked,carIsChecked,devIsChecked,areaIsChecked,roadIsChecked);
            //初始化typeId
            if(!flag.peo){
                delete actuObj['personTypeId'];
            }
            if(!flag.car){
                delete actuObj['carTypeId'];
            }
            if(!flag.dev){
                delete actuObj['facilitieTypeId'];
            }
            if(ind!=3){
                var tId=$(this).siblings('span').attr('data-id');
                if(ind==0){
                    actuObj.personTypeId=tId;
                }else if(ind==1){
                    actuObj.carTypeId=tId;
                }else if(ind==2){
                    actuObj.facilitieTypeId=tId;
                }
                currTime = new Date().getTime();
                if(!$(this).prop('checked')){
                    removeIcon(ind);
                }else{
                    paintAllIcon(type,actuObj);
                }
                removeTimer();
                if(type!=''){
                    setNewTimer(type,currTime);
                }
            }else{
               /* if(areaIsChecked){*/
                    currTime = new Date().getTime();
                    if(!$(this).prop('checked')){
                        removeIcon(ind);
                    }else{
                        paintAllIcon(type,actuObj);
                    }
                    removeTimer();
                    type=type.slice(0,-1);
                    var oneTimer=setTimeout(function(){
                        if(type!=''){
                            setNewTimer(type,currTime);
                        }
                        clearTimeout(oneTimer);
                        oneTimer=null;
                    },500)
               /* }else{
                    removeIcon();
                }*/
            }
        });
        //右侧列表
        $('.rMapList ul.clear').find('li').click(function(){
            var menu=$(this).find('.two-menu');
            if(menu.length>0){
                if(menu.css('display')=='none'){
                    $(this).siblings('li').find('.two-menu').hide();
                }
                menu.toggle();
                var _i=$(this).find('i');
                if(_i.attr('class').indexOf('icon-sanjiao-copy-copy-copy1')==-1){
                    _i.attr('class','iconfont icon-sanjiao-copy-copy-copy1');
                }else{
                    _i.attr('class','iconfont icon-sanjiao-copy-copy-copy');
                }
            }
        });
        $('.two-menu li').click(function(){
            var _ul=$(this).parent(),
                _ulId=_ul.attr('id'),
                dataId=$(this).attr('data-id'),
                actuType='';
            var r=$('.rMapList'),
                peoIsChecked=r.find('[data-name="peo"]').prop('checked'),
                carIsChecked=r.find('[data-name="car"]').prop('checked'),
                devIsChecked=r.find('[data-name="dev"]').prop('checked'),
                areaIsChecked=r.find('[data-name="area"]').prop('checked'),
                roadIsChecked=r.find('[data-name="road"]').prop('checked');
            actuType=getDealType(actuType,peoIsChecked,carIsChecked,devIsChecked,areaIsChecked,roadIsChecked);
            _ul.fadeOut(1000);
            //$(this).parent().siblings('[type="checkbox"]').prop('checked',false);
            $(this).parent().siblings('span').text($(this).text()).attr('data-id',$(this).attr('data-id'));
            if(_ulId=='peopleMenu'){
                actuObj.personTypeId= dataId!='-1'?dataId:'';
            }
            if(_ulId=='carMenu'){
                actuObj.carTypeId= dataId!='-1'?dataId:'';
            }
            if(_ulId=='devMenu'){
                actuObj.facilitieTypeId=  dataId!='-1'?dataId:'';
            }
            for(var f in actuObj){
                if(actuObj[f]==''){
                    delete actuObj[f];
                }
            }
            if(timer){
                removeTimer(timer);
                removeIcon();
                paintAllIcon(actuType.slice(0,actuType.length-1),actuObj);
                timer=setInterval(function(){
                    if(actuType.indexOf('3')!=-1){
                        actuType=actuType.replace('3','');
                        if(actuType.indexOf(',,')!=-1){
                            actuType=actuType.replace(',,',',')
                        }
                    }
                    removeIcon();
                    paintAllIcon(actuType.slice(0,actuType.length-1),actuObj);
                },TimerTime);
            }
            return false;
        });
    }
    /*获取人和车和设施  绘制全部图标
    *  {type} string (0人员、1车辆、2设施、3区域、 4线路如果查询多个请用逗号隔开)
    *  {idObj} obj  { personTypeId:'',  carTypeId:'', facilitieTypeId:''}
    * */
    function paintAllIcon(type,idObj){
        if(!type){
            removeTimer();
            $('.rMapList [data-name="area"]').prop('checked',false);
            return ;
        }
        var cfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/findMapInfo',
            data:{
                deptId:getCookie('deptId')
            },
            success:function(data){
                    var serviceData=data.data;
                    emptyObj(carListObj);
                    emptyObj(personListObj);
                    emptyObj(devListObj);
                    for(var i in serviceData.carRealTimeDataList ){
                        var carArr= carListObj[serviceData.carRealTimeDataList[i].typeId] || [];
                        carArr.push(serviceData.carRealTimeDataList[i]);
                        carListObj[serviceData.carRealTimeDataList[i].typeId]=carArr;
                    }
                    for(var i in serviceData.PersonRealTimeDataList){
                        var peopleArr= personListObj[serviceData.PersonRealTimeDataList[i].typeId] || [];
                        peopleArr.push(serviceData.PersonRealTimeDataList[i]);
                        personListObj[serviceData.PersonRealTimeDataList[i].typeId]=peopleArr;
                    }
                    for(var i in serviceData.facilitiesList){
                        var devArr= devListObj[serviceData.facilitiesList[i].typeId] || [];
                        devArr.push(serviceData.facilitiesList[i]);
                        devListObj[serviceData.facilitiesList[i].typeId]=devArr;
                    }
                    areaListObj=serviceData.area?serviceData.area:[];
                    roadListObj=serviceData.route?serviceData.route:[];
                    if(currType.indexOf('0')!=-1){//人员
                        if(personListObj && !lx.isEmptyObj(personListObj)&& flag.peo){
                            paintPeople(personListObj);
                        }
                    }
                    if(currType.indexOf('1')!=-1){//车辆
                        if(carListObj && !lx.isEmptyObj(carListObj) && flag.car){
                            paintCar(carListObj);
                        }
                    }
                    if(currType.indexOf('2')!=-1){//设备
                        if(devListObj && !lx.isEmptyObj(devListObj) && flag.dev){
                            paintDevice(devListObj);
                        }
                    }
                    if(currType.indexOf('3')!=-1){//区域
                        if(areaListObj && !lx.isEmptyObj(areaListObj) && flag.area){
                            paintArea(areaListObj);
                        }
                    }
                    if(currType.indexOf('4')!=-1){//路线
                        if(roadListObj && !lx.isEmptyObj(roadListObj) && flag.road){
                            paintRoad(roadListObj);
                        }
                    }
                  /*  personList=serviceData.PersonRealTimeDataList?serviceData.PersonRealTimeDataList:[];
                    carList=serviceData.carRealTimeDataList?serviceData.carRealTimeDataList:[];
                    devList=serviceData.facilitiesList?serviceData.facilitiesList:[];
                    areaList=serviceData.area?serviceData.area:[];
                    roadList=serviceData.route?serviceData.route:[];
                    if(type.indexOf('0')!=-1){//人员
                        if(personList && personList.length>0 && flag.peo){
                            paintPeople(personList);
                        }
                    }
                    if(type.indexOf('1')!=-1){//车辆
                        if(carList && carList.length>0 && flag.car){
                            paintCar(carList);
                        }
                    }
                    if(type.indexOf('2')!=-1){//设备
                        if(devList && devList.length>0 && flag.dev){
                            paintDevice(devList);
                        }
                    }
                    if(type.indexOf('3')!=-1){//区域
                        if(areaList && areaList.length>0 && flag.area){
                            paintArea(areaList);
                        }
                    }
                    if(type.indexOf('4')!=-1){//路线
                        if(roadList && roadList.length>0 && flag.road){
                            paintRoad(roadList);
                        }
                    }*/
            },
            error:function(data){
            }
        };
        cfg.data.dealType=type;
        if(idObj && idObj.toString()=='[object Object]'){
            for(var key in idObj){
                cfg.data[key]= idObj[key];
            }
        }
        customAjax(cfg);
    }
    //绘制车辆
    function paintCar(totalCar){
        var carMapData={};
        for(var k in totalCar){
            for(var i=0;i<totalCar[k].length;i++){
            var t=totalCar[k][i];
                if(t.realtimeLon && t.realtimeLat){
                    var jsonData={"lng":t.realtimeLon,"lat":t.realtimeLat,"status": parseInt(t.status),"id":'1'+t.carId,"carId":t.carId,"typeName":t.dictionaryName,"typeId":t.typeId,"dealType":"1","labelName":t.carNum};
                    if(t.alarmStatus=='1'){
                        jsonData.status=99; //将报警存入同一个字段
                    }
                    var carArr = carMapData[t.typeId+"_"+jsonData.status] || [];
                    carArr.push(jsonData);
                    carMapData[t.typeId+"_"+jsonData.status] = carArr;
                }
            }
        }
        //绘制车辆 摆臂车 电动车 勾臂车 巡查车 扫地车 洒水车 压缩车 自卸车 转运车  翻斗车  工程车
        for(var oneArrKey in carMapData){
            var arrTmp = oneArrKey.split("_");
            var iconKey = carTypeAlias[arrTmp[0]]+pubStatusAlias[arrTmp[1]];
            addIcon(carMapData[oneArrKey],iconKey,paddingDetail.car);
        }
        /*var carMapData={};
        for(var i=0;i<totalCar.length;i++){
            var t=totalCar[i];
            if(t.realtimeLon && t.realtimeLat){
                var jsonData={"lng":t.realtimeLon,"lat":t.realtimeLat,"status": parseInt(t.status),"id":'1'+t.carId,"carId":t.carId,"typeName":t.dictionaryName,"typeId":t.typeId,"dealType":"1","labelName":t.carNum};
                if(t.alarmStatus=='1'){
                    jsonData.status=99; //将报警存入同一个字段
                }
                var carArr = carMapData[t.typeId+"_"+jsonData.status] || [];
                carArr.push(jsonData);
                carMapData[t.typeId+"_"+jsonData.status] = carArr;
            }
        }
        //绘制车辆 摆臂车 电动车 勾臂车 巡查车 扫地车 洒水车 压缩车 自卸车 转运车  翻斗车  工程车
        for(var oneArrKey in carMapData){
           var arrTmp = oneArrKey.split("_");
           var iconKey = carTypeAlias[arrTmp[0]]+pubStatusAlias[arrTmp[1]];
           addIcon(carMapData[oneArrKey],iconKey,paddingDetail.car);
        }*/
    }
    //绘制人员
    function paintPeople(totalPeople){
        var peoMapData={};
        for(var k in totalPeople){
            for(var i=0;i<totalPeople[k].length;i++){
                var t=totalPeople[k][i];
                var jsonData={"lng":t.realtimeLon,"lat":t.realtimeLat,"status": parseInt(t.status),"id":'2'+t.personId,"personId":t.personId,"typeName":t.dictionaryName,"typeId":t.typeId,"dealType":"0","labelName":t.personName};
                if(t.alarmStatus=='1'){
                    jsonData.status=99; //将报警存入同一个字段
                }
                var peoArr = peoMapData[t.typeId+"_"+jsonData.status] || [];
                peoArr.push(jsonData);
                peoMapData[t.typeId+"_"+jsonData.status] = peoArr;
            }
        }

        //道路保洁0  驾驶员1  巡查人员2  公厕管理3  机动人员4  跟车人员5  河道清运6  社区保洁7  填埋人员8
        for(var oneArrKey in peoMapData){
            var arrTmp = oneArrKey.split("_");
            var iconKey = peoTypeAlias[arrTmp[0]]+pubStatusAlias[arrTmp[1]];
            addIcon(peoMapData[oneArrKey],iconKey,paddingDetail.people);
        }
        /*var peoMapData={};
        for(var i=0;i<totalPeople.length;i++){
            var t=totalPeople[i];
            var jsonData={"lng":t.realtimeLon,"lat":t.realtimeLat,"status": parseInt(t.status),"id":'2'+t.personId,"personId":t.personId,"typeName":t.dictionaryName,"typeId":t.typeId,"dealType":"0","labelName":t.personName};
            if(t.alarmStatus=='1'){
                jsonData.status=99; //将报警存入同一个字段
            }
            var peoArr = peoMapData[t.typeId+"_"+jsonData.status] || [];
            peoArr.push(jsonData);
            peoMapData[t.typeId+"_"+jsonData.status] = peoArr;
        }
        //道路保洁0  驾驶员1  巡查人员2  公厕管理3  机动人员4  跟车人员5  河道清运6  社区保洁7  填埋人员8
        for(var oneArrKey in peoMapData){
            var arrTmp = oneArrKey.split("_");
            var iconKey = peoTypeAlias[arrTmp[0]]+pubStatusAlias[arrTmp[1]];
            addIcon(peoMapData[oneArrKey],iconKey,paddingDetail.people);
        }*/
    }
    //绘制设施
    function paintDevice(totalDevice){
        var peelDev=[],    //果皮箱
            dustbinDev=[], //垃圾箱
            transferDev=[],//中转站
            buryDev= [],   //掩埋厂
            toiletDev=[] ;    //公厕
        for(var k in totalDevice){
            for(var i=0;i<totalDevice[k].length;i++){
                var t=totalDevice[k][i];
                var jsonData={"lng":t.msgLon,"lat":t.msgLat,"id":t.facilitiesId,"devId":t.facilitiesId,"typeName":t.dictionaryName,"typeId":t.typeId,"dealType":"2","labelName":t.facName};
                //公厕 中转站 掩埋厂 垃圾箱 果皮箱
                if(t.msgLat && t.msgLon){
                    if(t.typeId=='0'){ //公厕
                        toiletDev[toiletDev.length]=jsonData;
                    }else if(t.typeId=='1'){//中转站
                        transferDev[transferDev.length]=jsonData;
                    }else if(t.typeId=='2'){//掩埋厂
                        buryDev[buryDev.length]=jsonData;
                    }else if(t.typeId=='3'){//垃圾箱
                        dustbinDev[dustbinDev.length]=jsonData;
                    }else if(t.typeId=='4'){//果皮箱
                        peelDev[peelDev.length]=jsonData;
                    }
                }
            }
        }
        //道路保洁
        addIcon(peelDev,'peel',paddingDetail.dev);
        addIcon(dustbinDev,'dustbin',paddingDetail.dev);
        addIcon(transferDev,'transfer',paddingDetail.dev);
        addIcon(buryDev,'bury',paddingDetail.dev);
        addIcon(toiletDev,'toilet',paddingDetail.dev);

       /* var peelDev=[],    //果皮箱
            dustbinDev=[], //垃圾箱
            transferDev=[],//中转站
            buryDev= [],   //掩埋厂
            toiletDev=[] ;    //公厕
        for(var i=0;i<totalDevice.length;i++){
            var t=totalDevice[i];
            var jsonData={"lng":t.msgLon,"lat":t.msgLat,"id":t.facilitiesId,"devId":t.facilitiesId,"typeName":t.dictionaryName,"typeId":t.typeId,"dealType":"2","labelName":t.facName};
            //公厕 中转站 掩埋厂 垃圾箱 果皮箱
            if(t.msgLat && t.msgLon){
                if(t.typeId=='0'){ //公厕
                    toiletDev[toiletDev.length]=jsonData;
                }else if(t.typeId=='1'){//中转站
                    transferDev[transferDev.length]=jsonData;
                }else if(t.typeId=='2'){//掩埋厂
                    buryDev[buryDev.length]=jsonData;
                }else if(t.typeId=='3'){//垃圾箱
                    dustbinDev[dustbinDev.length]=jsonData;
                }else if(t.typeId=='4'){//果皮箱
                    peelDev[peelDev.length]=jsonData;
                }
            }
        }
        //道路保洁
        addIcon(peelDev,'peel',paddingDetail.dev);
        addIcon(dustbinDev,'dustbin',paddingDetail.dev);
        addIcon(transferDev,'transfer',paddingDetail.dev);
        addIcon(buryDev,'bury',paddingDetail.dev);
        addIcon(toiletDev,'toilet',paddingDetail.dev);*/
    }
    //绘制区域
    function paintArea(totalArea){
        var l=totalArea.length;
        for(var i=0;i<l;i++){
            var pointArr=totalArea[i].geoms.split(';'),
                copyPoint=[];
            for(j=0;j<pointArr.length-1;j++){
                copyPoint[copyPoint.length]={'area_lon':pointArr[j].split(',')[0],'area_lat':pointArr[j].split(',')[1]};
            }
            drawRail(copyPoint,totalArea[i].id);
        }
        function drawRail(arr,ind){
            var points=[];
            $.each(arr,function(ind,val){
                points.push(map.createPoint(this.area_lon,this.area_lat))
            });
            map.createOverlay(points,"line2","rail_id"+ind);
        }
    }
    //绘制路线
    function paintRoad(totalRoad){
        var l=totalRoad.length;
        for(var i=0;i<l;i++){
            var datas = {"type": 1, "id": "roadLine"+totalRoad[i].id, "line": "line3"};
            var pointArr=totalRoad[i].geoms.split(';').join(',').split(','),
                copyPoint=[];
            for(j=0;j<pointArr.length-1;j++){
                copyPoint.push(pointArr[j])
            }
            datas.data =copyPoint;
            map.route(datas);
        }
    }
    //绘制具体点
    function addIcon(arr,iconName,callback){
        var callback=callback || doIt;
        if(arr.length>0){
            map.addPoint({type:1,"evt":callback,"icon":iconName,data:arr});
        }
    }
    //填充弹窗以及右侧操作按钮
    function paddingHtml(map){
        var c=$('.car-info'),     //车辆
            p=$('.people-info'),  //人员
            d=$('.dev-info'),     //设备
            l=$('.operate-list'), //右侧操作列表
            v=$('.video-info'),   //视频
            a=$('.alarm-info');   //报警
        var cHtml=`<div class="form-list-small carInfo" id="carInfo" style="width:440px;height: auto;overflow: auto;">
                        <div class="form-body" style="padding-right: 0">
                            <div class="section">
                                <div class="section-body carInfoPopup">
                                    <ul class="clear">
                                        <li class="carImg">
                                            <img src="../../../res/img/default/loadFail_car.png">
                                        </li>
                                        <li class="colorBlue">
                                            <span>驾驶员 :</span>
                                            <p data-class="dirverName"></p>
                                        </li>
                                        <li class="colorBlue">
                                            <span>GPS设备号 :</span>
                                            <p data-class="gpsId"></p>
                                        </li>
                                        <li>
                                            <span>联系电话 :</span>
                                            <p data-class="driverPhone"></p>
                                        </li>
                                        <li>
                                            <span>方&nbsp;&nbsp;&nbsp;向 :</span>
                                            <p data-class="direction"></p>
                                        </li>
                                        <li>
                                            <span>车&nbsp;&nbsp;&nbsp;型 :</span>
                                            <p data-class="carType"></p>
                                        </li>
                                        <li class="colorBlue">
                                            <span>车&nbsp;&nbsp;&nbsp;速 :</span>
                                            <p data-class="carSpeed"></p>
                                        </li>
                                        <li class="colorRed">
                                            <span>当前油量 :</span>
                                            <p data-class="carOil"></p>
                                        </li>
                                        <li>
                                            <span>定位时间 :</span>
                                            <p data-class="realTime"></p>
                                        </li>
                                        <li class="maxWLi colorBlue">
                                            <span>当前位置 :</span>
                                            <p data-class="realPlace"></p>
                                        </li>
                                        <li class="maxWLi">
                                            <span>所属部门 :</span>
                                            <p data-class="deptName"></p>
                                        </li>
                                        <li class="maxWLi carTimeRoute">
                                            <i class="iconfont icon-jingbao"></i>
                                            <span class="carTime">2017-10-16</span>
                                            <span class="carRoute">偏离路线<em>60</em>km</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="form-btn">
                            <ul class="btnSelectCar">
                                <!--<li onclick="detailClick.video()">视频查看</li>-->
                                <li onclick="detailClick.pathPlayBack.call(this)" class="path" data-type="1">查看轨迹</li>
                                <li onclick="detailClick.carAlarm1.call(this)" class="alarm">报警数据</li>
                                <!--<li>查看油耗</li>-->
                            </ul>
                        </div>
                   </div>`;
        var pHtml=`<div class="form-list-small carInfo" style="width:440px;height: auto;overflow: auto;" id="peopleInfo">
                        <div class="form-body">
                            <div class="section">
                                <div class="section-body carInfoPopup">
                                    <ul class="clear">
                                        <li class="carImg">
                                             <img src="../../../res/img/default/loadFail_peo.png">
                                        </li>
                                        <li class="colorBlue">
                                            <span>工&nbsp;&nbsp;&nbsp;种 :</span>
                                            <p data-class="dictionaryName"></p>
                                        </li>
                                         <li>
                                            <span>定位时间 :</span>
                                            <p data-class="gpsTime"></p>
                                        </li>
                                        <li>
                                            <span>联系电话 :</span>
                                            <p data-class="personPhone"></p>
                                        </li>
                                        <li class="maxWLi colorBlue">
                                            <span>卡&nbsp;&nbsp;&nbsp;号 :</span>
                                            <p data-class="instrumentId" ></p>
                                        </li>
                                        <li class="maxWLi">
                                            <span>所属部门 :</span>
                                            <p data-class="deptName"></p>
                                        </li>
                                        <li class="maxWLi">
                                            <span>当前位置 :</span>
                                            <p data-class="realPlace"></p>
                                        </li>
                                        <li class="maxWLi carTimeRoute">
                                            <i class="iconfont icon-jingbao"></i>
                                            <span class="carTime">2017-10-16</span>
                                            <span class="carRoute">偏离路线<em>60</em>km</span>
                                        </li>
                                        <li class="maxWLi">
                                            <span>排班情况 :</span>
                                            <p data-class="workSituation">暂无</p>
                                        </li>
                                     <!--   <li class="colorBlue">
                                            <span>上班时间 :</span>
                                            <p data-class="clockTime"></p>
                                        </li>
                                        <li class="colorBlue">
                                            <span>下班时间 :</span>
                                            <p data-class="downClockTime"></p>
                                        </li> -->
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="form-btn">
                            <ul class="btnSelectCar">
                                <li onclick="detailClick.pathPlayBack.call(this)" class="path"  data-type="0">查看轨迹</li>
                                <li onclick="detailClick.peoAlarm1.call(this)" class="alarm">报警数据</li>
                            </ul>
                        </div>
                    </div>`;
        var dHtml=`<div class="form-list-small devInfo" id="devInfo" style="width:280px;height: auto;overflow: auto;">
                        <div class="form-body" style="border-bottom:0">
                            <div class="section">
                                <div class="section-body peelInfoPopup">
                                    <ul class="clear">
                                        <li class="carImg" style="padding-right:0 !important;">
                                            <img src="../../../res/img/default/loadFail_dev.png">
                                        </li>
                                        <li>
                                            <span>设备名称 :</span>
                                            <p data-class="facName"></p>
                                        </li>
                                        <li>
                                            <span>设备编号 :</span>
                                            <p data-class="facilitiesId"></p>
                                        </li>
                                        <li>
                                            <span>责任人 :</span>
                                            <p data-class="personName"></p>
                                        </li>
                                        <li>
                                            <span>所属部门 :</span>
                                            <p data-class="deptName"></p>
                                        </li>
                                       <!-- <li>
                                            <span>设施位置:</span>
                                            <p data-class="">成都</p>
                                        </li>-->
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`;
        var lHtml=` <div class="fullScreen" data-flag="0" onclick="handleClick.fullScreen()" title='全屏'>
                        <i class="iconfont icon-quanping"></i>
                    </div>
                    <div class="ranging"  title='测距'>
                        <i class="iconfont icon-iconceju"></i>
                    </div>
                    <div class="clear-checked" onclick="handleClick.clearChecked()" title="取消全选">
                        <i class="iconfont icon-qingping"></i>
                    </div>`;
                    /*<div class="flat">
                        <i class="iconfont icon-ditu"></i>
                    </div>
                    <div class="satellite">
                        <i class="iconfont icon-guiji"></i>
                    </div>*/
        var vHtml=`<div class="form-list-small videoInfo" id="videoInfo" style="width:440px;display: block">
                        <h5 class="title clear">
                            <span class="titleText">藏D8900</span>
                            <span class="titleState">状态:<em>正在作业</em></span>
                            <i class="icon iconfont icon-cheng"></i>
                        </h5>
                        <div class="form-body">
                            <div class="section">
                                <div class="section-body videoInfoPopup">
                                    <ul class="clear">
                                        <li class="carImg">
                                            <img src="">
                                            <p class="videoTime">2017-10-16<em>18:30</em></p>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>`;
        var aHtml=`<div class="form-list-small" id="alarmInfo">
                        <h5 class="title clear">
                            <span class="titleText">藏D8900</span>
                            <i class="icon iconfont icon-cheng"></i>
                        </h5>
                        <div class="form-body">
                            <div class="section">
                                <div class="section-body">
                                    <dl class="caption">
                                        <dd>报警时间</dd>
                                        <dd>报警地点</dd>
                                        <dd>报警内容</dd>
                                        <dd>报警等级</dd>
                                        <dd>处理情况</dd>
                                    </dl>
                                    <dl class="content">
                                        <!--<dd></dd>-->
                                        <!--<dd></dd>-->
                                        <!--<dd></dd>-->
                                        <!--<dd></dd>-->
                                        <!--<dd></dd>-->
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>`;
        if(c.length>0){
            c.html(cHtml).css({'display':'none'})
        }
        if(p.length>0){
            p.html(pHtml).css({'display':'none'})
        }
        if(d.length>0){
            d.html(dHtml).css({'display':'none'})
        }
        if(v.length>0){
            v.html(vHtml).css({'display':'none'});
        }
        if(a.length>0){
            // a.html(aHtml);
            a.html(aHtml1);

        }
        l.html(lHtml);
    }
    // 人员/车辆/设施数据字典获取
    function getDicInfo(){
        var dicCfg={
            token:getCookie("token"),
            url:'datadictionary/queryDataDictionary',
            success:function(data){
                var carDic='<li data-id="-1">车辆</li>',//保存数据字典的数据
                    peopleDic='<li data-id="-1">人员</li>',
                    devDic='<li data-id="-1">设施</li>';
                var realData=data.data;
                if(data && data.data.length>0){
                    for(var i=0;i<realData.length;i++){
                        var rd=realData[i].dictionaryType,
                            htmlStr='<li data-id="'+realData[i].typeId+'" data-type="'+rd+'">'+realData[i].dictionaryName+'</li>'
                        if(rd=='personType'){
                            peopleDic+=htmlStr;
                        }else if(rd=='carType'){
                            carDic+=htmlStr;
                        }else if(rd=='facilitieType'){
                            devDic+=htmlStr;
                        }
                    }
                    $('#peopleMenu').html(peopleDic);
                    $('#carMenu').html(carDic);
                    $('#devMenu').html(devDic);
                }
            }
        };
        customAjax(dicCfg)
    }
    //清空对象
    function emptyObj(obj){
        for(var key in obj){
            delete obj[key];
        }
    }
});
//车辆回调
function openCarPop(evt,jsonData){
    var title,
        titleStatus;
    /*if(evt.target.__status==0){
        titleStatus='未作业';
    }else if(evt.target.__status==1){
        titleStatus='正在作业';
    }*/
    if(jsonData.status==0){
        titleStatus='正在作业';
    }else if(jsonData.status==1){
        titleStatus='未作业';
    }
    if(jsonData && jsonData.carNum){
        title='<h5 class="title clear"><span class="titleText">'+jsonData.carNum+'</span> <span class="titleState">状态:<em>'+titleStatus+'</em></span> </h5>';
    }else{
        title='<h5 class="title clear"><span class="titleText">藏D8900</span> <span class="titleState">状态:<em>正在作业</em></span> </h5>';
    }
    if(jsonData){
        $('.car-info p').each(function(){
            var pro=$(this).attr('data-class');
            if(pro=="carSpeed"){
                if(jsonData[pro]!=null){
                    $(this).html(parseFloat(jsonData[pro])/10+' km/h')
                }
            }else if(pro=='direction'){
                if(jsonData[pro]!=null){
                    var dData=jsonData[pro],
                        str='';
                    if( (dData>=0 && dData<45) || dData>=315 && dData<360 ){
                        str= '朝北';
                    }else if(dData>=45 && dData<135){
                        str= '朝东';
                    }else if(dData>=135 && dData <225){
                        str= '朝南';
                    }else if(dData>=225 && value<315){
                        str= '朝西';
                    }
                    $(this).html(str)
                }

            }else{
                $(this).html(jsonData[pro])
            }
        });
        if(jsonData["alarmName"]=="无报警"){
            $('.carTimeRoute').hide();
        }else{
            $('.carTimeRoute').html(jsonData["alarmName"]).show();
        }
        if(jsonData["carPic"] && jsonData["carPic"]!='' && jsonData["carPic"]!='0'){
            $('#carInfo img').attr('src','').attr('src',requestUrl+'file/view?id='+jsonData["carPic"]);
        }else{
            $('#carInfo img').attr('src','../../../res/img/default/loadFail_car.png');
        }
    }
    //设置carID
    $('#carInfo .path').attr('data-id',evt.target.__actualId /*jsonData["carId"]*/);
    $('#carInfo .alarm').attr('data-id',evt.target.__actualId/*jsonData["carId"]*/);
    var strWin=$('.car-info').html();
    modeHAuto(400);//2017/4/28调用弹出层高度优化方法
    map.openWin(title,strWin,evt.target);

}
//人员回调
function openPeoPop(evt,jsonData){
    var title,
        titleStatus;
    if(evt.target.__status==0){
        titleStatus='未作业';
    }else if(evt.target.__status==1){
        titleStatus='正在作业';
    }
    if(jsonData && jsonData.personName){
        title='<h5 class="title clear"><span class="titleText">'+jsonData.personName+'</span><span class="titleState">状态:<em>'+titleStatus+'</em></span> </h5>' ;
    }else{
        title='<h5 class="title clear"><span class="titleText">次仁多杰</span><span class="titleState">状态:<em>正在作业</em></span> </h5>' ;
    }
    if(jsonData){
        $('.people-info p').each(function(){
            var pro=$(this).attr('data-class');
            $(this).html(jsonData[pro])
        });
        if(jsonData["alarmName"]=="无报警"){
            $('.carTimeRoute').hide();
        }else{
            $('.carTimeRoute').html(jsonData["alarmName"]).show();
        }
        $('#peopleInfo .alarm').attr('data-id',jsonData["personId"]);
        if(jsonData["picId"] && jsonData["picId"]!='' && jsonData["picId"]!='0'){
            $('#peopleInfo img').attr('src','').attr('src',requestUrl+'file/view?id='+jsonData["picId"]);
        }else{
            $('#peopleInfo img').attr('src','../../../res/img/default/loadFail_peo.png');
        }
    }
    //设置peopleId
    $('#peopleInfo .path').attr('data-id',evt.target.__actualId /*jsonData["carId"]*/);
    $('#peopleInfo .alarm').attr('data-id',evt.target.__actualId/*jsonData["carId"]*/);
    var strWin=$('.people-info').html();
    modeHAuto(400);//2017/4/28调用弹出层高度优化方法
    map.openWin(title,strWin,evt.target);
}
//设施回调
function openDevPop(evt,jsonData){
    var title;
    if(jsonData && jsonData.facNum){
        title=' <h5 class="title clear"><span>'+jsonData.facNum+'基本信息</span></h5>';
    }else{
        title=' <h5 class="title clear"><span>基本信息</span></h5>';
    }
    if(jsonData){
        $('.dev-info p').each(function(){
            var pro=$(this).attr('data-class');
            $(this).html(jsonData[pro])
        });
        if(jsonData["picId"] && jsonData["picId"]!='' && jsonData["picId"]!='0'){
            $('#devInfo img').attr('src','').attr('src',requestUrl+'file/view?id='+jsonData["picId"])
        }else{
            $('#devInfo img').attr('src','../../../res/img/default/loadFail_dev.png');
        }
    }
    var strWin=$('.dev-info').html();
    modeHAuto(350);//2017/4/28调用弹出层高度优化方法
    map.openWin(title,strWin,evt.target);
}
//填充详情函数
var paddingDetail={
    people:function(evt){
        var peoCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/getObjectInfo',
            data:{
                dealType:evt.target.__dealType,
                objectId:evt.target.__actualId
            },
            success:function(data){
                if(data.data){
                    var jsonData=data.data.personViewInfo;
                    openPeoPop(evt,jsonData);
                    titleTxt=jsonData.personName;
                }else{
                    layer.msg('数据异常',{time:1000});
                }
            }
        };
        customAjax(peoCfg)
    },
    car:function(evt){
        var peoCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/getObjectInfo',
            data:{
                dealType:evt.target.__dealType,
                objectId:evt.target.__actualId
            },
            success:function(data){
                if(data.data){
                    var jsonData=data.data.carViewInfo;
                    openCarPop(evt,jsonData);
                    titleTxt=jsonData.carNum;
                }else{
                    layer.msg('数据异常',{time:1000});
                }

            }
        };
        customAjax(peoCfg)
    },
    dev:function(evt){
        var peoCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/getObjectInfo',
            data:{
                dealType:evt.target.__dealType,
                objectId:evt.target.__actualId
            },
            success:function(data){
                if(data.data){
                    var jsonData=data.data.facilitieInfo;
                    openDevPop(evt,jsonData);
                }else{
                    layer.msg('数据异常',{time:1000});
                }

            }
        };
        customAjax(peoCfg)
    }
};
/*获取当前页面名称*/
function getPageName(){
    return window.location.href.split('/')[window.location.href.split('/').length-1] ;
}
//右侧div点击函数
var handleClick={
    fullScreen:function(){
        if($(this).attr('data-flag')=='0'){//全屏
            $('.rTMLBox').css('display','none');
            $('.nav-box2',window.parent.document).css('display','none');
            $('.content2',window.parent.document).css('paddingLeft',0);
            $(this).find('i').attr('class','iconfont icon-fanhui');
            $(this).attr('data-flag','1');

            $('.fullScreen').attr('title','退出全屏');
        }else{//退出全屏
            $('.rTMLBox').css('display','block');
            $('.nav-box2',window.parent.document).css('display','block');
            $('.content2',window.parent.document).css('paddingLeft','50px');
            $(this).find('i').attr('class','iconfont icon-quanping');
            $(this).attr('data-flag','0');
            $('.fullScreen').attr('title','全屏');
        }
    },
    clearChecked:function(){

        $('.rMapList input').each(function(){
            var d=$(this).attr('data-attr');
            if(d!='true'){
                $(this).prop('checked',false);
                $(this).attr('data-attr','true');

                $('.clear-checked').attr('title','全选')
            }else{
                $(this).prop('checked',true);
                $(this).attr('data-attr','false');
                $('.clear-checked').attr('title','取消全选')
            }
        })
    }
};
//详情click函数
var detailClick={
    video:function(){
        layer.open(publicObj({
            kind:'layer',
            area:'440px',
            content:$('.video-info'),
            move:$('.video-info .title'),
            success:function(){}
        }));
    },
    pathPlayBack:function(){
        var _this=$(this);
        var selfId=_this.attr('data-id'), //id
            dealType=_this.attr('data-type'), //类型 0 人  1车
            curPageName=getPageName(); //当前页面名称
        window.location.href='pathPlayBack.html?id='+selfId+'&type='+dealType+'&previous='+curPageName+'';
    },
    peoAlarm:function(){
        var oId=$(this).attr('data-id');
        var alarmCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/findAllWarningInfo',
            data:{
                deptId:getCookie('deptId'),
                objectId:oId,
                type:0
            },
            success:function(data){
                data=data.data[0].personWarningList;
                if(data.length>0){
                    var str='';
                    $('#alarmInfo .titleText').text(data[0].personName);
                    for(var i=0;i<data.length;i++){
                        for(var k in data[i]){
                            if(k=='alarmTime' || k=='alarmPlace' || k=='alarmRemark'){
                                str+='<dd>'+data[i][k]+'</dd>';
                            }
                            if(k=='alarmStatus'){
                                if(data[i][k]==1){
                                    str+='<dd>处理</dd>';
                                }else{
                                    str+='<dd>未处理</dd>';
                                }
                            }
                            if(k=='alarmLevel'){
                                if(data[i][k]==0){
                                    str+='<dd>一般</dd>';
                                }else if(data[i][k]==1){
                                    str+='<dd>紧急</dd>';
                                }else{
                                    str+='<dd>特急</dd>';
                                }
                            }
                        }
                    }
                    $('#alarmInfo .content').html(str);
                    layer.open(publicObj({
                        kind:'layer',
                        area:'660px',
                        content:$('#alarmInfo'),
                        move:$('#alarmInfo .title'),
                        success:function(){

                        }
                    }));
                }else{
                    layer.msg('暂无报警数据',{time:1000});
                }
            }
        };
        customAjax(alarmCfg);
    },
    carAlarm:function(){
        var oId=$(this).attr('data-id');
        var alarmCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/findAllWarningInfo',
            data:{
                deptId:getCookie('deptId'),
                objectId:oId,
                type:1
            },
            success:function(data){
                data=data.data[0].carWarningList;
                if(data.length>0){
                    var str='';
                    $('#alarmInfo .titleText').text(data[0].carNum);
                    for(var i=0;i<data.length;i++){
                        for(var k in data[i]){
                            if(k=='alarmTime' || k=='alarmPlace' || k=='alarmRemark'){
                                str+='<dd>'+data[i][k]+'</dd>';
                            }
                            if(k=='alarmStatus'){
                                if(data[i][k]==1){
                                    str+='<dd>处理</dd>';
                                }else{
                                    str+='<dd>未处理</dd>';
                                }
                            }
                            if(k=='alarmLevel'){
                                if(data[i][k]==0){
                                    str+='<dd>一般</dd>';
                                }else if(data[i][k]==1){
                                    str+='<dd>紧急</dd>';
                                }else{
                                    str+='<dd>特急</dd>';
                                }
                            }
                        }
                    }
                    $('#alarmInfo .content').html(str);
                    layer.open(publicObj({
                        kind:'layer',
                        area:'660px',
                        content:$('#alarmInfo'),
                        move:$('#alarmInfo .title'),
                        success:function(){

                        }
                    }));
                }else{
                    layer.msg('暂无报警数据',{time:1000});
                }


            }
        };
        customAjax(alarmCfg);
    },
    /*2018/1/25*/
    peoAlarm1:function () {
        var oId=$(this).attr('data-id');
        detailClick1.peoAlarm1(oId);
        $titleTxt.text(titleTxt);
    },
    carAlarm1:function () {
        var oId=$(this).attr('data-id');
        detailClick1.carAlarm1(oId);
        $titleTxt.text(titleTxt);
    }
};
//2018/3/8
/*根据部门查找车辆、人员
url:请求车辆或人员的地址
name:下拉列表的搜索key值searchKey
 */
function search_car_pers(dealType) {
    var pid=$('.personDataPopup #personId');
    var data_id=$('#deptId').attr('data-id');
    var $span=pid.siblings('span');
    if(dealType=='0'){
        $span.html('人员姓名:');
    }
    if(dealType=='1'){
        $span.html('车牌号:');
    }
    pid.vagueSearch({
        pageSize:1000,
        deptId:data_id,
        searchKey:'sorldName',
        dealType:dealType,
        url:'realTimeProtectionService/findTreeSoild'
    });
}
$(window).resize(function () {
    modeHAuto(300)
})
/*2018/4/28弹出层高度自适应start*/
function modeHAuto(h1) {
    var $carInfo=$('#carInfo,#peopleInfo,#devInfo');
    var h=$(window).height(); //浏览器时下窗口可视区域高度
    var modeH=$carInfo.height();
    if(h<h1){
        $carInfo.css({'height':(h-120)+'px'})
    }else{
        $carInfo.css({'height':'inherit'})
    }
}

