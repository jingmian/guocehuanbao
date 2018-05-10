$(function(){
	//检查浏览器版本
	var browserFlag=false;
	var browser = navigator.appName
	var b_version = navigator.appVersion
	var version = b_version.split(";");
	var trim_Version = version[1].replace(/[ ]/g, "");
	if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
		browserFlag=true;
	}else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE10.0") {
		browserFlag=true;
	}else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE11.0") {
		browserFlag=true;
	}
	else if (browser == "Netscape" && trim_Version == "WOW64") {
		browserFlag=true;
	}
	
	
	if(!browserFlag){
		$('#videoBox').hide();
		$('#videoBox1').show();
	}else{
        $('#videoBox').show();
        $('#videoBox1').hide();
    }

    $('.rTMLRoadLine>ul').css({
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
    findCar();
    //填充左侧区域列表
    //查询车辆信息
    function findCar() {
        var formData1={};
        formData1.ids=userDeptId;
        formData1.pageSize=1000;
        formData1.isVideo=1;
        var $carNum=$('#carBox');
        var $total=$('#total');
        var arr=[];
        var cfg = {
            token: getCookie("toekn"),
            url: 'car/findCar',
            data: formData1,
            success: function (data) {
                var result=data.data.data;
                var total=data.data.total;
                if(result.length>0){
                    for(var i=0;i<result.length;i++){
                        var res=result[i];
                        var $li='<li><input data-id="'+res.equipmentNum+'" id="'+res.carId+'" type="checkbox" onchange="checkboxChange(this.id)"><div class="iconfont icon-xuanzhong"></div> <span>'+res.carNum+'</span></li>'
                        arr.push($li);
                    }
                    $carNum.html(arr.join(''));
                }
                $total.text('('+total+')');
            }
        };
        customAjax(cfg);
    }


});


var videoInitObj = {};
videoInitObj.ip = "119.27.165.94";
videoInitObj.num = null;
var select_checkbox=null;//保存当前选中
function checkboxChange(id){
	var dom=$('#'+id);
	if (dom.attr('checked')) {
   		if(select_checkbox!=null){
   			select_checkbox.attr("checked",false);
   		}
   		select_checkbox=dom;
   		var eNum=dom.attr("data-id");
   		if(eNum==null||eNum==""){
   			alert("设备id有误！");
   			return;
   		}
   		videoInitObj.num=eNum;
   		//初始化视频
   		document.getElementById("videoIframe").contentWindow.videoInit();
	}else{
		videoInitObj.num = null;
		select_checkbox=null;
		//关闭视频
		document.getElementById("videoIframe").contentWindow.closevideo();
	}
}
