$(function () {
    var setting = {
        view: {
            showIcon: true
        },
        data: {
            simpleData: {
                enable: true,
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: zTreeClick
        }
    };//角色
    var settingJuri1 = {
        view: {
            showIcon: false
        },
        data: {
            simpleData: {
                enable: true,
                pIdKey: "pId",
                rootPId: 0
            },
            key: {
                checked: "checked"
            }
        },
        chkStyle: "checkbox",
        check: {
            chkboxType: {"Y" : "ps", "N" : "ps" },
            enable:true
        },
        callback: {
            onCheck: zTreeClickJuri,
        }
    };//权限
    var settingJuri2 = {
        view: {
            showIcon: true
        },
        data: {
            simpleData: {
                enable: true,
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            // onClick: zTreeClick2
        }
    };//权限信息
    var treeNodeRole = [];//存储角色树数据
    var JurisdictionTreeNode = [];//存储权限树数据
    var formData = {}, mType = '';//传入数据
    var roleObj = {//角色对象
        'roleName': '',
        'pid': 0,
        'id': '',
        'rolePartenName': ''
    };
    var idsArr = [], namesArr = [];
    var flag=false;//判断是否选中
    //根据权限码显示菜单(不是easyui表格中的菜单)
    function menuPower2($dom) {
        var arr=[
            {id:'btnNewAdd',code:149,text:'新增'},
            {id:'btnApudate',code:150,text:'修改'},
            {id:'btnDelete',code:151,text:'删除'},
        ];
        var $a='';
        for(var i=0;i<arr.length;i++){
            var code=arr[i].code;
            var id=arr[i].id;
            var text=arr[i].text;
            var state=parent.menuPower1(code);
            if(state){
                $a+='<a class="btn" href="javascript:void(0);" id="'+id+'">'+text+'</a>';
            }
        }
        if($a==''){
            $dom.remove();
            return;
        }
        $dom.append($a)
    }
    menuPower2($('#setCode'));
    /*新增角色*/
    $('#btnNewAdd').click(function () {
        mType = 'add';
        $('#addNew .titleText').html('新增角色信息');
        getInput('roleName').val('');
        $('#juriName').val('');
        removeValid();
        var index = layer.open(publicObj({
            kind: 'layer',
            area: '500px',
            content: $('#addNew'),
            move: $('#addNew .title'),
            success: function () {
                layerMode($('.rolePid'), $('#role-form-Tree'), findRole($('#windowTree')));
                layerMode($('.juriName'), $('#juri-from-Tree'), findPowerInfo($('#windowTree1'),'powerInfoDTOList',settingJuri1));
                $('#juri-from-Tree .submit-btn').click(function () {
                    $('#juriName').val(namesArr.join(','));
                });
            }
        }));
        $('#addNew .no').off('click');
        $('#addNew .no').click(function () {
            layer.closeAll();
        });
        $('#addNew .yes').off('click');
        $('#addNew .yes').click(function () {
            if(validMustField()){
                formData.roleName = getInput('roleName').val();
                formData.pid = roleObj['pid'];
                formData.powerIds = idsArr.join(',');
                // formData.remark = getInput('roleRemark').val();
                addRole();
                layer.close(index);
            }
        });
    })
    /*修改角色*/
    $('#btnApudate').click(function () {
        if(flag==false){
            layer.msg('请选择角色',{timer:1000});
            return false
        }
        mType = 'mod';
        $('#addNew .titleText').html('修改角色信息');
        showPower();
        getInput('roleName').val(roleObj['roleName']);
        removeValid();
        var index = layer.open(publicObj({
            kind: 'layer',
            area: '500px',
            content: $('#addNew'),
            move: $('#addNew .title'),
            success: function () {
                layerMode($('.rolePid'), $('#role-form-Tree'), findRole($('#windowTree')));
                layerMode($('.juriName'), $('#juri-from-Tree'), findPowerInfo($('#windowTree1'),'powerInfoDTOList',settingJuri1));
                $('#juri-from-Tree .submit-btn').click(function () {
                    $('#juriName').val(namesArr.join(','));
                });
            }
        }));
        $('#addNew .no').click(function () {
            layer.closeAll();
        });
        $('#addNew .yes').off('click');
        $('#addNew .yes').click(function () {
            if(validMustField()){
                formData.roleId = roleObj['roleId'];
                formData.roleName = getInput('roleName').val();
                formData.pid = roleObj['pid'];
                formData.powerIds = idsArr.join(',');
                modRole();
                layer.close(index);
                flag=false;
            }
        });
    })
    /*删除角色*/
    $('#btnDelete').click(function () {
        if(flag==false){
            layer.msg('请选择角色',{timer:1000});
            return false
        }
        $('#dInfo').text(roleObj['roleName']);
        var index = layer.open(publicObj({
            kind: 'layer',
            area: '300px',
            content: $('#delete'),
            move: $('#delete .title'),
            success: function () {

            }
        }));
        $('#delete .no').click(function () {
            layer.closeAll();
        });
        $('#delete .yes').off('click');
        $('#delete .yes').click(function () {
            formData.roleId = roleObj['roleId'];
            deleteRole();
            layer.close(index);
            flag=false
        });
    });

    function openNodes(arr) {
        for (var i = 0; i < arr.length; i++) {
            arr[i].open = true;
            if (arr[i].pId == 0) {
                arr[i].iconSkin = "treeRoot"
            } else {
                arr[i].iconSkin = "child"
            }
        }
        return arr;
    }

    //查询角色
    findRole($('#deptTree'));

    function findRole($dom) {
        formData={};
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/findRole',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.data;
                    treeNodeRole = [];
                    if (result.length > 0) {
                        for (var i = 0, l = result.length; i < l; i++) {
                            treeNodeRole.push({
                                "id": result[i].roleId,
                                "pId": result[i].pid,
                                "name": result[i].roleName
                            });
                        }
                    }
                    $.fn.zTree.init($dom, setting, openNodes(treeNodeRole));
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
    //新增角色
    function addRole() {
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/addRole',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRole($('#deptTree'));
                    layer.msg('角色增加成功！', {
                        time: 1000
                    });
                    showPower();
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
    //修改角色
    function modRole() {
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/modRole',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRole($('#deptTree'));
                    layer.msg('角色修改成功！', {
                        time: 1000
                    });
                    showPower();
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

    //删除角色
    function deleteRole() {
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/deleteRole',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findRole($('#deptTree'));
                    layer.msg('角色删除成功！', {
                        time: 1000
                    });
                    showPower();
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

    //查询权限
    function findPowerInfo($dom,obj,setting) {
        if(mType=='add'){
            // formData.roleId='0';
        }else{
            formData.roleId=roleObj['roleId'];
        }
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/findPowerInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                JurisdictionTreeNode=[];
                if (data.code == 0) {
                    var result = [];
                    if(obj=='chickPowerInfo'){
                        result = data.data['chickPowerInfo'];
                        var idsArr1=[],namesArr1=[];
                        if(result.length>0){
                            if(mType=='add'){
                                idsArr1=[],namesArr1=[];
                                $('#juriName').val(namesArr1.join(','));
                            }
                            if(mType=='mod'){
                                for(var j=0;j<result.length;j++){
                                    idsArr1.push(result[j].id);
                                    namesArr1.push(result[j].powerName);
                                }
                                $('#juriName').val(namesArr1.join(','));
                            }
                        }

                    }else{
                        result = data.data['powerInfoDTOList'];
                    }

                    if (result.length > 0) {
                        for (var i = 0, l = result.length; i < l; i++) {
                            JurisdictionTreeNode.push({
                                "id": result[i].id,
                                "pId": result[i].pid,
                                "name": result[i].powerName,
                                "checked":result[i].checked
                            });
                        }

                    }
                    $.fn.zTree.init($dom, setting, openNodes(JurisdictionTreeNode));
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

    //单击节点
    function zTreeClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("deptTree"),
            parentNode=treeNode.getParentNode();
        if(treeNode){
            flag=true;
        }
        if(parentNode){
            // zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        roleObj['roleName'] = treeNode.name;
        roleObj['roleId'] = treeNode.id;
        roleObj['pid'] = treeNode.pId;
        formData={};
        formData.roleId=roleObj['roleId'];
        if (parentNode && parentNode.name) {
            roleObj['rolePartenName'] = parentNode.name;
            roleObj['pid'] = parentNode.id;
        } else {
            roleObj['rolePartenName'] = '无父级角色';
            roleObj['pid'] = 0;
        }
        mType='';
        if (mType == 'add') {
            // roleObj['roleId']='0';
            getInput('rolePid').val(roleObj['roleName']);
        } else if (mType == 'mod') {
            roleObj['roleId'] = treeNode.id;
            getInput('roleName').val(roleObj['roleName']);
            getInput('rolePid').val(roleObj['rolePartenName']);
        }
        // formData.roleId=
        showPower();
        $('#juriName').val(namesArr.join(','));
    }
    function zTreeClickJuri(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("windowTree1");
        var checked = treeNode.checked;
        var selectedNodes=zTree.getCheckedNodes(true);
        getAllCheckdNodes(selectedNodes);
        $('#juriName').val(namesArr.join(','));
    }
    //获得所有勾选节点
    function getAllCheckdNodes(selectedNodes) {
        idsArr=[];namesArr=[];
        for (var i=0, l=selectedNodes.length; i < l; i++)
        {
            if($.inArray(selectedNodes[i].id,idsArr)==-1) {
                idsArr.push(selectedNodes[i].id);
                namesArr.push(selectedNodes[i].name);
            }
        }
    }
    //右边对应角色的权限
    function showPower() {
        if(mType=='add'){
            formData.roleId='0'
        }else{
            formData.roleId=roleObj['roleId'];
        }
        findPowerInfo($('#curRoleTree'),'chickPowerInfo',settingJuri2);
    };
});

