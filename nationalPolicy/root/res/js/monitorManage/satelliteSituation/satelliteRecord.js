var map;
var queryFlag=0;//查询标志
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
        map.getLngAndLat('suggestId', 'searchResultPanel');
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

    var dgData = [];//表格数据
    var santitionId = null;
    bindEvent(); //绑定事件
    var applyListOpt = {
        $Dom: $('#dgrid'),
        url: requestUrl + 'sanitation/findSanitation',
        queryParams: {
            sanitationDeptId: getCookie("deptId")
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
            {
                field: 'picId1', title: '现场图片', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value != '') {
                    return '<span class="preview-picture" style="color:#0C7FE9;cursor:pointer;" data-id="' + value + '">预览</span>';
                } else {
                    return '暂无图片';
                }
            }
            },
            {
                field: 'picId2', title: '确认图片', width: 100, align: 'center', formatter: function (value, row, index) {
                if (value != '') {
                    return '<span class="preview-picture" style="color:#0C7FE9;cursor:pointer;" data-id="' + value + '">预览</span>';
                } else {
                    return '暂无图片';
                }
            }
            },
            {field: 'sanitationDetails', title: '卫情描述', width: 500, align: 'left'},
        ]],
        buttons: [
            {
                text: '查看',
                id: "btnSelect",
                code:28,
                handler: function () {
                    var row = lx.judge($('#dgrid'), '查看', 'sanitationId');
                    if (!row) {
                        return;
                    }
                    $('#selectAll .titleText').text('查看卫情记录信息');
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
                            //获取现场图片
                            var totalPic;
                            if (row.picId1.indexOf(',') == -1) {
                                totalPic = [row.picId1];
                            } else {
                                totalPic = row.picId1.split(',');
                            }
                            var html = '';
                            if (totalPic.length > 0) {
                                for (var i = 0; i < totalPic.length; i++) {
                                    html += '<li><img src="' + requestUrl + '/file/view?id=' + totalPic[i] + '"  data-picId="' + totalPic[i] + '"></li>';
                                }
                                $('.sIIImg ul').html(html);

                                $('.sIIImg ul').find('li>img').click(function () {
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
                            //获取卫情确认图片
                            var totalPic2;
                            if (row.picId2.indexOf(',') == -1) {
                                totalPic2 = [row.picId2];
                            } else {
                                totalPic2 = row.picId2.split(',');
                            }
                            var html1 = '';
                            if (totalPic2.length > 0) {
                                for (var i = 0; i < totalPic2.length; i++) {
                                    html1 += '<li><img src="' + requestUrl + '/file/view?id=' + totalPic2[i] + '"  data-picId="' + totalPic2[i] + '"></li>';
                                }
                                $('.sIIImg2 ul').html(html1);
                                $('.sIIImg2 ul').find('li>img').click(function () {
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
            }, {
                text: '修改',
                id: "btnApudate",
                code:29,
                handler: function () {
                    $('#addNew .titleText').text('修改卫情记录信息');
                    $('#addFile').hide();
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
                    })
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
                                for (var i = 0; i < totalPic.length; i++) {
                                    html += '<img src=" ' + requestUrl + '/file/view?id=' + totalPic[i] + '" data-picId="' + totalPic[i] + '">';
                                }
                                $('#fileBox').html(html);

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
                                })
                            }
                            var totalPic2;
                            if (row.picId2.indexOf(',') == -1) {
                                totalPic2 = [row.picId2];
                            } else {
                                totalPic2 = row.picId2.split(',');
                            }
                            var html1 = '';
                            if (totalPic2.length > 0) {
                                for (var i = 0; i < totalPic2.length; i++) {
                                    html1 += '<img src=" ' + requestUrl + '/file/view?id=' + totalPic2[i] + '" data-picId="' + totalPic2[i] + '">';
                                }
                                $('#fileBox1').html(html1);

                                $('#fileBox1').find('img').click(function () {
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
                    $('#addNew .no').click(function () {
                        layer.close(index);
                    });

                    validationUp.destroyErrorMsg();
                    validationUp.setDoSubmitFn({
                        submit: {
                            doSubmitFn: function (formData) {
                                formData.sanitationDeptId = getCookie('deptId');
                                formData.userName = getCookie('userName');
                                formData.sanitationId = santitionId;
                                var resPlace = $('#searchResultPanel');
                                if (resPlace.attr('data-lng') && resPlace.attr('data-lat')) {
                                    formData.latLon = resPlace.attr('data-lat') + ',' + resPlace.attr('data-lng');
                                }
                                modSanitation(formData, index);
                            }
                        }
                    });
                }
            }, {
                text: '删除',
                id: "btnDelete",
                code:30,
                handler: function () {
                    var row = lx.judge($('#dgrid'), '删除', 'sanitationId');
                    if (!row) {
                        return;
                    }
                    $('#dInfo').text(perObj['agentName']);
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
            perObj['picId2'] = row.picId2;
            perObj['sureTime'] = row.sureTime;
            perObj['sureName'] = row.sureName;
            perObj['addTime'] = row.addTime;
            getSelections();
        },
        //点击单元格
        onClickCell: function (rowIndex, field, value) {
            if (field == 'picId1') {
                $('#sateImg').text('卫情现场图片');
            }
            if (field == 'picId2') {
                $('#sateImg').text('卫情确认图片');
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
                    html += '<img src=" ' + requestUrl + '/file/view?id=' + picArr[j] + '" data-picId="' + picArr[j] + '">';
                }
                $('#previewInfo .peelInfoPopup').find('li').html(html);
                layer.open(publicObj({
                    kind: 'layer',
                    area: '460px',
                    content: $('#previewInfo'),
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
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    var perObj = {
        userName: '',
        sanitationId: 0,
        sanitationLevel: 0,
        sanitationState: 0,
        agentName: '',
        sanitationDeptId: getCookie('deptId'),
        sanitationDetails: '',
        sanitationPlace: '',
        picId1: '',
        picId2: '',
        sureTime: '',
        sureName: '',
        addTime: '',
        pageNo: 1,
        pageSize: 100000
    };
    var idsArr = [], namesArr = [];

    //绑定事件
    function bindEvent() {
        $('#searchBtn').click(function () {
            var json = {};
            var v = $(this).siblings('input').val();
            json.agentName = v;
            findSanitation(json);
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
                findSanitation();
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
                            $('#sanitationPlace').val(v);
                            if (placeElm.attr('data-lng')) {
                                $('#sanitationPlace').attr('data-lng', placeElm.attr('data-lng'));
                            }
                            if (placeElm.attr('data-lat')) {
                                $('#sanitationPlace').attr('data-lat', placeElm.attr('data-lat'));
                            }
                            layer.close(index);
                        }
                    });
                }
            }))
        });
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
    // findSanitation();
    function findSanitation(jData) {
        if (jData) {
            for (var key in jData) {
                applyListOpt.queryParams[key] = jData[key];
            }
        }
        
        applyListOpt.queryParams['sanitationDeptId'] = perObj['sanitationDeptId'];
        if(queryFlag==1){
        	delete applyListOpt.queryParams['startTime'];
            delete applyListOpt.queryParams['endTime'];
        }
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
        //                 $('#dgrid').datagrid('load');
        //             }
        //         }
        //     }
        // };
        // customAjax(cfg);
    }

    //增加卫情
    function addSanitation() {
        var cfg = {
            token: getCookie("token"),
            url: 'sanitation/addSanitation',
            data: formData,
            success: function (data) {
                findSanitation();
                layer.msg('卫情新增成功', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    function loads() {
        $('#dgrid').datagrid('load');
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
                layer.msg('卫情修改成功', {
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
});
