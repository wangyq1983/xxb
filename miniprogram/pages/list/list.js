// pages/list/list.js
const db = wx.cloud.database();
// const _ = db.command();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioList:[],
    progress:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    db.collection('testList').get().then(data => { 
      console.log(data);
      this.setData({
        audioList:data.data
      })
    })
  },
  gotoaudio:function(e){
    console.log(e.currentTarget.dataset.fid);
    var type = e.currentTarget.dataset.type;
    if(type == 'pdf'){
      console.log(e.currentTarget.dataset.fid);
      const downloadTask = wx.cloud.downloadFile({
        fileID: e.currentTarget.dataset.fid,
        success:function(res){
          console.log(res);
          var Path = res.tempFilePath;
          wx.openDocument({
            filePath: Path,
            fileType: 'pdf',
            success:function(res){
              console.log('打开成功');
            }
          })
        },
        fail:function(res){
          console.log(res)
        }
      })

      downloadTask.onProgressUpdate((res)=>{
        console.log('下载进度', res.progress)
        console.log('已经下载的数据长度', res.totalBytesWritten)
        console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
      })
    }
    if(type == 'mp3'){
      wx.navigateTo({
        url: '/pages/test/test?fid=' + e.currentTarget.dataset.fid + '&title=' + e.currentTarget.dataset.title
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

  }
})