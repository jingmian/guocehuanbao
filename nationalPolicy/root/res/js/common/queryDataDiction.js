//查询字典方法(注：$dom——下拉列表dom对象,dictionaryType——传入查询字典接口参数，flag——下拉列表是否需要全部，true需要,flase不需要,fn——接口获取城功能后的回调函数)
function queryDataDiction($dom,dictionaryType,flag,fn) {
    var $tagName=$dom.get(0).tagName;
    function forTag(res,tag) {
        var $tag='',tag1;
        //第一个默认标签
        function defaultFirstTag() {
            if(tag=='UL'||tag=='ul'){
                tag1='<li class="lTActive"><span>全部报警</span></li>';
                $tag+=tag1;
            }else{
                if(flag==false){
                    tag1='';
                }else{
                    tag1='<option value="">全部</option>';
                    $tag+=tag1;
                }
            }
        }
        if(res.length>0){
            defaultFirstTag();
            for (var i = 0, l = res.length; i < l; i++) {
                if(tag=='UL'||tag=='ul'){
                    tag1='<li data-id="'+res[i].typeId+'"><span>'+res[i].dictionaryName+'</span></li>';
                }
                if(tag=='SELECT'||tag=='select'){
                    tag1='<option value="'+res[i].typeId+'">'+res[i].dictionaryName+'</option>';
                }
                $tag+=tag1
            }
            $dom.html($tag);
        }else{
            //调用第一默认标签方法
            defaultFirstTag();
            //不需要传参的下拉列表字段
            noPostField();
            function noPostField() {
                if(dictionaryType=='minzuId'){       //名族
                    var arr=['汉族','藏族']
                    for(var i=0;i<arr.length;i++){
                        tag1='<option value="'+i+'">'+arr[i]+'</option>';
                        $tag+=tag1;
                    }
                }else if(dictionaryType=='personSex'){    //性别
                    var arr=['男','女']
                    for(var i=0;i<arr.length;i++){
                        tag1='<option value="'+arr[i]+'">'+arr[i]+'</option>';
                        $tag+=tag1;
                    }
                }else if(dictionaryType=='equipmentType'){    //终端类型
                    var arr=['人员终端','GPS终端(无油量)','GPS终端(有油量)','视频终端'];
                    for(var i=0;i<arr.length;i++){
                        tag1='<option value="'+i+'">'+arr[i]+'</option>';
                        $tag+=tag1;
                    }
                }else if(dictionaryType=='equipProcotol'){    //协议类型
                    var opt={
                        '808':'808',
                        'elink':'elink'
                    };
                    for(var key in opt){
                        tag1='<option value="'+key+'">'+opt[key]+'</option>';
                        $tag+=tag1;
                    }
                }
                $dom.html($tag);
            }
        }
    }
    var cfg = {
        token: getCookie("toekn"),
        url: 'datadictionary/queryDataDictionary',
        data: {
            'dictionaryType':dictionaryType,
            // 'pageSize':1000
        },
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                var result = data.data;
                forTag(result,$tagName);
                if(fn==null)return;  //毁掉函数可选
                fn();//回调函数
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
