var xData = [], //当月天数
    mileage = [],//里程数据
    oilCost = [], //油耗数据
    curMon = getMonthDays(),
    /*测试数据*/
    oilName = [];
mileage = [];
var attendColor = ['#b686f7', '#FFBC3D'];
for (var i = 0; i < curMon; i++) {
    if (i < 9) {
        xData.push('0' + (i + 1))
    } else {
        xData.push((i + 1));
    }
}
var pageData = {"1": "加油", "2": "漏油"},
    // dType = {"0": 0, "1": 1, "2": 2},
    oilType = GetQueryString("oilType"),//获取类型
    oilType = oilType == null ? "0" : oilType,
    oilCfg = {
        token: serverData.token,
        url: 'oilCountManager/findPieCountInfos',
        data: {
            deptId: serverData.deptId,
            startTime: _StartTime,
            endTime: _EndTime,
            situType: oilType,
           /* type: dType[oilType]*/
        },
        success: function (data) {
            var da = data.data;
            xData = [];
            oilCost = [];
            mileage = [];
            oilName =[pageData[oilType]];
            if (da.resList) {
                oilCost = da.resList;
            }
            if (da.resLebleList) {
                xData = da.resLebleList;
            }
            if (da.date1) {
                mileage = da.date1;
            }
            if (da.oilName) {
                oilName = da.oilName
            }
            createOil();
        }
    },
    oilOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + "oilCountManager/findCountTableInfos",  //请求地址
        //请求传递的参数
        queryParams: {
            deptId: serverData.deptId,
            pageSize: 10,
            pageNo: 1,
            startTime: _StartTime,
            endTime: _EndTime,
            situType: oilType,
            type: 0
            /*type: dType[oilType]*/
        },
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'carId',hidden:true},
            {field: 'carNum', title: '车牌号', width: 150,align:'left'},
            {field: 'dictionaryName', title: '车辆类型', width: 100, align: 'center'},
            // {field: 'oilConsume', title: '油耗', width: 180, align: 'center'},
            // {field: 'milleage', title: '里程', width: 180, align: 'center'},
            {field: 'addOilAmount',hidden:oilType==2?true:false, title: '加油量(升)', width: 100, align: 'right'},
            {field: 'lessOilAmount',hidden:oilType==1?true:false, title: '漏油量(升)', width: 100, align: 'right'},
            {field: 'rank', title: '排名', width: 100, align: 'right',formatter:function(value,row,index){
                if(value==1||value==2||value==3){
                    return "<p class='ranking'>"+value+"</p>"
                }
            }},
            {field: 'rank1', title: '', width:300, align: 'left'}
        ]],
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        onClickRow: function (index,row) {
            $("#statistList .titleText").text(pageData[oilType]);
            layer.open(publicObj({
                kind: 'layer',
                content: $('#statistList'),
                move: $('#statistList .title'),
                area: '800px',
                success: function () {
                    detailOpt.queryParams.carId=row.carId;
                    datagridFn(detailOpt)
                }
            }));
        },
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
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        })
                    } else {
                        name = name + ' ' + d + '.xlsx';
                        lx.export({
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        }, name)
                    }
                });
            }
        }
        ]
    },
    detailOpt = {
        $Dom: $('#dgrid1'),   //数据表格容器
        url: requestUrl + "oilCountManager/findCountTableInfos",  //请求地址
        //请求传递的参数
        queryParams: {
            pageSize: 20,
            pageNo: 1,
            type:1,
            deptId: serverData.deptId,
            startTime: _StartTime,
            endTime: _EndTime,
            situType: oilType
            /*gridType: 'easyui',
            recordStatus: 10*/
        },
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'carNum', title: '车牌号', width: 150,fixed:true,align:'left'},
            {field: 'dictionaryName', title: '车型', width: 100,fixed:true, align: 'center'},
            {field: 'gasolineTime', title: '时间', width: 150,fixed:true, align: 'center',formatter:function (value,row,index) {
                if(value==0||value==null){
                    return value=0
                }else{
                    return value;
                }
            }},
          /*  {field: 'mz', title: '里程', width: 60, align: 'center'},
            {field: 'phone', title: '油耗', width: 60, align: 'center'},*/
            {field: 'addOilAmount',hidden:oilType==2?true:false, title: '加油量(升)', width: 100,fixed:true, align: 'right'},
            {field: 'lessOilAmount',hidden:oilType==1?true:false, title: '漏油量(升)', width: 100,fixed:true, align: 'right'},
          /*  {field: 'mz', title: '百公里油耗', width: 180, align: 'center'}*/
        ]],
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        fitColumns: true,
        onLoadSuccess: function (row, index) {
            $('#dgrid1').datagrid('options')
        }
    };
