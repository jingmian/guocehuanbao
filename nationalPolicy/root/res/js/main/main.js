$(function () {
    //未登录直接返回首页
    if (getCookie('token') == 'undefined') {
        window.location.href = "../../../login.html";
    } else {
        if(window.name==''){
            window.location.href = "../../../login.html";
        }
        //每隔25分钟获取一次token
        var mainTimer = setInterval(function () {
            $.ajax({
                type: 'POST',
                data: {
                    userName: getCookie("userName"),
                    password: getCookie("password")
                },
                url: requestUrl + 'loginManage/login',
                success: function (data) {
                    data = $.parseJSON(data);
                    if (data.code == 0) {
                        setCookie("token", data.data.token);
                    } else {
                        alert('登录失效，请重新登录 ');
                        window.location.href = "../../../login.html";
                    }
                }
            })
        }, 25 * 60 * 1000);
        $('#uName').html(getCookie("userName"));
        // var privilegeCode=$.parseJSON(window.name);
        var privilegeCode=window.name;
        var fontIconColor = '#fff';//字体图标颜色
        var optionNav={
            '0':[
                {
                    nav: '',
                    code: {
                        code: 1
                    },
                    navAttr: {
                        dataHtmlUrl: '../../../index.html'
                    }
                }
            ],//首页
            '1':[
                {
                    nav: '汇总',
                    code: {
                        code:3
                    },
                    fontIcon: 'icon-huizong1',//字体图标className
                    fontIconColor: fontIconColor,
                    //自定义属性
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/summary.html'
                    }
                },
                {
                    nav: '车辆',
                    code: {
                        code:4
                    },
                    fontIcon: 'icon-cheliang',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/car.html'
                    }
                },
                {
                    nav: '人员',
                    code: {
                        code:5
                    },
                    fontIcon: 'icon-yonghu11',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/person.html'
                    }
                },
                {
                    nav: '设施',
                    code: {
                        code: 6
                    },
                    fontIcon: 'icon-shanchu',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/facilities.html'
                    }
                },
                {
                    nav: '报警',
                    code: {
                        code:7
                    },
                    fontIcon: 'icon-louyutubiaobaojing',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/callPolice.html'
                    }
                },
                {
                    nav: '卫情',
                    code: {
                        code:8
                    },
                    fontIcon: 'icon-jiesuan',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/weiSituation.html'
                    }
                },
                {
                    nav: '区域',
                    code: {
                        code:9
                    },
                    fontIcon: 'icon-anzhiquyu',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/region.html'
                    }
                },
                {
                    nav: '路线',
                    code: {
                        code:10
                    },
                    fontIcon: 'icon-xianlu',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../realTimeMonitor/roadLine.html'
                    }
                }
            ],//实时监控
            '2':[
                {
                    nav: '报警',
                    code: {
                        code:12
                    },
                    fontIcon: 'icon-shouye',//字体图标className
                    fontIconColor: fontIconColor,
                    //自定义属性
                    navAttr: {
                        dataHtmlUrl: '../monitorManage/tellPolice/tellPoliceData.html'
                    },
                    subnav: [
                        // {
                        //     nav: '系统报警',
                        //     code: {
                        //         code: pCodeArr[0] + '1'
                        //     },
                        //     fontIcon: 'icon-shouye',
                        //     fontIconColor: fontIconColor,
                        //     navAttr: {
                        //         dataHtmlUrl: '../monitorManage/tellPolice/sysTellPolice.html'
                        //     }
                        // },
                        {
                            nav: '报警数据',
                            code: {
                                code:13
                            },
                            fontIcon: 'icon-shouye',
                            fontIconColor: fontIconColor,
                            navAttr: {
                                dataHtmlUrl: '../monitorManage/tellPolice/tellPoliceData.html'
                            }
                        }, {
                            nav: '规则绑定',
                            code: {
                                code:14
                            },
                            fontIcon: 'icon-shouye',
                            fontIconColor: fontIconColor,
                            navAttr: {
                                dataHtmlUrl: '../monitorManage/tellPolice/ruleBind.html'
                            }
                        }
                    ]
                },
                {
                    nav: '卫情',
                    code: {
                        code:19
                    },
                    fontIcon: 'icon-dingdan3',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../monitorManage/satelliteSituation/waitFeedback.html'
                    },
                    subnav: [
                        {
                            nav: '等待反馈',
                            code: {
                                code: 20
                            },
                            navAttr: {
                                dataHtmlUrl: '../monitorManage/satelliteSituation/waitFeedback.html'
                            }
                        },
                        {
                            nav: '卫情记录',
                            code: {
                                code:27
                            },
                            navAttr: {
                                dataHtmlUrl: '../monitorManage/satelliteSituation/satelliteRecord.html'
                            }
                        }
                    ]
                },
                /* {
                     nav: '提醒',
                     code: {
                         code: pCodeArr[2]
                     },
                     fontIcon: 'icon-raxicondiaodu01',
                     fontIconColor: fontIconColor,
                     navAttr: {
                         dataHtmlUrl: '../monitorManage/remind/yearRemind.html'
                     },
                     subnav:[
                         {
                             nav:'年检提醒',
                             code:{
                                 code:pCodeArr[2]+'1'
                             },
                             navAttr:{
                                 dataHtmlUrl: '../monitorManage/remind/yearRemind.html'
                             }
                         },
                         {
                             nav:'保养提醒',
                             code:{
                                 code:pCodeArr[2]+'2'
                             },
                             navAttr:{
                                 dataHtmlUrl: '../monitorManage/remind/tainRemind.html'
                             }
                         },
                         {
                             nav:'保险提醒',
                             code:{
                                 code:pCodeArr[2]+'3'
                             },
                             navAttr:{
                                 dataHtmlUrl: '../monitorManage/remind/insurRemind.html'
                             }
                         },
                         {
                             nav:'过期提醒',
                             code:{
                                 code:pCodeArr[2]+'4'
                             },
                             navAttr:{
                                 dataHtmlUrl: '../monitorManage/remind/overdueRemind.html'
                             }
                         }
                     ]
                 },*/
                {
                    nav: '路线',
                    code: {
                        code:31
                    },
                    fontIcon: 'icon-jiankong',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../monitorManage/route.html'
                    }
                },
                {
                    nav: '区域',
                    code: {
                        code: 35
                    },
                    fontIcon: 'icon-jiesuan',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../monitorManage/area.html'
                    }
                },
                {
                    nav: '视频',
                    code: {
                        code:40
                    },
                    fontIcon: 'icon-cloud-video',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../monitorManage/video.html'
                    }
                }
            ],//监控管理
            '3':[
                {
                    nav: '人员信息',
                    code: {
                        code:42
                    },
                    fontIcon: 'icon-xinxiguanli',//字体图标className
                    fontIconColor: fontIconColor,
                    //自定义属性
                    navAttr: {
                        dataHtmlUrl: '../personManage/personInfo.html'
                    }
                },
                {
                    nav: '排班管理',
                    code: {
                        code:46
                    },
                    fontIcon: 'icon-liebiao2',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../personManage/workforceManage/divideShift.html'
                    },
                    subnav: [
                        {
                            nav: '划分班组',
                            code: {
                                code: 47
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/workforceManage/divideShift.html'
                            }
                        },
                        {
                            nav: '班次管理',
                            code: {
                                code: 51
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/workforceManage/shiftManage.html'
                            }
                        },
                        {
                            nav: '排班规则',
                            code: {
                                code:55
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/workforceManage/shiftRoule.html'
                            }
                        },
                        {
                            nav: '排班信息',
                            code: {
                                code:56
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/workforceManage/schedulingInfo.html'
                            }
                        }
                    ]
                },
                {
                    nav: '考勤管理',
                    code: {
                        code: 57
                    },
                    fontIcon: 'icon-kaoqin2',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../personManage/attendManage/realTimeData.html'
                    },
                    subnav: [
                        {
                            nav: '实时数据',
                            code: {
                                code: 58
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/attendManage/realTimeData.html'
                            }
                        },
                        {
                            nav: '出勤明细',
                            code: {
                                code:59
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/attendManage/attendDetail.html'
                            }
                        },
                        {
                            nav: '出勤记录',
                            code: {
                                code:60
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/attendManage/attendRecord.html'
                            }
                        },
                        {
                            nav: '缺勤记录',
                            code: {
                                code:61
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/attendManage/absenceRecord.html'
                            }
                        },
                        {
                            nav: '请假记录',
                            code: {
                                code:62
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/attendManage/leaveRecord.html'
                            }
                        },
                        {
                            nav: '数据补录',
                            code: {
                                code: 66
                            },
                            navAttr: {
                                dataHtmlUrl: '../personManage/attendManage/dataCollection.html'
                            }
                        }
                    ]
                },
                {
                    nav: '考勤设置',
                    code: {
                        code:70
                    },
                    fontIcon: 'icon-kaoqin1',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../personManage/attendanceSetting.html'
                    }
                },
                {
                    nav: '终端管理',
                    code: {
                        code:74
                    },
                    fontIcon: 'icon-zhongduanguanli',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../personManage/termiManage.html'
                    }
                }
            ],//人员管理
            '4':[
                {
                    nav: '车辆信息',
                    code: {
                        code:82
                    },
                    fontIcon: 'icon-xinxiguanli',//字体图标className
                    fontIconColor: fontIconColor,
                    //自定义属性
                    navAttr: {
                        dataHtmlUrl: '../carManage/carInfo.html'
                    }
                },
                {
                    nav: '费用管理',
                    code: {
                        code:88
                    },
                    fontIcon: 'icon-chengben',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: "../carManage/expenseManage/costTotal.html"
                    },
                    subnav: [
                        {
                            nav: '总费用',
                            code: {
                                code:89
                            },
                            navAttr: {
                                dataHtmlUrl: "../carManage/expenseManage/costTotal.html"
                            }
                        },
                        {
                            nav: '维修费用',
                            code: {
                                code: 90
                            },
                            navAttr: {
                                dataHtmlUrl: "../carManage/expenseManage/tenanceCost.html"
                            }
                        },
                        {
                            nav: '保养费用',
                            code: {
                                code: 95
                            },
                            navAttr: {
                                dataHtmlUrl: "../carManage/expenseManage/tainCost.html"
                            }
                        },
                        {
                            nav: '保险费用',
                            code: {
                                code:100
                            },
                            navAttr: {
                                dataHtmlUrl: "../carManage/expenseManage/insuranceCost.html"
                            }
                        },
                        {
                            nav: '年检费用',
                            code: {
                                code: 105
                            },
                            navAttr: {
                                dataHtmlUrl: "../carManage/expenseManage/yearCost.html"
                            }
                        },
                        // {
                        //     nav: '安全费用',
                        //     code: {
                        //         code: pCodeArr[1] + '6'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: "../carManage/expenseManage/egalCost.html"
                        //     }
                        // },
                        {
                            nav:'油费',
                            code:{
                                code:109
                            },
                            navAttr:{
                                dataHtmlUrl:"../carManage/expenseManage/oilCost.html"
                            }
                        },
                        {
                            nav:'其他费用',
                            code:{
                                code:114
                            },
                            navAttr:{
                                dataHtmlUrl: "../carManage/expenseManage/otherCost.html"
                            }
                        },
                        {
                            nav:'提醒管理',
                            code:{
                                code:119
                            },
                            navAttr:{
                                dataHtmlUrl: "../carManage/expenseManage/remindManage.html"
                            }
                        }
                    ]
                },
                // {
                    // nav: '油量管理',
                    // code: {
                    //     code: pCodeArr[2]
                    // },
                    // fontIcon: 'icon-shui',
                    // fontIconColor: fontIconColor,
                    // navAttr: {
                    //     dataHtmlUrl: "../carManage/oilConsManage/oilQuantityAbnormal.html"
                    // },
                    // subnav: [
                        // {
                        //     nav: '油耗数据',
                        //     code: {
                        //         code: pCodeArr[2] + '1'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: "../carManage/oilConsManage/oilConsData.html"
                        //     }
                        // },
                        // {
                        //     nav: '油量异常',
                        //     code: {
                        //         code: pCodeArr[2] + '2'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: "../carManage/oilConsManage/oilQuantityAbnormal.html"
                        //     }
                        // },
                        // {
                        //     nav: '加油管理',
                        //     code: {
                        //         code: pCodeArr[2]+'3'
                        //     },
                        //     fontIcon: 'icon-youfei',
                        //     fontIconColor: fontIconColor,
                        //     navAttr: {
                        //         dataHtmlUrl: "../carManage/oilManage.html"
                        //     }
                        // }
                        // {
                        //     nav: '油耗异常',
                        //     code: {
                        //         code: pCodeArr[2] + '3'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: "../carManage/oilConsManage/oilConsumAbnormal.html"
                        //     }
                        // }
                        // {
                        //     // nav:'加油数据',
                        //     // code:{
                        //     //     code:pCodeArr[2]+'4'
                        //     // },
                        //     // navAttr:{
                        //     //     dataHtmlUrl: "../carManage/oilConsManage/comeOnData.html"
                        //     // }
                        // }
                    // ]
                // },
                {
                    nav: '安全管理',
                    code: {
                        code: 120
                    },
                    fontIcon: 'icon-weizhang',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: "../carManage/egalManage.html"
                    }
                }, {
                    nav: '终端管理',
                    code: {
                        code:124
                    },
                    fontIcon: 'icon-zhongduanguanli',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: "../carManage/terminalManage.html"
                    }
                }
            ],//车辆管理
            '5':[
                {
                    nav: '考勤统计',
                    code: {
                        code: 130
                    },
                    fontIcon: 'icon-kaoqin2',//字体图标className
                    fontIconColor: fontIconColor,
                    //自定义属性
                    navAttr: {
                        dataHtmlUrl: '../statisticalAnalysis/attendStatist.html'
                    }
                },
                {
                    nav: '行驶统计',
                    code: {
                        code:131
                    },
                    fontIcon: 'icon-ignitionsystem',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../statisticalAnalysis/tranelStatist/tranelStatist.html?traneType=0'
                    },
                    subnav: [
                        {
                            nav: '行驶统计',
                            code: {
                                code:189
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/tranelStatist/tranelStatist.html?traneType=0'
                            }
                        },
                        {
                            nav: '里程统计',
                            code: {
                                code:190
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/tranelStatist/tranelStatist.html?traneType=1'
                            }
                        },
                        {
                            nav: '点火统计',
                            code: {
                                code:191
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/tranelStatist/tranelStatist.html?traneType=2'
                            }
                        },
                        {
                            nav: '停车统计',
                            code: {
                                code:192
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/tranelStatist/tranelStatist.html?traneType=3'
                            }
                        }
                    ]
                },
                {
                    nav: '费用统计',
                    code: {
                        code:132
                    },
                    fontIcon: 'icon-chengben',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../statisticalAnalysis/costStatist/totalCost.html'
                    },
                    subnav: [
                        {
                            nav: '总费用',
                            code: {
                                code:193
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/totalCost.html'
                            }
                        },
                        {
                            nav: '油费',
                            code: {
                                code:194
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/commonCostStatist.html?costType=0'
                            }
                        },
                        {
                            nav: '维修费',
                            code: {
                                code:195
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/commonCostStatist.html?costType=1'
                            }
                        },
                        {
                            nav: '保养费',
                            code: {
                                code:196
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/commonCostStatist.html?costType=2'
                            }
                        },
                        {
                            nav: '年检费',
                            code: {
                                code:197
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/commonCostStatist.html?costType=3'
                            }
                        },
                        {
                            nav: '保险费',
                            code: {
                                code:198
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/commonCostStatist.html?costType=4'
                            }
                        },
                        {
                            nav: '违章费',
                            code: {
                                code:199
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/commonCostStatist.html?costType=5'
                            }
                        },
                        {
                            nav: '其他费用',
                            code: {
                                code:200
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/costStatist/commonCostStatist.html?costType=6'
                            }
                        }

                    ]
                },
                {
                    nav: '油耗统计',
                    code: {
                        code: 133
                    },
                    fontIcon: 'icon-shui',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../statisticalAnalysis/oilConsStatist/commonOilStatist.html?oilType=1'
                    },
                    subnav: [
                        // {
                        //     nav: '油耗统计',
                        //     code: {
                        //         code: pCodeArr[3] + '1'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: '../statisticalAnalysis/oilConsStatist/commonOilStatist.html?oilType=0'
                        //     }
                        // },
                        {
                            nav: '加油数据',
                            code: {
                                code:201
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/oilConsStatist/commonOilStatist.html?oilType=1'
                            }
                        },
                        {
                            nav: '漏油数据',
                            code: {
                                code:202
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/oilConsStatist/commonOilStatist.html?oilType=2'
                            }
                        },
                        {
                            nav: '油量统计',
                            code: {
                                code:203
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/oilConsStatist/oilConsCurve.html'
                            }
                        }
                    ]
                },
                {
                    nav: '安全统计',
                    code: {
                        code: 134
                    },
                    fontIcon: 'icon-anquan1',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../statisticalAnalysis/securityStatist/securityStatist1.html?secuityType1=0'
                    },
                    subnav: [
                        {
                            nav: '安全分析',
                            code: {
                                code:204
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/securityStatist/securityStatist1.html?secuityType1=0'
                            }
                        },
                        {
                            nav: '违章',
                            code: {
                                code:205
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/securityStatist/securityStatist2.html?secuityType2=0'
                            }
                        },
                        {
                            nav: '事故',
                            code: {
                                code:206
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/securityStatist/securityStatist2.html?secuityType2=1'
                            }
                        },
                        // {
                        //     nav: '超速',
                        //     code: {
                        //         code: pCodeArr[4] + '4'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: '../statisticalAnalysis/securityStatist/securityStatist2.html?secuityType2=2'
                        //     }
                        // },
                        {
                            nav: '其他',
                            code: {
                                code:207
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/securityStatist/securityStatist2.html?secuityType2=4'
                            }
                        }
                    ]
                },
                {
                    nav: '报警统计',
                    code: {
                        code: 135
                    },
                    fontIcon: 'icon-louyutubiaobaojing',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist1.html?callPoliceType1=0'
                    },
                    subnav: [
                        {
                            nav: '报警分析',
                            code: {
                                code:208
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist1.html?callPoliceType1=0'
                            }
                        },
                        {
                            nav: '出区域报警',
                            code: {
                                code:209
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist2.html?callPoliceType2=0'
                            }
                        },
                        {
                            nav: '进区域报警',
                            code: {
                                code:210
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist2.html?callPoliceType2=1'
                            }
                        },
                        {
                            nav: '超速报警',
                            code: {
                                code:211
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist2.html?callPoliceType2=2'
                            }
                        },
                        {
                            nav: '路线偏移报警',
                            code: {
                                code:212
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist2.html?callPoliceType2=3'
                            }
                        },
                        {
                            nav: '停留报警',
                            code: {
                                code:213
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist2.html?callPoliceType2=4'
                            }
                        },
                        // {
                        //     nav: '油耗报警',
                        //     code: {
                        //         code: pCodeArr[5] + '7'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist2.html?callPoliceType2=5'
                        //     }
                        // },
                        // {
                        //     nav: '油量报警',
                        //     code: {
                        //         code: pCodeArr[5] + '8'
                        //     },
                        //     navAttr: {
                        //         dataHtmlUrl: '../statisticalAnalysis/callPoliceStatist/callPoliceStatist2.html?callPoliceType2=6'
                        //     }
                        // }
                    ]
                },
                {
                    nav: '卫情统计',
                    code: {
                        code:136
                    },
                    fontIcon: 'icon-fenggucha',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../statisticalAnalysis/situSateStatist/commonSituStatist.html?situType=0'
                    },
                    subnav: [
                        {
                            nav: '卫情统计',
                            code: {
                                code:214
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/situSateStatist/commonSituStatist.html?situType=0'
                            }
                        },
                        {
                            nav: '处理情况',
                            code: {
                                code:215
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/situSateStatist/commonSituStatist.html?situType=1'
                            }
                        },
                        {
                            nav: '处理效率',
                            code: {
                                code:216
                            },
                            navAttr: {
                                dataHtmlUrl: '../statisticalAnalysis/situSateStatist/commonSituStatist.html?situType=2'
                            }
                        }
                    ]
                }

            ],//统计分析
            '6':[
                {
                    nav: '部门管理',
                    code: {
                        code: 138
                    },
                    fontIcon: 'icon-bumenguanli',//字体图标className
                    fontIconColor: fontIconColor,
                    //自定义属性
                    navAttr: {
                        dataHtmlUrl: '../sysSetting/departmentManage.html'
                    }
                },
                {
                    nav: '用户管理',
                    code: {
                        code:142
                    },
                    fontIcon: 'icon-yonghu3',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../sysSetting/userManage.html'
                    }
                },
                {
                    nav: '角色管理',
                    code: {
                        code:148
                    },
                    fontIcon: 'icon-jiaoseguanli',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../sysSetting/roleManage.html'
                    }
                },
                {
                    nav: '权限管理',
                    code: {
                        code:152
                    },
                    fontIcon: 'icon-jiaosequanxian',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../sysSetting/jurisdManage.html'
                    }
                },
                {
                    nav: '设施管理',
                    code: {
                        code:153
                    },
                    fontIcon: 'icon-shanchu',//字体图标className
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../sysSetting/facilitManage/publicFacilities.html?facType=0'
                    },
                    subnav: [
                        {
                            nav: '公厕',
                            code: {
                                code:158
                            },
                            navAttr: {
                                // dataHtmlUrl: '../sysSetting/facilitManage/publicToilet.html?facType=0'
                                dataHtmlUrl: '../sysSetting/facilitManage/publicFacilities.html?facType=0'
                            }
                        },
                        {
                            nav: '中转站',
                            code: {
                                code:159
                            },
                            navAttr: {
                                dataHtmlUrl: '../sysSetting/facilitManage/publicFacilities.html?facType=1'
                            }
                        },
                        {
                            nav: '掩埋场',
                            code: {
                                code: 164
                            },
                            navAttr: {
                                dataHtmlUrl: '../sysSetting/facilitManage/publicFacilities.html?facType=2'
                            }
                        },
                        {
                            nav: '垃圾箱',
                            code: {
                                code: 169
                            },
                            navAttr: {
                                dataHtmlUrl: '../sysSetting/facilitManage/publicFacilities.html?facType=3'
                            }
                        },
                        {
                            nav: '果皮箱',
                            code: {
                                code:174
                            },
                            navAttr: {
                                dataHtmlUrl: '../sysSetting/facilitManage/publicFacilities.html?facType=4'
                            }
                        }
                    ]
                },
                {
                    nav: '系统管理',
                    code: {
                        code:179
                    },
                    fontIcon: 'icon-shezhi',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../sysSetting/setting/remindSetting.html'
                    },
                    subnav: [
                        // {
                        //     nav:'公告',
                        //     code:{
                        //         code:pCodeArr[5]+'1'
                        //     },
                        //     navAttr:{
                        //         dataHtmlUrl: '../sysSetting/setting/notice.html'
                        //     }
                        // },
                        {
                            nav: '提醒设置',
                            code: {
                                code:180
                            },
                            navAttr: {
                                dataHtmlUrl: '../sysSetting/setting/remindSetting.html'
                            }
                        },
                        {
                            nav: '油耗规则',
                            code: {
                                code:181
                            },
                            navAttr: {
                                dataHtmlUrl: '../sysSetting/setting/oilConsuRule.html'
                            }
                        },
                        {
                            nav: '字典管理',
                            code: {
                                code:186
                            },
                            navAttr: {
                                dataHtmlUrl: '../sysSetting/dictionManage.html'
                            }
                        }
                    ]

                },
                {
                    nav: '系统日志',
                    code: {
                        code:187
                    },
                    fontIcon: 'icon-rizhi1',
                    fontIconColor: fontIconColor,
                    navAttr: {
                        dataHtmlUrl: '../sysSetting/systemLog.html'
                    }
                }

            ]//系统设置
        };
        var callBack = {
            navOne: function (This) {
                This.attr('dataHtmlUrl') && $('#myframe').attr('src', This.attr('dataHtmlUrl'));
            },
            navTwo: function (This) {
                This.attr('dataHtmlUrl') && $('#myframe').attr('src', This.attr('dataHtmlUrl'));
            },
            navThree: function (This) {
                This.attr('dataHtmlUrl') && $('#myframe').attr('src', This.attr('dataHtmlUrl'));
            }
        };
        //导航栏切换
        var $ul=$('.operation>ul');
        var $nav=$('.nav');
        //数据权限
        menuPower($ul,$nav,privilegeCode);
        //左侧导航容器添加侧标导航
        var $leftNav=$nav.find('.nav-box');
        for(var key in optionNav){
            var codeArr=[];
            var arr=optionNav[key];
            for(var i=0;i<arr.length;i++){
                var code=arr[i].code.code;
                var state=ycya.util.checkPrivilege(window.name,code);
                if(state){
                    codeArr.push(code);
                }
                var arr1=arr[i].subnav;
                if(arr1!=undefined&&arr1.length>0){
                    for(var j=0;j<arr1.length;j++){
                        var code1=arr1[j].code.code;
                        var state1=ycya.util.checkPrivilege(window.name,code1);
                        if(state1){
                            codeArr.push(code1);
                        }
                    }
                }
            }
            if(codeArr.length>0){
                $(".nav-box[code='"+key+"']").thh_navPlug(optionNav[key],'skin3',callBack,codeArr);//加载导航
            }
        }
        //根据返回的数据权限默认显示第一个导航
        var defaultIndex=parseInt($leftNav.eq(0).attr('code'));console.log(defaultIndex);
        defaultNav1(defaultIndex);
        function defaultNav1(defaultIndex) {
            $(".operation li").eq(0).addClass("activeLi");//默认显示有权限的第一个导航
            if(defaultIndex!=0){
                $nav.show();
            }else{
                $nav.hide();
            }
            $nav.find('.nav-box[data-code="'+defaultIndex+'"]').show().siblings().hide();
            sideNavStyle(defaultIndex);
            defaultNav(defaultIndex);
        }
        $nav.find(".trigger").on("click", function () {
            var w = $nav.width();
            if (w == 140) {
                $(this).find('i').removeClass("icon-shouqi").addClass("icon-zhankai");
                $nav.width(50);
                $('.thh-nav-plug  span').css("display", "none");
                $('.thh-nav-plug  em').css("display", "none");
                $('.m-main .content').css({"padding-left": "50px"});
                $('.thh-nav-plug .two h5').css({"padding-left": "16px"});
                $('.thh-nav-plug li').css({"padding-left": "25px"});
                $('.thh-nav-plug').find('h5,h6').find('i').show();
                $('.thh-nav-plug').find('h4,h5,li').mouseenter(function () {
                    if ($('.title-box').html() == undefined) {
                        $('<div class="title-box"><b></b><span id="titleSpan">' + $(this).find('span').html() + '</span><div>').css({
                            top: $(this).offset().top,
                            left: "60px"
                        }).appendTo($("body"))
                    } else {
                        $('#titleSpan').html($(this).find('span').html());
                        $('.title-box').css({
                            "display": "block",
                            top: $(this).offset().top,
                            left: "60px"
                        })
                    }
                }).mouseleave(function () {
                    $('.title-box').css({
                        "display": "none"
                    });
                })
            } else {
                $(this).find('i').removeClass("icon-zhankai").addClass("icon-shouqi");
                $nav.width(140);
                $('.thh-nav-plug  span').css("display", "inline-block");
                //$('.thh-nav-plug .one h4').find().not('i').css("display","inline-block");
                $('.thh-nav-plug .one h4').find().css("display", "inline-block");
                $('.thh-nav-plug  em').css("display", "inline-block");
                $('.m-main .content').css({"padding-left": "140px"});
                $('.thh-nav-plug .two h5').css({"padding-left": "36px"});
                $('.thh-nav-plug li').css({"padding-left": "56px"});
                //$('.thh-nav-plug').find('h5,h6').find('i').hide();
            }
        });
        var $main = $(".m-main");
        var $nav = $main.find($(".nav"));
        var $sysUserBox = $main.find('.sysUserBox');
        $(".content").addClass("content0");
        var flag = 0;//管理员下拉状态
        //header导航点击切换
        $ul.find('li').click(function (e) {
            var $index=$(this).attr('code');
            if ($index != 7) {
                $sysUserBox.hide();
                flag = 0;
                $('.nav-box[code="'+$index+'"]').show().siblings().hide();
                ($index == 0) ? $(".nav").hide() : $(".nav").show();
                sideNavStyle($index);
                defaultNav($index);
            } else {
                if (flag == 0) {
                    $sysUserBox.show();
                    flag = 1;
                } else {
                    $sysUserBox.hide();
                    flag = 0;
                }
            }
            $(this).addClass("activeLi");
            $(this).siblings("li").removeClass("activeLi");
        });
        //侧边导航展示样式
        function sideNavStyle($index) {
            if ($index == 0) {
                $(".nav").removeClass("narrow");
                $(".content").removeClass("content2");
                $(".content").addClass("content0");
                $(".content").css("padding-left", "0px");
            } else if ($index == 1) {
                $(".content").removeClass("content0");
                $(".nav").addClass("narrow");
                $(".content").addClass("content2");
                $(".narrow").css("width", '50px');
                $(".narrow .arrow-right,.narrow .arrow-bottom").css("display", 'none');
                $(".narrow .arrow-right,.narrow .arrow-bottom").siblings("span").css("display", "block");
                $(".content").css("padding-left", "50px");
            } else {
                $(".nav").removeClass("narrow");
                $(".content").removeClass("content0");
                $(".content").removeClass("content2");
                var $navBox=$nav.find('.nav-box').eq($index);
                var $trigger_i=$navBox.find('.trigger>i');
                var $thhNavPlug=$navBox.find('.thh-nav-plug');
                var w=$nav.width();
                if(w==50){
                    $trigger_i.removeClass("icon-shouqi").addClass("icon-zhankai");
                    $nav.siblings('.content').css({"padding-left": "50px"});
                    $thhNavPlug.find('span').css("display", "none");
                    $thhNavPlug.find('em').css("display", "none");
                    $thhNavPlug.find('.two h5').css({"padding-left": "16px"});
                    $thhNavPlug.find('li').css({"padding-left": "25px"});
                    $thhNavPlug.find('h5,h6').find('i').show();
                }else{
                    $trigger_i.removeClass("icon-zhankai").addClass("icon-shouqi");
                    $nav.siblings('.content').css({"padding-left": "140px"});
                    $thhNavPlug.find('span').css("display", "inline-block");
                    //$('.thh-nav-plug .one h4').find().not('i').css("display","inline-block");
                    $thhNavPlug.find('.one').css({'overflow':'hidden'});
                    $thhNavPlug.find('.one h4').css({"display":"inline-block",'width':'100%'});
                    $thhNavPlug.find('em').css("display", "inline-block");
                    // $('.m-main .content').css({"padding-left": "140px"});
                    $thhNavPlug.find('.two h5').css({"padding-left": "36px"});
                    $thhNavPlug.find('li').css({"padding-left": "56px"});
                }
            }
        }
        //默认页面
        function defaultNav($index) {
            var $navBoxIndex=$(".nav-box[code='"+$index+"']").find(".one").eq(0);
            var $h4=$navBoxIndex.find("h4");
            var $two=$h4.siblings('.two');
            $h4.addClass("active current").find('i,span').css({'color':'#3096fe'});
            if($two.length>0){
                $two.css({'height':'auto'}).find('h5').eq(0).addClass("active current");
                $two.eq(0).siblings().find('h5').removeClass("active current");
                //2018/2/26左侧导航默认显示二级导航
                var dhtmlurl=$two.eq(0).find('h5').attr('datahtmlurl');
                $h4.attr('datahtmlurl',dhtmlurl);
                $("#myframe").attr("src",dhtmlurl);
            }else{
                var dhtmlurl1=$h4.eq(0).attr('datahtmlurl');
                $("#myframe").attr("src",dhtmlurl1);
            }
            var $h41=$navBoxIndex.siblings().find("h4");
            $h41.removeClass("active current").find("i,span").css({'color':'#fff'});
            $navBoxIndex.siblings().find(".two").css({'height':'0px'});
        }

        //管理员操作
        $sysUserBox.find('p').click(function () {
            $(this).addClass('activeLi').siblings().removeClass('activeLi');
            $(this).parent().fadeOut(500);
        });
        //查询用户名称
        findUser();
        function findUser() {
            var userName = getCookie("userName");
            $main.find('.sysUser').find('a').html('您好，' + userName);
        }
        //修改密码
        var validationUp=$('#update').validationUp({
            rules:{
                oldPassword:{
                    notEmpty:true,
                    passwordSize:true
                },
                newPassword:{
                    notEmpty:true,
                    passwordSize:true,
                    equals:'.newPass1'
                }
            },
            errorMsg:{
                oldPassword:{
                    notEmpty:'新密码不能为空'
                },
                newPassword:{
                    notEmpty:'确认密码不能为空'
                }
            },
            submit:{
                submitBtn:$('#update .yes'),
                validationEvent:'blur change',
                errorMsgIcon:'icon iconfont icon-cuowu1'
            }
        });
        $sysUserBox.find('p.updatePass').click(function () {
            flag = 0;
            $('.newPass1').attr('value','');
            $('.newPass2').attr('value','');
            var index = layer.open({
                type: 1,
                title: false,
                area: "400px",
                shadeClose:false,
                closeBtn: 1,
                content: $("#update"),
                move: $('#update .title'),
                success:function(){
                    $('#update .form-body ul').css({
                        'margin':'10px'
                    });
                    $('.newPass2').parent().css({
                        'marginTop':'10px'
                    });
                }
            });
            $('.form-btn .no').click(function () {
                layer.close(index);
                flag = 1;
            });
            validationUp.destroyErrorMsg();
            validationUp.setDoSubmitFn({
                submit:{
                    doSubmitFn:function(formData){
                        cancelLogin(formData,index);
                        $sysUserBox.hide();
                        flag = 0;
                    }
                }
            })
        });
        //修改密码接口
        function cancelLogin(jData,indexPop) {
            var cfg = {
                token: getCookie("token"),
                url: 'user/cancelLogin',
                data: jData,
                success: function (data) {
                    layer.close(indexPop);
                    layer.msg('密码修改成功,请重新登录', {time: 2000},function(){
                        window.location.href='../../../login.html'
                    });
                }
            };
            customAjax(cfg);
        }
        //退出
        $('.login-out').click(function () {
            window.location.href = "../../../login.html";
        })
    }
});
