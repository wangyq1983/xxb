// pages/tableadd/tableadd.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['单行文本', '单选','多行文本',  '多选'],
    type:['input','radio','textarea','checkbox'],
    index:0,
    isfillin:false,
    selectShow:false,
    selectOption:[
      '',''
    ],
    selectIndex:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
    editable:false, //编辑选项
    idx:'',
    itemParams:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.index && options.params){
      var optionsparams = JSON.parse(options.params)
      this.setData({
        editable:true,
        idx:options.index,
        isfillin: optionsparams.mustFill,
        itemParams: optionsparams
      })
      if (optionsparams.itemType == 'input') {
        this.setData({
          index: 0,
          selectShow: false,
        })
      }
      if (optionsparams.itemType == 'radio') {
        this.setData({
          index: 1,
          selectShow: true,
          selectOption:optionsparams.options
        })
      }
      if (optionsparams.itemType == 'textarea') {
        this.setData({
          index: 2,
          selectShow: false,
        })
      }
      if (optionsparams.itemType == 'checkbox') {
        this.setData({
          index: 3,
          selectShow: true,
          selectOption: optionsparams.options
        })
      }
    }
    console.log(options.index)
    console.log(this.data.itemParams)
  },
  changeIndicatorDots:function(){
    this.setData({
      isfillin:!this.data.isfillin
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    });
    if(e.detail.value == 1 || e.detail.value == 3){
      this.setData({
        selectShow:true
      })
    }else{
      this.setData({
        selectShow:false
      })
    }
  },
  saveoption:function(e){

    // 校验options是否有空选项
    function checkOption(opt) {
      for (var i = 0; i < opt.length; i++) {
        if (opt[i] == '' || opt[i].value == '') {
          return true;
        }
      }
      return false
    };

    var checkok;

    if (this.data.type[this.data.index] == 'input' || this.data.type[this.data.index] == 'textarea'){
      if (e.detail.value.title == '') {
        wx.showToast({
          title: '必填项不可为空',
          icon: 'none',
          duration: 2000
        })
      } else{
        checkok = 1;
      }
      var tableParams = {
        itemType: this.data.type[this.data.index],
        itemName: e.detail.value.title,
        value: e.detail.value.title,
        description: e.detail.value.shuoming,
        mustFill: e.detail.value.mustfill
      }
    } else if (this.data.type[this.data.index] == 'radio' || this.data.type[this.data.index] == 'checkbox'){
      
      var optionList = []
      for(var name in e.detail.value){
        console.log(name+':'+e.detail.value[name]);
        console.log(typeof name);
        if(name.indexOf('option') != -1){
          let optionpair = {
            title: e.detail.value[name],
            value: e.detail.value[name]
          }
          optionList.push(optionpair)
        }
      }
      
      
      
      var tableParams = {
        itemType: this.data.type[this.data.index],
        itemName: e.detail.value.title,
        value: e.detail.value.title,
        description: e.detail.value.shuoming,
        mustFill: e.detail.value.mustfill,
        options: optionList
      }

      if (e.detail.value.title == '' || checkOption(optionList)) {
        wx.showToast({
          title: '必填项不可为空',
          icon: 'none',
          duration: 2000
        })
      }else{
        checkok = 1;
      }
    }
    
    if (checkok ==1) {
      // 实现携带参数返回上一层开始
      let pages = getCurrentPages(); //获取当前页面js里面的pages里的所有信息。
      let prevPage = pages[pages.length - 2];
      //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
      console.log(prevPage.data.paramsList);
      if (this.data.editable) {
        prevPage.data.paramsList.splice(this.data.idx, 1, tableParams)
        prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
          paramsList: prevPage.data.paramsList
        })
      } else {
        prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
          paramsList: prevPage.data.paramsList.concat(tableParams)
        })
      }
      // 实现携带参数返回上一层结束
      wx.navigateBack({
        delta: 1
      })
    } 
    
  },
  i_name:function(res){
    // 选项输入内容触发
    // 选项序号
    console.log(res.currentTarget.id.split('_')[1]);
    var idx = res.currentTarget.id.split('_')[1];
    console.log(res.detail.value)
    var tempoption = this.data.selectOption;
    var newdata = {
      title:res.detail.value,
      value:res.detail.value,
      checked:false,
      count:0
    }
    tempoption.splice(idx, 1, newdata);
  },
  addoption:function(e){
    console.log(e);
    var newadd = ['']
    this.setData({
      selectOption: this.data.selectOption.concat(newadd)
    })
  },
  jianevent: function (e) {
    if (this.data.selectOption.length > 2) {
      var idx = e.currentTarget.dataset.idx;
      var tempselece = this.data.selectOption;
      var that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除此项吗？',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定');
            tempselece.splice(idx, 1)
            that.setData({
              selectOption: tempselece
            })
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
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