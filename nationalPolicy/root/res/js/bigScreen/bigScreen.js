$(function () {
    //初始化地图
    var map = new YcyaMap('myMap');
    carTypePlatform();
    carOnLineRate();
    personAttend();
    currMonthCost();
    currMonthSecurity();
    $(window).resize(function () {
        carTypePlatform();
        carOnLineRate();
        personAttend();
        currMonthCost();
        currMonthSecurity();
    })

    //平台车辆类型
    function carTypePlatform() {
        var carType = echarts.init($('#carType').get(0));
        var data = [{
            value: 20,
            name: '垃圾清运车'
        }, {
            value: 27,
            name: '压缩车'
        }, {
            value: 15,
            name: '摇摆车'
        }, {
            value: 5,
            name: '医废车'
        }, {
            value: 10,
            name: '电动保洁车'
        }];
        option = {
            title: {
                text: '平台车辆类型',
                textStyle: {
                    fontSize: 16,
                    fontWeight: '400'
                }
            },
            backgroundColor: 'rgba(255,255,255,0)',
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: '50%',
                y: '15%',
                itemWidth: 10,
                itemHeight: 10,
                icon: 'circle',
                align: 'left',
                data: ['垃圾清运车', '压缩车', '摇摆车', '医废车', '电动保洁车'],
                formatter: function (name) {
                    var oa = option.series[0].data;
                    var num = 0;
                    for (var m = 0; m < oa.length; m++) {
                        num += oa[m].value;
                    }
                    for (var i = 0; i < option.series[0].data.length; i++) {
                        if (name == oa[i].name) {
                            return name + '\r\r\r' + oa[i].value;
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                color: ['#15d635', '#BE6CD6', '#D67535', '#FFCC67', '#3772D6', '#1F98D6'],
                selectedOffset: 3,
                radius: ['50%', "68%"],
                center: ['20%', '55%'],
                x: '0%',
                left: '0px',
                label: {
                    normal: {
                        show: false,
                    }
                },
                data: data
            }]
        };
        carType.setOption(option);
        return carType;
    }

    //车辆在线率
    function carOnLineRate() {
        var carOnLine = echarts.init($('#carOnLine').get(0));
        var data = [{
            value: 20,
            name: '空闲'
        }, {
            value: 27,
            name: '其他'
        }];
        option = {
            title: {
                text: '60/75',
                textStyle: {
                    fontSize: 12,
                    fontWeight: '400',
                    color:'#333'
                }
            },
            backgroundColor: 'rgba(255,255,255,0)',
            legend: {
                orient: 'horizontal',
                x: '0%',
                bottom: '5%',
                itemWidth: 0,
                itemHeight: 0,
                data: ['空闲', '其他'],
            },
            series: [{
                type: 'liquidFill',
                outline: {
                    show: false
                },
                color: ['#1F98D6'],
                selectedOffset: 3,
                radius: '56%',
                waveLength: '85%',
                amplitude: 8,
                label: {
                    normal: {
                        position: ['50%','30%'],
                        textStyle:{
                            fontSize:16,
                            align:'center',
                            color:'1F98D6'
                        }
                    },
                },
                data: [0.85]
            }]
        };
        carOnLine.setOption(option);
        return carOnLine;
    }

    //人员出勤情况
    function personAttend() {
        var personAtte = echarts.init($('#personAtte').get(0));
        var data = [{
            value: 20,
            name: '空闲'
        }, {
            value: 27,
            name: '其他'
        }];
        option = {
            title: {
                text: '180/395',
                textStyle: {
                    fontSize: 12,
                    fontWeight: '400'
                }
            },
            backgroundColor: 'rgba(255,255,255,0)',
            legend: {
                orient: 'horizontal',
                x: '0%',
                bottom: '5%',
                itemWidth: 0,
                itemHeight: 0,
                data: ['空闲', '其他'],
            },
            series: [{
                type: 'liquidFill',
                outline: {
                    show: false
                },
                radius: '56%',
                waveLength: '46%',
                amplitude: 8,
                label: {
                    normal: {
                        show: false,
                        position: ['50%','30%'],
                        textStyle:{
                            fontSize:16,
                            align:'center',
                            color:'gold'
                        }
                    }
                },
                color: ['gold'],
                data: [0.46],
            }]
        };
        personAtte.setOption(option);
        return personAtte;
    }

    //当月成本分析
    function currMonthCost() {
        var currMCost = echarts.init($('#currMCost').get(0));
        var data = [{
            value: 20,
            name: '过路费'
        }, {
            value: 27,
            name: '保养费'
        }, {
            value: 15,
            name: '维修费'
        }, {
            value: 5,
            name: '邮费'
        }, {
            value: 10,
            name: '其他费用'
        }];
        option = {
            title: {
                text: '当月成本分析',
                textStyle: {
                    fontSize: 16,
                    fontWeight: '400'
                }
            },
            backgroundColor: 'rgba(255,255,255,0)',
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                y: '62%',
                itemWidth: 10,
                itemHeight: 10,
                icon: 'circle',
                align: 'left',
                data: ['过路费', '保养费', '维修费', '邮费', '其他费用'],
                formatter: function (name) {
                    var oa = option.series[0].data;
                    var num = 0;
                    for (var m = 0; m < oa.length; m++) {
                        num += oa[m].value;
                    }
                    for (var i = 0; i < option.series[0].data.length; i++) {
                        if (name == oa[i].name) {
                            return name + '\r\r\r' + oa[i].value;
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                color: ['#15d635', '#BE6CD6', '#D67535', '#FFCC67', '#3772D6', '#1F98D6'],
                selectedOffset: 3,
                radius: ['35%', "50%"],
                center: ['50%', '35%'],
                label: {
                    normal: {
                        show: false,
                    }
                },
                data: data
            }]
        };
        currMCost.setOption(option);
        return currMCost;
    }

    //当月安全分析
    function currMonthSecurity() {
        var currMSecurity = echarts.init($('#currMSecurity').get(0));
        var data = [{
            value: 27,
            name: '超速'
        }, {
            value: 15,
            name: '超速停留'
        }, {
            value: 5,
            name: '漏油'
        }, {
            value: 10,
            name: '离开作业区'
        }, {
            value: 10,
            name: '其他事件'
        }];
        option = {
            title: {
                text: '当月安全分析',
                textStyle: {
                    fontSize: 16,
                    fontWeight: '400'
                }
            },
            backgroundColor: 'rgba(255,255,255,0)',
            tooltip: {
                trigger: 'item',
                formatter: "{b}: {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                y: '62%',
                itemWidth: 10,
                itemHeight: 10,
                icon: 'circle',
                align: 'left',
                data: ['超速', '超速停留', '漏油', '离开作业区', '其他事件'],
                formatter: function (name) {
                    var oa = option.series[0].data;
                    var num = 0;
                    for (var m = 0; m < oa.length; m++) {
                        num += oa[m].value;
                    }
                    for (var i = 0; i < option.series[0].data.length; i++) {
                        if (name == oa[i].name) {
                            return name + '\r\r\r' + oa[i].value;
                        }
                    }
                }
            },
            series: [{
                type: 'pie',
                color: ['#D67535', '#1F98D6', 'gold', '#D61B0E', '#BE6CD6', '#1F98D6'],
                selectedOffset: 3,
                radius: ['35%', "50%"],
                center: ['50%', '35%'],
                label: {
                    normal: {
                        show: false,
                    }
                },
                data: data
            }]
        };
        currMSecurity.setOption(option);
        return currMSecurity;
    }
})
