$(function(){
    $('.rTMLRoadLine>ul').css({
        maxHeight:$('.rTMLBox').height()-5 +'px',
        overflowY: 'auto'
    });
    $('.rTMList p.rTMTitle>strong').css({cursor:'pointer'}).click(function(e){
        //var e=e || window.event;
        $(this).parent().siblings('ul').toggle();
        if( $(this).attr('class').indexOf('icon-sanjiao-copy-copy-copy1')!=-1){
            $(this).attr('class','iconfont icon-sanjiao-copy-copy-copy')
        }else{
            $(this).attr('class','iconfont icon-sanjiao-copy-copy-copy1')
        }
        return false;
    });
    var listArr=[
        {name:'路线名称1'},
        {name:'路线名称1'}
    ];
    paddingAreaList();

    //填充左侧路线列表
    function paddingAreaList(){
        var cfg={
            token:getCookie('token'),
            url:'routeManageService/findRouteInfo',
            data:{
                deptId:getCookie('deptId')
            },
            success:function(data){
                var list=data.rows;
                if(list && list.length==0){
                    return ;
                }
                var $div=$('.rTMList>div');
                var str='';
                for(var i=0;i<list.length;i++){
                    var l=list[i];
                    str+='<li data-id="'+l.id+'"> <input type="checkbox"><div class="iconfont icon-xuanzhong"></div> <span>'+l.routeName+'</span></li>'
                }
                $('.rTMTitle em').html('('+list.length+')');
                $('.rTMLRoadLine ul.clear').html(str);
                $div.on('click','input',function(){
                    /*$(this).parent().parent().find('li>div').each(function(){
                        $(this).css({
                            backgroundColor: '#dbdbdb',
                            color: '#fff',
                            border: '1px solid #dbdbdb'
                        });
                    });*/
                    //clearOverlay('roadLine'+roadId);
                    var roadId=$(this).parent().attr('data-id');
                    if($(this).siblings('div').attr('data-status')!='true'){
                        $(this).siblings('div').css({
                            backgroundColor: '#fff',
                            color: '#009aff',
                            border: '1px solid #009aff'
                        }).attr('data-status','true');
                        var roadCfg={
                            token:getCookie('token'),
                            url:'routeManageService/findRoutOrAreaPoint',
                            data:{
                                objectId:roadId,
                                type:1
                            },
                            success:function(data){
                                data=data.data;
                                if(data.length>0){
                                    var datas = {"type": 1, "id": "roadLine"+roadId, "icon": 'che', "start": "start", "end": "end", "line": "line2"},
                                        points = [];
                                    if(data[0].lat=='' ||  data[0].lon==''){
                                        layer.msg('无路线经纬度信息..',{time:2000});
                                        return ;
                                    }
                                    for (var i in data) {
                                        points.push(data[i].lon);
                                        points.push(data[i].lat);
                                    }
                                    datas.data = points;
                                    $('.rMapList input[data-name="road"]').prop('checked',false);
                                    map.route(datas);
                                }else{
                                    layer.msg('无路线经纬度信息..',{time:2000});
                                    return ;
                                }
                            }
                        };
                        customAjax(roadCfg);
                    }else{
                        $(this).siblings('div').css({
                            backgroundColor: '#dbdbdb',
                            color: '#fff',
                            border: '1px solid #dbdbdb'
                        }).attr('data-status','false');
                        clearOverlay('roadLine'+roadId)
                    }

                });
            }
        };
        map.ready(function(){
            customAjax(cfg);
        });
    }

    function clearOverlay(name){
        map.clearById(name);
        map.clearById(name+'_startMarker');
        map.clearById(name+'_endMarker');
    }
});
