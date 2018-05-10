var totalMoney = 0,
    pageData = {"0": "油费", "1": "维修费", "2": "保养费", "3": "年检费", "4": "保险费", "5": "违章费", "6": "其他费用"},
    pageType = {"0": 5, "1": 0, "2": 1, "3": 3, "4": 2, "5": 4, "6": 6},
    costType = GetQueryString("costType") || "0",//获取类型
    totalName = [pageData[costType]],//费用名称
    totalNum = [
        {name: pageData[costType], value: 0}
    ], //费用数量
    costCfg = {
        token: serverData.token,
        url: 'count/findSubPieInfo',
        data: {
            deptId: serverData.deptId,
            startTime: _StartTime,
            endTime: _EndTime,
            costType: pageType[costType],
            deptId: getCookie("deptId")
        },
        success: function (data) {
            totalName = [];
            totalNum = [];
            totalMoney = 0;
            var da = data.data;
            if (da != '') {
                if (da.lableName) {
                    totalName = da.lableName;
                }
                if (da.labelValue) {
                    totalNum = da.labelValue;
                }
                if (da.totalMoney) {
                    totalMoney = da.totalMoney;
                }

            }
            createTotalMoney();
        }
    },
    costOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + "count/findCostDetails",  //请求地址
        queryParams: {
            deptId: serverData.deptId,
            pageSize: 10,
            pageNo: 1,
            startTime: _StartTime,
            endTime: _EndTime,
            costType: pageType[costType],
            gatherType: 1
        },
        //数据表格的显示字段
        columns: [[
            {field: 'carId', hidden:true},
            {field: 'deptName', title: '部门', width: 180, align: 'center'},
            {field: 'carNum', title: '车牌号', width: 140},
            {field: 'money', title: '费用(元)', width: 180, align: 'right'},
            /* {field: 'nowTime', title: '缴费时间', width: 180, align: 'center'},*/
            {
                field: 'ranking', title: '排序', width: 60, align: 'center', formatter: function (val) {
                var rankHtml;
                if (val == 1 || val == 2 || val == 3) {
                    rankHtml = '<span class="ranking">' + val + '</span>';
                } else {
                    rankHtml = val;
                }
                return rankHtml;
            }
            }
        ]],
        SelectOnCheck: true,
        CheckOnSelect: true,
        onClickRow: function (index,row) {
            $("#statistList .titleText").text(pageData[costType]);
            layer.open(publicObj({
                kind: 'layer',
                content: $('#statistList'),
                move: $('#statistList .title'),
                area: '800px',
                success: function () {
                    detailOpt.queryParams.carId = row.carId;
                    datagridFn(detailOpt);
                }
            }));
        },
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
        }
        ]
    },
    detailOpt = {
        $Dom: $('#dgrid1'),   //数据表格容器
        url: requestUrl + "count/findCostDetails",  //请求地址
        //请求传递的参数
        queryParams: {
            deptId: serverData.deptId,
            startTime: costOpt.queryParams.startTime,
            endTime: costOpt.queryParams.endTime,
            costType: pageType[costType],
            costId: '',
            gatherType: 0
        },
        //数据表格的显示字段
        columns: [[
            {field: 'deptName', title: '部门', width: 180, align: 'center'},
            {field: 'carNum', title: '车牌号', width: 140},
            {field: 'money', title: '费用(元)', width: 180, align: 'right'},
            {field: 'nowTime', title: '缴费时间', width: 180, align: 'center'}
        ]],
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none"
    };
$(function () {
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function(){
        $('.search').css({marginBottom:0});
    });
    lx.staticsName = 'publicCost';
    initPage();
    /*--------------------------------------------------功能函数--------------------------------------------------*/

    //页面初始化
    function initPage() {
        //动态改变样式
        $('.attend-statist').css({
            'marginTop': '-113px',
            'paddingTop': '113px'
        });
        getHeadData();
        customAjax(costCfg);
        changeHeaderText();
        datagridFn(costOpt);
        document.title = pageData[costType];

        //绑定事件
        $('#searchBtn').click(function () {
            var inputVal = $(this).siblings('input').val(),
                newParam = $.extend({}, costOpt.queryParams);
            if ($.trim(inputVal) != '') {
                newParam.carNum = inputVal;
            }
            $('#dgrid').datagrid('load', newParam);
        });
    }

    //头部费用
    function getHeadData() {
        var cfg = {
            token: serverData.token,
            url: 'count/findCost',
            data: {
                deptId: serverData.deptId,
                costType: pageType[costType]
            },
            success: function (data) {
                var da = data.data;
                if (da.linkRel||da.linkRel==0) {
                    $('#lineRe').text(da.linkRel).append('<i style="font-size:14px;margin-left:2px;">%</i>');
                }
                if (da.nowMothMoney||da.nowMothMoney==0) {
                    $('#nowMonthData').text(da.nowMothMoney).append('<i style="font-size:14px;margin-left:2px;">元</i>');
                }
                if (da.lastMothMoney||da.lastMothMoney==0) {
                    $('#lastMonthData').text(da.lastMothMoney).append('<i style="font-size:14px;margin-left:2px;">元</i>');
                }
                if (da.avg) {
                    $('#avg').text(da.avg);
                }
            }
        };
        customAjax(cfg);
    }
});

//改变头部费用文字
function changeHeaderText() {
    var _p = $('.total span');
    $.each(_p, function (ind) {
        if (ind == 0) {
            $(this).text('本月' + pageData[costType]);
        } else if (ind == 1) {
            $(this).text('上月' + pageData[costType]);
        } else if (ind == 3) {
            $(this).text('平均' + pageData[costType]);
        }
    })
}

//不同的车辆类型费用饼图
function createTotalMoney() {
    var cost = echarts.init($('#ignitionStatist').get(0));
    option = {
        color: ['#F99296', '#7CCA38', '#0ABCE0', '#60ACF8', '#FFBC3A', '#B68BF7','#41F924','#28F9E7','#F062F9','#F92153','#12F9C6','#D8F9D2'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: '60%',
            y: '15%',
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
            top: '50%',
            style: {
                text: '总费用(元) \n\n' + totalMoney,
                textAlign: 'center',
                fill: '#000',
                width: 30,
                height: 30,
                fontSize: 16
            }
        },
        series: [{
            name: '总费用(元)',
            type: 'pie',
            label: false,
            labelLine: {
                normal: {
                    show: false
                }
            },
            radius: ['65%', '80%'],
            center:['50%','55%'],
            data: totalNum
        }]
    };
    cost.setOption(option);
    return cost;
}
//2018/4/25窗口事件
$(window).resize(function () {
    createTotalMoney();
});
timeValue('yyyy-MM-dd',2,0);
