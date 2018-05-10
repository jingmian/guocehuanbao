var totalName=["维修费", "保养费", "保险费", "保险费", "违章费", "油费", "其它费"],//总费用名称
    totalNum=[
        {name: "维修费", value: 0},
        {name: "保养费", value: 0},
        {name: "保险费", value: 0},
        {name: "保险费", value: 0},
        {name: "违章费", value: 0},
        {name: "油费", value: 0},
        {name: "其它费", value: 0}
    ], //总费用数量
    totalMoney=0,
    totalCostCfg={
        token:serverData.token,
        url:'count/findCostCount',
        data:{
            deptId:serverData.deptId,
            startTime:_StartTime,
            endTime:_EndTime
        },
        success:function(data){
            var dd=$.parseJSON(data.data);
            if(dd.pieInfo.length>0 && dd.labelnames.length>0){
                totalNum=dd.pieInfo;
                totalName=dd.labelnames;
                totalMoney=dd.totalMoney;
            }
            createTotalMoney();
        }
    },
    totalCostOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+"count/findCostList",  //请求地址
        //请求传递的参数
        queryParams: {
            deptId:serverData.deptId,
            pageSize: 10,
            pageNo: 1,
            startTime:_StartTime,
            endTime:_EndTime
        },
        //数据表格的显示字段
        columns:[[
            {field:'carNum',title:'车牌号',width:140},
            {field:'carType',title:'车辆类型',width:180,align:'right'},
            {field:'gasoMoney',title:'油费(元)',width:80,align:'right'},
            {field:'repairMoney',title:'维修费(元)',width:80,align:'right'},
            {field:'mainMoney',title:'保养费(元)',width:80,align:'right'},
            {field:'inspMoney',title:'年检费(元)',width:80,align:'right'},
            {field:'insuMoney',title:'保险费(元)',width:80,align:'right'},
            {field:'ranking',title:'排名',width:60,align:'center',formatter:function(val){
                var rankHtml;
                if(val==1 || val==2 || val==3){
                    rankHtml='<span class="ranking">'+val+'</span>';
                }else{
                    rankHtml=val;
                }
                return rankHtml;
            }}
        ]],
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        onClickRow:function(index, row){
            detailOpt.queryParams.startTime=totalCostOpt.queryParams.startTime;
            detailOpt.queryParams.endTime=totalCostOpt.queryParams.endTime;
            detailOpt.queryParams.carId= row.carId;
            layer.open(publicObj({
                kind:'layer',
                content:$('#statistList'),
                move:$('#statistList .title'),
                area:'800px',
                success:function(){
                    datagridFn(detailOpt)
                }
            }));
        },
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
        }
        ]
    };
    detailOpt = {
        $Dom: $('#dgrid1'),   //数据表格容器
        url:requestUrl+"count/findCostParticularInfo",  //请求地址
        //请求传递的参数
        queryParams: {
            pageSize: 10,
            pageNo: 1,
            startTime:_StartTime,
            endTime:_EndTime
        },
        //数据表格的显示字段
        columns:[[
            {field:'carNum',title:'车牌号',width:140},
            {field:'carType',title:'车辆类型',width:60,align:'right'},
            {field:'gasoMoney1',title:'油费(元)',width:80,align:'right'},
            {field:'repairMoney1',title:'维修费(元)',width:80,align:'right'},
            {field:'mainMoney1',title:'保养费(元)',width:80,align:'right'},
            {field:'inspMoney1',title:'年检费(元)',width:80,align:'right'},
            {field:'insuMoney1',title:'保险费(元)',width:80,align:'right'},
            {field:'costTime',title:'时间',width:160,align:'center'}

        ]],
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        onLoadSuccess:function(row,index){
            $('#dgrid1').datagrid('options')
        }
    };
$(function(){
    //自定义查询统计图界面优化
    $('.search-default .custom,.search-condition').click(function(){
        $('.search').css({marginBottom:0});
    });
    lx.staticsName='totalCost';
    initPage();
   /* $(window).resize(function(){
        createTotalMoney();
        resetHeight();
    });*/
    /*--------------------------------------------------功能函数--------------------------------------------------*/
    //页面初始化
    function initPage(){
        //动态改变样式
        $('.attend-statist').css({
            'marginTop':'-113px',
            'paddingTop':'113px'
        });
        getHeadData();
        getCost();
        datagridFn(totalCostOpt);
        resetHeight();

        //绑定事件
        $('#searchBtn').click(function(){
            var inputVal=$(this).siblings('input').val(),
                newParam=$.extend({},totalCostOpt.queryParams);
            if($.trim(inputVal)!=''){
                newParam.carNum=inputVal;
            }
            $('#dgrid').datagrid('load',newParam);
        });
    }
    //头部费用
    function getHeadData(){
        var cfg={
            token:serverData.token,
            url:'count/findCost',
            data:{
                deptId:serverData.deptId
            },
            success:function(data){
                var da = data.data;
                if(da.linkRel||da.linkRel==0){
                    $('#lineRe').text(da.linkRel).append('<i style="font-size:14px;margin-left:2px;">%</i>');
                }
                if(da.nowMothMoney||da.nowMothMoney==0){
                    $('#nowMonthData').text(da.nowMothMoney).append('<i style="font-size:14px;margin-left:2px;">元</i>');
                }
                if(da.lastMothMoney||da.lastMothMoney==0){
                    $('#lastMonthData').text(da.lastMothMoney).append('<i style="font-size:14px;margin-left:2px;">元</i>');
                }
            }
        };
        customAjax(cfg);
    }
});
function getCost(){
    customAjax(totalCostCfg);
}
function createTotalMoney(){
    var total=echarts.init($('#ignitionStatist').get(0));
    option = {
        color:['#F99296','#7CCA38','#0ABCE0','#60ACF8','#FFBC3A','#B68BF7'],
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            x: '60%',
            y: '30%',
            itemWidth:10,
            itemHeight:10,
            icon: 'circle',
            data:totalName,
            formatter:function(name){
                var oa = option.series[0].data;
                var num=0;
                for(var m=0;m<oa.length;m++){
                    num+=oa[m].value;
                }
                for(var i = 0; i < option.series[0].data.length; i++){
                    if(name==oa[i].name){
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
            data:totalNum
        }]
    };
    total.setOption(option);
    return total;
}
//2018/4/25窗口事件
$(window).resize(function () {
    createTotalMoney();
});
timeValue('yyyy-MM-dd',2,0);
