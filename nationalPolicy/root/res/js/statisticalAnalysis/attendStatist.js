var xData = [], //当月天数
    attendShould = [],//应出总数
    attendReal = [],  //实出总数
    environShould = [], //环卫应出
    environReal = [],   //环卫实出
    toiletShould = [],  //厕管应出
    toiletReal = [],    //厕管实出
    patrolShould = [],  //巡查应出
    patrolReal = [],   //巡查实出
    monthTotal = [];//当年所有月份
var trackParam = {};//请求参数
var series = [];
var labelName = [];
var date = new Date(),
    $dateFmt = "yyyy-MM-dd";
var attendCfg = {
    token: serverData.token,
    url: 'attendanceCountService/findAttendanceInfo',
    data: '',
    success: function (data) {
        var datas = data.data;
        if (null != datas) {
            datas = $.parseJSON(datas);
            series = [];
            labelName = [];
            if (datas != '' && datas != null) {
                if (datas.series) {
                    series = datas.series;
                }
                if (datas.labelName) {
                    labelName = datas.labelName;
                }
                if(datas.lables){
                    xData=datas.lables;
                }
            }
            $(window).resize(function () {
                createAttend();
                resetHeight();
            }).resize();
        }
    }
};
var dicCfg = {
    token: serverData.token,
    url: 'datadictionary/queryDataDictionary',
    data: {
        dictionaryType: 'personType'
    },
    success: function (data) {
        if (data.data) {
            var res = data.data;
            var arr = [];
            /*2018/4/26添加全部下拉列表选项start*/
            var option0='<option value="-1">全部</option>';
            arr.push(option0);
            /*2018/4/26 end*/
            if (res.length > 0) {
                for (var i = 0; i < res.length; i++) {
                    var r = res[i];
                    var $option = '<option value="' + r.typeId + '">' + r.dictionaryName + '</option>';
                    arr.push($option);
                }
                $('#personType').html(arr.join(''));
            }
        }
    }
};

//折线图
function createAttend() {
    var attend = echarts.init($('#attendStatist').get(0));
    var attendColor = ['#ffbc3b', '#ff833b', '#0abcdf', '#46cce6', '#7cca37', '#90d058', '#b686f7', '#c7a7f7'];
    option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            icon: 'emptyCircle',
            top:40,
            /* left: 5,
             right: 40,*/
            itemGap: 5,
            itemWidth: 16,
            data: labelName
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
            left:10,
            right: 0,
            bottom:0,
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
            name:'天',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false //是否显示坐标轴刻度
            }
        },
        series: series
    };
    attend.setOption(option);
    return attend;
}

