/*
* 增删改 功能的实现 12/26
* by 陆旋
* */
$(function () {
    //表单验证
    var validationUp=$('#addNew').validationUp({
        rules:{
            carId:{
                notEmpty:true
            },
            illegalMoney:{
                notEmpty:true,
                money:true
            },
            illegalTime:{
                notEmpty:true
            },
            illegalPlace:{
                notEmpty:true
            }
        },
        errorMsg:{
            carId:{
                notEmpty:'车牌号不能为空'
            },
            illegalMoney:{
                notEmpty:'违章金额不能为空',
                money:'金额格式不正确,最多保留小数点后两位'
            },
            illegalTime:{
                notEmpty:'违章时间不能为空'
            },
            illegalPlace:{
                notEmpty:'违章地点不能为空'
            }
        },
        submit:{
            submitBtn:$('#addNew .yes'),
            validationEvent:'blur change',
            errorMsgIcon:'icon iconfont icon-cuowu1'
        }
    });
    //ztree配置
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
            onClick: zTreeClick,
        }
    };
    var nodes=[];
    //时间格式
    var $dateFmt="yyyy-MM-dd";
    var formData = {};//请求数据
    var perObj={
        id:0,
        deptId:userDeptId,
        deptName:'',
        carId:0,
        illegalTime:'',
        illegalContent:'',
        illegalPlace:'',
        userId:userId,
        illegalMoney:'',
        moneyBefore:0,
        illTimeBefore:0,
        illegalAgentName:''
    };
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'cost/findIllegal',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            carNum:'',
            deptId:userDeptId
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'id',hidden:true},
            {field:'dept',title:'所属部门',width:150,align:'left'},
            {field:'carNum',title:'车牌号',width:150,align:'center'},
            {field:'illegalType',title:'类型',width:100,align:'center',formatter:function(value){
                if(value==0){value='违章'}
                if(value==1){value='事故'}
                if(value==2){value='其他'}
                return value;
            }},
            {field:'illegalMoney',title:'费用(元)',width:100,align:'right'},
            {field:'illegalAgentName',title:'缴费人',width:120,align:'center'},
            {field:'illegalTime',title:'时间',width:120,align:'center'},
            {field:'illegalPlace',title:'地点',width:300,align:'left'},
            {field:'illegalContent',title:'内容',width:300,align:'left'}
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
            code:121,
            handler:function() {
            	lx.clearRows(); //清除选中的行
                lx.initFormElm($('#addNew'));//初始化表单元素
                $('#addNew .titleText').text('新增安全管理');
                $('#carId').empty();
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
                            if($('#illegalContent').val()==''){
                                formData.illegalContent='';
                            }
                            if($('#illegalAgentName').val()==''){
                                formData.illegalAgentName='';
                            }
                            addIllegal(formData,index);
                        }
                    }
                });
            }
        },
        {
            text: '修改',
            id: "btnApudate",
            code:122,
            handler: function () {
                var row=lx.judge($('#dgrid'),'修改','id');
                if(! row){
                    return;
                }
                $('#addNew .titleText').text('修改安全管理');
                var rowDetail;
                searchMoneyById(row.id,function(data){
                    rowDetail=data.data.data[0];
                    lx.paddingFormElm($('#addNew'),rowDetail); //填充表单元素
                    //回显部门 ，车辆列表
                    $('#addNew .dept').attr('keyid',rowDetail.deptId);
                    findCar_1(rowDetail.deptId,rowDetail.carId);
                });

                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')
                });
                $('#addNew .no').click(function() { layer.close(index)});
                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit: {
                        doSubmitFn: function (formData) {
                            formData.id = rowDetail.id;
                            formData.userId = perObj['userId'];
                            formData.moneyBefore = rowDetail.illegalMoney;
                            formData.illTimeBefore = rowDetail.illegalTime;
                            formData.carIdBrfore = rowDetail.carId;
                            if ($('#illegalContent').val() == '') {
                                formData.illegalContent = '';
                            }
                            if($('#illegalAgentName').val()==''){
                                formData.illegalAgentName='';
                            }
                            modIllegal(formData, index);
                        }
                    }
                });
            }
        },
        {
            text: '删除',
            id: "btnDelete",
            code:123,
            handler: function () {
                var row=lx.judge($('#dgrid'),'删除','id');
                if(! row){
                    return;
                }
                mType = 'del';
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
                    layer.close(index);
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    var jsonData={};
                    jsonData.type='4';
                    if(row.length==1){
                        jsonData.ids=row[0].id;
                        delCost(jsonData,index);
                    }else{
                        var ids='';
                        for(var i=0;i<row.length;i++){
                            ids+=row[i].id+',';
                        }
                        jsonData.ids=ids.slice(0,ids.length-1);
                        delCost(jsonData,index);
                    }
                });
            }
        },
        {
            text:'导出',
            id: "btnExport",
            // iconCls: 'icon iconfont icon-daochu',
            handler:function() {
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'644px',
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
        },
        ],
        onSelect: function (index, row) {
            perObj['id'] = row.id;
            perObj['deptId'] = row.deptId;
            perObj['deptName'] = row.deptName;
            perObj['carId'] = row.carId;
            perObj['illegalContent'] = row.illegalContent;
            perObj['illegalPlace'] = row.illegalPlace;
            perObj['userId'] = userId;
            perObj['illegalType'] = row.illegalType;
            perObj['illegalMoney'] = row.illegalMoney;
            perObj['moneyBefore'] = row.moneyBefore;
            perObj['illTimeBefore'] = row.illTimeBefore;
            perObj['illegalAgentName'] = row.illegalAgentName;
            // costDetail(perObj['detailsNames'],perObj['detailsMoneys']);
        }
    };

    initPage();
    bindEvent();
    /*--------------------------------------功能函数--------------------------------------*/
    //初始化页面
    function initPage(){
        perObj['carNum']=$('#carNum').val();
        datagridFn(applyListOpt); //生成数据表格
        $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");//全选按钮
        //时间插件
        timeControl($('#time1'),'time1',$dateFmt);
        findDept($("#windowTree"));

    }
    //页面元素绑定事件
    function bindEvent(){
        //部门树
        $('.dept').focus(function () {
            var index=layer.open({
                type: 1,
                title: false,
                area: "644px",
                shade:0,
                closeBtn: 1,
                content: $("#form-Tree"),
                move: $('#form-Tree .form-top')
            })
            $('#form-Tree .submit-btn').click(function(){
                layer.close(index);
            });
        });
        //条件查询
        $('.search-btn').click(function () {
            perObj['carNum']=$('#carNum').val();
            applyListOpt.queryParams['carNum']=perObj['carNum'];
            findIllegal();
        });
    }

    //查询违章
    function findIllegal() {
        $('#dgrid').datagrid('reload');
    }
    //id查询违章
    function searchMoneyById(egalId,callBack){
        var cfg={
            token:getCookie('token'),
            url:'cost/findIllegal',
            data:{
                deptId:userDeptId
            },
            success:function(data){
                callBack && callBack(data);
            }
        };
        cfg.data.id=egalId;
        customAjax(cfg);
    }
    //新增违章
    function addIllegal(jData,index) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/addIllegal',
            data: jData,
            success: function (data) {
                findIllegal();
                layer.close(index);
                layer.msg('违章新增成功', {time: 1000});
            }
        };
        customAjax(cfg);
    }
    //修改违章
    function modIllegal(jData,index) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/modIllegal',
            data: jData,
            success: function (data) {
                findIllegal();
                layer.close(index);
                layer.msg('违章修改成功', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }
    //删除违章
    function delCost(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/delCost',
            data: jData,
            success: function (data) {
                findIllegal();
                layer.close(indexPop);
                layer.msg('违章删除成功', {time: 1000});
            }
        };
        customAjax(cfg);
    }
   /* //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName)
        }
    }*/

    //查找部门
    function findDept($dom) {
        formData={};
        formData.deptId=perObj['deptId'];
        var cfg={
            token:getCookie("toekn"),
            url:'department/findDeptTree',
            data:formData,
            success:function(data){
                nodes=[];
                var result=data.data;
                if(result.length>0){
                    nodes=[];
                    flag=1;
                    for(var i=0,l=result.length;i<l;i++){
                        nodes.push({"id":result[i].deptId,"pId":result[i].pid,"name":result[i].deptName});
                    }
                }else {
                    flag=0;//第一次添加
                }
                $.fn.zTree.init($dom, setting, openNodes(nodes));
            }
        };
        customAjax(cfg);
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
    //单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        perObj['deptId']=treeNode.id;
        perObj['deptName']=treeNode.name;
      //  $('.dept').val(perObj['deptName']);
        $('.dept').val(perObj['deptName']).attr('keyid',treeNode.id);
        findCar_1(perObj['deptId']);
    };
});
