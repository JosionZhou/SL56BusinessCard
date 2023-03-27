// pages/mycard/choose-card-type/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type:1,
    bgType:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let main=this;
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('editCardType', function (data) {
      console.log(data);
      let bgType=0;
      if(data.bgImage.indexOf("cardbg1")!=-1){
        bgType=1;
      }
      if(data.bgImage.indexOf("cardbg2")!=-1){
        bgType=2;
      }
      main.setData({
        type:data.type,
        bgType:bgType
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  changeType(e){
    console.log(e);
    let type = e.currentTarget.dataset.type;
    this.setData({
      type:type
    });
    if(type==2){
      this.setData({
        bgType:0
      });
    }
  },
  changeBg(e){
    console.log(e);
    let bgType = e.currentTarget.dataset.type;
    this.setData({
      bgType: parseInt(bgType)
    });
  },
  apply(){
    let channel = this.getOpenerEventChannel();
    let backgroundImg="cardbg"+this.data.bgType;
    channel.emit("apply",{type:this.data.type,bgImage:backgroundImg});
    wx.navigateBack();
  }
})