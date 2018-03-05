Page({
  data: {
    winHeight:300,
    markers: [{
      iconPath: "/img/marker.png",
      id: 0,
      latitude: 22.6404300000,
      longitude: 113.8333500000,
      width: 50,
      height: 50
    }],
    // polyline: [{
    //   points: [{
    //     longitude: 113.8333500000,
    //     latitude: 22.6404300000
    //   }, {
    //     longitude: 113.324520,
    //     latitude: 23.21229
    //   }],
    //   color: "#FF0000DD",
    //   width: 2,
    //   dottedLine: false
    // }],
    // controls: [{
    //   id: 1,
    //   iconPath: '/img/email.png',
    //   position: {
    //     left: 0,
    //     top: 300 - 50,
    //     width: 50,
    //     height: 50
    //   },
    //   clickable: true
    // }]
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.setData({
      winHeight: parseInt(wx.getSystemInfoSync().windowHeight)
    });
  }
})