$(function () {
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function(){
        $('.search').css({marginBottom:0});
    });
    lx.staticsName = 'attend';
    buildTrackParam();
    trackParam.tableOrOtherType = 0;
    customAjax(attendCfg);
    customAjax(dicCfg);
    resetHeight();
    delete trackParam["tableOrOtherType"];
    trackParam.tableOrOtherType = 1;
    var ListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'attendanceCountService/findAttendanceInfo',  //请求地址
        //请求传递的参数
        queryParams: '',
        pageSize: 10,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'dictionaryName', title: '工种', width: 150, align: 'left'},
            {field: 'personName', title: '人员姓名', width: 150, align: 'center'},
            {field: 'shouldWorkDays', title: '应出勤天数(天)', width: 100, align: 'right'},
            {field: 'shouldWorkTimes', title: '应出勤次数(次)', width: 100, align: 'right'},
            {field: 'realWorkDays', title: '实出勤天数(天)', width: 100, align: 'right'},
            {field: 'realWorkTimes', title: '实出勤次数(次)', width: 100, align: 'right'},
            {field: 'absenceDays', title: '缺勤天数(天)', width: 100, align: 'right'},
            {field: 'absenceTimes', title: '缺勤次数(次)', width: 100, align: 'right'},
            {field: 'comeLateDays', title: '迟到天数(天)', width: 100, align: 'right'},
            {field: 'comeLateTimes', title: '迟到次数(次)', width: 100, align: 'right'}
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
                    //月统计调用事件
                    $('.search-detail .month').click(function () {
                        buildTrackParam();
                        trackParam.tableOrOtherType = 0;
                        customAjax(attendCfg);
                        resetHeight();
                        delete trackParam["tableOrOtherType"];
                        trackParam.tableOrOtherType = 1;
                        ListOpt.queryParams = trackParam;
                        datagridFn(ListOpt);
                    });
                });
            }
        }
        ]
    };
    ListOpt.queryParams = trackParam;
    datagridFn(ListOpt);

    /**
     * 构建查询参数队列
     */
    function buildTrackParam() {
        trackParam = {};
        attendShould = [];//应出总数
        attendReal = [];  //实出总数
        environShould = []; //环卫应出
        environReal = [];   //环卫实出
        toiletShould = [];  //厕管应出
        toiletReal = [];    //厕管实出
        patrolShould = [];  //巡查应出
        patrolReal = [];  //巡查实出
        monthTotal = [];//当年所有月份
        xData = [];
        trackParam.deptId = getCookie("deptId");
        trackParam.type = $('.search-default .active').attr('typeId');

        if (trackParam.type == 0) {
            var year = $('.search-detail  .year.active').text();
            var month = $('.search-detail .month.active').text();
            //开始时间
            if (month < 10) {
                month = '0' + month;
            }
            trackParam.startTime = year + '-' + month + '-01';
            //获取当月天数结束时间
            var days = getMonthDays(year, month);
            trackParam.endTime = year + '-' + month + '-' + days;

            for (var i = 1; i <= days; i++) {
                buildxData(i);
                initValue();
            }
        } else if (trackParam.type == 1) {
            var year = $('.search-detail  .year.active').text();
            trackParam.startTime = year + '-01' + '-01';
            // trackParam.endTime = year + '-12' + '-31';
            /*2018/4/26——start*/
            var data=new Date();
            var nowYear=data.getFullYear();//当前年
            var nowMonth=data.getMonth()+1;//当前月
            var nowDay=data.getDate();//当前日
            if(year==nowYear){
                trackParam.endTime = year +'-'+ time.timeTransform(nowMonth) +'-'+time.timeTransform(nowDay);
            }else{
                trackParam.endTime = year + '-12' + '-31';
            }
            /*2018/4/26——end*/
            for (var i = 1; i <= 12; i++) {
                buildxData(i);
                initValue();
            }
        } else {
            var dept = $("#dept").val();
            if ($.trim(dept) != '') {
                trackParam.deptId = dept;
            }
            var sTime = $('#startTime').val(),
                eTime = $('#endTime').val();
            if ($("#personType").val()) {
                trackParam.personTypeId = $("#personType").val();
            }
            if ($.trim(sTime) != '' && $.trim(eTime) != '') {
                trackParam.startTime = sTime;
                trackParam.endTime = eTime;
            } else {
                layer.msg('请输入时间段!', {time: 1000});
                return false;
            }
            var sArr = trackParam.endTime.split("-");
            var eArr = trackParam.startTime.split("-");
            var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
            var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
            var days = (sRDate - eRDate) / (24 * 60 * 60 * 1000) + 1;
            for (var i = days; i <= days; i++) {
                initValue();
            }
        }
        attendCfg.data = trackParam;
        return true;
    }

    function initValue() {
        attendShould.push(0);
        attendReal.push(0);
        environShould.push(0);
        environReal.push(0);
        toiletShould.push(0);
        toiletReal.push(0);
        patrolShould.push(0);
        patrolReal.push(0);
    }

    function buildxData(i) {
        if (i < 9) {
            xData.push('0' + i)
        } else {
            xData.push(i);
        }
    }

    //月统计调用事件
    $('.search-detail .month').click(function () {
        var flag = buildTrackParam();
        if (!flag) {
            return false;
        }
        trackParam.tableOrOtherType = 0;
        customAjax(attendCfg);
        resetHeight();
        delete trackParam["tableOrOtherType"];
        trackParam.tableOrOtherType = 1;
        ListOpt.queryParams = trackParam;
        datagridFn(ListOpt);
    });
    //年统计调用事件
    $('.search-detail .year').click(function () {
        var flag = buildTrackParam();
        if (!flag) {
            return false;
        }
        trackParam.tableOrOtherType = 0;
        customAjax(attendCfg);
        resetHeight();
        delete trackParam["tableOrOtherType"];
        trackParam.tableOrOtherType = 1;
        ListOpt.queryParams = trackParam;
        datagridFn(ListOpt);
    });
    //条件查询
    $(".search-window .yes").click(function () {
        var flag = buildTrackParam();
        if (!flag) {
            return false;
        }
        /*2018/4/28条件查询时将部门id和人员id值传入trackParam对象start*/
        var $serchWin=$('.search-window');
        var $dept=$serchWin.find('#dept');
        var $personType=$serchWin.find('#personType');
        if($dept.val()!=''){
            trackParam.deptId=$dept.attr('keyid');
        }
        if($personType.val()){
            trackParam.personType=$personType.val();
        }
        /*2018/4/28end*/
        trackParam.tableOrOtherType = 0;
        customAjax(attendCfg);
        resetHeight();
        delete trackParam["tableOrOtherType"];
        trackParam.tableOrOtherType = 1;
        ListOpt.queryParams = trackParam;
        datagridFn(ListOpt);
    });

    //点击月统计数据等3种头标时清除人员类型
    /*$('.search-default .default').click(function () {
        console.log(trackParam);
        delete   $('#personType').val();
    });*/
    $('.init-param').click(function () {
        delete trackParam['deptId'];
        delete trackParam['personTypeId'];
        var flag = buildTrackParam();
        if (!flag) {
            return false;
        }
        trackParam.tableOrOtherType = 0;
        customAjax(attendCfg);
        resetHeight();
        delete trackParam["tableOrOtherType"];
        trackParam.tableOrOtherType = 1;
        ListOpt.queryParams = trackParam;
        datagridFn(ListOpt);
    });
});
timeValue('yyyy-MM-dd',2,0);
