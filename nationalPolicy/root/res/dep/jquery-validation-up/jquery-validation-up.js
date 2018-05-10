(function ($) {
    function validationUp(opt) {
        var validationUpObj = new __validationUp(opt);

        validationUpObj.__init(this);
        return validationUpObj;
    }
    /*==============表单验证对象 start=====================================================================================*/
    function __validationUp(opt) {
        /*验证规则引擎*/
        this.defaultRules = {
            notEmpty: function (_this) {
                var text = $(_this).val();

                if (text=='' || text==undefined ||text==null)return false;
                return true;
            },
            maxSize: function (_this, size) {
                var text = $(_this).val();

                if (text.length > size)return false;
                return true;
            },
            email: function (_this) {
                var text = $(_this).val();
                var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/

                return reg.test(text);
            },
            equals: function (_this, value) {
                var textNow = $(_this).val();
                var textPrev = $(value).val();

                if (textNow != textPrev)return false;

                return true;
            },
            passwordSize: function (_this) {
                var text = $(_this).val();
                var reg = /^.{6,}$/;    //至少6位密码

                return reg.test(text);
            },
            idCard: function (_this) {
                var text = $(_this).val();
                //匹配身份证格式
                var reg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;

                return reg.test(text);
            },
            mustBeNum: function (_this) {
                var text = $(_this).val();
                var reg = /^\d+$/; //整数

                if (text == '')return true;
                return reg.test(text);
            },
            money:function(_this){
                var text = $(_this).val();
                var reg=/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/; //验证金额 任意正整数，正小数（小数位不超过2位）
                if(text=='')return true;
                return reg.test(text);
            },
            mobile: function (_this) {
                var text = $(_this).val();
                var reg = /^[1][3,4,5,7,8][0-9]{9}$/; //验证电话号码

                return reg.test(text);
            }
        };

        /*默认验证提示信息*/
        this.defaultMsg = {
            notEmpty: '该字段不能为空',
            maxSize: '字符长度超出最大限制',
            email: '请输入正确格式的邮箱账号',
            equals: '两次输入不一致',
            passwordSize: '密码至少输入6位',
            idCard: '身份证号码格式不正确',
            mustBeNum: '只能输入数字',
            money: '金额格式不正确,最多保留2位小数',
            mobile: '电话号码格式错误'
        };

        this.submit = {
            submitBtn: null,
            doSubmitFn: null,
            validationEvent: 'blur'  //自定义触发验证的事件，jQuery标准事件,默认为失去焦点是触发
        };
        this.custormMsg = {};//自定义验证提示信息
        this.validationElm = null;//获取所有输入控件
        this.needDoRules = {};
        this.validationData = {}; //验证成功的值
        this.status = true;//标识是否全部验证

        this.setDoSubmitFn(opt);//继承参数
    }

    /*初始化*/
    __validationUp.prototype.__init = function (elm) {
        //获取待验证的元素
        this.formElm = elm;
        this.validationElm = $(elm).find('input,select,textarea').not('[type=button],[type=reset],[type=submit]');
        this.__addEvent();//添加验证事件
        this.__doSubmit();//提交按钮
    };

    /*绑定触发验证的事件*/
    __validationUp.prototype.__addEvent = function () {
        var event = this.submit.validationEvent;//触发验证的事件
        var rules = this.needDoRules;//需要验证的规则
        var doRules = this.defaultRules;
        var This = this;
        this.validationElm.each(function (index) {
            $(this).on(event, function () {
                var name = $(this).attr('name');
                var thisRules = rules[name];
                var thisParent = $(this).parent();//当前验证元素的父元素

                //没有添加验证，直接返回
                if (!name || !thisRules) {
                    if($(this).val()=='')return;
                    This.validationData[name] = $(this).val();
                    return;
                }
                var _this = this;
                $.each(thisRules, function (key, value) {
                    var status = doRules[key](_this, value);

                    if ($(_this).val() == '' && !thisRules.notEmpty) {
                        status = true;
                    }
                    if (status) {
                        //验证通过，删除错误提示图标
                        if (thisParent.find('.validationErrorMsg').length > 0) {
                            thisParent.find('.validationErrorMsg').remove();
                            thisParent.find('input,textarea').removeClass('validation-error');
                        }
                        //存储验证通过的值
                        if($(_this).val()==''){
                            var json={};

                            $.each(This.validationData,function(key,value){
                                if(key!=name){
                                    json[key]=value;
                                }
                            });
                            This.validationData=json;
                        }else{
                            This.validationData[name] = $(_this).val();
                        }
                    } else {
                        This.status = false;
                        //验证失败，清除值
                        This.validationData[name] = '';

                        //失败的提示信息
                        var errorMsg = This.__getErrorMsg(name, key);

                        if (thisParent.find('.validationErrorMsg').length > 0 ||thisParent.find('.validationErrorMsg2').length > 0) {
                            thisParent.find('.validationErrorMsg').attr('title', errorMsg);

                        }else {
                            var errorMsgTagert = '<i class="validationErrorMsg ' + This.submit.errorMsgIcon + '" title="' + errorMsg + '"></i>';
                            thisParent.append(errorMsgTagert);
                            thisParent.find('input,textarea').addClass('validation-error');
                        }
                        return false;
                    }

                });
            });
        });
    };

    /*获取验证失败的提示信息*/
    __validationUp.prototype.__getErrorMsg = function (name, key) {
        if (this.custormMsg[name] && this.custormMsg[name][key]) {
            return this.custormMsg[name][key];
        } else {
            if (this.defaultMsg[key]) {
                return this.defaultMsg[key];
            } else {
                return '信息填写错误';
            }
        }
    };

    /*提交按钮*/
    __validationUp.prototype.__doSubmit = function () {
        var _this = this;
        if (!this.submit.submitBtn) {
            return;
        }
        this.submit.submitBtn.click(function () {
            _this.status=true;
            _this.__triggerEvent();//触发验证
            if (_this.status) {
                _this.submit.doSubmitFn && _this.submit.doSubmitFn(_this.validationData);
            } else {
                _this.status = true;
                return;
            }

        });
    };
    /*主动触发验证*/
    __validationUp.prototype.__triggerEvent = function () {
        var event = this.submit.validationEvent;
        this.validationElm.each(function () {
            if (event.split(' ')[0]) {
                $(this).trigger(event.split(' ')[0]);
            } else {
                $(this).trigger(event);
            }
        });
    };
    /*清除提示信息*/
    __validationUp.prototype.destroyErrorMsg = function () {
        $(this.formElm).find('.validationErrorMsg').remove();
        $(this.formElm).find('.validation-error').removeClass('validation-error');
    };
    /*重新设置配置表单提交的回调函数*/
    __validationUp.prototype.setDoSubmitFn = function (opt) {
        opt.customRules && $.extend(this.defaultRules, opt.customRules);//继承自定义验证规则
        opt.errorMsg && $.extend(this.custormMsg, opt.errorMsg);//继承自定义验证提示信息
        opt.submit && $.extend(this.submit, opt.submit);//继承提交表单时的参数
        opt.rules && $.extend(this.needDoRules, opt.rules);//需要验证的规则
    };
    /*==============表单验证对象 end====================================================================================*/

    $.fn.validationUp = validationUp;//使用jQuery继承vagueSearch方法
})(jQuery);
