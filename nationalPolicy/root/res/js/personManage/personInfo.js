$(function () {
    var setting = {
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        view: {
            showLine: true,
            txtSelectedEnable: true,
            showTitle: false
        },
        callback: {
            onClick: zTreeClick
        }
    };
    var dept=getCookie("deptId");
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'person/findPerson',  //请求地址
        //请求传递的参数
        queryParams: {
            gridType: 'easyui',
            recordStatus: 10,
            personName:$("#personName").val(),
            id:dept
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns: [[
            {field: 'ck',field1:'ck',checkbox: true},
            {field: 'deptName',field1:'deptId',title: '所属部门',width:150,align:'left'},
            {field: 'personName',field1:'personName',title: '姓名',width:150,align:'center'},
            {field: 'personPhone',field1:'personPhone', title: '联系电话', width:100,align: 'center'},
            {field: 'minzuName',field1:'minzuId', title: '民族',width:100, align: 'center',formatter: function (value, row, index) {
                if(value=='0'){value='汉族'};
                if(value=='1'){value='藏族'};
                return value;
            }},
            {field: 'personSex',field1:'personSex', title: '性别', width: 50, align: 'center'},
            {field: 'joinTime',field1:'joinTime', title: '入职时间', width: 150, align: 'center'},
            {field: 'equipmentNum',field1:'equipmentNum', title: '设备号', width: 200, align: 'center'},
            {field: 'icNum',field1:'icNum', title: 'IC卡号', width: 200, align: 'center'},
            {field: 'idCareNum',field1:'idCareNum', title: '身份证号', width: 200, align: 'center'},
            {field: 'personType',field1:'personType', title: '类型',width:100, align: 'center'},
            {field: 'picId',field1:'picId', title: '头像', width: 150,align:'center',formatter:function(value,row,index){
                if(value!='0'){
                    return '<span class="preview-picture" style="color:#0C7FE9;cursor:pointer;" data-id="'+value+'">预览</span>';
                }else{
                    return '暂无头像';
                }
            }},
            {field: 'register',field1:'register', title: '户籍', width: 300, align: 'left'},
            {field: 'address',field1:'address', title: '家庭住址', width: 300, align: 'left'},
            {field: 'remark',field1:'remark', title: '备注', width: 300, align: 'left'}
        ]],
        singleSelect: false,
        collapsible: true,
        SelectOnCheck: true,
        CheckOnSelect: true,
        selectAll: "none",
        // fitColumns: true,
        buttons: [{
            text: '新增',
            id: "btnNewAdd",
            code:43,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length>0){
                    $('#dgrid').datagrid('unselectAll');
                }
                mType = 'add';
                $('#addNew .titleText').text('新增人员');
                carType_insProvider();
                $('#addNew .deptName').val('');
                $('#addNew .personName').val('');
                $('#addNew .personPhone').val('');
                $('#addNew .personType').val('');
                $('#addNew .personSex').val('');
                $('#addNew .minzuId').val('');
                $('#addNew .joinTime').val('');
                $('#addNew .register').val('');
                $('#addNew .idCardNum').val('');
                $('#addNew .personAddress').val('');
                $('#addNew .icNum').val('');
                 $('#addNew .remark').val('');
                personTypeOnchange(0);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "644px",
                    shadeClose: false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title'),
                    success:function(){
                        //图片以及input初始化
                        $.each($('.input-group [type="file"]'),function(){
                            $(this).val('');
                            if($(this).attr('data-uuid')){
                                $(this).removeAttr('data-uuid');
                            }
                        });
                        $.each($('#addNew .pic-list img'),function(){
                            $(this).remove();
                        });
                        $.each($('#addNew .pic-list a'),function(){
                            $(this).css('display','inline-block')
                        });
                        $.each($('#addNew .pic-list span'),function(){
                            $(this).css('display','none')
                        });
                    }

                });
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData.personName = $('#addNew .personName').val();
                    formData.personType = $('#addNew .personType').val();
                    formData.personSex = $('#addNew .personSex').val();
                    formData.minzuId = $('#addNew .minzuId').val();
                    formData.joinTime = $('#addNew .joinTime').val();
                    formData.register = $('#addNew .register').val();
                    formData.icNum = $('#addNew .icNum').val();
                    formData.personAddress = $('#addNew .personAddress').val();
                    formData.remark = $('#addNew .remark').val();
                    formData.deptId = perObj['deptId'];
                    $.each(input,function(ind){
                        if($(this).attr('data-uuid')){
                            formData['picId']= $(this).attr('data-uuid')
                        }
                    });
                    var $phone=$('#addNew .personPhone');
                    var phone=$phone.val();
                    if(isPhoneNo($phone)){
                        formData.personPhone=phone;
                    }else{
                        return;
                    }
                    var $idCardNum=$('#addNew .idCardNum');
                    var idCardNum=$idCardNum.val();
                    if(isIdCardNum($idCardNum)){
                        formData.idCardNum =idCardNum;
                    }else{
                        return;
                    }
                    if(validMustField()){
                        personAdd(index);
                    }
                });
            }
        },{
            text: '查看',
            id: "btnSelect",
            code:44,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要查看的人员信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                $('#selectAll .titleText').text('查看人员');
                $('#selectAll .deptName').text(perObj['deptName']);
                $('#selectAll .personName').text(perObj['personName']);
                $('#selectAll .personPhone').text(perObj['personPhone']);
                $('#selectAll .personType').text(perObj['personType']);
                $('#selectAll .minzuId').text(perObj['minzuId']);
                $('#selectAll .personSex').text(perObj['personSex']);
                $('#selectAll .joinTime').text(perObj['joinTime']);
                $('#selectAll .register').text(perObj['register']);
                $('#selectAll .idCardNum').text(perObj['idCardNum']);
                $('#selectAll .personAddress').text(perObj['personAddress']);
                $('#selectAll .remark').text(perObj['remark']);
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "644px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#selectAll"),
                    move: $('#selectAll .title')
                });
                $('#selectAll .no').click(function () {
                    layer.closeAll();
                });
                $('#selectAll .yes').off('click');
                $('#selectAll .yes').click(function () {
                    layer.close(index);
                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            code:45,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要修改的人员信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    var rowIndex = $('#dgrid').datagrid('getRowIndex',row[row.length-1]);
                    $('#dgrid').datagrid('unselectAll');
                    $('#dgrid').datagrid('selectRow',rowIndex);
                }
                mType = 'mod';
                $('#addNew .titleText').text('修改人员');
                $('#addNew .deptName').val(perObj['deptName']);
                $('#addNew .personName').val(perObj['personName']);
                $('#addNew .personPhone').val(perObj['personPhone']);
//                $('#addNew .personType').val(perObj['personTypeId']);
                $('#addNew .personSex').val(perObj['personSex']);
                $('#addNew .minzuId').val(perObj['minzuId']);
                $('#addNew .joinTime').val(perObj['joinTime']);
                $('#addNew .register').val(perObj['register']);
                $('#addNew .idCardNum').val(perObj['idCardNum']);
                $('#addNew .personAddress').val(perObj['personAddress']);
                $('#addNew .remark').val(perObj['remark']);
                $('#addNew .icNum').val(perObj['icNum']);
                carType_insProvider(function(){
                	$('#addNew .personType').val(perObj['personTypeId']);
                	personTypeOnchange(perObj['personTypeId']);
                });
                var index = layer.open({
                    type: 1,
                    title: false,
                    area: "644px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#addNew"),
                    move: $('#addNew .title')
                })
                $('#addNew .no').click(function () {
                    layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function () {
                    formData.personName = $('#addNew .personName').val();
                    formData.personType = $('#addNew .personType').val();
                    formData.personSex = $('#addNew .personSex').val();
                    formData.minzuId = $('#addNew .minzuId').val();
                    formData.joinTime = $('#addNew .joinTime').val();
                    formData.register = $('#addNew .register').val();
                    formData.personAddress = $('#addNew .personAddress').val();
                    formData.icNum = $('#addNew .icNum').val();
                    formData.remark = $('#addNew .remark').val();
                    formData.personId = perObj['personId'];
                    formData.deptId = perObj['deptId'];
                    $.each(input,function(ind){
                        if($(this).attr('data-uuid')){
                            formData['picId']= $(this).attr('data-uuid')
                        }
                    });
                    var $phone=$('#addNew .personPhone');
                    var phone=$phone.val();
                    if(isPhoneNo($phone)){
                        formData.personPhone=phone;
                    }else{
                        return;
                    }
                    var $idCardNum=$('#addNew .idCardNum');
                    var idCardNum=$idCardNum.val();
                    if(isIdCardNum($idCardNum)){
                        formData.idCardNum =idCardNum;
                    }else{
                        return;
                    }
                    if(validMustField()){
                        modPerson(index);
                    }
                });
            }
        },{
            text: '删除',
            id: "btnDelete",
            code:80,
            handler: function () {
                var row=$('#dgrid').datagrid('getSelections');
                if(row.length==0){
                    layer.msg('请选择要删除的人员信息',{time:1000});
                    return;
                }
                if(row.length>0){
                    getSelections();
                }
                mType = 'del';
                $('#dPers').text(namesArr.join(','));
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
                    layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    formData={};
                    perObj['personIds'] = idsArr.join(',');
                    formData.personIds = perObj['personIds'];
                    delPerson(index);

                });
            }
        },
        {
            text: '导出',
            id: "refreshBtn",
            code:80,
            handler: function () {
            	exFun();
                $(this).blur();
            }
        },   
        {
            text: '导入',
            id: "btnImport",
            handler: function () {
                layer.open({
                    type: 1,
                    title: false,
                    area: "644px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#import"),
                    move: $('#import .title')

                })
            }
        },{
            text: '导出',
            id: "btnExport",
            // iconCls: 'icon iconfont icon-daochu',
            handler: function () {
                var index = layer.open(publicObj({
                    kind: 'layer',
                    area: '500px',
                    content: $('#export'),
                    move: $('#export .title')
                }));
                $('#export .no').click(function () {
                    layer.close(index)
                });

                $('#export .yes').off('click');
                $('#export .yes').click(function () {
                    var name = $('#excelFileName').val();
                    var d = time.getCurTime();
                    if (name == '') {
                        lx.export({
                            // url:'order/orderExport',
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        })
                    } else {
                        name = name + ' ' + d + '.xlsx';
                        lx.export({
                            // url:'order/orderExport',
                            data: {
                                recordStatus: 10
                            },
                            success: lx.exportCallback
                        }, name)
                    }
                });
            }
        }
        ],
        onSelect: function (index,row) {
            var minzuName=row.minzuName;
            if(minzuName=='0'){
                minzuName='汉族'
            }else if(minzuName=='1'){
                minzuName='藏族'
            }
            perObj['deptName'] = row.deptName;
            perObj['personId'] = row.personId;
            perObj['personName'] = row.personName;
            perObj['personPhone'] = row.personPhone;
            perObj['personType'] = row.personType;
            perObj['personAddress'] = row.address;
            perObj['personSex'] = row.personSex;
            perObj['minzuId'] = minzuName;
            perObj['joinTime'] = row.joinTime;
            perObj['register'] = row.register;
            perObj['idCardNum'] = row.idCareNum;
            perObj['icNum'] = row.icNum;
            perObj['personTypeId'] = row.personTypeId;
            perObj['remark']=row.remark;
            perObj['deptId']=row.deptId;
            if(row.picId!=''){
                var picParent=$('#addNew .pic-list li,#selectAll .pic-list li');
                if(picParent.find('img').length>0){
                    picParent.find('img').remove();
                }
                picParent.find('a').css('display','none');
                picParent.find('span').css('display','inline-block');
                var img=$('<img>');
                img.attr('src',requestUrl+'file/view?id='+row.picId);
                picParent.append(img);
            }
            input.attr('data-uuid',row.picId);
            getSelections();
        },

        onLoadError: function () {
            console.log(1)
        },
        onLoadSuccess: function () {
            $('.dgrid .show-detail').mouseover(function () {
                $(this).css({color: "#1874ad", cursor: "pointer"})
            }).mouseleave(function () {
                $(this).css({color: "#000", cursor: "pointer"})
            });
            $('.dgrid .show-detail').click(function () {
                var orderId = $(this).attr('data-href');
                setTimeout(function () {
                    // $('#btnStatistList').trigger('click');
                }, 100);
            });
            $('.dgrid .preview-picture').click(function(){
                var picArr;
                if($(this).attr('data-id').indexOf(',')==-1){
                    picArr=[$(this).attr('data-id')]
                }else{
                    picArr=$(this).attr('data-id').split(',');
                }
                var html='';
                for(var j=0;j<picArr.length;j++){
                    html+='<img src=" '+requestUrl+'/file/view?id='+picArr[j]+'" data-picId="'+picArr[j]+'">';
                }
                $('#previewInfo .peelInfoPopup').find('li').html(html);
                layer.open(publicObj({
                    kind:'layer',
                    area:'600px',
                    content:$('#previewInfo'),
                    move:$('#previewInfo .title'),
                    shadeClose: false,
                    closeBtn: 1,
                    success:function(){

                    }
                }));
            })
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    var $dateFmt="yyyy-MM-dd";
    timeControl($('#time1'),'time1',$dateFmt);
    var nodes = [];
    var formData = {},//请求数据
        mType = '';//请求方法类型
    var perObj = {
        deptId: userDeptId,
        deptName:'',
        personId: '',
        personIds: '',
        personName: '',
        personType: 0,
        personSex: '',
        minzuId: 0,
        personAddress: '',
        joinTime: '',
        register: '',
        idCardNum: ''
    };
    var idsArr = [], namesArr = [];
    findDept($("#treeDemo"));

    function findDept($dom) {
        nodes = [];
        formData={};
        formData.deptId=perObj['deptId'];
        var cfg = {
            token: getCookie("token"),
            url: 'department/findDeptTree',
            data:formData,
            success: function (data) {
                var result = data.data;
                if (result.length > 0) {
                    for (var i = 0, l = result.length; i < l; i++) {
                        nodes.push({"id": result[i].deptId, "pId": result[i].pid, "name": result[i].deptName});
                    }
                }
                $.fn.zTree.init($dom, setting, openNodes(nodes));
            }
        };
        customAjax(cfg);
    }

    function openNodes(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].open = true;
            if (arr[i].pId == 0) {
                arr[i].iconSkin = "treeRoot";
            } else {
                arr[i].iconSkin = "child";
            }
        }
        return arr;
    }

    //单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        perObj['deptId'] = treeNode.id;
        dept=treeNode.id;
        perObj['deptName']=treeNode.name;
        $deptName.val(perObj['deptName']);
        findPerson();
    };
    //导出
    function exFun() {
        layer.open({
            type: 1,
            title: '人员信息-导出',
            //area: ['420px'], //宽高
            //content: '',
            btn: ['导出当前', '导出全部'],
            yes: function () {
            	var dataOpt=$('#dgrid').datagrid('options');
            	console.log(dataOpt);
            	applyListOpt.queryParams['pageSize']=dataOpt.pageSize;
            	applyListOpt.queryParams['pageNumber']=dataOpt.pageNumber;
                var opt = {
                    name: '人员信息',
                    pram: applyListOpt.queryParams,           
                    url: 'person/exportPerson',
                    recType: 'POST'
                }
                exportFile(opt);
            },
            btn2: function () {
            	var dataOpt=$('#dgrid').datagrid('options');
            	console.log(dataOpt);
            	//applyListOpt.queryParams['pageSize']=dataOpt.pageSize;
            	//applyListOpt.queryParams['pageNumber']=dataOpt.pageNumber;
                var opt = {
                    name: '人员信息',
                    pram: applyListOpt.queryParams,           
                    url: 'person/exportPerson',
                    recType: 'POST'
                }
                exportFile(opt);
                /*if (carDeptId == null) {
                    delete(pram.deptId);
                }
                if (carVNo == null) {
                    delete(pram.vehicleNo);
                }
                if (carSimNo == null) {
                    delete(pram.simNo);
                }
                if (carTremNo == null) {
                    delete(pram.termNo);
                }

                var opt = {
                    name: '人员信息',
                    pram: pram,
                    url: 'person/exportPerson',
                    recType: 'POST'
                }
                exportFile(opt);
                return false*/
            },
            btn3: function () {
                var chooseLay = layer.open({
                    type: 1,
                    title: '人员信息-选择导出',
                    content: $('#chooseCarTree'),
                    btn: ['确定', '取消'],
                    yes: function () {
                        var ckNode = $.fn.zTree.getZTreeObj('carTree').getCheckedNodes(),
                            newNode = [],
                            carIds = '';
                        for (var i in ckNode) {
                            if (ckNode[i].nodeType == 4) {
                                newNode.push(ckNode[i]);
                                carIds = carIds + ',' + ckNode[i].id;
                            }
                        }
                        if (newNode == '') {
                            layer.msg('请选择要导出的人员', {
                                time: 1000
                            });
                            return ;
                        }
                        carIds = carIds.substr(1, carIds.length);
                        var opt = {
                                name: '人员信息',
                                pram: formData,
                                url: 'person/exportPerson',
                                recType: 'POST'
                            }
                        exportFile(opt);
                    },
                    success: function () {
                        getTreeData(3);
                    }
                })
                return false
            },
            success: function () {
                $('.layui-layer-btn1').css({
                    'background-color': '#2e8ded',
                    'border': '1px solid #4898d5',
                    'color': '#fff'
                });
                $('.layui-layer-btn2').css({
                    'background-color': '#2e8ded',
                    'border': '1px solid #4898d5',
                    'color': '#fff'
                });
            }
        })
    }
    /*文件导出*/
    function exportFile(opt) {
        ycyaFileOpt.export(opt);
    }
    
    //查询人员
