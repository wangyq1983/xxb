// pages/main/main.js
const util = require('../../utils/tools.js');

var app = getApp();

Page({
    data: {
        imgUrls: [
            
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        current:0,
        subMenu:[
            {
                icon:"/images/fujin.png",
                txt:"我的附近",
                path:"/pages/near/near",
                openType:"navigate"
            },
            {
                icon: "/images/youhui.png",
                txt: "限时优惠",
                path:"/pages/lessonlist/lessonlist?discount=1",
                openType: "navigate"
            },
            {
                icon: "/images/shiting.png",
                txt: "课程试听",
                path:"/pages/lessonlist/lessonlist?audition=1",
                openType: "navigate"
            },
            {
                icon: "/images/fengcai.png",
                txt: "学员风采",
                path:"/pages/faxian/faxian",
                openType: "switchTab"
            }
        ],
        recoList:[
          {
            cover: "http://baomatingke.oss-cn-qingdao.aliyuncs.com/8729a282b8fd45c484879a78ef71f215.png",
createDate: "2019-06-30 15:16:31",
id: 3405,
schoolName: "[{value:56,label:大音琴行}]",
schoolType: "fdsdsdsaf",
score: 0,
title: "sfddsfds",
updateDate: "2019-06-30 15:16:31"}
        ],
        isEmpty: 0,
        isEnd: false,
        dataStep: 20,
        showSkeleton: true
    },
    subMenuGoto(e){
        console.log(e)
        console.log(e.currentTarget.dataset.item);
        var item = e.currentTarget.dataset.item;
        if(item.openType == 'switchTab'){
            app.globalData.CurId = 3;
            wx.switchTab({
                url: e.currentTarget.dataset.item.path
            });
        }
        if (item.openType == 'navigate'){
            wx.navigateTo({
                url: e.currentTarget.dataset.item.path
            })
        }
        
    },
    jumpsearch(){
        console.log('jumpsearch');
        wx.navigateTo({
            url: '../search/search'
        })
    },
    changeIndicatorDots(e) {
        this.setData({
            indicatorDots: !this.data.indicatorDots
        })
    },
    changeAutoplay(e) {
        this.setData({
            autoplay: !this.data.autoplay
        })
    },
    intervalChange(e) {
        this.setData({
            interval: e.detail.value
        })
    },
    durationChange(e) {
        this.setData({
            duration: e.detail.value
        })
    },
    gotoReco(e){
      wx.navigateTo({
        url: '../reco/reco?id=' + e.currentTarget.dataset.id
      })
        console.log(e.currentTarget.dataset.id)
    },
  choosedidian:function(){
    wx.showToast({
      title: '暂时仅支持青岛地区,还请谅解',
      icon:'none'
    })
  },

  onLoad: function (options) {
    let params = {
      from: 1,
      count: 20
    };
    util.doRequest(util.webapi.recoList, params, this.recoList);
    var param = {
        column : 'aaa'
    }
      util.doRequest(util.webapi.banner, param, this.bannerList);
  },
    bannerList:function(res){
        console.log(res);

        this.setData({
            imgUrls: res.data.data,
            showSkeleton: false
        })
    },
  recoList:function(res){
    console.log(res);

      if (res.data.data.length == 0) {
          this.setData({
              isEmpty: 1,
              recoList: res.data.data
          });
      } else {
          this.setData({
              isEmpty: 0,
              isEnd: (res.data.data.length < this.data.dataStep) ? true : false,
              recoList: (this.data.recoList.length == 0) ? res.data.data : this.data.recoList.concat(res.data.data)
          });
      }



    // this.setData({
    //   recoList:res.data.data

    // })
  },

    /**
       * 页面相关事件处理函数--监听用户下拉动作
       */
    onPullDownRefresh: function () {
        console.log('下拉')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('上拉触底');

        let params = {
            from: this.data.recoList.length + 1,
            to: this.data.recoList.length + this.data.dataStep
        }
        if (this.data.isEnd !== true) {
            // util.doRequest(util.webapi.lessonList, params, this.lessonList);
            util.doRequest(util.webapi.recoList, params, this.recoList);
        }

    },

})