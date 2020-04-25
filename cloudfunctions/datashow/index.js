// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数  用户云存储中的学习资料数据展示
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const db = cloud.database()
  exports.main = async (event, context) => {
    
  }
  return await db.collection('dataList').where({
    sid: event.sid
  }).orderBy('ordernum', 'asc').get()
  // return {
  //   event,
  //   openid: wxContext.OPENID,
  //   appid: wxContext.APPID,
  //   unionid: wxContext.UNIONID,
  // }
}