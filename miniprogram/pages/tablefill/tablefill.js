// pages/jldetail/jldetail.js
var app = getApp();
const api = app.globalData.api;
var _options;
var allPath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jielong: {

    },
    cylist: {},
    itemlist:[],
    id:'',
    submited:false,
    statisticsList:[],
    isloading:true,
    isparticipate:false,
    totalnum:0,
    state:1,
    content: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id);
    // _options = options;
    var params = {
      id: options.id
    };
    this.setData({
      id: options.id
    })
    if(!app.isLogin()){
      var data = {
        url:'pages/tablefill/tablefill',
        id:options.id
      }
      var origin = app.encodeData(data);
      wx.redirectTo({
        url: '/pages/wxlogin/wxlogin?'+origin
      })
    }else{
        
        allPath = this.route+'?id='+options.id
        this.init(params,allPath)
    }
  },
  async init(params,allpath){
    await api.showLoading() // 显示loading
    var jldetail = await api.getData(api.webapi.jielongdetailbase,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(jldetail,allpath)){
      this.setData({
        jielong: jldetail.data,
        cylist: jldetail.data.statisticsList,
        itemlist:jldetail.data.config.key2.itemList,
        isloading:false,
        isparticipate:jldetail.data.participate,
        totalnum: jldetail.data.total,
        state: jldetail.data.state,
        content: jldetail.data.content.replace(/ /g, "&nbsp;")
      })
    }
  },
  
  cyTable: function (e) {

    var originData = this.data.itemlist;
    var formData = [];
    console.log(originData);
    
    for (let i in e.detail.value) {
      formData.push(e.detail.value[i]); //属性
    }
    console.log(formData);
    // 处理外部表单提交的值
    function chuli(element, index, array){
      element.value = (typeof formData[index] == 'object') ? formData[index].join("-") : formData[index];
      if(element.options){
        element.options = chulioptions(element.options,formData[index])
      }
    }
    // 处理内部options的值一遍一一对应
    function chulioptions(optionsList,formList){
      for(let i=0;i<optionsList.length;i++){
        for(let j = 0; j<formList.length; j++){
          if (optionsList[i].value == formList[j]){
            optionsList[i].checked = true
          }
        }
      }
      return optionsList
    }
    
    /**
     * 检测必填项是否为空
     */
    function checkMustfill(obj){
      for(let i = 0; i<obj.length; i++){
        if (obj[i].value == '' && obj[i].mustFill == true){
          return true
        }
      }
    }
    originData.forEach(chuli);
    console.log(originData);
    /**
     * 提交数据
     */
    const tijiao = async(res,nowthis)=>{
      var that = nowthis;
      console.log(that);
      console.log(nowthis);
      console.log(res);
      if (res.confirm) {
        console.log('用户点击确定');
        var params = {
          type: "2",
          solitaireId: that.data.jielong.id,
          config: {
            key2: {
              description: "信息采集",
              itemList: originData
            },
          }
        }
        
        await api.showLoading() // 显示loading
        const jg = await api.postData(api.webapi.jielongcy,params);
        await api.hideLoading();
        if(api.reshook(jg,allPath)){
          that.jlcySuccess(jg);
        }
        
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }

    if(checkMustfill(originData)){
      //数据非空验证
      wx.showToast({
        title: '必填项不可为空',
        duration: 2000,
        icon: 'none'
      })

    }else{
      var that = this;
      if(that.data.isparticipate == true){
        wx.showModal({
          title: '提示',
          content: '您已经提交过了，还要再次提交吗?',
          success(res) {
            tijiao(res,that)
          }
        }) 
      }else{
        wx.showModal({
          title: '提示',
          content: '您确定要提交吗?',
          success(res) {
            tijiao(res,that)
          }
        }) 
      }
      
    }
  },
  jlcySuccess: function (res) {
    
    var that = this;
      wx.showToast({
        title: '提交成功',
        duration:1000,
        success:function(){
          setTimeout(function(){
            that.resultShow(1)
          },1000)
        }
      });
  },
  resultShow:function(successcall){
    if(successcall == 1){
      if(this.data.isparticipate == false){
        this.setData({
          totalnum:this.data.totalnum+1,
          isparticipate:true
        })
      }
    }
    var params = {
      id: this.data.id,
      title:this.data.jielong.title
    };
    wx.navigateTo({
      url: '/pages/tableshow/tableshow?id=' + this.data.id + '&title=' + this.data.jielong.title + '&totalnum=' + this.data.totalnum + '&allVisible=' + this.data.jielong.allVisible,
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
    //this.onLoad(_options)
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
    var jielongImg = '../../img/jielong3.jpg';
    var jielongpath = 'pages/tablefill/tablefill?id=' + this.data.id;
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