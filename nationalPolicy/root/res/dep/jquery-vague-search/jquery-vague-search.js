/*
 * 模糊查询插件使用方法
 *   1.调用方式：
 *           $(selector).vagueSearch(opt);
 *           opt为配置项，典型参数{url：请求地址,searchKey:模糊查询的键名},可添加其他自定义参数
 * */

(function ($) {
    function vagueSearch(opt,fn) {
        var _vagueObj = new _vagueSearch(opt);

        //请求服务器
        $(this).off();
        //第一次点击，自动请求获取所有数据
        $(this).click(function(){
            if(_vagueObj.config.url!=''){
                _vagueObj.config[_vagueObj.config.searchKey]='';
                _vagueObj.requestServer(this);
            }
        });
        //根据input值获得数据
        $(this).keyup(function () {
            _vagueObj.config[_vagueObj.config.searchKey] = $(this).val();
            if(_vagueObj.config.url!=''){
                _vagueObj.requestServer(this);
            }else if(_vagueObj.config.dataSource.length>0){
                var newData=_vagueObj.filterData(_vagueObj.config.dataSource);
                _vagueObj.createList(this,newData);//显示数据
            }
            if($(this).attr('keyid')){
                $(this).removeAttr('keyid')
            }
            fn && fn($(this).val());
        });

        $(this).focus(function () {
            _vagueObj.refreshPos(this);
        });//更新位置

        //关闭结果列表
        $(this).blur(function () {
            _vagueObj.timer = setTimeout(function () {
                _vagueObj.close();
            }, 200);
        });
        return _vagueObj;
    }

    /**
     * 模糊查询构造函数
     * */
    function _vagueSearch(opt) {
        this.config = {
            url: '',//请求地址,必须
            dataSource:[],//自定义数据源
            searchKey: ''   //模糊查询时，传递参数的键名，必须
            // gridType: '',
            /*pageSize: 1000,
            pageNo: 1*/
        };

        $.extend(this.config, opt);
    }


    /**
     * 创建查询结果列表的位置
     * */
    _vagueSearch.prototype.init = function (_this) {
        var This = this;
        var className = 'jquery-vague-search' + Math.floor(Math.random() * 100000);
        var $box = $('<div class="jquery-vague-search ' + className + '"></div>');
        this.className = '.' + className;//存储当前列表容器的类名


        $box.click(function (e) {
            var target = e.target;

            if ($(target).attr('keyId')) {
                $(_this).attr('keyId', $(target).attr('keyId')).val($(target).text());//处理选择的项
                This.destroy();//关闭列表容器
            } else {
                $(_this).focus();
            }
        });
        $box.appendTo($('body'));
        this.refreshPos(_this);
    };


    /**
     * 请求服务器
     * */
    _vagueSearch.prototype.requestServer = function (_this) {
        var This = this;
        var cfg={
            url: this.config.url,
            token:getCookie("token"),
            data: This.config,
            success: function (data) {
                var data = $.parseJSON(data);
                var dataArr;
                if (data.code == 0) {
                    if(This.config.url=='car/carList' || This.config.url=='driver/driverList' || This.config.url=='car/findCar'){
                        dataArr=This.filterData(data.data.data);//过滤数据
                        This.createList(_this,dataArr);//显示数据
                    }else if(This.config.url=='realTimeProtectionService/findCarOrPersonInfo'){
                        if(data.data.length>0){
                            dataArr=This.filterData(data.data);//过滤数据
                            This.createList(_this,dataArr);//显示数据
                        }
                    }else if(This.config.url=='realTimeProtectionService/findTreeSoild'){
                        if(data.data.length>=0){
                            dataArr=This.filterData(data.data);//过滤数据
                            This.createList(_this,dataArr);//显示数据
                        }
                    }
                    else{
                        dataArr=This.filterData(data.data);//过滤数据
                        This.createList(_this,dataArr);//显示数据
                    }
                }else if(data.code==2 || data.code==1){
                    wulianAjax(cfg);
                } else {
                    alert(data.msg);
                }
            }
        };
        wulianAjax(cfg);
    };


    /**
     * 创建数据列表
     * */
    _vagueSearch.prototype.createList = function (_this,dataArr) {
        if(!this.className){
            this.init(_this);
        }
        var $ul = $('<ul>');
        var str = '';

        /*if (dataArr.length == 0) {
            str = '<li><a href="javascript:;">没有匹配结果</a></li>';
        } else {
            for (var i = 0; i < dataArr.length; i++) {
                str += '<li><a href="javascript:;" keyId="' + dataArr[i].id + '">' + dataArr[i][this.config.searchKey] + '</a></li>';
            }

        }*/

         if (dataArr.length == 0) {
            str = '<li><a href="javascript:;">没有匹配结果</a></li>';
         }else if(dataArr.length == 1){
             if(dataArr[0].id){
                 str += '<li><a href="javascript:;" keyId="' + dataArr[0].id + '">' + dataArr[0][this.config.searchKey] + '</a></li>';
             }else if(dataArr[0].sorldId){
                 str += '<li><a href="javascript:;" keyId="' + dataArr[0].sorldId + '">' + dataArr[0][this.config.searchKey] + '</a></li>';
             }else{
                 str += '<li><a href="javascript:;" keyId="' + dataArr[0].carId + '">' + dataArr[0][this.config.searchKey] + '</a></li>';
             }

            $(_this).attr('keyId',dataArr[0].id);
         } else {
            for (var i = 0; i < dataArr.length; i++) {
                if(dataArr[i].id){
                    str += '<li><a href="javascript:;" keyId="' + dataArr[i].id + '">' + dataArr[i][this.config.searchKey] + '</a></li>';
                }else if(dataArr[i].sorldId){
                    str += '<li><a href="javascript:;" keyId="' + dataArr[i].sorldId + '">' + dataArr[i][this.config.searchKey] + '</a></li>';
                }else{
                    str += '<li><a href="javascript:;" keyId="' + dataArr[i].carId + '">' + dataArr[i][this.config.searchKey] + '</a></li>';
                }
            }
         }


        $ul.html(str);
        $(this.className).html($ul);
        $(this.className).css('display', 'block');
    };


    /**
     * 关闭列表容器
     * */
    _vagueSearch.prototype.close = function () {
        $(this.className).css('display', 'none');
    };


    /**
     * 刷新列表容器位置
     * */
    _vagueSearch.prototype.refreshPos = function (_this) {
        $(this.className).css({
            left: $(_this).offset().left,
            top: $(_this).offset().top + $(_this).outerHeight(true),
            width: $(_this).outerWidth(true),
            display: 'none'
        });
    };


    /**
     * 数据过滤筛选
     * */
    _vagueSearch.prototype.filterData = function(arr){
        var newArr=[];

        for(var i=0;i<arr.length;i++){

            if(arr[i][this.config.searchKey].indexOf(this.config[this.config.searchKey])!=-1){
                newArr.push(arr[i]);
            }
        }
        return newArr;
    };


    /**
     * 删除节点
     * */
    _vagueSearch.prototype.destroy = function () {
        $(this.className).remove();
        this.className='';
    };

    $.fn.vagueSearch = vagueSearch;//使用jQuery继承vagueSearch方法
})(jQuery);
