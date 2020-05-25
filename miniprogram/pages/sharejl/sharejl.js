
// pages/sharejl/sharejl.js
const app = getApp();
const api = app.globalData.api;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    title:'',
    type:'',
    towCode:'',
    showcodeimg: false,
    bufferImg: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorage({
      key: "shared",
      data: "1"
    })
    this.setData({
      id:options.id,
      title:options.title,
      type:options.type
    })
    console.log(this.data);
  },
  shareJl:function(){
    this.onShareAppMessage()
  },
  cloudtest :function () {
    var that = this;
    var jielongpath;
    if (this.data.type == 1) {
      jielongpath = 'pages/jldetail/jldetail';
    }
    if (this.data.type == 2) {
      jielongpath = 'pages/tablefill/tablefill';
    }
    if (this.data.type == 3) {
      jielongpath = 'pages/toupiaodetail/toupiaodetail';
    }
    console.log(this.data.type);
    console.log(jielongpath);
    wx.showLoading({
      title: '生成中...'
    });
    wx.cloud.callFunction({
      name: 'creatcode',
      data: {
        scene: 'id='+that.data.id,
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
  showpreview: function () {
    var that = this;
    wx.previewImage({
      urls: [that.data.bufferImg],
    })
  },
  creatCode:async function(){
    var that = this;
    var jielongpath;
    if (this.data.type == 1) {
      jielongpath = 'pages/jldetail/jldetail?id=' + this.data.id;
    }
    if (this.data.type == 2) {
      jielongpath = 'pages/tablefill/tablefill?id=' + this.data.id;
    }
    if (this.data.type == 3) {
      jielongpath = 'pages/toupiaodetail/toupiaodetail?id=' + this.data.id;
    }
    wx.cloud.callFunction({
      name: 'creatcode',
      data: {
        scene:'id='+that.data.id,
        page: 'pages/fabu/fabu'
      }
    }).then(res => {
      console.log(res)
      console.log(res.result)
      console.log(res.result.buffer)
    }).catch(
      console.error
    )
    // await api.showLoading();
    // var loginres = await api.getData(api.webapi.isLogin);
    // await api.hideLoading();
    // if (api.reshook(loginres, this.route)){
    //   console.log(loginres.data.accessToken);
    //   var codeImgapi = 'https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=' + loginres.data.accessToken;
    //   var param = {
    //     scene: 123
    //   }
    //   await api.showLoading();
    //   var codeImgres = await api.postDataWx(codeImgapi,param);
    //   await api.hideLoading();
    //   console.log(codeImgres)
    //   this.setData({
    //     towCode: wx.arrayBufferToBase64(codeImgres.data)
    //   })
    //   // wx.setStorage({
    //   //   key: "accessToken",
    //   //   data: "value"
    //   // })
    // }
  },
  enterjielong:function(){
    if(this.data.type == 1){
      wx.navigateTo({
        url: '/pages/jldetail/jldetail?id='+this.data.id
      })
    }
    if(this.data.type == 2){
      wx.navigateTo({
        url: '/pages/tablefill/tablefill?id='+this.data.id,
      })
    }
    if(this.data.type == 3){
      wx.navigateTo({
        url: '/pages/toupiaodetail/toupiaodetail?id='+this.data.id,
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
    var nickName = wx.getStorageSync('nickName');

    var jielongImg = '';
    var jielongpath = "";
    if(this.data.type == 1){
      jielongImg = '../../img/jielong.jpg';
      jielongpath = 'pages/jldetail/jldetail?id='+this.data.id;
    }
    if (this.data.type == 2) {
      jielongImg = '../../img/jielong3.jpg';
      jielongpath = 'pages/tablefill/tablefill?id='+this.data.id;
    }
    if (this.data.type == 3) {
      jielongImg = '../../img/jielong5.jpg';
      jielongpath = 'pages/toupiaodetail/toupiaodetail?id=' + this.data.id;
    }
    return {
      title: this.data.title+ '------创建者【' + nickName + '】',
      path: jielongpath,
      imageUrl: jielongImg,
      success: (res) => {
        console.log("转发成功", res);
        wx.navigateTo({
          url: '/pages/fabu/fabu',
        })
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})