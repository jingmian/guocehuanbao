$(function () {
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'person/findAttRule',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            deptId:userDeptId
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'ruleName',title:'考勤名称',width:150,align:'left'},
            {field:'floatValue',title:'迟到',width:100,align:'right'},
            // {field:'lateValue',title:'迟到',width:100,align:'center'},
            {field:'leaveEarValue',title:'早退',width:100,align:'right'},
            {field:'abentValue',title:'旷工',width:100,align:'right'},
            {field:'abentValue1',title:'',width:500,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        fitColumns:false,
        buttons: [{
            text:'新增',
            id: "btnNewAdd",
            code:71,
            handler:function() {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('增加考勤设置');
                getInput('ruleName').val('');
                $('.floatValue').val('');
                // $('.lateValue').val('');
                $('.leaveEarValue').val('');
                $('.absentValue').val('');
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),

                })
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.ruleName=getInput('ruleName').val();
                    formData.floatValue=$('.floatValue').val();
                    // formData.lateValue=$('.lateValue').val();
                    formData.leaveEarValue=$('.leaveEarValue').val();
                    formData.absentValue=$('.absentValue').val();
                    if(validMustField()){
                        addAttRule();
                        layer.close(index);
                    }
                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            code:72,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要修改的考勤设置',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                $('#addNew .titleText').text('修改考勤设置');
                getInput('ruleName').val(perObj['ruleName']);
                $('.floatValue').val(perObj['floatValue']);
                // $('.lateValue').val(perObj['lateValue']);
                $('.leaveEarValue').val(perObj['leaveEarValue']);
                $('.absentValue').val(perObj['absentValue']);
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),

                })
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.id=perObj['id'];
                    formData.ruleName=getInput('ruleName').val();
                    formData.floatValue=$('.floatValue').val();
                    // formData.lateValue=$('.lateValue').val();
                    formData.leaveEarValue=$('.leaveEarValue').val();
                    formData.absentValue=$('.absentValue').val();
                    if(validMustField()){
                        modAttRule();
                        layer.close(index);
                    }
                });
            }
        },{
            text:'删除',
            id: "btnDelete",
            code:73,
            handler:function() {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要删除的考勤设置',{time:1000});
                    return;
                }
                if(row.length>0){
                    getSelections();
                }
                perObj['id']=idsArr.join(',');
                perObj['ruleName']=namesArr.join(',');
                $('#delName').text(perObj['ruleName']);
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                });
                $('#delete .no').click(function(){layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function(){
                    formData.ids=perObj['id'];
                    delAttRule();
                    layer.close(index);
                });
            }
        },{
            text:'导出',
            id: "btnExport",
            // iconCls: 'icon iconfont icon-daochu',
            handler:function() {
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'500px',
                    content:$('#export'),
                    move:$('#export .title')
                }));
                $('#export .no').click(function(){
                    layer.close(index)
                });

                $('#export .yes').off('click');
                $('#export .yes').click(function(){
                    var name=$('#excelFileName').val();
                    var d=time.getCurTime();
                    if(name==''){
                        lx.export({
                            // url:'order/orderExport',
                            data:{
                                recordStatus:10
                            },
                            success:lx.exportCallback
                        })
                    }else{
                        name=name+' '+d+'.xlsx';
                        lx.export({
                            // url:'order/orderExport',
                            data:{
                                recordStatus:10
                            },
                            success:lx.exportCallback
                        },name)
                    }
                });
            }
        }
        ],
        onClickRow: function (index, row) {
            perObj['id'] = row.ruleId;
            perObj['ruleName'] = row.ruleName;
            perObj['floatValue'] = row.floatValue;
            // perObj['lateValue'] = row.lateValue;
            perObj['leaveEarValue'] = row.leaveEarValue;
            perObj['absentValue'] = row.abentValue;
            getSelections();
        },
        onLoadError:function(){
            console.log(1)
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
    var formData = {};//请求数据
    var perObj={
        id:0,
        ids:'',
        ruleName:'',
        floatValue:0,
        // lateValue:0,
        leaveEarValue:0,
        absentValue:0,
    };
    var idsArr=[],namesArr=[];
    //查询考勤设置信息
    findAttRule();
    function findAttRule() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['personName']=$('#personName').val();
        applyListOpt.queryParams['ruleName']=perObj['personName'];
        findAttRule();
    })
    //新增考勤设置
    function addAttRule() {
        var cfg = {
            token: getCookie("token"),
            url: 'person/addAttRule',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findAttRule();
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
    //修改考勤设置
    function modAttRule() {
        var cfg = {
            token: getCookie("token"),
            url: 'person/modAttRule',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findAttRule();
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
    //删除考勤设置
    function delAttRule() {
        var cfg = {
            token: getCookie("token"),
            url: 'person/delAttRule',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findAttRule();
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
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].ruleId);
            namesArr.push(rows[i].ruleName)
        }
    }
    //获取下拉框值
    selectInput($('.floatValue'));
    // selectInput($('.lateValue'));
    selectInput($('.leaveEarValue'));
    selectInput($('.absentValue'));
    function selectInput($dom) {
        $dom.on('click change',function () {
            perObj['leaveType']=$(this).find('option:selected').val();
        })
    }
    //新增、修改按钮点击去掉红色边框
    removeValid();
})
