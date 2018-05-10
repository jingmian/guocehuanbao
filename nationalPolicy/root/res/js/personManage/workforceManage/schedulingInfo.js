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
            onClick: zTreeClick,
        }
    };
    var cyc=6;
    var formData = {};//请求数据
    var perObj={
        month:'',
        groupIds:'',
        personIds:'',
        startTime:'',
        workTimeIds:'',
        cyc:'',
        deptId:userDeptId
    };
    //获取当前月
    var date = new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1+"";
    if(month.length==1){
    	month="0"+month;
    }

//    for(var i=1;i<13;i++){
//        if(month<10){
//            month='0'+month;
//        }else{
//            month=month;
//        }
//    }
    $('#time1').val(year+'-'+month);
    var idsArr=[],namesArr=[];
    var $dateFmt="yyyy-MM";
    $('#time1').focus(function () {
        WdatePicker({el: 'time1',dateFmt:$dateFmt});
        var arr=$(this).val().split('-');
        year=arr[0];
        month=arr[1];
        findArrange();
    });
    var flag2=false;//是否生成排班
    //初始化排班
    function findArrange() {
        var dgData=[],$time1Val=$('#time1').val();
        perObj['month']=$time1Val;
        var txtArr=$time1Val.split('-');
        var year_txt=txtArr[0];
        var month_txt=txtArr[1];
        personTrue();
        formData.month=perObj['month'];
        formData.personName=perObj['personName'];
        formData.groupIds=perObj['groupIds'];
        cyc=time.getMonthHasDays(year_txt,month_txt);
        var cfg = {
            token: getCookie("toekn"),
            url: 'arrange/findArrange',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    dgData = data.data.data;
                    if (dgData.length > 0) {
                        var arr1=[],arr2=[],arr3=[],arr4=[];
                        var tr1="<th class='th1'>人员</th>";
                        arr1.push(tr1);
                        var time_work_arr=[],timeObj={},timeObj1={};
                        for(var l=0;l<dgData.length;l++){
                            var time=dgData[l].dateTime.split(',');
                            var workName=dgData[l].workName.split(';');
                            var timeArr=[],workNameArr=[];
                            timeObj={},timeObj1={};
                            time.forEach(function( item, index ) {
                                timeArr.push(item);
                            });
                            workName.forEach(function (item,index) {
                                workNameArr.push(item);
                            });
                            timeArr.forEach(function (item,index) {
                                timeObj[item]=workNameArr[index];
                            });
                            for(var m=0;m<cyc;m++){
                                var day=m<10?'0'+(m+1):(m+1);
                                if(m==9){
                                    day=10;
                                }
                                var date1=year+'-'+month+"-"+day;
                                timeObj1[date1]=timeObj[date1];
                            }
                            time_work_arr.push(timeObj1);
                        }
                        for(var j=0;j<cyc;j++){
                            var day=j<10?'0'+(j+1):(j+1);
                            if(j==9){
                                day=10;
                            }
                            var date1=year+'-'+month+"-"+day;
                            var tr1_1="<th class='th2'>"+date1+"</th>";
                            arr1.push(tr1_1);
                        }
                        for(var i=0;i<dgData.length;i++){
                            var personName=dgData[i].personName;
                            var workName=time_work_arr[i];
                            var td1="<td class='td1'>"+personName+"</td>";
                            arr3=[];
                            arr3.push(td1);
                            for(var key in workName){
                                arr4=[];
                                if(workName[key]&&workName[key]!==''){
                                    var spanArr=workName[key].split(',');
                                    for(var h=0;h<spanArr.length;h++){
                                        var span="<span flag='false' style='cursor: inherit;'>"+spanArr[h]+"</span>";
                                        arr4.push(span);
                                    }
                                }else{
                                    var span="<span flag='false' style='cursor: inherit;'>"+'——'+"</span>";
                                    arr4.push(span);
                                }

                                var td2="<td class='td2'>"+arr4.join('')+"</td>";
                                arr3.push(td2);
                            }
                            var tr='<tr>'+arr3.join('')+'</tr>';
                            arr2.push(tr);
                        }

                        $('#table').find('thead tr').html(arr1);
                        $('.infolistTable').find('.table').css({'width':'auto'});
                        $('#table').find('tbody').html(arr2).end().removeClass('schedulingInfoShow');
                        colunmWAuto(cyc,1);
                    }else{
                        $('#table').find('thead tr').html('');
                        $('.infolistTable').find('.table').css({'width':'100%'});
                        $('#table').find('tbody').html('暂无排班信息').end().addClass('schedulingInfoShow').css({'width':'100%'});
                        colunmWAuto(cyc,1);
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
        if(flag2==false){
            wulianAjax(cfg);
        }else{
            return;
        }
    }
    //判断人员是否输入
    function personTrue() {
        var personName=$('#personName').val();
        if(personName!==''&&personName!==undefined){
            perObj['personName']=$('#personName').val();
        }else{
            perObj['personName']=undefined;
        }
    }
    //点击查询图标
    $('.search-btn').click(function () {
        findArrange();
        successRoule();
    })
    //查询班组
    findGroup();
    function findGroup() {
        var shiftObj=[];
        formData={};
        // formData.userDeptId='1';
        formData.userDeptId=perObj['deptId'];
        formData.pageSize=1000;
        var cfg={
            token:getCookie("toekn"),
            url:'arrange/findGroup',
            data:formData,
            success:function(data){
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result=data.data.data;
                    if(result.length>0){
                        // flag=0;
                        for(var i=0,l=result.length;i<l;i++){
                            shiftObj.push({"id":result[i].groupId,"pId":result[i].groupId,"name":result[i].groupName});
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
        perObj['groupIds']=treeNode.id;
        perObj['groupName']=treeNode.name;
        findArrange();
        successRoule();
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
        var td=table.find('td');
        var span=td.find('span');
        var flag=false;
        span.click(function () {
            if($(this).attr('flag')=='false'){
                $(this).addClass('active');
                $(this).attr('flag','true');
            }else{
                $(this).removeClass('active');
                $(this).attr('flag','false');
            }
        })
    }
    //生成排班表
    function successRoule() {
        $('#btnShift').on('click',function () {
            var span=$('#table').find('span');
            for(var i=0;i<span.length;i++){
                if(span.eq(i).attr('flag')==true){
                    layer.msg('排班表生成成功！',function () {
                        time: 1000;
                        flag2=true;
                    })
                }
            }
        });
        return flag2;
    }
    //滚动框高度
    $('.infolistTable').css({'height':'93%'});
})
