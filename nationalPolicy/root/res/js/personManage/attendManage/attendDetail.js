$(function () {
    /*测试数据*/
    var testJson=[
            {"groupName":"班组1","groupId":"123456","date":"201712",
                "persons":[
                    {"personName":"pn0","personId":"","2":[
                            {"teamName":"早班","status":1},
                            {"teamName":"午班","status":2},
                            {"teamName":"晚班","status":3}
                        ],"3":[
                            {"teamName":"早班","status":1},
                            {"teamName":"午班","status":2},
                            {"teamName":"晚班","status":3}
                        ]
                    },
                    {"personName":"pn1","personId":"","22":[
                            {"teamName":"早班","status":1},
                            {"teamName":"午班","status":2},
                            {"teamName":"晚班","status":3}
                        ]
                    },
                    {"personName":"pn2","personId":"","23":[
                            {"teamName":"早班","status":1},
                            {"teamName":"晚班","status":2}
                        ]
                    }
                ]
            },
            {"groupName":"班组2","groupId":"654321","date":"201712",
                "persons":[
                    {"personName":"pn0","personId":"","1":[
                            {"teamName":"早班","status":1},
                            {"teamName":"午班","status":2},
                            {"teamName":"晚班","status":3}
                        ]
                    },
                    {"personName":"pn1","personId":"","3":[
                            {"teamName":"早班","status":1},
                            {"teamName":"午班","status":2},
                            {"teamName":"晚班","status":3}
                        ]
                    },
                    {"personName":"pn2","personId":"","5":[
                            {"teamName":"早班","status":1},
                            {"teamName":"晚班","status":2}
                        ]
                    }
                ]
            }
        ];
    var monthHasDays,
        monthHasDaysArr=[];
    init();
    function init(){
        monthHasDays=time.getMonthHasDays();
        addLi(monthHasDays);
       // paddingInfo(testJson);
    }
    function addLi(num){
        if(!num){
            alert('请传入天数');
            return ;
        }
        var testStr='';
        for(var i=1;i<=num;i++){
            if(i==num){
                testStr+='<li class="border-right">'+i+'</li>';
            }else{
                testStr+='<li>'+i+'</li>';
            }

            monthHasDaysArr.push(i);
        }
        $('.caption ul').css({
            'width':120+81+121*(num+1)-50+'px'
        }).append(testStr);
    }
    function paddingInfo(json){
        var str='';
        for(var i=0;i<json.length;i++){
                var group=json[i],
                    personArr=group.persons,
                    groupHeight=29*(personArr.length)+(personArr.length-1)+'px';
                str+='<li class="group-name" group-id="'+group.groupId+'" style="height:'+groupHeight+';line-height:'+groupHeight+';">'+group.groupName+'</li>';
                if(personArr.length==0){
                    str+='<li class="person-name" person-id="" title=""></li>';
                    str += renderRow(monthHasDays,detail)
                }else{
                    for(var j=0;j<personArr.length;j++){
                        var detail=group.persons[j];
                        str+='<li class="person-name" person-id="'+detail.personId+'" title="'+detail.personName+'">'+detail.personName+'</li>';
                        str += renderRow(monthHasDays,detail);
                    }
                }
        }
        $('.detail-body ul').append(str);
        $('.detail-body').css({
            'width':120+81+121*(monthHasDays+1)-50+'px'
        });
    }
    function renderRow(monthDays,oneData){
        var newStr='';
        for(var k=1;k<=monthDays;k++){
            if(oneData[k+""]){
                var statusStr='';
                var peopleData = oneData[k+""];
                for(var p=0;p<peopleData.length;p++){
                    var spanWidth=1/peopleData.length*100+'%';
                    var  pData=peopleData[p];
                    /!* 0-出勤，1-缺勤，2-请假，3-迟到，4-早退，5-补录，6-签退*!/
                    if(pData.status==0 || pData.status==6){//出勤
                        statusStr+='<span class="green" style="width:'+spanWidth+';">'+pData.teamName+'</span>';
                    }else if(pData.status==1){//缺勤
                        statusStr+='<span class="red" style="width:'+spanWidth+';">'+pData.teamName+'</span>';
                    }else if(pData.status==3){//迟到
                        statusStr+='<span class="yellow" style="width:'+spanWidth+';">'+pData.teamName+'</span>';
                    }else if(pData.status==4){//早退
                        statusStr+='<span class="blue" style="width:'+spanWidth+';">'+pData.teamName+'</span>';
                    }
                }
                if(k==monthDays){
                    newStr+='<li class="border-right">'+statusStr+'</li>';
                }else{
                    newStr+='<li>'+statusStr+'</li>';
                }
            }else{
                if(k==monthDays){
                    newStr+='<li class="border-right">-</li>';
                }else{
                    newStr+='<li>-</li>';
                }

            }
        }
        return newStr;
    }

    var formData={};
    var perObj={
        personName:'',
        startTime:'',
        endTime:'',
        deptId:userDeptId,
        workTimeIds:'',
        type:1
    };
    var idsArr=[],namesArr=[];
    //获取当前月
    var date = new Date();
    var year=date.getFullYear();
    var month=date.getMonth()+1;
    for(var i=1;i<13;i++){
        if(month<10){
            month='0'+month;
        }else{
            month=month;
        }
    }
    $('#time1').val(year+'-'+month);
    var $dateFmt="yyyy-MM";
    $('#time1').focus(function () {
        WdatePicker({el: 'time1',dateFmt:$dateFmt});
        var arr=$(this).val().split('-');
        year=arr[0];
        month=arr[1];
        findRealAttend();
    });
    var dgData=[];
    var cyc=6;
    //查询出勤
    findRealAttend();
    function findRealAttend() {
        perObj['recordTime']=$('#time1').val();
        formData.deptId = perObj['deptId'];
        formData.type = perObj['type'];
        formData.recordTime = perObj['recordTime'];
        var cfg = {
            token: getCookie("token"),
            url: 'person/findRealAttend',
            data: formData,
            success: function (data) {
                 paddingInfo(data.data);
            }
        };
        customAjax(cfg);
    }
    //窗口大小改变
    $(window).resize(function () {
        colunmWAuto(cyc,2);
    });
    // colunmWAuto(cyc,2);
});
