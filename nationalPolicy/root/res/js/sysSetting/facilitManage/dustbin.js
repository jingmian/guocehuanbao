$(function () {
	var dgData = [];//表格数据
	var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'facilitiesService/findFacilitiesInfo',
        //请求传递的参数
        queryParams: {
            deptId: getCookie("deptId"),
            facType: 3,
            personName:$("#person_name").val()
        },
        pageSize: 10,
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'facNum',title:'垃圾箱编号',width:200},
            {field:'place',title:'所在位置',width:200,align:'center'},
            {field:'facName',title:'名称',width:150},
            {field:'msgLon',title:'经度',width:200,align:'center'},
            {field:'msgLat',title:'纬度',width:200,align:'center'},
            {field:'tPImg',title:'图片',width:200,align:'center'},
            {field:'personName',title:'负责人',width:200,align:'center'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
            text:'新增',
            id: "btnNewAdd",
            handler:function() {
                $('#addNew .titleText').text('新增垃圾箱');
                findPerson(getCookie("deptId"));
                getInput('facNum').val('');
                getInput('facName').val('');
                getInput('msgLon').val('');
                getInput('msgLat').val('');
                getInput('facPlace').val('');
                getInput('personName').val('');
                var index=layer.open({
                    type:1,
                    title:false,
                    area:'1200px',
                    shadeClose:false,
                    closeBtn:1,
                    content:$('#insertBeta'),
                    move:$('#insertBeta .title'),
                })
                $('#insertBeta .no').click(function(){layer.closeAll();
                });
                $('#insertBeta .yes').off('click');
                $('#insertBeta .yes').click(function(){
                    formData.facName=getInput('facName').val();
                    formData.facNum=getInput('facNum').val();
                    formData.msgLon=getInput('msgLon').val();
                    formData.msgLat=getInput('msgLat').val();
                    formData.place=getInput('facPlace').val();
                    formData.personId=getInput('personName').val();
                    formData.facType=3;
                    addFacilitiesInfo();
                    layer.close(index);
                });
            }
        },{
            text:'查看',
            id: "btnSelect",
            handler:function() {
            	$('#insertBeta .titleText').text('查看垃圾箱');
                var index=layer.open({
                    type:1,
                    title:false,
                    area:'1200px',
                    shadeClose:false,
                    closeBtn:1,
                    content:$('#insertBeta'),
                    move:$('#insertBeta .title'),
                })
               $('#insertBeta .no').click(function(){layer.closeAll();
                });
                $('#insertBeta .yes').off('click');
                $('#insertBeta .yes').click(function(){
                	formData.facilitiesId=faciliObj['facilitiesId'];
                /*	findFacilitiesInfo();*/
                	layer.close(index);
                });
            }
        },{
            text:'删除',
            id: "btnDelete",
            handler:function() {
            	getSelections();
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                })
                $('#delete .no').click(function(){layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function(){
               	 var str = idsArr.join(',');
               	 faciliObj['facilitiesIds']=str;
                    formData.facilitiesIds=faciliObj['facilitiesIds'];
                    delFacilitiesInfo();
                    layer.close(index);

                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            handler: function () {
                var rows = $("#dgrid").datagrid("getSelections");
                if(rows != null && rows.length > 0){
                    $('#insertBeta .titleText').text('修改垃圾箱');
                    findPerson(getCookie("deptId"));
                    getInput('facName').val(faciliObj['facName']);
                    getInput('msgLon').val(faciliObj['msgLon']);
                    getInput('msgLat').val(faciliObj['msgLat']);
                    getInput('facNum').val(faciliObj['facNum']);
                    getInput('personName').val(faciliObj['personName']);
                    getInput('facPlace').val(faciliObj['facPlace']);
                    var index=layer.open({
                        type: 1,
                        title: false,
                        area: "1200px",
                        shadeClose:false,
                        closeBtn: 1,
                        content: $("#insertBeta"),
                        move: $('#insertBeta .title')
                    })
                    $('#insertBeta .no').click(function(){layer.closeAll();
                    });
                    $('#insertBeta .yes').off('click');
                    $('#insertBeta .yes').click(function(){
                        formData.facName=getInput('facName').val();
                        formData.facNum=getInput('facNum').val();
                        formData.msgLon=getInput('msgLon').val();
                        formData.msgLat=getInput('msgLat').val();
                        formData.place=getInput('facPlace').val();
                        formData.personId=getInput('personName').val();
                        formData.facilitiesId=faciliObj['facilitiesId'];
                        formData.facType=3;
                        modFacilitiesInfo();
                        layer.close(index);
                    });
                }else{
                    alert("请选择需要修改的垃圾箱信息！");
                }

            }
        },{
            text: '刷新',
            id: "btnConfirm",
            handler: function () {
                $('#dgrid').datagrid('reload',applyListOpt.queryParams)
            }
        }
        ],
        onClickRow: function (index, row) {
        	formData.facilitiesId=row.facilitiesId;
            formData.facName=row.facName;
            formData.facNum=row.facNum;
            formData.msgLon=row.msgLon;
            formData.msgLat=row.msgLat;
            faciliObj['facilitiesId']=row.facilitiesId;
            faciliObj['facName']=row.facName;
            faciliObj['facNum']=row.facNum;
            faciliObj['msgLon']=row.msgLon;
            faciliObj['msgLat']=row.msgLat;
           // getSelections();
        },
        onLoadSuccess:function(){
        	$('.dgrid .show-detail').mouseover(function(){
                $(this).css({color:"#1874ad",cursor:"pointer"})
            }).mouseleave(function(){
                $(this).css({color:"#000",cursor:"pointer"})
            });
            $('.dgrid .show-detail').click(function(){
                var orderId=$(this).attr('data-href');

                setTimeout(function(){
                    $('#check-btn').trigger('click');
                },100);
            })
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    formData = {};//请求数据
    formData.facType=3;
    // formData.dictionaryType='dictionaryType';
    var faciliObj={
        facilitiesId:0,
        facilitiesIds:'',
        facName:'',
        facNum:'',
        msgLon:'',
        msgLat:''
    }
    var idsArr=[],namesArr=[];
  /*  findFacilitiesInfo($('#dgrid'),dgData);*/

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
            facType: 3,
            personName:$("#person_name").val()
        });
    }

    $('#findPersonInfo').click(function () {
            loads();
        }
    );

    function findFacilitiesInfo() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'facilitiesService/findFacilitiesInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                	dgData = data.data.fac;
                    $("#dgrid").datagrid('loadData',dgData);
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
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName)
        }
    }
})
