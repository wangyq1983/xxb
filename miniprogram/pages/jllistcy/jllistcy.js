// pages/jllist/jllist.js
const app = getApp()
const api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isEnd:false,
    dataStep:20,
    isEmpty: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },
  async init(){
    var params = {
      from:1,
      count:this.data.dataStep
    }
    await api.showLoading() // 显示loading
    var cjlist = await api.getData(api.webapi.jielonglistcy,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(cjlist,this.route)){
      this.renderList(cjlist)
    }
  },
  renderList(res){
    if(res.data.length == 0){
      this.setData({
        isEmpty:1,
        list: res.data
      })
    }else{
      this.setData({
        isEmpty:0,
        isEnd:(res.data.length < this.data.dataStep) ? true : false,
        list: (this.data.list.length == 0) ? res.data : this.data.list.concat(res.data)
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotomy:function(){
    wx.switchTab({
      url: '/pages/my/my',
    })
  },
  gotoDetail: function (e) {
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/jldetail/jldetail?id=' + e.currentTarget.dataset.id,
    })
  },

  gotoTableDetail: function (e) {
    wx.navigateTo({
      url: '/pages/tablefill/tablefill?id=' + e.currentTarget.dataset.id,
    })
  },
  gotoToupiaoDetail:function(e){
    wx.navigateTo({
      url: '/pages/toupiaodetail/toupiaodetail?id=' + e.currentTarget.dataset.id,
    })
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
  onReachBottom: async function () {
    let params = {
      from:this.data.list.length + 1,
      count:this.data.dataStep
    }
    if (this.data.isEnd !== true) {  
      await api.showLoading() // 显示loading
      var cjlist = await api.getData(api.webapi.jielonglist,params);
      await api.hideLoading() // 等待请求数据成功后，隐藏loading
      if(api.reshook(cjlist,this.route)){
        this.renderList(cjlist)
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})