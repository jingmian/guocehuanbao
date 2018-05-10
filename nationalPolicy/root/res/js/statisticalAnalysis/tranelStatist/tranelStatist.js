var traneType = GetQueryString("traneType");
traneType = null == traneType ? "0" : traneType;
//默认参数
searchParam.type = 0;
function defaultYearMonth(type) {
    var $year = $('.search-detail li.year.active').text();
    var $month = $('.search-detail li.active').not('.year').text();
    var date = new Date();
    var d = date.getDate();
    if ($month.length < 2) {
        $month = '0' + $month;
    }
    if (type == 0) {
        searchParam.type = 0;
        searchParam.nowTime = $year + '-' + $month;
        delete searchParam.startTime;
        delete searchParam.endTime;
    }
    if (type == 1) {
        searchParam.type = 1;
        searchParam.nowTime = $year;
        delete searchParam.startTime;
        delete searchParam.endTime;
    }
    if (type == 2) {
        searchParam.type = 2;
    }
}

var ignitionName = [],
    ignition = [];
var attendColor = ['#b686f7', '#F7553B'];
//设置车辆列表标题
setCarListTitle(traneType);

function setCarListTitle(type) {
    var $carListTitle = $('#carListTitle');
    var $carListTitle1 = $('#carListTitle1');
    var txt = '明细';
    if (type == 0) {
        $carListTitle.text('行驶统计');
        $carListTitle1.text('行驶统计' + txt);
    }
    if (type == 1) {
        $carListTitle.text('里程统计');
        $carListTitle1.text('里程统计' + txt);
    }
    if (type == 2) {
        $carListTitle.text('点火统计');
        $carListTitle1.text('点火统计' + txt);
    }
    if (type == 3) {
        $carListTitle.text('停车统计');
        $carListTitle1.text('停车统计' + txt);
    }
}

//根据traneType值设置数据表格url值以及对应的列
function setUrl0(type) {
    var url = '';
    if (type == 0) {
        url = 'count/findTravelMilChartList'
    }
    if (type == 1) {
        url = 'count/findMilCount'
    }
    if (type == 2) {
        url = 'count/findIgniCount'
    }
    if (type == 3) {
        url = 'count/findParkCount'
    }
    return url;
}

function setUrl(type) {
    var url = '';
    if (type == 0) {
        url = 'count/findTravelMilList'
    }
    if (type == 1) {
        url = 'count/findMilList'
    }
    if (type == 2) {
        url = 'count/findIgniList'
    }
    if (type == 3) {
        url = 'count/findParkList'
    }
    return url;
}

function setUrl1(type) {
    var url = '';
    if (type == 0) {
        url = 'count/findCarTravelMilList'
    }
    if (type == 1) {
        url = 'count/findCarMilList'
    }
    if (type == 2) {
        url = 'count/findIgniDetails'
    }
    if (type == 3) {
        url = 'count/findCarParkList'
    }
    return url;
}

