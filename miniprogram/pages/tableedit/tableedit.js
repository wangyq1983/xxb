// pages/tableedit/tableedit.js
const app = getApp();
const api = app.globalData.api;
var allPath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    solitaireId:'',
    id:'',
    paramsList:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    console.log(JSON.parse(decodeURIComponent(options.value)))
    this.setData({
      solitaireId: options.solitaireId,
      id:options.id,
      paramsList:JSON.parse(decodeURIComponent(options.value))
    })
  },
  async cyjledit(params){
    await api.showLoading() // 显示loading
    var editres = await api.postData(api.webapi.jielongcyedit,params);
    await api.hideLoading() // 等待请求数据成功后，隐藏loading
    if(api.reshook(editres,this.route)){
      this.jlcySuccess()
    }
  },
  creatJieLong:function(e){
    console.log(e.detail.value);

    var originData = this.data.paramsList;
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
    if(checkMustfill(originData)){
      //数据非空验证
      wx.showToast({
        title: '必填项不可为空',
        duration: 2000,
        icon: 'none'
      })
    }else{
      var that = this;
      wx.showModal({
        title: '提示',
        content: '您确定要提交吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var params = {
              type: "2",
              solitaireId: that.data.solitaireId,
              id:that.data.id,
              config: {
                key2: {
                  description: "信息采集",
                  itemList: originData
                },
              }
            }
            that.cyjledit(params)
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      }) 
    }
  },
  jlcySuccess:function(){
    wx.showToast({
      title: '更改成功',
      duration: 1000,
      icon: 'none'
    })
    setTimeout(()=>{
      wx.navigateBack({
        delta: 1
      })
    },1000)
    
    
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