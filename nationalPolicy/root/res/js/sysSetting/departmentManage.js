$(function () {
    var setting = {
        view: {
            showIcon: true,
            txtSelectedEnable: true,
            showLine: true
        },
        data: {
            simpleData: {
                enable: true,
                idKey: "id",
                pIdKey: "pId",
                rootPId: 0
            }
        },
        callback: {
            onClick: zTreeClick,
        }
    };
    var nodes = [];
    var formData = {},//请求数据
        mType = '',//请求方法类型
        flag = 0;//是否是第一次添加部门
    var $treeName = $(".m-from").find("ul.tree-name");
    var $strong1 = $treeName.find("li").eq(0).find("strong"),
        $strong2 = $treeName.find("li").eq(1).find("strong"),
        $dDName = $("#dDeptName");
    $treeName.hide();
    var inputObj = {};//新增/修改输入框对象值
    var treeObj = {//部门树对象
        'deptName': '',
        'id': '',
        'deptNameParent': '',
        'pid': ''
    };
    var flag1=false;//判断是否选中
    findDept($("#deptTree"));

    function findDept($dom) {
        var cfg = {
            token: getCookie("token"),
            url: 'department/findDept',
            data: {tree: '1'},
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    nodes = [];
                    var result = data.data.deptInfo;
                    if (result.length > 0) {
                        nodes = [];
                        flag = 1;
                        for (var i = 0, l = result.length; i < l; i++) {
                            nodes.push({"id": result[i].deptId, "pId": result[i].pid, "name": result[i].deptName});
                        }
                    } else {
                        flag = 0;//第一次添加
                    }
                    $.fn.zTree.init($dom, setting, openNodes(nodes));
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

    //加载所有部门
    //添加部门
    function addDept() {
        var cfg = {
            token: getCookie("token"),
            url: 'department/addDept',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findDept($("#deptTree")); //重新加载结构树
                    layer.msg('部门添加成功！', {
                        time: 1000
                    });
                } else if (data.code == 2 || data.code == 1) {
                    tokenRequest(function () {
                        wulianAjax(cfg);
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

    //修改部门
    function modDept() {
        var cfg = {
            token: getCookie("token"),
            url: 'department/modDept',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findDept($("#deptTree")); //重新加载结构树
                    layer.msg('部门修改成功！', {
                        time: 1000
                    });
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

    //删除部门
    function deleteDept() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'department/deleteDept',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    findDept($("#deptTree")); //重新加载结构树
                    layer.msg('部门删除成功！', {
                        time: 1000
                    });
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

    //单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("deptTree"),
            parentNode = treeNode.getParentNode();
        if (parentNode) {
            zTree.expandNode(treeNode);//节点单击展开/收缩
        }
        treeObj['id'] = treeNode.id;
        flag1=true;
        if (parentNode && parentNode.name) {
            treeObj['deptNameParent'] = parentNode.name;
            treeObj['pid'] = treeNode.pId;
        } else {
            treeObj['deptNameParent'] = '无上级部门';
            treeObj['pid'] = 0;
        }
        treeObj['deptName'] = treeNode.name;
        $strong1.html(treeObj['deptName']);
        $strong2.html(treeObj['deptNameParent']);
        $treeName.show();
        if (mType == 'add') {
            getInput('pid').val(treeNode.name);
            formData.pid = treeObj['id'];
            $treeName.hide();
        }
        if (mType == 'mod') {
            getInput('pid').val(treeNode.name);
            // treeObj['pid'] = treeNode.id;
            formData.pid = treeObj['id'];
            $strong1.html($('#deptName').val());
            $strong2.html(treeNode.name);
            if($('#deptName').val()==treeNode.name){
                $strong2.html('无上级部门');
            }
            $treeName.show();
        }
    };
    //根据权限码显示菜单(不是easyui表格中的菜单)
    function menuPower2($dom) {
        var arr=[
            {id:'btnNewAdd',code:139,text:'新增'},
            {id:'btnApudate',code:140,text:'修改'},
            {id:'btnDelete',code:141,text:'删除'},
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
    /*新增部门*/
    $('#btnNewAdd').click(function () {
        $('#addNew .titleText').html('新增部门信息');
        mType = "add";
        postFormData();
        removeValid();
        var index = layer.open(publicObj({
            kind: 'layer',
            area: '500px',
            content: $('#addNew'),
            move: $('#addNew .title'),
            success: function () {
                if (!flag == 0) {
                    $('.pid').focus(function () {//选择上级部门
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
                            $treeName.hide();
                        });
                    });
                }

            }
        }));
        $('#addNew .no').off('click');
        $('#addNew .no').click(function () {
            layer.closeAll();
            $treeName.show();
        });
        $('#addNew .yes').off('click');
        $('#addNew .yes').click(function () {
            var deptName = $.trim($("#deptName").val());
            if(validMustField()){
                formData.deptName =deptName;
                if (flag == 0) {
                    postFormData();
                }
                addDept();
                layer.close(index);
                mType='';
            }
        });
    });
    /*修改部门*/
    $('#btnApudate').click(function () {
        if(flag1==false){
            layer.msg('请选择部门',{timer:1000});
            return false
        }
        $('#addNew .titleText').html('修改部门信息');
        mType = "mod";
        postFormData();
        removeValid();
        var index = layer.open(publicObj({
            kind: 'layer',
            area: '500px',
            content: $('#addNew'),
            move: $('#addNew .title'),
            success: function () {
                $('.pid').focus(function () {//选择上级部门
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
                        // $treeName.hide();
                    });
                });
            }
        }));
        $('#addNew .no').off('click');
        $('#addNew .no').click(function () {
            layer.closeAll();
            $treeName.show();
        });
        $('#addNew .yes').off('click');
        $('#addNew .yes').click(function () {
           getInput();
            var deptName = $.trim($("#deptName").val());
            if(validMustField()){
                formData.deptName = deptName;
                if (flag == 0) {
                    postFormData();
                }
                modDept();
                layer.close(index);
                mType='';
                $treeName.show()
                flag1=false;
            }
        });
    })
    /*删除部门*/
    $('#btnDelete').click(function () {
        if(flag1==false){
            layer.msg('请选择部门',{timer:1000});
            return false
        }
        mType = "delete";
        postFormData();
        var index = layer.open(publicObj({
            kind: 'layer',
            area: '300px',
            content: $('#delete'),
            move: $('#delete .title'),
            success: function () {
                $('.form-btn .no').click(function () {
                    layer.closeAll();
                    $treeName.show();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function () {
                    deleteDept();
                    layer.close(index);
                    $treeName.hide();
                    flag1=false;
                });
            }
        }));

    })

    //没有部门时第一次添加部门
    function addDeptFirst($dom) {
        formData.deptName = $dom.val();
        formData.pid = 0;
        formData.id = 1;
        return formData;
    }

    //调用方法
    function postFormData() {
        formData = {};
        if (mType == 'find') {
            formData = {};
        } else if (mType == "add") {
            if (!flag == 0) {
                getInput('pid').val('');
            } else {
                addDeptFirst(getInput('deptName'));
            }
            getInput('deptName').val('');
        } else if (mType == "mod") {
            getInput('deptName').val(treeObj['deptName']);
            getInput('pid').val(treeObj['deptNameParent']);
            //getInput('deptName').val(treeObj['pid']);
            formData.pid = treeObj['pid'];
            formData.deptId = treeObj['id'];
        } else if (mType == "delete") {
            $dDName.html(treeObj['deptName']);
            formData.deptId = treeObj['id'];
        }
    }

})
