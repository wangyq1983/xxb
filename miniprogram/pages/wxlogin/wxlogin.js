// pages/wxlogin/wxlogin.js
const app = getApp();
const api = app.globalData.api;
// const regeneratorRuntime = require('../../utils/runtime.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    bdPhone:false,
    origin:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if(options.url){
      this.setData({
        origin:options
      })
    }
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials:true,
            success: function (res) {
              console.log(res.userInfo);
              console.log(res.rawData);
              console.log(res.signature);
              console.log(res.encryptedData);
              console.log(res.iv);
            }
          })
        }
      }
    })
  },
  bindGetUserInfo(e) {
    console.log(e.detail.userInfo);
    var userinfo = e.detail.userInfo;
    var otherInfo = {
      rawData: e.detail.rawData,
      signature: e.detail.signature,
      encryptedData: e.detail.encryptedData,
      iv:e.detail.iv
    }
    var that = this;
    wx.login({
        async success(ress) {
          console.log(ress);
          var code = {
            code:ress.code
          };
          Object.assign(userinfo, code, otherInfo);
          var params = userinfo;
          console.log(params);
          // util.doRequestP(util.webapi.wxLogin, params, that.loginSuccess);
          await api.showLoading() // 显示loading
          const logininfo = await api.postData(api.webapi.wxLogin,params);
          await api.hideLoading() // 等待请求数据成功后，隐藏loading
          if(api.reshook(logininfo,this.route)){
            that.loginSuccess(logininfo)
          }
          
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  gotoziliao:function(){
    wx.switchTab({
      url: '/pages/ziliao/ziliao',
    })
    
  },
  onReady: function () {

  },
  getPhoneNumber(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  loginSuccess: function (res) {
    console.log(res);
    if(res.resultCode == 1224){
      var weiChatAuthUserId = res.data.weiChatAuthUserId;
      wx.navigateTo({
        url: '/pages/tellogin/tellogin?weiChatAuthUserId=' + weiChatAuthUserId,
      })
    }else{
      var that = this;
      var storgeName = ['avatarUrl', 'nickName', 'bindwx', 'shareId','isLogin','userId'];
      var storgeVal = [res.data.weiChatAuthUser.avatarUrl, res.data.weiChatAuthUser.nickName, "0", res.data.phone,true,res.data.userId];
      for (var i = 0; i < storgeName.length; i++) {
        wx.setStorage({
          key: storgeName[i],
          data: storgeVal[i]
        })
      }
      console.log(that.data.origin)
      var url = decodeURIComponent(that.data.origin.url);
     

      wx.setStorage({
        key: "token",
        data: res.data.token,
        success: function () {
          if(url == 'pages/fabu/fabu' || url == 'pages/my/my'){
            wx.switchTab({
              url: '/'+url
            })
          }else{
            
            var id = decodeURIComponent(that.data.origin.id);
            console.log('id=');
            console.log(id);
            console.log('url=');
            console.log(url)
            
            if(id == 'undefined' && url == 'undefined'){
              console.log('url is null')
              wx.switchTab({
                url: '/pages/fabu/fabu',
              })
            }else{
              if(id == 'undefined'){
                wx.redirectTo({
                  url: '/' + url
                })
              }else{
                wx.redirectTo({
                  url: '/'+ url + '?id=' + id
                })
              }
              
            }
          }
        
        }
      })


    }
  },
  tellogin:function(){
    wx.navigateTo({
      url: '/pages/tellogin/tellogin'
    })
  },
  wxlogin:function(){
    
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