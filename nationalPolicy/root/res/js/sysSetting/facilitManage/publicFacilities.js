var pageData = {
    "mapInited":0,
    "facType":{"0":"公厕","1":"中转站","2":"掩埋场","3":"垃圾箱","4":"果皮箱"}
};
var ycyaMap,
    picId='';
// 图片上传
var fileUpLoad={
    upload: function(){
        myUpload({
            url:requestUrl+'file/up',
            maxSize: 10,
            inputDom:'inputBox',
            fileDom:'fileBox',
            showDom:'picShow',
            //triggerBtn:'yes',
            beforeSend: function(file){
            },
            callback: function(res){
                picId='';
                res= $.parseJSON(res);
                picId+=res.data[0].uuid;
            }
        });
    }
};
$(function () {
var facType = GetQueryString("facType");
    facType = null==facType?"0":facType;
    document.title = pageData.facType[facType];
    $('#pageTitle').html(pageData.facType[facType]+"列表");
    //--------------------------表单验证---------------------------
    var validationUp=$('#insertBeta').validationUp({
        rules:{
            facName:{
                notEmpty:true
            },
            facNum:{
                notEmpty:true
            },
            place:{
                notEmpty:true
            }
        },
        errorMsg:{
            agentName:{
                notEmpty:'设施名称不能为空'
            },
            facNum:{
                notEmpty:'设施编号不能为空'
            },
            place:{
                notEmpty:'设施地点不能为空'
            }
        },
        submit:{
            submitBtn:$('#insertBeta .yes'),
            validationEvent:'blur change',
            errorMsgIcon:'icon iconfont icon-cuowu1'
        }
    });

    //--------------------------地图---------------------------
    ycyaMap = new YcyaMap('facMap');
    var _autoComplete;
    ycyaMap.ready(function(){
        _autoComplete=ycyaMap.createAutoComplete('suggestId','searchResultPanel',setPlace);
        ycyaMap.getLngAndLat('suggestId','searchResultPanel');
        $('#suggestId').keyup(function(){
            $('.tangram-suggestion-main').css({'z-index':99999999})
        });
    });
    function setPlace(){
        ycyaMap.clear();    //清除地图上所有覆盖物
        function myFun(){
            var pp = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
            $('#searchResultPanel').attr('data-lng',pp.lng).attr('data-lat',pp.lat);
            ycyaMap.addPoint({type:1,data:[{"lng":pp.lng,"lat":pp.lat,"id":1}] });
            ycyaMap.toSetCenter(pp);
        }
        var local = ycyaMap.localSearch(myFun,ycyaMap);
        local.search($('#searchResultPanel').attr('data-value'));
    }
    //--------------------------表格---------------------------
    var dgData = [];//表格数据
    var code1,code2,code3,code4;
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url: requestUrl + 'facilitiesService/findFacilitiesInfo',
        //请求传递的参数
        queryParams: {
            deptId: getCookie("deptId"),
            facType: facType,
            facNum:$("#person_name").val()
        },
        pageSize: 20,
        //数据表格的显示字段
        columns: [[
            {field: 'ck', checkbox: true},
            {field: 'facilitiesId', hidden: true},
            {field: 'facNum', title: '编号', width: 100,align:'left'},
            {field: 'facName', title: pageData.facType[facType]+'名称', width: 150,align:'center'},
            {field: 'msgLon', title: '经度', width: 100, align: 'right'},
            {field: 'msgLat', title: '纬度', width: 100, align: 'right'},
            {field: 'personName', title: '负责人', width: 100,align:'center'},
            {field: 'picId', title: '图片', width: 160, align: 'center',formatter:function(value,row,index){
                if(value!='0'){
                    return '<span class="preview-picture" style="color:#0C7FE9;cursor:pointer;" data-id="'+value+'">预览</span>';
                }else{
                    return '暂无图片';
                }
            }},
            {field: 'place', title: '所在位置', width: 300,align:'left'}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            code:"154_160_165_170_175",
            handler: function () {
                $('#insertBeta .titleText').text('新增'+pageData.facType[facType]+'信息');
                ycyaMap.clear();
                lx.initFormElm($('#insertBeta'));
                $('#picShow').empty();
                findPerson(getCookie("deptId"));
                var index = layer.open({
                        type: 1,
                        title: false,
                        area: '1000px',
                        shadeClose:false,
                        closeBtn: 1,
                        content: $('#insertBeta'),
                        move: $('#insertBeta>.title')
                });
                $('#insertBeta .no').click(function () {
                    layer.close(index);
                });
                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit:{
                        doSubmitFn:function(formData){
                            var resPlace=$('#searchResultPanel');
                            if( resPlace.attr('data-lng') && resPlace.attr('data-lat') ){
                                formData.msgLon=resPlace.attr('data-lng');
                                formData.msgLat=resPlace.attr('data-lat');
                            }else{
                                layer.msg('地点选择失败,请重新选择',{time:1000});
                                return ;
                            }
                            if( picId!='' ){
                                formData.picId=picId;
                            }
                            formData.facType=facType;
                            addFacilitiesInfo(formData,index);
                        }
                    }
                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            code:'155_161_166_171_176',
            handler: function () {
                ycyaMap.clear();
                $('#insertBeta .titleText').text('修改'+pageData.facType[facType]+'信息');
                var row=lx.judge($('#dgrid'),'修改','facilitiesId');
                if(! row){
                    return;
                }
                findPerson(getCookie("deptId"),row['personId']);
                $('#insertBeta').find('input[type="text"]').each(function(){
                    $(this).val(row[$(this).attr('name')]);
                });
                var resPlace=$('#searchResultPanel');
                resPlace.attr('data-lng',row.msgLon).attr('data-lat',row.msgLat);
                ycyaMap.addPoint({type:1,data:[{"lng":row.msgLon,"lat":row.msgLat,"id":1}] });
                ycyaMap.center(1,10);
                if(row.picId!='0'){
                    $('#picShow').html('<img src="'+requestUrl+'file/view?id='+row.picId+'">')
                }else{
                    $("#picShow").html("");
                }
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "1000px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#insertBeta"),
                    move: $('#insertBeta .title')
                });
                $('#insertBeta .no').click(function () {
                    layer.close(index);
                });
                validationUp.destroyErrorMsg();
                validationUp.setDoSubmitFn({
                    submit:{
                        doSubmitFn:function(formData){
                            var resPlace=$('#searchResultPanel');
                            if( resPlace.attr('data-lng') && resPlace.attr('data-lat') ){
                                formData.msgLon=resPlace.attr('data-lng');
                                formData.msgLat=resPlace.attr('data-lat');
                            }else{
                                layer.msg('地点选择失败,请重新选择',{time:1000});
                                return ;
                            }
                            if( picId!='' ){
                                formData.picId=picId;
                            }
                            formData.facType=facType;
                            formData.facilitiesId=row.facilitiesId;
                            modFacilitiesInfo(formData,index);
                        }
                    }
                });
            }
        },  /*{
            text: '查看',
            id: "btnSelect",
            handler: function () {
                $('#btnSelect .titleText').text('查看'+pageData.facType[facType]);
            }
        },*/ {
            text: '删除',
            id: "btnDelete",
            code:'156_162_167_172_177',
            handler: function () {
                $('#delete .titleText').text('删除'+pageData.facType[facType]+'信息');
                var row=lx.judge($('#dgrid'),'删除','facilitiesId');
                if(! row){
                    return;
                }
                $('#dInfo').text(faciliObj['facName']);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                });
                $('#delete .no').click(function () {
                    layer.close(index);
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    var deleteData=[];
                    for(var i=0;i<row.length;i++){
                        deleteData.push(row[i].facilitiesId)
                    }
                    formData.facilitiesIds=deleteData.join(',');
                    delFacilitiesInfo(formData,index);
                });
            }
        }, {
            text: '刷新',
            id: "btnConfirm",
            code:'157_163_168_173_178',
            handler: function () {
                $('#dgrid').datagrid('reload', applyListOpt.queryParams);
            }
        }
        ],
        onClickRow: function (index, row) {
            formData.facilitiesId = row.facilitiesId;
            formData.facName = row.facName;
            formData.facNum = row.facNum;
            formData.msgLon = row.msgLon;
            formData.msgLat = row.msgLat;
            faciliObj['facilitiesId'] = row.facilitiesId;
            faciliObj['facName'] = row.facName;
            faciliObj['facNum'] = row.facNum;
            faciliObj['msgLon'] = row.msgLon;
            faciliObj['msgLat'] = row.msgLat;
        },
        onLoadSuccess: function () {
            $('.dgrid .preview-picture').click(function(){
                var facId=$(this).attr('data-id');
                $('#previewInfo img').attr('src',requestUrl+'file/view?id='+facId);
                layer.open(publicObj({
                    kind:'layer',
                    area:'500px',
                    closeBtn:1,
                    shadeClose:false,
                    content:$('#previewInfo'),
                    move:$('#previewInfo .title')
                }));
            });
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var formData = {};//请求数据
    formData.facType = facType;
    var faciliObj = {
        facilitiesId: 0,
        facilitiesIds: '',
        facName: '',
        facNum: '',
        msgLon: '',
        msgLat: '',
        deptId: userDeptId
    };
    var idsArr = [], namesArr = [];
    //新增
    function addFacilitiesInfo(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'facilitiesService/addFacilitiesInfo',
            data: jData,
            success: function (data) {
                picId='';
                loads();
                layer.close(indexPop);
                layer.msg('添加成功！',{time: 1000});
            }
        };
        customAjax(cfg);
    }
    //修改设施
    function modFacilitiesInfo(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'facilitiesService/modFacilitiesInfo',
            data: jData,
            success: function (data) {
                picId='';
                loads();
                layer.close(indexPop);
                layer.msg('修改成功！', {time: 1000});
            }
        };
        customAjax(cfg);
    }
    //删除选中的信息
    function delFacilitiesInfo(jData,indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'facilitiesService/delFacilitiesInfo',
            data: jData,
            success: function (data) {
                loads();
                layer.close(indexPop);
                layer.msg('删除成功！', {time: 1000});
            }
        };
        customAjax(cfg);
    }
    //查看设施详情
    function loads() {
        $('#dgrid').datagrid('load',{
            deptId: getCookie("deptId"),
            facType: facType,
            facName:$("#person_name").val()
        });
    }
    $('#findPersonInfo').click(function (){
        loads();
    });
});
