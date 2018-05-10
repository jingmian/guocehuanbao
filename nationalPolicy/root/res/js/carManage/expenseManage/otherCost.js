$(function () {
    //表单验证
    var validationUp=$('#addNew').validationUp({
        rules:{
            othercostCarId:{
                notEmpty:true
            },
            othercostMoney:{
                notEmpty:true,
                money:true
            },
            othercostTime:{
                notEmpty:true
            }
        },
        errorMsg:{
            othercostCarId:{
                notEmpty:'车牌号不能为空'
            },
            othercostMoney:{
                notEmpty:'其他费用不能为空',
                money:'金额格式不正确,最多保留小数点后两位'
            },
            othercostTime:{
                notEmpty:'缴费时间不能为空'
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
            onClick: zTreeClick
        }
    };
    var nodes=[];
    var formData = {};//请求数据
    var perObj={
        id:0,
        deptId:userDeptId,
        deptName:'',
        othercostCarId:0,
        driverId:0,
        othercostType:0,
        othercostMoney:0,
        othercostTime:'',
        userId:'',
        moneyBefore:'',
        otherTimeBefore:'',
        carIdBrfore:''
    };
    perObj['carNum']=$('#carNum').val();
    //时间验证
    var $dateFmt="yyyy-MM-dd";
    //数据表格
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'cost/findOtherCost',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            carNum:'',
            deptId:userDeptId
        },
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'costId',hidden:true},
            {field:'dept',title:'所属部门',width:150,align:'left'},
            {field:'carNum',title:'车牌号',width:150,align:'center'},
            {field:'otherCostMoney',title:'费用(元)',width:200,align:'right'/*,formatter:function(value) {
                    return value == 0 ? value : value.toFixed(2);
            }*/},
            {field:'agentName',title:'缴费人',width:100,align:'center'},
            {field:'otherCostTime',title:'缴费时间',width:120,align:'center'},
            {field:'otherCostRemark',title:'备注',width:300,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [
        {
            text:'新增',
            id: "btnNewAdd",
            code:115,
            handler:function() {
                $('#addNew .titleText').text('新增其他费用');
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
                           formData.deptId=$('#addNew .dept').attr('keyid');
                            if( $('#otherCostRemark').val()==''){
                                formData.otherCostRemark='';
                            }
                            if( $('#agentName').val()==''){
                                formData.agentName='';
                            }
                           addOtherCost(formData,index);
                        }
                    }
                });
            }
        },
        {
            text: '查看',
            id: "btnSelect",
            code:116,
            handler: function () {
                var row=lx.judge($('#dgrid'),'查看','costId');
                if(! row){
                    return;
                }
                searchMoneyById(row.costId,function(data){
                    var rowDetail=data.data.data[0];
                    lx.paddingFormElm($('#selectAll'),rowDetail,true); //填充P元素
                });
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "500px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#selectAll"),
                    move: $('#selectAll .title')
                });
                $('#selectAll .yes').off('click');
                $('#selectAll .yes').click(function () {
                    layer.close(index);
                });
            }
        },
        {
            text:'修改',
            id: "btnApudate",
            code:117,
            handler:function() {
                var row=lx.judge($('#dgrid'),'修改','costId');
                if(! row){
                    return;
                }
                var rowDetail;
                $('#addNew .titleText').text('修改其他费用');
                searchMoneyById(row.costId,function(data){
                    rowDetail=data.data.data[0];
                    lx.paddingFormElm($('#addNew'),rowDetail); //填充表单元素
                    //findPerson(rowDetail.agentName);
                    //回显部门 ，车辆列表
                    $('#addNew .dept').attr('keyid',rowDetail.deptId);
                    findCar_1(rowDetail.deptId,rowDetail.carId);
                });
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "644px",
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
                            formData.userId=perObj['userId'];
                            formData.id=row.costId;
                            formData.moneyBefore=row.otherCostMoney;
                            formData.timeBefore=row.otherCostTime;
                            formData.carIdBefore=row.carId;
                            formData.deptId=$('#addNew').find('.dept').attr('keyid');
                            if( $('#otherCostRemark').val()==''){
                                formData.otherCostRemark='';
                            }
                            if( $('#agentName').val()==''){
                                formData.agentName='';
                            }
                            modOtherCost(formData,index);
                        }
                    }
                });
            }
        },
        {
            text: '删除',
            id: "btnDelete",
            code:118,
            handler: function () {
                var row=lx.judge($('#dgrid'),'删除','costId');
                if(! row){
                    return;
                }
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
                    for(var i=0;i<row.length;i++){
                        jsonData={};
                        jsonData.userId = userId;
                        jsonData.costTime = row[i].otherCostTime;
                        jsonData.type='6';
                        jsonData.otherMoney=row[i].otherCostMoney;
                        jsonData.carId=row[i].carId;
                        jsonData.ids=row[i].costId;
                        delOtherCost(jsonData,index);
                    }
                });
            }
        },
        {
            text:'导出',
            id: "btnExport",
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
            perObj['othercostCarId'] = row.othercostCarId;
            perObj['driverId'] = row.driverId;
            perObj['othercostType'] = row.othercostType;
            perObj['othercostMoney'] = row.othercostMoney;
            perObj['othercostTime'] = row.othercostTime;
            perObj['userId'] = row.userId;
            perObj['moneyBefore'] = row.moneyBefore;
            perObj['otherTimeBefore'] = row.otherTimeBefore;
            perObj['carIdBrfore'] = row.carIdBrfore;
            perObj['detailsNames'] = row.detailsNmaes;
            perObj['detailsMoneys'] = row.detailsMoneys;
        }
    };
    initPage();
    bindEvent();
    /*---------------------------------------功能函数---------------------------------------*/
    //页面初始化
    function initPage(){
        datagridFn(applyListOpt);//生成数据表格
        findDept($("#windowTree"));
        $(".pagination-btn").prepend("<span class='selectAll'>全选</span>"); //全选按钮
        $('.selectPopup').css('minHeight','136px');
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
            findOtherCost();
        });
        //时间插件
        timeControl($('#time1'),'time1',$dateFmt);
    }
    //id查询维修费用
    function searchMoneyById(otherId,callBack){
        var cfg={
            token:getCookie('token'),
            url:'cost/findOtherCost',
            data:{
                deptId:userDeptId
            },
            success:function(data){
                callBack && callBack(data);
            }
        };
        cfg.data.id=otherId;
        customAjax(cfg);
    }
    //查询其他费用
    function findOtherCost() {
        $('#dgrid').datagrid('reload');
    }
    //增加其他费用
    function addOtherCost(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/addOtherCost',
            data: jData,
            success: function (data) {
                findOtherCost();
                layer.close(indexPop);
                layer.msg('其他费用新增成功',{time: 1000});
            }
        };
        customAjax(cfg);
    }
    //修改其他费用
    function modOtherCost(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/modOtherCost',
            data: jData,
            success: function (data) {
                findOtherCost();
                layer.close(indexPop);
                layer.msg('其他费用修改成功',{time: 1000});
            }
        };
        customAjax(cfg);
    }
    //删除其他费用
    function delOtherCost(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/delCost',
            data: jData,
            success: function (data) {
                findOtherCost();
                layer.close(indexPop);
                layer.msg('其他费用删除成功', {time: 1000});
            }
        };
        customAjax(cfg);
    }
    //查找部门
    function findDept($dom) {
        formData={};
        formData.deptId=perObj['deptId'];
        var cfg={
            token:getCookie("token"),
            url:'department/findDeptTree',
            data:formData,
            success:function(data){
                nodes=[];
                var result=data.data;
                if(result.length>0){
                    nodes=[];
                    for(var i=0,l=result.length;i<l;i++){
                        nodes.push({"id":result[i].deptId,"pId":result[i].pid,"name":result[i].deptName});
                    }
                }else {
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
        var zTree=$.fn.zTree.getZTreeObj("deptTree");
        perObj['deptId']=treeNode.id;
        perObj['deptName']=treeNode.name;
        $('.dept').val(perObj['deptName']).attr('keyid',treeNode.id);
        findCar_1(perObj['deptId']);
    }
});
