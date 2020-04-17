// pages/sharecreat/sharecreat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showcodeimg: false,
    bufferImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var jielongpath;
    if (options.type == 1) {
      jielongpath = 'pages/jldetail/jldetail';
    }
    if (options.type == 2) {
      jielongpath = 'pages/tablefill/tablefill';
    }
    if (options.type == 3) {
      jielongpath = 'pages/toupiaodetail/toupiaodetail';
    }


    wx.showLoading({
      title: '生成中...'
    });
    wx.cloud.callFunction({
      name: 'creatcode',
      data: {
        scene: 'id=' + options.id,
        page: jielongpath
      }
    }).then(res => {
      console.log(res)
      console.log(res.result)
      console.log(res.result.result)
      let bufferImg = "data:image/png;base64," + wx.arrayBufferToBase64(res.result.result);
      console.log(bufferImg)
      wx.hideLoading();
      that.setData({
        bufferImg: bufferImg,
        showcodeimg: true
      })
    }).catch(
      console.error
    )
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

  },
  showpreview:function(){
    var that = this;
    wx.previewImage({
      urls: [that.data.bufferImg],
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