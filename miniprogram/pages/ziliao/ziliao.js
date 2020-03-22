// pages/ziliao/ziliao.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ziliaoList: [],
    yeararray: [],
    ispickeryear: false,
    coursearray: [],
    ispickercourse: false,
    verarray: [],
    yearindex: '',
    courseindex: '',
    isEmpty: 0,
    isDefault: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // db.collection('ziliao').get().then(data => { 
    //   console.log(data);
    //   this.setData({
    //     ziliaoList:data.data
    //   })
    // })
    db.collection('screen').get().then(data => {
      console.log(data);
      this.setData({
        yeararray: data.data[0].year,
        coursearray: data.data[0].course,
      })
      console.log(this.data.yeararray)
    })

  },
  bindPickerChange1: function (e) {
    console.log(e.detail.value);
    this.setData({
      ispickeryear: true,
      yearindex: e.detail.value
    })
  },
  bindPickerChange2: function (e) {
    console.log(e.detail.value);
    this.setData({
      ispickercourse: true,
      courseindex: e.detail.value
    })
  },
  searchEvent: function () {
    // 
    var yeardata = this.data.yeararray[this.data.yearindex];
    var coursedata = this.data.coursearray[this.data.courseindex];
    if (yeardata && coursedata) {
      console.log(yeardata);
      console.log(coursedata);
      wx.showLoading({
        title: "加载中"
      });
      db.collection('ziliao').where({
        tips: yeardata,
        course: coursedata
      }).get().then(data => {
        // console.log(data);
        wx.hideLoading();
        this.setData({
          isDefault: 0
        })
        if (data.data.length == 0) {
          this.setData({
            isEmpty: 1,
            ziliaoList: data.data,
          })
        } else {
          this.setData({
            isEmpty: 0,
            ziliaoList: data.data
          })
        }


      })
    } else {
      wx.showToast({
        title: '年级与科目不可为空',
        icon: 'none',
        duration: 1000
      })
    }
  },
  gotoaudio: function (e) {
    console.log(e.currentTarget.dataset);
    var curdata = e.currentTarget.dataset;
    var datadetail = {
      sid: curdata.sid,
      title: curdata.title,
      type: curdata.type
    }
    var dataparams = Object.keys(datadetail).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(datadetail[key]);
    }).join("&");
    console.log(dataparams);
    console.log();
    wx.navigateTo({
      url: '/pages/zllist/zllist?' + dataparams
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