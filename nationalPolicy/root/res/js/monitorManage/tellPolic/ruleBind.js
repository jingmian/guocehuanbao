$(function () {
    var dgData = [];//表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+"warningManage/findDesignRuleInfo",  //请求地址
        //请求传递的参数
        queryParams: {
            // pageSize: 20,
            // pageNo: 1
            /*  gridType: 'easyui',
              recordStatus: 10*/
        },
        pageSize: 20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'alarmName', title: '报警名称', width: 100,align:'left'},
            {field: 'dictionaryName', title: '报警类型', width: 100, align: 'center'},
            {field: 'alarmThreshold', title: '阈值(km/h)', width: 100, align: 'right'},
            {field: 'floatVolue', title: '连续数据', width: 100, align: 'right'},
            {field: 'isRemind', title: '是否提醒', width: 100, align: 'center',formatter:function(value,row,index){
                if(value==0){value='否'}
                if(value==1){value='是'}
                return value;
            }},
            {field: 'isManyTimesSend', title: '是否持续', width: 100, align: 'center',formatter:function(value,row,index){
                if(value==0){value='否'}
                if(value==1){value='是'}
                return value;
            }},
            {field: 'alarmLevel', title: '报警分级', width: 100, align: 'center', formatter: function (value, row,index) {
                if(value==''||value==null){
                    return value='暂无数据';
                }
                else{
                    return "<a href='javascript:;' style='color:#009aff'>查看详情</a>";
                }
            }},
            {field: 'supervisePersonNames', title: '监管人员', width: 100, align: 'center', formatter: function (value, row,index) {
                if(value==''||value==null){
                    return value='暂无人员';
                }
                else{
                    return "<a href='javascript:;' style='color:#009aff'>查看详情</a>";
                }
            }},
            {field: 'superviseCarNames', title: '监管车辆', width: 100, align: 'center', formatter: function (value, row,index) {
                if(value==''||value==null){
                    return value='暂无车辆';
                }
                else{
                    return "<a href='javascript:;' style='color:#009aff'>查看详情</a>";
                }
            }}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [
            {
                text: '新增',
                id: "btnNewAdd",
                code:15,
                handler: function () {
                    $('#dgrid').datagrid('unselectAll');
                    $('#addNew .titleText').text('新增规则信息');
                    $('input[text]').attr("value");
                    $('#addNew .alarmName').val('');
                    $('#addNew .alarmType').val('');
                    $('#addNew .alarmThreshold').val('');
                    $('#addNew .floatVolue').val('');
                    perObj['isManyTimesSend']='';
                    perObj['isRemind']='';
                    setSelectValue($('#addNew .isManyTimesSend'),perObj['isManyTimesSend']);
                    setSelectValue($('#addNew .isRemind'),perObj['isRemind']);
                    $('#addNew .supervisePersonIds').val('');
                    $('#addNew .superviseCarIds').val('');
                    $rowLen=1;
                    getObj(0);
                    perObj['alarmTypeName']='';
                    findAlarmType();
                    removeValid();
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "500px",
                        // shadeClose:false,
                        closeBtn: 1,
                        content: $("#addNew"),
                        move: $('#addNew .title')

                    });
                    $('#addNew .no').click(function () {
                        layer.closeAll();
                    });
                    $('#addNew .yes').off('click');
                    $('#addNew .yes').click(function () {
                        // formData={};
                        formData.alarmName = $('#addNew .alarmName').val();
                        formData.alarmType = $('#addNew .alarmType').val();
                        var alarmThreshold=$('#addNew .alarmThreshold').val();
                        if(alarmThreshold!==''){
                            if(isNum(alarmThreshold)){
                                formData.alarmThreshold = $('#addNew .alarmThreshold').val();
                            }else{
                                layer.msg('阈值为非负数');
                                return false;
                            }
                        }
                        var floatVolue=$('#addNew .floatVolue').val();
                        if(floatVolue!==''){
                            if(isNum(floatVolue)){
                                formData.floatVolue = $('#addNew .floatVolue').val();
                            }else{
                                layer.msg('连续数据为非负数');
                                return false;
                            }
                        }
                        formData.isManyTimesSend = $('#addNew .isManyTimesSend').val();
                        formData.isRemind = $('#addNew .isRemind').val();
                        formData.supervisePersonIds = perObj['supervisePersonIds'];
                        formData.superviseCarIds = perObj['superviseCarIds'];
                        if(postObj()==''){

                        }else if(postObj()=='false'){
                            layer.msg('参数为非负数');
                            return false;
                        }else if(postObj()=='err'){
                            layer.msg('第一个参数不能大于第二个参数的值');
                            return false;
                        }else{
                            formData.alarmGrade =JSON.stringify(postObj());
                        }
                        if(validMustField()){
                            addDesignRuleInfo();
                            layer.close(index);
                        }
                    });
                }
            },
            {
                text: '查看',
                id: "btnSelect",
                code:16,
                handler: function () {
                    var row=$('#dgrid').datagrid('getSelections');
                    if(row.length==0){
                        layer.msg('请选择要查看的规则信息',{time:1000});
                        return;
                    }
                    if(row.length>0){
                        var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                        $('#dgrid').datagrid('unselectAll');
                        $('#dgrid').datagrid('selectRow',rowIndex);
                    }
                    $('#selectAll .titleText').text('查看规则信息');
                    $('#selectAll .alarmName').text(perObj['alarmName']);
                    $('#selectAll .alarmType').text(perObj['alarmTypeName']);
                    $('#selectAll .alarmThreshold').text(perObj['alarmThreshold']);
                    $('#selectAll .floatVolue').text(perObj['floatVolue']);
                    $('#selectAll .isRemind').text(perObj['isRemind']);
                    $('#selectAll .isManyTimesSend').text(perObj['isManyTimesSend']);
                    $('#selectAll .alarmLevel').text(perObj['alarmLevel']);
                    $('#selectAll .supervisePersonIds').text(perObj['supervisePersonNames']);
                    $('#selectAll .superviseCarIds').text(perObj['superviseCarNames']);
                    // findAlarmLevelByRuleId();
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "500px",
                        // shadeClose:false,
                        closeBtn: 1,
                        content: $("#selectAll"),
                        move: $('#selectAll .title')

                    });
                    $('#selectAll .no').click(function () {
                        layer.closeAll();
                    });
                    $('#selectAll .yes').off('click');
                    $('#selectAll .yes').click(function () {
                        layer.close(index);
                    });
                }
            },{
                text: '修改',
                id: "btnApudate",
                code:17,
                handler: function () {
                    var row=$('#dgrid').datagrid('getSelections');
                    if(row.length==0){
                        layer.msg('请选择要修改的规则信息',{time:1000});
                        return;
                    }
                    if(row.length>0){
                        var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                        $('#dgrid').datagrid('unselectAll');
                        $('#dgrid').datagrid('selectRow',rowIndex);
                    }
                    getSelections();
                    $('#addNew .titleText').text('修改规则信息');
                    $('#addNew .alarmName').val(perObj['alarmName']);
                    $('#addNew .alarmThreshold').val(perObj['alarmThreshold']);
                    $('#addNew .floatVolue').val(perObj['floatVolue']);
                    setSelectValue($('#addNew .isManyTimesSend'),perObj['isManyTimesSend']);
                    setSelectValue($('#addNew .isRemind'),perObj['isRemind']);
                    $('#addNew .supervisePersonIds').val(perObj['supervisePersonNames']);
                    $('#addNew .superviseCarIds').val(perObj['superviseCarNames']);
                    findAlarmType();
                    findAlarmLevelByRuleId();
                    removeValid();
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "500px",
                        // shadeClose:false,
                        closeBtn: 1,
                        content: $("#addNew"),
                        move: $('#addNew .title'),

                    });
                    $('#addNew .no').click(function () {
                        layer.closeAll();
                    });
                    $('#addNew .yes').off('click');
                    $('#addNew .yes').click(function () {
                        formData.id =perObj['id'];
                        formData.alarmName = $('#addNew .alarmName').val();
                        formData.alarmType = $('#addNew .alarmType').val();
                        formData.alarmLevel = perObj['alarmLevel'];
                        var alarmThreshold=$('#addNew .alarmThreshold').val();
                        if(alarmThreshold!==''){
                            if(isNum(alarmThreshold)){
                                formData.alarmThreshold = $('#addNew .alarmThreshold').val();
                            }else{
                                layer.msg('阈值为非负数');
                                return false;
                            }
                        }
                        var floatVolue=$('#addNew .floatVolue').val();
                        if(floatVolue!==''){
                            if(isNum(floatVolue)){
                                formData.floatVolue = $('#addNew .floatVolue').val();
                            }else{
                                layer.msg('连续数据为非负数');
                                return false;
                            }
                        }
                        formData.isManyTimesSend = $('#addNew .isManyTimesSend').val();
                        formData.isRemind = $('#addNew .isRemind').val();
                        formData.supervisePersonIds = perObj['supervisePersonIds'];
                        formData.superviseCarIds = perObj['superviseCarIds'];
                        if(postObj()==''){

                        }else if(postObj()=='false'){
                            layer.msg('参数为非负数');
                            return false;
                        }else if(postObj()=='err'){
                            layer.msg('第一个参数不能大于第二个参数的值');
                            return false;
                        }else{
                            formData.alarmGrade =JSON.stringify(postObj());
                        }
                        if(validMustField()){
                            modDesignRuleInfo();
                            layer.close(index);
                        }
                    });
                }
            },{
                text: '删除',
                id: "btnDelete",
                code:18,
                handler: function () {
                    var row=$('#dgrid').datagrid('getSelections');
                    if(row.length==0){
                        layer.msg('请选择要删除的规则绑定信息',{time:1000});
                        return;
                    }
                    if(row.length>0){
                        getSelections();
                    }
                    $('#dInfo').text(namesArr.join(','));
                    var index = layer.open({
                        type: 1,
                        title: false,
                        area: "300px",
                        // shadeClose:false,
                        closeBtn: 1,
                        content: $("#delete"),
                        move: $('#delete .title'),

                    });
                    $('#delete .no').click(function () {
                        layer.closeAll();
                    });
                    $('#delete .yes').off('click');
                    $('#delete .yes').click(function () {
                        formData={};
                        formData.id = perObj['id'];
                        delDesignRuleInfo();
                        layer.close(index);
                    });
                }
            }
        ],
        onClickCell:function (rowIndex, field, value) {
            if(value==''||value==null)return;
            var $field=$('#dgrid').datagrid('getColumnOption',field);
            $('#alarmRemark').text(value);
            if(field=='alarmLevel'){
                getFieldDetail();
            }
            if(field=='supervisePersonNames'){
                getFieldDetail();
            }
            if(field=='superviseCarNames'){
                getFieldDetail();
            }
            function getFieldDetail() {
                $('#selectAll1 .titleText').text($field.title+'详情');
                $('#fileName').text($field.title+':');
                var index=layer.open(publicObj({
                    kind:'layer',
                    area:'500px',
                    content:$('#selectAll1'),
                    move:$('#selectAll1 .title')
                }));
            }

        },
        onSelect: function (index, row) {
            perObj['id'] = row.id;
            perObj['alarmName'] = row.alarmName;
            perObj['alarmType'] = row.alarmType;
            perObj['alarmTypeName'] = row.dictionaryName;
            perObj['alarmThreshold'] = row.alarmThreshold;
            perObj['floatVolue'] = row.floatVolue;
            perObj['isRemind'] = row.isRemind==0?'否':'是';
            perObj['isManyTimesSend'] = row.isManyTimesSend==0?'否':'是';
            perObj['alarmLevel'] = row.alarmLevel;
            perObj['supervisePersonIds'] = row.supervisePersonIds;
            perObj['supervisePersonNames'] = row.supervisePersonNames;
            perObj['superviseCarIds'] = row.superviseCarIds;
            perObj['superviseCarNames'] = row.superviseCarNames;
            getSelections();
        },
        onLoadError: function () {
            console.log(1)
        },
        onLoadSuccess: function () {
            $('.dgrid .show-detail').mouseover(function () {
                $(this).css({color: "#1874ad", cursor: "pointer"})
            }).mouseleave(function () {
                $(this).css({color: "#000", cursor: "pointer"})
            });
            $('.dgrid .show-detail').click(function () {
                var orderId = $(this).attr('data-href');

                setTimeout(function () {
                    $('#check-btn').trigger('click');
                }, 100);
            })
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    var perObj = {
        id: '',
        alarmName: '',
        alarmType: '',
        dictionaryType: '',
        floatVolue: '',
        alarmThreshold: '',
        alarmLevel: '',
        deptName: '',
        pId: '',
        alarmGrade:[]
    };

    var idsArr = [], namesArr = [];
    function findDesignRuleInfo() {
        $('#dgrid').datagrid('load');
    }

    //添加规则设置
    function addDesignRuleInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'warningManage/addDesignRuleInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    layer.msg(data.msg, {
                        time: 1000
                    });
                    findDesignRuleInfo();
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

    //修改规则设置
    function modDesignRuleInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'warningManage/modDesignRuleInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    layer.msg(data.msg, {
                        time: 1000
                    });
                    findDesignRuleInfo();
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

    //删除规则
    function delDesignRuleInfo() {
        var cfg = {
            token: getCookie("token"),
            url: 'warningManage/delDesignRuleInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    layer.msg(data.msg, {
                        time: 1000
                    });
                    findDesignRuleInfo();
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

    //选择监管车辆
    $('#car_input').click(function() {
        findCarFreeGroup();
        var index1 = layer.open({
            type : 1,
            title : false,
            area : "400px",
            shade : 0,
            closeBtn : 1,
            content : $("#tree-car"),
            move : $('#tree-car .form-top')
        });
        $('#tree-car .close').off('click');
        $('#tree-car .close').click(function() {
            layer.closeAll();
        });
        $('#tree-car .submit-btn').off('click');
        $('#tree-car .submit-btn').click(function() {
            layer.close(index1);
        });
    });
    //监管车辆
    function findCarFreeGroup() {
        var shiftObj=[];
        var formData_car={};
        formData_car.deptId=getCookie("deptId");
        formData_car.type=0;
        var cfg={
            token:getCookie("token"),
            url:'car/findCarTree',
            data:formData_car,
            success:function(data){
                var result=data.data.carList;
                if(result.length>0){
                    // flag=0;
                    for(var i=0,l=result.length;i<l;i++){
                        shiftObj.push({"id":result[i].id,"pId":result[i].groupId,"name":result[i].carNum});
                    }
                }else {
                    // alert('请添加班组！');
                }
                $.fn.zTree.init($('#windowTree_car'), setting_car, openNodes(shiftObj));
            }
        };
        customAjax(cfg);
    }
    //绑定车辆
    var setting_car = {
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
            onCheck: zTreeClick_car
        }
    };
    //车辆控制面板
    function zTreeClick_car(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree_car"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes=zTree.getCheckedNodes(true);
        var idsArr=[],namesArr=[];
        for(var i in selectedNodes){
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }
        perObj['superviseCarIds']=idsArr.join(',');
        $('#car_input').val(namesArr.join(','));
    }
    //查询报警信息
    function findAlarmType() {
        var formData1 = {};
        formData1.dictionaryType ='alarmType';
        var $agentName = $('.alarmType');
        var arr = [];
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/queryDataDictionary',
            data: formData1,
            success: function (data) {
                var result = data.data;
                if (result.length > 0) {
                    for (var i = 0; i < result.length; i++) {
                        var res = result[i];
                        var $option;
                        $option = "<option value='" + res.typeId + "'>" + res.dictionaryName + "</option>";
                        arr.push($option);
                    }
                    $agentName.html(arr.join(''));
                    setSelectValue($('#addNew .alarmType'),perObj['alarmTypeName']);
                }
            }
        };
        customAjax(cfg);
    }

    //监管人员
    $("#person_input").click(function () {
        findPersonGroup();
        perObj['person_input']=[];
        $('#person_input').val();
        var index1 = layer.open({
            type : 1,
            title : false,
            area : "400px",
            shade : 0,
            closeBtn : 1,
            content : $("#tree-person"),
            move : $('#tree-person .form-top')
        });
        $('#tree-person .close').off('click');
        $('#tree-person .close').click(function() {
            layer.closeAll();
        });
        $('#tree-person .submit-btn').off('click');
        $('#tree-person .submit-btn').click(function() {
            layer.close(index1);
        });
    });

    //监管人员findPersonGroup
    function findPersonGroup() {
        var shiftObj=[];
        var formData_bz={};
        formData_bz.deptId=getCookie('deptId');
        var cfg={
            token:getCookie("token"),
            url:'person/findPersonInforTree',
            data:formData_bz,
            success:function(data){
                $('#windowTree1').html('');
                var result=data.data;
                if(result.length>0){
                    // flag=0;
                    for(var i=0,l=result.length;i<l;i++){
                        shiftObj.push({"id":result[i].personId,"name":result[i].personName});
                        $.fn.zTree.init($('#windowTree1'), setting_person, openNodes(shiftObj));
                    }
                }else {
                    $('#windowTree1').html('<li>暂无监管人员</li>');
                }
            }
        };
        customAjax(cfg);
    }

    //监管人员
    var setting_person = {
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
            onCheck: zTreeClick_person
        }
    };
    var nodes = [];
    var formData = {},//请求数据
        mType = '';//请求方法类型
    var perObj={};

    //人员控制面板
    function zTreeClick_person(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree1"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes=zTree.getCheckedNodes(true);
        var idsArr=[],namesArr=[];
        for(var i in selectedNodes){
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }

        perObj['supervisePersonIds']=idsArr.join(',');
        $('#person_input').val(namesArr.join(','));
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
    //新增规则绑定
    var $rowLen = 1;//默认显示行数
    var workTimeArr=[];//存放时间数组
    var wTimeArr=[],wTNameArr=[];//存放时间传入参数
    var timeNum=0;
    $(".btnTAdd").on('click',function(){
        $rowLen++;
        var $contDiv = $(".sTCont1").eq(0).html();
        var $contDiv1 = "<div class='sTCont sTCont1'>" + $contDiv + "</div>";
        $(".wSTime").append($contDiv1);
        wTimeArr=[];
        wTNameArr=[];
        postObj();
        delTime()
    });
    //添加时间
    function addTime() {
        $(".btnTAdd").off('click');
        $(".btnTAdd").on('click',function(){
            $rowLen++;
            var $contDiv = $(".sTCont1").eq(0).html();
            var $contDiv1 = "<div class='sTCont sTCont1'>" + $contDiv + "</div>";
            workTimeArr[$rowLen]=$contDiv1;
            $(".wSTime").append($contDiv1);
            wTimeArr=[];
            wTNameArr=[];
            postObj();
            delTime()
        });
    }
    //删除时间
    function delTime() {
        $(".btnTDel").off('click');
        $(".btnTDel").click(function () {
            $rowLen--;
            if($rowLen<1){
                $rowLen=1;
            }else{
                $(this).parent().parent('.sTCont1').remove();
            }
            postObj();
        });
    }
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        if(rows.length>0){
            for(var i=0; i<rows.length; i++){
                idsArr.push(rows[i].id);
                namesArr.push(rows[i].alarmName);
            }
        }
        getObj(timeNum);
    }
    //传入报警分级
    function postObj() {
        perObj['alarmGrade']=[];
        var $sTCont1=$('.sTCont1');
        var arr1=[];
        for(var i=0;i<$sTCont1.length;i++){
            var p=$sTCont1.eq(i).find('p');
            var txt1=p.eq(0).find('select').val();
            var txt2=p.eq(1).find('input.alarmMinVal').val();
            var txt3=p.eq(1).find('input.alarmMaxVal').val();
            var obj1={};
            obj1['alarmLevel']=parseInt(txt1);
            if(txt2!==''&&txt3!==''){
                if(isNum(txt2)&&isNum(txt3)){
                    obj1['alarmMinValue']=parseInt(txt2);
                    obj1['alarmMaxValue']=parseInt(txt3);
                    arr1.push(obj1);
                }else{
                    return 'false';
                }
                if(parseInt(txt2)>parseInt(txt3)){
                    return 'err';
                }
            }else if(txt2==''&&txt3==''){
                return '';
            }else{
                return 'false'
            }
        }
        if(arr1.length>0){
            return arr1;
        }else{
            return '';
        }

    }
    //根据返回数据生成报警分级
    function getObj(num) {
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
        addTime();
        delTime();
    }
    //查询报警分级
    function findAlarmLevelByRuleId() {
        var formData_bz={};
        formData_bz.ruleId=perObj['id'];
        var cfg = {
            token: getCookie("token"),
            url: 'warningManage/findAlarmLevelByRuleId',
            data: formData_bz,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var res=data.data;
                    if(res.length>0){
                        timeNum=res.length-1;
                        $rowLen=timeNum+1;
                    }else{
                        timeNum=0;
                        $rowLen=timeNum+1;
                    }
                    getObj(timeNum);
                    var $sTCont1=$('#addNew .sTCont1,#selectAll .sTCont1');
                    if(res.length>0){
                        for(var i=0;i<res.length;i++){
                            $sTCont1.eq(i).find('select.alarmLevel').val(res[i]['alarmLevel']);
                            $sTCont1.eq(i).find('input.alarmMinVal').val(res[i]['alarmMinValue']);
                            $sTCont1.eq(i).find('input.alarmMaxVal').val(res[i]['alarmMaxValue']);
                        }
                    }
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
});
