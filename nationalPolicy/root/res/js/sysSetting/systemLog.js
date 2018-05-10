$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'systemRolePowerManage/findLogin',
        // url:"package.json",  //请求地址
        //请求传递的参数
        queryParams: {
            // pageSize:30,
            // pageNo: 1,
            // gridType: 'easyui',
            // recordStatus: 10
            // name:'admin'
            // token:getCookie("token")
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [[
            {field:'ck',checkbox:true},
            {field:'userName',title:'操作人',width:100,align:'left'},
            {field:'operateTime',title:'操作时间',width:150,align:'center'},
            {field:'operateContext',title:'操作内容',width:600,align:'left'}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [ {
            text: '刷新',
            id: "btnConfirm",
            handler: function () {
                $('#dgrid').datagrid('reload', applyListOpt.queryParams)
            }
        }
        ],
        onClickRow: function (index, row) {
        },
        onLoadSuccess: function () {
            $('.dgrid .show-detail').mouseover(function () {
                $(this).css({color: "#1874ad", cursor: "pointer"})
            }).mouseleave(function () {
                $(this).css({color: "#000", cursor: "pointer"})
            });
            $('.dgrid .show-detail').click(function () {
                var orderId = $(this).attr('data-href');

                setTimeout(function () {
                    $('#check-btn').trigger('click');
                }, 100);
            })
        }
    };

    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var $dateFmt="yyyy-MM-dd HH:mm:ss";
    timeControl($('#time1'),'time1',$dateFmt);
    timeControl($('#time2'),'time2',$dateFmt);
    var idsArr=[],namesArr=[];
    //查询日志
    function findLogin() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        var userName=$('#personName').val();
        var startTime=$('#time1').val();
        var endTime=$('#time2').val();
        var operateContext=$('#operateContext').val();
        if(userName!==''){
            applyListOpt.queryParams['userName']=userName;
        }
        if(startTime!==''){
            applyListOpt.queryParams['startTime']=startTime;
        }
        if(endTime!==''){
            applyListOpt.queryParams['endTime']=endTime;
        }
        if(operateContext!==''){
            applyListOpt.queryParams['operateContext']=operateContext;
        }
        applyListOpt.queryParams['userName']=userName;
        applyListOpt.queryParams['startTime']=startTime;
        applyListOpt.queryParams['endTime']=endTime;
        applyListOpt.queryParams['operateContext']=operateContext;
        findLogin();
    })
    //删除日志
    function delLogInfo() {
        findLogin();
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
});
