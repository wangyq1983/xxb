// pages/jielong/jielong.js
const app = getApp();
const api = app.globalData.api;
var allPath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    title:'',
    content:'',
    type:1,
    btnTxt:'新建接龙',
    date: api.getDate(),
    time: api.getTimes()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('=============');
    console.log(options);
    wx.setStorage({
      key: "shared",
      data: "0"
    })
    if(options.type == 'copy'){
      this.setData({
        btnTxt:'复制接龙'
      })
    }
    if (options.type == 'edit') {
      this.setData({
        btnTxt: '编辑接龙'
      })
    }
    if(options.id){
      this.setData({
        id:options.id
      })
      var params = {
        id: options.id
      };
      allPath = this.route+'?id='+options.id
      this.initjldetail(params,allPath);
    }
  },
  async initjldetail(params,path){
    await api.showLoading() // 显示loading
    var jldetail = await api.getData(api.webapi.jielongdetail,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(jldetail,path)){
      this.setData({
        title: jldetail.data.title,
        content: jldetail.data.content,
        date: api.getDate(jldetail.data.endDate),
        time: api.getTimes(jldetail.data.endDate)
      })
    }
  },
  async creatjl(apiurl,params){
    await api.showLoading() // 显示loading
    var createres = await api.postData(apiurl,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    console.log(createres)  
    if(api.reshook(createres,this.route)){
      this.jielongSuccess(createres)
    }
  },
  bindDateChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  creatJieLong:function(e){
    console.log(e.detail.value.alllook) // 是否所有人可见
    if (this.data.btnTxt == '新建接龙' || this.data.btnTxt == '复制接龙'){
      if(e.detail.value.title == ''){
        wx.showToast({
          title:'必填项不可为空',
          duration: 2000
        })
      }else{
        var that = this;
        wx.showModal({
          title: '提示',
          content: '您已检查完毕，确定要创建接龙吗？',
          success(res){
            if (res.confirm){
              var param = {
                title: e.detail.value.title,
                content: e.detail.value.content,
                type: 1,
                config: {
                  "key1": {
                    "description": "报名接龙",
                    "name": "",
                    "remark": ""
                  },
                },
                endDate: that.data.date + ' ' + that.data.time + ':30'
              }
              that.creatjl(api.webapi.newjielong, param);
            }else if(res.cancel){
              console.log('用户点击取消')
            }
          }
        })
      }
    }
    if (this.data.btnTxt == '编辑接龙') {
      if (e.detail.value.title == '') {
        wx.showToast({
          title: '必填项不可为空',
          duration: 2000
        })
      }else{
        var that = this;
        wx.showModal({
          title: '提示',
          content: '您已检查完毕，确定要提交编辑接龙吗？',
          success(res){
            if (res.confirm){
              var param = {
                id: that.data.id,
                title: e.detail.value.title,
                content: e.detail.value.content,
                type: 1,
                config: {
                  "key1": {
                    "description": "报名接龙",
                    "name": "",
                    "remark": ""
                  },
                },
                endDate: that.data.date + ' ' + that.data.time + ':30'
              }
              that.creatjl(api.webapi.jielongupdata, param);
            }else if(res.cancel){
              console.log('用户点击取消')
            }
          }
        })
        
      }
    }
  },
  jielongSuccess:function(res){
    // 等待后端返回接口传递 id及title 供 分享使用
    wx.showToast({
      title: '创建成功',
      icon:'none',
      duration:1000
    })
    setTimeout(()=>{
      wx.navigateTo({
        url: '/pages/sharejl/sharejl?id='+res.data.id+'&title='+res.data.title+'&type='+res.data.type,
      })
    },1000)
    
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
    wx.getStorage({
      key: 'shared',
      success(res) {
        console.log(res.data);
        if(res.data == 1){
          wx.reLaunch({
            url: '/pages/jllistcj/jllistcj'
          })
        }
      }
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '学小帮',
      path: 'pages/fabu/fabu',
      success : (res) => {
        // console.log("转发成功", res);
      },
      fail: (res) => {
        // console.log("转发失败", res);
      }
    }
  }
})