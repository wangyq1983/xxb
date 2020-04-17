 // pages/jldetail/jldetail.js
var app = getApp();
const api = app.globalData.api;
var allPath;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jielong: {

    },
    cylist: {},
    optiontype:"",
    optionlist: [], // 单选或复选 选项
    id: '',
    submited: false,
    statisticsList: [],
    participate:false,
    state: 1,
    content: '',
    showShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      var sceneid = decodeURIComponent(options.scene).split("=")
      var params = {
        id: sceneid[1]
      }
      this.setData({
        id: sceneid[1]
      })
    }
    if (options.id) {
      var params = {
        id: options.id
      };
      this.setData({
        id: options.id
      })
    }

    
    if(!app.isLogin()){
      var data = {
        url:'pages/toupiaodetail/toupiaodetail',
        id:this.data.id
      }
      var origin = app.encodeData(data);
      wx.redirectTo({
        url: '/pages/wxlogin/wxlogin?'+origin
      })
    }else{
      allPath = this.route + '?id=' + this.data.id;
      this.inittpdetail(allPath,params);
    }
  },
  async inittpdetail(allpath,params){
    await api.showLoading() // 显示loading
    var jldetail = await api.getData(api.webapi.jielongdetail,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(jldetail,allpath)){
      this.setData({
        jielong: jldetail.data,
        cylist: jldetail.data.statisticsList,
        optionlist: jldetail.data.config.key3.options,
        optiontype: jldetail.data.config.key3.optionType,
        participate: jldetail.data.participate,
        state: jldetail.data.state,
        content: jldetail.data.content.replace(/ /g, "&nbsp;")
      })
    }
  },
  async cytp(params){
    await api.showLoading() // 显示loading
    var cytpres = await api.postData(api.webapi.jielongcy,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(cytpres,this.route)){
      this.jlcySuccess()
    }
    
  },
  cyTable: function (e) {
    // 此处为参与投票
    var originData = this.data.optionlist;
    console.log(e)
    var formData = [];
    console.log(originData);

    for (let i in e.detail.value) {
      formData.push(e.detail.value[i]); //属性
    }
    console.log(formData);
    //处理外部表单提交的值
    // function chuli(element, index, array) {
    //   element.value = (typeof formData[index] == 'object') ? formData[index].join("-") : formData[index];
    //   if (element.options) {
    //     element.options = chulioptions(element.options, formData[index])
    //   }
    // }
    // 处理内部options的值一遍一一对应
    function chulioptions(originData, formData) {
      for (let i = 0; i < originData.length; i++) {
        for (let j = 0; j < formData.length; j++) {
          if (originData[i].value == formData[j]) {
            originData[i].checked = true;
            originData[i].count = 1;
          }
        }
      }
      return originData
    }
    if (this.data.optiontype == 'radio' ){
      var op = chulioptions(originData, formData);
    }
    if (this.data.optiontype == 'checkbox'){
      var op = chulioptions(originData, formData[0]);
    }
    
    console.log(op)

    var params = {
      type: "3",
      solitaireId: this.data.jielong.id,
      config: {
        key3: {
          description: "投票选举",
          optionType: this.data.optiontype,
          options: op
        },
      }
    }
    this.cytp(params)
    
  },
  shareEvent:function(){
    this.setData({
      showShare:true
    })
  },
  jlcySuccess: function () {
    var that = this;
    wx.showToast({
      title: '提交成功',
      duration: 1000,
      success: function () {
        setTimeout(function () {
          that.resultShow()
        }, 1000)
      }
    });
  },
  resultShow: function () {
    var params = {
      id: this.data.id
    };
    this.onLoad(params)
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
  
    var jielongImg = '../../img/jielong5.jpg';
    var jielongpath = 'pages/toupiaodetail/toupiaodetail?id=' + this.data.id;

    return {
      title: this.data.jielong.title + '------作者【' + this.data.jielong.nickName + '】',
      path: jielongpath,
      imageUrl: jielongImg,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})