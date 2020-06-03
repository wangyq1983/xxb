// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const fileID = event.fileID
  const res = await cloud.downloadFile({
    fileID: fileID,
  })
  const buffer = res.fileContent
  try {
    var result = await cloud.openapi.security.imgSecCheck({
      media: {
        contentType:event.contentType,
        value: buffer
      }
    })
    return result
    // return event
  } catch (err) {
    return err
  }
}
