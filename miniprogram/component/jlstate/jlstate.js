Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定

    stateCode: {
      // stateCode 值 0：未发布，1：发布，2：接龙结束,3:过期，4 未到开始时间
      type: 'number',
      observer: function (newVal, oldVal) {
        this.updateRate()		//这里通过this.updateRate()方法来更新数据,来解决异步传值问题
      }
    }
  },
  data: {
    stateCode: ""
  },
  ready() {
    
  },

  methods: {
    updateRate(){
      console.log(this.properties);
      this.setData({
        stateCode: this.properties.stateCode
      });
      if(this.data.stateCode == 2){
        this.setData({
          stateTxt:'接龙已结束'
        })
      }
      if (this.data.stateCode == 3) {
        this.setData({
          stateTxt: '接龙已过期'
        })
      }
    }
  }
})