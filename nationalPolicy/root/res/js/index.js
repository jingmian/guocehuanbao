/**
 * Created by Administrator on 2017/9/7.
 */
$(function () {
    var UName = [];
    var WeiNum = [];
    var WuNum = [];
    var DaiNum = [];
    var CNum = [];
    var BNum = [];
    var BSNum = [];
    var illNum = [];
    var oil=[];
    var mile=[];
    var time = new Date();
    var month = time.getMonth() + 1;

    /**
     * 获取当前月前6个月的时间
     * @param month
     */
    function getmonthBeforSix(month) {
        var monthArr = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        var arryRes = [];
        if (month < 6) {
            for (var i = 6; i > 0; i--) {
                arryRes.push(monthArr[month + 12 - i]);
            }
        } else {
            for (var i = 6; i > 0; i--) {
                arryRes.push(monthArr[month - i]);
            }
        }
        return arryRes;
    }

    UName = getmonthBeforSix(month);
    var formData = {},//请求数据
        mType = '';//请求方法类型

    var maxValue = 20;
    var mileMax = 30;
    var oilMax = 30;

    var carMainData = [];
    var personMainData = [];
    var factMainData = [];
    var carRoun = [];
    var personRoun = [];
    var factitsRoun = [];


    var runSafe = [];
    var runSafeData = [];
    var runSafeTitle = [];



    var carbl;
    var personbl;
    var factitesbl;
    var oilMilebel=[];
    //查询首页数据

    function getDays(year,month){
        var d=new Date(year,month,0);
        return d.getDate();
    }

    statisticsInfo();

    function statisticsInfo() {
        formData.userDeptId = getCookie("deptId");
        var cfg = {
            token: getCookie("token"),
            url: 'indexManage/statisticsInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);

                if (data.code == 0) {
                    //--------上排
                    $('#personAlarm').text(data.data.warningMap.personCount);
                    $('#carAlarm').text(data.data.warningMap.carCount);
                    $('#sanitationCount').text(data.data.sanitationCount);
                    $('#oilCount').text(data.data.oilCount);
                    //--------中间
                    var carOnLineInfo = data.data.carOnLineCountMap;
                    var personOnLineInfo = data.data.personOnLineMap;
                    var facilitiesInfo = data.data.facilitiesMaps;
                    if (carOnLineInfo != null) {
                        var totalcars = carOnLineInfo.totalCars;
                        var cars = carOnLineInfo.countCarMap;
                        var onLine = carOnLineInfo.onLine;
                        carbl = onLine + '/' + totalcars;
                        if (null != totalcars) {
                            for (var da in cars) {
                                var mainData = da + ' ' + cars[da] + '/' + totalcars;
                                carMainData.push(mainData);
                                var obj = {};
                                obj.value = cars[da];
                                obj.name = mainData;
                                carRoun.push(obj);
                            }
                        }

                        carAttend();
                    } else {
                        carbl = 0 + '/' + 0;
                        carAttend();
                    }
                    if (personOnLineInfo != null) {
                        var personAllCount = personOnLineInfo.personAllCount;
                        var persons = personOnLineInfo.onLinePersonMap;
                        var onLine = personOnLineInfo.personOnLine;
                        personbl = onLine + '/' + personAllCount;
                        if (null != personAllCount) {
                            for (var da in persons) {
                                var mainData = da + ' ' + persons[da] + '/' + personAllCount;
                                personMainData.push(mainData);
                                var obj = {};
                                obj.value = persons[da];
                                obj.name = mainData;
                                personRoun.push(obj);
                            }
                        }
                        personAttend();
                    } else {
                        personbl = 0 + '/' + 0;
                        personAttend();
                    }


                    if (null != facilitiesInfo) {
                        factitesbl = facilitiesInfo.facilitiesAllCount;
                        var facilities = facilitiesInfo.facilitiesMap;
                        if (null != personAllCount) {
                            for (var da in facilities) {
                                var mainData = da + ' ' + facilities[da] + '/' + factitesbl;
                                factMainData.push(mainData);
                                var obj = {};
                                obj.value = facilities[da];
                                obj.name = mainData;
                                factitsRoun.push(obj);
                            }
                        }
                        platFormShe();

                    } else {
                        factitesbl = 0;
                        platFormShe();
                    }
                    //--------下排

                    var facilitiesPriceInfo = data.data.facilitiesPriceMap;
                    var runsaftInfo = data.data.runsaftMap.resultMaps;
                    var oilMileageList = data.data.oilMills;

                    if (null != facilitiesPriceInfo) {
                        //--维修金额
                        WeiNum = facilitiesPriceInfo.repairMoneys;
                        //---油耗
                        WuNum = facilitiesPriceInfo.gasoMoneys;
                        //---保养
                        DaiNum = facilitiesPriceInfo.mainMoneys;
                        //---年检
                        CNum = facilitiesPriceInfo.inspMoneys;
                        //---其他
                        BNum = facilitiesPriceInfo.otherMoneys;
                        //---违章费用
                        illNum = facilitiesPriceInfo.illegalMoneys;
                        //---保险费用
                        BSNum = facilitiesPriceInfo.insuMoneys;
                        cost();
                    } else {
                        //--维修金额
                        WeiNum = [0, 0, 0, 0, 0, 0];
                        //---油耗
                        WuNum = [0, 0, 0, 0, 0, 0];
                        //---保养
                        DaiNum = [0, 0, 0, 0, 0, 0];
                        //---年检
                        CNum = [0, 0, 0, 0, 0, 0];
                        //---其他
                        BNum = [0, 0, 0, 0, 0, 0];
                        //---违章费用
                        illNum = [0, 0, 0, 0, 0, 0];
                        //---保险费用
                        BSNum = [0, 0, 0, 0, 0, 0];
                        cost();
                    }

                    if (null != runsaftInfo) {
                        for (var i in runsaftInfo) {
                            var obj = new Object();

                            obj.name = i;
                            obj.type = 'line';
                            obj.stack = '总量';
                            obj.data = runsaftInfo[i];
                            runSafe.push(obj);
                            runSafeTitle.push(i);

                            //runSafe[runSafe.length]={i,'line','总量',runsaftInfo[i]};
                        }
                        maxValue =  data.data.runsaftMap.maxValue;
                        operatSafe();
                    }
                    else {
                        runSafeData.name = '无';
                        runSafeData.type = 'line';
                        runSafeData.stack = '总量';
                        runSafeData.data = 0;
                        runSafe.push(runSafeData);
                        runSafeTitle.push("无");
                        operatSafe();
                    }

                    if (null != oilMileageList) {
                        var time = new Date();
                        var year = time.getYear();
                        var month = time.getMonth();
                        var curMon = getDays(year, month);
                        for(var i = 0;i < curMon;i++){
                            var day = (i + 1);
                            if (i < 9) {
                                var resDay = month+'/'+'0' + day;
                                oilMilebel.push(resDay);
                            } else {
                                var resDay = month+'/'+day;
                                oilMilebel.push(resDay);
                            }
                        }
                        oil=oilMileageList.oilConsumes;
                        mile=oilMileageList.mileageConsumes;
                        oilMax = oilMileageList.oilMileMax;
                        mileMax=oilMileageList.oilMileMax;
                            oilMileageInfo();
                    }else{
                        var time = new Date();
                        var year = time.getYear();
                        var month = time.getMonth();
                        var curMon = getDays(year, month);
                        for(var i = 0;i < curMon;i++){
                            var day = (i + 1);
                            if (i < 9) {
                                var resDay = month+'/'+'0' + day;
                                oilMilebel.push(resDay);
                            } else {
                                var resDay = month+'/'+day;
                                oilMilebel.push(resDay);
                            }
                            oil.push(0);
                            mile.push(0);
                        }

                        oilMileageInfo();
                    }

                }
            },
            error: function (data) {

            }
        };
        wulianAjax(cfg);
    }

    //车辆出勤数
    function carAttend() {
        var unit = echarts.init($('#main').get(0));
        option = {
            color: ['#F79395', '#7BCB38', '#08BCDE', '#60ADF8', '#FFBD3B', "#B58BF7", "#C0D2DC"],
            legend: {
                left: 270,
                rient: 'vertical',  //布局  纵向布局 图例标记居文字的左边 vertical则反之
                width: 100,      //图行例组件的宽度,默认自适应
                itemGap: 12, //图行例组件的高度,默认自适应
                itemWidth: 35,
                x: 'right',   //图例显示在右边
                y: 'top', //图例在垂直方向上面显示居中
                data: carMainData,
                icon: 'circle',
                textStyle: {    //图例文字的样式
                    color: '#333',  //文字颜色
                    fontSize: 12    //文字大小
                }
            },
            graphic: {
                type: 'text',
                left: '24%',
                top: 'center',
                style: {
                    text: '  总出勤 \r\n\n' + carbl,
                    textAlign: 'center',
                    fill: '#000',
                    width: 30,
                    height: 30,
                    fontSize: 16
                }
            },
            series: [ //系列列表
                {
                    name: '随访次数',  //系列名称
                    type: 'pie',   //类型 pie表示饼图
                    center: ['30%', '50%'], //设置饼的原心坐标 不设置就会默认在中心的位置
                    radius: ['60%', '80%'],  //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
                    itemStyle: {  //图形样式
                        normal: { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                            label: {  //饼图图形上的文本标签
                                show: false  //平常不显示
                            },
                            labelLine: {     //标签的视觉引导线样式
                                show: false  //平常不显示
                            }
                        }
                    },
                    data: carRoun
                }
            ]
        };
        unit.setOption(option);
        return unit;
    }

    //人员出勤
    function personAttend() {
        var unit = echarts.init($('#main1').get(0));
        option = {
            color: ['#F79395', '#7BCB38', '#08BCDE', '#60ADF8', '#FFBD3B', "#B58BF7", "#C0D2DC"],
            legend: {
                left: 270,
                top: 0,
                rient: 'vertical',  //布局  纵向布局 图例标记居文字的左边 vertical则反之
                width: 100,      //图行例组件的宽度,默认自适应
                itemGap: 12, //图行例组件的高度,默认自适应
                itemWidth: 35,
                x: 'right',   //图例显示在右边
                y: 'top', //图例在垂直方向上面显示居中
                data: personMainData,
                icon: 'circle',
                textStyle: {    //图例文字的样式
                    color: '#333',  //文字颜色
                    fontSize: 12    //文字大小
                }
            },
            graphic: {
                type: 'text',
                left: '24%',
                top: 'center',
                style: {
                    text: '  总出勤 \r\n\n' + personbl,
                    textAlign: 'center',
                    fill: '#000',
                    width: 30,
                    height: 30,
                    fontSize: 16
                }
            },
            series: [ //系列列表
                {
                    name: '随访次数',  //系列名称
                    type: 'pie',   //类型 pie表示饼图
                    center: ['30%', '50%'], //设置饼的原心坐标 不设置就会默认在中心的位置
                    radius: ['60%', '80%'],  //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
                    itemStyle: {  //图形样式
                        normal: { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                            label: {  //饼图图形上的文本标签
                                show: false  //平常不显示
                            },
                            labelLine: {     //标签的视觉引导线样式
                                show: false  //平常不显示
                            }
                        }
                    },
                    data: personRoun
                }
            ]
        };
        unit.setOption(option);
        return unit;
    }

    //平台设施
    function platFormShe() {
        var unit = echarts.init($('#main2').get(0));
        option = {
            color: ['#F79395', '#7BCB38', '#08BCDE', '#60ADF8', '#FFBD3B', "#B58BF7", "#C0D2DC"],
            legend: {
                left: 280,
                top: 0,
                rient: 'vertical',  //布局  纵向布局 图例标记居文字的左边 vertical则反之
                width: 100,      //图行例组件的宽度,默认自适应
                itemGap: 12, //图行例组件的高度,默认自适应
                itemWidth: 35,
                x: 'right',   //图例显示在右边
                y: 'top', //图例在垂直方向上面显示居中
                data: factMainData,
                icon: 'circle',
                textStyle: {    //图例文字的样式
                    color: '#333',  //文字颜色
                    fontSize: 12    //文字大小
                }
            },
            graphic: {
                type: 'text',
                left: '24%',
                top: 'center',
                style: {
                    text: '总设施数\r\n\n' + factitesbl,
                    textAlign: 'center',
                    fill: '#000',
                    width: 30,
                    height: 30,
                    fontSize: 16
                }
            },
            series: [ //系列列表
                {
                    name: '随访次数',  //系列名称
                    type: 'pie',   //类型 pie表示饼图
                    center: ['30%', '50%'], //设置饼的原心坐标 不设置就会默认在中心的位置
                    radius: ['60%', '80%'],  //饼图的半径,第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
                    itemStyle: {  //图形样式
                        normal: { //normal 是图形在默认状态下的样式；emphasis 是图形在高亮状态下的样式，比如在鼠标悬浮或者图例联动高亮时。
                            label: {  //饼图图形上的文本标签
                                show: false  //平常不显示
                            },
                            labelLine: {     //标签的视觉引导线样式
                                show: false  //平常不显示
                            }
                        }
                    },
                    data: factitsRoun
                }
            ]
        };
        unit.setOption(option);
        return unit;
    }

    /*柱状图*/

    //成本费用
    function cost() {
        var unit = echarts.init($('#main3').get(0));
        option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            color: ['#F79395', '#7BCB38', '#08BCDE', '#60ADF8', '#FFBD3B', '#7BCB63', '#7BCB79'],
            legend: {
                data: ['油费', '保险', '违章费用', '维修', '保养', '年检', '其他']

            },
            grid: {
                left: '1%',
                right: '1%',
                bottom: '1%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: true,
                data: UName,
                axisLine: {
                    show: true,
                    textStyle: {
                        color: '#333'
                    },
                    lineStyle: {
                        color: '#ddd',
                        width: 1//这里是为了突出显示加上的
                    }
                },
                "axisTick": {
                    "show": false
                },
                axisLabel: {
                    textStyle: {
                        color: '#95969b'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#ddd',
                        width: 1//这里是为了突出显示加上的
                    }
                },
                axisLabel: {
                    textStyle: {
                        color: '#95969b'
                    }
                },
                "axisTick": {
                    "show": false
                },
                splitArea: {
                    show: true
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: '#dddddd'
                    }
                }

            },
            series: [
                {
                    name: '油费',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 40,
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }

                    },
                    data: WuNum
                },
                {
                    name: '保险',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 40,
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }

                    },
                    data: BSNum
                },
                {
                    name: '违章费用',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 40,
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }

                    },
                    data: illNum
                },
                {
                    name: '维修',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 40,
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: WeiNum
                },
                {
                    name: '保养',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 40,
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: DaiNum
                },
                {
                    name: '年检',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 40,
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: CNum
                },
                {
                    name: '其他',
                    type: 'bar',
                    stack: '总量',
                    barWidth: 40,
                    label: {
                        normal: {
                            show: false,
                            position: 'insideRight'
                        }
                    },
                    data: BNum
                },
            ]
        };
        unit.setOption(option);
        return unit;
    }

    //运行安全
    function operatSafe() {
        var unit = echarts.init($('#main4').get(0));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            color: ['#F79395', '#7BCB38', '#08BCDE', '#60ADF8'],
            legend: {
                data: runSafeTitle
            },
            toolbox: {
                show: true
            },
            calculable: true,
            grid: {
                left: '2%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: false,
                    data: UName,
                    axisLine: {
                        lineStyle: {
                            color: '#ddd',
                            width: 1//这里是为了突出显示加上的
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#95969b'
                        }
                    }

                }

            ],
            yAxis: [
                {
                    type: 'value',
                    'nameGap': 30,	//坐标轴名字里坐标系的距离
                    'nameTextStyle': {
                        ontStyle: 'oblique',
                        color: "#FECD74"
                    },
                    'max': maxValue,
                    'splitNumber': 10,
                    //'boundaryGap':true,  // x的距离
                    'axisLabel': {	//字体
                        margin: 20,
                        textStyle: {
                            color: '#95969b'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#999',
                            width: 1//这里是为了突出显示加上的
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#dddddd'
                        }
                    }
                }
            ],
            series: runSafe
        };
        unit.setOption(option);
        return unit;
    }

    //油耗与里程信息
    function oilMileageInfo() {
        var unit = echarts.init($('#main5').get(0));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            color: ['#F79395', '#7BCB38'],
            toolbox: {
                show: true
            },
            calculable: true,
            grid: {
                left: '1%',
                right: '1%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    boundaryGap: true,
                    data: oilMilebel,
                    'nameGap': 2,
                    axisLine: {
                        lineStyle: {
                            color: '#ddd',
                            width: 1//这里是为了突出显示加上的
                        }
                    },
                    'axisLabel': {
                        'interval': 0,
                        textStyle: {
                            color: '#95969b'
                        }
                    },
                    "axisTick": {
                        "show": true,
                        length: 1
                    }

                }
            ],
            yAxis: [
                {
                    'type': 'value',
                    'name': '油费',
                    'nameGap': 30,	//坐标轴名字里坐标系的距离
                    'nameTextStyle': {
                        color: "#FECD74"
                    },
                    'max': oilMax,
                    'splitNumber': 10,
                    //'boundaryGap':true,  // x的距离
                    'axisLabel': {	//字体
                        margin: 20,
                        textStyle: {
                            color: '#95969b'
                        }
                    },
                    "axisTick": {
                        "show": false
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#999',
                            width: 1//这里是为了突出显示加上的
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: '#dddddd'
                        }
                    }
                },
                {
                    'type': 'value',
                    'name': '里程',
                    'nameGap': 30,	//坐标轴名字里坐标系的距离
                    'nameTextStyle': {
                        ontStyle: 'oblique',
                        color: "green"
                    },
                    'min': 0,
                    'max': mileMax,
                    'splitNumber': 10,
                    'axisLabel': {	//字体
                        margin: 20,
                        textStyle: {
                            color: '#95969b'
                        }
                    },
                    axisLine: {
                        show: false,
                        lineStyle: {
                            color: '#999',
                            width: 1//这里是为了突出显示加上的
                        }
                    },
                    "axisTick": {
                        "show": false
                    }
                }
            ],
            series: [
                {
                    name: '油耗',
                    type: 'line',
                    stack: '总量',
                    data: oil
                },
                {
                    name: '里程',
                    type: 'line',
                    stack: '总量',
                    data: mile
                }

            ]
        };
        unit.setOption(option);
        return unit;
    }

    var userType = userType,
        userDeptId = userDeptId;

    //封装传入数据方法
    function postFormData() {
        if (mType == 'find') {
            formData.userType = userType;
            formData.userDeptId = userDeptId;
        }
    }
});
