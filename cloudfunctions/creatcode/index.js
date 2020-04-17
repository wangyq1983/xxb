const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init()
exports.main = async (event, context) => {
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      scene: event.scene,
      page:event.page,
      width:430,
    })
    // const buffer = await rp(result.buffer);
    // const upload = await cloud.uploadFile({
    //   cloudPath: 'wxacode.png',
    //   fileContent: buffer,
    // })
    return {
      result:result.buffer
      // wxacodefileID: upload.fileID
    }
  } catch (err) {
    return err
  }
}