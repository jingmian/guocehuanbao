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
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'person/findRealAttend',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            deptId:userDeptId,
            type:4
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'deptName',title:'用户部门',width:150,align:'left'},
            {field:'personName',title:'人员名称',width:150,align:'center'},
            {field:'startTime',title:'开始时间',width:150,align:'center'},
            {field:'endTime',title:'结束时间',width:150,align:'center'},
            {field:'addTime',title:'录入时间',width:150,align:'center'},
            {field:'leaveType',title:'请假类型',width:100,align:'center'},
            {field:'leaveRemark',title:'备注',width:300,align:'left'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
            text:'新增',
            id: "btnNewAdd",
            code:63,
            handler:function() {
            	var cfg = {
	            token: getCookie("token"),
	            url: 'datadictionary/queryDataDictionary',
	            data: {dictionaryType:'leaveType'},
	            success: function (data) {
                    $('#dgrid').datagrid('unselectAll');
	                $('#addNew .titleText').text('新增请假');
	                getInput('startTime').val('');
	                getInput('endTime').val('');
	                getInput('addTime').val('');
	                $('#leaveType').val('');
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
	                    $('#dept-form-Tree .close').click(function(){
	                        layer.closeAll();
	                    });
	                    $('#dept-form-Tree .submit-btn').click(function(){
	                        layer.close(index1);
	                    });
	                });
	                $('.personName').focus(function () {
	                    findPerson1($('#windowTree1'));
	                    var index2=layer.open({
	                        type: 1,
	                        title: false,
	                        area: "400px",
	                        shade:0,
	                        closeBtn: 1,
	                        content: $("#pers-form-Tree"),
	                        move: $('#pers-form-Tree .form-top')
	                    });
	                    $('#pers-form-Tree .close').click(function(){
	                        layer.closeAll();
	                    });
	                    $('#pers-form-Tree .submit-btn').click(function(){
	                        layer.close(index2);
	                    });
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
	                $('#addNew .no').click(function(){layer.closeAll();
	                });
	                $('#addNew .yes').off('click');
	                $('#addNew .yes').click(function(){
	                    formData.deptId=perObj['deptId'];
	                    formData.type=perObj['type'];
	                    formData.personId=perObj['personId'];
	                    formData.startTime=getInput('startTime').val();
	                    formData.endTime=getInput('endTime').val();
	//                    formData.addTime=getInput('addTime').val();
	                    formData.leaveType=$('.leaveType').val();
	                    formData.leaveRemark= $('.remark').val();
	                    if(validMustField()){
	                        addLeave(index);
	                    }
	                });

	                var arr=data.data;

	                var html="";
	                for(var i=0;i<arr.length;i++){
	                	var o=arr[i];
	                	html+="<option value='"+o.typeId +"'>"+o.dictionaryName+"</option>";
	                }

	                $(".leaveType").html(html);

	            }
	        };
	        customAjax(cfg);
           }
        },{
            text:'修改',
            id: "btnApudate",
            code:64,
            handler:function() {
            	//根据id查询请假信息
            	var rows = $('#dgrid').datagrid('getSelections');
            	if(rows.length!=1){
            		layer.msg('请选择需要修改的记录，只能选中一条记录修改',{time:2000});
            		return;
            	}
            	var cfg = {
	            token: getCookie("token"),
	            url: 'person/findRealAttendById',
	            data: {id:rows[0].id},
	            success: function (data) {
                	var attend=data.data;
                    $('#dgrid').datagrid('unselectAll');
	                $('#addNew .titleText').text('修改请假信息');
	                $(".deptId").val(attend.deptName);
	                $(".personName").val(attend.personName);
	                getInput('startTime').val(attend.startTime.split(" ")[0]);
	                getInput('endTime').val(attend.endTime.split(" ")[0]);
	                $('.remark').val(attend.leaveRemark);

	                var id=rows[0].id;
	                perObj['deptId']=attend.deptId;
	                perObj['personId']=attend.personId;
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
	                    $('#dept-form-Tree .close').click(function(){
	                        layer.closeAll();
	                    });
	                    $('#dept-form-Tree .submit-btn').click(function(){
	                        layer.close(index1);
	                    });
	                })
	                $('.personName').focus(function () {
	                    findPerson1($('#windowTree1'));
	                    var index2=layer.open({
	                        type: 1,
	                        title: false,
	                        area: "400px",
	                        shade:0,
	                        closeBtn: 1,
	                        content: $("#pers-form-Tree"),
	                        move: $('#pers-form-Tree .form-top')
	                    });
	                    $('#pers-form-Tree .close').click(function(){
	                        layer.closeAll();
	                    });
	                    $('#pers-form-Tree .submit-btn').click(function(){
	                        layer.close(index2);
	                    });
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
	                $('#addNew .no').click(function(){layer.closeAll();
	                });
	                $('#addNew .yes').off('click');
	                $('#addNew .yes').click(function(){
	                	formData.id=id;
	                    formData.deptId=perObj['deptId'];
	                    formData.type=perObj['type'];
	                    formData.personId=perObj['personId'];
	                    formData.startTime=getInput('startTime').val();
	                    formData.endTime=getInput('endTime').val();
//		                    formData.addTime=getInput('addTime').val();
	                    formData.leaveType=$('.leaveType').val();
	                    formData.leaveRemark= $('.remark').val();
	                    if(validMustField()){
	                        updateLeave(index);
	                    }
	                });

	                var cfg_ = {
		            token: getCookie("token"),
		            url: 'datadictionary/queryDataDictionary',
		            data: {dictionaryType:'leaveType'},
		            success: function (data_) {
		            		var arr=data_.data;

		                	var html="";
		                	for(var i=0;i<arr.length;i++){
		                		var o=arr[i];
		                		html+="<option value='"+o.typeId +"'>"+o.dictionaryName+"</option>";
		                	}

		               	 	$(".leaveType").html(html);
		               	 	$('.leaveType').val(attend.leaveType);
		            	}
	                }
	               customAjax(cfg_);
	            }
	        };
	        customAjax(cfg);
            }
        },
        {
            text:'删除',
            id: "btnDelete",
            code:65,
            handler:function() {
                var rows = $('#dgrid').datagrid('getSelections');
            	if(rows.length==0){
            		layer.msg('请选择需要删除的记录，只能选中一条记录修改',{time:2000});
            		return;
            	}

            	var ids="";
            	for(var i=0;i<rows.length;i++){
            		ids+=rows[i].id+",";
            	}
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
                    var cfg_ = {
		            token: getCookie("token"),
		            url: 'person/deleteAttendByIds',
		            data: {ids:ids},
		            success: function (data) {
		            		findRealAttend();
                    		layer.msg(data.msg, {
                        		time: 1000
                    		});
                    		layer.close(index);
		            	}
	                }
	               customAjax(cfg_);
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
            perObj['deptId'] = row.deptId;
            perObj['type'] = row.type;
            perObj['personId'] = row.personId;
            perObj['startTime'] = row.startTime;
            perObj['endTime'] = row.endTime;
            perObj['addTime'] = row.addTime;
            perObj['leaveType'] = row.leaveType;
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
        deptId:userDeptId,
        deptName:'',
        type:4,
        personId:0,
        personName:'',
        startTime:'',
        endTime:'',
        leaveType:0
    };
    var idsArr=[],namesArr=[];
    var $dateFmt="yyyy-MM-dd";
    $('#time1').focus(function () {
        WdatePicker({el: 'time1',dateFmt:$dateFmt,maxDate:'#F{$dp.$D(\'time2\')}'});

    });
    $('#time2').focus(function () {
        WdatePicker({el: 'time2',dateFmt:$dateFmt,minDate:'#F{$dp.$D(\'time1\')}'});
    });
    var treeNodeRole=[];
    //查询出勤记录
    function findRealAttend() {
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['personName']=$('#personName').val();
        applyListOpt.queryParams['personName']=perObj['personName'];
        findRealAttend();
    })
    //增加请假
    function addLeave(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'person/addLeave',
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
    //修改

    function updateLeave(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'person/updateLeave',
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
            idsArr.push(rows[i].personId);
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
    function findPerson1($dom) {
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
        var zTree=$.fn.zTree.getZTreeObj("windowTree");
        // zTree.expandNode(treeNode);//节点单击展开/收缩
        perObj['deptId']=treeNode.id;
        perObj['deptName']=treeNode.name;
        $('.deptId').val(treeNode.name);
    };
    //人员单击
    function zTreeClick2(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree1");
        // zTree.expandNode(treeNode);//节点单击展开/收缩
        var selectedNodes=zTree.getCheckedNodes(true);
        perObj['personId']=treeNode.id;
        perObj['personName']=treeNode.name;
        $('.personName').val(perObj['personName']);
    };
    //请假类型
    $('#leaveType').on('click change',function () {
        perObj['leaveType']=$(this).find('option:selected').val();
    })
    //新增、修改按钮点击去掉红色边框
    removeValid();
})