$(function () {
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function(){
        $('.search').css({marginBottom:0});
    });
    lx.staticsName = 'publicOil';
    initPage();
    $(window).resize(function () {
    });
    /*--------------------------------------------------功能函数--------------------------------------------------*/

    //页面初始化
    function initPage() {
        //动态改变样式
        $('.attend-statist').css({
            'marginTop': '-113px',
            'paddingTop': '113px'
        });
        $('#custom').click(function () {

        });
        changeHeaderText();
        customAjax(oilCfg);
        findHeadrInfo();
        datagridFn(oilOpt);
        //resetHeight();
        document.title = pageData[oilType];
    }

    //改变头部费用文字
    function changeHeaderText() {
        var _p = $('.total span');+
        $.each(_p, function (ind) {
            if (ind == 0) {
                $(this).text('本月' + pageData[oilType]);
            } else if (ind == 1) {
                $(this).text('上月' + pageData[oilType]);
            } else if (ind == 3) {
                $(this).text('平均' + pageData[oilType]);
            }
        });
        $('.wrap-bottom .title>span').not('.rt').text(pageData[oilType] + '列表');
    }

    /**
     * 头部信息
     */
    function findHeadrInfo() {
        var cfg = {
            token: serverData.token,
            url: 'oilCountManager/findHeaderInfos',
            data: {
                deptId: serverData.deptId,
                situType: oilType
            },
            success: function (data) {
                var da = data.data;
                if (da.scaleNum||da.scaleNum==0) {
                    $('#scaleNum').text(da.scaleNum).append('<i style="font-size:14px;margin-left:2px;">%</i>');
                }
                if (da.nowMonAm||da.nowMonAm==0) {
                    $('#nowMonAm').text(da.nowMonAm).append('<i style="font-size:14px;margin-left:2px;">升</i>');
                }
                if (da.lastMonAm||da.lastMonAm==0) {
                    $('#lastMonAm').text(da.lastMonAm).append('<i style="font-size:14px;margin-left:2px;">升</i>');
                }
                if (da.avg) {
                    $('#avg').text(da.avg);
                }
            }
        };
        customAjax(cfg);
    }

});
//设置折线图Y轴名称
var nameY=null;//
setNameY(oilType);
function setNameY(type) {
    if(type==0){
        nameY='升';
    }else if(type==1){
        nameY='升';
    }else if(type==2){
        nameY='升';
    }
}
//折线图
function createOil() {
    var oil = echarts.init($('#oilStatist').get(0));
    option = {
        tooltip: {
            trigger: "axis"
        },
        legend: {
            icon: 'emptyCircle',
            top: 40,
            data: oilName
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
                    color: '#333'
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
            name:nameY,
            axisLine: {
                show: false
            },
            axisTick: {
                show: false //是否显示坐标轴刻度
            }
        },
        series: [
            {
                name: oilName,
                type: 'bar',
                symbol: 'emptyCircle',
                symbolSize: 10,
                stack: '总量',
                itemStyle: {
                    normal: {
                        color: attendColor[0]
                    }
                },
                data: oilCost
            }
        ]
    };
    oil.setOption(option);
    return oil;
}
$(window).resize(function () {
    createOil();
});
/*2018/4/27时间*/
timeValue('yyyy-MM-dd',2,0);
