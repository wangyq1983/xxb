// pages/my/my.js
var app = getApp()
const api = app.globalData.api;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userinfo: {

        },
        token: '',
        bindwx: '',
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        avatarUrl: '',
        nickName: '',
        isLogin: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                    wx.getUserInfo({
                        withCredentials: true,
                        success: function(res) {
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
        
        if(!app.isLogin()){
            this.getIsLogin();
        }
        
    },
    
    bindSuccess: function(res) {
        console.log(res);
        wx.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
        })
        wx.setStorage({
            key: "bindwx",
            data: "0"
        })
        this.setData({
            bindwx: '0'
        })
    },
    

    createJielong:function(){
        wx.navigateTo({
            url: '/pages/jllistcj/jllistcj',
        })
    },
    canyuJielong:function(){
        wx.navigateTo({
            url: '/pages/jllistcy/jllistcy',
        })
    },
    followpublic:function(){
        wx.navigateTo({
            url: '/pages/followpublic/followpublic',
        })
    },
    
    async getIsLogin(){
      // 判断是否登录，token是否过期
      var params;
      //util.doRequest(util.webapi.isLogin, params, this.loginState);
      await api.showLoading()
      const stateres = await api.getData(api.webapi.isLogin);
      await api.hideLoading()
      if(api.reshook(stateres,this.route)){
        this.loginState(stateres)
      }
      
    },
    loginState:function(res){
      console.log(res);

      wx.setStorage({
        key: "isLogin",
        data: true
      })
      try {
        var value = wx.getStorageSync('isLogin')
        if (value) {
          this.setData({
            isLogin: true
          })
          // Do something with return value
        }
      } catch (e) {
        this.setData({
          isLogin: false
        })
        // Do something when catch error
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
        try {
            var value = wx.getStorageSync('token')
            if (value) {
                this.setData({
                    token: value
                })
                // Do something with return value
            }
        } catch (e) {
            // Do something when catch error
        };
        try {
            var value = wx.getStorageSync('bindwx')
            if (value) {
                this.setData({
                    bindwx: value
                })
                // Do something with return value
            }
        } catch (e) {
            // Do something when catch error
        }
        try {
            var value = wx.getStorageSync('avatarUrl')
            if (value) {
                this.setData({
                    avatarUrl: value
                })
                // Do something with return value
            }
        } catch (e) {
            // Do something when catch error
        }
        try {
            var value = wx.getStorageSync('nickName')
            if (value) {
                this.setData({
                    nickName: value
                })
                // Do something with return value
            }
        } catch (e) {
            // Do something when catch error
        }
      try {
        var value = wx.getStorageSync('isLogin')
        if (value) {
          this.setData({
            isLogin: value
          })
          // Do something with return value
        }
      } catch (e) {
        // Do something when catch error
      };
      //this.getIsLogin();
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
    
    getPhoneNumber: function(e) {
        console.log(e.detail.errMsg)
        console.log(e.detail.iv)
        console.log(e.detail.encryptedData)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})