const api = require('./api/index')
App({
  isLogin: function () {
    try {
      var value = wx.getStorageSync('token')
      if (value) {
        // this.setData({
        //   token: value
        // })
        return true;
      }
    } catch (e) {
      return false;
      // Do something when catch error
    }
  },
  isAdd: function () {
    try {
      var value = wx.getStorageSync('isAdd')
      if (value) {
        return true
      }
    } catch (e) {
      return false
      // Do something when catch error
    }
  },
  encodeData: function (datadetail) {
    var dataparams = Object.keys(datadetail).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(datadetail[key]);
    }).join("&");
    return dataparams
  },
  onLaunch: function (options) {
    console.log(options);
    if (wx.cloud) {
      wx.cloud.init({
        traceUser: true
      });
    } else {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    }

    /* 版本自动更新代码 */
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      console.log(res.hasUpdate) // 请求完新版本信息的回调 true说明有更新
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新检测', // 此处可自定义提示标题
        content: '检测到新版本，是否重启小程序？', // 此处可自定义提示消息内容
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '更新提示',
        content: '新版本下载失败',
        showCancel: false
      })
    })
    this.globalData = { 
      userInfo: null,
      api
    }
  }
});
