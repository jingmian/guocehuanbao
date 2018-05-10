/*{  url: , //后台地址
    maxSize: , //文件最大(M)
    inputDom: , //放置input的容器(id)
    fileDom: , //放置图片的容器(id)
    showDom: , //图片预览的容器(id)
    triggerBtn: , //文件上传的按钮
    beforeSend: function(file){//发送请求前的函数
    },
    callback: function(res){//请求成功后的回调
    },
    uploading: function(pre){//请求进行时的函数
    }
}*/
function myUpload(option){
    var fileType=['doc','docx','xls','xlsx','pdf','jpg','png','ppt','pptx'];
    var fd = new FormData(),
        xhr ,
        input,
        fileArr={};
    if (window.ActiveXObject) {
        xhr=new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        xhr= new XMLHttpRequest();
    }
    input = document.createElement('input');
    if( $('#myUploadInput').length>0 ){
        $('#myUploadInput').remove();
    }
    input.setAttribute('id', 'myUploadInput');
    input.setAttribute('type', 'file');
    input.setAttribute('name', 'file');
    document.getElementById(option.inputDom).appendChild(input);
    input.style.display = 'none';
    input.click();

    input.onchange = function(){
        //获取file对象
        var f = document.getElementById('myUploadInput').files[0];
        //获取客户端图片路径
        previewImg(f,$('#'+option.showDom));
        //值验证
        if(!input.value){return;}
        //文件后缀名验证
        var extension=input.files[0].name.slice(input.files[0].name.lastIndexOf('.')+1);
        if($.inArray(extension,fileType)==-1){
            layer.msg('该类型文件不能上传!',{time:1000});
            return ;
        }
        //文件大小验证
        if(option.maxSize &&  input.files[0].size > option.maxSize * 1024 * 1024){
            layer.msg('请上传小于'+option.maxSize+'M的文件');
            return;
        }
        if(option.beforeSend instanceof Function){
        }
        //文件名验证(不添加重复项)
        var fileName=input.files[0].name;
        if($('#'+option.fileDom+'>span').length==0){
            var _span=document.createElement('span'),
                _b=document.createElement('b');
                _em=document.createElement('em');
                _i=document.createElement('i');
            _b.innerHTML=input.files[0].name;
            _i.className="iconfont icon-shanchu11";
            _em.appendChild(_i);
            _span.appendChild(_b);
            _span.appendChild(_em);

            document.getElementById(option.fileDom).appendChild(_span);
            fileArr[input.files[0].name]=input.files[0];
            //图片预览
            $('#'+option.fileDom).on('click','b',function(){
                layer.open({
                    type:1,
                    title:false,
                    area:'600px',
                    shade:0,
                    content:$('#'+option.showDom),
                    move:$('#'+option.showDom+' .title'),
                    success:function(){

                    }
                })
            });
            //删除文件
            $('#'+option.fileDom).on('click','i.icon-shanchu11',function(e){
                $(this).parent().parent().remove();
                delete fileArr[$(this).parent().parent().text()];
            });

        }else if($('#'+option.fileDom+'>span').length<5){
           /* layer.msg('暂不支持上传多个文件!',{time:1000});*/
            var flag=false;
            $.each( $('#'+option.fileDom+'>span'),function(){
                if(fileName==$(this).text()){
                    layer.msg('该文件已经添加!',{time:1000});
                    flag=true;
                    return;
                }
            });
            if(!flag){
                 _span=document.createElement('span');
                 _em=document.createElement('em');
                 _i=document.createElement('i');
                _span.innerHTML=input.files[0].name;
                _i.className="iconfont icon-shanchu11";
                _em.appendChild(_i);
                _span.appendChild(_em);
                document.getElementById(option.fileDom).appendChild(_span);
                fileArr[input.files[0].name]=input.files[0];
                //删除文件
                $('#'+option.fileDom).on('click','i.icon-shanchu11',function(){
                    $(this).parent().parent().remove();
                    delete fileArr[$(this).parent().parent().text()];
                });
            }
        }else{
             layer.msg('最多上传五张图片',{time:1000});
        }
        if(option.triggerBtn){
            $('#'+option.triggerBtn).click(function(){
                if(fileArr.length==0){
                    return ;
                }else{
                    for(var key in fileArr){
                        fd.append('file', input.files[0]);
                        xhr.open('post', option.url,true);
                        xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
                        xhr.onreadystatechange = function(){
                            if(xhr.status == 200){
                                if(xhr.readyState == 4){
                                    if(option.callback instanceof Function){
                                        option.callback(xhr.responseText);
                                    }
                                }
                            }
                        };
                        xhr.send(fd);
                    }
                }
            })
        }else{
            if(fileArr.length==0){
                return ;
            }else{
                for(var key in fileArr){
                    fd.append('file', input.files[0]);
                    xhr.open('post', option.url,true);
                    xhr.setRequestHeader('Authorization', 'Bearer ' + getCookie('token'));  //设置消息头
                    xhr.onreadystatechange = function(){
                        if(xhr.status == 200){
                            if(xhr.readyState == 4){
                                if(option.callback instanceof Function){
                                    option.callback(xhr.responseText);
                                }
                            }
                        }else{
                            layer.msg('上传失败',{time:1000})
                        }
                    };
                    xhr.send(fd);
                }
            }
        }

    }
}
function previewImg(fileInput,imgDiv){
    if(window.FileReader){//支持FileReader的时候
        var reader=new FileReader();
        reader.readAsDataURL(fileInput);
        reader.onload=function(evt){
            //imgDiv.innerHTML="\<img src="+evt.target.result+"\>";
            imgDiv.html('');
            imgDiv.html("\<img src="+evt.target.result+"\>");
        }
    }else{//兼容ie9-
        imgDiv.html('');
        /*imgDiv.innerHTML='<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + fileInput.value + '\)\';"></div>';*/
        imgDiv.html('<div class="img" style="filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src=\'' + fileInput.value + '\)\';"></div>');
    }
}
