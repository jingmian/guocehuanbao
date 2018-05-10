$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'cost/findIllegal',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            carNum:'',
            deptId:userDeptId
        },
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'dept',title:'所属部门',width:150,align:'left'},
            {field:'carNum',title:'车牌号',width:150,align:'center'},
            {field:'carType',title:'车型',width:100,align:'center'},
            {field:'driver',title:'驾驶员',width:160,align:'center'},
            {field:'illegalTime',title:'时间',width:150,align:'center'},
            {field:'illegalPlace',title:'地点',width:150,align:'left'},
            {field:'illegalMoney',title:'费用(元)',width:100,align:'right',formatter:function(value){
                return value==0?value:value.toFixed(2);
            }},
            {field:'illegalType',title:'类型',width:100,align:'center',formatter:function(value){
                if(value==0){value='违章'}
                if(value==1){value='事故'}
                if(value==2){value='其他违章'}
                return value;
            }},
//            {field:'illegalAgent',title:'缴费人',width:160,align:'center'},
            {field:'illegalContent',title:'内容',width:300,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [
        {
            text:'导出',
            id: "btnExport",
            // iconCls: 'icon iconfont icon-daochu',
            handler:function() {
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'644px',
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
        onSelect: function (index, row) {
            perObj['id']=row.id;
            perObj['deptId']=row.deptId;
            perObj['userId']=row.userId;
            perObj['carId']=row.carId;
            perObj['illegalTime']=row.illegalTime;
            perObj['illegalMoney']=row.illegalMoney;
            perObj['moneyBefore']=row.moneyBefore;
            perObj['illTimeBefore']=row.illTimeBefore;
            perObj['illegalAgentName']=row.illegalAgentName;
            perObj['illegalContent']=row.illegalContent;
            perObj['illegalPlace']=row.illegalPlace;
            getSelections();
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    var perObj={
        id:0,
        deptId:userDeptId,
        userId:'',
        carId:0,
        illegalTime:'',
        illegalMoney:0,
        moneyBefore:0,
        illTimeBefore:'',
        illegalAgentName:'',
        illegalContent:'',
        illegalPlace:''
    };
    perObj['carNum']=$('#carNum').val();
    var $dateFmt="yyyy-MM-dd";
    timeControl($('#time1'),'time1',$dateFmt);
    timeControl($('#time2'),'time2',$dateFmt);
    var idsArr=[],namesArr=[];
    //查询违章
    function findIllegal() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['carNum']=$('#carNum').val();
        applyListOpt.queryParams['carNum']=perObj['carNum'];
        findIllegal();
    });
    //增加违章
    function addIllegal() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'cost/addIllegal',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findIllegal();
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

    //修改违章
    function modIllegal() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'cost/modIllegal',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findIllegal();
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
})
