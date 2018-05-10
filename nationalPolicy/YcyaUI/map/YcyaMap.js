//定义地图必须实现的方法,addPoint描点
var IYcyaMap = new Interface('IYcyaMap', ['addPoint', 'getZoom', 'setZoom', 'trace', 'route', 'openWin', 'center', 'toSetCenter', 'clear', 'clearById', 'draw', 'createPoint', 'createOverlay', 'distanceTool', 'openZoomendEvent', 'openMoveendEvent', 'addRoutePoint', 'localSearch', 'createAutocomplete', 'getLngAndLat', 'tmp_createOverlay', 'autoOpenWin']);
// var ctx1 ='gcweb-new/web';
var ctx1 ='nationalPolicy';
//var ctx1 = 'guoce';
(function (ycya) {
    var YcyaMap = function (mapId) {
        this.implementsInterfaces = ['IYcyaMap'];
        this._YcyaMapData = {"support": ["baidu"], "loaded": "0", "markered": "0", "markers": {}, "bTrace": "0"};
        this._flow = new Jas();
        this._jsLoader = new YcyaLoader();
        this._MapClient = null;
        this._cfg = null;
        this.mapType = '';

        var currObj = this;
        if (navigator.userAgent.indexOf('Firefox') >= 0) {
            this._jsLoader.loadFile(lx.getRootPath(1) + '/YcyaUI/map/YcyaMapCfg.js', function () {
                currObj._cfg = YcyaMapCfg;
                currObj.mapType = currObj._cfg['_mapType'];
                if (!currObj.mapType || currObj._YcyaMapData['support'].indexOf(currObj.mapType) == -1) {
                    throw new Error('地图类型不正确');
                }
                currObj._flow.trigger('cfgLoaded');
            });
        } else {
            // this._jsLoader.loadFile(getJsPath()+'/YcyaMapCfg.js', function() {
            // 	currObj._cfg = YcyaMapCfg;
            // 	currObj.mapType = currObj._cfg['_mapType'];
            // 	if(!currObj.mapType || currObj._YcyaMapData['support'].indexOf(currObj.mapType)==-1){
            // 		throw new Error('地图类型不正确');
            // 	}
            // 	currObj._flow.trigger('cfgLoaded');
            // });
            this._jsLoader.loadFile('/' + ctx1 + '/YcyaUI/map/YcyaMapCfg.js', function () {
                currObj._cfg = YcyaMapCfg;
                currObj.mapType = currObj._cfg['_mapType'];
                if (!currObj.mapType || currObj._YcyaMapData['support'].indexOf(currObj.mapType) == -1) {
                    throw new Error('地图类型不正确');
                }
                currObj._flow.trigger('cfgLoaded');
            });
        }
        this._flow.waitFor(['cfgLoaded'], function () {
            if (currObj.mapType == 'baidu') {
                currObj._loadJs(currObj._cfg);
                currObj._flow.waitFor(['loaded'], function () {
                    currObj._loadJsLib(currObj._cfg);
                });

                var libUrls = currObj._cfg['_baiduCfg']['_urlLib'];
                var libUrlEvtNames = [];
                for (var i = 0; i < libUrls.length; i++) {
                    libUrlEvtNames.push('libLoaded' + i);
                }
                currObj._flow.waitFor(libUrlEvtNames, function () {
                    currObj._MapClient = new _BaiduMap(mapId, currObj._cfg, currObj._YcyaMapData);
                    currObj._YcyaMapData['loaded'] = 1;
                    currObj._flow.trigger('mapReady');
                });
            }
        });
    };
    YcyaMap.prototype = {
        init: function (lng, lat, zoom) {
            zoom = zoom || 15;
            return this._MapClient.init(lng, lat, zoom);
        },
        center: function (id, zoom) {
            var marker = this.getMarker(id);
            if (marker) {
                this._MapClient.center(marker.getPosition(), zoom);
            } else {
                alert('未定位...')
            }
        },
        toSetCenter: function (point) {
            return this._MapClient.toSetCenter(point);
        },
        /**
         * 添加点
         * @param data 支持四种数据结构：
         * (1)多点数据：type=1，数据格式:{type:1,data:[{"lng":130,"lat":30,"id":"川A12345"}],"icon":'key',"evt":doit},
         * 使用同一个图标，图标值可选;使用统一的事件处理,如没有回调函数,可以省略evt
         * (2)多点数据：type=2，数据格式:{type:2,data:[{"lng":130,"lat":30,"icon":'key',"id":"川A12345","evt":doit},{}]},
         * 每个点单独使用图标，图标值可选;使用不同的事件处理,如没有回调函数,可以省略evt
         * (3)多点数据：type=3，数据格式:{type:3,data:["川A12345",130,30,'icon1',"川A12346",131,31,'icon1',...],"evt":doit},
         * 每个点单独使用图标，图标值可选；使用极简数据结构,数组以4个为一组，分别表示id、经度、纬度、图标,如果使用默认图标，则图标值指定空字符串("");
         * 使用统一的回调函数,如没有回调函数,可以省略evt
         * (4)多点数据：type=4，数据格式:{type:4,data:["川A12345",130,30,'icon1',doit,"川A12346",131,31,'icon1',doit,...]},
         * 每个点单独使用图标，图标值可选；使用极简数据结构,数组以5个为一组，分别表示id、经度、纬度、图标、回调函数,
         * 如果使用默认图标，则图标值指定空字符串("")
         * @param cfg
         * @returns {YcyaMap}
         */
        addPoint: function (data, cfg) {
            this._MapClient.addPoint(data, this._cfg, this);
            if (this._YcyaMapData['markered'] == '0') {//仅在第一次描点的时候自动缩放
                this.setZoom();
                this._YcyaMapData['markered'] = '1';
            }
            return this;
        },
        /**
         * 追踪
         * @param data,数据格式： {type:1,data:[130,30,130,30,...],"id":"川A12345","icon":'key',"line":"line1","evt":doit}
         * 数组以2个为一组，分别表示经度、纬度
         * @param cfg
         * @returns {YcyaMap}
         */
        trace: function (data, cfg) {
            this._MapClient.trace(data, this._cfg, this);
            this.setZoom();
            return this;
        },
        /**
         * 轨迹
         * @param data,支持数据结构:
         * {type:1,data:[130,30,130,30,...],"id":"川A12345","icon":'key',"start":,"startIcon","end":,"startIcon","line":"line1","evt":doit}
         * 其中:start和end表示开始点和结束点的图标，必须；
         * id表示数据的id，必须；icon表示其他点的图标，可选；evt表示时间处理函数，可选；
         * 数组以2个为一组，分别表示经度、纬度
         * @param cfg
         * @returns {YcyaMap}
         */
        route: function (data, cfg) {
            this._MapClient.route(data, this._cfg, this);
            //this.setZoom();
            return this;
        },
        openZoomendEvent: function () {
            this._MapClient.openZoomendEvent(this);
        },
        openMoveendEvent: function () {
            this._MapClient.openMoveendEvent(this);
        }, /**
         * 添加轨迹点 需要打开 openZoomendEvent openMoveendEvent事件
         * 调用参数跟addPoint一样
         */
        addRoutePoint: function (data, cfg) {
            this._MapClient.addRoutePoint(data, this._cfg, this);
        },
        openWin: function (title, content, source) {
            this._MapClient.openWin(title, content, source);
        },
        openWinById: function (content, id) {
            this.openWin(content, this.getMarker(id));
        },
        autoOpenWin: function (id) {
            return this._MapClient.autoOpenWin(id, this);
        },
        getZoom: function (maxLng, minLng, maxLat, minLat) {
            return this._MapClient.getZoom(maxLng, minLng, maxLat, minLat);
        },
        setZoom: function () {
            var maxLng = this._YcyaMapData['maxLng'], minLng = this._YcyaMapData['minLng'],
                maxLat = this._YcyaMapData['maxLat'], minLat = this._YcyaMapData['minLat'];

            var zoom = this.getZoom(maxLng, minLng, maxLat, minLat);
            var cenLng = (parseFloat(maxLng) + parseFloat(minLng)) / 2;
            var cenLat = (parseFloat(maxLat) + parseFloat(minLat)) / 2;
            this._MapClient.setZoom(cenLng, cenLat, zoom);
        },
        getData: function () {
            return this._YcyaMapData;
        },
        getMarker: function (id) {
            return this.getData()['markers'][id];
        },
        setMarker: function (id, marker) {
            return this.getData()['markers'][id] = marker;
        },
        clear: function () {
        	for(var id in this.getData()['markers']){
        		delete this.getData()['markers'][id];
        	}
            return this._MapClient.clear(this);
        },
        clearById: function (id, dealType, typeId) {
            var marker = this.getData()['markers'][id];
            delete this.getData()['markers'][id];
            var winO = this._YcyaMapData['win'] == null ? null : this._YcyaMapData['win'][id];

            return this._MapClient.clearById(marker, winO, this, dealType, typeId);
            //var marker=this.getData()['markers'][id];
            //return this._MapClient.clearById(marker);
        },
        getCfg: function () {
            return this._Cfg;
        },
        ready: function (fn) {
            this._flow.waitFor(['mapReady'], fn);
        },
        _loadJs: function (cfg) {
            var jsLoader = this._jsLoader;
            if (cfg['_mapType'] == 'baidu') {
                var flow = this._flow;
                window.BMap_loadScriptTime = (new Date).getTime();
                jsLoader.loadFile(cfg['_baiduCfg']['_url'], function () {
                    flow.trigger('loaded');
                });
            }
            return this;
        },
        _loadJsLib: function (cfg) {
            var jsLoader = this._jsLoader;
            if (cfg['_mapType'] == 'baidu') {
                var flow = this._flow;
                var libUrls;
                /*新增测距功能*/
                if (cfg['_openDistanceTool']) {
                    libUrls = cfg['_baiduCfg']['_urlLib'];
                } else {
                    libUrls = cfg['_baiduCfg']['_urlLib'].slice(0, -1);
                }
                libUrls.forEach(function (libUrlItem, idx) {
                    jsLoader.loadFile(libUrlItem, function () {
                        flow.trigger('libLoaded' + idx);
                    });
                });
            }
            return this;
        },
        _loadCfg: function () {
            var jsLoader = this._jsLoader;
            jsLoader.loadFile('./YcyaMapCfg.js', function () {
                flow.trigger('loaded');
            });
            return this;
        },
        draw: function (data, callback) {
            return this._MapClient.draw(data, this._cfg, callback);
        },
        createPoint: function (lng, lat) {
            return this._MapClient.createPoint(lng, lat);
        },
        createOverlay: function (pointArr, style, id) {
            this._MapClient.createOverlay(pointArr, style, this._cfg, this, id);
        },
        tmp_createOverlay: function (pointArr, style, id) {
            this._MapClient.tmp_createOverlay(pointArr, style, this._cfg, this, id);
        },
        localSearch: function (callBack, mapObj) {
            return this._MapClient.localSearch(callBack, mapObj);
        },
        createAutoComplete: function (inputId, resultId, callBack) {
            return this._MapClient.createAutoComplete(inputId, resultId, callBack);
        },
        getLngAndLat: function (inputId, resultId) {
            return this._MapClient.getLngAndLat(inputId, resultId);
        }
    };
    ycya.YcyaMap = YcyaMap;
})(window);

