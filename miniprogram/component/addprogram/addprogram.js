// component/addprogram/addprogram.js
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定

    stateAdd: {
      type: 'Boolean',
      value: false
    }
  },
  data: {
    stateAdd: false
  },
  ready() {
    this.setData({
      stateAdd: this.properties.stateAdd
    })
  },
  methods: {
    closeadd:function(){
      this.setData({
        stateAdd:false
      });
      wx.setStorage({
        key: "isAdd",
        data: true
      })
    }
    
  }
})