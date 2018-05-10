//查询树状结构数据(如：部门)
function queryTree($dom2,opt) {
    $('#treeDiv').remove();
    <!--存放树状弹出层的html-->
    var $treeDiv='<div id="treeDiv"></div>';
    $('body>script').eq(0).before($treeDiv);
    var $div=$('#treeDiv');
    var $html=`<div class="add form-Tree" style="display:none;" id="divTree">
        <form method="post">
            <div class="form-container">
                <!--标题-->
                <div class="form-top">
                    <span class="iconfont icon-cheng close"></span><span><i class="iconfont "></i><strong class="titleText">选择所属部门</strong></span>
                </div>
                <!--内容-->
                <div class="form-content">
                    <div id="windowTreeBox">
                        <ul id="tree" class="ztree"></ul>
                    </div>
                </div>
                <!--按钮组-->
                <div class="form-btns clear">
                    <input class="btn b-blue submit-btn" type="button" value="确定">
                </div>
            </div>
        </form>
    </div>`;
    $div.html($html);
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
    //单击
    function zTreeClick(event, treeId, treeNode) {
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        $dom2.val(treeNode.name);
        $dom2.attr('data-id',treeNode.id);
    };
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
    var deptNodes = [];
    var cfg = {
        token: getCookie("toekn"),
        url:opt.url,
        data: opt.data,
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                var result = data.data;
                if (result.length > 0) {
                    for (var i = 0, l = result.length; i < l; i++) {
                        deptNodes.push({"id": result[i][opt.id], "pId": result[i][opt.pid], "name": result[i][opt.name]});
                    }
                }
                $.fn.zTree.init($('#tree'), setting,openNodes(deptNodes));
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

