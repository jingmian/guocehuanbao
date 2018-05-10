
$(function () {
    var setting = {
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
            onCheck: zTreeClick
        }
    };
    var shiftManageOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'arrange/findTeam',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            userDeptId:userDeptId
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'teamName', title: '班次名称', width: 100,align:'left'},
            {field: 'attCount', title: '考勤次数(次)', width: 100, align: 'center'},
            {field: 'ruleName', title: '考勤规则', width: 100, align: 'center'},
            {field: 'attendCyc', title: '倒班周期(天)', width: 100, align: 'center'},
            {field: 'groupNames', title: '绑定班组', width: 150, align: 'center'},
            {field: 'remark', title: '备注', width: 300, align: 'left'}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            code:52,
            handler: function () {
            	mType='add';
                attContShow();
                getSelections();
                $('#dgrid').datagrid('unselectAll');
                $('.groupNames').focus(function () {
                    findFreeGroup();
                    var index=layer.open({
                        type: 1,
                        title: false,
                        area: "644px",
                        shade:0,
                        closeBtn: 1,
                        content: $("#tree-group"),
                        move: $('#tree-group .form-top')
                    });
                    $('#tree-group .submit-btn').click(function(){
                        layer.close(index);
                    });
                });
                $('#addNew .titleText').text('新增班次');
                getInput('teamName').val('');
                $('#addNew .personPhone').val('');
                $('#addNew .attendCyc').val('');
                $('#addNew .workName').val('');
                $('#addNew .groupNames').val('');
                $('#addNew .remark').val('');
                $('#time1').val('');
                $('#time2').val('');
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
                    postTime();
                    perObj['workTime']=wTimeArr.join(',');
                    perObj['workName']=wTNameArr.join(',');
                    formData.teamName=getInput('teamName').val();
                    formData.deptId=perObj['deptId'];
                    // formData.remark=perObj['remark'];
                    formData.attendCount=$('.attCount').val();
                    formData.attendRuleId=$('#addNew .attRuleId').val();
                    formData.attendCyc=$('.attendCyc').val();
                    formData.beforeIds=perObj['beforeIds'];
                    formData.afterIds=perObj['afterIds'];
                    formData.workTime=perObj['workTime'];
                    formData.workName=perObj['workName'];
                    formData.groupIds=perObj['groupIds'];
                    formData.groupNames=getInput('groupNames').val();
                    formData.remark=$('#addNew .remark').val();
                    if(formData.teamName==""||formData.attendCount==""||formData.attendCyc==""
                    ||formData.groupNames==""){
                    	layer.msg('带*号的不能为空',{time:3000});
                    	return;
                    }
                    if(isNaN(formData.attendCount)){
                    	layer.msg('考勤次数只能为数字',{time:3000});
                    	return;
                    }
                     if(isNaN(formData.attendCyc)){
                    	layer.msg('倒班周期只能为数字',{time:3000});
                    	return;
                    }
                    for(var i=0;i<wTimeArr.length;i++){
                    	var currWork=wTimeArr[i];
                    	var flag=verifyWorkTime(currWork);
                    	if(!flag){
                    		return;
                    	}
                    }
                    if(validMustField()){
                        addTeam(index);
                    }
                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            code:53,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要修改的班次',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                $('#addNew .titleText').text('修改班次');
                mType='mod';
                attContShow();
                getInput('teamName').val(perObj['teamName']);
                $('.attCount').val(perObj['attendCount']);
                $('.personPhone').val(perObj['personPhone']);
                $('.attendCyc').val(perObj['attendCyc']);
                getInput('groupNames').val(perObj['groupNames']);
                $('#addNew .remark').val(perObj['remark']);
                //时间绑定到输入框
                var timeArr=perObj['workTime'].split(',');
                var timeNameArr=perObj['workName'].split(',');
                var $sTCont1=$('.sTCont1');
                for(var i=0;i<timeArr.length;i++){
                    var timeArr1=[];
                    timeArr1=timeArr[i].split('-');
                    $sTCont1.eq(i).find('.time1').val(timeArr1[0]);
                    $sTCont1.eq(i).find('.time2').val(timeArr1[1]);
                    $sTCont1.eq(i).find('.workName').val(timeNameArr[i]);
                }
                var idsArr1=[],idsArr2=[],namesArr1=[],namesArr2=[],obj1={},obj2={};
                idsArr1=perObj['groupIds'].split(',');
                namesArr1=getInput('groupNames').val().split(',');
                for(var i=0;i<namesArr1.length;i++){
                    var name=namesArr1[i];
                    obj1[name]=idsArr1[i];
                }
                $('.groupNames').focus(function () {
                    findFreeGroup();
                    var index=layer.open({
                        type: 1,
                        title: false,
                        area: "644px",
                        shade:0,
                        closeBtn: 1,
                        content: $("#tree-group"),
                        move: $('#tree-group .form-top')
                    });
                    $('.layui-layer-close2').click(function () {
                        getInput('groupNames').val(perObj['groupNames']);
                    });
                    $('#tree-group .submit-btn').click(function(){
                        idsArr2=perObj['groupIds'].split(',');
                        namesArr2=getInput('groupNames').val().split(',');
                        for(var i=0;i<idsArr2.length;i++){
                            var name=namesArr2[i];
                            obj2[name]=idsArr2[i];
                        }
                        var arr1=[],arr2=[],arr3=[];
                        for(var i=0;i<namesArr1.length;i++){
                            var count=0;
                            for(var j=0;j<namesArr2.length;j++){
                                if(namesArr1[i]==namesArr2[j]){
                                    count++;
                                }
                            }
                            if(count==0){
                                arr1.push(obj1[namesArr1[i]]);
                            }
                        }
                        for(var m=0;m<namesArr2.length;m++){
                            var count=0;
                            for(var n=0;n<namesArr1.length;n++){
                                if(namesArr2[m]==namesArr1[n]){
                                    count++;
                                }
                            }
                            if(count==0){
                                arr2.push(obj2[namesArr2[m]]);
                            }
                        }
                        for(var o=0;o<namesArr2.length;o++){
                            arr3.push(obj2[namesArr2[o]]);
                        }
                        perObj['beforeIds']=arr1.join(',');
                        perObj['afterIds']=arr2.join(',');
                        perObj['groupIds']=arr3.join(',');
                        layer.close(index);
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
                    postTime();
                    perObj['workTime']=wTimeArr.join(',');
                    perObj['workName']=wTNameArr.join(',');
                    perObj['groupNames']=getInput('groupNames').val();
                    perObj['attendRuleId']=$('#addNew .attRuleId').val();
                    formData.teamId=perObj['teamId'];
                    formData.teamName=getInput('teamName').val();
                    formData.deptId=perObj['deptId'];
                    formData.remark=perObj['remark'];
                    formData.attendCount=$('.attCount').val();
                    formData.attendRuleId=perObj['attendRuleId'];
                    formData.attendCyc=$('.attendCyc').val();
                    formData.beforeIds=perObj['beforeIds'];
                    formData.afterIds=perObj['afterIds'];
                    formData.workTime=perObj['workTime'];
                    formData.workName=perObj['workName'];
                    formData.groupIds=perObj['groupIds'];
                    formData.remark=$('#addNew .remark').val();
                    // formData.groupNames=perObj['groupNames'];
                    if(formData.teamName==""||formData.attendCount==""||formData.attendCyc==""
                    ||formData.groupNames==""){
                    	layer.msg('带*号的不能为空',{time:3000});
                    	return;
                    }
                    if(isNaN(formData.attendCount)){
                    	layer.msg('考勤次数只能为数字',{time:3000});
                    	return;
                    }
                     if(isNaN(formData.attendCyc)){
                    	layer.msg('倒班周期只能为数字',{time:3000});
                    	return;
                    }
                    for(var i=0;i<wTimeArr.length;i++){
                    	var currWork=wTimeArr[i];
                    	var flag=verifyWorkTime(currWork);
                    	if(!flag){
                    		return;
                    	}
                    }
                    if(validMustField()){
                        modTeam(index);
                    }
                });
            }
        },{
            text: '删除',
            id: "btnDelete",
            code:54,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要删除的班次',{time:1000});
                    return;
                }
                if(row.length>0){
                    getSelections();
                }
                perObj['teamIds']=idsArr.join(',');
                perObj['teamNames']=namesArr.join(',');
                $('#delName').text(perObj['teamNames']);
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
                    formData.groupIds=perObj['groupIds'];
                    formData.teamIds=perObj['teamIds'];
                    delTeam(index);
                });
            }
        }, {
            text: '',
            id: "btnStatistList",
            handler: function () {
                layer.open({
                    type: 1,
                    title: false,
                    area: "1000px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#statistList"),
                    move: $('#statistList .title')

                })
            }
        }
        ],
        onSelect: function (index, row) {
            perObj['teamId'] = row.teamId;
            perObj['teamName'] = row.teamName;
            perObj['remark'] = row.remark;
            perObj['attendCount'] = row.attCount;
            perObj['attendRuleId'] = row.attendRuleId;
            perObj['ruleName'] = row.ruleName;
            perObj['attendCyc'] = row.attendCyc;
            perObj['workTime'] = row.workTime;
            perObj['workName'] = row.workName;
            perObj['groupIds'] = row.groupIds;
            perObj['groupNames'] = row.groupNames;
            groupIds=perObj['groupIds'];
            groupNames=perObj['groupNames'];
            var timeArr=[];
            timeArr=perObj['workTime'].split(',');
            timeNum=timeArr.length-1;
            $rowLen=timeNum+1;
            workTime(timeNum);
        },
        onLoadError: function () {
            console.log(1)
        },
        onLoadSuccess: function (row, index) {
            $('.dgrid .show-detail').click(function () {
                var orderId = $(this).attr('data-href');
                setTimeout(function () {
                    $('#btnStatistList').trigger('click');
                }, 100);
            })
        }
    };

    /**
     * 验证 work_time
     */
   function verifyWorkTime(wTime){
   		var wArr=wTime.split("-");
   		if(wArr.length!=2){
   			layer.msg('时间填写有误',{time:2000});
			return false;
   		}
   		for(var i=0;i<2;i++){
   			var currTime=wArr[i];
	    	var flag=true;
	    	if(currTime.length!=5){
				layer.msg('时间位数只能为5位',{time:2000});
				return false;
			}
			if(currTime.indexOf('：') >= 0){
				layer.msg('请使用英文时间分隔符',{time:2000});
				return false;
			}

			if(currTime.indexOf(':') < 0){
				layer.msg('缺失时间分割符',{time:2000});
				return false;
			}
			var arr=currTime.split(':');
			if(arr.length!=2){
				return false;
			}else{
				var his=arr[0];
				if(isNaN(his)){
					layer.msg('小时只能为数字',{time:2000});
					return false;
				}else{
					if(his>23){
						layer.msg('小时不能大于23',{time:2000});
						return false;
					}
				}

				var minute=arr[1];
				if(isNaN(minute)){
					layer.msg('分钟只能为数字',{time:2000});
					return false;
				}else{
					if(minute>59){
						layer.msg('分钟不能大于59',{time:2000});
						return false;
					}
				}
			}
   		}

   		var frist=wArr[0];
   		var second=wArr[1];

   		var fristStr="2017-12-21 "+frist+":00";
   		var secondStr="2017-12-21 "+second+":00";

   		var fristTime=new Date(fristStr).getTime();
   		var secondTime=new Date(secondStr).getTime();
   		if(fristTime>=secondTime){
   			layer.msg('上班时间不能大于等于下班时间',{time:2000});
			return false;
   		}
    	return flag;
    }


    datagridFn(shiftManageOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    //上班时间
    //新增上下班时间
    var $rowLen = 1;//默认显示行数
    var workTimeArr=[];//存放时间数组
    var wTimeArr=[],wTNameArr=[];//存放时间传入参数
    var timeNum=0;
    attContShow();
    $(".btnTAdd").on('click',function(){
        $rowLen++;
        var $contDiv = $(".sTCont1").eq(0).html();
        var $contDiv1 = "<div class='sTCont sTCont1'>" + $contDiv + "</div>";
        workTimeArr[$rowLen]=$contDiv1;
        $(".wSTime").append($contDiv1);
        wTimeArr=[];
        wTNameArr=[];
        attContShow();
        postTime();
        delTime();
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
            attContShow();
            postTime();
            delTime();
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
            attContShow();
            postTime();
        });
    }
    var formData = {},//请求数据
        mType='';
    var perObj={
        teamId:0,
        teamName:'',
        deptId:userDeptId,
        remark:'',
        attendCount:0,
        attendRuleId:0,
        ruleName:'',
        attendCyc:0,
        beforeIds:'',
        afterIds:'',
        workTime:'',
        workName:'',
        groupIds:'',
        groupNames:''
    };
    var idsArr=[],namesArr=[];
    var beforeIdsArr=[],afterIdsArr=[];
    var groupIds='',groupNames='';
    //查询班次
    findTeam();
    function findTeam() {
        $('#dgrid').datagrid('load');
    }
