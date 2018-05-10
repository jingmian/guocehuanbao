 var queryFlag=0;//查询标志
var picId = [],  //存储图片Id
    picId2 = []; //存储图片Id
var addNum;  //addNum 为1时表示新增图片，为0时表示修改图片
// 图片上传
var fileUpLoad = {
    upload: function () {
        if ($('#modPic')) {
            $('#modPic').remove();
        }

        myUpload({
            url: requestUrl + 'file/up',
            maxSize: 10,
            inputDom: 'inputBox',
            fileDom: 'fileBox',
            showDom: 'showPic',
            //triggerBtn:'yes',
            beforeSend: function (file) {
            },
            callback: function (res) {
                res = $.parseJSON(res);
                picId.push(res.data[0].uuid);
                $('#fileBox span').each(function (ind) {
                    $(this).attr('data-id', picId[ind]);
                });
                $('#fileBox span').find('i').unbind();
                $('#fileBox span').find('i').click(function () {
                    var parent = $(this).parent().parent();
                    parent.remove();
                    picId.splice(parent.index(), 1);
                });
            }
        });
    }
};
var fileUpLoad2 = {
    upload: function () {
        myUpload({
            url: requestUrl + 'file/up',
            maxSize: 10,
            inputDom: 'inputBox2',
            fileDom: 'fileBox2',
            showDom: 'showPic',
            //triggerBtn:'yes',
            beforeSend: function (file) {
            },
            callback: function (res) {
                res = $.parseJSON(res);
                picId2.push(res.data[0].uuid);
                $('#fileBox2 span').each(function (ind) {
                    $(this).attr('data-id', picId2[ind]);
                });
                $('#fileBox2 span').find('i').unbind();
                $('#fileBox2 span').find('i').click(function () {
                    var parent = $(this).parent().parent();
                    parent.remove();
                    picId2.splice(parent.index(), 1);
                });
            }
        });
    }
};
var map;
$(function () {
    var validationUp = $('#addNew').validationUp({
        rules: {
            agentName: {
                notEmpty: true
            },
            sanitationPlace: {
                notEmpty: true
            },
            sanitationDetails: {
                notEmpty: true
            }
        },
        errorMsg: {
            agentName: {
                notEmpty: '上报人不能为空'
            },
            sanitationPlace: {
                notEmpty: '卫情地点不能为空'
            },
            sanitationDetails: {
                notEmpty: '卫情描述不能为空'
            }
        },
        submit: {
            submitBtn: $('#addNew .yes'),
            validationEvent: 'blur change',
            errorMsgIcon: 'icon iconfont icon-cuowu1'
        }
    });

    map = new YcyaMap('betaMap');
    var _autoComplete;
    map.ready(function () {
        _autoComplete = map.createAutoComplete('suggestId', 'searchResultPanel', setPlace);
        map.getLngAndLat('suggestId', 'searchResultPanel', 'sanitationPlace');
        $('#suggestId').keyup(function () {
            $('.tangram-suggestion-main').css({'z-index': 99999999})
        });
    });

    function setPlace() {
        map.clear();    //清除地图上所有覆盖物
        function myFun() {
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            $('#searchResultPanel').attr('data-lng', pp.lng).attr('data-lat', pp.lat);
            map.addPoint({type: 1, data: [{"lng": pp.lng, "lat": pp.lat, "id": 1}]});
            map.toSetCenter(pp);
        }

        var local = map.localSearch(myFun, map);
        local.search($('#searchResultPanel').attr('data-value'));
    }

    $('.insertPopup').css({minHeight: 0});
    bindEvent();

    var santitionId = null;
    var applyListOpt = {
        $Dom: $('#dgrid'),
        url: requestUrl + 'sanitation/findSanitation',
        queryParams: {
            //agentName:$("#sbr_input").val(),
            sanitationDeptId: getCookie("deptId"),
            sanitationState: '0,1,2'
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'sanitationId', hidden: true},
            {field: 'agentName', title: '上报人', width: 150, align: 'left'},
            {field: 'addTime', title: '上报时间', width: 150, align: 'center'},
            {
                field: 'sanitationLevel',
                title: '卫情等级',
                width: 50,
                align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) {
                        return '<span style="color:#0C7FE9">一般</span>';
                    } else if (value == 1) {
                        return '<span style="color:#FFBF24">紧急</span>';
                    } else {
                        return '<span style="color:#FB2C36">特急</span>';
                    }
                }
            },
            {field: 'sanitationStatus', title: '卫情状态', width: 100, align: 'center'},
            {field: 'assignedName', title: '被分派人', width: 150, align: 'center',formatter:function (value,row,index) {
                var state=row['sanitationStatus'];
                if(state=='未分派'){
                    return value='暂无分派人'
                }else{
                    return value;
                }
            }},
            {
                field: 'picId1', title: '现场图片', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value != '') {
                    return '<span class="preview-picture" style="color:#0C7FE9;cursor:pointer;" data-id="' + value + '">预览</span>';
                } else {
                    return '暂无图片';
                }
            }
            },
            {field: 'sanitationDetails', title: '卫情描述', width: 500, align: 'left'}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [
            {
                text: '新增',
                id: "btnNewAdd",
                code:21,
                handler: function () {
                    $('#addNew .titleText').text('新增等待反馈信息');
                    $('#fileBox').empty();
                    $('#addFile').text('新增');
                    addNum = 1;
                    //$('#addFile').show();
                    lx.initFormElm($('#addNew'));
                    var indexPoP = layer.open(publicObj({
                        kind: 'layer',
                        area: "500px",
                        content: $("#addNew"),
                        move: $('#addNew >.title')
                    }));
                    $('#addNew .no').click(function () {
                        layer.closeAll();
                    });
                    validationUp.destroyErrorMsg();
                    validationUp.setDoSubmitFn({
                        submit: {
                            doSubmitFn: function (formData) {
                                if ($('#fileBox').find('span').length > 0) {
                                    if (picId.length == 1) {
                                        formData.picId1 = '' + picId[0];
                                    } else if (picId.length > 1) {
                                        formData.picId1 = picId.join(',');
                                    }
                                }
                                formData.sanitationDeptId = getCookie('deptId');
                                formData.userName = getCookie('userName');
                                var resPlace = $('#searchResultPanel');
                                if (resPlace.attr('data-lng') && resPlace.attr('data-lat')) {
                                    formData.latLon = resPlace.attr('data-lat') + ',' + resPlace.attr('data-lng');
                                } else {
                                    layer.msg('地点选取失败,请重新选择', {time: 1000});
                                    return;
                                }
                                addSanitation(formData, indexPoP);
                            }
                        }
                    });
                }
            }, {
                text: '查看',
                id: "btnSelect",
                code:22,
                handler: function () {
                    var row = lx.judge($('#dgrid'), '查看', 'sanitationId');
                    if (!row) {
                        return;
                    }
                    var d = row;
                    if (d.handleTime) {
                        var d1 = new Date();
                        if (d.arrangeTime) {
                            d1 = new Date(d.arrangeTime);
                        } else {
                            if (d1.sureTime) {
                                d1 = new Date(d.sureTime);
                            }
                        }

                        var d2 = new Date(d.addTime);
                        d.handleTime = parseInt(parseInt(d1 - d2) / 1000 / 60);
                        var handTimeElm = $('#sateInfo .titleState').find('em'),
                            hTime = d.handleTime;
                        if (hTime < 60) {
                            handTimeElm.text(hTime + '分钟');
                        } else if (hTime >= 60 && hTime <= 1440) {
                            var remainde = hTime % 60,
                                integer = (hTime - remainde) / 60;
                            handTimeElm.text(remainde == 0 ? integer + '小时' : integer + '小时' + remainde + '分钟');
                        } else {
                            var remainde = hTime % 1440,
                                dayTime = (hTime - remainde) / 1440;
                            if (remainde < 60) {
                                handTimeElm.text(dayTime + '天' + remainde + '分钟');
                            } else {
                                var minTime = remainde % 60,
                                    hourTime = (remainde - minTime) / 60;
                                handTimeElm.text(dayTime + '天' + hourTime + '小时' + minTime + '分钟');
                            }
                        }
                    }
                    $('#selectAll .titleText').text('查看等待反馈信息');
                    layer.open(publicObj({
                        kind: 'layer',
                        area: '460px',
                        content: $('#sateInfo'),
                        move: $('#sateInfo >.title'),
                        success: function () {
                            $('.sIState .sISRadus').each(function (ind) {
                                if (ind > 0) {
                                    if ($(this).hasClass('active')) {
                                        $(this).removeClass('active');
                                    }
                                }
                            });
                            $('.sIState p').each(function () {
                                var attr = $(this).attr('data-class');
                                $(this).html('');
                                if (row[attr] && row[attr] != null) {
                                    $(this).html(row[attr]);
                                    $(this).siblings('.sISRadus').addClass('active');
                                }
                            });
                            $('.sIInfo p').each(function () {
                                var attr = $(this).attr('data-class');
                                if (row[attr]) {
                                    $(this).html(row[attr])
                                }
                            });
                            //获取图片
                            var totalPic;
                            if (row.picId1.indexOf(',') == -1) {
                                totalPic = [row.picId1];
                            } else {
                                totalPic = row.picId1.split(',');
                            }
                            var html = '';
                            if (totalPic.length > 0) {
                                for (var i = 0; i < totalPic.length; i++) {
                                    html += '<li><img src=" ' + requestUrl + 'file/view?id=' + totalPic[i] + '" data-picId="' + totalPic[i] + '"></li>';
                                }
                                $('.sIIImg ul').html(html);

                                $('.sIIImg ul').find('img').click(function () {
                                    var selfId = $(this).attr('data-picId');
                                    $('#peelInfo img').attr('src', '').attr('src', requestUrl + 'file/view?id=' + selfId);
                                    layer.open(publicObj({
                                        kind: 'layer',
                                        area: '460px',
                                        content: $('#peelInfo'),
                                        move: $('#peelInfo .title'),
                                        shade: 0
                                    }));
                                })
                            }

                        }
                    }));
                    $('#selectAll .no').click(function () {
                        layer.closeAll();
                    });
                    $('#selectAll .yes').off('click');
                    $('#selectAll .yes').click(function () {

                    });

                }
            },
            {
                text: '修改',
                id: "btnApudate",
                code:23,
                handler: function () {
                    $('#addNew .titleText').text('修改等待反馈信息');
                    /*  $('#addFile').hide();*/
                    $('#addFile').text('图片修改');
                    addNum = 0;
                    var row = lx.judge($('#dgrid'), '修改', 'sanitationId');
                    if (!row) {
                        return;
                    }
                    santitionId = row.sanitationId;
                    $('.insertPopup').find('input[type="text"],textarea').each(function () {
                        $(this).val(row[$(this).attr('data-class')]);
                    });
                    $('#sanitationLevel').val('' + row['sanitationLevel']);
                    $('#sanitationState option').each(function () {
                        if ($(this).text() == row["sanitationStatus"]) {
                            $(this).attr('selected', true)
                        }
                    });

                    var index = layer.open(publicObj({
                        kind: 'layer',
                        area: "500px",
                        content: $("#addNew"),
                        move: $('#addNew >.title'),
                        success: function () {
                            var totalPic;
                            if (row.picId1.indexOf(',') == -1) {
                                totalPic = [row.picId1];
                            } else {
                                totalPic = row.picId1.split(',');
                            }
                            var html = '';
                            if (totalPic.length > 0) {
                                if (picId.length != 0) {
                                    picId = [];
                                }
                                html += '<span style="color:red" id="modPic">' + '如果修改卫情图片，则会清除之前的图片信息' + '</span>';
                                $('#fileBox').html(html);
                                /*for (var i = 0; i < totalPic.length; i++) {
                                    /!* html += '<img src=" ' + requestUrl + 'file/view?id=' + totalPic[i] + '" data-picId="' + totalPic[i] + '">';*!/

                                }*/
                                /* $('#fileBox').html(html);

                                 $('#fileBox').find('img').click(function () {
                                     var selfId = $(this).attr('data-picId');
                                     $('#peelInfo img').attr('src', '').attr('src', requestUrl + 'file/view?id=' + selfId);
                                     layer.open(publicObj({
                                         kind: 'layer',
                                         area: '460px',
                                         content: $('#peelInfo'),
                                         move: $('#peelInfo .title'),
                                         shade: 0
                                     }));
                                 })*/
                            }
                        }
                    }));
                    $('#addNew .no').click(function () {
                        layer.close(index);
                    });
                    validationUp.destroyErrorMsg();
                    validationUp.setDoSubmitFn({
                        submit: {
                            doSubmitFn: function (formData) {
                                if ($('#fileBox').find('span').length > 0) {
                                    if (picId.length == 1) {
                                        formData.picId1 = '' + picId[0];
                                    } else if (picId.length > 1) {
                                        formData.picId1 = picId.join(',');
                                    }
                                }
                                formData.sanitationDeptId = getCookie('deptId');
                                formData.userName = getCookie('userName');
                                formData.sanitationId = santitionId;
                                var resPlace = $('#searchResultPanel');
                                if (resPlace.attr('data-lng') && resPlace.attr('data-lat')) {
                                    formData.latLon = resPlace.attr('data-lat') + ',' + resPlace.attr('data-lng')
                                }
                                modSanitation(formData, index);
                            }
                        }
                    });
                }
            }, {
                text: '分派',
                id: "btnAssign",
                code:24,
                handler: function () {
                    $('#distrib .titleText').text('分派卫情等待反馈信息');
                    var row = lx.judge($('#dgrid'), '分派', 'sanitationId');
                    if (!row) {
                        return;
                    }
                    perObj['personName'] = '';
                    perObj['personId'] = '';
                    $("#agentName1").val('');
                    $('#checkedPerson').val('');
                    $('#dInfo1').text(perObj['agentName']);
                    if (row['sanitationState'] == 0) {
                        findPerson1($('#windowTree1'));
                        var index2 = layer.open({
                            type: 1,
                            title: false,
                            area: "400px",
                            // shade: 0,
                            closeBtn: 1,
                            content: $("#pers-form-Tree"),
                            move: $('#pers-form-Tree .form-top')
                        });
                        $('#pers-form-Tree .close').click(function () {
                            layer.closeAll();
                        });
                        $('#pers-form-Tree .no').click(function () {
                            layer.closeAll();
                        });
                        $('#pers-form-Tree .submit-btn').click(function () {
                            if (perObj['personId'] && perObj['personId'].trim().length > 0) {
                                formData.sanitationId = perObj['sanitationId'];
                                formData.assignedId = perObj['personId'];
                                arrangeSanitation(index2);
                                layer.closeAll();
                            }else{
                                layer.msg('请选择人员',{timer:1000});
                            }
                        });
                        // $('#distrib .no').click(function () {
                        //     layer.closeAll();
                        // });
                        // $('#distrib .yes').off('click');
                        // $('#distrib .yes').click(function () {
                        //     if (perObj['personId'] && perObj['personId'].trim().length > 0) {
                        //         formData.sanitationId = perObj['sanitationId'];
                        //         formData.assignedId = perObj['personId'];
                        //         arrangeSanitation(index);
                        //         layer.closeAll();
                        //     }
                        // });
                    } else {
                        layer.msg('当前卫情已分派', {time: 1000});
                    }
                }
            },
            {
                text: '确认',
                id: "btnConfirm",
                code:25,
                handler: function () {
                    $('#distrib .titleText').text('确认等待反馈信息');
                    $('#fileBox2').empty();
                    var row = lx.judge($('#dgrid'), '确认', 'sanitationId');
                    if (!row) {
                        return;
                    }
                    if (row['sanitationState'] < 3) {
                        var index = layer.open({
                            type: 1,
                            title: false,
                            area: "500px",
                            shadeClose: false,
                            closeBtn: 1,
                            content: $("#sateConfirm"),
                            move: $('#sateConfirm >.title')
                        });
                        $('#sateConfirm .no').click(function () {
                            layer.closeAll();
                        });
                        $('#sateConfirm .yes').off('click');
                        $('#sateConfirm .yes').click(function () {
                            var jsonData = {};
                            $('.sateConfirmPopup').find('input[type="text"]').each(function () {
                                var cla = $(this).attr('data-class');
                                if ($(this).val() != '') {
                                    jsonData[cla] = $(this).val();
                                } else {
                                    layer.msg('处理时间不能为空', {time: 1000});
                                    return false;
                                }
                            });
                            if ($('#fileBox2').find('span').length > 0) {
                                if (picId2.length == 1) {
                                    jsonData.picId2 = '' + picId2[0];
                                } else if (picId2.length > 1) {
                                    jsonData.picId2 = picId2.join(',');
                                }

                            }
                            /*else{
                                                            layer.msg('请上传至少一张图片',{time:1000});
                                                        }*/
                            jsonData.sanitationId = row.sanitationId;
                            jsonData.sureName = getCookie('userName');
                            jsonData.addTime = row.addTime;
                            if (jsonData["sureTime"]) {
                                fileSanitation(jsonData, index);
                            }
                        });
                    } else {
                        if (row['sanitationState'] == 0) {
                            layer.msg('当前卫情未分派', {time: 1000});
                        } else if (row['sanitationState'] == 3) {
                            layer.msg('当前卫情已确认', {time: 1000});
                        }
                    }
                }
            },
            {
                text: '删除',
                id: "btnDelete",
                code:26,
                handler: function () {
                    //getSelections();
                    $('#dInfo').text(perObj['agentName']);
                    var row = lx.judge($('#dgrid'), '删除', 'sanitationId');
                    if (!row) {
                        return;
                    }
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "300px",
                        closeBtn: 1,
                        content: $("#delete"),
                        move: $('#delete .title')
                    });
                    $('#delete .no').click(function () {
                        layer.closeAll();
                    });
                    $('#delete .yes').off('click');
                    $('#delete .yes').click(function () {
                        // formData.sanitationId=perObj['sanitationId'];
                        for (var i = 0; i < row.length; i++) {
                            delSanitation(row[i].sanitationId, index);
                        }
                    });
                }
            }
        ],
        onSelect: function (index, row) {
            perObj['userName'] = row.userName;
            perObj['sanitationId'] = row.sanitationId;
            perObj['sanitationLevel'] = row.sanitationLevel;
            perObj['sanitationState'] = row.sanitationState;
            perObj['agentName'] = row.agentName;
            perObj['sanitationDeptId'] = row.sanitationDeptId;
            perObj['sanitationDetails'] = row.sanitationDetails;
            perObj['sanitationPlace'] = row.sanitationPlace;
            perObj['picId1'] = row.picId1;
            perObj['sureTime'] = row.sureTime;
            perObj['sureName'] = row.sureName;
            perObj['addTime'] = row.addTime;
            perObj['deptName'] = row.deptName;
            getSelections();
        },
        onLoadError: function () {

        },
        onLoadSuccess: function (data) {
            $('.dgrid .show-detail').mouseover(function () {
                $(this).css({color: "#1874ad", cursor: "pointer"})
            }).mouseleave(function () {
                $(this).css({color: "#000", cursor: "pointer"})
            });
            $('.dgrid .show-detail').click(function () {
                var orderId = $(this).attr('data-href');
                setTimeout(function () {
                    // $('#btnSelect').trigger('click');
                }, 100);
            });
            $('.dgrid .preview-picture').click(function () {
                var picArr;
                if ($(this).attr('data-id').indexOf(',') == -1) {
                    picArr = [$(this).attr('data-id')]
                } else {
                    picArr = $(this).attr('data-id').split(',');
                }
                var html = '';
                for (var j = 0; j < picArr.length; j++) {
                    html += '<img src=" ' + requestUrl + 'file/view?id=' + picArr[j] + '" data-picId="' + picArr[j] + '">';
                }
                $('#previewInfo .peelInfoPopup').find('li').html(html);
                layer.open(publicObj({
                    kind: 'layer',
                    area: '600px',
                    content: $('#previewInfo'),
                    move: $('#previewInfo .title'),
                    shadeClose: false,
                    closeBtn: 1
                }));
            });

        }
    };
    datagridFn(applyListOpt);
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");

    var formData = {};//请求数据
    var perObj = {
        userName: '',
        sanitationId: 0,
        sanitationLevel: 0,
        sanitationState: '0,1,2',
        agentName: '',
        sanitationDeptId: getCookie('deptId'),
        sanitationDetails: '',
        sanitationPlace: '',
        picId1: '',
        sureTime: '',
        sureName: '',
        addTime: '',
        pageNo: 1,
        pageSize: 10
    };
    var idsArr = [], namesArr = [];

    //绑定事件
    function bindEvent() {
        $('#sureTime').focus(function () {
            WdatePicker({el: 'sureTime', dateFmt: 'yyyy-MM-dd HH:mm:ss'})
        });
        $('#searchBtn').click(function () {
            var json = {};
            var v = $(this).siblings('input').val();
            if (v != '') {
                json.agentName = v;
                findSanitation(json);
            } else {
                if (applyListOpt.queryParams.agentName) {
                    applyListOpt.queryParams.agentName = '';
                }

                findSanitation();
            }
        });



        $('#timeDuring').change(function () {
            var date = time.formatDate(new Date());
            var v = parseInt($(this).val()),
                json = {};
            if (v != 0) {
            	queryFlag=0;
                var eTime = time.getPreDate(v);
                json.startTime = eTime;
                json.endTime = date;
                findSanitation(json);
            } else {
            	queryFlag=1;
                findSanitation(json);
            }
        });
        $('#sanitationPlace').focus(function () {
            var index = layer.open(publicObj({
                kind: 'layer',
                area: '700px',
                content: $('#insertArea'),
                move: $('#insertArea .title'),
                shade: 0,
                success: function () {
                    $('#insertArea .no').click(function () {
                        layer.close(index);
                    });
                    $('#insertArea .yes').off('click');
                    $('#insertArea .yes').click(function () {
                        var v = $('#suggestId').val(),
                            placeElm = $('#searchResultPanel');
                        if ($.trim(v) != '') {
                            var s = $('#sanitationPlace');
                            s.val(v);
                            if (placeElm.attr('data-lng')) {
                                s.attr('data-lng', placeElm.attr('data-lng'));
                            }
                            if (placeElm.attr('data-lat')) {
                                s.attr('data-lat', placeElm.attr('data-lat'));
                            }
                            if (s.hasClass('validation-error')) {
                                s.removeClass('validation-error');
                                s.siblings('i').remove();
                            }
                            layer.close(index);
                        }
                    });
                }
            }))
        });
    }

    function loads() {
        $('#dgrid').datagrid('load');
    }

    //人员模糊查询
    function peoVagueSearch() {
        $('#agentName').vagueSearch({
            url: 'user/findUser',
            searchKey: 'user/findUser',
            pageNo: 1,
            pageSize: 100000
        })
    }

    //查询卫情
    //findSanitation();

    function findSanitation(jData) {
        if (jData) {
            for (var key in jData) {
                applyListOpt.queryParams[key] = jData[key];
            }
        }
        if(queryFlag==1){
        	delete applyListOpt.queryParams['startTime'];
            delete applyListOpt.queryParams['endTime'];
        }

        applyListOpt.queryParams['sanitationDeptId'] = perObj['sanitationDeptId'];
        applyListOpt.queryParams['sanitationState'] = perObj['sanitationState'];
        $('#dgrid').datagrid('load');
        // var cfg = {
        //     token: getCookie("token"),
        //     url: 'sanitation/findSanitation',
        //     data: formData,
        //     success: function (data) {
        //         if(data.rows){
        //             dgData = data.rows;
        //             if (dgData.length > 0) {
        //                 $("#dgrid").datagrid('loadData', dgData);
        //             }
        //         }
        //     }
        // };
        // customAjax(cfg);
    }

    //增加卫情
    function addSanitation(jData, indexPop) {
        var cfg = {
            token: getCookie('token'),
            url: 'sanitation/addSanitation',
            data: jData,
            success: function (data) {
                picId.length = 0;
                loads();
                layer.close(indexPop);
                //findSanitation();
            }
        };
        customAjax(cfg);
    }

    //修改卫情
    function modSanitation(jData, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'sanitation/modSanitation',
            data: jData,
            success: function (data) {
                loads();
                layer.close(indexPop);
                layer.msg('修改卫情成功', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    //删除卫情
    function delSanitation(sanId, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'sanitation/delSanitation',
            data: {
                "sanitationId": sanId
            },
            success: function (data) {
                loads();
                layer.close(indexPop);
                layer.msg('卫情删除成功', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    //卫情确认
    function fileSanitation(jData, indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'sanitation/fileSanitation',
            data: jData,
            success: function (data) {
                loads();
                layer.close(indexPop);
                layer.msg('卫情确认成功', {
                    time: 1000
                });

            }
        };
        customAjax(cfg);
    }

    //卫情分派
    function arrangeSanitation(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'sanitation/arrangeSanitation',
            data: formData,
            success: function (data) {
                loads();
                layer.close(indexPop);
                layer.msg('卫情分派成功', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    //取得所有选中行数据
    function getSelections() {
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName)
        }
    }

    //查找人员
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
            onClick: zTreeClick2
        }
    };

    function findPerson1($dom) {
        formData = {};
        formData.id = userDeptId;
        formData.pageSize = 1000;
        var arr2 = [];
        var cfg = {
            token: getCookie("token"),
            url: 'user/getUserTree',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.data;
                    if (result.length > 0) {
                        for (var i = 0, l = result.length; i < l; i++) {
                            arr2.push({"id": result[i].personId, "pId": result[i].picId, "name": result[i].personName});
                        }
                    }
                    $.fn.zTree.init($dom, setting1, openNodes(arr2));
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

    //人员单击
    function zTreeClick2(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree1");
        perObj['personId'] = treeNode.id;
        perObj['personName'] = treeNode.name;
        $('#checkedPerson').val(perObj['personName']);
    }


    $("#checkedPerson").bind('input propertychange', function () {
        var checkedPersonName = $('#checkedPerson').val();
        if (checkedPersonName && checkedPersonName.trim().length > 0) {
            var treeObj = $.fn.zTree.getZTreeObj("windowTree1");
            var nodes = treeObj.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].name.indexOf(checkedPersonName) >= 0) {
                    treeObj.showNode(nodes[i]);
                    //showNodes.push(nodes[i])
                } else {
                    treeObj.hideNode(nodes[i]);
                }
            }
        } else {
            var treeObj = $.fn.zTree.getZTreeObj("windowTree1");
            var nodes = treeObj.getNodes();
            for (var i = 0; i < nodes.length; i++) {
                treeObj.showNode(nodes[i]);
            }
        }
    });

    function autoMatch(obj) {
        if (obj && obj.value.length > 0) {
            var treeObj = $.fn.zTree.getZTreeObj("windowTree1");
            var nodeList = treeObj.getNodesByParamFuzzy("name", obj.value(), null);
            $.fn.zTree.init($('#ztree'), setting, nodeList);
        } else {
            $.fn.zTree.init($("#ztree"), setting, zNodes);
        }
    }
});
