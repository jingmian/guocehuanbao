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
            onClick: zTreeClick
        }
    };

    $('.dept').focus(function () {
        var index1 = layer.open({
            type: 1,
            title: false,
            area: "644px",
            shade: 0,
            closeBtn: 1,
            content: $("#form-Tree"),
            move: $('#form-Tree .form-top')
        })
        $('#form-Tree .submit-btn').click(function () {
            layer.close(index1);
        });
    });

    var nodes = [];
    var applyListOpt = {
        $Dom: $('#dgrid'), // 数据表格容器
        url: requestUrl + 'cost/findInspection', // 请求地址
        // 请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            carNum: '',
            deptId: userDeptId
        },
        loadMsg: '请稍等....',
        // 数据表格的显示字段
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'dept',
            title: '所属部门',
            width: 150,
            align: 'left'
        }, {
            field: 'carNum',
            title: '车牌号',
            width: 150,
            align: 'center'
        }, {
            field: 'inspMoney',
            title: '年检费用(元)',
            width: 100,
            align: 'center',
            formatter: function (value) {
                return value == 0 ? value : value.toFixed(2);
            }
        }, {
            field: 'inspTime',
            title: '年检时间',
            width: 200,
            align: 'center'
        }, {
            field: 'inspectionNextTime',
            title: '下次年检时间',
            width: 200,
            align: 'center'
        }, {
            field: 'agentName',
            title: '经办人',
            width: 200,
            align: 'center'
        }, {
            field: 'remark',
            title: '备注',
            width: 300,
            align: 'left'
        }]],
        singleSelect: false,
        collapsible: true,
        SelectonSelect: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            code:106,
            handler: function () {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('新增年检费用');
                $('.carNum').val('');
                getInput('dept').val('');
                getInput('inspMoney').val('');
                getInput('inspTime').val('');
//				$('#addNew .inspectionYear').val('');
                getInput('inspectionNextTime').val('');
//				getInput('inspectionRemindTime').val('');
                getInput('remark').val('');
                $('.agentName').val("");
                formData.inspectionCarId = 0;
                workTime1();
                carType_insProvider();
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')
                });
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData = {};
                    formData.inspectionCarId = $('.carNum').val();
                    formData.inspectionMoney = getInput('inspMoney').val();
                    formData.inspectionTime = getInput('inspTime').val();
                    formData.inspectionRemark = $('.remark').val();
                    formData.inspectionNextTime = getInput('inspectionNextTime').val();
//					formData.inspectionRemindTim = getInput('inspectionRemindTime').val();
                    formData.agentName = $('.agentName').val();
                    if (validMustField()) {
                        if (getInput('inspMoney').val() != '' && isNaN(getInput('inspMoney').val())) {
                            layer.msg('年检费用只能为数字', {
                                time: 3000
                            });
                            return;
                        }
                        addInspection(index);
                    }
                });
            }
        }, {
            text: '修改',
            id: "btnApudate",
            code:107,
            handler: function () {
                var rows = $('#dgrid').datagrid('getSelections');
                if (rows.length != 1) {
                    layer.msg('请选择需要修改的记录，只能选中一条记录修改', {time: 2000});
                    return;
                }
                //根据单位查询车辆列表
                $('#addNew .titleText').text('修改年检费用');
                $('.carNum').val(perObj['carNum']);
                getInput('dept').val(perObj['dept']);
                getInput('inspMoney').val(perObj['inspectionMoney']);
                getInput('inspTime').val(perObj['inspTime']);
                getInput('remark').val(perObj['remark']);
                $('.agentName').val(perObj['agentName']);
                $('.inspectionNextTime').val(perObj['inspectionNextTime']);
                carType_insProvider();
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')

                })
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData = {};
                    formData.id = perObj['id'];
////					formData.userId = perObj['userId'];
//					formData.inspectionCarId = perObj['carId'];
//					formData.inspectionMoney = perObj['inspectionMoney'];
////					formData.moneyBefore = perObj['moneyBefore'];
////					formData.inspTimeBefore = perObj['inspTimeBefore'];
////					formData.carIdBrfore = perObj['carIdBrfore'];
//					formData.inspectionTime = perObj['inspectionTime'];
////					formData.inspectionYear = perObj['inspectionYear'];
//					formData.inspectionNextTime = perObj['inspectionNextTime'];
//					formData.inspectionRemindTim = perObj['inspectionRemindTim'];
//					formData.inspectionPlace = perObj['inspectionPlace'];

                    formData.inspectionCarId = $('.carNum').val();
                    formData.inspectionMoney = getInput('inspMoney').val();
                    formData.inspectionTime = getInput('inspTime').val();
                    formData.inspectionRemark = $('.remark').val();
                    formData.inspectionNextTime = getInput('inspectionNextTime').val();
                    formData.agentName = $('.agentName').val();

                    if (validMustField()) {
                        if (getInput('inspMoney').val() != '' && isNaN(getInput('inspMoney').val())) {
                            layer.msg('年检费用只能为数字', {
                                time: 3000
                            });
                            return;
                        }
                        modInspection(index);
                    }
