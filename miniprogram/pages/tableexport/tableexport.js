// pages/tableexport/tableexport.js
const app = getApp();
const api = app.globalData.api;
var allPath;
var _options;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    copyPath:'',
    progress:0,
    isLoading:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    _options = options;
    var params = {
      solitaireId: options.solitaireId
    };
    // util.doRequest(util.webapi.exportexcel, params, this.exportExcel);
    allPath = this.route + '?solitaireId=' + options.solitaireId
    this.initexport(params,allPath)
  },
  async initexport(params,allpath){
    await api.showLoading() // 显示loading
    const excelres = await api.getData(api.webapi.exportexcel,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(excelres,allpath)){
      this.setData({
        copyPath: excelres.data
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
    this.onLoad(_options);
  },
  copyevent:function(){
    wx.setClipboardData({
      data: this.data.copyPath,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  openevent:function(){
    wx.downloadFile({
      url: this.data.copyPath, //仅为示例，并非真实的资源
      header: {
        "content-type": "application/json",
        token: wx.getStorageSync("token")
      },
      success(res) {
        console.log(res)
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          const filePath = res.tempFilePath;
          wx.openDocument({
            filePath: filePath,
            fileType: 'xlsx',
            success: function (res) {
              console.log('打开文档成功');
            }
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