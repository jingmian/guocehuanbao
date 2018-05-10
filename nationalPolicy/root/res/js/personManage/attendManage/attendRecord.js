$(function () {
    var loadFlag=true;
    //年月
    var year='',month='',num=0;//对应月份天数
    num=31;
    //获取当前月
    currMonth();
    function currMonth() {
        var date = new Date();
        year=date.getFullYear();
        month=date.getMonth()+1;
        month<10?month='0'+month:month;
        return year+'-'+month;
    }
    var dgData = [];//表格数据
    var applyListOpt = {
        $Dom: $('#dgrid'),   //数据表格容器
        url:requestUrl+'person/findRealAttend',  //请求地址
        //请求传递的参数
        queryParams: {
            recordTime:year+'-'+month,
            gridType: 'easyui',
            recordStatus: 10,
            personName:'',
            deptId:userDeptId,
            type:2
        },
        pageSize:20,
        loadMsg:'请稍等....',
        //数据表格的显示字段
        columns:[[
            {field:'ck',checkbox:true},
            {field:'personName',title:'姓名',width:100},
            {field:'1',title:'01',width:60,align:'left',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'2',title:'02',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'3',title:'03',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'4',title:'04',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'5',title:'05',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'6',title:'06',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'7',title:'07',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'8',title:'08',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'9',title:'09',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'10',title:'10',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'11',title:'11',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'12',title:'12',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'13',title:'13',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'14',title:'14',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'15',title:'15',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'16',title:'16',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'17',title:'17',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'18',title:'18',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'19',title:'19',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'20',title:'20',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'21',title:'21',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'22',title:'22',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'23',title:'23',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'24',title:'24',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'25',title:'25',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'26',title:'26',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'27',title:'27',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'28',title:'28',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'29',title:'29',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'30',title:'30',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'31',title:'31',width:60,align:'center',formatter:function(value,row,index){
                return stateField(value,row,index);
            }},
            {field:'yingdao',title:'应到',width:100,align:'center'},
            {field:'shidao',title:'实到',width:100,align:'center'},
            {field:'detail',title:'备注',width:200,align:'center'}
        ]],
        singleSelect:false,
        collapsible:true,
        SelectOnCheck:true,
        CheckOnSelect:true,
        selectAll:"none",
        onClickRow: function (index, row) {
            perObj['personId'] = row.personId;
            perObj['personName'] = row.personName;
            perObj['personPhone'] = row.personPhone;
            perObj['personType'] = row.personType;
            perObj['personAddress'] = row.personAddress;
            perObj['personSex'] = row.personSex;
            perObj['minzuId'] = row.minzuId;
            perObj['joinTime'] = row.joinTime;
            perObj['register'] = row.register;
            perObj['idCardNum'] = row.idCardNum;
            // getSelections($('#dgrid'),'personId','personName',idsArr,namesArr);
            getSelections();
        },
        onLoadError:function(){
            console.log(1)
        },
        onBeforeLoad:function(){
            loadFlag=true;
        },
        onLoadSuccess:function(value,row,index){

        }
    };


    datagridFn(applyListOpt);

    //年份选择
    $('#attendYear').change(function () {
        year=$(this).val();
        //判断是否是闰年
        isLeapYear (year);
        //判断月份天数（除了2月）
        monthNum(month);
        findRealAttend();
    } )
    //月份选择
    $(".attendMonth").find("li").eq((month-1)).addClass("aMActive")
    $(".attendMonth").find("li").click(function () {
        $(this).addClass("aMActive").siblings().removeClass("aMActive");
        month=$(this).find('span').text();
        //判断是否是闰年
        isLeapYear (year);
        //判断月份天数（除了2月）
        monthNum(month);
        findRealAttend();
        findPersonCount();
    });

    function isLeapYear (year) {
        if (((year % 4)==0) && ((year % 100)!=0) || ((year % 400)==0)) {
            if(month=='02'){
                num=29;
            }
        } else {
            if(month=='02'){
                num=28;
            }
        }
    }
    function monthNum(month) {
        if(month=='01'||month=='03'||month=='05'||month=='07'||month=='08'||month=='10'||month=='12'){
            num=31;
        }
        if(month=='04'||month=='06'||month=='09'||month=='11'){
            num=30;
        }
    }
    var formData = {};//请求数据
    var perObj={
        deptId:userDeptId,
        type:2,
        record_time:''
    };
    var idsArr=[],namesArr=[];
    perObj['record_time']=year+'-'+month;
    //查询出勤记录
    // findRealAttend();
    function findRealAttend() {
        perObj['record_time']=year+'-'+month;
        applyListOpt.queryParams['recordTime']=perObj['record_time'];
        $('#dgrid').datagrid('load');
    }
    //点击查询图标
    $('.search-btn').click(function () {
        perObj['personName']=$('#personName').val();
        applyListOpt.queryParams['personName']=perObj['personName'];
        findRealAttend();
        findPersonCount();
    })
    //取得所有选中行数据
    function getSelections() {
        idsArr=[];
        namesArr=[];
        var rows = $('#dgrid').datagrid('getSelections');
        for(var i=0; i<rows.length; i++){
            idsArr.push(rows[i].personId);
            namesArr.push(rows[i].personName)
        }
    }
    forColum();
    //循环数据表格列
    function forColum() {
        // $("#dgrid").datagrid(columnObj);
        $('.datagrid-pager table').find('td:nth-last-child(1)').hide();
        //全选按钮
        $(".datagrid-pager").prepend("<span class='selectAll' style='margin-left: 25px;line-height: 35px;'>全选</span><a href='javascript:;' id='btnExport'>导出</a>");
        //导出数据
        exportData();
    }
    //导出
    function exportData() {
        $('#btnExport').click(function () {
            var index=layer.open(publicObj({
                kind:'layer',
                area:'500px',
                content:$('#export'),
                move:$('#export .title')
            }));
            $('#export .no').click(function(){
                layer.close(index)
            });

            $('#export .yes').off('click');
            $('#export .yes').click(function(){
                var name=$('#excelFileName').val();
                var d=time.getCurTime();
                if(name==''){
                    lx.export({
                        // url:'order/orderExport',
                        data:{
                            recordStatus:10
                        },
                        success:lx.exportCallback
                    })
                }else{
                    name=name+' '+d+'.xlsx';
                    lx.export({
                        // url:'order/orderExport',
                        data:{
                            recordStatus:10
                        },
                        success:lx.exportCallback
                    },name)
                }
            });
        })
    }
    //循环遍历
    findPersonCount();
    function findPersonCount() {
        formData={};
        formData.type=0;
        formData.nowTime=perObj['record_time'];
        formData.deptId=perObj['deptId'];
        var cfg = {
            token: getCookie("toekn"),
            url: 'count/findPersonCount',
            data: formData,
            success: function (data) {
                data = $.parseJSON(data);
                if (data.code == 0) {
                    dgData = data.data.data;
                    if (dgData.length > 0) {
                        $("#dgrid").datagrid('loadData', dgData);
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
    //判断不同的出勤状态
    function stateField(value,index,row) {
        switch (value){
            case '0':
                value='出勤';
                return '<p class="iconfont icon-check"></p>';
            case '1':
                value='缺勤';
                return '<p class="iconfont icon-jian" style="color:red"></p>'
            case '2':
                value='假';
                return value;
            case '3':
                value='迟';
                return value;
            case '4':
                value='早';
                return value;
            case '5':
                value='补录';
                return value;
        }
    }
})
