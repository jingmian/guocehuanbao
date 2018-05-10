// var requestUrl='http://119.27.170.81:8080/gc/service/';  //接口请求地址前缀
var exportUrl='http://119.27.170.81:8080/gc/';     //文件下载路径
// var exportUrl='http://192.168.0.49:8080/gchb/';     //文件下载路径

// var requestUrl='http://127.0.0.1:8080/gc/service/';
// var exportUrl='http://127.0.0.1:8080/gchb/';     //文件下载路径
var requestUrl=exportUrl+"service/";//接口请求地址前缀
var userInfo=window.name.split(',');
var isLogin=userInfo[0];//判断用户是否登录
var userDeptId=getCookie('userDeptId'),userId=getCookie('userId');

var serverData={
    token:getCookie("token"),
    deptId:getCookie('deptId'),
    userId:getCookie('userId'),
    userName:getCookie("userName")
};

//导出
var ycyaFileOpt = {
	    export:function (opt,callback) { //文件导出
	        this.opt = {
	            name:'文件',
	            pram:{},
	            url:'',
	            recType:'GET'
	        }
	        $.extend(this.opt,opt);
	        var fileName = (this.opt.name

	 || '未命名') + '.xls';
	        wulianAjax({
	            url:this.opt.url,
	            data:this.opt.pram,
	            token:getCookie('token'),
	            success:function (data) {
	            	var data=$.parseJSON(data);
	                var a = document.createElement('a');
	                a.download = fileName;
	                a.href = exportUrl+ data.data;
	                $("body").append(a);    // 修复firefox中无法触发click
	                a.click();
	                $(a).remove();
	                layer.closeAll();
	            }
	        });
	    }
	}

//本地存储值
function setCookie(key,val){
    var exp=new Date();
    if(key=="token"){
        exp.setTime(exp.getTime()+30*60*1000);
    }else{
        exp.setTime(exp.getTime()+365*24*60*60*1000);
    }
    document.cookie=key + '=' + encodeURI(val) +'; expires='+ exp.toGMTString()+";path=/";
}
//从本地存储中取值
function getCookie(key){
    var cookie,
        cookieArr,
        cookieArr2;
    cookieArr=document.cookie.split('; ');
    for(var i=0;i<cookieArr.length;i++){
        cookieArr2=cookieArr[i].split('=');
        if(key==cookieArr2[0]){
            cookie=cookieArr2[1]
        }
    }
    if(decodeURI(cookie)){
        return decodeURI(cookie);
    }else{
        if(key=="token"){
            if(window.parent){
                window.parent.location.href="../../index.html";
            }else{
                window.location.href="../../../index.html"
            }
            return false;
        }
        return false;
    }
}
//删除本地存储值
function removeCookie(key){
    var exp=new Date();
    exp.setTime(exp.getTime()-1); //删除cookie
    var cval=getCookie(key);
    if(cval!=null)
        document.cookie=key+'='+encodeURI(cval)+'; expires='+exp.toGMTString();
}
/*调用ajax配置参数
@param  cfg={
    url:'',  请求地址,
    data：{}, 请求数据
    token:'',
    dataType:'json',
    success:function(param){},
    error:function(param){}
}*/
function wulianAjax(cfg){
    $.ajax({
        type:'POST',  //默认post请求
        url:requestUrl+cfg.url,
        data:cfg.data,
        beforeSend:function(xhr){
            if(getCookie('token')=='undefined'){
                $.ajax({
                    type:'POST',
                    url:requestUrl+'loginManage/login',
                    data:{
                        userName:getCookie('userName'),
                        password:getCookie('password')
                    },
                    success:function(data){
                        data= $.parseJSON(data);
                        if (data.code == 0) {
                            setCookie("token", data.data.token);
                            cfg.token && xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
                        }else{

                        }
                    },
                    error:function(data){
                        cfg.error && cfg.error(data);
                    }
                })
            }else{
                cfg.token && xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
            }
        },
        success:function(data){
            cfg.success && cfg.success(data);
        },
        error:function(data){
            cfg.error && cfg.error(data);
        }
    })
}

