const app = getApp();
const api = app.globalData.api;
// pages/roster/roster.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isEmpty: 0,
    memberlist:[]
  },
  uploadexcel:function(){
    var that = this;
    wx.chooseMessageFile({
      count: 1,
      type:'file',
      success(res) {
        const tempFilePaths = res.tempFiles;
        console.log(tempFilePaths)
        wx.uploadFile({
          url: api.webapi.excelUpload, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0].path,
          name: 'file',
          header: {
            // 'content-type': 'application/x-www-form-urlencoded' // 默认值
            "content-type": "application/json",
            token: wx.getStorageSync("token")
          },
          // formData: {
          //   file: tempFilePaths[0]
          // },
          success(res) {
            console.log(res)
            const data = res.data;
            that.onLoad();
            //do something
          },
          fail(res){
            console.log(res)
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },
  async init(){
    await api.showLoading() // 显示loading
    var memberlist = await api.getData(api.webapi.memberlist);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if (api.reshook(memberlist, this.route)) {
      this.renderList(memberlist)
    }
  },    
  renderList:function(res){
    console.log(res);
    if (res.data.length == 0) {
      this.setData({
        isEmpty: 1,
        memberlist: res.data
      })
    } else {
      this.setData({
        isEmpty: 0,
        memberlist: res.data
      })
    }
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