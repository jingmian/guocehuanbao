/*
2017/12/25 图片上传功能的实现
by 陆旋
*/
$(function () {
    //图片
    var fileType = ['jpg', 'png', 'gif'];
    var input = $('.input-group').find('input[type="file"]');
    var fd = new FormData(),
        xhr;
    $.each(input, function (ind) {
        var _this = this;
        $(input[ind]).change(function (e) {
            //获取file对象
            var f = $(this).prop('files');
            //值验证
            if (!input[ind].value) {
                return;
            }
            //文件后缀名验证
            var extension = f[0].name.split('.')[1];
            if ($.inArray(extension, fileType) == -1) {
                layer.msg('该类型文件不能上传!');
                return;
            }
            //文件大小验证
            if (f[0].size > 2 * 1024 * 1024) {
                layer.msg('请上传小于2M的文件');
                return;
            }
            switch (ind) {
                case 0:
                    fd.append('file', f[0]);
                    sendPic(fd, _this, $('.pic-list').find('li').eq(0));
                    break;
            }
        });
    });
    //选择图片
    $('.pic-list .choose-pic').click(function () {
        $('#' + $(this).attr('data-name')).trigger('click');
    });
    $('.pic-list .shade').click(function () {
        $('#' + $(this).attr('data-name')).trigger('click');
    });


    //表单验证
    var validationUp = $('#addNew').validationUp({
        rules: {
            carNum: {
                notEmpty: true
            },
            carVolume: {
                notEmpty: true
            },
            inspeLastTime: {
                notEmpty: true
            },
            inspeNextTime: {
                notEmpty: true
            },
            mainLastTime: {
                notEmpty: true
            }
        },
        errorMsg: {
            carNum: {
                notEmpty: '车牌号不能为空'
            },
            carVolume: {
                notEmpty: '油箱容积不能为空'
            },
            inspeLastTime: {
                notEmpty: '上次年检时间不能为空'
            },
            inspeNextTime: {
                notEmpty: '下次年检时间不能为空'
            },
            mainLastTime: {
                notEmpty: '上次保养时间不能为空'
            }
        },
        submit: {
            submitBtn: $('#addNew .yes'),
            validationEvent: 'blur change',
            errorMsgIcon: 'icon iconfont icon-cuowu1'
        }
    });
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
    var nodes = [];
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'car/findCar',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            carNum: '',
            ids: userDeptId
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'ck',field1: 'ck', checkbox: true},
            // {field: 'carId',field1: 'carId', hidden: true},
            {field: 'deptName',field1: 'deptId', title: '所属部门', width: 150, align: 'left'},
            {
                field: 'carNum',field1: 'carNum', title: '车牌号', width: 150, align: 'center', formatter: function (value, row, index) {
                return '<span class="show-detail">' + value + '</span>'
            }
            },
            {
                field: 'equipmentNum',
                field1: 'equipmentNum',
                title: '设备卡号',
                width: 120,
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == '') {
                        return '暂未绑定设备';
                    } else {
                        return value;
                    }
                }
            },
            {
                field: 'onState',field1: 'onState', title: '设备状态', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value == 1) {
                    return '在线';
                } else {
                    return '离线';
                }
            }
            },
            {field: 'carType',field1: 'carType', title: '车型', width: 100, align: 'center'},
            {field: 'carBrand',field1: 'carBrand', title: '品牌', width: 100, align: 'center'},
            // {field:'idCard',title:'图片',width:200,align:'center'},
            {field: 'buyTime',field1: 'buyTime', title: '购买时间', width: 120},
            {field: 'buyMoney',field1: 'buyMoney', title: '购买费用(元)', width: 100, align: 'right'},
            {field: 'carVolume',field1: 'carVolume', title: '油箱容积(L)', width: 120, align: 'right'},
            {field: 'carCode',field1: 'carCode', title: '车架号', width: 150, align: 'center'},
            {field: 'motorModel',field1: 'motorModel', title: '发动机号', width: 100, align: 'center'},
            {
                field: 'carPic',field1: 'carPic', title: '车辆图片', width: 150, align: 'center', formatter: function (value, row, index) {
                if (value != '0' && value.trim() != '') {
                    return '<span class="preview-picture" style="color:#0C7FE9;cursor:pointer;" data-id="' + value + '">预览</span>';
                } else {
                    return '暂无图片';
                }
            }
            },
        ]],
        singleSelect: false,
        collapsible: true,
        SelectonSelect: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [
            {
                text: '新增',
                id: "btnNewAdd",
                code:83,
                handler: function () {
                    $('#addNew .titleText').text('新增车辆信息');
                    lx.clearRows(); //取消选中行
                    lx.initFormElm($('#addNew')); //初始化表单元素
                    carType_insProvider();
                    //图片初始化
                    var picParent = $('.pic-list li');
                    if (picParent.find('img').length > 0) {
                        picParent.find('img').remove();
                    }
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "650px",
                        shadeClose: false,
                        closeBtn: 1,
                        content: $("#addNew"),
                        move: $('#addNew .title'),
                        success: function () {
                            //图片以及input初始化
                            $.each($('.input-group [type="file"]'), function () {
                                $(this).val('');
                                if ($(this).attr('data-uuid')) {
                                    $(this).removeAttr('data-uuid');
                                }
                            });
                            $.each($('.pic-list img'), function () {
                                $(this).remove();
                            });
                            $.each($('.pic-list a'), function () {
                                $(this).css('display', 'inline-block')
                            });
                            $.each($('.pic-list span'), function () {
                                $(this).css('display', 'none')
                            });
                        }
                    });
                    $('#addNew .no').click(function () {
                        layer.close(index);
                    });
                    validationUp.destroyErrorMsg();
                    validationUp.setDoSubmitFn({
                        submit: {
                            doSubmitFn: function (formData) {
                                formData.carDeptId = perObj.deptId;
                                $.each(input, function (ind) {
                                    if ($(this).attr('data-uuid')) {
                                        formData['carPic'] = $(this).attr('data-uuid')
                                    }
                                });
                                addCar(formData, index);
                            }
                        }
                    });
                }
            },
            {
                text: '矫正',
                id: "btnCorrect",
                code:84,
                handler: function () {
                    var row = lx.judge($('#dgrid'), '矫正', 'carId');
                    if (!row) {
                        return;
                    }
                    $('#correct .titleText').text(row.carNum);
                    var jsonData = {};
                    jsonData.type = 0;
                    jsonData.carId = row.carId;
                    /*   findOilPropor();
                       initInterval();*/
                    tankCorrect(jsonData, initInterval);
                    $('#startOil').val('');
                    $('#endOil').val('');
                    $('#fuelOil').val('');
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "500px",
                        shadeClose: false,
                        closeBtn: 1,
                        content: $("#correct"),
                        move: $('#correct .title')

                    });
                    $('.layui-layer-setwin .layui-layer-close').click(function () {
                        jsonData.type = 2;
                        tankCorrect(jsonData, closeInterval);
                    });
                    $('#correct .no').click(function () {
                        jsonData.type = 2;
                        tankCorrect(jsonData, closeInterval);
                        layer.closeAll();
                    });
                    $('#correct .yes').off('click');
                    $('#correct .yes').click(function () {
                        jsonData.type = 1;
                        tankCorrect(jsonData, closeInterval);
                        formData = {};
                        formData.carId = perObj['carId'];
                        formData.startPropor = $('#startOil').val();
                        formData.endPropor = $('#endOil').val();
                        formData.oil = $('#fuelOil').val();
                        checkVolume();
                        layer.close(index);
                        findCar1();
                    });
                }
            },
            {
                text: '修改',
                id: "btnApudate",
                code:85,
                handler: function () {
                    var row = lx.judge($('#dgrid'), '修改', 'carId');
                    if (!row) {
                        return;
                    }
                    //carId 查询车辆
                    lx.searchRecordById('car/findCar', 'carId', row.carId, perObj['deptId'], function (data) {
                        var rowDetail = data.data.data[0];
                        lx.paddingFormElm($('#addNew'), rowDetail);
                        carType_insProvider(paddingSelect, rowDetail);
                        if (rowDetail.carPic != '') {
                            var picParent = $('.pic-list li');
                            if (picParent.find('img').length > 0) {
                                picParent.find('img').remove();
                            }
                            picParent.find('a').css('display', 'none');
                            picParent.find('span').css('display', 'inline-block');
                            var img = $('<img>');
                            img.attr('src', requestUrl + 'file/view?id=' + rowDetail.carPic);
                            picParent.append(img);
                        }
                        input.attr('data-uuid', rowDetail.carPic);
                    });

                    function paddingSelect(rowDetail) {
                        $('#addNew .seatNum').val(rowDetail.seatNum);
                        $('#addNew .insuranceLong').val(rowDetail.insuranceLong);
                        $('#addNew .mainRemMonth').val(rowDetail.mainRemMonth);
                        $('#addNew .mainRemMileage').val(rowDetail.mainRemMileage);
                    }

                    $('#addNew .titleText').text('修改车辆信息');
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "650px",
                        // shadeClose:false,
                        closeBtn: 1,
                        content: $("#addNew"),
                        move: $('#addNew .title')
                    });
                    $('#addNew .no').click(function () {
                        layer.closeAll();
                    });
                    validationUp.destroyErrorMsg();
                    validationUp.setDoSubmitFn({
                        submit: {
                            doSubmitFn: function (formData) {
                                formData.carId = perObj['carId'];
                                formData.carDeptId = perObj['deptId'];
                                $.each(input, function (ind) {
                                    if ($(this).attr('data-uuid')) {
                                        formData['carPic'] = $(this).attr('data-uuid')
                                    }
                                });
                                modCar(formData, index);
                            }
                        }
                    });
                }
            },
            {
                text: '查看',
                id: "btnSelect",
                code:86,
                handler: function () {
                    var row = lx.judge($('#dgrid'), '查看', 'carId');
                    if (!row) {
                        return;
                    }

                    $('#selectAll .titleText').text('查看车辆信息');
                    $('#selectAll .deptName').text(perObj['deptName']);
                    $('#selectAll .carNum').text(perObj['carNum']);
                    $('#selectAll .carType').text(perObj['carType']);
                    $('#selectAll .carBrand').text(perObj['carBrand']);
                    $('#selectAll .carCode').text(perObj['carCode']);
                    $('#selectAll .motorModel').text(perObj['motorModel']);
                    $('#selectAll .dept').text(perObj['deptName']);
                    $('#selectAll .onState').text(perObj['onState']);
                    $('#selectAll .equipmentNum').text(perObj['equipmentNum']);
                    $('#selectAll .buyTime').text(perObj['buyTime']);
                    $('#selectAll .buyMoney').text(perObj['buyMoney']);
                    $('#selectAll .carProvider').text(perObj['carProvider']);
                    $('#selectAll .insuranceTime').text(perObj['insuranceTime']);
                    $('#selectAll .insuranceLong').text(perObj['insuranceLong']);
                    $('#selectAll .inspeLastTime').text(perObj['inspeLastTime']);
                    $('#selectAll .mainLastTime').text(perObj['mainLastTime']);
                    $('#selectAll .mainRemMonth').text(perObj['mainRemMonth']);
                    $('#selectAll .mainRemMileage').text(perObj['mainRemMileage']);
                    $('#selectAll .carVolume').text(perObj['carVolume']);
                    $('#selectAll .seatNum').text(perObj['seatNum']);

                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "644px",
                        closeBtn: 1,
                        content: $("#selectAll"),
                        move: $('#selectAll .title'),
                        success:function () {
                            //获取图片
                            var totalPic;
                            if(row.carPic.indexOf(',')==-1){
                                totalPic=[row.carPic];
                            }else{
                                totalPic=row.carPic.split(',');
                            }
                            var html='';
                            if(totalPic.length>0) {
                                for (var i = 0; i < totalPic.length; i++) {
                                    html += '<li><img src=" ' + requestUrl + 'file/view?id=' + totalPic[i] + '" data-picId="' + totalPic[i] + '"></li>';
                                }
                                $('.sIIImg ul').html(html);

                                $('.sIIImg ul').find('img').click(function () {
                                    var selfId = $(this).attr('data-picId');
                                    $('#peelInfo img').attr('src', '').attr('src', requestUrl + 'file/view?id=' + selfId);
                                    layer.open(publicObj({
                                        kind: 'layer',
                                        area: '500px',
                                        content: $('#peelInfo'),
                                        move: $('#peelInfo .title'),
                                        shade: 0
                                    }));
                                })
                            }
                        }
                    });
                    $('#selectAll .yes').off('click');
                    $('#selectAll .yes').click(function () {
                        layer.close(index);
                    });
                }
            },
            {
                text: '删除',
                id: "btnDelete",
                code:87,
                handler: function () {
                    var row = lx.judge($('#dgrid'), '删除', 'carId');
                    if (!row) {
                        return;
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
                        var deleteId = '';
                        if (row.length == 1) {
                            deleteId += row[0].carId;
                            delCar(deleteId, index);
                        } else {
                            for (var i = 0; i < row.length; i++) {
                                deleteId += row[i].carId + ',';
                            }
                            delCar(deleteId.slice(0, -1), index);
                        }
                    });
                }
            },
            {
                text: '导出',
                id: "refreshBtn",
                code:80,
                handler: function () {
                	exFun();
                    $(this).blur();
                }
            }
            ,{
                text: '导入',
                id: "btnImport",
                handler: function () {
                    layer.open({
                        type: 1,
                        title: false,
                        area: "500px",
                        closeBtn: 1,
                        content: $("#import"),
                        move: $('#import .title')
                    })
                }
            },
            {
                text: '导出',
                id: "btnExport",
                // iconCls: 'icon iconfont icon-daochu',
                handler: function () {
                    var index = layer.open(publicObj({
                        kind: 'layer',
                        area: '500px',
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
            }
        ],
        onSelect: function (index, row) {
            // perObj['ids'] = row.ids;
            perObj['deptName'] = row.deptName;
            perObj['carNum'] = row.carNum;
            perObj['carId'] = row.carId;
            /* perObj['carType'] = row.carType;*/
            perObj['carBrand'] = row.carBrand;
            perObj['deptName'] = row.deptName;
            var onState = row.onState;
            if (onState == 1) {
                perObj['onState'] = '在线';
            } else {
                perObj['onState'] = '离线';
            }
            perObj['carType'] = row.carType;
            perObj['carCode'] = row.carCode;
            perObj['motorModel'] = row.motorModel;
            perObj['dept'] = row.deptName;
            perObj['deptName'] = row.deptName;
            perObj['equipmentNum'] = row.equipmentNum;
            perObj['buyTime'] = row.buyTime;
            perObj['buyMoney'] = row.buyMoney;
            perObj['insuranceTime'] = row.insuranceTime;
            perObj['insuranceLong'] = row.insuranceLong;
            perObj['inspeLastTime'] = row.inspeLastTime;
            perObj['mainLastTime'] = row.mainLastTime;
            perObj['mainRemMonth'] = row.mainRemMonth;
            perObj['mainRemMileage'] = row.mainRemMileage;
            perObj['carVolume'] = row.carVolume;
            perObj['seatNum'] = row.seatNum;
            perObj['carProvider'] = row.carProvider;
            perObj['deptId']= row.carDeptId;
            if (row.carPic != '' && row.carPic.trim() != '') {
                var picParent = $('#addNew .pic-list li,#selectAll .pic-list li');
                if (picParent.find('img').length > 0) {
                    picParent.find('img').remove();
                }
                picParent.find('a').css('display', 'none');
                picParent.find('span').css('display', 'inline-block');
                var img = $('<img>');
                img.attr('src', requestUrl + 'file/view?id=' + row.carPic);
                picParent.append(img);
            }
            input.attr('data-uuid', row.carPic);
            getSelections();
        },
        onLoadSuccess: function () {
            $('.dgrid .preview-picture').click(function () {
                var picArr;
                if ($(this).attr('data-id').indexOf(',') == -1) {
                    picArr = [$(this).attr('data-id')]
                } else {
                    picArr = $(this).attr('data-id').split(',');
                }
                var html = '';
                for (var j = 0; j < picArr.length; j++) {
                    html += '<img src=" ' + requestUrl + '/file/view?id=' + picArr[j] + '" data-picId="' + picArr[j] + '">';
                }
                $('#carViewInfo .peelInfoPopup').find('li').html(html);
                layer.open(publicObj({
                    kind: 'layer',
                    area: '600px',
                    content: $('#carViewInfo'),
                    move: $('#previewInfo .title'),
                    shadeClose: false,
                    closeBtn: 1,
                    success: function () {

                    }
                }));
            })
        }

    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    var perObj = {
        ids: userDeptId,
        deptName: '',
        carNum: '',
        carId: 0,
        carType: 0,
        deptId: userDeptId
    };
    var $dateFmt = "yyyy-MM-dd";
    timeControl($('#time1'), 'time1', $dateFmt);
    timeControl($('#time2'), 'time2', $dateFmt);
    timeControl($('#time3'), 'time3', $dateFmt);
    timeControl($('#time4'), 'time4', $dateFmt);
    timeControl($('#time5'), 'time5', $dateFmt);
    var timer, timer1, oil;//定时器
    var idsArr = [];

    /*---------------------------------------功能函数------------------------------------------*/

    //发送图片
    function sendPic(picData, inputElm, imgParentElm) {
        if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        }
        xhr.open('post', requestUrl + 'file/up', true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
        xhr.onreadystatechange = function () {
            if (xhr.status == 200) {
                if (xhr.readyState == 4) {
                    var a = xhr.responseText;

                    function call(res) {
                        var res = $.parseJSON(res);
                        $(inputElm).attr('data-uuid', res.data[0].uuid);
                        //对应的a标签
                        var elm;
                        $.each($('.pic-list a'), function () {
                            if ($(this).attr('data-name') == $(inputElm).attr('id')) {
                                elm = $(this);
                            }
                        });
                        elm.css('display', 'none').siblings('span').css('display', 'inline-block');

                        var pElm = imgParentElm;
                        if (pElm.find('img').length > 0) {
                            pElm.find('img').remove();
                        }
                        var img = $('<img>');
                        img.attr('src', requestUrl + 'file/view/?id=' + res.data[0].uuid);
                        pElm.append(img);

                        /* dirverView({
                             url:'file/view',
                             data:{
                                 id:res.data[0].uuid
                             },
                             Dom:elm.parent()
                         });*/

                    }

                    call(a);
                }
            } else {
                layer.msg('上传失败', {time: 1000})
            }
            //初始化对象，防止重复添加
            fd = new FormData();
        };
        xhr.send(picData);
    }

    //查询车辆
    function findCar1() {
        applyListOpt.queryParams['ids'] = perObj['deptId'];
        $('#dgrid').datagrid('reload');
    }

    //点击查询图标
    $('.search-btn').click(function () {
        perObj['carNum'] = $('#carNum').val();
        applyListOpt.queryParams['carNum'] = perObj['carNum'];
        findCar1();
    });
    //上次年检
    /*$('#time3').blur(function () {
        var val=$(this).val();
        var str1=parseInt(val.slice(0,4));
        var str2=parseInt(val.slice(5,7));
        var str3=parseInt(val.slice(8,10));
        var $time4=$('#time4');
        var time4=(str1+1)+'-'+str2+'-'+str3;
        if(val!==''){
            $time4.removeAttr('disabled');
            $time4.val(time4);
            WdatePicker({el:'time4',minDate:time4,dateFmt:$dateFmt});
        }else{
            $time4.attr('disabled','disabled');
            $time4.val('');
        }
    });*/
    //导出
    function exFun() {
        layer.open({
            type: 1,
            title: '车辆信息-导出',
            //area: ['420px'], //宽高
            //content: '',
            btn: ['导出当前', '导出全部'],
            yes: function () {
            	var dataOpt=$('#dgrid').datagrid('options');
            	console.log(dataOpt);
            	applyListOpt.queryParams['pageSize']=dataOpt.pageSize;
            	applyListOpt.queryParams['pageNumber']=dataOpt.pageNumber;
            	var opt = {
                    name: '车辆信息',
                    pram: applyListOpt.queryParams,
                    url: 'car/exportCar',
                    recType: 'POST'
                }
                exportFile(opt);
            },
            btn2: function () {
            	var dataOpt=$('#dgrid').datagrid('options');
            	console.log(dataOpt);
            	/*applyListOpt.queryParams['pageSize']=dataOpt.pageSize;
            	applyListOpt.queryParams['pageNumber']=dataOpt.pageNumber;*/
            	var opt = {
                    name: '车辆信息',
                    pram: applyListOpt.queryParams,
                    url: 'car/exportCar',
                    recType: 'POST'
                }
                exportFile(opt);
//            	if (carDeptId == null) {
//                    delete(pram.deptId);
//                }
//                if (carVNo == null) {
//                    delete(pram.vehicleNo);
//                }
//                if (carSimNo == null) {
//                    delete(pram.simNo);
//                }
//                if (carTremNo == null) {
//                    delete(pram.termNo);
//                }
//
//                var opt = {
//                    name: '人员信息',
//                    pram: pram,
//                    url: 'person/exportPerson',
//                    recType: 'POST'
//                }
//                exportFile(opt);
//                return false
            },
            btn3: function () {
                var chooseLay = layer.open({
                    type: 1,
                    title: '车辆信息-选择导出',
                    content: $('#chooseCarTree'),
                    btn: ['确定', '取消'],
                    yes: function () {
                        var ckNode = $.fn.zTree.getZTreeObj('carTree').getCheckedNodes(),
                            newNode = [],
                            carIds = '';
                        for (var i in ckNode) {
                            if (ckNode[i].nodeType == 4) {
                                newNode.push(ckNode[i]);
                                carIds = carIds + ',' + ckNode[i].id;
                            }
                        }
                        if (newNode == '') {
                            layer.msg('请选择要导出的车辆', {
                                time: 1000
                            });
                            return ;
                        }
                        carIds = carIds.substr(1, carIds.length);
                        var opt = {
                                name: '车辆信息',
                                pram: formData,
                                url: 'person/exportPerson',
                                recType: 'POST'
                            }
                        exportFile(opt);
                    },
                    success: function () {
                        getTreeData(3);
                    }
                })
                return false
            },
            success: function () {
                $('.layui-layer-btn1').css({
                    'background-color': '#2e8ded',
                    'border': '1px solid #4898d5',
                    'color': '#fff'
                });
                $('.layui-layer-btn2').css({
                    'background-color': '#2e8ded',
                    'border': '1px solid #4898d5',
                    'color': '#fff'
                });
            }
        })
    }
    /*文件导出*/
    function exportFile(opt) {
        ycyaFileOpt.export(opt);
    }

    //增加车辆
    function addCar(jData, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'car/addCar',
            data: jData,
            success: function (data) {
                findCar1();
                layer.msg('车辆新增成功', {time: 1000});
                layer.close(indexPop);
            }
        };
        customAjax(cfg);
    }

    //修改车辆
    function modCar(jData, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'car/modCar',
            data: jData,
            success: function (data) {
                findCar1();
                layer.msg('车辆修改成功', {
                    time: 1000
                });
                layer.close(indexPop);
            }
        };
        customAjax(cfg);
    }

    //删除车辆
    function delCar(jData, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'car/delCar',
            data: {
                ids: jData
            },
            success: function (data) {
                findCar1();
                layer.msg('车辆删除成功', {
                    time: 1000
                });
                layer.close(indexPop);
            }
        };
        customAjax(cfg);
    }

    //邮箱矫正
    function tankCorrect(jData, callBack) {
        var cfg = {
            token: getCookie("token"),
            url: 'car/modRectify',
            data: jData,
            success: function (data) {
                callBack && callBack();
            }
        };
        customAjax(cfg);
    }

    //油耗最近三条百分比
    function findOilPropor() {
        formData = {};
        formData.carId = perObj['carId'];
        var cfg = {
            token: getCookie("token"),
            url: 'car/findOilPropor',
            data: formData,
            success: function (data) {
                var result = data.data;
                var arr1 = [], arr2 = [], obj = {};
                var $sTCont1 = $('#correct .wSTime0').find('.sTCont1');
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var time0 = result[i].time;
                        var oil0 = result[i].oilPropor;
                        $sTCont1.eq(i).find('.workTime1').text(time0);
                        $sTCont1.eq(i).find('.workTime2').text(oil0);
                        var time = Date.parse(new Date(time0)) / 1000;
                        arr1.push(time);
                        obj[time] = oil0;
                        arr2.push(obj);
                    }
                    var timeMax = Math.max.apply(null, arr1);
                    oil = obj[timeMax];
                    getOilValue(oil);
                } else {
                    for (var i = 0; i < 3; i++) {
                        $sTCont1.eq(i).find('.workTime1').text('');
                        $sTCont1.eq(i).find('.workTime2').text('');
                        arr1 = [], arr2 = [], obj = {};
                    }
                    oil = 0;
                    getOilValue(oil);
                }
            }
        };
        customAjax(cfg);
    }

    //邮箱容积矫正
    function checkVolume(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'car/checkVolume',
            data: formData,
            success: function (data) {
                layer.msg('油箱矫正成功', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    //取得所有选中行数据
    function getSelections() {
        idsArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].carId);
        }
    }

    findDept($('#treeDemo'));

    function findDept($dom) {
        formData = {};
        formData.deptId = perObj['deptId'];
        var cfg = {
            token: getCookie("token"),
            url: 'department/findDeptTree',
            data: formData,
            success: function (data) {
                nodes = [];
                var result = data.data;
                if (result.length > 0) {
                    nodes = [];
                    for (var i = 0, l = result.length; i < l; i++) {
                        nodes.push({"id": result[i].deptId, "pId": result[i].pid, "name": result[i].deptName});
                    }
                }
                $.fn.zTree.init($dom, setting, openNodes(nodes));
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

    //单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("deptTree");
        perObj['deptId'] = treeNode.id;
        perObj['deptName'] = treeNode.name;
        $deptName.val(perObj['deptName']);
        findCar1();
    };
    //油量矫正
    oilCorrect();

    function oilCorrect() {
        var $correct = $('#correct');
        var $wSTime0 = $correct.find('.wSTime0');
        var $sTCont1 = $wSTime0.find('.sTCont1');
        var cont = $sTCont1.html();
        var cont1 = "<div class='sTCont sTCont1'>" + cont + "</div>";
        var len = 3;
        var arr = [];
        for (var i = 0; i < len - 1; i++) {
            arr.push(cont1);
        }
        $wSTime0.append(arr.join(''));
    }

    //初始化定时器
    function initInterval() {
        findOilPropor();
        timer = setInterval(findOilPropor, 5000);
    }

    //关闭定时器
    function closeInterval() {
        clearInterval(timer);
        clearTimeout(timer1);
    }

    //获取数据后自动触发定时器
    function autoInterval() {
        timer1 = setTimeout(initInterval, 5000);
    }

    //获取油量数据
    function getOilValue(val) {
        if (typeof val !== 'number') {
            val = 0;
        }
        return parseInt(val);
    }

    //开始油量
    $('#btnStartOil').click(function () {
        clearInterval(timer);
        $('#startOil').val(getOilValue(oil));
        clearTimeout(timer1);
        autoInterval();
    });
    //结束油量
    $('#btnEndOil').click(function () {
        clearInterval(timer);
        $('#endOil').val(getOilValue(oil));
        clearTimeout(timer1);
        autoInterval();
    });
    //新增部门
    var $deptName=$('#addNew .deptName');
    $deptName.on('click',function () {
        perObj['deptId']=userDeptId;
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
        // $('#form-Tree .submit-btn').off();
        $('#form-Tree .submit-btn').click(function () {
            layer.close(treeIndex);
        });
    })
    //高级查询功能
    seniorSearch('#seniorSearchBtn',applyListOpt,['carType','carCode']);
});
