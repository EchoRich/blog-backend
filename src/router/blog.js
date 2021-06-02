const { getList, getDetail, newBlog, updateBlog, deleteBlog } = require("../controller/blog")
const   {SuccessModal, ErrorModal} = require('../model/resModal')

/* eslint-disable*/

//  统一的登录验证函数 
const loginCheck  = (req) => {
   if(!req.session.useName){
     return Promise.resolve(
       new ErrorModal("尚未登录")
     )
   }
}
const handleBlogRouter  =   (req,res) => {
  const method  = req.method
  const path  = req.path
     const id  = req.query.id 
  //获取博客列表 
  if(method=="GET"&&path=="/api/blog/list"){
    const author  = req.query.author ||  ""
    const keyword  =   req.query.keyword || ''
    // const listData  = getList(author, keyword)
    // return new SuccessModal(listData)
    const result  = getList(author, keyword)
   return result.then(listData=> {
     return new SuccessModal(listData) 
    })
  }
  //获取博客详情
  if(method=="GET"&&path=="/api/blog/detail"){
   
    const detailResult  = getDetail(id)
   return detailResult.then(data => {
    
        return new SuccessModal(data)
      }) 
  }
  // 新建一篇博客 
  if(method=="POST"&& path=="/api/blog/new"){
     const loginCheckResult  =    loginCheck(req)
     if(loginCheckResult){
       return loginCheck
     }

req.body.author=req.session.userName
const result  = newBlog(req.body)
   return  result.then(data => {
return new SuccessModal(data)
   })
  }
    // 更新一篇博客 
  if(method=="POST"&& path=="/api/blog/update"){
       const loginCheckResult  =    loginCheck(req)
     if(loginCheckResult){
       return loginCheck
     }
    const result  = updateBlog(id, req.body)
    return result.then(val=> {
      if(val){
        return new SuccessModal()
      }else{
        return new ErrorModal('更新博客失败')
      }
    })
   
   
  }
    // 删除一篇博客 
  if(method=="POST"&& path=="/api/blog/delete"){
       const loginCheckResult  =    loginCheck(req)
     if(loginCheckResult){
       return loginCheck
     }
  
const author=req.session.userName
     const result  = deleteBlog(id, author)
     return result.then(val => {
       if(val){
         return new SuccessModal()
       }
       return new ErrorModal('删除博客失败')
     })
  }

}
module.exports =   handleBlogRouter