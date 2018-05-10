//获取所有输入框
function getInput(ipt) {
    var inputObj={};
    var $addNew=$('#addNew,#insertBeta');
    var $li=$addNew.find('li');
    var $input=$li.find('input');
    for(var i=0,l=$input.length;i<l;i++){
        var val=$($input[i]).val();
        var cls=$($input[i]).attr('class');
        inputObj[cls]=val;
    }
    return $('.'+ipt);
}
//验证规则
function validatRule(name,ipt) {
    var val=getInput(ipt).val();
    var $txt=getInput(ipt).parent().find('em').text();
    var state=false;
    //是否匹配
    function isReg(reg) {
        if(!(reg.test(val))){
            state=false;
        }else{
            state=true;
        }
    }
    //不同reg正则表达式
    // setReg();
    function setReg(reg) {
        if($txt.indexOf('*')>=0){//必填字段
            if(val==''){
                state=false;
            }else{
                isReg(reg);
            }
        }else{//非必填字段
            if(val&&val!==''){
                isReg(reg);
            }
        }
    }
    switch (name){
        case 'phone':
            setReg(/^1[3|4|5|8][0-9]\d{4,8}$/);
            break;
        case 'all':
            setReg(/\S/);
            break;
        default:
            setReg(/\S/);
    }
    return state;
}
//输入框值改变时，验证发生变化
function validState(name,ipt) {
    var val=getInput(ipt).val();
    validatRule(name,ipt);
    getInput(ipt).on('focus blur click keyup keydown',function () {
        if(validatRule(name,ipt)==true){
            getInput(ipt).removeClass('errorBorderRed');
        }else{
            getInput(ipt).addClass('errorBorderRed');
        }
    });
    return validatRule(name,ipt);
}
//获取当前天
var date = new Date();
var year=date.getFullYear();
var month=date.getMonth()+1;
for(var i=1;i<13;i++){
    if(month<10){
        month='0'+month;
    }else{
        month=month;
    }
}
var day=date.getDate();
//时间控件封装
function timeControl($dom,dom,$dateFmt) {
    $dom.focus(function () {
        WdatePicker({el: dom,dateFmt:$dateFmt});
    });
}
//费用明细添加和删除功能
function costDetail(name,money) {
    var $rowLen=1;
    $(".btnTAdd").click(function () {
        $rowLen++;
        var $contDiv = $(".sTCont1").eq(0).html();
        var $contDiv1 = "<div class='sTCont sTCont1'>" + $contDiv + "</div>";
        $(".wSTime").append($contDiv1);
        delTime();
    });
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
        });
    };
    //取得所有选中行数据
    var timeNum=0;
    getSelections();
    function getSelections() {
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            name=rows[i].detailsNmaes;
            money=rows[i].detailsMoneys;
        }
        var nameArr=[];
        nameArr=name.split(',');
        timeNum=nameArr.length-1;
        $rowLen=timeNum+1;
        workTime(timeNum);
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
        $wSTime.html(contArr.join(''));
        for(var i=0;i<num;i++){
            var div2= $wSTime.find(".sTCont1").eq(0).html();
            var $div2 = "<div class='sTCont sTCont1'>" + div2 + "</div>";
            $wSTime.append($div2);
        }
        delTime();
    }
}
function workTime1() {
    var contArr=[];
    var $wSTime=$(".wSTime");
    var h3=$wSTime.find('h3').html();
    var $h3="<h3 class='sTTitle'>"+h3+"</h3>";
    var div0=$wSTime.find('.sTCont').eq(0).html();
    var $div0="<div class='sTCont'>"+div0+"</div>";
    var div1= $wSTime.find(".sTCont1").eq(0).html();
    var $div1 = "<div class='sTCont sTCont1'>" + div1 + "</div>";
    contArr=[$h3,$div0,$div1];
    $wSTime.html(contArr.join(''));
}
//查找车型和保险商
/*
* param {callBack} 回调函数
* param {jsonData} 包含数据字典id的json对象
* */
function carType_insProvider(callBack,jsonData) {
    var arr1=[],arr2=[],arr3=[],arr4=[],arr_1=[],arr_2=[],arr_3=[],arr_4=[];
    //查询字典
    function queryDataDictionary() {
        var formData1={};
        var result=[];
        // formData1.pageSize=1000;
        arr1=[],arr2=[],arr3=[],arr4=[],arr_1=[],arr_1=[],arr_3=[],arr_4=[];
        var cfg = {
            token: getCookie("token"),
            url: 'datadictionary/queryDataDictionary',
            data: formData1,
            success: function (data) {
                result=data.data;
                if(result.length>0){
                    for(var i=0;i<result.length;i++){
                        var res1=result[i];
                        if(res1.dictionaryType=='carType'){
                            arr1.push(res1.dictionaryName);
                            arr2.push(res1.typeId);
                        }
                        if(res1.dictionaryType=='carProvider'){
                            arr3.push(res1.dictionaryName);
                            arr4.push(res1.typeId);
                        }
                        if(res1.dictionaryType=='carBrand'){
                            arr_1.push(res1.dictionaryName);
                            arr_2.push(res1.typeId);
                        }
                        if(res1.dictionaryType=='insProvider'){
                            arr_3.push(res1.dictionaryName);
                            arr_4.push(res1.typeId);
                        }
                    }
                    bind_car_insp(callBack,jsonData);
                }
            }
        };
        customAjax(cfg);
    }
    //数据字典中的数据绑定到页面位置
    function bind_car_insp(callback,jsonData) {
        var $carType=$('.carType');
        var $insProvider=$('.insuranceProviderId');
        var $carBrand=$('.carProvider');
        var $carProvider=$('.carBrand');
        var arr5=[],arr6=[],arr7=[],arr8=[];
        for(var i=0;i<arr1.length;i++){
            var res3=arr1[i];
            var res4=arr2[i];
            var $option;
            if(jsonData && jsonData.carType==res3){
                $option="<option value='"+res4+"' selected>"+res3+"</option>";
            }else{
                $option="<option value='"+res4+"'>"+res3+"</option>";
            }
            arr5.push($option);
        }
        $carType.html(arr5.join(''));
        for(var j=0;j<arr3.length;j++){
            var res5=arr3[j];
            var res6=arr4[j];
            var $option;
            if(jsonData && jsonData.carProvider==res5){
                $option="<option value='"+res6 +"' selected>"+res5+"</option>";
            }else{
                $option="<option value='"+res6 +"'>"+res5+"</option>";
            }
            arr6.push($option);
        }
        $carBrand.html(arr6.join(''));
        for(var i=0;i<arr_1.length;i++){
            var res3=arr_1[i];
            var res4=arr_2[i];
            var $option;
            if(jsonData && jsonData.carBrand==res3){
                $option="<option value='"+res4+"' selected>"+res3+"</option>";
            }else{
                $option="<option value='"+res4+"'>"+res3+"</option>";
            }
            arr7.push($option);
        }
        $carProvider.html(arr7.join(''));
        for(var j=0;j<arr_3.length;j++){
            var res5=arr_3[j];
            var res6=arr_4[j];
            var $option;
            if(jsonData && jsonData.insProviderId==res5){
                $option="<option value='"+res6 +"' sele>"+res5+"</option>";
            }else{
                $option="<option value='"+res6 +"'>"+res5+"</option>";
            }
            arr8.push($option);
        }
        $insProvider.html(arr8.join(''));
        callBack && callback(jsonData);
    }
    queryDataDictionary();
}
//查询车辆信息
function findCar() {
    var formData1={};
    formData1.ids=userDeptId;
    formData1.pageSize=1000;
    var $carNum=$('.carNum');
    var arr=[];
    var cfg = {
        token: getCookie("toekn"),
        url: 'car/findCar',
        data: formData1,
        success: function (data) {
            var result=data.data.data;
            if(result.length>0){
                for(var i=0;i<result.length;i++){
                    var res=result[i];
                    var $option="<option value='"+res.carId+"'>"+res.carNum+"</option>";
                    arr.push($option);
                }
                $carNum.html(arr.join(''));
            }
        }
    };
    customAjax(cfg);
}
function findCar_1(deptId,carId) {
    var formData1={};
    formData1.ids=deptId;
    formData1.pageSize=1000;
    var $carNum=$('.carNum');
    var $dept=$('#addNew .dept');
    $dept.on('change click',function () {
        if($(this).val()==''){
            $carNum.html('');
            $carNum.attr({'disabled':'disabled'});
        }else{
            $carNum.removeAttr('disabled');
        }
    });
    $carNum.removeAttr('disabled');
    var arr=[];
    var cfg = {
        token: getCookie("token"),
        url: 'car/findCar',
        data: formData1,
        success: function (data) {
            var result=data.data.data;
            if(result.length>0){
                for(var i=0;i<result.length;i++){
                    var res=result[i];
                    var $option;
                    if(carId && carId==res.carId){
                        $option="<option value='"+res.carId+"' selected>"+res.carNum+"</option>";
                    }else{
                        $option="<option value='"+res.carId+"'>"+res.carNum+"</option>";
                    }
                    arr.push($option);
                }
                $carNum.html(arr.join(''));
            }else{
                layer.msg('该部门下没有车辆！',{
                    time:1000
                });
                $carNum.attr({'disabled':'disabled'});
                $carNum.html('');
            }
        }
    };
    customAjax(cfg);
}
//查询人员信息
function findPerson(pName) {
    var formData1={};
    formData1.id=userDeptId;
    var $agentName=$('.agentName');
    var arr=[];
    var cfg = {
        token: getCookie("token"),
        url: 'person/findPerson',
        data: formData1,
        success: function (data) {
            var result=data.data.data;
            if(result.length>0){
                for(var i=0;i<result.length;i++){
                    var res=result[i];
                    var $option;
                    if(pName && pName==res.personName){
                        $option="<option value='"+res.personName+"' data-id='"+res.personId+"' selected>"+res.personName+"</option>";
                    }else{
                        $option="<option value='"+res.personName+"' data-id='"+res.personId+"'>"+res.personName+"</option>";
                    }
                    arr.push($option);
                }
                $agentName.html(arr.join(''));
            }
        }
    };
    customAjax(cfg);
}
//自动获取下次时间
function getNextTime() {
    var $dateFmt="yyyy-MM-dd";
    var $time1=$('#time1');
    var $time2=$('#time2');
    var $timeCyc=$('#timeCyc');
   /* if($time2.val()!==''){
        $time2.removeAttr('disabled');
    }else{
        $time2.attr({'disabled':'disabled'});
    }
    var time1=$time1.val();
    var timeCyc=$timeCyc.val();
    var time=parseInt(time1.slice(0,4))+parseInt(timeCyc);
    $time1.off('change');
    $time1.on('change',function () {
        time=parseInt(time1.slice(0,4))+parseInt(timeCyc);
    });*/
    WdatePicker({el:'time2',minDate:time,dateFmt:$dateFmt});
}



