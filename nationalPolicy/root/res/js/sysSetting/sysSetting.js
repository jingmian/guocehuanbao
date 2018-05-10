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
//点击按钮出现弹出层
function clickShowMode(width,dom1,callback){
    var index=layer.open({
        type:1,
        title:false,
        area:width,
        shadeClose:false,
        closeBtn:1,
        content:dom1,
        move:dom1.find('.title'),
    })
    dom1.find('.no').click(function(){layer.closeAll();
    });
    dom1.find('.yes').off('click');
    dom1.find('.yes').click(function(){

        layer.close(index);
    });
}
//焦点触发弹出层
function layerMode(dom,dom1,fun) {
    dom.on('focus',function () {
        fun;
        var treeIndex=layer.open({
            title: false,
            closeBtn: 1,
            type: 1,
            shade:0,
            area:'400px',
            content: dom1,
            move:dom1.find('.form-top'),
            success: function () {
            }
        });
        dom1.find('.submit-btn').click(function(){
            layer.close(treeIndex);
        });
    })
}
//表格数据行选择（查看、修改只能选中一行）
function dgridOneRow(type,txt) {
    var row=$('#dgrid').datagrid('getSelections');
    switch (type){
        case 'select':
            selRows();
        case 'add':
            $('#dgrid').datagrid('unselectAll');
            txt='';
        case 'mod':
            selRows();
        case 'del':
            if(row.length>0){
                getSelections();
            }
    }
    if(txt!==''){
        oneRow(txt);
    }
    //未选择行数
    function oneRow(txt) {
        if(row.length==0){
            layer.msg(txt,{time:1000});
            return;
        }
    }
    //选择多行
    function selRows() {
        if(row.length>0){
            var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
            $('#dgrid').datagrid('unselectAll');
            $('#dgrid').datagrid('selectRow',rowIndex);
        };
    }
    return oneRow(txt);
}
//时间控件封装
function timeControl($dom,dom,$dateFmt) {
    $dom.focus(function () {
        WdatePicker({el: dom,dateFmt:$dateFmt});
    });
}
//select下拉列表回显
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




