$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'person/findRealAttend',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            deptId:userDeptId,
            type:0
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'deptname',title:'用户部门',width:150,align:'left'},
            {field:'personname',title:'人员名称',align:'center',width:150},
            {field:'work_name',title:'上班名称',width:100,align:'center'},
            {field:'start_time',title:'上班时间',align:'center',width:150},
            {field:'clocktime',title:'打卡时间',width:150,align:'center'},
            {field:'state',title:'状态',width:50,align:'center'},
            {field:'place',title:'位置',width:500,align:'left'},
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
        onClickRow: function (index, row) {
            perObj['personId'] = row.personId;
            perObj['personName'] = row.personName;
            perObj['personPhone'] = row.personPhone;
            perObj['personType'] = row.personType;
            perObj['personAddress'] = row.personAddress;
            perObj['personSex'] = row.personSex;
            perObj['minzuId'] = row.minzuId;
            perObj['joinTime'] = row.joinTime;
            perObj['register'] = row.register;
            perObj['idCardNum'] = row.idCardNum;
            // getSelections($('#dgrid'),'personId','personName',idsArr,namesArr);
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
        type:0
    };
    var idsArr=[],namesArr=[];
    //查询出勤信息
    function findRealAttend() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['personName']=$('#personName').val();
        applyListOpt.queryParams['personName']=perObj['personName'];
        findRealAttend();
    })
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
