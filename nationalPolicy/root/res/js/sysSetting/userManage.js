$(function () {
    var setting = {
        view: {
            showIcon: false,
            txtSelectedEnable: true,
            showLine: true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        chkStyle: "checkbox",
        check: {
            chkboxType: {"Y": "ps", "N": "ps"},
            enable: true
        },
        callback: {
            onClick: zTreeClick
        }
    };//角色
    var setting1 = {
        view: {
            showIcon: true,
            txtSelectedEnable: true,
            showLine: true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: zTreeClick1
        }
    };//部门
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'user/findUser',
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'userId', title: '用户名', hidden: true, width: 100, align: 'left'},
            {field: 'deptName', title: '部门名称', width: 150, align: 'left'},
            {field: 'userName', title: '用户名', width: 150, align: 'center'},
            {field: 'personName', title: '昵称', width: 100, align: 'left'},
            {field: 'userTypeName', title: '用户类型', width: 100, align: 'center'},
            {field: 'userPhone', title: '联系电话', width: 100, align: 'center'},
            {field: 'roleName', title: '角色', width: 200, align: 'center'}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            code: 143,
            handler: function () {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('新增用户信息');
                var em = '<em>*</em>密码:';
                $('#validPwd').find('span').html(em);
                getInput('userName').val('');
                getInput('personName').val('');
                getInput('userPwd').val('');
                getInput('userPhone').val('');
                getInput('deptName').val('');
                setSelectValue($('#userType'), '');
                removeValid();
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),
                    success: function () {
                        $('.deptName').focus(function () {//选择上级部门
                            findDept($("#windowTree"));
                            var treeIndex = layer.open({
                                title: false,
                                closeBtn: 1,
                                type: 1,
                                shade: 0,
                                area: '400px',
                                content: $('#form-Tree'),
                                move: $('#form-Tree .form-top'),
                                success: function () {
                                }
                            });
                            $('#form-Tree .submit-btn').click(function () {
                                layer.close(treeIndex);
                            });
                        });
                    }
                });
                $('#addNew .no').off('click');
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    var $phone = $('#addNew .userPhone');
                    var phone = $phone.val();
                    if (isPhoneNo($phone)) {
                        formData.userPhone = phone;
                    } else {
                        return;
                    }
                    if (validMustField()) {
                        formData.userName = getInput('userName').val();
                        formData.userPwd = getInput('userPwd').val();
                        formData.userDeptId = treeObj1['deptId'];
                        formData.personName = getInput('personName').val();
                        formData.userType = $('#userType').val();
                        addUser();
                        layer.close(index);
                    }
                });
            }
        }, {
            text: '修改',
            id: "btnApudate",
            code: 144,
            handler: function () {
                var row = $('#dgrid').datagrid('getSelections');
                if (row.length == 0) {
                    layer.msg('请选择要修改的用户信息', {time: 1000});
                    return;
                }
                if (row.length > 0) {
                    var rowIndex = $('#dgrid').datagrid('getRowIndex', row[row.length - 1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow', rowIndex);
                }
                $('#addNew .titleText').text('修改用户信息');
                var em = '密码:';
                $('#validPwd').find('span').html(em);
                getInput('userName').val(treeObj1['userName']);
                getInput('userPwd').val(treeObj1['userPwd']);
                getInput('userPhone').val(treeObj1['userPhone']);
                getInput('deptName').val(treeObj1['deptName']);
                getInput('personName').val(treeObj1['personName']);
                setSelectValue($('#userType'), treeObj1['userType']);
                removeValid();
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),
                    success: function () {
                        $('.deptName').focus(function () {//选择上级部门
                            findDept($("#windowTree"));
                            var treeIndex = layer.open({
                                title: false,
                                closeBtn: 1,
                                type: 1,
                                shade: 0,
                                area: '400px',
                                content: $('#form-Tree'),
                                move: $('#form-Tree .form-top'),
                                success: function () {
                                }
                            });
                            $('#form-Tree .submit-btn').click(function () {
                                layer.close(treeIndex);
                            });
                        });
                    }

                });
                $('#addNew .no').off('click');
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    var $phone = $('#addNew .userPhone');
                    var phone = $phone.val();
                    if (isPhoneNo($phone)) {
                        formData.userPhone = phone;
                    } else {
                        return;
                    }
                    if (validMustField()) {
                        formData.userId = treeObj1['userId'];
                        formData.userName = getInput('userName').val();
                        formData.personName = getInput('personName').val();
                        formData.userPwd = getInput('userPwd').val();
                        formData.userDeptId = treeObj1['deptId'];
                        formData.userType = $('#userType').val();
                        modUser();
                        layer.close(index);
                    }
                });
            }
        }, {
            text: '分配',
            id: "btnAssign",
            code: 145,
            handler: function () {
                if (!lx.judge($('#dgrid'), '分配', 'userId')) {
                    return;
                }
                //获取选择的列对应的用户id
                var paramData = {};
                var rows = $("#dgrid").datagrid("getSelections");
                if (rows != null && rows.length > 0) {
                    var userIds = null;
                    var userNums = 0;
                    for (var i in rows) {
                        if (userNums == 0) {
                            userIds = rows[i].userId;
                            userNums++;
                        } else {
                            userIds += "," + rows[i].userId;
                        }
                    }
                    paramData.userIds = userIds;
                    findRole($("#treeDemo1"));
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "644px",
                        shadeClose: false,
                        closeBtn: 1,
                        content: $("#distrib"),
                        move: $('#distrib .title')

                    });
                    $('#distrib .no').off('click');
                    $('#distrib .no').click(function () {
                        layer.closeAll();
                    });
                    $('#distrib .yes').off('click');
                    $('#distrib .yes').click(function () {
                        var id = treeObj['id'];
                        paramData.roleIds = id;
                        assignRoleOfUser(paramData);
                        $('#dgrid').datagrid('reload', applyListOpt.queryParams);
                        layer.close(index);
                    });
                } else {
                    layer.msg('请选择分配角色的用户', {timer: 1000});
                }
            }
        }, {
            text: '删除',
            id: "btnDelete",
            code: 146,
            handler: function () {
                var row = $('#dgrid').datagrid('getSelections');
                if (row.length == 0) {
                    layer.msg('请选择要删除的用户信息', {time: 1000});
                    return;
                }
                if (row.length > 0) {
                    getSelections();
                }
                $('#dInfo').text(usersArr.join(','));
                formData.ids = idsArr.join(',');
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title'),

                });
                $('#delete .no').off('click');
                $('#delete .no').click(function () {
                    layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    delUser();
                    layer.close(index);
                });
                var row = $('#dgrid').datagrid('getSelections');
                console.log(row)
            }

        }, {
            text: '刷新',
            id: "btnConfirm",
            code: 147,
            handler: function () {
                $('#dgrid').datagrid('reload', applyListOpt.queryParams)
            }
        }
        ],
        onSelect: function (index, row) {
            treeObj1['userId'] = row.userId;
            treeObj1['userName'] = row.userName;
            treeObj1['userPwd'] = row.userPwd;
            treeObj1['userPhone'] = row.userPhone;
            treeObj1['deptName'] = row.deptName;
            treeObj1['deptId'] = row.userDapt;
            // treeObj1['userType'] = row.userType;
            treeObj1['userType'] = row.userTypeName;
            treeObj1['personName'] = row.personName;
            getSelections();
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

    // function isPhoneNo(phone) {
    //     var pattern = /^1[34578]\d{9}$/;
    //     return pattern.test(phone);
    // }

    /**
     * 分派用户角色
     */
    function assignRoleOfUser(paramData) {
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/bindUserToRole',
            data: paramData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    formData = {};
                    findUser();
                    layer.msg('用户角色分派成功！', {
                        time: 1000
                    });
                }
            }
        };
        wulianAjax(cfg);
    }


    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var nodes = [], deptNodes = [];
    var formData = {},//请求数据
        mType = '',//请求方法类型
        flag = 0;//是否是第一次添加用户
    var $treeName = $(".m-from").find("ul.tree-name");
    var $dDName = $("#droleName");
    var treeObj = {//用户树对象
        'roleName': '',
        'id': '',
        'roleNameParent': '',
        'pid': ''
    };
    var treeObj1 = {
        'deptName': '',
        'deptId': '',
        'userName': '',
        'userId': 0,
        'userPhone': '',
        'userPwd': '',
        'personName': ''
    };
    var $roleName = $('.roleName'), roleArr = [];
    var $dCar = $('#d-car');
    var ids = '', idsArr = [], usersArr = [];

    //查询角色
    function findRole($dom) {
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/findRole',
            data: {tree: '1'},
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    nodes = [];
                    var result = data.data;
                    if (result.length > 0) {
                        nodes = [];
                        flag = 1;
                        for (var i = 0, l = result.length; i < l; i++) {
                            nodes.push({"id": result[i].roleId, "pId": result[i].pid, "name": result[i].roleName});
                        }
                    } else {
                        flag = 0;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting, openNodes(nodes));
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

    //查询部门
    function findDept($dom) {
        var cfg = {
            token: getCookie("token"),
            url: 'department/findDept',
            data: {tree: '1'},
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    deptNodes = [];
                    var result = data.data.deptInfo;
                    if (result.length > 0) {
                        deptNodes = [];
                        for (var i = 0, l = result.length; i < l; i++) {
                            deptNodes.push({"id": result[i].deptId, "pId": result[i].pId, "name": result[i].deptName});
                        }
                    }
                    $.fn.zTree.init($dom, setting1, openNodes(deptNodes));
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

    function openNodes(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].open = true;
            if (arr[i].pId == 0) {
                arr[i].iconSkin = "treeRoot";
            } else {
                arr[i].iconSkin = "child";
            }
        }
        return arr;
    }

    //查询用户
    // findUser();
    function findUser() {
        $('#dgrid').datagrid('load');
    }

    //点击查询图标
    $('.search-btn').click(function () {
        treeObj1['userName'] = $('#personName').val();
        applyListOpt.queryParams['userName'] = treeObj1['userName'];
        findUser();
    });

    //新增用户
    function addUser() {
        var cfg = {
            token: getCookie("token"),
            url: 'user/addUser',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    formData = {};
                    findUser();
                    layer.msg('用户添加成功！', {
                        time: 1000
                    });
                } else if (data.code == 2 || data.code == 1) {
                    tokenRequest(function () {
                        wulianAjax(cfg);
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

    //修改用户
    function modUser() {
        formData.userId = treeObj1['userId'];
        var cfg = {
            token: getCookie("token"),
            url: 'user/modUser',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    formData = {};
                    findUser();
                    layer.msg('用户修改成功！', {
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

    //删除用户
    function delUser() {
        var cfg = {
            token: getCookie("token"),
            url: 'user/delUser',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    formData = {};
                    $('#dgrid').datagrid('reload', applyListOpt.queryParams);
                    layer.msg('用户删除成功！', {
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

    //角色单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo1"),
            parentNode = treeNode.getParentNode();
        treeObj['id'] = treeNode.id;
        treeObj['roleName'] = treeNode.name;
        $roleName.val(treeObj['roleName'])
    }

    //部门单击
    function zTreeClick1(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree"),
            parentNode = treeNode.getParentNode();
        if (parentNode) {
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        treeObj1['deptId'] = treeNode.id;
        treeObj1['deptName'] = treeNode.name;
        getInput('deptName').val(treeObj1['deptName']);
    }

    //取得所有选中行数据
    function getSelections() {
        idsArr = [];
        usersArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].userId);
            usersArr.push(rows[i].userName)
        }
    }

    //查询用户类型
    queryDataDictionary();

    function queryDataDictionary() {
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/queryDataDictionary',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var res = data.data;
                    var arr = [];
                    if (res.length > 0) {
                        for (var i = 0; i < res.length; i++) {
                            var r = res[i];
                            if (r.dictionaryType == 'userType') {
                                var $option = '<option value="' + r.typeId + '">' + r.dictionaryName + '</option>';
                                arr.push($option);
                            }
                        }
                        $('#userType').html(arr.join(''));
                    }
                } else if (data.code == 2 || data.code == 1) {
                    tokenRequest(function () {
                        wulianAjax(cfg);
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
});
