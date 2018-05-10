$(function () {
    var dgData=[],idsArr = [];//表格数据

    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl + "systemNoticeRemind/findOilRule",  //请求地址
        //请求传递的参数
        queryParams: {
            // pageSize: 20,
            // pageNo: 1,
            // gridType: 'easyui',
            // recordStatus: 10
        },
        pageSize: 20,
        loadMsg: '请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'ruleId',title:'规则id',hidden:true,width:100,align:'left'},
            {field:'ruleName',title:'规则名称',width:100,align:'left'},
            /*{field:'carTypeName',title:'车型',width:100,align:'center'},
            {field:'serviceLife',title:'使用年限',width:100,align:'right'},*/
            {field:'carTypeName',title:'车型',width:100,align:'center'},
            {field:'oilConsume',title:'油耗',width:100,align:'right'},
            {field:'oilValue',title:'油量',width:100,align:'right'},
           /* {field:'value',title:'阈值',width:100,align:'right'},
            {field:'num',title:'连续数据',width:100,align:'right'},*/
          /*  {field:'isRemind',title:'是否提醒',width:100,align:'center',formatter:function (value, row, index) {
                if(row != null && row.isRemind != null && row.isRemind == 1){
                    return '提醒';
                }else{
                    return '不提醒';
                }
            }},*/
            {field:'num1',title:'',width:600,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
            text:'新增',
            id: "btnNewAdd",
            code:182,
            handler:function() {
                $('#dgrid').datagrid('unselectAll');
                $('#addNew .titleText').text('新增油耗规则信息');
                //--------获取车型下拉列表
                ruleObj['carType']='';
                findCarType();
                removeValid();
                getInput('ruleName').val('');
                getInput('carType').val('');
                getInput('oilValue').val(0);
                getInput('oilConsume').val(0);
                var index=layer.open({
                    type:1,
                    title:false,
                    area:'500px',
                    // shadeClose:false,
                    closeBtn:1,
                    content:$('#addNew'),
                    move:$('#addNew .title')
                });
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    if(validMustField()){
                        formData.ruleName=getInput('ruleName').val();
                        formData.carType=getInput('carType').val();
                        var oilValue=getInput('oilValue').val();
                        if (isNum(oilValue)) {
                            formData.oilValue = oilValue;
                        }else{
                            layer.msg('油量为非负数',{timer:1000});
                            return false;
                        }
                        var oilConsume=getInput('oilConsume').val();
                        if (isNum(oilConsume)) {
                            formData.oilConsume = oilConsume;
                        }else{
                            layer.msg('油耗为非负数',{timer:1000});
                            return false;
                        }
                      /*  formData.num=getInput('num').val();*/
                        /*formData.isRemind=getInput('isRemind').val();*/
                        addOilRule();
                        layer.close(index);
                    }
                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            code:183,
            handler: function () {
                // dgridOneRow('mod','请选择要修改的油耗规则信息');
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要修改的油耗信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                findCarType();
            	$('#addNew .titleText').text('修改油耗规则信息');
                removeValid();
                getInput('ruleName').val(ruleObj['ruleName']);
                getInput('oilValue').val(ruleObj['oilValue']);
                getInput('oilConsume').val(ruleObj['oilConsume']);
               /* getInput('num').val(ruleObj['num']);
                getInput('isRemind').val(ruleObj['isRemind']);*/
                var index=layer.open({
                    type:1,
                    title:false,
                    area:'500px',
                    // shadeClose:false,
                    closeBtn:1,
                    content:$('#addNew'),
                    move:$('#addNew .title')
                });
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    if(validMustField()){
                        formData={};
                        formData.ruleName=getInput('ruleName').val();
                        formData.carType=getInput('carType').val();
                        var oilValue=getInput('oilValue').val();
                        if (isNum(oilValue)) {
                            formData.oilValue = oilValue;
                        }else{
                            layer.msg('油量为非负数',{timer:1000});
                            return false;
                        }
                        var oilConsume=getInput('oilConsume').val();
                        if (isNum(oilConsume)) {
                            formData.oilConsume = oilConsume;
                        }else{
                            layer.msg('油耗为非负数',{timer:1000});
                            return false;
                        }
                        formData.ruleId=ruleObj['ruleId'];
                        modOilRule();
                        layer.close(index);
                    }
                });
            }
        },{
            text:'删除',
            id: "btnDelete",
            code:184,
            handler:function() {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要删除的字典信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    getSelections();
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                $('#dInfo').text(ruleObj['ruleName']);
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    // shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                });
                $('#delete .no').click(function(){layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function(){
                    var str = idsArr.join(',');
                    ruleObj['ruleId']=str;
                    formData={};
                    formData.ruleId=ruleObj['ruleId'];
                    delOilRule();
                    layer.close(index);

                });
            }
        },{
            text: '刷新',
            id: "btnConfirm",
            code:185,
            handler: function () {
                $('#dgrid').datagrid('reload',applyListOpt.queryParams)
            }
        }
        ],
        onSelect: function (index, row) {
        	formData.ruleId=row.ruleId;
            formData.ruleName=row.ruleName;
            // formData.carType=row.carType;
            formData.oilConsume=row.oilConsume;
            formData.oilValue=row.oilValue;
          /*  formData.num=row.num;
            formData.isRemind=row.isRemind;*/
        	ruleObj['ruleId'] = row.ruleId;
            ruleObj['ruleName'] = row.ruleName;
            ruleObj['carType'] = row.carTypeName;
            ruleObj['oilConsume'] = row.oilConsume;
            ruleObj['oilValue'] = row.oilValue;
          /*  ruleObj['num'] = row.num;
            ruleObj['isRemind'] = row.isRemind;*/
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
    var formData={};//请求数据
    var ruleObj={
        ruleId:0,
        ruleName:'',
        cartype:0,
        oilConsume:0,
        oilValue:0
   /*     num:0,
        isRemind:0*/
    };
    var idsArr=[],namesArr=[];
    //查询规则
    function findOilRule() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        applyListOpt.queryParams['ruleName']=$('#personName').val();
        findOilRule();
    })
    //新增公告
    function addOilRule() {
        var cfg = {
            token: getCookie("token"),
            url: 'systemNoticeRemind/addOilRule',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                	findOilRule();
                    layer.msg('新增成功！', {
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

    //修改公告
    function modOilRule() {
    	var cfg = {
                token: getCookie("token"),
                url: 'systemNoticeRemind/modOilRule',
                data: formData,
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.code == 0) {
                    	findOilRule();
                        layer.msg('修改成功！', {
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

    //删除公告
    function delOilRule() {
    	var cfg = {
                token: getCookie("token"),
                url: 'systemNoticeRemind/delOilRule',
                data: formData,
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.code == 0) {
                    	findOilRule();
                        layer.msg('删除成功！', {
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

    //查询车辆类型信息
    function findCarType() {
        var formData1={};
        formData1.dictionaryType='carType';
        formData1.carType=ruleObj['carType'];
        var $agentName=$('.carType');
        var arr=[];
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/findCartypes',
            data: formData1,
            success: function (data) {
                data = $.parseJSON(data);
                var result=data.data;
                if (data.code == 0) {
                    if(result.length>0){
                        for(var i=0;i<result.length;i++){
                            var res=result[i];
                            var $option="<option value='"+res.typeId+"'>"+res.dictionaryName+"</option>";
                            arr.push($option);
                        }
                        $agentName.html(arr.join(''));
                        setSelectValue($('#addNew .carType'),ruleObj['carType']);
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

