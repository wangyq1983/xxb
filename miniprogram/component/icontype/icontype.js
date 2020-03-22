Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    
    type: {
      type: 'string',
      value: ""
    }
  },
  data: {
   type:''
  },
  ready() {
    // console.log(this.properties);
    this.setData({
      type: this.properties.type
    })
  },
  methods: {
    
  }
})