(function (ycya) {
    var _BaiduMap = function (mapId, cfg, data) {
        this.implementsInterfaces = ['IYcyaMap'];
        this.map = new BMap.Map(mapId);
        this.map.addControl(new BMap.ScaleControl());
        this.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT}));
        var point = new BMap.Point(cfg['_baiduCfg']['_lng'], cfg['_baiduCfg']['_lat']);
        if (setCookie) {
            setCookie('lng', cfg['_baiduCfg']['_lng']);
            setCookie('lat', cfg['_baiduCfg']['_lat']);
        }
        this.map.centerAndZoom(point, 14);
        if (cfg['_autoScroll'])
            this.map.enableScrollWheelZoom();
        else
            this.map.disableScrollWheelZoom();

        if (cfg['_mapShow'])
            this.map.addControl(new BMap.MapTypeControl({
                type: BMAP_MAPTYPE_CONTROL_MAP,
                anchor: BMAP_ANCHOR_BOTTOM_RIGHT
            }));
        if (cfg['_openDistanceTool']) {
            myDis = new BMapLib.DistanceTool(this.map);
            $('.operate-list').on('click', '.ranging', function () {
                myDis.open();  //开启鼠标测距
            })
        }


    };
    _BaiduMap.prototype = {
        init: function (lng, lat, zoom) {
            zoom = zoom || 15;
            var point = new BMap.Point(lng, lat);
            this.map.centerAndZoom(point, zoom);
        },
        center: function (point, zoom) {
            if (zoom == null)
                zoom = this.map.getZoom();
            this.map.centerAndZoom(point, zoom);
        },
        toSetCenter: function (point) {
            return this.map.setCenter(point);
        },
        addPoint: function (data, cfg, loader) {
            var mapData = loader.getData();
            if (data['type'] == 1) {
                var picon = this._getIcon(data['icon'], cfg);
                var markers = [], markersOld = [];
                for (var idx in data['data']) {
                    var point = new BMap.Point(data['data'][idx]['lng'], data['data'][idx]['lat']);
                    this._doMaxMin(mapData, point);//处理坐标最大最小值
                    var marker =loader.getMarker(data['data'][idx]['id']);
                    if (marker) {
						if (picon != null) {
							marker.setIcon(picon);
						}
						marker.setPosition(point)
					} else {
						marker = null == picon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: picon });
						this.map.addOverlay(marker);
                   	 	markers.push(marker);
                   	 	loader.setMarker(data['data'][idx]['id'], marker);
					}

                    //2017-11-23新增实际ID
                    if (data['data'][idx]['carId']) {
                        marker.__actualId = data['data'][idx]['carId'];
                    } else if (data['data'][idx]['personId']) {
                        marker.__actualId = data['data'][idx]['personId'];
                    } else {
                        marker.__actualId = data['data'][idx]['id'];
                    }
                    //2017-11-27新增类型(0人员、1车辆、2设施 )
                    if (data['data'][idx]['dealType']) {
                        marker.__dealType = data['data'][idx]['dealType'];
                    }
                    //2017-11-27新增状态(0未作业 1正在作业)
                    if (data['data'][idx]['status'] == 0 || data['data'][idx]['status']) {
                        marker.__status = data['data'][idx]['status'];
                    }
                    //传入车辆角度，则旋转
                    if (data['data'][idx]['direction']) {
                        marker.setRotation(parseInt(data['data'][idx]['direction']))
                    }
                    marker.__id = data['data'][idx]['id'];

                    if (data['evt']) {
                        marker.addEventListener("click", data['evt']);
                    }

//                    var oldMarker = loader.getMarker(data['data'][idx]['id']);
//                    if (oldMarker) {
//                        //this.map.removeOverlay(oldMarker);
//                        //oldMarker.dispose(); // 1.1+版本不需要这样调用
//                        markersOld.push(oldMarker);
//                    }
                    if (data['data'][idx]['labelName']) {
                        var label = new BMap.Label(data['data'][idx]['labelName'], {offset: new BMap.Size(20, -18)});
                        label.setStyle({
                            color: "#fff",
                            fontSize: "12px",
                            backgroundColor: "#fa0",
                            border: "none",
                            padding: "5px 10px",
                            borderRadius: "10px"
                        });
                        marker.setLabel(label);
                    }
//                    this.map.addOverlay(marker);
//                    markers.push(marker);
//                    loader.setMarker(data['data'][idx]['id'], marker)
                }
                /*var markerClusterer = null;
                if(loader.getData()._cluster){//已经存在聚合
                    markerClusterer = loader.getData()._cluster;

                    if(markersOld.length>0)markerClusterer.removeMarkers(markersOld);//清除重复的marker
                    markerClusterer.addMarkers(markers);//添加新的marker
                }else{//还没有聚合

                    markerClusterer = new BMapLib.MarkerClusterer(this.map, {markers:markers});
                    loader.getData()._cluster = markerClusterer;
                }*/
            } else if (data['type'] == 2) {
                for (var idx in data['data']) {
                    var dataItem = data['data'][idx];
                    var picon = this._getIcon(dataItem['icon'], cfg);
                    var point = new BMap.Point(dataItem['lng'], dataItem['lat']);
                    this._doMaxMin(mapData, point);//处理坐标最大最小值

                    var marker = null == picon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: picon});
                    if (dataItem['evt']) {
                        marker.addEventListener("click", dataItem['evt']);
                    }

                    var oldMarker = loader.getMarker(dataItem['id']);
                    if (oldMarker) {
                        this.map.removeOverlay(oldMarker);
                        //oldMarker.dispose(); // 1.1+版本不需要这样调用
                    }
                    this.map.addOverlay(marker);
                    loader.setMarker(dataItem['id'], marker)
                }
            } else if (data['type'] == 3) {
                if (data['data'].length % 4 != 0) {
                    throw new Error('数据不正确');
                }
                var evt = data['evt'], idx = 0;
                while (idx + 4 < data['data'].length) {
                    var picon = this._getIcon(data['data'][idx + 3], cfg);
                    var point = new BMap.Point(data['data'][idx + 1], data['data'][idx + 2]);
                    this._doMaxMin(mapData, point);//处理坐标最大最小值

                    var marker = null == picon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: picon});
                    if (evt) {
                        marker.addEventListener("click", evt);
                    }

                    var oldMarker = loader.getMarker(data['data'][idx]);
                    if (oldMarker) {
                        this.map.removeOverlay(oldMarker);
                        //oldMarker.dispose(); // 1.1+版本不需要这样调用
                    }
                    this.map.addOverlay(marker);
                    loader.setMarker(dataItem['id'], marker)

                    idx += 4;
                }
            } else if (data['type'] == 4) {
                if (data['data'].length % 5 != 0) {
                    throw new Error('数据不正确');
                }
                var idx = 0;
                while (idx + 5 < data['data'].length) {
                    var picon = this._getIcon(data['data'][idx + 3], cfg);
                    var point = new BMap.Point(data['data'][idx + 1], data['data'][idx + 2]);
                    this._doMaxMin(mapData, point);//处理坐标最大最小值

                    var marker = null == picon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: picon});
                    if (data['data'][idx + 4]) {
                        marker.addEventListener("click", data['data'][idx + 4]);
                    }

                    var oldMarker = loader.getMarker(data['data'][idx]);
                    if (oldMarker) {
                        this.map.removeOverlay(oldMarker);
                        //oldMarker.dispose(); // 1.1+版本不需要这样调用
                    }
                    this.map.addOverlay(marker);
                    loader.setMarker(dataItem['id'], marker);

                    idx += 5;
                }
            }
        },
        trace: function (data, cfg, loader) {
            if (data['data'].length % 2 != 0) {
                throw new Error('数据不正确');
            }

            var picon = this._getIcon(data.icon, cfg);
            var points = [], id = data.id, mapData = loader.getData(),
                lineCfg = cfg.lines[data.line],
                marker = null, currMarker = null;
            var polyline = null;
            if (mapData['traceData']) {
                currMarker = mapData['traceData']['_currPoint'];
                points.push(currMarker.getPosition());
                for (var i = 0; i < data['data'].length; i += 2) {
                    var point = new BMap.Point(data['data'][i + 0], data['data'][i + 1]);
                    points.push(point);

                    marker = null == picon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: picon});
                    if (data.evt) {
                        marker.addEventListener("click", data.evt);
                    }
                    this._doMaxMin(mapData, point);
                    this.map.addOverlay(marker);

                    mapData['traceData']['_currPoint'] = marker;
                }
                var polyline = null;
                if (lineCfg) {
                    polyline = new BMap.Polyline(points, this._getLineCfg(lineCfg));
                } else {
                    polyline = new BMap.Polyline(points);
                }
                this.map.addOverlay(polyline);
            } else {
                this.map.clearOverlays();
                for (var i = 0; i < data['data'].length; i += 2) {
                    var point = new BMap.Point(data['data'][i + 0], data['data'][i + 1]);
                    points.push(point);

                    marker = null == picon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: picon});
                    if (data.evt) {
                        marker.addEventListener("click", data.evt);
                    }
                    this._doMaxMin(mapData, point);
                    this.map.addOverlay(marker);

                    var traceData = {'_currPoint': marker};
                    mapData['traceData'] = traceData;
                }
                if (points.length > 1) {
                    var polyline = null;
                    if (lineCfg) {
                        polyline = new BMap.Polyline(points, this._getLineCfg(lineCfg));
                    } else {
                        polyline = new BMap.Polyline(points);
                    }
                    this.map.addOverlay(polyline);
                }
            }
        },
        route: function (data, cfg, loader) {
            this._drawLine(data, cfg, loader)
        },
        addRoutePoint: function (data, cfg, loader) {
            var mapData = loader.getData();
            var point = null;
            if (data['type'] == 1) {
                var picon = this._getIcon(data['icon'], cfg);
                for (var idx in data['data']) {
                    point = new BMap.Point(data['data'][idx]['lng'], data['data'][idx]['lat']);
                    var marker = loader.getMarker(data['data'][idx]['id']);
                    if (marker) {
                        if (picon != null) {
                            marker.setIcon(picon);
                        }
                        marker.setPosition(point)
                    } else {
                        marker = null == picon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: picon});
                    }
                    if (data['data'][idx]['direction']) {
                        marker.setRotation(parseInt(data['data'][idx]['direction']))
                    }
                    this.map.addOverlay(marker);
                    loader.setMarker(data['data'][idx]['id'], marker);
                }
            }

            //如果添加的点超出 屏幕 需要对其居中
            if (point) {
                var sg = mapData.swLng;
                var ng = mapData.neLng;
                var st = mapData.swLat;
                var nt = mapData.neLat;

                var pg = point.lng;
                var pt = point.lat;
                if (pt < st || pt > nt || pg < sg || pg > ng) {
                    this.map.setCenter(point);
                }
            }

        },
        autoOpenWin: function (id, loader) {
        	 var n1=new Date();
            var obj = loader.getMarker(id);
            if(obj==null) return;
            var ind = $(obj.Ac).index();
            $(obj.Ac).parent().siblings('div').find('span.BMap_noprint').eq(ind).trigger('click');
             var n2=new Date();
            console.log(n2-n1);
        },
        openWin: function (title, content, source) {
            var infoWindow = new BMap.InfoWindow(content, {enableCloseOnClick: false});
            if (title) {
                infoWindow.setTitle(title);
            }
            this.map.openInfoWindow(infoWindow, source.getPosition());
            //source.openInfoWindow(infoWindow);
        },
        getZoom: function (maxLng, minLng, maxLat, minLat) {
            if (!(maxLng && minLng && maxLat && minLat)) {
                return 12;
            }
            var zoom = ["50", "100", "200", "500", "1000", "2000", "5000", "10000", "20000", "25000", "50000", "100000", "200000", "500000", "1000000", "2000000"]//级别18到3。
            var pointA = new BMap.Point(maxLng, maxLat);  // 创建点坐标A
            var pointB = new BMap.Point(minLng, minLat);  // 创建点坐标B
            var distance = this.map.getDistance(pointA, pointB).toFixed(1);  //获取两点距离,保留小数点后两位
            for (var i = 0, zoomLen = zoom.length; i < zoomLen; i++) {
                if (zoom[i] - distance > 0) {
                    return 18 - i + 3;//之所以会多3，是因为地图范围常常是比例尺距离的10倍以上。所以级别会增加3。
                }
            }
            ;
            return 12;
        },
        setZoom: function (cenLng, cenLat, zoom) {
            return this.map.centerAndZoom(new BMap.Point(cenLng, cenLat), zoom);
        },
        clear: function (loader) {
            this.map.clearOverlays();
            if (loader.getData()._cluster) {
                loader.getData()._cluster.clearMarkers();
            }
            //this.map.clearOverlays();
        },
        clearById: function (marker, win, loader, typeId) {
            if (win != null)
                this.map.closeInfoWindow();
            this.map.removeOverlay(marker);
            if (loader.getData()._cluster) {
                loader.getData()._cluster.removeMarker(marker);
            }
        },
        _drawLine: function (data, cfg, loader) {
            if (data['data'].length % 2 != 0) {
                throw new Error('数据不正确');
            }
            var picon = this._getIcon(data.icon, cfg);
            var startIcon = data.start ? this._getIcon(data.start, cfg) : null;
            var endIcon = data.end ? this._getIcon(data.end, cfg) : null;
            var points = [], id = data.id, mapData = loader.getData(),
                lineCfg = cfg.lines[data.line],
                startMarker = null, endMarker = null;
            for (var i = 0; i < data['data'].length; i += 2) {
                var point = new BMap.Point(data['data'][i + 0], data['data'][i + 1]);
                this._doMaxMin(mapData, point);
                if (i == 0) {
                    startMarker = null == startIcon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: startIcon});
                    if (data.evt) {
                        startMarker.addEventListener("click", data.evt);
                    }
                } else if (i == data['data'].length - 2) {
                    endMarker = null == endIcon ? new BMap.Marker(point) : new BMap.Marker(point, {icon: endIcon});
                    if (data.evt) {
                        endMarker.addEventListener("click", data.evt);
                    }
                } else {
                    //marker = null==picon?new BMap.Marker(point):new BMap.Marker(point, {icon: picon});
                }
                points.push(point);
            }
            var polyline = new BMap.Polyline(points, this._getLineCfg(lineCfg));
            if (data.evt) polyline.addEventListener("click", data.evt);
            this.map.addOverlay(startMarker);
            this.map.addOverlay(endMarker);
            this.map.addOverlay(polyline);
            if (data['id']) {
                loader.setMarker(data['id'], polyline);
                loader.setMarker(data['id'] + '_startMarker', startMarker);
                loader.setMarker(data['id'] + '_endMarker', endMarker);
            }
            this.center(new BMap.Point(data['data'][0], data['data'][1]), 15);
        },
        _getLineCfg: function (lineCfg) {
            var plCfg = {};
            if (lineCfg.color) plCfg.strokeColor = lineCfg.color;
            if (lineCfg.width) plCfg.strokeWeight = lineCfg.width;
            if (lineCfg.opacity) plCfg.strokeOpacity = lineCfg.opacity;
            if (lineCfg.style) plCfg.strokeStyle = lineCfg.style;
            return plCfg;
        },
        _doMaxMin: function (mapData, point) {
            if (mapData['maxLng'] && mapData['minLng'] && mapData['maxLat'] && mapData['minLat']) {
                if (point.lng > mapData['maxLng']) mapData['maxLng'] = point.lng;
                if (point.lng < mapData['minLng']) mapData['minLng'] = point.lng;
                if (point.lat > mapData['maxLat']) mapData['maxLat'] = point.lat;
                if (point.lat < mapData['minLat']) mapData['minLat'] = point.lat;
            } else {
                mapData['maxLng'] = point.lng;
                mapData['minLng'] = point.lng;
                mapData['maxLat'] = point.lat;
                mapData['minLat'] = point.lat;
            }
        },
        _getIcon: function (key, cfg) {
            if (null == key) return null;
            var iconCfg = cfg['icons'][key];
            if (iconCfg == undefined) {
                return;
            } else if (null == iconCfg) {
                debugger
                throw new Error("YcyaMap:icon配置不正确");
            }
            if (iconCfg['offset']) {
                return new BMap.Icon(iconCfg['url'], new BMap.Size(iconCfg['size'][0], iconCfg['size'][1]),
                    {imageOffset: new BMap.Size(iconCfg['offset'][0], iconCfg['offset'][1])});
            } else {
                return new BMap.Icon(iconCfg['url'], new BMap.Size(iconCfg['size'][0], iconCfg['size'][1]));
            }
        },
        draw: function (data, cfg, callback) {
            //实例化鼠标绘制工具
            var styleOptions = this._getLineCfg(cfg.lines[data.line]);
            var drawingManager = new BMapLib.DrawingManager(this.map, {
                isOpen: false,
                drawingToolOptions: {
                    anchor: BMAP_ANCHOR_TOP_RIGHT,
                    offset: new BMap.Size(5, 5),
                    scale: 0.8
                },
                circleOptions: styleOptions,
                polylineOptions: styleOptions,
                polygonOptions: styleOptions,
                rectangleOptions: styleOptions
            });
            drawingManager.addEventListener('overlaycomplete', overlaycomplete);

            function overlaycomplete(e, overlay) {
                drawingManager.close();
                if (typeof callback == "function") {
                    callback(e, overlay);
                }
            }

            drawingManager.setDrawingMode(this._getDrawActionFlag(data.flag));
            drawingManager.open();
        },
        _getDrawActionFlag: function (flag) { //画线-polyline、面-polygon；框选-rectangle、圈选-circle；标点 -marker
            var actionFlag = "";
            if (flag == "marker")
                return BMAP_DRAWING_MARKER;
            else if (flag == "polyline")
                return BMAP_DRAWING_POLYLINE;
            else if (flag == "polygon")
                return BMAP_DRAWING_POLYGON;
            else if (flag == "rectangle")
                return BMAP_DRAWING_RECTANGLE;
            else if (flag == "circle")
                return BMAP_DRAWING_CIRCLE;
        },
        createPoint: function (lng, lat) {
            return new BMap.Point(lng, lat);
        },
        tmp_createOverlay: function (pointArr1, style, cfg, loader, id) {
            /*if(loader.getMarker(id)){
                return;
            }*/
            var pointArr = [];
            for (var i = 0; i < pointArr1.length; i = i + 2) {
                pointArr.push(new BMap.Point(pointArr1[i], pointArr1[i + 1]));
            }
            var styleOptions = this._getLineCfg(cfg.lines[style]);
            var polygon = new BMap.Polygon(pointArr, styleOptions);
            this.map.addOverlay(polygon);
            loader.setMarker(id, polygon);
            if (pointArr[0].lng == pointArr[pointArr.length - 1].lng && pointArr[0].lat == pointArr[pointArr.length - 1].lat) {//起始点相同
                /*
                var pointLng=pointArr[0].lng, //中心经度
                    pointRad=(pointArr[(pointArr.length-1)/2].lat- pointArr[0].lat )/2, //半径
                    pointLat=pointArr[0].lat+pointRad;//中心纬度*/
                var centerPoint = new BMap.Point((pointArr[0].lng + pointArr[parseInt(pointArr.length / 2)].lng) / 2,
                    (pointArr[0].lat + pointArr[parseInt(pointArr.length / 2)].lat) / 2);
                //this.map.setCenter(centerPoint,15);
                this.center(centerPoint, 15);
            } else {
                this.center(pointArr[0], 15);
            }
        },
        createOverlay: function (pointArr, style, cfg, loader, id) {
            /*if(loader.getMarker(id)){
                return;
            }*/
            var styleOptions = this._getLineCfg(cfg.lines[style]);
            var polygon = new BMap.Polygon(pointArr, styleOptions);
            this.map.addOverlay(polygon);
            loader.setMarker(id, polygon);
            if (pointArr[0].lng == pointArr[pointArr.length - 1].lng && pointArr[0].lat == pointArr[pointArr.length - 1].lat) {//起始点相同
                /*
                var pointLng=pointArr[0].lng, //中心经度
                    pointRad=(pointArr[(pointArr.length-1)/2].lat- pointArr[0].lat )/2, //半径
                    pointLat=pointArr[0].lat+pointRad;//中心纬度*/
                var centerPoint = new BMap.Point((pointArr[0].lng + pointArr[parseInt(pointArr.length / 2)].lng) / 2,
                    (pointArr[0].lat + pointArr[parseInt(pointArr.length / 2)].lat) / 2);
                //this.map.setCenter(centerPoint,15);
                this.center(centerPoint, 15);
            } else {
                this.center(pointArr[0], 15);
            }
        },
        openZoomendEvent: function (loader) {
            var cmap = this.map;
            this.map.addEventListener("zoomend", function () {
                var bound = cmap.getBounds();
                var sw = bound.getSouthWest();
                var ne = bound.getNorthEast();
                var mapData = loader.getData();
                var mapData = loader.getData();
                mapData['swLng'] = sw.lng;//西南角
                mapData['neLng'] = ne.lng;//东北角
                mapData['swLat'] = sw.lat;//西南角
                mapData['neLat'] = ne.lat;//东北角
            });
        },
        openMoveendEvent: function (loader) {
            var cmap = this.map;
            this.map.addEventListener("moveend", function () {
                var bound = cmap.getBounds();
                var sw = bound.getSouthWest();
                var ne = bound.getNorthEast();
                var mapData = loader.getData();
                mapData['swLng'] = sw.lng;//西南角
                mapData['neLng'] = ne.lng;//东北角
                mapData['swLat'] = sw.lat;//西南角
                mapData['neLat'] = ne.lat;//东北角
            });
        },
        localSearch: function (callBack) {
            return new BMap.LocalSearch(this.map, { //智能搜索
                onSearchComplete: callBack
            });
        },
        createAutoComplete: function (inputId, resultId, callBack) {
            var ac = new BMap.Autocomplete(//建立一个自动完成的对象
                {"input": inputId, "location": this.map}
            );
            var _this = this;
            ac.addEventListener("onhighlight", function (e) {  //鼠标放在下拉列表上的事件
                var str = "";
                var _value = e.fromitem.value;
                var value = "";
                if (e.fromitem.index > -1) {
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

                value = "";
                if (e.toitem.index > -1) {
                    _value = e.toitem.value;
                    value = _value.province + _value.city + _value.district + _value.street + _value.business;
                }
                str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
                document.getElementById(resultId).innerHTML = str;
            });

            var myValue;
            ac.addEventListener("onconfirm", function (e) {    //鼠标点击下拉列表后的事件
                var _value = e.item.value;
                myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                document.getElementById(resultId).innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;
                document.getElementById(resultId).setAttribute('data-value', myValue);
                callBack();
            });
            return ac;
        },
        getLngAndLat: function (inputId, resultId) {
            /*
            * param {inputId} 地图上选择地点的input Id
            * param {resultId} 地图上存放地点以及经纬度的容器 Id
            * */
            var geoc = new BMap.Geocoder();
            this.map.addEventListener("click", function (e) {
                var pt = e.point;
                geoc.getLocation(pt, function (rs) {
                    var addComp = rs.addressComponents;
                    var elm = document.getElementById(resultId),
                        inputElm = document.getElementById(inputId);
                    elm.setAttribute('data-lng', e.point.lng);
                    elm.setAttribute('data-lat', e.point.lat);
                    inputElm.value = (addComp.province + ", " + addComp.city + ", " + addComp.district + ", " + addComp.street + ", " + addComp.streetNumber);

                });
            });
        }
    };
    ycya._BaiduMap = _BaiduMap;
})(window);