//再次获取token请求函数
function tokenRequest(fn){
    var cfg = {
        url: 'loginManage/login',
        data: {
             userName: getCookie('userName'),
             password: getCookie('password')
        },
        success: function (data) {
            data= $.parseJSON(data);
            if (data.code == 0){
                setCookie('token', data.data.token);
                fn && fn();
            }
        }
    };
    wulianAjax(cfg);
}
/**
 * 侧边导航需要用到的数据
 * @type {string}
 */
var pCode1="0,1,2,3,4,5,6,7,8,11,12,13,14,15,16,17,18,19,21,22,23,24,25,26,27,28,31,32,33,34,35,36,37,38,41,42,43,44,45,46,47,48,51,52,53,54,55,56,57,58,61,62,63,64,65,66,67,68,71,72,73,74,75,76,77";

/**
 * 生成数据表格
 * @param opt{ $Dom,url,queryParams,columns，buttons}
 *             数据容器、请求地址、请求参数、表格显示字段，分页栏中的自定义按钮
 */
var datagridFn = function (opt) {
    function __DatagridFn(opt) {
        this.config = {
            $Dom: null,  //创建数据表格的容器（jQuery代理的元素）
            url: null,
            fit: true,//自适应父级高度
            fitColumns: false,    //自适应
            title: '',           //面板头部标题
            iconCls: '',         //面板左上角16*16的图表class名
            headerCls: '',       //添加一个自定义class名到面板头部
            autoRowHeight: false,//提高负载性能
            striped: true,   //隔行换色
            method: 'POST',
            nowrap: true,
            loadMsg: 'wait',    //加载数据时的等待图标
            pagination: true,    //底部显示分页工具栏
            rownumbers: false,    //显示行号行号
            singleSelect: true,     //true时只能选择一行
            pageNumber: 1,  //当前页
            pageSize: 20,   //每页数据长度
            pageList: [10,20, 30, 40, 50],     //选择表格显示数据条数
            queryParams: null,       //请求时发送的参数
            columns: null,      //列表
            toolbar: null,
            buttons: null,   //分页栏的工具按钮
            selectOnCheck:true,//复选框
            loadFilter: function (dataBack) {
                // console.log(dataBack)
                return dataBack;
            },//过滤服务器返回的数据函数
            onBeforeLoad: function (param) {
                param.pageSize = param.rows;
                param.pageNo = param.page;

                return param;
            },//请求服务器前触发的函数
            onLoadSuccess: function () {
            },//请求数据成功触发的函数
            onClickCell: function () {
            }//用户点击一个单元格触发的函数

        };
        this.config=$.extend({},this.config, opt);
        this.init();
        this.getPagerBtn();
    }

    //生成数据表格
    __DatagridFn.prototype.init = function () {
        this.config.$Dom.datagrid(this.config);
        var _this = this;
        $(window).resize(function () {
            _this.config.$Dom.datagrid('resize');
        });
    };

    //生成分页工具栏的按钮
    __DatagridFn.prototype.getPagerBtn = function () {
        var pager = this.config.$Dom.datagrid('getPager');//获取分页对象
        pager.pagination({
            buttons: this.config.buttons,
            showRefresh: false//隐藏刷新按钮
        });
    };

    return new __DatagridFn(opt);
};
//通用对象函数
var publicObj=function (obj){
    function __publicObj (obj) {
        if(!obj.kind) alert('请传入对象种类');
        if(obj.kind=='layer'){
            this.default={
                title: false, //layer默认的title
                type: 1, //layer弹出层关闭按钮
                closeBtn: 1, //关闭按钮
                area: null, //layer弹出层的宽度，高度一般自适应
                content: null, //内容容器Dom
                move: null, //移动的元素
                resize: false, //设置不可拉伸
                shade: .2, //设置遮罩层透明度
                success: function() { //成功的回调

                }
            };
            $.extend(this.default,obj);
            return this.default;
        }else if(obj.kind=='ajax'){
            this.default = {

            };
            $.extend(this.default,obj);
            return this.default;
        }

    }
    return new __publicObj(obj);
};
//时间类功能函数
var time={
    getCurTime:function(type){ //09-28 返回当前月份以及日子
        var self=this;
        var c=new Date();
        if(type)
            return self.getMonth1(c.getMonth()) +'月'+ self.timeTransform( c.getDate());
        else
            return self.getMonth1(c.getMonth()) +'-'+ self.timeTransform( c.getDate());
    },
    getPreDate: function (pre) {
        var self = this;
        var c = new Date();
        c.setDate(c.getDate() - pre);
        return self.formatDate(c);
    },
    formatDate: function (d) {
        var self = this;
        return d.getFullYear() + "-" + self.getMonth1(d.getMonth()) + "-" + self.timeTransform(d.getDate()) + ' ' + self.timeTransform(d.getHours()) + ':' + self.timeTransform(d.getMinutes()) + ':00';
    },
    getMonth1: function (m) {
        var self = this;
        m++;
        if (m < 10)
            return "0" + m.toString();
        return m.toString();
    },
    timeTransform: function (n) {
        var self = this;
        if (n < 10)
            return "0" + n.toString();
        return n.toString();
    },
    //获得当前月初时间 格式2017-08-09
    getBeginningMonth:function(date){
        var self=this;
        var year=date.getFullYear(),
            month=self.getMonth1(date.getMonth());
        return year+ '-' +month+'-01';
    },
    //获得当前年初时间
    getBeginningYear:function(date){
        var year=date.getFullYear();
        return year+ '-01-01';
    },
    /*返回一个月的天数*/
    getMonthHasDays:function(year,month){
        var newDate=new Date();
        var year=year || newDate.getFullYear(),
            month=month || (newDate.getMonth() + 1) ;
        return new Date(year,month,0).getDate();
    },
    /* 获取相加/相减的时间
    * @param {timeOpt}  例如{Y,M,d}
    * */
    getApartTime:function(newTime,timeOpt){
        if(timeOpt.Y){
           newTime.setFullYear(newTime.getFullYear()+timeOpt.Y);
        }
        if(timeOpt.M){
           newTime.setMonth(newTime.getMonth()+timeOpt.M);
        }
        if(timeOpt.d){
           newTime.setDate(newTime.getDate()+timeOpt.d);
        }
        return this.formatDate(newTime);
    },
    /*获得年月日*/
    getYearMonthDay:function (AddDayCount) {
        var dd = new Date();
        var self=this;
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = self.getMonth1(dd.getMonth());//获取当前月份的日期
        var d = self.timeTransform(dd.getDate());
        return y+"-"+m+"-"+d;
    }
};

