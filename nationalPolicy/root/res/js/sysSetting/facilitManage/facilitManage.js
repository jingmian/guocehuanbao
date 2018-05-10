var formData={};
//查询设施信息
function findFacilitiesInfo(dom,result) {
    var cfg = {
        token: getCookie("token"),
        url: 'facilitiesService/findFacilitiesInfo',
        data: formData,
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                result = data.data.fac;
                if (result.length > 0) {
                    for (var i = 0, l = result.length; i < l; i++) {
                        dom.datagrid('loadData',result);
                    }
                }

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
//新增设施信息
function addFacilitiesInfo() {
    var cfg = {
        token: getCookie("token"),
        url: 'facilitiesService/addFacilitiesInfo',
        data: formData,
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                findFacilitiesInfo();
                layer.msg(data.msg, {
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

//删除设施信息
function delFacilitiesInfo() {
    var cfg = {
        token: getCookie("token"),
        url: 'facilitiesService/delFacilitiesInfo',
        data: formData,
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                findFacilitiesInfo(dom,result);
                layer.msg(data.msg, {
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
//获取字典类型
function queryDataDictionary() {
    var cfg = {
        token: getCookie("toekn"),
        url: 'datadictionary/queryDataDictionary',
        data: formData,
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                result = data.data;
                if (result.length > 0) {
                    for (var i = 0, l = result.length; i < l; i++) {
                        // dom.datagrid('loadData',result);
                    }
                }

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
//查询人员信息
function findPerson(userDeptId,personId) {
    var formData1={};
    formData1.pageSize=1000;
    formData1.id=userDeptId;
    var $agentName=$('#insertBeta .personId');
    var arr=[];
    var cfg = {
        token: getCookie("token"),
        url: 'person/findPerson',
        data: formData1,
        success: function (data) {
            var result=data.data.data;
            if(result.length>0){
                for(var i=0;i<result.length;i++){
                    var res=result[i];
                    var $option;
                    if(personId && personId==res.personId){
                        $option="<option value='"+res.personId+"' selected>"+res.personName+"</option>";
                    }else{
                        $option="<option value='"+res.personId+"'>"+res.personName+"</option>";
                    }
                    arr.push($option);
                }
                $agentName.html(arr.join(''));
            }
        }
    };
    customAjax(cfg);
}
//修改设施信息
function modFacilitiesInfo() {
    var cfg = {
        token: getCookie("token"),
        url: 'facilitiesService/modFacilitiesInfo',
        data: formData,
        success: function (data) {
            data = $.parseJSON(data);
            if (data.code == 0) {
                findFacilitiesInfo(dom,result);
                layer.msg(data.msg, {
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
