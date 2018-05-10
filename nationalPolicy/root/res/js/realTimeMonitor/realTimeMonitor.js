var aHtml1 = `<!--报警数据弹出层--><div class="form-list-small" id="alarmInfo">
                        <h5 class="title clear">
                            <span class="titleText">藏D8900</span>                            
                            <i class="icon iconfont icon-cheng"></i>
                        </h5>
                        <div class="form-body">
                            <div id="searchAlarm">
                                <ul>
                                    <li>
                                        <!--<span>开始时间:</span>-->
                                        <input type="text" placeholder="请输入报警开始时间" id="time1">
                                    </li>
                                    <li>
                                        <!--<span>结束时间:</span>-->
                                        <input type="text" placeholder="请输入报警结束时间" id="time2">
                                    </li>
                                    <li>
                                        <!--<span>报警类型:</span>-->
                                        <select name="" id="alarmTypeId">                                            
                                        </select>
                                    </li>
                                    <li>
                                        <!--<span>报警处理情况:</span>-->
                                        <select name="" id="alarmStatus">    
                                            <option value="0">未处理</option>                                        
                                            <option value="1">处理</option>                                        
                                        </select>
                                    </li>
                                    <li><a href="javascript:;" id="searchAlarmBtn">查询</a></li>
                                </ul>
                            </div>
                            <div class="section">
                                <div class="section-body">
                                    <table id="dgrid_22" pagination="true"></table>
                                </div>
                            </div>
                        </div>
                    </div><!--报警处理弹出层--><form class="form-list-small" id="delete">
        <h5 class="title"><span class="titleText">处理报警</span><i class="icon iconfont icon-cheng"></i></h5>
        <div class="form-body" style="padding-left:15px;">
            <div class="section">
                <div class="section-body deletePopup">
                    <h6 class="title" id="delete-info">
                        <i class="iconfont icon-tishi-copy icon-danger"></i>
                        确定处理车牌号为<span id="dPers"></span>的报警数据?
                    </h6>
                </div>

            </div>
        </div>
        <div class="form-btn">
            <ul>
                <li class="no b-gray">关闭</li>
                <li class="yes b-blue">确定</li>
            </ul>
        </div>
    </form><!--报警内容弹出层--><form class="form-list-small" id="selectAll">
        <h5 class="title"><span class="titleText"></span><i class="icon iconfont icon-cheng"></i></h5>
        <div class="form-body" style="max-height: 450px;overflow-y: auto;">
            <div class="section">
                <div class="section-body selectPopup with-pic-popup">
                    <ul class="clear">
                        <li class="textLen">
                            <span id="alarmRTitle"></span>
                            <p id="alarmRemark"></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </form>`;
