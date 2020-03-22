// pages/jldetail/jldetail.js
var app = getApp();
const api = app.globalData.api;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    statisticsList: [],
    jielong:{},
    isEmpty: 0,
    isEnd: false,
    dataStep: 20,
    userId:'',
    title:'',
    totalnum:0,
    allVisible:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);

    try {
      var value = wx.getStorageSync('userId')
      if (value) {
        // Do something with return value
          this.setData({
            userId:value
          })
      }
    } catch (e) {
      // Do something when catch error
    }  
   
    this.setData({
      id: options.id,
      title:options.title,
      totalnum: options.totalnum,
      allVisible: api.strbool(options.allVisible)
    })
    

  }, 
  async init(params){
    await api.showLoading() // 显示loading
    var jldetail = await api.getData(api.webapi.jielongstatistics,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(jldetail,this.route)){
      this.renderList(jldetail)
    }
  },
  renderList(res){
    if (res.data.length == 0) {
      this.setData({
        isEmpty: 1,
        statisticsList: res.data
      })
    } else {
      this.setData({
        isEmpty: 0,
        isEnd: (res.data.length < this.data.dataStep) ? true : false,
        statisticsList: (this.data.statisticsList.length == 0) ? res.data : this.data.statisticsList.concat(res.data)

      })
    }
  },
  // 操作动作
  caozuoevent:function(e){
    var that = this;
    wx.showActionSheet({
      itemList: ['编辑','删除'],
      async success(res) {
        console.log(res.tapIndex);
        if (res.tapIndex == 0) {
          console.log(e.currentTarget.dataset.value.key2.itemList);
          console.log(that.data.id)
          var curvalue = {
            solitaireId: that.data.id,
            id: e.currentTarget.dataset.id,
            value: JSON.stringify(e.currentTarget.dataset.value.key2.itemList)
          }
          var dataparams = Object.keys(curvalue).map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(curvalue[key]);
          }).join("&");
          console.log('/pages/tableedit/tableedit?solitaireId=' + that.data.id + '&id=' + e.currentTarget.dataset.id+'&=' + dataparams)
          wx.navigateTo({
            url: '/pages/tableedit/tableedit?' + dataparams
          })
        }
        if (res.tapIndex == 1) {
          console.log(e.currentTarget.dataset.id);
          await api.showLoading() // 显示loading
          var cyjldelres = await api.postData(api.webapi.jielongcydelete + '?id=' + e.currentTarget.dataset.id);
          await api.hideLoading() // 等待请求数据成功后，隐藏loading
          if (api.reshook(cyjldelres, this.route)) {
            that.onShow()
          } 
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  jlcySuccess:function(){

  },
  editorCyEvent:function(e){
    
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
    this.setData({
      statisticsList:[]
    })
    var params = {
      solitaireId: this.data.id,
      order:'desc',
      from:1,
      count: this.data.dataStep
    };
    this.init(params);
    this.setData({
      addState: !app.isAdd()
    })
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
      solitaireId: this.data.id,
      order: 'desc',
      from: this.data.statisticsList.length + 1,
      count: this.data.dataStep
    }
    if (this.data.isEnd !== true) {
      await api.showLoading() // 显示loading
      var cjlist = await api.getData(api.webapi.jielongstatistics, params);
      await api.hideLoading() // 等待请求数据成功后，隐藏loading
      if (api.reshook(cjlist, this.route)) {
        this.renderList(cjlist)
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var jielongImg = '../../img/jielong3.jpg';
    var jielongpath = 'pages/tablefill/tablefill?id=' + this.data.id;
    return {
      title: this.data.jielong.title + '------作者【' + this.data.jielong.nickName + '】',
      path: jielongpath,
      imageUrl: jielongImg,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})