// pages/table/table.js
const app = getApp();
const api = app.globalData.api;
var allPath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '',
    content: '',
    type: 2,
    paramsList:[],
    id:'',
    btnTxt:'发布表格',
    allsee: true,
    filelist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  
  onLoad: function (options) {
    this.setData({
      date: api.getDate(),
      time: api.getTimes()
    })
    wx.setStorage({
      key: "shared",
      data: "0"
    })
    if(options.id){
      this.setData({
        id:options.id
      })
      var params = {
        id: options.id
      }

      allPath = this.route+'?id='+options.id
      this.inittabledetail(params,allPath);
    }
    if (options.type == 'edit') {
      this.setData({
        btnTxt: '编辑接龙'
      })
    }
  },
  async inittabledetail(params,allpath){
    await api.showLoading() // 显示loading
    var tabledetail = await api.getData(api.webapi.jielongdetail,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(tabledetail,allpath)){
      this.setData({
        title: tabledetail.data.title,
        content: tabledetail.data.content,
        filelist:tabledetail.data.filelist?tabledetail.data.filelist:[],
        paramsList:tabledetail.data.config.key2.itemList,
        allsee: (tabledetail.data.allVisible == undefined) ? true:tabledetail.data.allVisible,
        date: api.getDate(tabledetail.data.endDate),
        time: api.getTimes(tabledetail.data.endDate)
      })
    }
  },
  async creatTable(apiurl,params){
    await api.showLoading() // 显示loading
    var createres = await api.postData(apiurl,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(createres,this.route)){
      this.jielongSuccess(createres)
    }
  },
  changeallsee: function () {
    this.setData({
      allsee: !this.data.allsee
    })
  },
  creatJieLong:function(e){
    var addfile = this.selectComponent("#imgupbox").data.imgUrl
    if (this.data.btnTxt == '发布表格'){
      if (e.detail.value.title == '' || this.data.paramsList.length == 0) {
        wx.showToast({
          title: '必填项不可为空',
          icon:'none',
          duration: 2000
        })
      } else {
        var that = this;
        wx.showModal({
          title: '提示',
          content: '您已检查完毕，确定要发布填表吗？',
          success(res){
            if (res.confirm){
              var param = {
                title: e.detail.value.title,
                content: e.detail.value.content,
                filelist:addfile,
                allVisible:that.data.allsee,
                type: 2,
                config: {
                  key2: {
                    description: "信息采集",
                    itemList: that.data.paramsList
                  }
                },
                endDate:that.data.date + ' ' + that.data.time + ':30'
              }
              that.creatTable(api.webapi.newjielong,param)
            }
            else if(res.cancel){
              console.log('用户点击取消')
            }
          }
        })
      }
    }
    
    if (this.data.btnTxt == '编辑接龙'){
      if (e.detail.value.title == '') {
        wx.showToast({
          title: '必填项不可为空',
          duration: 2000
        })
      } else {
        var that = this;
        wx.showModal({
          title: '提示',
          content: '您已检查完毕，确定要发布编辑后的表格吗？',
          success(res){
            if (res.confirm){
              var param = {
                id:that.data.id,
                title: e.detail.value.title,
                content: e.detail.value.content,
                filelist:addfile,
                allVisible: that.data.allsee,
                type: 2,
                config: {
                  key2: {
                    description: "信息采集",
                    itemList: that.data.paramsList
                  }
                },
                endDate: that.data.date + ' ' + that.data.time + ':30'
              }
              that.creatTable(api.webapi.jielongupdata,param)
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
    wx.navigateTo({
      url: '/pages/sharejl/sharejl?id=' + res.data.id + '&title=' + res.data.title + '&type=' + res.data.type,
    })
  },
  showSheet:function(e){
    console.log(e.currentTarget.dataset.idx);
    var arrdata = this.data.paramsList;
    var that = this;
    var arridx = e.currentTarget.dataset.idx;
    wx.showActionSheet({
      itemList: ['删除'],
      success(res) {
        console.log(res.tapIndex);
        if(res.tapIndex == 0){
          arrdata.splice(arridx, 1);
          that.setData({
            paramsList: arrdata
          })
        }
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
    
  },
  bindDateChange:function(e){
    console.log(e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange:function(e){
    console.log(e.detail.value)
    this.setData({
      time:e.detail.value
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
     console.log(this.data.paramsList)
    wx.getStorage({
      key: 'shared',
      success(res) {
        console.log(res.data);
        if (res.data == 1) {
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
  enterAdd:function(e){
    console.log(e)
    var params = JSON.stringify(e.currentTarget.dataset.con);
    var idx = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/tableadd/tableadd?index='+idx+'&params='+params,
    })
  },
  addEvent:function(){
    wx.navigateTo({
      url: '/pages/tableadd/tableadd',
    })
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