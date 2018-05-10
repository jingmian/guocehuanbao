$(function () {
    var dgData=[];//表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        // url:"package.json",  //请求地址
        //请求传递的参数
        queryParams: {
            pageSize: 20,
            pageNo: 1,
            gridType: 'easyui',
            recordStatus: 10
        },
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'noticeName',title:'公告名称',width:200},
            {field:'personName',title:'发布人',width:200,align:'center'},
            {field:'updateTime',title:'时间',width:200,align:'center'},
            {field:'noticeContext',title:'内容',width:200,align:'center'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        buttons: [{
            text:'新增',
            id: "btnNewAdd",
            handler:function() {
            	$('#addNew .titleText').text('新增公告');
                getInput('noticeName').val('');
                getInput('personName').val('');
                getInput('updateTime').val('');
                getInput('noticeContext').val('');
                var index=layer.open({
                    type:1,
                    title:false,
                    area:'1200px',
                    shadeClose:false,
                    closeBtn:1,
                    content:$('#addNew'),
                    move:$('#addNew .title'),
                })
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.noticeName=getInput('noticeName').val();
                    formData.personName=getInput('personName').val();
                    formData.updateTime=getInput('updateTime').val();
                    formData.noticeContext=getInput('noticeContext').val();
                    addNotice();
                    layer.close(index);
                });
            }
        },{
            text:'查看',
            id: "btnSelect",
            handler:function() {
                dgridOneRow('select','');
            	$('#addNew .titleText').text('查看公告');
                getInput('noticeName').val(noticeObj['noticeName']);
                getInput('personName').val(noticeObj['personName']);
                getInput('updateTime').val(noticeObj['updateTime']);
                getInput('noticeContext').val(noticeObj['noticeContext']);
                var index=layer.open({
                    type:1,
                    title:false,
                    area:'1200px',
                    shadeClose:false,
                    closeBtn:1,
                    content:$('#addNew'),
                    move:$('#addNew .title'),
                })
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.noticeName=getInput('noticeName').val();
                    formData.personName=getInput('personName').val();
                    formData.updateTime=getInput('updateTime').val();
                    formData.noticeContext=getInput('noticeContext').val();
                    formData.noticeId=noticeObj['noticeId'];
                    layer.close(index);
                });
            }
        },{
            text:'删除',
            id: "btnDelete",
            handler:function() {
                dgridOneRow('mod','请选择要删除的公告信息');
                var index=layer.open({
                    type: 1,
                    title: false,
                    area: "300px",
                    shadeClose:false,
                    closeBtn: 1,
                    content: $("#delete"),
                    move: $('#delete .title')
                })
                $('#delete .no').click(function(){layer.closeAll();
                });
                $('#delete .yes').off('click');
                $('#delete .yes').click(function(){
               	 var str = idsArr.join(',');
               	noticeObj['noticeId']=str;
                 formData.noticeId=noticeObj['noticeId'];
                 delNotice();
                 layer.close(index);

                });
            }
        },{
            text: '修改',
            id: "btnApudate",
            handler: function () {
                dgridOneRow('mod','请选择要修改的公告信息');
            	$('#addNew .titleText').text('修改公告');
                getInput('noticeName').val(noticeObj['noticeName']);
                getInput('personName').val(noticeObj['personName']);
                getInput('updateTime').val(noticeObj['updateTime']);
                getInput('noticeContext').val(noticeObj['noticeContext']);
                var index=layer.open({
                    type:1,
                    title:false,
                    area:'1200px',
                    shadeClose:false,
                    closeBtn:1,
                    content:$('#addNew'),
                    move:$('#addNew .title'),
                })
                $('#addNew .no').click(function(){layer.closeAll();
                });
                $('#addNew .yes').off('click');
                $('#addNew .yes').click(function(){
                    formData.noticeName=getInput('noticeName').val();
                    formData.personName=getInput('personName').val();
                    formData.updateTime=getInput('updateTime').val();
                    formData.noticeContext=getInput('noticeContext').val();
                    formData.noticeId=noticeObj['noticeId'];
                    updateNotice();
                    layer.close(index);
                });
            }
        },{
            text: '刷新',
            id: "btnConfirm",
            handler: function () {
                $('#dgrid').datagrid('reload',applyListOpt.queryParams)
            }
        }
        ],
        onClickRow: function (index, row) {
        	formData.noticeId=row.noticeId;
            formData.noticeName=row.noticeName;
            formData.personName=row.personName;
            formData.updateTime=row.updateTime;
            formData.noticeContext=row.noticeContext;
            noticeObj['noticeId']=row.noticeId;
        	noticeObj['noticeName'] = row.noticeName;
            noticeObj['personName'] = row.personName;
            noticeObj['updateTime'] = row.updateTime;
            noticeObj['noticeContext'] = row.noticeContext;
           // getSelections();
        },
        onLoadSuccess:function(){
            $('.dgrid .show-detail').mouseover(function(){
                $(this).css({color:"#1874ad",cursor:"pointer"})
            }).mouseleave(function(){
                $(this).css({color:"#000",cursor:"pointer"})
            });
            $('.dgrid .show-detail').click(function(){
                var orderId=$(this).attr('data-href');

                setTimeout(function(){
                    $('#check-btn').trigger('click');
                },100);
            })
        }
    };
    datagridFn(applyListOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
     formData = {}, mType = '';//传入数据
    /*var $noticeName = $('.noticeName'),
        $personName = $('.personName'),
        $updateTime = $('.updateTime'),
        $noticeContext = $('.noticeContext');
    var noticeId='',//公告id
        noticeName='',//公告名称
        personName='',//公告名称
        updateTime='',//公告时间
        noticeContext='';//公告内容
*/    var noticeObj={
    	noticeId:0,//公告id
        noticeName:'',//公告名称
        personName:'',//公告名称
        updateTime:'',//公告时间
        noticeContext:''//公告内容
    };
    var idsArr=[],namesArr=[];
    findNotice($('#dgrid'),dgData);
    //查询公告
    findNotice();
    function findNotice() {
    	formData={};
        var cfg = {
            token: getCookie("toekn"),
            url: 'systemNoticeRemind/findNotice',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    var result = data.data.notice;
                    if (result.length > 0) {
                       $("#dgrid").datagrid('loadData',result);
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
    //新增公告
    function addNotice() {
        var cfg = {
            token: getCookie("toekn"),
            url: 'systemNoticeRemind/addNotice',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                	findNotice();
                    layer.msg('新增成功！', {
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

    //修改公告
    function updateNotice() {
    	var cfg = {
                token: getCookie("toekn"),
                url: 'systemNoticeRemind/modNotice',
                data: formData,
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.code == 0) {
                    	findNotice();
                        layer.msg('修改成功！', {
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

    //删除公告
    function delNotice() {
    	var cfg = {
                token: getCookie("toekn"),
                url: 'systemNoticeRemind/delNotice',
                data: formData,
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.code == 0) {
                    	findNotice();
                        layer.msg('删除成功！', {
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
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].noticeId);
            namesArr.push(rows[i].noticeName)
        }
    }
})
