const db = wx.cloud.database();
const userInfo = db.collection('userinfo')
const photos = db.collection('photos')


Page({
  /**
   * 页面的初始数据
   */
  data: {
      userInfo:[],
      photos:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(typeof options.id)
    console.log(typeof 'oB4zW5fHlLsB8e8lLqYvsrdiFNTw')
    var openid = options.id.replace(/^\"|\"$/g, ''); //去除两边多余的双引号
    userInfo.where({
        _openid: openid
    }).get().then(res => {
        console.log(res);

        photos.where({
            _openid:openid
        }).get().then(res2 => {
            console.log(res2);
            this.setData({
                userInfo:res.data[0],
                photos:res2.data
            })
            
        })
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