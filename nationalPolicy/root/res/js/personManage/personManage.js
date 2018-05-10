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
        move:dom1.find('.title')
    })
    dom1.find('.no').click(function(){layer.closeAll();
    });
    dom1.find('.yes').off('click');
    dom1.find('.yes').click(function(){

        layer.close(index);
    });
}
//焦点触发弹出层
function layerMode(dom,dom1,fun,express) {
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
        dom1.find('.submit-btn').off();
        dom1.find('.submit-btn').click(function(){
            layer.close(treeIndex);
        });
    })
}
//查询字典方法
function queryDataDiction1() {
    var cfg = {
        token: getCookie("toekn"),
        url: 'datadictionary/queryDataDictionary',
        data: {
            'dictionaryType':'personType'
            // 'pageSize':1000
        },
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                var result = data.data;
                if (result.length > 0) {
                    var option='';
                    for (var i = 0, l = result.length; i < l; i++) {
                        option+=('<option value="'+result[i].typeId+'">'+result[i].dictionaryName+'</option>')
                    }
                    $('.personType').html(option);
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
//查询考勤
function findAttRule() {
    var cfg = {
        token: getCookie("toekn"),
        url: 'person/findAttRule',
        data: {
        },
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                var result = data.data.data;
                if (result.length > 0) {
                    var option='';
                    for (var i = 0, l = result.length; i < l; i++) {
                        option+=('<option value="'+result[i].ruleId+'">'+result[i].ruleName+'</option>')
                    }
                    $('#mode1').html(option);
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
//取得所有选中行数据
function getSelections(dom,id,name,idsArr,namesArr) {
    idsArr=[];
    namesArr=[];
    var rows = dom.datagrid('getSelections');
    for(var i=0; i<rows.length; i++){
        idsArr.push(rows[i][id]);
        namesArr.push(rows[i][name]);
    }
}
//表格列宽度自适应
function colunmWAuto(cyc,n) {
    var table=$('#table');
    var th_td_1=$('#table th.th1,#table td.td1');
    var th_td_2=$('#table th.th2,#table td.td2');
    var tr=$('#table tr');
    var th=table.find('th');
    var td=table.find('td');
    var table1=$('.table');
    var table3=$('.infolistTable');
    var w=table3.width()-140;
    var len=tr.length;
    var num=7;//默认显示(7+1)列
    th_td_1.css({'width':'140px'});
    th_td_2.css({'width':parseInt(w/num)+'px'});
    var w_td1=th_td_1.width();
    var w_td2=th_td_2.width()+1;
    if(cyc>7){
        table1.css({'width':(w_td1+cyc*w_td2+2)+'px'});
        table3.css({'overflow-x':'auto'});
    }else{
        table1.css({'width':(w_td1+7*w_td2+100)+'px'});
        table3.css({'overflow-x':'hidden'});
    }
    table3.animate({scrollLeft:0},100);
    if(cyc<31){
        th_td_2.eq(cyc-1).addClass('last_border');
        for(var i=1;i<len;i++){
            tr.eq(i).find('td').eq(cyc).addClass('last_border');
        }
    }else{
        th_td_2.removeClass('last_border');
        for(var i=1;i<len;i++){
            tr.eq(i).find('td').eq(cyc).removeClass('last_border');
        }
    }
}
//时间控件封装
function timeControl($dom,dom,$dateFmt) {
    $dom.focus(function () {
        WdatePicker({el: dom,dateFmt:$dateFmt});
    });
}
//查找人员类型
function carType_insProvider(backfunction) {
    var arr1=[],arr2=[],arr3=[],arr4=[],arr_1=[],arr_2=[],arr_3=[],arr_4=[];
    //查询字典
    function queryDataDictionary() {
        var formData1={};
        var result=[];
        arr1=[],arr2=[],arr3=[],arr4=[],arr_1=[],arr_1=[],arr_3=[],arr_4=[];
        var cfg = {
            token: getCookie("toekn"),
            url: 'datadictionary/queryDataDictionary',
            data: formData1,
            success: function (data) {
                data = $.parseJSON(data);
                result=data.data;
                if (data.code == 0) {
                    if(result.length>0){
                        for(var i=0;i<result.length;i++){
                            var res1=result[i];
                            if(res1.dictionaryType=='personType'){
                                arr1.push(res1.dictionaryName);
                                arr2.push(res1.typeId);
                            }
                        }
                        bind_car_insp();
                        if(typeof  backfunction ==='function'){
                        	backfunction();
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
    //数据字典中的数据绑定到页面位置
    function bind_car_insp() {
        var $carType=$('#addNew .personType');
        var arr5=[];
        for(var i=0;i<arr1.length;i++){
            var res3=arr1[i];
            var res4=arr2[i];
            var $option="<option value='"+res4+"'>"+res3+"</option>";
            arr5.push($option);
        }
        $carType.html(arr5.join(''));

    }
    queryDataDictionary();
}

