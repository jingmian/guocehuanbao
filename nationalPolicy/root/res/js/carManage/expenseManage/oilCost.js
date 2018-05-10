$(function () {
    //表单验证
    var validationUp=$('#addNew').validationUp({
        rules:{
            gasolineCarId:{
                notEmpty:true
            },
            gasolinePrice:{
                notEmpty:true,
                money:true
            },
            gasolineMoney:{
                notEmpty:true,
                money:true
            },
            gasolineTime:{
                notEmpty:true
            },
            gasolinePlace:{
                notEmpty:true
            },
            gasolineAmount:{
                notEmpty:true
            }
        },
        errorMsg:{
            gasolineCarId:{
                notEmpty:'车牌号不能为空'
            },
            gasolinePrice:{
                notEmpty:'油价不能为空',
                money:'格式不正确,最多保留小数点后两位'
            },
            gasolineMoney:{
                notEmpty:'油费不能为空',
                money:'金额格式不正确,最多保留小数点后两位'
            },
            gasolineTime:{
                notEmpty:'加油时间不能为空'
            },
            gasolinePlace:{
                notEmpty:'加油地点不能为空'
            },
            gasolineAmount:{
                notEmpty:'加油量不能为空',
                money:'格式不正确,最多保留小数点后两位'
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
        deptId:userDeptId
    };
    perObj['carNum']=$('#carNum').val();
    //时间验证
    var $dateFmt="yyyy-MM-dd";
    //数据表格
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'cost/findGasoline',  //请求地址
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
            {field:'gasolineType',title:'油料类型',width:120,align:'center'},
            {field:'gasolinePrice',title:'交易单价(元/升)',width:120,align:'right',formatter:function (val) {
                if(val){
                    return val/100;
                }
            }},
            {field:'gasolineAmount',title:'加油量(升)',width:120,align:'right'},
            {field:'gasolineMoney',title:'油费(元)',width:120,align:'right'/*,formatter:function(value) {
                    return value == 0 ? value : value.toFixed(2);
            }*/},
            {field:'gasolineTime',title:'加油时间',width:120,align:'center'},
            {field:'gasolinePlace',title:'加油地点',width:180,align:'center'},
            {field:'gasolineRemark',title:'备注',width:300,align:'left'}
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
                code:110,
                handler:function() {
                    $('#addNew .titleText').text('新增油费');
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
                                if( $('#gasolineRemark').val()==''){
                                    formData.gasolineRemark='';
                                }
                                if(formData.gasolinePrice){
                                    formData.gasolinePrice = formData.gasolinePrice*100;
                                }
                                addOilCost(formData,index);
                            }
                        }
                    });
                }
            },
            {
                text: '查看',
                id: "btnSelect",
                code:111,
                handler: function () {
                    var row=lx.judge($('#dgrid'),'查看','costId');
                    if(! row){
                        return;
                    }
                    searchMoneyById(row.costId,function(data){
                        var rowDetail=data.data.data[0];
                        rowDetail.gasolinePrice = rowDetail.gasolinePrice/100;
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
                code:112,
                handler:function() {
                    var row=lx.judge($('#dgrid'),'修改','costId');
                    if(! row){
                        return;
                    }
                    var rowDetail;
                    $('#addNew .titleText').text('修改油费');
                    searchMoneyById(row.costId,function(data){
                        rowDetail=data.data.data[0];
                        lx.paddingFormElm($('#addNew'),rowDetail); //填充表单元素
                        $('#gasolineType').val(rowDetail.gasolineType);
                        $('#gasolinePrice').val(rowDetail.gasolinePrice/100);
                        //回显部门 ，车辆列表
                        $('#addNew .dept').attr('keyid',rowDetail.deptId);
                        findCar_1(rowDetail.deptId,rowDetail.gasolineCarId);
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
                    $('#addNew .no').click(function(){layer.close(index)});
                    validationUp.destroyErrorMsg();
                    validationUp.setDoSubmitFn({
                        submit:{
                            doSubmitFn:function(formData){
                                formData.userId=perObj['userId'];
                                formData.id=row.costId;
                                formData.moneyBefore=row.gasolineMoney;
                                formData.timeBefore=row.gasolineTime;
                                formData.carIdBefore=row.gasolineCarId;
                                formData.deptId=$('#addNew').find('.dept').attr('keyid');
                                if( $('#gasolineRemark').val()==''){
                                    formData.gasolineRemark='';
                                }
                                if(formData.gasolinePrice){
                                    formData.gasolinePrice = formData.gasolinePrice*100;
                                }
                                modOilCost(formData,index);
                            }
                        }
                    });
                }
            },
            {
                text: '删除',
                id: "btnDelete",
                code:113,
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
                            jsonData.costTime = row[i].gasolineTime;
                            jsonData.type='5';
                            jsonData.gasoMoney=row[i].gasolineMoney;
                            jsonData.carId=row[i].gasolineCarId;
                            jsonData.ids=row[i].costId;
                            delOilCost(jsonData,index);
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
        ]
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
        //生成油费
        $('#gasolinePrice').keyup(function(){
            createOilPrice();
        });
        $('#gasolineAmount').keyup(function(){
            createOilPrice();
        });

        //生成油费函数
        function createOilPrice(){
            var num=$.trim($('#gasolineAmount').val()),
                price=$.trim($('#gasolinePrice').val()),
                sum=0;
            var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/; //验证金额 任意正整数，正小数（小数位不超过2位）
            if(num=='' || price=='' || !reg.test(price) || !reg.test(num)){
                $('#gasolineMoney').val(0);
                return ;
            }
            sum+=parseFloat(num)*parseFloat(price);
            $('#gasolineMoney').val(sum.toFixed(2));
        }
    }
    //id查询油费
    function searchMoneyById(oilId,callBack){
        var cfg={
            token:getCookie('token'),
            url:'cost/findGasoline',
            data:{
                deptId:userDeptId
            },
            success:function(data){
                callBack && callBack(data);
            }
        };
        cfg.data.id=oilId;
        customAjax(cfg);
    }
    //查询油费
    function findOtherCost() {
        $('#dgrid').datagrid('reload');
    }
    //增加油费
    function addOilCost(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/addGasoline',
            data: jData,
            success: function (data) {
                findOtherCost();
                layer.close(indexPop);
                layer.msg('油费新增成功',{time: 1000});
            }
        };
        customAjax(cfg);
    }
    //修改油费
    function modOilCost(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/modGasoline',
            data: jData,
            success: function (data) {
                findOtherCost();
                layer.close(indexPop);
                layer.msg('油费修改成功',{time: 1000});
            }
        };
        customAjax(cfg);
    }
    //删除油费
    function delOilCost(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/delCost',
            data: jData,
            success: function (data) {
                findOtherCost();
                layer.close(indexPop);
                layer.msg('油费删除成功', {time: 1000});
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
