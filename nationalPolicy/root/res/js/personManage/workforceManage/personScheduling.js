$(function () {
    var shiftManageOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:"package.json",  //请求地址
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
            {field:'name',title:'班次',width:100,formatter:function(value,row,index){
                return '<a data-href=" '+row.name+' " class="show-detail">'+value+'</a>'
            }},
            {field:'gz',title:'人员',width:100,align:'center'},
            {field:'mz',title:'休假规则',width:100,align:'center'},
            {field:'sex',title:'倒班频率',width:50,align:'center'}
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
                layer.open({
                    type:1,
                    title:false,
                    area:"644px",
                    shadeClose:false,
                    closeBtn:1,
                    content:$("#addNew"),
                    move:$('#addNew .title'),

                })
            }
        },{
            text:'删除',
            id: "btnDelete",
            handler:function() {
                layer.open({
                    type:1,
                    title:false,
                    area:"644px",
                    shadeClose:false,
                    closeBtn:1,
                    content:$("#delete"),
                    move:$('#delete .title'),

                })
            }
        },{
            text: '修改',
            id: "btnApudate",
            handler: function () {
                layer.open({
                    type:1,
                    title:false,
                    area:"644px",
                    shadeClose:false,
                    closeBtn:1,
                    content:$("#update"),
                    move:$('#update .title'),

                })
            }
        },{
            text: '',
            id: "btnStatistList",
            handler: function () {
                layer.open({
                    type:1,
                    title:false,
                    area:"1000px",
                    shadeClose:false,
                    closeBtn:1,
                    content:$("#statistList"),
                    move:$('#statistList .title'),

                })
            }
        }
        ],
        onLoadError:function(){
            console.log(1)
        },
        onLoadSuccess:function(row,index){
            $('.dgrid .show-detail').click(function(){
                var orderId=$(this).attr('data-href');
                setTimeout(function(){
                    $('#btnStatistList').trigger('click');
                },100);
            })
        }
    };
    datagridFn(shiftManageOpt);
    //全选按钮
    $(".pagination-btn").prepend("<span class='selectAll'>全选</span>");
    //上班时间
    //新增
    var $rowLen=1;//默认显示行数
    $(".btnTAdd").click(function () {
        $rowLen++;
        var $contDiv=$(".sTCont1").html();
        var $contDiv1="<div class='sTCont sTCont1'>"+$contDiv+"</div>";
        $(".wSTime").append($contDiv1);

    });
    //获取所有输入框
    function getInput(ipt) {
        var $addNew=$('#addNew');
        var $li=$addNew.find('li');
        var $input=$li.find('input');
        for(var i=0,l=$input.length;i<l;i++){
            var val=$($input[i]).val();
            var cls=$($input[i]).attr('class');
            inputObj[cls]=val;
        }
        return $('.'+ipt);
    }
})
