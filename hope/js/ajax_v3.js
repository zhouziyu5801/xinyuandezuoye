/*
 * 底层使用promise+原生ajax封装；
 * 接收的参数   配置对象
 * 配置对象的属性
 * 	{
 * 		url:"请求路径", *
 * 		method:"请求方式",  //默认get
 * 		data:"请求数据",  
 * 		header:"请求头"  //application/x-www-form-urlencoded;
 *  }
 * 返回promise对象
 * 例子：
 * 		ajax({
 * 			url:"http://xxxx:8080/xxx",
 * 			method:"post",
 * 			data:{
 * 				username:"xx",
 * 				password:"xxx"
 * 			}
 * 		})
 * 		.then((res)=>{成功回调},(err)=>{失败回调})
 */

function ajax(obj){
	//设置相关默认值
	//默认get请求 
	obj.method = obj.method||"get";
	//默认请求头
	obj.header = obj.header || {"content-type":"application/x-www-form-urlencoded"}
	//处理数据格式
	var str = "";
	if(obj.data){
		//如果有数据
		
		let arr = [];
		for(var k in obj.data){
			arr.push(k+"="+obj.data[k]);
		}
		str = arr.join("&");
	}else{
		//如果没有数据
		str = "";
	}
	return new Promise((resolve,reject)=>{
		let xhr = new XMLHttpRequest();
		if(obj.method.toLowerCase()=="get"){
			xhr.open("GET",obj.url+"?"+str,true);
			xhr.send();
		}else{
			xhr.open(obj.method,obj.url,true);
			for (var k in obj.header) {
				xhr.setRequestHeader(k,obj.header[k]);
			}
			xhr.send(str);
		}
		//箭头状态
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >=200&&xhr.status<300 || xhr.status == 304){
					resolve(xhr.responseText);
				}else{
					reject(xhr.status)
				}
			}
		}
	})
}

/*
 * api
 * url:"请求路径"，
 * data:"发送参数"
 * 
 * 返回 promise对象
 */
ajax.get = function(url,data){
	let str = "";
	let arr = [];
	for(var k in data){
		arr.push(k+"="+data[k]);
	}
	str = arr.join("&");
	return new Promise((resolve,reject)=>{
		var xhr = new XMLHttpRequest();
		xhr.open("get",url+"?"+str,true);
		xhr.send();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >=200&&xhr.status<300 || xhr.status == 304){
					resolve(xhr.responseText);
				}else{
					reject(xhr.status)
				}
			}
		}
	})
}

/*
 * api
 * url:"请求路径"，
 * data:"发送参数"
 * 
 * 返回 promise对象
 */
ajax.post = function(url,data){
	let str = "";
	let arr = [];
	for(var k in data){
		arr.push(k+"="+data[k]);
	}
	str = arr.join("&");
	return new Promise((resolve,reject)=>{
		var xhr = new XMLHttpRequest();
		xhr.open("post",url,true);
		xhr.setRequestHeader("content-type","application/x-www-form-urlencoded");
		xhr.send(str);
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >=200&&xhr.status<300 || xhr.status == 304){
					resolve(xhr.responseText);
				}else{
					reject(xhr.status)
				}
			}
		}
	})
}

/*
 * url:路径
 * data:数据
 * 返回promise
 * ajax.jsonp("xxx",{xxx})
 * .then(res=>{
 * 	console.log(res);
 * })
 */
ajax.jsonp = function(url,data){
	let str = "";
	let arr = [];
	for(var k in data){
		arr.push(k+"="+data[k]);
	}
	str = arr.join("&")
	return new Promise((resolve,reject)=>{
		window.callback = function(res){
			resolve(res);
		}
		let sc = document.createElement("script");
		if(str){
			str += "&callback=callback"
		}else{
			str = "callback=callback"
		}
		sc.src = url+"?"+str;
		document.body.appendChild(sc);
		sc.remove();
	})
}
