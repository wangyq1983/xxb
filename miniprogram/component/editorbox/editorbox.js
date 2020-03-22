// component/lessonItem/lessonItem.js
var app = getApp();
const api = app.globalData.api;
var that;
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    eid: {
      // 接龙id
      type: 'string',
      value: ""
    },
    type: {
      type: 'string',
      value: ""
    },
    listLength:{
      type: 'number',
      observer: function (newVal, oldVal) {
        this.updatesize()		//这里通过this.updatesize()方法来更新数据,来解决异步传值问题
      }
    },
    isedit:{
      type: 'Boolean',
      observer: function (newVal, oldVal) {
        this.updateisedit()		//这里通过this.updateisedit()方法来更新数据,来解决异步传值问题
      }
    }
  },
  data: {
   id:'',
   type:'',
   listLength:0,
   isedit:false
  },
  ready() {
    console.log(this.properties);
    this.setData({
      id: this.properties.eid,
      type: this.properties.type
    })
  },
  methods: {
    // 拷贝接龙
    copyjielong:function(){
      
        if (this.properties.type == 1) {
          //接龙
          wx.navigateTo({
            url: '/pages/jielong/jielong?id=' + this.data.id + '&type=copy',
          })
        }
        if (this.properties.type == 2) {
          //填表
          wx.navigateTo({
            url: '/pages/table/table?id=' + this.data.id + '&type=copy',
          })
        }
        if (this.properties.type == 3) {
          //填表
          wx.navigateTo({
            url: '/pages/toupiao/toupiao?id=' + this.data.id + '&type=copy',
          })
        }
    },
    /**
     * 编辑接龙
     */
    editjielong: function () {
      console.log(this.data.listLength)
      if (this.data.listLength == 0) {
        //保证接龙记录数据为空才能操作
        if (this.properties.type == 1) {
          //接龙
          wx.navigateTo({
            url: '/pages/jielong/jielong?id=' + this.data.id + '&type=edit',
          })
        }
        if (this.properties.type == 2) {
          //填表
          wx.navigateTo({
            url: '/pages/table/table?id=' + this.data.id + '&type=edit',
          })
        }
        if (this.properties.type == 3) {
          //填表
          wx.navigateTo({
            url: '/pages/toupiao/toupiao?id=' + this.data.id + '&type=edit',
          })
        }
      } else {
        wx.showToast({
          title: '已有接龙数据不可变更操作',
          icon:'none',
          duration: 2000
        })
      }
      
    },
    /**
     * 删除接龙
     */
    deletejielong: function () {
      that = this;
      wx.showModal({
        title: '提示',
        content: '确定删除吗',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            var params = {
              id: that.data.id
            }
            // util.doRequestP(util.webapi.jielongdelete, params, that.deleteSuccess);
            that.jldelete(params)


          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    async jldelete(params){
      await api.showLoading() // 显示loading
      var jldelres = await api.postData(api.webapi.jielongdelete,params);
      await api.hideLoading() // 等待请求数据成功后，隐藏loading
      if(api.reshook(jldelres,'pages/fabu/fabu')){
        this.deleteSuccess()
      }
    },
    /**
     * 导出表格
     */
    exporttable: function () {
      wx.navigateTo({
        url: '/pages/tableexport/tableexport?solitaireId=' + this.properties.eid,
      })
    },
    
    deleteSuccess: function () {
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 1000,
        success:function(){
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/fabu/fabu',
            })
          },1000)
        }
      })
    },
    editSuccess: function (res) {
      console.log(res)
      wx.navigateBack({
        delta: 1
      })
    },

    updatesize:function(){
      this.setData({
        listLength: this.properties.listLength
      });
      console.log(this.data.listLength)
    },
    updateisedit:function(){
      this.setData({
        isedit: this.properties.isedit
      });
      console.log(this.data.isedit)
    }
  }
})