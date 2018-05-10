$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'count/findOilCount',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            // carNum:'',
            // endTime:'',
            deptId:userDeptId,
            id:userDeptId,
            type:0,
            dataTtype:0,
        },
        pageSize:10,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'gz',title:'组织机构',width:150,align:'left'},
            {field:'carType',title:'车型',width:100,align:'center'},
            {field:'mz',title:'加油前油量(升)',width:100,align:'right'},
            {field:'sex',title:'加油后油量(升)',width:50,align:'center'},
            {field:'oil',title:'加油量(升)',width:100,align:'center'},
            {field:'time',title:'时间',width:150,align:'center'},
            {field:'joinTime',title:'地点',width:300,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectonSelect:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
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
    var formData = {};//请求数据
    var perObj={
        deptId:userDeptId,
        type:0,
        dataTtype:0,
        endTime:'',
    };
    perObj['carNum']=$('#carNum').val();
    var idsArr=[],namesArr=[];
    var $dateFmt="yyyy-MM-dd";
    timeControl($('#time1'),'time1',$dateFmt);
    $('#time1').val(year+'-'+month+'-'+day);
    //查询油耗
    findOilCount();
    function findOilCount() {
        perObj['endTime']=$('#time1').val();
        applyListOpt.queryParams['endTime']=perObj['endTime'];
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['endTime']=$('#time1').val();
        applyListOpt.queryParams['endTime']=perObj['endTime'];
        findOilCount();
    });
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
