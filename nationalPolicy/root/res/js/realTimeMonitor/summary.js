$(function () {
    $('.rTMList').css({
        overflow: 'auto',
        height: $('.rTMLBox').height() - 5 + 'px',
        paddingTop:'30px'
    });
    paddingPersonList();

    function paddingPersonList() {
        var $ul = $('.rTMLTellPolicy ul.line');
        var cfg = {
            token: getCookie('deptId'),
            data: {
                deptId: getCookie('deptId')
            },
            url: 'realTimeProtectionService/findRealTimeProtectionInfo',
            success: function (data) {
                var list = data.data[0];
                if (lx.isEmptyObj(list)) {
                    return;
                }
                var str1 = '',
                    str2 = '',
                    str3 = '',
                    str4 = '';
                for (var key in list) {
                    var l = list[key];
                    if (key == 'personInfo') {
                        str1 += '<p class="rTMTitle"><i class="iconfont icon-yonghu11"></i> <span>人员数据</span><em>(' + l.allPersonNum + ')</em><strong class="iconfont icon-sanjiao-copy-copy-copy1"></strong></p>';
                        str1 += '<ul class="clear"><li> <span>应出勤:</span> <em class="rColorGreen">' + l.shouldWorkPersonNum + '</em> </li><li><span>实出勤:</span> <em class="rColorBlue">' + l.workPersonNum + '</em> </li> <li> <span>报警数:</span> <em class="rColorRed">' + l.alarmNum + '</em> </li> </ul>';
                        if (l.offLineCarNum && l.onLineCarNum) {
                            str4 += '<p class="rTMTitle"><i class="iconfont icon-yonghu11"></i> <span>人员定位</span><em>(' + l.allPersonNum + ')</em><strong class="iconfont icon-sanjiao-copy-copy-copy1"></strong></p>';
                            str4 += '<ul class="clear"><li> <span>在线数:</span> <em class="rColorGreen">' + l.onLineCarNum + '</em> </li><li><span>离线数:</span> <em class="rColorBlue">' + l.offLineCarNum + '</em> </li> <li> <span>报警数:</span> <em class="rColorRed">' + l.alarmNum + '</em> </li> </ul>';
                        }
                    } else if (key == 'carSumInfo') {
                        str2 += '<p class="rTMTitle"> <i class="iconfont icon-cheliang"></i> <span>车辆数据</span> <em>(' + l.allCountNum + ')</em><strong class="iconfont icon-sanjiao-copy-copy-copy1"></strong></p>';
                        str2 += '<ul class="clear"> <li> <span>在线数:</span> <em class="rColorGreen">' + l.onLineCarNum + '</em> </li><li><span>离线数:</span> <em class="rColorBlue">' + l.offLineCarNum + '</em> </li> <li> <span>报警数:</span> <em class="rColorRed">' + l.alarmCarNum + '</em> </li> </ul>';
                    } else {
                        str3 += '<p class="rTMTitle"> <i class="iconfont icon-shanchu"></i> <span>设施数据</span> <em>(' + l.allFacilitiesNum + ')</em><strong class="iconfont icon-sanjiao-copy-copy-copy1"></strong></p>';
                        str3 += '<ul class="clear">';
                        for (var j in l) {
                            if (j == 'allFacilitiesNum') {
                                str3 += '';
                            } else {
                                if (j.length > 4) {
                                    str3 += '<li class="long"><span>' + j + ':</span> <em class="rColorRed">' + l[j] + '</em></li>';
                                } else {
                                    str3 += '<li><span>' + j + ':</span> <em class="rColorRed">' + l[j] + '</em></li>';
                                }

                            }

                        }
                        str3 += '</ul>';
                    }
                }
                $('.rTMList .rTMLType').each(function (ind) {
                    if (ind == 0) {
                        $(this).html(str1);
                    } else if (ind == 1) {
                        str4 == '' ? $(this).remove() : $(this).html(str4);
                    } else if (ind == 2) {
                        $(this).html(str2);
                    } else if (ind == 3) {
                        $(this).html(str3);
                    }
                });
                $('.rTMList p.rTMTitle>strong').css({cursor: 'pointer'}).click(function () {
                    $(this).parent().siblings('ul').toggle();
                    if ($(this).attr('class').indexOf('icon-sanjiao-copy-copy-copy1') != -1) {
                        $(this).attr('class', 'iconfont icon-sanjiao-copy-copy-copy')
                    } else {
                        $(this).attr('class', 'iconfont icon-sanjiao-copy-copy-copy1')
                    }
                    return false;
                })
            }
        };
        map.ready(function () {
            customAjax(cfg);
        });
    }

    var opt = {
        url: '',
        searchKey: 'sorldName',
        deptId: serverData.deptId,
        pageSize: 15,
        pageNo: 1,
        dealType: ''
    };
    //搜索框绑定事件
    $("#carNum").bind('input propertychange', function () {
        findTree();
    });

    function getCarList(opt) {
        if ($('#carNum').length > 0) {
            carList = $('#carNum').vagueSearch(opt);
        }
    }

    function findTree() {
        opt.url = 'realTimeProtectionService/findTreeSoild';
        opt.dealType = $(".situType").val();
        opt.sorldName = $('#carNum').val();
        getCarList(opt);
    }

    $('.situType').click(function () {
        findTree();
    });

    $('#ss_btn').click(function () {
        var objId = $('#carNum').attr('keyid');
        if(objId && objId.trim().length >0){
            var type=$(".situType").val();
            if(type== '0'){
                objId='2'+objId;
            }else if(type==1){
                objId = '1'+objId;
            }else{
            	objId =objId;
            }
           
            map.autoOpenWin(objId);
           
        }
    });
});
