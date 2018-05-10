$(function(){
    var setting={
        view:{
            showIcon:true
        },
        data:{
            simpleData:{
                enable: true,
                pIdKey: "pId",
                rootPId: 0
            }
        }
    };
    var JurisdictionTreeNode = [];//存储权限树数据
    var formData={};
	function openNodes(arr){
		for(var i=0;i<arr.length;i++){
			arr[i].open=true;
			if(arr[i].pId==0){
				arr[i].iconSkin="treeRoot"
			}else{
				arr[i].iconSkin="child"
			}
		}
		return arr;
	}
	//查询权限
    findPowerInfo($('#jurisdTree'));
	function findPowerInfo($dom) {
        var cfg = {
            token: getCookie("token"),
            url: 'systemRolePowerManage/findPowerInfo',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.data['powerInfoDTOList'];
                    if (result.length > 0) {
                        for (var i = 0, l = result.length; i < l; i++) {
                            JurisdictionTreeNode.push({
                                "id": result[i].id,
                                "pId": result[i].pid,
                                "name": result[i].powerName
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
});
