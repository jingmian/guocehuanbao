$(function () {
    //表单验证
    var validationUp=$('#addNew .insertPopup>ul').validationUp({
        rules:{
            maintainCarId:{
                notEmpty:true
            },
            repairNum:{
                mustBeNum:true
            },
            maintainMoney:{
                notEmpty:true,
                money:true
            },
            maintainStartTime:{
                notEmpty:true
            },
            maintainEndTime:{
                notEmpty:true
            },
            maintainRemindTime:{
                notEmpty:true
            }
        },
        errorMsg:{
            maintainCarId:{
                notEmpty:'车牌号不能为空'
            },
            repairNum:{
                mustBeNum:'维修单号必须为数字'
            },
            maintainMoney:{
                notEmpty:'保养费用不能为空',
                money:'金额格式不正确,最多保留小数点后两位'
            },
            maintainStartTime:{
                notEmpty:'送保时间不能为空'
            },
            maintainEndTime:{
                notEmpty:'完保时间不能为空'
            },
            maintainRemindTime:{
                notEmpty:'下次保养提醒时间不能为空'
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
    //时间格式
    var $dateFmt="yyyy-MM-dd";
    var formData = {};//请求数据
    var perObj={
        id:0,
        deptId:userDeptId,
        deptName:'',
        maintainCarId:0,
        driverId:0,
        maintainMoney:0,
        maintainStartTime:'',
        maintainEndTime:'',
        timeSpace:0,
        maintainRemindTime:'',
        agentName:'',
        userId:'',
        moneyBefore:'',
        otherTimeBefore:'',
        carIdBrfore:'',
        repairReamrk:'',
        mileageSpace:0
    };
    //新增费用明细
    var $rowLen = 1;//默认显示行数
    var workCostArr=[];//存放费用数组
    var wDetaNamesArr=[],wDetaMoneysArr=[];//存放费用明细参数
    var timeNum=0;
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'cost/findMaintain',  //请求地址
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
            {field:'maintainMoney',title:'保养费用(元)',width:100,align:'right'},
            {field:'agentName',title:'缴费人',width:100,align:'center'},
            {field:'maintainStartTime',title:'送保时间',width:120,align:'center'},
            {field:'maintainEndTime',title:'完保时间',width:120,align:'center'},
            {field:'maintainRemindTime',title:'下次保养时间',width:120,align:'center'},
            {field:'mileageSpace',title:'间隔里程(km)',width:120,align:'center'},
            {field:'maintainRemark',title:'备注',width:300,align:'left'}
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
            code:96,
            handler:function() {
                lx.clearRows(); //清除选中的行
                lx.initFormElm($('#addNew'));//初始化表单元素
                $('#maintainCarId').empty();
                $('#addNew .titleText').text('新增保养费用');
                attContShow();
                getSelections();
                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit:{
                        doSubmitFn:function(formData){
                            postCost();
                            perObj['detailsNames']=wDetaNamesArr.join(',');
                            perObj['detailsMoneys']=wDetaMoneysArr.join(',');
                            formData.detailsNames=perObj['detailsNames'];
                            formData.detailsMoneys=perObj['detailsMoneys'];
                            formData.deptId=$('#addNew').find('.dept').attr('keyid');
                            //手动添加input值为空的val
                            if( $('#agentName').val()=='' ){
                                formData.agentName='';
                            }
                            if( $('#maintainRemark').val()=='' ){
                                formData.insuranceRemark='';
                            }
                            //验证金额
                            addMaintain(formData,index);
                        }
                    }
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
            }
        },
        {
            text: '查看',
            id: "btnSelect",
            code:97,
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
            code:98,
            handler:function() {
                var row=lx.judge($('#dgrid'),'修改','costId');
                if(! row){
                    return;
                }
                var rowDetail;
                searchMoneyById(row.costId,function(data){
                    rowDetail=data.data.data[0];
                    lx.paddingFormElm($('#addNew'),rowDetail); //填充表单元素
                    $('#timeCyc').val(rowDetail.timeSpace);
                    $('#mileageSpace').val(rowDetail.mileageSpace);
                    //回显部门 ，车辆列表
                    $('#addNew .dept').attr('keyid',rowDetail.deptId);
                    findCar_1(rowDetail.deptId,rowDetail.carId);
                    //初始化费用表格
                    initMoneyTable();
                    //生成费用明细
                    var detailModHtml=$('.wSTime .sTCont1'),str='';
                    if(row.detailsNames.indexOf(',')==-1 && row.detailsMoneys.indexOf(',')==-1){//一条明细
                        if(row.detailsNames!='' && row.detailsMoneys!=''){
                            detailModHtml.find('.workTime1').val(row.detailsNames);
                            detailModHtml.find('.workTime2').val(parseFloat(row.detailsMoneys).toFixed(2));
                        }
                    }else{
                        var nameArr=row.detailsNames.split(','),
                            moneyArr=row.detailsMoneys.split(',');
                        for(var i=0;i<nameArr.length;i++){
                            if(i==0){
                                if(nameArr[0] && moneyArr[0]){
                                    detailModHtml.find('.workTime1').val(nameArr[0]);
                                    detailModHtml.find('.workTime2').val(parseFloat(moneyArr[0]).toFixed(2));
                                }
                            }else{
                                str+='<div class="sTCont sTCont1"><input type="text" class="workTime1" placeholder="名称" value="'+nameArr[i]+'"/><input type="text"  class="workTime2" placeholder="费用" value="'+parseFloat(moneyArr[i]).toFixed(2)+'"/><span><a href="javascript:" class="btnTDel">删除</a></span></div>';
                            }
                        }
                        detailModHtml.after(str);
                        $rowLen=nameArr.length;
                        delPrice();
                    }
                });
                $('#addNew .titleText').text('修改保养费用');
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
                            postCost();
                            perObj['detailsNames']=wDetaNamesArr.join(',');
                            perObj['detailsMoneys']=wDetaMoneysArr.join(',');
                            formData.userId=perObj['userId'];
                            formData.id=rowDetail.costId;
                            // formData.maintainCarId=rowDetail.carId;
                            formData.moneyBefore=rowDetail.repairMoney;
                            formData.timeBefore=rowDetail.maintainEndTime;
                            formData.carIdBefore=rowDetail.carId;
                            formData.detailsNames=perObj['detailsNames'];
                            formData.detailsMoneys=perObj['detailsMoneys'];
                            formData.deptId=$('#addNew').find('.dept').attr('keyid');
                            //手动添加input值为空的val
                            if( $('#agentName').val()=='' ){
                                formData.agentName='';
                            }
                            if( $('#maintainRemark').val()=='' ){
                                formData.insuranceRemark='';
                            }
                            //验证金额
                            modMaintain(formData,index);
                        }
                    }
                });
            }
        },
        {
            text: '删除',
            id: "btnDelete",
            code:99,
            handler: function () {
                var row=lx.judge($('#dgrid'),'删除','costId');
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
                    for(var i=0;i<row.length;i++){
                        jsonData={};
                        jsonData.userId = userId;
                        jsonData.costTime = row[i].maintainEndTime;
                        jsonData.type='1';
                        jsonData.mainMoney=row[i].mainMoney;
                        jsonData.carId=row[i].carId;
                        jsonData.ids=row[i].costId;
                        delMaintain(jsonData,index);
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
            perObj['maintainCarId'] = row.maintainCarId;
            perObj['driverId'] = row.driverId;
            perObj['maintainMoney'] = row.maintainMoney;
            perObj['maintainStartTime'] = row.maintainStartTime;
            perObj['maintainEndTime'] = row.maintainEndTime;
            perObj['timeSpace'] = row.timeSpace;
            perObj['maintainRemindTime'] = row.maintainRemindTime;
            perObj['agentName'] = row.agentName;
            perObj['userId'] = row.userId;
            perObj['moneyBefore'] = row.moneyBefore;
            perObj['otherTimeBefore'] = row.otherTimeBefore;
            perObj['carIdBrfore'] = row.carIdBrfore;
            perObj['repairReamrk'] = row.repairReamrk;
            perObj['mileageSpace'] = row.mileageSpace;
            perObj['detailsNames'] = row.detailsNmaes;
            perObj['detailsMoneys'] = row.detailsMoneys;
            // costDetail(perObj['detailsNames'],perObj['detailsMoneys']);
        },
        onUnselect:function (index,row) {
            // costDetail(perObj['detailsNames'],perObj['detailsMoneys']);
        }
    };
    var idsArr=[],namesArr=[];

    initPage();
    bindEvent();
    /*--------------------------------------功能函数----------------------------------------*/
    //页面初始化
    function initPage(){
        datagridFn(applyListOpt); //生成数据表格
        $(".pagination-btn").prepend("<span class='selectAll'>全选</span>"); //全选按钮
        perObj['carNum']=$('#carNum').val();
        //查找部门
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
            });
            $('#form-Tree .submit-btn').click(function(){
                layer.close(index);
            });
        });
        //费用明细新增
        $(".btnTAdd").on('click',function(){
            $rowLen++;
            var $contDiv = $(".sTCont1").eq(0).html();
            var $contDiv1 = "<div class='sTCont sTCont1'>" + $contDiv + "</div>";
            workCostArr[$rowLen]=$contDiv1;
            $(".wSTime").append($contDiv1);
            wDetaNamesArr=[];
            wDetaMoneysArr=[];
            attContShow();
            postCost();
            delPrice();
        });
        //时间插件
        timeControl($('#time1'),'time1',$dateFmt);
        timeControl($('#time2'),'time2',$dateFmt);
        timeControl($('#time3'),'time3',$dateFmt);
        //条件查询
        $('.search-btn').click(function () {
            perObj['carNum']=$('#carNum').val();
            applyListOpt.queryParams['carNum']=perObj['carNum'];
            findMaintain();
        });

        //动态生成总维修费用
        $('#addNew').on('click change','.workTime1,.workTime2',function(){
            $('#moneyTotal').val(0);
            var v=$.trim( $(this).find('.workTime2').val() );
            var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/; //验证金额 任意正整数，正小数（小数位不超过2位）
            if(reg.test(v) || v==''){
                var moneyArr= $('#addNew').find('.workTime2'),
                    sum=0;
                for(var i=0;i<moneyArr.length;i++){
                    if($(moneyArr[i]).val()!='' && reg.test($(moneyArr[i]).val())){
                        sum+=parseFloat($(moneyArr[i]).val());
                    }
                }
                $('#moneyTotal').val(sum)
            }else{
                layer.msg('保养费用为正数',{timer:1000});
            }
        });
    }
    // attContShow();
    //添加费用
    function addPrice() {
        $(".btnTAdd").off('click');
        $(".btnTAdd").on('click',function(){
            $rowLen++;
            var $contDiv = $(".sTCont1").eq(0).html();
            var $contDiv1 = "<div class='sTCont sTCont1'>" + $contDiv + "</div>";
            workCostArr[$rowLen]=$contDiv1;
            $(".wSTime").append($contDiv1);
            wDetaNamesArr=[];
            wDetaMoneysArr=[];
            attContShow();
            postCost();
            delPrice();
            // monthAll(wDetaMoneysArr.length-1);
        });
    }
    //删除费用
    function delPrice() {
        $(".btnTDel").off('click');
        $(".btnTDel").on('click',function(){
            $rowLen--;
            if($rowLen<1){
                $rowLen=1;
            }else{
                $(this).parent().parent('.sTCont1').remove();
            }
            attContShow();
            postCost();
            $('#moneyTotal').val(0);
            monthAll(wDetaMoneysArr.length);
        });
    }
    //总费用
    function monthAll(len) {
        var $moneyTotal=$('#moneyTotal');
        var moneyTotal=0;
        if($moneyTotal.val()!==''){
            moneyTotal=parseInt($moneyTotal.val());
            for(var j=0;j<len;j++){
                var money=parseInt(wDetaMoneysArr[j]);
                moneyTotal+=money;
                $('#moneyTotal').val(moneyTotal);
            }
        }
    }
    //id查询保养费用
    function searchMoneyById(moneyId,callBack){
        var cfg={
            token:getCookie('token'),
            url:'cost/findMaintain',
            data:{
                deptId:userDeptId
            },
            success:function(data){
                callBack && callBack(data);
            }
        };
        cfg.data.id=moneyId;
        customAjax(cfg);
    }
    //查询保养费用
    function findMaintain(){
        $('#dgrid').datagrid('reload');
    }
    //增加保养
    function addMaintain(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/addMaintain',
            data:jData,
            success: function (data) {
                findMaintain();
                layer.close(indexPop);
                layer.msg('保养新增成功',{time: 1000});
            }
        };
        customAjax(cfg);
    }
    //修改保养
    function modMaintain(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/modMaintain',
            data: jData,
            success: function (data) {
                findMaintain();
                layer.close(indexPop);
                layer.msg('保养修改成功',{time: 1000});
            }
        };
        customAjax(cfg);
    }
    //删除保养
    function delMaintain(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'cost/delCost',
            data: jData,
            success: function (data) {
                findMaintain();
                layer.close(indexPop);
                layer.msg('保养费用删除成功', {time: 1000});
            }
        };
        customAjax(cfg);
    }
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
    //费用明细显示
    function attContShow() {
        $('.attCount').val(2*$rowLen);
    }
    //取得所有选中行数据
    function getSelections() {
        var rows = $('#dgrid').datagrid('getSelections');
        if(rows.length>0){
            for(var i=0; i<rows.length; i++){
                perObj['detailsNames']=rows[i].detailsNmaes;
                perObj['detailsMoneys']=rows[i].detailsMoneys;
            }
            var nameArr=[];
            if(perObj['detailsNames']&&perObj['detailsNames'].length>0){
                nameArr=perObj['detailsNames'].split(',');
                timeNum=nameArr.length-1;
                $rowLen=timeNum+1;

            }else{
                timeNum=0;
                $rowLen=timeNum+1;
            }
            workCost(timeNum);
        }else{
            $rowLen=1;
            workCost(timeNum);
        }
    }
    //传入费用明细
    function postCost() {
        var $sTCont1=$('.sTCont1');
        wDetaNamesArr=[];
        wDetaMoneysArr=[];
        for(var i=0;i<$sTCont1.length;i++){
            var input=$sTCont1.eq(i).find('input');
            var time=input.eq(0).val();
            var timeName=input.eq(1).val();
            if(time!==''){
                if(timeName==''){
                    timeName=0;
                    input.eq(1).val(0);
                }
                wDetaNamesArr.push(time);
                wDetaMoneysArr.push(timeName);
            }else{
                if(timeName!==''){
                    wDetaNamesArr.push('null');
                    layer.msg('费用明细名称不能为空',{timer:1000});
                    return false;
                }
            }
        }
    }
    //初始化费用表格
    function initMoneyTable(){
        $('.wSTime').html('<h3 class="sTTitle">费用明细<a href="javascript:" class="btnTAdd">新增</a></h3><div class="sTCont" id="caption"><span>维修项名称</span><span>维修费用(元)</span><span>操作</span></div><div class="sTCont sTCont1"><input type="text" value="" class="workTime1" placeholder="名称"/><input type="text" value="" class="workTime2" placeholder="费用"/><span><a href="javascript:" class="btnTDel">删除</a></span></div>');
        addPrice();
        delPrice();
    }
    //根据返回数据生成费用明细
    function workCost(num) {
        var contArr=[];
        var $wSTime=$(".wSTime");
        var h3=$wSTime.find('h3').html();
        var $h3="<h3 class='sTTitle'>"+h3+"</h3>";
        var div0=$wSTime.find('.sTCont').eq(0).html();
        var $div0="<div class='sTCont'>"+div0+"</div>";
        var div1= $wSTime.find(".sTCont1").eq(0).html();
        var $div1 = "<div class='sTCont sTCont1'>" + div1 + "</div>";
        contArr=[$h3,$div0,$div1];
        $(".wSTime").html(contArr.join(''));
        for(var i=0;i<num;i++){
            var div2= $wSTime.find(".sTCont1").eq(0).html();
            var $div2 = "<div class='sTCont sTCont1'>" + div2 + "</div>";
            $(".wSTime").append($div2);
        }
        addPrice();
        delPrice();
    }
});
