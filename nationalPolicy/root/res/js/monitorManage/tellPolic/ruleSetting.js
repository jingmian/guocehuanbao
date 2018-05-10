$(function () {
    var dgData = [];//表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        // url:"../package.json",  //请求地址
        //请求传递的参数
        queryParams: {
            pageSize: 20,
            pageNo: 1,
            gridType: 'easyui',
            recordStatus: 10
        },
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'name',title:'报警名称',width:100,formatter:function(value,row,index){
                return '<span class="show-detail">'+value+'</span>'
            }},
            {field:'phone',title:'报警类型',width:100,align:'center'},
            {field:'gz',title:'阈值',width:100,align:'center'},
            {field:'sex',title:'连续数据',width:50,align:'center'},
            {field:'mz',title:'是否提醒',width:100,align:'center'},
            {field:'hj',title:'是否持续',width:100,align:'center'},
            {field:'joinTime',title:'报警对象',width:200,align:'center'},
            {field:'idCard',title:'报警分级',width:500,align:'center'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [
            {
                text:'新增',
                id: "btnNewAdd",
                handler:function() {
                    $('#addNew .titleText').text('新增规则设置信息');
                    // getInput('personName').val('');
                    // getInput('personPhone').val('');
                    // $personType.val('');
                    // $personSex.val('');
                    // $('.minzuId').val('');
                    var index=layer.open({
                        type: 1,
                        title: false,
                        area: "644px",
                        shadeClose:false,
                        closeBtn: 1,
                        content: $("#addNew"),
                        move: $('#addNew .title'),

                    })
                    $('#addNew .no').click(function(){layer.closeAll();
                    });
                    $('#addNew .yes').off('click');
                    $('#addNew .yes').click(function(){
                        formData.alarmName=perObj['alarmName'];
                        formData.alarmType=perObj['alarmType'];
                        formData.dictionaryType=perObj['dictionaryType'];
                        formData.floatVolue=perObj['floatVolue'];
                        formData.alarmThreshold=perObj['alarmThreshold'];
                        formData.alarmLevel=perObj['alarmLevel'];
                        addDesignRuleInfo();
                        layer.close(index);
                    });
                }
            },
            {
                text:'查看',
                id: "btnSelect",
                handler:function() {
                    $('#selectAll .titleText').text('查看规则设置信息');
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
            },{
                text:'修改',
                id: "btnApudate",
                handler:function() {
                    $('#addNew .titleText').text('修改规则设置信息');
                    var index=layer.open({
                        type: 1,
                        title: false,
                        area: "644px",
                        shadeClose:false,
                        closeBtn: 1,
                        content: $("#addNew"),
                        move: $('#addNew .title'),

                    })
                    $('#addNew .no').click(function(){layer.closeAll();
                    });
                    $('#addNew .yes').off('click');
                    $('#addNew .yes').click(function(){
                        formData.deptName=perObj['deptName'];
                        formData.pId=perObj['pId'];
                        modFacilitiesInfo();
                        layer.close(index);
                    });
                }
            },{
                text:'删除',
                id: "btnDelete",
                handler:function() {
                    getSelections();
                    $('#dPers').text(namesArr.join(','));
                    var index=layer.open({
                        type: 1,
                        title: false,
                        area: "300px",
                        shadeClose:false,
                        closeBtn: 1,
                        content: $("#delete"),
                        move: $('#delete .title'),

                    })
                    $('#delete .no').click(function(){layer.closeAll();
                    });
                    $('#delete .yes').off('click');
                    $('#delete .yes').click(function(){
                        formData.id=perObj['id'];
                        delDesignRuleInfo();
                        layer.close(index);
                    });
                }
            },
        ],
        onSelect: function (index, row) {
            perObj['id'] = row.id;
            perObj['alarmName'] = row.alarmName;
            perObj['alarmType'] = row.alarmType;
            perObj['dictionaryType'] = row.dictionaryType;
            perObj['floatVolue'] = row.floatVolue;
            perObj['alarmThreshold'] = row.alarmThreshold;
            perObj['deptName'] = row.deptName;
            perObj['pId'] = row.pId;
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
        id:'',
        alarmName:'',
        alarmType:'',
        dictionaryType:'',
        floatVolue:'',
        alarmThreshold:'',
        alarmLevel:'',
        deptName:'',
        pId:'',
    };
    var idsArr=[],namesArr=[];
    //查询规则设置
    findDesignRuleInfo();
    function findDesignRuleInfo() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'warningManage/findDesignRuleInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    dgData = data.data.data;
                    if (dgData.length > 0) {
                        $("#dgrid").datagrid('loadData', dgData);
                    }
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

    //添加规则设置
    function addDesignRuleInfo() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'warningManage/addDesignRuleInfo',
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

    //修改规则设置
    function modGroup() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'warningManage/modDesignRuleInfo',
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

    //删除规则
    function delDesignRuleInfo() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'warningManage/delDesignRuleInfo',
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

})
