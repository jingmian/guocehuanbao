var ycyaMap;
$(function () {
    //表单验证
    var validationUp = $('#insertArea').validationUp({
        rules: {
            areaName: {
                notEmpty: true
            },
            areaSpeedNum: {
                mustBeNum: true
            },
            deptId: {
                notEmpty:true
            }
        },
        errorMsg: {
            areaName: {
                notEmpty: '区域名称不能为空'
            },
            areaSpeedNum: {
                mustBeNum: '超速阈值必须为数字'
            },
            deptId: {
                notEmpty:'请选择监管部门'
            }
        },
        submit: {
            submitBtn: $('#insertArea .yes'),
            validationEvent: 'blur change',
            errorMsgIcon: 'icon iconfont icon-cuowu1'
        }
    });

    var submit_obj = {};//提交数据
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

    // 部门单击
    function zTreeClick1(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree"), parentNode = treeNode
            .getParentNode();
        if (parentNode) {
            zTree.expandNode(treeNode);// 节点单击展开/收缩
        }
        submit_obj['deptId'] = treeNode.id;
        submit_obj['dept'] = treeNode.id;
//		diviObj['deptId'] = treeNode.id;
//         submit_obj['deptName'] = treeNode.name;
        $('#dept_input').val(treeNode.name);
        if (treeNode.name == "") {
            layer.msg('请选择部门', {time: 1000});
        }
//		$('#dept_id_input').val(treeNode.id);
    }

    $('#dept_input').click(function () {
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
        $('#dept-form-Tree .close').off('click');
        $('#dept-form-Tree .close').click(function () {
            layer.closeAll();
        });
        $('#dept-form-Tree .submit-btn').off('click');
        $('#dept-form-Tree .submit-btn').click(function () {
            layer.close(index1);
        });
    });

    // 查找部门
    function findDept($dom) {
        var deptObj = [];
        var formData_d = {};
        // formData_d.deptId = userDeptId;
        // formData_d.tree = '1';
        var cfg = {
            token: getCookie("token"),
            url: 'department/findDept',
            data: formData_d,
            success: function (data) {
                var result = data.data.deptInfo;
                if (result.length > 0) {
                    // flag=0;
                    for (var i = 0, l = result.length; i < l; i++) {
                        deptObj.push({
                            "id": result[i].deptId,
                            "pId": result[i].pId,
                            "name": result[i].deptName
                        });
                    }
                } else {
                    // flag=1;//第一次添加
                }
                $.fn.zTree.init($dom, setting, openNodes(deptObj));
            }
        };
        customAjax(cfg);
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

    $('#bz_input').click(function () {
        findFreeGroup($('#windowTree1'));
    });

    //班组
    var setting_bz = {
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
            onCheck: zTreeClick_bz
        }
    };

    function zTreeClick_bz(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree1"),
            parentNode = treeNode.getParentNode();
        if (parentNode) {
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes = zTree.getCheckedNodes(true);
        var idsArr = [], namesArr = [];
        if (mType == 'mod') {
            // idsArr.push(groupIds);
            // namesArr.push(groupNames);
        }
        for (var i in selectedNodes) {
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }

        submit_obj['groupIds'] = idsArr.join(',');
        $('#bz_input').val(namesArr.join(','));


    }

    //查询 班组
    function findFreeGroup() {
        var shiftObj = [];
        var formData_bz = {};
        // formData.userDeptId='1';
        formData_bz.userDeptId = userDeptId;
        formData_bz.pageSize = 1000;
        formData_bz.checkedTypeId=2;
        formData_bz.objectId =perObj['id'];
        // formData_bz.type=0;
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/findGroup',
            data: formData_bz,
            success: function (data) {
                $('#windowTree1').html('');
                var result = data.data.data;
                if (result.length > 0) {
                    // flag=0;
                    for (var i = 0, l = result.length; i < l; i++) {
                        shiftObj.push({"id": result[i].groupId, "pId": result[i].groupId, "name": result[i].groupName,'checked':result[i].checked});
                        $.fn.zTree.init($('#windowTree1'), setting_bz, openNodes(shiftObj));
                    }
                } else {
                    //  alert('请添加班组！');
                    $('#windowTree1').html('<li>暂无监管班组</li>');
                }

                var index1 = layer.open({
                    type: 1,
                    title: false,
                    area: "400px",
                    shade: 0,
                    closeBtn: 1,
                    content: $("#tree-group"),
                    move: $('#tree-group .form-top')
                });
                $('#tree-group .close').off('click');
                $('#tree-group .close').click(function () {
                    layer.closeAll();
                });
                $('#tree-group .submit-btn').off('click');
                $('#tree-group .submit-btn').click(function () {
                    layer.close(index1);
                });
            }
        };
        customAjax(cfg);

    }

    //-----------------------------车辆-----------------------

    $('#car_input').click(function () {
        findCarFreeGroup();
        var index1 = layer.open({
            type: 1,
            title: false,
            area: "400px",
            shade: 0,
            closeBtn: 1,
            content: $("#tree-car"),
            move: $('#tree-car .form-top')
        });
        $('#tree-car .close').off('click');
        $('#tree-car .close').click(function () {
            layer.closeAll();
        });
        $('#tree-car .submit-btn').off('click');
        $('#tree-car .submit-btn').click(function () {
            layer.close(index1);
        });
    })


    var setting_car = {
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
            onCheck: zTreeClick_car
        }
    };

    function zTreeClick_car(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree_car"),
            parentNode = treeNode.getParentNode();
        if (parentNode) {
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes = zTree.getCheckedNodes(true);
        var idsArr = [], namesArr = [];
        for (var i in selectedNodes) {
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }

        submit_obj['carIds'] = idsArr.join(',');
        $('#car_input').val(namesArr.join(','));
    }

    //查询车辆
    function findCarFreeGroup() {
        var shiftObj = [];
        var formData_car = {};
        formData_car.deptId = getCookie("deptId");
        formData_car.type = 0;
        formData_car.checkedTypeId=2;
        formData_car.objectId =perObj['id'];
        var cfg = {
            token: getCookie("token"),
            url: 'car/findCarTree',
            data: formData_car,
            success: function (data) {
                var result = data.data.carList;
                if (result.length > 0) {
                    // flag=0;
                    for (var i = 0, l = result.length; i < l; i++) {
                        shiftObj.push({"id": result[i].id, "pId": result[i].groupId, "name": result[i].carNum,'checked':result[i].checked});
                    }
                } else {
                    // alert('请添加班组！');
                }
                $.fn.zTree.init($('#windowTree_car'), setting_car, openNodes(shiftObj));
            }
        };
        customAjax(cfg);
    }

    //----------------------------------地图--------------------------
    ycyaMap = new YcyaMap('map');
    var ycyaMapStatus = 0;//0 not init,1 initing,2 done
    var arr = [], mType = '';
    var dgData = [];// 表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'), // 数据表格容器
        url: requestUrl + 'areaManage/findAreaInfo',//请求地址
        // 请求传递的参数
        queryParams: {
            dept: getCookie("deptId"),
            areaName: $("#area_name").val()
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        // 数据表格的显示字段
        columns: [[{
            field: 'ck',
            checkbox: true
        }, {
            field: 'id',
            hidden: true
        },{field: 'deptName', title: '所属部门', width: 150, align: 'left'}, {
            field: 'areaName',
            title: '区域名称',
            width: 150,
            align: 'center'
        }, {
            field: 'areaSpeedNum',
            title: '阈值(km/h)',
            width: 100,
            align: 'right'
        }, {
            field: 'areaType',
            title: '区域类型',
            width: 100,
            align: 'center',
            formatter: function (value, row, index) {
                if (value == 0) {
                    return '圆形';
                } else if (value == 1) {
                    return '矩形';
                } else {
                    return '自定义'
                }
            }
        }, {
            field: 'alertType',
            title: '报警类型',
            width: 100,
            align: 'center',
            formatter: function (value, row, index) {
                if (value == 0) {
                    return '驶入报警';
                } else {
                    return '驶出报警';
                }
            }
        },
            {field: 'superviseCarNames', title: '监管车辆', width: 150, align: 'center', formatter: function (value, row) {
                if(value==''||value==null){
                    return value='暂无车辆';
                }
                else{
                    return "<a href='javascript:;' style='color:#009aff'>查看详情</a>";
                }
            }},
            {field: 'groupName', title: '监管班组', width: 150, align: 'center',formatter: function (value, row) {
                if(value==''||value==null){
                    return value='暂无班组';
                }
                else{
                    return "<a href='javascript:;' style='color:#009aff'>查看详情</a>";
                }
            }},
            {
                field: 'areaRemark',
                title: '备注',
                width: 300,
                align: 'left'
            }]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnInsertArea",
            code:36,
            handler: function () {
                $(".takePoint").show();
                $('#btnTDraw').show();
                ycyaMap.clear();
                submit_obj = {};
                submit_obj['id'] = 0;
                submit_obj['geoms'] = "";
                submit_obj['dept'] = "";
                $('.insertAreaPopup').find('input,select').removeAttr('disabled').end().find('textarea').removeAttr('readonly');
                lx.initFormElm($('#insertArea'));

                $('#dgrid').datagrid('unselectAll');
                $('#insertArea .titleText').text('新增区域信息');
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "900px",
                    // shadeClose : true,
                    closeBtn: 1,
                    content: $("#insertArea"),
                    move: $('#insertArea .title'),
                    success: function () {
                        // arr.length=0;
                        // ycyaMap.clear();
                    }
                });
                $('#insertArea .no').click(function () {
                    layer.closeAll();
                });

                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit: {
                        doSubmitFn: function (formData) {
                            $('#insertArea .yes').click(function () {
                                addAreaInfo(index);
                                layer.closeAll();
                            });
                        }
                    }
                });

            }
        }, {
            text: '查看',
            id: "btnSelect",
            code:37,
            handler: function () {

                var row = lx.judge($('#dgrid'), '查看', 'id');
                if (!row) {
                    return;
                }
                formData = {};
                formData.id = row.id;
                $(".takePoint").hide();
                $('.insertAreaPopup').find('input,select').attr('disabled', 'disabled').end().find('textarea').attr('readonly', 'readonly');
                var cfg = {
                    token: getCookie("token"),
                    url: 'areaManage/findAreaInfoById',
                    data: formData,
                    success: function (data) {
                        submit_obj = {};
                        submit_obj['id'] = row.id;
                        //数据回显
                        var geoms = "";
                        var pointArr = [];
                        for (var p in data.geoms) {
                            var point = data.geoms[p];
                            pointArr.push(point.area_lon);
                            pointArr.push(point.area_lat);
                        }

                        var carNums = "";
                        var carId = "";
                        for (var c in data.car) {
                            var car = data.car[c];
                            carNums += car.car_num + ",";
                            carId += car.car_id + ",";
                        }
                        if (carNums.length > 0) {
                            carNums = carNums.substring(0, carNums.length - 1);
                            carId = carId.substring(0, carId.length - 1);
                        }
                        var bz = "";
                        var bzs = "";
                        for (var g in data.group) {
                            var group = data.group[g];
                            bz += group.group_name + ",";
                            bzs += group.group_id + ",";
                        }
                        if (bz.length > 0) {
                            bz = bz.substring(0, bz.length - 1);
                            bzs = bzs.substring(0, bzs.length - 1);
                        }


                        submit_obj['areaType'] = data.qy.area_type;
                        submit_obj['dept'] = data.qy.dept;
                        submit_obj['groupIds'] = bzs;
                        submit_obj['carIds'] = carId;
                        submit_obj.geoms = geoms;

                        $("#qy_name").val(data.qy.area_name);
                        $("#qy_lx").val(data.qy.area_type);
                        $("#area_speed_num").val(data.qy.area_speed_num);

                        $("#dept_input").val(data.qy.dept_name);
                        $("#bz_input").val(bz);

                        $("#alert_type").val(data.qy.alert_type);
                        $("#car_input").val(row.superviseCarNames);
                        $("#area_remark").val(data.qy.area_remark);
                        if(pointArr.length>0){
                            ycyaMap.tmp_createOverlay(pointArr, "line1");
                        }
                        $('#insertArea .titleText').text('查看区域信息');
                        var index = layer.open({
                            type: 1,
                            title: false,
                            area: "900px",
                            // shadeClose : true,
                            closeBtn: 1,
                            content: $("#insertArea"),
                            move: $('#insertArea .title'),
                            success: function () {
                                // ycyaMapStatus=1;
                                // $('.betaMap').css({'z-index':'-1'});
                                if (ycyaMapStatus == 0) {
                                    ycyaMapStatus = 1;
                                    ycyaMap = new YcyaMap('map');
                                    ycyaMap.ready(function () {
                                        ycyaMapStatus = 2;
                                        ycyaMap.clear();
                                    });
                                }
                                var mapLoadTimer = setInterval(function () {
                                    if (ycyaMapStatus == 2) {
                                        clearInterval(mapLoadTimer);
                                        if(pointArr.length>0){
                                            ycyaMap.tmp_createOverlay(pointArr, "line1");
                                        }
                                        ycyaMapStatus = 0;
                                    }
                                }, 100);
                            }

                        });
                        $('#insertArea .no').click(function () {
                            layer.close(index);
                        });
                        validationUp.destroyErrorMsg();
                        validationUp.setDoSubmitFn({
                            submit: {
                                doSubmitFn: function (formData) {
                                    $('#insertArea .yes').off('click');
                                    $('#insertArea .yes').click(function () {
                                        layer.closeAll();
                                    });
                                }
                            }
                        });
                    }
                };
                customAjax(cfg);
            }
        }, {
            text: '修改',
            id: "btnApudate",
            code:38,
            handler: function () {
                $(".takePoint").show();
                $('#btnTDraw').hide();
                var row = lx.judge($('#dgrid'), '修改', 'id');
                if (!row) {
                    return;
                }
                $('.insertAreaPopup').find('input,select').removeAttr('disabled').end().find('textarea').removeAttr('readonly');
                formData = {};
                formData.id = row.id;
                var cfg = {
                    token: getCookie("token"),
                    url: 'areaManage/findAreaInfoById',
                    data: formData,
                    success: function (data) {
                        submit_obj = {};
                        submit_obj['id'] = row.id;
                        //数据回显
                        var geoms = "";
                        var pointArr = [];
                        var geoms_ = "";
                        submit_obj.geoms += geoms;
                        for (var p in data.geoms) {
                            var point = data.geoms[p];
                            pointArr.push(point.area_lon);
                            pointArr.push(point.area_lat);
                            geoms_ += point.area_lon + "," + point.area_lat + ";";

                        }
                        submit_obj.geoms = geoms_;
                        var carNums = "";
                        var carId = "";
                        for (var c in data.car) {
                            var car = data.car[c];
                            carNums += car.car_num + ",";
                            carId += car.car_id + ",";
                        }
                        if (carNums.length > 0) {
                            carNums = carNums.substring(0, carNums.length - 1);
                            carId = carId.substring(0, carId.length - 1);
                        }
                        var bz = "";
                        var bzs = "";
                        for (var g in data.group) {
                            var group = data.group[g];
                            bz += group.group_name + ",";
                            bzs += group.group_id + ",";
                        }
                        if (bz.length > 0) {
                            bz = bz.substring(0, bz.length - 1);
                            bzs = bzs.substring(0, bzs.length - 1);
                        }


                        submit_obj['areaType'] = data.qy.area_type;
                        submit_obj['dept'] = data.qy.dept;
                        submit_obj['groupIds'] = bzs;
                        submit_obj['carIds'] = carId;


                        $("#qy_name").val(data.qy.area_name);
                        $("#qy_lx").val(data.qy.area_type);
                        $("#area_speed_num").val(data.qy.area_speed_num);

                        $("#dept_input").val(data.qy.dept_name);
                        $("#bz_input").val(bz);

                        $("#alert_type").val(data.qy.alert_type);
                        $("#car_input").val(carNums);
                        $("#area_remark").val(data.qy.area_remark);

                        $('#insertArea .titleText').text('修改区域信息');
                        var index = layer.open({
                            type: 1,
                            title: false,
                            area: "900px",
                            // shadeClose : true,
                            closeBtn: 1,
                            content: $("#insertArea"),
                            move: $('#insertArea .title'),
                            success: function () {
                                // ycyaMapStatus=1;
                                // $('.betaMap').css({'z-index':0});
                                if (ycyaMapStatus == 0) {
                                    ycyaMapStatus = 1;
                                    ycyaMap = new YcyaMap('map');
                                    ycyaMap.ready(function () {
                                        ycyaMapStatus = 2;
                                        ycyaMap.clear();
                                    });
                                }
                                var mapLoadTimer = setInterval(function () {
                                    if (ycyaMapStatus == 2) {
                                        clearInterval(mapLoadTimer);
                                        if(pointArr.length>0){
                                            ycyaMap.tmp_createOverlay(pointArr, "line1");
                                        }
                                        ycyaMapStatus = 0;
                                    }
                                }, 100);
                            }

                        });
                        $('#insertArea .no').click(function () {
                            layer.close(index);
                        });
                        validationUp.destroyErrorMsg();
                        validationUp.setDoSubmitFn({
                            submit: {
                                doSubmitFn: function () {
                                    $('#insertArea .yes').click(function () {
                                        modAreaInfo(index, formData.id);
                                    });
                                }
                            }
                        });

                    }
                };
                customAjax(cfg)
            }
        }, {
            text: '删除',
            id: "btnDelete",
            code:39,
            handler: function () {
                var row = lx.judge($('#dgrid'), '删除', 'id');
                if (!row) {
                    return;
                }
                if (row.length > 0) {
                    var rowIndex = $('#dgrid').datagrid('getRowIndex', row[row.length - 1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow', rowIndex);
                }
                getSelections();
                $('#dArea').text(namesArr.join(','));
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    // shadeClose : true,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')

                })
                $('#delete .no').click(function () {
                    layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    deleteAreaInfo();
                    layer.close(index);
                });
            }
        }],
        onClickCell:function (rowIndex, field, value) {
            if(value==''||value==null)return;
            var $field=$('#dgrid').datagrid('getColumnOption',field);
            if(field=='superviseCarNames'){
                $('#alarmRemark').text(value);
                getFieldDetail();
            }
            if(field=='groupName'){
                $('#alarmRemark').text(value);
                getFieldDetail();
            }
            function getFieldDetail() {
                $('#selectAll .titleText').text($field.title+'详情');
                $('#fileName').text($field.title+':');
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'500px',
                    content:$('#selectAll'),
                    move:$('#selectAll .title')
                }));
            }

        },
        onSelect: function (index, row) {
            perObj['id'] = row.id;
            getSelections();
        },
        onLoadError: function () {
            console.log('error');
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
    var formData = {}, // 请求数据;
        mType = '', // 请求方法类型;
        flag = 0;
    var $areaName = $('.ereaName'), $areaType = $('.areaType option:selected'), $areaBj = $('.bj'),
        $areaRemark = $('.ereaBz'), $dArea = $('#dArea');
    var perObj = {
        id: 0
    };
    var idsArr = [], namesArr = [];

    // 画图
    function drawingMarker(type) {
        ycyaMap.draw({
            "line": "line2",
            "flag": type
        }, overlaycomplete);
    }

    function overlaycomplete(e, overlay) {
        var arr = e.overlay.getPath();
        var geos = "";
        for (var i = 0; i < arr.length; i++) {
            var p = arr[i];
            geos += p.lng + "," + p.lat + ";";
        }
        submit_obj.geoms = geos;
    }

    var draw_type = "circle";
    var btn4 = document.getElementById("btnTDraw");
    btn4.addEventListener("click", function () {
        var qyLx = $("#qy_lx").val();
        draw_type = "circle";
        if (qyLx == 1) {
            draw_type = "rectangle";
        } else if (qyLx == 2) {
            draw_type = "polygon";
        }
        submit_obj['areaType'] = qyLx;
        drawingMarker(draw_type);
    });

    $("#btnTDescr").on("click", function () {
        var qyLx = $("#qy_lx").val();
        draw_type = "circle";
        if (qyLx == 1) {
            draw_type = "rectangle";
        } else if (qyLx == 2) {
            draw_type = "polygon";
        }
        submit_obj['areaType'] = qyLx;
        ycyaMap.clear();
        submit_obj['geoms'] = "";
        drawingMarker(draw_type);
    });

    $("#ss_btn").on("click", function () {
        findAreaInfo();
    });

    // 查询区域
//	findAreaInfo();
    function findAreaInfo() {
        $('#dgrid').datagrid('load', {
            dept: getCookie("deptId"),
            areaName: $("#area_name").val()

        });
    }

    // 添加区域
    function addAreaInfo(indexPop) {
        var flag = postFormData();
        if (!flag) {
            return;
        }
        var cfg = {
            token: getCookie("token"),
            url: 'areaManage/addAreaInfo',
            data: submit_obj,
            success: function (data) {
                layer.close(indexPop);
                layer.msg('区域添加成功', {time: 1000});
                findAreaInfo();
            }
        };
        customAjax(cfg);
    }

    // 修改区域
    function modAreaInfo(indexPop, id) {
        if (id == null) {
            return;
        }
        var flag = postFormData();
        if (!flag) {
            return;
        }
        submit_obj.id = id;
        var cfg = {
            token: getCookie("token"),
            url: 'areaManage/addAreaInfo',
            data: submit_obj,
            success: function (data) {
                if (data.code == 0) {
                    findAreaInfo(); // 再次查寻
                    layer.msg('区域修改成功!', {time: 1000});
                    layer.close(indexPop);
                }
            }
        };
        customAjax(cfg);
    }

    // 删除区域
    function deleteAreaInfo() {
        mType = 'del';
        // postFormData();
        formData = {};
        formData.id = perObj['id'];
        var cfg = {
            token: getCookie("token"),
            url: 'areaManage/deleteAreaInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findAreaInfo();
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

    // 封装传入数据方法
    function postFormData() {
        // submit_obj.areaName = $("#qy_name").val();
        submit_obj.areaName = $areaName.val();
        if (submit_obj.areaName == '') {
            // layer.msg('区域名称不能为空', {time: 1000});
            return false;
        }
        submit_obj.areaSpeedNum = $("#area_speed_num").val();
        if (submit_obj.areaSpeedNum != '' && isNaN(submit_obj.areaSpeedNum)) {
            layer.msg('超速阈值只能为数字', {time: 1000});
            return false;
        }

        if (submit_obj.areaSpeedNum == '') {
            submit_obj.areaSpeedNum = 0;
        }
        if (submit_obj.dept == '') {
            return false;
        }
        submit_obj.alertType = $("#alert_type").val();
        submit_obj.areaRemark = document.getElementById('area_remark').value;// 区域备注

        if (submit_obj['geoms'] == "") {
            layer.msg('未勾画区域', {time: 1000});
            return false;
        }


        if (submit_obj['dept'] == "") {
            // layer.msg('部门不能为空',{time:1000});
            // return false;
        }


        return true;
    }

    // 报警对象
    // bjObj();
    function bjObj() {
        $('.bj').on('focus', function () {
            var treeIndex = layer.open({
                title: false,
                closeBtn: 1,
                type: 1,
                shade: 0,
                area: '800px',
                content: $('#addPerson'),
                move: $('#addPerson .title'),
                success: function () {
                }
            });
            $('.eaea-form-btn .yes').off('click');
            $('.eaea-form-btn .yes').click(function () {
                layer.close(treeIndex);
            });
        })
    }

    // 输入框值改变
    function changeInput($dom) {
        $dom.change(function () {
            return $dom.val();
        })
    }

    // 取得所有选中行数据
    function getSelections() {
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].id);
            namesArr.push(rows[i].areaName)
        }
    }
    //地图取点
    var _autoComplete;
    ycyaMap.ready(function () {
        // ycyaMap.getLngAndLat('suggestId', 'searchResultPanel');
        // $('.tangram-suggestion-main').css({'z-index': 99999999});
        ycyaMap.getLngAndLat('suggestId', 'searchResultPanel');
        $('#suggestId').on('click',function () {
            $('.tangram-suggestion-main').css({'z-index': 99999999});
            // ycyaMap.getLngAndLat('suggestId', 'searchResultPanel');
            _autoComplete = ycyaMap.createAutoComplete('suggestId', 'searchResultPanel', setPlace);

        });
    });
    function setPlace() {
        ycyaMap.clear();    //清除地图上所有覆盖物
        var local = ycyaMap.localSearch(myFun, ycyaMap);
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            $('#searchResultPanel').attr('data-lng', pp.lng).attr('data-lat', pp.lat);
            ycyaMap.addPoint({type: 1, data: [{"lng": pp.lng, "lat": pp.lat, "id": 1}]});
            ycyaMap.toSetCenter(pp);
        }
        local.search($('#searchResultPanel').attr('data-value'));
    }
});
