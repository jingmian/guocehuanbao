var searchParam={
        deptId:serverData.deptId
    }, //请求数据
    nowDate=new Date(),
    initY=nowDate.getFullYear(),
    initM=nowDate.getMonth()+1,
    initM=initM<10?'0'+initM:initM,
    _StartTime=initY+'-'+initM+'-01',
    _EndTime=initY+'-'+initM+'-'+getDays(initY,initM),
    curYear;
var oilCurveDeptId=userDeptId;
var _carType=-1;
//删除对象中的空属性
function deleteObjAttr(obj){
    for(var key in obj){
        if(obj[key]==''){
            delete obj[key]
        }
    }
    return obj;
}
//获取url后参数
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function resetHeight(){
    var h=$('body').height();
    if(h<900){
        $('body').height(900)
    }
}
//得到指定年月
function getMonthDays(year,month){
    if (year && month) {
        return new Date(year, month, 0).getDate();
    } else {
        var date = new Date();
        return new Date(date.getFullYear(), parseInt(time.timeTransform(date.getMonth() + 1)), 0).getDate();
    }
}
function getDays(year,month){
    var d=new Date(year,month,0);
    return d.getDate();
}
//清空对象
function emptyObj(obj){
    for(var key in obj){
        if(key!='type') delete obj[key];
    }
    return obj;
}
/*刷新*/
function refreshReport(){
    switch (lx.staticsName){
        case 'totalCost':
            updateArg(totalCostCfg,totalCostOpt);
            break;
        case 'publicCost':
            updateArg(costCfg,costOpt);
            break;
        case 'publicOil':
            updateArg(oilCfg,oilOpt);
            break;
        case 'publicSitu':
            updateArg(situCfg,situOpt);
            break;
        case 'oilCurveStatist':
            updateArg(oilCurveCfg,oilCurveOpt);
            break;
    }
}
initSearch();
function initSearch(){
    var searchInput=$('.search-window [type="text"]');
    $.each(searchInput,function(){
        if($(this).attr('keyid')){
            $(this).removeAttr('keyid');
        }
        $(this).val('');
    });
    $('.search-window select').val('0');
}
/*
* @prarm {_cfg}  图形对象
* @prarm {_opt}  数据表格对象
* */
function updateArg(_cfg,_opt){
    //初始化图形对象参数
    for(var key in _cfg.data){
        if(key=='deptId' || key=='startTime' || key=='endTime' || key=='costType' || key=='type' || key=='dataType' || key=='situType'){

        }else{
            delete _cfg.data[key];
        }
    }
    //初始化数据表格对象
    for(var key in _opt.queryParams){
        if(key=='pageSize'|| key=='pageNo' || key=='deptId' || key=='startTime' || key=='endTime' || key=='costType' || key=='type' || key=='dataType' || key=='situType'|| key=='gatherType') {

        }else{
            delete _opt.queryParams[key];
        }
    }
    //继承参数
    $.each(searchParam,function(ind,val){
        _cfg.data[ind]= val;
        _opt.queryParams[ind]=val;
    });
   /* _cfg.data.startTime=searchParam.startTime;
    _cfg.data.endTime=searchParam.endTime;
    _opt.queryParams.startTime=searchParam.startTime;
    _opt.queryParams.endTime=searchParam.endTime;*/
    customAjax(_cfg);
    datagridFn(_opt);

    /*getCost(_cfg);
    datagridFn(_opt);*/

}
$(function(){
    $('.search-default li.default').click(function(){
        $(this).addClass('active').siblings('li.default').removeClass('active');
        $('.search-condition').css({
            color:'#5e6065',
            backgroundColor:'#fff'
        });
        if($('.oil-time').length>0){
            $('.oil-time li.active').removeClass('active');
        }
    });
    var sTime=new Date(),
        days; //保存当月天数
    var y=sTime.getFullYear();
    curYear=y;
    var m=sTime.getMonth()+1;
    parseInt(m)<10?m='0'+m:m;
    var d=sTime.getDate();
    parseInt(d)<10?d='0'+d:d;
    var clickYear=sTime.getFullYear(),
        clickMonth=sTime.getMonth()+ 1,
        startTime,
        endTime;
    initYear();
    initMonth();
    inputBindTime();
    getCarList();
    getCarType($('#carType'));
    elmBindEvent();
    /*功能函数*/
    function elmBindEvent(){
        //根据部门ID查询部门树
        if($('.search-detail li.year').length>0){
            $('.search-detail li.year').click(function(){  //时间格式2017-01-01 00:00:00
                emptyObj(searchParam);
                var index=$(this).index();
                curYear=$(this).text();
                // currYearData();
                $(this).addClass('active').siblings('.year').removeClass('active');
                var mTime=parseInt($('.search-detail li.active').not('.year').text());
                clickYear=$(this).text();
                $.each($('.search-default .default'),function(ind,val){
                    days=getMonthDays(parseInt(clickYear),clickMonth);
                    var r=$('.search-default .default.active').text();
                    switch (ind){
                        case 0:
                            emptyObj(searchParam); //初始化请求数据
                            if(index==0){
                                if(r=='月统计数据'){
                                    startTime=clickYear+'-'+time.timeTransform(clickMonth)+'-01';
                                    endTime=clickYear+'-'+time.timeTransform(clickMonth)+'-'+days;
                                }else{
                                    startTime=clickYear+'-01-01';
                                    endTime=clickYear+'-12-31';
                                }
                            }else{
                                if(r=='月统计数据'){
                                    startTime=clickYear+'-'+time.timeTransform(mTime)+'-01';
                                    if(mTime!=m){
                                        endTime=clickYear+'-'+time.timeTransform(mTime)+'-'+days;
                                    }else{
                                        endTime=clickYear+'-'+time.timeTransform(mTime)+'-'+d;
                                    }
                                }else{
                                    startTime=clickYear+'-01-01';
                                    endTime=clickYear+'-'+time.timeTransform(clickMonth) +'-'+d;
                                }
                            }
                            searchParam.type=searchParam.type=$('.search-default .active').index()==0?0:1;
                            searchParam.deptId=serverData.deptId;
                            searchParam.startTime=startTime;
                            searchParam.endTime=endTime;
                            refreshReport();
                            return false;
                            break;
                        case 2:
                            emptyObj(searchParam);
                            if(index==0){
                                startTime=clickYear+'-01-01';
                                endTime=clickYear+'-12-31';
                            }else if(index==1){
                                startTime=time.getBeginningYear(sTime);
                                endTime=clickYear+'-'+m+'-'+d;
                            }
                            searchParam.type=$('.search-default .active').index()==0?0:1;
                            searchParam.deptId=serverData.deptId;
                            searchParam.startTime=startTime;
                            searchParam.endTime=endTime;
                            refreshReport();
                            return false;
                            break;
                        case 4:
                            emptyObj(searchParam);
                            startTime='';
                            endTime='';
                            if($.trim($('#startTime').val())!='' && $.trim($('#endTime').val())!=''){
                                startTime=$('#startTime').val();
                                endTime= $('#endTime').val();
                                searchParam.startTime=startTime;
                                searchParam.endTime=endTime;
                                refreshReport();
                                return false;
                            }else{
                                layer.msg('请选择时间段',{time:1000})
                            }
                            break;

                    }
                });
            });
        }
        if($('.search-detail li').not('.year').length>0){
            $('.search-detail li').not('.year').click(function(){
                emptyObj(searchParam);
                searchParam.type=0;
                searchParam.deptId=serverData.deptId;
                $(this).addClass('active').siblings('li').not('.year').removeClass('active');
                clickMonth=parseInt($(this).text());
                var clickMonth1=clickMonth;
                clickMonth1<10?clickMonth1='0'+clickMonth1:clickMonth1;
                var yTime=$('.search-detail').find('li.year.active').text();
                var inner=$('.search-detail .year.active').text();
                startTime='';
                endTime='';
                startTime=yTime+'-'+clickMonth1+'-01';
                days=getMonthDays(parseInt(yTime),clickMonth);
                if(parseInt(clickMonth)<m){
                    endTime=yTime+'-'+clickMonth1+'-'+days;
                }else{
                    if(yTime!=y){//去年
                        endTime=yTime+'-'+time.timeTransform(clickMonth)+'-'+days;
                    }else{//今年
                        if(clickMonth==m){
                            endTime=yTime+'-'+time.timeTransform(clickMonth)+'-'+d;
                        }else{
                            endTime=yTime+'-'+time.timeTransform(clickMonth)+'-'+days;
                        }
                    }
                }
                searchParam.startTime=startTime;
                searchParam.endTime=endTime;
                refreshReport();
            });
        }
        //自定义查询
        $('.search-default .custom').click(function(){
            searchParam.type=2;
            $('.search-window p.time').css({'display':'inline-block'});
            var s=$('.search-window').css('display');
            if(s=='block'){
                $('.search-window').hide();
                $('.search').css({marginBottom:0});
            }else{
                $('.search-window').show();
                $('.search').css({marginBottom:"36px"});
            }
        });
        //条件查询
        $('.search-condition').click(function(){
            $('.search-window p.time').css({'display':'none'});
            var s=$('.search-window').css('display');
            if(s=='block'){
                if($('.custom').hasClass('active')){
                    $(this).css({
                        color:'#fff',
                        backgroundColor:'#0c7fc9'
                    });
                    $('.custom').removeClass('active');
                    $(this).attr({'data-show':'show'});
                }else{
                    $('.search-window').hide();
                    $('.search').css({marginBottom:0});
                    $(this).css({
                        color:'#5e6065',
                        backgroundColor:'#fff'
                    });
                    $(this).attr({'data-show':'hide'})
                }
                $(this).find('em').removeClass('icon-sanjiao-copy-copy-copy1').addClass('icon-sanjiao-copy-copy-copy');

            }else{
                $('.search-window').show();
                $(this).css({
                    color:'#fff',
                    backgroundColor:'#0c7fc9'
                });
                $('.search').css({marginBottom:"36px"});
                $(this).attr({'data-show':'show'});
                $(this).find('em').removeClass('icon-sanjiao-copy-copy-copy').addClass('icon-sanjiao-copy-copy-copy1');
            }
        });
        //选择年
        if($('.search-default .default').length>0){
            $('.search-default .default').click(function(){
                $('.search-condition').find('em').removeClass('icon-sanjiao-copy-copy-copy1').addClass('icon-sanjiao-copy-copy-copy');
                var s=$('.search-window').css('display');
                if($(this).index()==0){
                    $('.search-detail').show();
                    $('.search-detail li').not('.year').show();
                    if(s=='block'){
                        $('.search-window').hide();
                        $('.search').css({marginBottom:0});
                    }
                    $('.search-condition').css({'display':'inline-block'});
                    initYear();
                    initMonth();
                    emptyObj(searchParam);
                    searchParam.startTime=_StartTime;
                    searchParam.endTime=_EndTime;
                    searchParam.deptId=serverData.deptId;
                    searchParam.type=0;
                    refreshReport();
                }else if($(this).index()==2){
                    $('.search-detail').show();
                    $('.search-detail li').not('.year').hide();
                    if(s=='block'){
                        $('.search-window').hide();
                        $('.search').css({marginBottom:0});
                    }
                    $('.search-condition').css({'display':'inline-block'});
                    initYear();
                    emptyObj(searchParam);
                    searchParam.startTime=initY+'-01-01';
                    searchParam.endTime=_EndTime;
                    searchParam.deptId=serverData.deptId;
                    searchParam.type=1;
                    refreshReport();
                }else if($(this).index()==4){
                    $('.search-detail').hide();
                    $('.search-condition').css({'display':'none'});
                    emptyObj(searchParam);
                    searchParam.type=2;
                }
            });
        }
        //获取部门
        if( $('#dept').length>0){
            $('#dept').click(function () {
                findDeptTree($("#windowTree"));
                var treeIndex = layer.open({
                    title: false,
                    closeBtn: 1,
                    type: 1,
                    area: '400px',
                    content: $('#form-Tree'),
                    move: $('#form-Tree .form-top'),
                    success: function () {
                    }
                });
                // $('#form-Tree .submit-btn').off();
                $('#form-Tree .submit-btn').click(function () {
                    layer.close(treeIndex);
                });
            });
        }
        if(lx.getPageName()!='attendStatist.html'){
            $(".search .yes").click(function(){
                emptyObj(searchParam); //初始化请求数据
                var activeInd=$('.search-default .active').index();
                var curDate=new Date();
                var yearData=$('.search-detail .year.active');
                //自定义查询
                searchParam.deptId=serverData.deptId;//2018/4/28部门id默认值
                $('#dept').val() && (searchParam.deptId=$('#dept').attr('keyid'));
                $('#carNum').val() &&(searchParam.carNum=$('#carNum').val());
                $('#situPeople').val() &&(searchParam.peopleName=$('#situPeople').val());
                if($('.sanitationState').length>0){
                    searchParam.sanitationState=$('#sanitationStateVal').val();
                }
                searchParam.carTypeId=$('#carType').val();
                if($('.search-condition').css('display')=='none' && activeInd==4){
                    if($.trim($('#startTime').val())!='' &&$.trim($('#endTime').val())!=''){
                        searchParam.startTime=$('#startTime').val();
                        searchParam.endTime=$('#endTime').val();
                        refreshReport();
                        // initSearch();
                    }else{
                        layer.msg('请选择时间段!',{time:1000})
                    }
                }else if($('.search-condition').css('display')!='none' &&  activeInd==2){
                    //年统计数据-条件查询
                    searchParam.startTime=yearData.text()+'-01-01';
                    if(yearData.index()==0){//去年
                        searchParam.endTime=yearData.text()+'-12-31';
                    }else{//今年
                        searchParam.endTime=yearData.text()+'-'+(curDate.getMonth()+1)+'-'+curDate.getDate();
                    }
                    refreshReport();
                    // initSearch();
                }else if($('.search-condition').css('display')!='none' &&  activeInd==0){
                    //月统计数据-条件查询
                    var mData=$('.search-detail li.active').not('.year');
                    var mDataText=mData.text();
                    parseInt(mDataText)<10?mDataText='0'+mDataText:mDataText;
                    searchParam.startTime=yearData.text()+'-'+mDataText+'-01';
                    if(yearData.index()==0){//去年
                        if(mDataText=='2'){
                            searchParam.endTime=yearData.text()+'-'+mDataText+'-28';
                        }else{
                            searchParam.endTime=yearData.text()+'-'+mDataText+'-30';
                        }
                    }else{//今年
                        if(parseInt(mDataText)<(curDate.getMonth()+1)){//小于当前月
                            if(mDataText=='2'){
                                searchParam.endTime=yearData.text()+'-'+mDataText+'-28';
                            }else{
                                searchParam.endTime=yearData.text()+'-'+mDataText+'-30';
                            }
                        }else{
                            searchParam.endTime=yearData.text()+'-'+mDataText+'-'+curDate.getDate()
                        }
                    }
                    refreshReport();
                    // initSearch();
                }
            });
        }
    }
    //初始化月
    function initMonth(){
        $.each($('.search-detail li').not('.year'),function(ind,val){
            if($(this).hasClass('active')){
                $(this).removeClass('active')
            }
            if(parseInt($(this).html())==m){
                $(this).addClass('active')
            }
        });
        clickYear=sTime.getFullYear();
    }
    //初始化年
    function initYear(){
        $.each($('.search-detail li.year'),function(ind,val){
            if($(this).hasClass('active')){
                $(this).removeClass('active')
            }
            if(ind==0){
                $(this).html(y-1)
            }else{
                $(this).html(y).addClass('active')
            }
        });
        clickMonth=sTime.getMonth()+1;
    }
    //时间插件
    function inputBindTime(){
        /*var t=$('#timeFormat').attr('data');
        t=t || '1';*/
        var formatTime= lx.getPageName()=='oilConsCurve.html' ?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd';
        var timeInterval=lx.getPageName()=='oilConsCurve.html' ?'#F{$dp.$D(\'startTime\',{d:1})}':'#F{$dp.$D(\'startTime\',{M:2})}';
        $('#startTime').click(function(){
            var eTime=$dp.$('endTime');
            WdatePicker({onpicked:function(){eTime.click();},dateFmt:formatTime,maxDate:'#F{$dp.$D(\'endTime\');}'});
        });
        $('#endTime').click(function(){
            WdatePicker({dateFmt:formatTime,minDate:'#F{$dp.$D(\'startTime\');}',maxDate:timeInterval});
        });
    }
    //2018/1/3
    //部门树
    var setting = {
        view: {
            showIcon: true,
            txtSelectedEnable: true,
            showLine: true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: zTreeClick
        }
    };
    function findDeptTree($dom) {
        var cfg = {
            token: serverData.token,
            url: 'department/findDeptTree',
            data: {deptId: serverData.deptId},
            success: function (data) {
                var nodes = [];
                var result = data.data;
                if (result.length > 0) {
                    nodes = [];
                    for (var i = 0, l = result.length; i < l; i++) {
                        nodes.push({"id": result[i].deptId, "pId": result[i].pid, "name": result[i].deptName});
                    }
                }
                $.fn.zTree.init($dom, setting, openNodes(nodes));
            }
        };
        customAjax(cfg);
    }
    function openNodes(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].open = true;
            if (arr[i].pId == 0) {
                arr[i].iconSkin = "treeRoot";
            } else {
                arr[i].iconSkin = "child";
            }
        }
        return arr;
    }
    function zTreeClick(event, treeId, treeNode) {
        $('#dept').val(treeNode.name).attr('keyid',treeNode.id);
        oilCurveDeptId=treeNode.id;
        getCarList();
    }
    /*2018/4/27根据车辆类型查找车牌号start*/
    $('#carType').change(function () {
        _carType=$(this).val();
        getCarList();
    })
    /*2018/4/27end*/
    //车辆模糊查询
    function getCarList(){
        var opt={
            url:'car/findCar',
            searchKey:'carNum',
            // ids:serverData.deptId,
            ids:oilCurveDeptId,
            carType:_carType,
            pageSize:10000,
            pageNo:1
        };
        if($('#carNum').length>0){
            carList=$('#carNum').vagueSearch(opt);
        }
    }
    //数据字典获取车型
    function getCarType($Dom){
        var dicCfg={
            token: serverData.token,
            url: 'datadictionary/queryDataDictionary',
            data: {
                'dictionaryType':'carType',
                'pageSize':100,
                'pageNo':1
            },
            success: function (data) {
                var str='';
                /*2018/4/26添加全部下拉列表选项start*/
                var option0='<option value="-1">全部</option>';
                str+=option0;
                /*2018/4/26 end*/
                if(data.rows.length>0){
                    for(var i=0;i<data.rows.length;i++){
                        var d=data.rows[i];
                        str+='<option value="'+d.typeId+'">'+d.dictionaryName+'</option>'
                    }
                }
                $Dom.html(str);
            }
        };
        customAjax(dicCfg);
    }
});
//2018/1/8
//统计图底部日期
getMonthDay();
function getMonthDay() {
    var curMonDay=0;
    xData=[];
    var $ul_1=$('.search-default');
    var $ul_2=$('.search-detail');
    var txt1=$ul_1.find('li.active').text();
    var txt2=$ul_2.find('li.year.active.year').text();
    var txt3=$ul_2.find('li.active').not('.year').text();
    if(txt1=='月统计数据'){
        curMonDay=time.getMonthHasDays(txt2,txt3);
        xData=[];
    }
    if(txt1=='年统计数据'){
        curMonDay=12;
        xData=[];
    }
    for (var i = 0; i <curMonDay ; i++) {
        if(i<9){
            xData.push('0'+(i + 1))
        }else{
            xData.push((i + 1));
        }
    }
    return xData;
}
//时间段的值
// timeValue('yyyy-MM-dd HH:mm:ss',2,0);
function timeValue($dateFmt,m,d) {
    /*时间插件*/
    $('#startTime').focus(function () {
        WdatePicker({el: 'startTime',dateFmt:$dateFmt});
    });
    $("#endTime").focus(function(){
        var startTime=$('#startTime').val();
        if(startTime!=''){
            var year=startTime.substring(0,4);
            var month=parseInt(startTime.substring(5,7))+m;
            var month1=month<10?'0'+month:month;
            var day=parseInt(startTime.substring(8,10))+d;
            var time=year+'-'+month1+'-'+day;
            if(d==0){
                $("#endTime").attr({'placeholder':'最大不能超过'+m+'个月'});
            }
            if(m==0){
                $("#endTime").attr({'placeholder':'最大不能超过'+d+'天'});
            }
            WdatePicker({el:"endTime",dateFmt:$dateFmt,minDate:$('#startTime').val(),maxDate:time});
        }

    });
}
