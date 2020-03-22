const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioList: [],
    progress: 0,
    isLoading: false,
    sid: '',
    type: '',
    title: '',
    isEmpty: 0,
    chicked: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      sid: decodeURIComponent(options.sid),
      type: decodeURIComponent(options.type),
      title: decodeURIComponent(options.title)
    })
    wx.showLoading({
      title: "加载中"
    });
    db.collection('dataList').where({
      sid: decodeURIComponent(options.sid)
    }).orderBy('ordernum', 'asc').get().then(data => {
      console.log(data);
      wx.hideLoading();
      if (data.data.length == 0) {
        this.setData({
          isEmpty: 1,
          audioList: data.data
        })
      } else {
        this.setData({
          isEmpty: 0,
          audioList: data.data
        })
      }
    })
  },
  gotoaudio: function (e) {
    console.log(e.currentTarget.dataset.fid);
    var type = e.currentTarget.dataset.type;
    if (type == 'pdf') {
      if (this.data.chicked == 0) {
        this.setData({
          chicked:1
        })
        console.log(e.currentTarget.dataset.fid);
        const downloadTask = wx.cloud.downloadFile({
          fileID: e.currentTarget.dataset.fid,
          success: function (res) {
            console.log(res);
            var Path = res.tempFilePath;
            wx.openDocument({
              filePath: Path,
              fileType: 'pdf',
              success: function (res) {
                console.log('打开成功');
              }
            })
          },
          fail: function (res) {
            console.log(res)
          }
        })

        downloadTask.onProgressUpdate((res) => {
          if (res.progress == 100) {
            this.setData({
              isLoading: false,
              chicked:0
            })
          } else {
            this.setData({
              isLoading: true,
              progress: res.progress,
            })
            console.log('下载进度', res.progress)
            console.log('已经下载的数据长度', res.totalBytesWritten)
            console.log('预期需要下载的数据总长度', res.totalBytesExpectedToWrite)
          }

        })
      }else{
        return false
      }

    }
    if (type == 'mp3') {
      wx.navigateTo({
        url: '/pages/audioplay/audioplay?fid=' + e.currentTarget.dataset.fid + '&title=' + e.currentTarget.dataset.title
      })
    }
    if (type == 'jpg') {
      wx.navigateTo({
        url: '/pages/imgshow/imgshow?fid=' + e.currentTarget.dataset.fid + '&title=' + e.currentTarget.dataset.title
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

    var datadetail = {
      sid: this.data.sid,
      title: this.data.title,
      type: this.data.type
    }
    var dataparams = Object.keys(datadetail).map(function (key) {
      return encodeURIComponent(key) + "=" + encodeURIComponent(datadetail[key]);
    }).join("&");

    wx.navigateTo({
      url: '/pages/zllist/zllist?' + dataparams
    })

    return {
      title: this.data.title,
      path: '/pages/zllist/zllist?' + dataparams,
      success: (res) => {
        // console.log("转发成功", res);
      },
      fail: (res) => {
        // console.log("转发失败", res);
      }
    }
  }
})