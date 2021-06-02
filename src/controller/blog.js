const   {exec} = require('../db/mysql')
const getList = (author, keyword) => {
let sql  =`select * from  blogs where 1=1 `
if(author){
  sql+=`and author='${author}' `
}
if(keyword){
  sql +=`and title like '%${keyword}%' `
}
sql+=`order by createtime desc;`

return exec(sql)
}
const getDetail  = (id) => {
  let sql = `select * from  blogs where id='${id}'`
  return exec(sql).then(rows=> {
   
    return rows[0]
  })
 
  
}
// 用于处理postData
 const getPostData  = req => {
   const promise  = new Promise((resolve, reject) => {
     if(req.method!=="POST"){
       resolve({})
       return 
     }
     
     if(req.headers['content-type']!="application/json"){
       resolve({})
       return
     }
     let postData  =''
     req.on('data', chunk=> {
       postData+=chunk.toString()
     })
     req.on('end', () =>{
       if(!postData){
         resolve({})
         return
     }
    
     resolve(JSON.parse(postData))  

     })


   })
   return promise
 }
 const newBlog  = (blogData ={}) => {
 const   title = blogData.title;
 const content  = blogData.content;
 const author  = blogData.author;
 const createtime  =  Date.now()
 const sql  =`insert into blogs(title, content,  createtime,author) values('${title}',  '${content}', '${createtime}', '${author}') `

return exec(sql).then(insertData => {
  console.log(1111, insertData)
  return {
    id: insertData.insertId
  }
})

 }
 const updateBlog  = (id, blogData={})=>{
      // blogData 是一个对象包含内容标题, id 是要更新的id
      const title =   blogData.title
      const content  = blogData.content

      const sql  =`update blogs set title='${title}', content='${content}' where id=${id}`
      return exec(sql).then(updateData => {
      console.log('updateData is ', updateData)
      if(updateData.affectedRows > 0){
        return true
      }
      return false
      })
 

 }
 const deleteBlog  = (id, author)=> {
const sql =`delete  from blogs where id  ='${id}' and author ='${author}'`
return exec(sql).then(deleteData => {
  if(deleteData.affectedRows>0){
    return true
  }
  return false
})

 }
module.exports = {
  getList,
  getDetail,
  getPostData,
  newBlog,
  updateBlog,
   deleteBlog
}
