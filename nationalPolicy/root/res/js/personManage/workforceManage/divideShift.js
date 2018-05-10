$(function () {
    var setting = {
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
    };
    var setting1 = {
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
            onCheck: zTreeClick2
        }
    };
    var shiftManageOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'arrange/findGroup',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            userDeptId: userDeptId
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'deptName', title: '班组部门', width: 150, align: 'left'},
            {
                field: 'groupName',
                title: '班组名称',
                width: 150,
                align: 'center',
                formatter: function (value, row, index) {
                    return '<a data-href=" ' + row.name + ' " class="show-detail">' + value + '</a>'
                }
            },
            {field: 'userName', title: '班组人员', width: 150, align: 'left'},
            {field: 'remark', title: '备注', width: 300, align: 'left'}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            code:48,
            handler: function () {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('增加班组');
                getInput('groupName').val('');
                getInput('deptId').val('');
                getInput('staffIds').val('');
                getInput('remark').val('');
                staffIdsMeth1();
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),
                    success: function () {

                    }
                });
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData.groupName = getInput('groupName').val();
                    formData.deptId = diviObj['deptId'];
                    formData.remark = getInput('remark').val();
                    formData.staffIds = diviObj['staffIds'];
                    if (validMustField()) {
                        addGroup();
                        layer.close(index);
                    }
                });
            }
        }, {
            text: '修改',
            id: "btnApudate",
            code:49,
            handler: function () {
                var row = $('#dgrid').datagrid('getSelections');
                if (row.length == 0) {
                    layer.msg('请选择要修改的班组', {time: 1000});
                    return;
                }
                if (row.length > 0) {
                    var rowIndex = $('#dgrid').datagrid('getRowIndex', row[row.length - 1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow', rowIndex);
                }
                $('#addNew .titleText').text('修改班组');
                mType = 'mod';
                getInput('groupName').val(diviObj['groupName']);
                getInput('deptId').val(diviObj['deptName']);
                getInput('staffIds').val(diviObj['staffNames']);
                getInput('remark').val(diviObj['remark']);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')
                });
                staffIdsMeth2();
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData.groupId = diviObj['groupId'];
                    formData.groupName = getInput('groupName').val();
                    formData.deptId = diviObj['deptId'];
                    formData.deptName = diviObj['deptName'];
                    formData.remark = getInput('remark').val();
                    formData.beforeIds = diviObj['beforeIds'];
//                    formData.afterIds=diviObj['afterIds'];
                    formData.staffIds = diviObj['staffIds'];
                    if (validMustField()) {
                        modGroup();
                        layer.close(index);
                    }
                });
            }
        }, {
            text: '删除',
            id: "btnDelete",
            code:50,
            handler: function () {
                var row = $('#dgrid').datagrid('getSelections');
                if (row.length == 0) {
                    layer.msg('请选择要删除的班组', {time: 1000});
                    return;
                }
                if (row.length > 0) {
                    getSelections();
                }
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                });
                $('#delete .no').click(function () {
                    layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    formData.groupIds = diviObj['groupId'];
                    formData.staffIds = diviObj['staffIds'];
                    delGroup();
                    layer.close(index);
                });
            }
        }, {
            text: '',
            id: "btnStatistList",
            handler: function () {
                layer.open({
                    type: 1,
                    title: false,
                    area: "1000px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#statistList"),
                    move: $('#statistList .title')

                })
            }
        }
        ],
        onSelect: function (index, row) {
            diviObj['groupId'] = row.groupId;
            diviObj['groupName'] = row.groupName;
            diviObj['deptId'] = row.deptId;
            diviObj['deptName'] = row.deptName;
            diviObj['remark'] = row.remark;
            // diviObj['beforeIds']=row.beforeIds;
            diviObj['staffIds'] = row.personIds;
            diviObj['beforeIds'] = row.personIds;
            staffIds = diviObj['staffIds'];
            diviObj['staffNames'] = row.userName;
            staffNames = row.userName;
            $('#delName').text(diviObj['groupName']);
            getSelections();
        },
        onLoadError: function () {
            console.log(1)
        },
        onLoadSuccess: function (row, index) {
            $('.dgrid .show-detail').click(function () {
            })
        }
    };
    datagridFn(shiftManageOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    //上班时间
    //新增
    var $rowLen = 1;//默认显示行数
    $(".btnTAdd").click(function () {
        $rowLen++;
        var $contDiv = $(".sTCont1").html();
        var $contDiv1 = "<div class='sTCont sTCont1'>" + $contDiv + "</div>";
        $(".wSTime").append($contDiv1);

    });
    var formData = {}, mType = '';//请求数据
    var diviObj = {
        groupId: 0,
        groupName: '',
        deptId: userDeptId,
        deptName: '',
        remark: '',
        beforeIds: '',
        afterIds: '',
        staffIds: '',
        staffNames: ''
    };
    var idsArr = [], namesArr = [];
    var beforeIdsArr = [], afterIdsArr = [];
    var staffIds = '', staffNames = '';

    function findGroup() {
        $('#dgrid').datagrid('load');
    }

    //点击查询图标
    $('.search-btn').click(function () {
        diviObj['personName'] = $('#personName').val();
        shiftManageOpt.queryParams['groupName'] = diviObj['personName'];
        findGroup();
    })
    //新增班组
    // arrange/addGroup
    function addGroup() {
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/addGroup',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findGroup();
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

    //修改班组
    // arrange/modGroup
    function modGroup() {
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/modGroup',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findGroup();
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

    //删除班组
    // arrange/delGroup
    function delGroup() {
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/delGroup',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findGroup();
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

    //查询用户信息
    findUser();

    function findUser() {
        var cfg = {
            token: getCookie("token"),
            url: 'user/findUser',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    // deptId=data.data.userDapt;
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

    //查找部门
    function findDept($dom) {
        var deptObj = [];
        formData = {};
        formData.deptId = getCookie('deptId');
        var cfg = {
            token: getCookie("token"),
            url: 'department/findDeptTree',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.data;
                    if (result.length > 0) {
                        // flag=0;
                        for (var i = 0, l = result.length; i < l; i++) {
                            deptObj.push({"id": result[i].deptId, "pId": result[i].pid, "name": result[i].deptName});
                        }
                    } else {
                        // flag=1;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting, openNodes(deptObj));
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

    //查找人员
    function findPerson($dom) {
        var persObj = [];
        formData = {};
        formData.id = diviObj['deptId'];
        var cfg = {
            token: getCookie("token"),
            url: 'person/findFreePerson',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.data;
                    if (result.length > 0) {
                        // flag=0;
                        for (var i = 0, l = result.length; i < l; i++) {
                            var obj = {};
                            obj.id = result[i].personId;
                            obj.pId = result[i].picId;
                            obj.name = result[i].personName;
                            var oldPersonIds = diviObj['staffIds'];
                            if(oldPersonIds){
                                if (oldPersonIds.indexOf(result[i].personId) >= 0) {
                                    obj.checked = true;
                                }
                            }
                            persObj.push(obj);
                        }
                    } else {
                        // flag=1;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting1, openNodes(persObj));
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

    //班组部门单击
    function zTreeClick1(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree"),
            parentNode = treeNode.getParentNode();
        if (parentNode) {
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }

        diviObj['deptId'] = treeNode.id;
        diviObj['deptName'] = treeNode.name;
        $('.deptId').val(treeNode.name);
    };

    //班组人员单击
    function zTreeClick2(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree1");
        var selectedNodes = zTree.getCheckedNodes(true);
        var idsArr = [], namesArr = [];
//        if(mType=='mod'){
//            idsArr.push(staffIds);
//            namesArr.push(staffNames);
//        }
        for (var i in selectedNodes) {
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }
        diviObj['staffIds'] = idsArr.join(',');
        diviObj['staffNames'] = namesArr.join(',');
        beforeIdsArr = idsArr;
        afterIdsArr = idsArr;
        $('.staffIds').val(diviObj['staffNames']);
    };

    //取得所有选中行数据
    function getSelections() {
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName);
        }
    }

    //点击部门
    $('.deptId').click(function () {
        findDept($('#windowTree'));
        var index1 = layer.open({
            type: 1,
            title: false,
            area: "400px",
            shade: 0,
            closeBtn: 1,
            content: $("#dept-form-Tree"),
            move: $('#dept-form-Tree .form-top')
        });
        $('#dept-form-Tree .close').click(function () {
            layer.closeAll();
        });
        $('#dept-form-Tree .submit-btn').off('click');
        $('#dept-form-Tree .submit-btn').on('click', function () {
            layer.close(index1);
        });
    });

    //点击班组1
    function staffIdsMeth1() {
        $('.staffIds').off('focus');
        $('.staffIds').focus(function () {
            findPerson($('#windowTree1'));
            var index2 = layer.open({
                type: 1,
                title: false,
                area: "400px",
                shade: 0,
                closeBtn: 1,
                content: $("#pers-form-Tree"),
                move: $('#pers-form-Tree .form-top')
            });
            $('#pers-form-Tree .close').click(function () {
                layer.closeAll();
            });
            $('#pers-form-Tree .submit-btn').click(function () {
                layer.close(index2);
            });
        })
    }

    function staffIdsMeth2() {
        var idsArr1 = [], idsArr2 = [], namesArr1 = [], namesArr2 = [], obj1 = {}, obj2 = {};
        if (diviObj['staffIds']) {
            idsArr1 = diviObj['staffIds'].split(',');
        }
        if (getInput('staffIds').val()) {
            namesArr1 = getInput('staffIds').val().split(',');
        }
        for (var i = 0; i < namesArr1.length; i++) {
            var name = namesArr1[i];
            obj1[name] = idsArr1[i];
        }
        $('.staffIds').off('focus');
        $('.staffIds').focus(function () {
            findPerson($('#windowTree1'));
            var index2 = layer.open({
                type: 1,
                title: false,
                area: "400px",
                shade: 0,
                closeBtn: 1,
                content: $("#pers-form-Tree"),
                move: $('#pers-form-Tree .form-top')
            });
            $('.layui-layer-close2').click(function () {
                getInput('staffIds').val(diviObj['staffNames']);
            });
            $('#pers-form-Tree .submit-btn').click(function () {
                idsArr2 = diviObj['staffIds'].split(',');
                namesArr2 = getInput('staffIds').val().split(',');
                for (var i = 0; i < idsArr2.length; i++) {
                    var name = namesArr2[i];
                    obj1[name] = idsArr2[i];
                }
                var arr1 = [], arr2 = [], arr3 = [];
                for (var i = 0; i < namesArr1.length; i++) {
                    var count = 0;
                    for (var j = 0; j < namesArr2.length; j++) {
                        if (namesArr1[i] == namesArr2[j]) {
                            count++;
                        }
                    }
                    if (count == 0) {
                        arr1.push(obj1[namesArr1[i]]);
                    }
                }
                for (var m = 0; m < namesArr2.length; m++) {
                    var count = 0;
                    for (var n = 0; n < namesArr1.length; n++) {
                        if (namesArr2[m] == namesArr1[n]) {
                            count++;
                        }
                    }
                    if (count == 0) {
                        arr2.push(obj1[namesArr2[m]]);
                    }
                }
                for (var o = 0; o < namesArr2.length; o++) {
                    arr3.unshift(obj1[namesArr2[o]]);
                }
                diviObj['beforeIds'] = arr1.join(',');
                diviObj['afterIds'] = arr2.join(',');
                diviObj['staffIds'] = arr3.join(',');
                layer.close(index2);
            });
        })
    }

    //新增、修改按钮点击去掉红色边框
    removeValid();
});
