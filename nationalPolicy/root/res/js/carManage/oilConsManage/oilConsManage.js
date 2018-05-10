$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'car/findOilUse',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            carNum:'',
            deptId:userDeptId,
            id:userDeptId
            // endTime:''
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'deptName',title:'所属部门',width:150,align:'left'},
            {field:'carNum',title:'车牌号',width:150,formatter:function(value,row,index){
                return '<span class="show-detail">'+value+'</span>'
            }},
            {field:'carType',title:'车型',width:100,align:'center'},

            {field:'oilAmount',title:'油量(L)',width:80,align:'right'/*formatter:function(value,row,index){
                return  (value/10000).toFixed(2);
            }*/},
            {field:'oilConsume',title:'油耗(L)',width:140,align:'right'/*,formatter:function(value,row,index){
                return  (value/10000).toFixed(2);
            }*/},
            {field:'mileageConsume',title:'里程(km)',width:140,align:'right'},
            {field:'oilKm',title:'单位油耗(L/100km)',width:200,align:'right'/*,formatter:function(value,row,index){
                return  (value/10000).toFixed(2);
            }*/},
            {field:'startTime',title:'开始时间',align:'center',width:150},
            {field:'endTime',title:'结束时间',align:'center',width:150},
            {field:'endTime1',title:'',align:'left',width:150},
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
        endTime:''
    };
    perObj['carNum']=$('#carNum').val();
    var idsArr=[],namesArr=[];
    var $dateFmt="yyyy-MM-dd";
    timeControl($('#time1'),'time1',$dateFmt);
    $('#time1').val(year+'-'+month+'-'+day);
    //查询油耗
    //findOilUse();
    function findOilUse() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['carNum']=$('#carNum').val();
        applyListOpt.queryParams['carNum']=perObj['carNum'];
        findOilUse();
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