//车辆统计列表
function setColumn(type) {
    var arr = [];
    if (type == 0) {
        arr = [
            {field: 'dept_name', title: '组织机构', width: 150, align: 'left'},
            {field: 'car_num', title: '车牌号', width: 150, align: 'center'},
            {field: 'total_str', title: '行驶时长', width: 100, align: 'right',formatter:function (value,row,index) {
                if(value==''){
                    return value=0;
                }else{
                    return value;
                }
            }},
            {field: 'maxs', title: '最大速度(km/h)', width: 100, align: 'right'},
            {field: 'num', title: '行驶次数(次)', width: 100, align: 'right'},
            {field: 'sm', title: '总行驶里程(km)', width: 100, align: 'right'},
            {
                field: 'ranking', title: '排名', width: 500, align: 'left', formatter: function (value, row, index) {
                if (value == 1 || value == 2 || value == 3) {
                    return "<p class='ranking'>" + value + "</p>"
                }
            }
            }
        ];
    }
    if (type == 1) {
        arr = [
            {field: 'dept_name', title: '组织机构', width: 150, align: 'left'},
            {field: 'car_num', title: '车牌号', width: 150, align: 'center'},
            {field: 'mile', title: '里程(km)', width: 100, align: 'right'},
            // {field: 'runtime', title: '行驶时间', width: 500, align: 'left'}
            {field: 'runtime1', title: '', width: 500, align: 'left'}
        ];
    }
    if (type == 2) {
        arr = [
            {field: 'deptName', title: '组织机构', width: 150, align: 'left'},
            {field: 'carNum', title: '车牌号', width: 150, align: 'center'},
            {field: 'dictionaryName', title: '车型', width: 100, align: 'center'},
            {field: 'time', title: '点火时长', width: 100, align: 'right',formatter:function (value,row,index) {
                if(value==''){
                    return value=0;
                }else{
                    return value;
                }
            }},
            {field: 'num', title: '点火次数(次)', width: 100, align: 'right'},
            {field: 'mileage', title: '里程(km)', width: 100, align: 'right'},
            // {field: 'sm', title: '油耗', width: 100, align: 'center'},
            // {
            //     field: 'ranking', title: '排名', width: 500, align: 'left', formatter: function (value, row, index) {
            //     if (value == 1 || value == 2 || value == 3) {
            //         return "<p class='ranking'>" + value + "</p>"
            //     }
            // }
            // }
        ];
    }
    if (type == 3) {
        arr = [
            {field: 'dept_name', title: '组织机构', width: 150, align: 'left'},
            {field: 'car_num', title: '车牌号', width: 150, align: 'center'},
            // {field:'dictionaryName',title:'车型',width:100,align:'center'},
            {field: 'num', title: '停车次数(次)', width: 100, align: 'right'},
            {field: 'stop_time_str', title: '停车时间', width: 500, align: 'left'}
        ];
    }
    return arr;
}

