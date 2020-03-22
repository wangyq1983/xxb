// pages/jllistcj/jllistcj.js
const app = getApp();
const api = app.globalData.api;
var touchStartX = 0;//触摸时的原点  
var touchStartY = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动  
var interval = "";// 记录/清理时间记录  
var touchMoveX = 0; // x轴方向移动的距离
var touchMoveY = 0; // y轴方向移动的距离
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    isEmpty:0,
    isEnd:false,
    dataStep:20,
    curId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init();
  },

  // 初始化
  async init (){
    var params = {
      from:1,
      count:this.data.dataStep
    }
    await api.showLoading() // 显示loading
    var cjlist = await api.getData(api.webapi.jielonglist,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(cjlist,this.route)){
      this.renderList(cjlist)
    }
  },
  async delafterList(){
    var params = {
      from:1,
      count:this.data.dataStep
    }
    await api.showLoading() // 显示loading
    var cjlist = await api.getData(api.webapi.jielonglist,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(cjlist,this.route)){
      this.setData({
        list:cjlist.data,
        isEmpty:0,
        isEnd:false
      })
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
  async delevent(e){
    console.log(e.currentTarget.dataset.id);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除吗',
      async success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          var params = {
            id: e.currentTarget.dataset.id
          }
          await api.showLoading() // 显示loading
          var delres = await api.postData(api.webapi.jielongdelete,params);
          await api.hideLoading() // 等待请求数据成功后，隐藏loading
          if(api.reshook(delres,that.route)){
            that.delafterList()
          }
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  deleteSuccess:function(){
    this.onLoad();
  },
  gotoDetail: function (e) {
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

  // 触摸开始事件  
  touchStart: function (e) {
    touchStartX = e.touches[0].pageX; // 获取触摸时的原点  
    touchStartY = e.touches[0].pageY; // 获取触摸时的原点  
    // 使用js计时器记录时间    
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件  
  touchMove: function (e) {
    touchMoveX = e.touches[0].pageX;
    touchMoveY = e.touches[0].pageY;
  },
  // 触摸结束事件  
  touchEnd: function (e) {
    var moveX = touchMoveX - touchStartX
    var moveY = touchMoveY - touchStartY
    if (Math.sign(moveX) == -1) {
      moveX = moveX * -1
    }
    if (Math.sign(moveY) == -1) {
      moveY = moveY * -1
    }
    if (moveX <= moveY) {// 上下
      // 向上滑动
      if (touchMoveY - touchStartY <= -30 && time < 10) {
        console.log("向上滑动")
      }
      // 向下滑动  
      if (touchMoveY - touchStartY >= 30 && time < 10) {
        console.log('向下滑动 ');
      }
    } else {// 左右
      // 向左滑动
      if (touchMoveX - touchStartX <= -30 && time < 10) {
        // console.log("左滑页面");
        console.log(e.currentTarget.dataset.id);
        this.setData({
          curId:e.currentTarget.dataset.id
        })
      }
      // 向右滑动  
      if (touchMoveX - touchStartX >= 30 && time < 10) {
        // console.log('向右滑动');
        this.setData({
          curId: ''
        })
      }
    }
    clearInterval(interval); // 清除setInterval  
    time = 0;
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