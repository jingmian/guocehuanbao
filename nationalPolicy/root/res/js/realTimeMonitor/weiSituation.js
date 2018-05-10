$(function () {
    var picUpload = [], //上报图片
        picConfirm = [];//确认图片
    //填充左侧列表
    $('.rTMLBox').css({paddingRight: 0});
    $('.rTMList').css({
        paddingRight: '16px',
        overflow: 'auto',
        maxHeight: $('.rTMLBox').height() - 5 + 'px'
    });
    $('.rTMList ul').css({
        width: '160px'
    });
    paddingList();

    /*功能函数*/
    function paddingList() {
        var cfg = {
            token: getCookie('token'),
            url: 'sanitation/findSanitation',
            data: {
                sanitationDeptId: getCookie('deptId'),
                pageSize: 10,
                pageNo: 1
            },
            success: function (data) {
                var $ul = $('.rTMLWSituation>ul');
                var str = '';
                var list = data.rows;
                if (list.length == 0) {
                    return;
                }
                for (var i = 0; i < list.length; i++) {
                    var d = list[i];
                    str += '<li data-id="' + d.sanitationId + '"><div class="rWSImgTxt">';
                    var resPicId;
                    if (d.picId1 == '' && d.picId2 == '') {
                        str += '<img src="../../../res/img/default/noPic.png" alt="">';
                    } else {
                        if ((d.picId1 != '' & d.picId2 == '') || (d.picId1 != '' & d.picId2 != '')) {
                            if (d.picId1.indexOf(',') != -1) {//大于一张
                                resPicId = d.picId1.split(',')[0];
                            } else {
                                resPicId = d.picId1;
                            }
                            str += '<img src="' + requestUrl + 'file/view?id=' + resPicId + '" alt="">';
                        }
                        if (d.picId1 == '' & d.picId2 != '') {
                            if (d.picId2.indexOf(',') != -1) {//大于一张
                                resPicId = d.picId2.split(',')[0];
                            } else {
                                resPicId = d.picId2;
                            }
                            str += '<img src="' + requestUrl + 'file/view?id=' + resPicId + '" alt="">';
                        }
                    }
                    str += '<p><span>' + d.addTime.slice(0, -8) + '</span><em title=" ' + d.sanitationDetails + ' ">' + d.sanitationDetails + '</em></p></div>';
                    if (d.sanitationLevel == 1) {
                        str += '<i class="rWSTag common"></i><p title="' + d.sanitationPlace + '">' + d.sanitationPlace + '</p></li>';
                    } else if (d.sanitationLevel == 2) {
                        str += '<i class="rWSTag urgent"></i><p title="' + d.sanitationPlace + '">' + d.sanitationPlace + '</p></li>';
                    } else if (d.sanitationLevel == 3) {
                        str += '<i class="rWSTag very-urgent"></i><p title="' + d.sanitationPlace + '">' + d.sanitationPlace + '</p></li>';
                    }
                }
                $ul.html(str);
                $('.rTMLWSituation li').click(function (e) {
                    var cfg = {
                        token: getCookie('token'),
                        url: 'sanitation/findSanitation',
                        data: {
                            sanitationDeptId: getCookie('deptId'),
                            sanitationId: $(this).attr('data-id'),
                            pageNo: 1,
                            pageSize: 1
                        },
                        success: function (data) {
                            var json = data.rows;
                            var d = json[0];

                            //地图定位
                            if (d.latLon) {
                                var points = d.latLon.split(",");
                                var point = map.createPoint('' + points[1] + '', '' + points[0] + '');
                                var datas =  {icon:'iconWei',data:[{lng:points[1],lat:points[0],id:0}],type:1};
                                map.toSetCenter(point);
                                map.addRoutePoint(datas,YcyaMapCfg);
                            }

                            if (json.length == 0) {
                                layer.msg('网络繁忙', {time: 1000});
                            }
                            if (d.picId1 != '') {
                                if (d.picId1.indexOf(',') == -1) {//一张图
                                    picUpload.push(d.picId1);
                                } else {
                                    picUpload = d.picId1.split(',');
                                }
                            }
                            if (d.picId2 != '') {
                                if (d.picId2.indexOf(',') == -1) {//一张图
                                    picConfirm.push(d.picId2);
                                } else {
                                    picConfirm = d.picId2.split(',');
                                }
                            }
                            //等待时间
                            if (d.handleTime) {
                                var d1 = new Date();
                                if (d.arrangeTime) {
                                    d1 = new Date(d.arrangeTime);
                                } else {
                                    if (d1.sureTime) {
                                        d1 = new Date(d.sureTime);
                                    }
                                }

                                var d2 = new Date(d.addTime);
                                d.handleTime = parseInt(parseInt(d1 - d2) / 1000 / 60);
                                var handTimeElm = $('#sateInfo .titleState').find('em'),
                                    hTime = d.handleTime;
                                if (hTime < 60) {
                                    handTimeElm.text(hTime + '分钟');
                                } else if (hTime >= 60 && hTime <= 1440) {
                                    var remainde = hTime % 60,
                                        integer = (hTime - remainde) / 60;
                                    handTimeElm.text(remainde == 0 ? integer + '小时' : integer + '小时' + remainde + '分钟');
                                } else {
                                    var remainde = hTime % 1440,
                                        dayTime = (hTime - remainde) / 1440;
                                    if (remainde < 60) {
                                        handTimeElm.text(dayTime + '天' + remainde + '分钟');
                                    } else {
                                        var minTime = remainde % 60,
                                            hourTime = (remainde - minTime) / 60;
                                        handTimeElm.text(dayTime + '天' + hourTime + '小时' + minTime + '分钟');
                                    }
                                }
                            }
                            layer.open(publicObj({
                                kind: 'layer',
                                area: '460px',
                                content: $('#sateInfo'),
                                move: $('#sateInfo .title'),
                                success: function () {
                                    $('.sIIImg ul').html('');

                                    $('.sIState .sISRadus').each(function (ind) {
                                        if (ind > 0) {
                                            if ($(this).hasClass('active')) {
                                                $(this).removeClass('active');
                                            }
                                        }
                                    });
                                    $('.sIState p').each(function () {
                                        var attr = $(this).attr('data-class');
                                        $(this).html('');
                                        if (d[attr]) {
                                            $(this).html(d[attr]);
                                            $(this).siblings('.sISRadus').addClass('active');
                                        }
                                    });
                                    $('.sIInfo p').each(function () {
                                        var attr = $(this).attr('data-class');
                                        if (d[attr]) {
                                            $(this).html(d[attr])
                                        }
                                    });
                                    //获取图片
                                    var totalPic = picUpload.concat(picConfirm);
                                    var html = '';
                                    if (totalPic.length > 0) {
                                        for (var i = 0; i < totalPic.length; i++) {
                                            html += '<li data-picId="' + totalPic[i] + '"><img src="' + requestUrl + 'file/view?id=' + totalPic[i] + '" ></li>';
                                        }
                                        $('.sIIImg ul').html(html);
                                        picUpload.length = [];
                                        picConfirm.length = [];
                                        $('.sIIImg ul').find('li').click(function () {
                                            var selfId = $(this).attr('data-picId');
                                            $('#peelInfo img').attr('src', '').attr('src', requestUrl + 'file/view?id=' + selfId);
                                            layer.open(publicObj({
                                                kind: 'layer',
                                                area: '500px',
                                                content: $('#peelInfo'),
                                                move: $('#peelInfo .title'),
                                                shade: 0
                                            }));
                                        })
                                    }

                                }
                            }))
                        }
                    };
                    customAjax(cfg);
                })
            }
        };
        map.ready(function () {
            customAjax(cfg);
        });
    }
});