//车辆详情统计列表
function setColumn1(type) {
    var arr = [];
    if (type == 0) {
        arr = [
            {field: 'car_num', title: '车牌号', width: 150,fixed:true, align: 'left'},
            {field: 'start_time', title: '开始时间', width: 150,fixed:true, align: 'center'},
            {field: 'end_time', title: '结束时间', width: 150,fixed:true, align: 'center'},
            {field: 'total', title: '时长', width: 100, fixed:true,align: 'center',formatter:function (value,row,index) {
                var time='0';
                value=parseInt(value);
                if(value<60){
                    return time=value+'分钟'
                }else if(value>=60&&value<60*24){
                    return time=parseInt(value/60)+'小时'+parseInt(value%60)+'分钟';
                }else{//大于等于一天
                    var day=parseInt(value/60/24);//天数
                    var day_num=day*60*24;//day对应的分钟数
                    return time=day+'天'+parseInt((value-day_num)/60)+'小时'+parseInt((value-day_num)%60)+'分钟';
                }
            }},
            {field: 'speed', title: '速度(km/h)', width: 100,fixed:true, align: 'right'},
            {field: 'mileage', title: '里程(km)', width: 100,fixed:true, align: 'right'}
            // {field:'startPos',title:'起始位置',width:200,align:'left'},
            // {field:'endPos',title:'结束位置',width:200,align:'left'}
        ];
    }
    if (type == 1) {
        arr = [
            {field: 'car_num', title: '车牌号', width: 150,fixed:true, align: 'left'},
            {field: 'time1', title: '开始时间', width: 150,fixed:true, align: 'center'},
            {field: 'time2', title: '结束时间', width: 150,fixed:true, align: 'center'},
            {field: 'date_str', title: '时长', width: 100,fixed:true, align: 'center'},
            {field: 'mil', title: '里程(km)', width: 100,fixed:true, align: 'center'},
            // {field:'mil',title:'累计里程(km)',width:50,align:'right'},
            // {field:'mil',title:'油耗(L)',width:50,align:'right'},
          /*  {field: 'startPos', title: '起始位置', width: 200, align: 'left'},*/
            {
                field: 'startPos', title: '起始位置',fixed:true,width:500,align: 'left', formatter: function (value, row, index) {
                return '<span style="cursor:pointer;color:#009aff;" data-id="' + row.startTraceId + '"  data-gps="' + row.time1 + '" onclick="getIp1.call(this)">点击显示位置信息</span>';
            }
            },
            {
                field: 'endPos', title: '结束位置',fixed:true, width: 500, align: 'left', formatter: function (value, row, index) {
                return '<span style="cursor:pointer;color:#009aff;" data-id="' + row.endTraceId + '"  data-gps="' + row.time2 + '" onclick="getIp1.call(this)">点击显示位置信息</span>';
            }
            }
            /*{field:'endPos',title:'结束位置',width:200,align:'left'}*/
        ];
    }
    if (type == 2) {
        arr = [
            {field: 'carNum', title: '车牌号', width: 150,fixed:true, align: 'left'},
            // {field:'deptName',title:'组织机构',width:200,align:'center'},
            {field: 'dictionaryName', title: '车型', width: 100,fixed:true, align: 'center'},
            {field: 'begin_time', title: '点火时间', width: 150,fixed:true, align: 'center'},
            // {field:'num',title:'点火次数',width:100,align:'right'},
            {field: 'mileage', title: '行驶里程(km)', width: 100,fixed:true, align: 'right'},
            {field: 'speed', title: '平均速度(km/h)', width: 100,fixed:true, align: 'right',formatter:function (value,row,index) {
                if(value==0){
                    return value=0;
                }else{
                    return value;
                }
            }}
        ];
    }
    if (type == 3) {
        arr = [
            {field: 'car_num', title: '车牌号', width: 200,fixed:true, align: 'left'},
            {field: 'start_time', title: '开始时间', width: 300,fixed:true, align: 'center'},
            {field: 'end_time', title: '结束时间', width: 300,fixed:true, align: 'center'},
            {field: 'stop_time_str', title: '时长', width: 300,fixed:true, align: 'center'},
            {
                field: 'endPos', title: '停车地点',fixed:true, width: 350, align: 'left', formatter: function (value, row, index) {
                return '<span style="cursor:pointer;color:#009aff;" data-id="' + row['trace_id'] + '"  data-gps="' + row['end_time'] + '" onclick="getIp1.call(this)">点击显示位置信息</span>';
            }
            }
        ];
    }
    return arr;
}

