var objGroup={};//班组对象,根据是否生成排班
$(function () {
    var dgData=[];
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
    var cyc=6;
    var shiftManageOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'arrange/findTeamByGroup',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            id:userDeptId
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'personName',title:'人员',width:100,formatter:function(value,row,index){
                return '<a data-href=" '+row.name+' " class="show-detail">'+value+'</a>'
            }}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        onSelect: function (index, row) {
            perObj['month'] = row.month;
            perObj['groupId'] = row.groupId;
            perObj['personIds'] = row.personIds;
            perObj['startTime'] = row.startTime;
            perObj['workTimeIds'] = row.workTimeIds;
            perObj['cyc'] = row.cyc;
            getSelections();
        },
        onLoadError:function(){
            console.log(1)
        },
        onLoadSuccess:function(row,index){
            $('.dgrid .show-detail').click(function(){
                var orderId=$(this).attr('data-href');
                setTimeout(function(){
                    $('#btnStatistList').trigger('click');
                },100);
            })
        }
    };
    datagridFn(shiftManageOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    var perObj={
        month:'',
        groupId:'',
        personIds:'',
        startTime:'',
        workTimeIds:'',
        cyc:6,
        deptId:userDeptId
    };
    var idsArr=[],namesArr=[];
    var $dateFmt="yyyy-MM-dd";
    $('#time1').focus(function () {
        WdatePicker({el: 'time1',dateFmt:$dateFmt});
    });
    //获取当前天

    function addDate(date, days) {
        if (days == undefined || days == '') {
            days = 1;
        }
        var date = new Date(date);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
    }

    // 日期月份/天的显示，如果是1位数，则在前面加上'0'
    function getFormatDate(arg) {
        if (arg == undefined || arg == '') {
            return '';
        }

        var re = arg + '';
        if (re.length < 2) {
            re = '0' + re;
        }

        return re;
    }
    $('#time1').val(addDate(new Date()));
//    var date = new Date();
//    var year=date.getFullYear();
//    var month=date.getMonth()+1;
//    for(var i=1;i<13;i++){
//        if(month<10){
//            month='0'+month;
//        }else{
//            month=month;
//        }
//    }
//    var day=date.getDate();
//    $('#time1').val(addDate(new Date()));
    var numDay;//每天排班次数
    var personAll;//共有多少排班人员
    var objRule={};//保存排班成功对象
    //初始化排班
    function findTeamByGroup() {
        formData={};
        formData.groupId=perObj['groupId'];
        cyc=perObj['cyc'];
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/findTeamByGroup',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var dgData = data.data.data;
                    personAll=dgData.length;
                    if (dgData.length > 0) {
                        cyc=dgData[0].attendCys;
                        var arr1=[],arr2=[],arr3=[],arr4=[];
                        var tr1="<th class='th1'>人员</th>";
                        arr1.push(tr1);
                        for(var j=0;j<cyc;j++){
                            var tr1_1="<th class='th2'>第"+(j+1)+"天</th>";
                            arr1.push(tr1_1);
                        }
                        for(var i=0;i<dgData.length;i++){
                            var personName=dgData[i].personName;
                            var currWorks=dgData[i].currWorks;
                            var currArr=[];
                            if(currWorks!=null){
                            	currArr=currWorks.split(";");
                            }

                            var workName=dgData[i].workName.split(',');
                            numDay=workName.length;
                            var td1="<td class='td1'>"+personName+"</td>";
                            var workTime=dgData[i].workTimeIds.split(',');
                            arr3=[];
                            arr3.push(td1);
                            for(var k=0;k<cyc;k++){
                            	var dayWorks=currArr[k];
                            	var dayArr=[];
                            	if(dayWorks!=null){
                            		dayArr=dayWorks.split(',');
                            	}

                                arr4=[];
                                for(var h=0;h<workName.length;h++){
                                	var flag=false;
                                	for(var d=0;d<dayArr.length;d++){
                                		if(dayArr[d]==workTime[h]){
                                			flag=true;
                                		}
                                	}
                                    var span=" <span ";
                                    if(flag){
                                    	span+=" class='active' flag='true' ";
                                    }else{
                                    	span+=" flag='false' ";
                                    }
                                    span+="  time='"+workTime[h]+"'>"+workName[h]+"</span> ";
                                    arr4.push(span);
                                }
                                var td2="<td class='td2'>"+arr4.join('')+"</td>";
                                arr3.push(td2);
                            }
                            var tr='<tr>'+arr3.join('')+'</tr>';
                            arr2.push(tr);
                        }

                        $('#table').find('thead tr').html(arr1);
                        $('#table').find('tbody').html(arr2);
                        //添加规则设置参数
                        var personIdsArr=[],workTimeIdsArr=[],startTimeArr=[],cycArr=[];
                        for(var n=0;n<dgData.length;n++){
                            var personId=dgData[n].personId;
                            var workTimeId=dgData[n].workTimeIds;
                            var startTime=$('#time1').val();
                            var attendCy=dgData[n].attendCys;
                            personIdsArr.push(personId);
                            workTimeIdsArr.push(workTimeId);
                            startTimeArr.push(startTime);
                            cycArr.push(attendCy);
                        }
                        perObj['personIds']=personIdsArr.join(',');
                        perObj['startTime']=$('#time1').val();
                        perObj['cyc']=cycArr.join(',');
                        colunmWAuto(cyc,1);
                        clickColunmData();
                    }
                } else if (data.code == 2 || data.code == 1) {
                    tokenRequest(function () {
                        wulianAjax(cfg);
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
    function findTeamByGroup1() {
        formData={};
        formData.groupId=perObj['groupId'];
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/findTeamByGroup',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var dgData1 = data.data.data;
                    if (dgData1.length > 0) {
                        //添加规则设置参数
                        var personIdsArr=[],workTimeIdsArr=[],startTimeArr=[],cycArr=[];
                        for(var n=0;n<dgData1.length;n++){
                            var personId=dgData1[n].personId;
                            var workTimeId=dgData1[n].workTimeIds;
                            var startTime=$('#time1').val();
                            var attendCy=dgData1[n].attendCys;
                            personIdsArr.push(personId);
                            workTimeIdsArr.push(workTimeId);
                            startTimeArr.push(startTime);
                            cycArr.push(attendCy);
                        }
                        perObj['personIds']=personIdsArr.join(',');
                        perObj['startTime']=$('#time1').val();
                        perObj['cyc']=cycArr.join(',');
                        colunmWAuto(cyc,1);
                        clickColunmData();
                    }
                } else if (data.code == 2 || data.code == 1) {
                    tokenRequest(function () {
                        wulianAjax(cfg);
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
    //增加排班规则设置
    function addArrange(){
        formData={};
        formData.personIds=perObj['personIds'];
//        formData.startTime=perObj['startTime'];
       	formData.startTime=$('#time1').val();
        formData.workTimeIds=perObj['workTimeIds'];
        formData.cyc=perObj['cyc'];
        var cfg = {
            token: getCookie("token"),
            url: 'arrange/addArrange',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    if (dgData.length > 0) {

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
    //查询班组
    findFreeGroup();
    function findFreeGroup() {
        var shiftObj=[];
        formData={};
        // formData.userDeptId='1';
        formData.userDeptId=perObj['deptId'];
        formData.type=1;
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
                            shiftObj.push({"id":result[i].groupId,"pId":result[i].groupId,"name":result[i].groupName});
                            objGroup[result[i].groupId]='false';
                        }
                    }else {
                        // flag=1;//第一次添加
                    }
                    $.fn.zTree.init($('#treeDemo'), setting, openNodes(shiftObj));
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
        var zTree=$.fn.zTree.getZTreeObj("treeDemo"),
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
        perObj['groupId']=treeNode.id;
        perObj['groupName']=treeNode.name;
        setTime();
        if(objGroup[perObj['groupId']]=='false'){
            findTeamByGroup();
            successRoule();
        }else{
            $('.infolistTable').html(objRule[perObj['groupId']]);
            findTeamByGroup1();
            clickColunmData();
            successRoule();
        }
    };
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
    //表格列宽度自适应
    colunmWAuto(cyc,1);
    //窗口大小改变
    $(window).resize(function () {
        colunmWAuto(cyc,1);
    });
    var flags=[];
    //点击数据表格列
    function clickColunmData() {
        var table=$('#table');
        var td=$('#table tr td.td2');
        // cyc=td.length+1;
        var span=$('#table tr td.td2>span');
        var flag=false;
        span.click(function () {
            if($(this).attr('flag')=='false'){
                $(this).addClass('active');
                $(this).attr('flag','true');
            }else{
                $(this).removeClass('active');
                $(this).attr('flag','false');
            }
        });
    }
    //设置每天的时间
    var workTimeIds='';
    function setTime() {
        var tr=$('#table tbody tr');
        var td2=$('#table tbody tr td.td2');
        var span=td2.eq(0).find('span');
        numDay=span.length;
        var len=tr.length;
        cyc=td2.length/len;
        var time1Arr1=[];
        var cycs1=cyc*len;
        var cycArr=[];
        for(var i=0;i<cycs1;i++){
            for(var j=0;j<numDay;j++){
                var span1=td2.eq(i).find('span').eq(j);
                var time1=span1.attr('time');
                if(span1.attr('flag')=='true'){
                    time1=span1.attr('time');
                }else{
                    if(j%2==0){
                        time1='null';
                    }else{
                        time1='null';
                    }
                }
                if(i==cycs1-1&&j==numDay-1){
                }else if(i!==cycs1-1){
                    if(j==numDay-1){
                        time1=time1+'TIME';
                    }
                }
                time1Arr1.push(time1);
            }
        }
        for(var k=0;k<len;k++){
            cycArr.push(cyc);
        };
        var workTimeIds=time1Arr1.join(',').split('TIME,').join(';').replace(/null,/ig,'').replace(/,null/ig,'');
        perObj['workTimeIds']=workTimeIds;
        perObj['cyc']=cycArr.join(',');
    }
    //生成排班表
    function successRoule() {
        var arrFlag1=[];
        var $infoTable_groupId=$('.infolistTable');
        $('#btnShift').off('click');
        $('#btnShift').on('click',function () {
            setTime();
            var groupId=perObj['groupId'];
            var tr=$('#table tbody tr');
            var td=$('#table td.td2');
            var span=td.find('span');
            var len,arrTd=[],arrFlag=[],arrObj={};
            arrFlag1=[];
            tr.each(function () {
                var td=$(this).find('td.td2');
                var index1=$(this).index();
                td.each(function () {
                    var index2=$(this).index();
                    var index=index1+'_'+index2;
                    var span=$(this).find('span');
                    arrFlag=[],arrFlag1=[];
                    span.each(function () {
                        var flag=$(this).attr('flag');
                        arrFlag.push(flag);
                    });
                    arrObj[index]=arrFlag;
                    arrTd.push(index);
                })
            })
            len=arrTd.length;
            for(m in arrObj){
                var m1=arrObj[m];
                for(n=0;n<m1.length;n++){
                    var flag1=m1[n];
                    if(flag1=='true'){
                        arrFlag1.push(flag1);
                        break;
                    }
                }
            }
            if(arrFlag1.length>=len){
                layer.msg('生成排班成功！',{
                    time:1000
                });
                objGroup[perObj['groupId']]='true';
            }else{
                layer.msg('失败，每一天至少选择一个班次！',{
                    time:1000
                });
                objGroup[perObj['groupId']]='false';
            }
            if(objGroup[perObj['groupId']]=='true'){
                addArrange();
                objRule[perObj['groupId']]=$infoTable_groupId.html()
                return ;
            }
        });
        return objGroup[perObj['groupId']]
    }
    //滚动框高度
    $('.infolistTable').css({'height':'93%'});
})
