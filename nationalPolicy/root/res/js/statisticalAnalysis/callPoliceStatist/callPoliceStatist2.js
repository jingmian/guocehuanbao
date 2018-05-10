//折线柱状图
var callPoliceType2 = GetQueryString("callPoliceType2");
callPoliceType2 = null==callPoliceType2?"0":callPoliceType2;
//默认参数
searchParam.type=0;
function defaultYearMonth(type) {
    var $year=$('.search-detail li.year.active').text();
    var $month=$('.search-detail li.active').not('.year').text();
    var date=new Date();
    var d=date.getDate();
    if($month.length<2){
        $month='0'+$month;
    }
    if(type==0){
        searchParam.type=0;
        searchParam.nowTime=$year+'-'+$month;
        delete searchParam.startTime;
        delete searchParam.endTime;
    }
    if(type==1){
        searchParam.type=1;
        searchParam.nowTime=$year;
        delete searchParam.startTime;
        delete searchParam.endTime;
    }
    if(type==2){
        searchParam.type=2;
    }
    searchParam.dataType=callPoliceType2;
}
var ignitionName =[],
    ignition=[];
var $num1=$('#num1'),$num2=$('#num2'),$num3=$('#num3');
var attendColor=['#b686f7','#F7553B'];
//设置车辆列表标题
setlistTitle(callPoliceType2);
function setlistTitle(type) {
    var $listTitle=$('#listTitle');
    var $listTitle1=$('#listTitle1');
    var $statName=$('.statName');
    var txt='明细';
    if(type==0){
        title('出区域报警');
    }
    if(type==1){
        title('进区域报警');
    }
    if(type==2){
        title('超速报警');
    }
    if(type==3){
        title('路线偏移报警');
    }
    if(type==4){
        title('停留报警');
    }
    if(type==5){
        title('油耗报警');
    }
    if(type==6){
        title('油量报警');
    }
    function title(name) {
        ignitionName=[];
        $listTitle.text(name);
        $statName.text(name);
        $listTitle1.text(name+txt);
        ignitionName.push(name);
    }
}
//根据callPoliceType2值设置数据表格url值以及对应的列
function setUrl0(type) {
    var url='';
    url='count/findAlarmCount';
    return url;
}
function setUrl(type) {
    var url='';
    url='count/findAlarmList';
    return url;
}
function setUrl1(type) {
    var url='';
    url='count/findCarAlarmList';
    return url;
}
//统计列表
function setColumn(type) {
    var arr=[];
    arr=[
        {field:'car_num',title:'车牌号',width:150,align:'left'},
        {field:'dept_name',title:'组织机构',width:200,align:'center'},
        {field:'num',title:'次数(次)',width:500,align:'right'}
        // {field:'total',title:'出区域报警',width:100,align:'right'}
    ];
    return arr;
}
//车辆详情统计列表
function setColumn1(type) {
    var arr=[];
    arr=[
        {field:'car_num',title:'车牌号',width:150,fixed:true,align:'left'},
        {field:'alarm_time',title:'时间',width:200,fixed:true,align:'center'},
        {field:'trace_id',title:'位置',width:500,fixed:true,align:'left',formatter:function(value,row,index){
            if(row.trace_id==''){
                row.trace_id=0;
            }
            if(row.alarm_time==''){
                row.alarm_time=0;
            }
            return '<span style="cursor:pointer;color:#009aff;" data-id="' + row.trace_id + '"  data-gps="' + row.alarm_time + '" onclick="getIp1.call(this)">点击显示位置信息</span>';
        }},
        {field:'alarm_remark',title:'备注',width:400,fixed:true,align:'left'},
    ];
    return arr;
}
//获取统计接口
function findIgniCount(jData) {
    var cfg = {
        token: getCookie("token"),
        url: setUrl0(callPoliceType2),
        data:jData,
        success: function (data) {
            var res=data.data;
            var numObj=res.totalData;
            ignition=[];
            if(res){
                ignition.push(res['date1']);
                if(searchParam.type==2){
                    xData=[];
                    xData=res['date2'];
                }
                $num1.text(numObj['nowNum']).append('<i style="font-size:14px;margin-left:2px;">次</i>');
                $num2.text(numObj['lastNum']).append('<i style="font-size:14px;margin-left:2px;">次</i>');
                $num3.text(numObj['addPercentage']).append('<i style="font-size:14px;margin-left:2px;">%</i>');
                totalEvent=res['totalNum'];
                seriesData('line');
                createIgnition();
            }
        }
    };
    customAjax(cfg);
}
//点击
$(window).resize(function () {
    createIgnition();
});
//统计图数组
function seriesData(type) {
    var seriesArr=[],_stack='';
    for(var i=0;i<ignitionName.length;i++){
        if(type=='bar'){
            _stack+=i;
        }
        if(type=='line'){
            _stack=_stack;
        }
        seriesArr.push(
            {
                name:ignitionName[i],
                type: 'line',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: attendColor[i]
                    }
                },
                data: ignition[i]
            }
        );
    }
    return seriesArr;
}
//折线图/柱状图
function createIgnition() {
    var attend = echarts.init($('#ignitionStatist').get(0));
    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            icon: 'circle',
            top: 40,
            data: ignitionName
        },
        toolbox: {
            feature: {
                magicType: {
                    type : ['line','bar'],
                    show : true,
                    option: {
                        'bar':{
                            series:seriesData('bar')
                        }
                    }
                },
                saveAsImage: {
                    show: true
                }
            }
        },
        grid: {
            top: 75,
            left: 10,
            right: 0,
            bottom: 60,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            axisTick: {
                show: false //是否显示坐标轴刻度
            },
            axisLine: {
                lineStyle: {
                    color: '#57617B'
                },
                onZero:true
            },
            splitLine:{
                lineStyle:{
                    color:'#splitLine'
                }
            },
            data: xData
        },
        yAxis: {
            type: 'value',
            name:'次',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false //是否显示坐标轴刻度
            }
        },
        series:seriesData('line')
    };
    attend.setOption(option);
    return attend;
}
$(function () {
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function(){
        $('.search').css({marginBottom:0});
    });
    //统计图底部日期
    $('.search-default,.search-detail').click(function (e) {
        var txt=$(e.target).text();
        if(txt!='自定义查询'){
            getMonthDay();
            findIgniCount(searchParam);
            createIgnition();
        }
    });
    //时间段
    timeValue('yyyy-MM-dd HH:mm:ss',2,0);
    //默认年月
    defaultYearMonth(searchParam.type);
    //查询车辆列表
    function findTravelMilList(searchParam,dom) {
        var queryParams={};
        queryParams.gridType='easyui';
        queryParams.recordStatus=10;
        queryParams.deptId=searchParam.deptId;
        queryParams.type=searchParam.type;
        queryParams.startTime=searchParam.startTime;
        queryParams.endTime=searchParam.endTime;
        queryParams.nowTime=searchParam.nowTime;
        queryParams.carNum=searchParam.carNum;
        queryParams.carTypeId=searchParam.carTypeId;
        queryParams.dataType=searchParam.dataType;
        queryParams.objectId=searchParam.objectId;
        if(dom=="dgrid"){
            $('#dgrid').datagrid({
                url:requestUrl+setUrl(callPoliceType2),
                queryParams: queryParams
            });
        }else{
            $('#dgrid1').datagrid({
                url:requestUrl+setUrl1(callPoliceType2),
                queryParams: queryParams
            });
        }
    }
    var ListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns:[setColumn(callPoliceType2)],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
            text:'导出',
            id: "btnExport",
            // iconCls: 'icon iconfont icon-daochu',
            handler:function() {
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'500px',
                    content:$('#export'),
                    move:$('#export .title')
                }));
                $('#export .no').click(function(){
                    layer.close(index)
                });

                $('#export .yes').off('click');
                $('#export .yes').click(function(){
                    var name=$('#excelFileName').val();
                    var d=time.getCurTime();
                    if(name==''){
                        lx.export({
                            // url:'order/orderExport',
                            data:{
                                recordStatus:10
                            },
                            success:lx.exportCallback
                        })
                    }else{
                        name=name+' '+d+'.xlsx';
                        lx.export({
                            // url:'order/orderExport',
                            data:{
                                recordStatus:10
                            },
                            success:lx.exportCallback
                        },name)
                    }
                });
            }
        },{
            text:'刷新',
            id: "btnUnbinding",
            handler:function() {
                $('#dgrid').datagrid('reload',queryParams)
            }
        }
        ],
        onLoadError:function(){

        },
        onSelect:function(index,row){
            searchParam.objectId=row.object_id;
            layer.open(publicObj({
                kind: 'layer',
                area: '1000px',
                content: $('#statistList'),
                // shade: 0,
                move: $('#statistList .title'),
                success: function() {
                    datagridFn(detailOpt);
                    findTravelMilList(searchParam,"dgrid1");
                }
            }))
        }
    };
    var detailOpt = {
        $Dom: $('#dgrid1'),   //数据表格容器
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns:[setColumn1(callPoliceType2)],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        fitColumns:true,
        pagination:true,
        onLoadError:function(error){
            console.log(error)
        }
    };
    datagridFn(ListOpt);
    //点击年
    $('.search-default li').click(function () {
        var txt=$(this).text();
        if(txt=='月统计数据'){
            initPostValue(0);
        }
        if(txt=='年统计数据'){
            initPostValue(1);
        }
        return;
    });
    //点击年数据
    clickYearMonth();
    function clickYearMonth() {
        var $li=$('.search-default li.default');
        $('.search-detail li').click(function () {
            if($li.eq(0).hasClass('active')){
                initPostValue(0);
            }
            if($li.eq(1).hasClass('active')){
                initPostValue(1);
            }
        })
    }
    //点击月数据
    $('.search-detail li').not('.year').click(function () {
        initPostValue(0);
    });
    //点击月数据
    //点击确定传送参数
    $('.search-window .yes').click(function (e) {
        initPostValue(2);
    });
    //初始化传值
    initPostValue(searchParam.type);
    function initPostValue(type) {
        defaultYearMonth(type);
        findTravelMilList(searchParam,'dgrid');
        findIgniCount(searchParam);
    }
})
/*2018/4/27显示地址*/
function getIp1() {
    var _this=this;
    var cfg={
        token:getCookie('token'),
        url:'realTimeProtectionService/findAddressInfo',
        data:{
            traceId:$(this).attr('data-id'),
            gpsTime:$(this).attr('data-gps')
        },
        success:function(data){
            if(data.code==0){
                if(data.address&&data.address!=''){
                    $(_this).text(data.address);
                }else{
                    $(_this).text('暂无位置信息');
                }
            }
        }
    };
    customAjax(cfg);
}
