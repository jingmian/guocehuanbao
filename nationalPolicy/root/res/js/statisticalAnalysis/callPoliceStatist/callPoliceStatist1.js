//饼状图
//折线柱状图
var callPoliceType1 = GetQueryString("callPoliceType1");
callPoliceType1 = null==callPoliceType1?"0":callPoliceType1;
//默认参数
searchParam.type=0;
searchParam.dataType='0,1,2,3,4,5,8';
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
    searchParam.dataType='0,1,2,3,4,8';
}
var ignitionName =[],
    ignition=[],
    totalEvent=0;
var attendColor=['#F99296','#7CCA38','#0ABCE0','#60ACF8','#FFBC3A','#8899F9','#F94254','#9AF910','#2BF9EF'];
var $num1=$('#num1'),$num2=$('#num2'),$num3=$('#num3');
//设置列表标题
setlistTitle(callPoliceType1);
function setlistTitle(type) {
    var $listTitle=$('#listTitle');
    var $listTitle1=$('#listTitle1');
    var $statName=$('.statName');
    var txt1='分析';
    var txt='列表';
    if(type==0){
        title('报警');
    }
    function title(name) {
        $listTitle.text(name+txt1);
        $statName.text(name);
        $listTitle1.text(name+txt);
    }
}
//根据callPoliceType1值设置数据表格url值以及对应的列
function setUrl0(type) {
    var url='';
    if(type==0){
        url='count/findAlarmCount'
    }
    return url;
}
function setUrl(type) {
    var url='';
    if(type==0){
        url='count/findAlarmList'
    }
    return url;
}
function setUrl1(type) {
    var url='';
    if(type==0){
        url='count/findCarAlarmList'
    }
    return url;
}
//统计列表
function setColumn(type) {
    var arr=[];
    if(type==0){
        arr=[
            {field:'dictionary_name',title:'报警类型',width:150,align:'left'},
            {field:'num',title:'报警次数(次)',width:150,align:'center'}
        ];
    }
    return arr;
}
//详情统计列表
function setColumn1(type) {
    var arr=[];
    if(type==0){
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
            {field:'alarm_remark',title:'备注',width:400,fixed:true,align:'left'}
        ];
    }
    return arr;
}
//获取安全统计接口
function findIgniCount(jData) {
    var cfg = {
        token: getCookie("token"),
        url: setUrl0(callPoliceType1),
        data:jData,
        success: function (data) {
            var res=data.data;
            var res1=res.data;
            var numObj=res.totalData;
            ignitionName=[],ignition=[];
            if(res){
                for(var i=0;i<res1.length;i++){
                    ignitionName.push({'name':res1[i].name});
                    ignition.push({'value':res1[i].value,'name':res1[i].name});
                }
                $num1.text(numObj['nowNum']).append('<i style="font-size:14px;margin-left:2px;">次</i>');
                $num2.text(numObj['lastNum']).append('<i style="font-size:14px;margin-left:2px;">次</i>');
                $num3.text(numObj['addPercentage']).append('<i style="font-size:14px;margin-left:2px;">%</i>');
                totalEvent=res['totalNum'];
                createTotalEvent();
            }
        }
    };
    customAjax(cfg);
}
//点击
$(window).resize(function () {
    createTotalEvent();
});
//统计图数组
//饼状图
function createTotalEvent(){
    var total=echarts.init($('#ignitionStatist').get(0));
    option = {
        color:attendColor,
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        toolbox: {
            feature: {
                saveAsImage: {
                    show: true
                }
            }
        },
        legend: {
            orient: 'vertical',
            x: '60%',
            y: '60px',
            itemWidth:10,
            itemHeight:10,
            icon: 'circle',
            data:ignitionName
        },
        graphic: {
            type: 'text',
            left: 'center',
            top: '40%',
            style: {
                text: '报警分析(次) \n\n' + totalEvent,
                textAlign: 'center',
                fill: '#000',
                width: 30,
                height: 30,
                fontSize: 16
            }
        },
        series: [
            {
                name:'报警分析(次)',
                type:'pie',
                radius: ['50%', '65%'],
                center:['50%','45%'],
                avoidLabelOverlap: false,
                label: {
                    normal: {
                        show: false,
                        position: 'center'
                    }
                },
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                data:ignition
            }
        ]
    };
    total.setOption(option);
    return total;
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
            createTotalEvent();
        }
    });
    //时间段
    timeValue('yyyy-MM-dd HH:mm:ss',0,7);
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
                url:requestUrl+setUrl(callPoliceType1),
                queryParams: queryParams
            });
        }else{
            $('#dgrid1').datagrid({
                url:requestUrl+setUrl1(callPoliceType1),
                queryParams: queryParams
            });
        }
    }
    var ListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns:[setColumn(callPoliceType1)],
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
            searchParam.objectId=row.alarm_type_id;
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
        columns:[setColumn1(callPoliceType1)],
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
        findTravelMilList(searchParam,"dgrid");
        findIgniCount(searchParam);
    }
});
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
