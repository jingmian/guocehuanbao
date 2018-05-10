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
            onClick: zTreeClick
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
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'equipment/findEquipment',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            id:userDeptId,
            deptId:userDeptId,
            equipmentType:'0'
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'deptName',title:'所属部门',width:150,align:'left'},
            {field:'equipmentNum',title:'终端号',width:150,align:'center'},
            {field:'simNum',title:'sim卡号',width:150,align:'center'},
            {field:'simState',title:'设备状态',width:100,align:'center'},
            {field:'personName',title:'挂接人员',width:150,align:'center'},
            {field:'equipmentType',field1:'equipmentType',title:'终端类型',width:100,align:'center',formatter:function(value,row,index){
                if(value=='0'){value='人员终端'}
                return value;
            }},
            {field:'equipProcotol',field1:'equipProcotol',title:'协议类型',width:100,align:'center'},
            {field:'remark',title:'备注',width:300,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
            text:'新增',
            id: "btnNewAdd",
            code:75,
            handler:function() {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('新增人员终端');
                getInput('deptName').val('');
                getInput('equipmentNum').val('');
                getInput('simNum').val('');
                getInput('simState').val('');
                $('.remark').val('');
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
                    formData.equipmentNum=getInput('equipmentNum').val();
                    formData.simNum=getInput('simNum').val();
                    formData.simState=getInput('simState').val();
                    formData.equipmentType=perObj['equipmentType'];
                    formData.equipProcotol=$('#addNew .equipProcotol').val();
                    formData.remark=$('.remark').val();
                    if(validMustField()){
                        addEquipment(index);
                    }
                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            code:76,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要修改的终端信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                $('#addNew .titleText').text('修改人员终端');
                getInput('equipmentNum').val(perObj['equipmentNum']);
                $('#addNew .deptName').val(perObj['deptName']);
                $('.simNum').val(perObj['simNum']);
                $('.remark').val(perObj['remark']);
                $('.simState').val(perObj['simState']);
                $('.equipProcotol').val(perObj['equipProcotol']);
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
                    formData.id=perObj['id'];
                    formData.deptId=perObj['deptId'];
                    formData.equipmentNum=getInput('equipmentNum').val();
                    formData.simNum=$('.simNum').val();
                    formData.simState=getInput('simState').val();
                    formData.remark=$('.remark').val();
                    formData.equipmentType=perObj['equipmentType'];
                    formData.equipProcotol=$('#addNew .equipProcotol').val();
                    if(validMustField()){
                        modEquipment(index);
                    }
                });
            }
        },{
            text:'绑定',
            id: "btnBinding",
            code:77,
            handler:function() {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要绑定的终端信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                    if(row[row.length-1]['personId']!=null){
                        layer.msg('当前设备已挂接人员,请先解绑！',{time:1000});
                        return;
                    }
                }
                $('#pers-form-Tree .equipmentNum1').text(perObj['equipmentNum']);
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
                $('.layui-layer-close').off('click');
                $('.layui-layer-close').click(function(){
                    layer.closeAll();
                    flag=false;
                });
                $('#pers-form-Tree .submit-btn').off('click');
                $('#pers-form-Tree .submit-btn').click(function(){
                    if(flag==false){
                        layer.msg('请选择要挂接的人员',{timer:1000});
                        return;
                    }
                    formData={};
                    formData.equipmentId=perObj['id'];
                    formData.relPersonId=perObj['relPersonId'];
                    formData.equipmentType=perObj['equipmentType'];
                    bindEquipment();
                    layer.close(index2);
                });
            }
        },{
            text:'解绑',
            id: "btnUnbinding",
            code:78,
            handler:function() {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要解绑的终端信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                    if(row[row.length-1]['personId']==null){
                        layer.msg('当前设备未挂接人员！',{time:1000});
                        return;
                    }
                }
                $('#delName1').text(perObj['equipmentNum']);
                var index2=layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete1"),
                    move: $('#delete1 .title')
                });
                $('#delete1 .no').click(function(){layer.closeAll();
                });
                $('#delete1 .yes').off('click');
                $('#delete1 .yes').click(function(){
                    formData={};
                    formData.equipmentId=perObj['id'];
                    formData.relPersonId=perObj['relPersonId'];
                    formData.equipmentType=perObj['equipmentType'];
                    unBindEquipment();
                    layer.close(index2);
                });
            }
        },{
            text:'删除',
            id: "btnDelete",
            code:79,
            handler:function() {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要删除的终端信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    getSelections();
                }
                perObj['equipmentNum']=namesArr.join(',');
                $('#delName').text(perObj['equipmentNum']);
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
                    formData.equipmentType=perObj['equipmentType'];
                    delEquipment();
                    layer.close(index);
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
        onSelect: function (index, row) {
            perObj['id'] = row.equipmentId;
            perObj['deptName'] = row.deptName;
            perObj['equipmentNum'] = row.equipmentNum;
            perObj['simNum'] = row.simNum;
            perObj['simState'] = row.simState;
            perObj['relPersonId'] = row.personId;
            perObj['relPersonName'] = row.personName;
            perObj['remark'] = row.remark;
            perObj['equipmentType'] = row.equipmentType;
            perObj['equipProcotol'] = row.equipProcotol;
            perObj['deptId'] = row.deptId;
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
    //标题选择
    var $lTList=$(".lTList");
    var $lTLi=$lTList.find("li");
    $lTLi.eq(0).addClass("lTActive");
    $lTLi.click(function () {
        var index=$(this).index();
        $(this).addClass("lTActive").siblings().removeClass("lTActive");
        perObj['onlineState']=index;
        findEquipment();
    });
    var formData = {};//请求数据
    var perObj={
        id:0,
        deptName:'',
        equipmentNum:'',
        simNum:0,
        simState:'',
        onlineTime:0,
        registerTime:'',
        expireTime:'',
        relPersonId:0,
        equipmentType:'0',
        remark:'',
        onlineState:0,
        deptId:userDeptId
    };
    var idsArr=[],namesArr=[];
    var $dateFmt="yyyy-MM-dd";
    $('#time1').focus(function () {
        WdatePicker({el: 'time1',dateFmt:$dateFmt});
    });
    $('#time2').focus(function () {
        WdatePicker({el: 'time2',dateFmt:$dateFmt});
    });
    $('#time3').focus(function () {
        WdatePicker({el: 'time3',dateFmt:$dateFmt});
    });
    //查询终端
    // findEquipment();
    function findEquipment() {
        perObj['name_num']=getInput('name_num').val();
        applyListOpt.queryParams['equipmentType']=perObj['equipmentType'];
        applyListOpt.queryParams['name']=perObj['name_num'];
        applyListOpt.queryParams['deptId']=perObj['deptId'];
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['carNum']=$('#carNum').val();
        applyListOpt.queryParams['carNum']=perObj['carNum'];
        findEquipment();
    });
    //导出
    function exFun() {
        layer.open({
            type: 1,
            title: '终端信息-导出',
            //area: ['420px'], //宽高
            //content: '',
            btn: ['导出当前', '导出全部'],
            yes: function () {
            	var dataOpt=$('#dgrid').datagrid('options');
            	console.log(dataOpt);
            	applyListOpt.queryParams['pageSize']=dataOpt.pageSize;
            	applyListOpt.queryParams['pageNumber']=dataOpt.pageNumber;
                var opt = {
                    name: '终端信息',
                    pram: applyListOpt.queryParams,           
                    url: 'equipment/exportEquipment',
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
                    name: '终端信息',
                    pram: applyListOpt.queryParams,           
                    url: 'equipment/exportEquipment',
                    recType: 'POST'
                }
                exportFile(opt);
                /*if (carDeptId == null) {
                    delete(pram.deptId);
                }
                if (carVNo == null) {
                    delete(pram.vehicleNo);
                }
                if (carSimNo == null) {
                    delete(pram.simNo);
                }
                if (carTremNo == null) {
                    delete(pram.termNo);
                }

                var opt = {
                    name: '终端信息',
                    pram: pram,
                    url: 'equipment/exportEquipment',
                    recType: 'POST'
                }
                exportFile(opt);
                return false*/
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
    
    //增加终端管理
    function addEquipment(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/addEquipment',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findEquipment();
                    layer.msg(data.msg, {
                        time: 1000
                    });
                    layer.close(index);
                    findEquipment();
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
    //修改终端管理
    function modEquipment(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/modEquipment',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findEquipment();
                    layer.msg(data.msg, {
                        time: 1000
                    });
                     layer.close(index);
                     findEquipment();
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
    //删除终端管理
    function delEquipment() {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/delEquipment',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findEquipment();
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
    //绑定终端管理
    function bindEquipment() {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/bindEquipment',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findEquipment();
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
        flag=false;
    }
    //解绑终端管理
    function unBindEquipment() {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/removeEquipment',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findEquipment();
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
            idsArr.push(rows[i].equipmentId);
            namesArr.push(rows[i].equipmentNum)
        }
    }
    //查找人员
    function findPerson2($dom) {
        formData={};
        formData.id=perObj['deptId'];
        var arr2=[];
        var cfg={
            token:getCookie("toekn"),
            url:'person/findWithoutPerson',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result=data.data;
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
    findDept($('#treeDemo'));
    //部门树信息
    function findDept($dom) {
        formData={};
        formData.deptId=perObj['deptId'];
        var cfg={
            token:getCookie("toekn"),
            url:'department/findDeptTree',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    nodes=[];
                    var result=data.data;
                    if(result.length>0){
                        nodes=[];
                        for(var i=0,l=result.length;i<l;i++){
                            nodes.push({"id":result[i].deptId,"pId":result[i].pid,"name":result[i].deptName});
                        }
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
    //单击（部门）
    function zTreeClick(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("deptTree");
        perObj['deptId']=treeNode.id;
        perObj['deptName']=treeNode.name;
        $deptName.val(perObj['deptName']);
        findEquipment();
    };
    var flag=false;//判断人员树是否被点击
    //人员单击(用户名称)
    function zTreeClick2(event, treeId, treeNode) {
        flag=true;
        var zTree=$.fn.zTree.getZTreeObj("windowTree1"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes=zTree.getCheckedNodes(true);
        perObj['relPersonId']=treeNode.id;
        perObj['relPersonName']=treeNode.name;
        $('#addNew .relPersonId').val(perObj['relPersonName']);
    };
    //新增、修改按钮点击去掉红色边框
    removeValid();
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
    seniorSearch('#seniorSearchBtn',applyListOpt,['equipProcotol','equipmentType']);
})
