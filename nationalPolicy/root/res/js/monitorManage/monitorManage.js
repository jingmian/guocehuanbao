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
//设置下拉列表的值
function setSelectValue($dom,text) {
    var options=$dom.find('option');
    $dom.get(0).options[0].selected = true;
    var value='0';
    for(var i=0;i<options.length;i++){
        if(text==options[i].text){
            $dom.get(0).options[i].selected = true;
            value=$dom.get(0).options[i].value;
            return value;
        }
    }
    return value;
}
