// component/share/share.js
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    type: {
      type: 'number',
      value: 0,
    },
    sid:{
      type: 'string',
      observer: function (newVal, oldVal) {
        this.updateid()		//这里通过this.updatesize()方法来更新数据,来解决异步传值问题
      }
    },
    title:{
      type:'string',
      observer: function (newVal, oldVal) {
        this.updatetitle()		//这里通过this.updatesize()方法来更新数据,来解决异步传值问题
      }
    },
    showShare:{
      type:'Boolean',
      value:false
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    isShow:true,
    sid:'',
    type:'',
    title:'',
    showShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  ready(){
    this.setData({
      sid: this.properties.sid,
      title:this.properties.title,
      type: this.properties.type,
      showShare: this.properties.showShare
    })
  },
  methods:{
    cancleEvent: function() {
      this.setData({
        showShare: false
      })
    },
    shareFirend: function() {

    },
    createCode: function() {
      console.log(this.data.type)
      console.log(this.data.sid)
      console.log(this.data.title);
      console.log(this.data.showShare)
      wx.navigateTo({
        url: '/pages/sharecreat/sharecreat?id=' + this.data.sid + '&type='+ this.data.type
      })
    },
    updateid: function () {
      this.setData({
        id: this.properties.sid
      });
      console.log(this.data.sid)
    },
    updatetitle:function(){
      this.setData({
        title: this.properties.title
      });
      console.log(this.data.title)
    }
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