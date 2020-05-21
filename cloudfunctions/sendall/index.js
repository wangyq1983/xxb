// 云函数入口文件
// 订阅消息测试
const cloud = require('wx-server-sdk')

cloud.init()

// 小程序订阅模板号 i8A5fKcXMFnNHWfAOaImmkoW_poZTf4ansJhr9ezrio

// 云函数入口函数
  exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    try {
      const result = await cloud.openapi.subscribeMessage.send({
        touser: wxContext.OPENID,
        page: 'pages/fabu/fabu',
        lang: 'zh_CN',
        data: {
          thing1: {
            value: "互联网大会"
          },
          thing2: {
            value: "第一届山东互联网大会"
          },
          time3: {
            value: "2019年10月28日 16:00"
          },
          thing4: {
            value: "软件园A楼503"
          }
        },
        templateId: 'i8A5fKcXMFnNHWfAOaImmkoW_poZTf4ansJhr9ezrio',
        miniprogramState: 'developer'
      })
      return result
    } catch (err) {
      return err
    }
  }