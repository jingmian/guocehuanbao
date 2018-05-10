//高级查询条件
function seniorSearch(dom,listOpt,arr1) {
    <!--存放高级搜索的html-->
    var $seniorDiv='<div id="seniorDiv"></div>';
    $('body>script').eq(0).before($seniorDiv);
    var $btn=$(dom);
    var $div=$('#seniorDiv');
    var $html=`<form class="form-list-small" id="selectAll2">
        <h5 class="title"><span class="titleText">高级搜索</span><i class="icon iconfont icon-cheng"></i></h5>
        <div class="form-body">
            <div class="section">
                <div class="section-body insertPopup with-pic-popup">
                    <ul id="searchUl" class="clear" style="width:100%">                                            
                    </ul>
                </div>
            </div>
        </div>
        <div class="form-btn">
            <ul>
                <li class="no b-gray">关闭</li>
                <li class="yes b-blue">确定</li>
            </ul>
        </div>
    </form>`;
    $div.html($html);
    //寻找seniorSearch.js
    var $url_js='';
    findSenSearch();
    function findSenSearch() {
        var $script=$('script');
        for(var i=0;i<$script.length;i++){
            var $src=$script[i].src;
            var $index=$src.indexOf('seniorSearch');
            if($index>0){
                $url_js=$src.substr(0,$index);
            }
        }
    }
    //加载layerCommon.js方法
    $.getScript($url_js+'layerCommon.js');
    //点击高级查询图标按钮
    $btn.on('click',function () {
        var $searchUl=$('#searchUl');
        var $li='',$tag='';
        setField();//设置字段（arr1为空——所有字段，存在——指定的字段）
        function setField() {
            var arr=listOpt.columns[0];
            var no_searchArr=['ck','picId','picId1','carPic'];//存放不需要查询的字段,field的值
            var select_typeArr=['personType','carType','minzuName','personSex','carBrand','equipmentType','equipProcotol'];//存放有select下拉列表的字段,field的值
            for(var i=0;i<arr.length;i++){
                if(arr1.length>0){
                    for(var j=0;j<arr1.length;j++){
                        if(arr[i].field==arr1[j]){
                            if($.inArray(arr1[j], select_typeArr)>=0){
                                //data-name：传入字段，field1的值
                                $tag='<li><span>'+arr[i].title+':'+'</span><select data-name="'+arr[i].field1+'"></select></li>'
                            }else{
                                $tag='<li><span>'+arr[i].title+':'+'</span><input data-name="'+arr[i].field1+'"></li>';
                            }
                        }else{
                            $tag='';
                        }
                        $li+=$tag;
                    }
                }else{
                    if($.inArray(arr[i].field, no_searchArr)>=0){
                        $tag='';
                    }else if($.inArray(arr[i].field, select_typeArr)>=0){
                        $tag='<li><span>'+arr[i].title+':'+'</span><select data-name="'+arr[i].field1+'"></select></li>'
                    }else{
                        $tag='<li><span>'+arr[i].title+':'+'</span><input data-name="'+arr[i].field1+'"></li>'
                    }
                    $li+=$tag;
                }
            }
        };
        $searchUl.html($li);
        //查询部门
        var $dept=$searchUl.find('[data-name=deptId]','[data-name=dept]');
        $dept.attr('data-id',userDeptId);
        $dept.on('click',function () {
            var deptOpt={
                'url':'department/findDeptTree',
                'data':{'deptId':userDeptId},
                'id':'deptId',
                'pid':'pid',
                'name':'deptName'
            };
            //加载queryTreeData.js方法
            $.getScript($url_js+'queryTreeData.js', function() {
                queryTree($dept,deptOpt);//调用查询部门的方法
                setLayerMode('divTree',400,0);
            });
        });
        //查询时间
        var $time=$searchUl.find('[data-name=joinTime],[data-name=buyTime]');
        var $dateFmt="yyyy-MM-dd";
        $time.on('click',function () {
            var $id=$(this).attr('data-name');
            $(this).attr('id',$id);
            WdatePicker({el:$id,dateFmt:$dateFmt});
        });
        //查询类型
        var $type=$searchUl.find('[data-name=personType],[data-name=carType],[data-name=minzuId],[data-name=personSex],[data-name=carBrand],[data-name=equipmentType],[data-name=equipProcotol]');
        if($type.length>0){
            $.getScript($url_js+'queryDataDiction.js', function() {
                for(var i=0;i<$type.length;i++){
                    var type=$type[i].dataset.name;
                    //加载queryDataDiction.js方法
                    queryDataDiction($($type[i]),type,true);//调用查询数据字典方法
                }
            });
        }
        //查询方法
        function find() {
            var $input=$searchUl.find('li>input,li>select');
            var opt=listOpt.queryParams;
            if($dept.length>0){
                opt.id=$dept.attr('data-id');
                opt.deptId=$dept.attr('data-id');
            }
            for(var i=0;i<$input.length;i++){
                var name=$($input[i]).attr('data-name');
                var value=$($input[i]).val();
                if(name!='deptId'){
                    if(value==''){
                        delete opt[name]
                    }else{
                        opt[name]=value;
                    }
                }
            }
            for(var key in opt){
                if(opt[key]==''){
                    delete opt[key]
                }
            }
            $('#dgrid').datagrid('reload',opt);
        }
        //调用弹出层插件
        setLayerMode('selectAll2',500,0.3,find);
    })
}
