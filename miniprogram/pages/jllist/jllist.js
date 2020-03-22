// pages/jllist/jllist.js
const util = require('../../utils/tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type == 'chuangjian'){
      var params = {

      };
      util.doRequest(util.webapi.jielonglist, params, this.jielongList);
    }

    if (options.type == 'canyu') {
      var params = {

      };
      util.doRequest(util.webapi.jielonglistcy, params, this.jielongList);
    }

    
  },
  jielongList:function(res){
    console.log(res);
    console.log(res.data.resultCode);
    if (res.data.resultCode == 4001){
      wx.navigateTo({
        url: '/pages/wxlogin/wxlogin',
      })
    }
    this.setData({
      list:res.data.data
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  gotoDetail:function(e){
    console.log(e.currentTarget.dataset.id);
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/jldetail/jldetail?id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/wxlogin/wxlogin',
      })
    }
  },

  gotoTableDetail:function(e){
    if (wx.getStorageSync('token')) {
      wx.navigateTo({
        url: '/pages/tablefill/tablefill?id=' + e.currentTarget.dataset.id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/wxlogin/wxlogin',
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
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