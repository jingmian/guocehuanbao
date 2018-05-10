$(function () {
    var leftList = {
        1: '车辆类型',
        2: '设备类型',
        3: '费用类型',
        4: '请假类型',
        5: '报警类型',
        6: '人员分类'
    };
    var carIcon = {
            0: 'car-sd',  //扫地车
            1: 'car-ss',  //洒水车
            2: 'car-zx',  //自卸车
            3: 'car-gb',  //勾臂车
            4: 'car-xc',  //巡查车
            5: 'car-bb',  //摆臂车
            6: 'car-dd',  //电动车
            7: 'car-ys',  //压缩车
            8: 'car-zy',  //转运车
            9: 'car-fd', //翻斗车
            10: 'car-gc',  //工程车
            11: 'car-tlj'  //拖拉机
        },
        peoIcon = {
            0: 'peo-dl',    //道路保洁
            1: 'peo-js',    //驾驶员
            2: 'peo-xc',    //巡查人员
            3: 'peo-gce',   //公厕管理
            4: 'peo-jd',    //机动人员
            5: 'peo-gche',  //跟车人员
            6: 'peo-hd',    //河道清淤
            7: 'peo-sq',    //社区保洁
            8: 'peo-tm'     //填埋人员
        },
        devIcon = {
            0: 'dev-gc',    //公厕
            1: 'dev-zz',    //中转站
            2: 'dev-ym',    //掩埋场
            3: 'dev-lj',    //垃圾箱
            4: 'dev-gp'    //果皮箱
        };
    createNav();
    typeState=false;
    function showHide() {
        if (typeState == true) {
            $('#btnNewAdd,#btnApudate,#btnDelete').show();
        } else {
            $('#btnNewAdd,#btnApudate,#btnDelete').hide();
        }
    }

    /*左侧点击事件*/
    $('#leftNav i').click(function () {
        if ($(this).attr('class') == 'reason-select') {
            var iconArr = $('#leftNav i');
            var pArr = $('#leftNav p');
            $.each(iconArr, function (key, value) {
                $(this).attr('class', 'reason-select');
            });
            $.each(pArr, function (key, value) {
                $(this).removeClass('active');
            });
            $(this).attr('class', 'reason-selected').parent().addClass('active');
            var spanText = $(this).siblings('span').text();
            $('.list_title').text(spanText);
            switch (spanText) {
                case "车辆类型" :
                    listOpt.columns = [];
                    listOpt.columns = [[
                        {field: 'dictionaryName', title: '车辆名称', width: 100, align: 'left'},
                        {
                            field: 'onlineIco',
                            title: '在线图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + carIcon[row.typeId] + '-0"></span>';
                            }
                        },
                        {
                            field: 'offLimeIco',
                            title: '离线图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + carIcon[row.typeId] + '-2"></span>';
                            }
                        },
                        {
                            field: 'alarmIco',
                            title: '报警图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + carIcon[row.typeId] + '-1"></span>';
                            }
                        },
                        {
                            field: 'otherIco',
                            title: '其他图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + carIcon[row.typeId] + '-3"></span>';
                            }
                        },
                        {
                            field: 'isAllowEdite',
                            title: '备注',
                            width: 200,
                            align: 'center',
                            formatter: function (value, row, index) {
                                if (row.isAllowEdite != null && row.isAllowEdite == 0) {
                                    return '内置(不允许修改)';
                                } else {
                                    return '非内置(允许修改)';
                                }
                            }
                        }
                    ]];
                    listOpt.queryParams.dictionaryType = 'carType';
                    createDataGrid();
                    typeState = false;
                    showHide();
                    break;
                case "设备类型" :
                    listOpt.columns = [];
                    listOpt.columns = [[
                        {field: 'dictionaryName', title: '设备名称', width: 100, align: 'left'},
                        {
                            field: 'onlineIco',
                            title: '图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + devIcon[row.typeId] + '-0"></span>';
                            }
                        },
                        {
                            field: 'isAllowEdite',
                            title: '备注',
                            width: 200,
                            align: 'center',
                            formatter: function (value, row, index) {
                                if (row.isAllowEdite != null && row.isAllowEdite == 0) {
                                    return '内置(不允许修改)';
                                } else {
                                    return '非内置(允许修改)';
                                }
                            }
                        }
                    ]];
                    listOpt.queryParams.dictionaryType = 'facilitieType';
                    createDataGrid();
                    typeState = false;
                    showHide();
                    break;
                case "费用类型" :
                    listOpt.columns = [];
                    listOpt.columns = [[
                        {field: 'dictionaryName', title: '费用名称', width: 100, align: 'left'},
                        {
                            field: 'isAllowEdite',
                            title: '备注',
                            width: 200,
                            align: 'center',
                            formatter: function (value, row, index) {
                                if (row.isAllowEdite != null && row.isAllowEdite == 0) {
                                    return '内置(不允许修改)';
                                } else {
                                    return '非内置(允许修改)';
                                }
                            }
                        }
                    ]];
                    listOpt.queryParams.dictionaryType = 'costType';
                    createDataGrid();
                    typeState = false;
                    showHide();
                    /*queryDataDictionary();*/
                    break;
                case "请假类型" :
                    listOpt.columns = [];
                    listOpt.columns = [[
                        {field: 'dictionaryName', title: '请假名称', width: 100, align: 'left'},
                        {
                            field: 'isAllowEdite',
                            title: '备注',
                            width: 200,
                            align: 'center',
                            formatter: function (value, row, index) {
                                if (row.isAllowEdite != null && row.isAllowEdite == 0) {
                                    return '内置(不允许修改)';
                                } else {
                                    return '非内置(允许修改)';
                                }
                            }
                        }
                    ]];
                    listOpt.queryParams.dictionaryType = 'leaveType';
                    createDataGrid();
                    typeState = true;
                    showHide();
                    /*formData.dictionaryType = 'leaveType';
                    queryDataDictionary();*/
                    break;
                case "报警类型" :
                    listOpt.columns = [];
                    listOpt.columns = [[
                        {field: 'dictionaryName', title: '报警名称', width: 100, align: 'left'},
                        {
                            field: 'isAllowEdite',
                            title: '备注',
                            width: 200,
                            align: 'center',
                            formatter: function (value, row, index) {
                                if (row.isAllowEdite != null && row.isAllowEdite == 0) {
                                    return '内置(不允许修改)';
                                } else {
                                    return '非内置(允许修改)';
                                }
                            }
                        }
                    ]];
                    listOpt.queryParams.dictionaryType = 'alarmType';
                    createDataGrid();
                    typeState = true;
                    showHide();
                    /*  formData.dictionaryType = 'alarmType';
                     queryDataDictionary();*/
                    break;
                case "人员分类" :
                    listOpt.columns = [];
                    listOpt.columns = [[
                        {field: 'dictionaryName', title: '人员名称', width: 100, align: 'left'},
                        {
                            field: 'onlineIco',
                            title: '在线图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + peoIcon[row.typeId] + '-0"></span>';
                            }
                        },
                        {
                            field: 'offLimeIco',
                            title: '离线图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + peoIcon[row.typeId] + '-1"></span>';
                            }
                        },
                        {
                            field: 'alarmIco',
                            title: '报警图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + peoIcon[row.typeId] + '-2"></span>';
                            }
                        },
                        {
                            field: 'otherIco',
                            title: '其他图标',
                            width: 100,
                            align: 'center',
                            formatter: function (val, row) {
                                return '<span class="' + peoIcon[row.typeId] + '-3"></span>';
                            }
                        },
                        {
                            field: 'isAllowEdite',
                            title: '备注',
                            width: 200,
                            align: 'center',
                            formatter: function (value, row, index) {
                                if (row.isAllowEdite != null && row.isAllowEdite == 0) {
                                    return '内置(不允许修改)';
                                } else {
                                    return '非内置(允许修改)';
                                }
                            }
                        }
                    ]];
                    listOpt.queryParams.dictionaryType = 'personType';
                    createDataGrid();
                    typeState = false;
                    showHide();
                    /*queryDataDictionary();*/
                    break;
            }
        } else {
            $(this).attr('class', 'reason-select').parent().removeClass('active');
        }
    });
    $('.dictTypeName').click(function () {
        $(this).siblings('i').trigger('click')
    });
    var perOjb = {};
    var idsArr = [], namesArr = [];
    var listOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + "datadictionary/queryDataDictionary",  //请求地址
        queryParams: {
            dictionaryType: 'carType',
            tables: 'tables',
        },
        fitColumns: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            code:'217',
            handler: function () {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('新增字典信息');
                $('#dictionaryName').val('');
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),

                });
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    if (validMustField()) {
                        formData.dictionaryName = $('#dictionaryName').val();
                        formData.dictionaryType =listOpt.queryParams.dictionaryType;
                        addDataDictionary();
                        layer.close(index);
                    }
                });
            }
        }, {
            text: '修改',
            id: "btnApudate",
            code:'218',
            handler: function () {
                var row = $('#dgrid').datagrid('getSelections');
                if (row.length == 0) {
                    layer.msg('请选择要修改的字典信息', {time: 1000});
                    return;
                }
                if (row.length > 0) {
                    var rowIndex = $('#dgrid').datagrid('getRowIndex', row[row.length - 1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow', rowIndex);
                }
                if (perOjb['isAllowEdite'] == 0) {
                    layer.msg('内置信息不能修改', {timer: 1000});
                    return false;
                }
                $('#addNew .titleText').text('修改字典信息');
                $('#dictionaryName').val(perOjb['dictionaryName']);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),

                });
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    if (validMustField()) {
                        formData.id = perOjb['id'];
                        formData.typeId = perOjb['typeId'];
                        formData.dictionaryType = perOjb['dictionaryType'];
                        formData.pid = perOjb['pid'];
                        formData.dictionaryName = $('#dictionaryName').val();
                        modDataDictionary();
                        layer.close(index);
                    }
                });
            }
        }, {
            text: '删除',
            id: "btnDelete",
            code:'219',
            handler: function () {
                var row = $('#dgrid').datagrid('getSelections');
                if (row.length == 0) {
                    layer.msg('请选择要删除的字典信息', {time: 1000});
                    return;
                }
                if (row.length > 0) {
                    getSelections();
                }
                if (perOjb['isAllowEdite'] == 0) {
                    layer.msg('内置信息不能删除', {timer: 1000});
                    return false;
                }
                $('#dInfo').text(namesArr.join(','));
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title'),

                });
                $('#delete .no').click(function () {
                    layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    formData.id = idsArr.join(',');
                    deleteDataDictionary();
                    layer.close(index);
                });
            }
        }
        ],
        onSelect: function (index, row) {
            perOjb['id'] = row.id;
            perOjb['dictionaryName'] = row.dictionaryName;
            perOjb['isAllowEdite'] = row.isAllowEdite;
            perOjb['dictionaryName'] = row.dictionaryName;
            perOjb['dictionaryType'] = row.dictionaryType;
            perOjb['typeId'] = row.typeId;
            perOjb['pid'] = row.pid;
            getSelections();
        },
        onLoadSuccess: function () {
            $('.datagrid-btable .datagrid-cell').css({
                'overflow': 'visible'
            })
        }
    };
    //数据表格的显示字段
    /*功能函数*/
    function createDataGrid(dataArr) {
        datagridFn(listOpt);
        /* //全选按钮
         $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");*/
    }

    //左侧字典导航栏
    function createNav() {
        var str = '';
        for (var key  in leftList) {
            str += '<p><i class="reason-select"></i><span class="dictTypeName">' + leftList[key] + '<span></p>';
        }
        $('#leftNav').html(str);
        $('#leftNav p').eq(0).addClass('active').find('i').attr({class: 'reason-selected'});
    }

    var formData = {}, mType = '';//传入数据
    var searchFirst = 0;
    if (searchFirst == 0) {
        listOpt.columns = [];
        listOpt.columns = [[
            {field: 'dictionaryName', title: '车辆名称', width: 100, align: 'left'},
            {
                field: 'onlineIco', title: '在线图标', width: 100, align: 'center', formatter: function (val, row) {
                return '<span class="' + carIcon[row.typeId] + '-0"></span>';
            }
            },
            {
                field: 'offLimeIco', title: '离线图标', width: 100, align: 'center', formatter: function (val, row) {
                return '<span class="' + carIcon[row.typeId] + '-2"></span>';
            }
            },
            {
                field: 'alarmIco', title: '报警图标', width: 100, align: 'center', formatter: function (val, row) {
                return '<span class="' + carIcon[row.typeId] + '-1"></span>';
            }
            },
            {
                field: 'otherIco', title: '其他图标', width: 100, align: 'center', formatter: function (val, row) {
                return '<span class="' + carIcon[row.typeId] + '-3"></span>';
            }
            },
            {
                field: 'isAllowEdite',
                title: '备注',
                width: 200,
                align: 'center',
                formatter: function (value, row, index) {
                    if (row.isAllowEdite != null && row.isAllowEdite == 0) {
                        return '内置(不允许修改)';
                    } else {
                        return '非内置(允许修改)';
                    }
                }
            }
        ]];
        createDataGrid();
        typeState = false;
        showHide();
    }

    // queryDataDictionary();
    function queryDataDictionary() {
        $('#dgrid').datagrid('load');
    }

    //新增字典
    function addDataDictionary() {
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/addDataDictionary',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.rows;
                    queryDataDictionary();
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

    //修改字典
    function modDataDictionary() {
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/modDataDictionary',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.rows;
                    queryDataDictionary();
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

    //删除字典
    function deleteDataDictionary() {
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/deleteDataDictionary',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.rows;
                    queryDataDictionary();
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
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].id);
            namesArr.push(rows[i].dictionaryName)
        }
    }
});
