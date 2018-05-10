$(function () {
    var dgData = [];//表格数据
    var setting= {
        view:{
            showIcon:false,
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
        chkStyle: "checkbox",
        check: {
            chkboxType: {"Y" : "ps", "N" : "ps" },
            enable: true
        },
        callback: {
            onClick: zTreeClick
        }
    };//角色
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
            onClick: zTreeClick1
        }
    };//部门
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        // url:"package.json",  //请求地址
        //请求传递的参数
        queryParams: {
            pageSize: 20,
            pageNo: 1,
            gridType: 'easyui',
            recordStatus: 10
        },
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'userName',title:'用户名',width:200},
            {field:'userPhone',title:'联系电话',width:200,align:'center'},
            {field:'rolename',title:'角色',width:200,align:'center'},
            {field:'deptName',title:'部门名称',width:200,align:'center'}
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
                getInput('userName').val('')
                getInput('userPwd').val('')
                getInput('userPhone').val('')
                getInput('deptName').val('')
                var index=layer.open({
                    type:1,
                    title:false,
                    area:"500px",
                    shadeClose:true,
                    closeBtn:1,
                    content:$("#addNew"),
                    move:$('#addNew .title'),
                    success:function(){
                        $('.deptName').focus(function () {//选择上级部门
                                findDept($("#windowTree"));
                                var treeIndex=layer.open({
                                    title: false,
                                    closeBtn: 1,
                                    type: 1,
                                    shade:0,
                                    area:'400px',
                                    content: $('#form-Tree'),
                                    move:$('#form-Tree .form-top'),
                                    success: function () {
                                    }
                                });
                                $('#form-Tree .submit-btn').off();
                                $('#form-Tree .submit-btn').click(function(){
                                    layer.close(treeIndex);
                                });
                            });
                        }
                })
                $('#addNew .no').off('click');
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.userName=getInput('userName').val();
                    formData.userPwd=getInput('userPwd').val();
                    formData.userDeptId=treeObj1['deptId'];
                    getInput('userPhone').val();
                    addUser();
                    layer.close(index);
                    // if(isYzInput()==true){
                    //     addUser();
                    //     layer.close(index);
                    // }
                });
            }
        },{
            text:'分配',
            id: "btnAssign",
            handler:function() {
                findRole($("#treeDemo1"));
                var index=layer.open({
                    type:1,
                    title:false,
                    area:"644px",
                    shadeClose:true,
                    closeBtn:1,
                    content:$("#distrib"),
                    move:$('#distrib .title'),

                });
                $('#distrib .no').off('click');
                $('#distrib .no').click(function(){layer.closeAll();
                });
                $('#distrib .yes').off('click');
                $('#distrib .yes').click(function(){
                        layer.close(index);
                });
            }
        },{
            text:'删除',
            id: "btnDelete",
            handler:function() {
                getSelections();
                formData.ids=idsArr.join(',');
                $dCar.text(usersArr.join(','));
                var index=layer.open({
                    type:1,
                    title:false,
                    area:"300px",
                    shadeClose:true,
                    closeBtn:1,
                    content:$("#delete"),
                    move:$('#delete .title'),

                })
                $('#delete .no').off('click');
                $('#delete .no').click(function(){layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function(){
                    delUser();
                    layer.close(index);
                });
            }

        },{
            text: '修改',
            id: "btnApudate",
            handler: function () {
                getInput('userName').val(treeObj1['userName']);
                getInput('userPwd').val(treeObj1['userPwd']);
                getInput('userPhone').val(treeObj1['userPhone']);
                getInput('deptName').val(treeObj1['deptName']);
                var index=layer.open({
                    type:1,
                    title:false,
                    area:"500px",
                    shadeClose:true,
                    closeBtn:1,
                    content:$("#addNew"),
                    move:$('#addNew .title'),

                })
                $('#addNew .no').off('click');
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.userId=treeObj1['userId'];
                    formData.userName=getInput('userName').val();
                    formData.userPwd=getInput('userPwd').val();
                    formData.userPhone=getInput('userPhone').val();
                    formData.userDeptId=treeObj1['deptId'];
                    modUser();
                    layer.close(index);
                });
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
            treeObj1['userId'] = row.userId;
            treeObj1['userName']=row.userName;
            treeObj1['userPwd']=row.userPwd;
            treeObj1['userPhone']=row.userPhone;
            treeObj1['deptName']=row.deptName;
            treeObj1['deptId']=row.userDapt;
            getSelections();
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
    var nodes=[],deptNodes=[];
    var formData={},//请求数据
        mType='',//请求方法类型
        flag=0;//是否是第一次添加用户
    var $treeName=$(".m-from").find("ul.tree-name");
    var $dDName=$("#droleName");
    var treeObj={//用户树对象
        'roleName':'',
        'id':'',
        'roleNameParent':'',
        'pid':''
    };
    var treeObj1={
      'deptName':'',
      'deptId':'',
        'userName':'',
        'userId':0,
        'userPhone':'',
        'userPwd':''
    };
    var $roleName=$('.roleName'),roleArr=[];
    var $dCar=$('#d-car');
    var ids='',idsArr=[],usersArr=[];
    //验证输入框字段
    yzInput();
    function yzInput() {
        validState('phone','userPhone');
    }
    function isYzInput(stateIpt) {
        stateIpt=false;
        var state1=validState('phone','userPhone');
        if(state1==true){
            stateIpt=true;
        }else{
            stateIpt=false;
        }
        return stateIpt;
    }
    //查询角色
    function findRole($dom) {
        var cfg={
            token:getCookie("toekn"),
            url:'systemRolePowerManage/findRole',
            data:{tree:'1'},
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    nodes=[];
                    var result=data.data;
                    if(result.length>0){
                        nodes=[];
                        flag=1;
                        for(var i=0,l=result.length;i<l;i++){
                            nodes.push({"id":result[i].roleId,"pId":result[i].pid,"name":result[i].roleName});
                        }
                    }else {
                        flag=0;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting, openNodes(nodes));
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
    //查询部门
    function findDept($dom) {
        var cfg={
            token:getCookie("toekn"),
            url:'department/findDept',
            data:{tree:'1'},
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    deptNodes=[];
                    var result=data.data.deptInfo;
                    if(result.length>0){
                        deptNodes=[];
                        for(var i=0,l=result.length;i<l;i++){
                            deptNodes.push({"id":result[i].deptId,"pId":result[i].pId,"name":result[i].deptName});
                        }
                    }
                    $.fn.zTree.init($dom, setting1, openNodes(deptNodes));
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
    //查询用户
    findUser();
    function findUser() {
        var cfg={
            token:getCookie("toekn"),
            url:'user/findUser',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    dgData = data.data.data;
                    if(dgData.length>0){
                        $("#dgrid").datagrid('loadData',dgData);
                    }
                }else if(data.code==2 || data.code==1){
                    tokenRequest(function(){
                        wulianAjax(cfg);
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
    //新增用户
    function addUser(){
        var cfg={
            token:getCookie("toekn"),
            url:'user/addUser',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    formData={};
                    findUser();
                    layer.msg('用户添加成功！', {
                        time: 1000
                    });
                }else if(data.code==2 || data.code==1){
                    tokenRequest(function(){
                        wulianAjax(cfg);
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
    //修改用户
    function modUser() {
        var cfg={
            token:getCookie("toekn"),
            url:'user/modUser',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    formData={};
                    findUser();
                    layer.msg('用户修改成功！', {
                        time: 1000
                    });
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
    //删除用户
    function delUser() {
        var cfg={
            token:getCookie("toekn"),
            url:'user/delUser',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    formData={};
                    findUser();
                    layer.msg('用户删除成功！', {
                        time: 1000
                    });
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
    //角色单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("treeDemo1"),
            parentNode=treeNode.getParentNode();
        // zTree.expandNode(treeNode);//节点单击展开/收缩
        var selectedNodes=zTree.getCheckedNodes(true);
        var roleIdArr=[],roleNameArr=[];
        for(var i in selectedNodes){
            roleIdArr.push(selectedNodes[i].id);
            roleNameArr.push(selectedNodes[i].name);
        }
        treeObj['id']=roleIdArr.join(',');
        treeObj['roleName']=roleNameArr.join(',');
        $roleName.val(treeObj['roleName'])
    };
    //部门单击
    function zTreeClick1(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        treeObj1['deptId']=treeNode.id;
        treeObj1['deptName']=treeNode.name;
        getInput('deptName').val(treeObj1['deptName']);
    };
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        usersArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].userId);
            usersArr.push(rows[i].userName)
        }
    }
})