function customAjax(opt){
    if(!opt.url)alert('请传入请求地址..');
    if(!opt.token)alert('请传入token..');
    var method=opt.method || 'POST';
    var initCfg={
        type:method,
        url:requestUrl+opt.url,
        token:opt.token,
        data:opt.data,
        beforeSend:function(xhr){
            // if(getCookie('token')=='undefined'){
            //     $.ajax({
            //         type:'POST',
            //         url:requestUrl+'loginManage/login',
            //         data:{
            //             userName:getCookie('userName'),
            //             password:getCookie('password')
            //         },
            //         success:function(data){
            //             var data= $.parseJSON(data);
            //             if (data.code == 0) {
            //                 setCookie("token", data.data.token);
            //                 xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
            //             }
            //         }
            //     })
            // }else{
                opt.token && xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
            // }
        },
        success:function(data){
            var data=$.parseJSON(data);
            if(data!= '' && data !=null ){
                if(data.code==0){//请求成功
                    opt.success && opt.success(data);
                }else if(data.code==1){//验证不正确或TOKEN异常
                    /*返回登陆页*/
                    try{
                        layer.msg('登录失效',{time:1000});
                    }catch(e){

                    }
                }else if(data.code==2){//token过期
                    tokenRequestFn(function(){
                        customAjax(initCfg)
                    })
                }else if(data.code==6){
                    try{
                        layer.msg('输入信息不正确,请重新输入',{time:1000});
                    }catch(e){

                    }
                }else if(data.code==17){//用于卫情等待反馈分派功能返回的code值
                    opt.success && opt.success(data);
                }else{
                    layer.msg(data.msg,{time:1000});
                }
            }else{
                /*alert('登录失效,请重新登录');
                location.href=''*/
            }
        },
        error:function(data){
            var data=$.parseJSON(data);
            opt.error && opt.error(data);
        }
    };
    if(getCookie('token')=='undefined'){
        $.ajax({
            type:'POST',
            url:requestUrl+'loginManage/login',
            data:{
                userName:getCookie('userName'),
                password:getCookie('password')
            },
            success:function(data){
                var data= $.parseJSON(data);
                if (data.code == 0) {
                    setCookie("token", data.data.token);
                    // xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
                    $.ajax(initCfg);
                }
            }
        })
    }else{
        $.ajax(initCfg);
    // console.log(initCfg.success['data'].code);
    }

}
/*再次获取token请求函数*/
function tokenRequestFn(callback){
    var cfg = {
        url: 'loginManage/login',
        data: {
            userName: getCookie('userName'),
            password: getCookie('password')
        },
        success: function (data) {
            setCookie('token', data.data.token);
            callback && callback();
        }
    };
    customAjax(cfg);
}

