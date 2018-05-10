/**
 * Created by admin on 2017/11/27.
 */
$(function(){
    var infoArr=window.location.href.split("?")[1].split('&');
    var selfId,
        dealType,
        previousHtml;
    for(var i=0;i<infoArr.length;i++){
        var val=infoArr[i].split('=')[1];
        if(i==0){
            selfId=val;
        }else if(i==1){
            dealType=val;
        }else{
            previousHtml=val;
        }
    }
    var timer,
        playFlag = false,
        speed=1000,
        map,
        pointData,
        index = 0,
        doPlay,
        progressBar,
        dgData;
    /*测试数据*/
    var titleName = ['油耗','速度','里程'],
        oilArr=[22, 61, 41, 31, 71, 21, 31, 81, 51, 61, 81, 31],
        speedArr=[22, 61, 41, 31, 71, 21, 31, 81, 51, 61, 81, 31],
        mileageArr=[22, 63, 43, 33, 73, 23, 33, 83, 53, 63, 83, 33],
        colorArr=['#FFBF47','#82CC43','#B990F7'];
    var xData=[];
    for(var i=0;i<14;i++){
        xData.push('06-14 17:21')
    }
    init();
    /*初始化地图*/
    function init(){
        //页面初始化
        $('.nav',window.parent.document).hide();
        $('.content',window.parent.document).css({paddingLeft:0});
        $('.m-from').css({padding:0});
        $('.contentMap').css({'left':0});
        $('#map').css('height',$('#map').height()-$('.path-wrap').height()+'px');

        $(window).resize(function(){
            $('#map').height($('body').height()-$('.path-wrap').height());
        });
        //初始化时间
        var date=new Date();
        $('#endTime').val(time.formatDate(date));
        $('#startTime').val( time.formatDate( new Date( date.setDate(date.getDate() - 1) ) ) );
        //$('.path-content').hide();
        //进度条
        progressBar=scrollBar({
            value:0,
            maxValue:100
        });
        //时间插件
        $('#startTime').focus(function(){
            WdatePicker({el:'startTime',maxDate:'#F{$dp.$D(\'endTime\')}',dateFmt:'yyyy-MM-dd HH:mm:ss'})
        });
        $('#endTime').focus(function(){
            WdatePicker({el:'endTime',minDate:'#F{$dp.$D(\'startTime\')}',dateFmt:'yyyy-MM-dd HH:mm:ss'})
        });
        //元素绑定事件
        $('.input-box').on('click','i',function(){
            $(this).toggleClass('active');
        });
        $('#speed').click(function(){
            $(this).children('dl').toggle();
        });
        $('#speed').find('dd').click(function(){
           $(this).parent().siblings('span').html($(this).html());
           speed=parseInt($(this).attr('data-speed'));
           if(timer){
               clearTimeout(timer);
               timer=setTimeout(doPlay,speed);
           }
        });
        $('#play').click(function(){
            if($(this).hasClass('play')){
                var sTime=$('#startTime').val(),
                    eTime=$('#endTime').val();
                if(pointData == undefined){
                    map.clear();
                    doPlayRouter(selfId, sTime, eTime);
                }else{
                    // play(pointData,index);
                    play(pointData);
                }
                if(pointData){
                    $('#dgrid').datagrid('loadData',pointData);
                }
            }else{
                if(playFlag){
                    $('#play').find('i').attr("class","iconfont icon-bofang");
                    $(this).addClass('play');
                    clearTimeout(timer);
                }else{
                    initDataGrid();
                }
            }
        });
        $('#stop').click(function () {
            if(playFlag){
                clearTimeout(timer);
                $('#play').find('i').attr("class","iconfont icon-bofang");
                $('#play').addClass('play');
            }
            index = 0;
            map.clearById(pointData[index].carId);
            $(".scroll_Thumb").css("margin-left", "0px");
            $(".scroll_Track").css("width", "0px");
            initDataGrid();
        });
        $('.path-tabs').on('click','li',function(){
            //debugger;
            var ind=$(this).index();
            $(this).addClass('active').siblings('li').removeClass('active');
            $('.path-content .section').each(function(i){
                if(i==ind){
                    $(this).addClass('current').siblings('.section').removeClass('current');
                }
                if(ind==1){
                    createLine();
                }
            })
        });
        $('.toggle').click(function(){
            var t=$(this).find('i').attr('title');
            if(t=='收缩'){
                $(this).find('i').attr('title','展开').attr('class','iconfont icon-sanjiao-copy-copy-copy1');
                $('#map').height($('body').height()-39);
                $('.path-wrap').css({'bottom':'-230px'})
            }else{
                $(this).find('i').attr('title','收缩').attr('class','iconfont icon-sanjiao-copy-copy-copy');
                $('#map').height($('body').height()-268);
                $('.path-wrap').css({'bottom':0})
            }
        });
        $('#goBack').click(function(){
            setTimeout(function(){
                $('.nav',window.parent.document).show();
                $('.rTMLBox').css('left','49px');
                location.href=previousHtml+'?back=true';
            },1000)
        });
        //实例化地图
        map=new YcyaMap('map');
        map.ready(function(){
            //添加地图 zoom、move 事件
            map.openZoomendEvent();
            map.openMoveendEvent();
            $('#yes').click(function(){
                var sTime,
                    eTime,
                    sVal=$('#startTime').val(),
                    eVal=$('#endTime').val();
                if(sVal!='' && eVal!='' ){
                    sTime=sVal;
                    eTime=eVal;
                    doRouter(selfId,sTime,eTime);
                }else{
                    layer.msg('请选择开始时间/结束时间',{time:1000});
                }
            })
        });


    }
    /*表格*/
    var tableOpt={
        $Dom:$('#dgrid'),
        pagination:false,
        queryParams:{
            pageSize: 20,
            pageNo: 1,
            gridType: 'easyui',
            deptId:0,
            type:0
        },
        rownumbers:true,
        collapsible:true,
        // rownumberWidth:100,
        onLoadSuccess:function(){
            $('.panel').css({padding:0});
        }
    };
    var carColumns=[[
        {field:'acc',title:'acc状态',width:120,formatter:function(value,row,index){
                if(value){
                    return '<span>点火</span>';
                }else{
                    return '<span>未点火</span>';
                }
            }},
        {field:'gpsTime',title:'定位时间',width:200,align:'center'},
        {field:'speed',title:'速度',width:100,align:'center',formatter:function(value,row,index){
                return '<span>'+(value/10)+'</span>km/h';
            }},
        {field:'direction',title:'方向',width:60,align:'center',formatter:function(value,row,index){
                if( (value>=0 && value<45) || value>=315 && value<360 ){
                    return '朝北';
                }else if(value>=45 && value<135){
                    return '朝东';
                }else if(value>=135 && value <225){
                    return '朝南';
                }else if(value>=225 && value<315){
                    return '朝西';
                }
            }},
        {field:'mileage',title:'里程',width:100,align:'center',formatter:function(value,row,index){
                return '<span>'+(value/10)+'</span>km';
            }},
        {field:'runStatus',title:'位置',width:600,align:'center',formatter:function(value,row,index){
                return '<span style="cursor:pointer;color:#036edb;" data-id="'+row.id+'"  data-gps="'+row.gpsTime+'" onclick="getIp.call(this)">点击显示位置信息</span>';
            }}
    ]];
    var peoColumns=[[
        {field:'gpsTime',title:'定位时间',width:200,align:'center'},
        {field:'speed',title:'速度',width:100,align:'center',formatter:function(value,row,index){
                return '<span>'+(value/10)+'</span>km/h';
            }},
        {field:'direction',title:'方向',width:60,align:'center',formatter:function(value,row,index){
                if( (value>=0 && value<45) || value>=315 && value<360 ){
                    return '朝北';
                }else if(value>=45 && value<135){
                    return '朝东';
                }else if(value>=135 && value <225){
                    return '朝南';
                }else if(value>=225 && value<315){
                    return '朝西';
                }
            }},
        {field:'mileage',title:'里程',width:100,align:'center',formatter:function(value,row,index){
                return '<span>'+(value/10)+'</span>km';
        }},
        {field:'lng',title:'经度',width:100,align:'center'},
        {field:'lat',title:'纬度',width:100,align:'center'},
        {field:'runStatus',title:'位置',width:600,align:'center',formatter:function(value,row,index){
                return '<span style="cursor:pointer;color:#036edb;" data-id="'+row.id+'"  data-gps="'+row.gpsTime+'" onclick="getIp.call(this)">点击显示位置信息</span>';
        }}
    ]];
    tableOpt.columns=(dealType=='0'?peoColumns:carColumns);
    datagridFn(tableOpt);
    createLine();
    /*曲线图*/
    function createLine() {
        var line = echarts.init($('#polyLine').get(0));
        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                icon:'circle',
                top: 0,
                data:titleName
            },
            toolbox: {
                feature: {
                    saveAsImage: {
                        show: true
                    }
                }
            },
            grid: {
                top:30,
                left:10,
                right: 0,
                bottom: 20,
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
                data: xData
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false //是否显示坐标轴刻度
                },
                max:300
            },
            series: [
                {
                    name:titleName[0],
                    type: 'line',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: colorArr[0]
                        }
                    },
                    data: oilArr
                },
                {
                    name:titleName[1],
                    type: 'line',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: colorArr[1]
                        }
                    },
                    data: speedArr
                },
                {
                    name:titleName[2],
                    type: 'line',
                    stack: '总量',
                    itemStyle: {
                        normal: {
                            color: colorArr[2]
                        }
                    },
                    data: mileageArr
                }
            ]
        };
        line.setOption(option);
        return line;
    }
    //播放
    function play(pointData) {
        clearTimeout(timer);
        playFlag = true;
        $('#play').find('i').attr("class","iconfont icon-zanting");
        $('#play').removeClass('play');
        dgData=[];
        var point = {type:1,evt:doIt,icon:''},pointLength = pointData.length;
        point.icon=(dealType=='0'?'peo':'che');
        doPlay = function () {
            point.data=[{"lng": pointData[index].lng, "lat": pointData[index].lat, "id": pointData[index].carId,"direction":pointData[index].direction}];
            map.addRoutePoint(point);
            //进度条
            progressBar.setValue(index,pointLength);
            //加载数据
            //dgData.push(pointData[index]);
            $("#dgrid").datagrid('scrollTo',index);
            $("#dgrid").datagrid('selectRow',index);
            /*//滚动条处于底部
            var div= $('.datagrid-view2  .datagrid-body')[0];
            div.scrollTop = div.scrollHeight;*/

            if (index++ >= pointData.length-1) {
                clearTimeout(timer);
                playFlag = false;
                $('#play').find('i').attr("class","iconfont icon-bofang");
                $('#play').addClass('play');
                if(!playFlag){
                    $(".scroll_Thumb").css("margin-left", '270px');
                    $(".scroll_Track").css("width", '270px');
                }
                index = 0;
                return ;
            }else{
                timer = setTimeout(doPlay, speed);
                $('#play').find('i').html('').attr("class","iconfont icon-zanting")
            }
        };
        timer = setTimeout(doPlay, speed);
    }
    //绘制播放轨迹
    function doPlayRouter(carId, startTime, endTime) {
        var cfg={
            token:getCookie("token"),
            url:'realTimeProtectionService/findTrailInfo',
            data: {
                startTime: startTime,
                endTime: endTime,
                carId:carId,
                mapType:'bd'
            },
            success: function (data) {
                if (data.data.length == 0) {
                    layer.msg('所选时间范围无轨迹数据', {time: 1000});
                } else {
                    pointData = data.data;
                    renderRoute(map, data.data);
                    if(doPlay){
                        doPlay(startTime,endTime,carId);
                    }
                }
            }
        };
        customAjax(cfg);
    }
    //轨迹
    function doRouter(carId,startTime,endTime){
        var pathCfg={
            token:getCookie('token'),
            url:'realTimeProtectionService/findTrailInfo',
            data:{
                startTime:startTime,
                endTime:endTime,
                carId:carId,
                mapType:'bd'
            },
            success:function(data){
                if (data.data.length == 0) {
                    layer.msg('所选时间范围无轨迹数据', {time: 1000});
                    map.clear();

                    index=0;
                    playFlag = false;
                    $('#play').find('i').attr("class","iconfont icon-bofang");
                    $('#play').addClass('play');
                    $(".scroll_Thumb").css("margin-left",0);
                    $(".scroll_Track").css("width", 0);
                    clearTimeout(timer);
                    $('#dgrid').datagrid('loadData',data.data);
                } else {
                    map.clear();
                    pointData = data.data;
                    renderRoute(map, data.data);
                }
            }
         };
        customAjax(pathCfg);
    }
    //绘制轨迹
    function renderRoute(map, data) {
        var datas = {"type": 1, "id": "川A12345", "evt": doIt, icon:'', "start": "start", "end": "end", "line": "line2"},
            points = [];
        datas.icon=(dealType=='0'?'peo':'che');
        for (var i in data) {
            points.push(data[i].lng);
            points.push(data[i].lat);
        }
        datas.data = points;
        map.route(datas);
    }
    function doIt(){
        console.log(1);
    }

    //清空datagrid
    function initDataGrid(){
        $('.datagrid-view1 .datagrid-btable').find('tr').each(function(){
            $(this).remove();
        })
        $('.datagrid-view2 .datagrid-btable').find('tr').each(function(){
            $(this).remove();
        })
    }
    //进度条点击事件
    scrollBarClick();
    function scrollBarClick() {
        // clearTimeout(timer);
        var $scrollBar=$('#scrollBar');
        var $scrollTrack=$('#scroll_Track');
        $scrollBar.click(function () {
            var w=$scrollTrack.width();
            index=Math.ceil(w/270*17);
            if(pointData!=undefined){
                play(pointData);
                $('#dgrid').datagrid('loadData',pointData);
            }
        })
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
            $(_this).text(data.address).off('click');
        }
    };
    customAjax(cfg);
    //$(this).text($(this).attr('data-lng')+' '+$(this).attr('data-lat'))
}
