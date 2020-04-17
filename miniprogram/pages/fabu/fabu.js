// pages/fabu/fabu.js
var app = getApp();
const api = app.globalData.api;
const isAdd = app.isAdd()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showcodeimg:false,
    bufferImg:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!app.isLogin()){
      var data = {
        url:'pages/fabu/fabu'
      }
      var origin = app.encodeData(data);
      wx.navigateTo({
        url: '/pages/wxlogin/wxlogin?'+origin
      })
    }else{
      // if (api.tokenOvertime()){
        this.init()
      // }
    }
  },
  async init(){
    await api.showLoading();
    var loginres = await api.getData(api.webapi.isLogin);
    await api.hideLoading();
    if (api.reshook(loginres, this.route)){
      console.log(loginres.data.accessToken)
      console.log(loginres.data.accessTokenDate)
      api.getaccessToken(loginres.data.accessToken, loginres.data.accessTokenDate,loginres.data.timestamp)
    }
  },
  cloudtest:function(){
    var that = this;
    wx.cloud.callFunction({
      name: 'creatcode',
      data: {
        scene: 'from=twocode',
        page: 'pages/fabu/fabu'
      }
    }).then(res => {
      console.log(res)
      console.log(res.result)
      console.log(res.result.result)

      let bufferImg = "data:image/png;base64," + wx.arrayBufferToBase64(res.result.result);
      console.log(bufferImg)
      that.setData({
        bufferImg: bufferImg,
        showcodeimg:true
      })
    }).catch(
      console.error
    )
  },
  showpreview:function(){
    var that = this;
    wx.previewImage({
      urls: [that.data.bufferImg],
    })
  },
  saveimg:function(){
    var that = this;
    wx.downloadFile({
      url: that.data.bufferImg,
      success(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            console.log('saveimg');
            wx.showModal({
              title: '保存成功',
              content: '图片成功保存到相册了，快去发朋友圈吧~',
              showCancel: false,
              confirmText: '确认',
              confirmColor: '#21e6c1',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                }
              }
            })
          }
        })
      }
    })
  },
  jielongEvent:function(){
    wx.navigateTo({
      url: '/pages/jielong/jielong',
    })
  },
  tableEvent:function(){
    wx.navigateTo({
      url: '/pages/table/table',
    })
  },
  toupiaoEvent:function(){
    wx.navigateTo({
      url: '/pages/toupiao/toupiao',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      addState: !app.isAdd()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})