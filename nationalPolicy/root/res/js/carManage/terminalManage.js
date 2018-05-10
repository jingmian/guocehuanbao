$(function () {
    //表单验证
    var validationUp=$('#addNew').validationUp({
        rules:{
            equipmentNum:{
                notEmpty:true
               // mustBeNum:true
            },
            simNum:{
                notEmpty:true,
                mustBeNum:true
            }
        },
        errorMsg:{
            equipmentNum:{
                notEmpty:'终端编号不能为空'
               // mustBeNum:'终端编号必须为数字'
            },
            simNum:{
                notEmpty:'sim卡号不能为空',
                mustBeNum:'sim卡号必须为数字'
            }
        },
        submit:{
            submitBtn:$('#addNew .yes'),
            validationEvent:'blur change',
            errorMsgIcon:'icon iconfont icon-cuowu1'
        }
    });

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
    var nodes=[];
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'equipment/findEquipment',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            name:'',
            equipmentType:'1,2,3',
            deptId:userDeptId
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'equipmentId',hidden:true},
            {field:'deptName',title:'所属部门',width:150,align:'left'},
            {field:'equipmentNum',title:'终端号',width:150,align:'center'},
            {field:'simNum',title:'sim卡号',width:100,align:'center'},
            {field:'simState',title:'设备状态',width:100,align:'center'},
            {field:'carNum',title:'挂接车辆',width:150,align:'center'},
            {field:'equipmentType',field1:'equipmentType',title:'终端类型',width:150,align:'center',formatter:function(value,row,index){
                if(value=='0'){
                    value='人员终端'
                }else if(value=='1'){
                    value='GPS终端(无油量)'
                }else if(value=='2'){
                    value='GPS终端(有油量)'
                }else if (value=='3'){
                    value='视频终端'
                }
                return value;
            }},
            {field:'equipProcotol',field1:'equipProcotol',title:'协议类型',width:100,align:'center'},
            {field:'remark',title:'备注',width:300,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectonSelect:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [
        {
            text:'新增',
            id: "btnNewAdd",
            code:125,
            handler:function() {
                $('#addNew .titleText').text('新增车辆终端');
                lx.clearRows(); //取消选中行
                lx.initFormElm( $('#addNew') ); //初始化表单元素
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')
                });
                $('#addNew .no').click(function(){layer.close(index)});
                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit:{
                        doSubmitFn:function(formData){
                            perObj['equipmentType']=$('#addNew .equipmentType').val();
                            formData.deptId=perObj['deptId'];
                            addEquipment(formData,index);
                        }
                    }
                });
            }
        },
        {
            text: '修改',
            id: "btnApudate",
            code:126,
            handler: function () {
                var row=lx.judge($('#dgrid'),'修改','equipmentId');
                if(! row){
                    return;
                }
                //equipmentId 查询终端
                lx.paddingFormElm($('#addNew'),row);
                $('#addNew .titleText').text('修改车辆终端');
                $('#addNew').find('.deptName').val(row.deptName);
                $('#addNew').find('.equipmentType').val(row.equipmentType);
                $('#addNew').find('.simState').val(row.simState);
                $('#addNew').find('.equipProcotol').val(row.equipProcotol);
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
                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit:{
                        doSubmitFn:function(formData){
                            perObj['equipmentType']=$('#addNew .equipmentType').val();
                            formData.deptId=perObj['deptId'];
                            formData.id=row.equipmentId;
                            modEquipment(formData,index);
                        }
                    }
                });
            }
        },
        {
            text:'绑定',
            id: "btnBinding",
            code:127,
            handler:function() {
                var row=lx.judge($('#dgrid'),'绑定','equipmentId');
                if(! row){
                    return;
                }
                if(row.carId!=null && row.carNum!=''){//未绑定车辆
                    layer.msg('当前设备已挂接车辆,请先解绑',{time:1000});
                    return ;
                }
                findCar2($('#windowTree1'));
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
                        layer.msg('请选择要挂接的车辆',{timer:1000});
                        return;
                    }
                    formData={};
                    formData.equipmentId=perObj['id'];
                    formData.relCarId=perObj['relCarId'];
                    formData.equipmentType=perObj['equipmentType'];
                    bindEquipment(index2);
                });
            }
        },
        {
            text:'解绑',
            id: "btnUnbinding",
            code:128,
            handler:function() {
                var row=lx.judge($('#dgrid'),'解绑','equipmentId');
                if(! row){
                    return;
                }
                if(row.carId=='0' && row.carNum==''){//未绑定车辆
                    layer.msg('当前设备未挂接车辆',{time:1000});
                    return ;
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
                    formData.relCarId=perObj['relCarId'];
                    formData.equipmentType=perObj['equipmentType'];
                    unBindEquipment(index2);
                });
            }
        },
        {
            text:'删除',
            id: "btnDelete",
            code:129,
            handler:function() {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要删除的数据',{time:1000});
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
                $('#delete .no').click(function(){layer.close(index)});
                $('#delete .yes').off('click');
                $('#delete .yes').click(function(){
                    formData.ids=perObj['id'];
                    formData.equipmentType=perObj['equipmentType'];
                    delEquipment(index);
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
        }],
        onSelect: function (index, row) {
            perObj['id'] = row.equipmentId;
            perObj['deptName'] = row.deptName;
            perObj['equipmentNum'] = row.equipmentNum;
            perObj['simNum'] = row.simNum;
            perObj['simState'] = row.simState;
            perObj['relCarId'] = row.carId;
            perObj['carNum'] = row.carNum;
            perObj['remark'] = row.remark;
            perObj['equipmentType'] = row.equipmentType;
            perObj['deptId'] = row.deptId;
            
            getSelections();
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
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
        equipmentType:'1,2,3',
        remark:'',
        onlineState:1,
        equipProcotol:'',
        deptId:userDeptId
    };
    var $dateFmt="yyyy-MM-dd";
    timeControl($('#time1'),'time1',$dateFmt);
    timeControl($('#time2'),'time2',$dateFmt);
    timeControl($('#time3'),'time3',$dateFmt);
    var idsArr=[],namesArr=[];
    //查询终端
    // findEquipment();
    function findEquipment() {
        perObj['name_num']=$('.name_num').val();
        applyListOpt.queryParams['name']=perObj['name_num'];
        applyListOpt.queryParams['deptId']=perObj['deptId'];
        $('#dgrid').datagrid('reload');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['carNum']=$('#carNum').val();
        applyListOpt.queryParams['carNum']=perObj['carNum'];
        findEquipment();
    });
    //新增终端
    function addEquipment(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/addEquipment',
            data: jData,
            success: function (data) {
                findEquipment();
                layer.close(indexPop);
                layer.msg('终端新增成功', {time: 1000});
            }
        };
        customAjax(cfg);
    }
    //修改终端
    function modEquipment(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/modEquipment',
            data: jData,
            success: function (data) {
                findEquipment();
                layer.close(indexPop);
                layer.msg('终端修改成功', {time: 1000});
            }
        };
        customAjax(cfg);
    }
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
    //删除终端
    function delEquipment(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/delEquipment',
            data: formData,
            success: function (data) {
                findEquipment();
                layer.close(indexPop);
                layer.msg('终端删除成功', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }
    //绑定终端管理
    function bindEquipment(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/bindEquipment',
            data: formData,
            success: function (data) {
                findEquipment();
                layer.close(indexPop);
                layer.msg('绑定成功', {
                    time: 1000
                });
            }
        };
        wulianAjax(cfg);
        flag=false;
    }
    //解绑终端管理
    function unBindEquipment(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'equipment/removeEquipment',
            data: formData,
            success: function (data) {
                findEquipment();
                layer.close(indexPop);
                layer.msg('解绑成功',{time: 1000});
            }
        };
        customAjax(cfg);
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
    //查找车辆
    function findCar2($dom) {
        formData={};
        formData.deptId=perObj['deptId'];
        var arr2=[];
        var cfg={
            token:getCookie("token"),
            url:'car/findWithoutCar',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result=data.data;
                    if(result.length>0){
                        // flag=0;
                        for(var i=0,l=result.length;i<l;i++){
                            arr2.push({"id":result[i].carId,"pId":result[i].carId,"name":result[i].CarNum});
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
    //人员单击(用户名称)
    var flag=false;//判断车辆是否被点击
    function zTreeClick2(event, treeId, treeNode) {
        flag=true;
        var zTree=$.fn.zTree.getZTreeObj("windowTree1"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes=zTree.getCheckedNodes(true);
        perObj['relCarId']=treeNode.id;
        perObj['relCarName']=treeNode.name;
        $('#addNew .relPersonId').val(perObj['relCarName']);
    };
    /*//新增、修改按钮点击去掉红色边框
    removeValid();*/
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
