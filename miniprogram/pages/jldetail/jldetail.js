// pages/jldetail/jldetail.js
var app = getApp();
const api = app.globalData.api;
var allPath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jielong:{

    },
    cylist:{},
    id:'',
    jielonged:0,
    isSubmit:false,
    userId:'',
    state: 1,
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    var params = {
      id: options.id
    };
    this.setData({
      id:options.id
    })
    if(options.jielonged){
      this.setData({
        jielonged:options.jielonged
      })
    }
    if(!app.isLogin()){
      var data = {
        url:'pages/jldetail/jldetail',
        id:options.id
      }
      var origin = app.encodeData(data);
      wx.redirectTo({
        url: '/pages/wxlogin/wxlogin?'+origin
      })
    }else{
      allPath = this.route+'?id='+options.id
      this.init(params,allPath)
    }
  },
  async init(params,allpath){
    try {
      var value = wx.getStorageSync('userId')
      if (value) {
        // Do something with return value
        this.setData({
          userId: value
        })
      }
    } catch (e) {
      // Do something when catch error
    }  
    await api.showLoading() // 显示loading
    var jldetail = await api.getData(api.webapi.jielongdetail,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(jldetail,allpath)){
      this.setData({
        jielong:jldetail.data,
        cylist: jldetail.data.statisticsList,
        state: jldetail.data.state,
        content: jldetail.data.content.replace(/ /g,"&nbsp;")
      })
      if (this.data.jielonged == 1){
        wx.pageScrollTo({
          scrollTop: 20000,
          duration: 300
        })
      }
    }
  },
  
  async cyjl(params){
    await api.showLoading() // 显示loading
    var cyjlres = await api.postData(api.webapi.jielongcy,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(cyjlres,allPath)){
      this.jlcySuccess();
    } 
  },
  async cyjldel(delid){
    await api.showLoading() // 显示loading
    var cyjldelres = await api.postData(api.webapi.jielongcydelete+'?id='+delid);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if (api.reshook(cyjldelres, allPath)) {
      this.jlcySuccess('del');
    } 
  },
  jlcydel:function(e){
    var that = this;
    wx.showModal({
      title: '确定要删除此条接龙吗？',
      content:'删除之后不可恢复',
      success(res){
        if (res.confirm) {
          // var params = {
          //   id: e.currentTarget.dataset.id
          // }
          that.cyjldel(e.currentTarget.dataset.id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    // console.log(e.currentTarget.dataset.id);

  },
  cyJielong:function(e){
    console.log(e.detail.value.name);
    if(e.detail.value.name.length > 32){
      wx.showToast({
        title: '内容过长，请控制在32个字符以内',
        icon: 'none',
        duration: 1000,
      })
    }else{
      var that = this;
      wx.showModal({
        title: '提示',
        content: (this.data.jielonged == 1)?'您已经提交接龙内容，还要再次提交吗？':'确定要提交吗？',
        success (res) {
          if (res.confirm) {
            var params = {
              type: "1",
              solitaireId: that.data.jielong.id,
              config:{
                key1: {
                  description: "报名接龙",
                  name: e.detail.value.name,
                  remark: "备注"
                },
              }
            }
            that.cyjl(params);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      }
    
  },

  jlcySuccess:function(state){
    var that = this;
    var param = {
      id:this.data.id,
      jielonged:1
    }

    wx.showToast({
      title: state == 'del'?'删除成功':'接龙成功',
      icon: 'none',
      duration: 1000,
      success:function(){
        setTimeout(function(){
          that.onLoad(param);
        },1000)
      }
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
    var jielongImg = '../../img/jielong.jpg';
    var jielongpath = 'pages/jldetail/jldetail?id=' + this.data.id;
    return {
      title: this.data.jielong.title + '------作者【' + this.data.jielong.nickName + '】',
      path: jielongpath,
      imageUrl: jielongImg,
      success: (res) => {
        // console.log("转发成功", res);
      },
      fail: (res) => {
        // console.log("转发失败", res);
      }
    }
  }
})