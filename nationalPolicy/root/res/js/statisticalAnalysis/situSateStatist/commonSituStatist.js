var curMon = getMonthDays(),
    xData = [], //当月天数;
    totalNum = [],
    totalName = [],
    totalSa=0;
var attendColor = ['#b686f7'],
    situType = GetQueryString('situType') || '0',
    headerCenterText = {"0": '上月卫情总数', "1": '已处理卫情', "2": '优秀处理数'},
    headerRightText = {"0": '同比增常率', "1": '未处理卫情', "2": '超时处理数'},
    situName,
    situCost,
    situCfg = {
        token: serverData.token,
        url: 'statisticsManage/statisticsSanitationDataInfo',
        data: {
            deptId: serverData.deptId,
            startTime: _StartTime,
            endTime: _EndTime,
            situType: situType,
            type: 0
        },
        success: function (data) {
            var da = data.data;
            xData=[];
            situCost=[];
            totalNum=[];
            totalName=[];
            if (da.xInfo != undefined) {
                xData = da.xInfo;
            }
            if (da.resultData !=undefined) {
                situCost = da.resultData;
            }
            if(da.serData != undefined){
                totalNum=da.serData;
            }
            if(da.serDataName !=undefined){
                totalName=da.serDataName
            }
            if(da.totalSa != undefined){
                totalSa = da.totalSa;
            }
            createSitu();
        },
        error: function () {
            for (var i = 0; i < curMon; i++) {
                situCost.push(0);
            }
            createSitu();
            $("#dgrid").datagrid('loadData', 0);
            datagridFn(ListOpt);
        }
    },
    situOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + "statisticsManage/sanitationTableInfo",  //请求地址
        //请求传递的参数
        queryParams: {
            deptId: serverData.deptId,
            pageSize: 10,
            pageNo: 1,
            startTime: _StartTime,
            endTime: _EndTime,
            situType: situType
        },
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '导出',
            id: "btnExport",
            handler: function () {
                var index = layer.open(publicObj({
                    kind: 'layer',
                    area: '500px',
                    content: $('#export'),
                    move: $('#export .title')
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
        }]
    },
    detailOpt = {
        $Dom: $('#dgrid1'),
        url:requestUrl+ 'sanitation/findSanitation',
        queryParams: {
            pageSize: 10,
            pageNo: 1,
            sanitationDeptId:serverData.deptId
        },
        columns: [[
            {field: 'deptName', title: '部门', width: 150,fixed:true, align: 'left'},
            {field: 'agentName', title: '人员姓名', width: 150,fixed:true,align: 'center'},
            {field: 'addTime', title: '上报时间', width: 150,fixed:true, align: 'center'},
            {field: 'sanitationStatus', title: '状态', width: 50,fixed:true, align: 'center'},
            {field: 'sanitationPlace', title: '位置', width: 200,fixed:true, align: 'left'},
        ]],
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none"
    };
if (situType == '0') {
    situName = ['卫情'];
    situCost = initChartArr(2);
    situOpt.columns=[[
        {field: 'deptName', title: '组织机构', width: 150, align: 'left'},
        {field: 'agentName', title: '上报人', width: 150,align: 'center'},
        {field: 'total', title: '卫情总数(次)', width: 100, align: 'right'},
        {field: 'dealState', title: '卫情状态', width: 100, align: 'center',formatter:function (value,row,index) {
                if(value==0){
                    return '未处理';
                }
                if(value==1){
                    return '部分处理';
                }
                if(value==2){
                    return '已处理';
                }
            }},
        {field: 'total1', title: '', width: 300, align: 'left'},
    ]];
    situOpt.onClickRow=function (index, row) {
        detailOpt.queryParams.startTime=situOpt.queryParams.startTime;
        detailOpt.queryParams.endTime=situOpt.queryParams.endTime;
        detailOpt.queryParams.agentId= row.agentId;
        //detailOpt.queryParams.agentName= row.agentName;
        layer.open(publicObj({
            kind:'layer',
            content:$('#statistList'),
            move:$('#statistList .title'),
            area:'800px',
            success:function(){
                datagridFn(detailOpt)
            }
        }));
    }
} else if (situType == '1') {
    situName = ['已处理', '未处理'];
    situCost = [
        {value: 12, name: "已处理"},
        {value: 0, name: "未处理"},
    ];
    situOpt.columns=[[
        {field: 'agentName', title: '上报人', width: 140,align: 'center'},
        {field: 'deptName', title: '组织机构', width: 180, align: 'center'},
        {field: 'total', title: '卫情总数(次)', width: 100, align: 'center'},
        {field: 'dealNum', title: '已处理(次)', width: 100, align: 'center'},
        {field: 'noDealNum', title: '未处理(次)', width: 100, align: 'center'},
        {field: 'dealState', title: '卫情状态', width: 60, align: 'center',formatter:function (value,row,index) {
            if(value==0){
                return '未处理';
            }
            if(value==1){
                return '部分处理';
            }
            if(value==2){
                return '已处理';
            }
        }}
    ]];
    situOpt.onClickRow=function (index, row) {
        detailOpt.queryParams.startTime=situOpt.queryParams.startTime;
        detailOpt.queryParams.endTime=situOpt.queryParams.endTime;
        detailOpt.queryParams.agentId= row.agentId;
        //detailOpt.queryParams.agentName= row.agentName;
        layer.open(publicObj({
            kind:'layer',
            content:$('#statistList'),
            move:$('#statistList .title'),
            area:'800px',
            success:function(){
                datagridFn(detailOpt)
            }
        }));
    }
} else {
    situName = ['10分钟以内', '10-20分钟', '20-60分钟', '1-5小时', '5-12小时','12-24小时','未处理数'];
    situCost = [
        {value: 0, name: "10分钟以内"},
        {value: 0, name: "20分钟"},
        {value: 0, name: "20-60分钟"},
        {value: 0, name: "1-5小时"},
        {value: 0, name: "5-12小时"},
        {value: 0, name: "12-24小时"},
        {value: 0, name: "未处理数"}
    ];
    situOpt.columns=[[
        {field: 'agentName', title: '上报人',width: 140, align: 'center'},
        {field: 'addTime', title: '上报时间', width: 140, align: 'center'},
        {field: 'sanitationDetails', title: '卫情内容', width: 180, align: 'center'},
        {field: 'fileTime', title: '处理时间', width: 140, align: 'center'},
        {field: 'handleTime', title: '处理时长', width: 120, align: 'center',formatter:function(val){
        	if(val==0)
        	return "未处理";
            var hTime=val,
                handTimeVal;
            if(hTime<60){
                handTimeVal=hTime+'分钟';
            }else if(hTime>=60 && hTime<=1440){
                var remainde=hTime%60,
                    integer=(hTime-remainde)/60;
                handTimeVal=remainde==0?integer+'小时':integer+'小时'+remainde+'分钟';
            }else{
                var remainde=hTime%1440,
                    dayTime=(hTime-remainde)/1440;
                if(remainde<60){
                    handTimeVal=dayTime+'天'+remainde+'分钟';
                }else{
                    var minTime=remainde % 60,
                        hourTime=(remainde-minTime)/60;
                    handTimeVal=dayTime+'天'+hourTime+'小时'+minTime+'分钟';
                }
            }
            return handTimeVal;
        }},
        {field: 'sanitationLevelName', title: '处理等级', width: 60, align: 'center',formatter:function(val,row){
        	if(row.handleTime==0) return "";
        	else return val;
        	}
        }
    ]];
}
$(function () {
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function(){
        $('.search').css({marginBottom:0});
    });
    lx.staticsName = 'publicSitu';
    initPage();
    situType != '0'?$(".sanitationState").hide():$(".sanitationState").show();
    $('#sanitationStateVal').find("option").first().attr("selected", true);
    /*--------------------------------------------------功能函数--------------------------------------------------*/
    //页面初始化
    function initPage() {
        //动态改变样式
        $('.attend-statist').css({
            'marginTop': '-113px',
            'paddingTop': '113px'
        });
        //findSanitationUpPersonInfo();
        getHeadData();
        customAjax(situCfg);
        changeHeaderText();
        datagridFn(situOpt);
        //绑定事件
        $('#searchBtn').click(function () {
            var inputVal = $(this).siblings('input').val(),
                newParam = $.extend({}, costOpt.queryParams);
            if ($.trim(inputVal) != '') {
                newParam.carNum = inputVal;
            }
            $('#dgrid').datagrid()
        });
    }
    //头部卫情统计数据处理
    function getHeadData() {
        var cfg = {
            token: serverData.token,
            url: 'statisticsManage/findHeadInfos',
            data: {deptId: serverData.deptId, situType: situType},
            success: function (data) {
                var da = data.data;
                if (da.nowtotal != undefined) {
                    $('#nowMothNum').text(da.nowtotal).append('<i style="font-size:14px;margin-left:2px;">次</i>');
                }
                if (da.lastNum != undefined) {
                    $('#lastMonthNum').text(da.lastNum).append('<i style="font-size:14px;margin-left:2px;">次</i>');
                }
                if (da.dealAdvan != undefined) {
                    var o = situType == '0' ? '%' : '次';
                    $('#scale').text(da.dealAdvan).append('<i style="font-size:14px;margin-left:2px;">'+o+'</i>');
                }
            }
        };
        customAjax(cfg);
    }
    /*//获取人员
    function findSanitationUpPersonInfo() {
        var deptId = serverData.deptId;
        var cfg = {
            token:serverData.token,
            url: 'statisticsManage/findSanitationUpLoader',
            data: {deptId: deptId},
            success: function (data) {
                var persons = data.data;
                for (var i in persons) {
                    var node = new Option(persons[i].personName, persons[i].personId);
                    $("#personInf").append(node);
                }
            }
        };
        customAjax(cfg);
    }*/
});
//改变头部费用文字
function changeHeaderText() {
    var _p = $('.total span');
    $.each(_p, function (ind) {
        if (ind == 1) {
            $(this).text(headerCenterText[situType]);
        } else if (ind == 2) {
            $(this).text(headerRightText[situType]);
        }
    })
}
//折线图
function createSitu() {
    var situ = echarts.init($('#oilStatist').get(0));
    if (situType == "0") {
        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                icon: 'emptyCircle',
                top: 40,
                data: situName
            },
            toolbox: {
                feature: {
                    magicType: {
                        type: ['line', 'bar']
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
                type: 'value',
                name:'次',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false //是否显示坐标轴刻度
                }
            },
            series: [
                {
                    name: situName[0],
                    type: 'line',
                    stack: '卫情',
                    itemStyle: {
                        normal: {
                            color: attendColor[0]
                        }
                    },
                    data: situCost
                }
            ]
        };
    } else {
        option = {
            color: ['#F99296', '#7CCA38', '#0ABCE0', '#60ACF8', '#FFBC3A', '#B68BF7','#A6F93C','#F9F714'],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: '65%',
                y: '60px',
                itemWidth: 10,
                itemHeight: 10,
                icon: 'circle',
                data: totalName,
                formatter: function (name) {
                    var oa = option.series[0].data;
                    var num = 0;
                    for (var m = 0; m < oa.length; m++) {
                        num += oa[m].value;
                    }
                    for (var i = 0; i < option.series[0].data.length; i++) {
                        if (name == oa[i].name) {
                            return name + '\r\r\r' + oa[i].value;
                        }
                    }
                }
            },
            graphic: {
                type: 'text',
                left: 'center',
                top: 'center',
                style: {
                    text: '卫情总数(次) \n\n' + totalSa,
                    textAlign: 'center',
                    fill: '#000',
                    width: 30,
                    height: 30,
                    fontSize: 16
                }
            },
            series: [{
                name: '卫情(次)',
                type: 'pie',
                label: false,
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                radius: ['75%', '90%'],
                data: totalNum
            }]
        };
    }
    situ.setOption(option);
    return situ;
}
/*
    初始化echarts 名称和值
    @param {type} 1 初始化x轴  2 初始化天数
*/
function initChartArr(type) {
    var returnData = [];
    for (var i = 0; i < curMon; i++) {
        if (type == 1) {
            if (i < 9) {
                returnData.push('0' + (i + 1))
            } else {
                returnData.push((i + 1));
            }
        } else {
            returnData.push((i + 1));
        }
    }
    return returnData;
}
$(window).resize(function () {
    createSitu();
});
timeValue('yyyy-MM-dd',2,0);
