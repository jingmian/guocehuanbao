// var ctx ='gcweb-new/web' /*"/web"*/;
var ctx ='nationalPolicy' /*"/web"*/;
var YcyaMapCfg = {
	_mapType:'baidu',//地图类型，'gaode'
	_autoZoom:true,//是否自动缩放，默认为false，不自动缩放
	_autoScroll:true, //开启鼠标滚轮缩放
	_mapShow:true,
	_openDistanceTool:true, //开启测距
	_baiduCfg:{
		_url:"http://api.map.baidu.com/getscript?v=2.0&ak=D8hZnXeO6NRjj0zQk9G905PmWVgiWuCf&services=&t=20170517145936",
		_urlLib:[
			"/"+ctx+"/YcyaUI/map/TextIconOverlay.js","/"+ctx+"/YcyaUI/map/MarkerClusterer.js",
			"http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js",
			"http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css",
			"/"+ctx+"/YcyaUI/map/distanceTool.js"
		],
		_lng:88.894903,
		_lat:29.277009
	},
	_gaodeCfg:{

	},
	icons:{'default':{"url":"/"+ctx+"/YcyaUI/skin/img/cars.png","size":[14,24],"offset":[13,6]},
		'car1':{"url":"/"+ctx+"/YcyaUI/skin/img/cars.png","size":[32,32],"offset":[0,0]},
		'cars1':{"url":"/"+ctx+"/YcyaUI/skin/img/cars-1.png",size:[32,32],offset:[0,0]},
		'taxi':{"url":"/"+ctx+"/YcyaUI/skin/img/taxi.png",size:[24,24]},
		'logo':{"url":"/"+ctx+"/YcyaUI/skin/img/logo.png",size:[24,24]},
		'qq':{"url":"/"+ctx+"/YcyaUI/skin/img/icons.png",size:[24,24],offset:[-48,-317]},
		'che':{"url":"/"+ctx+"/YcyaUI/skin/img/che1.png",size:[48,32]},
		'green':{"url":"/"+ctx+"/YcyaUI/skin/img/green-car.png",size:[48,32]},
		'red':{"url":"/"+ctx+"/YcyaUI/skin/img/red-car.png",size:[48,32]},
		'yellow':{"url":"/"+ctx+"/YcyaUI/skin/img/yellow-car.png",size:[48,32]},
		'gray':{"url":"/"+ctx+"/YcyaUI/skin/img/gray-car.png",size:[48,32]},
		'start':{"url":"/"+ctx+"/YcyaUI/skin/img/start-point.png",size:[24,32]},
		'end':{"url":"/"+ctx+"/YcyaUI/skin/img/end-point.png",size:[24,32]},
		'over':{"url":"/"+ctx+"/YcyaUI/skin/img/over-point.png",size:[24,32]},
		'stop':{"url":"/"+ctx+"/YcyaUI/skin/img/stop-point.png",size:[24,32]},
        'peo':{"url":"/"+ctx+"/YcyaUI/skin/img/peo.png",size:[32,32]},
        'iconWei':{"url":"/"+ctx+"/YcyaUI/skin/img/car/icon_wei.png",size:[48,42]},

		/*车种*/
		//摆臂车 z 在线 q 其他  j报警 l离线

		'bbz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/bbz.png",size:[24,24]},
		'bbq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/bbq.png",size:[24,24]},
		'bbj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/bbj.png",size:[24,24]},
		'bbl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/bbl.png",size:[24,24]},
		//电动车
		'ddz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ddz.png",size:[24,24]},
		'ddq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ddq.png",size:[24,24]},
		'ddj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ddj.png",size:[24,24]},
		'ddl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ddl.png",size:[24,24]},
		//勾臂车
		'gbz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gbz.png",size:[27,32]},
		'gbq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gbq.png",size:[27,32]},
		'gbj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gbj.png",size:[27,32]},
		'gbl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gbl.png",size:[27,32]},
		//巡查车
		'gwz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gwz.png",size:[27,32]},
		'gwq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gwq.png",size:[27,32]},
		'gwj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gwj.png",size:[27,32]},
		'gwl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gwl.png",size:[27,32]},
		//扫地车
		'sdz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/sdz.png",size:[27,32]},
		'sdq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/sdq.png",size:[27,32]},
		'sdj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/sdj.png",size:[27,32]},
		'sdl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/sdl.png",size:[27,32]},
		//洒水车
		'ssz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ssz.png",size:[27,32]},
		'ssq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ssq.png",size:[27,32]},
		'ssj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ssj.png",size:[27,32]},
		'ssl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ssl.png",size:[27,32]},
		//压缩车
		'ysz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ysz.png",size:[27,32]},
		'ysq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ysq.png",size:[27,32]},
		'ysj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ysj.png",size:[27,32]},
		'ysl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/ysl.png",size:[27,32]},
		//自卸车
		'zxz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zxz.png",size:[27,32]},
		'zxq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zxq.png",size:[27,32]},
		'zxj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zxj.png",size:[27,32]},
		'zxl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zxl.png",size:[27,32]},
        //翻斗车
        'fdcz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/fdcz.png",size:[24,24]},
        'fdcq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/fdcq.png",size:[24,24]},
        'fdcj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/fdcj.png",size:[24,24]},
        'fdcl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/fdcl.png",size:[24,24]},
        //工程车
        'gccz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gccz.png",size:[24,24]},
        'gccq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gccq.png",size:[24,24]},
        'gccj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gccj.png",size:[24,24]},
        'gccl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/gccl.png",size:[24,24]},
        //转运车
        'zycz':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zycz.png",size:[24,24]},
        'zycq':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zycq.png",size:[24,24]},
        'zycj':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zycj.png",size:[24,24]},
        'zycl':{"url":"/"+ctx+"/YcyaUI/skin/img/car/zycl.png",size:[24,24]},

		/*人种*/
		//道路保洁
		'dlz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/dlz.png",size:[27,32]},
		'dlq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/dlq.png",size:[27,32]},
		'dlj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/dlj.png",size:[27,32]},
		'dll':{"url":"/"+ctx+"/YcyaUI/skin/img/people/dll.png",size:[27,32]},
		//跟车人员
		'gcz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/gcz.png",size:[27,32]},
		'gcq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/gcq.png",size:[27,32]},
		'gcj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/gcj.png",size:[27,32]},
		'gcl':{"url":"/"+ctx+"/YcyaUI/skin/img/people/gcl.png",size:[27,32]},
		//公厕管理
		'ggz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/ggz.png",size:[27,32]},
		'ggq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/ggq.png",size:[27,32]},
		'ggj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/ggj.png",size:[27,32]},
		'ggl':{"url":"/"+ctx+"/YcyaUI/skin/img/people/ggl.png",size:[27,32]},
		//河道清运
		'hdz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/hdz.png",size:[27,32]},
		'hdq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/hdq.png",size:[27,32]},
		'hdj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/hdj.png",size:[27,32]},
		'hdl':{"url":"/"+ctx+"/YcyaUI/skin/img/people/hdl.png",size:[27,32]},
		//机动人员
		'jdz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/jdz.png",size:[27,32]},
		'jdq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/jdq.png",size:[27,32]},
		'jdj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/jdj.png",size:[27,32]},
		'jdl':{"url":"/"+ctx+"/YcyaUI/skin/img/people/jdl.png",size:[27,32]},
		//驾驶员
		'sjz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sjz.png",size:[27,32]},
		'sjq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sjq.png",size:[27,32]},
		'sjj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sjj.png",size:[27,32]},
		'sjl':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sjl.png",size:[27,32]},
		//社区保洁
		'sqz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sqz.png",size:[27,32]},
		'sqq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sqq.png",size:[27,32]},
		'sqj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sqj.png",size:[27,32]},
		'sql':{"url":"/"+ctx+"/YcyaUI/skin/img/people/sql.png",size:[27,32]},
		//填埋人员
		'tmz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/tmz.png",size:[27,32]},
		'tmq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/tmq.png",size:[27,32]},
		'tmj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/tmj.png",size:[27,32]},
		'tml':{"url":"/"+ctx+"/YcyaUI/skin/img/people/tml.png",size:[27,32]},
		//巡查人员
		'xcz':{"url":"/"+ctx+"/YcyaUI/skin/img/people/xcz.png",size:[27,32]},
		'xcq':{"url":"/"+ctx+"/YcyaUI/skin/img/people/xcq.png",size:[27,32]},
		'xcj':{"url":"/"+ctx+"/YcyaUI/skin/img/people/xcj.png",size:[27,32]},
		'xcl':{"url":"/"+ctx+"/YcyaUI/skin/img/people/xcl.png",size:[27,32]},

		/*设备*/
		//果皮箱
		'peel':{"url":"/"+ctx+"/YcyaUI/skin/img/device/peel.png",size:[27,32]},
		//垃圾箱
		'dustbin':{"url":"/"+ctx+"/YcyaUI/skin/img/device/dustbin.png",size:[27,32]},
		//中转站
		'transfer':{"url":"/"+ctx+"/YcyaUI/skin/img/device/transfer.png",size:[27,32]},
		//掩埋厂
		'bury':{"url":"/"+ctx+"/YcyaUI/skin/img/device/bury.png",size:[27,32]},
		//公厕
		'toilet':{"url":"/"+ctx+"/YcyaUI/skin/img/device/toilet.png",size:[27,32]}
	},
	lines:{
		"line1":{"color":"#0000CD","width":2,"opacity":0.8,"style":"solid"/*实线，或虚线dashed*/},
		"line2":{"color":"#ff2600","scolor":"red","width":2,"opacity":0.8,"style":"solid"/*实线，或虚线dashed*/},
		"line3":{"color":"#1F86EC","scolor":"blue","width":2,"opacity":0.8,"style":"solid"/*实线，或虚线dashed*/},
		"line4":{"color":"#0000CD","width":2,"opacity":0.3,"style":"solid"/*实线，或虚线dashed*/}
	}
};
if(ctx==""){
	YcyaMapCfg._baiduCfg._urlLib=[
		"/YcyaUI/map/TextIconOverlay.js","/YcyaUI/map/MarkerClusterer.js",
		"http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.js",
		"http://api.map.baidu.com/library/DrawingManager/1.4/src/DrawingManager_min.css"
	];
	YcyaMapCfg.icons={
		'default':{"url":"/YcyaUI/skin/img/cars.png","size":[14,24],"offset":[13,6]},
		'car1':{"url":"/YcyaUI/skin/img/cars.png","size":[32,32],"offset":[0,0]},
		'cars1':{"url":"/YcyaUI/skin/img/cars-1.png",size:[32,32],offset:[0,0]},
		'taxi':{"url":"/YcyaUI/skin/img/taxi.png",size:[24,24]},
		'logo':{"url":"/YcyaUI/skin/img/logo.png",size:[24,24]},
		'qq':{"url":"/YcyaUI/skin/img/icons.png",size:[24,24],offset:[-48,-317]},
		'che':{"url":"/YcyaUI/skin/img/che1.png",size:[48,32]},
		'green':{"url":"/YcyaUI/skin/img/green-car.png",size:[48,32]},
		'red':{"url":"/YcyaUI/skin/img/red-car.png",size:[48,32]},
		'yellow':{"url":"/YcyaUI/skin/img/yellow-car.png",size:[48,32]},
		'gray':{"url":"/YcyaUI/skin/img/gray-car.png",size:[48,32]},
		'start':{"url":"/YcyaUI/skin/img/start-point.png",size:[26,32]},
		'end':{"url":"/YcyaUI/skin/img/end-point.png",size:[27,32]},
		'icon2':{"url":"/YcyaUI/skin/img/icon2.png",size:[24,48],offset:[-14,-14]},
		'carImg':{"url":"/YcyaUI/skin/img/car_img.png",size:[16,16],offset:[-12,-2]}
	}
}