//功能函数
var lx={
    uDeptId:'',
    //统计模块名称
    staticsName:'',
    /*获得项目根路径*/
    getRootPath:function(){
        var location=window.location.href,
            pathName=window.location.pathname,
            ind=location.indexOf(pathName),
            hostName=location.slice(0,ind),
            projectName=pathName.slice(0,pathName.indexOf('/', 1));
        return hostName+projectName;
    },
    /*获取当前页面名称*/
    getPageName:function getPageName(){
        return window.location.href.split('/')[window.location.href.split('/').length-1] ;
    },
    getUserDept:function () {
        tokenRequest();
    },
    /**/
    isEmptyObj:function(obj){
        for(var key in obj){
            return false ;
        }
        return true;
    },
    /*节点展开*/
    openNodes:function(arr){
        for(var i=0;i<arr.length;i++){
            arr[i].open=true;
        }
        return  arr;
    },
    /*部门树*/
    getDeptTree:function($dom,callback){
        var _this=this;
        var setting={
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
            callback: {
                onClick: callback
            }
        };
        var cfg={
            token:getCookie("token"),
            url:'department/findDept',
            data:{tree:'1'},
            success:function(data){
                var result=data.data.deptInfo;
                if(result.length>0){
                    var deptNodes=[];
                    for(var i=0,l=result.length;i<l;i++){
                        deptNodes.push({"id":result[i].deptId,"pId":result[i].pId,"name":result[i].deptName});
                    }
                }
                $.fn.zTree.init($dom, setting, _this.openNodes(deptNodes));
            }
        };
        customAjax(cfg);
    },
    //当前账号所在的部门
    getDeptTreeCurr:function($dom,callback){
        var _this=this;
        var setting={
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
            callback: {
                onClick: callback
            }
        };
        var cfg={
            token:getCookie("token"),
            url:'department/findDeptTree',
            data:{'deptId':userDeptId},
            success:function(data){
                var result=data.data;
                if(result.length>0){
                    var deptNodes=[];
                    for(var i=0,l=result.length;i<l;i++){
                        deptNodes.push({"id":result[i].deptId,"pId":result[i].pid,"name":result[i].deptName});
                    }
                }
                $.fn.zTree.init($dom, setting, _this.openNodes(deptNodes));
            }
        };
        customAjax(cfg);
    },
    //人员树
    getPersTree:function($dom,callback){
        var _this=this;
        var setting={
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
            callback: {
                onClick: callback
            }
        };
        var cfg={
            token:getCookie("token"),
            url:'person/findFreePerson',
            data:{'deptId':userDeptId},
            success:function(data){
                var result=data.data.deptInfo;
                if(result.length>0){
                    var deptNodes=[];
                    for(var i=0,l=result.length;i<l;i++){
                        deptNodes.push({"id":result[i].personId,"pId":result[i].pId,"name":result[i].personName});
                    }
                }
                $.fn.zTree.init($dom, setting, _this.openNodes(deptNodes));
            }
        };
        customAjax(cfg);
    },
    /*图片预览*/
    /*
    *{
    * url:'',  (必传)
    * data:{},
    * success:fn,
    * customType:1 列表加载图片 2 卫情弹窗加载图片  3 大图弹窗加载图片  4车辆详情弹窗加载图片 5人员详情弹窗加载图片 6监控管理-卫情反馈页面-fileBox上传 7监控管理-卫情反馈页面-表格预览 8设施详情弹窗加载图片(必传)
    * customNum：img对应的下标
    * }
    * */
    view:function(opt,name){
        //var d=time.getCurTime();
        opt = opt || {};
        opt.method = opt.method?opt.method.toUpperCase(): 'POST';
        opt.url = opt.url?(requestUrl+opt.url) : '';
        opt.async = opt.async || true;
        opt.data = opt.data || null;
        //name=name?name:'data'+' '+d+'.jpeg';
        opt.success = opt.success || function () {};
        var xmlHttp = null;
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }else {
            xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
        }var params = [];
        for (var key in opt.data){
            params.push(key + '=' + opt.data[key]);
        }
        var postData = params.join('&');
        if (opt.method.toUpperCase() === 'POST') {
            xmlHttp.open(opt.method, opt.url, opt.async);
            xmlHttp.responseType = "blob";    // 返回类型blob
            xmlHttp.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
            xmlHttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=utf-8');

            xmlHttp.onload = function () {
                // 请求完成
                if (this.status === 200) {
                    // 返回200
                    var blob = this.response;
                    var img;
                    //数据为空
                    if(blob.size==''){
                        //layer.close(layer.index);
                        if(opt.customType==1){//列表
                            img=$('.rTMList').find('img').eq(opt.customNum);
                            img.attr('src','../../../res/img/default/loadFail.png');
                        }else if(opt.customType==2){//卫情弹窗
                            // img=$('.sIIImg ul').find('img').eq(opt.customNum);
                            // img.attr('src','../../../../res/img/default/loadFail.png');
                        }else if(opt.customType==3){//大图弹窗
                            img=$('#peelInfo').find('img');
                            img.attr('src','../../../res/img/default/loadFail.png');
                        }else if(opt.customType==4){//车辆详情弹窗
                            return ;
                        }else if(opt.customType==5){//人员详情弹窗
                            return ;
                        }else if(opt.customType==6){//监控管理-卫情反馈页面
                            img=$('#fileBox').find('img').eq(opt.customNum);
                            img.attr('src','../../../../res/img/default/loadFail.png');
                        }else if(opt.customType==7){//监控管理-卫情反馈页面-表格预览
                            img=$('#previewInfo').find('img').eq(opt.customNum);
                            img.attr('src','../../../../res/img/default/loadFail.png');
                        }else if(opt.customType==8){
                            return ;
                        }
                       /* img.attr('src','../../../res/img/default/loadFail.png');*/
                        return false;
                    }else{
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onload = function (e) {
                            var e=e?e:window.event;
                            if(navigator.appVersion.toString().indexOf(".NET")>0){//IE
                                window.navigator.msSaveBlob(myFile, name);
                            }
                            else{//其他
                                if(opt.customType==1){//列表
                                    img=$('.rTMList').find('img').eq(opt.customNum);
                                }else if(opt.customType==2){//卫情弹窗
                                    img=$('.sIIImg ul').find('img').eq(opt.customNum);
                                }else if(opt.customType==3){//大图弹窗
                                    img=$('#peelInfo').find('img').eq(opt.customNum);
                                }else if(opt.customType==4){//车辆详情弹窗
                                    img=$('#carInfo').find('img').eq(opt.customNum);
                                }else if(opt.customType==5){//人员详情弹窗
                                    img=$('#peopleInfo').find('img').eq(opt.customNum);
                                }else if(opt.customType==6){//监控管理-卫情反馈页面
                                    img=$('#fileBox').find('img').eq(opt.customNum);
                                }else if(opt.customType==7){//监控管理-卫情反馈页面-表格预览
                                    img=$('#previewInfo').find('img').eq(opt.customNum);
                                }else if(opt.customType==8){//设施详情弹窗
                                    img=$('#devInfo').find('img').eq(opt.customNum);
                                }
                                img.attr('src',e.target.result);
                            }
                            opt.success && opt.success();
                        }
                    }
                }else {
                    alert('获取数据错误！错误状态码：' + this.status + '，错误信息：' + this.statusText);
                }
            };

            xmlHttp.send(postData);
        }else if (opt.method.toUpperCase() === 'GET') {
            xmlHttp.open(opt.method, opt.url + '?' + postData, opt.async);
            xmlHttp.send(null);
        }
    },
    /*清除所有勾选/选择的行
    * param {$Dom} jquery元素
    * */
    clearRows:function($Dom){
        $Dom=$Dom || $('#dgrid');
        $Dom.datagrid('clearSelections');
        $Dom.datagrid('clearChecked');
    },
    /*判断datagrid选中的行数
    * param {$Dom} jquery元素
    * param {optName} exm:'修改'
    * param {idName} id的字段名
    * */
    judge:function($Dom,optName,idName){
        var row= $Dom.datagrid('getSelections');
        if(row.length==0){
            layer.msg('请选择要'+optName+'的数据');
            return false;
        }else{
            if(optName=='删除'){
                return row;
            }else{
                $Dom.datagrid('unselectAll');
                $Dom.datagrid('uncheckAll');
                $('.datagrid-view2 .datagrid-body').find('td[field="'+idName+'"]').each(function(){
                    if($(this).find('div').html()==row[0][idName]){
                        $(this).parent().trigger('click')
                    }
                });
                return row[0];
            }
        }

    },
    /*初始化form表单元素
    * param {$Dom} jquery元素
    * */
    initFormElm:function($Dom){
        $Dom.find('input,textarea').not('[type=button],[type=reset],[type=submit]').each(function(){
            if($(this).attr('keyid')){
                $(this).removeAttr('keyid');
            }
            $(this).val('');
        });
        $Dom.find('select').each(function(){
            $(this).find('option:first').prop("selected", 'selected');
        });
    },
    /*填充form表单元素
    * param {$Dom} jquery元素
    * param {jsonData} 填充的json数据
    * param {pElm} true 填充P 元素 , 反之填充 input, textarea
    * */
    paddingFormElm:function($Dom,jsonData,pElm){
        if(!pElm){
            $Dom.find('input,textarea').not('[type=button],[type=reset],[type=submit]').each(function(){
                if(jsonData[$(this).attr('name')]!=undefined && jsonData[$(this).attr('name')]!==null && jsonData[$(this).attr('name')]!='null'){
                    $(this).val( jsonData[$(this).attr('name')] );
                }
            });
        }else{
            $Dom.find('p').each(function(){
                if(jsonData[$(this).attr('class')]!==undefined && jsonData[$(this).attr('class')]!==null && jsonData[$(this).attr('class')]!='null'){
                    if($(this).attr('class')=='onState'){
                        if(jsonData['onState']==1){
                            $(this).text( '在线' );
                        }else if(jsonData['onState']==2){
                            $(this).text( '离线' );
                        }else{
                            $(this).text( '' );
                        }
                    }else if( $(this).attr('class')=='equipmentNum'){
                        if(jsonData['equipmentNum']==''){
                            $(this).text( '暂未绑定设备' );
                        }else{
                            $(this).text( jsonData['equipmentNum'] );
                        }
                    }else{
                        $(this).text( jsonData[$(this).attr('class')] );
                    }
                }
            });
        }

    },
    /* dataGrid记录查询( 通过id )
    *  param { url }  请求地址
    *  param { idName }  id字段名( 例如 carId )
    *  param { idVal }  id值
    *  param { deptId }  部门id值
    *  param { callBack }  回调函数
    * */
    searchRecordById:function(url,idName,idVal,deptId,callBack){
        var cfg={
            token:getCookie('token'),
            url:url,
            data:{

            },
            success:function(data){
                callBack && callBack(data);
            }
        };
        idName=idName || 'id';
        cfg.data[idName]=idVal;
        if(deptId){
            cfg.data.ids=deptId;
        }
        customAjax(cfg);
    }
};
