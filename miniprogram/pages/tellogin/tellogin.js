// pages/tellogin/tellogin.js
const util = require('../../utils/tools.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    routerFrom:0,   // 通过哪个路由调用该页面，0为手机验证码登录；1为微信登陆后绑定手机
    titleWords:"",
    loginWords:"登录",
    weiChatAuthUserId:"",
    send: false,
    alreadySend: false,
    showTxt: true,
    second: 60,
    disabled: true,
    buttonType: 'default',
    phoneNum: '',
    code: '',

    userInfo:'',
    nickName:'',
    avatarUrl:'',
    gender:'', //性别 0：未知、1：男、2：女
    province:'',
    city:'',
    country:''
  },
  getCode: function() {
    console.log('yzm')
  },
  // 手机号部分
  inputPhoneNum: function(e) {
    let phoneNum = e.detail.value
    if (phoneNum.length === 11) {
      let checkedNum = this.checkPhoneNum(phoneNum)
      if (checkedNum) {
        this.setData({
          phoneNum: phoneNum
        })
        console.log('phoneNum' + this.data.phoneNum)
        this.showSendMsg()
        this.activeButton()
      }
    } else {
      this.setData({
        phoneNum: ''
      })
      this.hideSendMsg()
    }
  },

  checkPhoneNum: function(phoneNum) {
    let str = /^1\d{10}$/
    if (str.test(phoneNum)) {
      return true
    } else {
      wx.showToast({
        title: '手机号不正确',
        image: '/images/fail.png'
      })
      return false
    }
  },

  showSendMsg: function() {
    if (!this.data.alreadySend) {
      this.setData({
        send: true
      })
    }
  },

  hideSendMsg: function() {
    this.setData({
      send: false,
      disabled: true,
      buttonType: 'default'
    })
  },

  sendMsg: function() {
    var phoneNum = this.data.phoneNum;
    //var sessionId = wx.getStorageSync('sessionId');
    // wx.request({
    //     url: `${config.api + '/sendSms.html'}`,
    //     data: {
    //         phoneNum: phoneNum
    //     },
    //     header: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //         "Cookie": sessionId
    //     },
    //     method: 'POST',
    //     success: function (res) {
    //         console.log(res)
    //     }
    // })
    this.setData({
      alreadySend: true,
      send: false,
      showTxt: false
    })
    this.timer()
  },

  timer: function() {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          this.setData({
            second: this.data.second - 1
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              alreadySend: false,
              send: true,
              showTxt: true
            })
            resolve(setTimer)
          }
        }, 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },

  // 验证码
  addCode: function(e) {
    this.setData({
      code: e.detail.value
    })
    this.activeButton()
    console.log('code' + this.data.code)
  },

  // 按钮
  activeButton: function() {
    let {
      phoneNum,
      code
    } = this.data
    console.log(code)
    if (phoneNum && code) {
      this.setData({
        disabled: false,
        buttonType: 'primary'
      })
    } else {
      this.setData({
        disabled: true,
        buttonType: 'default'
      })
    }
  },
  loginSuccess: function(res) {
    console.log(res);
    // try {
    //   wx.setStorageSync('user', 'wyq');
    // } catch (e) {};
    //app.globalData.token = res.data.data.token;
    
    if (res.data.data.weiChatAuthUserId){

      var storgeName = ['avatarUrl', 'nickName', 'bindwx', 'shareId','isLogin'];
      var storgeVal = [res.data.data.weiChatAuthUser.avatarUrl, res.data.data.weiChatAuthUser.nickName,"0",res.data.data.phone,true];
      for (var i = 0; i < storgeName.length; i++){
        wx.setStorage({
          key: storgeName[i],
          data: storgeVal[i]
        })
      }

      
      
    }else{
      wx.setStorage({
        key: "bindwx",
        data: "1"
      })
    }

    wx.setStorage({
      key: "token",
      data: res.data.data.token,
      success:function(){
        wx.navigateBack({
          delta: 2
        })
      }
    })
    
  },
  onSubmit: function() {
    var phoneNum = this.data.phoneNum;
    var code = this.data.code;
    // wx.getUserInfo({
    //   success: function (res) {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       nickName: userInfo.nickName,
    //       avatarUrl: userInfo.avatarUrl,
    //       gender: userInfo.gender, //性别 0：未知、1：男、2：女
    //       province: userInfo.province,
    //       city: userInfo.city, 
    //       country: userInfo.country
    //     })
        
    //   }
    // })
    // 手机验证码登录请求
    if (this.data.routerFrom == 1){
      var params = {
        phone: this.data.phoneNum,
        code: this.data.code,
        weiChatAuthUserId: this.data.weiChatAuthUserId
      }
    }else{
      var params = {
        phone: this.data.phoneNum,
        code: this.data.code
      }
    }
    
    util.doRequestP(util.webapi.phoneLogin, params, this.loginSuccess);

    // var otherInfo = this.data.otherInfo;
    // var sessionId = wx.getStorageSync('sessionId');
    // wx.request({
    //     url: `${config.api + '/addinfo.html'}`,
    //     data: {
    //         phoneNum: phoneNum,
    //         code: code
    //     },
    //     header: {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //         "Cookie": sessionId
    //     },
    //     method: 'POST',
    //     success: function (res) {
    //         console.log(res)

    //         if ((parseInt(res.statusCode) === 200) && res.data.message === 'pass') {
    //             wx.showToast({
    //                 title: '验证成功',
    //                 icon: 'success'
    //             })
    //         } else {
    //             wx.showToast({
    //                 title: res.data.message,
    //                 image: '../../images/fail.png'
    //             })
    //         }
    //     },
    //     fail: function (res) {
    //         console.log(res)
    //     }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options);
    if (options.weiChatAuthUserId){
      this.setData({
        routerFrom: 1,   // 通过哪个路由调用该页面，0为手机验证码登录；1为微信登陆后绑定手机
        titleWords: "请绑定手机",
        loginWords: "绑定并登录",
        weiChatAuthUserId: options.weiChatAuthUserId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})