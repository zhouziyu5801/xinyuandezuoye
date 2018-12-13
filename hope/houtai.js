const express = require("express");
const http = express();
const bodyParser = require("body-parser")
const Db = require("./js/db.js")
const db = new Db("xinyuan")
http.listen(8080, () => {
	console.log("run")
})
http.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	next();
})
http.use(bodyParser.urlencoded({extended: false}));
//提交愿望
http.post("/add", (req, res) => {
	let data = req.body;
	db.find("xxy", {
		query: {
			xinyuan: data.xinyuan
		}
	}, (err, data1) => {
		if(data1.length == 0) {
			data.time = new Date().getTime();
			data.gouxuan = "white";
			db.insertOne("xxy", data, (err, data2) => {
				if(err) throw err;
				res.send({
					status: "1",
					statusText: "许愿成功"
				})
			})
		} else {
			res.send({
				status: "-1",
				statusText: "愿望重复，请重新输入"
			})
		}

	})
})
http.get("/show", (req, res) => {
	db.find("xxy", {}, (err, data) => {
		if(data.length == 0) {
			res.send({
				status: "0",
				statusText: "快许愿吧"
			})
		} else {
			quchong(data)
			if(data.length > 8) {
				let newArr = data.slice(0, 8)
				res.send({
					status:"8",
					newArr
				})
			}else{
				res.send({
					status:"5",
					data
				})
			}
		}
	})
})
http.get("/del", (req, res) => {
	let data = req.query;
	db.deleteById("xxy", data._id, (err, data1) => {
		if(err) throw err;
		res.send("删除成功")
	})
})
function quchong(arr){
	var temp;
	for (var i = 0; i < arr.length; i++) {
		var index=parseInt(Math.random()*(arr.length))
		temp=arr[index]
		arr[index]=arr[i]
		arr[i]=temp
	}
	return arr;
}
http.get("/sx", (req, res) => {
	let data = req.query;
	//	console.log(data)
	db.findById("xxy", data._id, (err, data1) => {
		if(data1.gouxuan == "white") {
			db.updateById("xxy", data1._id, {
				gouxuan: data.gouxuan
			}, (err, data1) => {
				if(err) throw err;
				res.send({
					status: "2"
				})
			})
		} else {
			res.send({
				status: "-2"
			})
		}
	})
})