var pageData = {
    "mapInited":0,
    "facType":{"0":"公厕","1":"中转站","2":"掩埋场","3":"垃圾箱","4":"果皮箱"}
};
var ycyaMap;
$(function () {
    var facType = GetQueryString("facType");
    facType = null==facType?"1":facType;
    document.title = pageData.facType[facType];
    $('#pageTitle').html(pageData.facType[facType]+"列表");
	var facMap = new YcyaMap('facMap');
    facMap.ready(function(){
        pageData.mapInited = 1;//地图载入成功
    });
    //--------------------------表单验证---------------------------
    var validationUp=$('#insertBeta').validationUp({
        rules:{
            facName:{
                notEmpty:true
            },
            facNum:{
                notEmpty:true
            },
            place:{
                notEmpty:true
            }
        },
        errorMsg:{
            agentName:{
                notEmpty:'设施名称不能为空'
            },
            facNum:{
                notEmpty:'设施编号不能为空'
            },
            place:{
                notEmpty:'设施地点不能为空'
            }
        },
        submit:{
            submitBtn:$('#insertBeta .yes'),
            validationEvent:'blur change',
            errorMsgIcon:'icon iconfont icon-cuowu1'
        }
    });

    //--------------------------地图---------------------------
    ycyaMap = new YcyaMap('map');
    var _autoComplete;
    ycyaMap.ready(function(){
        _autoComplete=ycyaMap.createAutoComplete('suggestId','searchResultPanel',setPlace);
        ycyaMap.getLngAndLat('suggestId','searchResultPanel');
        $('#suggestId').keyup(function(){
            $('.tangram-suggestion-main').css({'z-index':99999999})
        });
    });
    function setPlace(){
        debugger;
        ycyaMap.clear();    //清除地图上所有覆盖物
        function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            $('#searchResultPanel').attr('data-lng',pp.lng).attr('data-lat',pp.lat);
            ycyaMap.addPoint({type:1,data:[{"lng":pp.lng,"lat":pp.lat,"id":1}] });
            ycyaMap.toSetCenter(pp);
        }
        var local = ycyaMap.localSearch(myFun,ycyaMap);
        local.search($('#searchResultPanel').attr('data-value'));
    }
    //--------------------------表格---------------------------
    var dgData = [];//表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'facilitiesService/findFacilitiesInfo',
        //请求传递的参数
        queryParams: {
            deptId: getCookie("deptId"),
            facType: facType,
            personName:$("#person_name").val()
        },
        pageSize: 10,
        //数据表格的显示字段
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'facNum', title: '编号', width: 100},
            {field: 'facName', title: pageData.facType[facType]+'名称', width: 150},
            {field: 'personName', title: '负责人', width: 120},
            {field: 'msgLon', title: '经度', width: 100, align: 'right'},
            {field: 'msgLat', title: '纬度', width: 100, align: 'right'},
            {field: 'place', title: '所在位置', width: 300},
            {field: 'tPImg', title: '图片', width: 160, align: 'center'},
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            handler: function () {
                $('#insertBeta .titleText').text('新增公厕');
                findPerson(getCookie("deptId"));
                lx.initFormElm($('#insertBeta'));
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: '1200px',
                    shadeClose:false,
                    closeBtn: 1,
                    content: $('#insertBeta'),
                    move: $('#insertBeta>.title')
                })
                $('#insertBeta .no').click(function () {
                    layer.close(index);
                });
                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit:{
                        doSubmitFn:function(formData){
                            console.log(formData)
                            // addFacilitiesInfo();
                            // layer.close(index);
                        }
                    }
                });
               /* $('#insertBeta .yes').off('click');
                $('#insertBeta .yes').click(function () {
                    var json={};

                    /!*formData.facName = getInput('facName').val();
                    formData.facNum = getInput('facNum').val();
                    formData.msgLon = getInput('msgLon').val();
                    formData.msgLat = getInput('msgLat').val();
                    formData.place = getInput('facPlace').val();
                    formData.personId = getInput('personName').val();
                    console.log($('#searchResultPanel'))*!/

                    // addFacilitiesInfo();
                    // layer.close(index);
                });*/
            }
        }, {
            text: '查看',
            id: "btnSelect",
            handler: function () {
                $('#btnSelect .titleText').text('查看'+pageData.facType[facType]);
                getInput('facName').val(faciliObj['facName']);
                getInput('msgLon').val(faciliObj['msgLon']);
                getInput('msgLat').val(faciliObj['msgLat']);
                getInput('facNum').val(faciliObj['facNum']);
                getInput('personName').val(faciliObj['personName']);
                getInput('facPlace').val(faciliObj['facPlace']);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: '1200px',
                    shadeClose:false,
                    closeBtn: 1,
                    content: $('#insertBeta'),
                    move: $('#insertBeta .title')
                });
                $('#btnSelect .no').click(function () {
                    layer.closeAll();
                });
                $('#btnSelect .yes').off('click');
                $('#btnSelect .yes').click(function () {
                    formData.facName = getInput('facName').val();
                    formData.facNum = getInput('facNum').val();
                    formData.msgLon = getInput('msgLon').val();
                    formData.msgLat = getInput('msgLat').val();
                    formData.place = getInput('facPlace').val();
                    formData.personId = getInput('personName').val();
                    formData.facilitiesId = faciliObj['facilitiesId'];
                    formData.facType = facType;
                    layer.close(index);
                });
            }
        }, {
            text: '删除',
            id: "btnDelete",
            handler: function () {
                getSelections();
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
                    faciliObj['facilitiesIds'] = str;
                    formData.facilitiesIds = faciliObj['facilitiesIds'];
                    delFacilitiesInfo();
                    layer.close(index);

                });
            }
        }, {
            text: '修改',
            id: "btnApudate",
            handler: function () {

                //修改公厕前查看是否选中
                var rows = $("#dgrid").datagrid("getSelections");
                if(rows != null && rows.length > 0){
                    //var personTree = findPersonInfoTree();

                    $('#insertBeta .titleText').text('修改'+pageData.facType[facType]);
                    findPerson(getCookie("deptId"));
                    getInput('facName').val(faciliObj['facName']);
                    getInput('msgLon').val(faciliObj['msgLon']);
                    getInput('msgLat').val(faciliObj['msgLat']);
                    getInput('facNum').val(faciliObj['facNum']);
                    getInput('personName').val(faciliObj['personName']);
                    getInput('facPlace').val(faciliObj['facPlace']);
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "1200px",
                        shadeClose:false,
                        closeBtn: 1,
                        content: $("#insertBeta"),
                        move: $('#insertBeta .title')
                    })
                    $('#insertBeta .no').click(function () {
                        layer.closeAll();
                    });
                    $('#insertBeta .yes').off('click');
                    $('#insertBeta .yes').click(function () {
                        formData.facName = getInput('facName').val();
                        formData.facNum = getInput('facNum').val();
                        formData.msgLon = getInput('msgLon').val();
                        formData.msgLat = getInput('msgLat').val();
                        formData.place = getInput('facPlace').val();
                        formData.personId = getInput('personName').val();
                        formData.facilitiesId = faciliObj['facilitiesId'];
                        formData.facType = facType;
                        modFacilitiesInfo();
                        layer.close(index);
                    });
                }else{
                    alert("请选择需要修改的"+pageData.facType[facType]+"信息！");
                }

            }
        }, {
            text: '刷新',
            id: "btnConfirm",
            handler: function () {
                $('#dgrid').datagrid('reload', applyListOpt.queryParams);
            }
        }
        ],
        onClickRow: function (index, row) {
            formData.facilitiesId = row.facilitiesId;
            formData.facName = row.facName;
            formData.facNum = row.facNum;
            formData.msgLon = row.msgLon;
            formData.msgLat = row.msgLat;
            faciliObj['facilitiesId'] = row.facilitiesId;
            faciliObj['facName'] = row.facName;
            faciliObj['facNum'] = row.facNum;
            faciliObj['msgLon'] = row.msgLon;
            faciliObj['msgLat'] = row.msgLat;
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
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    formData.facType = facType;
    // formData.dictionaryType='dictionaryType';
    var faciliObj = {
        facilitiesId: 0,
        facilitiesIds: '',
        facName: '',
        facNum: '',
        msgLon: '',
        msgLat: '',
        deptId: userDeptId
    }
    var idsArr = [], namesArr = [];
   /* findFacilitiesInfo($('#dgrid'), dgData);*/

    $('#btnSelPoint').bind("click",function(){
        if(pageData.mapInited==0){
            alert("地图尚未加载，请稍后");
            return;
        }
        //获取坐标点与地址
    });

    //新增设施
    function addFacilitiesInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'facilitiesService/addFacilitiesInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    loads();
                    layer.msg('添加成功！', {
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

    //修改设施
    function modFacilitiesInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'facilitiesService/modFacilitiesInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    loads();
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

    //删除选中的信息
    function delFacilitiesInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'facilitiesService/delFacilitiesInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    loads();
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

    //查看设施详情
    function loads() {
        $('#dgrid').datagrid('load',{
            deptId: getCookie("deptId"),
            facType: facType,
            personName:$("#person_name").val()
        });
    }

    var personName = null;

    $('#findPersonInfo').click(function (){
        loads();
    });

    function findPersonInfoTree() {
        formData = {};
        formData.deptId = getCookie("deptId");
        var cfg = {
            token: getCookie("token"),
            url: 'person/findPerson',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    /*dgData = data.data.fac;
                    $("#dgrid").datagrid('loadData', dgData);
                    loads();*/
                    layer.msg('查询成功！');

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
            idsArr.push(rows[i].facilitiesId);
            namesArr.push(rows[i].facName)
        }
    }
});
