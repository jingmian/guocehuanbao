$(function(){
	var setting;
	var linseNoArr=[];
	var linseNoArr2=[];
	var nodes=[{id:1, pId:0,name:'川A0'}];
	var node2=[{id:1, pId:0,name:'川A0'}];
	for(var i=0;i<10000;i++){
		linseNoArr.push('川A'+i);
		if(i==0){
			nodes[nodes.length]={id:1,pId:0,name:'川A'+i}
		}else{
			nodes[nodes.length]={id:parseInt('1'+i),pId:1,name:'川A'+i}
		}
	}
	for(var i=10000;i<20000;i++){
		linseNoArr2.push('川B'+i)
		if(i==10000){
			node2[node2.length]={id:1,pId:0,name:'川B'+i}
		}else{
			node2[node2.length]={id:parseInt('1'+i),pId:1,name:'川B'+i}
		}
	}

	
	/*功能函数*/
	function loadTree() {
		setting = {
			view:{
				showIcon:false
			},
			data:{
				simpleData:{
					enable: true,
					pIdKey: "pId",
					rootPId: 0
				}
			},
			callback:{
	            onClick:function(event,treeId,NowtreeNode,clickFlag){
	                updateTree(event,treeId,NowtreeNode,clickFlag);
	            }
        	}
		};
		$.fn.zTree.init($("#testTree"), setting, openNodes(nodes));
	}
	function loadLi(){
		var str='';
		for(var j=0;j<10000;j++){
			str+='<li data-id="'+linseNoArr[j]+'">'+linseNoArr[j]+'</li>';
		}
		$('#testUl').html(str)
	}
	function loadSpan(){
		var str='';
		for(var j=0;j<10000;j++){
			str+='<span data-id="'+linseNoArr[j]+'">'+linseNoArr[j]+'</span>';
		}
		$('#spanBox').html(str)
	}
	function openNodes(arr){
		for(var i=0;i<arr.length;i++){
			arr[i].open=true;
		}
		return arr;
	}

	function updateTree(){
		//销毁树
		console.time('ztree-destroy-in')
		$.fn.zTree.destroy("testTree");
		console.timeEnd('ztree-destroy-in');
		
		//重新加载树
		$.fn.zTree.init($("#testTree"), setting, openNodes(node2));	
	}
	function updateLi(){
		//清空ul
		console.time('li-destroy-in')
		$('#testUl').html('');
		console.timeEnd('li-destroy-in');
		

		var str='';
		for(var j=0;j<10000;j++){
			str+='<li data-id="'+linseNoArr2[j]+'">'+linseNoArr2[j]+'</li>';
		}
		$('#testUl').html(str)

	}
	function updateSpan(){
		//清空div
		console.time('span-destroy-in')
		$('#spanBox').html('');
		console.timeEnd('span-destroy-in');
		

		var str='';
		for(var j=0;j<10000;j++){
			str+='<span data-id="'+linseNoArr2[j]+'">'+linseNoArr2[j]+'</span>';
		}
		$('#spanBox').html(str)
	}
	/*初始化加载5000节点*/
	console.time('ztree');
	loadTree();
	console.timeEnd('ztree');
	console.log('----------------------------')

	console.time('li');
	loadLi();
	console.timeEnd('li');
	console.log('----------------------------')

	console.time('span');
	loadSpan();
	console.timeEnd('span');
	console.log("===============================================")
	/*删除再加载*/
	console.time('ztree-destroy');
	updateTree();
	console.timeEnd('ztree-destroy');
	console.log('----------------------------')

	console.time('li-destroy');
	updateLi();
	console.timeEnd('li-destroy');
	console.log('----------------------------')

	console.time('span-destroy');
	updateSpan();
	console.timeEnd('span-destroy');
	console.log('----------------------------')
})