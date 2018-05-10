var formData = {}, mType = '';//传入数据
function beginEdit(value) {
    $('#addNew .remindBefore').val('');
    var index1 = layer.open({
        type: 1,
        title: false,
        area: "500px",
        shadeClose:false,
        closeBtn: 1,
        content: $("#addNew"),
        move: $('#addNew .title')
    });
    $('#addNew .no').off('click');
    $('#addNew .no').click(function () {
        layer.closeAll();
    });
    $('#addNew .yes').off('click');
    $('#addNew .yes').click(function () {
        if (validMustField()) {
            var remindBefore = $('#addNew .remindBefore').val();
            if (isNum1(remindBefore)) {
                formData.remindBefore = remindBefore;
            } else {
                layer.msg('请输入正整数', {timer: 1000});
                return false
            }
            modRemindInfo();
            layer.close(index1);
        }
    });
}

function findRemindInfo() {
    $('#dgrid').datagrid('load');
}

//修改提醒
function modRemindInfo() {
    var cfg = {
        token: getCookie("toekn"),
        url: 'systemNoticeRemind/modRemindInfo',
        data: formData,
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                findRemindInfo();
                layer.msg('修改成功！', {
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

$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'systemNoticeRemind/findRemindInfo',  //请求地址
        //请求传递的参数
        queryParams: {},
        pageSize: 20,
        //数据表格的显示字段
        columns: [[
            {field: 'id1', title: '', checkbox: true},
            {field: 'dictionaryName', title: '提醒类型', width: 100, align: 'left'},
            /*  {field:'dictionaryType',title:'字典类型',width:200},*/
            /*{field:'remindState',title:'提醒状态',width:200},*/
            {field: 'remindBefore', title: '提醒阈值', width: 100, align: 'right'},
            {
                field: 'remark', title: '备注', width: 200, align: 'center', formatter: function (value, row, index) {
                if (row.remindBefore == 0) {
                    return '该信息不进行提醒';
                    formatter
                } else if(row.dictionaryName.indexOf('超速') >= 0 ) {
                    return "超速阈值为" + row.remindBefore;
                }else{
                	return "该信息提前" + row.remindBefore + "天提醒";
                }
            }
            },
            {
                field: 'edit', title: '操作', width: 600, align: 'left', formatter: function (value, row, index) {
                // return  "<a id='editUpdate' href='javascript:;' onclick=beginEdit("+row.remindBefore+','+index+") style='color:#1f86ec'>修改</a><a id='editOk' href='javascript:;' onclick=endEdit("+row.remindBefore+','+index+") style='color:#1f86ec'>确认</a>";
                return "<a href='javascript:;' onclick=beginEdit(" + row.remindBefore + ") style='color:#1f86ec'>修改</a>";
            }
            }
        ]],
        collapsible: true,
        selectAll: "none",
        pagination: false,
        buttons: [/*{
            text: '新增',
            id: "btnNewAdd",
            handler: function () {
                dgridOneRow('add', '');
                $('#addNew .titleText').text('新增提醒');
                getInput('remindType').val('');
                getInput('dictionaryType').val('');
                getInput('remindState').val('');
                getInput('remindBefore').val('');
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: '500px',
                    shadeClose:false,
                    closeBtn: 1,
                    content: $('#addNew'),
                    move: $('#addNew .title')
                });
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData.remindType = $('#addNew .remindType').val();
                    formData.dictionaryType = $('#addNew .dictionaryType').val();
                    formData.remindState = $('#addNew .remindState').val();
                    formData.remindBefore = $('#addNew .remindBefore').val();
                    addRemind();
                    layer.close(index);
                });
            }
        }, *//*{
            text: '删除',
            id: "btnDelete",
            handler: function () {
                dgridOneRow('del', '请选择要删除的提醒信息');
                $('#dInfo').text(remindObj['remindType']);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                })
                $('#delete .no').click(function () {
                    layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    var str = idsArr.join(',');
                    remindObj['id'] = str;
                    formData.id = remindObj['id'];
                    delRemindInfo();
                    layer.close(index);

                });
            }
        },*//* {
            text: '修改',
            id: "btnApudate",
            handler: function () {
                debugger
                dgridOneRow('mod', '请选择要修改的提醒信息');
                $('#addNew .titleText').text('修改提醒');
                getInput('remindType').val(remindObj['remindType']);
                getInput('dictionaryType').val(remindObj['dictionaryType']);
                getInput('remindState').val(remindObj['remindState']);
                getInput('remindBefore').val(remindObj['remindBefore']);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: '500px',
                    shadeClose:false,
                    closeBtn: 1,
                    content: $('#addNew'),
                    move: $('#addNew .title')
                });
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData.remindType = $('#addNew .remindType').val();
                    formData.dictionaryType = $('#addNew .dictionaryType').val();
                    formData.remindState = $('#addNew .remindState').val();
                    formData.remindBefore = $('#addNew .remindBefore').val();
                    formData.id = remindObj['id'];
                    modRemindInfo();
                    layer.close(index);
                });
            }
        }, *//*{
            text: '刷新',
            id: "btnConfirm",
            handler: function () {
                $('#dgrid').datagrid('reload', applyListOpt.queryParams)
            }
        }*/
        ],
        onClickRow: function (index, row) {
            formData.id = row.id;
            formData.remindType = row.remindType;
            formData.dictionaryType = row.dictionaryType;
            formData.remindState = row.remindState;
            formData.remindBefore = row.remindBefore;
            remindObj['id'] = row.id;
            remindObj['remindType'] = row.remindType;
            remindObj['dictionaryType'] = row.dictionaryType;
            remindObj['remindState'] = row.remindState;
            remindObj['remindBefore'] = row.remindBefore;
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
    /* //全选按钮
     $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");*/
    var remindObj = {
        id: 0,
        remindType: 0,
        dictionaryType: 0,
        remindState: 0,
        remindBefore: 0
    };
    var idsArr = [], namesArr = [];

    //查询提醒
    function findRemindInfo() {
        // $('#dgrid').datagrid('load');
    }

    //新增提醒
    function addRemind() {
        var cfg = {
            token: getCookie("token"),
            url: 'systemNoticeRemind/addRemind',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRemindInfo();
                    layer.msg('新增成功！', {
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


    //删除提醒
    function delRemindInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'systemNoticeRemind/delRemindInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRemindInfo();
                    layer.msg('删除成功！', {
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
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].id);
            namesArr.push(rows[i].dictionaryType)
        }
    }
});
