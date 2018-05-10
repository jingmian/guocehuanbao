var xData = [], //当月天数
    speeds = [],//速度数据
    oilAmounts = []; //油量数据
var curMon = 24;
//自定义查询
var $custom = $('.oil-time li.custom');
$('.search-window').show();
var $searchTime = $('#time');
$custom.on('click', function () {
    $searchTime.show();
});
//默认传本
defaultPostTime(0, 0);

function defaultPostTime(num1, num2) {
    _StartTime = time.getYearMonthDay(num1) + ' ' + '00:00:00';
    _EndTime = time.getYearMonthDay(num2) + ' ' + '23:59:59';
    $searchTime.hide();
}

//点击昨日、今日等时间
var $oilLi = $('.oil-time li.default');
$oilLi.on('click', function () {
    $(this).addClass('active').siblings('li.default').removeClass('active');
    var attr = $(this).attr('data-time');
    if (attr == 0) {
        defaultPostTime(0, 0);
    }
    if (attr == 1) {
        defaultPostTime(-1, 0);
    }
    if (attr == 2) {
        defaultPostTime(-2, 0);
    }
});
/*测试数据*/
oilName = ['油量', '速度'];
var oilCurveCfg = {
        token: serverData.token,
        url: 'oilCountManager/findPieCountInfos',
        data: {
            deptId: oilCurveDeptId,
            situType: 3,
            startTime: _StartTime,
            endTime: _EndTime,
        },
        success: function (data) {
            xData = [];
            oilAmounts = [];
            speeds = [];
            var dd = data.data;
            if (dd) {
                if (dd.dates) {
                    xData = dd.dates;
                }
                if (dd.oilAmounts) {
                    oilAmounts = dd.oilAmounts
                }
                if (dd.speeds) {
                    speeds = dd.speeds;
                }
            }
            createOil();
        }
    },
    oilCurveOpt = {
        token: serverData.token,
        $Dom: $('#dgrid'),
        url: requestUrl + "oilCountManager/findCountTableInfos",
        queryParams: {
            pageSize: 20,
            pageNo: 1,
            situType: 3,
            startTime: _StartTime,
            endTime: _EndTime,
            deptId: oilCurveDeptId
        },
        columns: [[
            {field: 'deptName', title: '部门', width: 150, align: 'left'},
            {field: 'carNum', title: '车牌号', width: 150, align: 'center'},
            {field: 'startTime', title: '时间', width: 150, align: 'center'},
            {field: 'oilAmount', title: '油量(升)', width: 100, align: 'right'},
            {field: 'speed', title: '速度(km/h)', width: 100, align: 'right'},
            {field: 'runMileage', title: '行驶里程(km)', width: 100, align: 'right'},
            {
                field: 'place', title: '位置', width: 300, align: 'left', formatter: function (value, row, index) {
                return '<span style="cursor:pointer;color:#036edb;" data-id="' + row.startTraceId + '"  data-gps="' + row.startTime + '" onclick="getIp.call(this)">点击显示位置信息</span>';
            }
            }
        ]],
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
        }
        ],
        onLoadSuccess:function (data) {
            $('#oilContsData').find('span').text(data.oilMileage);
        }
    },
    detailOpt = {
        $Dom: $('#dgrid1'),
        url: "oilCountManager/findCountTableInfos",
        queryParams: {
            pageSize: 20,
            pageNo: 1,
            gridType: 'easyui',
            startTime: _StartTime,
            endTime: _EndTime,
            recordStatus: 10
        },
        columns: [[
            {field: 'carNum', title: '车牌号',fixed:true, width: 60},
            {field: 'phone', title: '车型', width: 180,fixed:true, align: 'center'},
            {field: 'gz', title: '时间', width: 180, fixed:true,align: 'center'},
            {field: 'mz', title: '加油前数据', width: 60,fixed:true, align: 'center'},
            {field: 'phone', title: '加油量', width: 60,fixed:true, align: 'center'},
            {field: 'gz', title: '加油后数据', width: 60,fixed:true, align: 'center'}
        ]],
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none"
    },
    attendColor = ['#b686f7', '#FFBC3D'];
