//(function($,pValue){
    var currentValue;
	function scrollBar(opt){
		var scrollBarObj=new _scrollBar(opt);
		var c=scrollBarObj.config;
		scrollBarObj.init(c);
		return scrollBarObj;

        function _scrollBar(opt){
            this.config={
                value: 0,     //初始值
                maxValue: 10, //最大值
                step: 1,
                currentX: 0
            };
            $.extend(this.config, opt);

            _scrollBar.prototype.init= function(arg){
                if (arg.value > arg.maxValue) {
                    alert("初始值大于最大值");
                    return;
                }
                this.getValue(arg);
                $(".scroll_Track").css("width", (arg.value / arg.maxValue) * $('.scrollBar').width() + 2 + "px");
                $(".scroll_Thumb").css("margin-left", (arg.value / arg.maxValue) * $('.scrollBar').width() + "px");
                this.value(arg);
                this.clickBar(arg);
                $("#scrollBarTxt").html(arg.value + "/" + arg.maxValue);
            };
            _scrollBar.prototype.value=function(arg){
                var valite = false;
                var thumbWidth=$('.scroll_Thumb').width(),
                    left=$('.scroll_Track').offset().left;
                $(".scroll_Thumb").mousedown(function() {
                    valite = true;
                    $(document.body).mousemove(function(event) {
                        if (valite == false) return;
                        var changeX = event.clientX - arg.currentX-left;
                        currentValue = changeX - arg.currentX-thumbWidth;
                        $(".scroll_Thumb").css("margin-left", currentValue + "px");
                        $(".scroll_Track").css("width", currentValue + "px");
                        if ((currentValue + thumbWidth) >= $(".scrollBar").width()) {
                            $(".scroll_Thumb").css("margin-left", $(".scrollBar").width() - thumbWidth + "px");
                            $(".scroll_Track").css("width", $(".scrollBar").width()  + "px");
                            arg.value = arg.maxValue;
                        } else if (currentValue <= 8) {
                            $(".scroll_Thumb").css("margin-left", "0px");
                            $(".scroll_Track").css("width", "0px");
                        } else {
                            arg.value = Math.round(arg.maxValue * (currentValue / $(".scrollBar").width()))-1;
                        }
                        $("#scrollBarTxt").html(arg.value + "/" + arg.maxValue);
                    });

                });

                $(document.body).mouseup(function() {
                    if(currentValue){
                        arg.value = Math.round(arg.maxValue * (currentValue / $(".scrollBar").width()))+5;
                    }
                    valite = false;
                    if (arg.value >= arg.maxValue) arg.value = arg.maxValue;
                    if (arg.value <= 0) arg.value = 0;
                    $("#scrollBarTxt").html(arg.value + "/" + arg.maxValue);
                });
            };
            _scrollBar.prototype.getValue=function(arg){
                this.currentX = $(".scrollBar").width() * (arg.value / arg.maxValue);
            };
            _scrollBar.prototype.clickBar=function(arg,timer){
                var thumbWidth=$('.scroll_Thumb').width(),
                    left=$('.scroll_Track').offset().left;
                $('.scrollBar').click(function(event){
                    currentValue=event.clientX-arg.currentX-left-arg.currentX-thumbWidth;
                    var realDis=event.clientX-$('.scrollBar').offset().left,
                        d=Math.round( realDis / $('.scrollBar').width() * arg.maxValue );
                    if(  d<1){
                        $(".scroll_Thumb").css("margin-left", 0);
                        $(".scroll_Track").css("width", 0);
                        $("#scrollBarTxt").html( "0 /" + arg.maxValue);
                    }else{
                        $(".scroll_Thumb").css("margin-left", realDis);
                        $(".scroll_Track").css("width", realDis + 2 + "px");
                        $("#scrollBarTxt").html(d + "/" + arg.maxValue);
                    }

                })
            };
            _scrollBar.prototype.setValue=function(index,dataLength,value){
                $(".scroll_Thumb").css("margin-left", index / dataLength * $('.scrollBar').width() +'px');
                $(".scroll_Track").css("width", index / dataLength * $('.scrollBar').width() +'px');
            }
        }
	}

//    $.fn.scrollBar=scrollBar; //使用jQuery继承progress方法
//})(jQuery,window.progressValue);