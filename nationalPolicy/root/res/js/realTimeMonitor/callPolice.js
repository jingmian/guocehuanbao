/**
 * Created by admin on 2017/11/15.
 */
$(function(){
    //填充左侧列表
    $('.rTMLBox').css({paddingRight:0});
    $('.rTMSerch').css({marginRight:'20px'});
    $('.rTMList').css({
        paddingRight:'8px',
        overflow:'auto',
        height:$('.rTMLBox').height()-5 +'px'
    });
    var pageNo=1,pageSize=10,_endPage=0;
    paddingList();
    /*功能函数*/
    function paddingList(){
        var cfg={
            token:getCookie('deptId'),
            data:{
                deptId:getCookie('deptId'),
                type:2,
                pageNo:pageNo,
                pageSize:pageSize
            },
            url:'realTimeProtectionService/findAllWarningInfo',
            success:function(data){
                var $ul=$('.rTMLTellPolicy ul.line'),
                    str='',
                    list=data.rows;
                _endPage=Math.ceil(data.total/pageSize);
                if(lx.isEmptyObj(list)){
                    return ;
                }
                var l=list;
                for(var i=0;i<l.length;i++){
                    var d=l[i];
                    if(d.alarmLevel==0){// blue
                        str+='<li class="colorBlue">';
                    }else if(d.alarmLevel==1){//yellow
                        str+='<li class="colorOrange">';
                    }else if(d.alarmLevel==2){//red
                        str+='<li class="colorRed">';
                    }
                    if(d.carNum){
                        str+='<div class="rTPBox"> <span class="rTPBTitle">'+d.dictionaryName+'</span><span class="rTPBTime">'+d.alarmTime+'</span> <span class="rTPBTitle">'+d.carNum+'</span>';
                        if(d.alarmTypeId == 8){
                            str+='<span class="rTptil">'+'漏油量:'+d.alarmOilConsume+'</span>';
                        }
                    }else{
                        str+='<div class="rTPBox"> <span class="rTPBTitle">'+d.dictionaryName+'</span><span class="rTPBTime">'+d.alarmTime+'</span> <span class="rTPBTitle">'+d.personName+'</span>';
                    }
                    str+='<p>'+d.alarmPlace+'</p><a href="javascript:void(0)" class="btnRTPBox" data-id="'+d.alarmId+'">处理</a> <div class="rTPBTag"></div></div>';
                    str+='</li>';
                }
                $ul.html(str);
                $('.rTMList a.btnRTPBox').click(function(e){
                    var id=$(this).attr('data-id'),
                        _this=$(this);
                    var $d=$('#dispose');
                    layer.open(publicObj({
                        kind:'layer',
                        content:$d,
                        move:$d.find('.title'),
                        area:'400px',
                        success:function(){}
                    }));
                    $d.find('.no').click(function(){
                        layer.closeAll();
                    });
                    $d.find('.yes').off('click');
                    $d.find('.yes').click(function(){
                        var disposeCfg={
                            token:getCookie('deptId'),
                            data:{
                                alarmId:id
                            },
                            url:'warningManage/dealWarningInfo',
                            success:function(data){
                                layer.closeAll();
                                layer.msg('处理成功',{time:1000},function(){
                                    _this.parent().parent().remove();
                                });
                            }
                        };
                        customAjax(disposeCfg)
                    })
                })
            }
        };
        customAjax(cfg);
        // map.ready(function(){
        // });
    }
    var $first=$('.first');
    var $prev=$('.prev');
    var $next=$('.next');
    var $end=$('.end');
    var $detailPage=$('#detailPage');
    //设置分页按钮是否能点击
    setPageBtnColor();
    function setPageBtnColor() {
        if(pageNo==1){
            pageBtnColor($first);
            pageBtnColor($prev);
            pageBtnColor1($next);
            pageBtnColor1($end);
        }else if(pageNo==_endPage){
            pageBtnColor($next);
            pageBtnColor($end);
            pageBtnColor1($first);
            pageBtnColor1($prev);
        }else{
            pageBtnColor1($first);
            pageBtnColor1($prev);
            pageBtnColor1($next);
            pageBtnColor1($end);
        }
        function pageBtnColor(dom) {
            dom.css({'color':'#8fa2b3'});
        }
        function pageBtnColor1(dom) {
            dom.css({'color':'gray'});
        }
    }
    //上一页
    function prevPage() {
        if(pageNo==1){
            pageNo=1;
            return;
        }else{
            pageNo--;
            paddingList();
        }
        setPageBtnColor();
    }
    //下一页
    function nextPage() {
        if(pageNo==_endPage){
            pageNo=_endPage;
            return;
        }else{
            pageNo++;
            paddingList();
        }
        setPageBtnColor();
    }
    //首页
    function firstPage() {
        if(pageNo==1){
            pageNo=1;
            return;
        }else{
            pageNo=1;
            paddingList();
        }
        setPageBtnColor();
    }
    //尾页
    function endPage() {
        if(pageNo==_endPage){
            pageNo=_endPage;
            return;
        }else{
            pageNo=_endPage;
            paddingList();
        }
        setPageBtnColor();
    }
    //具体某页
    function detailPage() {
        pageNo=$('#detailPage').val();
        paddingList();
        setPageBtnColor();
    }
    //分页点击事件
    $first.click(function () {
        firstPage();
    });
    $prev.click(function () {
        prevPage();
    });
    $next.click(function () {
        nextPage();
    });
    $end.click(function () {
        endPage();
    });
    $detailPage.keyup(function (event) {
        if($("#detailPage").val()){
            detailPage();
        }
       /* if(event.keyCode ==13){
            detailPage();
        }*/
    })
});
