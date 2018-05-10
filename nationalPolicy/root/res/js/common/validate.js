//验证字段统一方法
function validAll($dom,validCont) {
    var value=$dom.val();
    var $txt=$dom.siblings('span').text();
    var title;
    if($txt.indexOf(':')!==-1){
        title=$txt.split(':')[0];
    }
    if($txt.indexOf('：')!==-1){
        title=$txt.split('：')[0];
    }
    $dom.on('keyup',function () {
        value=$dom.val();
        return value_valid();
    })
    return value_valid();
    function value_valid() {
        if(value!==''){
            var pattern = validCont;
            var state=pattern.test(value);
            if(state){
                $dom.removeClass('errorBorderRed');
                $dom.removeAttr('title');
                return true;
            }else{
                $dom.addClass('errorBorderRed');
                $dom.attr({'title':title+'格式有误'});
                return false;
            }
        }else{
            $dom.removeClass('errorBorderRed');
            $dom.removeAttr('title');
            return true;
        }
    }


}
//判断手机号
function isPhoneNo($dom) {
    var phone=/^1[34578]\d{9}$/;
    return validAll($dom,phone);
}
//验证身份证号
function isIdCardNum($dom) {
    var idCardNum=/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return validAll($dom,idCardNum);
}
//判断必填字段是否为空
function validMustField() {
    var $addNew=$('#addNew,#insertBeta');
    var $li=$addNew.find('li');
    var $em=$li.find('em');
    var $txt=($em.parent().text());
    if($txt.indexOf(':')!==-1){
        $txt=($em.parent().text()).split(':');
    }
    if($txt.indexOf('：')!==-1){
        $txt=($em.parent().text()).split('：');
    }
    var $input=$em.parent().parent().find('input,textarea');
    var flagArr=[];
    for(var i=0,l=$input.length;i<l;i++){
        var ipt=$input[i];
        var val=$(ipt).val();
        if(val==''){
            $(ipt).addClass('errorBorderRed');
            $(ipt).attr({'title':$txt[i].slice(1)+'不能为空'});
            flagArr[i]='false';
        }else{
            $(ipt).removeClass('errorBorderRed');
            $(ipt).removeAttr('title');
            flagArr[i]='true';
        }
    }
    $($input).on('keyup',function () {
        var ipt=$(this);
        var val=ipt.val();
        var txt=(ipt.parent().find('span').text());
        if(txt.indexOf(':')!==-1){
            txt=(ipt.parent().find('span').text()).split(':');
        }
        if(txt.indexOf('：')!==-1){
            txt=(ipt.parent().find('span').text()).split('：');
        }
        if(val==''){
            ipt.addClass('errorBorderRed');
            ipt.attr({'title':txt[0].slice(1)+'不能为空'});
        }else{
            ipt.removeClass('errorBorderRed');
            ipt.removeAttr('title');
        }
    });
    for(var j=0;j<flagArr.length;j++){
        if(flagArr[j]=='false'){
            return false;
        }
    }
    return true;
}
//判断非负数
function isNum(value) {
    var patrn = /^\d+(\.{0,1}\d+){0,1}$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}
//判断正整数
function isNum1(value) {
    var patrn = /^\+?[1-9][0-9]*$/;
    if (patrn.exec(value) == null || value == "") {
        return false
    } else {
        return true
    }
}
//新增、修改按钮点击去掉红色边框
function removeValid() {
    $('#btnNewAdd,#btnApudate').click(function () {
        var $addNew=$('#addNew,#insertBeta');
        var $li=$addNew.find('li');
        var $em=$li.find('em');
        var $input=$em.parent().parent().find('input');
        for(var i=0,l=$input.length;i<l;i++){
            var ipt=$input[i];
            $(ipt).removeClass('errorBorderRed');
        }
    })
}

