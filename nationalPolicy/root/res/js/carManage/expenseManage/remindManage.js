$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'remindInfoService/findRmindInfo',  //请求地址
        //请求传递的参数
        queryParams: {
            deptId:userDeptId
        },
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'deptName',title:'所属部门',width:150,align:'left'},
            {field:'carNum',title:'车牌号',width:150,align:'center'},
            {field:'dictionaryName',title:'提醒类型',width:100,align:'center'},
            {field:'days',title:'到期天数',width:100,align:'center'},
            {field:'remark',title:'备注',width:300,align:'left'},
        ]],
        rowStyler:function (index,row) {
            if(row.days>30){
                return 'color:#0C7FE9;';
            }else if(row.days>20&&row.days<30){
                return 'color:#FFBF24;';
            }else{
                return 'color:#FB2C36;';
            }
        },
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
        onSelect: function (index, row) {
            getSelections();
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    var perObj={
        carNum:''
    };
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['carNum']=$('#carNum').val();
        applyListOpt.queryParams['carNum']=perObj['carNum'];
        findAllCost();
    })
    var idsArr=[],namesArr=[];
    //查询所有费用
    function findAllCost() {
        $('#dgrid').datagrid('load');
    }
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].carId);
            namesArr.push(rows[i].carNum)
        }
    }
})
