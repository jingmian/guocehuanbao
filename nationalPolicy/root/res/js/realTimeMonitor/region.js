$(function(){
    $('.rTMLRoadLine>ul').css({
        maxHeight:($('.rTMLBox').height()-5)/2 +'px',
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
    paddingAreaList();
    //填充左侧区域列表
    function paddingAreaList(){
    	var formData={};
    	formData.dept=getCookie("deptId");
        formData.areaName="";
        var cfg={
            token:getCookie('token'),
            url:'areaManage/findAreaInfo',
            data: formData,
            success:function(data){
                var list=data.rows;
                if(list.length==0){
                    return ;
                }
                var $div=$('.rTMList>div');
                var circleStr='',
                    rectangleStr='',
                    otherStr='',
                    c=0,
                    o=0;
                    r=0;
                for(var i=0;i<list.length;i++){
                    var l=list[i];
                    if(l.areaName!=''){
                        if(l.areaType==0){//圆形区域
                            circleStr+='<li data-id="'+l.id+'"><input type="checkbox"><div class="iconfont icon-xuanzhong"></div> <span>'+l.areaName+'</span></li>';
                            c++;
                        }else if(l.areaType==1){//矩形区域
                            rectangleStr+='<li data-id="'+l.id+'"> <input type="checkbox"><div class="iconfont icon-xuanzhong"></div> <span>'+l.areaName+'</span></li>';
                            r++;
                        }else {
                            //自定义区域
                            otherStr+='<li data-id="'+l.id+'"> <input type="checkbox"><div class="iconfont icon-xuanzhong"></div> <span>'+l.areaName+'</span></li>';
                            o++;
                        }
                    }
                }
                $('.rTMList .rTMTitle').find('em').each(function(ind){
                    if(ind==0){
                        $(this).html('('+c+')');
                    }else if(ind == 1){
                        $(this).html('('+r+')');
                    }else{
                        $(this).html('('+o+')');
                    }
                });
                $('.rTMLRoadLine ul.clear').each(function(ind){
                    if(ind==0){
                        $(this).html(circleStr);
                    }else if(ind==1){
                        $(this).html(rectangleStr);
                    }else{
                        $(this).html(otherStr);
                    }
                });
                $div.on('click','input',function(){
                   /* $(this).parent().parent().find('li>div').each(function(){
                        $(this).css({
                            backgroundColor: '#dbdbdb',
                            color: '#fff',
                            border: '1px solid #dbdbdb'
                        });
                    });
                    clearOverlay('rail_id');*/
					var railId=$(this).parent().attr('data-id');
                    if($(this).siblings('div').attr('data-status')!='true'){
                        $(this).siblings('div').css({
                            backgroundColor: '#fff',
                            color: '#009aff',
                            border: '1px solid #009aff'
                        }).attr('data-status','true');
                        var areaCfg={
                            token:getCookie('token'),
                            url:'areaManage/findAreaInfoById',
                            data:{
                                id:railId
                            },
                            success:function(data){
                                data=data.geoms;
                                if(data.length>0){
                                    $('.rMapList input[data-name="area"]').prop('checked',false);
                                    drawRail(data,"rail_id"+railId);
                                }else{
                                    layer.msg('无区域经纬度信息..',{time:2000});
                                    return ;
                                }
                            }
                        };
                        customAjax(areaCfg);
                    }else{
                        $(this).siblings('div').css({
                            backgroundColor: '#dbdbdb',
                            color: '#fff',
                            border: '1px solid #dbdbdb'
                        }).attr('data-status','false');

                        clearOverlay("rail_id"+railId);

                    }

                });
            }
        };
        map.ready(function(){
            customAjax(cfg);
        });
    }
    function drawRail(arr,railName){
        var points=[];
        $.each(arr,function(ind,val){
            points.push(map.createPoint(this.area_lon,this.area_lat))
        });
        map.createOverlay(points,"line2",railName);
    }
    function clearOverlay(name){
        map.clearById(name);
    }
});