//点击查询图标
    $('.search-btn').click(function () {
        perObj['personName']=$('#personName').val();
        shiftManageOpt.queryParams['teamName']=perObj['personName'];
        findTeam();
    })
    //新增班次arrange/addTeam
    function addTeam(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/addTeam',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findTeam();
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

    //修改班次arrange/modTeam
    function modTeam(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/modTeam',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findTeam();
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

    //删除班次arrange/delTeam
    function delTeam(index) {
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/delTeam',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findTeam();
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
    //查询考勤
    findAttRule();
    //查询班组
    function findFreeGroup() {
        var shiftObj=[];
        var tId=0;
        if(mType=='mod'){
        	tId=perObj['teamId'];
        }
        formData={};
        // formData.userDeptId='1';
        formData.userDeptId=perObj['deptId'];
        formData.type=0;
        formData.teamId=tId;
        var cfg={
            token:getCookie("token"),
            url:'arrange/findFreeGroup',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result=data.data;
                    if(result.length>0){
                        // flag=0;
                        for(var i=0,l=result.length;i<l;i++){
                            shiftObj.push({"id":result[i].groupId,"pId":result[i].groupId,"name":result[i].groupName,"checked":result[i].checked});
                        }
                    }else {
                        // alert('请添加班组！');
                    }
                    $.fn.zTree.init($('#windowTree1'), setting, openNodes(shiftObj));
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
    //单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree=$.fn.zTree.getZTreeObj("windowTree1"),
            parentNode=treeNode.getParentNode();
        if(parentNode){
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        var selectedNodes=zTree.getCheckedNodes(true);
        var idsArr=[],namesArr=[];
//        if(mType=='mod'){
//            idsArr.push(groupIds);
//            namesArr.push(groupNames);
//        }
        for(var i in selectedNodes){
            idsArr.push(selectedNodes[i].id);
            namesArr.push(selectedNodes[i].name);
        }
        perObj['groupIds']=idsArr.join(',');
        perObj['groupNames']=namesArr.join(',');
        beforeIdsArr=idsArr;
        afterIdsArr=idsArr;
        $('.groupNames').val(perObj['groupNames']);
    };
    //考勤次数显示
    function attContShow() {
        $('.attCount').val(2*$rowLen);
    }
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        if(rows.length>0){
            for(var i=0; i<rows.length; i++){
                idsArr.push(rows[i].teamId);
                namesArr.push(rows[i].teamName);
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
            workTime(timeNum);
        }
        workTime(timeNum);
    }
    //传入时间
    function postTime() {
        var $sTCont1=$('.sTCont1');
        wTimeArr=[];
        wTNameArr=[];
        for(var i=0;i<$sTCont1.length;i++){
            var input=$sTCont1.eq(i).find('input');
            var time=input.eq(0).val()+'-'+input.eq(1).val();
            var timeName=input.eq(2).val();
            wTimeArr.push(time);
            wTNameArr.push(timeName);
        }
    }
    //根据返回数据生成上班时间
    function workTime(num) {
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
    //新增、修改按钮点击去掉红色边框
    removeValid();
})
