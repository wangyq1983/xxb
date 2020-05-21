// component/lessonItem/lessonItem.js
var app = getApp();
const api = app.globalData.api;
var that;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    
    filelist:{
      type: 'Array',
      observer: function (newVal, oldVal) {
        this.updatelist()		//这里通过this.updateisedit()方法来更新数据,来解决异步传值问题
      }
    }
  },
  data: {
    imgUrl:[],
    delfilelist:[]
  },
  ready() {
    console.log(this.properties);
    this.setData({
      imgUrl:this.properties.filelist
    })
  },
  methods: {
    imgaction:function(){
      var that = this;
      wx.showActionSheet({
        itemList: ['直接拍照','相册选取'],
        success(res) {
          console.log(res.tapIndex);
          if (res.tapIndex == 0) {
            console.log('直接拍照');
            that.chooseImg(0)
          }
          if (res.tapIndex == 1) {
            console.log('相册选取')
            that.chooseImg(1)
          }
        },
        fail(res) {
          console.log(res.errMsg)
  
        }
      })
    },
    // 删除上传的图片
    delfileid:function(e){
      var that = this;
      var delid = e.currentTarget.dataset.fileid
      this.setData({
        delfilelist:that.data.delfilelist.concat(delid)
      })
      wx.cloud.deleteFile({
        fileList: that.data.delfilelist
      }).then(res => {
        // handle success
        console.log(res.fileList);
        that.setData({
          imgUrl:that.data.imgUrl.filter(item => item !== delid)
        })
      }).catch(error => {
        // handle error
        console.log(error)
      })
    },
  
  // 调用云函数上传
    chooseImg:function(uptype){
      var that = this;
      if(uptype == 0){
        var maxcount = 1;
        var sourceType = ['camera']
      }
      if(uptype == 1){
        var maxcount = 9;
        var sourceType = ['album']
      }
      wx.chooseImage({
        count: maxcount,
        sizeType: ['original', 'compressed'],
        sourceType: sourceType,
        success(res) {
          // tempFilePath可以作为img标签的src属性显示图片
          // const tempFilePaths = res.tempFilePaths
          // console.log(tempFilePaths);
  
          wx.showLoading({
            title: '上传中',
          })
  
          const filePath = res.tempFilePaths[0]
  
          // 上传图片
          var filename = new Date().getTime() + parseInt(Math.random()*10000);
          var date = new Date(filename); 
          var listname = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + '/'
          const cloudPath =  'upload/' + listname + filename + filePath.match(/\.[^.]+?$/)[0]
          wx.cloud.uploadFile({
            cloudPath,
            filePath,
            success: res => {
              console.log('[上传文件] 成功：', res.fileID)
  
              console.log(that.data.imgUrl)
              
              that.setData({
                imgUrl: that.data.imgUrl.concat(res.fileID)
              })
              console.log(that.data.imgUrl)
            },
            fail: e => {
              console.error('[上传文件] 失败：', e)
              wx.showToast({
                icon: 'none',
                title: '上传失败',
              })
            },
            complete: () => {
              wx.hideLoading()
            }
          })
  
        }
      })
    },
    updatelist:function(){
      this.setData({
        imgUrl: this.properties.filelist
      });
    }
  }
})