var detailClick1 = {
    peoAlarm1: function (oId) {
        dataDgrid(0, oId);
    },
    carAlarm1: function (oId) {
        dataDgrid(1, oId);
    }
};
var $titleTxt;//字段弹出层标题
var $titleTxt1;//字段标题
function dataDgrid(type, oId) {
    var queryParams = {
        gridType: 'easyui',
        recordStatus: 10,
        deptId: userDeptId,
        objectId: oId,
        type: type
    };
    var $alarmType=$('#alarmTypeId');
    var $alarmStatus=$('#alarmStatus');
    var $time1=$('#time1');
    var $time2=$('#time2');
    $titleTxt=$('#selectAll .titleText');
    $titleTxt1=$('#alarmRTitle');
    $time1.on('click',function () {
        WdatePicker({el:'time1',dateFmt:'yyyy-MM-dd HH:MM:ss'});
    });
    $time2.on('click',function () {
        WdatePicker({el:'time2',dateFmt:'yyyy-MM-dd HH:MM:ss'});
    });
    //获取报警类型
    getAlarmType($alarmType,'alarmType');
    function getAlarmType(dom,type) {
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/queryDataDictionary',
            data: {dictionaryType:type},
            success: function (data) {
                var d=data.data;
                var opt='';
                for(var i=0;i<d.length;i++){
                    var d1=d[i];
                    opt+='<option value="'+d1.typeId+'">'+d1.dictionaryName+'</option>'
                }
                dom.html(opt);
            }
        };
        customAjax(cfg);
    }
    //报警处理
    function dealWarningInfo(alarmId) {
        var cfg = {
            token: getCookie("token"),
            url: 'warningManage/dealWarningInfo',
            data:{alarmId:alarmId},
            success: function (data) {
                $('#dgrid_22').datagrid('reload');
                layer.msg(data.msg,{
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }
    layer.open(publicObj({
        kind: 'layer',
        area: '660px',
        offset: '20%',
        closeBtn:1,
        shadeClose:false,
        content: $('#alarmInfo'),
        move: $('#alarmInfo .title'),
        success: function () {
            $('#dgrid_22').datagrid({
                url:requestUrl+'realTimeProtectionService/findAllWarningInfo',
                queryParams: queryParams,
                pagination:true,
                loadMsg: '请稍等....',
                singleSelect: false,
                collapsible: true,
                SelectOnCheck: true,
                CheckOnSelect: true,
                selectAll: "none",
                onClickCell:function (rowIndex, field, value) {
                    var row=$('#dgrid_22').datagrid('getRows');
                    var $field=$('#dgrid_22').datagrid('getColumnOption',field);
                    //点击报警内容查看详情
                    if(field=='alarmRemark'){
                        $('#alarmRemark').text(value);
                        setTitle();
                    }
                    function setTitle() {
                        $titleTxt.text($field.title+'详情');
                        $titleTxt.text($field.title+':');
                        var index=layer.open(publicObj({
                            kind:'layer',
                            area:'500px',
                            shade:0,
                            shadeClose:false,
                            closeBtn:1,
                            content:$('#selectAll'),
                            move:$('#selectAll .title')
                        }));
                    }
                },
                onLoadError: function () {
                    console.log(1)
                },
                onBeforeLoad:function (param) {
                    param.pageSize=param.rows;
                    param.pageNo=param.page;
                },
                onLoadSuccess: function (data) {

                },
                columns:[[
                    {field: 'ck', checkbox: true},
                    {field: 'alarmTime', title: '报警时间', width: 150, align: 'left'},
                    {field: 'dictionaryName', title: '报警类型', width: 100, align: 'center'},
                    {field: 'alarmRemark', title: '报警内容', width: 100, align: 'center',formatter:function(value,row,index){
                        if(value==null||value==''){return;}else{
                            return '<a style="color:#009aff;cursor: pointer;">点击查看详情</a>'
                        }
                    }},
                    {field: 'alarmLevel', title: '报警等级', width: 100, align: 'center',formatter:function(value,row,index){
                        if(value==0){
                            return value='一般';
                        }else if(value==1){
                            return value='紧急';
                        }else{
                            return value='特急';
                        }
                    }},
                    {field: 'alarmStatus', title: '处理情况', width: 200, align: 'center',formatter:function(value,row,index){
                        if(value==1){
                            return value='处理';
                        }else{
                            return value='未处理';
                        }
                    }},
                    {field: 'alarmPlace', title: '报警地点', width: 200,align: 'left',formatter:function(value,row,index){
                        return '<span style="cursor:pointer;color:#009aff;" data-id="'+row.traceId+'"  data-gps="'+row.alarmStartTime+'" onclick="getIp.call(this)">点击显示位置信息</span>';
                    }}
                ]],
                toolbar:[
                    {
                        id:'btnSelect',
                        text:'处理',
                        handler:function () {
                            var row=$('#dgrid_22').datagrid('getSelections');
                            var alarmId=0;
                            if(row.length==0){
                                layer.msg('请选择要处理的报警数据',{time:1000});
                                return;
                            }
                            if(row.length>0){
                                for(var i=0;i<row.length;i++){
                                    if(i==0){
                                        alarmId=row[i].alarmId;
                                    }else{
                                        alarmId+=','+row[i].alarmId
                                    }
                                }

                            }
                            $('#dPers').text(row[0].carNum);
                            var index = layer.open({
                                type: 1,
                                title: false,
                                area: "500px",
                                shade:0,
                                shadeClose:false,
                                closeBtn: 1,
                                content: $("#delete"),
                                move: $('#delete .title')

                            });
                            $('#delete .no').click(function () {
                                layer.close(index);
                            });
                            $('#delete .yes').off('click');
                            $('#delete .yes').click(function () {
                                layer.close(index);
                                dealWarningInfo(alarmId);
                            });
                        }
                    }
                ]
            });
        }
    }));
    //查询功能
    searchAlarm();
    function searchAlarm() {
        $('#searchAlarmBtn').on('click',function () {
            var time1=$('#time1').val();//报警开始时间
            var time2=$('#time2').val();//报警结束时间
            var alarmTypeId=$alarmType.val();//报警类型
            var alarmStatus=$alarmStatus.val();//处理情况
            queryParams.alarmStartTime=time1;
            queryParams.alarmEndTime=time2;
            queryParams.alarmTypeId=alarmTypeId;
            queryParams.alarmStatus=alarmStatus;
            $('#dgrid_22').datagrid('load',queryParams);
        });
    }
}

//显示地址
function getIp(){
    var _this=this;
    var index;
    var cfg={
        token:getCookie('token'),
        url:'realTimeProtectionService/findAddressInfo',
        data:{
            traceId:$(this).attr('data-id'),
            gpsTime:$(this).attr('data-gps')
        },
        success:function(data){
            if(data.code==0){
                if(data.address==''||data.address==null){
                    $(_this).text('暂无地址').off('click').css({'color':'#000'});
                }else{
                    $(_this).text('点击查看详情').off('click').css({'color':'#009aff'});
                    $('#alarmRemark').text(data.address);
                    $titleTxt.text('报警地点详情');
                    $titleTxt1.text('报警地点:');
                    layer.close(index);
                    index = layer.open({
                        // title:false,
                        kind:'layer',
                        area:'500px',
                        shade:0,
                        shadeClose:false,
                        closeBtn:1,
                        // zIndex:19891019,
                        content:$('#selectAll'),
                        move:$('#selectAll .title')
                    });
                }
            }

        }
    };
    customAjax(cfg);
}





