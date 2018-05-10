$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'remindInfoService/findRmindInfo',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            remindId:'1',
            deptId:userDeptId,
            remindType:'1',
        },
        pageSize:10,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'carNum',title:'车牌号',width:100,formatter:function(value,row,index){
                return '<span class="show-detail">'+value+'</span>'
            }},
            {field:'carType',title:'车型',width:100,align:'center'},
            {field:'deptName',title:'组织机构',width:100,align:'center'},
            {field:'inspeLastTime',title:'上次年检时间',width:100,align:'center'},
            {field:'insuranceTime',title:'此次年检时间',width:50,align:'center'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [
            {
                text:'查看',
                id: "btnSelect",
                handler:function() {
                    $('#selectAll .titleText').text('查看年检提醒');
                    var index=layer.open({
                        type: 1,
                        title: false,
                        area: "644px",
                        shadeClose:false,
                        closeBtn: 1,
                        content: $("#selectAll"),
                        move: $('#selectAll .title'),

                    })
                    $('#selectAll .no').click(function(){layer.closeAll();
                    });
                    $('#selectAll .yes').off('click');
                    $('#selectAll .yes').click(function(){
                        layer.close(index);
                    });
                }
            },
        ],
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
})
