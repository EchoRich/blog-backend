/* eslint-disable*/
const  {login}  = require('../controller/user')
const {set}= require('../db/redis')

const { SuccessModal, ErrorModal } = require('../model/resModal')
const handleUserRouter  =   (req,res) => {
 
   const method  = req.method
  const path  = req.path
  //登录
  if(method=="POST"&&path=="/api/user/login"){
    const { userName, password} = req.body
      //  const { userName, password} = req.query
       
   const result  =   login(userName, password)
   return result.then(data => {
     if(data.userName){
      //  //操作cookie
      //  res.setHeader('Set-Cookie', `userName=${data.userName};path=/;httpOnly`)
      req.session.userName= data.userName
   
      // res.session.realName = data.realName
      set(req.sessionId, req.session)
       return new SuccessModal()
     }
     return new ErrorModal('登录失败')
   })
 
  }
  // // 登录验证 
  // if(method=="GET"&&req.path=="/api/user/loginTest"){
   
  //   if(req.session.userName){
  //     return Promise.resolve(new SuccessModal({
  //        userName: req.session.userName
  //      }))
  //   }
  //   return Promise.resolve( new ErrorModal('尚未登录'))
  // }
}
module.exports  =   handleUserRouter