//    findPerson();
    function findPerson() {
        applyListOpt.queryParams['id']=perObj['deptId'];
        $('#dgrid').datagrid('reload',{
        	gridType: 'easyui',
            recordStatus: 10,
            personName:$("#personName").val(),
            id:perObj['deptId']
        });
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['personName']=$('#personName').val();
        applyListOpt.queryParams['personName']=perObj['personName'];
        findPerson();
    });
    //新增人员
    function personAdd(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'person/personAdd',
            data: formData,
            success: function (data) {
                findPerson();
                layer.close(indexPop);
                layer.msg('人员添加成功！', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    //修改人员person/modPerson
    function modPerson(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'person/modPerson',
            data: formData,
            success: function (data) {
                findPerson();
                layer.close(indexPop);
                layer.msg('人员修改成功！', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    //删除人员person/delPerson
    function delPerson(indexPop) {
        var cfg = {
            token: getCookie("token"),
            url: 'person/delPerson',
            data: formData,
            success: function (data) {
                findPerson();
                layer.close(indexPop);
                layer.msg('人员删除成功！', {
                    time: 1000
                });
            }
        };
        customAjax(cfg);
    }

    queryDataDiction1();

    //取得所有选中行数据
    function getSelections() {
        idsArr = [];
        namesArr = [];
        var rows = $('#dgrid').datagrid('getSelections');
        for (var i = 0; i < rows.length; i++) {
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName)
        }
    }
    //新增、修改按钮点击去掉红色边框
    removeValid();
    //图片
    var fileType=['jpg','png','gif'];
    var input=$('.input-group').find('input[type="file"]');
    var fd=new FormData(),
        xhr;
    $.each(input,function(ind){
        var _this=this;
        $(input[ind]).change(function (e) {
            //获取file对象
            var f = $(this).prop('files');
            //值验证
            if(!input[ind].value){return;}
            //文件后缀名验证
            var extension=f[0].name.split('.')[1];
            if($.inArray(extension,fileType)==-1){
                layer.msg('该类型文件不能上传!');
                return ;
            }
            //文件大小验证
            if( f[0].size > 2 * 1024 * 1024){
                layer.msg('请上传小于2M的文件');
                return ;
            }
            switch (ind){
                case 0:
                    fd.append('file', f[0]);
                    sendPic(fd,_this,$('#addNew .pic-list').find('li').eq(0));
                    break;
            }
        });
    });
    //选择图片
    $('#addNew .pic-list .choose-pic').click(function(){
        $('#'+$(this).attr('data-name')).trigger('click');
    });
    $('#addNew .pic-list .shade').click(function(){
        $('#'+$(this).attr('data-name')).trigger('click');
    });
    //发送图片
    function sendPic(picData,inputElm,imgParentElm){
        if (window.ActiveXObject) {
            xhr=new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            xhr= new XMLHttpRequest();
        }
        xhr.open('post', requestUrl+'file/up',true);
        xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
        xhr.onreadystatechange = function(){
            if(xhr.status == 200){
                if(xhr.readyState == 4){
                    var a=xhr.responseText;
                    function call(res){
                        var res= $.parseJSON(res);
                        $(inputElm).attr('data-uuid',res.data[0].uuid);
                        //对应的a标签
                        var elm;
                        $.each($('#addNew .pic-list a'),function(){
                            if($(this).attr('data-name')==$(inputElm).attr('id')){
                                elm=$(this);
                            }
                        });
                        elm.css('display','none').siblings('span').css('display','inline-block');

                        var pElm=imgParentElm;
                        if(pElm.find('img').length>0){
                            pElm.find('img').remove();
                        }
                        var img =$('<img>');
                        img.attr('src',requestUrl+'file/view/?id='+ res.data[0].uuid);
                        pElm.append(img);
                        /* dirverView({
                             url:'file/view',
                             data:{
                                 id:res.data[0].uuid
                             },
                             Dom:elm.parent()
                         });*/
                    }
                    call(a);
                }
            }else{
                layer.msg('上传失败',{time:1000})
            }
            //初始化对象，防止重复添加
            fd=new FormData();
        };
        xhr.send(picData);
    }
    //新增部门
    var $deptName=$('#addNew .deptName');
    $deptName.on('click',function () {
        perObj['deptId']=userDeptId;
        findDept($("#windowTree"));
        var treeIndex = layer.open({
            title: false,
            closeBtn: 1,
            type: 1,
            shade: 0,
            area: '400px',
            content: $('#form-Tree'),
            move: $('#form-Tree .form-top'),
            success: function () {

            }
        });
        // $('#form-Tree .submit-btn').off();
        $('#form-Tree .submit-btn').click(function () {
            layer.close(treeIndex);
        });
    });
    //高级查询功能
    seniorSearch('#seniorSearchBtn',applyListOpt,['personType','equipmentNum','icNum']);
});
 function personTypeOnchange(v){
 	if(v==1){//为驾驶员
 		$("#ic_num_li_r").css("display","block");
 	}else{
 		$("#ic_num_li_r").css("display","none");
 		$('#addNew .icNum').val('');
 	}
 }

// var ycyaFileOpt = {
//		 export:function (opt,callback) { //文件导出
//			 this.opt = {
//					 name:'文件',
//					 pram:{},
//					 url:'',
//					 recType:'GET'
//			 }
//			 $.extend(this.opt,opt);
//			 var fileName = (this.opt.name 
//
//					 || '未命名') + '.xls';
//			 $.ycyaAjax({
//				 url:this.opt.url,
//				 data:this.opt.pram,
//				 success:function (data) {
//					 var a = document.createElement('a');
//					 a.download = fileName;
//					 a.href = downloadUrl + data.data;
//					 $("body").append(a);    // 修复firefox中无法触发click
//					 a.click();
//					 $(a).remove();
//					 layer.closeAll();
//				 }
//			 });
//		 }
// }
