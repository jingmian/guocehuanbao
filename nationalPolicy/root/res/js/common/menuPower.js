//根据权限状态码显示导航
function menuPower($dom1,$dom2,powerCode) {
    //顶部导航显示与移除
    var $li='';//存放顶部li元素
    var $div='';//存放左侧div元素
    var navArrTop=[//存放顶部导航
        {code:'0','data-code':'1',iconClass:'iconfont icon-shouye',text:'首页'},
        {code:'1','data-code':'2',iconClass:'iconfont icon-jiankong1',text:'实时监控'},
        {code:'2','data-code':'11',iconClass:'iconfont icon-jiankong',text:'监控管理'},
        {code:'3','data-code':'41',iconClass:'iconfont icon-yonghu11',text:'人员管理'},
        {code:'4','data-code':'81',iconClass:'iconfont icon-cheliang',text:'车辆管理'},
        {code:'5','data-code':'188',iconClass:'iconfont icon-tongji',text:'统计分析'},
        {code:'6','data-code':'137',iconClass:'iconfont icon-qita1',text:'系统设置'},
        {code:'7','data-code':'',iconClass:'iconfont icon-liebiao01',text:'管理员'}
    ];
    var navLeftArr=[//存放左侧导航
        {iconClass:'nav-box nav-box1'},
        {iconClass:'nav-box nav-box2'},
        {iconClass:'nav-box nav-box3'},
        {iconClass:'nav-box nav-box4'},
        {iconClass:'nav-box nav-box5'},
        {iconClass:'nav-box nav-box6'},
        {iconClass:'nav-box nav-box7'}
    ];
    for(var key in navArrTop){
        var navKey=navArrTop[key];
        var code=navKey['code'];
        var dataCode=navKey['data-code'];
        var iconClass=navKey['iconClass'];
        var iconClass1='';
        if(key!='7'){
            iconClass1=navLeftArr[key]['iconClass'];
        }
        var text=navKey['text'];
        var state=ycya.util.checkPrivilege(powerCode,dataCode);//调用验证权限的方法
        if(state){
            if(code=='6'){
                $li+='<li code="'+code+'" data-code="'+dataCode+'" class="intercalate"><a href="javascript:void(0)"><i class="'+iconClass+'"></i>'+text+'</a></li>';
                $div+='<div class="'+iconClass1+'" code="'+code+'"></div>';
            }else if(code=='7'){
                var str='<div class="sysUserBox"><p><i></i><span>消息</span></p><p class="updatePass"><i></i><span>修改密码</span></p><p class="login-out"><i></i><span>退出登录</span></p></div>';
                $li+='<li code="'+code+'" data-code="'+dataCode+'" class="sysUser"><a href="javascript:void(0)"><i class="'+iconClass+'"></i>'+text+'</a>'+str+'</li>';
            }else{
                $li+='<li code="'+code+'" data-code="'+dataCode+'"><a href="javascript:void(0)"><i class="'+iconClass+'"></i>'+text+'</a></li>';
                $div+='<div class="'+iconClass1+'" code="'+code+'"></div>';
            }
        }

    }
    $dom1.append($li);
    $dom2.append($div);
}
//根据权限码显示菜单(easyui表格中的菜单)
function menuPower1(code) {
    var powerCode=window.name;
    var state=ycya.util.checkPrivilege(powerCode,code);//调用验证权限的方法
    if(code==undefined||code==null){
        return false;
    }else{
        return state;
    }
}