//					layer.close(index);
                });
                findCar_1(perObj['deptId'],perObj['carId']);
            }
        }, {
            text: '删除',
            id: "btnDelete",
            code:108,
            handler: function () {
                var rows = $('#dgrid').datagrid('getSelections');
                if (rows.length == 0) {
                    layer.msg('请选择需要删除的记录，只能选中一条记录修改', {time: 2000});
                    return;
                }

                var ids = "";
                for (var i = 0; i < rows.length; i++) {
                    if (i > 0) {
                        ids += ',' + rows[i].costId;
                    } else {
                        ids = rows[i].costId
                    }
                }
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                });
                $('#delete .no').click(function () {
                    layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    var cfg_ = {
                        token: getCookie("token"),
                        url: 'cost/delCost',
                        data: {ids: ids, type: 3, costTime: perObj['costTime']},
                        success: function (data) {
                            findInspection();
                            layer.msg(data.msg, {
                                time: 1000
                            });
                            layer.close(index);
                        }
                    };
                    customAjax(cfg_);
                });
            }
        }, {
            text: '导出',
            id: "btnExport",
            // iconCls: 'icon iconfont icon-daochu',
            handler: function () {
                var index = layer.open(publicObj({
                    kind: 'layer',
                    area: '644px',
                    content: $('#export'),
                    move: $('#export .title')
                }));
                $('#export .no').click(function () {
                    layer.close(index)
                });

                $('#export .yes').off('click');
                $('#export .yes').click(function () {
                    var name = $('#excelFileName').val();
                    var d = time.getCurTime();
                    if (name == '') {
                        lx.export({
                            // url:'order/orderExport',
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        })
                    } else {
                        name = name + ' ' + d + '.xlsx';
                        lx.export({
                            // url:'order/orderExport',
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        }, name)
                    }
                });
            }
        }],
        onSelect: function (index, row) {
            perObj['id'] = row.costId;
            perObj['deptId'] = row.deptId;
            perObj['dept'] = row.dept;
            perObj['inspectionMoney'] = row.inspMoney;
            perObj['carId'] = row.carId;
            perObj['carNum'] = row.carNum;
            perObj['inspTime'] = row.inspTime;
            perObj['inspectionNextTime'] = row.inspectionNextTime;
            perObj['remark'] = row.remark;
            perObj['agentName'] = row.agentName;
            perObj['costTime'] = row.inspTime;
        },
        onUnselect: function (index, row) {
            costDetail(perObj['detailsNames'], perObj['detailsMoneys']);
        },
        onLoadError: function () {
            console.log(1)
        },
        onLoadSuccess: function () {
            $('.dgrid .show-detail').mouseover(function () {
                $(this).css({
                    color: "#1874ad",
                    cursor: "pointer"
                })
            }).mouseleave(function () {
                $(this).css({
                    color: "#000",
                    cursor: "pointer"
                })
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
    // 全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};// 请求数据
    var perObj = {
        id: 0,
        deptId: userDeptId,
        deptName: '',
        inspectionCarId: 0,
        driverId: 0,
        inspectionMoney: 0,
        inspectionTime: '',
        inspectionYear: '',
        inspectionNextTime: '',
        inspectionRemindTim: '',
        userId: '',
        moneyBefore: '',
        inspTimeBefore: '',
        carIdBrfore: '',
        inspectionPlace: ''
    };
    perObj['carNum'] = $('#carNum').val();
    var $dateFmt = "yyyy-MM-dd";
    timeControl($('#time1'), 'time1', $dateFmt);
    timeControl($('#time2'), 'time2', $dateFmt);
    timeControl($('#time3'), 'time3', $dateFmt);
    // getNextTime();
    var idsArr = [], namesArr = [];

    function findInspection() {
        $('#dgrid').datagrid('load');
    }

    // 点击查询图标
    $('.search-btn').click(function () {
        perObj['carNum'] = $('#carNum').val();
        applyListOpt.queryParams['carNum'] = perObj['carNum'];
        findInspection();
    });

    // 增加年检
    function addInspection(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/addInspection',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findInspection();
                    layer.msg(data.msg, {
                        time: 1000
                    });
                    layer.close(index);
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

    // 修改年检
    function modInspection(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/modInspection',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findInspection();
                    layer.msg(data.msg, {
                        time: 1000
                    });
                    layer.close(index);
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

    // 取得所有选中行数据
    function getSelections() {
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName)
        }
    }

    // 查找部门
    findDept($("#windowTree"));

    function findDept($dom) {
        formData = {};
        formData.deptId = perObj['deptId'];
        var cfg = {
            token: getCookie("token"),
            url: 'department/findDeptTree',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    nodes = [];
                    var result = data.data;
                    if (result.length > 0) {
                        nodes = [];
                        flag = 1;
                        for (var i = 0, l = result.length; i < l; i++) {
                            nodes.push({
                                "id": result[i].deptId,
                                "pId": result[i].pid,
                                "name": result[i].deptName
                            });
                        }
                    } else {
                        flag = 0;// 第一次添加
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

    // 单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("deptTree");
        perObj['deptId'] = treeNode.id;
        perObj['deptName'] = treeNode.name;
        $('.dept').val(perObj['deptName']);
        findCar_1(perObj['deptId']);
    };
    // 新增、修改按钮点击去掉红色边框
    removeValid();
});
