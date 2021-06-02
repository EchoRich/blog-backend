const env  = process.env.NODE_ENV;  // 环境变量 

let MYSQL_CONF ={}
let REDIS_CONF
 if(env=="dev"){
   MYSQL_CONF={
     host: "localhost",
      user: "root",
      password:  "123jiayou",
      port: "3306",
      database: "myblog"
   }
   REDIS_CONF={
     port: 6379,
     host: '127.0.0.1'
   }

 }
 if(env=="prd"){
      MYSQL_CONF={
     host: "localhost",
      user: "root",
      password:  "123jiayou",
      port: "3306",
      database: "myblog"
    }
      REDIS_CONF={
     port: 6379,
     host: '127.0.0.1'
    }


 }
 module.exports={
   MYSQL_CONF, 
   REDIS_CONF
 }