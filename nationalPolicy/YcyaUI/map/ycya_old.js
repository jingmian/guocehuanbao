function checkNull(fields) {
    for(var fIdex in fields){
        if(null==fields[fIdex] || fields[fIdex]==''){
            return false;
        }
    }
    return true;
}

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}

function getContentPath(){
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    return result;
}

function getJsPath(){
	var a = {},expose = +new Date(),
	rExtractUri = /((?:http|https|file):\/\/.*?\/[^:]+)(?::\d+)?:\d+/,
	isLtIE8 = ('' + document.querySelector).indexOf('[native code]') === -1;
	// FF
	if (navigator.userAgent.indexOf('Firefox') >= 0){
		//return document.URL+"map/js";
		var ctx=lx.getRootPath()+'/gchbWeb/webclient/YcyaUI/map';
		return ctx;
	}
	//Chrome
	if (document.currentScript){
		var fullPath = document.currentScript.src;
		return fullPath.substring(0,fullPath.lastIndexOf('/'));
	}

	var stack;
	try{
		a.b();
	}catch(e){
		stack = e.fileName || e.sourceURL || e.stack || e.stacktrace;
	}
	// IE10
	if (stack){
		var absPath = rExtractUri.exec(stack)[1];
		if (absPath){
			return absPath.substring(0,absPath.lastIndexOf('/'));
		}
	}

	// IE5-9
	for(var scripts = document.scripts,
		i = scripts.length - 1,
		script; script = scripts[i--];){
		if (script.className !== expose && script.readyState === 'interactive'){
			script.className = expose;
			// if less than ie 8, must get abs path by getAttribute(src, 4)
			var fullPath = isLtIE8 ? script.getAttribute('src', 4) : script.src;
			return fullPath.substring(0,fullPath.lastIndexOf('/'));
		}
	}
}

//为IE等不支持forEach的浏览器扩展
if(!Array.prototype.forEach){
    Array.prototype.forEach = function(fun /*, thisp*/) {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var thisp = arguments[1];
        for (var i = 0; i < len; i++){
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}

(function(ycya){
	var Interface = function(name,methods){
		if(arguments.length!=2){
	        throw new Error("Interface constructor called with "+arguments.length+"arguments,but expected exactly 2");
	    }
	    this.name = name;
	    this.methods = [];
	    for(var i=0;i<methods.length;i++){
	        if(typeof methods[i] !== 'string'){
	            throw new Error('Interface constructor expects mothed names to be'+'passes in as a string');
	        }
	        this.methods.push(methods[i]);
	    }
	};
	Interface.prototype = {
		ensureImplements: function(objs){
			if(agruments.length != 1){
		        throw new Error("Interface constructor called with "+arguments.length+"arguments,but expected exactly 1")
		    }
		    for(var i=0;i<objs.length;i++){
		         var obj = objs[i];
		         for(var j=0;j<this.motheds.length;j++){
		               var mothed = this.methods[j];
		               if(!obj[mothed] || !typeof obj[mothed] !== 'function'){
		                    throw new Error('Function Interface.ensureImplements:implements interface'+this.name+',obj.mothed'+mothed+'was not found');
		               }
		         }
		    }
		}
	};
	ycya.Interface = Interface;
})(window);

(function(ycya){
	var uid = 1;
	var Jas = function(){
		this.map = {};
		this.rmap = {};
	};
	var indexOf = Array.prototype.indexOf || function(obj){
		for (var i=0, len=this.length; i<len; ++i){
			if (this[i] === obj) return i;
		}
		return -1;
	};
	var fire = function(callback, thisObj){
		setTimeout(function(){
			callback.call(thisObj);
		}, 0);
	};
	Jas.prototype = {
		waitFor: function(resources, callback, thisObj){
			var map = this.map, rmap = this.rmap;
			if (typeof resources === 'string') resources = [resources];
			var id = (uid++).toString(16); // using hex
			map[id] = {
				waiting: resources.slice(0), // clone Array
				callback: callback,
				thisObj: thisObj
			};

			for (var i=0, len=resources.length; i<len; ++i){
				var res = resources[i],
					list = rmap[res] || (rmap[res] = []);
				list.push(id);
			}
			return this;
		},
		trigger: function(resources){
			if (!resources) return this;
			var map = this.map, rmap = this.rmap;
			if (typeof resources === 'string') resources = [resources];
			for (var i=0, len=resources.length; i<len; ++i){
				var res = resources[i];
				if (typeof rmap[res] === 'undefined') continue;
				this._release(res, rmap[res]); // notify each callback waiting for this resource
				delete rmap[res]; // release this resource
			}
			return this;
		},
		_release: function(res, list){
			var map = this.map, rmap = this.rmap;
			for (var i=0, len=list.length; i<len; ++i){
				var uid = list[i], mapItem = map[uid], waiting = mapItem.waiting,
					pos = indexOf.call(waiting, res);
				waiting.splice(pos, 1); // remove
				if (waiting.length === 0){ // no more depends
					fire(mapItem.callback, mapItem.thisObj); // fire the callback asynchronously
					delete map[uid];
				}
			}
		}
	};
	ycya.Jas = Jas; // Jas is JavaScript Asynchronous (callings) Synchronizer
})(window);

(function(ycya){
	var YcyaLoader = function(){
		this.classcodes = [];
	};
	YcyaLoader.prototype = {
		loadFileList:function(_files,succes){
	        var FileArray=[];
	        if(typeof _files==="object"){
	            FileArray=_files;
	        }else{/*如果文件列表是字符串，则用,切分成数组*/
	            if(typeof _files==="string"){
	                FileArray=_files.split(",");
	            }
	        }
	        if(FileArray!=null && FileArray.length>0){
	            var LoadedCount=0;
	            for(var i=0;i< FileArray.length;i++){
	            	this.loadFile(FileArray[i],function(){
	                    LoadedCount++;
	                    if(LoadedCount==FileArray.length){
	                        succes();
	                    }
	                })
	            }
	        }
		},
		loadFile: function(url, success) {
			var classcodes = this.classcodes;
	        if (!this._fileExist(classcodes,url)) {
	            var ThisType=this._getFileType(url);
	            var fileObj=null;
	            if(ThisType==".css"){
	            	fileObj=document.createElement('link');
	            	fileObj.href = url;
	            	fileObj.type = "text/css";
	            	fileObj.rel="stylesheet";
	            }else if(ThisType==".less"){
		            fileObj=document.createElement('link');
		            fileObj.href = url;
		            fileObj.type = "text/css";
		            fileObj.rel="stylesheet/less";
	            }else{
	            	fileObj=document.createElement('script');

					fileObj.src = url;

	            }
	            success = success || function(){};
	            fileObj.onload = fileObj.onreadystatechange = function() {
	                if (!this.readyState || 'loaded' === this.readyState || 'complete' === this.readyState) {
	                    success();
	                    classcodes.push(url)
	                }
	            };
				document.getElementsByTagName("head")[0].appendChild(fileObj);
	        }else{
	            success();
	        }
	    },
	    _getFileType: function(url){
	        if(url!=null && url.length>0){
	            return url.substr(url.lastIndexOf(".")).toLowerCase();
	        }
	        return "";
	    },
	    _fileExist: function(FileArray,_url){//判断文件是否已经加载
	    	return FileArray.indexOf(_url)!=-1;
	    }
	};
	ycya.YcyaLoader = YcyaLoader;
})(window);