$(function () {
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function () {
        $('.search').css({marginBottom: 0});
    });
    // lx.staticsName = 'oilCurveStatist';
    initPage();
    /*--------------------------------------------------功能函数--------------------------------------------------*/

    //页面初始化
    function initPage() {
        //动态改变样式
        $('.attend-statist').css({
            'marginTop': '-113px',
            'paddingTop': '113px'
        });
        $('.search-window .yes').click(function () {
            var $startTime = $('#startTime');
            var $endTime = $('#endTime');
            var $carNum = $('#carNum');

            //参数验证
            function isShowTime(val) {
                if (val == null || val == '') {
                    layer.msg('开始时间或结束时间不能为空', {timer: 1000});
                    return false;
                } else {
                    return true;
                }
            }

            if ($carNum.attr('keyid') == null) {
                layer.msg('车牌号必填', {timer: 1000});
                return;
            }

            function setPostTime(val1, val2) {
                oilCurveCfg.data.carId = $carNum.attr('keyid');
                oilCurveCfg.data.startTime = val1;
                oilCurveCfg.data.endTime = val2;
                oilCurveCfg.data.deptId = oilCurveDeptId;
                oilCurveOpt.queryParams.carId = $carNum.attr('keyid');
                oilCurveOpt.queryParams.startTime = val1;
                oilCurveOpt.queryParams.endTime = val2;
                oilCurveOpt.queryParams.deptId = oilCurveDeptId;
                //1、曲线数据获取
                //2、列表数据获取
                customAjax(oilCurveCfg);
                datagridFn(oilCurveOpt);
            }

            if ($searchTime.css('display') == 'none') {
                setPostTime(_StartTime, _EndTime);
            } else {
                if (isShowTime($startTime.val()) == true && isShowTime($endTime.val()) == true) {
                    setPostTime($startTime.val(), $endTime.val());
                }
            }
        });
    }

    createOil();
    datagridFn(oilCurveOpt);
    findHeadrInfo();
    customAjax(oilCurveCfg);
    /**
     * 头部信息
     */
    function findHeadrInfo() {
        var cfg = {
            token: serverData.token,
            url: 'oilCountManager/findHeaderInfos',
            data: {
                deptId: serverData.deptId,
                situType: 3
            },
            success: function (data) {
                var da = data.data;
                if (da.scaleNum||da.scaleNum==0) {
                    $('#scaleNum').text(da.scaleNum).append('<i style="font-size:14px;margin-left:2px;">%</i>');
                }
                if (da.nowMonAm||da.nowMonAm==0) {
                    $('#nowDay').text(da.nowMonAm).append('<i style="font-size:14px;margin-left:2px;">升</i>');
                }
                if (da.lastMonAm||da.lastMonAm==0) {
                    $('#yesterday').text(da.lastMonAm).append('<i style="font-size:14px;margin-left:2px;">升</i>');
                }
            }
        };
        customAjax(cfg);
    }
    /*2018/4/25油量统计昨日、本日、最近三日按钮点击请求接口*/
    $oilLi.on('click', function () {
        oilCurveCfg.data.startTime =_StartTime;
        oilCurveCfg.data.endTime = _EndTime;
        oilCurveOpt.queryParams.startTime = _StartTime;
        oilCurveOpt.queryParams.endTime = _EndTime;
        customAjax(oilCurveCfg);
        datagridFn(oilCurveOpt);
    });
});
//折线图
function createOil() {
    var oil = echarts.init($('#oilStatist').get(0));
    option = {
        // title: {
        //     text: 'tax in beijing : exemption pt : '
        // },
        color: ['#9E5BFF', '#FFD90B'],
        tooltip: {
            trigger: 'axis',
            // show:true,
            formatter: function (params) {
                var iIndex = params[0].dataIndex;
                var aryHtml = [];
                // 收入
                aryHtml.push('油量：' + oilAmounts[iIndex] + '<br />' + '速度：' + speeds[iIndex]);
                return aryHtml.join('');
            }
        },
        toolbox: {
            feature: {
                magicType: {
                    type: ['line', 'bar']
                },
                saveAsImage: {
                    show: true
                }
            },
        },
        xAxis: {
            data: xData
        },
        yAxis: [
            {
                type: 'value',
                scale: true,
                name: '油量(升)',
                max: Math.ceil(Math.max.apply(null, oilAmounts)),
                min: 0
            },
            {
                type: 'value',
                scale: true,
                name: '速度(km/h)',
                max: Math.ceil(Math.max.apply(null, speeds)),
                min: 0,
                splitLine: {
                    show: false
                }
            }
        ],
        legend: {
            position: 'center',
            data: ['油量', '速度']
        },
        dataZoom: [{
            start: 0,
            end: 100,
            bottom: 32,
            height: 20,
            // backgroundColor:'#79B8FF'
        }, {
            type: 'inside'
        }],
        series: [{
            name: '油量',
            type: 'line',
            yAxisIndex: 0,
            data: oilAmounts
        }, {
            name: '速度',
            type: 'line',
            yAxisIndex: 1,
            data: speeds
        }
        ]
    };
    oil.setOption(option);
    return oil;
}

//显示地址
function getIp() {
    var _this = this;
    var cfg = {
        token: getCookie('token'),
        url: 'realTimeProtectionService/findAddressInfo',
        data: {
            traceId: $(this).attr('data-id'),
            gpsTime: $(this).attr('data-gps')
        },
        success: function (data) {
            $(_this).text(data.address).off('click');
        }
    };
    customAjax(cfg);
}

$(window).resize(function () {
    createOil();
});
timeValue('yyyy-MM-dd HH:mm:ss',2,0);
