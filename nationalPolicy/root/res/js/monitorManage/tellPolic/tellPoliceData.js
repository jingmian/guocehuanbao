$(function () {
    var dgData = [];//表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+"warningManage/findSystemWarningDataInfo",  //请求地址
        //请求传递的参数
        queryParams: {
            /*gridType: 'easyui',
            recordStatus: 10,*/
            alarmState:0
        },
        pageSize: 20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'alarmName',title:'报警名称',width:150,align:'left'},
            {field:'carNum',title:'车牌号',width:150,align:'center'},
            {field:'alarmTime',title:'报警时间',width:150,align:'center'},
            //   {field:'dictionaryType',title:'字典类型',width:200,align:'center'},
          /*  {field:'alarmLon',title:'报警时经度',width:100,align:'right'},
            {field:'alarmLat',title:'报警时纬度',width:100,align:'right'},*/
           /* {field:'alarmOilConsume',title:'耗油量',width:100,align:'right'},*/
            {field:'alarmLevel',title:'报警级别',width:100,align:'center'},
          /*  {field:'alarmSpeed',title:'超速报警速度',width:100,align:'right'},*/
            {field:'dictionaryName',title:'报警类型',width:100,align:'center'},
            {field:'alarmRemark',title:'报警内容',width:200,align:'center',formatter:function(value,row,index){
                return '<a style="color:#009aff;cursor: pointer;">点击查看详情</a>'
            }},
            {field:'alarmPlace',title:'报警地点',width:300,align:'left',formatter:function (value,row,index) {
                if(value==''){
                    return value='暂无地点信息'
                }else{
                    return value;
                }
            }}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
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
        ],
        onClickCell:function (rowIndex, field, value) {
            //点击报警内容查看详情
            if(field=='alarmRemark'){
                $('#alarmRemark').text(value);
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'500px',
                    content:$('#selectAll'),
                    move:$('#selectAll .title')
                }));
            }
        },
        onSelect: function (index, row) {
            getSelections();
        },
        onLoadError:function(){
            console.log(1)
        },
        onLoadSuccess:function(){
            $('.dgrid .show-detail').mouseover(function(){
                $(this).css({color:"#1874ad",cursor:"pointer"})
            }).mouseleave(function(){
                $(this).css({color:"#000",cursor:"pointer"})
            });
            $('.dgrid .show-detail').click(function(){
                var orderId=$(this).attr('data-href');

                setTimeout(function(){
                    $('#check-btn').trigger('click');
                },100);
            })
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    //标题选择
    $(".lTList").find("li").eq(0).addClass("lTActive");
    $(".lTList").find("li").click(function () {
        $(this).addClass("lTActive").siblings().removeClass("lTActive")
    })
    var formData = {
    	alarmState:0
    };
    //点击搜索框搜索
    var btn4 = document.getElementById("search");
    btn4.addEventListener("click", function() {
        applyListOpt.queryParams['objectName']=document.getElementById("name").value;
       /* applyListOpt.queryParams['alarmObject']=0;*/
    	findSystemWarningDataInfo();
    });
    //
    var idsArr=[],namesArr=[];
    //查询系统报警
    function findSystemWarningDataInfo() {
        $('#dgrid').datagrid('load');
    }
    //导出报警数据
    function exportWarningDataInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'warningManage/exportWarningDataInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    layer.msg(data.msg, {
                        time: 1000
                    });
                } else if (data.code == 2 || data.code == 1) {
                    tokenRequest(function () {
                        wulianAjax(cfg)
                    })
                } else {
                    layer.msg(data.msg, {
                        time: 1000
                    });
                }
            }
        };
        wulianAjax(cfg);
    }
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName)
        }
    }
    //查询数据字典接口
    queryDataDiction($('#alarmType'),'alarmType',false,findAlarmType);
    //点击查询不同类型报警
    function findAlarmType(){
        var $alarmTypeLi=$('#alarmType li');
        $alarmTypeLi.on('click',function () {
            $(this).addClass('lTActive').siblings().removeClass('lTActive');
            applyListOpt.queryParams['alarmTypeId']=$(this).attr('data-id');
            findSystemWarningDataInfo();
        });
    }
});
