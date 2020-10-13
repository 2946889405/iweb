//引入第三方提供的express模块
const express=require('express')

//使用第三方模块创建一个web服务器,类似于Tomcat/IIS
let app=express();
//让web服务器监听的指定的端口上
let port=5050 //提示：此处的为新浪云服务器做铺垫
app.listen(port,()=>{
	console.log('Server Listening on Port:',port)
})

//让web服务器可以接收一个特定的请求，并回复该请求
/*
app.get('/index',(req,res)=>{
	res.send('Welecome to My Site Index!')
})
app.get('/login',(req,res)=>{
	res.send('Welecome to My Site Login!')
})
*/
 /*向客户端输出其阿明前十二位的最新课程
//请求方法：Get
请求地址:/course/newest
请求参数：无
响应数据：
[
	{
		cid:3,
		cname:'微信小程序',
		pic:'img/course/03.jpg',
		tname:599
	},
	{
		....
	},
]
*/
const mysql = require('mysql')
//使用第三方模块mysql创建数据库连接池
let pool=mysql.createPool({
	host:'127.0.0.1',//数据库服务器地址
	port:'3306',//数据库端口号
	user:'root',//数据库管理员用户名
	password:'',//管理员登录密码
	database:'iweb',//数据库鸣名称
	connectionLimit:10//翅中连接的最大数量
	
})
	app.get('/course/newest',(req,res)=>{
		//向数据库服务器发送查询请求，获得必需的课程数据：前12条（即从第0行开始读取12行）；且最新课程（即按课程编号由大到小排序）；同时还要跨表查询(同时查询course和teacher两个表)	
		let sql='SELECT cid,cname,iw_course.pic,price,tname,tid FROM iw_course,iw_teacher WHERE iw_course.teacher_id=iw_teacher.tid ORDER BY cid DESC LIMIT 0,12'
		pool.query(sql,(err,result)=>{
			if(err){         //数据库操作执行错误
			console.log('数据库查询失败')
				throw err
			}
			//数据库操作顺利完成，查询结果保存在result中
			console.log('数据库查询成功！')
			//console.log(result)
			//将数据库返回的课程输出发送给客户端
			res.send(result)
		})
		
	})
