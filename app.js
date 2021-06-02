/* eslint-disable*/
const handleBlogRouter  =require('./src/router/blog')
const handleUserRouter =  require('./src/router/user')
const querystring  = require('querystring')
const { getPostData } = require('./src/controller/blog')
 const  {get,set} = require('./src/db/redis')
// session 数据
// const SESSION_DATA={}
  const getCookieExpires=() =>{
    const d  = new Date()
    d.setTime(d.getTime() + (24*60*60*1000))
    console.log('d.toGMTString()',  d.toGMTString())
    return d.toGMTString()
  }

const serverHandle  =   (req,res) => {
  res.setHeader('Content-type', 'application/json') // 返回json格式
  const url  = req.url
  req.path  = url.split('?')[0]
// 解析query
req.query  =   querystring.parse(url.split('?')[1])
//  解析cookie
req.cookie ={}



const cookieStr  = req.headers.cookie || '' // k1=v1

cookieStr.split(';').forEach(item => {
  if(!item){
    return
  }
  const arr  = item.split('=')
  const  key  = arr[0]
const value  =   arr[1] 
req.cookie[key]= value 
});
// // 解析session
// let userId  = req.cookie.userId
// let needSetCookie  = false
// console.log('cookie', req.cookie)
// if(userId){
//   if(!SESSION_DATA[userId]){
//       SESSION_DATA[userId]  = {}
//   }  
// }else{
//   needSetCookie= true
//   userId =`${ Date.now()}-${ Math.random()}`
//   SESSION_DATA[userId] =    {}
// }
//  req.session = SESSION_DATA[userId]
// 解析session使用redis
 let needSetCookie  = false
 let userId  = req.cookie.userId
 if(!userId){
   needSetCookie = true;  
    userId  = `${Date.now()}_${Math.random()}`
    // 初始化session
    set(userId, {})
 }
 req.sessionId  = userId

  // 获取session
  get( req.sessionId).then(sessionData => {

     if(sessionData==null){
       set(req.sessionId,  {})
        req.session = {}  // 设置session
     }else{
       req.session  = sessionData //设置session
     }
 
getPostData(req).then(postData => {
  req.body = postData
  //  处理blog路由 
  const blogResult  =  handleBlogRouter(req,res)
  if(blogResult){
     
    blogResult.then(blogData => {
      if(needSetCookie){
        res.setHeader('Set-Cookie',`userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
      }
   
    return res.end(JSON.stringify(blogData))
      })
  return 
  }
 
 
 
  // 处理user路由
  const userResult  = handleUserRouter(req,res)
  if(userResult){
    userResult.then(userData => {
    
         if(needSetCookie){
        res.setHeader('Set-Cookie',`userId=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
      }
       return res.end(JSON.stringify(userData))
    })
    return
  }


  //未命中返回404
  res.writeHead(404, {"Content-type": "text/plain"})
  res.write('404 not found')
  res.end()
  })
 })

}
module.exports  =   serverHandle
// process.env.NODE_ENV
