$(function () {

    var ycyaMap = new YcyaMap('map');
    var ycyaMapStatus = 0;
    var arr = [], mType = '';
    //表单验证
    var validationUp = $('#insertArea').validationUp({
        rules: {
            routeName: {
                notEmpty: true
            },
            routeSpeedNum: {
                mustBeNum: true
            },
            routeStopLong: {
                mustBeNum: true
            },
            deptId: {
                notEmpty: true
            }
        },
        errorMsg: {
            routeName: {
                notEmpty: '路线名称不能为空'
            },
            routeSpeedNum: {
                mustBeNum: '超速阈值必须为数字'
            },
            routeStopLong: {
                mustBeNum: '停留时长必须为数字'
            },
            deptId: {
                notEmpty: '部门名称不能为空'
            }
        },
        submit: {
            submitBtn: $('#insertArea .yes'),
            validationEvent: 'blur change',
            errorMsgIcon: 'icon iconfont icon-cuowu1'
        }
    });
    var dgData = [];//表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'),
        url: requestUrl + 'routeManageService/findRouteInfo',
        queryParams: {
            deptId: getCookie("deptId"),
            routeName: $("#route_name").val()
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'id', hidden: true},
            {field: 'deptName', title: '所属部门', width: 150, align: 'left'},
            {field: 'routeName', title: '路线名称', width: 150, align: 'center'},
            {field: 'routeSpeedNum', title: '阈值(km/h)', width: 100, align: 'right'},
            {
                field: 'routeIsOff',
                title: '偏移报警',
                width: 100,
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) {
                        value = '否'
                    }
                    if (value == 1) {
                        value = '是'
                    }
                    return value;
                }
            },
            {field: 'routeStopLong', title: '停留时长(小时)', width: 100, align: 'right'},
            {
                field: 'carNames', title: '监管车辆', width: 150, align: 'center', formatter: function (value, row) {
                if(value==''||value==null){
                    return value='暂无车辆';
                }
                else{
                    return "<a href='javascript:;' style='color:#009aff'>查看详情</a>";
                }
            }
            }
        ]],
        buttons: [
            {
                text: '新增',
                id: "btnNewAdd",
                code:32,
                handler: function () {
                    lx.clearRows($('#dgrid'));

                    $('#insertArea .titleText').text('新增路线信息');
                    $('#btnTDraw').show();
                    $('#insertArea').find('[type="text"],textarea').each(function () {
                        $(this).val('');
                        if ($(this).attr('id') == 'deptId') {
                            $(this).removeAttr('data-id');
                        }
                    });
                    $("#insertArea .ereaName").val('');
                    $("#insertArea .routeSpeedNum").val('');
                    $("#insertArea .routeIsStop").val('');
                    $("#insertArea .routeIsOff").val('');
                    $("#insertArea .routeStopLong").val('');
                    $('#deptId').val('');
                    $('#car_input').val('');
                    $('#insertArea .ereaBz').val('');
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "900px",
                        closeBtn: 1,
                        content: $("#insertArea"),
                        move: $('#insertArea .title'),
                        success: function () {
                            arr.length = 0;
                            ycyaMap.clear();
                        }
                    });
                    $('#insertArea .no').click(function () {
                        layer.closeAll();
                    });

                    validationUp.destroyErrorMsg();
                    validationUp.setDoSubmitFn({
                        submit: {
                            doSubmitFn: function (formData) {
                                formData = {};
                                formData.routeName = $("#insertArea .ereaName").val();
                                formData.routeSpeedNum = $("#insertArea .routeSpeedNum").val();
                                formData.routeIsStop = $("#insertArea .routeIsStop").val();
                                formData.routeIsOff = $("#insertArea .routeIsOff").val();
                                formData.routeStopLong = $("#insertArea .routeStopLong").val();
                                formData.deptId = $('#deptId').attr('data-id');
                                formData.carIds = perObj['carId'];
                                formData.routeRemark = $('#insertArea .ereaBz').val();
                                if (arr.length == 0) {
                                    layer.msg('请绘制路线', {time: 1000});
                                    return;
                                } else {
                                    formData.routeSurround = JSON.stringify(arr);
                                }
                                addRouteInfo(formData, index);
                            }
                        }
                    });
                }
            },
            {
                text: '修改',
                id: "btnApudate",
                code:33,
                handler: function () {
                    $('#insertArea .titleText').text('修改路线信息');
                    $('#btnTDraw').hide();
                    var row = lx.judge($('#dgrid'), '修改', 'id');
                    if (!row) {
                        return;
                    }
                    //根据id查询 线路信息
                    var formData = {};
                    formData.objectId = row.id;
                    formData.type = 1;
                    $("#insertArea .ereaName").val(perObj['ereaName']);
                    $("#insertArea .routeSpeedNum").val(perObj['routeSpeedNum']);
                    $("#insertArea .routeIsStop").val(perObj['routeIsStop']);
                    $("#insertArea .routeIsOff").val(perObj['routeIsOff']);
                    $("#insertArea .routeStopLong").val(perObj['routeStopLong']);
                    $('#deptId').val(perObj['deptName']);
                    /* $('#group_input').val(perObj['groupNames']);*/
                    $('#car_input').val(perObj['carNames']);
                    $('#insertArea .ereaBz').val(perObj['ereaBz']);
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "900px",
                        // shadeClose:false,
                        closeBtn: 1,
                        content: $("#insertArea"),
                        move: $('#insertArea .title'),
                        success: function () {
                            var cfg = {
                                token: getCookie("token"),
                                url: 'routeManageService/findRoutOrAreaPoint',
                                data: formData,
                                success: function (data) {
                                    var points = data.data;
                                    if (data.data.length > 0) {
                                        $('#insertArea').find('[type="text"],textarea').each(function () {
                                            var dataClass = $(this).attr('data-class');
                                            if (dataClass == 'routeName') {
                                                $(this).val(row.routeName);
                                            } else if (dataClass == 'deptId') {
                                                $(this).val(row.deptName);
                                            } else if (dataClass == 'undefined' || dataClass == null) {
                                                return;
                                            } else {
                                                $(this).val(row.routeRemark);
                                            }
                                        });

                                        var arr_ = [];
                                        for (var j = 0; j < points.length; j++) {
                                            var p = points[j];
                                            var lat = p.lat;
                                            var lng = p.lon;
                                            arr_.push(lng);
                                            arr_.push(lat);
                                            var point = {};
                                            point.lon = lng;
                                            point.lat = lat;
                                            arr.push(point);
                                        }
                                        var route_data = {
                                            type: 1,
                                            data: arr_,
                                            "id": "route_info_",
                                            "icon": 'start',
                                            "start": "start",
                                            "end": "end",
                                            "line": "line1",
                                            "evt": null
                                        };

                                        ycyaMap.clear();
                                        // ycyaMapStatus=1;
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
                                                ycyaMap.route(route_data);
                                                ycyaMapStatus = 0;
                                            }
                                        }, 100);
                                    } else {
                                        ycyaMap.init(getCookie('lng'), getCookie('lat'))
                                    }

                                    $('#insertArea .no').click(function () {
                                        layer.closeAll();
                                    });

                                    validationUp.destroyErrorMsg();
                                    validationUp.setDoSubmitFn({
                                        submit: {
                                            doSubmitFn: function (formData) {
                                                formData = {};
                                                formData.deptId = $('#deptId').attr('data-id');
                                                formData.id = row.id;
                                                formData.routeName = $("#insertArea .ereaName").val();
                                                formData.routeSpeedNum = $("#insertArea .routeSpeedNum").val();
                                                formData.routeIsStop = $("#insertArea .routeIsStop").val();
                                                formData.routeIsOff = $("#insertArea .routeIsOff").val();
                                                formData.routeStopLong = $("#insertArea .routeStopLong").val();
                                                formData.carIds = perObj['carId'];
                                                formData.routeRemark = $('#insertArea .ereaBz').val();
                                                if (arr.length == 0) {
                                                    layer.msg('请绘制路线', {time: 1000});
                                                    return;
                                                } else {
                                                    formData.routeSurround = JSON.stringify(arr);
                                                }
                                                modRouteInfo(formData, index);
                                            }
                                        }
                                    });
                                }
                            };
                            customAjax(cfg);
                        }
                    });
                }
            },
            {
                text: '删除',
                id: "btnDelete",
                code:34,
                handler: function () {
                    getSelections();
                    $('#dPers').text(namesArr.join(','));
                    var row = lx.judge($('#dgrid'), '删除', 'id');
                    if (!row) {
                        return;
                    }
                    if (row.length > 0) {
                        var rowIndex = $('#dgrid').datagrid('getRowIndex', row[row.length - 1]);
                        $('#dgrid').datagrid('unselectAll');
                        $('#dgrid').datagrid('selectRow', rowIndex);
                    }
                    $('#dInfo').text(perObj['routeName']);
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "400px",
                        // shadeClose:false,
                        closeBtn: 1,
                        content: $("#delete"),
                        move: $('#delete> .title')
                    });
                    $('#delete .no').click(function () {
                        layer.closeAll();
                    });
                    $('#delete .yes').off('click');
                    $('#delete .yes').click(function () {
                        delRouteInfo();
                        layer.close(index);
                    });
                }
            }
        ],
        onSelect: function (index, row) {
            perObj['id'] = row.id;
            perObj['routeName'] = row.routeName;
            perObj['routeSpeedNum'] = row.routeSpeedNum;
            perObj['routeIsStop'] = row.routeIsStop;
            perObj['routeIsOff'] = row.routeIsOff;
            perObj['routeStopLong'] = row.routeStopLong;
            perObj['carNames'] = row.carNames;
            perObj['routeRemark'] = row.routeRemark;
            getSelections();
        },
        onClickCell:function (rowIndex, field, value) {
            if(value==''||value==null)return;
            var $field=$('#dgrid').datagrid('getColumnOption',field);
            if(field=='carNames'){
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
        onLoadError: function () {
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
    bindEvent();
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    var perObj = {
        id: 0,
        routeName: ''
    };
    var idsArr = [], namesArr = [];

    //地图
    function drawingMarker() {
        ycyaMap.draw({"line": "line2", "flag": "polyline"}, overlaycomplete);
    }

    function overlaycomplete(e, overlay) {
        arr = e.overlay.getPath();
        arr.map(function (val, ind, array) {
            array[ind] = {'lon': val['lng'], 'lat': val['lat']}
        });
    }

    //绑定事件
    function bindEvent() {
        $("#btnTDraw").on("click", function () {
            if (arr.length == 0) {
                drawingMarker();
            } else {
                layer.msg('已绘制路线,请重新绘制', {time: 1000})
            }
        });
        $("#btnTDescr").on("click", function () {
            if (arr.length > 0) {
                ycyaMap.clear();
                drawingMarker();
            }
        });

        $('#deptId').focus(function () {
            var f = $('#form-Tree');
            var treeIndex = layer.open(publicObj({
                kind: 'layer',
                area: '400px',
                content: f,
                shade: 0,
                move: f.find('.form-top'),
                success: function () {
                    lx.getDeptTree($('#windowTree'), treeClick);
                }
            }));
            $('#form-Tree .submit-btn').off();
            $('#form-Tree .submit-btn').click(function () {
                layer.close(treeIndex);
            });
        });
    }

    //查询路线
    //添加路线
    function addRouteInfo(jData, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'routeManageService/addRouteInfo',
            data: jData,
            success: function (data) {
                if (data.code == 0) {
                    layer.close(indexPop);
                    layer.msg('路线添加成功', {
                        time: 1000
                    });
                    findRouteInfo();
                } else {
                    layer.msg('添加失败', {time: 1000});
                    return;
                }

            }
        };
        customAjax(cfg);
    }

    //修改路线
    function modRouteInfo(jData, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'routeManageService/modRouteInfo',
            data: jData,
            success: function (data) {
                layer.close(indexPop);
                layer.msg('路线修改成功', {
                    time: 1000
                });
                findRouteInfo();
            }
        };
        customAjax(cfg);
    }

    //删除路线
    function delRouteInfo() {
        formData = {};
        formData.id = perObj['id'];
        var cfg = {
            token: getCookie("token"),
            url: 'routeManageService/delRouteInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRouteInfo();
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
    }//取得所有选中行数据
    function getSelections() {
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].id);
            namesArr.push(rows[i].routeName)
        }
    }

    /*部门树单击*/
    function treeClick(event, treeId, treeNode) {
        $('#deptId').val(treeNode.name).attr('data-id', treeNode.id);
        var elm = $('#deptId');
        if (elm.hasClass('validation-error')) {
            elm.removeClass('validation-error');
            elm.siblings('i').remove();
        }
    }

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

        }
        for (var i in selectedNodes) {
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }

        /*        perObj['groupId']=idsArr.join(',');
                $('#group_input').val(namesArr.join(','));*/


    }

    function findFreeGroup() {
        var shiftObj = [];
        var formData_bz = {};
        formData_bz.userDeptId = userDeptId;
        formData_bz.checkedTypeId=2;
        formData_bz.objectId =perObj['id'];
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
            }
        };
        customAjax(cfg);

    }

    $('#group_input').click(function () {
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
    });
    //绑定车辆
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
        if (mType == 'mod') {

        }
        for (var i in selectedNodes) {
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }

        perObj['carId'] = idsArr.join(',');
        $('#car_input').val(namesArr.join(','));
    }

    function findCarFreeGroup() {
        var shiftObj = [];
        var formData_car = {};
        formData_car.deptId = getCookie("deptId");
        formData_car.type = 0;
        formData_car.checkedTypeId=1;
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
    });

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
    //地图取点
    var _autoComplete;
    ycyaMap.ready(function () {
        // ycyaMap.getLngAndLat('suggestId', 'searchResultPanel');
        // $('.tangram-suggestion-main').css({'z-index': 99999999});

        ycyaMap.getLngAndLat('suggestId', 'searchResultPanel');
        $('#suggestId').on('keyup',function () {
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

function findRouteInfo() {
    $('#dgrid').datagrid('load', {
        deptId: getCookie("deptId"),
        routeName: $("#route_name").val()
    });
}