//获取行驶统计接口
function findIgniCount(jData) {
    var cfg = {
        token: getCookie("token"),
        url: setUrl0(traneType),
        data: jData,
        success: function (data) {
            var res = data.data;
            ignitionName = [], ignition = [];
            if (res) {
                ignitionName.push(res['name']);
                ignition.push(res['date1']);
                if (searchParam.type == 2) {
                    xData = [];
                    xData = res['date2'];
                }
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
    var seriesArr = [], _stack = '';
    for (var i = 0; i < ignitionName.length; i++) {
        if (type == 'bar') {
            _stack += i;
        }
        if (type == 'line') {
            _stack = _stack;
        }
        seriesArr.push(
            {
                name: ignitionName[i],
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
//设置折线图Y轴名称
var nameY=null;//
setNameY(traneType);
function setNameY(type) {
    if(type==0){
        nameY='km';
    }else if(type==1){
        nameY='km';
    }else if(type==2){
        nameY='次';
    }else{
        nameY='次';
    }
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
                    type: ['line', 'bar'],
                    show: true,
                    option: {
                        'bar': {
                            series: seriesData('bar')
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
            bottom: 0,
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
                onZero: true
            },
            splitLine: {
                lineStyle: {
                    color: '#splitLine'
                }
            },
            data: xData
        },
        yAxis: {
            name: nameY,
            type: 'value',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false //是否显示坐标轴刻度
            }
        },
        series: seriesData('line')
    };
    attend.setOption(option);
    return attend;
}

$(function () {
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function () {
        $('.search').css({marginBottom: 0});
    });
    //统计图底部日期
    $('.search-default,.search-detail').click(function (e) {
        var txt = $(e.target).text();
        if (txt != '自定义查询') {
            getMonthDay();
            findIgniCount(searchParam);
            createIgnition();
        }
    });
    //时间段
    timeValue('yyyy-MM-dd HH:mm:ss', 0, 7);
    //默认年月
    defaultYearMonth(searchParam.type);

    //查询车辆列表
    function findTravelMilList(searchParam, dom) {
        var queryParams = {};
        queryParams.gridType = 'easyui';
        queryParams.recordStatus = 10;
        queryParams.deptId = searchParam.deptId;
        queryParams.type = searchParam.type;
        queryParams.startTime = searchParam.startTime;
        queryParams.endTime = searchParam.endTime;
        queryParams.nowTime = searchParam.nowTime;
        queryParams.carNum = searchParam.carNum;
        queryParams.carTypeId = searchParam.carTypeId;
        queryParams.carId = searchParam.carId;
        if (dom == "dgrid") {
            $('#dgrid').datagrid({
                url: requestUrl + setUrl(traneType),
                queryParams: queryParams
            });
        } else {
            $('#dgrid1').datagrid({
                url: requestUrl + setUrl1(traneType),
                queryParams: queryParams
            });
        }
    }

    var ListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [setColumn(traneType)],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '导出',
            id: "btnExport",
            // iconCls: 'icon iconfont icon-daochu',
            handler: function () {
                var index = layer.open(publicObj({
                    kind: 'layer',
                    area: '500px',
                    content: $('#export'),
                    move: $('#export .title'),
                    shade:0
                }));
                $('#export .no').click(function () {
                    layer.close(index)
                });

                $('#export .yes').off('click');
                $('#export .yes').click(function () {
                    var name = $('#excelFileName').val();
                    var d = time.getCurTime();
                    if (name == '') {
                        lx.export({
                            // url:'order/orderExport',
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        })
                    } else {
                        name = name + ' ' + d + '.xlsx';
                        lx.export({
                            // url:'order/orderExport',
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        }, name)
                    }
                });
            }
        }
        ],
        onLoadError: function () {

        },
        onSelect: function (index, row) {
            searchParam.carId = row.car_id;
            layer.open(publicObj({
                kind: 'layer',
                area: '1000px',
                content: $('#statistList'),
                shade: 0,
                move: $('#statistList .title'),
                success: function () {
                    datagridFn(detailOpt);
                    findTravelMilList(searchParam, 'dgrid1');
                }
            }))
        }
    };
    var detailOpt = {
        $Dom: $('#dgrid1'),   //数据表格容器
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [setColumn1(traneType)],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        fitColumns: true,
        pagination: true,
        onLoadError: function (error) {
            console.log(error)
        }
    };
    datagridFn(ListOpt);
    //点击年
    $('.search-default li').click(function () {
        var txt = $(this).text();
        if (txt == '月统计数据') {
            initPostValue(0);
        }
        if (txt == '年统计数据') {
            initPostValue(1);
        }
        return;
    });
    //点击年数据
    clickYearMonth();

    function clickYearMonth() {
        var $li = $('.search-default li.default');
        $('.search-detail li').click(function () {
            if ($li.eq(0).hasClass('active')) {
                initPostValue(0);
            }
            if ($li.eq(1).hasClass('active')) {
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
        findTravelMilList(searchParam, 'dgrid');
        findIgniCount(searchParam);
    }

});

//显示地址
function getIp(){
    var _this=this;
    var cfg={
        token:getCookie('token'),
        url:'realTimeProtectionService/findAddressInfo',
        data:{
            traceId:$(this).attr('data-id'),
            gpsTime:$(this).attr('data-gps')
        },
        success:function(data){
            $('#place').text(data.address).off('click');
            var index=layer.open(publicObj({
                kind:'layer',
                area:'500px',
                content:$('#selectAll'),
                move:$('#selectAll .title'),
                shade:0
            }));
        }
    };
    customAjax(cfg);
}
/*2018/4/26显示地址*/
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
