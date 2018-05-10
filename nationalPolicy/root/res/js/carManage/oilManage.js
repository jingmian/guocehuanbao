/*
* 增删改 功能的实现 12/26
* by 陆旋
* */
$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'car/findRefuelOil',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            carNum:''
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'id',hidden:true},
            {field:'deptName',title:'所属单位',width:150,align:'left'},
            {field:'carNum',title:'车牌号',width:150,align:'center'},
            {field:'gasolineTime',title:'加油时间',width:150,align:'center'},
            {field:'gasolineAmount',title:'加油量',width:120,align:'right'},
            {field:'gasolineAmount1',title:'',width:500,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectonSelect:true,
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
        },
        ],
        onSelect: function (index, row) {
        }
    };
    datagridFn(applyListOpt); //生成数据表格
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");//全选按钮
    //查询违章
    function findOilManage() {
        $('#dgrid').datagrid('reload');
    }
    //条件查询
    $('.search-btn').click(function () {
        applyListOpt.queryParams['carNum']=$('#carNum').val();
        findOilManage();
    });
});
