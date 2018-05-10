$(function () {
    var setting = {
        view:{
            showIcon:true,
            txtSelectedEnable: true,
            showLine: true
        },
        data:{
            simpleData:{
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
    var setting1 = {
        view:{
            showIcon:true,
            txtSelectedEnable: true,
            showLine: true
        },
        data:{
            simpleData:{
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
    var setting2 = {
        view:{
            showIcon:true,
            txtSelectedEnable: true,
            showLine: true
        },
        data:{
            simpleData:{
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: zTreeClick3
        }
    };

    $('.deptId').click(function () {
        findDept($('#windowTree'));
        var index1=layer.open({
            type: 1,
            title: false,
            area: "400px",
            shade:0,
            closeBtn: 1,
            content: $("#dept-form-Tree"),
            move: $('#dept-form-Tree .form-top')
        });

        $('#dept-form-Tree .close').off('click');
        $('#dept-form-Tree .close').click(function(){
            layer.closeAll();
        });
        $('#dept-form-Tree .submit-btn-yes').off('click');
        $('#dept-form-Tree .submit-btn-yes').click(function(){
            layer.close(index1);
        });
    });
    $('.personName').focus(function () {
        findPerson2($('#windowTree1'));
        var index2=layer.open({
            type: 1,
            title: false,
            area: "400px",
            shade:0,
            closeBtn: 1,
            content: $("#pers-form-Tree"),
            move: $('#pers-form-Tree .form-top')
        });
        $('#pers-form-Tree .close').off('click');
        $('#pers-form-Tree .close').click(function(){
            layer.closeAll();
        });
        $('#pers-form-Tree .submit-btn').off('click');
        $('#pers-form-Tree .submit-btn').click(function(){
            layer.close(index2);
        });
    });

    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'person/findRealAttend',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            deptId:userDeptId,
            type:5
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'deptName',title:'用户部门',width:150,align:'left'},
            {field:'personName',title:'人员名称',width:150,align:'center'},
            {field:'makeUpPerson',title:'补录人',width:100,align:'center'},
            {field:'makeUpTime',title:'补录时间',width:150,align:'center'},
            {field:'recordTime',title:'考勤时间',width:150,align:'center'},
            // {field:'idCardNum',title:'身份证号',width:100,align:'center'},
            {field:'makeUpReson',title:'补录原因',width:200,align:'center'},
            {field:'personType',title:'工种',width:100,align:'center'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
            text:'新增',
            id: "btnNewAdd",
            code:67,
            handler:function() {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('新增数据补录');
                $('#addNew .personName').removeAttr('disabled');
                $('.makeupPersonId').val(getCookie('userName'));
                getInput('deptId').val('');
                getInput('personName').val('');
                getInput('recordTime').val('');
                getInput('makeupTime').val('');
//                getInput('makeUpPerson').val('');
                $('#addNew .makeUpReson').val('');
//                $('.makeUpPerson').focus(function () {
//                    findPerson1($('#windowTree2'));
//                    var index2=layer.open({
//                        type: 1,
//                        title: false,
//                        area: "400px",
//                        shade:0,
//                        closeBtn: 1,
//                        content: $("#pers-form-Tree1"),
//                        move: $('#pers-form-Tree1 .form-top')
//                    });
//                    $('#pers-form-Tree1 .close').click(function(){
//                        layer.closeAll();
//                    });
//                    $('#pers-form-Tree1 .submit-btn').click(function(){
//                        layer.close(index2);
//                    });
//                })
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')

                });
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.deptId=perObj['deptId'];
                    formData.personId=perObj['personId'];
//                    formData.personName=getInput('personName').val();
                    formData.recordTime=getInput('recordTime').val();
                    formData.makeupTime=getInput('makeupTime').val();
                    formData.makeupReson=getInput('makeupReson').val();
                    formData.makeupPersonId=userId;
                    if(validMustField()){
                        addMakeUp(index);
                    }
                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            code:68,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要修改的数据补录',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                $('#addNew .titleText').text('修改数据补录');
                $('#addNew .personName').attr('disabled','disabled');
                var option="<option>"+perObj['personName']+"</option>";
                $('#addNew .personName').html(option);
                $('#addNew .personName').val(perObj['personName']);
                getInput('recordTime').val(perObj['recordTime']);
                perObj['recordTime1']=perObj['recordTime'];
                getInput('makeupTime').val(perObj['makeUpTime']);
                getInput('makeupPersonId').val(perObj['makeUpPerson']);
                getInput('makeupReson').val(perObj['makeUpReson']);
                getInput('deptId').val(perObj['deptName']);

//                $('.makeUpPerson').focus(function () {
//                    findPerson1($('#windowTree2'));
//                    var index2=layer.open({
//                        type: 1,
//                        title: false,
//                        area: "400px",
//                        shade:0,
//                        closeBtn: 1,
//                        content: $("#pers-form-Tree1"),
//                        move: $('#pers-form-Tree1 .form-top')
//                    });
//                    $('#pers-form-Tree1 .close').off('click');
//                    $('#pers-form-Tree1 .close').click(function(){
//                        layer.closeAll();
//                    });
//                    $('#pers-form-Tree1 .submit-btn').off('click');
//                    $('#pers-form-Tree1 .submit-btn').click(function(){
//                        layer.close(index2);
//                    });
//                })
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')

                })
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.personId=perObj['personId'];
                    formData.id=perObj['id'];
//                    formData.personId1=perObj['personId1'];
                    formData.recordTime=getInput('recordTime').val();
                    formData.makeupTime=getInput('makeupTime').val();
                    formData.makeupPersonId=userId;
//                    formData.recordTime1=perObj['recordTime1'];
//                    formData.makeupTime=getInput('makeupTime').val();
//                    formData.makeUpPerson=getInput('makeUpPerson').val();
                    formData.makeupReson=$('.makeupReson').val();
//                    formData.deptId=perObj['deptId'];
//
//                    formData.makeupReson=getInput('makeupReson').val();
                    if(validMustField()){
                        modMakeUp(index);
                    }
                });
            }
        },{
            text:'删除',
            id: "btnDelete",
            code:69,
            handler:function() {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要删除的数据补录',{time:1000});
                    return;
                }
                perObj['id']=idsArr.join(',');
                $('#dInfo').text(namesArr.join(','));
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
                    formData.id=perObj['id'];
                    delMakeUp();
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
            perObj['id']=row.id;
            perObj['personId'] = row.personId;
            perObj['personName'] = row.personName;
            perObj['personId1'] = row.personId;
            perObj['recordTime'] = row.recordTime;
            perObj['recordTime1'] = row.recordTime;
            perObj['makeUpTime'] = row.makeUpTime;
            perObj['makeUpPerson'] = row.makeUpPerson;
            perObj['makeUpReson'] = row.makeUpReson;
            perObj['deptName'] = row.deptName;
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
        id:'',
        personId:0,
        personName:'',
        personId1:0,
        personName1:'',
        makeUpPerson:'',
        recordTime:'',
        recordTime1:'',
        makeupTime:'',
        deptId:userDeptId,
        deptName:'',
        type:5
    };
    var idsArr=[],namesArr=[];
    var $dateFmt="yyyy-MM-dd";
    var $dateFmt1="yyyy-MM-dd HH:mm:ss";
    $('#time1').focus(function () {
        WdatePicker({el: 'time1',dateFmt:$dateFmt});
    });
    $('#time2').focus(function () {
        WdatePicker({el: 'time2',dateFmt:$dateFmt1});
    });
    //查询出勤信息
    function findRealAttend() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['personName']=$('#personName').val();
        applyListOpt.queryParams['personName']=perObj['personName'];
        findRealAttend();
    });
    //新增补录
    function addMakeUp(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'person/addMakeUp',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRealAttend();
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
    //删除补录
    function delMakeUp() {
        var cfg = {
            token: getCookie("token"),
            url: 'person/delMakeUp',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRealAttend();
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
    //修改补录
    function modMakeUp(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'person/modMakeUp',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRealAttend();
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
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].id);
            namesArr.push(rows[i].personName)
        }
    }
    //查找部门
    function findDept($dom) {
        var arr1=[];
        formData={};
        formData.deptId=getCookie('deptId');
        var cfg={
            token:getCookie("token"),
            url:'department/findDeptTree',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result=data.data;
                    if(result.length>0){
                        // flag=0;
                        for(var i=0,l=result.length;i<l;i++){
                            arr1.push({"id":result[i].deptId,"pId":result[i].pid,"name":result[i].deptName});
                        }
                    }else {
                        // flag=1;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting, openNodes(arr1));
                }else if(data.code==2 || data.code==1){
                    tokenRequest(function(){
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
    //查找人员
    function findPerson2($dom) {
        formData={};
        formData.id=perObj['deptId'];
        formData.pageSize=1000;
        var arr2=[];
        var cfg={
            token:getCookie("token"),
            url:'person/findPerson',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result=data.data.data;
                    if(result.length>0){
                        // flag=0;
                        for(var i=0,l=result.length;i<l;i++){
                            arr2.push({"id":result[i].personId,"pId":result[i].picId,"name":result[i].personName});
                        }
                    }else {
                        // flag=1;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting1, openNodes(arr2));
                }else if(data.code==2 || data.code==1){
                    tokenRequest(function(){
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
    //查找人员(补录)
    function findPerson1($dom) {
        formData={};
        formData.id=perObj['deptId'];
        formData.pageSize=1000;
        var arr3=[];
        var cfg={
            token:getCookie("token"),
            url:'person/findPerson',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result=data.data.data;
                    if(result.length>0){
                        // flag=0;
                        for(var i=0,l=result.length;i<l;i++){
                            arr3.push({"id":result[i].personId,"pId":result[i].picId,"name":result[i].personName});
                        }
                    }else {
                        // flag=1;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting2, openNodes(arr3));
                }else if(data.code==2 || data.code==1){
                    tokenRequest(function(){
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
    function openNodes(arr){
        for(var i=0;i<arr.length;i++){
            arr[i].open=true;
            if(arr[i].pId==0){
                arr[i].iconSkin="treeRoot";
            }else{
                arr[i].iconSkin="child";
            }
        }
        return arr;
    }
    //部门单击
    function zTreeClick1(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        perObj['deptId']=treeNode.id;
        perObj['deptName']=treeNode.name;
        $('.deptId').val(treeNode.name);
    };
    //人员单击(用户名称)
    function zTreeClick2(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree1"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes=zTree.getCheckedNodes(true);
        perObj['personId']=treeNode.id;
        perObj['personName']=treeNode.name;
        $('.personName').val(perObj['personName']);
    };
    //人员单击(补录人)
    function zTreeClick3(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree2"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes=zTree.getCheckedNodes(true);
        perObj['makeUpPerson']=treeNode.name;
        $('.makeUpPerson').val(perObj['makeUpPerson']);
    };
    //新增、修改按钮点击去掉红色边框
    removeValid();
})
