//通用layer弹出层（一般增、删、改、查）
function setLayerMode(dom,w,shade,f) {
    var $dom=$('#'+dom);
    var $title=$dom.find('.title,.form-top');
    var $no=$dom.find('.no');
    var $yes=$dom.find('.yes,.submit-btn');
    var index = layer.open({
        kind: 'layer',
        type: 1,
        title: false,
        offset: 'auto',
        area: w+'px',
        shade:shade,
        shadeClose:false,
        closeBtn: 1,
        content:$dom,
        move: $title
    });
    $no.click(function () {
        layer.close(index);
    });
    $yes.off('click');
    $yes.click(function () {
        if(!f){
            layer.close(index);
            return;
        }
        f();//回调函数
        layer.close(index);
    });
}
