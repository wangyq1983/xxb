// component/lessonItem/lessonItem.js
var app = getApp();
const api = app.globalData.api;
var that;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    filelist: {
      type: 'Array',
      observer: function (newVal, oldVal) {
        this.updatelist()		//这里通过this.updateisedit()方法来更新数据,来解决异步传值问题
      }
    }
  },
  data: {
    // 图片列表
    imgUrl: [],
    // 删除的图片
    delfilelist: [],
    // 多图选取的图片
    urlArr: []
  },
  ready() {
    console.log(this.properties);
    this.setData({
      imgUrl: this.properties.filelist
    })
  },
  methods: {
    imgaction: function () {
      var that = this;
      wx.showActionSheet({
        itemList: ['直接拍照', '相册选取', '微信会话选取'],
        success(res) {
          console.log(res.tapIndex);
          if (res.tapIndex == 0) {
            console.log('直接拍照');
            that.uploadImgcamera();
          }
          if (res.tapIndex == 1) {
            console.log('相册选取')
            that.uploadImgalbum();
          }
          if (res.tapIndex == 2) {
            console.log('微信会话选取')
            that.uploadImgmsg()
          }
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    },
    // 删除上传的图片
    delfileid: function (e) {
      var that = this;
      var delid = e.currentTarget.dataset.fileid
      this.setData({
        delfilelist: that.data.delfilelist.concat(delid)
      })
      wx.cloud.deleteFile({
        fileList: that.data.delfilelist
      }).then(res => {
        // handle success
        console.log(res.fileList);
        that.setData({
          imgUrl: that.data.imgUrl.filter(item => item !== delid)
        })
      }).catch(error => {
        // handle error
        console.log(error)
      })
    },


    // 拍照方式上传图片
    uploadImgcamera: function () {
      var that = this;
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['camera'],
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // const tempFilePaths = res.tempFilePaths
          // console.log(tempFilePaths);
          wx.showLoading({
            title: '上传中',
          })
          const filePath = res.tempFilePaths[0]

          // 上传图片
          var filename = new Date().getTime() + parseInt(Math.random() * 10000);
          var date = new Date(filename);
          var listname = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/'
          const cloudPath = 'upload/' + listname + filename + filePath.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res.fileID)
              console.log(that.data.imgUrl)
              that.cloudImgcheck(res.fileID)
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
            }
          })
        }
      })
    },
    // 相册选取多图片上传
    uploadImgalbum: function () {
      var that = this;
      let curindex = 0; //图片序号
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album'],
        success(res) {
          console.log(res);
          const filePaths = res.tempFilePaths
          wx.showLoading({
            title: '上传中',
          })
          let uploadrecur = async () => {
            // 上传图片
            var filename = new Date().getTime() + parseInt(Math.random() * 10000);
            var date = new Date(filename);
            var listname = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/'
            const cloudPath = 'upload/' + listname + filename + filePaths[curindex].match(/\.[^.]+?$/)[0];
            console.log(cloudPath);
            var filePath = filePaths[curindex]
            console.log(filePath)
            console.log(typeof filePath)
            await wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log('[上传文件] 成功：', res.fileID)
                console.log(that.data.imgUrl)
                that.cloudImgcheck(res.fileID)
                // that.setData({
                //   imgUrl: that.data.imgUrl.concat(res.fileID)
                // })
                console.log(that.data.imgUrl)
                if ((curindex + 1) < filePaths.length) {
                  curindex++;
                  uploadrecur()
                } else {
                  overrecur()
                }
              },
              fail: e => {
                console.error('[上传文件] 失败：', e)
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
              },
              complete: () => {
                // wx.hideLoading()
              }
            })
          }
          let overrecur = () => {
            wx.hideLoading();
          }
          uploadrecur();
          // const filePath = res.tempFilePaths[0]
        },
        complete: (res) => { }
      })
    },
    // 微信会话图片上传
    uploadImgmsg: function () {
      console.log(123)
      let curindex = 0;
      var that = this;
      wx.chooseMessageFile({
        count: 10,
        type: 'image',
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          wx.showLoading({
            title: '上传中',
          })
          console.log(res)
          const filePaths = res.tempFiles

          // const filePaths = res.tempFilePaths
          wx.showLoading({
            title: '上传中',
          })
          let uploadrecur = async () => {
            // 上传图片
            var filename = new Date().getTime() + parseInt(Math.random() * 10000);
            var date = new Date(filename);
            var listname = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/'
            const cloudPath = 'upload/' + listname + filename + filePaths[curindex].path.match(/\.[^.]+?$/)[0];
            console.log(cloudPath);
            var filePath = filePaths[curindex].path
            console.log(filePath)
            console.log(typeof filePath)
            await wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                console.log('[上传文件] 成功：', res.fileID)
                console.log(that.data.imgUrl)
                that.cloudImgcheck(res.fileID)
                // that.setData({
                //   imgUrl: that.data.imgUrl.concat(res.fileID)
                // })
                console.log(that.data.imgUrl)
                if ((curindex + 1) < filePaths.length) {
                  curindex++;
                  uploadrecur()
                } else {
                  overrecur()
                }
              },
              fail: e => {
                console.error('[上传文件] 失败：', e)
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
              },
              complete: () => {
                // wx.hideLoading()
              }
            })
          }

          let overrecur = () => {
            wx.hideLoading();
          }

          uploadrecur();

        }
      })
    },
    // 调用云函数进行图片验证
    cloudImgcheck:function(fileid){
      var that = this;
      wx.cloud.callFunction({
        name: "imgcheck",
        data: {
          contentType: 'images/png',
          fileID: fileid
        }
      }).then(res1 => {
        console.log("检测结果", res1.result);
        if (res1.result.errCode == 0) {
          that.setData({
            imgUrl: that.data.imgUrl.concat(fileid)
          })
          console.log(that.data.imgUrl);
          wx.hideLoading()
        } else {
          wx.showToast({
            icon: 'none',
            title: '图片含有违法信息，不能上传',
            duration:2000
          })
          setTimeout(function(){
            wx.hideLoading()
          },2000)
          
        }
      })
    },
    updatelist: function () {
      this.setData({
        imgUrl: this.properties.filelist
      });
    }
  }
})